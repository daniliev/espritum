-- ==========================================================================
--  Espritum — schema + policies Supabase
--  À exécuter dans Supabase Studio → SQL Editor.
--  Ce script est IDEMPOTENT : tu peux le rejouer sans casser l'existant.
-- ==========================================================================

-- --------------------------------------------------------------------------
-- 1) Tables
-- --------------------------------------------------------------------------

-- Profils utilisateurs (complément de auth.users)
create table if not exists public.users (
  id                   uuid primary key references auth.users(id) on delete cascade,
  email                text,
  prenom               text,
  nom                  text,
  genre                text check (genre in ('homme', 'femme')),
  objectif             text check (objectif in ('perte_gras','prise_masse','endurance','reequilibrage')),
  plan                 text not null default 'gratuit' check (plan in ('gratuit','guerrier','champion','elite')),
  poids                numeric,
  poids_cible          numeric,
  taille               numeric,
  masse_grasse         numeric,
  calories_objectif    integer,
  proteines_objectif   integer,
  glucides_objectif    integer,
  lipides_objectif     integer,
  streak               integer not null default 0,
  is_admin             boolean not null default false,
  stripe_customer_id   text,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

-- Abonnements (synchronisés depuis Stripe par le webhook)
create table if not exists public.subscriptions (
  id                      uuid primary key default gen_random_uuid(),
  user_id                 uuid not null references public.users(id) on delete cascade,
  stripe_subscription_id  text unique,
  stripe_customer_id      text,
  plan                    text not null,
  statut                  text not null,
  montant                 numeric,
  debut                   timestamptz,
  prochain_paiement       timestamptz,
  cancel_at_period_end    boolean not null default false,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index if not exists idx_subscriptions_user_id on public.subscriptions(user_id);
create index if not exists idx_subscriptions_stripe_id on public.subscriptions(stripe_subscription_id);

-- Repas
create table if not exists public.meals (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  date        date not null,
  type_repas  text,
  nom         text not null,
  quantite    numeric,
  calories    integer,
  proteines   numeric,
  glucides    numeric,
  lipides     numeric,
  created_at  timestamptz not null default now()
);
create index if not exists idx_meals_user_date on public.meals(user_id, date);

-- Séances d'entraînement
create table if not exists public.workouts (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users(id) on delete cascade,
  date            date not null,
  muscle_cible    text,
  exercice        text,
  series          integer,
  repetitions     integer,
  poids           numeric,
  duree_minutes   integer,
  termine         boolean not null default false,
  notes           text,
  created_at      timestamptz not null default now()
);
create index if not exists idx_workouts_user_date on public.workouts(user_id, date);

-- Config du site (utilisée par site-config.js)
create table if not exists public.site_config (
  id      text primary key,
  value   text
);

-- --------------------------------------------------------------------------
-- 2) Trigger : créer automatiquement un profil public.users à chaque
--    inscription dans auth.users. Fin des races conditions côté client.
-- --------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, prenom, plan)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'prenom', new.raw_user_meta_data->>'full_name', 'Guerrier'),
    'gratuit'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Trigger updated_at automatique
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists users_set_updated_at on public.users;
create trigger users_set_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

drop trigger if exists subs_set_updated_at on public.subscriptions;
create trigger subs_set_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- --------------------------------------------------------------------------
-- 3) Row Level Security (RLS)
--    Chaque utilisateur ne voit QUE ses propres données.
--    Les Edge Functions utilisent la service_role_key → bypassent RLS.
-- --------------------------------------------------------------------------

alter table public.users          enable row level security;
alter table public.subscriptions  enable row level security;
alter table public.meals          enable row level security;
alter table public.workouts       enable row level security;
alter table public.site_config    enable row level security;

-- users : lecture/update de SA ligne uniquement.
-- Pas de policy INSERT : le trigger handle_new_user s'en charge.
drop policy if exists "users_select_own" on public.users;
create policy "users_select_own" on public.users
  for select using (auth.uid() = id);

drop policy if exists "users_update_own" on public.users;
create policy "users_update_own" on public.users
  for update using (auth.uid() = id)
  with check (
    auth.uid() = id
    -- L'utilisateur ne peut PAS se donner is_admin ni changer son plan lui-même.
    -- (le plan est modifié par le webhook Stripe via service_role)
    and is_admin = (select is_admin from public.users where id = auth.uid())
    and plan     = (select plan     from public.users where id = auth.uid())
  );

-- Variante plus simple si tu préfères laisser le client modifier `plan`
-- en attendant que le webhook soit déployé :
--   create policy "users_update_own" on public.users
--     for update using (auth.uid() = id) with check (auth.uid() = id);

-- subscriptions : lecture de ses propres abos.
-- Insert/update réservés au webhook (service_role, bypass RLS).
drop policy if exists "subs_select_own" on public.subscriptions;
create policy "subs_select_own" on public.subscriptions
  for select using (auth.uid() = user_id);

-- meals : CRUD sur ses propres repas
drop policy if exists "meals_select_own" on public.meals;
create policy "meals_select_own" on public.meals for select using (auth.uid() = user_id);

drop policy if exists "meals_insert_own" on public.meals;
create policy "meals_insert_own" on public.meals for insert with check (auth.uid() = user_id);

drop policy if exists "meals_update_own" on public.meals;
create policy "meals_update_own" on public.meals for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "meals_delete_own" on public.meals;
create policy "meals_delete_own" on public.meals for delete using (auth.uid() = user_id);

-- workouts : idem meals
drop policy if exists "workouts_select_own" on public.workouts;
create policy "workouts_select_own" on public.workouts for select using (auth.uid() = user_id);

drop policy if exists "workouts_insert_own" on public.workouts;
create policy "workouts_insert_own" on public.workouts for insert with check (auth.uid() = user_id);

drop policy if exists "workouts_update_own" on public.workouts;
create policy "workouts_update_own" on public.workouts for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "workouts_delete_own" on public.workouts;
create policy "workouts_delete_own" on public.workouts for delete using (auth.uid() = user_id);

-- site_config : lecture publique (anon + authenticated), pas d'écriture côté client
drop policy if exists "site_config_read" on public.site_config;
create policy "site_config_read" on public.site_config for select using (true);

-- --------------------------------------------------------------------------
-- 4) (Optionnel) Admin : si tu veux qu'un user marqué is_admin puisse
--    voir TOUTES les données depuis admin.html, décommente les policies
--    ci-dessous. Attention : ça donne lecture complète, à utiliser en
--    connaissance de cause.
-- --------------------------------------------------------------------------

-- create policy "admin_read_all_users" on public.users for select
--   using ((select is_admin from public.users where id = auth.uid()));
--
-- create policy "admin_read_all_subs" on public.subscriptions for select
--   using ((select is_admin from public.users where id = auth.uid()));

-- --------------------------------------------------------------------------
-- 5) Seed minimal pour site_config (optionnel)
-- --------------------------------------------------------------------------

insert into public.site_config (id, value) values
  ('text_app_name', 'Espritum')
on conflict (id) do nothing;

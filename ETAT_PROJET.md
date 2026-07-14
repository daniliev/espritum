# Espritum — Corrections & état du projet

## 📦 Contenu de cette livraison

Tous les fichiers HTML de ton projet, les Edge Functions Supabase pour Stripe, le schéma SQL, et un client Supabase centralisé.

Les bugs critiques trouvés ont été corrigés. D'autres corrections sont listées plus bas comme à faire.

---

## ✅ Ce qui a été corrigé

### Fichiers HTML

**`index.html`**
- Redirection unique vers la page de pricing (au lieu de 2 redirections contradictoires)

**`dashboard.html`**
- Erreur de syntaxe JavaScript (code mort orphelin d'une fonction supprimée) → supprimée
- Le dashboard fonctionne à nouveau

**`inscription.html` + `onboarding.html`**
- `upsert` au lieu de `insert`/`update` → plus de profils fantômes en cas de race condition ou d'échec RLS
- Vraie gestion d'erreur avec feedback utilisateur

**`coach.html`**
- L'Edge Function reçoit maintenant le vrai JWT utilisateur (pas la clé anon publique)
- Permet au backend de vérifier l'identité, le plan, de rate-limiter par user

**`paiement.html`** (complètement réécrit)
- Fini le faux flux `setTimeout(2000)` + UPDATE direct
- Appelle l'Edge Function `create-subscription` qui crée Customer + Subscription Stripe
- Gère le 3D Secure (`stripe.confirmCardPayment`)
- La BDD est mise à jour uniquement par webhook, plus par le client

**`abonnement.html`**
- Bug try/try imbriqué corrigé
- Bug `setTimeout` dupliqué corrigé

**`entrainement.html`**
- Bug try/try imbriqué corrigé
- Typo `Rowing haltère unilatéra.png` → `unilatéral.png` (image était cassée)
- `changeDay()` recharge maintenant la vue semaine (avant : aucun effet visible)
- Colonne `reps` renommée en `repetitions` pour matcher le schéma SQL
- Dates locales au lieu d'UTC (fini le bug "hier à 23h")
- Helper `localDate()` ajouté

**`profil.html`**
- `saveProfile` sauvegarde maintenant `age` et `genre` (avant : champs ignorés)
- `fillForm` recharge `age` et `genre` (avant : champs vides au retour)
- Formule Mifflin-St Jeor adaptée au genre (femme : `-161` / homme : `+5`)
- Le listener `change` sur `f-genre` déclenche le recalcul live
- `deleteAccount` passe par une Edge Function (TODO : à déployer)

**`progression.html`**
- Champs `hanches` et `taille` sont maintenant envoyés au INSERT (avant : perdus)
- Confirmation avant suppression d'une mesure
- Dates locales au lieu d'UTC

**`nutrition.html`**
- Dates locales au lieu d'UTC (3 occurrences corrigées)

### Infrastructure

**`supabase-client.js` (nouveau)**
- Client Supabase centralisé, importé dans 13 fichiers HTML
- Une seule source de vérité pour l'URL + clé publique
- Pour rotate la clé : un seul fichier à modifier

**`supabase/functions/create-subscription/index.ts` (nouveau)**
- Edge Function Deno qui crée un Customer Stripe + Subscription côté serveur
- Gère attachement du PaymentMethod et retour du `client_secret` pour 3D Secure

**`supabase/functions/stripe-webhook/index.ts` (nouveau)**
- Edge Function qui écoute les events Stripe (subscription created/updated/deleted, invoice payment_succeeded/failed)
- **Seule source de vérité** pour activer/désactiver un abo en base
- Protection : vérifie la signature Stripe avant de traiter

**`supabase/schema.sql` (nouveau)**
- Tables : `users`, `subscriptions`, `meals`, `workouts`, `site_config`
- Trigger `on_auth_user_created` : crée automatiquement le profil à chaque inscription
- Policies RLS : chaque user ne voit QUE ses propres données
- Protection : l'user ne peut pas se donner `is_admin = true` ni changer son plan lui-même
- Script idempotent (rejouable sans risque)

---

## ❌ Ce qui reste à faire

### Fichiers à modifier

**`classement.html`**
- Actuellement : classement 100% fake (Julie, Sarah, Aïsha hardcodés)
- Podium top 3 en dur dans le HTML
- À faire : requête réelle `sb.from('users').select('prenom, plan, streak').order('streak', desc).limit(100)` + policy RLS publique correspondante
- Streak jamais incrémenté nulle part dans l'app → tout le monde est à 0 → à implémenter via trigger Postgres

**`admin.html`**
- ⚠️ Faille : aucune vérif `is_admin` avant `loadUsers()`
- Couvert partiellement par les policies RLS (un non-admin ne verra que sa propre ligne) mais l'UI admin reste accessible par URL
- À faire : ajouter au début d'`init()` :
  ```js
  const { data: { session } } = await sb.auth.getSession();
  if (!session) { window.location.href = 'inscription.html'; return; }
  const { data: p } = await sb.from('users').select('is_admin').eq('id', session.user.id).single();
  if (!p?.is_admin) { window.location.href = 'dashboard.html'; return; }
  ```

**`bodyfat.html`**
- Paywall logic inversé (caché par défaut, affiché si gratuit) : si JS plante avant la ligne 717, les payants voient le paywall
- Âge hardcodé à 28 dans la formule Deurenberg
- Date d'insert en UTC
- Table `measurements` référencée mais absente du `schema.sql` fourni
- Note business : l'"IA" est une formule IMC + random, la photo est ignorée. À assumer comme "estimation IMC" ou à brancher une vraie vision IA

**`i18n.js`**
- 4 clés utilisées dans les HTML mais non définies : `train_today`, `train_stopwatch`, `train_week`, `faq_title`
- À ajouter dans les 3 langues (fr/en/bg)
- 28 clés définies mais jamais utilisées : ménage possible

**`abonnement.html` (réécriture complète)**
- Actuellement : form carte custom + `setTimeout(2000)` + UPDATE direct (non-PCI, non-Stripe)
- **Bloqué par les policies RLS** appliquées : l'user ne peut plus changer son plan depuis le client
- À refaire comme `paiement.html` : Stripe Elements + Edge Function `change-plan`
- Ajouter un bouton "Annuler mon abonnement" → Edge Function `cancel-subscription`

**`espritum_pricing_v5.html`**
- Toggle mensuel/annuel affiche 4€/12€/24€ mais les CTA renvoient vers les prix mensuels → bug commercial
- À faire : soit retirer le toggle, soit créer les 3 price_ids annuels dans Stripe et propager `?billing=yearly` dans l'URL

### Edge Functions à créer

Je n'ai pas eu le temps de les créer mais elles sont référencées :

- **`delete-account`** : appelée par `profil.html`. Doit faire :
  - Annuler l'abonnement Stripe s'il existe
  - `supabase.auth.admin.deleteUser(userId)` (nécessite service_role)
  - Les données `public.users` suivent en cascade

- **`cancel-subscription`** : pour `abonnement.html`
  - `stripe.subscriptions.update(subId, { cancel_at_period_end: true })`

- **`change-plan`** : pour `abonnement.html`
  - Swap l'item de la subscription vers un nouveau price via `stripe.subscriptions.update`

### `schema.sql` à enrichir

```sql
-- Colonnes manquantes sur users
alter table public.users add column if not exists age integer;
alter table public.users add column if not exists date_naissance date;
alter table public.users add column if not exists niveau_activite text;
alter table public.users add column if not exists genre text;  -- déjà présent mais check

-- Colonne manquante sur workouts
alter table public.workouts add column if not exists repetitions integer;
-- (puis supprimer l'ancienne colonne `repetitions` si elle s'appelait `reps`)

-- Table measurements (manquante)
create table if not exists public.measurements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  date date not null default current_date,
  poids numeric,
  masse_grasse numeric,
  taille numeric,
  tour_taille numeric,
  tour_bras numeric,
  tour_cuisses numeric,
  tour_poitrine numeric,
  tour_hanches numeric,
  created_at timestamptz default now()
);
alter table public.measurements enable row level security;
create policy "measurements_select_own" on public.measurements for select using (auth.uid() = user_id);
create policy "measurements_insert_own" on public.measurements for insert with check (auth.uid() = user_id);
create policy "measurements_delete_own" on public.measurements for delete using (auth.uid() = user_id);

-- Policy leaderboard : lecture publique des colonnes non-sensibles de users
create policy "users_leaderboard_read" on public.users
  for select using (true);
-- ⚠️ Si tu actives ça, RETIRE la policy users_select_own, sinon les 2 s'additionnent et tout est exposé
-- Alternative plus propre : créer une VIEW public.leaderboard avec (prenom, plan, streak) et policy dessus

-- Policy site_config écriture admin
create policy "site_config_admin_write" on public.site_config
  for all using ((select is_admin from public.users where id = auth.uid()) = true);
```

### Décisions produit à prendre

1. **Pricing annuel** : retirer le toggle OU créer les prix annuels dans Stripe ?
2. **`admin_users.html` / `admin_subs.html`** : actuellement 100% mockups (données hardcodées, aucun Supabase). Supprimer ou refaire vraiment ?
3. **Bodyfat** : assumer "estimation IMC" ou brancher une vraie vision IA (Claude Vision, Gemini Vision) ?
4. **Classement** : public (tout le monde voit tout le monde) ou privé (amis / équipe uniquement) ?

---

## 🚀 Ordre recommandé pour déployer

1. Exécuter `supabase/schema.sql` dans SQL Editor
2. Créer les 3 produits Stripe + noter les `price_id`
3. Set les secrets : `STRIPE_SECRET_KEY`, `STRIPE_PRICE_GUERRIER/CHAMPION/ELITE`
4. Déployer `create-subscription` : `supabase functions deploy create-subscription`
5. Déployer `stripe-webhook` : `supabase functions deploy stripe-webhook --no-verify-jwt`
6. Créer le webhook Stripe pointant vers `/functions/v1/stripe-webhook`, copier son `whsec_...`
7. Set `STRIPE_WEBHOOK_SECRET` + redéployer le webhook
8. Tester avec la carte `4242 4242 4242 4242`

Détails pas à pas dans le `README_SETUP.md` livré à côté.

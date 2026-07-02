-- ══════════════════════════════════════════════════════════════
-- ESPRITUM — Pack de corrections (à lancer dans Supabase SQL Editor)
-- Corrige les blockers de l'audit. Idempotent (relançable sans risque).
-- ══════════════════════════════════════════════════════════════

-- ── 1. Autoriser le plan 'premium' (bloquait paiement + admin) ──
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_plan_check;
ALTER TABLE public.users
  ADD CONSTRAINT users_plan_check
  CHECK (plan IN ('gratuit','premium','guerrier','champion','elite'));

-- ── 2. Colonnes manquantes sur users ──
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS semaine_programme integer NOT NULL DEFAULT 1;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS goal_weeks integer NOT NULL DEFAULT 13;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS progress_photos jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS dream_body_url text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS stripe_customer_id text;

-- ── 3. Table measurements (suivi corporel — dashboard/progression/bodyfat) ──
CREATE TABLE IF NOT EXISTS public.measurements (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date           date NOT NULL DEFAULT current_date,
  poids          numeric,
  masse_grasse   numeric,
  taille         numeric,
  tour_taille    numeric,
  tour_bras      numeric,
  tour_cuisses   numeric,
  tour_poitrine  numeric,
  tour_hanches   numeric,
  created_at     timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_measurements_user_date ON public.measurements(user_id, date);

ALTER TABLE public.measurements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "measurements_select_own" ON public.measurements;
CREATE POLICY "measurements_select_own" ON public.measurements
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "measurements_insert_own" ON public.measurements;
CREATE POLICY "measurements_insert_own" ON public.measurements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "measurements_update_own" ON public.measurements;
CREATE POLICY "measurements_update_own" ON public.measurements
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "measurements_delete_own" ON public.measurements;
CREATE POLICY "measurements_delete_own" ON public.measurements
  FOR DELETE USING (auth.uid() = user_id);

-- ✅ Terminé. Résultat attendu : "Success. No rows returned"

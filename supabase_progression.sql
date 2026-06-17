-- ── Espritum — Progression hebdomadaire (photos par semaine) ──
-- À exécuter dans : Supabase Dashboard → SQL Editor → Run

-- Stockage des photos de progression : { "1": url, "2": url, ... } (clé = numéro de semaine)
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS progress_photos jsonb NOT NULL DEFAULT '{}'::jsonb;

-- Nombre total de semaines de l'objectif (2 sem=2, 1 mois=4, 3 mois=13, 6 mois=26, 1 an=52…)
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS goal_weeks integer NOT NULL DEFAULT 13;

-- Photo "corps de rêve" (objectif) — affichée en permanence sur le dashboard
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS dream_body_url text;

-- Les photos vont dans le bucket Storage "instant-photos" (déjà utilisé par l'app).
-- Si le bucket n'existe pas : Supabase → Storage → New bucket → nom "instant-photos" → Public.

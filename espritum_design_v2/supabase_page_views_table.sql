-- ── Espritum — Table page_views (suivi des visites) ──
-- À exécuter dans : Supabase Dashboard → SQL Editor → "New query" → Run

CREATE TABLE IF NOT EXISTS public.page_views (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  path        TEXT,
  referrer    TEXT,
  visitor_id  TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_page_views_created ON public.page_views (created_at);

-- Row Level Security : écriture anonyme autorisée (tracking public),
-- lecture réservée au service_role (admin via /api/admin-data).
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pv_anon_insert" ON public.page_views;
CREATE POLICY "pv_anon_insert"
  ON public.page_views FOR INSERT
  TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "pv_block_anon_select" ON public.page_views;
CREATE POLICY "pv_block_anon_select"
  ON public.page_views FOR SELECT
  TO anon
  USING (false);

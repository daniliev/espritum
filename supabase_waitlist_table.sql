-- ── Espritum — Table Waitlist ──
-- À exécuter dans : Supabase Dashboard → SQL Editor

-- Créer la table
CREATE TABLE IF NOT EXISTS waitlist (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  prenom     TEXT        DEFAULT '',
  nom        TEXT        DEFAULT '',
  email      TEXT        NOT NULL UNIQUE,
  telephone  TEXT        DEFAULT '',
  lang       TEXT        DEFAULT 'fr',
  source     TEXT        DEFAULT 'hero',   -- 'hero','nav','free','guerrier','champion','elite','footer'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index email
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist (email);

-- Activer Row Level Security
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Permettre les inserts anonymes (formulaire public)
CREATE POLICY "allow anon insert"
  ON waitlist FOR INSERT
  TO anon
  WITH CHECK (true);

-- Bloquer les lectures publiques (admin seulement via service_role)
CREATE POLICY "block anon select"
  ON waitlist FOR SELECT
  TO anon
  USING (false);

-- ── Si la table existe déjà, ajouter les colonnes manquantes ──
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS prenom    TEXT DEFAULT '';
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS nom       TEXT DEFAULT '';
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS telephone TEXT DEFAULT '';

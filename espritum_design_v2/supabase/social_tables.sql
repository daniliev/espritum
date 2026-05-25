-- ============================================================
-- Espritum — Social Tables Setup
-- Colle ce SQL dans Supabase Studio → SQL Editor et clique RUN
-- ============================================================

-- 1) Table friendships (suivis)
CREATE TABLE IF NOT EXISTS public.friendships (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id  UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "friends_select" ON public.friendships;
CREATE POLICY "friends_select" ON public.friendships FOR SELECT USING (true);

DROP POLICY IF EXISTS "friends_insert" ON public.friendships;
CREATE POLICY "friends_insert" ON public.friendships FOR INSERT WITH CHECK (auth.uid() = follower_id);

DROP POLICY IF EXISTS "friends_delete" ON public.friendships;
CREATE POLICY "friends_delete" ON public.friendships FOR DELETE USING (auth.uid() = follower_id);

-- 2) Table instant_photos (moments/stories)
CREATE TABLE IF NOT EXISTS public.instant_photos (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  photo_url  TEXT NOT NULL,
  caption    TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.instant_photos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "photos_select" ON public.instant_photos;
CREATE POLICY "photos_select" ON public.instant_photos FOR SELECT USING (true);

DROP POLICY IF EXISTS "photos_insert" ON public.instant_photos;
CREATE POLICY "photos_insert" ON public.instant_photos FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "photos_delete" ON public.instant_photos;
CREATE POLICY "photos_delete" ON public.instant_photos FOR DELETE USING (auth.uid() = user_id);

-- 3) Table photo_likes (j'aimes)
CREATE TABLE IF NOT EXISTS public.photo_likes (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  photo_id   UUID REFERENCES public.instant_photos(id) ON DELETE CASCADE NOT NULL,
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(photo_id, user_id)
);
ALTER TABLE public.photo_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "likes_select" ON public.photo_likes;
CREATE POLICY "likes_select" ON public.photo_likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "likes_insert" ON public.photo_likes;
CREATE POLICY "likes_insert" ON public.photo_likes FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "likes_delete" ON public.photo_likes;
CREATE POLICY "likes_delete" ON public.photo_likes FOR DELETE USING (auth.uid() = user_id);

-- 4) Colonnes posts sur la table users
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS post1_url TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS post2_url TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS post3_url TEXT;

-- 5) Policy classement : tous les utilisateurs peuvent voir tous les profils
DROP POLICY IF EXISTS "users_select_all" ON public.users;
CREATE POLICY "users_select_all" ON public.users
  FOR SELECT USING (true);

-- 6) Bucket storage instant-photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('instant-photos', 'instant-photos', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "instant_photos_public_read" ON storage.objects;
CREATE POLICY "instant_photos_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'instant-photos');

DROP POLICY IF EXISTS "instant_photos_auth_insert" ON storage.objects;
CREATE POLICY "instant_photos_auth_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'instant-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "instant_photos_auth_delete" ON storage.objects;
CREATE POLICY "instant_photos_auth_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'instant-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

-- posts bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('posts', 'posts', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "posts_public_read" ON storage.objects;
CREATE POLICY "posts_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'posts');

DROP POLICY IF EXISTS "posts_auth_insert" ON storage.objects;
CREATE POLICY "posts_auth_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'posts' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "posts_auth_update" ON storage.objects;
CREATE POLICY "posts_auth_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'posts' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "posts_auth_delete" ON storage.objects;
CREATE POLICY "posts_auth_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'posts' AND (storage.foldername(name))[1] = auth.uid()::text);

-- 7) Policy users : autoriser chaque utilisateur à modifier son propre profil
--    (inclus le champ `plan` pour que paiement.html puisse mettre à jour le plan)
DROP POLICY IF EXISTS "users_update_own" ON public.users;
CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- 8) Policy users : lecture de tous les profils (pour le classement)
DROP POLICY IF EXISTS "users_select_own" ON public.users;
DROP POLICY IF EXISTS "users_select_all" ON public.users;
CREATE POLICY "users_select_all" ON public.users
  FOR SELECT USING (true);

-- Fin du script. Clique RUN (Ctrl+Enter) !

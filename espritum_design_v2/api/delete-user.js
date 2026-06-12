// ── Espritum — Suppression complète d'un compte (Vercel Serverless) ──
// Supprime le profil (table `users`) ET le compte d'authentification Supabase.
// Nécessite la clé "service_role" (jamais exposée au navigateur).
//
// Variables d'environnement (Vercel → Settings → Environment Variables) :
//   SUPABASE_SERVICE_ROLE_KEY  → Supabase → Project Settings → API → service_role (secret)
//   SUPABASE_URL               → optionnel, sinon fallback ci-dessous

const FALLBACK_URL = 'https://lbxlvrtujzwlcnloheyh.supabase.co';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) return res.status(503).json({ error: 'SUPABASE_SERVICE_ROLE_KEY non configurée sur le serveur' });

  const url = process.env.SUPABASE_URL || FALLBACK_URL;
  const { user_id } = req.body || {};
  if (!user_id) return res.status(400).json({ error: 'user_id requis' });

  const headers = { 'apikey': key, 'Authorization': 'Bearer ' + key };

  try {
    // 1) Supprimer la ligne de profil dans la table `users`
    const delRow = await fetch(url + '/rest/v1/users?id=eq.' + encodeURIComponent(user_id), {
      method: 'DELETE',
      headers: Object.assign({}, headers, { 'Prefer': 'return=minimal' })
    });

    // 2) Supprimer le compte d'authentification (Admin API)
    const delAuth = await fetch(url + '/auth/v1/admin/users/' + encodeURIComponent(user_id), {
      method: 'DELETE',
      headers: headers
    });

    return res.status(200).json({
      ok: true,
      profile_status: delRow.status,
      auth_status: delAuth.status
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

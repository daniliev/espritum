// ── Espritum — Données Admin (Vercel Serverless) ──
// Lit users + waitlist + subscriptions + page_views avec la clé service_role
// (contourne le RLS qui bloque la lecture publique). JAMAIS exposée au navigateur.
//
// Variables d'environnement (Vercel → Settings → Environment Variables) :
//   SUPABASE_SERVICE_ROLE_KEY  → Supabase → Settings → API → service_role (secret)
//   SUPABASE_URL               → optionnel (fallback ci-dessous)
//   ADMIN_API_KEY              → optionnel : si défini, l'admin doit l'envoyer (header x-admin-key)

const FALLBACK_URL = 'https://lbxlvrtujzwlcnloheyh.supabase.co';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-key');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  // Protection optionnelle : si ADMIN_API_KEY est définie, on l'exige
  const guard = process.env.ADMIN_API_KEY;
  if (guard && req.headers['x-admin-key'] !== guard) {
    return res.status(401).json({ error: 'Non autorisé' });
  }

  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) return res.status(503).json({ error: 'SUPABASE_SERVICE_ROLE_KEY non configurée sur le serveur' });

  const url = process.env.SUPABASE_URL || FALLBACK_URL;
  const headers = { 'apikey': key, 'Authorization': 'Bearer ' + key };

  async function read(path) {
    try {
      const r = await fetch(url + '/rest/v1/' + path, { headers });
      if (!r.ok) return { ok: false, status: r.status, rows: [] };
      const rows = await r.json();
      return { ok: true, status: 200, rows: Array.isArray(rows) ? rows : [] };
    } catch (e) {
      return { ok: false, status: 0, rows: [], error: e.message };
    }
  }

  // page_views : 30 derniers jours (la table peut ne pas exister → on renvoie quand même)
  const since = new Date(Date.now() - 30 * 86400000).toISOString();

  const [users, waitlist, subs, pv] = await Promise.all([
    read('users?select=*&order=created_at.desc'),
    read('waitlist?select=*&order=created_at.desc'),
    read('subscriptions?select=*'),
    read('page_views?select=path,referrer,visitor_id,created_at&created_at=gte.' + encodeURIComponent(since) + '&order=created_at.desc&limit=20000')
  ]);

  return res.status(200).json({
    users: users.rows,
    waitlist: waitlist.rows,
    subscriptions: subs.rows,
    pageviews: pv.rows,
    meta: {
      pageviews_ok: pv.ok,          // false si la table page_views n'existe pas encore
      subscriptions_ok: subs.ok
    }
  });
}

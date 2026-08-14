// ── Espritum — Actions Admin (Vercel Serverless) ──
// Modifie un compte avec la clé service_role (contourne le RLS).
// Actions : set-plan (gratuit/premium). La suppression a son propre endpoint (delete-user).

const FALLBACK_URL = 'https://lbxlvrtujzwlcnloheyh.supabase.co';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-key');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const guard = process.env.ADMIN_API_KEY;
  if (guard && req.headers['x-admin-key'] !== guard) {
    return res.status(401).json({ error: 'Non autorisé' });
  }

  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) return res.status(503).json({ error: 'SUPABASE_SERVICE_ROLE_KEY non configurée sur le serveur' });

  const url = process.env.SUPABASE_URL || FALLBACK_URL;
  const headers = { 'apikey': key, 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' };

  const { action, user_id, plan, id } = req.body || {};
  if (!action) return res.status(400).json({ error: 'action requise' });

  try {
    if (action === 'set-plan') {
      if (!user_id) return res.status(400).json({ error: 'user_id requis' });
      const newPlan = plan === 'premium' ? 'premium' : 'gratuit';
      const r = await fetch(url + '/rest/v1/users?id=eq.' + encodeURIComponent(user_id), {
        method: 'PATCH',
        headers: Object.assign({}, headers, { 'Prefer': 'return=minimal' }),
        body: JSON.stringify({ plan: newPlan })
      });
      if (!r.ok) {
        const t = await r.text().catch(() => '');
        return res.status(502).json({ error: 'Maj impossible (' + r.status + ') ' + t });
      }
      return res.status(200).json({ ok: true, plan: newPlan });
    }

    if (action === 'delete-waitlist') {
      if (!id) return res.status(400).json({ error: 'id requis' });
      const r = await fetch(url + '/rest/v1/waitlist?id=eq.' + encodeURIComponent(id), {
        method: 'DELETE',
        headers: Object.assign({}, headers, { 'Prefer': 'return=minimal' })
      });
      if (!r.ok) {
        const t = await r.text().catch(() => '');
        return res.status(502).json({ error: 'Suppression impossible (' + r.status + ') ' + t });
      }
      return res.status(200).json({ ok: true });
    }

    return res.status(400).json({ error: 'Action inconnue : ' + action });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

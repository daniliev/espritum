// ── Espritum — Données Admin (Vercel Serverless) ──
// Lit users + subscriptions + waitlist + page_views (service_role, contourne le RLS)
// et les codes promo Stripe. JAMAIS exposées au navigateur.
//
// Accès réservé à l'admin : le navigateur envoie le jeton Supabase de l'admin
// (Authorization: Bearer <access_token>), vérifié ici, e-mail comparé à ADMIN_EMAIL.
//
// Variables d'env (Vercel → Settings → Environment Variables) :
//   SUPABASE_SERVICE_ROLE_KEY  → Supabase → Settings → API → service_role (secret)
//   STRIPE_SECRET_KEY          → pour lister les codes promo (optionnel)
//   ADMIN_EMAIL                → e-mail du compte admin autorisé (sinon fallback ci-dessous)
//   SUPABASE_URL               → optionnel (fallback ci-dessous)
//   ADMIN_API_KEY              → optionnel : clé alternative (header x-admin-key)

const FALLBACK_URL = 'https://lbxlvrtujzwlcnloheyh.supabase.co';
const FALLBACK_ADMIN_EMAIL = 'd.ilievprojet@gmail.com';

async function isAdmin(req, url, serviceKey) {
  const adminKey = process.env.ADMIN_API_KEY;
  if (adminKey && req.headers['x-admin-key'] === adminKey) return true;
  const auth = req.headers['authorization'] || '';
  const token = auth.replace(/^Bearer\s+/i, '') || req.headers['x-user-token'] || '';
  if (!token) return false;
  try {
    const r = await fetch(url + '/auth/v1/user', { headers: { apikey: serviceKey, Authorization: 'Bearer ' + token } });
    if (!r.ok) return false;
    const u = await r.json();
    const admin = (process.env.ADMIN_EMAIL || FALLBACK_ADMIN_EMAIL).toLowerCase();
    return !!(u && u.email && u.email.toLowerCase() === admin);
  } catch (e) { return false; }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-user-token, x-admin-key');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) return res.status(503).json({ error: 'SUPABASE_SERVICE_ROLE_KEY non configurée sur le serveur' });
  const url = process.env.SUPABASE_URL || FALLBACK_URL;

  if (!(await isAdmin(req, url, key))) return res.status(401).json({ error: 'Accès réservé à l\'administrateur' });

  const headers = { apikey: key, Authorization: 'Bearer ' + key };
  async function read(path) {
    try {
      const r = await fetch(url + '/rest/v1/' + path, { headers });
      if (!r.ok) return { ok: false, status: r.status, rows: [] };
      const rows = await r.json();
      return { ok: true, status: 200, rows: Array.isArray(rows) ? rows : [] };
    } catch (e) { return { ok: false, status: 0, rows: [], error: e.message }; }
  }

  // Codes promo depuis Stripe (coupon développé)
  async function stripePromos() {
    const sk = process.env.STRIPE_SECRET_KEY;
    if (!sk) return { ok: false, rows: [] };
    try {
      const r = await fetch('https://api.stripe.com/v1/promotion_codes?limit=100&expand[]=data.coupon', {
        headers: { Authorization: 'Bearer ' + sk }
      });
      if (!r.ok) return { ok: false, rows: [] };
      const j = await r.json();
      const rows = (j.data || []).filter(p => p.active).map(p => {
        const c = p.coupon || {};
        const off = c.percent_off === 100 ? '1er mois offert' : (c.percent_off != null ? '−' + c.percent_off + ' %' : '—');
        let dur = 'À vie';
        if (c.duration === 'once') dur = '1 mois';
        else if (c.duration === 'repeating') dur = (c.duration_in_months || 1) + ' mois';
        else if (c.duration === 'forever') dur = 'À vie';
        return { id: p.id, code: p.code, off, dur, used: p.times_redeemed || 0, max: p.max_redemptions || 0 };
      });
      return { ok: true, rows };
    } catch (e) { return { ok: false, rows: [] }; }
  }

  const since = new Date(Date.now() - 30 * 86400000).toISOString();
  const [users, waitlist, subs, pv, promos] = await Promise.all([
    read('users?select=*&order=created_at.desc'),
    read('waitlist?select=*&order=created_at.desc'),
    read('subscriptions?select=*'),
    read('page_views?select=path,referrer,visitor_id,created_at&created_at=gte.' + encodeURIComponent(since) + '&order=created_at.desc&limit=20000'),
    stripePromos()
  ]);

  return res.status(200).json({
    users: users.rows,
    waitlist: waitlist.rows,
    subscriptions: subs.rows,
    pageviews: pv.rows,
    promos: promos.rows,
    meta: { pageviews_ok: pv.ok, subscriptions_ok: subs.ok, promos_ok: promos.ok }
  });
}

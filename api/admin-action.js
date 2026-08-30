// ── Espritum — Actions Admin (Vercel Serverless) ──
// Modifie comptes / abonnements / codes promo avec la clé service_role (contourne le RLS)
// et l'API Stripe (clé secrète serveur uniquement). JAMAIS exposées au navigateur.
//
// Accès réservé à l'admin : le navigateur envoie le jeton Supabase de l'admin
// (Authorization: Bearer <access_token>), vérifié ici, e-mail comparé à ADMIN_EMAIL.
//
// Variables d'env (Vercel → Settings → Environment Variables) :
//   SUPABASE_SERVICE_ROLE_KEY  → Supabase → Settings → API → service_role (SECRET)
//   STRIPE_SECRET_KEY          → Stripe → Developers → API keys (sk_...)
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
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-user-token, x-admin-key');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) return res.status(503).json({ error: 'SUPABASE_SERVICE_ROLE_KEY non configurée sur le serveur' });
  const url = process.env.SUPABASE_URL || FALLBACK_URL;
  const stripeKey = process.env.STRIPE_SECRET_KEY;

  if (!(await isAdmin(req, url, key))) return res.status(401).json({ error: 'Accès réservé à l\'administrateur' });

  const sbHeaders = { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' };

  async function sbPatchUser(userId, fields) {
    return fetch(url + '/rest/v1/users?id=eq.' + encodeURIComponent(userId), {
      method: 'PATCH', headers: Object.assign({}, sbHeaders, { Prefer: 'return=minimal' }), body: JSON.stringify(fields)
    });
  }
  async function sbUpdateSub(userId, fields) {
    // met à jour la ligne d'abonnement de cet utilisateur (si elle existe)
    return fetch(url + '/rest/v1/subscriptions?user_id=eq.' + encodeURIComponent(userId), {
      method: 'PATCH', headers: Object.assign({}, sbHeaders, { Prefer: 'return=minimal' }), body: JSON.stringify(fields)
    });
  }
  async function getSubId(userId) {
    try {
      const r = await fetch(url + '/rest/v1/subscriptions?user_id=eq.' + encodeURIComponent(userId) + '&select=stripe_subscription_id&order=created_at.desc&limit=1', { headers: sbHeaders });
      const rows = await r.json();
      return (Array.isArray(rows) && rows[0] && rows[0].stripe_subscription_id) || null;
    } catch (e) { return null; }
  }
  async function stripe(path, params, method) {
    if (!stripeKey) return { error: { message: 'STRIPE_SECRET_KEY non configurée' } };
    const opt = { method: method || 'POST', headers: { Authorization: 'Bearer ' + stripeKey, 'Content-Type': 'application/x-www-form-urlencoded' } };
    if (params) opt.body = new URLSearchParams(params).toString();
    const r = await fetch('https://api.stripe.com/v1/' + path, opt);
    return r.json();
  }

  const body = req.body || {};
  const action = body.action;
  if (!action) return res.status(400).json({ error: 'action requise' });

  try {
    // ── Changer le plan d'un abonné ──────────────────────────────
    if (action === 'set-plan') {
      const { user_id, plan } = body;
      if (!user_id) return res.status(400).json({ error: 'user_id requis' });
      const map = {
        mensuel: { userPlan: 'premium', statut: 'active',   montant: 11.99, stopBilling: false },
        essai:   { userPlan: 'premium', statut: 'trialing', montant: 0,     stopBilling: false },
        offert:  { userPlan: 'premium', statut: 'active',   montant: 0,     stopBilling: true },
        aucun:   { userPlan: 'gratuit', statut: 'canceled', montant: 0,     stopBilling: true }
      };
      const m = map[plan]; if (!m) return res.status(400).json({ error: 'plan inconnu : ' + plan });

      // Stripe : couper la facturation quand on passe en offert/aucun
      if (m.stopBilling) {
        const sid = await getSubId(user_id);
        if (sid) { try { await stripe('subscriptions/' + sid, null, 'DELETE'); } catch (e) {} }
      }
      const up = await sbPatchUser(user_id, { plan: m.userPlan });
      if (!up.ok) { const t = await up.text().catch(() => ''); return res.status(502).json({ error: 'Maj utilisateur (' + up.status + ') ' + t }); }
      await sbUpdateSub(user_id, { plan: plan, statut: m.statut, montant: m.montant });
      return res.status(200).json({ ok: true, plan: plan });
    }

    // ── Suspendre / réactiver un compte ─────────────────────────
    if (action === 'set-status') {
      const { user_id, status } = body;
      if (!user_id) return res.status(400).json({ error: 'user_id requis' });
      const suspend = status === 'suspendu';
      const sid = await getSubId(user_id);
      if (sid) {
        try {
          // pause_collection = void → on cesse de facturer sans résilier ; vide → on reprend
          const params = suspend ? { 'pause_collection[behavior]': 'void' } : { 'pause_collection': '' };
          await stripe('subscriptions/' + sid, params);
        } catch (e) {}
      }
      await sbPatchUser(user_id, { plan: suspend ? 'gratuit' : 'premium' });
      await sbUpdateSub(user_id, { statut: suspend ? 'suspendu' : 'active' });
      return res.status(200).json({ ok: true, status: suspend ? 'suspendu' : 'actif' });
    }

    // ── Créer un code promo (coupon + code Stripe) ──────────────
    if (action === 'create-promo') {
      const { code, off, dur, max } = body;
      if (!code) return res.status(400).json({ error: 'code requis' });
      if (!stripeKey) return res.status(503).json({ error: 'STRIPE_SECRET_KEY non configurée' });
      const percent = parseInt(off, 10) || 25;
      // durée du coupon
      const durMap = {
        '1 mois':  { duration: 'once' },
        '3 mois':  { duration: 'repeating', duration_in_months: 3 },
        '12 mois': { duration: 'repeating', duration_in_months: 12 },
        'À vie':   { duration: 'forever' }
      };
      const dm = durMap[dur] || { duration: 'once' };
      const couponParams = { percent_off: percent, duration: dm.duration, name: 'Espritum ' + code };
      if (dm.duration_in_months) couponParams.duration_in_months = dm.duration_in_months;
      const coupon = await stripe('coupons', couponParams);
      if (coupon.error) return res.status(400).json({ error: coupon.error.message });

      const pcParams = { coupon: coupon.id, code: code.toUpperCase() };
      const maxN = parseInt(max, 10);
      if (maxN > 0) pcParams.max_redemptions = maxN;
      const promo = await stripe('promotion_codes', pcParams);
      if (promo.error) return res.status(400).json({ error: promo.error.message });
      return res.status(200).json({ ok: true, id: promo.id, code: promo.code });
    }

    // ── Désactiver un code promo ────────────────────────────────
    if (action === 'delete-promo') {
      const { promo_id } = body;
      if (!promo_id) return res.status(400).json({ error: 'promo_id requis' });
      const r = await stripe('promotion_codes/' + promo_id, { active: 'false' });
      if (r.error) return res.status(400).json({ error: r.error.message });
      return res.status(200).json({ ok: true });
    }

    // ── Modifier le prénom / nom d'un abonné ────────────────────
    if (action === 'update-user') {
      const { user_id, prenom, nom } = body;
      if (!user_id) return res.status(400).json({ error: 'user_id requis' });
      const fields = {};
      if (typeof prenom === 'string') fields.prenom = prenom.trim();
      if (typeof nom === 'string') fields.nom = nom.trim();
      if (!Object.keys(fields).length) return res.status(400).json({ error: 'rien à modifier' });
      const r = await sbPatchUser(user_id, fields);
      if (!r.ok) { const t = await r.text().catch(() => ''); return res.status(502).json({ error: 'Maj (' + r.status + ') ' + t }); }
      return res.status(200).json({ ok: true });
    }

    // ── Supprimer complètement un compte ────────────────────────
    if (action === 'delete-user') {
      const { user_id } = body;
      if (!user_id) return res.status(400).json({ error: 'user_id requis' });
      const uidEnc = encodeURIComponent(user_id);
      // 1) Résilier l'abonnement Stripe s'il existe (stoppe la facturation)
      const sid = await getSubId(user_id);
      if (sid) { try { await stripe('subscriptions/' + sid, null, 'DELETE'); } catch (e) {} }
      // 2) Supprimer les données liées (best effort ; une table absente est ignorée)
      const delHeaders = Object.assign({}, sbHeaders, { Prefer: 'return=minimal' });
      const tables = ['meals', 'measurements', 'workouts', 'subscriptions', 'instant_photos', 'photo_likes'];
      for (let i = 0; i < tables.length; i++) {
        try { await fetch(url + '/rest/v1/' + tables[i] + '?user_id=eq.' + uidEnc, { method: 'DELETE', headers: delHeaders }); } catch (e) {}
      }
      // 3) Supprimer la ligne de profil
      try { await fetch(url + '/rest/v1/users?id=eq.' + uidEnc, { method: 'DELETE', headers: delHeaders }); } catch (e) {}
      // 4) Supprimer le compte d'authentification
      let authStatus = 0;
      try {
        const ra = await fetch(url + '/auth/v1/admin/users/' + uidEnc, { method: 'DELETE', headers: { apikey: key, Authorization: 'Bearer ' + key } });
        authStatus = ra.status;
      } catch (e) {}
      return res.status(200).json({ ok: true, auth_status: authStatus });
    }

    // ── Supprimer un e-mail de la liste d'attente ───────────────
    if (action === 'delete-waitlist') {
      const { id } = body;
      if (!id) return res.status(400).json({ error: 'id requis' });
      const r = await fetch(url + '/rest/v1/waitlist?id=eq.' + encodeURIComponent(id), {
        method: 'DELETE', headers: Object.assign({}, sbHeaders, { Prefer: 'return=minimal' })
      });
      if (!r.ok) { const t = await r.text().catch(() => ''); return res.status(502).json({ error: 'Suppression (' + r.status + ') ' + t }); }
      return res.status(200).json({ ok: true });
    }

    return res.status(400).json({ error: 'Action inconnue : ' + action });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

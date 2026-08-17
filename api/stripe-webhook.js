// ── Espritum — Webhook Stripe (Vercel Serverless) ──
// Stripe envoie ici les évènements de paiement/abonnement.
// On vérifie la signature, puis on met à jour le compte (plan premium) via la
// clé SERVICE_ROLE de Supabase (qui contourne la RLS — usage serveur uniquement).
//
// Variables d'env (Vercel) :
//   STRIPE_WEBHOOK_SECRET       → Stripe → Developers → Webhooks → (ton endpoint) → Signing secret (whsec_...)
//   SUPABASE_SERVICE_ROLE_KEY   → Supabase → Settings → API → service_role (SECRET)
//   SUPABASE_URL                → optionnel (fallback ci-dessous)

import crypto from 'crypto';

export const config = { api: { bodyParser: false } }; // besoin du corps BRUT pour vérifier la signature

function readRawBody(req) {
  return new Promise(function (resolve, reject) {
    var chunks = [];
    req.on('data', function (c) { chunks.push(typeof c === 'string' ? Buffer.from(c) : c); });
    req.on('end', function () { resolve(Buffer.concat(chunks)); });
    req.on('error', reject);
  });
}

function verifySignature(payloadBuf, sigHeader, secret) {
  if (!sigHeader) return false;
  var parts = {};
  sigHeader.split(',').forEach(function (p) { var i = p.indexOf('='); if (i > 0) parts[p.slice(0, i)] = p.slice(i + 1); });
  if (!parts.t || !parts.v1) return false;
  var signedPayload = parts.t + '.' + payloadBuf.toString('utf8');
  var expected = crypto.createHmac('sha256', secret).update(signedPayload).digest('hex');
  var a = Buffer.from(expected), b = Buffer.from(parts.v1);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  var secret = process.env.STRIPE_WEBHOOK_SECRET;
  var svcKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  var sbUrl = process.env.SUPABASE_URL || 'https://lbxlvrtujzwlcnloheyh.supabase.co';
  if (!secret) return res.status(503).json({ error: 'STRIPE_WEBHOOK_SECRET not configured' });

  var payload = await readRawBody(req);
  if (!verifySignature(payload, req.headers['stripe-signature'], secret)) {
    return res.status(400).json({ error: 'Signature Stripe invalide' });
  }

  var event;
  try { event = JSON.parse(payload.toString('utf8')); } catch (e) { return res.status(400).json({ error: 'JSON invalide' }); }

  function sbHeaders(extra) {
    return Object.assign({ apikey: svcKey, Authorization: 'Bearer ' + svcKey, 'Content-Type': 'application/json' }, extra || {});
  }
  async function patchUser(userId, fields) {
    if (!userId || !svcKey) return;
    await fetch(sbUrl + '/rest/v1/users?id=eq.' + encodeURIComponent(userId), {
      method: 'PATCH', headers: sbHeaders({ Prefer: 'return=minimal' }), body: JSON.stringify(fields)
    });
  }
  async function upsertSub(row) {
    if (!svcKey || !row.stripe_subscription_id) return;
    try {
      await fetch(sbUrl + '/rest/v1/subscriptions?on_conflict=stripe_subscription_id', {
        method: 'POST', headers: sbHeaders({ Prefer: 'resolution=merge-duplicates,return=minimal' }), body: JSON.stringify(row)
      });
    } catch (e) { /* non bloquant */ }
  }

  try {
    var obj = (event.data && event.data.object) || {};
    if (event.type === 'checkout.session.completed') {
      var uid = obj.client_reference_id;
      await patchUser(uid, { plan: 'premium' });
      await upsertSub({ user_id: uid, stripe_subscription_id: obj.subscription, stripe_customer_id: obj.customer, plan: 'premium', statut: 'active', montant: 11.99 });
    } else if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.created') {
      var u1 = obj.metadata && obj.metadata.user_id;
      var actif = ['trialing', 'active'].indexOf(obj.status) >= 0;
      await upsertSub({ user_id: u1, stripe_subscription_id: obj.id, stripe_customer_id: obj.customer, plan: 'premium', statut: obj.status });
      await patchUser(u1, { plan: actif ? 'premium' : 'gratuit' });
    } else if (event.type === 'customer.subscription.deleted') {
      var u2 = obj.metadata && obj.metadata.user_id;
      await upsertSub({ user_id: u2, stripe_subscription_id: obj.id, statut: 'canceled', plan: 'gratuit' });
      await patchUser(u2, { plan: 'gratuit' });
    }
    return res.status(200).json({ received: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

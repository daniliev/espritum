// ── Espritum — Création d'abonnement Stripe (Vercel Serverless) ──
// Crée un Customer + une Subscription Premium côté serveur.
// La clé secrète Stripe n'est JAMAIS exposée au navigateur.
//
// Variables d'environnement (Vercel → Settings → Environment Variables) :
//   STRIPE_SECRET_KEY     → Stripe → Developers → API keys (sk_test_... ou sk_live_...)
//   STRIPE_PRICE_PREMIUM  → l'ID du tarif 11,99€ (price_...)  [optionnel, sinon fallback ci-dessous]

const FALLBACK_PRICE = 'price_1Th2O2CiYumIwbBJHD0rKq'; // tarif Premium 11,99€ (test)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return res.status(503).json({ error: 'STRIPE_SECRET_KEY not configured on server' });

  const priceId = process.env.STRIPE_PRICE_PREMIUM || FALLBACK_PRICE;
  const { payment_method_id, email, user_id } = req.body || {};
  if (!payment_method_id) return res.status(400).json({ error: 'payment_method_id requis' });

  // Helper : appel à l'API Stripe (form-urlencoded)
  async function stripe(path, params) {
    const resp = await fetch('https://api.stripe.com/v1/' + path, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + key,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(params).toString(),
    });
    return resp.json();
  }

  try {
    // 1) Customer
    const customer = await stripe('customers', {
      email: email || '',
      'metadata[supabase_user_id]': user_id || '',
    });
    if (customer.error) return res.status(400).json({ error: customer.error.message });

    // 2) Attacher le moyen de paiement + le définir par défaut
    const attach = await stripe('payment_methods/' + payment_method_id + '/attach', { customer: customer.id });
    if (attach.error) return res.status(400).json({ error: attach.error.message });
    await stripe('customers/' + customer.id, {
      'invoice_settings[default_payment_method]': payment_method_id,
    });

    // 3) Subscription (paiement immédiat, 3D Secure géré côté client)
    const sub = await stripe('subscriptions', {
      customer: customer.id,
      'items[0][price]': priceId,
      'payment_behavior': 'default_incomplete',
      'payment_settings[save_default_payment_method]': 'on_subscription',
      'expand[0]': 'latest_invoice.payment_intent',
      'metadata[supabase_user_id]': user_id || '',
      'metadata[plan]': 'premium',
    });
    if (sub.error) return res.status(400).json({ error: sub.error.message });

    const pi = sub.latest_invoice && sub.latest_invoice.payment_intent;
    return res.status(200).json({
      subscription_id: sub.id,
      customer_id: customer.id,
      status: (pi && pi.status) || sub.status,
      client_secret: (pi && pi.client_secret) || null,
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

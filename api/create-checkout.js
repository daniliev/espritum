// ── Espritum — Stripe Checkout (Vercel Serverless) ──
// Crée une session de paiement hébergée par Stripe pour l'abonnement
// Espritum Premium (11,99 €/mois) avec 14 jours d'essai gratuit.
// La clé secrète reste ICI (variable d'env Vercel), jamais côté navigateur.
//
// Variables d'env (Vercel → Settings → Environment Variables) :
//   STRIPE_SECRET_KEY     → sk_test_... (mode test) puis sk_live_... (prod)
//   STRIPE_PRICE_PREMIUM  → l'ID du tarif price_... — OBLIGATOIRE en mode live
//                           (les catalogues test et live sont séparés : un price
//                            créé en test n'existe pas en live)

const FALLBACK_PRICE = 'price_1Th2O2CiYumIwbBhBJHD0rKq'; // 11,99 €/mois (test uniquement)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return res.status(503).json({ error: 'STRIPE_SECRET_KEY not configured on server' });

  // En mode live, le price de repli (créé en test) n'existe pas : Stripe répondrait
  // « No such price » et l'utilisateur ne verrait qu'un « Paiement indisponible ».
  // On refuse tôt, avec un message qui dit quoi corriger.
  const priceId = process.env.STRIPE_PRICE_PREMIUM;
  if (!priceId && key.startsWith('sk_live_')) {
    return res.status(503).json({ error: 'STRIPE_PRICE_PREMIUM manquant : en mode live, il faut l\'ID du tarif créé dans le catalogue live' });
  }

  const { email, user_id } = req.body || {};
  const origin = req.headers.origin || 'https://app.espritum.com';

  const params = new URLSearchParams();
  params.append('mode', 'subscription');
  params.append('line_items[0][price]', priceId || FALLBACK_PRICE);
  params.append('line_items[0][quantity]', '1');
  params.append('subscription_data[trial_period_days]', '14');       // 2 semaines gratuites
  params.append('allow_promotion_codes', 'true');
  params.append('success_url', origin + '/accueil.html?paid=1&session_id={CHECKOUT_SESSION_ID}');
  params.append('cancel_url', origin + '/abonnement.html');
  if (email) params.append('customer_email', email);
  // Lie la session au compte Supabase → le webhook saura qui a payé
  if (user_id) {
    params.append('client_reference_id', user_id);
    params.append('subscription_data[metadata][user_id]', user_id);
  }

  try {
    const resp = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + key,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });
    const data = await resp.json();
    if (!resp.ok || data.error) {
      return res.status(resp.status || 400).json({ error: (data.error && data.error.message) || 'Stripe error' });
    }
    return res.status(200).json({ url: data.url });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

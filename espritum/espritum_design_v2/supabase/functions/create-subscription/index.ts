// supabase/functions/create-subscription/index.ts
//
// Crée un abonnement Stripe pour un utilisateur authentifié.
// Appelée depuis paiement.html.
//
// Secrets à configurer côté Supabase :
//   supabase secrets set STRIPE_SECRET_KEY=sk_test_...
//   supabase secrets set STRIPE_PRICE_GUERRIER=price_...
//   supabase secrets set STRIPE_PRICE_CHAMPION=price_...
//   supabase secrets set STRIPE_PRICE_ELITE=price_...
//
// Déploiement :
//   supabase functions deploy create-subscription --no-verify-jwt=false

import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const PRICES: Record<string, string | undefined> = {
  guerrier: Deno.env.get('STRIPE_PRICE_GUERRIER'),
  champion: Deno.env.get('STRIPE_PRICE_CHAMPION'),
  elite: Deno.env.get('STRIPE_PRICE_ELITE'),
};

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  try {
    // 1) Auth : on attend un JWT utilisateur, PAS la clé anon
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return json({ error: 'Missing Authorization header' }, 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userErr } = await supabase.auth.getUser();
    if (userErr || !user) return json({ error: 'Invalid session' }, 401);

    // 2) Validation input
    const body = await req.json();
    const { plan, payment_method_id } = body;

    if (!plan || !PRICES[plan]) {
      return json({ error: `Plan invalide : ${plan}` }, 400);
    }
    if (!payment_method_id || typeof payment_method_id !== 'string') {
      return json({ error: 'payment_method_id manquant' }, 400);
    }

    const priceId = PRICES[plan]!;

    // 3) Récupère ou crée le Customer Stripe pour ce user
    //    On lit la table public.users pour voir s'il a déjà un stripe_customer_id
    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: profile } = await admin
      .from('users')
      .select('stripe_customer_id, email, prenom')
      .eq('id', user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: profile?.prenom || undefined,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;

      await admin.from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
    }

    // 4) Attache le PaymentMethod au Customer et le définit par défaut
    await stripe.paymentMethods.attach(payment_method_id, { customer: customerId });
    await stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: payment_method_id },
    });

    // 5) Crée la Subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      metadata: { supabase_user_id: user.id, plan },
    });

    // 6) Renvoie le statut + client_secret si 3D Secure nécessaire
    const invoice = subscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = invoice?.payment_intent as Stripe.PaymentIntent | null;

    return json({
      subscription_id: subscription.id,
      status: paymentIntent?.status || subscription.status,
      client_secret: paymentIntent?.client_secret || null,
    });
  } catch (err) {
    console.error('create-subscription error:', err);
    const message = err instanceof Error ? err.message : 'Erreur interne';
    return json({ error: message }, 500);
  }
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

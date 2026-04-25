// supabase/functions/stripe-webhook/index.ts
//
// Webhook Stripe : seule source de vérité pour activer / désactiver les abos.
// C'est ici et nulle part ailleurs que `users.plan` et `subscriptions.statut`
// passent à "active". Ça évite qu'un utilisateur malin bricole l'UI pour se
// donner un abo gratuit.
//
// Déploiement :
//   supabase functions deploy stripe-webhook --no-verify-jwt
//   (le --no-verify-jwt est OBLIGATOIRE : Stripe n'envoie pas de JWT Supabase)
//
// Secrets :
//   supabase secrets set STRIPE_SECRET_KEY=sk_test_...
//   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...   (récupéré dans le dashboard Stripe après création du webhook)
//
// Côté dashboard Stripe : ajoute un endpoint webhook qui pointe vers
//   https://<project-ref>.supabase.co/functions/v1/stripe-webhook
// et s'abonne aux événements :
//   - customer.subscription.created
//   - customer.subscription.updated
//   - customer.subscription.deleted
//   - invoice.payment_succeeded
//   - invoice.payment_failed

import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;

const admin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Mapping priceId → plan (à remplir avec tes vraies valeurs)
const PRICE_TO_PLAN: Record<string, string> = {
  [Deno.env.get('STRIPE_PRICE_GUERRIER') || '']: 'guerrier',
  [Deno.env.get('STRIPE_PRICE_CHAMPION') || '']: 'champion',
  [Deno.env.get('STRIPE_PRICE_ELITE') || '']: 'elite',
};

serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  if (!signature) return new Response('Missing signature', { status: 400 });

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return new Response('Invalid signature', { status: 400 });
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        await upsertSubscription(sub);
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        await downgradeUser(sub);
        break;
      }
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          const sub = await stripe.subscriptions.retrieve(invoice.subscription as string);
          await upsertSubscription(sub);
        }
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          await admin.from('subscriptions')
            .update({ statut: 'past_due' })
            .eq('stripe_subscription_id', invoice.subscription);
        }
        break;
      }
      default:
        // On ignore silencieusement les events non gérés
        break;
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Webhook handler error:', err);
    return new Response('Handler error', { status: 500 });
  }
});

async function upsertSubscription(sub: Stripe.Subscription) {
  const userId = sub.metadata?.supabase_user_id;
  if (!userId) {
    console.warn('Subscription sans supabase_user_id dans metadata:', sub.id);
    return;
  }

  const priceId = sub.items.data[0]?.price.id;
  const plan = PRICE_TO_PLAN[priceId] || 'guerrier';

  // Statut côté app :
  // - "active" ou "trialing" → plan débloqué
  // - autre → downgrade gratuit
  const statutApp = (sub.status === 'active' || sub.status === 'trialing') ? 'active' : sub.status;
  const planForUser = (sub.status === 'active' || sub.status === 'trialing') ? plan : 'gratuit';

  await admin.from('subscriptions').upsert({
    user_id: userId,
    stripe_subscription_id: sub.id,
    stripe_customer_id: sub.customer as string,
    plan,
    statut: statutApp,
    montant: (sub.items.data[0]?.price.unit_amount || 0) / 100,
    debut: new Date(sub.current_period_start * 1000).toISOString(),
    prochain_paiement: new Date(sub.current_period_end * 1000).toISOString(),
    cancel_at_period_end: sub.cancel_at_period_end,
  }, { onConflict: 'stripe_subscription_id' });

  await admin.from('users').update({ plan: planForUser }).eq('id', userId);
}

async function downgradeUser(sub: Stripe.Subscription) {
  const userId = sub.metadata?.supabase_user_id;
  if (!userId) return;

  await admin.from('subscriptions')
    .update({ statut: 'canceled' })
    .eq('stripe_subscription_id', sub.id);

  await admin.from('users').update({ plan: 'gratuit' }).eq('id', userId);
}

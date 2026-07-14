# Espritum — Guide de déploiement

Ce guide explique comment appliquer les corrections apportées sur la partie Supabase + Stripe.
**À faire dans l'ordre.** Chaque étape est idempotente (rejouable sans risque).

---

## Étape 1 — Appliquer le schéma SQL

Dans Supabase Studio → **SQL Editor** → New query, colle tout le contenu de
`supabase/schema.sql` et exécute.

Ce script crée/complète :

- Tables : `users`, `subscriptions`, `meals`, `workouts`, `site_config`
- Colonnes Stripe manquantes : `users.stripe_customer_id`, `subscriptions.stripe_subscription_id`, etc.
- Un trigger `on_auth_user_created` qui crée automatiquement la ligne `public.users` à chaque inscription (plus besoin de le faire côté client, fini les profils fantômes)
- Policies RLS : chaque utilisateur ne voit **que ses propres données**
- Protection : l'utilisateur ne peut pas se donner `is_admin = true` ni changer son `plan` lui-même (le plan est piloté par le webhook Stripe)

**Vérifie ensuite** dans Supabase Studio → Authentication → Policies que les policies sont bien actives sur les 5 tables.

---

## Étape 2 — Créer les produits dans Stripe

Dans le Dashboard Stripe → Products → Add product, crée 3 produits :

| Plan      | Montant   | Cycle    |
|-----------|-----------|----------|
| Guerrier  | 5,00 €    | Mensuel  |
| Champion  | 15,00 €   | Mensuel  |
| Élite     | 30,00 €   | Mensuel  |

Pour chacun, note le `price_id` (commence par `price_...`). Tu en auras besoin à l'étape 3.

> Ton code référençait déjà des price_id (`price_1TMMvzCi...`, etc.). Tu peux réutiliser ceux-là si les produits existent, ou en créer de nouveaux.

---

## Étape 3 — Configurer les secrets Supabase

Dans ton terminal, depuis la racine du projet :

```bash
# Lie le projet (une seule fois)
supabase link --project-ref lbxlvrtujzwlcnloheyh

# Clé secrète Stripe (sk_test_... pour tester, sk_live_... pour la prod)
supabase secrets set STRIPE_SECRET_KEY=sk_test_xxxxx

# Price IDs des 3 plans
supabase secrets set STRIPE_PRICE_GUERRIER=price_xxxxx
supabase secrets set STRIPE_PRICE_CHAMPION=price_xxxxx
supabase secrets set STRIPE_PRICE_ELITE=price_xxxxx

# (On reviendra sur STRIPE_WEBHOOK_SECRET à l'étape 5)
```

> `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` sont automatiquement disponibles dans les Edge Functions, pas besoin de les set.

---

## Étape 4 — Déployer les Edge Functions

```bash
# create-subscription : créer Customer + Subscription Stripe + renvoyer client_secret
supabase functions deploy create-subscription

# stripe-webhook : recevoir les events Stripe (paiement réussi, abo annulé, etc.)
# --no-verify-jwt est OBLIGATOIRE : Stripe n'envoie pas de JWT Supabase, il signe avec sa propre clé
supabase functions deploy stripe-webhook --no-verify-jwt
```

Vérifie le déploiement dans Supabase Studio → Edge Functions.

---

## Étape 5 — Configurer le webhook Stripe

1. Dashboard Stripe → Developers → **Webhooks** → Add endpoint
2. URL : `https://lbxlvrtujzwlcnloheyh.supabase.co/functions/v1/stripe-webhook`
3. Events à écouter :
    - `customer.subscription.created`
    - `customer.subscription.updated`
    - `customer.subscription.deleted`
    - `invoice.payment_succeeded`
    - `invoice.payment_failed`
4. Une fois créé, Stripe te donne un **Signing secret** (`whsec_...`). Copie-le et set-le dans Supabase :

```bash
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxxxx
# Redéploie la fonction pour qu'elle voie le nouveau secret
supabase functions deploy stripe-webhook --no-verify-jwt
```

---

## Étape 6 — Tester le flux complet

1. Déploie le site (Vercel ou autre)
2. Crée un nouveau compte → onboarding → choisis le plan **Champion**
3. Sur `paiement.html`, entre la carte test Stripe :
    - Numéro : `4242 4242 4242 4242`
    - Date : n'importe quelle date future
    - CVC : 3 chiffres
4. Clique "Payer"
5. Vérifie :
    - Dashboard Stripe → Customers : ton customer est créé
    - Dashboard Stripe → Subscriptions : l'abo est actif
    - Supabase → Table `subscriptions` : ligne créée avec `statut = 'active'`
    - Supabase → Table `users` : `plan = 'champion'`

Pour tester le **3D Secure**, utilise la carte `4000 0025 0000 3155` — Stripe renverra `requires_action` et le code déclenchera l'authentification.

Pour tester un **refus**, utilise `4000 0000 0000 0002`.

---

## Étape 7 — Passer en production

Quand tu es prêt :

1. Remplace `sk_test_...` par `sk_live_...` dans les secrets Supabase
2. Remplace `pk_test_...` par `pk_live_...` dans `paiement.html`
3. Recrée les produits/prix en mode Live dans Stripe et met à jour les `STRIPE_PRICE_*`
4. Recrée un webhook en mode Live et met à jour `STRIPE_WEBHOOK_SECRET`
5. Redéploie les Edge Functions

---

## Problèmes connus / à vérifier

- **Table `admin_users`/`admin_subs`** : ces pages n'ont pas de client Supabase et pas de vérif `is_admin`. À auditer.
- **Dates en UTC** : le code client utilise `new Date().toISOString().split('T')[0]` → un user français tard le soir peut écrire "hier" au lieu d'"aujourd'hui". À remplacer par une date locale.
- **Freemium côté client uniquement** : actuellement le verrouillage est purement visuel (CSS `locked`). Un user malin peut accéder à toutes les pages en tapant l'URL. La vraie protection vient des RLS (il n'aura pas les données) mais l'UI ne bloque pas. À durcir si besoin business.
- **Clé Stripe `pk_test_...`** : à remplacer par la clé live avant prod.

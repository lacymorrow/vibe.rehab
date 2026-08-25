# Stripe Live Configuration Setup

This guide walks through configuring Stripe live prices for the three vibe.rehab tiers.

## Canonical prices (source of truth)

The page prices are canonical. Stripe must match them.

| Tier | Price | Env var |
|---|---|---|
| Quick Fix | **$299** | `NEXT_PUBLIC_STRIPE_PRICE_ID_QUICK_FIX` |
| Full Rescue | **$499** | `NEXT_PUBLIC_STRIPE_PRICE_ID_FULL_RESCUE` |
| Complete Rehab | **$799** | `NEXT_PUBLIC_STRIPE_PRICE_ID_COMPLETE_REHAB` |

If a tier's env var is unset or invalid, the buy flow for that tier is disabled at runtime (server rejects with 403, client disables the pay button). This is intentional: better to disable than to overcharge.

## Required Environment Variables

Create a `.env.local` in the repo root:

```bash
# Stripe Secret Key (Live)
# Dashboard: https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_live_...

# Stripe Price IDs (Live) — one per tier
NEXT_PUBLIC_STRIPE_PRICE_ID_QUICK_FIX=price_...       # $299
NEXT_PUBLIC_STRIPE_PRICE_ID_FULL_RESCUE=price_...     # $499
NEXT_PUBLIC_STRIPE_PRICE_ID_COMPLETE_REHAB=price_...  # $799

# Base URL for production
NEXT_PUBLIC_BASE_URL=https://vibe.rehab
```

Set the same three price-ID vars in Vercel (Production + Preview) and any other deploy target.

## Steps to Get Live Stripe Keys

### 1. Get Live Secret Key
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Confirm **Live mode** (top-right toggle)
3. **Developers > API keys** → copy the **Secret key** (starts with `sk_live_`)

### 2. Create Live Products and Prices

Create three one-time products in Stripe (Live mode):

- **Quick Fix** — one-time price **$299 USD**
- **Full Rescue** — one-time price **$499 USD**
- **Complete Rehab** — one-time price **$799 USD**

For each, copy the **Price ID** (starts with `price_`) into the matching env var above.

Do not reuse old price objects that were priced at $99 or $999 — create fresh price objects at the canonical amounts. Old prices can be archived in Stripe once new ones are live.

### 3. Update Base URL
Set `NEXT_PUBLIC_BASE_URL` to `https://vibe.rehab`.

## Verification checklist (test mode first)

Before running against live keys, verify against Stripe test mode:

1. Load the site, open each tier's checkout flow, confirm the Stripe Checkout page shows the expected amount.
2. Complete a test purchase with `4242 4242 4242 4242` on each tier.
3. Confirm the success page displays the correct amount (pulled from the Stripe session, not the page).
4. Only after the above passes should live keys be swapped in.

## Security Notes

- Never commit `.env.local`.
- Live secret keys stay in Vercel env / deploy secrets only.
- The checkout API validates the incoming `priceId` against the configured allowlist in production; unknown price IDs are rejected with 403.

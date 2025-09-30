# Stripe Live Configuration Setup

This guide will help you switch from test to live Stripe implementation.

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Stripe Secret Key (Live)
# Get this from: https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_SECRET_KEY_HERE

# Stripe Price IDs (Live)
# Create these in your Stripe Dashboard under Products
NEXT_PUBLIC_STRIPE_PRICE_ID_PROJECT=price_YOUR_PROJECT_PRICE_ID_HERE
NEXT_PUBLIC_STRIPE_PRICE_ID_REVIEW=price_YOUR_REVIEW_PRICE_ID_HERE

# Base URL for production
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

## Steps to Get Live Stripe Keys

### 1. Get Live Secret Key
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Make sure you're in **Live mode** (not Test mode)
3. Navigate to **Developers > API keys**
4. Copy the **Secret key** (starts with `sk_live_`)

### 2. Create Live Products and Prices
1. In Stripe Dashboard, go to **Products**
2. Create your products:
   - **Finish Your Project** - Set price to $999 (or your desired amount)
   - **Code Review** - Set price to $99 (or your desired amount)
3. For each product, copy the **Price ID** (starts with `price_`)
4. Replace the placeholder values in your `.env.local`

### 3. Update Base URL
Set `NEXT_PUBLIC_BASE_URL` to your production domain (e.g., `https://vibe.rehab`)

## Current Test Fallback Values

The code currently has these test price ID fallbacks:
- Project: `price_1234567890`
- Review: `price_0987654321`

These will be replaced once you set the environment variables.

## Security Notes

- Never commit `.env.local` to version control
- Keep your live secret key secure
- Only use live keys in production environment

# Performance Review Generator

A web app for steeleprather.com that generates polished performance reviews using the Claude API. Users fill out a short form, get a professional review in seconds, and pay via Stripe to unlock additional generations.

## Features

- First review is **free** — no payment required
- $9 one-time payment for one additional review
- $29/month subscription for unlimited reviews
- Three tone options: Professional, Warm and encouraging, Direct and concise
- Clean, mobile-responsive design

## Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS v4
- **AI**: Anthropic Claude API (`claude-opus-4-6`)
- **Payments**: Stripe Checkout
- **Deployment**: Vercel

---

## Setup

### 1. Clone and install

```bash
git clone <your-repo>
cd steeleprather
npm install
```

### 2. Get your API keys

#### Anthropic (Claude API)
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an account and add billing
3. Navigate to **API Keys** → **Create Key**
4. Copy the key — it starts with `sk-ant-`

#### Stripe
1. Go to [dashboard.stripe.com](https://dashboard.stripe.com) and create an account
2. Get your keys from **Developers → API Keys**:
   - **Publishable key**: starts with `pk_test_` (or `pk_live_` for production)
   - **Secret key**: starts with `sk_test_` (or `sk_live_` for production)

#### Stripe Products (optional but recommended for production)

Create two products in the Stripe Dashboard under **Products → Add product**:

**Single review ($9)**
- Name: "Performance Review — Single"
- Price: $9.00, one-time
- Copy the **Price ID** (starts with `price_`)

**Unlimited subscription ($29/month)**
- Name: "Performance Review Generator — Unlimited"
- Price: $29.00/month, recurring
- Copy the **Price ID**

If you skip this step, the app will create prices inline (works fine for testing).

#### Stripe Webhook (for production)
1. In Stripe Dashboard: **Developers → Webhooks → Add endpoint**
2. URL: `https://yourdomain.com/api/stripe/webhook`
3. Events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Copy the **Signing secret** (starts with `whsec_`)

For local testing, use the [Stripe CLI](https://stripe.com/docs/stripe-cli):
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### 3. Configure environment variables

Copy `.env.local` and fill in your keys:

```env
ANTHROPIC_API_KEY=sk-ant-...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Optional: pre-configured Stripe price IDs
STRIPE_PRICE_SINGLE=price_...
STRIPE_PRICE_SUBSCRIPTION=price_...

# Your deployed URL (update for production)
NEXT_PUBLIC_URL=http://localhost:3000
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploy to Vercel

### Option A: Vercel CLI

```bash
npm install -g vercel
vercel --prod
```

### Option B: GitHub + Vercel Dashboard

1. Push to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Add all environment variables from `.env.local` in the Vercel dashboard
5. Set `NEXT_PUBLIC_URL` to your production domain (e.g., `https://steeleprather.com`)
6. Deploy

### After deploying

1. Update `NEXT_PUBLIC_URL` in Vercel environment variables to your live domain
2. Update your Stripe webhook endpoint URL to the live domain
3. Switch Stripe keys from `test` to `live` for real payments

---

## Project Structure

```
app/
  page.tsx                    # Landing page (/)
  review-generator/
    page.tsx                  # Generator form (/review-generator)
  review-output/
    page.tsx                  # Output + payment (/review-output)
  api/
    generate/
      route.ts                # POST — calls Claude API
    stripe/
      checkout/
        route.ts              # GET — creates Stripe Checkout session
      webhook/
        route.ts              # POST — handles Stripe webhook events
```

## Notes on credit tracking

Credits and subscription status are stored in **localStorage** for simplicity. This means:

- They're per-browser — users can reset by clearing localStorage
- No server-side enforcement

For a production app with real revenue, implement server-side credit tracking with a database (e.g., Supabase, PlanetScale) keyed to a user account or customer ID from Stripe.

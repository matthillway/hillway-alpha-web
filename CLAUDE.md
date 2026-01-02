# Hillway Alpha Web - Marketing Website

## Project Overview

Marketing website and SaaS platform for Hillway Alpha - the AI-powered multi-asset opportunity scanner.

**Owner**: Matt Fitzgerald
**Status**: In Development
**GitHub**: TBD (matthillway/hillway-alpha-web)

---

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: TailwindCSS
- **Authentication**: Supabase Auth
- **Payments**: Stripe Subscriptions
- **Database**: Supabase (shared with hillway-alpha)
- **Deployment**: Vercel

---

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000

---

## Environment Variables

Copy `.env.local.example` to `.env.local`:

```env
# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://wlkxzlyxizkajlkureka.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with hero, features, how it works |
| `/pricing` | Pricing tiers and FAQ |
| `/auth/signup` | Sign up form |
| `/auth/login` | Login form |
| `/dashboard` | User dashboard (protected) |

---

## Pricing Tiers

| Tier | Price | Features |
|------|-------|----------|
| Free | £0 | Demo mode, sample data |
| Starter | £19/mo | 3 sports, 100 scans/day, email alerts |
| Pro | £49/mo | All sports, all scanners, 1000 scans/day, WhatsApp |
| Enterprise | £149/mo | Unlimited, API access, white-label |

---

## Stripe Integration

- Uses existing Hillway Stripe account
- Products and prices created via Stripe Dashboard
- Webhook endpoint: `/api/stripe/webhook`
- Customer portal: `/api/stripe/create-portal`

---

## Supabase Integration

Shares database with hillway-alpha project (wlkxzlyxizkajlkureka).

Auth tables managed by Supabase Auth.
User subscription data stored in `user_subscriptions` table.

---

## Deployment

```bash
# Deploy to Vercel
vercel deploy --prod
```

Remember to set environment variables in Vercel dashboard.

---

## Development Notes

- Dark theme with blue-to-purple gradients
- Mobile-first responsive design
- Use lucide-react for icons
- All forms use controlled components with validation

# TradeSmart - Multi-Asset Opportunity Scanner

AI-powered scanner for betting arbitrage, value bets, stock momentum, and crypto opportunities. Built for traders who want data-driven edge.

## Overview

TradeSmart is the web interface and SaaS platform for the Hillway Alpha multi-asset opportunity scanner. It provides:

- **Betting Scanner**: Arbitrage detection and value bet identification across UK bookmakers
- **Stock Scanner**: Momentum signals, technical indicators (RSI, MACD, Bollinger Bands)
- **Crypto Scanner**: Funding rate tracking, Fear & Greed contrarian signals
- **AI Briefings**: Claude-powered daily opportunity summaries
- **Real-time Alerts**: Email and WhatsApp notifications for high-confidence opportunities

---

## Tech Stack

| Category       | Technology              |
| -------------- | ----------------------- |
| Framework      | Next.js 15 (App Router) |
| Language       | TypeScript              |
| Styling        | Tailwind CSS 4          |
| Authentication | Supabase Auth           |
| Database       | Supabase (PostgreSQL)   |
| Payments       | Stripe Subscriptions    |
| Email          | Resend                  |
| Icons          | Lucide React            |
| Deployment     | Vercel                  |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account (for payments)

### Installation

```bash
# Clone the repository
git clone https://github.com/matthillway/hillway-alpha-web.git
cd hillway-alpha-web

# Install dependencies
npm install

# Copy environment template
cp .env.local.example .env.local

# Edit .env.local with your credentials (see Environment Variables below)

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (Resend)
RESEND_API_KEY=re_...

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Required Services

| Service  | Purpose             | Sign Up                              |
| -------- | ------------------- | ------------------------------------ |
| Supabase | Database & Auth     | [supabase.com](https://supabase.com) |
| Stripe   | Payments            | [stripe.com](https://stripe.com)     |
| Resend   | Transactional Email | [resend.com](https://resend.com)     |

---

## Project Structure

```
hillway-alpha-web/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Auth callbacks
│   │   ├── briefings/            # AI briefing endpoints
│   │   ├── metrics/              # Performance metrics
│   │   ├── opportunities/        # Opportunity CRUD
│   │   ├── positions/            # Position tracking
│   │   ├── scanner/              # Scanner triggers
│   │   └── stripe/               # Stripe integration
│   │       ├── create-checkout/  # Checkout session
│   │       ├── create-portal/    # Customer portal
│   │       └── webhook/          # Stripe webhooks
│   ├── auth/                     # Authentication pages
│   │   ├── login/                # Login page
│   │   └── signup/               # Sign up page
│   ├── dashboard/                # Protected dashboard
│   ├── pricing/                  # Pricing page
│   ├── error.tsx                 # Error boundary
│   ├── global-error.tsx          # Global error handler
│   ├── layout.tsx                # Root layout
│   ├── not-found.tsx             # 404 page
│   └── page.tsx                  # Landing page
├── components/
│   ├── landing/                  # Landing page components
│   │   ├── header.tsx            # Navigation header
│   │   ├── hero.tsx              # Hero section
│   │   ├── features.tsx          # Features grid
│   │   ├── how-it-works.tsx      # How it works section
│   │   ├── social-proof.tsx      # Testimonials
│   │   ├── cta.tsx               # Call to action
│   │   └── footer.tsx            # Site footer
│   └── ui/                       # Reusable UI components
│       ├── button.tsx            # Button component
│       └── input.tsx             # Input component
├── lib/                          # Utility libraries
│   ├── email/                    # Email templates
│   ├── stripe.ts                 # Stripe client
│   ├── supabase.ts               # Supabase client
│   └── utils.ts                  # Helper functions (cn, etc.)
├── public/                       # Static assets
├── .env.local                    # Environment variables (not committed)
├── .env.local.example            # Environment template
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## Available Scripts

| Script          | Description                              |
| --------------- | ---------------------------------------- |
| `npm run dev`   | Start development server with hot reload |
| `npm run build` | Build production bundle                  |
| `npm run start` | Start production server                  |
| `npm run lint`  | Run ESLint                               |

---

## Pages & Routes

| Route          | Description                                    | Auth Required |
| -------------- | ---------------------------------------------- | ------------- |
| `/`            | Landing page with hero, features, social proof | No            |
| `/pricing`     | Pricing tiers and FAQ                          | No            |
| `/auth/signup` | User registration                              | No            |
| `/auth/login`  | User login                                     | No            |
| `/dashboard`   | Main scanner dashboard                         | Yes           |

---

## Pricing Tiers

| Tier       | Price   | Features                                                  |
| ---------- | ------- | --------------------------------------------------------- |
| Free       | £0/mo   | Demo mode, sample data only                               |
| Starter    | £19/mo  | 3 sports, 100 scans/day, email alerts                     |
| Pro        | £49/mo  | All sports, all scanners, 1000 scans/day, WhatsApp alerts |
| Enterprise | £149/mo | Unlimited scans, API access, white-label options          |

---

## Stripe Integration

The application uses Stripe for subscription management:

- **Checkout**: `/api/stripe/create-checkout` creates Stripe Checkout sessions
- **Portal**: `/api/stripe/create-portal` redirects to Stripe Customer Portal
- **Webhooks**: `/api/stripe/webhook` handles subscription events

Configure your Stripe webhook endpoint to: `https://your-domain.com/api/stripe/webhook`

Required Stripe events:

- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

---

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel deploy --prod
```

Or connect your GitHub repository to Vercel for automatic deployments.

### Environment Variables on Vercel

Add all environment variables from `.env.local` to your Vercel project settings:

1. Go to Vercel Dashboard > Your Project > Settings > Environment Variables
2. Add each variable for Production, Preview, and Development environments

---

## Related Repositories

| Repository                                                    | Description                                |
| ------------------------------------------------------------- | ------------------------------------------ |
| [hillway-alpha](https://github.com/matthillway/hillway-alpha) | Backend scanners, CLI tools, and cron jobs |

The backend repository contains:

- Arbitrage and value bet scanners
- Stock momentum scanner
- Crypto funding rate tracker
- AI briefing generator
- Scheduled job system (Vercel Cron)
- Database migrations

---

## Database

This project shares a Supabase database with the hillway-alpha backend:

**Project ID**: `wlkxzlyxizkajlkureka`

Key tables:

- `opportunities` - Scanned opportunities
- `positions` - User positions and P&L tracking
- `briefings` - Daily AI briefings
- `daily_metrics` - Performance metrics
- `user_subscriptions` - Stripe subscription data

---

## Development Notes

- Dark theme with blue-to-purple gradients
- Mobile-first responsive design
- Use `lucide-react` for icons
- All forms use controlled components with validation
- TypeScript strict mode enabled

---

## License

Private - All rights reserved.

---

## Support

For issues or questions, contact [matt@hillwayco.uk](mailto:matt@hillwayco.uk).

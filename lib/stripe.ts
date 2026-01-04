import Stripe from "stripe";

// Create stripe instance - will use placeholder at build time if env var not set
export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || "sk_test_placeholder",
  {
    typescript: true,
  },
);

// TODO: Update these Stripe price IDs after creating new prices in Stripe Dashboard
// Matt needs to create new prices in Stripe and update .env.local with:
// STRIPE_PRICE_STARTER=price_xxx
// STRIPE_PRICE_PRO=price_xxx
// STRIPE_PRICE_UNLIMITED=price_xxx
export const PRICING_TIERS = {
  starter: {
    name: "Starter",
    price: 29,
    priceId: process.env.STRIPE_PRICE_STARTER || "", // TODO: Set in .env.local after creating price in Stripe
    features: [
      "100 scans per day",
      "Betting scanner only",
      "Email alerts",
      "Daily AI briefings",
    ],
    limits: {
      scansPerDay: 100,
      sports: "all",
      assetClasses: ["betting"],
    },
  },
  pro: {
    name: "Pro",
    price: 79,
    priceId: process.env.STRIPE_PRICE_PRO || "", // TODO: Set in .env.local after creating price in Stripe
    popular: true,
    features: [
      "500 scans per day",
      "All 3 scanners (Betting, Stocks, Crypto)",
      "WhatsApp + Email alerts",
      "AI-powered insights",
      "Priority support",
    ],
    limits: {
      scansPerDay: 500,
      sports: "unlimited",
      assetClasses: ["betting", "stocks", "crypto"],
    },
  },
  unlimited: {
    name: "Unlimited",
    price: 199,
    priceId: process.env.STRIPE_PRICE_UNLIMITED || "", // TODO: Set in .env.local after creating price in Stripe
    features: [
      "Unlimited scans",
      "Full API access",
      "Account linking",
      "White-label option",
      "Dedicated support",
    ],
    limits: {
      scansPerDay: "unlimited",
      sports: "unlimited",
      assetClasses: ["betting", "stocks", "crypto"],
    },
  },
} as const;

import Stripe from 'stripe';

// Create stripe instance - will use placeholder at build time if env var not set
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  typescript: true,
});

export const PRICING_TIERS = {
  starter: {
    name: 'Starter',
    price: 19,
    priceId: '', // Will be created in Stripe
    features: [
      'Betting arbitrage scanner',
      '3 sports leagues',
      'Daily briefings',
      'Email alerts',
      '100 scans/day',
    ],
    limits: {
      scansPerDay: 100,
      sports: 3,
      assetClasses: ['betting'],
    },
  },
  pro: {
    name: 'Pro',
    price: 49,
    priceId: '', // Will be created in Stripe
    features: [
      'Everything in Starter',
      'All sports leagues',
      'Stock momentum scanner',
      'Crypto funding rates',
      'Real-time WhatsApp alerts',
      'AI-powered insights',
      '1,000 scans/day',
    ],
    limits: {
      scansPerDay: 1000,
      sports: 'unlimited',
      assetClasses: ['betting', 'stocks', 'crypto'],
    },
  },
  enterprise: {
    name: 'Enterprise',
    price: 149,
    priceId: '', // Will be created in Stripe
    features: [
      'Everything in Pro',
      'Unlimited scans',
      'Custom alert rules',
      'API access',
      'Priority support',
      'White-label option',
      'Custom integrations',
    ],
    limits: {
      scansPerDay: 'unlimited',
      sports: 'unlimited',
      assetClasses: ['betting', 'stocks', 'crypto'],
    },
  },
} as const;

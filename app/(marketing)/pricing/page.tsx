import { Metadata } from "next";
import Link from "next/link";
import { Check, X, Zap, Trophy, Crown, TrendingUp } from "lucide-react";
import { FAQ } from "@/components/marketing";

export const metadata: Metadata = {
  title: "Pricing - TradeSmart",
  description:
    "Simple, transparent pricing for TradeSmart. Start with a free trial on our Pro plan. Cancel anytime.",
  openGraph: {
    title: "TradeSmart Pricing - Find Your Perfect Plan",
    description:
      "Choose the plan that fits your trading style. 14-day free trial on Pro.",
  },
};

const tiers = [
  {
    name: "Starter",
    price: "19",
    description: "Perfect for casual arbitrage hunters",
    icon: Zap,
    features: [
      { text: "Betting arbitrage scanner", included: true },
      { text: "3 sports leagues", included: true },
      { text: "Daily email briefings", included: true },
      { text: "100 scans per day", included: true },
      { text: "Basic support", included: true },
      { text: "Stock momentum scanner", included: false },
      { text: "Crypto funding rates", included: false },
      { text: "WhatsApp alerts", included: false },
    ],
    cta: "Get Started",
    href: "/login?plan=starter",
    highlighted: false,
    badge: null,
  },
  {
    name: "Pro",
    price: "49",
    description: "For serious traders who want an edge",
    icon: Trophy,
    features: [
      { text: "Everything in Starter", included: true },
      { text: "All sports leagues", included: true },
      { text: "Stock momentum scanner", included: true },
      { text: "Crypto funding rates", included: true },
      { text: "Real-time WhatsApp alerts", included: true },
      { text: "AI-powered insights", included: true },
      { text: "1,000 scans per day", included: true },
      { text: "Priority support", included: true },
    ],
    cta: "Start Free Trial",
    href: "/login?plan=pro",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    price: "149",
    description: "For teams and power users",
    icon: Crown,
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Unlimited scans", included: true },
      { text: "Custom alert rules", included: true },
      { text: "Full API access", included: true },
      { text: "White-label option", included: true },
      { text: "Custom integrations", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "SLA guarantee", included: true },
    ],
    cta: "Contact Sales",
    href: "/contact?plan=enterprise",
    highlighted: false,
    badge: null,
  },
];

const faqs = [
  {
    question: "How does the free trial work?",
    answer:
      "Pro plan includes a 14-day free trial with full access. No credit card required to start. Cancel anytime during the trial.",
  },
  {
    question: "What's included in each plan?",
    answer:
      "Starter: Betting arbitrage for 3 leagues with email alerts. Pro: All scanners (betting, stocks, crypto) plus WhatsApp alerts and AI insights. Enterprise: Unlimited access with API and custom integrations.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes, all plans are month-to-month with no commitment. Cancel anytime from your dashboard and retain access until the end of your billing period.",
  },
  {
    question: "Do you offer annual billing?",
    answer:
      "Yes! Annual billing gives you 2 months free. Enterprise customers also benefit from custom pricing and payment terms.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, debit cards, and Apple Pay through our secure Stripe payment system.",
  },
];

export default function PricingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-white">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm text-emerald-700 mb-6">
            <TrendingUp className="h-4 w-4" />
            14-day free trial on Pro
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your trading style. Start with a free
            trial, upgrade when you&apos;re ready.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 lg:grid-cols-3">
            {tiers.map((tier) => {
              const IconComponent = tier.icon;
              return (
                <div
                  key={tier.name}
                  className={`relative rounded-2xl border ${
                    tier.highlighted
                      ? "border-2 border-emerald-500 shadow-xl"
                      : "border-gray-200 shadow-md"
                  } bg-white p-8 flex flex-col`}
                >
                  {tier.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                        {tier.badge}
                      </span>
                    </div>
                  )}

                  <div className="mb-4 flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        tier.highlighted
                          ? "bg-emerald-600 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {tier.name}
                    </h3>
                  </div>

                  <div className="mb-2">
                    <span className="text-4xl font-bold text-gray-900">
                      £{tier.price}
                    </span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-6">
                    {tier.description}
                  </p>

                  <ul className="mb-8 flex-1 space-y-3">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="h-5 w-5 text-gray-300 flex-shrink-0 mt-0.5" />
                        )}
                        <span
                          className={
                            feature.included ? "text-gray-700" : "text-gray-400"
                          }
                        >
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={tier.href}
                    className={`mt-auto block w-full rounded-lg py-3 text-center text-sm font-semibold transition-colors ${
                      tier.highlighted
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    }`}
                  >
                    {tier.cta}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
            Frequently asked questions
          </h2>
          <p className="text-gray-600 text-center mb-12">
            Everything you need to know about TradeSmart pricing.
          </p>

          <FAQ items={faqs} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-emerald-600">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to find your edge?
          </h2>
          <p className="text-emerald-100 mb-8 max-w-xl mx-auto">
            Join traders using TradeSmart to discover profitable opportunities
            across betting, stocks, and crypto markets.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login?plan=pro"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-emerald-700 hover:bg-gray-50 transition-colors shadow-md"
            >
              Start 14-Day Free Trial
              <TrendingUp className="h-4 w-4" />
            </Link>
          </div>
          <p className="mt-6 text-xs text-emerald-200">
            No credit card required. Cancel anytime.
          </p>
        </div>
      </section>
    </>
  );
}

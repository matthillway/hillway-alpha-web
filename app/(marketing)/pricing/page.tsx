import { Metadata } from "next";
import Link from "next/link";
import {
  Check,
  X,
  Zap,
  Trophy,
  Crown,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from "lucide-react";
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
    description: "Perfect for casual arbitrage hunters looking to get started",
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
    gradient: "from-gray-400 to-gray-500",
  },
  {
    name: "Pro",
    price: "49",
    description: "For serious traders who want an edge across all markets",
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
    gradient: "from-emerald-500 to-emerald-600",
  },
  {
    name: "Enterprise",
    price: "149",
    description: "For teams and power users who need unlimited access",
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
    gradient: "from-purple-500 to-purple-600",
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
      <section className="pt-44 pb-20 lg:pt-52 lg:pb-24 bg-white relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 to-white -z-10" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:64px_64px] -z-10" />

        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white/80 backdrop-blur-sm px-5 py-2 text-sm font-medium text-emerald-700 mb-8 shadow-sm">
            <TrendingUp className="h-4 w-4" />
            14-day free trial on Pro
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1]">
            Simple, Transparent
            <br />
            <span className="text-emerald-600">Pricing</span>
          </h1>

          <p className="mt-8 text-xl sm:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
            Choose the plan that fits your trading style. Start with a free
            trial, upgrade when you&apos;re ready.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-32 lg:pb-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3 lg:gap-6">
            {tiers.map((tier) => {
              const IconComponent = tier.icon;
              return (
                <div
                  key={tier.name}
                  className={`relative rounded-3xl ${
                    tier.highlighted
                      ? "border-2 border-emerald-500 shadow-2xl shadow-emerald-500/20 scale-[1.02] lg:scale-105"
                      : "border border-gray-200 shadow-lg"
                  } bg-white p-8 lg:p-10 flex flex-col`}
                >
                  {tier.badge && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-1.5 text-sm font-semibold text-white shadow-lg">
                        <Sparkles className="h-3.5 w-3.5" />
                        {tier.badge}
                      </span>
                    </div>
                  )}

                  {/* Header */}
                  <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${tier.gradient} text-white shadow-lg`}
                      >
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {tier.name}
                      </h3>
                    </div>

                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-5xl font-bold text-gray-900">
                        £{tier.price}
                      </span>
                      <span className="text-gray-500 text-lg">/month</span>
                    </div>

                    <p className="text-gray-600 leading-relaxed">
                      {tier.description}
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="mb-10 flex-1 space-y-4">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        {feature.included ? (
                          <div className="flex-shrink-0 h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5">
                            <Check className="h-3 w-3 text-emerald-600" />
                          </div>
                        ) : (
                          <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
                            <X className="h-3 w-3 text-gray-400" />
                          </div>
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

                  {/* CTA */}
                  <Link
                    href={tier.href}
                    className={`group mt-auto flex items-center justify-center gap-2 w-full rounded-full py-4 text-base font-semibold transition-all duration-200 ${
                      tier.highlighted
                        ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:-translate-y-0.5"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    }`}
                  >
                    {tier.cta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Annual discount note */}
          <p className="mt-12 text-center text-gray-500">
            Save 17% with annual billing.{" "}
            <Link
              href="/contact"
              className="text-emerald-600 font-medium hover:text-emerald-700"
            >
              Contact us
            </Link>{" "}
            for custom enterprise pricing.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 lg:py-32 bg-gray-50">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600 mb-4">
              FAQ
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Everything you need to know about TradeSmart pricing.
            </p>
          </div>

          <FAQ items={faqs} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/30 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 tracking-tight">
            Ready to Find Your Edge?
          </h2>
          <p className="text-xl text-emerald-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join traders using TradeSmart to discover profitable opportunities
            across betting, stocks, and crypto markets.
          </p>

          <Link
            href="/login?plan=pro"
            className="group inline-flex items-center gap-3 rounded-full bg-white px-10 py-5 text-lg font-semibold text-emerald-700 hover:bg-gray-50 transition-all duration-200 shadow-xl shadow-black/20 hover:shadow-2xl hover:-translate-y-0.5"
          >
            Start 14-Day Free Trial
            <TrendingUp className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>

          <p className="mt-6 text-sm text-emerald-200">
            No credit card required. Cancel anytime.
          </p>
        </div>
      </section>
    </>
  );
}

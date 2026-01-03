"use client";

import Link from "next/link";
import {
  Check,
  X,
  Zap,
  Trophy,
  Crown,
  Gift,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  BarChart3,
  MessageSquare,
  Cpu,
  Code,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

const tiers = [
  {
    name: "Free",
    price: "0",
    description: "Try TradeSmart with sample data",
    icon: Gift,
    features: [
      { text: "Demo mode only", included: true },
      { text: "Sample data", included: true },
      { text: "Limited features preview", included: true },
      { text: "Betting arbitrage scanner", included: false },
      { text: "Real-time alerts", included: false },
      { text: "AI-powered insights", included: false },
    ],
    cta: "Start Free",
    href: "/auth/signup?plan=free",
    highlighted: false,
    badge: null,
  },
  {
    name: "Starter",
    price: "19",
    description: "Perfect for casual arbitrage hunters",
    icon: Zap,
    features: [
      { text: "Betting arbitrage scanner", included: true },
      { text: "3 sports leagues", included: true },
      { text: "Daily briefings", included: true },
      { text: "Email alerts", included: true },
      { text: "100 scans/day", included: true },
      { text: "Stock momentum scanner", included: false },
      { text: "Crypto funding rates", included: false },
      { text: "WhatsApp alerts", included: false },
    ],
    cta: "Get Started",
    href: "/auth/signup?plan=starter",
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
      { text: "1,000 scans/day", included: true },
      { text: "API access", included: false },
      { text: "Custom integrations", included: false },
    ],
    cta: "Start Free Trial",
    href: "/auth/signup?plan=pro",
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
      { text: "Priority support", included: true },
      { text: "White-label option", included: true },
      { text: "Custom integrations", included: true },
      { text: "Dedicated account manager", included: true },
    ],
    cta: "Contact Sales",
    href: "/auth/signup?plan=enterprise",
    highlighted: false,
    badge: null,
  },
];

const faqs = [
  {
    question: "How does the free trial work?",
    answer:
      "Start with our Free tier to explore with sample data. Upgrade to Pro for a 14-day free trial with full access. No credit card required.",
  },
  {
    question: "What's included in each plan?",
    answer:
      "Free: Demo mode with sample data. Starter: Betting arbitrage for 3 leagues. Pro: All scanners (betting, stocks, crypto) plus WhatsApp alerts. Enterprise: Unlimited access with API.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes, all plans are month-to-month with no commitment. Cancel anytime from your dashboard and retain access until the end of your billing period.",
  },
  {
    question: "Do you offer annual billing?",
    answer:
      "Yes! Contact us for annual billing and receive 2 months free. Enterprise customers also benefit from custom pricing.",
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-zinc-800 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-5 text-left transition-colors hover:text-emerald-400"
      >
        <span className="text-base font-medium text-zinc-100">{question}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-zinc-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-zinc-400" />
        )}
      </button>
      {isOpen && (
        <div className="pb-5 text-zinc-400 leading-relaxed">{answer}</div>
      )}
    </div>
  );
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500">
              <TrendingUp className="h-5 w-5 text-black" />
            </div>
            <span className="text-xl font-bold text-white">TradeSmart</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-black hover:bg-emerald-400 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-400 mb-6">
            <Sparkles className="h-4 w-4" />
            14-day free trial on Pro
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto">
            Choose the plan that fits your trading style. Start free, upgrade
            when you&apos;re ready. All plans include our core scanning
            technology.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 lg:grid-cols-4 md:grid-cols-2">
            {tiers.map((tier) => {
              const IconComponent = tier.icon;
              return (
                <div
                  key={tier.name}
                  className={`relative rounded-2xl border ${
                    tier.highlighted
                      ? "border-emerald-500 bg-gradient-to-b from-emerald-500/10 to-zinc-900"
                      : "border-zinc-800 bg-zinc-900"
                  } p-6 flex flex-col`}
                >
                  {tier.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-black">
                        {tier.badge}
                      </span>
                    </div>
                  )}

                  <div className="mb-4 flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        tier.highlighted
                          ? "bg-emerald-500 text-black"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                      {tier.name}
                    </h3>
                  </div>

                  <div className="mb-2">
                    <span className="text-4xl font-bold text-white">
                      {tier.price === "0" ? "Free" : `£${tier.price}`}
                    </span>
                    {tier.price !== "0" && (
                      <span className="text-zinc-400">/month</span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-400 mb-6">
                    {tier.description}
                  </p>

                  <ul className="mb-6 flex-1 space-y-3">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="h-5 w-5 text-zinc-600 flex-shrink-0 mt-0.5" />
                        )}
                        <span
                          className={
                            feature.included ? "text-zinc-300" : "text-zinc-600"
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
                        ? "bg-emerald-500 text-black hover:bg-emerald-400"
                        : "bg-zinc-800 text-white hover:bg-zinc-700"
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

      {/* Features Comparison */}
      <section className="border-t border-zinc-800 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-2xl font-bold text-white text-center mb-4">
            What&apos;s included in each plan
          </h2>
          <p className="text-zinc-400 text-center mb-12 max-w-2xl mx-auto">
            Every plan is built on our core AI scanning technology. Higher tiers
            unlock more markets, faster alerts, and advanced features.
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 mb-4">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Betting Arbitrage Scanner
              </h3>
              <p className="text-zinc-400 text-sm">
                Find guaranteed profit opportunities across bookmakers. Our
                scanner compares odds in real-time and calculates optimal stake
                distribution.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400 mb-4">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Stock Momentum Scanner
              </h3>
              <p className="text-zinc-400 text-sm">
                Identify stocks showing unusual momentum patterns before they
                break out. Combines technical analysis with volume signals. Pro
                and above.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 mb-4">
                <Cpu className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Crypto Funding Rates
              </h3>
              <p className="text-zinc-400 text-sm">
                Track perpetual funding rates across exchanges. Spot arbitrage
                opportunities and predict market sentiment shifts. Pro and
                above.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 mb-4">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Real-Time Alerts
              </h3>
              <p className="text-zinc-400 text-sm">
                Get notified instantly via WhatsApp when opportunities arise.
                Never miss a trade again with sub-second alert delivery. Pro and
                above.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400 mb-4">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                AI-Powered Insights
              </h3>
              <p className="text-zinc-400 text-sm">
                Our AI explains why opportunities exist, predicts how long
                they&apos;ll last, and provides confidence scores for each
                alert. Pro and above.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 mb-4">
                <Code className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                API Access
              </h3>
              <p className="text-zinc-400 text-sm">
                Integrate TradeSmart data into your own trading systems,
                spreadsheets, or custom applications. Full REST API. Enterprise
                only.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t border-zinc-800 py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-2xl font-bold text-white text-center mb-4">
            Frequently asked questions
          </h2>
          <p className="text-zinc-400 text-center mb-12">
            Everything you need to know about TradeSmart pricing and features.
          </p>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 px-6">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-zinc-800 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to find your edge?
            </h2>
            <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
              Join thousands of traders using TradeSmart to discover profitable
              opportunities across betting, stocks, and crypto markets.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/signup?plan=pro"
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-3 text-sm font-semibold text-black hover:bg-emerald-400 transition-colors"
              >
                Start 14-Day Free Trial
                <TrendingUp className="h-4 w-4" />
              </Link>
              <Link
                href="/auth/signup?plan=free"
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors"
              >
                Try Free Demo
              </Link>
            </div>
            <p className="mt-6 text-xs text-zinc-500">
              No credit card required. Cancel anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-emerald-500">
                <TrendingUp className="h-4 w-4 text-black" />
              </div>
              <span className="text-sm text-zinc-400">
                TradeSmart - Market Intelligence Platform
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-zinc-500">
              <Link
                href="/terms"
                className="hover:text-zinc-300 transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="hover:text-zinc-300 transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/contact"
                className="hover:text-zinc-300 transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

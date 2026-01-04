import { Metadata } from "next";
import Link from "next/link";
import { BRAND_CONFIG } from "@/lib/brand-config";

export const metadata: Metadata = {
  title: `Pricing - ${BRAND_CONFIG.name}`,
  description:
    "Simple, transparent pricing for TradeSmart. Start free, upgrade when ready.",
};

const tiers = [
  {
    name: "Free",
    price: "£0",
    period: "forever",
    description: "Try the scanner with sample data",
    features: [
      "Demo mode only",
      "Sample market data",
      "Basic dashboard access",
      "Email support",
    ],
    cta: "Try Demo",
    href: "/login?signup=true&plan=free",
    highlighted: false,
  },
  {
    name: "Starter",
    price: "£19",
    period: "/month",
    description: "Perfect for getting started",
    features: [
      "1 market of your choice",
      "100 scans per day",
      "Email alerts",
      "Basic analytics",
      "7-day free trial",
    ],
    cta: "Start Free Trial",
    href: "/login?signup=true&plan=starter",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "£49",
    period: "/month",
    description: "For serious traders and bettors",
    features: [
      "2 markets of your choice",
      "500 scans per day",
      "Real-time WhatsApp alerts",
      "AI-powered daily briefings",
      "Advanced stake calculator",
      "Priority support",
      "7-day free trial",
    ],
    cta: "Start Free Trial",
    href: "/login?signup=true&plan=pro",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Unlimited",
    price: "£99",
    period: "/month",
    description: "Full access to everything",
    features: [
      "All 3 markets included",
      "Unlimited scans",
      "All Pro features",
      "Full API access",
      "Custom integrations",
      "Dedicated account manager",
      "Priority support",
    ],
    cta: "Start Free Trial",
    href: "/login?signup=true&plan=unlimited",
    highlighted: false,
  },
];

const faqs = [
  {
    question: "What markets do you cover?",
    answer:
      "We scan three markets: stocks (FTSE 100 & S&P 500), cryptocurrencies (major coins across exchanges), and betting (UK bookmakers for football and other sports).",
  },
  {
    question: "How do the alerts work?",
    answer:
      "When our AI finds an opportunity that meets your criteria, you'll receive an instant notification via your chosen channel - email for Starter plans, WhatsApp and email for Pro and above.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes, you can cancel your subscription at any time from your dashboard. No long-term contracts or cancellation fees. You'll retain access until the end of your billing period.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes! All paid plans include a 7-day free trial. No credit card required to start. You can also use the Free tier indefinitely with sample data.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit and debit cards via Stripe. For bespoke billing arrangements, contact us.",
  },
  {
    question: "How accurate is the AI scoring?",
    answer:
      "Our AI analyzes multiple signals to generate confidence scores. While no prediction system is perfect, our Pro users report significantly higher win rates when focusing on 80%+ confidence signals.",
  },
  {
    question: "Can I change plans later?",
    answer:
      "Absolutely. You can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the prorated difference. When downgrading, the change takes effect at your next billing date.",
  },
];

export default function PricingPage() {
  return (
    <div className="flex flex-col">
      {/* Pricing Header */}
      <section className="bg-gradient-to-b from-background to-muted/30 px-4 py-20 md:px-6 md:py-28">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Start with a free demo. Upgrade when you&apos;re ready to scan live
            markets with real-time alerts.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-4 py-12 md:px-6 md:py-16">
        <div className="container mx-auto">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-lg border-2 bg-card p-6 ${
                  tier.highlighted
                    ? "border-primary shadow-lg"
                    : "border-border"
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                      {tier.badge}
                    </span>
                  </div>
                )}
                <div className="pt-2">
                  <h3 className="text-xl font-bold">{tier.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {tier.description}
                  </p>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    <span className="ml-1 text-muted-foreground">
                      {tier.period}
                    </span>
                  </div>
                  <ul className="mt-6 space-y-3">
                    {tier.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm"
                      >
                        <svg
                          className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={tier.href}
                    className={`mt-8 flex h-11 w-full items-center justify-center rounded-md text-sm font-medium transition-colors ${
                      tier.highlighted
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    {tier.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Note */}
      <section className="px-4 py-8 md:px-6">
        <div className="container mx-auto">
          <div className="mx-auto max-w-2xl rounded-lg border bg-muted/30 p-6 text-center">
            <p className="text-sm text-muted-foreground">
              All paid plans include a{" "}
              <span className="font-medium text-foreground">
                7-day free trial
              </span>
              . No credit card required to start. Cancel anytime.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-muted/30 px-4 py-20 md:px-6 md:py-28">
        <div className="container mx-auto">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-muted-foreground">
              Everything you need to know about TradeSmart pricing and plans.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-3xl space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-lg border bg-card p-6 transition-shadow hover:shadow-sm"
              >
                <h3 className="text-lg font-semibold">{faq.question}</h3>
                <p className="mt-2 text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-20 md:px-6 md:py-28">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Ready to start scanning?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Join traders and bettors who use TradeSmart to find profitable
            opportunities every day.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/login?signup=true"
              className="inline-flex h-12 w-full items-center justify-center rounded-md bg-primary px-8 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
            >
              Start Your Free Trial
              <svg
                className="ml-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
            <Link
              href={`mailto:${BRAND_CONFIG.salesEmail}`}
              className="inline-flex h-12 w-full items-center justify-center rounded-md border border-input bg-background px-8 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground sm:w-auto"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

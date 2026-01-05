import { Metadata } from "next";
import Link from "next/link";
import { BRAND_CONFIG } from "@/lib/brand-config";

export const metadata: Metadata = {
  title: `${BRAND_CONFIG.name} - ${BRAND_CONFIG.tagline}`,
  description: BRAND_CONFIG.description,
  keywords: [
    "AI trading scanner",
    "crypto scanner",
    "stock scanner",
    "betting arbitrage",
    "opportunity finder",
    "automated trading alerts",
    "multi-asset scanner",
  ],
  openGraph: {
    title: `${BRAND_CONFIG.name} - ${BRAND_CONFIG.tagline}`,
    description: BRAND_CONFIG.description,
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND_CONFIG.name} - ${BRAND_CONFIG.tagline}`,
    description: BRAND_CONFIG.description,
  },
  alternates: {
    canonical: "/",
  },
};

const features = [
  {
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ),
    title: "Stock Signals",
    description:
      "RSI crossovers, golden crosses, and volume spikes across FTSE 100 and S&P 500 stocks.",
  },
  {
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    title: "Crypto Analysis",
    description:
      "Funding rate opportunities, Fear & Greed signals, and exchange spread detection.",
  },
  {
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    title: "Betting Arbitrage",
    description:
      "Guaranteed profit opportunities and value bets across major UK bookmakers.",
  },
  {
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
    title: "AI-Powered Scoring",
    description:
      "Every opportunity is scored by AI so you see the highest-confidence signals first.",
  },
  {
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
    ),
    title: "Instant Alerts",
    description:
      "Real-time notifications via WhatsApp or email the moment opportunities appear.",
  },
  {
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    ),
    title: "Stake Calculator",
    description:
      "Optimal stake sizes calculated automatically based on your risk tolerance.",
  },
];

const steps = [
  {
    number: "01",
    title: "Connect Your Markets",
    description:
      "Sign up and choose which markets to scan: stocks, crypto, betting, or all three.",
  },
  {
    number: "02",
    title: "AI Scans 24/7",
    description:
      "Our AI continuously monitors markets and identifies opportunities in real-time.",
  },
  {
    number: "03",
    title: "Get Alerts & Act",
    description:
      "Receive scored opportunities via WhatsApp or email with calculated stake sizes.",
  },
];

const testimonials = [
  {
    quote:
      "TradeSmart found arbitrage opportunities I was missing manually. Paid for itself in the first week.",
    author: "James T.",
    role: "Professional Bettor",
    avatar: "JT",
  },
  {
    quote:
      "The AI scoring is spot on. I only act on 90%+ confidence signals now and my win rate has doubled.",
    author: "Sarah K.",
    role: "Day Trader",
    avatar: "SK",
  },
  {
    quote:
      "Finally one dashboard for all my market scanning. The crypto funding rate alerts alone are worth the subscription.",
    author: "Michael R.",
    role: "Crypto Investor",
    avatar: "MR",
  },
];

const stats = [
  { value: "3", label: "Markets Scanned" },
  { value: "24/7", label: "Real-time Scanning" },
  { value: "AI", label: "Powered Analysis" },
  { value: "<1min", label: "Alert Delivery" },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 px-4 py-20 md:px-6 md:py-32">
        <div className="container mx-auto">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm">
              <svg
                className="h-4 w-4 text-primary"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              <span>AI-Powered Multi-Asset Scanner</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Find Your Edge
              <br />
              <span className="text-muted-foreground">Across Markets</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              The intelligent scanner that finds profitable opportunities across{" "}
              <span className="font-medium text-foreground">stocks</span>,{" "}
              <span className="font-medium text-foreground">crypto</span>, and{" "}
              <span className="font-medium text-foreground">
                betting markets
              </span>
              . Powered by AI.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/login?signup=true"
                className="inline-flex h-12 w-full items-center justify-center rounded-md bg-primary px-8 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
              >
                Get Started Free
                <svg
                  className="ml-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
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
                href="#how-it-works"
                className="inline-flex h-12 w-full items-center justify-center rounded-md border border-input bg-background px-8 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground sm:w-auto"
              >
                See How It Works
              </Link>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 blur-3xl">
            <div className="aspect-square w-[600px] rounded-full bg-primary/10" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/30 px-4 py-12 md:px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-primary md:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="px-4 py-20 md:px-6 md:py-28">
        <div className="container mx-auto">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-destructive">
                The Problem
              </h2>
              <h3 className="mt-2 text-2xl font-bold md:text-3xl">
                Manual scanning wastes time
              </h3>
              <ul className="mt-6 space-y-4 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-destructive">&#x2717;</span>
                  Checking multiple platforms and apps constantly
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-destructive">&#x2717;</span>
                  Missing opportunities while away from screens
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-destructive">&#x2717;</span>
                  No way to rank which opportunities are worth acting on
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-destructive">&#x2717;</span>
                  Calculating stake sizes manually under time pressure
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">
                The Solution
              </h2>
              <h3 className="mt-2 text-2xl font-bold md:text-3xl">
                Let AI do the scanning
              </h3>
              <ul className="mt-6 space-y-4 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <svg
                    className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  One dashboard for stocks, crypto, and betting
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  24/7 monitoring with instant alerts
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  AI confidence scores rank every opportunity
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Stake sizes calculated automatically
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="bg-muted/30 px-4 py-20 md:px-6 md:py-28"
      >
        <div className="container mx-auto">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              Start scanning in under 2 minutes
            </h2>
            <p className="mt-4 text-muted-foreground">
              No complex setup. No API keys. Just sign up and start finding
              opportunities.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {index < steps.length - 1 && (
                  <div className="absolute left-1/2 top-12 hidden h-0.5 w-full -translate-y-1/2 bg-border md:block" />
                )}
                <div className="relative flex flex-col items-center text-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-primary bg-background text-2xl font-bold text-primary">
                    {step.number}
                  </div>
                  <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>
                  <p className="mt-2 text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-20 md:px-6 md:py-28">
        <div className="container mx-auto">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              Everything you need to find your edge
            </h2>
            <p className="mt-4 text-muted-foreground">
              Powerful AI tools designed for traders and bettors who want an
              unfair advantage.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-lg border-2 bg-card p-6 transition-shadow hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/features"
              className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Explore All Features
              <svg
                className="ml-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="bg-muted/30 px-4 py-20 md:px-6 md:py-28">
        <div className="container mx-auto">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              Trusted by traders and bettors
            </h2>
            <p className="mt-4 text-muted-foreground">
              See how others are using TradeSmart to find their edge.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.author}
                className="rounded-lg border-2 bg-card p-6"
              >
                <div
                  className="flex items-center gap-1"
                  role="img"
                  aria-label="5 out of 5 stars"
                >
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="h-5 w-5 fill-primary text-primary"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-medium">
                      {testimonial.author}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 md:px-6 md:py-28">
        <div className="container mx-auto">
          <div className="mx-auto max-w-3xl rounded-2xl bg-primary px-6 py-12 text-center text-primary-foreground md:px-12 md:py-16">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <h2 className="mt-6 text-3xl font-bold md:text-4xl">
              Ready to find your edge?
            </h2>
            <p className="mx-auto mt-4 max-w-xl opacity-90">
              Join traders and bettors already using TradeSmart to discover
              profitable opportunities across markets.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/pricing"
                className="inline-flex h-12 w-full items-center justify-center rounded-md bg-background px-8 text-base font-medium text-foreground transition-colors hover:bg-background/90 sm:w-auto"
              >
                View Pricing
                <svg
                  className="ml-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
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
                href="/features"
                className="inline-flex h-12 w-full items-center justify-center rounded-md border border-primary-foreground/20 px-8 text-base font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/10 sm:w-auto"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

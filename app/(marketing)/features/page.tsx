import { Metadata } from "next";
import Link from "next/link";
import { BRAND_CONFIG } from "@/lib/brand-config";

export const metadata: Metadata = {
  title: `Features - ${BRAND_CONFIG.name}`,
  description:
    "Discover all the powerful features of TradeSmart. AI-powered scanning across stocks, crypto, and betting markets.",
};

const scannerFeatures = [
  {
    title: "Betting Arbitrage Scanner",
    description:
      "Find guaranteed profit opportunities across UK bookmakers. Our AI identifies odds discrepancies that create risk-free profit windows.",
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ),
    highlights: [
      "Real-time odds monitoring across 10+ bookmakers",
      "Automatic stake calculator for optimal profit",
      "Alert when margins exceed your threshold",
      "Support for football, tennis, basketball, and more",
    ],
  },
  {
    title: "Value Bet Finder",
    description:
      "Discover bets where bookmaker odds are higher than the true probability. Our AI calculates expected value for every opportunity.",
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    highlights: [
      "AI confidence scoring on every bet",
      "Historical performance tracking",
      "Filter by sport, league, or market type",
      "Expected value calculation in real-time",
    ],
  },
  {
    title: "Stock Momentum Scanner",
    description:
      "Technical analysis on FTSE 100 and S&P 500 stocks. Identify RSI crossovers, golden crosses, and volume spikes before they move.",
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    highlights: [
      "RSI, MACD, and moving average signals",
      "Volume spike detection",
      "Pre-market and after-hours monitoring",
      "Sector rotation analysis",
    ],
  },
  {
    title: "Crypto Funding Rate Scanner",
    description:
      "Capture funding rate arbitrage and sentiment-driven opportunities across major exchanges. Earn yield while managing risk.",
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    highlights: [
      "Funding rate monitoring across exchanges",
      "Fear & Greed index integration",
      "Exchange spread detection",
      "Liquidation level warnings",
    ],
  },
];

const aiFeatures = [
  {
    title: "AI Confidence Scoring",
    description:
      "Every opportunity is scored by our AI model. Focus on high-confidence signals and ignore the noise.",
    icon: "🎯",
  },
  {
    title: "Smart Alerts",
    description:
      "Get notified instantly via WhatsApp or email when opportunities match your criteria.",
    icon: "🔔",
  },
  {
    title: "Stake Calculator",
    description:
      "Optimal stake sizes calculated automatically based on your risk tolerance and bankroll.",
    icon: "🧮",
  },
  {
    title: "Performance Analytics",
    description:
      "Track your win rate, ROI, and P&L over time. See which strategies work best for you.",
    icon: "📊",
  },
  {
    title: "Portfolio Tracking",
    description:
      "Monitor all your open positions across betting, stocks, and crypto in one place.",
    icon: "💼",
  },
  {
    title: "Educational Guides",
    description:
      "Learn the strategies behind each scanner with our comprehensive guide library.",
    icon: "📚",
  },
];

export default function FeaturesPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted/30 px-4 py-20 md:px-6 md:py-28">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Powerful Features for
            <br />
            <span className="text-primary">Serious Traders</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Everything you need to find profitable opportunities across stocks,
            crypto, and betting markets. Powered by AI.
          </p>
        </div>
      </section>

      {/* Scanner Features */}
      <section className="px-4 py-20 md:px-6 md:py-28">
        <div className="container mx-auto">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              Four Scanners, One Dashboard
            </h2>
            <p className="mt-4 text-muted-foreground">
              Each scanner is purpose-built for its market, with AI-powered
              analysis and real-time alerts.
            </p>
          </div>

          <div className="mt-16 space-y-16">
            {scannerFeatures.map((feature, index) => (
              <div
                key={feature.title}
                className={`flex flex-col gap-8 lg:flex-row lg:items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className="flex-1">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="mt-6 text-2xl font-bold">{feature.title}</h3>
                  <p className="mt-4 text-muted-foreground">
                    {feature.description}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {feature.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-start gap-3">
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
                        <span className="text-sm text-muted-foreground">
                          {highlight}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1">
                  <div className="aspect-video rounded-xl border-2 bg-muted/30 p-8">
                    <div className="flex h-full items-center justify-center text-6xl opacity-20">
                      {feature.icon}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Features Grid */}
      <section className="bg-muted/30 px-4 py-20 md:px-6 md:py-28">
        <div className="container mx-auto">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              AI-Powered Intelligence
            </h2>
            <p className="mt-4 text-muted-foreground">
              Our AI does the heavy lifting so you can focus on execution.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {aiFeatures.map((feature) => (
              <div
                key={feature.title}
                className="rounded-lg border-2 bg-card p-6 transition-shadow hover:shadow-lg"
              >
                <div className="text-4xl">{feature.icon}</div>
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 md:px-6 md:py-28">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Ready to start scanning?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Try TradeSmart free with demo data, or start your 7-day trial to
            access live market scanning.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/pricing"
              className="inline-flex h-12 w-full items-center justify-center rounded-md bg-primary px-8 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
            >
              View Pricing
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
              href="/login?signup=true"
              className="inline-flex h-12 w-full items-center justify-center rounded-md border border-input bg-background px-8 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground sm:w-auto"
            >
              Try Free Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

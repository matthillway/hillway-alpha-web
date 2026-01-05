import Link from "next/link";
import { Metadata } from "next";
import { BRAND_CONFIG } from "@/lib/brand-config";

export const metadata: Metadata = {
  title: `Compare ${BRAND_CONFIG.name} to Alternatives | Betting & Trading Tools`,
  description: `See how ${BRAND_CONFIG.name} compares to OddsMonkey, BetBurger, RebelBetting and other tools. Multi-asset scanner vs single-purpose alternatives.`,
  keywords: [
    "TradeSmart alternatives",
    "OddsMonkey comparison",
    "BetBurger alternative",
    "RebelBetting vs TradeSmart",
    "betting scanner comparison",
    "arbitrage tool comparison",
    "value betting software",
  ],
};

const competitors = [
  {
    name: "OddsMonkey",
    slug: "oddsmonkey",
    tagline: "UK's leading matched betting tool",
    price: "~£24.99/mo",
    focus: "Matched betting only",
    description:
      "OddsMonkey specializes in matched betting with calculators and training. Great for beginners learning matched betting, but limited to that single strategy.",
  },
  {
    name: "BetBurger",
    slug: "betburger",
    tagline: "Professional arbitrage scanner",
    price: "~€59/mo",
    focus: "Sports arbitrage only",
    description:
      "BetBurger is a powerful arbitrage scanner covering many bookmakers. Excellent for arbing, but focused solely on sports betting arbitrage opportunities.",
  },
  {
    name: "RebelBetting",
    slug: "rebelbetting",
    tagline: "Value betting software",
    price: "~€89/mo",
    focus: "Value betting only",
    description:
      "RebelBetting finds overpriced odds for value betting. Strong track record in value betting, but doesn't cover other markets or opportunity types.",
  },
];

export default function ComparePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted/30 px-4 py-20 md:px-6 md:py-28">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Compare {BRAND_CONFIG.name}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            See how {BRAND_CONFIG.name} stacks up against single-purpose betting
            tools. We cover betting, stocks, and crypto in one platform.
          </p>
        </div>
      </section>

      {/* Why Compare Section */}
      <section className="px-4 py-12 md:px-6 md:py-16">
        <div className="container mx-auto">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold md:text-3xl">
              One Tool for Multiple Markets
            </h2>
            <p className="mt-4 text-muted-foreground">
              Most betting tools focus on a single strategy or market.{" "}
              {BRAND_CONFIG.name} is different - we scan across betting, stocks,
              and crypto to find the best opportunities wherever they appear.
              Plus, our AI analysis helps you understand <em>why</em> each
              opportunity exists.
            </p>
          </div>

          {/* Key Differentiators */}
          <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-3">
            <div className="rounded-lg border bg-card p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 font-semibold">Multi-Asset Coverage</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Betting, stocks, and crypto in one dashboard. Don&apos;t limit
                yourself to one market.
              </p>
            </div>

            <div className="rounded-lg border bg-card p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 font-semibold">AI-Powered Analysis</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Understand why opportunities exist, not just where they are.
                Make smarter decisions.
              </p>
            </div>

            <div className="rounded-lg border bg-card p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 font-semibold">Better Value</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                One subscription covers multiple markets. Save money compared to
                using separate tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Competitor Comparison Cards */}
      <section className="bg-muted/30 px-4 py-20 md:px-6 md:py-28">
        <div className="container mx-auto">
          <h2 className="text-center text-2xl font-bold md:text-3xl">
            Detailed Comparisons
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            Click through to see how {BRAND_CONFIG.name} compares to each
            competitor in detail.
          </p>

          <div className="mx-auto mt-12 grid max-w-5xl gap-8 md:grid-cols-3">
            {competitors.map((competitor) => (
              <Link
                key={competitor.slug}
                href={`/compare/${competitor.slug}`}
                className="group rounded-lg border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold group-hover:text-primary">
                      vs {competitor.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {competitor.tagline}
                    </p>
                  </div>
                  <svg
                    className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>

                <div className="mt-4 flex items-center gap-4 text-sm">
                  <span className="rounded-full bg-muted px-3 py-1">
                    {competitor.price}
                  </span>
                  <span className="text-muted-foreground">
                    {competitor.focus}
                  </span>
                </div>

                <p className="mt-4 text-sm text-muted-foreground">
                  {competitor.description}
                </p>

                <div className="mt-4 text-sm font-medium text-primary">
                  View full comparison
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Summary Table */}
      <section className="px-4 py-20 md:px-6 md:py-28">
        <div className="container mx-auto">
          <h2 className="text-center text-2xl font-bold md:text-3xl">
            Quick Comparison
          </h2>

          <div className="mx-auto mt-12 max-w-4xl overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b">
                  <th className="pb-4 pr-4 font-semibold">Feature</th>
                  <th className="pb-4 pr-4 font-semibold text-primary">
                    {BRAND_CONFIG.name}
                  </th>
                  <th className="pb-4 pr-4 font-semibold">OddsMonkey</th>
                  <th className="pb-4 pr-4 font-semibold">BetBurger</th>
                  <th className="pb-4 font-semibold">RebelBetting</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-4 pr-4 font-medium">Starting Price</td>
                  <td className="py-4 pr-4 text-primary">Free / £19/mo</td>
                  <td className="py-4 pr-4">~£24.99/mo</td>
                  <td className="py-4 pr-4">~€59/mo</td>
                  <td className="py-4">~€89/mo</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 pr-4 font-medium">Betting Coverage</td>
                  <td className="py-4 pr-4">
                    <CheckIcon />
                  </td>
                  <td className="py-4 pr-4">
                    <CheckIcon />
                  </td>
                  <td className="py-4 pr-4">
                    <CheckIcon />
                  </td>
                  <td className="py-4">
                    <CheckIcon />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 pr-4 font-medium">Stock Scanning</td>
                  <td className="py-4 pr-4">
                    <CheckIcon />
                  </td>
                  <td className="py-4 pr-4">
                    <CrossIcon />
                  </td>
                  <td className="py-4 pr-4">
                    <CrossIcon />
                  </td>
                  <td className="py-4">
                    <CrossIcon />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 pr-4 font-medium">Crypto Scanning</td>
                  <td className="py-4 pr-4">
                    <CheckIcon />
                  </td>
                  <td className="py-4 pr-4">
                    <CrossIcon />
                  </td>
                  <td className="py-4 pr-4">
                    <CrossIcon />
                  </td>
                  <td className="py-4">
                    <CrossIcon />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 pr-4 font-medium">AI Analysis</td>
                  <td className="py-4 pr-4">
                    <CheckIcon />
                  </td>
                  <td className="py-4 pr-4">
                    <CrossIcon />
                  </td>
                  <td className="py-4 pr-4">
                    <CrossIcon />
                  </td>
                  <td className="py-4">
                    <CrossIcon />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 pr-4 font-medium">WhatsApp Alerts</td>
                  <td className="py-4 pr-4">
                    <CheckIcon />
                  </td>
                  <td className="py-4 pr-4">
                    <CrossIcon />
                  </td>
                  <td className="py-4 pr-4">
                    <CrossIcon />
                  </td>
                  <td className="py-4">
                    <CrossIcon />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 pr-4 font-medium">Free Tier</td>
                  <td className="py-4 pr-4">
                    <CheckIcon />
                  </td>
                  <td className="py-4 pr-4">Trial only</td>
                  <td className="py-4 pr-4">
                    <CrossIcon />
                  </td>
                  <td className="py-4">Trial only</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 px-4 py-20 md:px-6 md:py-28">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Ready to scan multiple markets?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Try {BRAND_CONFIG.name} free and discover opportunities across
            betting, stocks, and crypto - all in one place.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/login?signup=true"
              className="inline-flex h-12 w-full items-center justify-center rounded-md bg-primary px-8 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
            >
              Start Free Trial
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
              href="/pricing"
              className="inline-flex h-12 w-full items-center justify-center rounded-md border border-input bg-background px-8 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground sm:w-auto"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      className="h-5 w-5 text-primary"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg
      className="h-5 w-5 text-muted-foreground"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

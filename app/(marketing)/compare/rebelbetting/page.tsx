import Link from "next/link";
import { Metadata } from "next";
import { BRAND_CONFIG } from "@/lib/brand-config";

export const metadata: Metadata = {
  title: `${BRAND_CONFIG.name} vs RebelBetting - Value Betting Tool Comparison`,
  description: `Compare ${BRAND_CONFIG.name} to RebelBetting. RebelBetting specializes in value betting. ${BRAND_CONFIG.name} offers value betting plus stocks, crypto, and AI analysis.`,
  keywords: [
    "RebelBetting alternative",
    "RebelBetting vs TradeSmart",
    "value betting software",
    "value betting tool comparison",
    "best value betting software",
    "positive EV betting",
    "expected value betting",
  ],
};

export default function RebelBettingComparisonPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted/30 px-4 py-20 md:px-6 md:py-28">
        <div className="container mx-auto">
          <div className="mx-auto max-w-4xl text-center">
            <Link
              href="/compare"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to comparisons
            </Link>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              {BRAND_CONFIG.name} vs RebelBetting
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              RebelBetting is a proven value betting tool with a strong track
              record. {BRAND_CONFIG.name} offers value betting plus additional
              markets and AI-powered insights.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Summary */}
      <section className="px-4 py-12 md:px-6 md:py-16">
        <div className="container mx-auto">
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
            {/* RebelBetting Card */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-2xl font-bold">RebelBetting</h2>
              <p className="mt-2 text-muted-foreground">
                Professional value betting software
              </p>
              <div className="mt-4">
                <span className="text-3xl font-bold">~€89</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="mt-6 space-y-3">
                <li className="flex items-start gap-3 text-sm">
                  <CheckIcon />
                  <span>Established track record since 2008</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <CheckIcon />
                  <span>Proven +EV (expected value) methodology</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <CheckIcon />
                  <span>Comprehensive profit tracking</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <CheckIcon />
                  <span>Value betting + arbitrage combined</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <CrossIcon />
                  <span className="text-muted-foreground">
                    Betting markets only
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <CrossIcon />
                  <span className="text-muted-foreground">
                    No stocks or crypto
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <CrossIcon />
                  <span className="text-muted-foreground">
                    Higher price point
                  </span>
                </li>
              </ul>
            </div>

            {/* TradeSmart Card */}
            <div className="rounded-lg border-2 border-primary bg-card p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-primary">
                  {BRAND_CONFIG.name}
                </h2>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  Multi-Asset
                </span>
              </div>
              <p className="mt-2 text-muted-foreground">
                AI-powered opportunity scanner
              </p>
              <div className="mt-4">
                <span className="text-3xl font-bold">£49</span>
                <span className="text-muted-foreground">/month</span>
                <span className="ml-2 text-sm text-muted-foreground">
                  (Pro tier)
                </span>
              </div>
              <ul className="mt-6 space-y-3">
                <li className="flex items-start gap-3 text-sm">
                  <CheckIcon />
                  <span>Value betting + arbitrage opportunities</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <CheckIcon />
                  <span>Stock market scanner (FTSE, S&P 500)</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <CheckIcon />
                  <span>Crypto arbitrage across exchanges</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <CheckIcon />
                  <span>AI confidence scoring for every opportunity</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <CheckIcon />
                  <span>WhatsApp + email alerts</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <CheckIcon />
                  <span>Free tier available</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <CheckIcon />
                  <span>~45% cheaper than RebelBetting</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Feature Comparison */}
      <section className="bg-muted/30 px-4 py-20 md:px-6 md:py-28">
        <div className="container mx-auto">
          <h2 className="text-center text-2xl font-bold md:text-3xl">
            Feature Comparison
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            A detailed look at what each platform offers.
          </p>

          <div className="mx-auto mt-12 max-w-4xl overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b">
                  <th className="pb-4 pr-8 font-semibold">Feature</th>
                  <th className="pb-4 pr-8 font-semibold text-primary">
                    {BRAND_CONFIG.name}
                  </th>
                  <th className="pb-4 font-semibold">RebelBetting</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-4 pr-8 font-medium">Price (Pro)</td>
                  <td className="py-4 pr-8 text-primary">£49/mo</td>
                  <td className="py-4">~€89/mo (~£76)</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 pr-8 font-medium">Free Tier</td>
                  <td className="py-4 pr-8">
                    <CheckIcon /> Forever free with demo
                  </td>
                  <td className="py-4">14-day trial only</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 pr-8 font-medium">Value Betting</td>
                  <td className="py-4 pr-8">
                    <CheckIcon />
                  </td>
                  <td className="py-4">
                    <CheckIcon /> Specialized
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 pr-8 font-medium">Arbitrage</td>
                  <td className="py-4 pr-8">
                    <CheckIcon />
                  </td>
                  <td className="py-4">
                    <CheckIcon /> Combined plan
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 pr-8 font-medium">Profit Tracking</td>
                  <td className="py-4 pr-8">Basic dashboard</td>
                  <td className="py-4">
                    <CheckIcon /> Detailed analytics
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 pr-8 font-medium">Stock Scanning</td>
                  <td className="py-4 pr-8">
                    <CheckIcon /> FTSE 100, S&P 500
                  </td>
                  <td className="py-4">
                    <CrossIcon />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 pr-8 font-medium">Crypto Arbitrage</td>
                  <td className="py-4 pr-8">
                    <CheckIcon /> Major exchanges
                  </td>
                  <td className="py-4">
                    <CrossIcon />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 pr-8 font-medium">AI Analysis</td>
                  <td className="py-4 pr-8">
                    <CheckIcon /> Confidence scoring
                  </td>
                  <td className="py-4">EV calculations</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 pr-8 font-medium">WhatsApp Alerts</td>
                  <td className="py-4 pr-8">
                    <CheckIcon /> Pro tier
                  </td>
                  <td className="py-4">
                    <CrossIcon />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 pr-8 font-medium">Years in Business</td>
                  <td className="py-4 pr-8">New (2024)</td>
                  <td className="py-4">Since 2008</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 pr-8 font-medium">API Access</td>
                  <td className="py-4 pr-8">
                    <CheckIcon /> Unlimited tier
                  </td>
                  <td className="py-4">
                    <CrossIcon />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Best For Section */}
      <section className="px-4 py-20 md:px-6 md:py-28">
        <div className="container mx-auto">
          <h2 className="text-center text-2xl font-bold md:text-3xl">
            Which One Is Right for You?
          </h2>

          <div className="mx-auto mt-12 grid max-w-5xl gap-8 md:grid-cols-2">
            {/* RebelBetting Best For */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-xl font-bold">Choose RebelBetting if...</h3>
              <ul className="mt-4 space-y-3">
                <li className="flex items-start gap-3 text-sm">
                  <svg
                    className="mt-0.5 h-5 w-5 shrink-0 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>
                    You want a proven, established value betting platform
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <svg
                    className="mt-0.5 h-5 w-5 shrink-0 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>You focus exclusively on sports value betting</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <svg
                    className="mt-0.5 h-5 w-5 shrink-0 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>
                    You want detailed profit tracking and ROI analytics
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <svg
                    className="mt-0.5 h-5 w-5 shrink-0 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>You prefer a company with 15+ years of experience</span>
                </li>
              </ul>
            </div>

            {/* TradeSmart Best For */}
            <div className="rounded-lg border-2 border-primary bg-card p-6">
              <h3 className="text-xl font-bold text-primary">
                Choose {BRAND_CONFIG.name} if...
              </h3>
              <ul className="mt-4 space-y-3">
                <li className="flex items-start gap-3 text-sm">
                  <CheckIcon />
                  <span>
                    You want opportunities across betting, stocks, AND crypto
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <CheckIcon />
                  <span>
                    You&apos;re looking for better value at a lower price point
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <CheckIcon />
                  <span>
                    You want AI-powered analysis beyond simple EV calculations
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <CheckIcon />
                  <span>
                    You prefer instant WhatsApp alerts for time-sensitive
                    opportunities
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <CheckIcon />
                  <span>You want a free tier to test without commitment</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <CheckIcon />
                  <span>
                    You need API access for building automated strategies
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Value Betting Explained */}
      <section className="bg-muted/30 px-4 py-20 md:px-6 md:py-28">
        <div className="container mx-auto">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-2xl font-bold md:text-3xl">
              Understanding Value Betting
            </h2>
            <div className="mt-8 space-y-6">
              <div className="rounded-lg border bg-card p-6">
                <h3 className="font-semibold">What is Value Betting?</h3>
                <p className="mt-2 text-muted-foreground">
                  Value betting means finding odds that are higher than they
                  should be - situations where the bookmaker has priced an
                  outcome incorrectly. Unlike arbitrage (which guarantees
                  profit), value betting involves risk on individual bets, but
                  over time, consistently betting on +EV (positive expected
                  value) situations should yield profit.
                </p>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <h3 className="font-semibold">RebelBetting&apos;s Approach</h3>
                <p className="mt-2 text-muted-foreground">
                  RebelBetting pioneered value betting software and has refined
                  their approach over 15+ years. They compare odds across
                  bookmakers and sharp (accurate) betting exchanges to identify
                  when a bookmaker&apos;s odds are too high. Their profit
                  tracking helps you see long-term ROI.
                </p>
              </div>

              <div className="rounded-lg border-2 border-primary bg-card p-6">
                <h3 className="font-semibold text-primary">
                  {BRAND_CONFIG.name}&apos;s Approach
                </h3>
                <p className="mt-2 text-muted-foreground">
                  We also identify value bets, but we go further with AI
                  analysis that considers additional signals - not just odds
                  comparison. Our confidence scoring helps you prioritize the
                  best opportunities. Plus, by scanning stocks and crypto too,
                  you have more markets to find edge in.
                </p>
                <p className="mt-4 text-muted-foreground">
                  When bookmakers are tight on value bets, you might find a
                  crypto arbitrage opportunity or a stock breakout pattern.
                  Multiple markets mean more consistent opportunity flow.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Comparison */}
      <section className="px-4 py-20 md:px-6 md:py-28">
        <div className="container mx-auto">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-2xl font-bold md:text-3xl">
              Price Comparison
            </h2>
            <div className="mt-8 rounded-lg border bg-card p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="text-center">
                  <h3 className="font-semibold">RebelBetting</h3>
                  <p className="mt-2 text-3xl font-bold">~€89/mo</p>
                  <p className="text-sm text-muted-foreground">
                    (~£76/mo at current rates)
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Value betting only
                  </p>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-primary">
                    {BRAND_CONFIG.name} Pro
                  </h3>
                  <p className="mt-2 text-3xl font-bold text-primary">£49/mo</p>
                  <p className="text-sm text-muted-foreground">~35% cheaper</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Betting + stocks + crypto
                  </p>
                </div>
              </div>
              <div className="mt-6 border-t pt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Annual savings with {BRAND_CONFIG.name}: approximately{" "}
                  <strong className="text-foreground">£324/year</strong>{" "}
                  compared to RebelBetting
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Verdict */}
      <section className="bg-muted/30 px-4 py-20 md:px-6 md:py-28">
        <div className="container mx-auto">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-2xl font-bold md:text-3xl">
              The Bottom Line
            </h2>
            <div className="mt-8 rounded-lg border bg-card p-6">
              <p className="text-muted-foreground">
                <strong className="text-foreground">RebelBetting</strong> is a
                veteran in the value betting space with a proven track record.
                If you want a specialized, battle-tested value betting tool and
                don&apos;t mind the premium price, it&apos;s a solid choice.
                Their detailed profit tracking is particularly useful for
                serious bettors.
              </p>
              <p className="mt-4 text-muted-foreground">
                <strong className="text-primary">{BRAND_CONFIG.name}</strong>{" "}
                offers a more modern, AI-powered approach at a significantly
                lower price. You get value betting capabilities plus access to
                stocks and crypto - all for less than RebelBetting&apos;s
                betting-only plan. Our AI confidence scoring adds an extra layer
                of analysis beyond traditional EV calculations.
              </p>
              <p className="mt-4 text-muted-foreground">
                For those who want to diversify across multiple markets while
                saving money, {BRAND_CONFIG.name} is the smarter choice. Try our
                free tier to see if it works for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 md:px-6 md:py-28">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Ready to find value across multiple markets?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Try {BRAND_CONFIG.name} free and discover opportunities in betting,
            stocks, and crypto - all with AI-powered analysis at a fraction of
            the cost.
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
  );
}

function CrossIcon() {
  return (
    <svg
      className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground"
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

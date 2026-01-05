import Link from "next/link";
import { Metadata } from "next";
import { BRAND_CONFIG } from "@/lib/brand-config";

export const metadata: Metadata = {
  title: `${BRAND_CONFIG.name} vs OddsMonkey - Matched Betting Alternative Comparison`,
  description: `Compare ${BRAND_CONFIG.name} to OddsMonkey. While OddsMonkey focuses on matched betting only, ${BRAND_CONFIG.name} covers betting, stocks, and crypto with AI analysis.`,
  keywords: [
    "OddsMonkey alternative",
    "OddsMonkey vs TradeSmart",
    "matched betting alternative",
    "multi-asset scanner",
    "betting scanner comparison",
    "OddsMonkey review",
  ],
};

export default function OddsMonkeyComparisonPage() {
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
              {BRAND_CONFIG.name} vs OddsMonkey
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              OddsMonkey is excellent for matched betting beginners. But if you
              want to explore more markets and strategies, {BRAND_CONFIG.name}{" "}
              offers broader coverage.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Summary */}
      <section className="px-4 py-12 md:px-6 md:py-16">
        <div className="container mx-auto">
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
            {/* OddsMonkey Card */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-2xl font-bold">OddsMonkey</h2>
              <p className="mt-2 text-muted-foreground">
                UK&apos;s leading matched betting platform
              </p>
              <div className="mt-4">
                <span className="text-3xl font-bold">~£24.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="mt-6 space-y-3">
                <li className="flex items-start gap-3 text-sm">
                  <CheckIcon />
                  <span>Matched betting calculator & oddsmatcher</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <CheckIcon />
                  <span>Comprehensive training guides</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <CheckIcon />
                  <span>Daily offers and promotions</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <CheckIcon />
                  <span>Community forum</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <CrossIcon />
                  <span className="text-muted-foreground">
                    Matched betting only
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
                  <span className="text-muted-foreground">No AI analysis</span>
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
                <span className="text-3xl font-bold">£19</span>
                <span className="text-muted-foreground">/month</span>
                <span className="ml-2 text-sm text-muted-foreground">
                  (or free tier)
                </span>
              </div>
              <ul className="mt-6 space-y-3">
                <li className="flex items-start gap-3 text-sm">
                  <CheckIcon />
                  <span>Betting opportunities (value bets, arbitrage)</span>
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
                  <span>AI-powered confidence scoring</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <CheckIcon />
                  <span>WhatsApp + email alerts</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <CheckIcon />
                  <span>Free tier available forever</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <CheckIcon />
                  <span>API access for automation</span>
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
                  <th className="pb-4 font-semibold">OddsMonkey</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-4 pr-8 font-medium">Starting Price</td>
                  <td className="py-4 pr-8 text-primary">
                    Free / £19/mo Starter
                  </td>
                  <td className="py-4">~£24.99/mo</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 pr-8 font-medium">Free Tier</td>
                  <td className="py-4 pr-8">
                    <CheckIcon /> Forever free with demo data
                  </td>
                  <td className="py-4">Free trial only</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 pr-8 font-medium">Matched Betting</td>
                  <td className="py-4 pr-8">Value bets + arbitrage</td>
                  <td className="py-4">
                    <CheckIcon /> Specialized tools
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 pr-8 font-medium">Training Resources</td>
                  <td className="py-4 pr-8">AI tips + daily briefings</td>
                  <td className="py-4">
                    <CheckIcon /> Extensive guides
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
                  <td className="py-4">
                    <CrossIcon />
                  </td>
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
                  <td className="py-4 pr-8 font-medium">API Access</td>
                  <td className="py-4 pr-8">
                    <CheckIcon /> Unlimited tier
                  </td>
                  <td className="py-4">
                    <CrossIcon />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 pr-8 font-medium">Community Forum</td>
                  <td className="py-4 pr-8">
                    <CrossIcon />
                  </td>
                  <td className="py-4">
                    <CheckIcon /> Active community
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
            {/* OddsMonkey Best For */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-xl font-bold">Choose OddsMonkey if...</h3>
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
                    You&apos;re new to matched betting and want extensive
                    training
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
                  <span>
                    You want to focus exclusively on matched betting strategies
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
                  <span>
                    You value community support and forums for learning
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
                  <span>You need specialized matched betting calculators</span>
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
                    You want to find opportunities across multiple markets
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <CheckIcon />
                  <span>
                    You&apos;re interested in stocks, crypto, AND betting
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <CheckIcon />
                  <span>
                    You want AI-powered analysis to understand opportunity
                    quality
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <CheckIcon />
                  <span>You prefer instant alerts via WhatsApp over email</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <CheckIcon />
                  <span>You want a free tier to explore before committing</span>
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

      {/* The Verdict */}
      <section className="bg-muted/30 px-4 py-20 md:px-6 md:py-28">
        <div className="container mx-auto">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-2xl font-bold md:text-3xl">
              The Bottom Line
            </h2>
            <div className="mt-8 rounded-lg border bg-card p-6">
              <p className="text-muted-foreground">
                <strong className="text-foreground">OddsMonkey</strong> is an
                excellent choice for people who want to focus specifically on
                matched betting. Their training materials and community make it
                easy for beginners to get started and learn the ropes.
              </p>
              <p className="mt-4 text-muted-foreground">
                However, if you want to diversify beyond matched betting,{" "}
                <strong className="text-primary">{BRAND_CONFIG.name}</strong>{" "}
                offers a broader approach. You can scan betting markets for
                value opportunities, plus explore stocks and crypto - all
                powered by AI that helps you understand which opportunities are
                most likely to succeed.
              </p>
              <p className="mt-4 text-muted-foreground">
                For the price of one OddsMonkey subscription, you get access to
                three different markets with {BRAND_CONFIG.name}. And with our
                free tier, you can try before you commit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 md:px-6 md:py-28">
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

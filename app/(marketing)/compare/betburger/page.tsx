import Link from "next/link";
import { Metadata } from "next";
import { BRAND_CONFIG } from "@/lib/brand-config";

export const metadata: Metadata = {
  title: `${BRAND_CONFIG.name} vs BetBurger - Arbitrage Scanner Comparison`,
  description: `Compare ${BRAND_CONFIG.name} to BetBurger. BetBurger specializes in sports arbitrage. ${BRAND_CONFIG.name} covers arbitrage plus stocks, crypto, and AI analysis.`,
  keywords: [
    "BetBurger alternative",
    "BetBurger vs TradeSmart",
    "arbitrage scanner comparison",
    "sports arbitrage tool",
    "surebets scanner",
    "arbing software",
    "best arbitrage scanner",
  ],
};

export default function BetBurgerComparisonPage() {
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
              {BRAND_CONFIG.name} vs BetBurger
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              BetBurger is a powerful arbitrage scanner for sports betting.{" "}
              {BRAND_CONFIG.name} offers arbitrage plus additional markets and
              AI-powered opportunity analysis.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Summary */}
      <section className="px-4 py-12 md:px-6 md:py-16">
        <div className="container mx-auto">
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
            {/* BetBurger Card */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-2xl font-bold">BetBurger</h2>
              <p className="mt-2 text-muted-foreground">
                Professional arbitrage scanner
              </p>
              <div className="mt-4">
                <span className="text-3xl font-bold">~€59</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="mt-6 space-y-3">
                <li className="flex items-start gap-3 text-sm">
                  <CheckIcon />
                  <span>100+ bookmakers covered</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <CheckIcon />
                  <span>Fast surebet detection</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <CheckIcon />
                  <span>Pre-match and live arbs</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <CheckIcon />
                  <span>Browser extension</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <CrossIcon />
                  <span className="text-muted-foreground">
                    Arbitrage only, no value bets
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
                    No AI opportunity analysis
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
                  <span>Betting arbitrage + value bets</span>
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
                  <span>Free tier with demo data</span>
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
                  <th className="pb-4 font-semibold">BetBurger</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-4 pr-8 font-medium">Pro Tier Price</td>
                  <td className="py-4 pr-8 text-primary">£49/mo</td>
                  <td className="py-4">~€59/mo (~£50)</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 pr-8 font-medium">Free Tier</td>
                  <td className="py-4 pr-8">
                    <CheckIcon /> Forever free with demo
                  </td>
                  <td className="py-4">
                    <CrossIcon /> No free tier
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 pr-8 font-medium">Sports Arbitrage</td>
                  <td className="py-4 pr-8">
                    <CheckIcon /> UK bookmakers
                  </td>
                  <td className="py-4">
                    <CheckIcon /> 100+ bookmakers
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 pr-8 font-medium">Value Betting</td>
                  <td className="py-4 pr-8">
                    <CheckIcon />
                  </td>
                  <td className="py-4">
                    <CrossIcon /> Arbs only
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 pr-8 font-medium">Live Betting</td>
                  <td className="py-4 pr-8">Planned</td>
                  <td className="py-4">
                    <CheckIcon /> Live arbs
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
                  <td className="py-4 pr-8 font-medium">Browser Extension</td>
                  <td className="py-4 pr-8">
                    <CrossIcon />
                  </td>
                  <td className="py-4">
                    <CheckIcon />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 pr-8 font-medium">API Access</td>
                  <td className="py-4 pr-8">
                    <CheckIcon /> Unlimited tier
                  </td>
                  <td className="py-4">Limited</td>
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
            {/* BetBurger Best For */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-xl font-bold">Choose BetBurger if...</h3>
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
                  <span>You focus exclusively on sports arbitrage betting</span>
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
                    You need coverage of 100+ international bookmakers
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
                  <span>You want live in-play arbitrage opportunities</span>
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
                    You prefer browser extensions for quick bet placement
                  </span>
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
                    You value AI analysis that explains why opportunities exist
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <CheckIcon />
                  <span>
                    You want value betting opportunities, not just pure
                    arbitrage
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <CheckIcon />
                  <span>
                    You prefer instant WhatsApp alerts over email only
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <CheckIcon />
                  <span>You want a free tier to test before paying</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <CheckIcon />
                  <span>You need full API access for automated trading</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Arbitrage vs Multi-Asset Section */}
      <section className="bg-muted/30 px-4 py-20 md:px-6 md:py-28">
        <div className="container mx-auto">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-2xl font-bold md:text-3xl">
              Arbitrage Only vs Multi-Asset Approach
            </h2>
            <div className="mt-8 space-y-6">
              <div className="rounded-lg border bg-card p-6">
                <h3 className="font-semibold">
                  The Case for Pure Arbitrage (BetBurger)
                </h3>
                <p className="mt-2 text-muted-foreground">
                  BetBurger has spent years perfecting sports arbitrage. They
                  cover more bookmakers than almost anyone else and have fast
                  detection systems. If you only want to do arbing and you want
                  to do it professionally with international bookmakers,
                  BetBurger is a strong choice.
                </p>
              </div>

              <div className="rounded-lg border-2 border-primary bg-card p-6">
                <h3 className="font-semibold text-primary">
                  The Case for Multi-Asset ({BRAND_CONFIG.name})
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Arbitrage opportunities in sports betting are getting harder
                  to find - bookmakers are faster at closing odds gaps. By
                  scanning stocks and crypto too, you&apos;re not limited to one
                  market. Plus, our AI helps you understand which opportunities
                  are highest quality, rather than just listing every small arb.
                </p>
                <p className="mt-4 text-muted-foreground">
                  When betting arbs are scarce, you might find crypto arbitrage
                  between exchanges, or a stock that&apos;s temporarily
                  mispriced. Diversification means more consistent opportunity
                  flow.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Verdict */}
      <section className="px-4 py-20 md:px-6 md:py-28">
        <div className="container mx-auto">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-2xl font-bold md:text-3xl">
              The Bottom Line
            </h2>
            <div className="mt-8 rounded-lg border bg-card p-6">
              <p className="text-muted-foreground">
                <strong className="text-foreground">BetBurger</strong> is the
                choice for serious arbitrage bettors who want maximum bookmaker
                coverage and don&apos;t mind paying a premium for a specialized
                tool. Their international coverage and live arb detection are
                industry-leading.
              </p>
              <p className="mt-4 text-muted-foreground">
                <strong className="text-primary">{BRAND_CONFIG.name}</strong> is
                better suited for traders who want flexibility across multiple
                asset classes. Rather than putting all your eggs in one basket
                (sports arbing), you can find opportunities wherever they appear
                - betting, stocks, or crypto - with AI helping you prioritize
                the best ones.
              </p>
              <p className="mt-4 text-muted-foreground">
                The prices are similar, but the approaches are different.
                BetBurger goes deep on one strategy; {BRAND_CONFIG.name} goes
                broad across multiple markets.
              </p>
            </div>
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
            betting, stocks, and crypto - all with AI-powered analysis.
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

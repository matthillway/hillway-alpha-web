import { Metadata } from "next";
import Link from "next/link";
import { BRAND_CONFIG } from "@/lib/brand-config";
import { ROICalculator } from "@/components/ROICalculator";

export const metadata: Metadata = {
  title: `ROI Calculator - ${BRAND_CONFIG.name}`,
  description: `Calculate your potential return on investment with ${BRAND_CONFIG.name}. See how much extra profit you could earn across betting, crypto, and stock markets.`,
  keywords: [
    "ROI calculator",
    "trading ROI",
    "betting profit calculator",
    "arbitrage calculator",
    "investment return",
    BRAND_CONFIG.name,
  ],
  openGraph: {
    title: `ROI Calculator - ${BRAND_CONFIG.name}`,
    description: `Calculate your potential return on investment with ${BRAND_CONFIG.name}. See how much extra profit you could earn.`,
    type: "website",
  },
};

const faqs = [
  {
    question: "How are these estimates calculated?",
    answer:
      "Our ROI estimates are based on historical performance data from our users across different opportunity types. We calculate the typical improvement percentage for each scanner category (e.g., 2-5% for betting arbitrage) and apply it to your stated volume. These are averages - individual results will vary based on execution, market conditions, and consistency.",
  },
  {
    question: "What factors affect my actual returns?",
    answer:
      "Several factors influence your real-world returns: execution speed (acting on opportunities quickly), account limits (bookmaker restrictions), market liquidity, consistency of use, and proper bankroll management. Users who act on high-confidence signals and maintain disciplined execution tend to see the best results.",
  },
  {
    question: "Why do improvement percentages vary by opportunity type?",
    answer:
      "Different markets have different characteristics. Betting arbitrage typically offers 2-5% improvements because opportunities are mathematically guaranteed (though bookmakers may limit accounts). Value betting offers 1-3% as it involves positive EV plays over time. Crypto funding rates depend on market conditions, while stock momentum is influenced by broader market trends.",
  },
  {
    question: "Is this profit guaranteed?",
    answer:
      "No. While our AI identifies high-probability opportunities, trading and betting always involve risk. Past performance does not guarantee future results. The calculator provides estimates to help you understand potential returns, not promises. We recommend starting with smaller stakes until you're comfortable with the platform.",
  },
  {
    question: "How quickly can I expect to see results?",
    answer:
      "Most users see their first profitable opportunities within hours of activating their account. However, meaningful ROI typically develops over weeks of consistent use. The payback period shown in the calculator estimates how long it takes for your extra profit to cover the subscription cost.",
  },
  {
    question: "Which plan should I choose?",
    answer:
      "It depends on your volume and market focus. Starter (£19/mo) is ideal for those focusing on betting markets only. Pro (£49/mo) gives access to all three scanners (betting, stocks, crypto) and is our most popular plan. Unlimited (£149/mo) is for high-volume traders who need unlimited scans and API access.",
  },
];

export default function ROICalculatorPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted/30 px-4 py-16 md:px-6 md:py-24">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Calculate Your
            <br />
            <span className="text-primary">Potential ROI</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            See how much extra profit you could earn with {BRAND_CONFIG.name}.
            Enter your current trading volume and see the potential return on
            your subscription investment.
          </p>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="px-4 py-12 md:px-6 md:py-20">
        <div className="container mx-auto">
          <div className="mx-auto max-w-5xl">
            <ROICalculator />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/30 px-4 py-16 md:px-6 md:py-24">
        <div className="container mx-auto">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              How {BRAND_CONFIG.name} Improves Your Results
            </h2>
            <p className="mt-4 text-muted-foreground">
              Our AI scans thousands of data points to find opportunities
              you&apos;d otherwise miss.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border-2 bg-card p-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl">
                🔍
              </div>
              <h3 className="mt-4 text-lg font-semibold">
                1. Continuous Scanning
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Our AI monitors markets 24/7, analyzing odds, prices, and
                technical indicators across thousands of opportunities per hour.
              </p>
            </div>
            <div className="rounded-lg border-2 bg-card p-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl">
                🎯
              </div>
              <h3 className="mt-4 text-lg font-semibold">
                2. AI Confidence Scoring
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Each opportunity is scored by our AI model. We filter out noise
                and surface only the highest-probability signals to you.
              </p>
            </div>
            <div className="rounded-lg border-2 bg-card p-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl">
                ⚡
              </div>
              <h3 className="mt-4 text-lg font-semibold">3. Instant Alerts</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Get notified immediately via WhatsApp or email. Act on
                opportunities before the market moves and lock in your edge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Typical Results Banner */}
      <section className="px-4 py-12 md:px-6 md:py-16">
        <div className="container mx-auto">
          <div className="mx-auto max-w-4xl rounded-xl border-2 border-primary bg-gradient-to-r from-primary/5 to-primary/10 p-8 md:p-12">
            <div className="text-center">
              <h3 className="text-2xl font-bold md:text-3xl">
                Typical Performance Improvements
              </h3>
              <p className="mt-2 text-muted-foreground">
                Based on aggregated user data across all markets
              </p>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary md:text-4xl">
                  +3.5%
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Betting Arbitrage
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary md:text-4xl">
                  +2%
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Value Betting
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary md:text-4xl">
                  +2.5%
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Crypto Funding
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary md:text-4xl">
                  +1.5%
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Stock Momentum
                </div>
              </div>
            </div>
            <p className="mt-8 text-center text-xs text-muted-foreground">
              * These are average improvements. Individual results vary based on
              execution, market conditions, and consistency of use.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-muted/30 px-4 py-16 md:px-6 md:py-24">
        <div className="container mx-auto">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              Calculator Methodology FAQ
            </h2>
            <p className="mt-4 text-muted-foreground">
              Understand how we calculate potential returns and what factors
              influence your results.
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

      {/* CTA Section */}
      <section className="px-4 py-20 md:px-6 md:py-28">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Ready to boost your returns?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Start with a free demo or try the full platform with our 7-day free
            trial. No credit card required.
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

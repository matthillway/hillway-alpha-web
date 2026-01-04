import Link from "next/link";
import { Button } from "@/components/marketing/button";

export default function HomePage() {
  return (
    <>
      {/* SECTION 1: HERO */}
      <section className="py-24 md:py-32 lg:py-40">
        <div className="max-w-6xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 mb-8">
            AI-Powered Scanner
          </div>

          {/* H1 */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-6">
            Find Your Edge
          </h1>

          {/* Subhead */}
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Scan stocks, crypto, and betting markets for profitable
            opportunities using AI-powered analysis.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="/login?signup=true" size="lg">
              Start Free
            </Button>
            <Button variant="secondary" href="/pricing" size="lg">
              See Pricing
            </Button>
          </div>
        </div>
      </section>

      {/* SECTION 2: WHAT WE DO */}
      <section id="features" className="py-24 md:py-32 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16">
            Three Markets. One Dashboard.
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Stocks */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Stocks
              </h3>
              <p className="text-gray-600">
                Momentum signals, unusual options activity, and earnings plays
                across FTSE 100 and S&P 500.
              </p>
            </div>

            {/* Crypto */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-gray-700"
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
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Crypto
              </h3>
              <p className="text-gray-600">
                Funding rate arbitrage, CEX/DEX spreads, and sentiment analysis
                for major cryptocurrencies.
              </p>
            </div>

            {/* Betting */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Betting
              </h3>
              <p className="text-gray-600">
                Arbitrage opportunities, value bets, and matched betting across
                major UK bookmakers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: HOW IT WORKS */}
      <section id="how-it-works" className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Connect
              </h3>
              <p className="text-gray-600">
                Link your accounts or use our default scanners to monitor all
                three markets.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Scan</h3>
              <p className="text-gray-600">
                Our AI continuously scans for opportunities and ranks them by
                confidence.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Act</h3>
              <p className="text-gray-600">
                Get notified of opportunities and execute trades with calculated
                stake sizes.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button href="/login?signup=true">Get Started</Button>
          </div>
        </div>
      </section>

      {/* SECTION 4: PRICING PREVIEW */}
      <section className="py-24 md:py-32 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Simple Pricing
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-xl mx-auto">
            Start free. Upgrade when you need more markets and real-time alerts.
          </p>

          {/* Pro Card */}
          <div className="max-w-sm mx-auto bg-white border-2 border-emerald-600 rounded-2xl p-8 shadow-lg">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700 mb-4">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">£49</span>
              <span className="text-gray-500">/month</span>
            </div>
            <ul className="text-left space-y-3 mb-8">
              <li className="flex items-center gap-3 text-gray-600">
                <svg
                  className="w-5 h-5 text-emerald-600 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                All three markets
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <svg
                  className="w-5 h-5 text-emerald-600 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Real-time alerts
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <svg
                  className="w-5 h-5 text-emerald-600 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                AI-powered daily briefings
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <svg
                  className="w-5 h-5 text-emerald-600 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                WhatsApp notifications
              </li>
            </ul>
            <Button href="/login?signup=true&plan=pro" className="w-full">
              Start Free Trial
            </Button>
          </div>

          <p className="mt-8">
            <Link
              href="/pricing"
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              View all plans →
            </Link>
          </p>
        </div>
      </section>

      {/* SECTION 5: FINAL CTA */}
      <section className="py-24 md:py-32 bg-emerald-600">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to find your edge?
          </h2>
          <p className="text-lg text-emerald-100 mb-10 max-w-xl mx-auto">
            Join traders and bettors who use TradeSmart to discover profitable
            opportunities every day.
          </p>
          <Button
            href="/login?signup=true"
            variant="secondary"
            size="lg"
            className="bg-white text-emerald-600 hover:bg-gray-50 border-0"
          >
            Start Free Today
          </Button>
        </div>
      </section>
    </>
  );
}

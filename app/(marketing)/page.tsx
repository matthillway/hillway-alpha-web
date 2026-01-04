import Link from "next/link";
import { Button } from "@/components/marketing/button";

export default function HomePage() {
  return (
    <>
      {/* SECTION 1: HERO - Premium gradient background */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-emerald-50" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-emerald-100/40 via-teal-100/30 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-100/30 via-indigo-100/20 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23000'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-gray-700">
                AI-Powered Scanner • Live Now
              </span>
            </div>
          </div>

          {/* Main headline */}
          <h1 className="text-center">
            <span className="block text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900 mb-2">
              Find Your
            </span>
            <span className="block text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Edge
            </span>
          </h1>

          {/* Subhead */}
          <p className="text-center text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mt-8 leading-relaxed">
            The intelligent scanner that finds profitable opportunities across
            <span className="font-semibold text-gray-800"> stocks</span>,
            <span className="font-semibold text-gray-800"> crypto</span>, and
            <span className="font-semibold text-gray-800">
              {" "}
              betting markets
            </span>
            .
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
            <Button
              href="/login?signup=true"
              size="lg"
              className="shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 transition-all"
            >
              Start Free Trial
              <svg
                className="w-5 h-5 ml-2"
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
            </Button>
            <Button
              variant="secondary"
              href="#features"
              size="lg"
              className="group"
            >
              See How It Works
              <svg
                className="w-5 h-5 ml-2 group-hover:translate-y-0.5 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-16 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-emerald-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-emerald-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Set up in 2 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-emerald-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: WHAT WE SCAN - Premium cards */}
      <section id="features" className="relative py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold text-emerald-700 bg-emerald-100 mb-4">
              Three Markets
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              One Powerful Dashboard
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Stop switching between platforms. TradeSmart scans all three
              markets and ranks opportunities by confidence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Stocks Card */}
            <div className="group relative bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-3xl p-8 hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-7 h-7 text-white"
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
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Stocks
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Momentum signals, unusual options activity, and earnings plays
                  across FTSE 100 and S&P 500.
                </p>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    RSI & MACD crossovers
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Golden cross detection
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Volume spike alerts
                  </li>
                </ul>
              </div>
            </div>

            {/* Crypto Card */}
            <div className="group relative bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-3xl p-8 hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-7 h-7 text-white"
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
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Crypto
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Funding rate arbitrage, CEX/DEX spreads, and sentiment
                  analysis for major cryptocurrencies.
                </p>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    Funding rate opportunities
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    Fear &amp; Greed signals
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    Exchange spread alerts
                  </li>
                </ul>
              </div>
            </div>

            {/* Betting Card */}
            <div className="group relative bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-3xl p-8 hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-7 h-7 text-white"
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
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Betting
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Arbitrage opportunities, value bets, and matched betting
                  across major UK bookmakers.
                </p>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Guaranteed arbitrage
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Value bet detection
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Stake calculator
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: HOW IT WORKS - Timeline style */}
      <section
        id="how-it-works"
        className="relative py-32 bg-gradient-to-b from-gray-50 to-white overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-emerald-100/50 via-transparent to-cyan-100/50 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold text-emerald-700 bg-emerald-100 mb-4">
              Simple Setup
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Start in Minutes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              No complex setup. No coding required. Just sign up and start
              finding opportunities.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Step 1 */}
            <div className="relative">
              <div
                className="absolute top-10 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-emerald-300 hidden md:block"
                style={{ left: "50%", width: "100%" }}
              />
              <div className="relative bg-white rounded-3xl p-8 border border-gray-200 shadow-xl shadow-gray-200/50">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center text-2xl font-bold text-white mb-6 shadow-lg shadow-emerald-500/30">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Connect
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Sign up with your email. Link your brokerage accounts or use
                  our default market scanners.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div
                className="absolute top-10 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-300 to-emerald-200 hidden md:block"
                style={{ left: "50%", width: "100%" }}
              />
              <div className="relative bg-white rounded-3xl p-8 border border-gray-200 shadow-xl shadow-gray-200/50">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center text-2xl font-bold text-white mb-6 shadow-lg shadow-emerald-500/30">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Scan</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our AI continuously scans markets, identifies opportunities,
                  and ranks them by confidence score.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="relative bg-white rounded-3xl p-8 border border-gray-200 shadow-xl shadow-gray-200/50">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center text-2xl font-bold text-white mb-6 shadow-lg shadow-emerald-500/30">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Act</h3>
                <p className="text-gray-600 leading-relaxed">
                  Get real-time alerts via WhatsApp or email. Execute trades
                  with calculated stake sizes.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-16">
            <Button
              href="/login?signup=true"
              size="lg"
              className="shadow-lg shadow-emerald-500/20"
            >
              Get Started Free
            </Button>
          </div>
        </div>
      </section>

      {/* SECTION 4: PRICING - Premium card */}
      <section className="py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold text-emerald-700 bg-emerald-100 mb-4">
              Simple Pricing
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Start Free, Scale When Ready
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Try all features free for 14 days. No credit card required.
            </p>
          </div>

          {/* Pricing Card */}
          <div className="max-w-md mx-auto">
            <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-10 text-white overflow-hidden">
              {/* Gradient glow effect */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500 text-white">
                    Most Popular
                  </span>
                  <span className="text-gray-400 text-sm">Billed monthly</span>
                </div>

                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-bold">£49</span>
                  <span className="text-gray-400">/month</span>
                </div>

                <ul className="space-y-4 mb-10">
                  {[
                    "All three markets (stocks, crypto, betting)",
                    "Unlimited AI-powered scans",
                    "Real-time WhatsApp alerts",
                    "Daily briefings by AI",
                    "Advanced stake calculator",
                    "Priority support",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  href="/login?signup=true&plan=pro"
                  className="w-full bg-white text-gray-900 hover:bg-gray-100 border-0 py-4 text-lg font-semibold shadow-xl"
                >
                  Start 14-Day Free Trial
                </Button>

                <p className="text-center text-gray-500 text-sm mt-4">
                  No credit card required
                </p>
              </div>
            </div>
          </div>

          <p className="text-center mt-8">
            <Link
              href="/pricing"
              className="text-emerald-600 hover:text-emerald-700 font-semibold inline-flex items-center gap-2"
            >
              Compare all plans
              <svg
                className="w-4 h-4"
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
            </Link>
          </p>
        </div>
      </section>

      {/* SECTION 5: FINAL CTA - Premium gradient */}
      <section className="relative py-32 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2230%22 height=%2230%22 viewBox=%220 0 30 30%22 fill=%22none%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z%22 fill=%22rgba(255,255,255,0.07)%22/%3E%3C/svg%3E')] opacity-100" />

        {/* Floating elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Ready to Find Your Edge?
          </h2>
          <p className="text-xl text-emerald-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join hundreds of traders and bettors who use TradeSmart to discover
            profitable opportunities every day.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              href="/login?signup=true"
              size="lg"
              className="bg-white text-emerald-600 hover:bg-gray-50 border-0 shadow-xl shadow-black/10 px-8"
            >
              Start Free Trial
              <svg
                className="w-5 h-5 ml-2"
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
            </Button>
            <Button
              href="/pricing"
              variant="secondary"
              size="lg"
              className="border-2 border-white/30 text-white hover:bg-white/10 bg-transparent"
            >
              View Pricing
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

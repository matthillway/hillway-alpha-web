import { Trophy, TrendingUp, Bitcoin, ArrowRight, Check } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Trophy,
    title: "Betting Arbitrage",
    description:
      "Real-time comparison across major UK bookmakers. Find guaranteed profit opportunities with precise stake calculations.",
    highlights: [
      "Live odds from 15+ bookmakers",
      "Automatic stake calculator",
      "Profit margin alerts",
    ],
    gradient: "from-amber-500 to-orange-600",
    bgGradient: "from-amber-50 to-orange-50",
  },
  {
    icon: TrendingUp,
    title: "Stock Momentum",
    description:
      "Technical analysis signals for FTSE 100 and S&P 500. RSI, MACD, Bollinger Bands, and breakout detection.",
    highlights: [
      "15 technical indicators",
      "Pattern recognition AI",
      "Volume spike alerts",
    ],
    gradient: "from-blue-500 to-indigo-600",
    bgGradient: "from-blue-50 to-indigo-50",
  },
  {
    icon: Bitcoin,
    title: "Crypto Signals",
    description:
      "Monitor funding rates, CEX/DEX spreads, and sentiment indicators. Contrarian signals from Fear & Greed index.",
    highlights: [
      "Binance funding rates",
      "Exchange spread alerts",
      "Sentiment analysis",
    ],
    gradient: "from-purple-500 to-pink-600",
    bgGradient: "from-purple-50 to-pink-50",
  },
];

export function FeaturesGrid() {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600 mb-4">
            Multi-Asset Coverage
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
            Three Markets.
            <br />
            One Platform.
          </h2>
          <p className="mt-6 text-xl text-gray-600 leading-relaxed">
            Comprehensive scanning across betting, stocks, and crypto - all
            powered by AI and delivered in real-time.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid gap-8 lg:grid-cols-3">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative rounded-3xl border border-gray-100 bg-white p-8 lg:p-10 hover:border-gray-200 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500"
              >
                {/* Gradient background on hover */}
                <div
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}
                />

                {/* Icon with gradient */}
                <div
                  className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} text-white mb-8 shadow-lg`}
                >
                  <IconComponent className="h-7 w-7" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>

                <p className="text-gray-600 leading-relaxed mb-8">
                  {feature.description}
                </p>

                {/* Highlights */}
                <ul className="space-y-3">
                  {feature.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex items-center gap-3 text-sm text-gray-700"
                    >
                      <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-emerald-600" />
                      </div>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <p className="text-gray-600 mb-6">
            All features included in Pro plan. Start your free trial today.
          </p>
          <Link
            href="/pricing"
            className="group inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
          >
            View Pricing
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

import { Trophy, TrendingUp, Bitcoin } from "lucide-react";

const features = [
  {
    icon: Trophy,
    title: "Betting Arbitrage",
    description:
      "Real-time comparison across major UK bookmakers. Find guaranteed profit opportunities with calculated stake distributions.",
    highlights: ["Odds API integration", "Stake calculator", "Multi-bookmaker"],
  },
  {
    icon: TrendingUp,
    title: "Stock Momentum",
    description:
      "Technical analysis signals for FTSE 100 and S&P 500. RSI, MACD, Bollinger Bands, and breakout detection.",
    highlights: [
      "Technical indicators",
      "Pattern recognition",
      "Volume analysis",
    ],
  },
  {
    icon: Bitcoin,
    title: "Crypto Signals",
    description:
      "Monitor funding rates, CEX/DEX spreads, and sentiment indicators. Contrarian signals from Fear & Greed index.",
    highlights: ["Funding rates", "Sentiment analysis", "Exchange spreads"],
  },
];

export function FeaturesGrid() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Three Markets. One Platform.
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive scanning across betting, stocks, and crypto - all
            powered by AI.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-gray-200 bg-white p-8 hover:border-emerald-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 mb-6">
                  <IconComponent className="h-6 w-6" />
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>

                <p className="text-gray-600 mb-6">{feature.description}</p>

                <ul className="space-y-2">
                  {feature.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex items-center gap-2 text-sm text-gray-500"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

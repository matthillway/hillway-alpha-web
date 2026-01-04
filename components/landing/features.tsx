import { Target, TrendingUp, Bitcoin } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Betting Arbitrage",
    description:
      "Identify odds discrepancies across bookmakers. Monitor hundreds of markets in real-time for mathematically-backed opportunities.",
  },
  {
    icon: TrendingUp,
    title: "Stock Momentum",
    description:
      "Technical analysis on 500+ stocks. Identify breakouts, RSI signals, and volume anomalies before the crowd.",
  },
  {
    icon: Bitcoin,
    title: "Crypto Signals",
    description:
      "Funding rate opportunities and sentiment analysis. Earn from market inefficiencies across exchanges.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
            Three markets. One platform.
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            AI-powered scanners monitoring betting, stocks, and crypto 24/7.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800/50 hover:border-slate-700/50 transition-colors"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-emerald-400" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

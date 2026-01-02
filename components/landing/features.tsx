import {
  Target,
  TrendingUp,
  Bitcoin,
  Gauge,
  Brain,
  Bell,
} from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'Betting Arbitrage',
    description:
      'Guaranteed profit from odds discrepancies across bookmakers. Our scanner monitors hundreds of markets in real-time to find risk-free arbitrage opportunities.',
    gradient: 'from-green-500 to-emerald-600',
    stat: '2-5%',
    statLabel: 'Typical profit per arb',
  },
  {
    icon: TrendingUp,
    title: 'Stock Momentum',
    description:
      'Technical analysis on FTSE 100 & S&P 500 stocks. Identify breakout patterns, RSI signals, and volume anomalies before the crowd.',
    gradient: 'from-blue-500 to-cyan-600',
    stat: '500+',
    statLabel: 'Stocks monitored',
  },
  {
    icon: Bitcoin,
    title: 'Crypto Funding Rates',
    description:
      'Spot profitable funding rate opportunities on Binance perpetual futures. Earn passive income from funding rate arbitrage strategies.',
    gradient: 'from-orange-500 to-yellow-600',
    stat: '0.1%+',
    statLabel: 'Per 8-hour funding',
  },
  {
    icon: Gauge,
    title: 'Fear & Greed Signals',
    description:
      'Contrarian market sentiment analysis. Know when markets are fearful (time to buy) or greedy (time to be cautious).',
    gradient: 'from-purple-500 to-pink-600',
    stat: 'Real-time',
    statLabel: 'Sentiment updates',
  },
  {
    icon: Brain,
    title: 'Daily AI Briefings',
    description:
      'Personalized opportunity summaries delivered every morning. Our AI analyzes overnight movements and prioritizes the best opportunities for you.',
    gradient: 'from-indigo-500 to-violet-600',
    stat: '6:30 AM',
    statLabel: 'Daily briefing time',
  },
  {
    icon: Bell,
    title: 'Real-time Alerts',
    description:
      'Instant WhatsApp & Email notifications when high-value opportunities arise. Never miss a profitable trade again.',
    gradient: 'from-red-500 to-rose-600',
    stat: '<30s',
    statLabel: 'Alert delivery',
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-gray-950 relative">
      {/* Background accents */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Six Scanners.{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              One Platform.
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Our AI continuously monitors multiple markets to surface the most
            profitable opportunities. You focus on execution.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:transform hover:scale-[1.02]"
            >
              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-${feature.gradient.split(' ')[0].replace('from-', '')}/20 transition-shadow`}
              >
                <feature.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                {feature.description}
              </p>

              {/* Stat */}
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-2xl font-bold bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}
                >
                  {feature.stat}
                </span>
                <span className="text-sm text-gray-500">{feature.statLabel}</span>
              </div>

              {/* Hover glow effect */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

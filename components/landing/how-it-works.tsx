import { Scan, Filter, Bell, TrendingUp } from 'lucide-react';

const steps = [
  {
    step: 1,
    icon: Scan,
    title: 'Continuous Scanning',
    description:
      'Our AI monitors betting odds, stock prices, and crypto funding rates 24/7. We analyze thousands of data points every minute across multiple markets.',
    color: 'blue',
  },
  {
    step: 2,
    icon: Filter,
    title: 'Smart Filtering',
    description:
      'Advanced algorithms filter out noise and identify genuine opportunities. Only signals that meet our strict profit and risk criteria make it through.',
    color: 'purple',
  },
  {
    step: 3,
    icon: Bell,
    title: 'Instant Alerts',
    description:
      'Get notified immediately via WhatsApp or email. Each alert includes all the details you need to act: entry points, expected profit, and time sensitivity.',
    color: 'pink',
  },
  {
    step: 4,
    icon: TrendingUp,
    title: 'Execute & Profit',
    description:
      'Follow the clear instructions in each alert to capture the opportunity. Track your results in your personal dashboard and watch your portfolio grow.',
    color: 'green',
  },
];

const colorClasses = {
  blue: {
    bg: 'bg-blue-500',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    glow: 'shadow-blue-500/20',
  },
  purple: {
    bg: 'bg-purple-500',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
    glow: 'shadow-purple-500/20',
  },
  pink: {
    bg: 'bg-pink-500',
    text: 'text-pink-400',
    border: 'border-pink-500/30',
    glow: 'shadow-pink-500/20',
  },
  green: {
    bg: 'bg-green-500',
    text: 'text-green-400',
    border: 'border-green-500/30',
    glow: 'shadow-green-500/20',
  },
};

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-gray-900 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            How{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Hillway Alpha
            </span>{' '}
            Works
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            From market scan to profit in four simple steps. Let our AI do the heavy lifting.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-24 left-[calc(12.5%+28px)] right-[calc(12.5%+28px)] h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((item) => {
              const colors = colorClasses[item.color as keyof typeof colorClasses];
              return (
                <div key={item.step} className="relative">
                  {/* Step card */}
                  <div className="flex flex-col items-center text-center">
                    {/* Step number & icon */}
                    <div className="relative mb-8">
                      <div
                        className={`w-14 h-14 rounded-full ${colors.bg} flex items-center justify-center shadow-lg ${colors.glow}`}
                      >
                        <item.icon className="w-7 h-7 text-white" />
                      </div>
                      <div
                        className={`absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-900 border-2 ${colors.border} flex items-center justify-center`}
                      >
                        <span className={`text-xs font-bold ${colors.text}`}>
                          {item.step}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom visual - sample alert mockup */}
        <div className="mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-xl" />
          <div className="relative bg-gray-800/80 border border-gray-700 rounded-2xl p-6 sm:p-8 backdrop-blur-sm max-w-3xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-400 font-semibold">ARBITRAGE ALERT</span>
                  <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs">
                    HIGH CONFIDENCE
                  </span>
                </div>
                <h4 className="text-xl text-white font-medium mb-2">
                  Man City vs Arsenal - Over 2.5 Goals
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Bet365:</span>
                    <span className="text-white ml-2">2.10</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Betfair:</span>
                    <span className="text-white ml-2">1.95</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Profit:</span>
                    <span className="text-green-400 ml-2 font-semibold">3.2%</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Expires:</span>
                    <span className="text-yellow-400 ml-2">12 min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

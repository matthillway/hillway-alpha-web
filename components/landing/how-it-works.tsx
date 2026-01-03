import { Scan, Filter, Bell, TrendingUp } from "lucide-react";

const steps = [
  {
    step: 1,
    icon: Scan,
    title: "Continuous Scanning",
    description: "AI monitors odds, prices, and rates 24/7 across all markets.",
    color: "blue",
  },
  {
    step: 2,
    icon: Filter,
    title: "Smart Filtering",
    description:
      "Only high-confidence opportunities that meet strict criteria.",
    color: "purple",
  },
  {
    step: 3,
    icon: Bell,
    title: "Instant Alerts",
    description: "WhatsApp or email with entry points and expected profit.",
    color: "pink",
  },
  {
    step: 4,
    icon: TrendingUp,
    title: "Execute & Profit",
    description: "Clear instructions to act. Track results in your dashboard.",
    color: "green",
  },
];

const colorClasses = {
  blue: {
    bg: "bg-blue-500",
    text: "text-blue-400",
    border: "border-blue-500/30",
    glow: "shadow-blue-500/20",
  },
  purple: {
    bg: "bg-purple-500",
    text: "text-purple-400",
    border: "border-purple-500/30",
    glow: "shadow-purple-500/20",
  },
  pink: {
    bg: "bg-pink-500",
    text: "text-pink-400",
    border: "border-pink-500/30",
    glow: "shadow-pink-500/20",
  },
  green: {
    bg: "bg-green-500",
    text: "text-green-400",
    border: "border-green-500/30",
    glow: "shadow-green-500/20",
  },
};

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-32 bg-gray-900 relative overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            How{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              TradeSmart
            </span>{" "}
            Works
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            From market scan to profit in four simple steps. Let our AI do the
            heavy lifting.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-24 left-[calc(12.5%+28px)] right-[calc(12.5%+28px)] h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((item) => {
              const colors =
                colorClasses[item.color as keyof typeof colorClasses];
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
      </div>
    </section>
  );
}

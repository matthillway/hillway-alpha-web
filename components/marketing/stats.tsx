import { BarChart3, Target, Layers, Clock } from "lucide-react";

const stats = [
  {
    value: "10,000+",
    label: "Opportunities Scanned",
    sublabel: "Daily",
    icon: BarChart3,
  },
  {
    value: "97%",
    label: "Alert Accuracy",
    sublabel: "Precision",
    icon: Target,
  },
  {
    value: "3",
    label: "Asset Classes",
    sublabel: "Markets Covered",
    icon: Layers,
  },
  {
    value: "24/7",
    label: "AI Monitoring",
    sublabel: "Non-stop",
    icon: Clock,
  },
];

export function Stats() {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Optional section header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600 mb-3">
            Platform Statistics
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Built for serious traders
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-12">
          {stats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div key={stat.label} className="relative group text-center">
                {/* Icon */}
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-6 transition-colors group-hover:bg-emerald-100">
                  <IconComponent className="h-6 w-6" />
                </div>

                {/* Value */}
                <div className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
                  {stat.value}
                </div>

                {/* Labels */}
                <div className="mt-3 text-sm font-medium text-gray-900">
                  {stat.sublabel}
                </div>
                <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

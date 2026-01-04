import { BarChart3, Target, Layers, Clock } from "lucide-react";

const stats = [
  {
    label: "Opportunities Scanned",
    value: "10,000+",
    icon: BarChart3,
    description: "Daily",
  },
  {
    label: "Alert Accuracy",
    value: "97%",
    icon: Target,
    description: "Precision",
  },
  {
    label: "Markets Covered",
    value: "3",
    icon: Layers,
    description: "Asset Classes",
  },
  {
    label: "AI Monitoring",
    value: "24/7",
    icon: Clock,
    description: "Non-stop",
  },
];

export function Stats() {
  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={stat.label}
                className="relative rounded-2xl border border-gray-100 bg-gray-50/50 p-6 text-center"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 mb-4">
                  <IconComponent className="h-5 w-5" />
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {stat.description}
                </div>
                <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

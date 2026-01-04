import {
  X,
  Check,
  AlertTriangle,
  Search,
  Clock,
  Brain,
  Bell,
  LayoutDashboard,
  ArrowRight,
} from "lucide-react";

const problems = [
  {
    icon: Search,
    title: "Manual Research",
    description:
      "Hours spent scanning odds, charts, and feeds across dozens of sources",
  },
  {
    icon: AlertTriangle,
    title: "Missed Opportunities",
    description:
      "Profitable opportunities disappear in minutes while you're sleeping",
  },
  {
    icon: Clock,
    title: "Information Overload",
    description:
      "Too many sources, conflicting signals, not enough time to act",
  },
];

const solutions = [
  {
    icon: Brain,
    title: "AI Scans 24/7",
    description:
      "Continuous monitoring across all markets while you focus on execution",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description:
      "Get notified instantly when high-confidence opportunities appear",
  },
  {
    icon: LayoutDashboard,
    title: "One Dashboard",
    description:
      "All your markets, signals, and analytics in a single unified view",
  },
];

export function ProblemSolution() {
  return (
    <section className="py-24 lg:py-32 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600 mb-4">
            The Problem We Solve
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
            Stop Hunting.
            <br />
            Start Finding.
          </h2>
          <p className="mt-6 text-xl text-gray-600 leading-relaxed">
            Traditional methods waste your valuable time. TradeSmart does the
            heavy lifting so you can focus on making decisions.
          </p>
        </div>

        {/* Two column layout */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Problem Column */}
          <div className="relative rounded-3xl border border-red-100 bg-gradient-to-b from-red-50/50 to-white p-10 lg:p-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-1.5 text-sm font-semibold text-red-700 mb-10">
              <X className="h-4 w-4" />
              Without TradeSmart
            </div>

            <div className="space-y-8">
              {problems.map((problem) => {
                const IconComponent = problem.icon;
                return (
                  <div key={problem.title} className="flex gap-5">
                    <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-red-100 flex items-center justify-center">
                      <IconComponent className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {problem.title}
                      </h3>
                      <p className="text-gray-600 mt-1.5 leading-relaxed">
                        {problem.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Solution Column */}
          <div className="relative rounded-3xl border border-emerald-100 bg-gradient-to-b from-emerald-50/50 to-white p-10 lg:p-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700 mb-10">
              <Check className="h-4 w-4" />
              With TradeSmart
            </div>

            <div className="space-y-8">
              {solutions.map((solution) => {
                const IconComponent = solution.icon;
                return (
                  <div key={solution.title} className="flex gap-5">
                    <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <IconComponent className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {solution.title}
                      </h3>
                      <p className="text-gray-600 mt-1.5 leading-relaxed">
                        {solution.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Arrow connector (visible on desktop) */}
        <div className="hidden lg:flex justify-center -mt-[calc(50%-2rem)] relative z-10 pointer-events-none">
          <div className="h-16 w-16 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center">
            <ArrowRight className="h-6 w-6 text-emerald-600" />
          </div>
        </div>
      </div>
    </section>
  );
}

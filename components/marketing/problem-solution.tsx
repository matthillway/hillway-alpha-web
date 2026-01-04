import {
  X,
  Check,
  AlertTriangle,
  Search,
  Clock,
  Brain,
  Bell,
  LayoutDashboard,
} from "lucide-react";

const problems = [
  {
    icon: Search,
    title: "Manual Research",
    description: "Hours spent scanning odds, charts, and feeds",
  },
  {
    icon: AlertTriangle,
    title: "Missed Opportunities",
    description: "Opportunities disappear in minutes",
  },
  {
    icon: Clock,
    title: "Information Overload",
    description: "Too many sources, not enough time",
  },
];

const solutions = [
  {
    icon: Brain,
    title: "AI Scans 24/7",
    description: "Never miss an opportunity again",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description: "Get notified only when it matters",
  },
  {
    icon: LayoutDashboard,
    title: "One Dashboard",
    description: "All your markets in one place",
  },
];

export function ProblemSolution() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Stop Hunting. Start Finding.
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Traditional methods waste your time. TradeSmart does the heavy
            lifting.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Problem Column */}
          <div className="rounded-2xl border border-red-100 bg-red-50/30 p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700 mb-6">
              <X className="h-4 w-4" />
              The Problem
            </div>
            <div className="space-y-6">
              {problems.map((problem) => {
                const IconComponent = problem.icon;
                return (
                  <div key={problem.title} className="flex gap-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                      <IconComponent className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {problem.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {problem.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Solution Column */}
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700 mb-6">
              <Check className="h-4 w-4" />
              The Solution
            </div>
            <div className="space-y-6">
              {solutions.map((solution) => {
                const IconComponent = solution.icon;
                return (
                  <div key={solution.title} className="flex gap-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <IconComponent className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {solution.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {solution.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

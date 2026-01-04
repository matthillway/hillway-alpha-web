import { UserPlus, Settings, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create Your Account",
    description:
      "Sign up in seconds with just your email. No credit card required for the 14-day free trial.",
  },
  {
    number: "02",
    icon: Settings,
    title: "Configure Your Alerts",
    description:
      "Select your preferred markets, set profit thresholds, and choose how you want to be notified.",
  },
  {
    number: "03",
    icon: Zap,
    title: "Start Finding Alpha",
    description:
      "Receive real-time alerts and daily AI briefings with actionable opportunities across all markets.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 lg:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600 mb-4">
            Getting Started
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
            How It Works
          </h2>
          <p className="mt-6 text-xl text-gray-600 leading-relaxed">
            Get up and running in minutes. Start finding profitable
            opportunities today.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-24 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-0.5 bg-gradient-to-r from-emerald-200 via-emerald-300 to-emerald-200" />

          <div className="grid gap-12 lg:grid-cols-3 lg:gap-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={step.title} className="relative text-center">
                  {/* Step number badge */}
                  <div className="inline-flex items-center justify-center">
                    <div className="relative">
                      <div className="h-20 w-20 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-8 mx-auto transition-all hover:bg-emerald-100 hover:scale-105">
                        <IconComponent className="h-9 w-9 text-emerald-600" />
                      </div>
                      <div className="absolute -top-3 -right-3 bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
                        {step.number}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <Link
            href="/login"
            className="group inline-flex items-center gap-2.5 rounded-full bg-gray-900 px-8 py-4 text-base font-semibold text-white hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Get Started Now
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

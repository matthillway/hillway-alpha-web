import { Metadata } from "next";
import Link from "next/link";
import { TrendingUp, Users, Zap, Shield, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About - TradeSmart",
  description:
    "TradeSmart is an AI-powered multi-asset opportunity scanner built by Hillway. Find your edge across betting, stocks, and crypto markets.",
  openGraph: {
    title: "About TradeSmart",
    description: "AI-powered opportunity scanner by Hillway.",
  },
};

const values = [
  {
    icon: Zap,
    title: "Speed Matters",
    description:
      "Markets move fast. Our scanners update every 15 minutes so you never miss a time-sensitive opportunity.",
  },
  {
    icon: Shield,
    title: "Transparency First",
    description:
      "We show you exactly how we calculate opportunities. No black boxes, no hidden formulas.",
  },
  {
    icon: Users,
    title: "Built for Traders",
    description:
      "Every feature is designed by traders, for traders. We use TradeSmart ourselves.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-emerald-50/50 to-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            About TradeSmart
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            We built TradeSmart because finding opportunities shouldn&apos;t
            require hours of manual research.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="prose prose-lg prose-gray mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-gray-600 mb-6">
              TradeSmart started from a simple frustration: too many data
              sources, too little time. We were spending hours every day
              scanning odds comparisons, stock charts, and crypto feeds - only
              to miss opportunities because we couldn&apos;t be everywhere at
              once.
            </p>
            <p className="text-gray-600 mb-6">
              So we built an AI that could. TradeSmart continuously monitors
              betting odds, stock momentum signals, and crypto funding rates -
              alerting you only when something worth your attention appears.
            </p>
            <p className="text-gray-600">
              Today, TradeSmart helps traders across the UK find their edge
              without the noise. We&apos;re just getting started.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-bold text-gray-900">
              What We Believe
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {values.map((value) => {
              const IconComponent = value.icon;
              return (
                <div key={value.title} className="text-center">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 mb-4">
                    <IconComponent className="h-7 w-7" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-gray-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Hillway Attribution */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 mb-6">
            <TrendingUp className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            A Hillway Product
          </h2>
          <p className="text-gray-600 mb-6">
            TradeSmart is built and maintained by{" "}
            <a
              href="https://hillwayco.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Hillway
            </a>
            , a Sheffield-based technology and property consultancy.
          </p>
          <p className="text-sm text-gray-500">
            Questions? Reach us at{" "}
            <a
              href="mailto:support@tradesmarthub.com"
              className="text-emerald-600 hover:text-emerald-700"
            >
              support@tradesmarthub.com
            </a>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-emerald-600">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Find Your Edge?
          </h2>
          <p className="text-emerald-100 mb-8">
            Start your free trial today. No credit card required.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-semibold text-emerald-700 hover:bg-gray-50 transition-colors"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

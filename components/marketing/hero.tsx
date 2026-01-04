import Link from "next/link";
import { ArrowRight, Sparkles, Play } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-44 pb-32 lg:pt-52 lg:pb-40 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/80 via-emerald-50/30 to-white -z-10" />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:64px_64px] -z-10" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-200/80 bg-white/80 backdrop-blur-sm px-5 py-2 text-sm font-medium text-emerald-700 mb-8 shadow-sm">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Opportunity Scanner</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1]">
            Find Alpha Across
            <br />
            <span className="text-emerald-600">Every Market</span>
          </h1>

          {/* Subheadline */}
          <p className="mt-8 text-xl sm:text-2xl text-gray-600 leading-relaxed max-w-2xl mx-auto font-light">
            Real-time opportunities in betting arbitrage, stock momentum, and
            crypto signals. AI scans 24/7 so you never miss an edge.
          </p>

          {/* CTAs */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              href="/login"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-emerald-600 px-8 py-4 text-base font-semibold text-white hover:bg-emerald-700 transition-all duration-200 shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/30 hover:-translate-y-0.5"
            >
              Start Free Trial
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="#how-it-works"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full border border-gray-200 bg-white px-8 py-4 text-base font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
            >
              <Play className="h-4 w-4 text-gray-500" />
              See How It Works
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live scanning active</span>
            </div>
            <div className="hidden sm:block h-4 w-px bg-gray-200" />
            <span>No credit card required</span>
            <div className="hidden sm:block h-4 w-px bg-gray-200" />
            <span>14-day free trial</span>
          </div>
        </div>
      </div>
    </section>
  );
}

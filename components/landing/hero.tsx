import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-32 pb-24 md:pt-40 md:pb-32">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8">
          <span className="text-sm text-emerald-400">
            AI-Powered Market Scanner
          </span>
        </div>

        {/* Main headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight mb-6">
          Find profitable opportunities
          <br />
          <span className="text-slate-400">across every market</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg text-slate-400 max-w-xl mx-auto mb-10">
          Real-time alerts for betting arbitrage, stock momentum, and crypto
          signals. Data-driven edge, delivered instantly.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/auth/signup"
            className="group bg-emerald-500 hover:bg-emerald-400 text-white font-medium px-6 py-3 rounded-full transition-colors inline-flex items-center gap-2"
          >
            Start Free Trial
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="/#features"
            className="text-slate-400 hover:text-white font-medium px-6 py-3 transition-colors"
          >
            See how it works
          </Link>
        </div>

        {/* Risk disclaimer */}
        <p className="mt-8 text-xs text-slate-500 max-w-lg mx-auto">
          Trading and betting involve risk. Past performance does not guarantee
          future results. Capital at risk. Please trade responsibly.
        </p>
      </div>
    </section>
  );
}

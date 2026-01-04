import Link from "next/link";
import { ArrowRight, Shield, Lock, CreditCard, Sparkles } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative py-32 lg:py-40 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800" />

      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/30 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white mb-8">
          <Sparkles className="h-4 w-4" />
          <span>Start your 14-day free trial today</span>
        </div>

        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
          Ready to Find
          <br />
          Your Edge?
        </h2>

        <p className="mt-8 text-xl text-emerald-100 max-w-2xl mx-auto leading-relaxed">
          Join traders using TradeSmart to discover profitable opportunities
          across betting, stocks, and crypto markets.
        </p>

        {/* CTA Button */}
        <div className="mt-12">
          <Link
            href="/login"
            className="group inline-flex items-center gap-3 rounded-full bg-white px-10 py-5 text-lg font-semibold text-emerald-700 hover:bg-gray-50 transition-all duration-200 shadow-xl shadow-black/20 hover:shadow-2xl hover:-translate-y-0.5"
          >
            Start Your Free Trial
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <p className="mt-6 text-sm text-emerald-200">
          No credit card required. Cancel anytime.
        </p>

        {/* Trust badges */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm text-emerald-200">
          <div className="flex items-center gap-2.5">
            <Lock className="h-4 w-4" />
            <span>SSL Encrypted</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Shield className="h-4 w-4" />
            <span>GDPR Compliant</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CreditCard className="h-4 w-4" />
            <span>Secure Stripe Payments</span>
          </div>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { ArrowRight, Shield, Lock, CreditCard } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 bg-emerald-600">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Ready to Find Your Edge?
        </h2>
        <p className="mt-4 text-lg text-emerald-100 max-w-xl mx-auto">
          Join traders using TradeSmart to discover profitable opportunities
          across betting, stocks, and crypto markets.
        </p>

        <div className="mt-10">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-base font-semibold text-emerald-700 hover:bg-gray-50 transition-colors shadow-lg"
          >
            Start Your Free Trial
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        <p className="mt-4 text-sm text-emerald-200">
          No credit card required. Cancel anytime.
        </p>

        {/* Trust badges */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-emerald-200">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span>SSL Encrypted</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>GDPR Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span>Secure Stripe Payments</span>
          </div>
        </div>
      </div>
    </section>
  );
}

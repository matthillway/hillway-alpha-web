import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
          Ready to find your edge?
        </h2>
        <p className="text-lg text-slate-400 mb-8">
          Join traders using AI to spot opportunities first.
        </p>
        <Link
          href="/auth/signup"
          className="group bg-emerald-500 hover:bg-emerald-400 text-white font-medium px-6 py-3 rounded-full transition-colors inline-flex items-center gap-2"
        >
          Start Free Trial
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </section>
  );
}

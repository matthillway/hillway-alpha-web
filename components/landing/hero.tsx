"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />

      {/* Simplified gradient orbs - reduced opacity and count */}
      <div className="absolute top-1/3 -left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 -right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center space-y-12">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30">
            <Zap className="w-4 h-4 text-yellow-400 mr-2" />
            <span className="text-sm text-gray-300">
              AI-Powered Opportunity Detection
            </span>
          </div>

          {/* Main headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
            Find Alpha Across
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Every Market
            </span>
          </h1>

          {/* Shorter subheadline */}
          <p className="text-xl sm:text-2xl text-gray-400 max-w-2xl mx-auto">
            Real-time alerts for betting arbitrage, stock momentum, and crypto
            opportunities.
          </p>

          {/* Single CTA button */}
          <div className="pt-4">
            <Link href="/auth/signup">
              <Button size="lg" className="group text-base px-8 py-6">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-950 to-transparent" />
    </section>
  );
}

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Clock, Zap } from "lucide-react";

const benefits = [
  { icon: Shield, text: "7-day free trial" },
  { icon: Clock, text: "Cancel anytime" },
  { icon: Zap, text: "Instant access" },
];

export function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20" />
      <div className="absolute inset-0 bg-gray-950/90" />

      {/* Animated orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main content */}
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
          Ready to Find{" "}
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Your Edge?
          </span>
        </h2>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Join thousands of traders who use TradeSmartHub to discover profitable
          opportunities across betting, stocks, and crypto markets. Start your
          free trial today.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <Link href="/auth/signup">
            <Button size="lg" className="group text-lg px-8 py-4">
              Start Your Free Trial
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
              View Pricing
            </Button>
          </Link>
        </div>

        {/* Benefits */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2 text-gray-400">
              <benefit.icon className="w-5 h-5 text-green-400" />
              <span>{benefit.text}</span>
            </div>
          ))}
        </div>

        {/* Risk disclaimer */}
        <p className="mt-12 text-sm text-gray-500 max-w-2xl mx-auto">
          Trading involves risk. Past performance is not indicative of future
          results. TradeSmartHub provides information and tools, not financial
          advice. Always do your own research before making investment
          decisions.
        </p>
      </div>
    </section>
  );
}

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, TrendingUp, BarChart3 } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />

      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 mb-8">
            <Zap className="w-4 h-4 text-yellow-400 mr-2" />
            <span className="text-sm text-gray-300">AI-Powered Opportunity Detection</span>
          </div>

          {/* Main headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Find Alpha Across
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Every Market
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl sm:text-2xl text-gray-400 max-w-3xl mx-auto mb-10">
            AI-powered scanner that finds profitable opportunities in betting arbitrage,
            stock momentum, and crypto funding rates. Get real-time alerts delivered to
            your phone.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/auth/signup">
              <Button size="lg" className="group">
                Start 7-Day Free Trial
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/#how-it-works">
              <Button variant="outline" size="lg">
                See How It Works
              </Button>
            </Link>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center p-6 rounded-2xl bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm">
              <TrendingUp className="w-8 h-8 text-green-400 mb-3" />
              <div className="text-3xl font-bold text-white mb-1">1,247</div>
              <div className="text-gray-400">Opportunities Found Today</div>
            </div>
            <div className="flex flex-col items-center p-6 rounded-2xl bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm">
              <BarChart3 className="w-8 h-8 text-blue-400 mb-3" />
              <div className="text-3xl font-bold text-white mb-1">3.2%</div>
              <div className="text-gray-400">Avg. Arbitrage Profit</div>
            </div>
            <div className="flex flex-col items-center p-6 rounded-2xl bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm">
              <Zap className="w-8 h-8 text-yellow-400 mb-3" />
              <div className="text-3xl font-bold text-white mb-1">&lt;30s</div>
              <div className="text-gray-400">Alert Delivery Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-950 to-transparent" />
    </section>
  );
}

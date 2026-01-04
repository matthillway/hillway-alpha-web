import { Metadata } from "next";
import Link from "next/link";
import {
  Trophy,
  TrendingUp,
  Bitcoin,
  Bell,
  Brain,
  BarChart3,
  Zap,
  Shield,
  Clock,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Features - TradeSmart",
  description:
    "Explore TradeSmart's powerful features: betting arbitrage scanner, stock momentum signals, crypto funding rates, and AI-powered daily briefings.",
  openGraph: {
    title: "TradeSmart Features - Multi-Asset Opportunity Scanner",
    description:
      "Betting arbitrage, stock momentum, crypto signals - all powered by AI.",
  },
};

const scanners = [
  {
    icon: Trophy,
    title: "Betting Arbitrage Scanner",
    description:
      "Compare odds across major UK bookmakers in real-time to find guaranteed profit opportunities.",
    features: [
      "Live odds from 10+ bookmakers via The Odds API",
      "Automatic stake calculation with Kelly Criterion",
      "Support for all major sports leagues",
      "Margin and profit percentage calculation",
    ],
  },
  {
    icon: TrendingUp,
    title: "Stock Momentum Scanner",
    description:
      "Technical analysis signals for FTSE 100 and S&P 500 stocks based on proven indicators.",
    features: [
      "RSI overbought/oversold detection",
      "MACD crossover signals",
      "Bollinger Band breakouts",
      "Golden/Death cross patterns",
    ],
  },
  {
    icon: Bitcoin,
    title: "Crypto Signals",
    description:
      "Monitor funding rates, exchange spreads, and sentiment indicators for crypto markets.",
    features: [
      "Binance perpetual funding rates",
      "Fear & Greed contrarian signals",
      "CEX/DEX spread opportunities",
      "Volume anomaly detection",
    ],
  },
];

const additionalFeatures = [
  {
    icon: Bell,
    title: "Real-Time Alerts",
    description:
      "Get instant WhatsApp notifications when opportunities meet your criteria.",
  },
  {
    icon: Brain,
    title: "AI Briefings",
    description:
      "Daily AI-generated summaries highlighting the best opportunities across all markets.",
  },
  {
    icon: BarChart3,
    title: "Performance Tracking",
    description:
      "Track your wins, losses, and ROI with comprehensive analytics dashboard.",
  },
  {
    icon: Zap,
    title: "Fast Execution",
    description:
      "Opportunities update every 15 minutes so you never miss a time-sensitive trade.",
  },
  {
    icon: Shield,
    title: "Risk Management",
    description:
      "Built-in stake calculators and position sizing based on Kelly Criterion.",
  },
  {
    icon: Clock,
    title: "24/7 Monitoring",
    description:
      "Our AI never sleeps - continuous scanning across all configured markets.",
  },
];

export default function FeaturesPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-emerald-50/50 to-white">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Powerful Features for{" "}
            <span className="text-emerald-600">Every Trader</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            Three specialized scanners, AI-powered insights, and real-time
            alerts - everything you need to find your edge.
          </p>
        </div>
      </section>

      {/* Main Scanners */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="space-y-16">
            {scanners.map((scanner, index) => {
              const IconComponent = scanner.icon;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={scanner.title}
                  className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} gap-12 items-center`}
                >
                  {/* Content */}
                  <div className="flex-1">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 mb-6">
                      <IconComponent className="h-7 w-7" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {scanner.title}
                    </h2>
                    <p className="text-lg text-gray-600 mb-6">
                      {scanner.description}
                    </p>
                    <ul className="space-y-3">
                      {scanner.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <div className="mt-1.5 h-2 w-2 rounded-full bg-emerald-500 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Visual placeholder */}
                  <div className="flex-1 w-full">
                    <div className="aspect-video rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-200 flex items-center justify-center">
                      <IconComponent className="h-16 w-16 text-gray-300" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Everything You Need
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Built for traders who want a complete solution.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {additionalFeatures.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-xl border border-gray-200 bg-white p-6"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 mb-4">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-emerald-600">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-emerald-100 mb-8">
            Try TradeSmart free for 14 days. No credit card required.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-semibold text-emerald-700 hover:bg-gray-50 transition-colors"
          >
            Start Free Trial
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

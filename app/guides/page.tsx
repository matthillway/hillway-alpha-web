"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  TrendingUp,
  BarChart3,
  Bitcoin,
  BookOpen,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Scale,
  Target,
  Shield,
  ExternalLink,
  Calculator,
  Percent,
  ArrowUpDown,
  Clock,
  Wallet,
  Zap,
  Globe,
  Lock,
} from "lucide-react";

// =============================================================================
// AFFILIATE PARTNER URLS - Update these with your affiliate links
// =============================================================================

// Betting Partners (UK Regulated)
const BETFAIR_AFFILIATE_URL = "#"; // TODO: Add Betfair affiliate link
const SMARKETS_AFFILIATE_URL = "#"; // TODO: Add Smarkets affiliate link
const MATCHBOOK_AFFILIATE_URL = "#"; // TODO: Add Matchbook affiliate link

// Stock Brokers (FCA Regulated)
const IBKR_AFFILIATE_URL = "#"; // TODO: Add Interactive Brokers affiliate link
const TRADING212_AFFILIATE_URL = "#"; // TODO: Add Trading 212 affiliate link
const IG_AFFILIATE_URL = "#"; // TODO: Add IG affiliate link

// Crypto Exchanges (UK Compliant)
const KRAKEN_AFFILIATE_URL = "#"; // TODO: Add Kraken affiliate link
const COINBASE_AFFILIATE_URL = "#"; // TODO: Add Coinbase affiliate link
const OKX_AFFILIATE_URL = "#"; // TODO: Add OKX affiliate link

// =============================================================================

interface GuideSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
}

export default function GuidesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "overview",
  ]);

  useEffect(() => {
    async function init() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      setLoading(false);
    }
    init();
  }, [router]);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const sections: GuideSection[] = [
    {
      id: "overview",
      title: "Overview - Understanding Opportunity Types",
      icon: <BookOpen className="w-5 h-5" />,
      color: "text-blue-500",
    },
    {
      id: "arbitrage",
      title: "Arbitrage Betting Guide",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "text-blue-500",
    },
    {
      id: "stocks",
      title: "Stock Momentum Trading Guide",
      icon: <BarChart3 className="w-5 h-5" />,
      color: "text-green-500",
    },
    {
      id: "crypto",
      title: "Crypto Funding Rate Arbitrage Guide",
      icon: <Bitcoin className="w-5 h-5" />,
      color: "text-orange-500",
    },
    {
      id: "partners",
      title: "Recommended Partners",
      icon: <Shield className="w-5 h-5" />,
      color: "text-purple-500",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-gray-400 hover:text-white mr-4"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3">
              <BookOpen className="w-5 h-5 text-blue-500" />
              <h1 className="text-xl font-bold text-white">
                Getting Started Guide
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introduction */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-6 border border-blue-500/30 mb-8">
          <h2 className="text-xl font-bold text-white mb-2">
            Welcome to TradeSmart
          </h2>
          <p className="text-gray-300">
            This guide will teach you how to act on the opportunities our AI
            scanner finds across sports betting, stock markets, and
            cryptocurrency. Each strategy has different risk profiles and
            requirements - read through carefully before getting started.
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {sections.slice(1, 5).map((section) => (
            <button
              key={section.id}
              onClick={() => {
                if (!expandedSections.includes(section.id)) {
                  toggleSection(section.id);
                }
                document
                  .getElementById(section.id)
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-gray-700 transition-colors text-left"
            >
              <div className={`${section.color} mb-2`}>{section.icon}</div>
              <p className="text-white text-sm font-medium">
                {section.title.split(" Guide")[0]}
              </p>
            </button>
          ))}
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((section) => (
            <div
              key={section.id}
              id={section.id}
              className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className={section.color}>{section.icon}</div>
                  <h2 className="text-lg font-semibold text-white">
                    {section.title}
                  </h2>
                </div>
                {expandedSections.includes(section.id) ? (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {expandedSections.includes(section.id) && (
                <div className="px-6 pb-6 border-t border-gray-800">
                  {section.id === "overview" && <OverviewContent />}
                  {section.id === "arbitrage" && <ArbitrageContent />}
                  {section.id === "stocks" && <StocksContent />}
                  {section.id === "crypto" && <CryptoContent />}
                  {section.id === "partners" && <PartnersContent />}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Return to Dashboard */}
        <div className="mt-8 text-center">
          <Button variant="primary" onClick={() => router.push("/dashboard")}>
            Return to Dashboard
          </Button>
        </div>
      </main>
    </div>
  );
}

// Overview Section Content
function OverviewContent() {
  return (
    <div className="pt-6 space-y-6">
      <p className="text-gray-300">
        TradeSmart scans multiple markets to find profitable opportunities. We
        use three main scanners, each targeting different market inefficiencies:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Arbitrage Card */}
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="text-white font-semibold">Arbitrage Betting</h3>
          </div>
          <p className="text-gray-400 text-sm mb-3">
            Guaranteed profit by betting on all outcomes across different
            bookmakers when odds discrepancies exist.
          </p>
          <div className="flex items-center space-x-2 text-sm">
            <span className="px-2 py-1 bg-green-500/20 text-green-500 rounded">
              Low Risk
            </span>
            <span className="px-2 py-1 bg-blue-500/20 text-blue-500 rounded">
              1-5% Returns
            </span>
          </div>
        </div>

        {/* Stocks Card */}
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-white font-semibold">Stock Momentum</h3>
          </div>
          <p className="text-gray-400 text-sm mb-3">
            Technical analysis signals identifying stocks with strong buying or
            selling momentum for short-term trades.
          </p>
          <div className="flex items-center space-x-2 text-sm">
            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded">
              Medium Risk
            </span>
            <span className="px-2 py-1 bg-blue-500/20 text-blue-500 rounded">
              Variable Returns
            </span>
          </div>
        </div>

        {/* Crypto Card */}
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <Bitcoin className="w-5 h-5 text-orange-500" />
            </div>
            <h3 className="text-white font-semibold">Crypto Funding</h3>
          </div>
          <p className="text-gray-400 text-sm mb-3">
            Arbitrage between spot and perpetual futures markets using funding
            rate payments as profit.
          </p>
          <div className="flex items-center space-x-2 text-sm">
            <span className="px-2 py-1 bg-orange-500/20 text-orange-500 rounded">
              Higher Risk
            </span>
            <span className="px-2 py-1 bg-blue-500/20 text-blue-500 rounded">
              8-30% APY
            </span>
          </div>
        </div>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-yellow-500 font-medium">
              Important Disclaimer
            </h4>
            <p className="text-gray-400 text-sm mt-1">
              All trading involves risk. Past performance does not guarantee
              future results. Only invest what you can afford to lose. This is
              not financial advice - do your own research before acting on any
              opportunities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Arbitrage Betting Content
function ArbitrageContent() {
  return (
    <div className="pt-6 space-y-6">
      {/* What is Arbitrage */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
          <Scale className="w-5 h-5 text-blue-500 mr-2" />
          What is Arbitrage Betting?
        </h3>
        <p className="text-gray-300 mb-4">
          Arbitrage betting (or &quot;arbing&quot;) exploits differences in odds
          between bookmakers. When one bookmaker offers higher odds than others,
          you can bet on ALL outcomes and guarantee a profit regardless of the
          result.
        </p>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <h4 className="text-white font-medium mb-2">Example:</h4>
          <p className="text-gray-400 text-sm">
            Tennis match: Player A vs Player B<br />
            - Bookmaker 1: Player A @ 2.10
            <br />
            - Bookmaker 2: Player B @ 2.05
            <br />
            <br />
            If you bet £100 on Player A and £102.44 on Player B, you profit
            £4.88 regardless of who wins. That&apos;s a 2.4% guaranteed return.
          </p>
        </div>
      </div>

      {/* Reading Opportunity Cards */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
          <Target className="w-5 h-5 text-blue-500 mr-2" />
          Reading Opportunity Cards
        </h3>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-500/20 rounded flex items-center justify-center flex-shrink-0">
              <Percent className="w-4 h-4 text-green-500" />
            </div>
            <div>
              <h4 className="text-white font-medium">
                Margin / Expected Value
              </h4>
              <p className="text-gray-400 text-sm">
                Shows the guaranteed profit percentage. A 2.5% margin means
                you&apos;ll make £2.50 for every £100 wagered.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-500/20 rounded flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <h4 className="text-white font-medium">Time Sensitivity</h4>
              <p className="text-gray-400 text-sm">
                Arbitrage opportunities disappear quickly (often within
                minutes). Act fast when you see a good margin.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-purple-500/20 rounded flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-4 h-4 text-purple-500" />
            </div>
            <div>
              <h4 className="text-white font-medium">Stake Distribution</h4>
              <p className="text-gray-400 text-sm">
                We calculate the exact amount to bet on each outcome to
                guarantee equal profit regardless of result.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step by Step */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
          <CheckCircle className="w-5 h-5 text-blue-500 mr-2" />
          Step-by-Step Guide
        </h3>
        <div className="space-y-3">
          {[
            {
              step: 1,
              title: "Fund Multiple Bookmaker Accounts",
              desc: "You need accounts with at least 3-5 different bookmakers with funds ready to bet.",
            },
            {
              step: 2,
              title: "Wait for an Opportunity Alert",
              desc: "Our scanner runs continuously. When a profitable arb is found, you'll see it in your dashboard.",
            },
            {
              step: 3,
              title: "Verify the Odds Still Exist",
              desc: "Before placing bets, quickly check both bookmakers still show the required odds.",
            },
            {
              step: 4,
              title: "Place All Bets Quickly",
              desc: "Place both bets as fast as possible. Use the exact stake amounts shown. Have both bookmaker sites open.",
            },
            {
              step: 5,
              title: "Record Your Bets",
              desc: "Mark the opportunity as 'actioned' in the app so we can track your performance.",
            },
            {
              step: 6,
              title: "Wait for Settlement",
              desc: "After the event concludes, your profit is automatically realised in one of your accounts.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex items-start space-x-4 bg-gray-800/50 rounded-lg p-4 border border-gray-700"
            >
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-500 font-bold">{item.step}</span>
              </div>
              <div>
                <h4 className="text-white font-medium">{item.title}</h4>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <h4 className="text-blue-400 font-medium mb-2">Pro Tips</h4>
        <ul className="text-gray-400 text-sm space-y-1">
          <li>
            - Start with small stakes until you&apos;re comfortable with the
            process
          </li>
          <li>
            - Never bet more than the maximum limits shown on bookmaker sites
          </li>
          <li>- Vary your bet amounts slightly to avoid detection</li>
          <li>
            - Round your stakes to normal-looking numbers (£47.50 instead of
            £47.23)
          </li>
          <li>- Be aware some bookmakers limit or ban successful arbers</li>
        </ul>
      </div>
    </div>
  );
}

// Stock Momentum Content
function StocksContent() {
  return (
    <div className="pt-6 space-y-6">
      {/* Understanding Momentum */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
          <BarChart3 className="w-5 h-5 text-green-500 mr-2" />
          Understanding Momentum Signals
        </h3>
        <p className="text-gray-300 mb-4">
          Our stock scanner uses technical analysis to identify stocks showing
          strong momentum - either bullish (upward) or bearish (downward)
          trends. We analyse price patterns, volume, and key indicators to
          generate buy and sell signals.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <h4 className="text-green-500 font-medium mb-2">Bullish Signals</h4>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>- RSI crossing above 30 (oversold bounce)</li>
              <li>- MACD crossover (bullish divergence)</li>
              <li>- Price breaking above resistance</li>
              <li>- Increasing volume on up days</li>
            </ul>
          </div>
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <h4 className="text-red-500 font-medium mb-2">Bearish Signals</h4>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>- RSI crossing below 70 (overbought decline)</li>
              <li>- MACD crossover (bearish divergence)</li>
              <li>- Price breaking below support</li>
              <li>- High volume on down days</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Reading Recommendations */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
          <Target className="w-5 h-5 text-green-500 mr-2" />
          Interpreting Buy/Sell Recommendations
        </h3>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-500/20 rounded flex items-center justify-center flex-shrink-0">
              <span className="text-green-500 font-bold">85</span>
            </div>
            <div>
              <h4 className="text-white font-medium">Confidence Score</h4>
              <p className="text-gray-400 text-sm">
                Higher scores (70+) indicate stronger signals with multiple
                confirming indicators. Below 60 signals are more speculative.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-500/20 rounded flex items-center justify-center flex-shrink-0">
              <ArrowUpDown className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <h4 className="text-white font-medium">Entry & Exit Points</h4>
              <p className="text-gray-400 text-sm">
                Each signal includes suggested entry price, stop-loss level, and
                take-profit target. Always use stop-losses to limit risk.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-purple-500/20 rounded flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 text-purple-500" />
            </div>
            <div>
              <h4 className="text-white font-medium">Time Horizon</h4>
              <p className="text-gray-400 text-sm">
                Our signals are designed for short-term trades (1-5 days).
                They&apos;re not intended for long-term investing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Management */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
          <Shield className="w-5 h-5 text-green-500 mr-2" />
          Risk Management Basics
        </h3>
        <div className="space-y-3">
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h4 className="text-white font-medium mb-2">Position Sizing</h4>
            <p className="text-gray-400 text-sm">
              Never risk more than 1-2% of your trading capital on a single
              trade. If you have £10,000, your maximum loss per trade should be
              £100-200.
            </p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h4 className="text-white font-medium mb-2">
              Always Use Stop-Losses
            </h4>
            <p className="text-gray-400 text-sm">
              Set a stop-loss order when you enter every trade. This
              automatically closes your position if the price moves against you,
              limiting losses.
            </p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h4 className="text-white font-medium mb-2">Diversification</h4>
            <p className="text-gray-400 text-sm">
              Don&apos;t put all your capital into one sector or correlated
              stocks. Spread your trades across different industries to reduce
              risk.
            </p>
          </div>
        </div>
      </div>

      {/* Warning */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-yellow-500 font-medium">Important</h4>
            <p className="text-gray-400 text-sm mt-1">
              Stock trading carries significant risk. You can lose more than
              your initial investment with leveraged products. Our signals are
              based on technical analysis and are not guaranteed to be
              profitable. Always do your own research.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Crypto Funding Content
function CryptoContent() {
  return (
    <div className="pt-6 space-y-6">
      {/* What is Funding Rate Arbitrage */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
          <Bitcoin className="w-5 h-5 text-orange-500 mr-2" />
          What is Funding Rate Arbitrage?
        </h3>
        <p className="text-gray-300 mb-4">
          Perpetual futures contracts on crypto exchanges use &quot;funding
          rates&quot; to keep contract prices aligned with spot prices. When
          funding is positive, longs pay shorts. When negative, shorts pay
          longs. This happens every 8 hours.
        </p>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <h4 className="text-white font-medium mb-2">The Strategy:</h4>
          <p className="text-gray-400 text-sm">
            Buy spot crypto (e.g., 1 BTC) and short the same amount in perpetual
            futures. You&apos;re &quot;delta neutral&quot; - price movements
            don&apos;t affect you. Your profit comes from collecting funding
            payments when rates are high.
          </p>
        </div>
      </div>

      {/* How it Works */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
          <Calculator className="w-5 h-5 text-orange-500 mr-2" />
          How Positions Work
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <h4 className="text-green-500 font-medium mb-2">
              Long Position (Spot)
            </h4>
            <p className="text-gray-400 text-sm">
              You buy and hold the actual cryptocurrency. If price goes up, this
              position profits. If price goes down, this position loses - but
              your short offsets it.
            </p>
          </div>
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <h4 className="text-red-500 font-medium mb-2">
              Short Position (Perps)
            </h4>
            <p className="text-gray-400 text-sm">
              You open a short perpetual futures position. If price goes down,
              this profits. If price goes up, this loses - but your spot
              position offsets it. You collect funding when rates are positive.
            </p>
          </div>
        </div>
      </div>

      {/* Using Leverage */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
          <Target className="w-5 h-5 text-orange-500 mr-2" />
          Using Leverage Safely
        </h3>
        <div className="space-y-3">
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h4 className="text-white font-medium mb-2">Keep Leverage Low</h4>
            <p className="text-gray-400 text-sm">
              For funding rate arbitrage, use 2-3x leverage maximum on your
              short position. Higher leverage increases liquidation risk during
              volatile moves.
            </p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h4 className="text-white font-medium mb-2">
              Monitor Margin Levels
            </h4>
            <p className="text-gray-400 text-sm">
              Always keep extra margin in your futures account. If price spikes
              rapidly, you need buffer to avoid liquidation on your short.
            </p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h4 className="text-white font-medium mb-2">
              Understand Liquidation
            </h4>
            <p className="text-gray-400 text-sm">
              If the crypto price rises sharply, your short position loses
              money. At a certain point, the exchange will liquidate your
              position. Keep positions sized appropriately.
            </p>
          </div>
        </div>
      </div>

      {/* Step by Step */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
          <CheckCircle className="w-5 h-5 text-orange-500 mr-2" />
          Step-by-Step Guide
        </h3>
        <div className="space-y-3">
          {[
            {
              step: 1,
              title: "Check Funding Rates",
              desc: "Our scanner shows current funding rates. Look for rates above 0.05% per 8 hours (roughly 55% APY).",
            },
            {
              step: 2,
              title: "Fund Both Spot & Futures Accounts",
              desc: "Transfer capital to both your spot wallet and futures margin account on the exchange.",
            },
            {
              step: 3,
              title: "Buy Spot",
              desc: "Purchase the cryptocurrency in the spot market. This is your long position.",
            },
            {
              step: 4,
              title: "Open Short Perpetual",
              desc: "Open a short position in perpetuals for the same notional value. Match your spot position size.",
            },
            {
              step: 5,
              title: "Collect Funding",
              desc: "Every 8 hours, funding is paid. With positive rates, you receive payments to your futures account.",
            },
            {
              step: 6,
              title: "Monitor & Exit",
              desc: "When rates drop or turn negative, close both positions to lock in profits.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex items-start space-x-4 bg-gray-800/50 rounded-lg p-4 border border-gray-700"
            >
              <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-orange-500 font-bold">{item.step}</span>
              </div>
              <div>
                <h4 className="text-white font-medium">{item.title}</h4>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Warning */}
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-red-500 font-medium">High Risk Warning</h4>
            <p className="text-gray-400 text-sm mt-1">
              Crypto trading with leverage is extremely risky. Prices can move
              10-20% in minutes. Funding rates can turn negative suddenly.
              Exchange failures can result in lost funds. Only trade with money
              you can afford to lose completely.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Partners Content
function PartnersContent() {
  const bettingPartners = [
    {
      name: "Betfair Exchange",
      tagline: "Best for arbitrage, 2% commission, full API",
      icon: <Zap className="w-6 h-6" />,
      iconBg: "bg-blue-500",
      benefits: [
        "Largest liquidity pool for exchange betting",
        "Full API access for automated trading",
        "Lay betting enables true arbitrage",
      ],
      url: BETFAIR_AFFILIATE_URL,
    },
    {
      name: "Smarkets",
      tagline: "Lowest commission (2%), beginner friendly",
      icon: <Target className="w-6 h-6" />,
      iconBg: "bg-purple-500",
      benefits: [
        "Industry-lowest 2% commission rate",
        "Clean, intuitive interface for beginners",
        "Strong mobile app for on-the-go betting",
      ],
      url: SMARKETS_AFFILIATE_URL,
    },
    {
      name: "Matchbook",
      tagline: "0% commission on selected events",
      icon: <DollarSign className="w-6 h-6" />,
      iconBg: "bg-green-500",
      benefits: [
        "Zero commission promotions on major events",
        "No premium charge (unlike Betfair)",
        "Competitive odds across all markets",
      ],
      url: MATCHBOOK_AFFILIATE_URL,
    },
  ];

  const stockBrokers = [
    {
      name: "Interactive Brokers",
      tagline: "Best for serious traders, full API",
      icon: <Globe className="w-6 h-6" />,
      iconBg: "bg-red-500",
      benefits: [
        "Professional-grade trading tools",
        "Access to 150+ global markets",
        "Powerful API for algorithmic trading",
      ],
      url: IBKR_AFFILIATE_URL,
    },
    {
      name: "Trading 212",
      tagline: "Commission-free, beginner friendly",
      icon: <Wallet className="w-6 h-6" />,
      iconBg: "bg-emerald-500",
      benefits: [
        "Zero commission on all trades",
        "Fractional shares from £1",
        "Tax-free ISA account available",
      ],
      url: TRADING212_AFFILIATE_URL,
    },
    {
      name: "IG",
      tagline: "Spread betting and CFDs",
      icon: <BarChart3 className="w-6 h-6" />,
      iconBg: "bg-pink-500",
      benefits: [
        "Tax-free spread betting (UK residents)",
        "Excellent charting and analysis tools",
        "17,000+ markets available",
      ],
      url: IG_AFFILIATE_URL,
    },
  ];

  const cryptoExchanges = [
    {
      name: "Kraken",
      tagline: "Best for UK users, FCA registered",
      icon: <Lock className="w-6 h-6" />,
      iconBg: "bg-indigo-500",
      benefits: [
        "FCA registered for UK compliance",
        "Excellent API for automated trading",
        "Strong security track record since 2011",
      ],
      url: KRAKEN_AFFILIATE_URL,
    },
    {
      name: "Coinbase",
      tagline: "Most trusted, easy to use",
      icon: <Shield className="w-6 h-6" />,
      iconBg: "bg-blue-600",
      benefits: [
        "Insurance coverage on holdings",
        "Beginner-friendly interface",
        "Publicly traded company (NASDAQ: COIN)",
      ],
      url: COINBASE_AFFILIATE_URL,
    },
    {
      name: "OKX",
      tagline: "Best for funding rate arbitrage",
      icon: <Bitcoin className="w-6 h-6" />,
      iconBg: "bg-orange-500",
      benefits: [
        "Low fees for perpetual futures",
        "Deep liquidity for large positions",
        "Advanced funding rate tools",
      ],
      url: OKX_AFFILIATE_URL,
    },
  ];

  return (
    <div className="pt-6 space-y-8">
      <p className="text-gray-300">
        To act on the opportunities we find, you&apos;ll need accounts with
        regulated platforms. Here are our recommended partners for each
        opportunity type - all are UK regulated and trusted.
      </p>

      {/* Betting Partners */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              Betting Partners
            </h3>
            <p className="text-gray-500 text-sm">
              UK Gambling Commission Regulated
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {bettingPartners.map((partner) => (
            <PartnerCard key={partner.name} partner={partner} />
          ))}
        </div>
      </div>

      {/* Stock Brokers */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-green-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Stock Brokers</h3>
            <p className="text-gray-500 text-sm">FCA Regulated</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {stockBrokers.map((partner) => (
            <PartnerCard key={partner.name} partner={partner} />
          ))}
        </div>
      </div>

      {/* Crypto Exchanges */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
            <Bitcoin className="w-4 h-4 text-orange-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              Crypto Exchanges
            </h3>
            <p className="text-gray-500 text-sm">UK Compliant</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {cryptoExchanges.map((partner) => (
            <PartnerCard key={partner.name} partner={partner} />
          ))}
        </div>
      </div>

      {/* Affiliate Disclosure */}
      <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4 mt-8">
        <p className="text-gray-500 text-xs text-center">
          <span className="font-medium text-gray-400">
            Affiliate Disclosure:
          </span>{" "}
          Some links on this page are affiliate links. If you sign up through
          these links, we may receive a commission at no extra cost to you. This
          helps support our free tools and content. We only recommend platforms
          we trust and use ourselves.
        </p>
      </div>
    </div>
  );
}

// Partner Card Component
function PartnerCard({
  partner,
}: {
  partner: {
    name: string;
    tagline: string;
    icon: React.ReactNode;
    iconBg: string;
    benefits: string[];
    url: string;
  };
}) {
  return (
    <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700 hover:border-gray-600 transition-all hover:bg-gray-800/70 flex flex-col h-full">
      {/* Header with Icon */}
      <div className="flex items-start space-x-3 mb-3">
        <div
          className={`w-12 h-12 ${partner.iconBg} rounded-xl flex items-center justify-center text-white flex-shrink-0`}
        >
          {partner.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-semibold text-lg">{partner.name}</h4>
          <p className="text-gray-400 text-sm">{partner.tagline}</p>
        </div>
      </div>

      {/* Benefits List */}
      <div className="flex-1 space-y-2 mb-4">
        {partner.benefits.map((benefit, index) => (
          <div key={index} className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-300 text-sm">{benefit}</span>
          </div>
        ))}
      </div>

      {/* Sign Up Button */}
      <a
        href={partner.url}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center space-x-2 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
      >
        <span>Sign Up</span>
        <ExternalLink className="w-4 h-4" />
      </a>
    </div>
  );
}

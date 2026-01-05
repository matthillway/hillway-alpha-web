"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  TrendingUp,
  Activity,
  DollarSign,
  Bell,
  Settings,
  LogOut,
  BarChart3,
  Bitcoin,
  RefreshCw,
  ChevronRight,
  ChevronDown,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  BookOpen,
  PieChart,
  Target,
  Gift,
  Lightbulb,
  Zap,
} from "lucide-react";
import { getTipOfTheDay, getQuickTips, type Tip } from "@/lib/tips";

interface Metrics {
  today: {
    opportunities: number;
    byCategory: Record<string, number>;
    bestMargin: number;
  };
  positions: {
    open: number;
    openValue: number;
  };
  performance: {
    weekPnl: number;
    totalPnl: number;
    winRate: number;
    totalTrades: number;
  };
  summary: {
    todayOpportunities: number;
    openPositions: number;
    weekPnl: number;
    totalPnl: number;
  };
}

interface Opportunity {
  id: string;
  category: string;
  title: string;
  description: string;
  confidence_score: number;
  expected_value: number;
  data: Record<string, unknown>;
  created_at: string;
  expires_at: string | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [scanning, setScanning] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userTier, setUserTier] = useState<string>("free");
  const [bettingExpanded, setBettingExpanded] = useState(false);
  const [dailyTip, setDailyTip] = useState<Tip | null>(null);
  const [quickTips, setQuickTips] = useState<Tip[]>([]);

  const fetchData = useCallback(async () => {
    setRefreshing(true);
    try {
      const [metricsRes, opportunitiesRes] = await Promise.all([
        fetch("/api/metrics"),
        fetch("/api/opportunities?status=open&limit=10"),
      ]);

      if (metricsRes.ok) {
        const metricsData = await metricsRes.json();
        setMetrics(metricsData);
      }

      if (opportunitiesRes.ok) {
        const oppData = await opportunitiesRes.json();
        setOpportunities(oppData.opportunities || []);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    async function init() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      setUser(session.user);

      // Fetch user profile (includes role and subscription tier)
      const { data: userProfile } = await supabase
        .from("user_profiles")
        .select("role, subscription_tier")
        .eq("id", session.user.id)
        .single();

      if (userProfile) {
        // Check if user is admin
        if (
          userProfile.role === "super_admin" ||
          userProfile.role === "admin"
        ) {
          setIsAdmin(true);
        }

        // Set subscription tier
        if (userProfile.subscription_tier) {
          setUserTier(userProfile.subscription_tier);
        }
      }

      setLoading(false);
      fetchData();

      // Load tips
      setDailyTip(getTipOfTheDay());
      setQuickTips(getQuickTips(undefined, 4));
    }
    init();
  }, [router, fetchData]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleScan = async (scanType: string) => {
    setScanning(true);
    try {
      const res = await fetch("/api/scanner/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scanType,
          userId: user?.id,
          userTier,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        await fetchData();
        const count = data.opportunities?.length ?? 0;
        success(
          count > 0
            ? `Scan complete! Found ${count} new ${count === 1 ? "opportunity" : "opportunities"}.`
            : "Scan complete. No new opportunities found.",
        );
      } else {
        const errorData = await res.json();
        console.error("Scan error:", errorData);
        showError(errorData.error || "Failed to run scan. Please try again.");
      }
    } catch (err) {
      console.error("Scan failed:", err);
      showError("Network error. Please check your connection and try again.");
    } finally {
      setScanning(false);
    }
  };

  const formatCurrency = (value: number) => {
    const prefix = value >= 0 ? "+" : "";
    return `${prefix}£${Math.abs(value).toFixed(2)}`;
  };

  const formatPercent = (value: number) => {
    const prefix = value >= 0 ? "+" : "";
    return `${prefix}${value.toFixed(1)}%`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "arbitrage":
      case "value_bet":
        return <TrendingUp className="w-4 h-4" />;
      case "stock":
        return <BarChart3 className="w-4 h-4" />;
      case "crypto":
        return <Bitcoin className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "arbitrage":
        return "text-blue-500 bg-blue-500/20";
      case "value_bet":
        return "text-purple-500 bg-purple-500/20";
      case "stock":
        return "text-green-500 bg-green-500/20";
      case "crypto":
        return "text-orange-500 bg-orange-500/20";
      default:
        return "text-gray-500 bg-gray-500/20";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Dashboard Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">TradeSmart</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => fetchData()}
                disabled={refreshing}
                className="text-gray-400 hover:text-white disabled:opacity-50"
                aria-label="Refresh data"
              >
                <RefreshCw
                  className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
                />
              </button>
              <button
                onClick={() => router.push("/portfolio")}
                className="text-gray-400 hover:text-white"
                aria-label="Portfolio"
                title="Portfolio & P&L"
              >
                <PieChart className="w-5 h-5" />
              </button>
              <button
                onClick={() => router.push("/guides")}
                className="text-gray-400 hover:text-white"
                aria-label="Getting Started Guide"
                title="Getting Started Guide"
              >
                <BookOpen className="w-5 h-5" />
              </button>
              {isAdmin && (
                <button
                  onClick={() => router.push("/admin")}
                  className="text-yellow-500 hover:text-yellow-400"
                  aria-label="Admin panel"
                  title="Admin Panel"
                >
                  <Shield className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => router.push("/notifications")}
                className="text-gray-400 hover:text-white"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
              </button>
              <button
                onClick={() => router.push("/settings")}
                className="text-gray-400 hover:text-white"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={handleSignOut}
                className="text-gray-400 hover:text-white"
                aria-label="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">
            Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}!
          </h1>
          <p className="text-gray-400 mt-1">
            Here&apos;s your opportunity overview for today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">
                  Today&apos;s Opportunities
                </p>
                <p className="text-3xl font-bold text-white mt-1">
                  {metrics?.today.opportunities ?? 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-sm">
              {Object.entries(metrics?.today.byCategory || {}).map(
                ([cat, count]) => (
                  <span key={cat} className="text-gray-500 mr-3">
                    {cat}: {count}
                  </span>
                ),
              )}
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Open Positions</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {metrics?.positions.open ?? 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-2">
              Value: £{(metrics?.positions.openValue ?? 0).toFixed(2)}
            </p>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Week P&L</p>
                <p
                  className={`text-3xl font-bold mt-1 ${
                    (metrics?.performance.weekPnl ?? 0) >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {formatCurrency(metrics?.performance.weekPnl ?? 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                {(metrics?.performance.weekPnl ?? 0) >= 0 ? (
                  <ArrowUpRight className="w-6 h-6 text-green-500" />
                ) : (
                  <ArrowDownRight className="w-6 h-6 text-red-500" />
                )}
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-2">
              Win rate: {metrics?.performance.winRate ?? 0}%
            </p>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total P&L</p>
                <p
                  className={`text-3xl font-bold mt-1 ${
                    (metrics?.performance.totalPnl ?? 0) >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {formatCurrency(metrics?.performance.totalPnl ?? 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-orange-500" />
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-2">
              {metrics?.performance.totalTrades ?? 0} trades total
            </p>
          </div>
        </div>

        {/* Tip of the Day & Quick Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Tip of the Day */}
          {dailyTip && (
            <div className="lg:col-span-2 bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-500/30">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-6 h-6 text-yellow-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      Tip of the Day
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        dailyTip.category === "arbitrage"
                          ? "bg-blue-500/20 text-blue-400"
                          : dailyTip.category === "value_bet"
                            ? "bg-purple-500/20 text-purple-400"
                            : dailyTip.category === "stock"
                              ? "bg-green-500/20 text-green-400"
                              : dailyTip.category === "crypto"
                                ? "bg-orange-500/20 text-orange-400"
                                : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {dailyTip.category === "value_bet"
                        ? "Value Bet"
                        : dailyTip.category.charAt(0).toUpperCase() +
                          dailyTip.category.slice(1)}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        dailyTip.level === "beginner"
                          ? "bg-green-500/20 text-green-400"
                          : dailyTip.level === "intermediate"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {dailyTip.level.charAt(0).toUpperCase() +
                        dailyTip.level.slice(1)}
                    </span>
                  </div>
                  <h4 className="text-white font-medium mb-2">
                    {dailyTip.title}
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {dailyTip.content}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Tips Sidebar */}
          <div className="bg-gray-900 rounded-xl border border-gray-800">
            <div className="px-4 py-3 border-b border-gray-800 flex items-center space-x-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <h3 className="text-white font-semibold text-sm">Quick Tips</h3>
            </div>
            <div className="p-4 space-y-3">
              {quickTips.map((tip, index) => (
                <div key={index} className="flex items-start space-x-3 group">
                  <div
                    className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${
                      tip.category === "arbitrage"
                        ? "bg-blue-500/20"
                        : tip.category === "value_bet"
                          ? "bg-purple-500/20"
                          : tip.category === "stock"
                            ? "bg-green-500/20"
                            : tip.category === "crypto"
                              ? "bg-orange-500/20"
                              : "bg-gray-500/20"
                    }`}
                  >
                    {getCategoryIcon(tip.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-300 text-xs leading-relaxed line-clamp-2">
                      {tip.content}
                    </p>
                  </div>
                </div>
              ))}
              <button
                onClick={() => router.push("/guides")}
                className="w-full text-center text-blue-500 hover:text-blue-400 text-xs mt-2 flex items-center justify-center"
              >
                View all guides <ChevronRight className="w-3 h-3 ml-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Scanner Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Betting Scanner Card with Expandable Sub-options */}
          <div className="bg-gray-900 rounded-xl border border-gray-800">
            <div className="p-6">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setBettingExpanded(!bettingExpanded)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">
                      Betting Scanners
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {(metrics?.today.byCategory?.arbitrage ?? 0) +
                        (metrics?.today.byCategory?.value_bet ?? 0)}{" "}
                      opportunities
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    bettingExpanded ? "rotate-180" : ""
                  }`}
                />
              </div>
              <p className="text-gray-400 text-sm mt-4 mb-4">
                Sports betting opportunities including arbitrage, value bets,
                and matched betting promotions.
              </p>
              <Button
                variant="primary"
                className="w-full"
                onClick={() => handleScan("betting")}
                loading={scanning}
              >
                Scan All Betting
              </Button>
            </div>

            {/* Expandable Sub-options */}
            {bettingExpanded && (
              <div className="border-t border-gray-800 p-4 space-y-3">
                {/* Arbitrage */}
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">
                        Arbitrage
                      </p>
                      <p className="text-gray-500 text-xs">
                        Guaranteed profit from odds gaps
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleScan("arbitrage")}
                    disabled={scanning}
                  >
                    Scan
                  </Button>
                </div>

                {/* Value Bets */}
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Target className="w-4 h-4 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">
                        Value Bets
                      </p>
                      <p className="text-gray-500 text-xs">
                        Odds higher than true probability
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleScan("value_bets")}
                    disabled={scanning}
                  >
                    Scan
                  </Button>
                </div>

                {/* Matched Betting */}
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <Gift className="w-4 h-4 text-green-500" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">
                        Matched Betting
                      </p>
                      <p className="text-gray-500 text-xs">
                        Free bets & bonus promotions
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleScan("matched_betting")}
                    disabled={scanning}
                  >
                    Scan
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Stock Momentum Card */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Stock Momentum</h3>
                <p className="text-gray-400 text-sm">
                  {metrics?.today.byCategory?.stock ?? 0} signals
                </p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Technical analysis on FTSE 100 and S&P 500 stocks.
            </p>
            <Button
              variant="primary"
              className="w-full"
              onClick={() => handleScan("stocks")}
              loading={scanning}
            >
              Scan Now
            </Button>
          </div>

          {/* Crypto Funding Card */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Bitcoin className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Crypto Funding</h3>
                <p className="text-gray-400 text-sm">
                  {metrics?.today.byCategory?.crypto ?? 0} opportunities
                </p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Funding rate arbitrage on Binance perpetual futures.
            </p>
            <Button
              variant="primary"
              className="w-full"
              onClick={() => handleScan("crypto")}
              loading={scanning}
            >
              Scan Now
            </Button>
          </div>
        </div>

        {/* Recent Opportunities */}
        <div className="bg-gray-900 rounded-xl border border-gray-800">
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              Recent Opportunities
            </h2>
            <button
              onClick={() => router.push("/opportunities")}
              className="text-blue-500 hover:text-blue-400 text-sm flex items-center"
            >
              View all <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="p-6">
            {opportunities.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No opportunities found yet.</p>
                <p className="text-gray-500 text-sm mt-1">
                  Run a scan to find opportunities.
                </p>
                <Button
                  variant="primary"
                  className="mt-4"
                  onClick={() => handleScan("all")}
                  loading={scanning}
                >
                  Run Full Scan
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {opportunities.map((opp) => (
                  <div
                    key={opp.id}
                    className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                    onClick={() => router.push(`/opportunities/${opp.id}`)}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${getCategoryColor(opp.category)}`}
                      >
                        {getCategoryIcon(opp.category)}
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{opp.title}</h3>
                        <p className="text-gray-400 text-sm">
                          {opp.description?.slice(0, 60)}...
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-green-500 font-semibold">
                        {opp.expected_value > 0
                          ? `+£${opp.expected_value.toFixed(2)}`
                          : `${formatPercent(Number(opp.data?.margin) || 0)}`}
                      </p>
                      <p className="text-gray-500 text-sm flex items-center justify-end">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(opp.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

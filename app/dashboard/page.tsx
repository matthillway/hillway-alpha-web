"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
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
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
} from "lucide-react";

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
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [scanning, setScanning] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

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

      // Check if user is admin
      const { data: adminData } = await supabase
        .from("admin_users")
        .select("role")
        .eq("user_id", session.user.id)
        .single();

      if (adminData?.role === "super_admin" || adminData?.role === "admin") {
        setIsAdmin(true);
      }

      setLoading(false);
      fetchData();
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
          userTier: "starter", // TODO: Get from user profile
        }),
      });

      if (res.ok) {
        await fetchData();
      } else {
        const error = await res.json();
        console.error("Scan error:", error);
        // TODO: Show error toast
      }
    } catch (error) {
      console.error("Scan failed:", error);
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

        {/* Scanner Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Betting Arbitrage</h3>
                <p className="text-gray-400 text-sm">
                  {metrics?.today.byCategory?.arbitrage ?? 0} opportunities
                </p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Find guaranteed profit from odds discrepancies across bookmakers.
            </p>
            <Button
              variant="primary"
              className="w-full"
              onClick={() => handleScan("arbitrage")}
              disabled={scanning}
            >
              {scanning ? "Scanning..." : "Scan Now"}
            </Button>
          </div>

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
              disabled={scanning}
            >
              {scanning ? "Scanning..." : "Scan Now"}
            </Button>
          </div>

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
              disabled={scanning}
            >
              {scanning ? "Scanning..." : "Scan Now"}
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
                  disabled={scanning}
                >
                  {scanning ? "Scanning..." : "Run Full Scan"}
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

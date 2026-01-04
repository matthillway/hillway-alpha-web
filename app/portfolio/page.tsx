"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Bitcoin,
  Activity,
  Percent,
  PieChart,
  Clock,
  Plus,
  X,
  Edit2,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

interface Portfolio {
  id: string;
  user_id: string;
  opening_balance: number;
  current_balance: number;
  created_at: string;
  updated_at: string;
}

interface Trade {
  id: string;
  user_id: string;
  opportunity_id: string | null;
  category: string;
  title: string | null;
  entry_amount: number;
  exit_amount: number | null;
  pnl: number | null;
  pnl_percent: number | null;
  status: string;
  notes: string | null;
  opened_at: string;
  closed_at: string | null;
}

interface PortfolioStats {
  totalPnl: number;
  pnlPercent: number;
  winRate: number;
  totalTrades: number;
  openTrades: number;
  openPositionsValue: number;
  winningTrades: number;
  losingTrades: number;
  avgWin: number;
  avgLoss: number;
  currentBalance: number;
}

interface ChartDataPoint {
  date: string;
  dailyPnl: number;
  cumulativePnl: number;
}

interface PnlByCategory {
  [key: string]: { pnl: number; count: number };
}

type TimeRange = "daily" | "weekly" | "monthly";

export default function PortfolioPage() {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [stats, setStats] = useState<PortfolioStats | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [pnlByCategory, setPnlByCategory] = useState<PnlByCategory>({});
  const [recentTrades, setRecentTrades] = useState<Trade[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>("daily");

  // Modal states
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [showCloseTradeModal, setShowCloseTradeModal] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);

  // Form states
  const [openingBalance, setOpeningBalance] = useState("");
  const [tradeForm, setTradeForm] = useState({
    category: "arbitrage",
    title: "",
    entryAmount: "",
    notes: "",
  });
  const [exitAmount, setExitAmount] = useState("");

  const fetchData = useCallback(async () => {
    if (!user?.id) return;

    setRefreshing(true);
    try {
      const res = await fetch(`/api/portfolio?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setPortfolio(data.portfolio);
        setStats(data.stats);
        setChartData(data.chartData || []);
        setPnlByCategory(data.pnlByCategory || {});
        setRecentTrades(data.recentTrades || []);

        // Show setup modal if no portfolio exists
        if (!data.portfolio) {
          setShowSetupModal(true);
        }
      } else {
        showError("Failed to fetch portfolio data");
      }
    } catch (err) {
      console.error("Error fetching portfolio:", err);
      showError("Network error. Please check your connection.");
    } finally {
      setRefreshing(false);
    }
  }, [user?.id, showError]);

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
      setLoading(false);
    }
    init();
  }, [router]);

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user?.id, fetchData]);

  const handleSetupPortfolio = async () => {
    const balance = parseFloat(openingBalance);
    if (isNaN(balance) || balance < 0) {
      showError("Please enter a valid opening balance");
      return;
    }

    try {
      const res = await fetch("/api/portfolio/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id, openingBalance: balance }),
      });

      if (res.ok) {
        success("Portfolio setup complete!");
        setShowSetupModal(false);
        setOpeningBalance("");
        fetchData();
      } else {
        const data = await res.json();
        showError(data.error || "Failed to setup portfolio");
      }
    } catch (err) {
      console.error("Error setting up portfolio:", err);
      showError("Network error. Please try again.");
    }
  };

  const handleRecordTrade = async () => {
    const entryAmount = parseFloat(tradeForm.entryAmount);
    if (isNaN(entryAmount) || entryAmount <= 0) {
      showError("Please enter a valid entry amount");
      return;
    }

    try {
      const res = await fetch("/api/portfolio/trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          category: tradeForm.category,
          title: tradeForm.title || null,
          entryAmount,
          notes: tradeForm.notes || null,
        }),
      });

      if (res.ok) {
        success("Trade recorded successfully!");
        setShowTradeModal(false);
        setTradeForm({
          category: "arbitrage",
          title: "",
          entryAmount: "",
          notes: "",
        });
        fetchData();
      } else {
        const data = await res.json();
        showError(data.error || "Failed to record trade");
      }
    } catch (err) {
      console.error("Error recording trade:", err);
      showError("Network error. Please try again.");
    }
  };

  const handleCloseTrade = async () => {
    if (!selectedTrade) return;

    const exit = parseFloat(exitAmount);
    if (isNaN(exit) || exit < 0) {
      showError("Please enter a valid exit amount");
      return;
    }

    try {
      const res = await fetch(`/api/portfolio/trade/${selectedTrade.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exitAmount: exit, status: "closed" }),
      });

      if (res.ok) {
        success("Trade closed successfully!");
        setShowCloseTradeModal(false);
        setSelectedTrade(null);
        setExitAmount("");
        fetchData();
      } else {
        const data = await res.json();
        showError(data.error || "Failed to close trade");
      }
    } catch (err) {
      console.error("Error closing trade:", err);
      showError("Network error. Please try again.");
    }
  };

  const formatCurrency = (value: number) => {
    const prefix = value >= 0 ? "+" : "";
    return `${prefix}£${Math.abs(value).toFixed(2)}`;
  };

  const formatCurrencyPlain = (value: number) => {
    return `£${value.toFixed(2)}`;
  };

  const formatPercent = (value: number) => {
    const prefix = value >= 0 ? "+" : "";
    return `${prefix}${value.toFixed(2)}%`;
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

  // Filter chart data based on time range
  const getFilteredChartData = () => {
    if (!chartData.length) return [];

    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case "daily":
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case "weekly":
        startDate = new Date(now.setDate(now.getDate() - 30));
        break;
      case "monthly":
        startDate = new Date(now.setMonth(now.getMonth() - 12));
        break;
      default:
        startDate = new Date(now.setDate(now.getDate() - 7));
    }

    return chartData.filter((d) => new Date(d.date) >= startDate);
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
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push("/dashboard")}
                className="text-gray-400 hover:text-white mr-4"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <PieChart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Portfolio</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchData}
                disabled={refreshing}
                className="text-gray-400 hover:text-white disabled:opacity-50"
                aria-label="Refresh data"
              >
                <RefreshCw
                  className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
                />
              </button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowTradeModal(true)}
              >
                <Plus className="w-4 h-4 mr-1" />
                Record Trade
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Opening Bankroll */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Opening Bankroll</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {formatCurrencyPlain(portfolio?.opening_balance || 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <button
              onClick={() => setShowSetupModal(true)}
              className="text-blue-500 hover:text-blue-400 text-sm mt-2 flex items-center"
            >
              <Edit2 className="w-3 h-3 mr-1" />
              Edit
            </button>
          </div>

          {/* Current Balance */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Current Balance</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {formatCurrencyPlain(
                    stats?.currentBalance || portfolio?.opening_balance || 0,
                  )}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-2">
              {stats?.openTrades || 0} open positions
            </p>
          </div>

          {/* Total P&L */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total P&L</p>
                <p
                  className={`text-3xl font-bold mt-1 ${
                    (stats?.totalPnl || 0) >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {formatCurrency(stats?.totalPnl || 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                {(stats?.totalPnl || 0) >= 0 ? (
                  <TrendingUp className="w-6 h-6 text-green-500" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-red-500" />
                )}
              </div>
            </div>
            <p
              className={`text-sm mt-2 ${
                (stats?.pnlPercent || 0) >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {formatPercent(stats?.pnlPercent || 0)}
            </p>
          </div>

          {/* Win Rate */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Win Rate</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {(stats?.winRate || 0).toFixed(1)}%
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Percent className="w-6 h-6 text-orange-500" />
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-2">
              {stats?.winningTrades || 0}W / {stats?.losingTrades || 0}L (
              {stats?.totalTrades || 0} trades)
            </p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 mb-8">
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">P&L Over Time</h2>
            <div className="flex space-x-2">
              {(["daily", "weekly", "monthly"] as TimeRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    timeRange === range
                      ? "bg-blue-500 text-white"
                      : "bg-gray-800 text-gray-400 hover:text-white"
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="p-6">
            {getFilteredChartData().length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={getFilteredChartData()}>
                  <defs>
                    <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="date"
                    stroke="#9CA3AF"
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                      })
                    }
                  />
                  <YAxis
                    stroke="#9CA3AF"
                    tickFormatter={(value) => `£${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#9CA3AF" }}
                    formatter={(value) => [
                      `£${(value as number).toFixed(2)}`,
                      "Cumulative P&L",
                    ]}
                    labelFormatter={(label) =>
                      new Date(label as string).toLocaleDateString("en-GB")
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="cumulativePnl"
                    stroke="#3B82F6"
                    fillOpacity={1}
                    fill="url(#colorPnl)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
                <BarChart3 className="w-12 h-12 mb-4 opacity-50" />
                <p>No chart data available yet.</p>
                <p className="text-sm">
                  Close some trades to see your P&L over time.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* P&L by Category & Win/Loss Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* P&L by Category */}
          <div className="bg-gray-900 rounded-xl border border-gray-800">
            <div className="px-6 py-4 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">
                P&L by Category
              </h2>
            </div>
            <div className="p-6">
              {Object.keys(pnlByCategory).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(pnlByCategory).map(([category, data]) => (
                    <div
                      key={category}
                      className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${getCategoryColor(category)}`}
                        >
                          {getCategoryIcon(category)}
                        </div>
                        <div>
                          <p className="text-white font-medium capitalize">
                            {category.replace("_", " ")}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {data.count} trades
                          </p>
                        </div>
                      </div>
                      <p
                        className={`font-semibold ${
                          data.pnl >= 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {formatCurrency(data.pnl)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[200px] text-gray-400">
                  <PieChart className="w-12 h-12 mb-4 opacity-50" />
                  <p>No category data available yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Win/Loss Stats */}
          <div className="bg-gray-900 rounded-xl border border-gray-800">
            <div className="px-6 py-4 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">
                Trade Statistics
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-400 text-sm">
                      Winning Trades
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {stats?.winningTrades || 0}
                  </p>
                  <p className="text-green-500 text-sm">
                    Avg: {formatCurrency(stats?.avgWin || 0)}
                  </p>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <XCircle className="w-5 h-5 text-red-500" />
                    <span className="text-gray-400 text-sm">Losing Trades</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {stats?.losingTrades || 0}
                  </p>
                  <p className="text-red-500 text-sm">
                    Avg: {formatCurrency(stats?.avgLoss || 0)}
                  </p>
                </div>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Open Positions Value</span>
                  <span className="text-white font-semibold">
                    {formatCurrencyPlain(stats?.openPositionsValue || 0)}
                  </span>
                </div>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Trades</span>
                  <span className="text-white font-semibold">
                    {stats?.totalTrades || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Trades */}
        <div className="bg-gray-900 rounded-xl border border-gray-800">
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Recent Trades</h2>
          </div>
          <div className="p-6">
            {recentTrades.length > 0 ? (
              <div className="space-y-4">
                {recentTrades.map((trade) => (
                  <div
                    key={trade.id}
                    className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${getCategoryColor(trade.category)}`}
                      >
                        {getCategoryIcon(trade.category)}
                      </div>
                      <div>
                        <h3 className="text-white font-medium">
                          {trade.title ||
                            `${trade.category.charAt(0).toUpperCase() + trade.category.slice(1).replace("_", " ")} Trade`}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs ${
                              trade.status === "open"
                                ? "bg-yellow-500/20 text-yellow-500"
                                : trade.status === "closed"
                                  ? "bg-green-500/20 text-green-500"
                                  : "bg-gray-500/20 text-gray-400"
                            }`}
                          >
                            {trade.status}
                          </span>
                          <span className="text-gray-500 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(trade.opened_at).toLocaleDateString(
                              "en-GB",
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {trade.status === "closed" ? (
                        <p
                          className={`font-semibold ${
                            (trade.pnl || 0) >= 0
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {formatCurrency(trade.pnl || 0)}
                        </p>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedTrade(trade);
                            setExitAmount(trade.entry_amount.toString());
                            setShowCloseTradeModal(true);
                          }}
                        >
                          Close Trade
                        </Button>
                      )}
                      <p className="text-gray-500 text-sm">
                        Entry: {formatCurrencyPlain(trade.entry_amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Activity className="w-12 h-12 mb-4 opacity-50" />
                <p>No trades recorded yet.</p>
                <Button
                  variant="primary"
                  className="mt-4"
                  onClick={() => setShowTradeModal(true)}
                >
                  Record Your First Trade
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Setup Modal */}
      {showSetupModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Setup Portfolio</h2>
              <button
                onClick={() => setShowSetupModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Opening Bankroll (£)
                </label>
                <input
                  type="number"
                  value={openingBalance}
                  onChange={(e) => setOpeningBalance(e.target.value)}
                  placeholder="1000.00"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-gray-500 text-sm mt-2">
                  Enter your starting capital for tracking P&L
                </p>
              </div>
              <Button
                variant="primary"
                className="w-full"
                onClick={handleSetupPortfolio}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Record Trade Modal */}
      {showTradeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Record Trade</h2>
              <button
                onClick={() => setShowTradeModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Category
                </label>
                <select
                  value={tradeForm.category}
                  onChange={(e) =>
                    setTradeForm({ ...tradeForm, category: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="arbitrage">Arbitrage</option>
                  <option value="stock">Stock</option>
                  <option value="crypto">Crypto</option>
                  <option value="value_bet">Value Bet</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Title (optional)
                </label>
                <input
                  type="text"
                  value={tradeForm.title}
                  onChange={(e) =>
                    setTradeForm({ ...tradeForm, title: e.target.value })
                  }
                  placeholder="e.g., BTC/USDT Long"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Entry Amount (£)
                </label>
                <input
                  type="number"
                  value={tradeForm.entryAmount}
                  onChange={(e) =>
                    setTradeForm({ ...tradeForm, entryAmount: e.target.value })
                  }
                  placeholder="100.00"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Notes (optional)
                </label>
                <textarea
                  value={tradeForm.notes}
                  onChange={(e) =>
                    setTradeForm({ ...tradeForm, notes: e.target.value })
                  }
                  placeholder="Any additional notes..."
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <Button
                variant="primary"
                className="w-full"
                onClick={handleRecordTrade}
              >
                Record Trade
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Close Trade Modal */}
      {showCloseTradeModal && selectedTrade && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Close Trade</h2>
              <button
                onClick={() => {
                  setShowCloseTradeModal(false);
                  setSelectedTrade(null);
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <p className="text-gray-400 text-sm">Trade</p>
                <p className="text-white font-medium">
                  {selectedTrade.title || `${selectedTrade.category} Trade`}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Entry: {formatCurrencyPlain(selectedTrade.entry_amount)}
                </p>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Exit Amount (£)
                </label>
                <input
                  type="number"
                  value={exitAmount}
                  onChange={(e) => setExitAmount(e.target.value)}
                  placeholder="100.00"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {exitAmount && (
                  <p
                    className={`text-sm mt-2 ${
                      parseFloat(exitAmount) - selectedTrade.entry_amount >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    P&L:{" "}
                    {formatCurrency(
                      parseFloat(exitAmount) - selectedTrade.entry_amount,
                    )}
                  </p>
                )}
              </div>
              <Button
                variant="primary"
                className="w-full"
                onClick={handleCloseTrade}
              >
                Close Trade
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

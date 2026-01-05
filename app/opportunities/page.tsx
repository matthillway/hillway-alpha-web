"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  ArrowLeft,
  TrendingUp,
  BarChart3,
  Bitcoin,
  Activity,
  Clock,
  ChevronRight,
  RefreshCw,
  Filter,
  Search,
} from "lucide-react";

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
  status: string;
}

type FilterCategory = "all" | "arbitrage" | "value_bet" | "stock" | "crypto";
type FilterStatus = "all" | "open" | "taken" | "dismissed";

export default function OpportunitiesListPage() {
  const router = useRouter();
  const { error: showError } = useToast();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [category, setCategory] = useState<FilterCategory>("all");
  const [status, setStatus] = useState<FilterStatus>("open");
  const limit = 20;

  const fetchOpportunities = useCallback(async () => {
    setRefreshing(true);
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      });
      if (category !== "all") params.set("category", category);
      if (status !== "all") params.set("status", status);

      const res = await fetch(`/api/opportunities?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setOpportunities(data.opportunities || []);
        setTotal(data.total || 0);
      } else {
        showError("Failed to load opportunities");
      }
    } catch (err) {
      console.error("Error fetching opportunities:", err);
      showError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [offset, category, status, showError]);

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      fetchOpportunities();
    }
    checkAuth();
  }, [router, fetchOpportunities]);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
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

  const getCategoryColor = (cat: string) => {
    switch (cat) {
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

  const getStatusColor = (s: string) => {
    switch (s) {
      case "open":
        return "bg-green-500/20 text-green-500";
      case "taken":
        return "bg-blue-500/20 text-blue-500";
      case "dismissed":
        return "bg-gray-500/20 text-gray-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const formatPercent = (value: number) => {
    const prefix = value >= 0 ? "+" : "";
    return `${prefix}${value.toFixed(1)}%`;
  };

  const handleFilterChange = (
    newCategory: FilterCategory,
    newStatus: FilterStatus,
  ) => {
    setCategory(newCategory);
    setStatus(newStatus);
    setOffset(0);
  };

  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;

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
                  <Search className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">
                  Opportunities
                </span>
              </div>
            </div>
            <button
              onClick={() => fetchOpportunities()}
              disabled={refreshing}
              className="text-gray-400 hover:text-white disabled:opacity-50"
              aria-label="Refresh"
            >
              <RefreshCw
                className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label
                htmlFor="category-filter"
                className="block text-sm text-gray-400 mb-2"
              >
                <Filter className="w-4 h-4 inline mr-1" aria-hidden="true" />
                Category
              </label>
              <select
                id="category-filter"
                value={category}
                onChange={(e) =>
                  handleFilterChange(e.target.value as FilterCategory, status)
                }
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="arbitrage">Arbitrage</option>
                <option value="value_bet">Value Bet</option>
                <option value="stock">Stock</option>
                <option value="crypto">Crypto</option>
              </select>
            </div>
            <div className="flex-1">
              <label
                htmlFor="status-filter"
                className="block text-sm text-gray-400 mb-2"
              >
                <Filter className="w-4 h-4 inline mr-1" aria-hidden="true" />
                Status
              </label>
              <select
                id="status-filter"
                value={status}
                onChange={(e) =>
                  handleFilterChange(category, e.target.value as FilterStatus)
                }
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="taken">Taken</option>
                <option value="dismissed">Dismissed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-400 text-sm">
            Showing {opportunities.length} of {total} opportunities
          </p>
        </div>

        {/* Opportunities List */}
        <div className="bg-gray-900 rounded-xl border border-gray-800">
          {opportunities.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No opportunities found.</p>
              <p className="text-gray-500 text-sm mt-1">
                Try changing your filters or run a new scan.
              </p>
              <Button
                variant="primary"
                className="mt-4"
                onClick={() => router.push("/dashboard")}
              >
                Back to Dashboard
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {opportunities.map((opp) => (
                <div
                  key={opp.id}
                  role="button"
                  tabIndex={0}
                  className="p-4 hover:bg-gray-800/50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/opportunities/${opp.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      router.push(`/opportunities/${opp.id}`);
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${getCategoryColor(opp.category)}`}
                      >
                        {getCategoryIcon(opp.category)}
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{opp.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs capitalize ${getCategoryColor(opp.category)}`}
                          >
                            {opp.category.replace("_", " ")}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(opp.status)}`}
                          >
                            {opp.status}
                          </span>
                          <span className="text-gray-500 text-xs flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(opp.created_at).toLocaleDateString(
                              "en-GB",
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-green-500 font-semibold">
                          {opp.expected_value > 0
                            ? `+${opp.expected_value.toFixed(2)}`
                            : `${formatPercent(Number(opp.data?.margin) || 0)}`}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {opp.confidence_score}% confidence
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <Button
              variant="outline"
              disabled={offset === 0}
              onClick={() => setOffset(Math.max(0, offset - limit))}
            >
              Previous
            </Button>
            <span className="text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={currentPage >= totalPages}
              onClick={() => setOffset(offset + limit)}
            >
              Next
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

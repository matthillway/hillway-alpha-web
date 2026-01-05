"use client";

import { useEffect, useState, use } from "react";
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
  CheckCircle,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Copy,
  Percent,
  DollarSign,
  Calendar,
  Tag,
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

export default function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function checkAuthAndFetch() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      fetchOpportunity();
    }
    checkAuthAndFetch();
  }, [id, router]);

  const fetchOpportunity = async () => {
    try {
      const res = await fetch(`/api/opportunities/${id}`);
      if (res.ok) {
        const data = await res.json();
        setOpportunity(data);
      } else if (res.status === 404) {
        showError("Opportunity not found");
        router.push("/dashboard");
      } else {
        showError("Failed to load opportunity");
      }
    } catch (err) {
      console.error("Error fetching opportunity:", err);
      showError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/opportunities/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const updated = await res.json();
        setOpportunity(updated);
        success(
          newStatus === "taken"
            ? "Opportunity marked as taken!"
            : "Opportunity dismissed",
        );
      } else {
        showError("Failed to update opportunity");
      }
    } catch (err) {
      console.error("Error updating opportunity:", err);
      showError("Network error. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    success("Copied to clipboard!");
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "arbitrage":
      case "value_bet":
        return <TrendingUp className="w-5 h-5" />;
      case "stock":
        return <BarChart3 className="w-5 h-5" />;
      case "crypto":
        return <Bitcoin className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <span className="px-3 py-1 rounded-full text-sm bg-green-500/20 text-green-500 flex items-center">
            <CheckCircle className="w-4 h-4 mr-1" />
            Open
          </span>
        );
      case "taken":
        return (
          <span className="px-3 py-1 rounded-full text-sm bg-blue-500/20 text-blue-500 flex items-center">
            <CheckCircle className="w-4 h-4 mr-1" />
            Taken
          </span>
        );
      case "dismissed":
        return (
          <span className="px-3 py-1 rounded-full text-sm bg-gray-500/20 text-gray-400 flex items-center">
            <XCircle className="w-4 h-4 mr-1" />
            Dismissed
          </span>
        );
      case "expired":
        return (
          <span className="px-3 py-1 rounded-full text-sm bg-red-500/20 text-red-500 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-1" />
            Expired
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-sm bg-gray-500/20 text-gray-400">
            {status}
          </span>
        );
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "number") {
      if (Number.isInteger(value)) return value.toString();
      return value.toFixed(2);
    }
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "object") return JSON.stringify(value, null, 2);
    return String(value);
  };

  const formatKey = (key: string): string => {
    return key
      .replace(/_/g, " ")
      .replace(/([A-Z])/g, " $1")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">
            Opportunity Not Found
          </h1>
          <p className="text-gray-400 mb-6">
            This opportunity may have been removed or expired.
          </p>
          <Button onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const isExpired =
    opportunity.expires_at && new Date(opportunity.expires_at) < new Date();

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push("/dashboard")}
                className="text-gray-400 hover:text-white mr-4 flex items-center"
              >
                <ArrowLeft className="w-5 h-5 mr-1" />
                <span className="hidden sm:inline">Back to Dashboard</span>
              </button>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusBadge(isExpired ? "expired" : opportunity.status)}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title Section */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center ${getCategoryColor(opportunity.category)}`}
              >
                {getCategoryIcon(opportunity.category)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  {opportunity.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span
                    className={`px-2 py-1 rounded-lg ${getCategoryColor(opportunity.category)} capitalize`}
                  >
                    <Tag className="w-3 h-3 inline mr-1" />
                    {opportunity.category.replace("_", " ")}
                  </span>
                  <span className="text-gray-400 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(opportunity.created_at).toLocaleString("en-GB")}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(opportunity.id)}
              className="text-gray-500 hover:text-gray-300 p-2"
              title="Copy ID"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Confidence Score */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Confidence Score</p>
                <p
                  className={`text-3xl font-bold ${getConfidenceColor(opportunity.confidence_score)}`}
                >
                  {opportunity.confidence_score}%
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Percent className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Expected Value */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Expected Value</p>
                <p
                  className={`text-3xl font-bold ${opportunity.expected_value >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {opportunity.expected_value > 0 ? "+" : ""}
                  {opportunity.expected_value.toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>

          {/* Expires At */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Expires</p>
                <p
                  className={`text-xl font-bold ${isExpired ? "text-red-500" : "text-white"}`}
                >
                  {opportunity.expires_at
                    ? isExpired
                      ? "Expired"
                      : new Date(opportunity.expires_at).toLocaleString(
                          "en-GB",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "2-digit",
                            month: "short",
                          },
                        )
                    : "No expiry"}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Description</h2>
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
            {opportunity.description}
          </p>
        </div>

        {/* Opportunity Data */}
        {opportunity.data && Object.keys(opportunity.data).length > 0 && (
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Opportunity Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(opportunity.data).map(([key, value]) => (
                <div
                  key={key}
                  className="p-4 bg-gray-800/50 rounded-lg border border-gray-700"
                >
                  <p className="text-gray-400 text-sm mb-1">{formatKey(key)}</p>
                  {typeof value === "string" &&
                  (value.startsWith("http://") ||
                    value.startsWith("https://")) ? (
                    <a
                      href={value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-400 flex items-center break-all"
                    >
                      {value.length > 40
                        ? value.substring(0, 40) + "..."
                        : value}
                      <ExternalLink className="w-4 h-4 ml-1 flex-shrink-0" />
                    </a>
                  ) : typeof value === "object" ? (
                    <pre className="text-white text-sm overflow-x-auto bg-gray-900 p-2 rounded mt-1">
                      {JSON.stringify(value, null, 2)}
                    </pre>
                  ) : (
                    <p className="text-white font-medium">
                      {formatValue(value)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {opportunity.status === "open" && !isExpired && (
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Actions</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => updateStatus("taken")}
                disabled={updating}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {updating ? "Updating..." : "Mark as Taken"}
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => updateStatus("dismissed")}
                disabled={updating}
              >
                <XCircle className="w-4 h-4 mr-2" />
                {updating ? "Updating..." : "Dismiss"}
              </Button>
            </div>
            <p className="text-gray-500 text-sm mt-4 text-center">
              Mark this opportunity as taken if you acted on it, or dismiss if
              you&apos;re not interested.
            </p>
          </div>
        )}

        {/* Already actioned message */}
        {(opportunity.status !== "open" || isExpired) && (
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 text-center">
            <p className="text-gray-400">
              {isExpired
                ? "This opportunity has expired and can no longer be acted upon."
                : opportunity.status === "taken"
                  ? "You have already marked this opportunity as taken."
                  : "You have dismissed this opportunity."}
            </p>
            <Button
              variant="secondary"
              className="mt-4"
              onClick={() => router.push("/dashboard")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  getExecutionGuidance,
  getQuickTips,
  getAvailablePlatforms,
  getPlatformInstructions,
  type OpportunityCategory,
  type CategoryGuidance,
  type Tip,
} from "@/lib/tips";
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
  Brain,
  Shield,
  Target,
  Zap,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  Info,
} from "lucide-react";

// AI Analysis types (matching lib/ai/analyze-opportunity.ts)
interface AIAnalysis {
  riskAssessment: {
    level: "low" | "medium" | "high";
    score: number;
    factors: string[];
  };
  recommendedAction: {
    action: "take" | "pass" | "monitor";
    confidence: number;
    reasoning: string;
  };
  confidenceExplanation: string;
  potentialPitfalls: string[];
  timing: {
    urgency: "immediate" | "soon" | "flexible";
    optimalWindow: string;
  };
  summary: string;
}

interface Opportunity {
  id: string;
  category: string;
  subcategory?: string;
  title: string;
  description: string;
  confidence_score: number;
  expected_value: number;
  data: Record<string, unknown> & { aiAnalysis?: AIAnalysis };
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
  const [guidance, setGuidance] = useState<CategoryGuidance | null>(null);
  const [tips, setTips] = useState<Tip[]>([]);
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "execution",
  ]);

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

        // Load guidance for the category
        const cat = data.category as OpportunityCategory;
        if (
          cat === "arbitrage" ||
          cat === "value_bet" ||
          cat === "stock" ||
          cat === "crypto"
        ) {
          setGuidance(getExecutionGuidance(cat));
          setTips(getQuickTips(cat, 3));
          const availablePlatforms = getAvailablePlatforms(cat);
          setPlatforms(availablePlatforms);
          if (availablePlatforms.length > 0) {
            setSelectedPlatform(availablePlatforms[0]);
          }
        }
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

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section],
    );
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "info":
        return "text-blue-400 bg-blue-500/10 border-blue-500/30";
      case "warning":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30";
      case "danger":
        return "text-red-400 bg-red-500/10 border-red-500/30";
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/30";
    }
  };

  const getRiskLevelIcon = (level: string) => {
    switch (level) {
      case "info":
        return <Info className="w-4 h-4" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4" />;
      case "danger":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
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

  // AI Analysis helper functions
  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-500 bg-green-500/20";
      case "medium":
        return "text-yellow-500 bg-yellow-500/20";
      case "high":
        return "text-red-500 bg-red-500/20";
      default:
        return "text-gray-500 bg-gray-500/20";
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "take":
        return "text-green-500 bg-green-500/20";
      case "pass":
        return "text-red-500 bg-red-500/20";
      case "monitor":
        return "text-yellow-500 bg-yellow-500/20";
      default:
        return "text-gray-500 bg-gray-500/20";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "immediate":
        return "text-red-500";
      case "soon":
        return "text-yellow-500";
      case "flexible":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  // Extract AI analysis from opportunity data
  const aiAnalysis = opportunity?.data?.aiAnalysis as AIAnalysis | undefined;

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
                aria-label="Back to opportunities"
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
                  className={`text-2xl sm:text-3xl font-bold ${getConfidenceColor(opportunity.confidence_score)}`}
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
                  className={`text-2xl sm:text-3xl font-bold ${opportunity.expected_value >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {opportunity.expected_value >= 0 ? "+" : "-"}£
                  {Math.abs(opportunity.expected_value).toFixed(2)}
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

        {/* AI Analysis Section */}
        {aiAnalysis && (
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden mb-6">
            <div className="p-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-b border-gray-800">
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-500" />
                <h2 className="text-lg font-semibold text-white">
                  AI Analysis
                </h2>
                <span className="px-2 py-0.5 rounded text-xs bg-purple-500/20 text-purple-400">
                  Powered by Claude
                </span>
              </div>
            </div>

            <div className="p-6">
              {/* Summary */}
              <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                <p className="text-gray-300">{aiAnalysis.summary}</p>
              </div>

              {/* Risk Assessment & Recommended Action */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Risk Assessment */}
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400 text-sm font-medium">
                        Risk Assessment
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${getRiskColor(aiAnalysis.riskAssessment.level)}`}
                    >
                      {aiAnalysis.riskAssessment.level} (
                      {aiAnalysis.riskAssessment.score}/10)
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {aiAnalysis.riskAssessment.factors.map((factor, i) => (
                      <li
                        key={i}
                        className="text-gray-400 text-sm flex items-start"
                      >
                        <span className="text-gray-600 mr-2">-</span>
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommended Action */}
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400 text-sm font-medium">
                        Recommended Action
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${getActionColor(aiAnalysis.recommendedAction.action)}`}
                    >
                      {aiAnalysis.recommendedAction.action} (
                      {aiAnalysis.recommendedAction.confidence}%)
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {aiAnalysis.recommendedAction.reasoning}
                  </p>
                </div>
              </div>

              {/* Timing */}
              <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400 text-sm font-medium">
                    Timing
                  </span>
                  <span
                    className={`text-xs font-medium capitalize ${getUrgencyColor(aiAnalysis.timing.urgency)}`}
                  >
                    {aiAnalysis.timing.urgency}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">
                  {aiAnalysis.timing.optimalWindow}
                </p>
              </div>

              {/* Potential Pitfalls */}
              {aiAnalysis.potentialPitfalls.length > 0 && (
                <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    <span className="text-gray-400 text-sm font-medium">
                      Potential Pitfalls
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {aiAnalysis.potentialPitfalls.map((pitfall, i) => (
                      <li
                        key={i}
                        className="text-gray-400 text-sm flex items-start"
                      >
                        <XCircle className="w-3 h-3 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                        {pitfall}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Confidence Explanation */}
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400 text-sm font-medium">
                    Confidence Explanation
                  </span>
                </div>
                <p className="text-gray-400 text-sm">
                  {aiAnalysis.confidenceExplanation}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* How to Execute Section */}
        {guidance && (
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden mb-6">
            <button
              onClick={() => toggleSection("execution")}
              aria-expanded={expandedSections.includes("execution")}
              aria-controls="execution-content"
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Zap className="w-5 h-5 text-yellow-500" />
                <h2 className="text-lg font-semibold text-white">
                  How to Execute This Opportunity
                </h2>
              </div>
              {expandedSections.includes("execution") ? (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedSections.includes("execution") && (
              <div
                id="execution-content"
                className="px-6 pb-6 border-t border-gray-800"
              >
                <p className="text-gray-400 my-4">{guidance.overview}</p>

                {/* Step by Step */}
                <div className="space-y-4">
                  {guidance.executionSteps.map((step) => (
                    <div
                      key={step.step}
                      className="bg-gray-800/50 rounded-lg p-4 border border-gray-700"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-400 font-bold">
                            {step.step}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-medium">
                            {step.title}
                          </h4>
                          <p className="text-gray-400 text-sm mt-1">
                            {step.description}
                          </p>
                          {step.warning && (
                            <div className="flex items-start space-x-2 mt-2 text-yellow-400 text-sm">
                              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                              <span>{step.warning}</span>
                            </div>
                          )}
                          {step.tip && (
                            <div className="flex items-start space-x-2 mt-2 text-blue-400 text-sm">
                              <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" />
                              <span>{step.tip}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Platform Instructions */}
        {platforms.length > 0 && (
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden mb-6">
            <button
              onClick={() => toggleSection("platform")}
              aria-expanded={expandedSections.includes("platform")}
              aria-controls="platform-content"
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <ExternalLink className="w-5 h-5 text-purple-500" />
                <h2 className="text-lg font-semibold text-white">
                  Platform-Specific Instructions
                </h2>
              </div>
              {expandedSections.includes("platform") ? (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedSections.includes("platform") && (
              <div
                id="platform-content"
                className="px-6 pb-6 border-t border-gray-800"
              >
                {/* Platform selector */}
                <div className="flex flex-wrap gap-2 my-4">
                  {platforms.map((platform) => (
                    <button
                      key={platform}
                      onClick={() => setSelectedPlatform(platform)}
                      className={`min-w-[80px] px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedPlatform === platform
                          ? "bg-blue-600 text-white"
                          : "bg-gray-800 text-gray-400 hover:text-white"
                      }`}
                    >
                      {platform}
                    </button>
                  ))}
                </div>

                {/* Instructions for selected platform */}
                {selectedPlatform && (
                  <div className="space-y-2">
                    {getPlatformInstructions(
                      opportunity.category as OpportunityCategory,
                      selectedPlatform,
                    ).map((instruction, idx) => (
                      <div
                        key={idx}
                        className="flex items-start space-x-3 text-gray-300"
                      >
                        <span className="text-gray-500 font-mono text-sm">
                          {idx + 1}.
                        </span>
                        <span>{instruction}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Risk Warnings from Tips */}
        {guidance && guidance.riskWarnings.length > 0 && (
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden mb-6">
            <button
              onClick={() => toggleSection("tips-risk")}
              aria-expanded={expandedSections.includes("tips-risk")}
              aria-controls="tips-risk-content"
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-red-500" />
                <h2 className="text-lg font-semibold text-white">
                  Risk Warnings
                </h2>
              </div>
              {expandedSections.includes("tips-risk") ? (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedSections.includes("tips-risk") && (
              <div
                id="tips-risk-content"
                className="px-6 pb-6 border-t border-gray-800"
              >
                <div className="space-y-3 mt-4">
                  {guidance.riskWarnings.map((warning, idx) => (
                    <div
                      key={idx}
                      className={`rounded-lg p-4 border ${getRiskLevelColor(warning.level)}`}
                    >
                      <div className="flex items-start space-x-3">
                        {getRiskLevelIcon(warning.level)}
                        <div>
                          <h4 className="font-medium">{warning.title}</h4>
                          <p className="text-sm mt-1 opacity-80">
                            {warning.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Money Management & Quick Tips */}
        {guidance && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Money Management */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <DollarSign className="w-5 h-5 text-green-500" />
                <h3 className="text-lg font-semibold text-white">
                  Money Management
                </h3>
              </div>
              <ul className="space-y-2">
                {guidance.moneyManagement.slice(0, 4).map((tip, idx) => (
                  <li
                    key={idx}
                    className="flex items-start space-x-2 text-gray-400 text-sm"
                  >
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Tips */}
            {tips.length > 0 && (
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  <h3 className="text-lg font-semibold text-white">
                    Quick Tips
                  </h3>
                </div>
                <div className="space-y-3">
                  {tips.map((tip) => (
                    <div
                      key={tip.id}
                      className="bg-gray-800/50 rounded-lg p-3 border border-gray-700"
                    >
                      <h4 className="text-white font-medium text-sm">
                        {tip.title}
                      </h4>
                      <p className="text-gray-400 text-xs mt-1">
                        {tip.content}
                      </p>
                      <span
                        className={`inline-block mt-2 px-2 py-0.5 rounded text-xs ${
                          tip.level === "beginner"
                            ? "bg-green-500/20 text-green-400"
                            : tip.level === "intermediate"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {tip.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pro Tips & Common Mistakes */}
        {guidance && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Pro Tips */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="w-5 h-5 text-purple-500" />
                <h3 className="text-lg font-semibold text-white">Pro Tips</h3>
              </div>
              <ul className="space-y-2">
                {guidance.proTips.slice(0, 4).map((tip, idx) => (
                  <li
                    key={idx}
                    className="flex items-start space-x-2 text-gray-400 text-sm"
                  >
                    <span className="text-purple-400">*</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => router.push("/guides")}
                className="mt-4 text-blue-500 hover:text-blue-400 text-sm flex items-center"
              >
                View full guide <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            {/* Common Mistakes */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                <h3 className="text-lg font-semibold text-white">
                  Avoid These Mistakes
                </h3>
              </div>
              <ul className="space-y-2">
                {guidance.commonMistakes.slice(0, 4).map((mistake, idx) => (
                  <li
                    key={idx}
                    className="flex items-start space-x-2 text-gray-400 text-sm"
                  >
                    <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Opportunity Data */}
        {opportunity.data &&
          Object.keys(opportunity.data).filter((k) => k !== "aiAnalysis")
            .length > 0 && (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Technical Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(opportunity.data)
                  .filter(([key]) => key !== "aiAnalysis")
                  .map(([key, value]) => (
                    <div
                      key={key}
                      className="p-4 bg-gray-800/50 rounded-lg border border-gray-700"
                    >
                      <p className="text-gray-400 text-sm mb-1">
                        {formatKey(key)}
                      </p>
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
                        <div className="overflow-x-auto">
                          <pre className="text-white text-sm bg-gray-900 p-2 rounded mt-1">
                            {JSON.stringify(value, null, 2)}
                          </pre>
                        </div>
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

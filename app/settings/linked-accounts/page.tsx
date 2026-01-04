"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  ArrowLeft,
  Link2,
  Unlink,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity,
  BarChart3,
  Bitcoin,
  Clock,
  X,
  Eye,
  EyeOff,
} from "lucide-react";

type Platform = "betfair" | "ibkr" | "kraken";

interface LinkedAccount {
  id: string;
  platform: Platform;
  platform_user_id: string | null;
  is_active: boolean;
  last_sync_at: string | null;
  sync_error: string | null;
  created_at: string;
}

const PLATFORM_CONFIG = {
  betfair: {
    name: "Betfair",
    description: "UK-based betting exchange for sports and racing",
    authType: "oauth" as const,
    icon: Activity,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/20",
  },
  ibkr: {
    name: "Interactive Brokers",
    description: "Global trading platform for stocks, options, and more",
    authType: "apikey" as const,
    icon: BarChart3,
    color: "text-red-500",
    bgColor: "bg-red-500/20",
  },
  kraken: {
    name: "Kraken",
    description: "Cryptocurrency exchange",
    authType: "apikey" as const,
    icon: Bitcoin,
    color: "text-purple-500",
    bgColor: "bg-purple-500/20",
  },
};

export default function LinkedAccountsPage() {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([]);
  const [syncing, setSyncing] = useState<Platform | null>(null);
  const [disconnecting, setDisconnecting] = useState<Platform | null>(null);

  // API Key modal state
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(
    null,
  );
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [showApiSecret, setShowApiSecret] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const fetchLinkedAccounts = useCallback(async () => {
    try {
      const response = await fetch("/api/platforms/linked");
      if (response.ok) {
        const data = await response.json();
        setLinkedAccounts(data.accounts || []);
      }
    } catch (error) {
      console.error("Error fetching linked accounts:", error);
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
      setLoading(false);
    }
    init();
  }, [router]);

  useEffect(() => {
    if (user) {
      fetchLinkedAccounts();
    }
  }, [user, fetchLinkedAccounts]);

  const getAccountForPlatform = (
    platform: Platform,
  ): LinkedAccount | undefined => {
    return linkedAccounts.find((a) => a.platform === platform);
  };

  const handleConnectOAuth = async (platform: Platform) => {
    try {
      const response = await fetch(`/api/platforms/${platform}/connect`, {
        method: "POST",
      });
      if (response.ok) {
        const data = await response.json();
        // Redirect to OAuth provider
        window.location.href = data.authUrl;
      } else {
        const data = await response.json();
        showError(data.error || "Failed to start connection");
      }
    } catch (error) {
      console.error("Error connecting:", error);
      showError("Network error. Please try again.");
    }
  };

  const handleConnectApiKey = async () => {
    if (!selectedPlatform || !apiKey || !apiSecret) {
      showError("Please enter both API key and secret");
      return;
    }

    setConnecting(true);
    try {
      const response = await fetch(
        `/api/platforms/${selectedPlatform}/connect`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ apiKey, apiSecret }),
        },
      );

      if (response.ok) {
        success(
          `${PLATFORM_CONFIG[selectedPlatform].name} connected successfully!`,
        );
        setShowApiKeyModal(false);
        setApiKey("");
        setApiSecret("");
        setSelectedPlatform(null);
        fetchLinkedAccounts();
      } else {
        const data = await response.json();
        showError(data.error || "Failed to connect account");
      }
    } catch (error) {
      console.error("Error connecting:", error);
      showError("Network error. Please try again.");
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async (platform: Platform) => {
    if (
      !confirm(
        `Are you sure you want to disconnect ${PLATFORM_CONFIG[platform].name}?`,
      )
    ) {
      return;
    }

    setDisconnecting(platform);
    try {
      const response = await fetch(`/api/platforms/${platform}/disconnect`, {
        method: "DELETE",
      });

      if (response.ok) {
        success(`${PLATFORM_CONFIG[platform].name} disconnected`);
        fetchLinkedAccounts();
      } else {
        const data = await response.json();
        showError(data.error || "Failed to disconnect");
      }
    } catch (error) {
      console.error("Error disconnecting:", error);
      showError("Network error. Please try again.");
    } finally {
      setDisconnecting(null);
    }
  };

  const handleSync = async (platform: Platform) => {
    setSyncing(platform);
    try {
      const response = await fetch(`/api/platforms/${platform}/sync`);
      if (response.ok) {
        const data = await response.json();
        success(
          `Synced ${PLATFORM_CONFIG[platform].name}: Balance ${data.balance?.currency || ""} ${data.balance?.total?.toFixed(2) || "N/A"}`,
        );
        fetchLinkedAccounts();
      } else {
        const data = await response.json();
        showError(data.error || "Sync failed");
        fetchLinkedAccounts(); // Refresh to show error state
      }
    } catch (error) {
      console.error("Error syncing:", error);
      showError("Network error. Please try again.");
    } finally {
      setSyncing(null);
    }
  };

  const formatLastSync = (lastSync: string | null) => {
    if (!lastSync) return "Never synced";
    const date = new Date(lastSync);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => router.push("/settings")}
              className="text-gray-400 hover:text-white mr-4"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2">
              <Link2 className="w-5 h-5 text-blue-500" />
              <h1 className="text-xl font-bold text-white">Linked Accounts</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Description */}
        <div className="mb-8">
          <p className="text-gray-400">
            Connect your trading accounts to automatically sync balances,
            positions, and trade history. Your credentials are encrypted and
            securely stored.
          </p>
        </div>

        {/* Platform Cards */}
        <div className="space-y-4">
          {(Object.keys(PLATFORM_CONFIG) as Platform[]).map((platform) => {
            const config = PLATFORM_CONFIG[platform];
            const account = getAccountForPlatform(platform);
            const Icon = config.icon;
            const isConnected = !!account && account.is_active;
            const isSyncing = syncing === platform;
            const isDisconnecting = disconnecting === platform;

            return (
              <div
                key={platform}
                className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    {/* Platform Info */}
                    <div className="flex items-start space-x-4">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${config.bgColor}`}
                      >
                        <Icon className={`w-6 h-6 ${config.color}`} />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold text-white">
                            {config.name}
                          </h3>
                          {isConnected && (
                            <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-500 rounded-full flex items-center">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Connected
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm mt-1">
                          {config.description}
                        </p>

                        {/* Connection Info */}
                        {account && (
                          <div className="mt-3 space-y-1">
                            {account.platform_user_id && (
                              <p className="text-gray-500 text-xs">
                                Account: {account.platform_user_id}
                              </p>
                            )}
                            <p className="text-gray-500 text-xs flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              Last sync: {formatLastSync(account.last_sync_at)}
                            </p>
                            {account.sync_error && (
                              <p className="text-red-400 text-xs flex items-center">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                {account.sync_error}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      {isConnected ? (
                        <>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleSync(platform)}
                            disabled={isSyncing}
                          >
                            <RefreshCw
                              className={`w-4 h-4 mr-1 ${isSyncing ? "animate-spin" : ""}`}
                            />
                            {isSyncing ? "Syncing..." : "Sync"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDisconnect(platform)}
                            disabled={isDisconnecting}
                            className="text-red-400 hover:text-red-300 border-red-500/30 hover:border-red-500/50"
                          >
                            <Unlink className="w-4 h-4 mr-1" />
                            {isDisconnecting ? "..." : "Disconnect"}
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            if (config.authType === "oauth") {
                              handleConnectOAuth(platform);
                            } else {
                              setSelectedPlatform(platform);
                              setShowApiKeyModal(true);
                            }
                          }}
                        >
                          <Link2 className="w-4 h-4 mr-1" />
                          Connect
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-8 p-6 bg-gray-900/50 rounded-xl border border-gray-800">
          <h3 className="text-white font-semibold mb-2">
            About Account Linking
          </h3>
          <ul className="text-gray-400 text-sm space-y-2">
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Automatically import your balances and trade history</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>
                Track P&L across all your trading platforms in one place
              </span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>
                All credentials are encrypted using AES-256 encryption
              </span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Accounts sync automatically once per day</span>
            </li>
          </ul>
        </div>
      </main>

      {/* API Key Modal */}
      {showApiKeyModal && selectedPlatform && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                Connect {PLATFORM_CONFIG[selectedPlatform].name}
              </h2>
              <button
                onClick={() => {
                  setShowApiKeyModal(false);
                  setApiKey("");
                  setApiSecret("");
                  setSelectedPlatform(null);
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  API Key
                </label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  API Secret
                </label>
                <div className="relative">
                  <input
                    type={showApiSecret ? "text" : "password"}
                    value={apiSecret}
                    onChange={(e) => setApiSecret(e.target.value)}
                    placeholder="Enter your API secret"
                    className="w-full px-4 py-2 pr-10 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiSecret(!showApiSecret)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showApiSecret ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="p-3 bg-gray-800/50 rounded-lg">
                <p className="text-gray-400 text-xs">
                  {selectedPlatform === "kraken" && (
                    <>
                      Generate API keys at{" "}
                      <a
                        href="https://www.kraken.com/u/security/api"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        Kraken Security Settings
                      </a>
                      . Enable &quot;Query Funds&quot;, &quot;Query Open Orders
                      & Trades&quot;, and &quot;Query Closed Orders &
                      Trades&quot; permissions.
                    </>
                  )}
                  {selectedPlatform === "ibkr" && (
                    <>
                      API credentials can be configured in IBKR Client Portal.
                      Ensure read-only permissions for account data.
                    </>
                  )}
                </p>
              </div>

              <Button
                variant="primary"
                className="w-full"
                onClick={handleConnectApiKey}
                disabled={connecting || !apiKey || !apiSecret}
                loading={connecting}
              >
                {connecting ? "Connecting..." : "Connect Account"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Search, RefreshCw, Mail, Calendar, Shield } from "lucide-react";

interface UserProfile {
  id: string;
  email: string;
  role: string;
  subscription_tier: "free" | "starter" | "pro" | "unlimited";
  stripe_customer_id?: string;
  created_at: string;
}

const tiers = ["all", "free", "starter", "pro", "unlimited"] as const;

export default function MembersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTier, setSelectedTier] =
    useState<(typeof tiers)[number]>("all");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setUsers(data as UserProfile[]);
      setFilteredUsers(data as UserProfile[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    let result = users;

    // Filter by tier
    if (selectedTier !== "all") {
      result = result.filter((user) => user.subscription_tier === selectedTier);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((user) =>
        user.email?.toLowerCase().includes(query),
      );
    }

    setFilteredUsers(result);
  }, [users, selectedTier, searchQuery]);

  const getTierBadge = (tier: string) => {
    const styles: Record<string, string> = {
      free: "bg-gray-700 text-gray-300",
      starter: "bg-blue-500/20 text-blue-400",
      pro: "bg-purple-500/20 text-purple-400",
      unlimited: "bg-orange-500/20 text-orange-400",
    };
    return styles[tier] || styles.free;
  };

  const getRoleBadge = (role: string) => {
    if (role === "super_admin") {
      return "bg-red-500/20 text-red-400";
    }
    if (role === "admin") {
      return "bg-yellow-500/20 text-yellow-400";
    }
    return "bg-gray-700 text-gray-400";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Members</h1>
          <p className="text-gray-400 mt-1">
            Manage and view all TradeSmart members
          </p>
        </div>
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <Input
            type="text"
            placeholder="Search by email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tier Filter */}
        <div className="flex space-x-2">
          {tiers.map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                selectedTier === tier
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="text-gray-500 text-sm">
        Showing {filteredUsers.length} of {users.length} members
      </div>

      {/* Members Table */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-800/50">
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">
                  Member
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">
                  Plan
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">
                  Role
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">
                  Joined
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">
                  Stripe ID
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <RefreshCw className="w-6 h-6 text-gray-500 animate-spin mx-auto" />
                    <p className="text-gray-500 mt-2">Loading members...</p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <p className="text-gray-500">No members found</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">
                            {user.email?.[0]?.toUpperCase() || "?"}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span className="text-white text-sm">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium capitalize ${getTierBadge(user.subscription_tier)}`}
                      >
                        {user.subscription_tier}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        {user.role === "super_admin" && (
                          <Shield className="w-3 h-3 text-red-400" />
                        )}
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getRoleBadge(user.role)}`}
                        >
                          {user.role || "user"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-gray-400 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(user.created_at).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-500 text-sm font-mono">
                        {user.stripe_customer_id
                          ? user.stripe_customer_id.slice(0, 20) + "..."
                          : "-"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { getAdminStats } from "@/lib/admin";
import { formatCurrency } from "@/lib/utils";
import {
  Users,
  UserCheck,
  PoundSterling,
  TrendingUp,
  Calendar,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  const statCards = [
    {
      title: "Total Signups",
      value: stats.totalSignups.toLocaleString(),
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/20",
    },
    {
      title: "Active Members",
      value: stats.activeMembers.toLocaleString(),
      icon: UserCheck,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/20",
    },
    {
      title: "Monthly Revenue",
      value: formatCurrency(stats.monthlyRevenue),
      icon: PoundSterling,
      color: "text-purple-500",
      bgColor: "bg-purple-500/20",
    },
    {
      title: "ARR",
      value: formatCurrency(stats.arr),
      icon: TrendingUp,
      color: "text-orange-500",
      bgColor: "bg-orange-500/20",
    },
  ];

  const getTierBadge = (tier: string) => {
    const styles: Record<string, string> = {
      free: "bg-gray-700 text-gray-300",
      starter: "bg-blue-500/20 text-blue-400",
      pro: "bg-purple-500/20 text-purple-400",
      enterprise: "bg-orange-500/20 text-orange-400",
    };
    return styles[tier] || styles.free;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400 mt-1">
          Overview of TradeSmart metrics and activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="bg-gray-900 rounded-xl p-6 border border-gray-800"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.title}</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {stat.value}
                </p>
              </div>
              <div
                className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}
              >
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Subscription Breakdown */}
        <div className="bg-gray-900 rounded-xl border border-gray-800">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-white">
              Subscription Breakdown
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {Object.entries(stats.subscriptionBreakdown).map(
                ([tier, count]) => {
                  const total = stats.totalSignups || 1;
                  const percentage = Math.round((count / total) * 100);
                  return (
                    <div key={tier}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium capitalize ${getTierBadge(tier)}`}
                          >
                            {tier}
                          </span>
                          <span className="text-gray-400 text-sm">
                            {count} users
                          </span>
                        </div>
                        <span className="text-gray-500 text-sm">
                          {percentage}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            tier === "free"
                              ? "bg-gray-600"
                              : tier === "starter"
                                ? "bg-blue-500"
                                : tier === "pro"
                                  ? "bg-purple-500"
                                  : "bg-orange-500"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          </div>
        </div>

        {/* Recent Signups */}
        <div className="bg-gray-900 rounded-xl border border-gray-800">
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Recent Signups</h2>
            <Calendar className="w-5 h-5 text-gray-500" />
          </div>
          <div className="divide-y divide-gray-800">
            {stats.recentSignups.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No signups yet
              </div>
            ) : (
              stats.recentSignups.map((user) => (
                <div
                  key={user.id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {user.email?.[0]?.toUpperCase() || "?"}
                      </span>
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium truncate max-w-[200px]">
                        {user.email}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {new Date(user.created_at).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium capitalize ${getTierBadge(user.subscription_tier)}`}
                  >
                    {user.subscription_tier}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

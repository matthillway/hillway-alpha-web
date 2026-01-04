"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Bell, CreditCard, Shield, Mail } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<{
    tier: string;
    status: string;
  } | null>(null);

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

      // Fetch subscription info
      const { data: userData } = await supabase
        .from("users")
        .select("subscription_tier, subscription_status")
        .eq("id", session.user.id)
        .single();

      if (userData) {
        setSubscription({
          tier: userData.subscription_tier,
          status: userData.subscription_status,
        });
      }

      setLoading(false);
    }
    init();
  }, [router]);

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
            <h1 className="text-xl font-bold text-white">Settings</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Account Section */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 mb-6">
          <div className="px-6 py-4 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold text-white">Account</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <p className="text-white">{user?.email}</p>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                User ID
              </label>
              <p className="text-gray-500 text-sm font-mono">{user?.id}</p>
            </div>
          </div>
        </div>

        {/* Subscription Section */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 mb-6">
          <div className="px-6 py-4 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <CreditCard className="w-5 h-5 text-green-500" />
              <h2 className="text-lg font-semibold text-white">Subscription</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Current Plan
                </label>
                <p className="text-white capitalize">
                  {subscription?.tier || "Free"}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  subscription?.status === "active"
                    ? "bg-green-500/20 text-green-500"
                    : "bg-gray-500/20 text-gray-400"
                }`}
              >
                {subscription?.status || "Inactive"}
              </span>
            </div>
            <Button
              variant="primary"
              onClick={() => router.push("/pricing")}
              className="w-full sm:w-auto"
            >
              {subscription?.tier === "free"
                ? "Upgrade Plan"
                : "Manage Subscription"}
            </Button>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 mb-6">
          <div className="px-6 py-4 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-purple-500" />
              <h2 className="text-lg font-semibold text-white">
                Notifications
              </h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Email Alerts</p>
                <p className="text-gray-400 text-sm">
                  Receive opportunity alerts via email
                </p>
              </div>
              <button className="w-12 h-6 bg-blue-500 rounded-full relative">
                <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">WhatsApp Alerts</p>
                <p className="text-gray-400 text-sm">
                  Receive alerts on WhatsApp (Pro+)
                </p>
              </div>
              <button className="w-12 h-6 bg-gray-700 rounded-full relative">
                <span className="absolute left-1 top-1 w-4 h-4 bg-gray-400 rounded-full"></span>
              </button>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-gray-900 rounded-xl border border-gray-800">
          <div className="px-6 py-4 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-semibold text-white">Security</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <Button
              variant="secondary"
              onClick={async () => {
                await supabase.auth.resetPasswordForEmail(user?.email || "", {
                  redirectTo: `${window.location.origin}/auth/callback?next=/settings`,
                });
                alert("Password reset email sent!");
              }}
              className="w-full sm:w-auto"
            >
              <Mail className="w-4 h-4 mr-2" />
              Reset Password
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

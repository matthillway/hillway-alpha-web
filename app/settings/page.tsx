"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  User,
  Bell,
  CreditCard,
  Shield,
  Mail,
  MessageCircle,
  Check,
  AlertCircle,
  Link2,
  ChevronRight,
} from "lucide-react";

type AlertFrequency = "realtime" | "hourly" | "daily" | "weekly";

type NotificationPreferences = {
  email_alerts_enabled: boolean;
  whatsapp_alerts_enabled: boolean;
  alert_frequency: AlertFrequency;
  whatsapp_number: string | null;
};

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<{
    tier: string;
    status: string;
  } | null>(null);

  // Notification preferences state
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(false);
  const [alertFrequency, setAlertFrequency] =
    useState<AlertFrequency>("realtime");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const canUseWhatsApp =
    subscription?.tier === "pro" || subscription?.tier === "unlimited";

  const fetchNotificationPreferences = useCallback(async () => {
    try {
      const response = await fetch("/api/settings/notifications");
      if (response.ok) {
        const prefs: NotificationPreferences = await response.json();
        setEmailAlerts(prefs.email_alerts_enabled);
        setWhatsappAlerts(prefs.whatsapp_alerts_enabled);
        setAlertFrequency(prefs.alert_frequency);
        setWhatsappNumber(prefs.whatsapp_number || "");
      }
    } catch (error) {
      console.error("Error fetching notification preferences:", error);
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

  // Fetch notification preferences after initial load
  useEffect(() => {
    if (!loading && user) {
      fetchNotificationPreferences();
    }
  }, [loading, user, fetchNotificationPreferences]);

  const validatePhoneNumber = (phone: string): boolean => {
    if (!phone) return true; // Empty is valid (optional)
    const phoneRegex = /^\+[1-9]\d{6,14}$/;
    return phoneRegex.test(phone);
  };

  const handlePhoneChange = (value: string) => {
    setWhatsappNumber(value);
    if (value && !validatePhoneNumber(value)) {
      setPhoneError("Please use international format (e.g., +447123456789)");
    } else {
      setPhoneError(null);
    }
  };

  const saveNotificationPreferences = async () => {
    if (whatsappNumber && !validatePhoneNumber(whatsappNumber)) {
      setPhoneError("Please use international format (e.g., +447123456789)");
      return;
    }

    setSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    try {
      const response = await fetch("/api/settings/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_alerts_enabled: emailAlerts,
          whatsapp_alerts_enabled: whatsappAlerts,
          alert_frequency: alertFrequency,
          whatsapp_number: whatsappNumber || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setSaveError(data.error || "Failed to save preferences");
        return;
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving preferences:", error);
      setSaveError("Failed to save preferences. Please try again.");
    } finally {
      setSaving(false);
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

        {/* Linked Accounts Section */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 mb-6">
          <button
            onClick={() => router.push("/settings/linked-accounts")}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Link2 className="w-5 h-5 text-blue-500" />
              <div className="text-left">
                <h2 className="text-lg font-semibold text-white">
                  Linked Accounts
                </h2>
                <p className="text-gray-400 text-sm">
                  Connect Betfair, IBKR, and Kraken
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
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
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-purple-500" />
                <h2 className="text-lg font-semibold text-white">
                  Notifications
                </h2>
              </div>
              {saveSuccess && (
                <div className="flex items-center text-green-500 text-sm">
                  <Check className="w-4 h-4 mr-1" />
                  Saved
                </div>
              )}
              {saveError && (
                <div className="flex items-center text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {saveError}
                </div>
              )}
            </div>
          </div>
          <div className="p-6 space-y-6">
            {/* Email Alerts Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <p id="email-alerts-label" className="text-white">
                    Email Alerts
                  </p>
                </div>
                <p className="text-gray-400 text-sm mt-1">
                  Receive opportunity alerts via email
                </p>
              </div>
              <button
                role="switch"
                aria-checked={emailAlerts}
                aria-labelledby="email-alerts-label"
                onClick={() => setEmailAlerts(!emailAlerts)}
                className={`w-14 h-8 rounded-full relative transition-colors duration-200 ${
                  emailAlerts ? "bg-blue-500" : "bg-gray-700"
                }`}
              >
                <span
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-200 ${
                    emailAlerts ? "right-1" : "left-1"
                  }`}
                />
              </button>
            </div>

            {/* WhatsApp Alerts Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4 text-gray-400" />
                  <p id="whatsapp-alerts-label" className="text-white">
                    WhatsApp Alerts
                  </p>
                  {!canUseWhatsApp && (
                    <span className="px-2 py-0.5 text-xs bg-purple-500/20 text-purple-400 rounded-full">
                      Pro+
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-sm mt-1">
                  Receive alerts on WhatsApp{" "}
                  {!canUseWhatsApp && "(requires Pro subscription)"}
                </p>
              </div>
              <button
                role="switch"
                aria-checked={whatsappAlerts && canUseWhatsApp}
                aria-labelledby="whatsapp-alerts-label"
                onClick={() =>
                  canUseWhatsApp && setWhatsappAlerts(!whatsappAlerts)
                }
                disabled={!canUseWhatsApp}
                className={`w-14 h-8 rounded-full relative transition-colors duration-200 ${
                  whatsappAlerts && canUseWhatsApp
                    ? "bg-green-500"
                    : "bg-gray-700"
                } ${!canUseWhatsApp ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <span
                  className={`absolute top-1 w-6 h-6 rounded-full transition-all duration-200 ${
                    whatsappAlerts && canUseWhatsApp
                      ? "right-1 bg-white"
                      : "left-1 bg-gray-400"
                  }`}
                />
              </button>
            </div>

            {/* WhatsApp Number Input */}
            {whatsappAlerts && canUseWhatsApp && (
              <div className="pl-6 border-l-2 border-gray-700">
                <label className="block text-sm text-gray-400 mb-2">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={whatsappNumber}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="+447123456789"
                  className={`w-full sm:w-80 px-4 py-2 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    phoneError ? "border-red-500" : "border-gray-700"
                  }`}
                />
                {phoneError && (
                  <p className="text-red-500 text-sm mt-1">{phoneError}</p>
                )}
                <p className="text-gray-500 text-xs mt-2">
                  Use international format with country code
                </p>
              </div>
            )}

            {/* Alert Frequency */}
            <div>
              <label
                id="alert-frequency-label"
                className="block text-sm text-gray-400 mb-2"
              >
                Alert Frequency
              </label>
              <div
                role="radiogroup"
                aria-labelledby="alert-frequency-label"
                className="grid grid-cols-2 md:grid-cols-4 gap-2"
              >
                {[
                  { value: "realtime", label: "Real-time" },
                  { value: "hourly", label: "Hourly" },
                  { value: "daily", label: "Daily Summary" },
                  { value: "weekly", label: "Weekly Summary" },
                ].map((option) => (
                  <button
                    key={option.value}
                    role="radio"
                    aria-checked={alertFrequency === option.value}
                    onClick={() =>
                      setAlertFrequency(option.value as AlertFrequency)
                    }
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      alertFrequency === option.value
                        ? "bg-blue-500 text-white"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <p className="text-gray-500 text-xs mt-2">
                {alertFrequency === "realtime" &&
                  "Get notified immediately when opportunities are found"}
                {alertFrequency === "hourly" &&
                  "Receive a summary of opportunities every hour"}
                {alertFrequency === "daily" &&
                  "Receive a daily digest of all opportunities"}
                {alertFrequency === "weekly" &&
                  "Receive a weekly summary of the best opportunities"}
              </p>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-gray-800">
              <Button
                variant="primary"
                onClick={saveNotificationPreferences}
                disabled={saving || !!phoneError}
                loading={saving}
                className="w-full sm:w-auto"
              >
                Save Notification Preferences
              </Button>
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
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3000);
              }}
              className="w-full sm:w-auto"
            >
              <Mail className="w-4 h-4 mr-2" />
              Reset Password
            </Button>
            {saveSuccess && (
              <p className="text-green-500 text-sm mt-2 flex items-center">
                <Check className="w-4 h-4 mr-1" />
                Password reset email sent!
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

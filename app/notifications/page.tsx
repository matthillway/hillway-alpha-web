"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  ArrowLeft,
  Bell,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Info,
} from "lucide-react";

interface Notification {
  id: string;
  type: "opportunity" | "alert" | "system" | "success";
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    async function init() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }

      // For now, show placeholder notifications
      // In production, these would come from the database
      setNotifications([
        {
          id: "1",
          type: "system",
          title: "Welcome to TradeSmart!",
          message:
            "Your account has been set up successfully. Start by running your first scan.",
          read: false,
          created_at: new Date().toISOString(),
        },
      ]);

      setLoading(false);
    }
    init();
  }, [router]);

  const getIcon = (type: string) => {
    switch (type) {
      case "opportunity":
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case "alert":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "success":
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-400" />;
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
            <Bell className="w-5 h-5 text-gray-400 mr-2" />
            <h1 className="text-xl font-bold text-white">Notifications</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {notifications.length === 0 ? (
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-12 text-center">
            <Bell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              No notifications
            </h2>
            <p className="text-gray-400">
              You&apos;re all caught up! New alerts will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-gray-900 rounded-xl border border-gray-800 p-4 ${
                  !notification.read ? "border-l-4 border-l-blue-500" : ""
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium">
                      {notification.title}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      {notification.message}
                    </p>
                    <p className="text-gray-500 text-xs mt-2">
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Tag,
  TrendingUp,
  LogOut,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  userEmail: string;
}

const navItems = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/admin/members",
    label: "Members",
    icon: Users,
    exact: false,
  },
  {
    href: "/admin/discount-codes",
    label: "Discount Codes",
    icon: Tag,
    exact: false,
  },
];

export function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <Link href="/admin" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-white">TradeSmart</span>
            <span className="block text-xs text-gray-500">Admin Panel</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                    active
                      ? "bg-emerald-600/20 text-emerald-400 font-medium"
                      : "text-gray-400 hover:text-white hover:bg-gray-800",
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                  {active && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-500">
          <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-medium">
              {userEmail?.[0]?.toUpperCase() || "?"}
            </span>
          </div>
          <span className="truncate flex-1">{userEmail}</span>
        </div>
        <div className="flex space-x-2 mt-2">
          <Link
            href="/dashboard"
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>App</span>
          </Link>
          <Link
            href="/api/auth/signout"
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}

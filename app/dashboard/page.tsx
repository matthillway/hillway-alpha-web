'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Header } from '@/components/landing/header';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  Activity,
  DollarSign,
  Bell,
  Settings,
  LogOut,
  BarChart3,
  Zap,
  Bitcoin
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth/login');
        return;
      }
      setUser(session.user);
      setLoading(false);
    }
    getUser();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
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
      {/* Dashboard Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Hillway Alpha</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-400 hover:text-white">
                <Bell className="w-5 h-5" />
              </button>
              <button className="text-gray-400 hover:text-white">
                <Settings className="w-5 h-5" />
              </button>
              <button onClick={handleSignOut} className="text-gray-400 hover:text-white">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">
            Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}!
          </h1>
          <p className="text-gray-400 mt-1">Here's your opportunity overview for today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Opportunities Found</p>
                <p className="text-3xl font-bold text-white mt-1">24</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <p className="text-green-500 text-sm mt-2">+12% from yesterday</p>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Potential Profit</p>
                <p className="text-3xl font-bold text-white mt-1">£342</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <p className="text-green-500 text-sm mt-2">If all opportunities taken</p>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Best Margin</p>
                <p className="text-3xl font-bold text-white mt-1">+3.2%</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-500" />
              </div>
            </div>
            <p className="text-gray-400 text-sm mt-2">Arbitrage opportunity</p>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Scans Today</p>
                <p className="text-3xl font-bold text-white mt-1">47/100</p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-orange-500" />
              </div>
            </div>
            <p className="text-gray-400 text-sm mt-2">Starter plan limit</p>
          </div>
        </div>

        {/* Scanner Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Betting Arbitrage</h3>
                <p className="text-gray-400 text-sm">12 opportunities</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Find guaranteed profit from odds discrepancies across bookmakers.
            </p>
            <Button variant="primary" className="w-full">
              Scan Now
            </Button>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Stock Momentum</h3>
                <p className="text-gray-400 text-sm">8 signals</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Technical analysis on FTSE 100 and S&P 500 stocks.
            </p>
            <Button variant="primary" className="w-full">
              Scan Now
            </Button>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Bitcoin className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Crypto Funding</h3>
                <p className="text-gray-400 text-sm">4 opportunities</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Funding rate arbitrage on Binance perpetual futures.
            </p>
            <Button variant="primary" className="w-full">
              Scan Now
            </Button>
          </div>
        </div>

        {/* Recent Opportunities */}
        <div className="bg-gray-900 rounded-xl border border-gray-800">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-white">Recent Opportunities</h2>
          </div>
          <div className="p-6">
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No opportunities scanned yet today.</p>
              <p className="text-gray-500 text-sm mt-1">Run a scan to find opportunities.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

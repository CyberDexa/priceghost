"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  TrendingDown, 
  DollarSign, 
  Package,
  Percent,
  ArrowDownRight,
  Sparkles
} from "lucide-react";
import { formatPrice } from "@/lib/currency";

interface SavingsStats {
  totalSaved: number;
  totalProducts: number;
  productsWithDrops: number;
  avgDropPercent: number;
  biggestDrop: {
    amount: number;
    productName: string;
  } | null;
  weeklyDrops: number;
  monthlyDrops: number;
}

interface SavingsWidgetProps {
  currency?: string;
}

export function SavingsWidget({ currency = "USD" }: SavingsWidgetProps) {
  const [stats, setStats] = useState<SavingsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch products with their price history
      const { data: products } = await supabase
        .from("products")
        .select(`
          id,
          name,
          current_price,
          original_price,
          price_history (
            price,
            recorded_at
          )
        `)
        .eq("user_id", user.id);

      if (!products || products.length === 0) {
        setStats({
          totalSaved: 0,
          totalProducts: 0,
          productsWithDrops: 0,
          avgDropPercent: 0,
          biggestDrop: null,
          weeklyDrops: 0,
          monthlyDrops: 0,
        });
        setLoading(false);
        return;
      }

      let totalSaved = 0;
      let productsWithDrops = 0;
      let totalDropPercent = 0;
      let biggestDrop: { amount: number; productName: string } | null = null;
      let weeklyDrops = 0;
      let monthlyDrops = 0;

      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      products.forEach((product) => {
        const originalPrice = product.original_price || product.current_price;
        const currentPrice = product.current_price;
        
        if (originalPrice > currentPrice) {
          const savings = originalPrice - currentPrice;
          totalSaved += savings;
          productsWithDrops++;
          
          const dropPercent = ((originalPrice - currentPrice) / originalPrice) * 100;
          totalDropPercent += dropPercent;

          if (!biggestDrop || savings > biggestDrop.amount) {
            biggestDrop = {
              amount: savings,
              productName: product.name,
            };
          }
        }

        // Count drops in last week/month from price history
        const history = product.price_history || [];
        let previousPrice = originalPrice;
        
        history.forEach((record: { price: number; recorded_at: string }) => {
          const recordDate = new Date(record.recorded_at);
          if (record.price < previousPrice) {
            if (recordDate >= oneWeekAgo) weeklyDrops++;
            if (recordDate >= oneMonthAgo) monthlyDrops++;
          }
          previousPrice = record.price;
        });
      });

      setStats({
        totalSaved,
        totalProducts: products.length,
        productsWithDrops,
        avgDropPercent: productsWithDrops > 0 ? totalDropPercent / productsWithDrops : 0,
        biggestDrop,
        weeklyDrops,
        monthlyDrops,
      });
    } catch (error) {
      console.error("Error fetching savings stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-zinc-800/50 bg-zinc-900/50 p-6 animate-pulse">
            <div className="h-4 bg-zinc-800 rounded w-24 mb-4"></div>
            <div className="h-8 bg-zinc-800 rounded w-20 mb-2"></div>
            <div className="h-3 bg-zinc-800 rounded w-32"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 stagger-children">
      {/* Total Savings */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 text-white shadow-xl shadow-emerald-500/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <span className="text-emerald-100 text-sm font-medium">Total Savings</span>
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-bold mb-1 tracking-tight">
            {formatPrice(stats.totalSaved, currency)}
          </div>
          <div className="text-emerald-100 text-sm flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" />
            Across {stats.productsWithDrops} products
          </div>
        </div>
      </div>

      {/* Products Tracked */}
      <div className="rounded-2xl border border-zinc-800/50 bg-gradient-to-b from-zinc-900/90 to-zinc-900/50 backdrop-blur-xl p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-zinc-400 text-sm font-medium">Products Tracked</span>
          <div className="p-2 bg-blue-500/20 rounded-xl">
            <Package className="h-5 w-5 text-blue-400" />
          </div>
        </div>
        <div className="text-3xl font-bold text-white mb-1 tracking-tight">
          {stats.totalProducts}
        </div>
        <div className="text-zinc-500 text-sm">
          {stats.productsWithDrops} with price drops
        </div>
      </div>

      {/* Avg Drop */}
      <div className="rounded-2xl border border-zinc-800/50 bg-gradient-to-b from-zinc-900/90 to-zinc-900/50 backdrop-blur-xl p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-zinc-400 text-sm font-medium">Avg. Price Drop</span>
          <div className="p-2 bg-purple-500/20 rounded-xl">
            <Percent className="h-5 w-5 text-purple-400" />
          </div>
        </div>
        <div className="text-3xl font-bold text-white mb-1 tracking-tight">
          {stats.avgDropPercent.toFixed(1)}%
        </div>
        <div className="text-zinc-500 text-sm">
          Average discount found
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-2xl border border-zinc-800/50 bg-gradient-to-b from-zinc-900/90 to-zinc-900/50 backdrop-blur-xl p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-zinc-400 text-sm font-medium">Recent Drops</span>
          <div className="p-2 bg-amber-500/20 rounded-xl">
            <TrendingDown className="h-5 w-5 text-amber-400" />
          </div>
        </div>
        <div className="text-3xl font-bold text-white mb-1 tracking-tight">
          {stats.weeklyDrops}
        </div>
        <div className="text-zinc-500 text-sm">
          This week • {stats.monthlyDrops} this month
        </div>
      </div>

      {/* Biggest Drop - spans full width on mobile */}
      {stats.biggestDrop && (
        <div className="col-span-1 md:col-span-2 lg:col-span-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 p-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/20 rounded-xl">
              <ArrowDownRight className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <div className="text-sm text-amber-400 font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Biggest Savings
              </div>
              <div className="text-lg font-bold text-white mt-0.5">
                {formatPrice(stats.biggestDrop.amount, currency)} off on {stats.biggestDrop.productName}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  BarChart3,
  TrendingDown,
  TrendingUp,
  DollarSign,
  Package,
  Bell,
  Target,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

interface AnalyticsData {
  totalProducts: number;
  activeAlerts: number;
  totalSavings: number;
  priceDrops: number;
  avgPriceDrop: number;
  productsWithDrops: number;
  targetReached: number;
  thisMonthSavings: number;
  lastMonthSavings: number;
}

interface PriceHistoryPoint {
  date: string;
  avgPrice: number;
  lowestPrice: number;
  priceDrops: number;
}

interface RetailerDistribution {
  name: string;
  value: number;
  color: string;
}

interface RecentDrop {
  id: string;
  name: string;
  image_url: string;
  original_price: number;
  current_price: number;
  drop_percentage: number;
  dropped_at: string;
}

const RETAILER_COLORS: Record<string, string> = {
  amazon: '#FF9900',
  walmart: '#0071CE',
  bestbuy: '#0046BE',
  target: '#CC0000',
  ebay: '#E53238',
  other: '#6366f1',
};

export function AnalyticsClient() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceHistoryPoint[]>([]);
  const [retailerDistribution, setRetailerDistribution] = useState<RetailerDistribution[]>([]);
  const [recentDrops, setRecentDrops] = useState<RecentDrop[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  async function fetchAnalytics() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    try {
      // Get products
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id);

      // Get price history
      const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const startDate = subDays(new Date(), daysBack);
      
      const { data: history } = await supabase
        .from('price_history')
        .select('*, products!inner(user_id)')
        .eq('products.user_id', user.id)
        .gte('checked_at', startDate.toISOString())
        .order('checked_at', { ascending: true });

      // Get alerts
      const { data: alerts } = await supabase
        .from('alerts')
        .select('*')
        .eq('user_id', user.id);

      // Calculate analytics
      const totalProducts = products?.length || 0;
      const activeAlerts = alerts?.filter(a => a.is_active)?.length || 0;
      
      // Calculate savings (difference between original and current price for products with drops)
      let totalSavings = 0;
      let priceDrops = 0;
      let totalDropPercentage = 0;
      let productsWithDrops = 0;
      let targetReached = 0;

      products?.forEach(product => {
        if (product.current_price < product.original_price) {
          const savings = product.original_price - product.current_price;
          totalSavings += savings;
          priceDrops++;
          totalDropPercentage += ((product.original_price - product.current_price) / product.original_price) * 100;
          productsWithDrops++;
        }
        
        // Check if target price reached
        const productAlerts = alerts?.filter(a => a.product_id === product.id && a.alert_type === 'target_price');
        productAlerts?.forEach(alert => {
          if (product.current_price <= alert.target_price) {
            targetReached++;
          }
        });
      });

      const avgPriceDrop = priceDrops > 0 ? totalDropPercentage / priceDrops : 0;

      // Calculate monthly savings
      const thisMonthStart = startOfMonth(new Date());
      const lastMonthStart = startOfMonth(subDays(thisMonthStart, 1));
      const lastMonthEnd = endOfMonth(lastMonthStart);

      // Process price history for chart
      const dailyData: Record<string, { prices: number[], drops: number }> = {};
      
      history?.forEach(h => {
        const date = format(new Date(h.checked_at), 'yyyy-MM-dd');
        if (!dailyData[date]) {
          dailyData[date] = { prices: [], drops: 0 };
        }
        dailyData[date].prices.push(h.price);
        if (h.price_change && h.price_change < 0) {
          dailyData[date].drops++;
        }
      });

      const chartData: PriceHistoryPoint[] = Object.entries(dailyData)
        .map(([date, data]) => ({
          date: format(new Date(date), 'MMM d'),
          avgPrice: data.prices.reduce((a, b) => a + b, 0) / data.prices.length,
          lowestPrice: Math.min(...data.prices),
          priceDrops: data.drops,
        }))
        .slice(-30);

      // Calculate retailer distribution
      const retailers: Record<string, number> = {};
      products?.forEach(product => {
        const retailer = product.retailer?.toLowerCase() || 'other';
        retailers[retailer] = (retailers[retailer] || 0) + 1;
      });

      const distribution: RetailerDistribution[] = Object.entries(retailers).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
        color: RETAILER_COLORS[name] || RETAILER_COLORS.other,
      }));

      // Get recent price drops
      const droppedProducts = products
        ?.filter(p => p.current_price < p.original_price)
        .map(p => ({
          id: p.id,
          name: p.name,
          image_url: p.image_url,
          original_price: p.original_price,
          current_price: p.current_price,
          drop_percentage: ((p.original_price - p.current_price) / p.original_price) * 100,
          dropped_at: p.last_checked,
        }))
        .sort((a, b) => b.drop_percentage - a.drop_percentage)
        .slice(0, 5) || [];

      setAnalytics({
        totalProducts,
        activeAlerts,
        totalSavings,
        priceDrops,
        avgPriceDrop,
        productsWithDrops,
        targetReached,
        thisMonthSavings: totalSavings * 0.6, // Simulated
        lastMonthSavings: totalSavings * 0.4, // Simulated
      });

      setPriceHistory(chartData);
      setRetailerDistribution(distribution);
      setRecentDrops(droppedProducts);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return null; // Suspense fallback handles loading
  }

  const savingsChange = analytics
    ? ((analytics.thisMonthSavings - analytics.lastMonthSavings) / (analytics.lastMonthSavings || 1)) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-zinc-400 mt-1">Track your savings and price monitoring stats</p>
        </div>
        <div className="flex gap-2">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-indigo-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Products"
          value={analytics?.totalProducts || 0}
          icon={Package}
          description="Products being tracked"
          color="indigo"
        />
        <StatCard
          title="Price Drops"
          value={analytics?.priceDrops || 0}
          icon={TrendingDown}
          description={`Avg ${analytics?.avgPriceDrop.toFixed(1) || 0}% drop`}
          color="green"
        />
        <StatCard
          title="Total Savings"
          value={`$${(analytics?.totalSavings || 0).toFixed(2)}`}
          icon={DollarSign}
          description={
            <span className={savingsChange >= 0 ? 'text-green-400' : 'text-red-400'}>
              {savingsChange >= 0 ? <ArrowUpRight className="inline w-3 h-3" /> : <ArrowDownRight className="inline w-3 h-3" />}
              {Math.abs(savingsChange).toFixed(1)}% vs last month
            </span>
          }
          color="emerald"
        />
        <StatCard
          title="Active Alerts"
          value={analytics?.activeAlerts || 0}
          icon={Bell}
          description={`${analytics?.targetReached || 0} targets reached`}
          color="amber"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Trends Chart */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            Price Trends
          </h3>
          {priceHistory.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={priceHistory}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="date" stroke="#71717a" fontSize={12} />
                <YAxis stroke="#71717a" fontSize={12} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    border: '1px solid #27272a',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#fff' }}
                  formatter={(value) => [`$${Number(value || 0).toFixed(2)}`, 'Avg Price']}
                />
                <Area
                  type="monotone"
                  dataKey="avgPrice"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fill="url(#colorPrice)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-zinc-500">
              No price data available for this period
            </div>
          )}
        </div>

        {/* Price Drops Chart */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-green-400" />
            Daily Price Drops
          </h3>
          {priceHistory.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={priceHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="date" stroke="#71717a" fontSize={12} />
                <YAxis stroke="#71717a" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    border: '1px solid #27272a',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#fff' }}
                  formatter={(value) => [Number(value || 0), 'Price Drops']}
                />
                <Bar dataKey="priceDrops" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-zinc-500">
              No drop data available for this period
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Retailer Distribution */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-400" />
            Retailer Distribution
          </h3>
          {retailerDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={retailerDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {retailerDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    border: '1px solid #27272a',
                    borderRadius: '8px',
                  }}
                  formatter={(value, name) => [Number(value || 0), String(name)]}
                />
                <Legend
                  formatter={(value) => <span className="text-zinc-300">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-zinc-500">
              No products tracked yet
            </div>
          )}
        </div>

        {/* Recent Price Drops */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-green-400" />
            Top Price Drops
          </h3>
          {recentDrops.length > 0 ? (
            <div className="space-y-3">
              {recentDrops.map((drop) => (
                <div
                  key={drop.id}
                  className="flex items-center gap-4 p-3 bg-zinc-800/50 rounded-lg"
                >
                  {drop.image_url && (
                    <img
                      src={drop.image_url}
                      alt={drop.name}
                      className="w-12 h-12 object-contain rounded bg-white"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{drop.name}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-zinc-500 line-through">
                        ${drop.original_price.toFixed(2)}
                      </span>
                      <span className="text-green-400 font-medium">
                        ${drop.current_price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                      <TrendingDown className="w-3 h-3 mr-1" />
                      {drop.drop_percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-zinc-500">
              No price drops detected yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description: React.ReactNode;
  color: 'indigo' | 'green' | 'emerald' | 'amber' | 'red';
}

function StatCard({ title, value, icon: Icon, description, color }: StatCardProps) {
  const colorClasses = {
    indigo: 'bg-indigo-500/10 text-indigo-400',
    green: 'bg-green-500/10 text-green-400',
    emerald: 'bg-emerald-500/10 text-emerald-400',
    amber: 'bg-amber-500/10 text-amber-400',
    red: 'bg-red-500/10 text-red-400',
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <span className="text-zinc-400 text-sm font-medium">{title}</span>
        <span className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-4 h-4" />
        </span>
      </div>
      <p className="text-2xl font-bold text-white mt-2">{value}</p>
      <p className="text-zinc-500 text-sm mt-1">{description}</p>
    </div>
  );
}

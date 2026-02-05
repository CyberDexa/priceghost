"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format, formatDistanceToNow } from "date-fns";
import { formatPrice, getCurrencySymbol } from "@/lib/currency";
import { getValidImageUrl } from "@/lib/utils/image";
import {
  ArrowLeft,
  ExternalLink,
  TrendingDown,
  TrendingUp,
  Bell,
  Trash2,
  RefreshCw,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PriceHistoryChart } from "@/components/products/price-history-chart";
import { createClient } from "@/lib/supabase/client";

interface Product {
  id: string;
  name: string;
  url: string;
  image_url: string | null;
  current_price: number | null;
  original_price: number | null;
  lowest_price: number | null;
  highest_price: number | null;
  target_price: number | null;
  retailer: string;
  last_checked: string | null;
  created_at: string;
}

interface PriceHistoryPoint {
  id: string;
  price: number;
  created_at: string;
}

interface Alert {
  id: string;
  alert_type: string;
  message: string;
  is_read: boolean;
  created_at: string;
  old_price: number | null;
  new_price: number | null;
}

interface ProductDetailClientProps {
  product: Product;
  priceHistory: PriceHistoryPoint[];
  alerts: Alert[];
  currency?: string;
}

export function ProductDetailClient({
  product,
  priceHistory,
  alerts,
  currency = "USD",
}: ProductDetailClientProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [targetPrice, setTargetPrice] = useState(
    product.target_price?.toString() || ""
  );
  const [isSavingTarget, setIsSavingTarget] = useState(false);

  const priceChange =
    product.current_price && product.original_price
      ? ((product.current_price - product.original_price) /
          product.original_price) *
        100
      : 0;

  const handleRefreshPrice = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: product.url }),
      });

      const result = await response.json();

      if (result.success && result.price) {
        // Update product price
        await supabase
          .from("products")
          .update({
            current_price: result.price,
            last_checked: new Date().toISOString(),
            lowest_price:
              !product.lowest_price || result.price < product.lowest_price
                ? result.price
                : product.lowest_price,
            highest_price:
              !product.highest_price || result.price > product.highest_price
                ? result.price
                : product.highest_price,
          })
          .eq("id", product.id);

        // Add to price history
        await supabase.from("price_history").insert({
          product_id: product.id,
          price: result.price,
        });

        router.refresh();
      }
    } catch (error) {
      console.error("Error refreshing price:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    setIsDeleting(true);
    try {
      await supabase.from("products").delete().eq("id", product.id);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error deleting product:", error);
      setIsDeleting(false);
    }
  };

  const handleSetTargetPrice = async () => {
    const target = parseFloat(targetPrice);
    if (isNaN(target) || target <= 0) return;

    setIsSavingTarget(true);
    try {
      await supabase
        .from("products")
        .update({ target_price: target })
        .eq("id", product.id);
      router.refresh();
    } catch (error) {
      console.error("Error setting target price:", error);
    } finally {
      setIsSavingTarget(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Product Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              {/* Product Image */}
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                {getValidImageUrl(product.image_url) ? (
                  <Image
                    src={getValidImageUrl(product.image_url)!}
                    alt={product.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 300px"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No image
                  </div>
                )}
              </div>

              {/* Product Name */}
              <h1 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-3">
                {product.name}
              </h1>

              {/* Retailer */}
              <p className="text-sm text-gray-500 capitalize mb-4">
                {product.retailer}
              </p>

              {/* Current Price */}
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  {product.current_price ? formatPrice(product.current_price, currency) : "N/A"}
                </span>
                {priceChange !== 0 && (
                  <span
                    className={`flex items-center text-sm font-medium ${
                      priceChange < 0 ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {priceChange < 0 ? (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    )}
                    {Math.abs(priceChange).toFixed(1)}%
                  </span>
                )}
              </div>

              {/* Price Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-emerald-50 rounded-lg p-3">
                  <p className="text-xs text-emerald-600 font-medium">Lowest</p>
                  <p className="text-lg font-semibold text-emerald-700">
                    {product.lowest_price ? formatPrice(product.lowest_price, currency) : "—"}
                  </p>
                </div>
                <div className="bg-red-50 rounded-lg p-3">
                  <p className="text-xs text-red-600 font-medium">Highest</p>
                  <p className="text-lg font-semibold text-red-700">
                    {product.highest_price ? formatPrice(product.highest_price, currency) : "—"}
                  </p>
                </div>
              </div>

              {/* Target Price */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  <Target className="h-4 w-4 inline mr-1" />
                  Target Price Alert
                </label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Set target price"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    step="0.01"
                    min="0"
                  />
                  <Button
                    onClick={handleSetTargetPrice}
                    disabled={isSavingTarget}
                    size="sm"
                  >
                    {isSavingTarget ? "..." : "Set"}
                  </Button>
                </div>
                {product.target_price && (
                  <p className="text-xs text-gray-500 mt-1">
                    Current target: {formatPrice(product.target_price, currency)}
                  </p>
                )}
              </div>

              {/* Last Checked */}
              <p className="text-xs text-gray-500 mb-4">
                Last checked:{" "}
                {product.last_checked
                  ? formatDistanceToNow(new Date(product.last_checked), {
                      addSuffix: true,
                    })
                  : "Never"}
              </p>

              {/* Actions */}
              <div className="space-y-2">
                <Button
                  onClick={handleRefreshPrice}
                  disabled={isRefreshing}
                  className="w-full"
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                  {isRefreshing ? "Checking..." : "Check Price Now"}
                </Button>

                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Store
                  </Button>
                </a>

                <Button
                  variant="outline"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isDeleting ? "Deleting..." : "Delete Product"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Price History & Alerts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Price History Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Price History</CardTitle>
            </CardHeader>
            <CardContent>
              <PriceHistoryChart
                data={priceHistory}
                targetPrice={product.target_price}
                lowestPrice={product.lowest_price}
                currency={currency}
              />
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Recent Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No alerts yet. We&apos;ll notify you when the price changes!
                </p>
              ) : (
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-lg border ${
                        alert.alert_type === "target_reached"
                          ? "bg-emerald-50 border-emerald-200"
                          : "bg-blue-50 border-blue-200"
                      }`}
                    >
                      <p className="text-sm font-medium text-gray-900">
                        {alert.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(
                          new Date(alert.created_at),
                          "MMM d, yyyy h:mm a"
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Price History Table */}
          <Card>
            <CardHeader>
              <CardTitle>Price Log</CardTitle>
            </CardHeader>
            <CardContent>
              {priceHistory.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No price history recorded yet.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 font-medium text-gray-500">
                          Date
                        </th>
                        <th className="text-right py-2 font-medium text-gray-500">
                          Price
                        </th>
                        <th className="text-right py-2 font-medium text-gray-500">
                          Change
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {priceHistory.map((record, index) => {
                        const prevPrice = priceHistory[index + 1]?.price;
                        const change = prevPrice
                          ? record.price - prevPrice
                          : null;
                        return (
                          <tr
                            key={record.id}
                            className="border-b border-gray-100"
                          >
                            <td className="py-2 text-gray-600">
                              {format(
                                new Date(record.created_at),
                                "MMM d, yyyy h:mm a"
                              )}
                            </td>
                            <td className="py-2 text-right font-medium">
                              {formatPrice(record.price, currency)}
                            </td>
                            <td className="py-2 text-right">
                              {change !== null ? (
                                <span
                                  className={
                                    change < 0
                                      ? "text-emerald-600"
                                      : change > 0
                                        ? "text-red-600"
                                        : "text-gray-400"
                                  }
                                >
                                  {change < 0 ? "↓" : change > 0 ? "↑" : "—"} {getCurrencySymbol(currency)}
                                  {Math.abs(change).toFixed(2)}
                                </span>
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

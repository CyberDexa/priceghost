"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice, getCurrencySymbol } from "@/lib/currency";
import {
  Search,
  ArrowUpDown,
  ExternalLink,
  Package,
  TrendingDown,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Product {
  id: string;
  name: string;
  url: string;
  image_url: string | null;
  current_price: number | null;
  original_price: number | null;
  lowest_price: number | null;
  retailer: string;
  created_at: string;
}

interface CompareClientProps {
  products: Product[];
  currency?: string;
}

export function CompareClient({ products, currency = "USD" }: CompareClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"price" | "name" | "retailer">("price");

  // Filter products by search
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const query = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.retailer.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  // Get selected products for comparison
  const comparedProducts = useMemo(() => {
    return products
      .filter((p) => selectedProducts.includes(p.id))
      .sort((a, b) => {
        if (sortBy === "price") {
          return (a.current_price || Infinity) - (b.current_price || Infinity);
        }
        if (sortBy === "name") {
          return a.name.localeCompare(b.name);
        }
        return a.retailer.localeCompare(b.retailer);
      });
  }, [products, selectedProducts, sortBy]);

  // Find best deal among compared
  const bestDeal = useMemo(() => {
    if (comparedProducts.length === 0) return null;
    return comparedProducts.reduce((best, current) => {
      if (!current.current_price) return best;
      if (!best || !best.current_price) return current;
      return current.current_price < best.current_price ? current : best;
    }, null as Product | null);
  }, [comparedProducts]);

  const toggleProduct = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const clearSelection = () => {
    setSelectedProducts([]);
  };

  const retailerColors: Record<string, string> = {
    amazon: "bg-orange-500/20 text-orange-400",
    walmart: "bg-blue-500/20 text-blue-400",
    bestbuy: "bg-yellow-500/20 text-yellow-400",
    target: "bg-red-500/20 text-red-400",
    ebay: "bg-purple-500/20 text-purple-400",
    unknown: "bg-zinc-700 text-zinc-300",
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <ArrowUpDown className="h-6 w-6 text-emerald-400" />
          Compare Prices
        </h1>
        <p className="text-zinc-400 mt-1">
          Select products to compare prices across different retailers
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Product Selection */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-white">Select Products</CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="max-h-[500px] overflow-y-auto">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-8 text-zinc-500">
                  <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No products found</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredProducts.map((product) => {
                    const isSelected = selectedProducts.includes(product.id);
                    return (
                      <button
                        key={product.id}
                        onClick={() => toggleProduct(product.id)}
                        className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-500/10"
                            : "border-zinc-700 hover:border-zinc-600 bg-zinc-800/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              isSelected
                                ? "bg-emerald-500 border-emerald-500"
                                : "border-zinc-600"
                            }`}
                          >
                            {isSelected && (
                              <Check className="h-3 w-3 text-white" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-white truncate">
                              {product.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span
                                className={`text-xs px-2 py-0.5 rounded capitalize ${
                                  retailerColors[product.retailer] ||
                                  retailerColors.unknown
                                }`}
                              >
                                {product.retailer}
                              </span>
                              <span className="text-sm font-semibold text-white">
                                {product.current_price ? formatPrice(product.current_price, currency) : "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Comparison View */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base text-white">
                Comparison ({comparedProducts.length} products)
              </CardTitle>
              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "price" | "name" | "retailer")
                  }
                  className="text-sm bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-lg px-2 py-1 cursor-pointer"
                >
                  <option value="price">Sort by Price</option>
                  <option value="name">Sort by Name</option>
                  <option value="retailer">Sort by Retailer</option>
                </select>
                {selectedProducts.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearSelection}>
                    Clear
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {comparedProducts.length === 0 ? (
                <div className="text-center py-12 text-zinc-500">
                  <ArrowUpDown className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium text-zinc-400">No products selected</p>
                  <p className="text-sm mt-1">
                    Select products from the list to compare prices
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Best Deal Banner */}
                  {bestDeal && comparedProducts.length > 1 && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <TrendingDown className="h-5 w-5 text-emerald-400" />
                        <div>
                          <p className="font-medium text-emerald-400">
                            Best Deal Found!
                          </p>
                          <p className="text-sm text-emerald-300/80">
                            {bestDeal.retailer} has the lowest price at {bestDeal.current_price ? formatPrice(bestDeal.current_price, currency) : "N/A"}
                          </p>
                        </div>
                      </div>
                      <a
                        href={bestDeal.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button size="sm">
                          Buy Now
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                      </a>
                    </div>
                  )}

                  {/* Comparison Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-zinc-800">
                          <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">
                            Product
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">
                            Retailer
                          </th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-zinc-400">
                            Current Price
                          </th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-zinc-400">
                            Lowest Price
                          </th>
                          <th className="text-center py-3 px-4 text-sm font-medium text-zinc-400">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparedProducts.map((product) => {
                          const isBest = bestDeal?.id === product.id;
                          return (
                            <tr
                              key={product.id}
                              className={`border-b border-zinc-800/50 ${
                                isBest ? "bg-emerald-500/5" : ""
                              }`}
                            >
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 bg-zinc-800 rounded-lg overflow-hidden relative flex-shrink-0">
                                    {product.image_url ? (
                                      <Image
                                        src={product.image_url}
                                        alt={product.name}
                                        fill
                                        className="object-contain"
                                        sizes="48px"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <Package className="h-5 w-5 text-zinc-600" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <Link
                                      href={`/products/${product.id}`}
                                      className="text-sm font-medium text-white hover:text-emerald-400 line-clamp-2 transition-colors"
                                    >
                                      {product.name}
                                    </Link>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span
                                  className={`text-xs px-2 py-1 rounded capitalize ${
                                    retailerColors[product.retailer] ||
                                    retailerColors.unknown
                                  }`}
                                >
                                  {product.retailer}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <span
                                  className={`font-bold ${
                                    isBest
                                      ? "text-emerald-400 text-lg"
                                      : "text-white"
                                  }`}
                                >
                                  {product.current_price ? formatPrice(product.current_price, currency) : "N/A"}
                                </span>
                                {isBest && (
                                  <span className="ml-2 text-xs bg-emerald-500 text-white px-2 py-0.5 rounded">
                                    BEST
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-right text-sm text-zinc-500">
                                {product.lowest_price ? formatPrice(product.lowest_price, currency) : "—"}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <a
                                    href={product.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Button variant="ghost" size="sm">
                                      <ExternalLink className="h-3 w-3" />
                                    </Button>
                                  </a>
                                  <button
                                    onClick={() => toggleProduct(product.id)}
                                    className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors cursor-pointer"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Price Difference */}
                  {comparedProducts.length > 1 && (
                    <div className="mt-4 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                      <p className="text-sm text-zinc-300">
                        <strong className="text-white">Price Range:</strong> {getCurrencySymbol(currency)}
                        {Math.min(
                          ...comparedProducts
                            .filter((p) => p.current_price)
                            .map((p) => p.current_price!)
                        ).toFixed(2)}{" "}
                        - {getCurrencySymbol(currency)}
                        {Math.max(
                          ...comparedProducts
                            .filter((p) => p.current_price)
                            .map((p) => p.current_price!)
                        ).toFixed(2)}
                        <span className="ml-2 text-emerald-400">
                          (Potential savings: {getCurrencySymbol(currency)}
                          {(
                            Math.max(
                              ...comparedProducts
                                .filter((p) => p.current_price)
                                .map((p) => p.current_price!)
                            ) -
                            Math.min(
                              ...comparedProducts
                                .filter((p) => p.current_price)
                                .map((p) => p.current_price!)
                            )
                          ).toFixed(2)}
                          )
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

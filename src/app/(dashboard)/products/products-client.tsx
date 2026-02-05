"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/currency";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { getValidImageUrl } from "@/lib/utils/image";
import {
  Package,
  TrendingDown,
  TrendingUp,
  ExternalLink,
  Search,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { AddProductModal } from "@/components/products/add-product-modal";

interface Product {
  id: string;
  name: string;
  url: string;
  image_url: string | null;
  current_price: number | null;
  original_price: number | null;
  lowest_price: number | null;
  retailer: string;
  last_checked: string | null;
  created_at: string;
}

interface ProductsClientProps {
  products: Product[];
  currency?: string;
}

export function ProductsClient({ products, currency = "USD" }: ProductsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRetailer, setFilterRetailer] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);

  // Get unique retailers
  const retailers = Array.from(new Set(products.map((p) => p.retailer)));

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesRetailer =
      filterRetailer === "all" || product.retailer === filterRetailer;
    return matchesSearch && matchesRetailer;
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
          <p className="text-gray-500">
            {products.length} product{products.length !== 1 ? "s" : ""} tracked
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>Add Product</Button>
        <AddProductModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={filterRetailer}
            onChange={(e) => setFilterRetailer(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Retailers</option>
            {retailers.map((retailer) => (
              <option key={retailer} value={retailer}>
                {retailer.charAt(0).toUpperCase() + retailer.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {products.length === 0
                ? "No products yet"
                : "No matching products"}
            </h3>
            <p className="text-gray-500 mb-4">
              {products.length === 0
                ? "Start tracking prices by adding your first product."
                : "Try adjusting your search or filter."}
            </p>
            {products.length === 0 && (
              <Button onClick={() => setShowAddModal(true)}>Add Your First Product</Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => {
            const priceChange =
              product.current_price && product.original_price
                ? ((product.current_price - product.original_price) /
                    product.original_price) *
                  100
                : 0;

            return (
              <Link key={product.id} href={`/products/${product.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Image */}
                      <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {getValidImageUrl(product.image_url) ? (
                          <Image
                            src={getValidImageUrl(product.image_url)!}
                            alt={product.name}
                            fill
                            className="object-contain"
                            sizes="80px"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Package className="h-8 w-8 text-gray-300" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-500 capitalize mb-2">
                          {product.retailer}
                        </p>

                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-gray-900">
                            {product.current_price ? formatPrice(product.current_price, currency) : "N/A"}
                          </span>
                          {priceChange !== 0 && (
                            <span
                              className={`flex items-center text-xs font-medium ${
                                priceChange < 0
                                  ? "text-emerald-600"
                                  : "text-red-600"
                              }`}
                            >
                              {priceChange < 0 ? (
                                <TrendingDown className="h-3 w-3 mr-0.5" />
                              ) : (
                                <TrendingUp className="h-3 w-3 mr-0.5" />
                              )}
                              {Math.abs(priceChange).toFixed(1)}%
                            </span>
                          )}
                        </div>

                        {product.lowest_price && (
                          <p className="text-xs text-emerald-600 mt-1">
                            Lowest: {formatPrice(product.lowest_price, currency)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        {product.last_checked
                          ? `Checked ${formatDistanceToNow(new Date(product.last_checked), { addSuffix: true })}`
                          : "Not checked yet"}
                      </span>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

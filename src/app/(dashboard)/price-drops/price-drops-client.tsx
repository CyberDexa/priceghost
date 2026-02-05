"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { formatPrice } from "@/lib/currency";
import { getValidImageUrl } from "@/lib/utils/image";
import {
  TrendingDown,
  ExternalLink,
  DollarSign,
  Package,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Product {
  id: string;
  name: string;
  url: string;
  image_url: string | null;
  current_price: number;
  original_price: number;
  lowest_price: number | null;
  retailer: string;
  last_checked: string | null;
}

interface PriceDropsClientProps {
  products: Product[];
  totalSavings: number;
  currency?: string;
}

export function PriceDropsClient({ products, totalSavings, currency = "USD" }: PriceDropsClientProps) {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <TrendingDown className="h-6 w-6 text-emerald-600" />
          Price Drops
        </h1>
        <p className="text-gray-500 mt-1">
          Products that have dropped in price since you started tracking
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-emerald-600 font-medium">Total Savings</p>
                <p className="text-2xl font-bold text-emerald-700">
                  {formatPrice(totalSavings, currency)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingDown className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Price Drops</p>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Sparkles className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Avg. Discount</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.length > 0
                    ? `${(
                        (products.reduce(
                          (sum, p) =>
                            sum +
                            ((p.original_price - p.current_price) / p.original_price) *
                              100,
                          0
                        ) / products.length)
                      ).toFixed(0)}%`
                    : "0%"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products List */}
      {products.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No price drops yet
            </h3>
            <p className="text-gray-500 mb-4">
              Keep tracking products and we&apos;ll show you when prices drop!
            </p>
            <Link href="/dashboard">
              <Button>Add Products</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {products
            .sort((a, b) => {
              const dropA = ((a.original_price - a.current_price) / a.original_price) * 100;
              const dropB = ((b.original_price - b.current_price) / b.original_price) * 100;
              return dropB - dropA;
            })
            .map((product) => {
              const savings = product.original_price - product.current_price;
              const percentOff =
                ((product.original_price - product.current_price) /
                  product.original_price) *
                100;

              return (
                <Link key={product.id} href={`/products/${product.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Image */}
                        <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {getValidImageUrl(product.image_url) ? (
                            <Image
                              src={getValidImageUrl(product.image_url)!}
                              alt={product.name}
                              fill
                              className="object-contain"
                              sizes="96px"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <Package className="h-8 w-8 text-gray-300" />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <h3 className="font-medium text-gray-900 line-clamp-2 mb-1">
                                {product.name}
                              </h3>
                              <p className="text-xs text-gray-500 capitalize">
                                {product.retailer}
                              </p>
                            </div>

                            {/* Discount Badge */}
                            <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full flex items-center gap-1 flex-shrink-0">
                              <TrendingDown className="h-4 w-4" />
                              <span className="font-bold">{percentOff.toFixed(0)}% off</span>
                            </div>
                          </div>

                          {/* Prices */}
                          <div className="flex items-center gap-3 mt-3">
                            <span className="text-2xl font-bold text-emerald-600">
                              {formatPrice(product.current_price, currency)}
                            </span>
                            <span className="text-lg text-gray-400 line-through">
                              {formatPrice(product.original_price, currency)}
                            </span>
                            <span className="text-sm text-emerald-600 font-medium">
                              Save {formatPrice(savings, currency)}
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-xs text-gray-500">
                              {product.last_checked
                                ? `Updated ${formatDistanceToNow(new Date(product.last_checked), { addSuffix: true })}`
                                : ""}
                            </span>
                            <a
                              href={product.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                            >
                              Buy Now
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </div>
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

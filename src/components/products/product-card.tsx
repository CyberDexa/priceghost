"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { cn } from "@/lib/utils/cn";
import { 
  ExternalLink, 
  TrendingDown, 
  TrendingUp,
  MoreVertical,
  Trash2,
  RefreshCw
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface ProductCardProps {
  product: Product;
  currency?: string;
}

const retailerLogos: Record<string, string> = {
  amazon: "🛒",
  walmart: "🏪",
  bestbuy: "🔵",
  target: "🎯",
  ebay: "📦",
  costco: "🏬",
  aliexpress: "🌐",
  temu: "🛍️",
  newegg: "💻",
  homedepot: "🔨",
  lowes: "🏠",
  wayfair: "🪑",
  etsy: "🎨",
  argos: "🇬🇧",
  currys: "📱",
  johnlewis: "🏷️",
  ao: "🔌",
  very: "✨",
  unknown: "🛍️",
};

export function ProductCard({ product, currency = "USD" }: ProductCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const priceChange = product.original_price && product.current_price
    ? ((product.current_price - product.original_price) / product.original_price) * 100
    : 0;

  const formatPrice = (price: number | null) => {
    if (price === null) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: product.currency || currency,
    }).format(price);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    setIsDeleting(true);
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);

    if (!error) {
      router.refresh();
    }
    setIsDeleting(false);
    setShowMenu(false);
  };

  return (
    <Link href={"/products/" + product.id}>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer">
        <div className="flex">
          {/* Product Image */}
          <div className="w-32 h-32 sm:w-40 sm:h-40 relative bg-gray-100 flex-shrink-0">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-contain p-2"
                sizes="(max-width: 640px) 128px, 160px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl">
                {retailerLogos[product.retailer] || "🛍️"}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 p-4 flex flex-col min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{retailerLogos[product.retailer] || "🛍️"}</span>
                  <span className="text-xs text-gray-500 capitalize">{product.retailer}</span>
                </div>
                <h3 className="font-medium text-gray-900 line-clamp-2 text-sm sm:text-base">
                  {product.name}
                </h3>
              </div>

              {/* Menu */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                  }}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <MoreVertical className="h-4 w-4 text-gray-400" />
                </button>
                {showMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowMenu(false);
                      }} 
                    />
                    <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                      <a
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Visit Store
                      </a>
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                      >
                        <Trash2 className="h-4 w-4" />
                        {isDeleting ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="mt-auto pt-3">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">
                    {formatPrice(product.current_price)}
                  </div>
                  {product.target_price && (
                    <div className="text-xs text-gray-500">
                      Target: {formatPrice(product.target_price)}
                    </div>
                  )}
                </div>

                {/* Price Change Badge */}
                {priceChange !== 0 && (
                  <div
                    className={cn(
                      "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                      priceChange < 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    )}
                  >
                    {priceChange < 0 ? (
                      <TrendingDown className="h-3 w-3" />
                    ) : (
                      <TrendingUp className="h-3 w-3" />
                    )}
                    {Math.abs(priceChange).toFixed(1)}%
                  </div>
                )}
              </div>

              {/* Last checked */}
              {product.last_checked && (
                <div className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                  <RefreshCw className="h-3 w-3" />
                  Updated {formatDistanceToNow(new Date(product.last_checked), { addSuffix: true })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

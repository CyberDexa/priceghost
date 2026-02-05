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
  RefreshCw,
  Store,
  Clock
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface ProductCardProps {
  product: Product;
  currency?: string;
}

// SVG icons for retailers
const RetailerIcon = ({ retailer }: { retailer: string }) => {
  const iconClasses = "h-4 w-4";
  
  // Return a store icon as fallback - in production you'd have actual retailer logos
  return (
    <div className="flex items-center justify-center w-6 h-6 rounded-md bg-zinc-800 text-zinc-400">
      <Store className={iconClasses} />
    </div>
  );
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
      <div className="group relative rounded-2xl border border-zinc-800/50 bg-gradient-to-b from-zinc-900/90 to-zinc-900/50 backdrop-blur-xl shadow-xl shadow-black/20 overflow-hidden transition-all duration-300 hover:border-zinc-700/80 hover:shadow-2xl hover:shadow-black/30 hover:-translate-y-1 cursor-pointer">
        {/* Glow effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent" />
        </div>

        <div className="relative flex">
          {/* Product Image */}
          <div className="w-32 h-32 sm:w-40 sm:h-40 relative flex-shrink-0 bg-zinc-900/50">
            {product.image_url ? (
              <>
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 128px, 160px"
                />
                {/* Image overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-zinc-900/20" />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Store className="h-10 w-10 text-zinc-700" />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 p-4 flex flex-col min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <RetailerIcon retailer={product.retailer} />
                  <span className="text-xs font-medium text-zinc-500 capitalize tracking-wide">
                    {product.retailer}
                  </span>
                </div>
                <h3 className="font-semibold text-zinc-100 line-clamp-2 text-sm sm:text-base leading-snug group-hover:text-white transition-colors">
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
                  className="p-2 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                >
                  <MoreVertical className="h-4 w-4 text-zinc-500" />
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
                    <div className="absolute right-0 top-full mt-1 w-40 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl shadow-black/40 py-1.5 z-20 animate-scale-in">
                      <a
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Visit Store
                      </a>
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 w-full transition-colors cursor-pointer"
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
              <div className="flex items-end justify-between gap-3">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    {formatPrice(product.current_price)}
                  </div>
                  {product.target_price && (
                    <div className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      Target: {formatPrice(product.target_price)}
                    </div>
                  )}
                </div>

                {/* Price Change Badge */}
                {priceChange !== 0 && (
                  <div
                    className={cn(
                      "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all",
                      priceChange < 0
                        ? "bg-emerald-500/15 text-emerald-400 shadow-lg shadow-emerald-500/10"
                        : "bg-red-500/15 text-red-400 shadow-lg shadow-red-500/10"
                    )}
                  >
                    {priceChange < 0 ? (
                      <TrendingDown className="h-3.5 w-3.5" />
                    ) : (
                      <TrendingUp className="h-3.5 w-3.5" />
                    )}
                    {Math.abs(priceChange).toFixed(1)}%
                  </div>
                )}
              </div>

              {/* Last checked */}
              {product.last_checked && (
                <div className="text-xs text-zinc-600 mt-3 flex items-center gap-1.5">
                  <Clock className="h-3 w-3" />
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

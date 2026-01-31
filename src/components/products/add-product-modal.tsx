"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Link as LinkIcon, DollarSign, Loader2 } from "lucide-react";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddProductModal({ isOpen, onClose }: AddProductModalProps) {
  const [url, setUrl] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate URL
      let validUrl: URL;
      try {
        validUrl = new URL(url);
      } catch {
        setError("Please enter a valid URL");
        setIsLoading(false);
        return;
      }

      // Call the scrape API
      const scrapeResponse = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: validUrl.href }),
      });

      const scrapeData = await scrapeResponse.json();

      if (!scrapeData.success) {
        setError(scrapeData.error || "Failed to fetch product details");
        setIsLoading(false);
        return;
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError("You must be logged in to add products");
        setIsLoading(false);
        return;
      }

      // Save to database
      const { error: dbError } = await supabase.from("products").insert({
        user_id: user.id,
        url: validUrl.href,
        name: scrapeData.name || "Unknown Product",
        image_url: scrapeData.image_url,
        current_price: scrapeData.price,
        original_price: scrapeData.price,
        lowest_price: scrapeData.price,
        highest_price: scrapeData.price,
        target_price: targetPrice ? parseFloat(targetPrice) : null,
        currency: scrapeData.currency || "USD",
        retailer: scrapeData.retailer || "unknown",
        last_checked: new Date().toISOString(),
      });

      if (dbError) {
        setError(dbError.message);
        setIsLoading(false);
        return;
      }

      // Also add initial price history
      const { data: newProduct } = await supabase
        .from("products")
        .select("id")
        .eq("user_id", user.id)
        .eq("url", validUrl.href)
        .single();

      if (newProduct && scrapeData.price) {
        await supabase.from("price_history").insert({
          product_id: newProduct.id,
          price: scrapeData.price,
          currency: scrapeData.currency || "USD",
        });
      }

      // Success - close modal and refresh
      setUrl("");
      setTargetPrice("");
      onClose();
      router.refresh();
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Track a Product
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Paste a product URL and we&apos;ll start tracking its price for you.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Product URL
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="url"
                placeholder="https://amazon.com/product..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Target Price (optional)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                step="0.01"
                placeholder="Alert me when price drops below..."
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Product"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

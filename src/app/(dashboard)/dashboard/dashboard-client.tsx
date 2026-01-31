"use client";

import { useState, useMemo } from "react";
import { Product } from "@/types";
import { ProductCard } from "@/components/products/product-card";
import { AddProductModal } from "@/components/products/add-product-modal";
import { ProductFilters, ProductFilters as FilterState } from "@/components/dashboard/product-filters";
import { SavingsWidget } from "@/components/dashboard/savings-widget";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Ghost, Download, Trash2, RefreshCw } from "lucide-react";
import { formatPrice } from "@/lib/currency";

interface DashboardClientProps {
  products: Product[];
  stats: {
    totalProducts: number;
    totalSavings: number;
    priceDrops: number;
  };
  currency?: string;
}

export function DashboardClient({ products, stats, currency = "USD" }: DashboardClientProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    retailer: "all",
    minPrice: "",
    maxPrice: "",
    sortBy: "newest",
    status: "all",
  });

  // Detect retailer from URL
  const getRetailer = (url: string): string => {
    if (url.includes("amazon")) return "amazon";
    if (url.includes("walmart")) return "walmart";
    if (url.includes("bestbuy")) return "bestbuy";
    if (url.includes("target")) return "target";
    return "other";
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.url.toLowerCase().includes(searchLower)
      );
    }

    // Retailer filter
    if (filters.retailer !== "all") {
      result = result.filter((p) => getRetailer(p.url) === filters.retailer);
    }

    // Price range filter
    if (filters.minPrice) {
      const min = parseFloat(filters.minPrice);
      result = result.filter((p) => (p.current_price ?? 0) >= min);
    }
    if (filters.maxPrice) {
      const max = parseFloat(filters.maxPrice);
      result = result.filter((p) => (p.current_price ?? 0) <= max);
    }

    // Status filter
    if (filters.status !== "all") {
      switch (filters.status) {
        case "active":
          result = result.filter((p) => p.is_active);
          break;
        case "inactive":
          result = result.filter((p) => !p.is_active);
          break;
        case "price-drop":
          result = result.filter(
            (p) => p.original_price && (p.current_price ?? 0) < (p.original_price ?? 0)
          );
          break;
      }
    }

    // Sorting
    switch (filters.sortBy) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      case "price-low":
        result.sort((a, b) => (a.current_price ?? 0) - (b.current_price ?? 0));
        break;
      case "price-high":
        result.sort((a, b) => (b.current_price ?? 0) - (a.current_price ?? 0));
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "biggest-drop":
        result.sort((a, b) => {
          const dropA = a.original_price
            ? (a.original_price ?? 0) - (a.current_price ?? 0)
            : 0;
          const dropB = b.original_price
            ? (b.original_price ?? 0) - (b.current_price ?? 0)
            : 0;
          return dropB - dropA;
        });
        break;
    }

    return result;
  }, [products, filters]);

  // Toggle product selection
  const toggleProductSelection = (productId: string) => {
    setSelectedProducts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  // Select all filtered products
  const selectAll = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(filteredProducts.map((p) => p.id)));
    }
  };

  // Bulk actions
  const handleBulkAction = async (action: "delete" | "refresh" | "activate" | "deactivate") => {
    if (selectedProducts.size === 0) return;

    setBulkLoading(true);
    try {
      const response = await fetch("/api/products/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          productIds: Array.from(selectedProducts),
        }),
      });

      if (response.ok) {
        setSelectedProducts(new Set());
        window.location.reload();
      }
    } catch (error) {
      console.error("Bulk action failed:", error);
    } finally {
      setBulkLoading(false);
    }
  };

  // Export products
  const handleExport = async () => {
    try {
      const response = await fetch("/api/export?type=products");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `priceghost-products-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Track your products and never miss a deal</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Track Product
          </Button>
        </div>
      </div>

      {/* Savings Stats Widget */}
      <SavingsWidget currency={currency} />

      {/* Filters */}
      <ProductFilters
        filters={filters}
        onFiltersChange={setFilters}
        totalProducts={products.length}
        filteredCount={filteredProducts.length}
      />

      {/* Bulk Actions Bar */}
      {selectedProducts.size > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="text-sm text-emerald-800">
            {selectedProducts.size} product{selectedProducts.size !== 1 ? "s" : ""} selected
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction("refresh")}
              disabled={bulkLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${bulkLoading ? "animate-spin" : ""}`} />
              Refresh Prices
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction("deactivate")}
              disabled={bulkLoading}
            >
              Pause Tracking
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction("delete")}
              disabled={bulkLoading}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Products */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Your Products</h2>
          {filteredProducts.length > 0 && (
            <Button variant="ghost" size="sm" onClick={selectAll}>
              {selectedProducts.size === filteredProducts.length ? "Deselect All" : "Select All"}
            </Button>
          )}
        </div>

        {products.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Ghost className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No products yet
              </h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                Start tracking products to get notified when prices drop. Just paste a URL and we&apos;ll do the rest!
              </p>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Track Your First Product
              </Button>
            </CardContent>
          </Card>
        ) : filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Ghost className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No matching products
              </h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                Try adjusting your filters to see more products.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="relative">
                {/* Selection checkbox */}
                <div className="absolute top-4 left-4 z-10">
                  <input
                    type="checkbox"
                    checked={selectedProducts.has(product.id)}
                    onChange={() => toggleProductSelection(product.id)}
                    className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </div>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Filter, 
  X, 
  Search,
  ChevronDown,
  ChevronUp
} from "lucide-react";

const retailers = [
  { value: "all", label: "All Retailers" },
  { value: "amazon", label: "Amazon" },
  { value: "walmart", label: "Walmart" },
  { value: "bestbuy", label: "Best Buy" },
  { value: "target", label: "Target" },
  { value: "other", label: "Other" },
];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
  { value: "biggest-drop", label: "Biggest Price Drop" },
];

export interface ProductFilters {
  search: string;
  retailer: string;
  minPrice: string;
  maxPrice: string;
  sortBy: string;
  status: string;
}

interface ProductFiltersProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  totalProducts: number;
  filteredCount: number;
}

export function ProductFilters({ 
  filters, 
  onFiltersChange, 
  totalProducts, 
  filteredCount 
}: ProductFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof ProductFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      retailer: "all",
      minPrice: "",
      maxPrice: "",
      sortBy: "newest",
      status: "all",
    });
  };

  const hasActiveFilters = 
    filters.search || 
    filters.retailer !== "all" || 
    filters.minPrice || 
    filters.maxPrice ||
    filters.status !== "all";

  return (
    <div className="rounded-2xl border border-zinc-800/50 bg-gradient-to-b from-zinc-900/90 to-zinc-900/50 backdrop-blur-xl p-4 mb-6">
      {/* Search and basic controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
            className="px-4 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all cursor-pointer hover:border-zinc-700"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>

          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters} className="text-zinc-400 hover:text-red-400">
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Expanded filters */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-zinc-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up">
          {/* Retailer filter */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Retailer
            </label>
            <select
              value={filters.retailer}
              onChange={(e) => handleFilterChange("retailer", e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all cursor-pointer hover:border-zinc-700"
            >
              {retailers.map((retailer) => (
                <option key={retailer.value} value={retailer.value}>
                  {retailer.label}
                </option>
              ))}
            </select>
          </div>

          {/* Price range */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Min Price
            </label>
            <Input
              type="number"
              placeholder="$0"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange("minPrice", e.target.value)}
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Max Price
            </label>
            <Input
              type="number"
              placeholder="$999"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
              min="0"
            />
          </div>

          {/* Status filter */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all cursor-pointer hover:border-zinc-700"
            >
              <option value="all">All Products</option>
              <option value="active">Active Tracking</option>
              <option value="inactive">Paused</option>
              <option value="price-drop">Has Price Drop</option>
            </select>
          </div>
        </div>
      )}

      {/* Results count */}
      <div className="mt-3 text-sm text-zinc-500">
        Showing <span className="text-zinc-300 font-medium">{filteredCount}</span> of {totalProducts} products
        {hasActiveFilters && <span className="text-emerald-400 ml-1">(filtered)</span>}
      </div>
    </div>
  );
}

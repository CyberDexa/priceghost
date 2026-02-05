'use client';

import { ReactNode } from 'react';
import { 
  Package, 
  Bell, 
  TrendingDown, 
  BarChart3, 
  Search,
  Plus,
  GitCompare,
  Inbox
} from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action,
  secondaryAction 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon && (
        <div className="w-20 h-20 bg-zinc-800/50 rounded-2xl flex items-center justify-center mb-6">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-zinc-400 max-w-sm mb-6">{description}</p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        {action && (
          action.href ? (
            <Link
              href={action.href}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-lg font-medium transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              {action.label}
            </Link>
          ) : (
            <button
              onClick={action.onClick}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-lg font-medium transition-all duration-200 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              {action.label}
            </button>
          )
        )}
        {secondaryAction && (
          secondaryAction.href ? (
            <Link
              href={secondaryAction.href}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-300 border border-zinc-700 rounded-lg font-medium transition-colors"
            >
              {secondaryAction.label}
            </Link>
          ) : (
            <button
              onClick={secondaryAction.onClick}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-300 border border-zinc-700 rounded-lg font-medium transition-colors cursor-pointer"
            >
              {secondaryAction.label}
            </button>
          )
        )}
      </div>
    </div>
  );
}

// Pre-configured empty states for common scenarios
export function NoProductsEmptyState({ onAdd }: { onAdd?: () => void }) {
  return (
    <EmptyState
      icon={<Package className="w-10 h-10 text-zinc-500" />}
      title="No products yet"
      description="Start tracking prices by adding your first product. Paste a URL from Amazon, Walmart, Best Buy, or any other store."
      action={{
        label: "Add Product",
        onClick: onAdd,
      }}
      secondaryAction={{
        label: "Learn how it works",
        href: "/help",
      }}
    />
  );
}

export function NoAlertsEmptyState() {
  return (
    <EmptyState
      icon={<Bell className="w-10 h-10 text-zinc-500" />}
      title="No alerts set"
      description="Create price alerts to get notified when products drop to your target price."
      action={{
        label: "Browse Products",
        href: "/products",
      }}
    />
  );
}

export function NoPriceDropsEmptyState() {
  return (
    <EmptyState
      icon={<TrendingDown className="w-10 h-10 text-zinc-500" />}
      title="No price drops yet"
      description="We'll show price drops here as we track your products. Check back soon!"
      action={{
        label: "Add Products",
        href: "/products",
      }}
    />
  );
}

export function NoAnalyticsEmptyState() {
  return (
    <EmptyState
      icon={<BarChart3 className="w-10 h-10 text-zinc-500" />}
      title="No data to analyze"
      description="Start tracking products to see your savings analytics and price trends."
      action={{
        label: "Add Products",
        href: "/products",
      }}
    />
  );
}

export function NoSearchResultsEmptyState({ query }: { query: string }) {
  return (
    <EmptyState
      icon={<Search className="w-10 h-10 text-zinc-500" />}
      title="No results found"
      description={`We couldn't find any products matching "${query}". Try a different search term.`}
    />
  );
}

export function NoCompareProductsEmptyState() {
  return (
    <EmptyState
      icon={<GitCompare className="w-10 h-10 text-zinc-500" />}
      title="Nothing to compare"
      description="Select at least two products from your tracked items to compare their prices and history."
      action={{
        label: "View Products",
        href: "/products",
      }}
    />
  );
}

export function NoNotificationsEmptyState() {
  return (
    <EmptyState
      icon={<Inbox className="w-10 h-10 text-zinc-500" />}
      title="All caught up!"
      description="You don't have any notifications right now. We'll let you know when something important happens."
    />
  );
}

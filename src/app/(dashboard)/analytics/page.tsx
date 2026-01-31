import { Suspense } from 'react';
import { AnalyticsClient } from './analytics-client';

export const metadata = {
  title: 'Analytics | PriceGhost',
  description: 'Track your savings and price monitoring statistics',
};

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-32 bg-zinc-800 rounded animate-pulse" />
          <div className="h-4 w-48 bg-zinc-800 rounded animate-pulse mt-2" />
        </div>
        <div className="h-10 w-40 bg-zinc-800 rounded animate-pulse" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse" />
            <div className="h-8 w-16 bg-zinc-800 rounded animate-pulse mt-2" />
            <div className="h-3 w-32 bg-zinc-800 rounded animate-pulse mt-2" />
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <div className="h-6 w-32 bg-zinc-800 rounded animate-pulse mb-4" />
          <div className="h-64 bg-zinc-800 rounded animate-pulse" />
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <div className="h-6 w-32 bg-zinc-800 rounded animate-pulse mb-4" />
          <div className="h-64 bg-zinc-800 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<AnalyticsSkeleton />}>
      <AnalyticsClient />
    </Suspense>
  );
}

import { StatsGridSkeleton, ChartSkeleton } from '@/components/ui/skeletons';

export default function AnalyticsLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between animate-pulse">
        <div>
          <div className="h-8 bg-zinc-800 rounded w-32 mb-2" />
          <div className="h-4 bg-zinc-800 rounded w-56" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 bg-zinc-800 rounded w-20" />
          <div className="h-10 bg-zinc-800 rounded w-20" />
          <div className="h-10 bg-zinc-800 rounded w-20" />
        </div>
      </div>

      {/* Stats Grid */}
      <StatsGridSkeleton />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    </div>
  );
}

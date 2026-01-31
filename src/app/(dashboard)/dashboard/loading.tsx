import { StatsGridSkeleton, ProductListSkeleton } from '@/components/ui/skeletons';

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="animate-pulse">
        <div className="h-8 bg-zinc-800 rounded w-48 mb-2" />
        <div className="h-4 bg-zinc-800 rounded w-72" />
      </div>

      {/* Stats Grid */}
      <StatsGridSkeleton />

      {/* Products Section */}
      <div className="animate-pulse">
        <div className="h-6 bg-zinc-800 rounded w-32 mb-4" />
      </div>
      <ProductListSkeleton count={3} />
    </div>
  );
}

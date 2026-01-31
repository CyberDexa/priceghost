// Skeleton components for loading states
export function ProductCardSkeleton() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 animate-pulse">
      <div className="flex gap-4">
        {/* Image skeleton */}
        <div className="w-20 h-20 bg-zinc-800 rounded-lg flex-shrink-0" />
        
        <div className="flex-1 min-w-0">
          {/* Title skeleton */}
          <div className="h-5 bg-zinc-800 rounded w-3/4 mb-2" />
          <div className="h-4 bg-zinc-800 rounded w-1/2 mb-3" />
          
          {/* Price skeleton */}
          <div className="flex items-center gap-2">
            <div className="h-6 bg-zinc-800 rounded w-20" />
            <div className="h-4 bg-zinc-800 rounded w-16" />
          </div>
        </div>
        
        {/* Action buttons skeleton */}
        <div className="flex flex-col gap-2">
          <div className="w-8 h-8 bg-zinc-800 rounded" />
          <div className="w-8 h-8 bg-zinc-800 rounded" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 animate-pulse">
      <div className="flex items-center justify-between mb-2">
        <div className="h-4 bg-zinc-800 rounded w-24" />
        <div className="w-10 h-10 bg-zinc-800 rounded-lg" />
      </div>
      <div className="h-8 bg-zinc-800 rounded w-16 mb-2" />
      <div className="h-3 bg-zinc-800 rounded w-32" />
    </div>
  );
}

export function StatsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 animate-pulse">
      <div className="h-6 bg-zinc-800 rounded w-32 mb-4" />
      <div className="h-64 bg-zinc-800 rounded" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="animate-pulse">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-zinc-800 rounded" />
          <div className="h-4 bg-zinc-800 rounded w-32" />
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-zinc-800 rounded w-20" />
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-zinc-800 rounded w-16" />
      </td>
      <td className="px-4 py-3">
        <div className="h-6 bg-zinc-800 rounded w-12" />
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <div className="w-8 h-8 bg-zinc-800 rounded" />
          <div className="w-8 h-8 bg-zinc-800 rounded" />
        </div>
      </td>
    </tr>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-800">
            <th className="px-4 py-3 text-left">
              <div className="h-4 bg-zinc-800 rounded w-16 animate-pulse" />
            </th>
            <th className="px-4 py-3 text-left">
              <div className="h-4 bg-zinc-800 rounded w-12 animate-pulse" />
            </th>
            <th className="px-4 py-3 text-left">
              <div className="h-4 bg-zinc-800 rounded w-14 animate-pulse" />
            </th>
            <th className="px-4 py-3 text-left">
              <div className="h-4 bg-zinc-800 rounded w-12 animate-pulse" />
            </th>
            <th className="px-4 py-3 text-left">
              <div className="h-4 bg-zinc-800 rounded w-16 animate-pulse" />
            </th>
          </tr>
        </thead>
        <tbody>
          {[...Array(rows)].map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AlertCardSkeleton() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-zinc-800 rounded" />
        <div className="flex-1">
          <div className="h-5 bg-zinc-800 rounded w-2/3 mb-2" />
          <div className="h-4 bg-zinc-800 rounded w-1/2 mb-3" />
          <div className="flex gap-2">
            <div className="h-6 bg-zinc-800 rounded w-20" />
            <div className="h-6 bg-zinc-800 rounded w-24" />
          </div>
        </div>
        <div className="w-10 h-6 bg-zinc-800 rounded-full" />
      </div>
    </div>
  );
}

export function AlertListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <AlertCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between animate-pulse">
      <div>
        <div className="h-8 bg-zinc-800 rounded w-32 mb-2" />
        <div className="h-4 bg-zinc-800 rounded w-48" />
      </div>
      <div className="h-10 bg-zinc-800 rounded w-32" />
    </div>
  );
}

export function SettingsSectionSkeleton() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 animate-pulse">
      <div className="h-6 bg-zinc-800 rounded w-40 mb-4" />
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div>
              <div className="h-4 bg-zinc-800 rounded w-32 mb-1" />
              <div className="h-3 bg-zinc-800 rounded w-48" />
            </div>
            <div className="w-12 h-6 bg-zinc-800 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Inline loading spinner
export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <svg
      className={`animate-spin text-indigo-500 ${sizeClasses[size]}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

// Loading overlay
export function LoadingOverlay({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="absolute inset-0 bg-zinc-900/80 backdrop-blur-sm flex items-center justify-center z-10">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-3 text-zinc-400">{message}</p>
      </div>
    </div>
  );
}

// Button loading state
export function ButtonLoader() {
  return <Spinner size="sm" />;
}

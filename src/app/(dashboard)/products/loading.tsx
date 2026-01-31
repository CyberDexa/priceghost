import { ProductGridSkeleton, PageHeaderSkeleton } from '@/components/ui/skeletons';

export default function ProductsLoading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <ProductGridSkeleton count={6} />
    </div>
  );
}

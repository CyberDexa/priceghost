import { AlertListSkeleton, PageHeaderSkeleton } from '@/components/ui/skeletons';

export default function AlertsLoading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <AlertListSkeleton count={4} />
    </div>
  );
}

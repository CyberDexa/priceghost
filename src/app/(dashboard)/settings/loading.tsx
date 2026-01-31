import { SettingsSectionSkeleton, PageHeaderSkeleton } from '@/components/ui/skeletons';

export default function SettingsLoading() {
  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeaderSkeleton />
      <SettingsSectionSkeleton />
      <SettingsSectionSkeleton />
      <SettingsSectionSkeleton />
    </div>
  );
}

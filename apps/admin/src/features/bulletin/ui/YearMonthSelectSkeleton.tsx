import { Skeleton } from '@/shared/ui';

export function YearMonthSelectSkeleton() {
  return (
    <div className="flex gap-2">
      <Skeleton className="h-10 w-[120px]" />
      <Skeleton className="h-10 w-[100px]" />
    </div>
  );
}

import { SermonsList } from '@/widgets/sermon-list';
import { CreateSermonButton } from '@/features/sermon';
import { Suspense } from 'react';
import { ListSkeleton } from '@/shared/ui';

export default async function SermonsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page } = await searchParams;

  const searchQuery = q || '';
  const currentPage = Math.max(1, Number(page) || 1);

  return (
    <div className="space-y-6">
      <CreateSermonButton />
      <Suspense fallback={<ListSkeleton />}>
        <SermonsList searchQuery={searchQuery} currentPage={currentPage} />
      </Suspense>
    </div>
  );
}

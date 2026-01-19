import { Suspense } from 'react';
import { SERMON_UI, SermonsList } from '@/widgets/sermon-list';
import { CreateSermonButton } from '@/features/sermon';
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
      <Suspense
        fallback={
          <ListSkeleton
            title={SERMON_UI.TITLE}
            description={SERMON_UI.DESCRIPTION}
          />
        }
      >
        <SermonsList searchQuery={searchQuery} currentPage={currentPage} />
      </Suspense>
    </div>
  );
}

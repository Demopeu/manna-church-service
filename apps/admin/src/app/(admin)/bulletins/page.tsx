import { Suspense } from 'react';
import { BULLETIN_UI, BulletinsList } from '@/widgets/bulletin-list';
import { CreateBulletinButton } from '@/features/bulletin';
import { ListSkeleton } from '@/shared/ui';

export default async function BulletinsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page } = await searchParams;

  const searchQuery = q || '';
  const currentPage = Math.max(1, Number(page) || 1);
  return (
    <div className="space-y-6">
      <CreateBulletinButton />
      <Suspense
        fallback={
          <ListSkeleton
            title={BULLETIN_UI.TITLE}
            description={BULLETIN_UI.DESCRIPTION}
          />
        }
      >
        <BulletinsList searchQuery={searchQuery} currentPage={currentPage} />
      </Suspense>
    </div>
  );
}

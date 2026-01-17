import { Suspense } from 'react';
import { ServantsList } from '@/widgets/servant-list';
import { CreateServantButton } from '@/features/servant';
import { ListSkeleton } from '@/shared/ui';

export default async function ServantsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    role?: string;
    isPublic?: string;
    page?: string;
  }>;
}) {
  const { q, role, isPublic, page } = await searchParams;

  const searchQuery = q || '';
  const roleFilter = role || 'all';
  const isPublicFilter = isPublic || 'all';
  const currentPage = Math.max(1, Number(page) || 1);

  return (
    <div className="space-y-6">
      <CreateServantButton />
      <Suspense fallback={<ListSkeleton />}>
        <ServantsList
          searchQuery={searchQuery}
          roleFilter={roleFilter}
          isPublicFilter={isPublicFilter}
          currentPage={currentPage}
        />
      </Suspense>
    </div>
  );
}

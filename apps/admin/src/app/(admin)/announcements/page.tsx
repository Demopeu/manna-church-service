import { Suspense } from 'react';
import {
  ANNOUNCEMENT_UI,
  AnnouncementsList,
} from '@/widgets/announcement-list';
import { CreateAnnouncementButton } from '@/features/announcement';
import { ListSkeleton } from '@/shared/ui';

export default async function AnnouncementsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page } = await searchParams;

  const searchQuery = q || '';
  const currentPage = Math.max(1, Number(page) || 1);
  return (
    <div className="space-y-6">
      <CreateAnnouncementButton />
      <Suspense
        fallback={
          <ListSkeleton
            title={ANNOUNCEMENT_UI.TITLE}
            description={ANNOUNCEMENT_UI.DESCRIPTION}
          />
        }
      >
        <AnnouncementsList
          searchQuery={searchQuery}
          currentPage={currentPage}
        />
      </Suspense>
    </div>
  );
}

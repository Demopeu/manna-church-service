import { AnnouncementsList } from '@/widgets/announcement-list';
import { CreateAnnouncementButton } from '@/features/announcement';

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

      <AnnouncementsList searchQuery={searchQuery} currentPage={currentPage} />
    </div>
  );
}

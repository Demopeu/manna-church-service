import { AnnouncementList, announcementsData } from '@/widgets/announcements-section';
import { MainWrapper } from '@/shared/ui';

export default async function AnnouncementsPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  const { query, page } = await searchParams;
  const currentQuery = query || '';
  const pageNum = page ? Number(page) : 1;

  return (
    <MainWrapper heroBannerData={announcementsData}>
      <AnnouncementList
        key={`${currentQuery}-${pageNum}`}
        query={currentQuery}
        page={pageNum}
      />
    </MainWrapper>
  );
}

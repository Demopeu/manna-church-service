import {
  AnnouncementList,
  announcementsData,
} from '@/widgets/announcements-section';
import { MainWrapper } from '@/shared/ui';

export default async function AnnouncementsPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  const filterParams = searchParams.then((sp) => ({
    query: sp.query || '',
    page: sp.page ? Number(sp.page) : 1,
  }));

  return (
    <MainWrapper heroBannerData={announcementsData}>
      <AnnouncementList filterParams={filterParams} />
    </MainWrapper>
  );
}

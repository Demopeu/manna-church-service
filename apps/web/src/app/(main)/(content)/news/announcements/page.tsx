import type { Metadata } from 'next';
import {
  AnnouncementList,
  announcementsData,
} from '@/widgets/announcements-section';
import { MainWrapper } from '@/shared/ui';

export const metadata: Metadata = {
  title: '공지사항',
  description: '만나교회의 공지사항과 안내를 전합니다.',
  openGraph: {
    title: '공지사항',
    description: '만나교회의 공지사항과 안내를 전합니다.',
  },
};

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

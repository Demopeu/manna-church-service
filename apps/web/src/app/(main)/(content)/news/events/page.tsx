import type { Metadata } from 'next';
import EVENTS_BANNER from '@/app/asset/hero-banner/events.webp';
import { EventList, eventsData } from '@/widgets/events-section';
import { MainWrapper } from '@/shared/ui';

export const metadata: Metadata = {
  title: '이벤트',
  description: '만나교회의 다양한 행사와 이벤트를 소개합니다.',
  alternates: {
    canonical: '/news/events',
  },
  openGraph: {
    title: '이벤트',
    description: '만나교회의 다양한 행사와 이벤트를 소개합니다.',
    images: [{ url: '/hero-banner/events.webp' }],
  },
};

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  const filterParams = searchParams.then((sp) => ({
    query: sp.query || '',
    page: sp.page ? Number(sp.page) : 1,
  }));

  return (
    <MainWrapper heroBannerImage={EVENTS_BANNER} heroBannerData={eventsData}>
      <EventList filterParams={filterParams} />
    </MainWrapper>
  );
}

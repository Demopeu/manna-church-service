import { EventList, eventsData } from '@/widgets/events-section';
import { MainWrapper } from '@/shared/ui';

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  const { query, page } = await searchParams;
  const currentQuery = query || '';
  const pageNum = page ? Number(page) : 1;

  return (
    <MainWrapper heroBannerData={eventsData}>
      <EventList
        key={`${currentQuery}-${pageNum}`}
        query={currentQuery}
        page={pageNum}
      />
    </MainWrapper>
  );
}

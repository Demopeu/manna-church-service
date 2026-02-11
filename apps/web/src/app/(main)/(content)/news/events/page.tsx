import { EventList, eventsData } from '@/widgets/events-section';
import { MainWrapper } from '@/shared/ui';

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
    <MainWrapper heroBannerData={eventsData}>
      <EventList filterParams={filterParams} />
    </MainWrapper>
  );
}

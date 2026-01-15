import { Megaphone } from 'lucide-react';
import { DashboardCardWrapper } from './dashboard-card-wrapper';
import { getLatestEvent } from '@/entities/event';
import { EventsItem } from './EventsItem';
import { withAsyncBoundary } from '@/shared/lib';
import { CardSkeleton } from './CardSkeleton';
import { CardError } from './CardError';

async function EventsCard() {
  const data = await getLatestEvent();

  return (
    <DashboardCardWrapper
      title="진행 중인 이벤트"
      icon={Megaphone}
      href="/events"
    >
      <div className="space-y-2">
        {data.map((item) => (
          <EventsItem
            key={item.id}
            title={item.title}
            startDate={item.startDate}
            endDate={item.endDate}
          />
        ))}
      </div>
    </DashboardCardWrapper>
  );
}

export const RecentEventsCard = withAsyncBoundary(EventsCard, {
  loadingFallback: <CardSkeleton title="진행 중인 이벤트" icon={Megaphone} />,
  errorFallback: <CardError title="진행 중인 이벤트" />,
});

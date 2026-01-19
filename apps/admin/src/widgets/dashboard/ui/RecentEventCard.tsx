import { CalendarDays } from 'lucide-react';
import { getLatestEvent } from '@/entities/event';
import { withAsyncBoundary } from '@/shared/ui';
import { CardError } from './CardError';
import { CardSkeleton } from './CardSkeleton';
import { DashboardCardWrapper } from './dashboard-card-wrapper';

async function EventCard() {
  const data = await getLatestEvent();

  if (!data) {
    return (
      <DashboardCardWrapper
        title="최근 이벤트"
        icon={CalendarDays}
        href="/events"
      >
        <div className="text-muted-foreground flex h-full min-h-[60px] items-center justify-center text-sm">
          등록된 이벤트가 없습니다.
        </div>
      </DashboardCardWrapper>
    );
  }

  return (
    <DashboardCardWrapper
      title="최근 이벤트"
      icon={CalendarDays}
      href="/events"
    >
      <div className="space-y-2">
        <h3 className="font-medium">{data.title}</h3>
        <p className="text-muted-foreground line-clamp-2 text-sm">
          {data.description}
        </p>
        <p className="text-muted-foreground text-sm">
          시작일: {data.startDate}
        </p>
      </div>
    </DashboardCardWrapper>
  );
}

export const RecentEventCard = withAsyncBoundary(EventCard, {
  loadingFallback: <CardSkeleton title="최근 이벤트" icon={CalendarDays} />,
  errorFallback: <CardError title="최근 이벤트" />,
});

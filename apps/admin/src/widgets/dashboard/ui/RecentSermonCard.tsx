import { Video } from 'lucide-react';
import { DashboardCardWrapper } from './dashboard-card-wrapper';
import { getLatestSermon } from '@/entities/sermon';
import { withAsyncBoundary } from '@/shared/lib';
import { CardSkeleton } from './CardSkeleton';
import { CardError } from './CardError';

async function SermonCard() {
  const data = await getLatestSermon();

  return (
    <DashboardCardWrapper title="최근 설교" icon={Video} href="/sermons">
      <div className="space-y-2">
        <h3 className="font-medium">{data.title}</h3>
        <p className="text-muted-foreground text-sm">
          {data.preacher} • {data.date}
        </p>
      </div>
    </DashboardCardWrapper>
  );
}

export const RecentSermonCard = withAsyncBoundary(SermonCard, {
  loadingFallback: <CardSkeleton title="최근 설교" icon={Video} />,
  errorFallback: <CardError title="최근 설교" />,
});

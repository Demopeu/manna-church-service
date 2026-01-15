import { Megaphone } from 'lucide-react';
import { DashboardCardWrapper } from './dashboard-card-wrapper';
import { getLatestAnnouncement } from '@/entities/announcement';
import { AnnouncementsItem } from './AnnouncementsItem';
import { withAsyncBoundary } from '@/shared/lib';
import { CardSkeleton } from './CardSkeleton';
import { CardError } from './CardError';

export async function AnnouncementsCard() {
  const data = await getLatestAnnouncement();
  return (
    <DashboardCardWrapper
      title="최근 공지"
      icon={Megaphone}
      href="/announcements"
    >
      <div className="space-y-2">
        {data.map((item) => (
          <AnnouncementsItem key={item.id} {...item} />
        ))}
      </div>
    </DashboardCardWrapper>
  );
}
export const RecentAnnouncementsCard = withAsyncBoundary(AnnouncementsCard, {
  loadingFallback: <CardSkeleton title="최근 공지" icon={Megaphone} />,
  errorFallback: <CardError title="최근 공지" />,
});

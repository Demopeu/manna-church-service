import { Megaphone } from 'lucide-react';
import { getLatestAnnouncement } from '@/entities/announcement';
import { withAsyncBoundary } from '@/shared/ui';
import { CardError } from './CardError';
import { CardSkeleton } from './CardSkeleton';
import { DashboardCardWrapper } from './dashboard-card-wrapper';

async function AnnouncementCard() {
  const data = await getLatestAnnouncement();

  if (!data) {
    return (
      <DashboardCardWrapper
        title="최근 공지"
        icon={Megaphone}
        href="/announcements"
      >
        <div className="text-muted-foreground flex h-full min-h-[60px] items-center justify-center text-sm">
          등록된 공지가 없습니다.
        </div>
      </DashboardCardWrapper>
    );
  }

  return (
    <DashboardCardWrapper
      title="최근 공지"
      icon={Megaphone}
      href="/announcements"
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {data.isUrgent && (
            <span className="bg-destructive/10 text-destructive inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium">
              긴급
            </span>
          )}
          <h3 className="font-medium">{data.title}</h3>
        </div>
        <p className="text-muted-foreground line-clamp-2 text-sm">
          {data.content}
        </p>
      </div>
    </DashboardCardWrapper>
  );
}

export const RecentAnnouncementCard = withAsyncBoundary(AnnouncementCard, {
  loadingFallback: <CardSkeleton title="최근 공지" icon={Megaphone} />,
  errorFallback: <CardError title="최근 공지" />,
});

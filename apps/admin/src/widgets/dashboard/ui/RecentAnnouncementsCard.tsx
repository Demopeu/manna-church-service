import { Megaphone } from 'lucide-react';
import { DashboardCardWrapper } from './dashboard-card-wrapper';

export async function RecentAnnouncementsCard() {
  return (
    <DashboardCardWrapper
      title="최근 공지"
      icon={Megaphone}
      href="/announcements"
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="bg-destructive/10 text-destructive inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium">
            긴급
          </span>
          <h3 className="truncate font-medium">신년 특별 기도회 안내</h3>
        </div>
        <p className="text-muted-foreground line-clamp-2 text-sm">
          2024년 신년 특별 기도회가...
        </p>
      </div>
    </DashboardCardWrapper>
  );
}

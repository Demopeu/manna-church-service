import { Megaphone } from 'lucide-react';
import { DashboardCardWrapper } from './dashboard-card-wrapper';

export async function RecentEventsCard() {
  return (
    <DashboardCardWrapper title="최근 공지" icon={Megaphone} href="/events">
      <div className="space-y-2">
        <h3 className="font-medium">신년 감사 캠페인</h3>
        <p className="text-muted-foreground text-sm">2024.01.01 ~ 2024.01.31</p>
      </div>
    </DashboardCardWrapper>
  );
}

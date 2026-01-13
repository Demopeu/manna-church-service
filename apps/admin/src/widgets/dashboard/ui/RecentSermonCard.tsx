import { Video } from 'lucide-react';
import { DashboardCardWrapper } from './dashboard-card-wrapper';

export async function RecentSermonCard() {
  // const data = await getLatestSermon();

  return (
    <DashboardCardWrapper title="최근 설교" icon={Video} href="/sermons">
      <div className="space-y-2">
        <h3 className="font-medium">은혜의 능력</h3>
        <p className="text-muted-foreground text-sm">김목사 • 2024년 1월 7일</p>
      </div>
    </DashboardCardWrapper>
  );
}

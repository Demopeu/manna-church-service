import { LucideIcon } from 'lucide-react';
import { DashboardCardWrapper } from './dashboard-card-wrapper';

interface Props {
  title: string;
  icon: LucideIcon;
}
export function CardSkeleton({ title, icon }: Props) {
  return (
    <DashboardCardWrapper title={title} icon={icon} href="#">
      <div className="animate-pulse space-y-2">
        <div className="bg-muted/50 h-5 w-3/4 rounded" />
        <div className="bg-muted/30 h-4 w-1/2 rounded" />
      </div>
    </DashboardCardWrapper>
  );
}

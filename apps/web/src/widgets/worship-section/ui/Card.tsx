import { cn } from '@repo/ui/lib';
import type { WorshipItem } from './data';
import { type AccentColor, cardBorderColorMap, iconColorMap } from './mapper';

interface WorshipCardProps {
  item: WorshipItem;
  featured?: boolean;
  accentColor?: AccentColor;
}

function DayBadge({ days }: { days: string }) {
  return (
    <span className="bg-manna-mint/20 text-manna-dark-blue inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium">
      {days}
    </span>
  );
}

export function WorshipCard({ item, featured, accentColor }: WorshipCardProps) {
  const Icon = item.icon;

  return (
    <div
      className={cn(
        'bg-card border-border/50 rounded-xl border p-5 shadow-sm transition-all hover:shadow-md',
        featured && 'border-l-4',
        featured && accentColor && cardBorderColorMap[accentColor],
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
              featured ? 'bg-manna-dark-blue/10' : 'bg-manna-mint/15',
            )}
          >
            <Icon
              className={cn(
                'h-5 w-5',
                item.iconColor && iconColorMap[item.iconColor],
              )}
            />
          </div>
          <div>
            <h4 className="text-foreground font-semibold">{item.name}</h4>
            {item.days && (
              <div className="mt-1">
                <DayBadge days={item.days} />
              </div>
            )}
          </div>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-manna-dark-blue text-xl font-bold">{item.time}</p>
          <p className="text-muted-foreground text-sm">{item.location}</p>
        </div>
      </div>
    </div>
  );
}

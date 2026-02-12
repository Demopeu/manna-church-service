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
    <span className="bg-manna-mint/20 text-manna-dark-blue inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium">
      {days}
    </span>
  );
}

export function WorshipCard({ item, featured, accentColor }: WorshipCardProps) {
  const Icon = item.icon;

  return (
    <div
      className={cn(
        'bg-card border-border/50 flex flex-wrap items-center rounded-xl border p-5 shadow-sm transition-all hover:shadow-md md:flex-nowrap md:gap-6',
        featured && 'border-l-4',
        featured && accentColor && cardBorderColorMap[accentColor],
      )}
    >
      <div className="order-1 flex shrink-0 items-center gap-3">
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
          <div className="flex flex-col items-start md:flex-row md:items-center md:gap-2">
            <h3 className="text-foreground font-semibold whitespace-nowrap">
              {item.name}
            </h3>
            {item.days && (
              <div className="mt-1 md:mt-0">
                <DayBadge days={item.days} />
              </div>
            )}
          </div>
        </div>
      </div>

      {item.information && (
        <div className="order-3 mt-4 w-full md:order-2 md:mt-0 md:w-auto md:flex-1 md:px-4">
          <p className="text-korean-pretty text-muted-foreground text-sm leading-relaxed md:line-clamp-2 md:text-start">
            {item.information}
          </p>
        </div>
      )}

      <div className="order-2 ml-auto shrink-0 text-right md:order-3 md:ml-0">
        <p className="text-manna-dark-blue text-xl font-bold">{item.time}</p>
        <p className="text-muted-foreground text-sm">{item.location}</p>
      </div>
    </div>
  );
}

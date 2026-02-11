import { cn } from '@repo/ui/lib';
import { WorshipCard } from './Card';
import { WorshipCategory } from './data';
import { titleBorderColorMap, titleTextColorMap } from './mapper';

interface Props {
  data: WorshipCategory;
}

export function WorshipSection({ data }: Props) {
  const { title, items, featured, accentColor } = data;

  return (
    <section>
      <h2
        className={cn(
          'mb-4 border-b-2 pb-2 text-2xl font-bold',
          accentColor && titleBorderColorMap[accentColor],
          accentColor && titleTextColorMap[accentColor],
        )}
      >
        {title}
      </h2>
      <div className="grid gap-4">
        {items.map((item, index) => (
          <WorshipCard
            key={`${item.name}-${index}`}
            item={item}
            featured={featured}
            accentColor={accentColor}
          />
        ))}
      </div>
    </section>
  );
}

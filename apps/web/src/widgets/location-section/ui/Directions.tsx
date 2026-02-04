import { cn } from '@repo/ui/lib';
import { transportData } from './data';

export function Directions() {
  return (
    <section className="space-y-4">
      <h2 className="text-foreground text-2xl font-bold">교통 안내</h2>

      <div className="grid gap-4 md:grid-cols-3">
        {transportData.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.type}
              className="bg-card border-border/50 rounded-2xl border p-5 shadow-sm"
            >
              <div className="mb-4 flex items-center gap-3">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full',
                    item.theme.bg,
                  )}
                >
                  <Icon className={cn('h-5 w-5', item.theme.text)} />
                </div>
                <h3 className="text-foreground text-korean-pretty font-semibold">
                  {item.title}
                </h3>
              </div>

              <ul className="text-foreground/80 text-korean-pretty space-y-2 text-sm">
                {item.details.map((detail, index) => (
                  <li key={index} className="flex gap-2">
                    <span className={item.theme.text}>•</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}

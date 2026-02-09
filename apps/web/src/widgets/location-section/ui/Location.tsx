import { cn } from '@repo/ui/lib';
import { Button } from '@/shared/ui';
import { LocationMap } from './Map';
import { mapLinks } from './data';

export function LocationSection() {
  return (
    <section className="space-y-4">
      <LocationMap />

      <div className="flex flex-wrap justify-center gap-3">
        {mapLinks.map((link) => {
          const Icon = link.icon;

          return (
            <Button
              key={link.id}
              variant="outline"
              asChild
              className={cn(
                'h-11 rounded-xl border px-5 font-semibold shadow-sm transition-all hover:-translate-y-0.5',
                link.style.className,
              )}
            >
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                <span>{link.name}</span>
              </a>
            </Button>
          );
        })}
      </div>
    </section>
  );
}

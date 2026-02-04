import { menuData } from '@/shared/config';
import { NavLink } from './NavLink';

export function AboutSidebar() {
  const groups = Object.entries(menuData);

  return (
    <aside className="hidden w-64 shrink-0 lg:block">
      <nav className="sticky top-8">
        <div className="bg-card border-border/50 space-y-6 rounded-2xl border p-5 shadow-lg">
          {groups.map(([category, items], groupIndex) => (
            <div key={category}>
              <h3 className="text-muted-foreground/60 mb-3 px-3 text-xs font-medium tracking-wider uppercase">
                {category}
              </h3>

              <div className="space-y-1">
                {items.map((item) => (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    title={item.title}
                    icon={item.icon}
                  />
                ))}
              </div>

              {groupIndex < groups.length - 1 && (
                <div className="border-border/50 mt-5 border-t" />
              )}
            </div>
          ))}
        </div>
      </nav>
    </aside>
  );
}

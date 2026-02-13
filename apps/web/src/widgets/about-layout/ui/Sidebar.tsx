import { Suspense } from 'react';
import { menuData } from '@/shared/config';
import { NavLink, NavLinkSkeleton } from './NavLink';

export function AboutSidebar() {
  const groups = Object.entries(menuData);

  return (
    <aside className="hidden w-64 shrink-0 lg:block">
      <nav className="sticky top-8">
        <div className="bg-card border-border space-y-6 rounded-2xl border p-5 shadow-lg">
          {groups.map(([category, items], groupIndex) => (
            <div key={category}>
              <p className="text-muted-foreground mb-3 px-3 text-xs font-medium tracking-wider uppercase">
                {category}
              </p>

              <div className="space-y-1">
                <Suspense
                  fallback={
                    <>
                      {[...Array(10)].map((_, i) => (
                        <NavLinkSkeleton key={i} />
                      ))}
                    </>
                  }
                >
                  {items.map((item) => (
                    <NavLink
                      key={item.href}
                      href={item.href}
                      title={item.title}
                      icon={item.icon}
                    />
                  ))}
                </Suspense>
              </div>

              {groupIndex < groups.length - 1 && (
                <div className="border-border mt-5 border-t" />
              )}
            </div>
          ))}
        </div>
      </nav>
    </aside>
  );
}

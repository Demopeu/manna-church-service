'use client';

import Link from 'next/link';
import { ADMIN_ROUTES } from '@/shared/config';
import { cn } from '@repo/ui/lib';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/widgets/main-sidebar';

export function Nav() {
  const pathname = usePathname();
  const { close } = useSidebar();

  return (
    <nav className="flex-1 space-y-1 p-4">
      {ADMIN_ROUTES.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== '/' && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={close}
            className={cn(
              'flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-colors',
              isActive
                ? 'bg-sidebar-accent text-sidebar-primary'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50',
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

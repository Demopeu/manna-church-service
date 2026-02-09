'use client';

import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { LogoutDropdownItem } from '@/features/auth';
import { ADMIN_ROUTES } from '@/shared/config';
import { Button } from '@/shared/ui';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/shared/ui';
import { useSidebar } from '../model/context';

interface Props {
  profileSlot: React.ReactNode;
}

export function HeaderClient({ profileSlot }: Props) {
  const pathname = usePathname();
  const { open } = useSidebar();
  const route = ADMIN_ROUTES.find((route) => route.href === pathname);
  return (
    <header className="border-border bg-card flex h-16 items-center justify-between border-b px-4 md:px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={open}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-foreground truncate text-xl font-semibold">
          {route?.label}
        </h1>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-2 focus-visible:ring-0"
            suppressHydrationWarning
          >
            {profileSlot}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <LogoutDropdownItem />
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

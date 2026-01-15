'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/shared/ui';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/shared/ui';
import { useSidebar } from '@/widgets/main-sidebar';
import { LogoutDropdownItem } from '@/features/auth';
import { HeaderProfile } from '@/entities/user';

interface Props {
  pageTitle: string;
}

export function Header({ pageTitle }: Props) {
  const { open } = useSidebar();
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
          {pageTitle}
        </h1>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-2 focus-visible:ring-0"
          >
            <HeaderProfile />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <LogoutDropdownItem />
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

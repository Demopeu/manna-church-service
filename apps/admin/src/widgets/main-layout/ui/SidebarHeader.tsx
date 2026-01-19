'use client';

import Link from 'next/link';
import { X } from 'lucide-react';
import { Church } from 'lucide-react';
import { Button } from '@/shared/ui';
import { useSidebar } from '../model/context';

export function SidebarHeader() {
  const { close } = useSidebar();
  return (
    <div className="border-sidebar-border flex h-16 items-center justify-between border-b px-4">
      <Link href="/" className="flex items-center gap-2">
        <Church className="text-primary h-7 w-7" />
        <span className="text-sidebar-foreground text-lg font-bold">
          만나교회
        </span>
      </Link>
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={close}>
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
}

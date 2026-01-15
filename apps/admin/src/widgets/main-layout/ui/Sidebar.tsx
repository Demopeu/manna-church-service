'use client';

import { cn } from '@repo/ui/lib';
import { SidebarHeader } from './SidebarHeader';
import { SidebarNav } from './SidebarNav';
import { SidebarFooter } from './SidebarFooter';
import { useSidebar } from '../model/context';

export function Sidebar() {
  const { isOpen, close } = useSidebar();
  return (
    <>
      {isOpen && (
        <div
          className="bg-foreground/20 fixed inset-0 z-40 lg:hidden"
          onClick={() => close()}
        />
      )}
      <aside
        className={cn(
          'bg-sidebar border-sidebar-border fixed inset-y-0 left-0 z-50 w-64 border-r transition-transform duration-200 ease-in-out lg:static',
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-full flex-col">
          <SidebarHeader />
          <SidebarNav />
          <SidebarFooter />
        </div>
      </aside>
    </>
  );
}

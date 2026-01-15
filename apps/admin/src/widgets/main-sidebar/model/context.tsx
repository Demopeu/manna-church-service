'use client';

import { createContext, useState, use } from 'react';

interface SidebarContextType {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  open: () => void;
}

interface SidebarProviderProps {
  children: React.ReactNode;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const value = {
    isOpen,
    toggle: () => setIsOpen((prev) => !prev),
    close: () => setIsOpen(false),
    open: () => setIsOpen(true),
  };

  return <SidebarContext value={value}>{children}</SidebarContext>;
}

export function useSidebar() {
  const context = use(SidebarContext);

  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }

  return context;
}

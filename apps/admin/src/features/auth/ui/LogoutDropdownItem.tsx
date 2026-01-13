'use client';

import { LogOut } from 'lucide-react';
import { DropdownMenuItem } from '@/shared/ui';
import { useLogout } from '../model/use-logout';

export function LogoutDropdownItem() {
  const { logout } = useLogout();

  return (
    <DropdownMenuItem
      onClick={logout}
      className="text-destructive focus:text-destructive cursor-pointer"
    >
      <LogOut className="mr-2 h-4 w-4" />
      로그아웃
    </DropdownMenuItem>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type LucideIcon } from 'lucide-react';
import {
  Bell,
  BookOpen,
  Calendar,
  Church,
  Heart,
  HelpCircle,
  ImageIcon,
  MapPin,
  Plane,
  Users,
  Video,
} from 'lucide-react';
import { cn } from '@repo/ui/lib';

interface Props {
  href: string;
  title: string;
  icon: string;
}

const IconMap: Record<string, LucideIcon> = {
  Church,
  MapPin,
  BookOpen,
  Calendar,
  Users,
  Video,
  Plane,
  Bell,
  Heart,
  ImageIcon,
};

export function NavLink({ href, title, icon }: Props) {
  const pathname = usePathname();
  const isActive = pathname === href;
  const Icon = IconMap[icon] || HelpCircle;

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
        isActive
          ? 'bg-manna-mint/15 text-manna-dark-blue'
          : 'text-foreground/70 hover:bg-manna-mint/10 hover:text-manna-dark-blue',
      )}
    >
      <Icon
        className={cn(
          'h-[18px] w-[18px] shrink-0 transition-colors',
          isActive ? 'text-manna-dark-blue' : 'text-muted-foreground',
        )}
      />
      <span>{title}</span>
    </Link>
  );
}

export function NavLinkSkeleton() {
  return (
    <div
      className={cn(
        'flex animate-pulse items-center gap-3 rounded-xl px-3 py-2.5',
      )}
    >
      <div className="bg-muted/20 h-[18px] w-[18px] shrink-0 rounded" />
      <div className="bg-muted/20 h-4 w-24 rounded" />
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, Menu, Phone } from 'lucide-react';
import { menuData } from '@/shared/config';
import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui';

interface Props {
  address: string;
  phone: string;
}

export function MobileMenu({ address, phone }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-gray-600 lg:hidden">
          <Menu className="h-10 w-10" />
          <span className="sr-only">메뉴 열기</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-3/5! overflow-y-auto md:w-1/3!">
        <SheetHeader>
          <SheetTitle className="sr-only">만나교회</SheetTitle>
          <SheetDescription className="sr-only">
            모바일 메뉴 탐색 및 교회 연락처 정보입니다.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-6">
          {Object.entries(menuData).map(([title, items]) => (
            <div key={title}>
              <div className="mb-2 ml-4 text-xl font-medium text-gray-700">
                {title}
              </div>

              <div className="flex flex-col gap-2 pl-8">
                {items.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="hover:text-manna py-2 text-base text-gray-500 transition-colors"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 w-full border-t border-gray-100 bg-gray-50 p-6 text-xs text-gray-500">
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
              <span>{address}</span>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-gray-400" />
              <span>{phone}</span>
            </div>

            <div className="mt-2 text-[10px] text-gray-400">
              © 2026 Manna Church. All rights reserved.
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

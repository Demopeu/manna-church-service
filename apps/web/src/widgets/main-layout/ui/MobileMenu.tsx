'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, Menu, Phone } from 'lucide-react';
import { menuData } from '@/shared/config';
import { churchData } from '@/shared/config';
import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui';

export function MobileMenu() {
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
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-600 lg:hidden [&_svg:not([class*='size-'])]:size-6"
        >
          <Menu />
          <span className="sr-only">메뉴 열기</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="h-dvh w-3/5! overflow-y-auto p-0 md:w-1/3!"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>만나교회</SheetTitle>
          <SheetDescription>
            모바일 메뉴 탐색 및 교회 연락처 정보입니다.
          </SheetDescription>
        </SheetHeader>

        <div className="flex min-h-dvh flex-col">
          <div className="p-6 pb-0"></div>

          <div className="flex-1 px-6 py-6">
            <div className="flex flex-col gap-6">
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
                        aria-label={`${item.title} 페이지로 이동`}
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 bg-gray-50 p-6 text-xs text-gray-500">
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
                <span>{churchData.address.fullAddress}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-gray-400" />
                <span>{churchData.contact.phone}</span>
              </div>

              <div className="mt-2 text-[10px] text-gray-400">
                © 2026 {churchData.copyright} All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

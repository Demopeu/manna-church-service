import Link from 'next/link';
import { MapPin, Menu, Phone } from 'lucide-react';
import {
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui';
import { menuData } from './data';

interface Props {
  address: string;
  phone: string;
}

export function MobileMenu({ address, phone }: Props) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-gray-600 lg:hidden">
          <Menu className="h-10 w-10" />
          <span className="sr-only">메뉴 열기</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-3/5! overflow-y-auto md:w-1/3!">
        <SheetHeader>
          <SheetTitle className="sr-only">만나교회</SheetTitle>
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
                    className="hover:text-manna py-2 text-base text-gray-500 transition-colors"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="absolute bottom-0 w-full border-t border-gray-100 bg-gray-50 p-6 text-xs text-gray-500">
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

import Image from 'next/image';
import { MapPin, Phone } from 'lucide-react';
import { churchData } from '@/shared/config';

export function MainFooter() {
  const { title, address, copyright, phone } = churchData;
  return (
    <footer className="bg-slate-800 py-8 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="logo" width={32} height={32} />
            <span className="text-lg font-bold">{title}</span>
          </div>

          <div className="flex flex-col items-center gap-4 text-sm text-slate-300 md:flex-row">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>TEL: {phone}</span>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            ©{copyright}. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}

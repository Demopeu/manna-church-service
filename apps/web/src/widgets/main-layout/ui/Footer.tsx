import Image from 'next/image';
import { MapPin, Phone, User } from 'lucide-react';
import { churchData } from '@/shared/config';
import { PolicyDialog } from './PolicyDialog';
import { PrivacyDialog } from './PrivacyDialog';

export function MainFooter() {
  const { name, address, copyright, contact, leader } = churchData;
  const displayPhone = churchData.contact?.smartCall || contact.phone;

  return (
    <footer className="bg-slate-800 py-8 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="만나교회 로고" width={32} height={32} />
            <span className="text-lg font-bold">{name}</span>
          </div>

          <address className="text-korean-pretty flex flex-col items-center gap-4 text-sm text-slate-300 not-italic md:flex-row">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{address.fullAddress}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 shrink-0 text-slate-400" />
              <span>
                {leader.role}: {leader.name}
              </span>
            </div>

            <a
              href={`tel:${displayPhone}`}
              className="group flex items-center gap-2 transition-colors hover:text-white"
              aria-label="교회 전화 걸기"
            >
              <Phone className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-white" />
              <span>TEL: {contact.phone}</span>
            </a>
          </address>

          <div className="flex flex-col items-center gap-1">
            <p className="text-xs text-slate-500">
              ©{copyright}. ALL RIGHTS RESERVED.
            </p>
            <div className="flex items-center gap-3">
              <PolicyDialog />
              <span className="text-slate-600">|</span>
              <PrivacyDialog />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

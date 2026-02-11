import { MapPin, Phone } from 'lucide-react';
import { churchData } from '@/shared/config';

export function AddressSection() {
  const { address, contact } = churchData;
  return (
    <section className="bg-card border-border/50 rounded-2xl border p-6 shadow-sm">
      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="flex items-start gap-3">
          <div className="bg-manna-mint/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
            <MapPin className="text-manna-dark-blue h-5 w-5" />
          </div>
          <div>
            <p className="text-muted-foreground mb-1 text-base">주소</p>
            <p className="text-foreground font-medium">{address.fullAddress}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="bg-manna-mint/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
            <Phone className="text-manna-dark-blue h-5 w-5" />
          </div>
          <div>
            <p className="text-muted-foreground mb-1 text-base">전화번호</p>
            <p className="text-foreground font-medium">{contact.phone}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

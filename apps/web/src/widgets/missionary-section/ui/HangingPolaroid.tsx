import Image from 'next/image';
import { Globe, User } from 'lucide-react';

interface HangingPolaroidProps {
  name: string;
  country: string;
  imageUrl: string | null;
  index: number;
}

const swayVariants = [
  { from: '-3deg', to: '3deg', delay: '0s' },
  { from: '-2deg', to: '4deg', delay: '0.4s' },
  { from: '-4deg', to: '2deg', delay: '0.8s' },
  { from: '-2.5deg', to: '3.5deg', delay: '1.2s' },
  { from: '-3.5deg', to: '2.5deg', delay: '0.2s' },
  { from: '-1.5deg', to: '4.5deg', delay: '0.6s' },
];

export function HangingPolaroid({
  name,
  country,
  imageUrl,
  index,
}: HangingPolaroidProps) {
  const variant = swayVariants[index % swayVariants.length]!;

  return (
    <div
      className="group flex flex-col items-center"
      style={
        {
          '--sway-from': variant.from,
          '--sway-to': variant.to,
        } as React.CSSProperties
      }
    >
      <div className="bg-border h-8 w-px sm:h-12" />
      <div
        className="animate-sway hover:paused relative min-w-50 origin-top cursor-default bg-white p-2 pb-8 shadow-lg transition-shadow hover:shadow-2xl sm:min-w-60 sm:p-3 sm:pb-10"
        style={{ animationDelay: variant.delay }}
      >
        <div className="absolute -top-1.5 left-1/2 z-10 h-4 w-4 -translate-x-1/2 rounded-full bg-red-400 shadow-md" />
        <div className="bg-muted relative aspect-square w-full overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={`${name} 선교사 (${country}) 프로필 사진`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 40vw, (max-width: 1024px) 28vw, 20vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-slate-100 to-slate-200">
              <User className="h-10 w-10 text-slate-300" />
            </div>
          )}
        </div>
        <div className="pt-2 text-center sm:pt-3">
          <p className="text-xl font-bold text-gray-800 sm:text-2xl">{name}</p>
          <p className="sm:text-md mt-0.5 flex items-center justify-center gap-1 text-sm text-gray-500">
            <Globe className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            <span>{country}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

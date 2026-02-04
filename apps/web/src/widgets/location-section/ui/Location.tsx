import { MapPin } from 'lucide-react';
import { cn } from '@repo/ui/lib';
import { Button } from '@/shared/ui';
import { mapLinks } from './data';

export function LocationSection() {
  return (
    <section className="space-y-4">
      <div className="bg-muted relative flex h-[300px] flex-col items-center justify-center gap-4 rounded-2xl shadow-md sm:h-[400px]">
        <div className="bg-manna-mint/20 flex h-16 w-16 items-center justify-center rounded-full">
          <MapPin className="text-manna-dark-blue h-8 w-8" />
        </div>
        <p className="text-muted-foreground font-medium">
          Naver / Kakao Map Area
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {mapLinks.map((link) => {
          // 여기서 아이콘을 꺼냅니다.
          const Icon = link.icon;

          return (
            <Button
              key={link.id}
              variant="outline"
              asChild
              className={cn(
                'h-11 rounded-xl border px-5 font-semibold shadow-sm transition-all hover:-translate-y-0.5',
                link.style.className, // 브랜드 컬러 적용
              )}
            >
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                {/* SVG 아이콘 렌더링 (크기는 h-4 w-4 정도가 적당) */}
                <Icon className="h-4 w-4" />
                <span>{link.name}</span>
              </a>
            </Button>
          );
        })}
      </div>
    </section>
  );
}

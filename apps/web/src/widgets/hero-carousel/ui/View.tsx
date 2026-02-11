'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@repo/ui/lib';
import type { Banner } from '@/entities/banner';
import { Button, Carousel, CarouselContent, CarouselItem } from '@/shared/ui';
import { DEFAULT_BANNER } from '../const/banner';
import { useCarousel } from '../model/use-carousel';

interface Props {
  banners: Banner[];
}

export function HeroCarouselView({ banners }: Props) {
  const { setApi, plugin, current, count, scrollPrev, scrollNext, scrollTo } =
    useCarousel({ autoplayDelay: 5000 });

  const displayBanners = banners.length > 0 ? banners : DEFAULT_BANNER;

  return (
    <section className="relative w-full">
      <Carousel
        setApi={setApi}
        plugins={[plugin]}
        className="w-full"
        opts={{
          align: 'start',
          loop: true,
        }}
      >
        <CarouselContent>
          {displayBanners.map((banner, index) => (
            <CarouselItem key={banner.id}>
              <div className="sm-[300px] relative mx-auto h-[200px] w-full md:h-[400px] lg:h-[700px]">
                <Image
                  src={banner.imageUrl}
                  alt={`만나교회 배너 - ${banner.title}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1/2 left-4 hidden h-10 w-10 -translate-y-1/2 rounded-full bg-white/20 text-white hover:bg-white/40 md:flex"
          onClick={scrollPrev}
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="sr-only">이전</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1/2 right-4 hidden h-10 w-10 -translate-y-1/2 rounded-full bg-white/20 text-white hover:bg-white/40 md:flex"
          onClick={scrollNext}
        >
          <ChevronRight className="h-6 w-6" />
          <span className="sr-only">다음</span>
        </Button>
      </Carousel>
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            type="button"
            className={cn(
              'h-2 w-2 rounded-full transition-all',
              current === index ? 'w-6 bg-white' : 'bg-white/50',
            )}
            onClick={() => scrollTo(index)}
          >
            <span className="sr-only">슬라이드 {index + 1}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

import Image from 'next/image';
import DEFAULT_BANNER from '@/app/asset/default/DEFAULT_BANNER1.webp';
import { getBanners } from '@/entities/banner';
import { withAsyncBoundary } from '@/shared/ui';
import { HeroCarouselView } from './View';

async function HeroCarouselBase() {
  const banners = await getBanners();
  return <HeroCarouselView banners={banners} />;
}

export function HeroCarouselPlaceholder() {
  return (
    <section className="relative w-full">
      <div className="w-full overflow-hidden">
        <div className="relative mx-auto h-[200px] w-full md:h-[400px] lg:h-[700px]">
          <Image
            src={DEFAULT_BANNER}
            alt="만나교회 메인 배너 이미지"
            fill
            className="object-cover"
            priority
            unoptimized
          />
        </div>
      </div>
    </section>
  );
}

export const HeroCarousel = withAsyncBoundary(HeroCarouselBase, {
  loadingFallback: <HeroCarouselPlaceholder />,
  errorFallback: <HeroCarouselPlaceholder />,
});

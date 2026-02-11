import Image from 'next/image';
import { getBanners } from '@/entities/banner';
import { withAsyncBoundary } from '@/shared/ui';
import { DEFAULT_BANNER } from '../const/banner';
import { HeroCarouselView } from './View';

async function HeroCarouselBase() {
  const banners = await getBanners();
  return <HeroCarouselView banners={banners} />;
}

export function HeroCarouselPlaceholder() {
  const banner = DEFAULT_BANNER[0];

  return (
    <section className="relative w-full">
      <div className="w-full overflow-hidden">
        <div className="relative mx-auto h-[200px] w-full md:h-[400px] lg:h-[700px]">
          <Image
            src={banner!.imageUrl}
            alt="만나교회 메인 배너 이미지"
            fill
            className="object-cover"
            priority
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

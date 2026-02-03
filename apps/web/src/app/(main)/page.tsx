import { HeroCarousel } from '@/widgets/hero-carousel';
import { getBanners } from '@/entities/banner';

export default async function Home() {
  const { banners } = await getBanners();
  return (
    <main className="flex-1">
      <HeroCarousel banners={banners} />
    </main>
  );
}

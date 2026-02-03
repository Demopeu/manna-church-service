import { HeroCarousel } from '@/widgets/hero-carousel';
import { QuickMenu, YoutubeImageBox } from '@/widgets/quick-menu';
import { getBanners } from '@/entities/banner';
import { getLatestSermon } from '@/entities/sermon/api/queries';

export default async function Home() {
  const banners = await getBanners();
  const sermon = await getLatestSermon();

  return (
    <main className="flex-1">
      <HeroCarousel banners={banners} />
      <QuickMenu />
      <section className="bg-church-blue/5 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-2">
            <YoutubeImageBox sermon={sermon} />
          </div>
        </div>
      </section>
    </main>
  );
}

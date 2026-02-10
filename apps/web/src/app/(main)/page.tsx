import { AnnouncementsSection } from '@/widgets/announcements-section';
import { EventsMarquee } from '@/widgets/events-section';
import { GallerySection } from '@/widgets/gallery-section';
import { HeroCarousel } from '@/widgets/hero-carousel';
import { QuickMenu, YoutubeImageBox } from '@/widgets/quick-menu';
import { SectionWrapper } from '@/shared/ui';

export default async function Home() {
  return (
    <main className="flex-1">
      <HeroCarousel />
      <QuickMenu />
      <SectionWrapper>
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto grid gap-8 lg:grid-cols-2">
            <YoutubeImageBox />
            <AnnouncementsSection />
          </div>
        </div>
      </SectionWrapper>
      <EventsMarquee />
      <GallerySection />
    </main>
  );
}

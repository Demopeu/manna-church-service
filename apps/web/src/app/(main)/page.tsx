import { AnnouncementsSection } from '@/widgets/announcements-section';
import { EventsMarquee } from '@/widgets/events-section';
import { GallerySection } from '@/widgets/gallery-section';
import { HeroCarousel } from '@/widgets/hero-carousel';
import { QuickMenu, YoutubeImageBox } from '@/widgets/quick-menu';
import { getRecentAnnouncements } from '@/entities/announcement/api/queries';
import { getBanners } from '@/entities/banner';
import { getRecentEvents } from '@/entities/event/api/queries';
import { getRecentGalleries } from '@/entities/gallery/api/queries';
import { getLatestSermon } from '@/entities/sermon/api/queries';
import { SectionWrapper } from '@/shared/ui';

export default async function Home() {
  const [banners, sermon, announcements, events, recentGalleries] =
    await Promise.all([
      getBanners(),
      getLatestSermon(),
      getRecentAnnouncements(),
      getRecentEvents(),
      getRecentGalleries(),
    ]);

  return (
    <main className="flex-1">
      <HeroCarousel banners={banners} />
      <QuickMenu />
      <SectionWrapper>
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto grid gap-8 lg:grid-cols-2">
            <YoutubeImageBox sermon={sermon} />
            <AnnouncementsSection announcements={announcements} />
          </div>
        </div>
      </SectionWrapper>
      <EventsMarquee events={events} />
      <GallerySection galleries={recentGalleries} />
    </main>
  );
}

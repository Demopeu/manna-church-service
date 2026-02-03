import { AnnouncementsSection } from '@/widgets/announcements-section';
import { EventsMarquee } from '@/widgets/events-Marquee';
import { HeroCarousel } from '@/widgets/hero-carousel';
import { QuickMenu, YoutubeImageBox } from '@/widgets/quick-menu';
import { getRecentAnnouncements } from '@/entities/announcement/api/queries';
import { getBanners } from '@/entities/banner';
import { getRecentEvents } from '@/entities/event/api/queries';
import { getLatestSermon } from '@/entities/sermon/api/queries';

export default async function Home() {
  const [banners, sermon, announcements, events] = await Promise.all([
    getBanners(),
    getLatestSermon(),
    getRecentAnnouncements(),
    getRecentEvents(),
  ]);

  return (
    <main className="flex-1">
      <HeroCarousel banners={banners} />
      <QuickMenu />
      <section className="bg-church-blue/5 py-12 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto grid gap-8 lg:grid-cols-2">
            <YoutubeImageBox sermon={sermon} />
            <AnnouncementsSection announcements={announcements} />
          </div>
        </div>
      </section>
      <EventsMarquee events={events} />
    </main>
  );
}

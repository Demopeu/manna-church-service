import {
  Date,
  BulletinTaskCard,
  RecentAnnouncementsCard,
  RecentEventsCard,
  RecentSermonCard,
  RecentGalleryCard,
} from '@/widgets/dashboard';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <Date />
      <BulletinTaskCard />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <RecentAnnouncementsCard />
        <RecentEventsCard />
        <RecentSermonCard />
      </div>
      <RecentGalleryCard />
    </div>
  );
}

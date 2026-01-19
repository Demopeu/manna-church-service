import {
  Date,
  RecentAnnouncementCard,
  RecentBulletinCard,
  RecentEventCard,
  RecentGalleryCard,
  RecentSermonCard,
} from '@/widgets/dashboard';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <Date />
      <RecentBulletinCard />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <RecentSermonCard />
        <RecentAnnouncementCard />
        <RecentEventCard />
      </div>
      <RecentGalleryCard />
    </div>
  );
}

import {
  Date,
  RecentBulletinCard,
  RecentAnnouncementsCard,
  RecentEventCard,
  RecentSermonCard,
  RecentGalleryCard,
} from '@/widgets/dashboard';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <Date />
      <RecentBulletinCard />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <RecentSermonCard />
        <RecentAnnouncementsCard />
        <RecentEventCard />
      </div>
      <RecentGalleryCard />
    </div>
  );
}

import { AnnouncementsList } from '@/widgets/announcements';
import { CreateAnnouncementButton } from '@/features/announcement';

export default function AnnouncementsPage() {
  return (
    <div className="space-y-6">
      <CreateAnnouncementButton />
      <AnnouncementsList />
    </div>
  );
}

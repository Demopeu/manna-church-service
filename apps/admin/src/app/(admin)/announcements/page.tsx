import { AnnouncementsList } from '@/widgets/announcement-list';
import { CreateAnnouncementButton } from '@/features/announcement';

export default function AnnouncementsPage() {
  return (
    <div className="space-y-6">
      <CreateAnnouncementButton />
      <AnnouncementsList />
    </div>
  );
}

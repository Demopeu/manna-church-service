import { notFound } from 'next/navigation';
import { AnnouncementDetail } from '@/widgets/announcements-section';
import { getAnnouncementById } from '@/entities/announcement/api/queries';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AnnouncementDetailPage({ params }: Props) {
  const { id } = await params;

  const announcement = await getAnnouncementById(id);

  if (!announcement) {
    notFound();
  }

  return <AnnouncementDetail announcement={announcement} />;
}

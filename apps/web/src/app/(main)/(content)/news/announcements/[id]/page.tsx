import { notFound } from 'next/navigation';
import { AnnouncementDetail } from '@/widgets/announcements-section';
import { getAnnouncementByShortId } from '@/entities/announcement';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AnnouncementDetailPage({ params }: Props) {
  const { id } = await params;
  const shortId = id.split('-').pop();

  if (!shortId) {
    notFound();
  }

  const announcement = await getAnnouncementByShortId(shortId);

  if (!announcement) {
    notFound();
  }

  return <AnnouncementDetail announcement={announcement} />;
}

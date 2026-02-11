import { notFound } from 'next/navigation';
import { AnnouncementDetail } from '@/widgets/announcements-section';
import { getRecentAnnouncementShortIds } from '@/entities/announcement';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return await getRecentAnnouncementShortIds();
}

export default async function AnnouncementDetailPage({ params }: Props) {
  const { id } = await params;
  const shortId = id.split('-').pop();

  if (!shortId) {
    notFound();
  }
  return <AnnouncementDetail shortId={shortId} />;
}

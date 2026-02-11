import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AnnouncementDetail } from '@/widgets/announcements-section';
import {
  getAnnouncementByShortId,
  getRecentAnnouncementShortIds,
} from '@/entities/announcement';
import { DEFAULT_OG_IMAGE } from '@/shared/config';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const shortId = id.split('-').pop();

  if (!shortId) {
    return { title: '공지사항을 찾을 수 없습니다' };
  }

  const announcement = await getAnnouncementByShortId(shortId);

  if (!announcement) {
    return { title: '공지사항을 찾을 수 없습니다' };
  }

  const plainText = announcement.content
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  const description =
    plainText.length > 160 ? `${plainText.slice(0, 157)}...` : plainText;

  return {
    title: announcement.title,
    description,
    openGraph: {
      title: announcement.title,
      description,
      images: [{ url: DEFAULT_OG_IMAGE }],
    },
  };
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

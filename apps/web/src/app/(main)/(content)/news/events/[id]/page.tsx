import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EventDetail } from '@/widgets/events-section';
import { getEventByShortId, getRecentEventShortIds } from '@/entities/event';
import { DEFAULT_OG_IMAGE } from '@/shared/config';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const shortId = id.split('-').pop();

  if (!shortId) {
    return { title: '이벤트를 찾을 수 없습니다' };
  }

  const event = await getEventByShortId(shortId);

  if (!event) {
    return { title: '이벤트를 찾을 수 없습니다' };
  }

  const plainText = event.description
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  const description =
    plainText.length > 160 ? `${plainText.slice(0, 157)}...` : plainText;
  const ogImage = event.photoUrl || DEFAULT_OG_IMAGE;

  return {
    title: event.title,
    description,
    alternates: {
      canonical: `/news/events/${id}`,
    },
    openGraph: {
      title: event.title,
      description,
      images: [{ url: ogImage }],
    },
  };
}

export async function generateStaticParams() {
  return await getRecentEventShortIds();
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;
  const shortId = id.split('-').pop();

  if (!shortId) {
    notFound();
  }

  return <EventDetail shortId={shortId} />;
}

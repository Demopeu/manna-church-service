import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GalleryDetail } from '@/widgets/gallery-section';
import {
  getGalleryByShortId,
  getRecentGalleryShortIds,
} from '@/entities/gallery';
import { DEFAULT_OG_IMAGE } from '@/shared/config';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const shortId = id.split('-').pop();

  if (!shortId) {
    return { title: '갤러리를 찾을 수 없습니다' };
  }

  const gallery = await getGalleryByShortId(shortId);

  if (!gallery) {
    return { title: '갤러리를 찾을 수 없습니다' };
  }

  const description = `만나교회 갤러리 - ${gallery.title} (${gallery.eventDate})`;
  const ogImage =
    gallery.thumbnailUrl || gallery.images[0]?.storagePath || DEFAULT_OG_IMAGE;

  return {
    title: gallery.title,
    description,
    openGraph: {
      title: gallery.title,
      description,
      images: [{ url: ogImage }],
    },
  };
}

export async function generateStaticParams() {
  return await getRecentGalleryShortIds();
}

export default async function GalleryDetailPage({ params }: Props) {
  const { id } = await params;
  const shortId = id.split('-').pop();

  if (!shortId) {
    notFound();
  }

  return <GalleryDetail shortId={shortId} />;
}

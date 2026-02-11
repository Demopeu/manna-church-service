import { notFound } from 'next/navigation';
import { GalleryDetail } from '@/widgets/gallery-section';
import { getRecentGalleryShortIds } from '@/entities/gallery';

interface Props {
  params: Promise<{ id: string }>;
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

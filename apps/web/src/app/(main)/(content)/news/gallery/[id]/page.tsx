import { notFound } from 'next/navigation';
import { GalleryDetail } from '@/widgets/gallery-section';
import { getGalleryByShortId } from '@/entities/gallery';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function GalleryDetailPage({ params }: Props) {
  const { id } = await params;
  const shortId = id.split('-').pop();

  if (!shortId) {
    notFound();
  }

  const gallery = await getGalleryByShortId(shortId);

  if (!gallery) {
    notFound();
  }

  return <GalleryDetail gallery={gallery} />;
}

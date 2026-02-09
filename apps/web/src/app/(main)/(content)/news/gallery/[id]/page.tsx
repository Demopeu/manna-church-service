import { notFound } from 'next/navigation';
import { GalleryDetail } from '@/widgets/gallery-section';
import { getGalleryById } from '@/entities/gallery/api/queries';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function GalleryDetailPage({ params }: Props) {
  const { id } = await params;

  const gallery = await getGalleryById(id);

  if (!gallery) {
    notFound();
  }

  return <GalleryDetail gallery={gallery} />;
}

import { notFound } from 'next/navigation';
import { GalleryDetail } from '@/widgets/gallery-section';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function GalleryDetailPage({ params }: Props) {
  const { id } = await params;
  const shortId = id.split('-').pop();

  if (!shortId) {
    notFound();
  }

  return <GalleryDetail shortId={shortId} />;
}

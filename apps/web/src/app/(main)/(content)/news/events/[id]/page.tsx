import { notFound } from 'next/navigation';
import { EventDetail } from '@/widgets/events-section';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;
  const shortId = id.split('-').pop();

  if (!shortId) {
    notFound();
  }

  return <EventDetail shortId={shortId} />;
}

import { notFound } from 'next/navigation';
import { EventDetail } from '@/widgets/events-section';
import { getEventByShortId } from '@/entities/event';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;
  const shortId = id.split('-').pop();

  if (!shortId) {
    notFound();
  }

  const event = await getEventByShortId(shortId);

  if (!event) {
    notFound();
  }

  return <EventDetail event={event} />;
}

import { notFound } from 'next/navigation';
import { EventDetail } from '@/widgets/events-section';
import { getEventById } from '@/entities/event/api/queries';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;

  const event = await getEventById(id);

  if (!event) {
    notFound();
  }

  return <EventDetail event={event} />;
}

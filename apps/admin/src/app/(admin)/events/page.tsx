import { EventsList } from '@/widgets/events';
import { CreateEventButton } from '@/features/event';

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <CreateEventButton />
      <EventsList />
    </div>
  );
}

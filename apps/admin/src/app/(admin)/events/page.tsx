import { EventsList } from '@/widgets/event-list';
import { CreateEventButton } from '@/features/event';

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page } = await searchParams;

  const searchQuery = q || '';
  const currentPage = Math.max(1, Number(page) || 1);
  return (
    <div className="space-y-6">
      <CreateEventButton />
      <EventsList searchQuery={searchQuery} currentPage={currentPage} />
    </div>
  );
}

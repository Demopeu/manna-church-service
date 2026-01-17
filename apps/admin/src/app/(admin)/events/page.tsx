import { Suspense } from 'react';
import { EventsList } from '@/widgets/event-list';
import { CreateEventButton } from '@/features/event';
import { ListSkeleton } from '@/shared/ui';

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
      <Suspense fallback={<ListSkeleton />}>
        <EventsList searchQuery={searchQuery} currentPage={currentPage} />
      </Suspense>
    </div>
  );
}

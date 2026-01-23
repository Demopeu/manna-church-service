import { Suspense } from 'react';
import { CalendarDays } from 'lucide-react';
import { getEvents } from '@/entities/event';
import {
  DataTable,
  EmptyState,
  ListSkeleton,
  Pagination,
  SearchInput,
  SearchInputSkeleton,
  SectionCard,
  withAsyncBoundary,
} from '@/shared/ui';
import { EventsItem } from './EventsItem';
import { COLUMNS } from './columns';
import { EVENT_UI } from './labels';

interface Props {
  searchQuery: string;
  currentPage: number;
}

async function List({ searchQuery, currentPage }: Props) {
  const { events, totalPages } = await getEvents({
    query: searchQuery,
    page: currentPage,
  });
  return (
    <SectionCard
      title={EVENT_UI.TITLE}
      description={EVENT_UI.DESCRIPTION}
      action={
        <Suspense fallback={<SearchInputSkeleton />}>
          <SearchInput placeholder={EVENT_UI.SEARCH_PLACEHOLDER} />
        </Suspense>
      }
    >
      {events.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title={EVENT_UI.EMPTY}
          description={EVENT_UI.EMPTY_DESCRIPTION}
        />
      ) : (
        <DataTable columns={COLUMNS}>
          {events.map((event) => (
            <EventsItem key={event.id} event={event} />
          ))}
        </DataTable>
      )}
      <Pagination totalPages={totalPages} currentPage={currentPage} />
    </SectionCard>
  );
}

export const EventsList = withAsyncBoundary(List, {
  loadingFallback: (
    <ListSkeleton
      title={EVENT_UI.TITLE}
      description={EVENT_UI.DESCRIPTION}
      columns={COLUMNS}
    />
  ),
});

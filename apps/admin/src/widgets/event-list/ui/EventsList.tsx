import { Suspense } from 'react';
import { CalendarDays } from 'lucide-react';
import { getEvents } from '@/entities/event';
import {
  DataTable,
  EmptyState,
  Pagination,
  SearchInput,
  SearchInputSkeleton,
  SectionCard,
} from '@/shared/ui';
import { COLUMNS } from '../config/columns';
import { EventsItem } from './EventsItem';

interface Props {
  searchQuery: string;
  currentPage: number;
}

export async function EventsList({ searchQuery, currentPage }: Props) {
  const { events, totalPages } = await getEvents({
    query: searchQuery,
    page: currentPage,
  });
  return (
    <SectionCard
      title="이벤트 목록"
      description="등록된 이벤트를 관리합니다. (최신순)"
      action={
        <Suspense fallback={<SearchInputSkeleton />}>
          <SearchInput />
        </Suspense>
      }
    >
      {events.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="등록된 이벤트가 없습니다"
          description="위의 '이벤트 등록' 버튼을 눌러 첫 이벤트를 등록해보세요."
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

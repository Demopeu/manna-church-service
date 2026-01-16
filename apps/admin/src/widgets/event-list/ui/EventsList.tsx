import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  EmptyState,
  SearchInput,
  SearchInputSkeleton,
  SectionCard,
  Pagination,
} from '@/shared/ui';
import { Suspense } from 'react';
import { CalendarDays } from 'lucide-react';
import { EventsItem } from './EventsItem';
import { getEvents } from '@/entities/event';

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
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">사진</TableHead>
                <TableHead className="min-w-[150px]">제목</TableHead>
                <TableHead className="min-w-[250px]">설명</TableHead>
                <TableHead>시작일</TableHead>
                <TableHead className="text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <EventsItem key={event.id} event={event} />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <Pagination totalPages={totalPages} currentPage={currentPage} />
    </SectionCard>
  );
}

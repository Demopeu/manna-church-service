import { getEvents } from '@/entities/event';
import {
  ContentWrapper,
  ListError,
  ListSkeleton,
  withAsyncBoundary,
} from '@/shared/ui';
import { EventItem } from './Item';

interface Props {
  filterParams: Promise<{ query: string; page: number }>;
}

async function List({ filterParams }: Props) {
  const { query, page } = await filterParams;

  const { events, totalPages, totalCount } = await getEvents({
    query,
    page,
  });

  return (
    <ContentWrapper
      totalCount={totalCount}
      totalPages={totalPages}
      currentPage={page}
      currentQuery={query}
    >
      {events.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {events.map((event) => (
            <EventItem key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="border-muted-foreground/30 flex h-64 items-center justify-center rounded-xl border border-dashed">
          <p className="text-muted-foreground">
            {query
              ? `"${query}"에 대한 검색 결과가 없습니다.`
              : '등록된 이벤트가 없습니다.'}
          </p>
        </div>
      )}
    </ContentWrapper>
  );
}

export const EventList = withAsyncBoundary(List, {
  loadingFallback: <ListSkeleton variant="card-grid" />,
  errorFallback: <ListError title="이벤트를 불러올 수 없어요" />,
});

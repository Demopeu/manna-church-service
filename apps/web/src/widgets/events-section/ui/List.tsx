import Image from 'next/image';
import Link from 'next/link';
import { getEvents } from '@/entities/event';
import { formatKoreanDate } from '@/shared/lib';
import {
  ContentWrapper,
  ListError,
  ListSkeleton,
  withAsyncBoundary,
} from '@/shared/ui';

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
            <Link
              key={event.id}
              href={`/news/events/${event.title}-${event.shortId}`}
              className="group focus-visible:ring-manna rounded-xl text-left focus:outline-none focus-visible:ring-2"
              aria-label={`이벤트: ${event.title} 상세 보기`}
            >
              <div className="group relative aspect-210/297 overflow-hidden bg-transparent transition-all group-hover:scale-105">
                <Image
                  src={event.photoUrl}
                  alt={`${event.title} 이벤트 포스터`}
                  fill
                  className="object-contain duration-300"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>

              <div className="mt-3 space-y-1">
                <h3 className="text-manna-dark-blue line-clamp-2 font-bold group-hover:underline">
                  {event.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {formatKoreanDate(event.startDate)}
                </p>
              </div>
            </Link>
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

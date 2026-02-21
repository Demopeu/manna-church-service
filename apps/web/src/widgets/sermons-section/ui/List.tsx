import { getSermons } from '@/entities/sermon';
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
  const { sermons, totalPages, totalCount } = await getSermons({ query, page });

  return (
    <ContentWrapper
      totalCount={totalCount}
      totalPages={totalPages}
      currentPage={page}
      currentQuery={query}
    >
      {sermons.length > 0 ? (
        <div className="bg-background border-border overflow-hidden rounded-xl border">
          <div className="border-border border-b px-4 py-3 md:px-6">
            <div className="flex items-center gap-4">
              <span className="flex-1 text-sm font-semibold">제목</span>
              <span className="hidden w-28 shrink-0 text-sm font-semibold sm:block">
                설교자
              </span>
              <span className="w-28 shrink-0 text-right text-sm font-semibold">
                날짜
              </span>
            </div>
          </div>

          <div className="divide-border divide-y">
            {sermons.map((sermon) => (
              <a
                key={sermon.id}
                href={sermon.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:bg-muted/50 flex w-full items-center gap-4 px-4 py-4 transition-colors md:px-6"
                aria-label={`${sermon.title} 설교 영상 보기`}
              >
                <span className="text-manna-dark-blue flex-1 truncate font-medium">
                  {sermon.title}
                </span>
                <span className="text-muted-foreground hidden w-28 shrink-0 text-sm sm:block">
                  {sermon.preacher}
                </span>
                <span className="text-muted-foreground w-28 shrink-0 text-right text-sm">
                  {formatKoreanDate(sermon.date, 'yyyy. M. d')}
                </span>
              </a>
            ))}
          </div>
        </div>
      ) : (
        <div className="border-muted-foreground/30 flex h-64 items-center justify-center rounded-xl border border-dashed">
          <p className="text-muted-foreground">
            {query
              ? `"${query}"에 대한 검색 결과가 없습니다.`
              : '등록된 설교가 없습니다.'}
          </p>
        </div>
      )}
    </ContentWrapper>
  );
}

export const SermonList = withAsyncBoundary(List, {
  loadingFallback: <ListSkeleton variant="board" />,
  errorFallback: <ListError title="설교를 불러올 수 없어요" />,
});

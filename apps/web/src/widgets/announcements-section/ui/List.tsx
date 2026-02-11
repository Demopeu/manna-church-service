import Link from 'next/link';
import { getAnnouncements } from '@/entities/announcement';
import { formatKoreanDate } from '@/shared/lib';
import {
  Badge,
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
  const { announcements, totalPages, totalCount } = await getAnnouncements({
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
      {announcements.length > 0 ? (
        <div className="bg-background border-border overflow-hidden rounded-xl border">
          <div className="divide-border divide-y">
            {announcements.map((item) => (
              <Link
                key={item.id}
                href={`/news/announcements/${item.title}-${item.shortId}`}
                className="hover:bg-muted/50 flex w-full items-center gap-4 px-4 py-4 text-left transition-colors md:px-6"
                aria-label={`공지사항: ${item.title} 상세 보기`}
              >
                <div className="w-12 shrink-0">
                  {item.isUrgent && (
                    <Badge
                      variant="destructive"
                      className="px-2 py-0.5 text-xs font-semibold"
                    >
                      긴급
                    </Badge>
                  )}
                </div>

                <span className="text-manna-dark-blue flex-1 truncate font-medium">
                  {item.title}
                </span>

                <span className="text-muted-foreground shrink-0 text-sm">
                  {formatKoreanDate(item.createdAt)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="border-muted-foreground/30 flex h-64 items-center justify-center rounded-xl border border-dashed">
          <p className="text-muted-foreground">
            {query
              ? `"${query}"에 대한 검색 결과가 없습니다.`
              : '등록된 공지사항이 없습니다.'}
          </p>
        </div>
      )}
    </ContentWrapper>
  );
}

export const AnnouncementList = withAsyncBoundary(List, {
  loadingFallback: <ListSkeleton variant="board" />,
  errorFallback: <ListError title="공지사항을 불러올 수 없어요" />,
});

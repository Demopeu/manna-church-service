import Link from 'next/link';
import { getRecentAnnouncements } from '@/entities/announcement';
import { formatKoreanDate } from '@/shared/lib';
import { Badge, ReadMoreButton, withAsyncBoundary } from '@/shared/ui';

async function AnnouncementsSectionBase() {
  const announcements = await getRecentAnnouncements();

  if (!announcements || announcements.length === 0) {
    return <AnnouncementsPlaceholder variant="empty" />;
  }

  return (
    <ul className="divide-border divide-y">
      {announcements.map((item) => (
        <li key={item.id}>
          <Link
            href={`/news/announcements/${item.title}-${item.shortId}`}
            className="hover:bg-muted/50 flex items-center justify-between gap-4 px-6 py-4 transition-colors lg:py-3 xl:py-4"
            aria-label={`공지사항: ${item.title} 상세 보기`}
          >
            <div className="flex flex-1 items-center gap-2 overflow-hidden">
              {item.isUrgent && (
                <Badge
                  variant="destructive"
                  className="shrink-0 px-1.5 py-0 text-[10px]"
                >
                  긴급
                </Badge>
              )}
              <span className="text-foreground truncate text-sm font-medium">
                [{formatKoreanDate(item.createdAt)}] {item.title}
              </span>
            </div>
            <Badge
              variant="secondary"
              className="bg-manna/40 shrink-0 px-2 py-0.5 text-[10px]"
            >
              N
            </Badge>
          </Link>
        </li>
      ))}
    </ul>
  );
}

interface Props {
  variant: 'skeleton' | 'error' | 'empty';
}

function AnnouncementsPlaceholder({ variant }: Props) {
  if (variant === 'error') {
    return (
      <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-2 text-center text-sm text-gray-500">
        <p>등록된 공지사항을 불러올 수 없습니다.</p>
        <p>잠시 뒤에 시도해보세요.</p>
      </div>
    );
  }

  if (variant === 'empty') {
    return (
      <div className="flex h-full min-h-[200px] items-center justify-center text-sm text-gray-500">
        등록된 공지사항이 없습니다.
      </div>
    );
  }

  return (
    <ul className="divide-border divide-y">
      {Array.from({ length: 5 }).map((_, i) => (
        <li
          key={i}
          className="flex items-center justify-between gap-4 px-6 py-4"
        >
          <div className="flex flex-1 items-center gap-2 overflow-hidden">
            <div className="h-5 w-8 shrink-0 animate-pulse rounded bg-gray-200" />
            <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="h-5 w-6 shrink-0 animate-pulse rounded bg-gray-200" />
        </li>
      ))}
    </ul>
  );
}

export const AnnouncementsList = withAsyncBoundary(AnnouncementsSectionBase, {
  loadingFallback: <AnnouncementsPlaceholder variant="skeleton" />,
  errorFallback: <AnnouncementsPlaceholder variant="error" />,
});

export function AnnouncementsSection() {
  return (
    <div className="flex w-full min-w-0 flex-col lg:aspect-video">
      <div className="mx-4 mb-4 flex shrink-0 items-center justify-between">
        <h2 className="text-foreground text-xl font-bold md:text-2xl">
          공지사항
        </h2>
        <ReadMoreButton
          href="/news/announcements"
          variant="transparent"
          ariaLabel="공지사항 전체 목록 보기"
        />
      </div>
      <div className="rounded-xl bg-white shadow-lg lg:flex-1 lg:overflow-hidden">
        <div className="lg:h-full lg:overflow-y-auto">
          <AnnouncementsList />
        </div>
      </div>
    </div>
  );
}

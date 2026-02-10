import Link from 'next/link';
import { getRecentAnnouncements } from '@/entities/announcement/api/queries';
import { formatKoreanDate } from '@/shared/lib';
import { Badge, withAsyncBoundary } from '@/shared/ui';

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
            className="hover:bg-muted/50 flex items-center justify-between gap-4 px-6 py-4 transition-colors"
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

export const AnnouncementsSection = withAsyncBoundary(
  AnnouncementsSectionBase,
  {
    loadingFallback: <AnnouncementsPlaceholder variant="skeleton" />,
    errorFallback: <AnnouncementsPlaceholder variant="error" />,
  },
);

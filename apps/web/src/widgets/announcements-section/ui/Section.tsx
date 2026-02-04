import Link from 'next/link';
import { type Announcement } from '@/entities/announcement';
import { formatKoreanDate } from '@/shared/lib';
import { Badge, ReadMoreButton } from '@/shared/ui';

export function AnnouncementsSection({
  announcements,
}: {
  announcements: Announcement[];
}) {
  return (
    <div className="flex w-full flex-col lg:aspect-video">
      <div className="mx-4 mb-4 flex shrink-0 items-center justify-between">
        <h3 className="text-foreground text-xl font-bold md:text-2xl">
          공지사항
        </h3>
        <ReadMoreButton href="/announcements" variant="transparent" />
      </div>
      <div className="rounded-xl bg-white shadow-lg lg:flex-1 lg:overflow-hidden">
        <div className="lg:h-full lg:overflow-y-auto">
          <ul className="divide-border divide-y">
            {announcements.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/announcements/${item.id}`}
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
        </div>
      </div>
    </div>
  );
}

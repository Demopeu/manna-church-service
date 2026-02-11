import { notFound } from 'next/navigation';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { getAnnouncementByShortId } from '@/entities/announcement';
import { formatKoreanDate } from '@/shared/lib';
import { BackButton, Badge, withAsyncBoundary } from '@/shared/ui';

function AnnouncementDetailSkeleton() {
  return (
    <div className="bg-background border-border animate-pulse rounded-xl border p-6 md:p-8">
      <div className="space-y-4">
        <div className="h-5 w-12 rounded bg-gray-200" />
        <div className="h-8 w-3/4 rounded bg-gray-200" />
        <div className="h-4 w-32 rounded bg-gray-200" />
      </div>

      <hr className="border-border my-6" />
      <div className="space-y-3">
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-5/6 rounded bg-gray-200" />
        <div className="h-4 w-full rounded bg-gray-200" />
      </div>
    </div>
  );
}

function AnnouncementDetailError() {
  return (
    <div className="bg-background border-border flex min-h-[300px] flex-col items-center justify-center gap-4 rounded-xl border p-8 text-center">
      <AlertCircle className="text-destructive h-12 w-12 opacity-50" />
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">
          공지사항을 불러오지 못했습니다
        </h3>
        <p className="text-muted-foreground text-sm">
          잠시 후 다시 시도해 주세요.
        </p>
      </div>
    </div>
  );
}

async function AnnouncementDetailBase({ shortId }: { shortId: string }) {
  const announcement = await getAnnouncementByShortId(shortId);

  if (!announcement) {
    notFound();
  }

  return (
    <div className="bg-background border-border rounded-xl border p-6 md:p-8">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          {announcement.isUrgent && (
            <Badge
              variant="destructive"
              className="px-2.5 py-1 text-xs font-semibold"
            >
              긴급
            </Badge>
          )}
        </div>
        <h1 className="text-foreground text-2xl font-bold md:text-3xl">
          {announcement.title}
        </h1>
        <p className="text-muted-foreground">
          {formatKoreanDate(announcement.createdAt)}
        </p>
      </div>

      <hr className="border-border my-6" />

      <div className="prose prose-gray max-w-none">
        <div className="text-foreground leading-relaxed whitespace-pre-wrap">
          {announcement.content}
        </div>
      </div>
    </div>
  );
}

const AnnouncementDetailContent = withAsyncBoundary(AnnouncementDetailBase, {
  loadingFallback: <AnnouncementDetailSkeleton />,
  errorFallback: <AnnouncementDetailError />,
});

interface Props {
  shortId: string;
}

export function AnnouncementDetail({ shortId }: Props) {
  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-20">
      <div className="bg-background/95 sticky top-0 z-10 flex items-center py-4 backdrop-blur-sm">
        <BackButton className="group hover:text-manna-dark-blue flex items-center gap-2 border-0 bg-transparent pl-0 shadow-none hover:bg-transparent">
          <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          <span className="text-lg font-medium">목록으로</span>
        </BackButton>
      </div>

      <AnnouncementDetailContent shortId={shortId} />
    </div>
  );
}

import Image from 'next/image';
import { notFound } from 'next/navigation';
import { AlertCircle, ArrowLeft, Calendar } from 'lucide-react';
import { getEventByShortId } from '@/entities/event';
import { formatKoreanDate } from '@/shared/lib';
import { BackButton, withAsyncBoundary } from '@/shared/ui';

function EventDetailSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="border-border border-b pb-6">
        <div className="mb-2 flex items-center gap-2">
          <div className="h-5 w-5 rounded bg-gray-200" />
          <div className="h-5 w-32 rounded bg-gray-200" />
        </div>
        <div className="h-9 w-3/4 rounded bg-gray-200" />
      </div>

      <div className="ring-border/5 overflow-hidden rounded-xl bg-white shadow-sm ring-1">
        <div className="aspect-3/4 w-full bg-gray-200 md:aspect-video" />
      </div>

      <div className="space-y-3">
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-5/6 rounded bg-gray-200" />
      </div>
    </div>
  );
}

function EventDetailError() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
      <AlertCircle className="text-destructive h-12 w-12 opacity-50" />
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">이벤트를 불러오지 못했습니다</h3>
        <p className="text-muted-foreground text-sm">
          잠시 후 다시 시도해 주세요.
        </p>
      </div>
    </div>
  );
}

async function EventDetailBase({ shortId }: { shortId: string }) {
  const event = await getEventByShortId(shortId);

  if (!event) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="border-border border-b pb-6">
        <div className="text-manna-dark-blue mb-2 flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          <span className="font-semibold">
            {formatKoreanDate(event.startDate)}
          </span>
        </div>
        <h1 className="text-foreground text-3xl font-bold">{event.title}</h1>
      </div>

      <div className="ring-border/5 overflow-hidden rounded-xl bg-white shadow-sm ring-1">
        {event.photoUrl && (
          <div className="relative w-full">
            <Image
              src={event.photoUrl}
              alt={event.title}
              width={0}
              height={0}
              sizes="100vw"
              className="h-auto w-full"
              priority
            />
          </div>
        )}
      </div>

      {event.description && (
        <div className="prose prose-gray max-w-none">
          <p className="text-foreground leading-relaxed whitespace-pre-line">
            {event.description}
          </p>
        </div>
      )}
    </div>
  );
}

const EventDetailContent = withAsyncBoundary(EventDetailBase, {
  loadingFallback: <EventDetailSkeleton />,
  errorFallback: <EventDetailError />,
});

interface Props {
  shortId: string;
}

export function EventDetail({ shortId }: Props) {
  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-20">
      <div className="bg-background/95 sticky top-0 z-10 flex items-center py-4 backdrop-blur-sm">
        <BackButton className="group hover:text-manna-dark-blue flex items-center gap-2 border-0 bg-transparent pl-0 shadow-none hover:bg-transparent">
          <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          <span className="text-lg font-medium">목록으로</span>
        </BackButton>
      </div>

      <EventDetailContent shortId={shortId} />
    </div>
  );
}

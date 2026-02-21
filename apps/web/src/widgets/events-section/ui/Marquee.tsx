import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { getRecentEvents } from '@/entities/event';
import {
  Button,
  Card,
  ReadMoreButton,
  SectionWrapper,
  withAsyncBoundary,
} from '@/shared/ui';

async function EventsMarqueeBase() {
  const events = await getRecentEvents();

  if (!events || events.length === 0) return null;

  const originalLength = events.length;
  const loopedEvents = Array(5).fill(events).flat();

  return (
    <div className="group relative w-full">
      <div className="animate-marquee group-hover:paused flex w-max gap-6">
        {loopedEvents.map((event, index) => {
          const isClone = index >= originalLength;

          return (
            <Card
              key={`${event.id}-${index}`}
              className="relative h-70 w-40 shrink-0 cursor-pointer overflow-hidden rounded-xl border-0 p-0 shadow-lg md:h-100 md:w-60"
              aria-hidden={isClone ? 'true' : undefined}
            >
              <div className="relative h-full w-full">
                <Image
                  src={event.photoUrl}
                  alt={isClone ? '' : `${event.title} 이벤트 포스터`}
                  fill
                  className="object-cover object-top transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 768px) 240px, 240px"
                  priority={index < 5}
                  unoptimized
                />

                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 p-4 text-center opacity-0 transition-opacity duration-300 hover:opacity-100">
                  <h3 className="mb-2 line-clamp-2 text-base leading-tight font-bold text-white md:text-lg">
                    {event.title}
                  </h3>
                  <p className="mb-4 text-sm text-white">
                    {format(new Date(event.startDate), 'yyyy.MM.dd')}
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="border-white/60 bg-transparent text-white hover:bg-white/20"
                    tabIndex={isClone ? -1 : undefined}
                  >
                    <Link
                      href={`/news/events/${event.title}-${event.shortId}`}
                      tabIndex={isClone ? -1 : undefined}
                    >
                      <span className="sr-only">{event.title}</span>
                      <span>자세히 보기</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function EventsMarqueeSkeleton() {
  return (
    <div className="w-full overflow-hidden">
      <div className="flex w-max gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card
            key={i}
            className="relative h-70 w-40 shrink-0 overflow-hidden rounded-xl border-0 p-0 shadow-none md:h-100 md:w-60"
          >
            <div className="h-full w-full animate-pulse bg-gray-200" />
          </Card>
        ))}
      </div>
    </div>
  );
}

const EventsMarqueeList = withAsyncBoundary(EventsMarqueeBase, {
  loadingFallback: <EventsMarqueeSkeleton />,
  errorFallback: null,
});

export function EventsMarquee() {
  return (
    <SectionWrapper className="bg-manna-mint/15 overflow-hidden">
      <div className="mx-auto mb-8 max-w-7xl px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-foreground text-2xl font-bold md:text-4xl">
            이벤트
          </h2>
          <ReadMoreButton
            href="/news/events"
            variant="manna"
            ariaLabel="이벤트 전체 목록 보기"
          />
        </div>
      </div>
      <EventsMarqueeList />
    </SectionWrapper>
  );
}

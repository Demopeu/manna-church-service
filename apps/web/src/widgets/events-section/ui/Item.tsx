'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Event } from '@/entities/event';
import { formatKoreanDate } from '@/shared/lib';

interface Props {
  event: Event;
}

export function EventItem({ event }: Props) {
  return (
    <Link
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
          unoptimized
        />
      </div>

      <div className="mt-3 space-y-1">
        <h2 className="text-manna-dark-blue line-clamp-2 text-base font-bold group-hover:underline">
          {event.title}
        </h2>
        <p className="text-muted-foreground text-sm">
          {formatKoreanDate(event.startDate)}
        </p>
      </div>
    </Link>
  );
}

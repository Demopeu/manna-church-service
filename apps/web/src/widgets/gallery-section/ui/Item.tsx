'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { GalleryListItem } from '@/entities/gallery';
import { formatKoreanDate } from '@/shared/lib';

interface Props {
  gallery: GalleryListItem;
}

export function GalleryItem({ gallery }: Props) {
  return (
    <Link
      href={`/news/gallery/${gallery.title}-${gallery.shortId}`}
      className="group focus-visible:ring-manna rounded-xl text-left focus:outline-none focus-visible:ring-2"
      aria-label={`갤러리: ${gallery.title} 상세 보기`}
    >
      <div className="relative aspect-4/3 overflow-hidden rounded-xl shadow-md transition-shadow group-hover:shadow-lg">
        {gallery.thumbnailUrl ? (
          <Image
            src={gallery.thumbnailUrl}
            alt={`${gallery.title} 갤러리 썸네일`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-gray-100 to-gray-200">
            <svg
              className="h-10 w-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <h2 className="text-manna-dark-blue text-base font-bold group-hover:underline">
          {gallery.title}
        </h2>
        <p className="text-muted-foreground text-sm">
          {formatKoreanDate(gallery.eventDate)} &middot; {gallery.imagesCount}장
        </p>
      </div>
    </Link>
  );
}

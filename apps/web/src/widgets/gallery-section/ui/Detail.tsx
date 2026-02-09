'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import type { GalleryWithImages } from '@/entities/gallery';
import { formatKoreanDate } from '@/shared/lib';
import { Button } from '@/shared/ui';

interface Props {
  gallery: GalleryWithImages;
}

export function GalleryDetail({ gallery }: Props) {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-20">
      <div className="bg-background/95 sticky top-0 z-10 flex items-center py-4 backdrop-blur-sm">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="group hover:text-manna-dark-blue flex items-center gap-2 pl-0 hover:bg-transparent"
        >
          <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          <span className="text-lg font-medium">목록으로</span>
        </Button>
      </div>

      <div className="border-border border-b pb-6">
        <h1 className="text-foreground text-3xl font-bold">{gallery.title}</h1>
        <p className="text-muted-foreground mt-2">
          {formatKoreanDate(gallery.eventDate)} &middot; {gallery.images.length}
          장
        </p>
      </div>

      <div className="flex flex-col gap-2 overflow-hidden">
        {gallery.images.map((image) => (
          <div
            key={image.id}
            className="relative w-full overflow-hidden rounded-xl shadow-sm transition-shadow hover:shadow-md"
          >
            <Image
              src={image.storagePath}
              alt={gallery.title}
              width={0}
              height={0}
              sizes="100vw"
              className="h-auto w-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

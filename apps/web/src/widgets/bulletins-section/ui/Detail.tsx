'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar } from 'lucide-react';
import type { Bulletin } from '@/entities/bulletin';
import { formatKoreanDate } from '@/shared/lib';
import { Button } from '@/shared/ui';

interface Props {
  bulletin: Bulletin;
}

export function BulletinDetail({ bulletin }: Props) {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-20">
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
        <div className="text-manna-dark-blue mb-2 flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          <span className="font-semibold">
            {formatKoreanDate(bulletin.publishedAt)}
          </span>
        </div>
        <h1 className="text-foreground text-3xl font-bold">주보 상세보기</h1>
      </div>

      <div className="ring-border/5 flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1">
        {bulletin.coverImageUrl && (
          <div className="relative w-full">
            <Image
              src={bulletin.coverImageUrl}
              alt="주보 커버"
              width={0}
              height={0}
              sizes="100vw"
              className="h-auto w-full"
              priority
            />
          </div>
        )}

        {bulletin.imageUrls.map((url, index) => (
          <div key={index} className="relative w-full">
            <Image
              src={url}
              alt={`${bulletin.publishedAt} 주보 상세 ${index + 1}`}
              width={0}
              height={0}
              sizes="100vw"
              className="h-auto w-full"
              priority={!bulletin.coverImageUrl && index === 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

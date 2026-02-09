'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import type { Announcement } from '@/entities/announcement';
import { formatKoreanDate } from '@/shared/lib';
import { Badge, Button } from '@/shared/ui';

interface Props {
  announcement: Announcement;
}

export function AnnouncementDetail({ announcement }: Props) {
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
    </div>
  );
}

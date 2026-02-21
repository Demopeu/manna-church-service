'use client';

import { useState } from 'react';
import Image from 'next/image';
import { GripVertical, Trash2 } from 'lucide-react';
import { cn } from '@repo/ui/lib';
import type { Banner } from '@/entities/banner';
import { Button, Input } from '@/shared/ui';

interface Props {
  banner: Banner;
  index: number;
  isDragging: boolean;
  onDelete: (banner: Banner) => void;
  onTitleChange: (id: string, title: string) => void;
  onDragStart: (id: string) => void;
  onDragOver: (e: React.DragEvent, overId: string) => void;
  onDragEnd: () => void;
}

export function BannerItem({
  banner,
  index,
  isDragging,
  onDelete,
  onTitleChange,
  onDragStart,
  onDragOver,
  onDragEnd,
}: Props) {
  const [title, setTitle] = useState(banner.title);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    onTitleChange(banner.id, e.target.value);
  };

  return (
    <div
      draggable
      onDragStart={() => onDragStart(banner.id)}
      onDragOver={(e) => onDragOver(e, banner.id)}
      onDragEnd={onDragEnd}
      className={cn(
        'bg-muted/30 flex gap-4 rounded-lg border p-4 transition-opacity',
        isDragging && 'opacity-40',
      )}
    >
      <div className="text-muted-foreground flex cursor-grab items-center active:cursor-grabbing">
        <GripVertical className="h-5 w-5" />
      </div>

      <div className="bg-muted relative h-20 w-32 shrink-0 overflow-hidden rounded-md">
        {banner.imageUrl.startsWith('blob:') ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={banner.imageUrl}
            alt={banner.title || `배너 ${index + 1}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <Image
            src={banner.imageUrl}
            alt={banner.title || `배너 ${index + 1}`}
            fill
            className="object-cover"
            sizes="128px"
          />
        )}
      </div>

      <div className="flex-1 space-y-2">
        <Input
          value={title}
          onChange={handleTitleChange}
          placeholder="배너 제목"
          className={cn(
            'h-9',
            !title.trim() &&
              'border-destructive focus-visible:ring-destructive',
          )}
        />
      </div>

      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={() => onDelete(banner)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

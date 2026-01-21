'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { Button } from './base/Button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './base/Dialog';

interface ImageDialogProps {
  src: string;
  alt: string;
  children: React.ReactNode;
}

export function ImageDialog({ src, alt, children }: ImageDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl overflow-hidden border-none bg-transparent p-0 shadow-none [&>button:last-child]:hidden">
        <DialogHeader>
          <DialogTitle className="sr-only">이미지 상세 보기</DialogTitle>
        </DialogHeader>
        <DialogClose asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-50 h-10 w-10 rounded-full bg-black/50 text-white hover:bg-white/40 focus:ring-0 focus:ring-offset-0"
          >
            <X className="h-6 w-6" />
            <span className="sr-only">닫기</span>
          </Button>
        </DialogClose>

        <div className="relative aspect-video w-full">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

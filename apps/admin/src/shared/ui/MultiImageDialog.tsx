'use client';

import { useEffect, useEffectEvent, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ImageOff, X } from 'lucide-react';
import { Button } from './base/Button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './base/Dialog';

interface Props {
  images: string[];
  children: React.ReactNode;
  title?: string;
}

export function MultiImageDialog({ images, children, title }: Props) {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isError, setIsError] = useState(false);

  const hasMultiple = images.length > 1;
  const currentSrc = images[currentIndex];
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setIsError(false);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsError(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setCurrentIndex(0);
      setIsError(false);
    }
  };

  const onKeyDown = useEffectEvent((e: KeyboardEvent) => {
    if (!open) return;
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'ArrowLeft') handlePrev();
  });

  useEffect(() => {
    if (!open) return;

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-6xl border-none bg-transparent p-0 shadow-none outline-none focus:outline-none [&>button:last-child]:hidden">
        <DialogHeader>
          <DialogTitle className="sr-only">
            {title || '이미지 갤러리'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            이미지 전체보기 화면입니다. 키보드 화살표나 버튼을 통해 이동할 수
            있습니다.
          </DialogDescription>
        </DialogHeader>

        <DialogClose asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute -top-12 right-0 z-50 h-10 w-10 rounded-full bg-white/20 text-white hover:bg-white/40 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 md:top-4 md:right-4"
          >
            <X className="h-6 w-6" />
            <span className="sr-only">닫기</span>
          </Button>
        </DialogClose>

        <div className="relative flex h-[85vh] w-full flex-col items-center justify-center pt-12">
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg bg-black/40 backdrop-blur-sm">
            {!currentSrc || isError ? (
              <div className="flex flex-col items-center justify-center gap-4 text-white/70">
                <ImageOff className="h-16 w-16 opacity-50" />
                <p className="text-lg font-medium">
                  이미지를 불러올 수 없습니다.
                </p>
              </div>
            ) : (
              <Image
                src={currentSrc}
                alt={`Page ${currentIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
                onError={() => setIsError(true)}
                unoptimized
              />
            )}
          </div>

          {hasMultiple && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrev}
                className="absolute top-1/2 left-2 h-12 w-12 -translate-y-1/2 rounded-full bg-white/20 text-white hover:bg-white/40 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                className="absolute top-1/2 right-2 h-12 w-12 -translate-y-1/2 rounded-full bg-white/20 text-white hover:bg-white/40 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <ChevronRight className="h-8 w-8" />
              </Button>

              <div className="absolute bottom-6 rounded-full bg-black/60 px-4 py-1 text-sm font-medium text-white backdrop-blur-md">
                {currentIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

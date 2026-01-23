'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@repo/ui/lib';
import { Progress } from '@/shared/ui';

interface Props {
  isPending: boolean;
  message?: string;
  className?: string;
}

export function LoadingProgress({
  isPending,
  message = '잠시만 기다려주세요...',
  className,
}: Props) {
  const [progress, setProgress] = useState(13);

  useEffect(() => {
    if (!isPending) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }

        const jump = Math.random() * 15;
        return Math.min(prev + jump, 95);
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isPending]);

  if (!isPending) return null;

  return (
    <div
      className={cn(
        'bg-background/80 animate-in fade-in-0 absolute inset-0 z-50 flex flex-col items-center justify-center p-8 backdrop-blur-sm',
        className,
      )}
    >
      <div className="w-full max-w-md space-y-4 text-center">
        <div className="text-primary flex animate-pulse items-center justify-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <h3 className="text-lg font-semibold">처리중입니다</h3>
        </div>

        <Progress value={progress} className="h-2 w-full" />

        <p className="text-muted-foreground text-sm font-medium">{message}</p>
        <p className="text-muted-foreground/60 text-xs">
          창을 닫지 마세요 ({Math.round(progress)}%)
        </p>
      </div>
    </div>
  );
}

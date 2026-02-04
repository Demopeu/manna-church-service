'use client';

import type { ComponentProps } from 'react';
import { cn } from '@/lib';

interface AspectRatioProps extends ComponentProps<'div'> {
  ratio?: number;
}

export function AspectRatio({
  className,
  ratio = 1 / 1,
  style,
  ref,
  ...props
}: AspectRatioProps) {
  return (
    <div
      ref={ref}
      data-slot="aspect-ratio"
      className={cn('w-full', className)}
      style={{
        aspectRatio: `${ratio}`,
        ...style,
      }}
      {...props}
    />
  );
}

'use client';

import { useRef, useState } from 'react';

interface UseDragProps {
  onDismiss: () => void;
  threshold?: number;
}

export function useDrag({ onDismiss, threshold = 100 }: UseDragProps) {
  const [dragY, setDragY] = useState(0);
  const touchStartY = useRef(0);
  const isDragging = useRef(false);

  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;

    touchStartY.current = touch.clientY;
    isDragging.current = true;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!isDragging.current || !touch) return;

    const currentY = touch.clientY;
    const diff = currentY - touchStartY.current;

    if (diff > 0) {
      setDragY(diff);
    }
  };

  const onTouchEnd = () => {
    isDragging.current = false;

    if (dragY > threshold) {
      onDismiss();

      setTimeout(() => {
        setDragY(0);
      }, 300);
    } else {
      setDragY(0);
    }
  };

  return {
    dragY,
    handlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      style: { touchAction: 'none' as const },
    },
  };
}

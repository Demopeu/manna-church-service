'use client';

import { useRef, useState } from 'react';

interface UseDragDismissProps {
  onDismiss: () => void;
  threshold?: number;
}

export function useDrag({ onDismiss, threshold = 100 }: UseDragDismissProps) {
  const [dragY, setDragY] = useState(0);
  const touchStartY = useRef(0);
  const isDragging = useRef(false);

  const onTouchStart = (e: React.TouchEvent) => {
    if (!e.touches || e.touches.length === 0) return;

    touchStartY.current = e.touches[0]!.clientY;
    isDragging.current = true;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || !e.touches || e.touches.length === 0) return;
    const currentY = e.touches[0]!.clientY;
    const diff = currentY - touchStartY.current;

    if (diff > 0) {
      setDragY(diff);
    }
  };

  const onTouchEnd = () => {
    isDragging.current = false;

    if (dragY > threshold) {
      onDismiss();
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
    },
  };
}

import { useEffect, useRef, useState } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import type { CarouselApi } from '@/shared/ui';

interface Props {
  autoplayDelay?: number;
}

export function useCarousel({ autoplayDelay = 5000 }: Props = {}) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const plugin = useRef(
    Autoplay({ delay: autoplayDelay, stopOnInteraction: true }),
  );

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const scrollPrev = () => api?.scrollPrev();
  const scrollNext = () => api?.scrollNext();
  const scrollTo = (index: number) => api?.scrollTo(index);

  return {
    setApi,
    plugin: plugin.current,
    current,
    count,
    scrollPrev,
    scrollNext,
    scrollTo,
    api,
  };
}

import {
  type CarouselApi,
  Carousel as BaseCarousel,
  CarouselContent as BaseCarouselContent,
  CarouselItem as BaseCarouselItem,
  CarouselNext as BaseCarouselNext,
  CarouselPrevious as BaseCarouselPrevious,
  useCarousel,
} from '@repo/ui/shadcn';

export type { CarouselApi };
export { useCarousel };

export function Carousel({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof BaseCarousel>) {
  return <BaseCarousel ref={ref} className={className} {...props} />;
}

export function CarouselContent({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof BaseCarouselContent>) {
  return <BaseCarouselContent ref={ref} className={className} {...props} />;
}

export function CarouselItem({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof BaseCarouselItem>) {
  return <BaseCarouselItem ref={ref} className={className} {...props} />;
}

export function CarouselPrevious({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof BaseCarouselPrevious>) {
  return <BaseCarouselPrevious ref={ref} className={className} {...props} />;
}

export function CarouselNext({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof BaseCarouselNext>) {
  return <BaseCarouselNext ref={ref} className={className} {...props} />;
}

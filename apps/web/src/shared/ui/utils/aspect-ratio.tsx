import { AspectRatio as BaseAspectRatio } from '@repo/ui/components';

export function AspectRatio({
  className,
  ...props
}: React.ComponentProps<typeof BaseAspectRatio>) {
  return <BaseAspectRatio className={`${className}`} {...props} />;
}

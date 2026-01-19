import { Skeleton as BaseSkeleton } from '@repo/ui/shadcn';

export function Skeleton({
  className,
  ...props
}: React.ComponentProps<typeof BaseSkeleton>) {
  return <BaseSkeleton className={`${className}`} {...props} />;
}

import { Progress as BaseProgress } from '@repo/ui/shadcn';

export function Progress({
  className,
  ...props
}: React.ComponentProps<typeof BaseProgress>) {
  return <BaseProgress className={`${className}`} {...props} />;
}

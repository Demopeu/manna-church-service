import { Label as BaseLabel } from '@repo/ui/shadcn';

export function Label({
  className,
  ...props
}: React.ComponentProps<typeof BaseLabel>) {
  return <BaseLabel className={`${className}`} {...props} />;
}

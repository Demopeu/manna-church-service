import { Badge as BaseBadge } from '@repo/ui/shadcn';

export function Badge({
  className,
  ...props
}: React.ComponentProps<typeof BaseBadge>) {
  return <BaseBadge className={`${className}`} {...props} />;
}

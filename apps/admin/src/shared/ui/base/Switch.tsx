import { Switch as BaseSwitch } from '@repo/ui/shadcn';

export function Switch({
  className,
  ...props
}: React.ComponentProps<typeof BaseSwitch>) {
  return <BaseSwitch className={`${className}`} {...props} />;
}

import { Button as BaseButton } from '@repo/ui/shadcn';

export function Button({
  className,
  ...props
}: React.ComponentProps<typeof BaseButton>) {
  return <BaseButton className={`${className}`} {...props} />;
}

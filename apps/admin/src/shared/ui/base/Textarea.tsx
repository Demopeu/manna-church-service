import { Textarea as BaseTextarea } from '@repo/ui/shadcn';

export function Textarea({
  className,
  ...props
}: React.ComponentProps<typeof BaseTextarea>) {
  return <BaseTextarea className={`${className}`} {...props} />;
}

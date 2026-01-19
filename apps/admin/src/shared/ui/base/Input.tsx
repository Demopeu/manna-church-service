import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '@repo/ui/lib';
import { Input as BaseInput } from '@repo/ui/shadcn';

const inputVariants = cva('transition-all duration-200', {
  variants: {
    variant: {
      default: '',
      error:
        'border-destructive ring-1 ring-destructive focus-visible:ring-destructive text-destructive placeholder:text-destructive/60',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface Props
  extends
    React.ComponentProps<typeof BaseInput>,
    VariantProps<typeof inputVariants> {}

export function Input({ className, variant, ...props }: Props) {
  return (
    <BaseInput
      className={cn(inputVariants({ variant }), className)}
      {...props}
    />
  );
}

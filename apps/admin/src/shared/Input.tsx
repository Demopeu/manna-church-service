import { Input as BaseInput } from '@repo/ui/shadcn';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@repo/ui/lib';

const inputVariants = cva('', {
  variants: {
    variant: {
      default: '',
      error:
        'border-destructive ring-destructive focus-visible:ring-destructive placeholder:text-destructive/60 text-destructive', // 에러일 때 빨간맛 추가
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface InputProps
  extends
    React.ComponentProps<typeof BaseInput>,
    VariantProps<typeof inputVariants> {}

export function Input({ className, variant, ...props }: InputProps) {
  return (
    <BaseInput
      className={cn(inputVariants({ variant }), className)}
      {...props}
    />
  );
}

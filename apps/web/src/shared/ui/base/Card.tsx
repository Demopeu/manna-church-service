import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '@repo/ui/lib';
import {
  Card as BaseCard,
  CardContent as BaseCardContent,
  CardDescription as BaseCardDescription,
  CardFooter as BaseCardFooter,
  CardHeader as BaseCardHeader,
  CardTitle as BaseCardTitle,
} from '@repo/ui/shadcn';

const cardVariants = cva('transition-all duration-200', {
  variants: {
    variant: {
      default: '',
      destructive:
        'border-destructive bg-destructive/5 text-destructive ring-1 ring-destructive',
      ghost: 'border-none shadow-none bg-transparent',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface CardProps
  extends
    React.ComponentProps<typeof BaseCard>,
    VariantProps<typeof cardVariants> {}

export function Card({ className, variant, ...props }: CardProps) {
  return (
    <BaseCard className={cn(cardVariants({ variant }), className)} {...props} />
  );
}

export function CardHeader({
  className,
  ...props
}: React.ComponentProps<typeof BaseCardHeader>) {
  return <BaseCardHeader className={cn('', className)} {...props} />;
}

export function CardTitle({
  className,
  ...props
}: React.ComponentProps<typeof BaseCardTitle>) {
  return <BaseCardTitle className={cn('', className)} {...props} />;
}

export function CardDescription({
  className,
  ...props
}: React.ComponentProps<typeof BaseCardDescription>) {
  return <BaseCardDescription className={cn('', className)} {...props} />;
}

export function CardContent({
  className,
  ...props
}: React.ComponentProps<typeof BaseCardContent>) {
  return <BaseCardContent className={cn('', className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: React.ComponentProps<typeof BaseCardFooter>) {
  return <BaseCardFooter className={cn('', className)} {...props} />;
}

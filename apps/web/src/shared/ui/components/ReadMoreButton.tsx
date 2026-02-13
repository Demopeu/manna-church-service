import Link from 'next/link';
import { cn } from '@repo/ui/lib';
import { Button } from '../base/Button';

type ReadMoreButtonVariant = 'manna' | 'blue' | 'transparent';

interface ReadMoreButtonProps {
  href: string;
  variant?: ReadMoreButtonVariant;
  className?: string;
  ariaLabel: string;
}

const variantStyles: Record<ReadMoreButtonVariant, string> = {
  manna:
    'border-manna hover:bg-manna-dark-blue bg-manna rounded-full p-4 text-white',
  blue: 'text-manna-dark-blue border-manna-dark-blue hover:bg-manna-dark-blue/10 bg-white',
  transparent: 'text-black border-gray/40 hover:bg-gray/90 bg-transparent',
};

export function ReadMoreButton({
  href,
  variant = 'blue',
  className,
  ariaLabel,
}: ReadMoreButtonProps) {
  return (
    <Button
      asChild
      variant="outline"
      size="sm"
      className={cn(`${variantStyles[variant]} ${className || ''} text-lg`)}
    >
      <Link href={href} aria-label={ariaLabel}>
        + 더 보기
      </Link>
    </Button>
  );
}

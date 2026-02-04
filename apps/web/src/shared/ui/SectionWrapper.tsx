import { cn } from '@repo/ui/lib';

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionWrapper({ children, className }: SectionWrapperProps) {
  return (
    <section className={cn('py-12 md:py-16', className)}>{children}</section>
  );
}

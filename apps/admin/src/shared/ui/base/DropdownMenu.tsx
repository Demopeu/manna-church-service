import * as React from 'react';
import {
  DropdownMenu as BaseDropdownMenu,
  DropdownMenuContent as BaseDropdownMenuContent,
  DropdownMenuItem as BaseDropdownMenuItem,
  DropdownMenuLabel as BaseDropdownMenuLabel,
  DropdownMenuSeparator as BaseDropdownMenuSeparator,
  DropdownMenuTrigger as BaseDropdownMenuTrigger,
} from '@repo/ui/shadcn';

export function DropdownMenu({
  ...props
}: React.ComponentProps<typeof BaseDropdownMenu>) {
  return <BaseDropdownMenu {...props} />;
}

export function DropdownMenuTrigger({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof BaseDropdownMenuTrigger>) {
  return <BaseDropdownMenuTrigger ref={ref} className={className} {...props} />;
}

export function DropdownMenuContent({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof BaseDropdownMenuContent>) {
  return <BaseDropdownMenuContent ref={ref} className={className} {...props} />;
}

export function DropdownMenuItem({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof BaseDropdownMenuItem>) {
  return <BaseDropdownMenuItem ref={ref} className={className} {...props} />;
}

export function DropdownMenuLabel({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof BaseDropdownMenuLabel>) {
  return <BaseDropdownMenuLabel ref={ref} className={className} {...props} />;
}

export function DropdownMenuSeparator({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof BaseDropdownMenuSeparator>) {
  return (
    <BaseDropdownMenuSeparator ref={ref} className={className} {...props} />
  );
}

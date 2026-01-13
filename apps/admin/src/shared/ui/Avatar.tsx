import * as React from 'react';
import {
  Avatar as BaseAvatar,
  AvatarFallback as BaseAvatarFallback,
  AvatarImage as BaseAvatarImage,
} from '@repo/ui/shadcn';

export function Avatar({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof BaseAvatar>) {
  return <BaseAvatar ref={ref} className={className} {...props} />;
}

export function AvatarImage({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof BaseAvatarImage>) {
  return <BaseAvatarImage ref={ref} className={className} {...props} />;
}

export function AvatarFallback({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof BaseAvatarFallback>) {
  return <BaseAvatarFallback ref={ref} className={className} {...props} />;
}

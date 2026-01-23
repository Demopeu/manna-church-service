'use client';

import { Toaster as Sonner } from 'sonner';

export function Toaster({ ...props }: React.ComponentProps<typeof Sonner>) {
  return (
    <Sonner
      position="top-center"
      theme="system"
      richColors
      duration={4000}
      toastOptions={{
        style: {
          fontSize: '18px',
          fontWeight: '600',
          padding: '16px 20px',
        },
        classNames: {
          toast: 'w-full max-w-md shadow-lg break-keep whitespace-pre-wrap',
          title: 'text-lg leading-snug',
          description: 'text-base leading-relaxed',
          actionButton: 'bg-primary text-primary-foreground',
          cancelButton: 'bg-muted text-muted-foreground',
        },
      }}
      {...props}
    />
  );
}

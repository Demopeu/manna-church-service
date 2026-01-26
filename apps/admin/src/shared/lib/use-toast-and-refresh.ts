'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useToastAndRefresh(onSuccess?: () => void) {
  const router = useRouter();

  const complete = (message: string) => {
    toast.success(message);
    router.refresh();
    onSuccess?.();
  };

  const errorToast = (message: string) => {
    toast.error(message);
  };

  return { complete, errorToast };
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as Sentry from '@sentry/nextjs';
import { toast } from 'sonner';
import { useDialog } from '@/shared/lib';
import { deleteBulletinAction } from '../api/actions';

export function useDeleteBulletin(bulletinId: string) {
  const router = useRouter();
  const { isOpen, open, close } = useDialog();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteBulletinAction(bulletinId);
      close();
      toast.success('주보가 성공적으로 삭제되었습니다.');
      router.refresh();
    } catch (error) {
      Sentry.captureException(error);
      console.error('주보 삭제 실패:', error);
      toast.error('주보 삭제에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isOpen,
    open,
    close,
    isDeleting,
    handleDelete,
  };
}

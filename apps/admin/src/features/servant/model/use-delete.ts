'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useDialog } from '@/shared/lib';
import { deleteServantAction } from '../api/actions';

export function useDeleteServant(servantId: string) {
  const router = useRouter();
  const { isOpen, open, close } = useDialog();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteServantAction(servantId);
      close();
      toast.success('교인 정보가 성공적으로 삭제되었습니다.');
      router.refresh();
    } catch (error) {
      console.error('섬기는 사람 삭제 실패:', error);
      toast.error('섬기는 사람 삭제에 실패했습니다.');
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

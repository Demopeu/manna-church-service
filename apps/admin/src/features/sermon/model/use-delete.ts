'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteSermonAction } from './actions';

export function useDeleteSermon(sermonId: string) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteSermonAction(sermonId);
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error('설교 삭제 실패:', error);
      alert('설교 삭제에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  const openDialog = () => setIsOpen(true);
  const closeDialog = (open: boolean) => setIsOpen(open);

  return {
    isOpen,
    isDeleting,
    openDialog,
    closeDialog,
    handleDelete,
  };
}

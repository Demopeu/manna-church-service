'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useDialog } from '@/shared/lib';
import { deleteGalleryAction } from '../api/actions';

export function useDeleteGallery(galleryId: string) {
  const router = useRouter();
  const { isOpen, open, close } = useDialog();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteGalleryAction(galleryId);
      close();
      toast.success('앨범이 성공적으로 삭제되었습니다.');
      router.refresh();
    } catch (error) {
      console.error('앨범 삭제 실패:', error);
      toast.error('앨범 삭제에 실패했습니다.');
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

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { captureException } from '@sentry/nextjs';
import { toast } from 'sonner';
import { useDialog } from '@/shared/lib';
import { deleteAnnouncementAction } from '../api/actions';

export function useDeleteAnnouncement(announcementId: string) {
  const router = useRouter();
  const { isOpen, open, close } = useDialog();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteAnnouncementAction(announcementId);
      close();
      toast.success('공지사항이 성공적으로 삭제되었습니다.');
      router.refresh();
    } catch (error) {
      captureException(error);
      console.error('공지사항 삭제 실패:', error);
      toast.error('공지사항 삭제에 실패했습니다.');
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

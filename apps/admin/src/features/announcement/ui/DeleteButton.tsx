'use client';

import { Button, DeleteDialog } from '@/shared/ui';
import { Trash2 } from 'lucide-react';
import { useDeleteAnnouncement } from '../model/use-delete-announcement';

interface DeleteAnnouncementButtonProps {
  announcementId: string;
  announcementTitle?: string;
}

export function DeleteAnnouncementButton({
  announcementId,
  announcementTitle,
}: DeleteAnnouncementButtonProps) {
  const { isOpen, openDialog, closeDialog, handleDelete } =
    useDeleteAnnouncement(announcementId);

  return (
    <>
      <Button variant="ghost" size="icon" onClick={openDialog}>
        <Trash2 className="text-destructive h-4 w-4" />
      </Button>

      <DeleteDialog
        open={isOpen}
        onOpenChange={closeDialog}
        onConfirm={handleDelete}
        title="공지사항 삭제"
        description={
          announcementTitle
            ? `정말로 "${announcementTitle}" 공지를 삭제하시겠습니까?`
            : '정말로 이 공지를 삭제하시겠습니까?'
        }
      />
    </>
  );
}

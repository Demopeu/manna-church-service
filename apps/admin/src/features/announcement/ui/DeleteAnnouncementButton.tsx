'use client';

import { Button, DeleteDialog } from '@/shared/ui';
import { Trash2 } from 'lucide-react';
import { useDeleteAnnouncement } from '../model/use-delete-announcement';

interface Props {
  announcementId: string;
  announcementTitle?: string;
}

export function DeleteAnnouncementButton({
  announcementId,
  announcementTitle,
}: Props) {
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
        title="공지를 삭제하시겠습니까?"
        description={
          announcementTitle
            ? `"${announcementTitle}" 공지가 영구적으로 삭제됩니다.`
            : '이 작업은 되돌릴 수 없습니다. 선택한 공지가 영구적으로 삭제됩니다.'
        }
      />
    </>
  );
}

'use client';

import { Trash2 } from 'lucide-react';
import { Button, DeleteDialog } from '@/shared/ui';
import { useDeleteSermon } from '../model/use-delete-sermon';

interface DeleteSermonButtonProps {
  sermonId: string;
  sermonTitle?: string;
}

export function DeleteSermonButton({
  sermonId,
  sermonTitle,
}: DeleteSermonButtonProps) {
  const { isOpen, openDialog, closeDialog, handleDelete } =
    useDeleteSermon(sermonId);
  return (
    <>
      <Button variant="ghost" size="icon" onClick={openDialog}>
        <Trash2 className="text-destructive h-4 w-4" />
      </Button>

      <DeleteDialog
        open={isOpen}
        onOpenChange={closeDialog}
        onConfirm={handleDelete}
        title="설교를 삭제하시겠습니까?"
        description={
          sermonTitle
            ? `"${sermonTitle}" 설교가 영구적으로 삭제됩니다.`
            : '이 작업은 되돌릴 수 없습니다. 선택한 설교가 영구적으로 삭제됩니다.'
        }
      />
    </>
  );
}

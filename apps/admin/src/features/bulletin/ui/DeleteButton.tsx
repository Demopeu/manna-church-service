'use client';

import { Trash2 } from 'lucide-react';
import { Button, DeleteDialog } from '@/shared/ui';
import { useDeleteBulletin } from '../model/use-delete-bulletin';

interface DeleteBulletinButtonProps {
  bulletinId: string;
  bulletinDate?: string;
}

export function DeleteBulletinButton({
  bulletinId,
  bulletinDate,
}: DeleteBulletinButtonProps) {
  const { isOpen, openDialog, closeDialog, handleDelete } =
    useDeleteBulletin(bulletinId);

  return (
    <>
      <Button variant="ghost" size="icon" onClick={openDialog}>
        <Trash2 className="text-destructive h-4 w-4" />
      </Button>

      <DeleteDialog
        open={isOpen}
        onOpenChange={closeDialog}
        onConfirm={handleDelete}
        title="주보를 삭제하시겠습니까?"
        description={
          bulletinDate
            ? `${bulletinDate} 주보가 영구적으로 삭제됩니다.`
            : '이 작업은 되돌릴 수 없습니다. 선택한 주보가 영구적으로 삭제됩니다.'
        }
      />
    </>
  );
}

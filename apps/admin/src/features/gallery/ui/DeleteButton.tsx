'use client';

import { Trash2 } from 'lucide-react';
import { Button, DeleteDialog } from '@/shared/ui';
import { useDeleteAlbum } from '../model/use-delete-album';

interface DeleteAlbumButtonProps {
  albumId: string;
  albumTitle?: string;
}

export function DeleteAlbumButton({
  albumId,
  albumTitle,
}: DeleteAlbumButtonProps) {
  const { isOpen, openDialog, closeDialog, handleDelete } =
    useDeleteAlbum(albumId);

  return (
    <>
      <Button variant="ghost" size="icon" onClick={openDialog}>
        <Trash2 className="text-destructive h-4 w-4" />
      </Button>

      <DeleteDialog
        open={isOpen}
        onOpenChange={closeDialog}
        onConfirm={handleDelete}
        title="앨범 삭제"
        description={
          albumTitle
            ? `정말로 "${albumTitle}" 앨범을 삭제하시겠습니까?`
            : '정말로 이 앨범을 삭제하시겠습니까?'
        }
      />
    </>
  );
}

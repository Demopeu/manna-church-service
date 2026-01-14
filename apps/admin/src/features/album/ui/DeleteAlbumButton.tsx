'use client';

import { Button, DeleteDialog } from '@/shared/ui';
import { Trash2 } from 'lucide-react';
import { useDeleteAlbum } from '../model/use-delete-album';

interface Props {
  albumId: string;
  albumTitle?: string;
}

export function DeleteAlbumButton({ albumId, albumTitle }: Props) {
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
        title="앨범을 삭제하시겠습니까?"
        description={
          albumTitle
            ? `"${albumTitle}" 앨범의 모든 사진이 영구적으로 삭제됩니다.`
            : '이 작업은 되돌릴 수 없습니다. 앨범의 모든 사진이 영구적으로 삭제됩니다.'
        }
      />
    </>
  );
}

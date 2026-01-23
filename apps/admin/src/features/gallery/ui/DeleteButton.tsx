'use client';

import { Trash2 } from 'lucide-react';
import { Button, DeleteDialog } from '@/shared/ui';
import { useDeleteGallery } from '../model/use-delete';

interface Props {
  galleryId: string;
  galleryTitle: string;
}

export function DeleteGalleryButton({ galleryId, galleryTitle }: Props) {
  const { isOpen, open, close, handleDelete } = useDeleteGallery(galleryId);

  return (
    <>
      <Button variant="ghost" size="icon" onClick={open}>
        <Trash2 className="text-destructive h-4 w-4" />
      </Button>

      <DeleteDialog
        open={isOpen}
        onOpenChange={close}
        onConfirm={handleDelete}
        title="갤러리를 삭제하시겠습니까?"
        description={`${galleryTitle}(이)가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.`}
      />
    </>
  );
}

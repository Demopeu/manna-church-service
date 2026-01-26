'use client';

import { Trash2 } from 'lucide-react';
import { Button, DeleteDialog, LoadingProgress } from '@/shared/ui';
import { useDeleteGallery } from '../model/use-delete';

interface Props {
  galleryId: string;
  galleryTitle: string;
}

export function DeleteGalleryButton({ galleryId, galleryTitle }: Props) {
  const { isOpen, open, close, handleDelete, isDeleting } =
    useDeleteGallery(galleryId);

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
      <LoadingProgress
        isPending={isDeleting}
        message="정보를 영구적으로 삭제하고 있습니다... 잠시만 기다려주세요."
        className="fixed inset-0 z-50 h-screen w-screen"
      />
    </>
  );
}

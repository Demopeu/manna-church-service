'use client';

import { Button, DeleteDialog } from '@/shared/ui';
import { Trash2 } from 'lucide-react';
import { useDeleteEvent } from '../model/use-delete-event';

interface DeleteEventButtonProps {
  eventId: string;
  eventTitle?: string;
}

export function DeleteEventButton({
  eventId,
  eventTitle,
}: DeleteEventButtonProps) {
  const { isOpen, openDialog, closeDialog, handleDelete } =
    useDeleteEvent(eventId);

  return (
    <>
      <Button variant="ghost" size="icon" onClick={openDialog}>
        <Trash2 className="text-destructive h-4 w-4" />
      </Button>

      <DeleteDialog
        open={isOpen}
        onOpenChange={closeDialog}
        onConfirm={handleDelete}
        title="이벤트 삭제"
        description={
          eventTitle
            ? `정말로 "${eventTitle}" 이벤트를 삭제하시겠습니까?`
            : '정말로 이 이벤트를 삭제하시겠습니까?'
        }
      />
    </>
  );
}

'use client';

import { Button, DeleteDialog } from '@/shared/ui';
import { Trash2 } from 'lucide-react';
import { useDeleteEvent } from '../model/use-delete-event';

interface Props {
  eventId: string;
  eventTitle?: string;
}

export function DeleteEventButton({ eventId, eventTitle }: Props) {
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
        title="이벤트를 삭제하시겠습니까?"
        description={
          eventTitle
            ? `"${eventTitle}" 이벤트가 영구적으로 삭제됩니다.`
            : '이 작업은 되돌릴 수 없습니다. 선택한 이벤트가 영구적으로 삭제됩니다.'
        }
      />
    </>
  );
}

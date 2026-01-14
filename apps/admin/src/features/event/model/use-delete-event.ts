'use client';

import { useState } from 'react';

export function useDeleteEvent(eventId: string) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    console.log('이벤트 삭제 실행:', eventId);
    setIsOpen(false);
  };

  const openDialog = () => setIsOpen(true);
  const closeDialog = (open: boolean) => setIsOpen(open);

  return {
    isOpen,
    openDialog,
    closeDialog,
    handleDelete,
  };
}

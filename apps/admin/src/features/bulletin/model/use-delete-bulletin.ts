'use client';

import { useState } from 'react';

export function useDeleteBulletin(bulletinId: string) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    console.log('주보 삭제 실행:', bulletinId);
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

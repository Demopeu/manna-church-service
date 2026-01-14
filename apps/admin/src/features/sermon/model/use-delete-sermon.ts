'use client';

import { useState } from 'react';

export function useDeleteSermon(sermonId: string) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    console.log('설교 삭제 실행:', sermonId);
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

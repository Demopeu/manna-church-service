'use client';

import { useState } from 'react';

export function useDeleteAlbum(albumId: string) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    console.log('앨범 삭제 실행:', albumId);
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

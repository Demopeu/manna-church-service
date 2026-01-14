'use client';

import { useState } from 'react';

export function useDeleteAnnouncement(announcementId: string) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    console.log('공지 삭제 실행:', announcementId);
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

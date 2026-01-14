'use client';

export function useEditAnnouncement(onEdit: () => void) {
  const handleEdit = () => {
    onEdit();
  };

  return {
    handleEdit,
  };
}

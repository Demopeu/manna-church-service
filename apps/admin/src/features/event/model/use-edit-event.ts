'use client';

export function useEditEvent(onEdit: () => void) {
  const handleEdit = () => {
    onEdit();
  };

  return {
    handleEdit,
  };
}

'use client';

export function useEditBulletin(bulletinId: string) {
  const handleEdit = () => {
    console.log('주보 수정 로직 시작:', bulletinId);
  };

  return {
    handleEdit,
  };
}

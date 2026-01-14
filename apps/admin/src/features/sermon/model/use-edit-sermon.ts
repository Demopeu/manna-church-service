'use client';

export function useEditSermon(sermonId: string) {
  const handleEdit = () => {
    console.log('설교 수정 로직 시작:', sermonId);
  };

  return {
    handleEdit,
  };
}

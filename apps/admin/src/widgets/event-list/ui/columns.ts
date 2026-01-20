export const COLUMNS = [
  { key: 'image', header: '사진', className: 'w-20' },
  { key: 'title', header: '제목', className: 'min-w-[150px]' },
  { key: 'description', header: '설명', className: 'min-w-[250px]' },
  { key: 'startDate', header: '시작일' },
  { key: 'actions', header: '관리', className: 'text-right' },
] as const;

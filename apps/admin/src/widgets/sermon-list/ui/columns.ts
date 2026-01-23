export const COLUMNS = [
  { key: 'title', header: '제목', className: 'min-w-[150px]' },
  { key: 'preacher', header: '설교자' },
  { key: 'date', header: '날짜' },
  { key: 'videoUrl', header: '링크' },
  { key: 'actions', header: '관리', className: 'text-right' },
] as const;

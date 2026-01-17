export const COLUMNS = [
  { key: 'sortOrder', header: '순서', className: 'w-16 text-center' },
  { key: 'photo', header: '사진' },
  { key: 'name', header: '이름' },
  { key: 'role', header: '직분' },
  { key: 'contact', header: '연락처' },
  { key: 'introduction', header: '담당/소개' },
  { key: 'isPublic', header: '노출', className: 'text-center' },
  { key: 'actions', header: '관리', className: 'text-right' },
] as const;

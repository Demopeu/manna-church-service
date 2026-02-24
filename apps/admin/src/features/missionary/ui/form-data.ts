import { Missionary } from '@/entities/missionary';

const FORM_TEXT = {
  CREATE: {
    title: '선교사 추가',
    description: '새로운 선교사를 추가합니다.',
    submitBtn: '추가',
    loadingBtn: '추가 중...',
    successDescription: '새로운 선교사가 추가되었습니다.',
  },
  EDIT: {
    title: '선교사 수정',
    description: '선교사 정보를 수정합니다.',
    submitBtn: '수정',
    loadingBtn: '수정 중...',
    successDescription: '선교사 정보가 수정되었습니다.',
  },
} as const;

export function getFormText(missionary?: Missionary) {
  return missionary ? FORM_TEXT.EDIT : FORM_TEXT.CREATE;
}

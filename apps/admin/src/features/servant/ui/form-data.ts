import { Servant } from '@/entities/servant';

const FORM_TEXT = {
  CREATE: {
    title: '섬기는 사람 추가',
    description: '새로운 섬기는 사람을 추가합니다.',
    submitBtn: '추가',
    loadingBtn: '추가 중...',
    successDescription: '새로운 섬기는 사람이 추가되었습니다.',
  },
  EDIT: {
    title: '섬기는 사람 수정',
    description: '섬기는 사람 정보를 수정합니다.',
    submitBtn: '수정',
    loadingBtn: '수정 중...',
    successDescription: '섬기는 사람 정보가 수정되었습니다.',
  },
} as const;

export function getFormText(servant?: Servant) {
  return servant ? FORM_TEXT.EDIT : FORM_TEXT.CREATE;
}

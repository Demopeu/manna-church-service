import { Event } from '@/entities/event';

const FORM_TEXT = {
  CREATE: {
    title: '이벤트 등록',
    description: '새 이벤트를 등록합니다.',
    submitBtn: '등록하기',
    loadingBtn: '등록 중...',
    imageHelp: 'JPG, PNG, WebP 지원 (최대 10MB)',
    successDescription: '이벤트가 성공적으로 등록되었습니다.',
  },
  EDIT: {
    title: '이벤트 수정',
    description: '이벤트 정보를 수정합니다.',
    submitBtn: '수정하기',
    loadingBtn: '수정 중...',
    imageHelp: 'JPG, PNG, WebP 지원 (최대 10MB)',
    successDescription: '이벤트 정보가 성공적으로 수정되었습니다.',
  },
} as const;

export function getFormText(event?: Event) {
  return event ? FORM_TEXT.EDIT : FORM_TEXT.CREATE;
}

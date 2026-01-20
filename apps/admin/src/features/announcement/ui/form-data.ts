'use client';

import { Announcement } from '@/entities/announcement';

const FORM_TEXT = {
  CREATE: {
    title: '공지사항 등록',
    description: '새로운 공지사항을 등록합니다.',
    submitBtn: '등록하기',
    loadingBtn: '등록 중...',
    successDescription: '공지사항이 성공적으로 등록되었습니다.',
  },
  EDIT: {
    title: '공지사항 수정',
    description: '기존 공지사항을 수정합니다.',
    submitBtn: '수정 완료',
    loadingBtn: '수정 중...',
    successDescription: '공지사항이 성공적으로 수정되었습니다.',
  },
} as const;

export function getFormText(announcement?: Announcement) {
  return announcement ? FORM_TEXT.EDIT : FORM_TEXT.CREATE;
}

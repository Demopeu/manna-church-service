'use client';

import { GalleryWithImages } from '@/entities/gallery';

const FORM_TEXT = {
  CREATE: {
    title: '갤러리 등록',
    description: '새 갤러리를 만들고 사진을 업로드합니다.',
    submitBtn: '등록하기',
    loadingBtn: '등록 중...',
    imageUploadGuide:
      '여러 장 업로드 후 별표(★)를 눌러 대표 이미지 1개를 선택하세요.',
    successDescription: '갤러리가 성공적으로 등록되었습니다.',
  },
  EDIT: {
    title: '갤러리 수정',
    description: '갤러리 정보를 수정합니다.',
    submitBtn: '수정하기',
    loadingBtn: '수정 중...',
    imageUploadGuide: '별표(★)를 눌러 대표 이미지를 변경할 수 있습니다.',
    successDescription: '갤러리 정보가 성공적으로 수정되었습니다.',
  },
} as const;

export function getFormText(gallery?: GalleryWithImages) {
  return gallery ? FORM_TEXT.EDIT : FORM_TEXT.CREATE;
}

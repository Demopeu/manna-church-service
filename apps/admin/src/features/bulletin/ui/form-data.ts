import { Bulletin } from '@/entities/bulletin';

const FORM_TEXT = {
  CREATE: {
    title: '주보 등록',
    description: '주보 PDF 파일을 업로드합니다.',
    submitBtn: '등록하기',
    loadingBtn: '등록 중...',
    pdfHelp: '💡 PDF 파일을 드래그하거나 클릭하여 업로드하세요 (최대 10MB)',
    successDescription: '주보가 성공적으로 등록되었습니다.',
  },
  EDIT: {
    title: '주보 수정',
    description: '기존 주보 정보를 수정합니다.',
    submitBtn: '수정 완료',
    loadingBtn: '수정 중...',
    pdfHelp: '💡 새 PDF 파일을 업로드하면 기존 파일이 대체됩니다.',
    successDescription: '주보 정보가 성공적으로 수정되었습니다.',
  },
} as const;

export function getFormText(bulletin?: Bulletin) {
  return bulletin ? FORM_TEXT.EDIT : FORM_TEXT.CREATE;
}

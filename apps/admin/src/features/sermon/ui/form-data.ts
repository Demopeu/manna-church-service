import { Sermon } from '@/entities/sermon';

const FORM_TEXT = {
  CREATE: {
    title: '설교 등록',
    description: '새로운 설교 영상을 등록합니다.',
    submitBtn: '등록하기',
    loadingBtn: '등록 중...',
    youtubeHelp: '💡 유튜브 영상 주소를 붙여넣으면 영상 ID를 자동 추출합니다',
    successMsg: '설교가 성공적으로 등록되었습니다.',
    successTitle: '설교 등록 성공',
    successDescription: '설교가 성공적으로 등록되었습니다.',
  },
  EDIT: {
    title: '설교 수정',
    description: '기존 설교 정보를 수정합니다.',
    submitBtn: '수정 완료',
    loadingBtn: '수정 중...',
    youtubeHelp: '💡 링크를 수정하면 ID가 자동으로 갱신됩니다.',
    successMsg: '설교 정보가 수정되었습니다.',
    successTitle: '설교 수정 성공',
    successDescription: '설교 정보가 성공적으로 수정되었습니다.',
  },
} as const;

export function getFormText(sermon?: Sermon) {
  return sermon ? FORM_TEXT.EDIT : FORM_TEXT.CREATE;
}

export const BANNER_MANAGEMENT_UI = {
  TITLE: '배너 관리',
  DESCRIPTION_LINE1:
    '홈페이지 메인 배너를 관리합니다. 위에서부터 차례대로 페이지에 표시되며,',
  DESCRIPTION_LINE2_FN: (count: number, max: number) =>
    `드래그하여 순서를 변경할 수 있습니다. 최대 ${max}개까지 등록 가능합니다. (${count}/${max})`,
  ERROR_DESCRIPTION: '배너 목록을 불러오는 중 오류가 발생했습니다.',
  DELETE_TITLE: '배너를 삭제하시겠습니까?',
  DELETE_DESCRIPTION: '삭제된 배너 이미지는 복구할 수 없습니다.',
  MAX_BANNERS: 6,
  MAX_FILE_SIZE_MB: 10,
} as const;

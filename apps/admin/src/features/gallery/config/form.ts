export const FORM_TEXT = {
  CREATE: {
    title: '앨범 만들기',
    description:
      '새 앨범을 만들고 사진을 업로드합니다. 별표를 눌러 대표 이미지를 선택하세요.',
    submitBtn: '앨범 만들기',
    loadingBtn: '업로드 중...',
    imageUploadGuide:
      '여러 장 업로드 후 별표(★)를 눌러 대표 이미지 1개를 선택하세요.',
  },
  EDIT: {
    title: '앨범 수정',
    description: '앨범 정보를 수정합니다.',
    submitBtn: '수정하기',
    loadingBtn: '수정 중...',
    imageUploadGuide: '별표(★)를 눌러 대표 이미지를 변경할 수 있습니다.',
  },
} as const;

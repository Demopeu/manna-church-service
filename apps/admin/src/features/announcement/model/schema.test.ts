import { expect, test } from 'vitest';
import { createAnnouncementSchema } from './schema';

test('모든 값이 올바르고 날짜가 YYYY-MM-DD 형식이면 통과한다', () => {
  const validData = {
    title: '테스트 공지사항',
    content: '테스트 내용',
    isUrgent: false,
    startDate: '2026-05-12',
  };

  const result = createAnnouncementSchema.safeParse(validData);
  expect(result.success).toBe(true);
});

test('제목이 비어있으면 실패하고 알맞은 에러 메시지를 반환한다', () => {
  const emptyTitleData = {
    title: '',
    content: '테스트 내용',
    isUrgent: false,
    startDate: '2026-05-12',
  };

  const result = createAnnouncementSchema.safeParse(emptyTitleData);
  expect(result.success).toBe(false);

  if (!result.success) {
    const titleError = result.error.issues.find((issue) =>
      issue.path.includes('title'),
    );
    expect(titleError?.message).toBe('제목을 입력해주세요.');
  }
});

test('내용이 비어있으면 실패하고 알맞은 에러 메시지를 반환한다', () => {
  const emptyContentData = {
    title: '테스트 공지사항',
    content: '',
    isUrgent: false,
    startDate: '2026-05-12',
  };

  const result = createAnnouncementSchema.safeParse(emptyContentData);
  expect(result.success).toBe(false);

  if (!result.success) {
    const contentError = result.error.issues.find((issue) =>
      issue.path.includes('content'),
    );
    expect(contentError?.message).toBe('내용을 입력해주세요.');
  }
});

test('시작날짜가 비어있으면 실패하고 필수 입력 에러 메시지를 반환한다', () => {
  const emptyDateData = {
    title: '테스트 공지사항',
    content: '테스트 내용',
    isUrgent: false,
    startDate: '',
  };

  const result = createAnnouncementSchema.safeParse(emptyDateData);
  expect(result.success).toBe(false);

  if (!result.success) {
    const startDateError = result.error.issues.find((issue) =>
      issue.path.includes('startDate'),
    );
    expect(startDateError?.message).toBe('시작날짜를 입력해주세요.');
  }
});

test('시작날짜 형식이 틀리면(예: 2026/05/12) 실패하고 형식 에러 메시지를 반환한다', () => {
  const invalidFormatData = {
    title: '테스트 공지사항',
    content: '테스트 내용',
    isUrgent: false,
    startDate: '2026/05/12',
  };

  const result = createAnnouncementSchema.safeParse(invalidFormatData);
  expect(result.success).toBe(false);

  if (!result.success) {
    const startDateError = result.error.issues.find((issue) =>
      issue.path.includes('startDate'),
    );
    expect(startDateError?.message).toBe('YYYY-MM-DD 형식으로 입력해주세요.');
  }
});

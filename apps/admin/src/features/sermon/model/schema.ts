import { z } from 'zod';

export const sermonSchema = z.object({
  title: z.string().min(1, '설교 제목을 입력해주세요.'),
  preacher: z.string().min(1, '설교자를 입력해주세요.'),
  preached_at: z.string().min(1, '설교 날짜를 선택해주세요.'),
  video_url: z.string().url('올바른 URL 형식이 아닙니다.'),
});

export type SermonFormSchema = z.infer<typeof sermonSchema>;

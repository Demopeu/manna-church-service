import { z } from 'zod';
import { ActionState } from '@/shared/model';
import { extractVideoId } from '../lib/extract-video-id';

export const createSermonSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.'),
  preacher: z.string().min(1, '설교자를 입력해주세요.'),
  date: z.string().date('설교 날짜를 선택해주세요.'),
  youtubeUrl: z
    .string()
    .url('올바른 URL 형식이 아닙니다.')
    .refine((url) => extractVideoId(url) !== null, {
      message: '유효한 유튜브 영상 주소가 아닙니다.',
    }),
});

export type CreateSermonInput = z.infer<typeof createSermonSchema>;

export const initialState: ActionState = {
  success: false,
  message: '',
};

import { z } from 'zod';
import { ActionState } from '@/shared/model';

export const createAnnouncementSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.'),
  content: z.string().min(1, '내용을 입력해주세요.'),
  isUrgent: z.boolean(),
  startDate: z
    .string()
    .min(1, '시작날짜를 입력해주세요.')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD 형식으로 입력해주세요.'),
});

export type CreateAnnouncementInput = z.infer<typeof createAnnouncementSchema>;

export const initialState: ActionState = {
  success: false,
  message: '',
};

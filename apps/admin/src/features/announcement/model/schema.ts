import { z } from 'zod';
import { ActionState } from '@/shared/model';

export const createAnnouncementSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.'),
  content: z.string().min(1, '내용을 입력해주세요.'),
  isUrgent: z.boolean(),
});

export type CreateAnnouncementInput = z.infer<typeof createAnnouncementSchema>;

export const initialState: ActionState = {
  success: false,
  message: '',
};

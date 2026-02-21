import { z } from 'zod';
import type { ActionState } from '@/shared/model';

export const bannerItemSchema = z.object({
  title: z.string().min(1, '배너 제목을 입력해주세요.'),
});

export type BannerItemValues = z.infer<typeof bannerItemSchema>;

export const createBannerActionSchema = z.object({
  imageFile: z
    .instanceof(File, { message: '이미지 파일이 필요합니다.' })
    .refine((file) => file.size > 0, { message: '이미지 파일이 필요합니다.' }),
  title: z.string().optional().default(''),
});

export type CreateBannerActionInput = z.infer<typeof createBannerActionSchema>;

export const initialState: ActionState = {
  success: false,
  message: '',
};

import { z } from 'zod';
import { ActionState } from '@/shared/model';

export const createBulletinSchema = z.object({
  publishedAt: z.string().date('게시 날짜를 선택해주세요.'),
  pdfFile: z
    .instanceof(File, { message: 'PDF 파일을 업로드해주세요.' })
    .refine((file) => file.type === 'application/pdf', {
      message: 'PDF 파일만 업로드 가능합니다.',
    })
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: '파일 크기는 10MB 이하여야 합니다.',
    }),
});

export type CreateBulletinInput = z.infer<typeof createBulletinSchema>;

export const initialState: ActionState = {
  success: false,
  message: '',
};

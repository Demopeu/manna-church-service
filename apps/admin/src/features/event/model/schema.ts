import { z } from 'zod';
import { ActionState } from '@/shared/model';

export const createEventSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.'),
  description: z.string().min(1, '설명을 입력해주세요.'),
  startDate: z.string().date('시작 날짜를 선택해주세요.'),
  photoFile: z
    .instanceof(File, { message: '이미지 파일을 업로드해주세요.' })
    .refine(
      (file) =>
        ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(
          file.type,
        ),
      {
        message: 'JPG, PNG, WebP 파일만 업로드 가능합니다.',
      },
    )
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: '파일 크기는 5MB 이하여야 합니다.',
    }),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;

export const initialState: ActionState = {
  success: false,
  message: '',
};

import { z } from 'zod';
import { ActionState } from '@/shared/model';

const photoFileSchema = z
  .instanceof(File, { message: '선교사 사진을 업로드해주세요.' })
  .refine(
    (file) =>
      ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(
        file.type,
      ),
    {
      message: 'JPG, PNG, WebP 파일만 업로드 가능합니다.',
    },
  )
  .refine((file) => file.size <= 10 * 1024 * 1024, {
    message: '파일 크기는 10MB 이하여야 합니다.',
  });

const missionaryBaseSchema = z.object({
  name: z
    .string()
    .min(1, '이름을 입력해주세요.')
    .max(50, '이름은 50자 이내로 입력해주세요.'),
  country: z.string().min(1, '파송 국가를 입력해주세요.'),
  description: z.string().optional(),
  photoFile: photoFileSchema.optional().nullable(),
});

export const createMissionarySchema = missionaryBaseSchema.extend({
  photoFile: photoFileSchema.optional().nullable(),
});

export const updateMissionarySchema = missionaryBaseSchema.extend({
  photoFile: photoFileSchema.optional().nullable(),
});

export type CreateMissionaryInput = z.infer<typeof createMissionarySchema>;
export type UpdateMissionaryInput = z.infer<typeof updateMissionarySchema>;

export const initialState: ActionState = {
  success: false,
  message: '',
};

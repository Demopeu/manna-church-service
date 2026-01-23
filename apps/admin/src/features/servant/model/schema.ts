import { z } from 'zod';
import { ActionState } from '@/shared/model';

const photoFileSchema = z
  .instanceof(File, { message: '프로필 사진을 업로드해주세요.' })
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

const servantBaseSchema = z.object({
  name: z
    .string()
    .min(1, '이름을 입력해주세요.')
    .max(50, '이름은 50자 이내로 입력해주세요.'),
  role: z.string().min(1, '직분을 선택해주세요.'),
  contact: z.string().optional(),
  introduction: z.string().optional(),
  isPublic: z.boolean(),
  sortOrder: z.number().int().min(1, '정렬 순서는 1 이상이어야 합니다.'),
});

export const createServantSchema = servantBaseSchema.extend({
  photoFile: photoFileSchema,
});

export const updateServantSchema = servantBaseSchema.extend({
  photoFile: photoFileSchema.optional().nullable(),
});

export type CreateServantInput = z.infer<typeof createServantSchema>;
export type UpdateServantInput = z.infer<typeof updateServantSchema>;

export const initialState: ActionState = {
  success: false,
  message: '',
};

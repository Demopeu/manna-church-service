import { z } from 'zod';
import { ActionState } from '@/shared/model';

const coverImageFileSchema = z
  .instanceof(File, { message: '표지 이미지를 업로드해주세요.' })
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

const smartFileSchema = z.preprocess(
  (val) => {
    if (typeof val === 'string' && val === 'null') return null;

    if (val === undefined) return undefined;

    return val;
  },
  z.union([z.instanceof(File), z.null()]).optional(),
);

const pdfFileSchema = z
  .instanceof(File, { message: 'PDF 파일을 업로드해주세요.' })
  .refine((file) => file.type === 'application/pdf', {
    message: 'PDF 파일만 업로드 가능합니다.',
  })
  .refine((file) => file.size <= 10 * 1024 * 1024, {
    message: '파일 크기는 10MB 이하여야 합니다.',
  });

const bulletinBaseSchema = z.object({
  publishedAt: z.string().min(1, '게시 날짜를 선택해주세요.'),
});

const imageFilesSchema = z
  .array(z.instanceof(File))
  .min(1, '주보 이미지가 변환되지 않았습니다. PDF를 다시 선택해주세요.');

export const createBulletinSchema = bulletinBaseSchema.extend({
  coverImageFile: coverImageFileSchema.optional().nullable(),
  pdfFile: pdfFileSchema,
});

export const createBulletinActionSchema = bulletinBaseSchema.extend({
  coverImageFile: coverImageFileSchema.optional().nullable(),
  pdfFile: z.instanceof(File).optional(),
  imageFiles: imageFilesSchema,
});

export const updateBulletinSchema = bulletinBaseSchema.extend({
  coverImageFile: smartFileSchema,
  pdfFile: pdfFileSchema.optional().nullable(),
  imageFiles: z.array(z.instanceof(File)).optional(),
});

export type CreateBulletinInput = z.infer<typeof createBulletinSchema>;
export type CreateBulletinActionInput = z.infer<
  typeof createBulletinActionSchema
>;
export type UpdateBulletinInput = z.infer<typeof updateBulletinSchema>;

export const initialState: ActionState = {
  success: false,
  message: '',
};

import { z } from 'zod';
import { ActionState } from '@/shared/model';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

const imageObjectSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      '파일 크기는 10MB 이하여야 합니다.',
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      '지원되는 이미지 형식: JPG, PNG, WebP',
    )
    .nullable()
    .optional(),
  isThumbnail: z.boolean(),
  id: z.string().optional(),
});

export const createGallerySchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.'),
  eventDate: z.string().min(1, '날짜를 선택해주세요.'),
  images: z
    .array(imageObjectSchema)
    .min(1, '최소 1개 이상의 이미지를 업로드해주세요.')
    .max(10, '이미지는 최대 10장까지만 업로드할 수 있습니다.')
    .refine(
      (images) => images.some((img) => img.isThumbnail),
      '대표 이미지를 선택해주세요.',
    ),
});

export const updateGallerySchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, '제목을 입력해주세요.'),
  eventDate: z.string().min(1, '날짜를 선택해주세요.'),
  images: z
    .array(imageObjectSchema)
    .min(1, '최소 1개 이상의 이미지를 남겨주세요.')
    .max(10, '이미지는 최대 10장까지만 업로드할 수 있습니다.')
    .refine(
      (images) => images.some((img) => img.isThumbnail),
      '대표 이미지를 선택해주세요.',
    ),
});

export type CreateGalleryInput = z.infer<typeof createGallerySchema>;
export type UpdateGalleryInput = z.infer<typeof updateGallerySchema>;
export type ImageObject = z.infer<typeof imageObjectSchema>;

export const initialState: ActionState = {
  success: false,
  message: '',
};

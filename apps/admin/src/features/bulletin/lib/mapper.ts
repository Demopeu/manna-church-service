import { Bulletin } from '@/entities/bulletin';

export const getDefaultValues = (bulletin?: Bulletin) => ({
  publishedAt: bulletin?.publishedAt ?? '',
  coverImageUrl: bulletin?.coverImageUrl ?? '',
  pdfFile: null as File | null,
  coverImageFile: null as File | null,
});

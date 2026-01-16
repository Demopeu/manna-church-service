import { Bulletin } from '@/entities/bulletin';

export const getDefaultValues = (bulletin?: Bulletin) => ({
  publishedAt: bulletin?.publishedAt ?? '',
  pdfFile: null as File | null,
});

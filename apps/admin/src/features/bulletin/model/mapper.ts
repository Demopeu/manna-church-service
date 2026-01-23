import { Bulletin } from '@/entities/bulletin';

export const getDefaultValues = (bulletin?: Bulletin) => ({
  publishedAt: bulletin?.publishedAt || '',
  coverImageFile: undefined as File | undefined,
  pdfFile: undefined as File | undefined,
});

export function toFormData(data: {
  publishedAt: string;
  coverImageFile?: File | null;
  pdfFile?: File | null;
}): FormData {
  const formData = new FormData();
  formData.append('publishedAt', data.publishedAt);
  if (data.coverImageFile) {
    formData.append('coverImageFile', data.coverImageFile);
  }
  if (data.pdfFile) {
    formData.append('pdfFile', data.pdfFile);
  }
  return formData;
}

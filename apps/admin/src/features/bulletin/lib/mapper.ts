import { Bulletin } from '@/entities/bulletin';
import { CreateBulletinInput } from '../model/schema';

export const getDefaultValues = (bulletin?: Bulletin): CreateBulletinInput => ({
  publishedAt: bulletin?.publishedAt ?? '',
  coverImageFile: null as unknown as File,
  pdfFile: null as unknown as File,
});

export function toFormData(data: CreateBulletinInput): FormData {
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

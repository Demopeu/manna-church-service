import type { Servant } from '@/entities/servant';
import { CreateServantInput } from '../model/schema';

export const getDefaultValues = (servant?: Servant): CreateServantInput => ({
  name: servant?.name ?? '',
  role: servant?.role ?? '',
  contact: servant?.contact ?? '',
  introduction: servant?.introduction ?? '',
  isPublic: servant?.isPublic ?? true,
  sortOrder: servant?.sortOrder ?? 1,
  photoFile: null as unknown as File,
});

export function toFormData(data: CreateServantInput): FormData {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('role', data.role);
  formData.append('contact', data.contact || '');
  formData.append('introduction', data.introduction || '');
  formData.append('isPublic', String(data.isPublic));
  formData.append('sortOrder', String(data.sortOrder));
  if (data.photoFile) {
    formData.append('photoFile', data.photoFile);
  }
  return formData;
}

import { Servant } from '@/entities/servant';

export const getDefaultValues = (servant?: Servant) => ({
  name: servant?.name || '',
  role: servant?.role || '',
  contact: servant?.contact || '',
  introduction: servant?.introduction || '',
  isPublic: servant?.isPublic ?? true,
  sortOrder: servant?.sortOrder || 1,
  photoFile: undefined as File | undefined,
});

export function toFormData(data: {
  name: string;
  role: string;
  contact?: string;
  introduction?: string;
  isPublic: boolean;
  sortOrder: number;
  photoFile?: File | null;
}): FormData {
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

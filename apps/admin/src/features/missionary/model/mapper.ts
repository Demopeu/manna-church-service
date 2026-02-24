import { Missionary } from '@/entities/missionary';

export const getDefaultValues = (missionary?: Missionary) => ({
  name: missionary?.name || '',
  country: missionary?.country || '',
  description: missionary?.description || '',
  photoFile: undefined as File | undefined,
});

export function toFormData(data: {
  name: string;
  country: string;
  description?: string;
  photoFile?: File | null;
}): FormData {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('country', data.country);
  formData.append('description', data.description || '');
  if (data.photoFile) {
    formData.append('photoFile', data.photoFile);
  }

  return formData;
}

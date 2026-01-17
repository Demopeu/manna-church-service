import type { Servant } from '@/entities/servant';

export const getDefaultValues = (servant?: Servant) => ({
  name: servant?.name ?? '',
  role: servant?.role ?? '',
  photoUrl: servant?.photoUrl ?? '',
  contact: servant?.contact ?? '',
  introduction: servant?.introduction ?? '',
  isPublic: servant?.isPublic ?? true,
  sortOrder: servant?.sortOrder ?? 1,
  photoFile: null as File | null,
});

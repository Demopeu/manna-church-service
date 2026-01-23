export interface Servant {
  id: string;
  name: string;
  role: string;
  photoFile: string | null;
  contact: string | null;
  introduction: string | null;
  isPublic: boolean;
  sortOrder: number;
  createdAt: string;
}

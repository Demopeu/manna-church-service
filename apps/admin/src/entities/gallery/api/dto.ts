import type { Database } from '@repo/database/types';

export type GalleryDto = Database['public']['Tables']['galleries']['Row'];
export type GalleryImageDto =
  Database['public']['Tables']['gallery_images']['Row'];

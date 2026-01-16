export interface GalleryDto {
  id: string;
  title: string;
  event_date: string;
  thumbnail_url: string | null;
  created_at: string;
}

export interface GalleryImageDto {
  id: string;
  gallery_id: string;
  storage_path: string;
  width: number;
  height: number;
  created_at: string;
}

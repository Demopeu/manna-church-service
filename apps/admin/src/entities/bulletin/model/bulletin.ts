export interface Bulletin {
  id: string;
  publishedAt: string;
  imageUrls: string[];
  coverImageUrl: string | null;
  originalPdfUrl: string | null;
  createdAt: string;
}

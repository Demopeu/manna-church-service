'use client';

import { useState, useCallback } from 'react';

export interface GalleryImage {
  id: string;
  url: string;
  isThumbnail: boolean;
}

interface AlbumFormData {
  title: string;
  date: string;
}

export function useAlbumForm(
  initialData?: AlbumFormData,
  initialImages?: GalleryImage[],
  onSuccess?: () => void,
) {
  const [formData, setFormData] = useState<AlbumFormData>(
    initialData || { title: '', date: '' },
  );
  const [dragActive, setDragActive] = useState(false);
  const [previews, setPreviews] = useState<GalleryImage[]>(initialImages || []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith('image/'),
    );
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const newImage: GalleryImage = {
          id: Date.now().toString() + Math.random(),
          url: reader.result as string,
          isThumbnail: false,
        };
        setPreviews((prev) => {
          if (prev.length === 0) {
            return [{ ...newImage, isThumbnail: true }];
          }
          return [...prev, newImage];
        });
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter((f) =>
      f.type.startsWith('image/'),
    );
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const newImage: GalleryImage = {
          id: Date.now().toString() + Math.random(),
          url: reader.result as string,
          isThumbnail: false,
        };
        setPreviews((prev) => {
          if (prev.length === 0) {
            return [{ ...newImage, isThumbnail: true }];
          }
          return [...prev, newImage];
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const removePreview = (id: string) => {
    setPreviews((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      const hasThumbnail = filtered.some((p) => p.isThumbnail);
      if (!hasThumbnail && filtered.length > 0) {
        filtered[0]!.isThumbnail = true;
      }
      return filtered;
    });
  };

  const setThumbnail = (id: string) => {
    setPreviews((prev) =>
      prev.map((p) => ({
        ...p,
        isThumbnail: p.id === id,
      })),
    );
  };

  const updateField = (field: keyof AlbumFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('앨범 생성:', { ...formData, images: previews });
    onSuccess?.();
  };

  const resetForm = () => {
    setFormData({ title: '', date: '' });
    setPreviews([]);
  };

  return {
    formData,
    dragActive,
    previews,
    updateField,
    handleDrag,
    handleDrop,
    handleFileSelect,
    removePreview,
    setThumbnail,
    handleSubmit,
    resetForm,
  };
}

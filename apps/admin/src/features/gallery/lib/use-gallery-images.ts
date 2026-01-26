'use client';

import { useEffect, useEffectEvent, useState } from 'react';
import { GalleryWithImages } from '@/entities/gallery';
import { ImageItem } from '@/shared/lib';

export interface GalleryFormImage extends ImageItem {
  isThumbnail: boolean;
}

interface UseGalleryImagesProps {
  initialData?: GalleryWithImages;
  onImagesChange?: (images: GalleryFormImage[]) => void;
}

export function useGalleryImages({
  initialData,
  onImagesChange,
}: UseGalleryImagesProps = {}) {
  const [dragActive, setDragActive] = useState(false);
  const [images, setImages] = useState<GalleryFormImage[]>(
    initialData
      ? initialData.images.map((img, index) => ({
          id: img.id,
          file: null,
          preview: img.storagePath,
          isThumbnail: index === 0,
        }))
      : [],
  );

  const cleanupImages = useEffectEvent(() => {
    images.forEach((image) => {
      if (image.preview.startsWith('blob:')) {
        URL.revokeObjectURL(image.preview);
      }
    });
  });

  useEffect(() => {
    return () => {
      cleanupImages();
    };
  }, []);

  const updateImages = (newImages: GalleryFormImage[]) => {
    setImages(newImages);
    onImagesChange?.(newImages);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const addFiles = (files: File[]) => {
    const validFiles = files.filter((f) => f.type.startsWith('image/'));
    if (validFiles.length === 0) return;

    const newItems: GalleryFormImage[] = validFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      isThumbnail: false,
    }));

    const hasExistingThumbnail = images.some((p) => p.isThumbnail);
    const firstNewItem = newItems[0];

    if (!hasExistingThumbnail && firstNewItem) {
      firstNewItem.isThumbnail = true;
    }

    const nextImages = [...images, ...newItems];
    updateImages(nextImages);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
    }
    e.target.value = '';
  };

  const removeImage = (id: string) => {
    const target = images.find((p) => p.id === id);
    const isRemovingThumbnail = target?.isThumbnail;

    if (target?.preview.startsWith('blob:')) {
      URL.revokeObjectURL(target.preview);
    }

    const filtered = images.filter((p) => p.id !== id);
    const firstItem = filtered[0];

    if (isRemovingThumbnail && firstItem) {
      firstItem.isThumbnail = true;
    }

    updateImages(filtered);
  };

  const setThumbnail = (id: string) => {
    const nextImages = images.map((p) => ({
      ...p,
      isThumbnail: p.id === id,
    }));
    updateImages(nextImages);
  };

  return {
    images,
    dragActive,
    handlers: {
      handleDrag,
      handleDrop,
      handleFileSelect,
      removeImage,
      setThumbnail,
    },
  };
}

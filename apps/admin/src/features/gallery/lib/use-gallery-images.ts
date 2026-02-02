'use client';

import { useEffect, useEffectEvent, useState } from 'react';
import * as Sentry from '@sentry/react';
import { toast } from 'sonner';
import { GalleryWithImages } from '@/entities/gallery';
import { ImageItem } from '@/shared/lib';

interface Props {
  initialData?: GalleryWithImages;
  onImagesChange?: (images: ImageItem[]) => void;
}

export function useGalleryImages({ initialData, onImagesChange }: Props = {}) {
  const [dragActive, setDragActive] = useState(false);
  const [images, setImages] = useState<ImageItem[]>(
    initialData
      ? initialData.images.map((img, index) => ({
          id: img.id,
          file: null,
          preview: img.storagePath,
          isThumbnail: initialData.thumbnailUrl
            ? img.storagePath === initialData.thumbnailUrl
            : index === 0,
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

  const updateImages = (newImages: ImageItem[]) => {
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

  const addFiles = async (files: File[]) => {
    if (images.length + files.length > 10) {
      toast.error('이미지는 최대 10장까지만 등록할 수 있습니다.');
      return;
    }
    const validFiles = files.filter((f) => f.type.startsWith('image/'));
    if (validFiles.length === 0) return;

    const toastId =
      validFiles.length > 1
        ? toast.loading(`이미지 ${validFiles.length}장을 순서대로 처리 중...`)
        : undefined;

    let successCount = 0;
    let failedCount = 0;

    const newItems: ImageItem[] = [];

    for (const file of validFiles) {
      try {
        await new Promise((resolve) => setTimeout(resolve, 50));

        const preview = URL.createObjectURL(file);
        const hasExistingThumbnail = images.some((p) => p.isThumbnail);
        const isFirstInBatch = newItems.length === 0;

        const newItem: ImageItem = {
          id: crypto.randomUUID(),
          file,
          preview,
          isThumbnail: !hasExistingThumbnail && isFirstInBatch,
        };

        newItems.push(newItem);
        successCount++;
      } catch (error) {
        console.error(`파일 처리 실패: ${file.name}`, error);
        Sentry.captureException(error);
        failedCount++;
      }
    }

    if (newItems.length > 0) {
      const nextImages = [...images, ...newItems];
      updateImages(nextImages);
    }

    if (toastId) {
      toast.dismiss(toastId);
    }

    if (successCount === 0 && failedCount > 0) {
      toast.error('이미지를 불러올 수 없습니다.');
    } else if (failedCount > 0) {
      toast.warning(`${successCount}장 추가 완료 (${failedCount}장 실패)`);
    } else if (validFiles.length > 1) {
      toast.success(`이미지 ${successCount}장이 추가되었습니다.`);
    }
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

    if (isRemovingThumbnail && filtered.length > 0) {
      const nextImages = filtered.map((img, index) =>
        index === 0 ? { ...img, isThumbnail: true } : img,
      );
      updateImages(nextImages);
    } else {
      updateImages(filtered);
    }
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

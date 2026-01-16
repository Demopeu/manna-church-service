'use client';

import { useActionState, useEffect, useState, useCallback } from 'react';
import { createGalleryAction, updateGalleryAction } from './actions';
import { initialState } from './schema';
import { getDefaultValues, GalleryFormImage } from '../lib/mapper';
import { FORM_TEXT } from '../config/form';
import { GalleryWithImages } from '@/entities/gallery';

interface UseGalleryFormProps {
  gallery?: GalleryWithImages;
  onSuccess: () => void;
}

export function useGalleryForm({ gallery, onSuccess }: UseGalleryFormProps) {
  const isEditMode = !!gallery;
  const action = isEditMode
    ? updateGalleryAction.bind(null, gallery.id)
    : createGalleryAction;

  const [state, formAction, isPending] = useActionState(action, initialState);

  const defaultValues = getDefaultValues(gallery);
  const uiText = isEditMode ? FORM_TEXT.EDIT : FORM_TEXT.CREATE;

  const [dragActive, setDragActive] = useState(false);
  const [previews, setPreviews] = useState<GalleryFormImage[]>(
    defaultValues.images,
  );

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
        const newImage: GalleryFormImage = {
          id: Date.now().toString() + Math.random(),
          url: reader.result as string,
          isThumbnail: false,
          file,
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
        const newImage: GalleryFormImage = {
          id: Date.now().toString() + Math.random(),
          url: reader.result as string,
          isThumbnail: false,
          file,
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

  useEffect(() => {
    if (state.success) {
      onSuccess();
    }
  }, [state.success, onSuccess]);

  return {
    state,
    action: formAction,
    isPending,
    defaultValues,
    uiText,
    dragActive,
    previews,
    handleDrag,
    handleDrop,
    handleFileSelect,
    removePreview,
    setThumbnail,
  };
}

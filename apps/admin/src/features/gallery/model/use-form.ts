'use client';

import {
  startTransition,
  useActionState,
  useCallback,
  useEffect,
  useEffectEvent,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GalleryWithImages } from '@/entities/gallery';
import { useToastAndRefresh } from '@/shared/lib';
import { createGalleryAction, updateGalleryAction } from '../api/actions';
import { GalleryFormImage, getDefaultValues, toFormData } from '../lib/mapper';
import {
  CreateGalleryInput,
  createGallerySchema,
  initialState,
} from './schema';

interface UseGalleryFormProps {
  gallery?: GalleryWithImages;
  onSuccess?: () => void;
  successMessage: string;
}

export function useGalleryForm({
  gallery,
  onSuccess,
  successMessage,
}: UseGalleryFormProps) {
  const { complete } = useToastAndRefresh(onSuccess);
  const MODE = gallery ? 'EDIT' : 'CREATE';
  const action =
    MODE === 'EDIT'
      ? updateGalleryAction.bind(null, gallery!.id)
      : createGalleryAction;

  const [state, formAction, isPending] = useActionState(action, initialState);

  const form = useForm<CreateGalleryInput>({
    resolver: zodResolver(createGallerySchema),
    defaultValues: getDefaultValues(gallery),
  });

  const hasChanges = MODE === 'CREATE' || form.formState.isDirty;

  const [dragActive, setDragActive] = useState(false);
  const [previews, setPreviews] = useState<GalleryFormImage[]>(
    gallery
      ? gallery.images.map((img, index) => ({
          id: img.id,
          file: null,
          preview: img.storagePath,
          isThumbnail: index === 0,
        }))
      : [],
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
      const preview = URL.createObjectURL(file);
      const newImage: GalleryFormImage = {
        id: crypto.randomUUID(),
        file,
        preview,
        isThumbnail: false,
      };
      setPreviews((prev) => {
        if (prev.length === 0) {
          return [{ ...newImage, isThumbnail: true }];
        }
        return [...prev, newImage];
      });
    });
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter((f) =>
      f.type.startsWith('image/'),
    );
    files.forEach((file) => {
      const preview = URL.createObjectURL(file);
      const newPreview: GalleryFormImage = {
        id: crypto.randomUUID(),
        file,
        preview,
        isThumbnail: previews.length === 0,
      };
      setPreviews((prev) => [...prev, newPreview]);
    });
  };

  const removePreview = (id: string) => {
    setPreviews((prev) => {
      const preview = prev.find((p) => p.id === id);
      if (preview?.preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview.preview);
      }
      return prev.filter((p) => p.id !== id);
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

  const handleError = useEffectEvent((currentState: typeof state) => {
    if (currentState && !currentState.success) {
      if (currentState.message) {
        form.setError('root', {
          type: 'server',
          message: currentState.message,
        });
      }
      if (currentState.fieldErrors) {
        Object.entries(currentState.fieldErrors).forEach(
          ([field, messages]) => {
            if (messages && messages[0]) {
              form.setError(field as keyof CreateGalleryInput, {
                type: 'server',
                message: messages[0],
              });
            }
          },
        );
      }
    }
  });

  const handleSuccess = useEffectEvent((currentState: typeof state) => {
    if (currentState?.success) {
      complete(successMessage);
    }
  });

  useEffect(() => {
    handleError(state);
    handleSuccess(state);
  }, [state]);

  const handleSubmit = form.handleSubmit((data) => {
    startTransition(() => {
      formAction(toFormData(data, previews));
    });
  });

  return {
    form,
    handleSubmit,
    isSubmitting: form.formState.isSubmitting || isPending,
    hasChanges,
    dragActive,
    previews,
    handleDrag,
    handleDrop,
    handleFileSelect,
    removePreview,
    setThumbnail,
  };
}

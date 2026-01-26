'use client';

import {
  startTransition,
  useActionState,
  useEffect,
  useEffectEvent,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GalleryWithImages } from '@/entities/gallery';
import { imageConverter, useToastAndRefresh } from '@/shared/lib';
import { createGalleryAction, updateGalleryAction } from '../api/actions';
import { useGalleryImages } from '../lib/use-gallery-images';
import { getDefaultValues, toFormData } from './mapper';
import {
  type CreateGalleryInput,
  type UpdateGalleryInput,
  createGallerySchema,
  initialState,
  updateGallerySchema,
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
  const [isConverting, setIsConverting] = useState(false);

  const form = useForm<CreateGalleryInput | UpdateGalleryInput>({
    resolver: zodResolver(
      MODE === 'EDIT' ? updateGallerySchema : createGallerySchema,
    ),
    defaultValues: getDefaultValues(gallery),
    mode: 'onChange',
  });

  const hasChanges = MODE === 'CREATE' || form.formState.isDirty;

  const { images, dragActive, handlers } = useGalleryImages({
    initialData: gallery,
    onImagesChange: (newImages) => {
      const formImages = newImages
        .filter((img) => img.file !== null)
        .map((img) => ({
          file: img.file as File,
          isThumbnail: img.isThumbnail,
        }));

      form.setValue('images', formImages, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    },
  });

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
              form.setError(
                field as keyof CreateGalleryInput | keyof UpdateGalleryInput,
                { type: 'server', message: messages[0] },
              );
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

  const handleSubmit = form.handleSubmit(async (data) => {
    const keepImageIds = images.filter((p) => !p.file).map((p) => p.id);
    const thumbnailIndex = images.findIndex((p) => p.isThumbnail);

    const formData = toFormData(
      data,
      thumbnailIndex >= 0 ? thumbnailIndex : 0,
      keepImageIds,
    );

    const newImageFiles = images.filter((p) => p.file);

    try {
      setIsConverting(true);

      if (newImageFiles.length > 0) {
        let imageIndex = 0;
        for (const preview of newImageFiles) {
          if (!preview.file) continue;

          const isSuccess = await imageConverter({
            formData,
            file: preview.file,
            title: data.title,
            setError: form.setError,
            type: 'image-to-webp',
            fieldKey: 'image',
          });

          if (!isSuccess) return;

          const convertedImage = formData.get('image');
          if (convertedImage) {
            formData.delete('image');

            const targetKey = `image-${imageIndex}`;
            if (formData.has(targetKey)) {
              formData.delete(targetKey);
            }

            formData.append(targetKey, convertedImage);
          }

          imageIndex++;
        }
      }
    } catch (error) {
      console.error(error);
      form.setError('root', {
        type: 'server',
        message: '이미지 변환 중 오류가 발생했습니다.',
      });
      return;
    } finally {
      setIsConverting(false);
    }

    startTransition(() => {
      formAction(formData);
    });
  });

  return {
    form,
    imageUI: {
      previews: images,
      dragActive,
      handleDrag: handlers.handleDrag,
      handleDrop: handlers.handleDrop,
      handleFileSelect: handlers.handleFileSelect,
      removePreview: handlers.removeImage,
      setThumbnail: handlers.setThumbnail,
    },
    handler: {
      submit: handleSubmit,
    },
    status: {
      isPending,
      mode: MODE,
      hasChanges,
      isConverting,
    },
  };
}

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
import { Event } from '@/entities/event';
import { imageConverter, useToastAndRefresh } from '@/shared/lib';
import { createEventAction, updateEventAction } from '../api/actions';
import { getDefaultValues, toFormData } from '../lib/mapper';
import { CreateEventInput, createEventSchema, initialState } from './schema';

interface Props {
  event?: Event;
  onSuccess?: () => void;
  successMessage: string;
}

export function useEventForm({ event, onSuccess, successMessage }: Props) {
  const { complete } = useToastAndRefresh(onSuccess);
  const MODE = event ? 'EDIT' : 'CREATE';
  const action =
    MODE === 'EDIT'
      ? updateEventAction.bind(null, event!.id)
      : createEventAction;

  const [state, formAction, isPending] = useActionState(action, initialState);

  const form = useForm<CreateEventInput>({
    resolver: zodResolver(createEventSchema),
    defaultValues: getDefaultValues(event),
  });

  const hasChanges = MODE === 'CREATE' || form.formState.isDirty;

  const [photoFile, setPhotoFile] = useState<{
    file: File;
    preview: string;
  } | null>(null);
  const [dragActive, setDragActive] = useState(false);

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
              form.setError(field as keyof CreateEventInput, {
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

  const handleSubmit = async (data: CreateEventInput) => {
    const formData = toFormData(data);
    const isSuccess = await imageConverter({
      formData,
      file: photoFile?.file,
      title: data.title,
      setError: form.setError,
      type: 'image-to-webp',
    });
    if (!isSuccess) return;
    startTransition(() => {
      formAction(formData);
    });
  };

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) {
        return;
      }

      const preview = URL.createObjectURL(file);
      setPhotoFile({ file, preview });
      form.setValue('photoFile', file, { shouldValidate: true });
      form.clearErrors('photoFile');
    },
    [form],
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

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const files = e.dataTransfer.files;
      if (files && files[0]) {
        handleFile(files[0]);
      }
    },
    [handleFile],
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
    e.target.value = '';
  };

  const removePhotoFile = () => {
    if (photoFile?.preview) {
      URL.revokeObjectURL(photoFile.preview);
    }
    setPhotoFile(null);
    form.setValue('photoFile', undefined as unknown as File);
  };

  return {
    form,
    handleSubmit: form.handleSubmit(handleSubmit),
    isSubmitting: form.formState.isSubmitting || isPending,
    hasChanges,
    photoFile: {
      file: photoFile,
      dragActive,
      handleDrag,
      handleDrop,
      handleFileSelect,
      removePhotoFile,
    },
  };
}

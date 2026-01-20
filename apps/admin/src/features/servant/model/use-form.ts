'use client';

import {
  startTransition,
  useActionState,
  useCallback,
  useEffect,
  useEffectEvent,
  useState,
} from 'react';
import type React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Servant } from '@/entities/servant';
import { useToastAndRefresh } from '@/shared/lib';
import { createServantAction, updateServantAction } from '../api/actions';
import { getDefaultValues, toFormData } from '../lib/mapper';
import {
  CreateServantInput,
  createServantSchema,
  initialState,
} from './schema';

interface Params {
  servant?: Servant;
  onSuccess?: () => void;
  successMessage: string;
}

export function useServantForm({ servant, onSuccess, successMessage }: Params) {
  const { complete } = useToastAndRefresh(onSuccess);
  const MODE = servant ? 'EDIT' : 'CREATE';

  const actionFn =
    MODE === 'EDIT'
      ? updateServantAction.bind(null, servant!.id)
      : createServantAction;

  const [state, action, isPending] = useActionState(actionFn, initialState);

  const form = useForm<CreateServantInput>({
    resolver: zodResolver(createServantSchema),
    defaultValues: getDefaultValues(servant),
  });

  const hasChanges = MODE === 'CREATE' || form.formState.isDirty;

  const [photoFile, setPhotoFile] = useState<{
    file: File;
    preview: string;
  } | null>(null);
  const [imageDragActive, setImageDragActive] = useState(false);

  const handleImageFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      return;
    }

    const preview = URL.createObjectURL(file);
    setPhotoFile({ file, preview });
  }, []);

  const handleImageDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setImageDragActive(true);
    } else if (e.type === 'dragleave') {
      setImageDragActive(false);
    }
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleImageFile(files[0]);
    }
  };

  const handleImageDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setImageDragActive(false);

      const files = e.dataTransfer.files;
      if (files && files[0]) {
        handleImageFile(files[0]);
      }
    },
    [handleImageFile],
  );

  const removePhotoFile = () => {
    if (photoFile?.preview) {
      URL.revokeObjectURL(photoFile.preview);
    }
    setPhotoFile(null);
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
              form.setError(field as keyof CreateServantInput, {
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
      action(toFormData(data));
    });
  });

  return {
    form,
    handleSubmit,
    isSubmitting: form.formState.isSubmitting || isPending,
    hasChanges,
    photoFile: {
      file: photoFile,
      dragActive: imageDragActive,
      handleDrag: handleImageDrag,
      handleDrop: handleImageDrop,
      handleFileSelect: handleImageSelect,
      removePhotoFile,
    },
  };
}

'use client';

import {
  startTransition,
  useActionState,
  useEffect,
  useEffectEvent,
} from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Missionary } from '@/entities/missionary';
import {
  imageConverter,
  useImageInput,
  useToastAndRefresh,
} from '@/shared/lib';
import { createMissionaryAction, updateMissionaryAction } from '../api/actions';
import { getDefaultValues, toFormData } from './mapper';
import {
  type CreateMissionaryInput,
  type UpdateMissionaryInput,
  createMissionarySchema,
  initialState,
  updateMissionarySchema,
} from './schema';

interface Props {
  missionary?: Missionary;
  onSuccess?: () => void;
  successMessage: string;
}

export function useMissionaryForm({
  missionary,
  onSuccess,
  successMessage,
}: Props) {
  const { complete } = useToastAndRefresh(onSuccess);
  const MODE = missionary ? 'EDIT' : 'CREATE';
  const action =
    MODE === 'EDIT' && missionary
      ? updateMissionaryAction.bind(null, missionary.id)
      : createMissionaryAction;

  const [state, formAction, isPending] = useActionState(action, initialState);

  const form = useForm({
    resolver: zodResolver(
      MODE === 'EDIT' ? updateMissionarySchema : createMissionarySchema,
    ),
    defaultValues: getDefaultValues(missionary),
    mode: 'onChange',
  });

  const hasChanges = MODE === 'CREATE' || form.formState.isDirty;
  const handlePhotoChange = (file: File | null) => {
    form.setValue('photoFile', file, {
      shouldValidate: true,
      shouldDirty: true,
    });
    if (!file) {
      form.clearErrors('photoFile');
    }
  };
  const imageInput = useImageInput({
    initialUrl: missionary?.imageUrl ?? undefined,
    onFileChange: handlePhotoChange,
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
                field as
                  | keyof CreateMissionaryInput
                  | keyof UpdateMissionaryInput,
                {
                  type: 'server',
                  message: messages[0],
                },
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
    const formData = toFormData(data);
    const isSuccess = await imageConverter({
      formData,
      file: imageInput.rawFile || undefined,
      title: data.name,
      setError: form.setError,
      type: 'image-to-webp',
    });
    if (!isSuccess) return;
    startTransition(() => {
      formAction(formData);
    });
  });

  return {
    form,
    imageUI: imageInput,
    handler: {
      submit: handleSubmit,
    },
    status: {
      isPending,
      mode: MODE,
      hasChanges,
    },
  };
}

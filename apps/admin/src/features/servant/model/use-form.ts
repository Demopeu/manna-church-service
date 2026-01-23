'use client';

import {
  startTransition,
  useActionState,
  useEffect,
  useEffectEvent,
} from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Servant } from '@/entities/servant';
import {
  imageConverter,
  useImageInput,
  useToastAndRefresh,
} from '@/shared/lib';
import { createServantAction, updateServantAction } from '../api/actions';
import { getDefaultValues, toFormData } from './mapper';
import {
  type CreateServantInput,
  type UpdateServantInput,
  createServantSchema,
  initialState,
  updateServantSchema,
} from './schema';

interface Props {
  servant?: Servant;
  onSuccess?: () => void;
  successMessage: string;
}

export function useServantForm({ servant, onSuccess, successMessage }: Props) {
  const { complete } = useToastAndRefresh(onSuccess);
  const MODE = servant ? 'EDIT' : 'CREATE';
  const action =
    MODE === 'EDIT' && servant
      ? updateServantAction.bind(null, servant.id)
      : createServantAction;

  const [state, formAction, isPending] = useActionState(action, initialState);

  const form = useForm({
    resolver: zodResolver(
      MODE === 'EDIT' ? updateServantSchema : createServantSchema,
    ),
    defaultValues: getDefaultValues(servant),
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
    initialUrl: servant?.photoFile ?? undefined,
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
                field as keyof CreateServantInput | keyof UpdateServantInput,
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

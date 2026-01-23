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
import { Bulletin } from '@/entities/bulletin';
import { useToastAndRefresh } from '@/shared/lib';
import { createBulletinAction, updateBulletinAction } from '../api/actions';
import { validatePdfFile } from '../lib/validate-pdf';
import { getDefaultValues, toFormData } from './mapper';
import {
  type CreateBulletinInput,
  type UpdateBulletinInput,
  createBulletinSchema,
  initialState,
  updateBulletinSchema,
} from './schema';

interface Params {
  bulletin?: Bulletin;
  onSuccess?: () => void;
  successMessage: string;
}

export function useBulletinForm({
  bulletin,
  onSuccess,
  successMessage,
}: Params) {
  const { complete } = useToastAndRefresh(onSuccess);
  const MODE = bulletin ? 'EDIT' : 'CREATE';

  const actionFn =
    MODE === 'EDIT'
      ? updateBulletinAction.bind(null, bulletin!.id)
      : createBulletinAction;

  const [state, action, isPending] = useActionState(actionFn, initialState);

  const form = useForm({
    resolver: zodResolver(
      MODE === 'EDIT' ? updateBulletinSchema : createBulletinSchema,
    ),
    defaultValues: getDefaultValues(bulletin),
  });

  const hasChanges = MODE === 'CREATE' || form.formState.isDirty;

  const [dragActive, setDragActive] = useState(false);
  const [pdfFile, setPdfFile] = useState<{ name: string; file: File } | null>(
    null,
  );
  const [coverImageFile, setCoverImageFile] = useState<{
    file: File;
    preview: string;
  } | null>(null);
  const [imageDragActive, setImageDragActive] = useState(false);

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

    const file = e.dataTransfer.files?.[0];
    if (file && validatePdfFile(file)) {
      setPdfFile({ name: file.name, file });
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validatePdfFile(file)) {
      setPdfFile({ name: file.name, file });
    }
  };

  const removePdfFile = () => {
    setPdfFile(null);
  };

  const handleImageDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setImageDragActive(true);
    } else if (e.type === 'dragleave') {
      setImageDragActive(false);
    }
  }, []);

  const handleImageFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      return;
    }

    const preview = URL.createObjectURL(file);
    setCoverImageFile({ file, preview });
  }, []);

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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleImageFile(files[0]);
    }
  };

  const removeCoverImageFile = () => {
    if (coverImageFile?.preview) {
      URL.revokeObjectURL(coverImageFile.preview);
    }
    setCoverImageFile(null);
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
              form.setError(
                field as keyof CreateBulletinInput | keyof UpdateBulletinInput,
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

  const handleSubmit = form.handleSubmit((data) => {
    startTransition(() => {
      action(toFormData(data));
    });
  });

  return {
    form,
    status: {
      isPending,
      hasChanges,
    },
    handler: {
      submit: handleSubmit,
    },
    pdfFile: {
      file: pdfFile,
      dragActive,
      handleDrag,
      handleDrop,
      handleFileSelect,
      removePdfFile,
    },
    coverImageFile: {
      file: coverImageFile,
      dragActive: imageDragActive,
      handleDrag: handleImageDrag,
      handleDrop: handleImageDrop,
      handleFileSelect: handleImageSelect,
      removeCoverImageFile,
    },
  };
}

'use client';

import { useActionState, useCallback, useEffect, useState } from 'react';
import type React from 'react';
import { useRouter } from 'next/navigation';
import { Servant } from '@/entities/servant';
import { FORM_TEXT } from '../config/form';
import { getDefaultValues } from '../lib/mapper';
import { createServantAction, updateServantAction } from './actions';
import { initialState } from './schema';

interface Params {
  servant?: Servant;
  onSuccess?: () => void;
}

export function useServantForm({ servant, onSuccess }: Params) {
  const router = useRouter();
  const MODE = servant ? 'edit' : 'create';

  const actionFn =
    MODE === 'edit'
      ? updateServantAction.bind(null, servant!.id)
      : createServantAction;

  const [state, action, isPending] = useActionState(actionFn, initialState);

  const [photoFile, setPhotoFile] = useState<{
    file: File;
    preview: string;
  } | null>(null);
  const [imageDragActive, setImageDragActive] = useState(false);

  const handleImageDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setImageDragActive(true);
    } else if (e.type === 'dragleave') {
      setImageDragActive(false);
    }
  }, []);

  const handleImageDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImageDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleImageFile(files[0]);
    }
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleImageFile(files[0]);
    }
  };

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      return;
    }

    const preview = URL.createObjectURL(file);
    setPhotoFile({ file, preview });
  };

  const removePhotoFile = () => {
    if (photoFile?.preview) {
      URL.revokeObjectURL(photoFile.preview);
    }
    setPhotoFile(null);
  };

  useEffect(() => {
    if (state.success) {
      alert(state.message);
      router.refresh();
      onSuccess?.();
    }
  }, [state.success, state.message, router, onSuccess]);

  const uiText = FORM_TEXT[MODE];
  const defaultValues = getDefaultValues(servant);

  return {
    state,
    action,
    isPending,
    defaultValues,
    uiText,
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

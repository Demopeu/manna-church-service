'use client';

import { useActionState, useEffect, useState } from 'react';
import { Event } from '@/entities/event';
import { FORM_TEXT } from '../config/form';
import { getDefaultValues } from '../lib/mapper';
import { createEventAction, updateEventAction } from './actions';
import { initialState } from './schema';

interface UseEventFormProps {
  event?: Event;
  onSuccess: () => void;
}

export function useEventForm({ event, onSuccess }: UseEventFormProps) {
  const isEditMode = !!event;
  const action = isEditMode
    ? updateEventAction.bind(null, event.id)
    : createEventAction;

  const [state, formAction, isPending] = useActionState(action, initialState);

  const [photoFile, setPhotoFile] = useState<{
    file: File;
    preview: string;
  } | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const defaultValues = getDefaultValues(event);
  const uiText = isEditMode ? FORM_TEXT.EDIT : FORM_TEXT.CREATE;

  useEffect(() => {
    if (state.success) {
      onSuccess();
    }
  }, [state.success, onSuccess]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
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

  return {
    state,
    action: formAction,
    isPending,
    defaultValues,
    uiText,
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

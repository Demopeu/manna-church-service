'use client';

import { useState, useCallback } from 'react';

interface EventFormData {
  title: string;
  description: string;
  imageUrl: string;
}

export function useEventForm(
  initialData?: EventFormData,
  onSuccess?: () => void,
) {
  const [formData, setFormData] = useState<EventFormData>(
    initialData || {
      title: '',
      description: '',
      imageUrl: '',
    },
  );
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file!.type.startsWith('image/')) {
        const url = URL.createObjectURL(file!);
        setFormData((prev) => ({ ...prev, imageUrl: url }));
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, imageUrl: url }));
    }
  };

  const updateField = (field: keyof EventFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, imageUrl: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('이벤트 등록/수정:', formData);
    onSuccess?.();
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', imageUrl: '' });
  };

  return {
    formData,
    isDragging,
    updateField,
    removeImage,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileChange,
    handleSubmit,
    resetForm,
  };
}

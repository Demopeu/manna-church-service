'use client';

import { useState } from 'react';

interface AnnouncementFormData {
  title: string;
  content: string;
  isUrgent: boolean;
}

export function useAnnouncementForm(
  initialData?: AnnouncementFormData,
  onSuccess?: () => void,
) {
  const [formData, setFormData] = useState<AnnouncementFormData>(
    initialData || {
      title: '',
      content: '',
      isUrgent: false,
    },
  );

  const updateField = (
    field: keyof AnnouncementFormData,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('공지 등록/수정:', formData);
    onSuccess?.();
  };

  const resetForm = () => {
    setFormData({ title: '', content: '', isUrgent: false });
  };

  return {
    formData,
    updateField,
    handleSubmit,
    resetForm,
  };
}

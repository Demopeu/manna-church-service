'use client';

import { FormTriggerButton } from '@/shared/ui';
import { GalleryForm } from './Form';

export function CreateGalleryButton() {
  return (
    <FormTriggerButton title="갤러리 등록">
      {({ close }) => <GalleryForm onCancel={close} onSuccess={close} />}
    </FormTriggerButton>
  );
}

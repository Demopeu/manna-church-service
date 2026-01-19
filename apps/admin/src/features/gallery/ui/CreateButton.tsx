'use client';

import { FormTriggerButton } from '@/shared/ui';
import { GalleryForm } from './Form';

export function CreateAlbumButton() {
  return (
    <FormTriggerButton title="앨범 만들기">
      {({ close }) => <GalleryForm onCancel={close} onSuccess={close} />}
    </FormTriggerButton>
  );
}

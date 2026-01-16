'use client';

import { GalleryForm } from './Form';
import { FormTriggerButton } from '@/shared/ui';

export function CreateAlbumButton() {
  return (
    <FormTriggerButton title="앨범 만들기">
      {({ close }) => <GalleryForm onCancel={close} onSuccess={close} />}
    </FormTriggerButton>
  );
}

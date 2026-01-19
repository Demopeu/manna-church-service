'use client';

import { FormTriggerButton } from '@/shared/ui';
import { AnnouncementForm } from './Form';

export function CreateAnnouncementButton() {
  return (
    <FormTriggerButton title="공지 작성">
      {({ close }) => <AnnouncementForm onCancel={close} onSuccess={close} />}
    </FormTriggerButton>
  );
}

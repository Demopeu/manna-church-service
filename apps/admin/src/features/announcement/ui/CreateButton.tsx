'use client';

import { AnnouncementForm } from './Form';
import { FormTriggerButton } from '@/shared/ui';

export function CreateAnnouncementButton() {
  return (
    <FormTriggerButton title="공지 작성">
      {({ close }) => <AnnouncementForm onCancel={close} onSuccess={close} />}
    </FormTriggerButton>
  );
}

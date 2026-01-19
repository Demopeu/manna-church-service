'use client';

import { FormTriggerButton } from '@/shared/ui';
import { EventForm } from './Form';

export function CreateEventButton() {
  return (
    <FormTriggerButton title="이벤트 등록">
      {({ close }) => <EventForm onCancel={close} onSuccess={close} />}
    </FormTriggerButton>
  );
}

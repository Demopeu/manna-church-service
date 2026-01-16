'use client';

import {
  Button,
  Input,
  Label,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Textarea,
  Switch,
} from '@/shared/ui';
import { AlertTriangle } from 'lucide-react';
import { useAnnouncementForm } from '../model/use-form';
import { Announcement } from '@/entities/announcement';

interface Props {
  announcement?: Announcement;
  onSuccess: () => void;
  onCancel: () => void;
  isDialog?: boolean;
}

export function AnnouncementForm({
  announcement,
  onSuccess,
  onCancel,
  isDialog = false,
}: Props) {
  const { state, action, isPending, defaultValues, uiText, isUrgent } =
    useAnnouncementForm({ announcement, onSuccess });

  const FormContent = (
    <form action={action} className="space-y-4">
      {state.message && !state.success && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">
          ⚠️ {state.message}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">제목 *</Label>
        <Input
          id="title"
          name="title"
          defaultValue={defaultValues.title}
          required
          className="h-12 text-base"
          placeholder="공지 제목을 입력하세요"
        />
        {state.fieldErrors?.title && (
          <p className="text-sm text-red-500">{state.fieldErrors.title[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">내용 *</Label>
        <Textarea
          id="content"
          name="content"
          defaultValue={defaultValues.content}
          required
          className="min-h-32 text-base"
          placeholder="공지 내용을 입력하세요"
        />
        {state.fieldErrors?.content && (
          <p className="text-sm text-red-500">{state.fieldErrors.content[0]}</p>
        )}
      </div>

      <div className="bg-muted flex items-center gap-3 rounded-lg p-4">
        <Switch
          id="isUrgent"
          name="isUrgent"
          checked={isUrgent.value}
          onCheckedChange={isUrgent.setValue}
          value={isUrgent.value ? 'true' : 'false'}
        />
        <Label
          htmlFor="isUrgent"
          className="flex cursor-pointer items-center gap-2"
        >
          <AlertTriangle className="text-destructive h-4 w-4" />
          <span className="font-medium">긴급 공지로 표시</span>
        </Label>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="submit" size="lg" disabled={isPending}>
          {isPending ? uiText.loadingBtn : uiText.submitBtn}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isPending}
          size="lg"
        >
          취소
        </Button>
      </div>
    </form>
  );

  if (isDialog) {
    return (
      <Card className="border-none shadow-none">
        <CardContent className="p-0">{FormContent}</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{uiText.title}</CardTitle>
        <CardDescription>{uiText.description}</CardDescription>
      </CardHeader>
      <CardContent>{FormContent}</CardContent>
    </Card>
  );
}

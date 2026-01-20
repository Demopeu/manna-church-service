'use client';

import { Controller } from 'react-hook-form';
import { AlertTriangle } from 'lucide-react';
import { Announcement } from '@/entities/announcement';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Switch,
  Textarea,
} from '@/shared/ui';
import { useAnnouncementForm } from '../model/use-form';
import { getFormText } from './form-data';

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
  const uiText = getFormText(announcement);

  const { form, handleSubmit, isSubmitting, hasChanges } = useAnnouncementForm({
    announcement,
    onSuccess,
    successMessage: uiText.successDescription,
  });
  const errors = form.formState.errors;

  const FormContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.root && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">
          ⚠️ {errors.root.message}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">제목 *</Label>
        <Input
          id="title"
          className="h-12 text-base"
          placeholder="공지 제목을 입력하세요"
          disabled={isSubmitting}
          {...form.register('title')}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">내용 *</Label>
        <Textarea
          id="content"
          className="min-h-32 text-base"
          placeholder="공지 내용을 입력하세요"
          disabled={isSubmitting}
          {...form.register('content')}
        />
        {errors.content && (
          <p className="text-sm text-red-500">{errors.content.message}</p>
        )}
      </div>

      <div className="bg-muted flex items-center gap-3 rounded-lg p-4">
        <Controller
          control={form.control}
          name="isUrgent"
          render={({ field }) => (
            <Switch
              id="isUrgent"
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={isSubmitting}
            />
          )}
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
        <Button type="submit" size="lg" disabled={isSubmitting || !hasChanges}>
          {isSubmitting ? uiText.loadingBtn : uiText.submitBtn}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
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

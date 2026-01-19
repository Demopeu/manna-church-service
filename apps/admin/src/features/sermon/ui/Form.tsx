'use client';

import { Sermon } from '@/entities/sermon';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@/shared/ui';
import { useSermonForm } from '../model/use-form';

interface Props {
  sermon?: Sermon;
  onSuccess: () => void;
  onCancel: () => void;
  isDialog?: boolean;
}

export function SermonForm({
  sermon,
  onSuccess,
  onCancel,
  isDialog = false,
}: Props) {
  const { form, handleSubmit, isSubmitting, hasChanges, uiText, preview } =
    useSermonForm({ sermon, onSuccess });

  const errors = form.formState.errors;

  const FormContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.root && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">
          ⚠️ {errors.root.message}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">설교 제목 *</Label>
          <Input
            id="title"
            className="h-12 text-base"
            placeholder="설교 제목을 입력해주세요."
            disabled={isSubmitting}
            {...form.register('title')}
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="preacher">설교자 *</Label>
          <Input
            id="preacher"
            className="h-12 text-base"
            placeholder="설교자를 입력해주세요."
            disabled={isSubmitting}
            {...form.register('preacher')}
          />
          {errors.preacher && (
            <p className="text-sm text-red-500">{errors.preacher.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="date">설교 날짜 *</Label>
          <Input
            id="date"
            type="date"
            className="h-12 text-base"
            placeholder="설교 날짜를 입력해주세요."
            disabled={isSubmitting}
            {...form.register('date')}
          />
          {errors.date && (
            <p className="text-sm text-red-500">{errors.date.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="youtubeUrl">유튜브 링크 *</Label>
          <Input
            id="youtubeUrl"
            type="url"
            className="h-12 text-base"
            placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
            disabled={isSubmitting}
            {...form.register('youtubeUrl')}
          />
          <p className="text-muted-foreground text-sm">{uiText.youtubeHelp}</p>
          {preview.id && (
            <p className="text-primary text-sm font-medium">
              ✓ 영상 ID: {preview.id}
            </p>
          )}
          {errors.youtubeUrl && (
            <p className="text-sm text-red-500">{errors.youtubeUrl.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting || !preview.isValid || !hasChanges}
        >
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

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
  LoadingProgress,
} from '@/shared/ui';
import { useSermonForm } from '../model/use-form';
import { getFormText } from './form-data';

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
  const uiText = getFormText(sermon);
  const { form, handleSubmit, isSubmitting, isPending, hasChanges, preview } =
    useSermonForm({
      sermon,
      onSuccess,
      successMessage: uiText.successDescription,
    });
  const errors = form.formState.errors;

  const FormContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <LoadingProgress
        isPending={isPending}
        message={
          sermon
            ? '수정된 정보를 서버에 저장하고 있습니다...'
            : '정보를 서버에 등록하고 있습니다...'
        }
      />
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
          <Label htmlFor="youtubeUrl">동영상 링크 *</Label>
          <Input
            id="youtubeUrl"
            type="url"
            className="h-12 text-base"
            placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
            disabled={isSubmitting}
            {...form.register('videoUrl')}
          />
          <p className="text-muted-foreground text-sm">{uiText.youtubeHelp}</p>
          {preview.id && (
            <p className="text-primary text-sm font-medium">
              ✓ 영상 ID: {preview.id}
            </p>
          )}
          {errors.videoUrl && (
            <p className="text-sm text-red-500">{errors.videoUrl.message}</p>
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

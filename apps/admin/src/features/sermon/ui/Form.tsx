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
  const { state, action, isPending, defaultValues, uiText, preview } =
    useSermonForm({ sermon, onSuccess });

  const FormContent = (
    <form action={action} className="space-y-4">
      {state.message && !state.success && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">
          ⚠️ {state.message}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">설교 제목 *</Label>
          <Input
            id="title"
            name="title"
            defaultValue={defaultValues.title}
            required
            className="h-12 text-base"
            placeholder="설교 제목을 입력해주세요."
          />
          {state.fieldErrors?.title && (
            <p className="text-sm text-red-500">{state.fieldErrors.title[0]}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="preacher">설교자 *</Label>
          <Input
            id="preacher"
            name="preacher"
            defaultValue={defaultValues.preacher}
            required
            className="h-12 text-base"
            placeholder="설교자를 입력해주세요."
          />
          {state.fieldErrors?.preacher && (
            <p className="text-sm text-red-500">
              {state.fieldErrors.preacher[0]}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="date">설교 날짜 *</Label>
          <Input
            id="date"
            name="date"
            type="date"
            defaultValue={defaultValues.date}
            required
            className="h-12 text-base"
            placeholder="설교 날짜를 입력해주세요."
          />
          {state.fieldErrors?.date && (
            <p className="text-sm text-red-500">{state.fieldErrors.date[0]}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="youtubeUrl">유튜브 링크 *</Label>
          <Input
            id="youtubeUrl"
            name="youtubeUrl"
            type="url"
            defaultValue={defaultValues.videoUrl}
            onChange={(e) => preview.setUrl(e.target.value)}
            required
            className="h-12 text-base"
            placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
          />
          <p className="text-muted-foreground text-sm">{uiText.youtubeHelp}</p>
          {preview.id && (
            <p className="text-primary text-sm font-medium">
              ✓ 영상 ID: {preview.id}
            </p>
          )}
          {state.fieldErrors?.youtubeUrl && (
            <p className="text-sm text-red-500">
              {state.fieldErrors.youtubeUrl[0]}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="submit"
          size="lg"
          disabled={isPending || !preview.isValid}
        >
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

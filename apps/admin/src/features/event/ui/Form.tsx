'use client';

import Image from 'next/image';
import { Upload, X } from 'lucide-react';
import { cn } from '@repo/ui/lib';
import { Event } from '@/entities/event';
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
  Textarea,
} from '@/shared/ui';
import { useEventForm } from '../model/use-form';
import { getFormText } from './form-data';

interface Props {
  event?: Event;
  onSuccess: () => void;
  onCancel: () => void;
  isDialog?: boolean;
}

export function EventForm({
  event,
  onSuccess,
  onCancel,
  isDialog = false,
}: Props) {
  const uiText = getFormText(event);

  const { form, imageUI, handler, status } = useEventForm({
    event,
    onSuccess,
    successMessage: uiText.successDescription,
  });
  const { errors, isValid } = form.formState;

  const FormContent = (
    <form onSubmit={handler.submit} className="space-y-4">
      <LoadingProgress
        isPending={status.isPending}
        message={
          status.mode === 'EDIT'
            ? '수정된 정보를 서버에 저장하고 있습니다...'
            : '정보를 서버에 등록하고 있습니다...'
        }
      />
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
          placeholder="이벤트 제목을 입력하세요"
          disabled={status.isPending}
          {...form.register('title')}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="startDate">시작 날짜 *</Label>
        <Input
          id="startDate"
          type="date"
          className="h-12 text-base"
          disabled={status.isPending}
          {...form.register('startDate')}
        />
        {errors.startDate && (
          <p className="text-sm text-red-500">{errors.startDate.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>이벤트 사진 *</Label>
        <div
          className={cn(
            'relative rounded-lg border-2 border-dashed transition-colors',
            imageUI.dragActive
              ? 'border-primary bg-primary/5'
              : 'border-border',
            imageUI.preview ? 'p-4' : 'p-8',
          )}
          onDragEnter={imageUI.handleDrag}
          onDragLeave={imageUI.handleDrag}
          onDragOver={imageUI.handleDrag}
          onDrop={imageUI.handleDrop}
        >
          {imageUI.preview ? (
            <div className="flex items-center gap-3">
              <div className="relative h-40 w-40 shrink-0">
                <Image
                  key={imageUI.preview}
                  src={imageUI.preview}
                  alt="이벤트 사진 미리보기"
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
              <div className="w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {imageUI.rawFile
                    ? imageUI.rawFile.name
                    : '기존 등록된 이미지'}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={imageUI.removeFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <Upload className="text-muted-foreground mb-4 h-12 w-12" />
              <p className="mb-1 text-lg font-medium">
                이미지를 드래그하거나 클릭해서 선택
              </p>
              <p className="text-muted-foreground text-sm">
                {uiText.imageHelp}
              </p>
              <input
                key={`file-input`}
                type="file"
                name="photoFile"
                accept="image/*"
                onChange={imageUI.handleFileSelect}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </div>
          )}
        </div>
        {errors.photoFile && (
          <p className="text-sm text-red-500">{errors.photoFile.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">설명</Label>
        <Textarea
          id="description"
          className="min-h-32 text-base"
          placeholder="이벤트 설명을 입력하세요"
          disabled={status.isPending}
          {...form.register('description')}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="submit"
          size="lg"
          disabled={
            status.isPending ||
            !imageUI.preview ||
            !isValid ||
            !status.hasChanges
          }
        >
          {status.isPending ? uiText.loadingBtn : uiText.submitBtn}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={status.isPending}
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

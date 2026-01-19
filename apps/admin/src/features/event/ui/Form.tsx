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
  Textarea,
} from '@/shared/ui';
import { useEventForm } from '../model/use-form';

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
  const { state, action, isPending, defaultValues, uiText, photoFile } =
    useEventForm({ event, onSuccess });

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
          placeholder="이벤트 제목을 입력하세요"
        />
        {state.fieldErrors?.title && (
          <p className="text-sm text-red-500">{state.fieldErrors.title[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="startDate">시작 날짜 *</Label>
        <Input
          id="startDate"
          name="startDate"
          type="date"
          defaultValue={defaultValues.startDate}
          required
          className="h-12 text-base"
        />
        {state.fieldErrors?.startDate && (
          <p className="text-sm text-red-500">
            {state.fieldErrors.startDate[0]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>이벤트 사진 *</Label>
        <div
          className={cn(
            'relative rounded-lg border-2 border-dashed transition-colors',
            photoFile.dragActive
              ? 'border-primary bg-primary/5'
              : 'border-border',
            photoFile.file ? 'p-4' : 'p-8',
          )}
          onDragEnter={photoFile.handleDrag}
          onDragLeave={photoFile.handleDrag}
          onDragOver={photoFile.handleDrag}
          onDrop={photoFile.handleDrop}
        >
          {photoFile.file ? (
            <div className="flex items-center gap-4">
              <div className="relative h-24 w-24 shrink-0">
                <Image
                  src={photoFile.file.preview}
                  alt="이벤트 사진 미리보기"
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium">{photoFile.file.file.name}</p>
                <p className="text-muted-foreground text-sm">
                  {(photoFile.file.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={photoFile.removePhotoFile}
              >
                <X className="h-4 w-4" />
              </Button>
              <input
                type="file"
                name="photoFile"
                accept="image/*"
                className="hidden"
                ref={(input) => {
                  if (input && photoFile.file) {
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(photoFile.file.file);
                    input.files = dataTransfer.files;
                  }
                }}
              />
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
                type="file"
                name="photoFile"
                accept="image/*"
                onChange={photoFile.handleFileSelect}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </div>
          )}
        </div>
        {state.fieldErrors?.photoFile && (
          <p className="text-sm text-red-500">
            {state.fieldErrors.photoFile[0]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">설명 *</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={defaultValues.description}
          required
          className="min-h-32 text-base"
          placeholder="이벤트 설명을 입력하세요"
        />
        {state.fieldErrors?.description && (
          <p className="text-sm text-red-500">
            {state.fieldErrors.description[0]}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="submit" size="lg" disabled={isPending || !photoFile.file}>
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

'use client';

import Image from 'next/image';
import { Plus, Star, Upload, X } from 'lucide-react';
import { cn } from '@repo/ui/lib';
import { GalleryWithImages } from '@/entities/gallery';
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
import { useGalleryForm } from '../model/use-form';

interface Props {
  gallery?: GalleryWithImages;
  onSuccess: () => void;
  onCancel: () => void;
  isDialog?: boolean;
}

export function GalleryForm({
  gallery,
  onSuccess,
  onCancel,
  isDialog = false,
}: Props) {
  const {
    state,
    action,
    isPending,
    defaultValues,
    uiText,
    dragActive,
    previews,
    handleDrag,
    handleDrop,
    handleFileSelect,
    removePreview,
    setThumbnail,
  } = useGalleryForm({ gallery, onSuccess });

  const thumbnailIndex = previews.findIndex((p) => p.isThumbnail);

  const FormContent = (
    <form
      action={(formData: FormData) => {
        previews.forEach((preview, idx) => {
          if (preview.file) {
            formData.append(`image-${idx}`, preview.file);
          }
        });
        formData.append('thumbnailIndex', thumbnailIndex.toString());
        action(formData);
      }}
      className="space-y-4"
    >
      {state.message && !state.success && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">
          ⚠️ {state.message}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">앨범 제목 *</Label>
          <Input
            id="title"
            name="title"
            defaultValue={defaultValues.title}
            required
            className="h-12 text-base"
            placeholder="예: 2024 신년 예배"
          />
          {state.fieldErrors?.title && (
            <p className="text-sm text-red-500">{state.fieldErrors.title[0]}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="eventDate">날짜 *</Label>
          <Input
            id="eventDate"
            name="eventDate"
            type="date"
            defaultValue={defaultValues.eventDate}
            required
            className="h-12 text-base"
          />
          {state.fieldErrors?.eventDate && (
            <p className="text-sm text-red-500">
              {state.fieldErrors.eventDate[0]}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-base">사진 업로드 *</Label>
        <p className="text-muted-foreground text-sm">
          {uiText.imageUploadGuide}
        </p>
        <div
          className={cn(
            'relative rounded-lg border-2 border-dashed transition-colors',
            dragActive ? 'border-primary bg-primary/5' : 'border-border',
            previews.length > 0 ? 'p-4' : 'p-8',
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {previews.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                {previews.map((preview) => (
                  <div key={preview.id} className="group relative">
                    <div className="relative aspect-square w-full">
                      <Image
                        src={preview.url}
                        alt="사진"
                        fill
                        className={cn(
                          'rounded-lg border-2 object-cover',
                          preview.isThumbnail
                            ? 'border-primary'
                            : 'border-transparent',
                        )}
                      />
                    </div>
                    <Button
                      type="button"
                      variant={preview.isThumbnail ? 'default' : 'secondary'}
                      size="icon"
                      className={cn(
                        'absolute top-1 left-1 h-6 w-6',
                        preview.isThumbnail
                          ? ''
                          : 'opacity-0 group-hover:opacity-100',
                      )}
                      onClick={() => setThumbnail(preview.id)}
                    >
                      <Star
                        className={cn(
                          'h-3 w-3',
                          preview.isThumbnail && 'fill-current',
                        )}
                      />
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={() => removePreview(preview.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <label className="border-border hover:border-primary hover:bg-primary/5 flex aspect-square w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition-colors">
                  <Plus className="text-muted-foreground h-8 w-8" />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-muted-foreground text-sm">
                {previews.length}개 사진 선택됨
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <Upload className="text-muted-foreground mb-4 h-12 w-12" />
              <p className="mb-1 text-lg font-medium">
                사진을 드래그하거나 클릭해서 선택
              </p>
              <p className="text-muted-foreground text-sm">
                여러 장의 사진을 한번에 업로드할 수 있습니다
              </p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </div>
          )}
        </div>
        {state.fieldErrors?.images && (
          <p className="text-sm text-red-500">{state.fieldErrors.images[0]}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="submit"
          size="lg"
          disabled={isPending || previews.length === 0}
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

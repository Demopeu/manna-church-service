'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Textarea,
} from '@/shared/ui';
import { Upload, X } from 'lucide-react';
import { cn } from '@repo/ui/lib';
import { useEventForm } from '../model/use-event-form';
import Image from 'next/image';

interface EventFormProps {
  onCancel: () => void;
  editMode?: boolean;
  initialData?: {
    title: string;
    description: string;
    imageUrl: string;
  };
}

export function EventForm({
  onCancel,
  editMode = false,
  initialData,
}: EventFormProps) {
  const {
    formData,
    isDragging,
    updateField,
    removeImage,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileChange,
    handleSubmit,
  } = useEventForm(initialData, onCancel);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editMode ? '이벤트 수정' : '이벤트 등록'}</CardTitle>
        <CardDescription>
          {editMode ? '이벤트 정보를 수정합니다.' : '새 이벤트를 등록합니다.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base">
              제목 *
            </Label>
            <Input
              id="title"
              placeholder="이벤트 제목을 입력하세요"
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              className="h-12 text-base"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base">사진 *</Label>
            {formData.imageUrl ? (
              <div className="relative w-full max-w-md">
                <Image
                  src={formData.imageUrl}
                  alt="이벤트 이미지"
                  className="aspect-video w-full rounded-lg border object-cover"
                  fill
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  'cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors',
                  isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-muted-foreground/25 hover:border-primary/50',
                )}
                onClick={() => document.getElementById('event-image')?.click()}
              >
                <input
                  id="event-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="flex flex-col items-center gap-2">
                  <div className="bg-muted rounded-full p-3">
                    <Upload className="text-muted-foreground h-6 w-6" />
                  </div>
                  <p className="font-medium">
                    이미지를 드래그하거나 클릭하여 업로드
                  </p>
                  <p className="text-muted-foreground text-sm">
                    JPG, PNG, WebP 지원
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-base">
              설명 *
            </Label>
            <Textarea
              id="description"
              placeholder="이벤트 설명을 입력하세요"
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              className="min-h-32 text-base"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" size="lg">
              {editMode ? '수정하기' : '등록하기'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={onCancel}
            >
              취소
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

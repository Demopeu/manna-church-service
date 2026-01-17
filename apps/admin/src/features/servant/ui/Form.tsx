'use client';

import Image from 'next/image';
import { ImageIcon, X } from 'lucide-react';
import { cn } from '@repo/ui/lib';
import { POSITION_OPTIONS, Servant } from '@/entities/servant';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Textarea,
} from '@/shared/ui';
import { useServantForm } from '../model/use-form';

interface Props {
  servant?: Servant;
  onSuccess: () => void;
  onCancel: () => void;
  isDialog?: boolean;
}

export function ServantForm({
  servant,
  onSuccess,
  onCancel,
  isDialog = false,
}: Props) {
  const { state, action, isPending, defaultValues, uiText, photoFile } =
    useServantForm({ servant, onSuccess });

  const FormContent = (
    <form action={action} className="space-y-4">
      {state.message && !state.success && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">
          ⚠️ {state.message}
        </div>
      )}

      <div className="space-y-2">
        <Label>
          프로필 사진 <span className="text-destructive">*</span>
        </Label>
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
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={photoFile.file.preview}
                  alt="프로필 사진 미리보기"
                  fill
                  className="object-cover"
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
              <ImageIcon className="text-muted-foreground mb-4 h-12 w-12" />
              <p className="mb-1 text-lg font-medium">
                이미지를 드래그하거나 클릭해서 선택
              </p>
              <p className="text-muted-foreground text-sm">
                💡 JPG, PNG, WebP 파일 (최대 5MB)
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
        {servant?.photoUrl && !photoFile.file && (
          <p className="text-muted-foreground text-sm">
            📎 현재 사진: {servant.photoUrl}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">
          이름 <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          defaultValue={defaultValues.name}
          placeholder="이름을 입력하세요"
          required
          className="h-11"
        />
        {state.fieldErrors?.name && (
          <p className="text-sm text-red-500">{state.fieldErrors.name[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">
          직분 <span className="text-destructive">*</span>
        </Label>
        <Select name="role" defaultValue={defaultValues.role} required>
          <SelectTrigger className="h-11">
            <SelectValue placeholder="직분 선택" />
          </SelectTrigger>
          <SelectContent>
            {POSITION_OPTIONS.map((pos) => (
              <SelectItem key={pos} value={pos}>
                {pos}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {state.fieldErrors?.role && (
          <p className="text-sm text-red-500">{state.fieldErrors.role[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="sortOrder">
          정렬 순서 <span className="text-destructive">*</span>
        </Label>
        <Input
          id="sortOrder"
          name="sortOrder"
          type="number"
          min={1}
          defaultValue={defaultValues.sortOrder}
          required
          className="h-11"
        />
        <p className="text-muted-foreground text-xs">
          숫자가 작을수록 먼저 표시됩니다 (1부터 시작)
        </p>
        {state.fieldErrors?.sortOrder && (
          <p className="text-sm text-red-500">
            {state.fieldErrors.sortOrder[0]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact">연락처 (선택)</Label>
        <Input
          id="contact"
          name="contact"
          type="tel"
          defaultValue={defaultValues.contact}
          placeholder="010-0000-0000"
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="introduction">담당 / 소개 (선택)</Label>
        <Textarea
          id="introduction"
          name="introduction"
          defaultValue={defaultValues.introduction}
          placeholder="담당 업무나 간단한 소개를 작성하세요"
          rows={3}
        />
      </div>

      <div className="flex items-center justify-between rounded-lg border p-4">
        <div>
          <Label htmlFor="isPublic">웹사이트 노출</Label>
          <p className="text-muted-foreground text-xs">
            활성화하면 웹사이트에 표시됩니다
          </p>
        </div>
        <Switch
          id="isPublic"
          name="isPublic"
          defaultChecked={defaultValues.isPublic}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="submit" size="lg" disabled={isPending || !photoFile.file}>
          {isPending ? '처리 중...' : uiText.submitButton}
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
        <CardDescription>섬기는 사람 정보를 입력해주세요.</CardDescription>
      </CardHeader>
      <CardContent>{FormContent}</CardContent>
    </Card>
  );
}

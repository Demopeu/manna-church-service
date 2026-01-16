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
} from '@/shared/ui';
import { Upload, X, FileText } from 'lucide-react';
import { cn } from '@repo/ui/lib';
import { useBulletinForm } from '../model/use-form';
import { Bulletin } from '@/entities/bulletin';

interface Props {
  bulletin?: Bulletin;
  onSuccess: () => void;
  onCancel: () => void;
  isDialog?: boolean;
}

export function BulletinForm({
  bulletin,
  onSuccess,
  onCancel,
  isDialog = false,
}: Props) {
  const { state, action, isPending, defaultValues, uiText, pdfFile } =
    useBulletinForm({ bulletin, onSuccess });

  const FormContent = (
    <form action={action} className="space-y-4">
      {state.message && !state.success && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">
          ⚠️ {state.message}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="publishedAt">게시일 *</Label>
        <Input
          id="publishedAt"
          name="publishedAt"
          type="date"
          defaultValue={defaultValues.publishedAt}
          required
          className="h-12 text-base"
        />
        {state.fieldErrors?.publishedAt && (
          <p className="text-sm text-red-500">
            {state.fieldErrors.publishedAt[0]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>주보 PDF *</Label>
        <div
          className={cn(
            'relative rounded-lg border-2 border-dashed transition-colors',
            pdfFile.dragActive
              ? 'border-primary bg-primary/5'
              : 'border-border',
            pdfFile.file ? 'p-4' : 'p-8',
          )}
          onDragEnter={pdfFile.handleDrag}
          onDragLeave={pdfFile.handleDrag}
          onDragOver={pdfFile.handleDrag}
          onDrop={pdfFile.handleDrop}
        >
          {pdfFile.file ? (
            <div className="flex items-center gap-4">
              <div className="flex flex-1 items-center gap-3">
                <div className="bg-primary/10 rounded-lg p-3">
                  <FileText className="text-primary h-8 w-8" />
                </div>
                <div>
                  <p className="font-medium">{pdfFile.file.name}</p>
                  <p className="text-muted-foreground text-sm">PDF 파일</p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={pdfFile.removePdfFile}
              >
                <X className="h-4 w-4" />
              </Button>
              <input
                type="file"
                name="pdfFile"
                accept="application/pdf"
                className="hidden"
                ref={(input) => {
                  if (input && pdfFile.file) {
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(pdfFile.file.file);
                    input.files = dataTransfer.files;
                  }
                }}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <Upload className="text-muted-foreground mb-4 h-12 w-12" />
              <p className="mb-1 text-lg font-medium">
                PDF를 드래그하거나 클릭해서 선택
              </p>
              <p className="text-muted-foreground text-sm">{uiText.pdfHelp}</p>
              <input
                type="file"
                name="pdfFile"
                accept="application/pdf"
                onChange={pdfFile.handleFileSelect}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </div>
          )}
        </div>
        {state.fieldErrors?.pdfFile && (
          <p className="text-sm text-red-500">{state.fieldErrors.pdfFile[0]}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="submit" size="lg" disabled={isPending || !pdfFile.file}>
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

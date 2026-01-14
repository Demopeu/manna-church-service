'use client';

import type React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
} from '@/shared/ui';
import { Upload, X, FileText } from 'lucide-react';
import { cn } from '@repo/ui/lib';
import { useCreateBulletin } from '../model/use-create-bulletin';

interface CreateBulletinFormProps {
  onCancel: () => void;
}

export function CreateBulletinForm({ onCancel }: CreateBulletinFormProps) {
  const {
    date,
    setDate,
    dragActive,
    pdfFile,
    handleDrag,
    handleDrop,
    handleFileSelect,
    handleSubmit,
    removePdfFile,
  } = useCreateBulletin(onCancel);

  return (
    <Card>
      <CardHeader>
        <CardTitle>주보 등록</CardTitle>
        <CardDescription>
          주보 PDF 파일을 업로드합니다. 업로드 후 webp로 변환하여 게시됩니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date" className="text-base">
              게시일 *
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-12 max-w-xs text-base"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base">주보 PDF *</Label>
            <div
              className={cn(
                'relative rounded-lg border-2 border-dashed transition-colors',
                dragActive ? 'border-primary bg-primary/5' : 'border-border',
                pdfFile ? 'p-4' : 'p-8',
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {pdfFile ? (
                <div className="flex items-center gap-4">
                  <div className="flex flex-1 items-center gap-3">
                    <div className="bg-primary/10 rounded-lg p-3">
                      <FileText className="text-primary h-8 w-8" />
                    </div>
                    <div>
                      <p className="font-medium">{pdfFile.name}</p>
                      <p className="text-muted-foreground text-sm">PDF 파일</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={removePdfFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center">
                  <Upload className="text-muted-foreground mb-4 h-12 w-12" />
                  <p className="mb-1 text-lg font-medium">
                    PDF를 드래그하거나 클릭해서 선택
                  </p>
                  <p className="text-muted-foreground text-sm">
                    PDF 파일만 지원됩니다
                  </p>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileSelect}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" size="lg" disabled={!pdfFile || !date}>
              등록하기
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

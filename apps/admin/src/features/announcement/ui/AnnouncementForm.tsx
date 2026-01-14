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
  Switch,
} from '@/shared/ui';
import { AlertTriangle } from 'lucide-react';
import { useAnnouncementForm } from '../model/use-announcement-form';

interface AnnouncementFormProps {
  onCancel: () => void;
  editMode?: boolean;
  initialData?: {
    title: string;
    content: string;
    isUrgent: boolean;
  };
}

export function AnnouncementForm({
  onCancel,
  editMode = false,
  initialData,
}: AnnouncementFormProps) {
  const { formData, updateField, handleSubmit } = useAnnouncementForm(
    initialData,
    onCancel,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editMode ? '공지 수정' : '공지 작성'}</CardTitle>
        <CardDescription>
          {editMode ? '공지사항을 수정합니다.' : '새 공지사항을 작성합니다.'}
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
              placeholder="공지 제목을 입력하세요"
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              className="h-12 text-base"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-base">
              내용 *
            </Label>
            <Textarea
              id="content"
              placeholder="공지 내용을 입력하세요"
              value={formData.content}
              onChange={(e) => updateField('content', e.target.value)}
              className="min-h-32 text-base"
              required
            />
          </div>

          <div className="bg-muted flex items-center gap-3 rounded-lg p-4">
            <Switch
              id="urgent"
              checked={formData.isUrgent}
              onCheckedChange={(checked) => updateField('isUrgent', checked)}
            />
            <Label
              htmlFor="urgent"
              className="flex cursor-pointer items-center gap-2"
            >
              <AlertTriangle className="text-destructive h-4 w-4" />
              <span className="font-medium">긴급 공지로 표시</span>
            </Label>
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

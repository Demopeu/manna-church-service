'use client';

import { useRouter } from 'next/navigation';
import { AlertCircle, ImageIcon, RefreshCw } from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui';
import { BANNER_MANAGEMENT_UI } from './labels';

export function BannerManagementError() {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          {BANNER_MANAGEMENT_UI.TITLE}
        </CardTitle>
        <CardDescription>{BANNER_MANAGEMENT_UI.ERROR_DESCRIPTION}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center gap-3 py-8">
          <div className="text-destructive flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm font-medium">배너 목록을 불러오지 못했습니다.</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.refresh()}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            다시 시도
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

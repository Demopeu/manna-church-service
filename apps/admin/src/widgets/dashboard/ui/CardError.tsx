'use client';

import { RefreshCw, AlertCircle, X } from 'lucide-react';
import { Button } from '@/shared/ui';
import { DashboardCardWrapper } from './dashboard-card-wrapper';
import { useRouter } from 'next/navigation';

interface Props {
  title: string;
}

export function CardError({ title }: Props) {
  const router = useRouter();

  return (
    <DashboardCardWrapper title={title} icon={X} href="#">
      <div className="flex h-full min-h-[60px] flex-col items-center justify-center space-y-3 py-1">
        <div className="text-destructive flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm font-medium">불러오기 실패</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs"
          onClick={() => router.refresh()}
        >
          <RefreshCw className="mr-2 h-3 w-3" />
          다시 시도
        </Button>
      </div>
    </DashboardCardWrapper>
  );
}

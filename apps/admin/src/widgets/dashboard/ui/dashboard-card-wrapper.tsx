import { Card, CardContent, CardHeader, CardTitle, Button } from '@/shared/ui';
import { AlertCircle, ArrowRight, FileImage } from 'lucide-react';
import Link from 'next/link';

export function DashboardCardWrapper() {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="text-primary h-5 w-5" />
          <CardTitle className="text-base">오늘 업로드 필요</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <FileImage className="text-muted-foreground h-5 w-5" />
              <span>오늘 주보가 아직 등록되지 않았습니다.</span>
            </div>
            <p className="text-muted-foreground pl-8 text-sm">
              주일 예배 전 주보를 등록해 주세요. 성도님들이 확인합니다.
            </p>
          </div>
          <Button asChild size="lg" className="shrink-0">
            <Link href="/admin/bulletin">
              주보 등록하기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

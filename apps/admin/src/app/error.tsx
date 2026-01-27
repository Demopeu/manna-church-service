'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Church, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/shared/ui';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="bg-destructive/10 rounded-full p-4">
            <AlertTriangle className="text-destructive h-12 w-12" />
          </div>
        </div>
        <h1 className="text-foreground mb-2 text-4xl font-bold">오류 발생</h1>
        <h2 className="text-muted-foreground mb-4 text-xl font-medium">
          문제가 발생했습니다
        </h2>
        <p className="text-muted-foreground mb-8">
          일시적인 오류가 발생했습니다.
          <br />
          잠시 후 다시 시도해 주세요.
        </p>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button variant="outline" size="lg" onClick={reset}>
            <RefreshCw className="mr-2 h-5 w-5" />
            다시 시도
          </Button>
          <Button asChild size="lg">
            <Link href="/admin">
              <Home className="mr-2 h-5 w-5" />
              관리자 홈으로
            </Link>
          </Button>
        </div>
      </div>

      <div className="text-muted-foreground absolute bottom-6 flex items-center gap-2">
        <Church className="h-5 w-5" />
        <span className="text-sm">© 2026 만나교회</span>
      </div>
    </div>
  );
}

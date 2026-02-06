'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { captureException } from '@sentry/nextjs';
import { AlertTriangle, Church, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/shared/ui';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    captureException(error);
  }, [error]);

  return (
    // global-error는 Root Layout을 대체하므로 html, body 태그가 꼭 필요합니다.
    <html lang="ko">
      <body>
        {/* 님이 만드신 디자인 코드 */}
        <div className="bg-background flex min-h-screen flex-col items-center justify-center p-4">
          <div className="max-w-md text-center">
            <div className="mb-6 flex justify-center">
              <div className="bg-destructive/10 rounded-full p-4">
                <AlertTriangle className="text-destructive h-12 w-12" />
              </div>
            </div>
            <h1 className="text-foreground mb-2 text-4xl font-bold">
              치명적인 오류 발생
            </h1>
            <h2 className="text-muted-foreground mb-4 text-xl font-medium">
              앱을 불러올 수 없습니다
            </h2>
            <p className="text-muted-foreground mb-8">
              예기치 않은 문제로 전체 레이아웃을 로드하지 못했습니다.
              <br />
              잠시 후 다시 시도해 주세요.
            </p>

            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              {/* reset 버튼 클릭 시 레이아웃 재생성 시도 */}
              <Button variant="outline" size="lg" onClick={reset}>
                <RefreshCw className="mr-2 h-5 w-5" />
                다시 시도
              </Button>
              {/* 홈으로 이동 버튼 */}
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
      </body>
    </html>
  );
}

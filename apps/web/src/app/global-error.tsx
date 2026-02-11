'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { captureException } from '@sentry/nextjs';
import { AlertTriangle, Home, Phone, RefreshCcw } from 'lucide-react';
import { churchData } from '@/shared/config';
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
    console.error(error);
  }, [error]);

  return (
    <html lang="ko">
      <body>
        <div className="flex min-h-screen items-center justify-center bg-[#FFFBF5] px-4">
          <div className="w-full max-w-md text-center">
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 animate-pulse rounded-full bg-orange-100 opacity-50 blur-xl" />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-orange-50 shadow-lg">
                  <AlertTriangle
                    className="h-10 w-10 text-orange-500"
                    strokeWidth={2}
                  />
                </div>
              </div>
            </div>

            <h1 className="mb-3 text-3xl font-bold text-[#1A2B45] sm:text-4xl">
              잠시 문제가 발생했어요
            </h1>

            <p className="mb-2 text-lg font-medium text-gray-700">
              이용에 불편을 드려 죄송합니다.
            </p>
            <p className="mb-10 text-sm break-keep text-gray-500">
              예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
            </p>

            <div className="mb-8 flex flex-col gap-3">
              <Button
                onClick={() => reset()}
                className="text-md w-full rounded-full bg-[#1A2B45] py-6 font-semibold text-white shadow-lg shadow-blue-900/10 transition-all hover:bg-[#253959] hover:shadow-xl"
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                다시 시도하기
              </Button>

              <Link href="/" className="w-full">
                <Button
                  variant="outline"
                  className="text-md w-full rounded-full border-2 border-gray-300 bg-white py-6 font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                  <Home className="mr-2 h-4 w-4" />
                  홈으로 돌아가기
                </Button>
              </Link>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="mb-1 text-xs text-gray-400">
                문제가 지속되면 아래로 연락주세요
              </p>
              <a
                href={`tel:${churchData.contact.phone}`}
                className="inline-flex items-center gap-2 text-lg font-bold text-[#1A2B45] transition-colors hover:text-blue-700"
              >
                <Phone className="h-4 w-4" />
                {churchData.contact.phone}
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, RefreshCw, WifiOff } from 'lucide-react';
import { Button } from '@/shared/ui';

export default function OfflinePage() {
  const router = useRouter();
  return (
    <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center bg-[#FFFBF5] px-4 text-center">
      <div className="relative mb-8 flex h-64 w-64 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-gray-300 bg-white/50 text-gray-300">
        <WifiOff className="h-24 w-24" strokeWidth={1.5} />
      </div>

      <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
        Offline
      </h2>
      <h3 className="mb-2 text-xl font-semibold text-gray-800">
        인터넷 연결이 끊어졌습니다.
      </h3>
      <p className="mb-10 max-w-md leading-relaxed text-gray-600">
        네트워크 상태를 확인하신 후
        <br className="hidden sm:block" />
        페이지를 새로고침 해주세요.
      </p>

      <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
        <Button
          className="text-md rounded-full bg-[#1A2B45] px-8 py-6 text-white shadow-lg shadow-blue-900/10 hover:bg-[#253959]"
          onClick={() => router.refresh()}
          aria-label="페이지 새로고침"
        >
          <RefreshCw className="mr-2 h-5 w-5" />
          새로고침
        </Button>

        <Button
          className="text-md rounded-full bg-[#1A2B45] px-8 py-6 text-white shadow-lg shadow-blue-900/10 hover:bg-[#253959]"
          asChild
        >
          <Link href="/" aria-label="메인 홈페이지로 돌아가기">
            <Home className="mr-2 h-5 w-5" />
            메인으로 돌아가기
          </Link>
        </Button>
      </div>
    </div>
  );
}

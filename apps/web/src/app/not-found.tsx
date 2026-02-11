import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Home } from 'lucide-react';
import { BackButton, Button } from '@/shared/ui';

export const metadata: Metadata = {
  title: {
    absolute: '페이지를 찾을 수 없습니다',
  },
};

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center bg-[#FFFBF5] px-4 text-center">
      <div className="relative mb-8 flex h-64 w-64 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-gray-300 bg-white/50 text-gray-400">
        <Image
          src="/not-found.webp"
          alt="페이지를 찾을 수 없습니다 안내 이미지"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>

      <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
        404
      </h2>
      <h3 className="mb-2 text-xl font-semibold text-gray-800">
        페이지를 찾을 수 없습니다.
      </h3>
      <p className="mb-10 max-w-md leading-relaxed text-gray-600">
        주소가 잘못 입력되었거나, 변경 혹은 삭제되어
        <br className="hidden sm:block" />
        요청하신 페이지를 찾을 수 없습니다.
      </p>

      <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
        <BackButton className="text-md rounded-full bg-[#1A2B45] px-8 py-6 text-white shadow-lg shadow-blue-900/10 hover:bg-[#253959]" />
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

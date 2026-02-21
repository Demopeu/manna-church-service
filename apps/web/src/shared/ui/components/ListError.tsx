'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AlertCircle } from 'lucide-react';

interface Props {
  title: string;
}

export function ListError({ title }: Props) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-linear-to-br from-red-100 to-orange-100 opacity-50 blur-xl" />
            <div className="relative rounded-full border border-red-100 bg-white p-4 shadow-lg">
              <AlertCircle className="h-8 w-8 text-red-500" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        <h2 className="text-foreground mb-2 text-2xl font-bold">{title}</h2>

        <p className="text-muted-foreground mb-6 text-sm break-keep">
          존재하지 않는 페이지이거나 일시적인 오류가 발생했습니다.
          <br />
          아래 버튼을 눌러 목록으로 돌아가주세요.
        </p>

        <Link
          href={pathname}
          className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
        >
          목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}

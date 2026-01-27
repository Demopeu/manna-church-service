import Link from 'next/link';
import { ArrowLeft, Church, Home } from 'lucide-react';
import { Button } from '@/shared/ui';

export default function NotFound() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="bg-primary/10 rounded-full p-4">
            <Church className="text-primary h-12 w-12" />
          </div>
        </div>

        {/* 404 텍스트 */}
        <h1 className="text-primary mb-2 text-8xl font-bold">404</h1>
        <h2 className="text-foreground mb-4 text-2xl font-semibold">
          페이지를 찾을 수 없습니다
        </h2>
        <p className="text-muted-foreground mb-8">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
          <br />
          주소를 다시 확인해 주세요.
        </p>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild variant="outline" size="lg">
            <Link href="javascript:history.back()">
              <ArrowLeft className="mr-2 h-5 w-5" />
              이전 페이지
            </Link>
          </Button>
          <Button asChild size="lg">
            <Link href="/admin">
              <Home className="mr-2 h-5 w-5" />
              관리자 홈으로
            </Link>
          </Button>
        </div>
      </div>

      <p className="text-muted-foreground absolute bottom-6 text-sm">
        © 2026 만나교회
      </p>
    </div>
  );
}

import { AlertCircle } from 'lucide-react';

export function BulletinListError() {
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

        <h2 className="text-foreground mb-2 text-2xl font-bold">
          주보를 불러올 수 없어요
        </h2>

        <p className="text-muted-foreground mb-6 text-sm">
          일시적인 오류가 발생했습니다. 페이지를 새로고침해주세요.
        </p>
      </div>
    </div>
  );
}

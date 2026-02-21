import Image from 'next/image';
import { notFound } from 'next/navigation';
import { AlertCircle, ArrowLeft, Calendar } from 'lucide-react';
import { getBulletinByDate } from '@/entities/bulletin';
import { formatKoreanDate } from '@/shared/lib';
import { BackButton, withAsyncBoundary } from '@/shared/ui';

async function BulletinDetailBase({ date }: { date: string }) {
  const bulletin = await getBulletinByDate(date);

  if (!bulletin) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="border-border border-b pb-6">
        <div className="text-manna-dark-blue mb-2 flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          <span className="font-semibold">
            {formatKoreanDate(bulletin.publishedAt)}
          </span>
        </div>
        <h1 className="text-foreground text-3xl font-bold">주보 상세보기</h1>
      </div>
      <div className="ring-border/5 flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1">
        {bulletin.coverImageUrl && (
          <div className="relative w-full">
            <Image
              src={bulletin.coverImageUrl}
              alt={`${formatKoreanDate(bulletin.publishedAt)} 주보 표지`}
              width={0}
              height={0}
              sizes="100vw"
              className="h-auto w-full"
              priority
              unoptimized
            />
          </div>
        )}

        {bulletin.imageUrls.map((url, index) => (
          <div key={index} className="relative w-full">
            <Image
              src={url}
              alt={`${formatKoreanDate(bulletin.publishedAt)} 주보 내지 ${index + 1}페이지`}
              width={0}
              height={0}
              sizes="100vw"
              className="h-auto w-full"
              priority={!bulletin.coverImageUrl && index === 0}
              unoptimized
            />
          </div>
        ))}
      </div>
    </div>
  );
}

interface Props {
  variant: 'skeleton' | 'error';
}

function BulletinDetailPlaceholder({ variant }: Props) {
  if (variant === 'error') {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
        <AlertCircle className="text-destructive h-12 w-12 opacity-50" />
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">주보를 불러오지 못했습니다</h3>
          <p className="text-muted-foreground text-sm">
            잠시 후 다시 시도해 주세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-pulse space-y-6">
      <div className="border-border border-b pb-6">
        <div className="mb-2 flex items-center gap-2">
          <div className="h-5 w-5 rounded bg-gray-200" />
          <div className="h-5 w-32 rounded bg-gray-200" />
        </div>
        <div className="h-9 w-48 rounded bg-gray-200" />
      </div>

      <div className="ring-border/5 overflow-hidden rounded-xl bg-white shadow-sm ring-1">
        <div className="aspect-[1/1.414] w-full bg-gray-200" />
      </div>
    </div>
  );
}

const BulletinDetailContent = withAsyncBoundary(BulletinDetailBase, {
  loadingFallback: <BulletinDetailPlaceholder variant="skeleton" />,
  errorFallback: <BulletinDetailPlaceholder variant="error" />,
});

export function BulletinDetail({ date }: { date: string }) {
  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-20">
      <div className="bg-background/95 sticky top-0 z-10 flex items-center py-4 backdrop-blur-sm">
        <BackButton className="group hover:text-manna-dark-blue flex items-center gap-2 border-0 bg-transparent pl-0 shadow-none hover:bg-transparent has-[>svg]:px-0">
          <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          <span className="text-lg font-medium">목록으로</span>
        </BackButton>
      </div>
      <BulletinDetailContent date={date} />
    </div>
  );
}

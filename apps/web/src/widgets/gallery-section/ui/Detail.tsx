import Image from 'next/image';
import { notFound } from 'next/navigation';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { getGalleryByShortId } from '@/entities/gallery';
import { formatKoreanDate } from '@/shared/lib';
import { BackButton, withAsyncBoundary } from '@/shared/ui';

function GalleryDetailSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="border-border border-b pb-6">
        <div className="h-9 w-1/2 rounded bg-gray-200" />
        <div className="mt-2 h-5 w-1/4 rounded bg-gray-200" />
      </div>

      <div className="flex flex-col gap-2">
        <div className="aspect-video w-full rounded-xl bg-gray-200" />
        <div className="aspect-video w-full rounded-xl bg-gray-200" />
      </div>
    </div>
  );
}

function GalleryDetailError() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
      <AlertCircle className="text-destructive h-12 w-12 opacity-50" />
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">갤러리를 불러오지 못했습니다</h3>
        <p className="text-muted-foreground text-sm">
          잠시 후 다시 시도해 주세요.
        </p>
      </div>
    </div>
  );
}

async function GalleryDetailBase({ shortId }: { shortId: string }) {
  const gallery = await getGalleryByShortId(shortId);

  if (!gallery) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="border-border border-b pb-6">
        <h1 className="text-foreground text-3xl font-bold">{gallery.title}</h1>
        <p className="text-muted-foreground mt-2">
          {formatKoreanDate(gallery.eventDate)} &middot; {gallery.images.length}
          장
        </p>
      </div>

      <div className="flex flex-col gap-2 overflow-hidden">
        {gallery.images.map((image, index) => (
          <div
            key={image.id}
            className="relative w-full overflow-hidden rounded-xl shadow-sm transition-shadow hover:shadow-md"
          >
            <Image
              src={image.storagePath}
              alt={`${gallery.title} 사진 ${index + 1}번째`}
              width={0}
              height={0}
              sizes="100vw"
              className="h-auto w-full"
              priority={index < 2}
              unoptimized
            />
          </div>
        ))}
      </div>
    </div>
  );
}

const GalleryDetailContent = withAsyncBoundary(GalleryDetailBase, {
  loadingFallback: <GalleryDetailSkeleton />,
  errorFallback: <GalleryDetailError />,
});

interface Props {
  shortId: string;
}

export function GalleryDetail({ shortId }: Props) {
  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-20">
      <div className="bg-background/95 sticky top-0 z-10 flex items-center py-4 backdrop-blur-sm">
        <BackButton className="group hover:text-manna-dark-blue flex items-center gap-2 border-0 bg-transparent pl-0 shadow-none hover:bg-transparent">
          <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          <span className="text-lg font-medium">목록으로</span>
        </BackButton>
      </div>

      <GalleryDetailContent shortId={shortId} />
    </div>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import DEFAULT_BULLETIN from '@/app/asset/default/DEFAULT_BULLETIN.png';
import { getBulletins } from '@/entities/bulletin';
import { formatKoreanDate } from '@/shared/lib';
import { withAsyncBoundary } from '@/shared/ui';
import { BulletinListError } from './Error';
import { BulletinListSkeleton } from './Skeleton';
import { BulletinContentWrapper } from './Wrapper';

interface Props {
  filterParams: Promise<{ year: number; month: number; page: number }>;
}

async function List({ filterParams }: Props) {
  const { year, month, page } = await filterParams;
  const { bulletins, totalPages, totalCount } = await getBulletins({
    year,
    month,
    page,
  });

  return (
    <BulletinContentWrapper
      totalCount={totalCount}
      totalPages={totalPages}
      currentPage={page}
      currentYear={year === 0 ? 'all' : String(year)}
      currentMonth={month === 0 ? 'all' : String(month).padStart(2, '0')}
    >
      {bulletins.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {bulletins.map((bulletin) => (
            <Link
              key={bulletin.id}
              href={`/about/bulletins/${format(new Date(bulletin.publishedAt), 'yyyy-MM-dd')}`}
              className="group block cursor-pointer text-left"
              aria-label={`${formatKoreanDate(bulletin.publishedAt)} 주보 상세 보기`}
            >
              <div className="group relative aspect-210/297 overflow-hidden bg-transparent transition-all group-hover:scale-105">
                <Image
                  src={bulletin.coverImageUrl || DEFAULT_BULLETIN}
                  alt={`${formatKoreanDate(bulletin.publishedAt)} 주보 표지`}
                  fill
                  className="object-contain duration-300"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  unoptimized
                />
              </div>

              <p className="text-foreground mt-3 text-center font-bold">
                {formatKoreanDate(bulletin.publishedAt)}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="border-muted-foreground/30 flex h-64 items-center justify-center rounded-xl border border-dashed">
          <p className="text-muted-foreground">해당 기간의 주보가 없습니다.</p>
        </div>
      )}
    </BulletinContentWrapper>
  );
}

export const BulletinList = withAsyncBoundary(List, {
  loadingFallback: <BulletinListSkeleton />,
  errorFallback: <BulletinListError />,
});

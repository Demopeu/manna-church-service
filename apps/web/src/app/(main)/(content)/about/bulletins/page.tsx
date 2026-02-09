import { BulletinList, bulletinsData } from '@/widgets/bulletins-section';
import { MainWrapper } from '@/shared/ui';

export default async function BulletinsPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string; page?: string }>;
}) {
  const { year, month, page } = await searchParams;
  const yearNum = year && year !== 'all' ? Number(year) : 0;
  const monthNum = month && month !== 'all' ? Number(month) : 0;
  const pageNum = page ? Number(page) : 1;

  return (
    <MainWrapper heroBannerData={bulletinsData}>
      <BulletinList
        key={`${yearNum}-${monthNum}-${pageNum}`}
        year={yearNum}
        month={monthNum}
        page={pageNum}
      />
    </MainWrapper>
  );
}

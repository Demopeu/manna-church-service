import { BulletinList, bulletinsData } from '@/widgets/bulletins-section';
import { MainWrapper } from '@/shared/ui';

export default async function BulletinsPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string; page?: string }>;
}) {
  const filterParams = searchParams.then((sp) => ({
    year: sp.year && sp.year !== 'all' ? Number(sp.year) : 0,
    month: sp.month && sp.month !== 'all' ? Number(sp.month) : 0,
    page: sp.page ? Number(sp.page) : 1,
  }));
  return (
    <MainWrapper heroBannerData={bulletinsData}>
      <BulletinList filterParams={filterParams} />
    </MainWrapper>
  );
}

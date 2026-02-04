import { BulletinsList } from '@/widgets/bulletin-list';
import { CreateBulletinButton } from '@/features/bulletin';

export default async function BulletinsPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string; page?: string }>;
}) {
  const { year: yearParam, month: monthParam, page } = await searchParams;

  const year = yearParam !== undefined ? Number(yearParam) : 0;
  const month = monthParam !== undefined ? Number(monthParam) : 0;
  const currentPage = Math.max(1, Number(page) || 1);

  return (
    <div className="space-y-6">
      <CreateBulletinButton />
      <BulletinsList year={year} month={month} currentPage={currentPage} />
    </div>
  );
}

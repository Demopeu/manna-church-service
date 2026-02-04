import { BulletinsList } from '@/widgets/bulletin-list';
import { CreateBulletinButton } from '@/features/bulletin';
import { getCurrentYearMonth } from '@/shared/lib';

export default async function BulletinsPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string; page?: string }>;
}) {
  const { year: yearParam, month: monthParam, page } = await searchParams;

  const { year: currentYear, month: currentMonth } = getCurrentYearMonth();
  const year = yearParam !== undefined ? Number(yearParam) : currentYear;
  const month = monthParam !== undefined ? Number(monthParam) : currentMonth;
  const currentPage = Math.max(1, Number(page) || 1);

  return (
    <div className="space-y-6">
      <CreateBulletinButton />
      <BulletinsList year={year} month={month} currentPage={currentPage} />
    </div>
  );
}

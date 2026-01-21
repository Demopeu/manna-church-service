import { BulletinsList } from '@/widgets/bulletin-list';
import { CreateBulletinButton } from '@/features/bulletin';

export default async function BulletinsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page } = await searchParams;

  const searchQuery = q || '';
  const currentPage = Math.max(1, Number(page) || 1);
  return (
    <div className="space-y-6">
      <CreateBulletinButton />
      <BulletinsList searchQuery={searchQuery} currentPage={currentPage} />
    </div>
  );
}

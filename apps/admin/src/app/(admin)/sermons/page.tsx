import { SermonsList } from '@/widgets/sermon-list';
import { CreateSermonButton } from '@/features/sermon';

export default async function SermonsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page } = await searchParams;

  const searchQuery = q || '';
  const currentPage = Math.max(1, Number(page) || 1);
  return (
    <div className="space-y-6">
      <CreateSermonButton />
      <SermonsList searchQuery={searchQuery} currentPage={currentPage} />
    </div>
  );
}

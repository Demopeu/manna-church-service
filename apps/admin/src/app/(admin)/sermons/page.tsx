import { SermonsList } from '@/widgets/sermons';
import { CreateSermonButton } from '@/features/sermon';
import { getSermons } from '@/entities/sermons';

export default async function SermonsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page } = await searchParams;

  const searchQuery = q || '';
  const currentPage = Math.max(1, Number(page) || 1);

  const { sermons, totalPages } = await getSermons({
    query: searchQuery,
    page: currentPage,
  });
  return (
    <div className="space-y-6">
      <CreateSermonButton />
      <SermonsList
        sermons={sermons}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  );
}

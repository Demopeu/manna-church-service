import { MissionariesList } from '@/widgets/missionary-list';
import { CreateMissionaryButton } from '@/features/missionary';

export default async function MissionariesPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
}) {
  const { q, page } = await searchParams;

  const searchQuery = q || '';
  const currentPage = Math.max(1, Number(page) || 1);
  return (
    <div className="space-y-6">
      <CreateMissionaryButton />

      <MissionariesList searchQuery={searchQuery} currentPage={currentPage} />
    </div>
  );
}

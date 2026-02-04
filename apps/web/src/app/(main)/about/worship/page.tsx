import { WorshipContent, worshipData } from '@/widgets/worship-section';
import { HeroBanner } from '@/shared/ui';

export default function WorshipPage() {
  return (
    <main className="mb-10 min-w-0 flex-1 space-y-10">
      <HeroBanner {...worshipData} />
      <WorshipContent />
    </main>
  );
}

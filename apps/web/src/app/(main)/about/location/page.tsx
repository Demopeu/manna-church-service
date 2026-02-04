import { LocationContent, locationData } from '@/widgets/location-section';
import { HeroBanner } from '@/shared/ui';

export default function LocationPage() {
  return (
    <main className="mb-10 min-w-0 flex-1 space-y-10">
      <HeroBanner {...locationData} />
      <LocationContent />
    </main>
  );
}

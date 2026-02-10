import { getAllMissionaries } from '@/entities/missionary';
import { HangingPolaroid } from './HangingPolaroid';

export async function MissionarySection() {
  const missionaries = await getAllMissionaries();

  if (missionaries.length === 0) {
    return null;
  }

  return (
    <section className="space-y-8">
      <div className="relative">
        <div className="bg-border absolute top-0 right-0 left-0 h-px" />
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          {missionaries.map((m, index) => (
            <HangingPolaroid
              key={m.id}
              name={m.name}
              country={m.country}
              imageUrl={m.imageUrl}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

import Image from 'next/image';
import { Servant } from '@/entities/servant';

interface Props {
  leaders: Servant[];
}

export function DistrictLeaderList({ leaders }: Props) {
  if (leaders.length === 0) return null;

  return (
    <section>
      <h2 className="text-foreground border-manna mb-6 border-b-2 pb-2 text-xl font-bold">
        구역장
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {leaders.map((leader) => (
          <div
            key={leader.id}
            className="bg-card border-border flex flex-col items-center rounded-xl border p-4 text-center shadow-sm"
          >
            <div className="bg-manna-mint/30 mb-3 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full md:h-20 md:w-20">
              <Image
                src={leader.photoFile || '/placeholder.svg'}
                alt={leader.name}
                className="h-full w-full object-cover"
                width={64}
                height={64}
              />
            </div>

            <p className="text-manna mb-1 text-xs font-medium">{leader.role}</p>
            <h4 className="text-foreground text-sm font-semibold md:text-base">
              {leader.name}
            </h4>
            {leader.introduction && (
              <p className="text-muted-foreground mt-1 line-clamp-1 text-xs">
                {leader.introduction}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

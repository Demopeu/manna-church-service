import { SermonsList } from '@/widgets/sermons';
import { CreateSermonButton } from '@/features/sermon';

export default function SermonsPage() {
  return (
    <div className="space-y-6">
      <CreateSermonButton />
      <SermonsList />
    </div>
  );
}

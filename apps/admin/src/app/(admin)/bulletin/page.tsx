import { BulletinsList } from '@/widgets/bulletins';
import { CreateBulletinButton } from '@/features/bulletin';

export default function BulletinPage() {
  return (
    <div className="space-y-6">
      <CreateBulletinButton />
      <BulletinsList />
    </div>
  );
}

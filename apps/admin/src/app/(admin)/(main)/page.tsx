import { Date, BulletinTaskCard } from '@/widgets/dashboard';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <Date />
      <BulletinTaskCard />
    </div>
  );
}

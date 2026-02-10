import { notFound } from 'next/navigation';
import { BulletinDetail } from '@/widgets/bulletins-section';

interface Props {
  params: Promise<{ date: string }>;
}

export default async function BulletinDetailPage({ params }: Props) {
  const { date } = await params;
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    notFound();
  }

  return <BulletinDetail date={date} />;
}

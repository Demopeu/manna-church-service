import { notFound } from 'next/navigation';
import { BulletinDetail } from '@/widgets/bulletins-section';
import { getBulletinByDate } from '@/entities/bulletin/api/queries';

interface Props {
  params: Promise<{ date: string }>;
}

export default async function BulletinDetailPage({ params }: Props) {
  const { date } = await params;
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    notFound();
  }

  const bulletin = await getBulletinByDate(date);

  if (!bulletin) {
    notFound();
  }

  return <BulletinDetail bulletin={bulletin} />;
}

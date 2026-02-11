import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BulletinDetail } from '@/widgets/bulletins-section';
import { getBulletinByDate, getRecentBulletinDates } from '@/entities/bulletin';
import { DEFAULT_OG_IMAGE } from '@/shared/config';

interface Props {
  params: Promise<{ date: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { date } = await params;
  const bulletin = await getBulletinByDate(date);

  if (!bulletin) {
    return { title: '주보를 찾을 수 없습니다' };
  }

  const ogImage =
    bulletin.coverImageUrl || bulletin.imageUrls[0] || DEFAULT_OG_IMAGE;

  return {
    title: `${date} 주보`,
    description: `만나교회 ${date} 주보입니다.`,
    alternates: {
      canonical: `/about/bulletins/${date}`,
    },
    openGraph: {
      title: `${date} 주보`,
      description: `만나교회 ${date} 주보입니다.`,
      images: [{ url: ogImage }],
    },
  };
}

export async function generateStaticParams() {
  return await getRecentBulletinDates(20);
}

export default async function BulletinDetailPage({ params }: Props) {
  const { date } = await params;
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    notFound();
  }

  return <BulletinDetail date={date} />;
}

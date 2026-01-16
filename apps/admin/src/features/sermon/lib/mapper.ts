import { Sermon } from '@/entities/sermon';

export const getDefaultValues = (sermon?: Sermon) => ({
  title: sermon?.title ?? '',
  preacher: sermon?.preacher ?? '',
  date: sermon?.date ?? '',
  videoUrl: sermon?.videoUrl ?? '',
});

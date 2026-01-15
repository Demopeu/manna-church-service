import { Sermon } from '@/entities/sermons';

export const getDefaultValues = (sermon?: Sermon) => ({
  title: sermon?.title ?? '',
  preacher: sermon?.preacher ?? '',
  date: sermon?.date ?? '',
  videoUrl: sermon?.videoUrl ?? '',
});

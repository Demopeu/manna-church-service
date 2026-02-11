import { churchData } from './metadata';

export const menuData = {
  교회소개: [
    { title: '만나교회 소개', href: '/about/intro', icon: 'Church' },
    { title: '오시는 길', href: '/about/location', icon: 'MapPin' },
    { title: '주보', href: '/about/bulletins', icon: 'BookOpen' },
    { title: '예배 안내', href: '/about/worship', icon: 'Calendar' },
    { title: '섬기는 사람들', href: '/about/servants', icon: 'Users' },
    { title: '설교 영상', href: churchData.social.youtube, icon: 'Video' },
    { title: '선교사 후원', href: '/about/missionary', icon: 'Plane' },
  ],
  만나소식: [
    { title: '공지사항', href: '/news/announcements', icon: 'Bell' },
    { title: '이벤트', href: '/news/events', icon: 'Heart' },
    { title: '갤러리', href: '/news/gallery', icon: 'ImageIcon' },
  ],
};

export const Items = [
  {
    icon: '/icons/church.png',
    label: '교회소개',
    href: '/about/intro',
  },
  {
    icon: '/icons/sermon.png',
    label: '설교영상',
    href: churchData.social.youtube,
  },
  {
    icon: '/icons/bulletin.png',
    label: '주보',
    href: '/about/bulletins',
  },
  {
    icon: '/icons/calendar.png',
    label: '예배안내',
    href: '/about/worship',
  },
  {
    icon: '/icons/map.png',
    label: '오시는길',
    href: '/about/location',
  },
  {
    icon: '/icons/community.png',
    label: '섬기는사람들',
    href: '/about/servants',
  },
  {
    icon: '/icons/bible.png',
    label: '성경타자',
    href: 'https://bible.cts.tv/cts/bible',
  },
  {
    icon: '/icons/missionary.png',
    label: '선교사 후원',
    href: '/about/missionary',
  },
];

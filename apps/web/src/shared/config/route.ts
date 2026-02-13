import BibleIcon from '@/app/asset/icons/bible.png';
import BulletinIcon from '@/app/asset/icons/bulletin.png';
import CalendarIcon from '@/app/asset/icons/calendar.png';
import ChurchIcon from '@/app/asset/icons/church.png';
import CommunityIcon from '@/app/asset/icons/community.png';
import MapIcon from '@/app/asset/icons/map.png';
import MissionaryIcon from '@/app/asset/icons/missionary.png';
import SermonIcon from '@/app/asset/icons/sermon.png';
import { churchData } from './metadata';

export const menuData = {
  교회소개: [
    { title: '만나교회 소개', href: '/about/intro', icon: 'Church' },
    { title: '오시는 길', href: '/about/location', icon: 'MapPin' },
    { title: '주보', href: '/about/bulletins', icon: 'BookOpen' },
    { title: '예배 안내', href: '/about/worship', icon: 'Calendar' },
    { title: '섬기는 사람들', href: '/about/servants', icon: 'Users' },
    { title: '1분 메세지', href: churchData.social.youtube, icon: 'Video' },
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
    icon: ChurchIcon,
    label: '교회소개',
    href: '/about/intro',
  },
  {
    icon: SermonIcon,
    label: '1분 메세지',
    href: churchData.social.youtube,
  },
  {
    icon: BulletinIcon,
    label: '주보',
    href: '/about/bulletins',
  },
  {
    icon: CalendarIcon,
    label: '예배안내',
    href: '/about/worship',
  },
  {
    icon: MapIcon,
    label: '오시는길',
    href: '/about/location',
  },
  {
    icon: CommunityIcon,
    label: '섬기는사람들',
    href: '/about/servants',
  },
  {
    icon: BibleIcon,
    label: '성경타자',
    href: 'https://bible.cts.tv/cts/bible',
  },
  {
    icon: MissionaryIcon,
    label: '선교사 후원',
    href: '/about/missionary',
  },
];

import {
  BookOpen,
  Calendar,
  type LucideIcon,
  Moon,
  Sun,
  Sunrise,
  Users,
} from 'lucide-react';
import type { AccentColor } from './mapper';

export const worshipData = {
  title: '예배 안내',
  subtitle: '하나님과 만나는 거룩한 시간',
  breadcrumbs: [
    { label: '교회 소개', href: '/about/intro' },
    { label: '예배 시간', href: '/about/worship' },
  ],
  backgroundImage: '/hero-banner/worship.webp',
};

export interface WorshipCategory {
  id: string;
  title: string;
  featured?: boolean;
  accentColor?: AccentColor;
  items: WorshipItem[];
}

export interface WorshipItem {
  name: string;
  time: string;
  location: string;
  days?: string;
  icon: LucideIcon;
  iconColor?: AccentColor;
}

export const WORSHIP_DATA: WorshipCategory[] = [
  {
    id: 'sunday',
    title: '주일예배',
    featured: true,
    accentColor: 'manna',
    items: [
      {
        name: '주일 오전 예배',
        time: '오전 11:00',
        location: '본당',
        days: '주일',
        icon: Sun,
        iconColor: 'manna',
      },
      {
        name: '주일 오후 예배',
        time: '오후 2:00',
        location: '본당',
        days: '주일',
        icon: Sun,
        iconColor: 'manna',
      },
    ],
  },
  {
    id: 'weekday',
    title: '주중 예배 및 기도회',
    accentColor: 'blue',
    items: [
      {
        name: '새벽 기도회',
        time: '오전 5:30',
        location: '본당',
        days: '월~토 (주일 제외)',
        icon: Sunrise,
        iconColor: 'blue',
      },
      {
        name: '수요 저녁 기도회',
        time: '오후 7:30',
        location: '본당',
        days: '수요일',
        icon: Moon,
        iconColor: 'blue',
      },
      {
        name: '저녁 기도회',
        time: '오후 8:30',
        location: '본당',
        days: '월, 화, 목, 금',
        icon: Moon,
        iconColor: 'blue',
      },
      {
        name: '구역 모임',
        time: '2,4주차 오후 2:00',
        location: '각 구역',
        icon: Users,
        iconColor: 'blue',
      },
    ],
  },
  {
    id: 'nextgen',
    title: '다음세대 예배',
    accentColor: 'cyan',
    items: [
      {
        name: '유년부 예배',
        time: '오전 11:00',
        location: '유년부실',
        days: '주일',
        icon: BookOpen,
        iconColor: 'cyan',
      },
      {
        name: '청소년부 예배',
        time: '오전 11:00',
        location: '유년부실',
        days: '주일',
        icon: Calendar,
        iconColor: 'cyan',
      },
      {
        name: '청년부 예배',
        time: '2,4주차 오후 2:00',
        location: '유년부실',
        days: '주일',
        icon: Users,
        iconColor: 'cyan',
      },
    ],
  },
];

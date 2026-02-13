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
  subtitle: '하나님과 만나는 거룩한 시간입니다',
  breadcrumbs: [
    { label: '교회 소개', href: '/about/intro' },
    { label: '예배 안내', href: '/about/worship' },
  ],
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
  information: string;
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
        information:
          '주제설교를 통해 하나님의 은혜를 사모하며 경건한 예배로 드려집니다',
      },
      {
        name: '주일 오후 예배',
        time: '오후 2:00',
        location: '본당',
        days: '주일',
        icon: Sun,
        iconColor: 'manna',
        information:
          '소교리문답과 성경개론과 특정주제를 차례대로 명료하게 해설하는 형식으로 진행됩니다',
      },
    ],
  },
  {
    id: 'weekday',
    title: '주중 예배 및 기도회',
    accentColor: 'cyan',
    items: [
      {
        name: '새벽 기도회',
        time: '오전 5:30',
        location: '본당',
        days: '월~토 (주일 제외)',
        icon: Sunrise,
        iconColor: 'cyan',
        information: '고신교단의 QT묵상집을 통하여 은혜를 나누고 기도합니다',
      },
      {
        name: '수요 저녁 기도회',
        time: '오후 7:30',
        location: '본당',
        days: '수요일',
        icon: Moon,
        iconColor: 'cyan',
        information:
          '구약성경을 차례대로 설교하며 그 내용을 바탕으로 기도회가 이어집니다',
      },
      {
        name: '저녁 기도회',
        time: '오후 8:30',
        location: '본당',
        days: '월, 화, 목, 금',
        icon: Moon,
        iconColor: 'cyan',
        information: '직장인을 위하여 고신교단의 QT묵상집을 나누고 기도합니다',
      },
      {
        name: '구역 모임',
        time: '2,4주차 오후 2:00',
        location: '각 구역',
        icon: Users,
        iconColor: 'cyan',
        information:
          '교회와 가정에서 모임으로 믿음의 성장, 성도의 교제를 목표로 합니다',
      },
    ],
  },
  {
    id: 'nextgen',
    title: '다음세대 예배',
    accentColor: 'blue',
    items: [
      {
        name: '유년부 모임',
        time: '오전 12:10',
        location: '유년부실',
        days: '주일',
        icon: BookOpen,
        iconColor: 'blue',
        information:
          '주일 통합예배와 식사 후, 유년부실에서 교단공과로 성경을 공부합니다',
      },
      {
        name: '청소년부 모임',
        time: '오전 12:10',
        location: '청년부실',
        days: '주일',
        icon: Calendar,
        iconColor: 'blue',
        information:
          '주일 통합예배 후 청소년부실에서 교단공과로 성경을 공부합니다',
      },
      {
        name: '청년부 모임',
        time: '2,4주차 오후 2:00',
        location: '청년부실',
        days: '주일',
        icon: Users,
        iconColor: 'blue',
        information: '청년부실에서 주일공과로 성경을 나누고, 교제합니다',
      },
    ],
  },
];

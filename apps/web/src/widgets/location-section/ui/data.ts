import { Bus, Car, LucideIcon, Train } from 'lucide-react';
import { GoogleIcon, KakaoIcon, NaverIcon } from '@/shared/icon';

export const locationData = {
  title: '오시는 길',
  subtitle: '만남이 기다리는 곳, 만나교회로 오시는 길',
  breadcrumbs: [
    { label: '교회 소개', href: '/about/intro' },
    { label: '오시는 길', href: '/about/location' },
  ],
  backgroundImage: '/hero-banner/location.webp',
};

export type TransportType = 'subway' | 'bus' | 'car';

export interface TransportItem {
  type: TransportType;
  title: string;
  icon: LucideIcon;
  details: string[];
  theme: {
    bg: string;
    text: string;
  };
}

export const transportData: TransportItem[] = [
  {
    type: 'subway',
    title: '지하철',
    icon: Train,
    details: ['1호선 낫개역 4번 출구에서 도보 3분'],
    theme: { bg: 'bg-manna-dark-blue/10', text: 'text-manna-dark-blue' },
  },
  {
    type: 'bus',
    title: '버스',
    icon: Bus,
    details: [
      '마을버스 사하구 6, 8 다송중학교에서 하차 후 도보 2분',
      '2, 3, 11, 96,96-1, 338, 3001 낫개역에서 하차 후 도보 3분',
    ],
    theme: { bg: 'bg-manna-green/10', text: 'text-manna-green' },
  },
  {
    type: 'car',
    title: '주차',
    icon: Car,
    details: ['교회 옆 하나돈까스 앞 주차장'],
    theme: { bg: 'bg-manna-cyan/10', text: 'text-manna-cyan' },
  },
];

interface MapLinkItem {
  id: string;
  name: string;
  href: string;
  icon: React.ElementType;
  style: {
    className: string;
  };
}

export const mapLinks: MapLinkItem[] = [
  {
    id: 'naver',
    name: '네이버 지도',
    href: 'https://map.naver.com/p/search/%EB%A7%8C%EB%82%98%EA%B5%90%ED%9A%8C/place/2011349726',
    icon: NaverIcon,
    style: {
      className:
        'bg-[#03C75A] text-white hover:bg-[#02b351] border-transparent',
    },
  },
  {
    id: 'kakao',
    name: '카카오맵',
    href: 'https://place.map.kakao.com/1880305899',
    icon: KakaoIcon,
    style: {
      className:
        'bg-[#FEE500] text-black hover:bg-[#ebd400] border-transparent',
    },
  },
  {
    id: 'google',
    name: '구글 지도',
    href: 'https://www.google.co.kr/maps/place/%EB%A7%8C%EB%82%98%EA%B5%90%ED%9A%8C/data=!3m1!4b1!4m6!3m5!1s0x3568c30003bedb81:0x351710837200fa8!8m2!3d35.0637401!4d128.9813358!16s%2Fg%2F11mz75_wc5?entry=ttu&g_ep=EgoyMDI2MDIwMS4wIKXMDSoASAFQAw%3D%3D',
    icon: GoogleIcon,
    style: {
      className: 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50',
    },
  },
];

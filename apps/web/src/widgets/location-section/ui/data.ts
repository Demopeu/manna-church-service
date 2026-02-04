import { Bus, Car, LucideIcon, Train } from 'lucide-react';
import { GoogleIcon, KakaoIcon, NaverIcon } from '@/shared/icon';

export const locationData = {
  title: '오시는 길',
  subtitle: 'God Bless You! 환영하고 축복합니다.',
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
    href: 'https://map.naver.com/p/search/%EB%B6%80%EC%82%B0%20%EC%82%AC%ED%95%98%EA%B5%AC%20%EB%8B%A4%EB%8C%80%EB%A1%9C429%EB%B2%88%EA%B8%B8%2023/address/14358135.0200915,4172542.9830382,%EB%B6%80%EC%82%B0%EA%B4%91%EC%97%AD%EC%8B%9C%20%EC%82%AC%ED%95%98%EA%B5%AC%20%EB%8B%A4%EB%8C%80%EB%A1%9C429%EB%B2%88%EA%B8%B8%2023?c=20.00,0,0,0,dh&isCorrectAnswer=true',
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

import {
  CalendarDays,
  FileImage,
  Globe,
  Images,
  LayoutDashboard,
  Megaphone,
  Settings,
  Users,
  Video,
} from 'lucide-react';

export const ADMIN_ROUTES = [
  { href: '/', label: '대시보드', icon: LayoutDashboard },
  { href: '/sermons', label: '설교', icon: Video },
  { href: '/bulletins', label: '주보', icon: FileImage },
  { href: '/gallery', label: '갤러리', icon: Images },
  { href: '/events', label: '이벤트', icon: CalendarDays },
  { href: '/announcements', label: '공지', icon: Megaphone },
  { href: '/servants', label: '섬기는 사람들', icon: Users },
  { href: '/missionaries', label: '선교사', icon: Globe },
  { href: '/setting', label: '설정', icon: Settings },
];

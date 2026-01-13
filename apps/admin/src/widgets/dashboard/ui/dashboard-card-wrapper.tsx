import { Card, CardContent, CardHeader, CardTitle, Button } from '@/shared/ui';
import { ArrowRight, LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface Prop {
  title: string;
  icon: LucideIcon;
  href: string;
  children: React.ReactNode;
}

export function DashboardCardWrapper({
  title,
  icon: Icon,
  href,
  children,
}: Prop) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="text-primary h-5 w-5" />
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href={href}>
              관리
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

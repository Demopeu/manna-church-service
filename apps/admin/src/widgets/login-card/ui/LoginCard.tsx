import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui';
import { Church } from 'lucide-react';
import { LoginForm } from '@/features/auth';

export function LoginCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="space-y-4 text-center">
        <div className="bg-primary mx-auto flex h-14 w-14 items-center justify-center rounded-full">
          <Church className="text-primary-foreground h-7 w-7" />
        </div>
        <CardTitle className="text-xl font-semibold">만나교회 관리자</CardTitle>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  );
}

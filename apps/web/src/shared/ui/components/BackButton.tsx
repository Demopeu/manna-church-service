'use client';
import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../base/Button';

interface BackButtonProps {
  className?: string;
  children?: ReactNode;
}

export function BackButton({ className, children }: BackButtonProps) {
  const router = useRouter();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <Button variant="outline" onClick={handleGoBack} className={className}>
      {children || (
        <>
          <ArrowLeft className="mr-2 h-5 w-5" />
          뒤로 가기
        </>
      )}
    </Button>
  );
}

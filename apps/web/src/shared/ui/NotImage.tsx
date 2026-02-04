import { ImageIcon } from 'lucide-react';

export function NotImage() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-gray-100 text-gray-400">
      <ImageIcon className="mb-2 h-10 w-10 opacity-50" />
      <span className="text-sm font-medium text-gray-500">이미지 준비중</span>
    </div>
  );
}

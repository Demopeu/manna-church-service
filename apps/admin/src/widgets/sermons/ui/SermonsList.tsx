'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  EmptyState,
} from '@/shared/ui';
import { Video } from 'lucide-react';
import { mockSermons } from '../config/dummy';
import { SermonsItem } from './SermonsItem';

export function SermonsList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>설교 목록</CardTitle>
        <CardDescription>등록된 설교 영상을 관리합니다.</CardDescription>
      </CardHeader>
      <CardContent>
        {mockSermons.length === 0 ? (
          <EmptyState
            icon={Video}
            title="등록된 설교가 없습니다"
            description="위의 '설교 등록' 버튼을 눌러 첫 설교를 등록해보세요."
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">제목</TableHead>
                  <TableHead>설교자</TableHead>
                  <TableHead>날짜</TableHead>
                  <TableHead>링크</TableHead>
                  <TableHead className="text-right">관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSermons.map((sermon) => (
                  <SermonsItem key={sermon.id} {...sermon} />
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

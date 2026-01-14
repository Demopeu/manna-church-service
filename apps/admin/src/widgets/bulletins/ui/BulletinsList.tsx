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
import { FileImage } from 'lucide-react';
import { mockBulletins } from '../config/dummy';
import { BulletinsItem } from './BulletinsItem';

export function BulletinsList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>주보 목록</CardTitle>
        <CardDescription>등록된 주보를 관리합니다.</CardDescription>
      </CardHeader>
      <CardContent>
        {mockBulletins.length === 0 ? (
          <EmptyState
            icon={FileImage}
            title="등록된 주보가 없습니다"
            description="위의 '주보 등록' 버튼을 눌러 첫 주보를 업로드해보세요."
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>파일명</TableHead>
                  <TableHead>게시일</TableHead>
                  <TableHead>업로드일</TableHead>
                  <TableHead className="text-right">관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockBulletins.map((bulletin) => (
                  <BulletinsItem key={bulletin.id} {...bulletin} />
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

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
import { Megaphone } from 'lucide-react';
import { mockAnnouncements } from '../config/dummy';
import { AnnouncementsItem } from './AnnouncementsItem';

export function AnnouncementsList() {
  const handleEdit = (id: string) => {
    console.log('공지 수정:', id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>공지 목록</CardTitle>
        <CardDescription>등록된 공지사항을 관리합니다.</CardDescription>
      </CardHeader>
      <CardContent>
        {mockAnnouncements.length === 0 ? (
          <EmptyState
            icon={Megaphone}
            title="등록된 공지가 없습니다"
            description="위의 '공지 작성' 버튼을 눌러 첫 공지를 등록해보세요."
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">제목</TableHead>
                  <TableHead className="min-w-[300px]">내용</TableHead>
                  <TableHead>작성일</TableHead>
                  <TableHead className="text-right">관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAnnouncements.map((announcement) => (
                  <AnnouncementsItem
                    key={announcement.id}
                    {...announcement}
                    onEdit={() => handleEdit(announcement.id)}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

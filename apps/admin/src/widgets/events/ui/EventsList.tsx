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
import { CalendarDays } from 'lucide-react';
import { mockEvents } from '../config/dummy';
import { EventsItem } from './EventsItem';

export function EventsList() {
  const handleEdit = (id: string) => {
    console.log('이벤트 수정:', id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>이벤트 목록</CardTitle>
        <CardDescription>등록된 이벤트를 관리합니다.</CardDescription>
      </CardHeader>
      <CardContent>
        {mockEvents.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="등록된 이벤트가 없습니다"
            description="위의 '이벤트 등록' 버튼을 눌러 첫 이벤트를 등록해보세요."
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">사진</TableHead>
                  <TableHead className="min-w-[150px]">제목</TableHead>
                  <TableHead className="min-w-[250px]">설명</TableHead>
                  <TableHead>등록일</TableHead>
                  <TableHead className="text-right">관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockEvents.map((event) => (
                  <EventsItem
                    key={event.id}
                    {...event}
                    onEdit={() => handleEdit(event.id)}
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

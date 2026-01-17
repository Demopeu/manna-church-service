// 'use client';

// import { useState, useMemo } from 'react';
// import {
//   Button,
//   Input,
//   Card,
//   CardContent,
//   Switch,
//   EmptyState,
//   DeleteDialog,
// } from '@/shared/ui';
// import { ServantFormDialog } from './dummy-form';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/shared/ui';
// import { Plus, Search, Pencil, Trash2, Users, Phone } from 'lucide-react';
// import { useToast } from '@/hooks/use-toast';
// import Image from 'next/image';

// export interface Servant {
//   id: string;
//   name: string;
//   photo: string;
//   position: string;
//   phone?: string;
//   description?: string;
//   isVisible: boolean;
//   sortOrder: number;
// }

// const POSITION_ORDER = ['담임목사', '목사', '장로', '구역장'];

// // 예시 데이터 - sortOrder 추가 및 description 수정
// const initialServants: Servant[] = [
//   {
//     id: '1',
//     name: '김목사',
//     photo: '/pastor-portrait.png',
//     position: '담임목사',
//     phone: '010-1234-5678',
//     description: '담임 목회, 주일 예배 설교',
//     isVisible: true,
//     sortOrder: 1,
//   },
//   {
//     id: '2',
//     name: '이목사',
//     photo: '/pastor-portrait.png',
//     position: '목사',
//     phone: '010-2345-6789',
//     description: '교육 담당',
//     isVisible: true,
//     sortOrder: 2,
//   },
//   {
//     id: '3',
//     name: '박장로',
//     photo: '/elder-portrait-woman.jpg',
//     position: '장로',
//     description: '재정 담당',
//     isVisible: true,
//     sortOrder: 3,
//   },
//   {
//     id: '4',
//     name: '최구역장',
//     photo: '/church-member-portrait.jpg',
//     position: '구역장',
//     phone: '010-3456-7890',
//     description: '',
//     isVisible: true,
//     sortOrder: 4,
//   },
// ];

// export default function ServantsPage() {
//   const [servants, setServants] = useState<Servant[]>(initialServants);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingServant, setEditingServant] = useState<Servant | null>(null);
//   const [deleteTarget, setDeleteTarget] = useState<Servant | null>(null);
//   const { toast } = useToast();

//   const [filterPosition, setFilterPosition] = useState<string>('all');
//   const [filterVisibility, setFilterVisibility] = useState<string>('all');

//   const filteredServants = useMemo(() => {
//     let result = [...servants];

//     // 직분 필터
//     if (filterPosition !== 'all') {
//       result = result.filter((s) => s.position === filterPosition);
//     }

//     // 노출 여부 필터
//     if (filterVisibility === 'visible') {
//       result = result.filter((s) => s.isVisible);
//     } else if (filterVisibility === 'hidden') {
//       result = result.filter((s) => !s.isVisible);
//     }

//     // 검색
//     if (searchQuery) {
//       result = result.filter(
//         (s) =>
//           s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           s.position.toLowerCase().includes(searchQuery.toLowerCase()),
//       );
//     }

//     result.sort((a, b) => a.sortOrder - b.sortOrder);

//     return result;
//   }, [servants, searchQuery, filterPosition, filterVisibility]);

//   const handleAdd = () => {
//     setEditingServant(null);
//     setIsFormOpen(true);
//   };

//   const handleEdit = (servant: Servant) => {
//     setEditingServant(servant);
//     setIsFormOpen(true);
//   };

//   const handleSave = (data: Omit<Servant, 'id'>) => {
//     if (editingServant) {
//       setServants((prev) =>
//         prev.map((s) => (s.id === editingServant.id ? { ...s, ...data } : s)),
//       );
//       toast({
//         title: '수정 완료',
//         description: '섬기는 사람 정보가 수정되었습니다.',
//       });
//     } else {
//       const maxOrder =
//         servants.length > 0 ? Math.max(...servants.map((s) => s.sortOrder)) : 0;
//       const newServant: Servant = {
//         ...data,
//         id: Date.now().toString(),
//         sortOrder: data.sortOrder || maxOrder + 1,
//       };
//       setServants((prev) => [...prev, newServant]);
//       toast({
//         title: '추가 완료',
//         description: '새로운 섬기는 사람이 추가되었습니다.',
//       });
//     }
//     setIsFormOpen(false);
//     setEditingServant(null);
//   };

//   const handleDelete = () => {
//     if (deleteTarget) {
//       setServants((prev) => prev.filter((s) => s.id !== deleteTarget.id));
//       toast({
//         title: '삭제 완료',
//         description: '섬기는 사람이 삭제되었습니다.',
//       });
//       setDeleteTarget(null);
//     }
//   };

//   const handleVisibilityToggle = (id: string, isVisible: boolean) => {
//     setServants((prev) =>
//       prev.map((s) => (s.id === id ? { ...s, isVisible } : s)),
//     );
//     toast({
//       title: isVisible ? '노출됨' : '숨김 처리됨',
//       description: isVisible
//         ? '웹사이트에 표시됩니다.'
//         : '웹사이트에서 숨겨집니다.',
//     });
//   };

//   return (
//     <>
//       <div className="space-y-6">
//         {/* 상단: 검색 + 필터 + 버튼 */}
//         <div className="space-y-4">
//           <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//             <div className="relative max-w-sm flex-1">
//               <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
//               <Input
//                 placeholder="이름 또는 직분으로 검색..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="h-11 pl-10"
//               />
//             </div>
//             <Button size="lg" onClick={handleAdd} className="h-11">
//               <Plus className="mr-2 h-4 w-4" />
//               추가
//             </Button>
//           </div>

//           {/* 필터 */}
//           <div className="flex flex-wrap items-center gap-3">
//             <div className="flex items-center gap-2">
//               <span className="text-muted-foreground text-sm">직분:</span>
//               <Select value={filterPosition} onValueChange={setFilterPosition}>
//                 <SelectTrigger className="h-9 w-[140px]">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">전체</SelectItem>
//                   {POSITION_ORDER.map((pos) => (
//                     <SelectItem key={pos} value={pos}>
//                       {pos}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="flex items-center gap-2">
//               <span className="text-muted-foreground text-sm">노출:</span>
//               <Select
//                 value={filterVisibility}
//                 onValueChange={setFilterVisibility}
//               >
//                 <SelectTrigger className="h-9 w-[120px]">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">전체</SelectItem>
//                   <SelectItem value="visible">노출</SelectItem>
//                   <SelectItem value="hidden">숨김</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <span className="text-muted-foreground ml-auto text-sm">
//               총 {filteredServants.length}명
//             </span>
//           </div>

//           <p className="text-muted-foreground text-sm">
//             정렬 순서(1부터)대로 자동 정렬됩니다.
//           </p>
//         </div>

//         {/* 테이블 (데스크톱) */}
//         {filteredServants.length > 0 ? (
//           <>
//             <div className="border-border hidden overflow-hidden rounded-lg border md:block">
//               <table className="w-full">
//                 <thead className="bg-muted/50">
//                   <tr>
//                     <th className="text-muted-foreground w-16 px-4 py-3 text-left text-sm font-medium">
//                       순서
//                     </th>
//                     <th className="text-muted-foreground px-4 py-3 text-left text-sm font-medium">
//                       사진
//                     </th>
//                     <th className="text-muted-foreground px-4 py-3 text-left text-sm font-medium">
//                       이름
//                     </th>
//                     <th className="text-muted-foreground px-4 py-3 text-left text-sm font-medium">
//                       직분
//                     </th>
//                     <th className="text-muted-foreground px-4 py-3 text-left text-sm font-medium">
//                       연락처
//                     </th>
//                     <th className="text-muted-foreground px-4 py-3 text-left text-sm font-medium">
//                       담당/소개
//                     </th>
//                     <th className="text-muted-foreground px-4 py-3 text-center text-sm font-medium">
//                       노출
//                     </th>
//                     <th className="text-muted-foreground px-4 py-3 text-right text-sm font-medium">
//                       관리
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-border divide-y">
//                   {filteredServants.map((servant) => (
//                     <tr
//                       key={servant.id}
//                       className="hover:bg-muted/30 transition-colors"
//                     >
//                       <td className="text-muted-foreground px-4 py-3 text-center font-medium">
//                         {servant.sortOrder}
//                       </td>
//                       <td className="px-4 py-3">
//                         <div className="bg-muted relative h-12 w-12 overflow-hidden rounded-full">
//                           <Image
//                             src={servant.photo || '/placeholder.svg'}
//                             alt={servant.name}
//                             fill
//                             className="object-cover"
//                           />
//                         </div>
//                       </td>
//                       <td className="px-4 py-3 font-medium">{servant.name}</td>
//                       <td className="px-4 py-3">
//                         <span className="bg-primary/10 text-primary inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
//                           {servant.position}
//                         </span>
//                       </td>
//                       <td className="text-muted-foreground px-4 py-3">
//                         {servant.phone ? (
//                           <span className="flex items-center gap-1">
//                             <Phone className="h-3 w-3" />
//                             {servant.phone}
//                           </span>
//                         ) : (
//                           '-'
//                         )}
//                       </td>
//                       <td className="text-muted-foreground max-w-[200px] truncate px-4 py-3">
//                         {servant.description || '-'}
//                       </td>
//                       <td className="px-4 py-3 text-center">
//                         <Switch
//                           checked={servant.isVisible}
//                           onCheckedChange={(checked) =>
//                             handleVisibilityToggle(servant.id, checked)
//                           }
//                         />
//                       </td>
//                       <td className="px-4 py-3">
//                         <div className="flex justify-end gap-1">
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             onClick={() => handleEdit(servant)}
//                           >
//                             <Pencil className="h-4 w-4" />
//                           </Button>
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             onClick={() => setDeleteTarget(servant)}
//                           >
//                             <Trash2 className="text-destructive h-4 w-4" />
//                           </Button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* 카드 (모바일) */}
//             <div className="space-y-3 md:hidden">
//               {filteredServants.map((servant) => (
//                 <Card key={servant.id}>
//                   <CardContent className="p-4">
//                     <div className="flex items-start gap-4">
//                       <div className="bg-muted relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
//                         <Image
//                           src={servant.photo || '/placeholder.svg'}
//                           alt={servant.name}
//                           fill
//                           className="object-cover"
//                         />
//                       </div>
//                       <div className="min-w-0 flex-1">
//                         <div className="mb-1 flex items-center gap-2">
//                           <span className="text-muted-foreground text-sm">
//                             #{servant.sortOrder}
//                           </span>
//                           <h3 className="font-medium">{servant.name}</h3>
//                           <span className="bg-primary/10 text-primary inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium">
//                             {servant.position}
//                           </span>
//                         </div>
//                         {servant.phone && (
//                           <p className="text-muted-foreground flex items-center gap-1 text-sm">
//                             <Phone className="h-3 w-3" />
//                             {servant.phone}
//                           </p>
//                         )}
//                         {servant.description && (
//                           <p className="text-muted-foreground truncate text-sm">
//                             {servant.description}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                     <div className="mt-3 flex items-center justify-between border-t pt-3">
//                       <div className="flex items-center gap-2">
//                         <Switch
//                           checked={servant.isVisible}
//                           onCheckedChange={(checked) =>
//                             handleVisibilityToggle(servant.id, checked)
//                           }
//                         />
//                         <span className="text-muted-foreground text-sm">
//                           {servant.isVisible ? '노출' : '숨김'}
//                         </span>
//                       </div>
//                       <div className="flex gap-1">
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           onClick={() => handleEdit(servant)}
//                         >
//                           <Pencil className="h-4 w-4" />
//                         </Button>
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           onClick={() => setDeleteTarget(servant)}
//                         >
//                           <Trash2 className="text-destructive h-4 w-4" />
//                         </Button>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </>
//         ) : (
//           <EmptyState
//             icon={Users}
//             title="섬기는 사람이 없습니다"
//             description="위의 '추가' 버튼을 눌러 첫 번째 섬기는 사람을 등록해보세요."
//           />
//         )}
//       </div>

//       <ServantFormDialog
//         open={isFormOpen}
//         onOpenChange={setIsFormOpen}
//         servant={editingServant}
//         onSave={handleSave}
//       />

//       <DeleteDialog
//         open={deleteTarget !== null}
//         onOpenChange={() => setDeleteTarget(null)}
//         onConfirm={handleDelete}
//         title={`"${deleteTarget?.name}"님을 삭제하시겠습니까?`}
//         description="이 작업은 되돌릴 수 없습니다. 해당 정보가 영구적으로 삭제됩니다."
//       />
//     </>
//   );
// }

// 'use client';

// import type React from 'react';

// import { useState, useEffect, useCallback } from 'react';
// import {
//   AlertDialog,
//   AlertDialogContent,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogFooter,
// } from '@/shared/ui';
// import { Button } from '@/shared/ui';
// import { Input } from '@/shared/ui';
// import { Label } from '@/shared/ui';
// import { Textarea } from '@/shared/ui';
// import { Switch } from '@/shared/ui';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/shared/ui';
// import { Upload, X, ImageIcon } from 'lucide-react';
// import Image from 'next/image';
// import type { Servant } from '@/widgets/servant-list/ui/dummy';

// const POSITION_OPTIONS = ['담임목사', '목사', '장로', '구역장'];

// interface ServantFormDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   servant: Servant | null;
//   onSave: (data: Omit<Servant, 'id'>) => void;
// }

// interface FormErrors {
//   name?: string;
//   photo?: string;
//   position?: string;
//   sortOrder?: string;
// }

// export function ServantFormDialog({
//   open,
//   onOpenChange,
//   servant,
//   onSave,
// }: ServantFormDialogProps) {
//   const [name, setName] = useState('');
//   const [photo, setPhoto] = useState('');
//   const [position, setPosition] = useState('');
//   const [phone, setPhone] = useState('');
//   const [description, setDescription] = useState('');
//   const [isVisible, setIsVisible] = useState(true);
//   const [sortOrder, setSortOrder] = useState(1);
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [isDragging, setIsDragging] = useState(false);

//   // 폼 초기화
//   useEffect(() => {
//     if (open) {
//       if (servant) {
//         setName(servant.name);
//         setPhoto(servant.photo);
//         setPosition(servant.position);
//         setPhone(servant.phone || '');
//         setDescription(servant.description || '');
//         setIsVisible(servant.isVisible);
//         setSortOrder(servant.sortOrder);
//       } else {
//         setName('');
//         setPhoto('');
//         setPosition('');
//         setPhone('');
//         setDescription('');
//         setIsVisible(true);
//         setSortOrder(1);
//       }
//       setErrors({});
//     }
//   }, [open, servant]);

//   const validate = (): boolean => {
//     const newErrors: FormErrors = {};
//     if (!name.trim()) newErrors.name = '이름을 입력해 주세요.';
//     if (!photo) newErrors.photo = '사진은 필수입니다.';
//     if (!position) newErrors.position = '직분을 선택해 주세요.';
//     if (sortOrder < 1) newErrors.sortOrder = '정렬 순서는 1 이상이어야 합니다.';
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = () => {
//     if (!validate()) return;

//     onSave({
//       name: name.trim(),
//       photo,
//       position,
//       phone: phone.trim() || undefined,
//       description: description.trim() || undefined,
//       isVisible,
//       sortOrder,
//     });
//   };

//   const handleFileUpload = (file: File) => {
//     if (!file.type.startsWith('image/')) return;
//     const url = URL.createObjectURL(file);
//     setPhoto(url);
//     setErrors((prev) => ({ ...prev, photo: undefined }));
//   };

//   const handleDrop = useCallback((e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(false);
//     const file = e.dataTransfer.files[0];
//     if (file) handleFileUpload(file);
//   }, []);

//   const handleDragOver = useCallback((e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(true);
//   }, []);

//   const handleDragLeave = useCallback((e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(false);
//   }, []);

//   return (
//     <AlertDialog open={open} onOpenChange={onOpenChange}>
//       <AlertDialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
//         <AlertDialogHeader>
//           <AlertDialogTitle>
//             {servant ? '섬기는 사람 수정' : '섬기는 사람 추가'}
//           </AlertDialogTitle>
//         </AlertDialogHeader>

//         <div className="space-y-5 py-4">
//           {/* 사진 업로드 */}
//           <div className="space-y-2">
//             <Label>
//               프로필 사진 <span className="text-destructive">*</span>
//             </Label>
//             {photo ? (
//               <div className="relative mx-auto h-32 w-32">
//                 <Image
//                   src={photo || '/placeholder.svg'}
//                   alt="미리보기"
//                   fill
//                   className="rounded-lg object-cover"
//                 />
//                 <Button
//                   variant="destructive"
//                   size="icon"
//                   className="absolute -top-2 -right-2 h-7 w-7"
//                   onClick={() => setPhoto('')}
//                 >
//                   <X className="h-4 w-4" />
//                 </Button>
//               </div>
//             ) : (
//               <div
//                 onDrop={handleDrop}
//                 onDragOver={handleDragOver}
//                 onDragLeave={handleDragLeave}
//                 className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
//                   isDragging
//                     ? 'border-primary bg-primary/5'
//                     : errors.photo
//                       ? 'border-destructive'
//                       : 'border-border hover:border-primary/50'
//                 }`}
//               >
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => {
//                     const file = e.target.files?.[0];
//                     if (file) handleFileUpload(file);
//                   }}
//                   className="hidden"
//                   id="photo-upload"
//                 />
//                 <label htmlFor="photo-upload" className="cursor-pointer">
//                   <div className="flex flex-col items-center gap-2">
//                     <div className="bg-muted rounded-full p-3">
//                       {isDragging ? (
//                         <Upload className="text-primary h-6 w-6" />
//                       ) : (
//                         <ImageIcon className="text-muted-foreground h-6 w-6" />
//                       )}
//                     </div>
//                     <p className="text-muted-foreground text-sm">
//                       클릭하거나 이미지를 드래그하세요
//                     </p>
//                   </div>
//                 </label>
//               </div>
//             )}
//             {errors.photo && (
//               <p className="text-destructive text-sm">{errors.photo}</p>
//             )}
//           </div>

//           {/* 이름 */}
//           <div className="space-y-2">
//             <Label htmlFor="name">
//               이름 <span className="text-destructive">*</span>
//             </Label>
//             <Input
//               id="name"
//               value={name}
//               onChange={(e) => {
//                 setName(e.target.value);
//                 if (errors.name)
//                   setErrors((prev) => ({ ...prev, name: undefined }));
//               }}
//               placeholder="이름을 입력하세요"
//               className={`h-11 ${errors.name ? 'border-destructive' : ''}`}
//             />
//             {errors.name && (
//               <p className="text-destructive text-sm">{errors.name}</p>
//             )}
//           </div>

//           {/* 직분 */}
//           <div className="space-y-2">
//             <Label>
//               직분 <span className="text-destructive">*</span>
//             </Label>
//             <Select
//               value={position}
//               onValueChange={(value: string) => {
//                 setPosition(value);
//                 if (errors.position)
//                   setErrors((prev) => ({ ...prev, position: undefined }));
//               }}
//             >
//               <SelectTrigger
//                 className={`h-11 ${errors.position ? 'border-destructive' : ''}`}
//               >
//                 <SelectValue placeholder="직분 선택" />
//               </SelectTrigger>
//               <SelectContent>
//                 {POSITION_OPTIONS.map((opt) => (
//                   <SelectItem key={opt} value={opt}>
//                     {opt}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             {errors.position && (
//               <p className="text-destructive text-sm">{errors.position}</p>
//             )}
//           </div>

//           {/* 정렬 순서 */}
//           <div className="space-y-2">
//             <Label htmlFor="sortOrder">
//               정렬 순서 <span className="text-destructive">*</span>
//             </Label>
//             <Input
//               id="sortOrder"
//               type="number"
//               min={1}
//               value={sortOrder}
//               onChange={(e) => {
//                 setSortOrder(Number(e.target.value));
//                 if (errors.sortOrder)
//                   setErrors((prev) => ({ ...prev, sortOrder: undefined }));
//               }}
//               placeholder="1"
//               className={`h-11 ${errors.sortOrder ? 'border-destructive' : ''}`}
//             />
//             <p className="text-muted-foreground text-xs">
//               숫자가 작을수록 먼저 표시됩니다 (1부터 시작)
//             </p>
//             {errors.sortOrder && (
//               <p className="text-destructive text-sm">{errors.sortOrder}</p>
//             )}
//           </div>

//           {/* 연락처 (선택) */}
//           <div className="space-y-2">
//             <Label htmlFor="phone">연락처 (선택)</Label>
//             <Input
//               id="phone"
//               type="tel"
//               value={phone}
//               onChange={(e) => setPhone(e.target.value)}
//               placeholder="010-0000-0000"
//               className="h-11"
//             />
//           </div>

//           {/* 담당/소개 (선택) */}
//           <div className="space-y-2">
//             <Label htmlFor="description">담당 / 소개 (선택)</Label>
//             <Textarea
//               id="description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               placeholder="담당 업무나 간단한 소개를 작성하세요"
//               rows={3}
//             />
//           </div>

//           {/* 노출 여부 */}
//           <div className="flex items-center justify-between">
//             <div>
//               <Label>웹사이트 노출</Label>
//               <p className="text-muted-foreground text-xs">
//                 활성화하면 웹사이트에 표시됩니다
//               </p>
//             </div>
//             <Switch checked={isVisible} onCheckedChange={setIsVisible} />
//           </div>
//         </div>

//         <AlertDialogFooter className="gap-2 sm:gap-0">
//           <Button
//             variant="outline"
//             onClick={() => onOpenChange(false)}
//             className="h-11"
//           >
//             취소
//           </Button>
//           <Button onClick={handleSubmit} className="h-11">
//             {servant ? '수정' : '추가'}
//           </Button>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// }

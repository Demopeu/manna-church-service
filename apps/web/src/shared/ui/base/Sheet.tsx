import {
  Sheet as BaseSheet,
  SheetClose as BaseSheetClose,
  SheetContent as BaseSheetContent,
  SheetDescription as BaseSheetDescription,
  SheetFooter as BaseSheetFooter,
  SheetHeader as BaseSheetHeader,
  SheetTitle as BaseSheetTitle,
  SheetTrigger as BaseSheetTrigger,
} from '@repo/ui/shadcn';

export function Sheet({ ...props }: React.ComponentProps<typeof BaseSheet>) {
  return <BaseSheet {...props} />;
}

export function SheetTrigger({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof BaseSheetTrigger>) {
  return <BaseSheetTrigger ref={ref} className={className} {...props} />;
}

export function SheetClose({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof BaseSheetClose>) {
  return <BaseSheetClose ref={ref} className={className} {...props} />;
}

export function SheetContent({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof BaseSheetContent>) {
  return <BaseSheetContent ref={ref} className={className} {...props} />;
}

export function SheetHeader({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof BaseSheetHeader>) {
  return <BaseSheetHeader ref={ref} className={className} {...props} />;
}

export function SheetFooter({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof BaseSheetFooter>) {
  return <BaseSheetFooter ref={ref} className={className} {...props} />;
}

export function SheetTitle({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof BaseSheetTitle>) {
  return <BaseSheetTitle ref={ref} className={className} {...props} />;
}

export function SheetDescription({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof BaseSheetDescription>) {
  return <BaseSheetDescription ref={ref} className={className} {...props} />;
}

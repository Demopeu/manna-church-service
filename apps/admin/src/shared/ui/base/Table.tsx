import * as React from 'react';
import {
  Table as BaseTable,
  TableHeader as BaseTableHeader,
  TableBody as BaseTableBody,
  TableFooter as BaseTableFooter,
  TableHead as BaseTableHead,
  TableRow as BaseTableRow,
  TableCell as BaseTableCell,
  TableCaption as BaseTableCaption,
} from '@repo/ui/shadcn';

export function Table({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof BaseTable>) {
  return <BaseTable ref={ref} className={className} {...props} />;
}

export function TableHeader({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof BaseTableHeader>) {
  return <BaseTableHeader ref={ref} className={className} {...props} />;
}

export function TableBody({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof BaseTableBody>) {
  return <BaseTableBody ref={ref} className={className} {...props} />;
}

export function TableFooter({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof BaseTableFooter>) {
  return <BaseTableFooter ref={ref} className={className} {...props} />;
}

export function TableRow({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof BaseTableRow>) {
  return <BaseTableRow ref={ref} className={className} {...props} />;
}

export function TableHead({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof BaseTableHead>) {
  return <BaseTableHead ref={ref} className={className} {...props} />;
}

export function TableCell({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof BaseTableCell>) {
  return <BaseTableCell ref={ref} className={className} {...props} />;
}

export function TableCaption({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof BaseTableCaption>) {
  return <BaseTableCaption ref={ref} className={className} {...props} />;
}

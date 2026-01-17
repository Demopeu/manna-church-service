import {
  Select as BaseSelect,
  SelectContent as BaseSelectContent,
  SelectItem as BaseSelectItem,
  SelectTrigger as BaseSelectTrigger,
  SelectValue as BaseSelectValue,
} from '@repo/ui/shadcn';

export function Select({ ...props }: React.ComponentProps<typeof BaseSelect>) {
  return <BaseSelect {...props} />;
}

export function SelectContent({
  ...props
}: React.ComponentProps<typeof BaseSelectContent>) {
  return <BaseSelectContent {...props} />;
}

export function SelectItem({
  ...props
}: React.ComponentProps<typeof BaseSelectItem>) {
  return <BaseSelectItem {...props} />;
}

export function SelectTrigger({
  ...props
}: React.ComponentProps<typeof BaseSelectTrigger>) {
  return <BaseSelectTrigger {...props} />;
}

export function SelectValue({
  ...props
}: React.ComponentProps<typeof BaseSelectValue>) {
  return <BaseSelectValue {...props} />;
}

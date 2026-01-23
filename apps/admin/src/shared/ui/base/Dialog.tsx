import {
  Dialog as BaseDialog,
  DialogClose as BaseDialogClose,
  DialogContent as BaseDialogContent,
  DialogDescription as BaseDialogDescription,
  DialogFooter as BaseDialogFooter,
  DialogHeader as BaseDialogHeader,
  DialogOverlay as BaseDialogOverlay,
  DialogPortal as BaseDialogPortal,
  DialogTitle as BaseDialogTitle,
  DialogTrigger as BaseDialogTrigger,
} from '@repo/ui/shadcn';

export function Dialog({ ...props }: React.ComponentProps<typeof BaseDialog>) {
  return <BaseDialog {...props} />;
}

export function DialogPortal({
  ...props
}: React.ComponentProps<typeof BaseDialogPortal>) {
  return <BaseDialogPortal {...props} />;
}

export function DialogOverlay({
  ...props
}: React.ComponentProps<typeof BaseDialogOverlay>) {
  return <BaseDialogOverlay {...props} />;
}

export function DialogClose({
  ...props
}: React.ComponentProps<typeof BaseDialogClose>) {
  return <BaseDialogClose {...props} />;
}

export function DialogTrigger({
  ...props
}: React.ComponentProps<typeof BaseDialogTrigger>) {
  return <BaseDialogTrigger {...props} />;
}

export function DialogContent({
  ...props
}: React.ComponentProps<typeof BaseDialogContent>) {
  return <BaseDialogContent {...props} />;
}

export function DialogHeader({
  ...props
}: React.ComponentProps<typeof BaseDialogHeader>) {
  return <BaseDialogHeader {...props} />;
}

export function DialogFooter({
  ...props
}: React.ComponentProps<typeof BaseDialogFooter>) {
  return <BaseDialogFooter {...props} />;
}

export function DialogTitle({
  ...props
}: React.ComponentProps<typeof BaseDialogTitle>) {
  return <BaseDialogTitle {...props} />;
}

export function DialogDescription({
  ...props
}: React.ComponentProps<typeof BaseDialogDescription>) {
  return <BaseDialogDescription {...props} />;
}

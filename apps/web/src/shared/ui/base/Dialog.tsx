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

export function DialogTrigger({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof BaseDialogTrigger>) {
  return <BaseDialogTrigger ref={ref} className={className} {...props} />;
}

export function DialogPortal({
  ...props
}: React.ComponentProps<typeof BaseDialogPortal>) {
  return <BaseDialogPortal {...props} />;
}

export function DialogOverlay({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof BaseDialogOverlay>) {
  return <BaseDialogOverlay ref={ref} className={className} {...props} />;
}

export function DialogClose({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof BaseDialogClose>) {
  return <BaseDialogClose ref={ref} className={className} {...props} />;
}

export function DialogContent({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof BaseDialogContent>) {
  return <BaseDialogContent ref={ref} className={className} {...props} />;
}

export function DialogHeader({
  className,
  ...props
}: React.ComponentProps<typeof BaseDialogHeader>) {
  return <BaseDialogHeader className={className} {...props} />;
}

export function DialogFooter({
  className,
  ...props
}: React.ComponentProps<typeof BaseDialogFooter>) {
  return <BaseDialogFooter className={className} {...props} />;
}

export function DialogTitle({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof BaseDialogTitle>) {
  return <BaseDialogTitle ref={ref} className={className} {...props} />;
}

export function DialogDescription({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof BaseDialogDescription>) {
  return <BaseDialogDescription ref={ref} className={className} {...props} />;
}

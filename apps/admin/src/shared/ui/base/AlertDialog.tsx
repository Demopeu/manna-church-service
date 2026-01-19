import {
  AlertDialog as BaseAlertDialog,
  AlertDialogAction as BaseAlertDialogAction,
  AlertDialogCancel as BaseAlertDialogCancel,
  AlertDialogContent as BaseAlertDialogContent,
  AlertDialogDescription as BaseAlertDialogDescription,
  AlertDialogFooter as BaseAlertDialogFooter,
  AlertDialogHeader as BaseAlertDialogHeader,
  AlertDialogTitle as BaseAlertDialogTitle,
  AlertDialogTrigger as BaseAlertDialogTrigger,
} from '@repo/ui/shadcn';

export function AlertDialog({
  ...props
}: React.ComponentProps<typeof BaseAlertDialog>) {
  return <BaseAlertDialog {...props} />;
}

export function AlertDialogHeader({
  ...props
}: React.ComponentProps<typeof BaseAlertDialogHeader>) {
  return <BaseAlertDialogHeader {...props} />;
}
export function AlertDialogAction({
  ...props
}: React.ComponentProps<typeof BaseAlertDialogAction>) {
  return <BaseAlertDialogAction {...props} />;
}

export function AlertDialogCancel({
  ...props
}: React.ComponentProps<typeof BaseAlertDialogCancel>) {
  return <BaseAlertDialogCancel {...props} />;
}

export function AlertDialogContent({
  ...props
}: React.ComponentProps<typeof BaseAlertDialogContent>) {
  return <BaseAlertDialogContent {...props} />;
}

export function AlertDialogDescription({
  ...props
}: React.ComponentProps<typeof BaseAlertDialogDescription>) {
  return <BaseAlertDialogDescription {...props} />;
}

export function AlertDialogFooter({
  ...props
}: React.ComponentProps<typeof BaseAlertDialogFooter>) {
  return <BaseAlertDialogFooter {...props} />;
}

export function AlertDialogTitle({
  ...props
}: React.ComponentProps<typeof BaseAlertDialogTitle>) {
  return <BaseAlertDialogTitle {...props} />;
}

export function AlertDialogTrigger({
  ...props
}: React.ComponentProps<typeof BaseAlertDialogTrigger>) {
  return <BaseAlertDialogTrigger {...props} />;
}

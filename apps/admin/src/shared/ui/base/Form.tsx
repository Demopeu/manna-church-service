import {
  Form as BaseForm,
  FormControl as BaseFormControl,
  FormDescription as BaseFormDescription,
  FormField as BaseFormField,
  FormItem as BaseFormItem,
  FormLabel as BaseFormLabel,
  FormMessage as BaseFormMessage,
  useFormField as baseUseFormField,
} from '@repo/ui/shadcn';

export function Form(props: React.ComponentProps<typeof BaseForm>) {
  return <BaseForm {...props} />;
}

export function FormItem({
  className,
  ...props
}: React.ComponentProps<typeof BaseFormItem>) {
  return <BaseFormItem className={`${className}`} {...props} />;
}

export function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof BaseFormLabel>) {
  return <BaseFormLabel className={`${className}`} {...props} />;
}

export function FormControl({
  className,
  ...props
}: React.ComponentProps<typeof BaseFormControl>) {
  return <BaseFormControl className={`${className}`} {...props} />;
}

export function FormDescription({
  className,
  ...props
}: React.ComponentProps<typeof BaseFormDescription>) {
  return <BaseFormDescription className={`${className}`} {...props} />;
}

export function FormMessage({
  className,
  ...props
}: React.ComponentProps<typeof BaseFormMessage>) {
  return <BaseFormMessage className={`${className}`} {...props} />;
}

export function FormField(props: React.ComponentProps<typeof BaseFormField>) {
  return <BaseFormField {...props} />;
}

export const useFormField = baseUseFormField;

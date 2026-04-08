import * as React from "react";
import { Controller, FormProvider, type ControllerProps, type FieldPath, type FieldValues } from "react-hook-form";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";

/**
 * WexForm - WEX Design System Form Component
 *
 * Form handling with validation using react-hook-form.
 * Uses the modern Field component pattern with Controller, following shadcn/ui patterns.
 * Uses namespace pattern: WexForm.Item, WexForm.Label, etc.
 *
 * This component aligns with the shadcn React Hook Form documentation:
 * https://ui.shadcn.com/docs/forms/react-hook-form
 *
 * @example
 * const form = useForm({
 *   resolver: zodResolver(schema),
 *   defaultValues: { email: "" }
 * });
 * 
 * <WexForm {...form}>
 *   <form onSubmit={form.handleSubmit(onSubmit)}>
 *     <WexForm.Field
 *       control={form.control}
 *       name="email"
 *       render={({ field, fieldState }) => (
 *         <WexForm.Item data-invalid={fieldState.invalid}>
 *           <WexForm.Label htmlFor={field.name}>Email</WexForm.Label>
 *           <WexInput {...field} id={field.name} aria-invalid={fieldState.invalid} />
 *           <WexForm.Description>Your email address</WexForm.Description>
 *           {fieldState.invalid && <WexForm.Message errors={[fieldState.error]} />}
 *         </WexForm.Item>
 *       )}
 *     />
 *   </form>
 * </WexForm>
 */

// FormProvider wrapper for backward compatibility
function WexFormRoot(props: React.ComponentProps<typeof FormProvider>) {
  return <FormProvider {...props} />;
}
WexFormRoot.displayName = "WexForm";

// Field wrapper using Controller with Field component
// Passes both field and fieldState to render function for compatibility
function WexFormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(props: ControllerProps<TFieldValues, TName>) {
  return <Controller {...props} />;
}

// Re-export Field components for backward compatibility
const WexFormItem = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof Field>>(
  ({ className, ...props }, ref) => {
    return <Field ref={ref} className={className} {...props} />;
  }
);
WexFormItem.displayName = "WexForm.Item";

const WexFormLabel = React.forwardRef<
  React.ElementRef<typeof FieldLabel>,
  React.ComponentPropsWithoutRef<typeof FieldLabel>
>((props, ref) => {
  return <FieldLabel ref={ref} {...props} />;
});
WexFormLabel.displayName = "WexForm.Label";

// Control is just a pass-through div for backward compatibility
const WexFormControl = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={className} {...props} />;
  }
);
WexFormControl.displayName = "WexForm.Control";

const WexFormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof FieldDescription>
>((props, ref) => {
  return <FieldDescription ref={ref} {...props} />;
});
WexFormDescription.displayName = "WexForm.Description";

const WexFormMessage = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof FieldError>
>((props, ref) => {
  // In the new pattern, errors should be passed explicitly via fieldState
  // This component accepts errors prop for backward compatibility
  return <FieldError ref={ref} {...props} />;
});
WexFormMessage.displayName = "WexForm.Message";

export const WexForm = Object.assign(WexFormRoot, {
  Item: WexFormItem,
  Label: WexFormLabel,
  Control: WexFormControl,
  Description: WexFormDescription,
  Message: WexFormMessage,
  Field: WexFormField,
});

// Export Field components directly for convenience
export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
  FieldContent,
  FieldTitle,
} from "@/components/ui/field";


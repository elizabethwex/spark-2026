import * as React from "react";
import {
  Field as FieldRoot,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
} from "@/components/ui/field";
import { cn } from "../lib/utils";

/**
 * WexField - WEX Design System Field Component
 *
 * Form field container with label, description, and error handling.
 * Wraps shadcn field component with WEX styling.
 * Uses namespace pattern: WexField.Label, WexField.Error, etc.
 *
 * @example
 * <WexField>
 *   <WexField.Label htmlFor="email">Email</WexField.Label>
 *   <WexInput id="email" />
 *   <WexField.Description>Your email address</WexField.Description>
 *   <WexField.Error>Invalid email format</WexField.Error>
 * </WexField>
 */

// ============================================================================
// WEX Wrappers
// ============================================================================

const WexFieldRoot = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof FieldRoot>
>(({ className, ...props }, ref) => (
  <FieldRoot
    ref={ref}
    className={cn("wex-field", className)}
    {...props}
  />
));
WexFieldRoot.displayName = "WexField";

const WexFieldLabel = React.forwardRef<
  React.ElementRef<typeof FieldLabel>,
  React.ComponentPropsWithoutRef<typeof FieldLabel>
>(({ className, ...props }, ref) => {
  // Check if parent field has data-invalid="true" to apply error color
  const [hasError, setHasError] = React.useState(false);
  const labelRef = React.useRef<HTMLLabelElement>(null);
  
  React.useEffect(() => {
    if (labelRef.current) {
      const checkError = () => {
        const fieldParent = labelRef.current?.closest('[data-slot="field"][data-invalid="true"]');
        setHasError(!!fieldParent);
      };
      
      checkError();
      
      // Use MutationObserver to watch for data-invalid changes
      const observer = new MutationObserver(checkError);
      const fieldParent = labelRef.current.closest('[data-slot="field"]');
      if (fieldParent) {
        observer.observe(fieldParent, {
          attributes: true,
          attributeFilter: ['data-invalid']
        });
      }
      
      return () => observer.disconnect();
    }
  }, []);
  
  return (
    <FieldLabel
      ref={(node) => {
        labelRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      className={cn(
        hasError && "text-wex-field-error-fg",
        className
      )}
      {...props}
    />
  );
});
WexFieldLabel.displayName = "WexField.Label";

const WexFieldDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof FieldDescription>
>(({ className, ...props }, ref) => (
  <FieldDescription
    ref={ref}
    className={cn("text-wex-field-description-fg", className)}
    {...props}
  />
));
WexFieldDescription.displayName = "WexField.Description";

const WexFieldError = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof FieldError>
>(({ className, ...props }, ref) => (
  <FieldError
    ref={ref}
    className={cn("text-wex-field-error-fg", className)}
    {...props}
  />
));
WexFieldError.displayName = "WexField.Error";

const WexFieldSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof FieldSeparator>
>(({ className, ...props }, ref) => (
  <FieldSeparator
    ref={ref}
    className={className}
    {...props}
  />
));
WexFieldSeparator.displayName = "WexField.Separator";

export const WexField = Object.assign(WexFieldRoot, {
  Label: WexFieldLabel,
  Description: WexFieldDescription,
  Error: WexFieldError,
  Group: FieldGroup,
  Legend: FieldLegend,
  Separator: WexFieldSeparator,
  Set: FieldSet,
  Content: FieldContent,
  Title: FieldTitle,
});

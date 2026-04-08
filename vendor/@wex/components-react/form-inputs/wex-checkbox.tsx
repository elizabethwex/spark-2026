import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "../lib/utils";

/**
 * WexCheckbox - WEX Design System Checkbox Component
 *
 * Control for toggling boolean values.
 * Uses WEX sizing tokens for accessible touch targets.
 *
 * @example
 * <div className="flex items-center space-x-2">
 *   <WexCheckbox id="terms" />
 *   <WexLabel htmlFor="terms">Accept terms and conditions</WexLabel>
 * </div>
 */

export const WexCheckbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
    checked?: boolean | "indeterminate";
  }
>(({ className, checked, onCheckedChange, ...props }, ref) => {
  const isIndeterminate = checked === "indeterminate";
  const checkboxRef = React.useRef<React.ElementRef<typeof CheckboxPrimitive.Root>>(null);
  
  // Combine refs and set data-state immediately for indeterminate
  const combinedRef = React.useCallback((node: React.ElementRef<typeof CheckboxPrimitive.Root>) => {
    checkboxRef.current = node;
    if (node && isIndeterminate) {
      // Set data-state immediately when node is available
      const element = node as unknown as HTMLElement;
      if (element) {
        element.setAttribute("data-state", "indeterminate");
        element.setAttribute("aria-checked", "mixed");
      }
    }
    if (typeof ref === "function") {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  }, [ref, isIndeterminate]);
  
  // Also set in useEffect as backup
  React.useEffect(() => {
    if (checkboxRef.current && isIndeterminate) {
      const element = checkboxRef.current as unknown as HTMLElement;
      if (element) {
        element.setAttribute("data-state", "indeterminate");
        element.setAttribute("aria-checked", "mixed");
      }
    }
  }, [isIndeterminate]);
  
  const handleCheckedChange = (newChecked: boolean) => {
    if (isIndeterminate) {
      // When clicking indeterminate, toggle to checked
      onCheckedChange?.(true);
    } else {
      onCheckedChange?.(newChecked);
    }
  };
  
  return (
    <CheckboxPrimitive.Root
      ref={combinedRef}
      checked={isIndeterminate ? undefined : checked}
      onCheckedChange={handleCheckedChange}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border-2 bg-wex-checkbox-bg focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-[var(--wex-component-checkbox-disabled-opacity)] data-[state=checked]:bg-wex-checkbox-checked-bg data-[state=checked]:text-wex-checkbox-checked-fg data-[state=checked]:border-wex-checkbox-checked-bg",
        isIndeterminate && "[&[data-state=indeterminate]]:bg-wex-checkbox-checked-bg [&[data-state=indeterminate]]:text-wex-checkbox-checked-fg [&[data-state=indeterminate]]:border-wex-checkbox-checked-bg",
        className
      )}
      {...(isIndeterminate ? { "data-state": "indeterminate" } : {})}
      {...props}
    >
      {isIndeterminate ? (
        <div className="flex items-center justify-center w-full h-full text-wex-checkbox-checked-fg">
          <Minus className="h-3 w-3" />
        </div>
      ) : (
        <CheckboxPrimitive.Indicator
          className={cn("flex items-center justify-center text-current w-full h-full")}
        >
          <Check className="h-3.5 w-3.5" />
        </CheckboxPrimitive.Indicator>
      )}
    </CheckboxPrimitive.Root>
  );
});
WexCheckbox.displayName = "WexCheckbox";


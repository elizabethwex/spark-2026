import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * WexTag - WEX Design System Tag Component
 *
 * Subtle, tinted descriptor for UI elements.
 * Often used for categories, labels, or interactive suggestion chips.
 *
 * @example
 * <WexTag intent="info">Feature</WexTag>
 * <WexTag intent="success" asChild>
 *   <button onClick={...}>Active</button>
 * </WexTag>
 */

const wexTagVariants = cva(
  "inline-flex items-center border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full",
  {
    variants: {
      intent: {
        neutral: [
          "bg-wex-tag-neutral-bg",
          "text-wex-tag-neutral-fg",
          "border-wex-tag-neutral-border",
        ].join(" "),
        success: [
          "bg-wex-tag-success-bg",
          "text-wex-tag-success-fg",
          "border-wex-tag-success-border",
        ].join(" "),
        warning: [
          "bg-wex-tag-warning-bg",
          "text-wex-tag-warning-fg",
          "border-wex-tag-warning-border",
        ].join(" "),
        destructive: [
          "bg-wex-tag-destructive-bg",
          "text-wex-tag-destructive-fg",
          "border-wex-tag-destructive-border",
        ].join(" "),
        info: [
          "bg-wex-tag-info-bg",
          "text-wex-tag-info-fg",
          "border-wex-tag-info-border",
        ].join(" "),
      },
      size: {
        sm: "px-1.5 py-0.5 text-[10px]",
        md: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      intent: "neutral",
      size: "md",
    },
  }
);

export interface WexTagProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof wexTagVariants> {
  asChild?: boolean;
}

const WexTag = React.forwardRef<HTMLDivElement, WexTagProps>(
  ({ className, intent, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cn(wexTagVariants({ intent, size }), className)}
        {...props}
      />
    );
  }
);
WexTag.displayName = "WexTag";

export { WexTag, wexTagVariants };


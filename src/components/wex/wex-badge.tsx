import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const wexBadgeVariants = cva(
  "inline-flex items-center border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 w-fit whitespace-nowrap",
  {
    variants: {
      intent: {
        default:
          "bg-wex-badge-neutral-bg text-wex-badge-neutral-fg border-wex-badge-neutral-border",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "shadow bg-wex-badge-destructive-bg text-wex-badge-destructive-fg border-wex-badge-destructive-border",
        outline: "text-foreground bg-transparent",
        success:
          "shadow bg-wex-badge-success-bg text-wex-badge-success-fg border-wex-badge-success-border",
        warning:
          "shadow bg-wex-badge-warning-bg text-wex-badge-warning-fg border-wex-badge-warning-border",
        info: "shadow bg-wex-badge-info-bg text-wex-badge-info-fg border-wex-badge-info-border",
      },
      size: {
        sm: "px-1.5 py-0.5 text-[10px]",
        md: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
      pill: {
        true: "rounded-full",
        false: "rounded-md",
      },
    },
    defaultVariants: {
      intent: "default",
      size: "md",
      pill: false,
    },
  }
);

export interface WexBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof wexBadgeVariants> {}

function WexBadge({ className, intent, size, pill, ...props }: WexBadgeProps) {
  return (
    <div
      className={cn(wexBadgeVariants({ intent, size, pill }), className)}
      {...props}
    />
  );
}

export { WexBadge, wexBadgeVariants };

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

/**
 * WexBadge - WEX Design System Badge Component
 *
 * Small status descriptor for UI elements with semantic intent variants.
 *
 * @example
 * <WexBadge intent="default">New</WexBadge>
 * <WexBadge intent="destructive">Error</WexBadge>
 * <WexBadge intent="success" pill>Active</WexBadge>
 */

const wexBadgeVariants = cva(
  "inline-flex items-center px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-wex-badge-focus-ring focus:ring-offset-2",
  {
    variants: {
      intent: {
        // NEUTRAL - Layer 3 tokens
        default: [
          "bg-wex-badge-neutral-bg",
          "text-wex-badge-neutral-fg",
          "border border-wex-badge-neutral-border",
        ].join(" "),
        // PRIMARY - Layer 3 tokens (matches button primary)
        primary: [
          "shadow",
          "bg-wex-badge-primary-bg",
          "text-wex-badge-primary-fg",
        ].join(" "),
        // SECONDARY - Layer 3 tokens
        secondary: [
          "bg-wex-badge-secondary-bg",
          "text-wex-badge-secondary-fg",
          "hover:bg-wex-badge-secondary-hover-bg",
        ].join(" "),
        // DESTRUCTIVE - Layer 3 tokens
        destructive: [
          "shadow",
          "bg-wex-badge-destructive-bg",
          "text-wex-badge-destructive-fg",
        ].join(" "),
        // OUTLINE - Layer 3
        outline: "text-wex-badge-fg bg-transparent border border-wex-badge-fg",
        // SUCCESS - Layer 3 tokens
        success: [
          "shadow",
          "bg-wex-badge-success-bg",
          "text-wex-badge-success-fg",
        ].join(" "),
        // WARNING - Layer 3 tokens
        warning: [
          "shadow",
          "bg-wex-badge-warning-bg",
          "text-wex-badge-warning-fg",
        ].join(" "),
        // INFO - Layer 3 tokens
        info: [
          "shadow",
          "bg-wex-badge-info-bg",
          "text-wex-badge-info-fg",
        ].join(" "),
        // CONTRAST - Layer 3 tokens
        contrast: [
          "shadow",
          "bg-wex-badge-contrast-bg",
          "text-wex-badge-contrast-fg",
        ].join(" "),
      },
      pill: {
        true: "rounded-full",
        false: "",
      },
    },
    defaultVariants: {
      intent: "primary",
      pill: false,
    },
  }
);

export interface WexBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof wexBadgeVariants> {}

function WexBadge({ className, intent, pill, ...props }: WexBadgeProps) {
  return (
    <div 
      className={"wex-badge " + cn(wexBadgeVariants({ intent, pill }), className)} 
      style={pill ? undefined : { borderRadius: 'var(--wex-component-badge-radius)' }}
      {...props} 
    />
  );
}

export { WexBadge, wexBadgeVariants };

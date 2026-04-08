import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { Loader2 } from "lucide-react";

/**
 * WexButton - WEX Design System Button Component
 *
 * The primary interactive element for triggering actions.
 * Uses WEX semantic tokens and meets WCAG 2.5.5 touch target requirements.
 *
 * All variants (solid, outline, ghost, link) support all intents for consistency.
 *
 * @example
 * <WexButton intent="primary">Save Changes</WexButton>
 * <WexButton intent="destructive" variant="outline">Delete</WexButton>
 * <WexButton intent="success" variant="ghost">Cancel</WexButton>
 * <WexButton intent="warning" variant="link">Learn More</WexButton>
 * <WexButton intent="primary" loading>Saving...</WexButton>
 */

const wexButtonVariants = cva(
  // Base classes - hardened with accessibility requirements
  [
    "inline-flex items-center justify-center gap-2",
    "whitespace-nowrap text-sm font-medium",
    "transition-colors",
    // HARDENED: Focus ring - always visible on focus-visible
    "focus-visible:outline-none",
    "focus-visible:ring-[length:var(--wex-focus-ring-width)]",
    "focus-visible:ring-wex-button-primary-focus-ring",
    "focus-visible:ring-offset-[length:var(--wex-focus-ring-offset)]",
    "focus-visible:ring-offset-background",
    // Disabled state - pointer-events in base, colors per-variant
    "disabled:pointer-events-none",
    // SVG handling
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      intent: {
        primary: "",
        secondary: "",
        destructive: "",
        success: "",
        info: "",
        warning: "",
        help: "",
        contrast: "",
      },
      variant: {
        solid: "",
        outline: "bg-transparent",
        ghost: "bg-transparent border-transparent",
        link: "bg-transparent border-transparent underline-offset-4 hover:underline",
      },
      size: {
        // sm: Compact button, no WCAG target requirement (for dense UIs)
        sm: "h-8 px-3 text-xs",
        // md: Default - meets WCAG 2.5.5 minimum target size (44px)
        md: "h-11 min-h-target px-4 py-2",
        // lg: Large button, exceeds WCAG requirements
        lg: "h-12 min-h-12 px-8 text-base",
        // icon: Square icon button, meets WCAG requirements
        icon: "h-11 w-11 min-h-target min-w-target",
      },
      rounded: {
        true: "rounded-full",
        false: "rounded-md",
      },
    },
    compoundVariants: [
      // ═══════════════════════════════════════════════════════════════════
      // SOLID VARIANTS (default) - filled background with intent color
      // ═══════════════════════════════════════════════════════════════════
      {
        intent: "primary",
        variant: "solid",
        class: [
          "bg-wex-button-primary-bg",
          "text-wex-button-primary-fg",
          "border-none",
          "hover:bg-wex-button-primary-hover-bg",
          "active:bg-wex-button-primary-active-bg",
          "disabled:bg-wex-button-primary-disabled-bg",
          "disabled:text-wex-button-primary-fg",
          "disabled:opacity-[var(--wex-component-button-disabled-opacity)]",
        ].join(" "),
      },
      {
        intent: "secondary",
        variant: "solid",
        class: [
          "bg-wex-button-secondary-bg",
          "text-wex-button-secondary-fg",
          "border-none",
          "hover:bg-wex-button-secondary-hover-bg",
          "active:bg-wex-button-secondary-active-bg",
          "disabled:bg-wex-button-secondary-disabled-bg",
          "disabled:text-wex-button-secondary-disabled-fg",
          "disabled:opacity-[var(--wex-component-button-disabled-opacity)]",
        ].join(" "),
      },
      {
        intent: "destructive",
        variant: "solid",
        class: [
          "bg-wex-button-destructive-bg",
          "text-wex-button-destructive-fg",
          "border-none",
          "hover:bg-wex-button-destructive-hover-bg",
          "active:bg-wex-button-destructive-active-bg",
          "disabled:bg-wex-button-destructive-disabled-bg",
          "disabled:text-wex-button-destructive-disabled-fg",
          "disabled:opacity-[var(--wex-component-button-disabled-opacity)]",
        ].join(" "),
      },
      {
        intent: "success",
        variant: "solid",
        class: [
          "bg-wex-button-success-bg",
          "text-wex-button-success-fg",
          "border-none",
          "hover:bg-wex-button-success-hover-bg",
          "active:bg-wex-button-success-active-bg",
          "disabled:bg-wex-button-success-disabled-bg",
          "disabled:text-wex-button-success-disabled-fg",
          "disabled:opacity-[var(--wex-component-button-disabled-opacity)]",
        ].join(" "),
      },
      {
        intent: "info",
        variant: "solid",
        class: [
          "bg-wex-button-info-bg",
          "text-wex-button-info-fg",
          "border-none",
          "hover:bg-wex-button-info-hover-bg",
          "active:bg-wex-button-info-active-bg",
          "disabled:bg-wex-button-info-disabled-bg",
          "disabled:text-wex-button-info-disabled-fg",
          "disabled:opacity-[var(--wex-component-button-disabled-opacity)]",
        ].join(" "),
      },
      {
        intent: "warning",
        variant: "solid",
        class: [
          "bg-wex-button-warning-bg",
          "text-wex-button-warning-fg",
          "border-none",
          "hover:bg-wex-button-warning-hover-bg",
          "active:bg-wex-button-warning-active-bg",
          "disabled:bg-wex-button-warning-disabled-bg",
          "disabled:text-wex-button-warning-disabled-fg",
          "disabled:opacity-[var(--wex-component-button-disabled-opacity)]",
        ].join(" "),
      },
      {
        intent: "help",
        variant: "solid",
        class: [
          "bg-wex-button-help-bg",
          "text-wex-button-help-fg",
          "border-none",
          "hover:bg-wex-button-help-hover-bg",
          "active:bg-wex-button-help-active-bg",
          "disabled:bg-wex-button-help-disabled-bg",
          "disabled:text-wex-button-help-disabled-fg",
          "disabled:opacity-[var(--wex-component-button-disabled-opacity)]",
        ].join(" "),
      },
      {
        intent: "contrast",
        variant: "solid",
        class: [
          "bg-wex-button-contrast-bg",
          "text-wex-button-contrast-fg",
          "border-none",
          "hover:bg-wex-button-contrast-hover-bg",
          "active:bg-wex-button-contrast-active-bg",
          "disabled:bg-wex-button-contrast-disabled-bg",
          "disabled:text-wex-button-contrast-disabled-fg",
          "disabled:opacity-[var(--wex-component-button-disabled-opacity)]",
        ].join(" "),
      },
      // ═══════════════════════════════════════════════════════════════════
      // OUTLINE VARIANTS - transparent bg, colored border, tinted hover
      // ═══════════════════════════════════════════════════════════════════
      {
        intent: "primary",
        variant: "outline",
        class: [
          "text-wex-button-primary-outline-fg",
          "border border-wex-button-primary-outline-border",
          "hover:bg-wex-button-primary-outline-hover-bg",
          "active:bg-wex-button-primary-outline-active-bg",
          "disabled:text-wex-button-primary-outline-disabled-fg",
          "disabled:border-wex-button-primary-outline-disabled-border",
          "disabled:opacity-[var(--wex-component-button-disabled-opacity)]",
        ].join(" "),
      },
      {
        intent: "secondary",
        variant: "outline",
        class: [
          "text-wex-button-secondary-outline-fg",
          "border border-wex-button-secondary-outline-border",
          "hover:bg-wex-button-secondary-outline-hover-bg",
          "active:bg-wex-button-secondary-outline-active-bg",
          "disabled:text-wex-button-secondary-outline-disabled-fg",
          "disabled:border-wex-button-secondary-outline-disabled-border",
          "disabled:opacity-[var(--wex-component-button-disabled-opacity)]",
        ].join(" "),
      },
      {
        intent: "destructive",
        variant: "outline",
        class: [
          "text-wex-button-destructive-outline-fg",
          "border border-wex-button-destructive-outline-border",
          "hover:bg-wex-button-destructive-outline-hover-bg",
          "active:bg-wex-button-destructive-outline-active-bg",
          "disabled:text-wex-button-destructive-outline-disabled-fg",
          "disabled:border-wex-button-destructive-outline-disabled-border",
          "disabled:opacity-[var(--wex-component-button-disabled-opacity)]",
        ].join(" "),
      },
      {
        intent: "success",
        variant: "outline",
        class: [
          "text-wex-button-success-outline-fg",
          "border border-wex-button-success-outline-border",
          "hover:bg-wex-button-success-outline-hover-bg",
          "active:bg-wex-button-success-outline-active-bg",
          "disabled:text-wex-button-success-outline-disabled-fg",
          "disabled:border-wex-button-success-outline-disabled-border",
          "disabled:opacity-[var(--wex-component-button-disabled-opacity)]",
        ].join(" "),
      },
      {
        intent: "info",
        variant: "outline",
        class: [
          "text-wex-button-info-outline-fg",
          "border border-wex-button-info-outline-border",
          "hover:bg-wex-button-info-outline-hover-bg",
          "active:bg-wex-button-info-outline-active-bg",
          "disabled:text-wex-button-info-outline-disabled-fg",
          "disabled:border-wex-button-info-outline-disabled-border",
          "disabled:opacity-[var(--wex-component-button-disabled-opacity)]",
        ].join(" "),
      },
      {
        intent: "warning",
        variant: "outline",
        class: [
          "text-wex-button-warning-outline-fg",
          "border border-wex-button-warning-outline-border",
          "hover:bg-wex-button-warning-outline-hover-bg",
          "active:bg-wex-button-warning-outline-active-bg",
          "disabled:text-wex-button-warning-outline-disabled-fg",
          "disabled:border-wex-button-warning-outline-disabled-border",
          "disabled:opacity-[var(--wex-component-button-disabled-opacity)]",
        ].join(" "),
      },
      {
        intent: "help",
        variant: "outline",
        class: [
          "text-wex-button-help-outline-fg",
          "border border-wex-button-help-outline-border",
          "hover:bg-wex-button-help-outline-hover-bg",
          "active:bg-wex-button-help-outline-active-bg",
          "disabled:text-wex-button-help-outline-disabled-fg",
          "disabled:border-wex-button-help-outline-disabled-border",
          "disabled:opacity-[var(--wex-component-button-disabled-opacity)]",
        ].join(" "),
      },
      {
        intent: "contrast",
        variant: "outline",
        class: [
          "text-wex-button-contrast-outline-fg",
          "border border-wex-button-contrast-outline-border",
          "hover:bg-wex-button-contrast-outline-hover-bg",
          "active:bg-wex-button-contrast-outline-active-bg",
          "disabled:text-wex-button-contrast-outline-disabled-fg",
          "disabled:border-wex-button-contrast-outline-disabled-border",
          "disabled:opacity-[var(--wex-component-button-disabled-opacity)]",
        ].join(" "),
      },
      // ═══════════════════════════════════════════════════════════════════
      // GHOST VARIANTS - transparent bg, intent-colored text, tinted hover
      // All intents supported for consistency (mimics PrimeReact text buttons)
      // ═══════════════════════════════════════════════════════════════════
      {
        intent: "primary",
        variant: "ghost",
        class: [
          "text-wex-button-link-fg",
          "hover:bg-wex-button-ghost-hover-bg",
          "hover:text-wex-button-link-hover-fg",
          "active:bg-wex-button-ghost-active-bg",
          "active:text-wex-button-link-active-fg",
          "disabled:text-wex-button-ghost-disabled-fg",
          "disabled:opacity-[var(--wex-component-button-disabled-opacity)]",
        ].join(" "),
      },
      {
        intent: "secondary",
        variant: "ghost",
        class: [
          "text-wex-button-ghost-fg",
          "hover:bg-wex-button-ghost-hover-bg",
          "active:bg-wex-button-ghost-active-bg",
          "disabled:text-wex-button-ghost-disabled-fg",
          "disabled:opacity-[var(--wex-component-button-disabled-opacity)]",
        ].join(" "),
      },
      {
        intent: "destructive",
        variant: "ghost",
        class: [
          "text-wex-button-ghost-destructive-fg",
          "hover:bg-wex-button-destructive-outline-hover-bg",
          "hover:text-wex-button-ghost-destructive-hover-fg",
          "active:bg-wex-button-destructive-outline-active-bg",
          "disabled:text-wex-button-ghost-disabled-fg",
          "disabled:opacity-[var(--wex-component-button-disabled-opacity)]",
        ].join(" "),
      },
      {
        intent: "success",
        variant: "ghost",
        class: [
          "text-wex-button-ghost-success-fg",
          "hover:bg-wex-button-success-outline-hover-bg",
          "hover:text-wex-button-ghost-success-hover-fg",
          "active:bg-wex-button-success-outline-active-bg",
          "disabled:text-wex-button-ghost-disabled-fg",
          "disabled:opacity-[var(--wex-component-button-disabled-opacity)]",
        ].join(" "),
      },
      {
        intent: "info",
        variant: "ghost",
        class: [
          "text-wex-button-ghost-info-fg",
          "hover:bg-wex-button-info-outline-hover-bg",
          "hover:text-wex-button-ghost-info-hover-fg",
          "active:bg-wex-button-info-outline-active-bg",
          "disabled:text-wex-button-ghost-disabled-fg",
          "disabled:opacity-[var(--wex-component-button-disabled-opacity)]",
        ].join(" "),
      },
      {
        intent: "warning",
        variant: "ghost",
        class: [
          "text-wex-button-ghost-warning-fg",
          "hover:bg-wex-button-warning-outline-hover-bg",
          "hover:text-wex-button-ghost-warning-hover-fg",
          "active:bg-wex-button-warning-outline-active-bg",
          "disabled:text-wex-button-ghost-disabled-fg",
          "disabled:opacity-[var(--wex-component-button-disabled-opacity)]",
        ].join(" "),
      },
      {
        intent: "help",
        variant: "ghost",
        class: [
          "text-wex-button-ghost-help-fg",
          "hover:bg-wex-button-help-outline-hover-bg",
          "hover:text-wex-button-ghost-help-hover-fg",
          "active:bg-wex-button-help-outline-active-bg",
          "disabled:text-wex-button-ghost-disabled-fg",
          "disabled:opacity-[var(--wex-component-button-disabled-opacity)]",
        ].join(" "),
      },
      {
        intent: "contrast",
        variant: "ghost",
        class: [
          "text-wex-button-ghost-contrast-fg",
          "hover:bg-wex-button-contrast-outline-hover-bg",
          "hover:text-wex-button-ghost-contrast-hover-fg",
          "active:bg-wex-button-contrast-outline-active-bg",
          "disabled:text-wex-button-ghost-disabled-fg",
          "disabled:opacity-[var(--wex-component-button-disabled-opacity)]",
        ].join(" "),
      },
      // ═══════════════════════════════════════════════════════════════════
      // LINK VARIANTS - transparent bg, intent-colored text, underline on hover
      // All intents supported for consistency (mimics PrimeReact text buttons)
      // ═══════════════════════════════════════════════════════════════════
      {
        intent: "primary",
        variant: "link",
        class: [
          "text-wex-button-link-fg",
          "hover:text-wex-button-link-hover-fg",
          "active:text-wex-button-link-active-fg",
          "disabled:text-wex-button-link-disabled-fg",
          "disabled:no-underline",
          "disabled:opacity-[var(--wex-component-button-disabled-opacity)]",
        ].join(" "),
      },
      {
        intent: "secondary",
        variant: "link",
        class: [
          "text-wex-button-ghost-fg",
          "hover:text-wex-button-ghost-fg",
          "active:text-wex-button-ghost-fg",
          "disabled:text-wex-button-link-disabled-fg",
          "disabled:no-underline",
          "disabled:opacity-[var(--wex-component-button-disabled-opacity)]",
        ].join(" "),
      },
      {
        intent: "destructive",
        variant: "link",
        class: [
          "text-wex-button-link-destructive-fg",
          "hover:text-wex-button-link-destructive-hover-fg",
          "active:text-wex-button-link-destructive-active-fg",
          "disabled:text-wex-button-link-disabled-fg",
          "disabled:no-underline",
          "disabled:opacity-[var(--wex-component-button-disabled-opacity)]",
        ].join(" "),
      },
      {
        intent: "success",
        variant: "link",
        class: [
          "text-wex-button-link-success-fg",
          "hover:text-wex-button-link-success-hover-fg",
          "active:text-wex-button-link-success-active-fg",
          "disabled:text-wex-button-link-disabled-fg",
          "disabled:no-underline",
          "disabled:opacity-[var(--wex-component-button-disabled-opacity)]",
        ].join(" "),
      },
      {
        intent: "info",
        variant: "link",
        class: [
          "text-wex-button-link-info-fg",
          "hover:text-wex-button-link-info-hover-fg",
          "active:text-wex-button-link-info-active-fg",
          "disabled:text-wex-button-link-disabled-fg",
          "disabled:no-underline",
          "disabled:opacity-[var(--wex-component-button-disabled-opacity)]",
        ].join(" "),
      },
      {
        intent: "warning",
        variant: "link",
        class: [
          "text-wex-button-link-warning-fg",
          "hover:text-wex-button-link-warning-hover-fg",
          "active:text-wex-button-link-warning-active-fg",
          "disabled:text-wex-button-link-disabled-fg",
          "disabled:no-underline",
          "disabled:opacity-[var(--wex-component-button-disabled-opacity)]",
        ].join(" "),
      },
      {
        intent: "help",
        variant: "link",
        class: [
          "text-wex-button-link-help-fg",
          "hover:text-wex-button-link-help-hover-fg",
          "active:text-wex-button-link-help-active-fg",
          "disabled:text-wex-button-link-disabled-fg",
          "disabled:no-underline",
          "disabled:opacity-[var(--wex-component-button-disabled-opacity)]",
        ].join(" "),
      },
      {
        intent: "contrast",
        variant: "link",
        class: [
          "text-wex-button-link-contrast-fg",
          "hover:text-wex-button-link-contrast-hover-fg",
          "active:text-wex-button-link-contrast-active-fg",
          "disabled:text-wex-button-link-disabled-fg",
          "disabled:no-underline",
          "disabled:opacity-[var(--wex-component-button-disabled-opacity)]",
        ].join(" "),
      },
    ],
    defaultVariants: {
      intent: "primary",
      variant: "solid",
      size: "md",
      rounded: false,
    },
  }
);

export interface WexButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof wexButtonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const WexButton = React.forwardRef<HTMLButtonElement, WexButtonProps>(
  ({ className, intent, variant, size, rounded, asChild = false, loading = false, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || loading;
    
    // When using asChild, Slot expects exactly ONE child element.
    // We cannot render the loading spinner alongside children when asChild is true.
    // Loading spinner is only shown for regular button mode.
    const renderChildren = () => {
      if (asChild) {
        // asChild mode: pass children directly to Slot (must be single element)
        return children;
      }
      // Regular button mode: can include loading spinner
      return (
        <>
          {loading && <Loader2 className="animate-spin" />}
          {children}
        </>
      );
    };
    
    return (
      <Comp
        className={"wex-button " + cn(wexButtonVariants({ intent, variant, size, rounded, className }))}
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading}        
        {...props}
      >
        {renderChildren()}
      </Comp>
    );
  }
);
WexButton.displayName = "WexButton";

export { WexButton, wexButtonVariants };

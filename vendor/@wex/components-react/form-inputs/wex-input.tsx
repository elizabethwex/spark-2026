import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

/**
 * WexInput - WEX Design System Input Component
 *
 * Text input field for forms with PrimeNG-style variants.
 * Uses WEX sizing tokens for accessible touch targets.
 *
 * @example
 * // Basic
 * <WexInput placeholder="Enter text" />
 * 
 * // Sizes
 * <WexInput inputSize="sm" placeholder="Small" />
 * <WexInput inputSize="lg" placeholder="Large" />
 * 
 * // Filled variant
 * <WexInput variant="filled" placeholder="Filled input" />
 * 
 * // With icons
 * <WexInput leftIcon={<Search className="h-4 w-4" />} placeholder="Search..." />
 * <WexInput rightIcon={<Mail className="h-4 w-4" />} placeholder="Email" />
 * 
 * // Invalid state
 * <WexInput invalid placeholder="Invalid input" />
 */

// Helper to check if a ReactNode is an interactive element (button)
const isInteractiveElement = (node: React.ReactNode): boolean => {
  if (!React.isValidElement(node)) return false;
  const elementType = node.type;
  if (typeof elementType === "string") {
    return elementType === "button";
  }
  if (typeof elementType === "function") {
    const displayName = (elementType as any)?.displayName;
    return displayName === "button" || displayName === "Button";
  }
  return false;
};

const wexInputVariants = cva(
  [
    // Layout
    "flex w-full px-3 py-2 text-sm shadow-sm transition-colors",
    // Layer 3 tokens - text
    "text-wex-input-fg",
    // Layer 3 tokens - placeholder
    "placeholder:text-wex-input-placeholder",
    // Focus ring
    "focus-visible:outline-none focus-visible:ring-1",
    // Disabled states
    "disabled:cursor-not-allowed",
    "disabled:bg-wex-input-disabled-bg",
    "disabled:text-wex-input-disabled-fg",
    "disabled:border-wex-input-disabled-border",
    "disabled:opacity-[var(--wex-component-input-disabled-opacity)]",
    // File input
    "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-wex-input-fg",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-wex-input-bg",
          "border border-wex-input-border",
          "hover:border-wex-input-border-hover",
          "focus-visible:border-wex-input-border-focus",
          "focus-visible:ring-wex-input-focus-ring",
        ].join(" "),
        filled: [
          "bg-wex-input-filled-bg",
          "border border-transparent",
          "hover:bg-wex-input-filled-hover-bg",
          "focus-visible:border-wex-input-border-focus",
          "focus-visible:ring-wex-input-focus-ring",
        ].join(" "),
      },
      inputSize: {
        sm: "h-9 text-xs",
        md: "h-11",
        lg: "h-12 text-base",
      },
      invalid: {
        true: [
          "border-wex-input-invalid-border",
          "focus-visible:border-wex-input-invalid-border",
          "focus-visible:ring-wex-input-invalid-focus-ring",
        ].join(" "),
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "md",
      invalid: false,
    },
  }
);

export interface WexInputProps
  extends Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof wexInputVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const WexInput = React.forwardRef<HTMLInputElement, WexInputProps>(
  ({ className, type, variant, inputSize, invalid, leftIcon, rightIcon, ...props }, ref) => {
    const inputStyle = React.useMemo(
      () => ({
        borderRadius: "var(--wex-component-input-radius)",
      }),
      []
    );

    // Check if rightIcon is interactive (button element)
    const isRightIconInteractive = rightIcon ? isInteractiveElement(rightIcon) : false;

    if (leftIcon || rightIcon) {
      return (
        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-wex-input-placeholder z-10">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              wexInputVariants({ variant, inputSize, invalid }),
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className
            )}
            style={inputStyle}
            ref={ref}
            aria-invalid={invalid || undefined}
            {...props}
          />
          {rightIcon && (
            <div
              className={cn(
                "absolute right-3 flex items-center text-wex-input-placeholder z-10",
                !isRightIconInteractive && "pointer-events-none"
              )}
              onClick={(e) => {
                // If rightIcon is interactive, stop propagation to prevent input focus
                if (isRightIconInteractive) {
                  e.stopPropagation();
                }
              }}
            >
              {rightIcon}
            </div>
          )}
        </div>
      );
    }

    return (
      <input
        type={type}
        className={cn(wexInputVariants({ variant, inputSize, invalid }), className)}
        style={inputStyle}
        ref={ref}
        aria-invalid={invalid || undefined}
        {...props}
      />
    );
  }
);
WexInput.displayName = "WexInput";

export { WexInput, wexInputVariants };

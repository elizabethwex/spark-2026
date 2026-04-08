import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

// Context to pass intent to child components
const AlertContext = React.createContext<{ intent?: "default" | "destructive" | "success" | "warning" | "info" }>({});

/**
 * WexAlert - WEX Design System Alert Component
 *
 * Displays important messages to users with semantic intent variants.
 *
 * @example
 * <WexAlert intent="default">
 *   <WexAlert.Title>Heads up!</WexAlert.Title>
 *   <WexAlert.Description>Important information here.</WexAlert.Description>
 * </WexAlert>
 */

const wexAlertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-3.5 [&>svg~*]:pl-7",
  {
    variants: {
      intent: {
        // DEFAULT - Layer 3 tokens
        default: [
          "bg-wex-alert-default-bg",
          "text-wex-alert-default-fg",
          "border-wex-alert-default-border",
          "[&>svg]:text-wex-alert-default-icon",
        ].join(" "),
        // DESTRUCTIVE - Layer 3 tokens (tinted style)
        destructive: [
          "bg-wex-alert-destructive-bg",
          "text-wex-alert-destructive-fg",
          "border-wex-alert-destructive-border",
          "[&>svg]:text-wex-alert-destructive-icon",
        ].join(" "),
        // SUCCESS - Layer 3 tokens (tinted style)
        success: [
          "bg-wex-alert-success-bg",
          "text-wex-alert-success-fg",
          "border-wex-alert-success-border",
          "[&>svg]:text-wex-alert-success-icon",
        ].join(" "),
        // WARNING - Layer 3 tokens (tinted style)
        warning: [
          "bg-wex-alert-warning-bg",
          "text-wex-alert-warning-fg",
          "border-wex-alert-warning-border",
          "[&>svg]:text-wex-alert-warning-icon",
        ].join(" "),
        // INFO - Layer 3 tokens (tinted style)
        info: [
          "bg-wex-alert-info-bg",
          "text-wex-alert-info-fg",
          "border-wex-alert-info-border",
          "[&>svg]:text-wex-alert-info-icon",
        ].join(" "),
      },
    },
    defaultVariants: {
      intent: "default",
    },
  }
);

export interface WexAlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof wexAlertVariants> {}

const WexAlertRoot = React.forwardRef<HTMLDivElement, WexAlertProps>(
  ({ className, intent, ...props }, ref) => (
    <AlertContext.Provider value={{ intent: intent ?? undefined }}>
      <div
        ref={ref}
        role="alert"
        className={"wex-alert " + cn(wexAlertVariants({ intent }), className)}
        {...props}
      />
    </AlertContext.Provider>
  )
);
WexAlertRoot.displayName = "WexAlert";

const WexAlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  // Get the parent alert's intent to determine which title color token to use
  const { intent } = React.useContext(AlertContext);
  const titleColorVar = intent 
    ? `--wex-component-alert-${intent}-title-fg`
    : "--wex-component-alert-default-title-fg";
  
  return (
    <h5
      ref={ref}
      className={cn("mb-1 font-medium leading-none tracking-tight", className)}
      style={{ color: `hsl(var(${titleColorVar}))` }}
      {...props}
    />
  );
});
WexAlertTitle.displayName = "WexAlert.Title";

const WexAlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
WexAlertDescription.displayName = "WexAlert.Description";

// Namespace pattern: WexAlert.Title, WexAlert.Description
export const WexAlert = Object.assign(WexAlertRoot, {
  Title: WexAlertTitle,
  Description: WexAlertDescription,
});

export { wexAlertVariants };


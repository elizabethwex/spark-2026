import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

/**
 * WexToaster - WEX Design System Toast Container Component
 *
 * Toast notification container using Sonner with WEX theming.
 * Place WexToaster once at the root of your app.
 *
 * For triggering toasts, use wexToast from "./wex-toast".
 *
 * WCAG 2.2 AA Compliance:
 * - Toast messages are announced by screen readers
 * - Sufficient color contrast in light and dark modes
 * - Focus management handled by Sonner library
 *
 * Positions available:
 * - top-left, top-center, top-right
 * - bottom-left, bottom-center, bottom-right (default)
 *
 * @example
 * // In App.tsx or layout:
 * <WexToaster position="top-right" />
 */

// ============================================================================
// Base Toaster Component (from shadcn/sonner)
// ============================================================================

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-wex-toast-bg group-[.toaster]:text-wex-toast-fg group-[.toaster]:border-wex-toast-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-wex-toast-description-fg",
          actionButton:
            "group-[.toast]:bg-wex-toast-action-bg group-[.toast]:text-wex-toast-action-fg",
          cancelButton:
            "group-[.toast]:bg-wex-toast-cancel-bg group-[.toast]:text-wex-toast-cancel-fg",
        },
      }}
      {...props}
    />
  );
};

// ============================================================================
// WEX Wrappers
// ============================================================================

/**
 * Toast positions available for WexToaster
 * Custom WEX type (not exported from native sonner)
 */
export type ToastPosition = 
  | "top-left" 
  | "top-center" 
  | "top-right" 
  | "bottom-left" 
  | "bottom-center" 
  | "bottom-right";

export const WexToaster = Toaster;

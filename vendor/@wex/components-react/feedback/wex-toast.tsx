import { toast } from "sonner";
import type { ExternalToast } from "sonner";

/**
 * WexToast - WEX Design System Toast API
 *
 * Wraps Sonner's toast function with WEX namespace for consistent imports.
 * This provides a single point of control for toast behavior across the system.
 *
 * Use WexToaster (from wex-sonner) as the container in your app root.
 * Use wexToast to trigger toast notifications.
 *
 * @example
 * // Basic usage
 * wexToast("File saved");
 *
 * // Variants
 * wexToast.success("Upload complete");
 * wexToast.error("Something went wrong");
 * wexToast.warning("Check your input");
 * wexToast.info("New version available");
 *
 * // With options
 * wexToast.success("Saved!", { duration: 5000 });
 *
 * // Promise-based (for async operations)
 * wexToast.promise(saveData(), {
 *   loading: "Saving...",
 *   success: "Data saved!",
 *   error: "Failed to save",
 * });
 */
export const wexToast = toast;

// Re-export types for consumers who need to type toast options
export type { ExternalToast as WexToastOptions };


import * as React from "react";
import { cn } from "../lib/utils";

/**
 * WexTextarea - WEX Design System Textarea Component
 *
 * Multi-line text input for forms.
 * Uses WEX sizing tokens for accessible touch targets.
 *
 * @example
 * <WexLabel htmlFor="message">Message</WexLabel>
 * <WexTextarea id="message" placeholder="Type your message..." />
 */

// ============================================================================
// Base Textarea Component (from shadcn)
// ============================================================================

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[60px] w-full rounded-md border border-wex-textarea-border bg-transparent px-3 py-2 shadow-sm placeholder:text-wex-textarea-placeholder focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-wex-textarea-focus-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

// ============================================================================
// WEX Wrappers
// ============================================================================

interface WexTextareaProps extends React.ComponentPropsWithoutRef<typeof Textarea> {
  textareaSize?: "sm" | "md" | "lg";
  autoResize?: boolean;
}

export const WexTextarea = React.forwardRef<
  React.ElementRef<typeof Textarea>,
  WexTextareaProps
>(({ className, textareaSize = "md", autoResize, style, ...props }, ref) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement);

  React.useEffect(() => {
    if (autoResize && textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [autoResize, props.value]);

  return (
    <Textarea
      ref={textareaRef}
      className={cn(
        "border-wex-textarea-border bg-wex-textarea-bg text-wex-textarea-fg placeholder:text-wex-textarea-placeholder focus-visible:ring-wex-textarea-focus-ring disabled:opacity-[var(--wex-component-textarea-disabled-opacity)]",
        textareaSize === "sm" && "h-16 !text-xs px-2 py-1",
        textareaSize === "md" && "h-20 !text-sm px-3 py-2",
        textareaSize === "lg" && "h-24 !text-base px-4 py-3",
        autoResize && "overflow-hidden resize-none",
        className
      )}
      style={style}
      {...props}
    />
  );
});
WexTextarea.displayName = "WexTextarea";

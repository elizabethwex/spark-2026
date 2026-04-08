import * as React from "react";
import { cn } from "@/lib/utils";

// ─── FloatLabelInput ─────────────────────────────────────────────────────────

type FloatLabelInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export const FloatLabelInput = React.forwardRef<HTMLInputElement, FloatLabelInputProps>(
  ({ label, error, className, id: idProp, ...props }, ref) => {
    const id = idProp ?? React.useId();
    const [focused, setFocused] = React.useState(false);
    const hasValue = props.value !== undefined ? String(props.value).length > 0 : false;
    const elevated = focused || hasValue;

    return (
      <div className={cn("relative w-full", className)}>
        <input
          id={id}
          ref={ref}
          {...props}
          onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
          className={cn(
            "peer w-full rounded-[6px] border shadow-[0px_1px_2px_0px_rgba(18,18,23,0.05)]",
            "px-[11.5px] pb-2 pt-[22px] text-[14px] text-[#243746] leading-[normal]",
            "focus:outline-none focus:ring-2 focus:ring-[#0058a3]/30",
            error
              ? "border-[#d23f57] bg-white"
              : focused
                ? "border-[#0058a3] bg-white"
                : "border-[#a5aeb4] bg-white",
          )}
        />
        <label
          htmlFor={id}
          className={cn(
            "pointer-events-none absolute left-0 top-0 pl-[10.5px] transition-all duration-150",
            elevated ? "pt-[7px] text-[10.5px] leading-[10.5px]" : "pt-[14px] text-[14px] leading-[normal]",
            error ? "text-[#d23f57]" : focused ? "text-[#0058a3]" : "text-[#515f6b]",
          )}
        >
          {label}
        </label>
        {error && <div className="mt-1 text-xs text-[#d23f57]">{error}</div>}
      </div>
    );
  }
);
FloatLabelInput.displayName = "FloatLabelInput";

// ─── FloatLabelSelect ────────────────────────────────────────────────────────

type FloatLabelSelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
};

export const FloatLabelSelect = React.forwardRef<HTMLSelectElement, FloatLabelSelectProps>(
  ({ label, error, className, id: idProp, children, ...props }, ref) => {
    const id = idProp ?? React.useId();
    const [focused, setFocused] = React.useState(false);
    const hasValue = props.value !== undefined ? String(props.value).length > 0 : false;
    const elevated = focused || hasValue;

    return (
      <div className={cn("relative w-full", className)}>
        <select
          id={id}
          ref={ref}
          {...props}
          onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
          className={cn(
            "peer w-full appearance-none rounded-[6px] border shadow-[0px_1px_2px_0px_rgba(18,18,23,0.05)]",
            "px-[11.5px] pb-2 pt-[22px] text-[14px] text-[#243746] leading-[normal]",
            "focus:outline-none focus:ring-2 focus:ring-[#0058a3]/30",
            error
              ? "border-[#d23f57] bg-white"
              : focused
                ? "border-[#0058a3] bg-white"
                : "border-[#a5aeb4] bg-white",
          )}
        >
          {children}
        </select>
        <label
          htmlFor={id}
          className={cn(
            "pointer-events-none absolute left-0 top-0 pl-[10.5px] transition-all duration-150",
            elevated ? "pt-[7px] text-[10.5px] leading-[10.5px]" : "pt-[14px] text-[14px] leading-[normal]",
            error ? "text-[#d23f57]" : focused ? "text-[#0058a3]" : "text-[#515f6b]",
          )}
        >
          {label}
        </label>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 5L7 9L11 5" stroke="#243746" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {error && <div className="mt-1 text-xs text-[#d23f57]">{error}</div>}
      </div>
    );
  }
);
FloatLabelSelect.displayName = "FloatLabelSelect";

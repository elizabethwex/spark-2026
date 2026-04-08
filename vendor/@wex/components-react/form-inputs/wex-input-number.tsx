import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { Minus, Plus, ChevronUp, ChevronDown } from "lucide-react";

/**
 * WexInputNumber - WEX Design System InputNumber Component
 *
 * Numeric input with increment/decrement buttons, supporting decimal, currency,
 * and locale-aware formatting. Follows PrimeNG InputNumber API patterns.
 *
 * @example
 * // Basic
 * <WexInputNumber value={42} onValueChange={setValue} />
 *
 * // Currency
 * <WexInputNumber value={1500} mode="currency" currency="USD" locale="en-US" />
 *
 * // With buttons
 * <WexInputNumber value={50} showButtons buttonLayout="stacked" />
 *
 * // Min/Max boundaries
 * <WexInputNumber value={50} min={0} max={100} />
 *
 * // Prefix/Suffix
 * <WexInputNumber value={20} suffix="%" />
 * <WexInputNumber value={100} prefix="$" />
 */

// ============================================================================
// Variants
// ============================================================================

const inputNumberContainerVariants = cva(
  "relative flex items-stretch w-full",
  {
    variants: {
      buttonLayout: {
        stacked: "",
        horizontal: "",
        none: "",
      },
    },
    defaultVariants: {
      buttonLayout: "none",
    },
  }
);

const inputNumberInputVariants = cva(
  [
    // Base layout
    "flex w-full rounded-md px-3 py-2 text-sm shadow-sm transition-colors",
    // Text color
    "text-wex-input-fg",
    // Placeholder
    "placeholder:text-wex-input-placeholder",
    // Focus ring
    "focus-visible:outline-none focus-visible:ring-1",
    // Disabled
    "disabled:cursor-not-allowed",
    "disabled:bg-wex-input-disabled-bg",
    "disabled:text-wex-input-disabled-fg",
    "disabled:border-wex-input-disabled-border",
    "disabled:opacity-50",
    // Hide native spinner buttons
    "[appearance:textfield]",
    "[&::-webkit-outer-spin-button]:appearance-none",
    "[&::-webkit-inner-spin-button]:appearance-none",
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
          "hover:bg-wex-input-filled-bg/80",
          "focus-visible:border-wex-input-border-focus",
          "focus-visible:ring-wex-input-focus-ring",
        ].join(" "),
      },
      inputSize: {
        sm: "h-8 text-xs",
        md: "h-11 text-sm",
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
      buttonLayout: {
        stacked: "rounded-r-none border-r-0",
        horizontal: "rounded-none",
        none: "",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "md",
      invalid: false,
      buttonLayout: "none",
    },
  }
);

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center",
    "border border-wex-input-border",
    "bg-wex-input-filled-bg",
    "text-wex-input-fg",
    "transition-colors",
    "hover:bg-wex-input-filled-bg/80",
    "active:bg-wex-input-filled-bg/70",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-wex-input-focus-ring",
  ],
  {
    variants: {
      position: {
        // Horizontal layout
        left: "rounded-l-md rounded-r-none border-r-0",
        right: "rounded-r-md rounded-l-none border-l-0",
        // Stacked layout - use flex-1 to split height evenly
        top: "rounded-tr-md rounded-br-none border-b-0 flex-1",
        bottom: "rounded-br-md rounded-tr-none flex-1",
      },
      buttonSize: {
        sm: "w-7",
        md: "w-8",
        lg: "w-10",
      },
      horizontalSize: {
        sm: "w-8 h-8 min-w-target min-h-target",
        md: "w-10 h-11 min-w-target min-h-target",
        lg: "w-12 h-12 min-w-target min-h-target",
      },
    },
    defaultVariants: {
      buttonSize: "md",
      horizontalSize: "md",
    },
  }
);

// ============================================================================
// Types
// ============================================================================

type InputNumberMode = "decimal" | "currency";
type ButtonLayout = "stacked" | "horizontal" | "none";

export interface WexInputNumberProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "value" | "onChange" | "defaultValue">,
    VariantProps<typeof inputNumberInputVariants> {
  /** Current value */
  value?: number | null;
  /** Default value for uncontrolled usage */
  defaultValue?: number | null;
  /** Callback when value changes */
  onValueChange?: (value: number | null) => void;
  /** Mode - decimal or currency */
  mode?: InputNumberMode;
  /** Currency code (ISO 4217) for currency mode */
  currency?: string;
  /** Currency display format */
  currencyDisplay?: "symbol" | "code" | "name";
  /** Locale for number formatting */
  locale?: string;
  /** Use digit grouping (thousand separators) */
  useGrouping?: boolean;
  /** Minimum fraction digits */
  minFractionDigits?: number;
  /** Maximum fraction digits */
  maxFractionDigits?: number;
  /** Minimum allowed value */
  min?: number;
  /** Maximum allowed value */
  max?: number;
  /** Step for increment/decrement */
  step?: number;
  /** Text to display before the value */
  prefix?: string;
  /** Text to display after the value */
  suffix?: string;
  /** Show increment/decrement buttons */
  showButtons?: boolean;
  /** Button layout - stacked (right side) or horizontal (both sides) */
  buttonLayout?: ButtonLayout;
  /** Allow empty value */
  allowEmpty?: boolean;
  /** Input size */
  inputSize?: "sm" | "md" | "lg";
  /** Input variant */
  variant?: "default" | "filled";
  /** Invalid state */
  invalid?: boolean;
  /** Make input fluid (full width) */
  fluid?: boolean;
  /** Use inside WexFloatLabel - adjusts height and padding */
  floatLabel?: boolean;
}

// ============================================================================
// Utility Functions
// ============================================================================

function formatNumber(
  value: number | null,
  options: {
    mode?: InputNumberMode;
    locale?: string;
    currency?: string;
    currencyDisplay?: "symbol" | "code" | "name";
    useGrouping?: boolean;
    minFractionDigits?: number;
    maxFractionDigits?: number;
    prefix?: string;
    suffix?: string;
  }
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "";
  }

  const {
    mode = "decimal",
    locale = navigator.language,
    currency = "USD",
    currencyDisplay = "symbol",
    useGrouping = true,
    minFractionDigits,
    maxFractionDigits,
    prefix = "",
    suffix = "",
  } = options;

  const formatOptions: Intl.NumberFormatOptions = {
    useGrouping,
    minimumFractionDigits: minFractionDigits,
    maximumFractionDigits: maxFractionDigits,
  };

  if (mode === "currency") {
    formatOptions.style = "currency";
    formatOptions.currency = currency;
    formatOptions.currencyDisplay = currencyDisplay;
  }

  try {
    const formatted = new Intl.NumberFormat(locale, formatOptions).format(value);
    // For decimal mode with prefix/suffix, add them manually
    if (mode === "decimal") {
      return `${prefix}${formatted}${suffix}`;
    }
    return formatted;
  } catch {
    return String(value);
  }
}

function parseNumber(
  value: string,
  options: {
    locale?: string;
    mode?: InputNumberMode;
    currency?: string;
  }
): number | null {
  if (!value || value.trim() === "") {
    return null;
  }

  const { locale = navigator.language } = options;

  // Get locale-specific separators
  const parts = new Intl.NumberFormat(locale).formatToParts(12345.6);
  const groupSeparator = parts.find((p) => p.type === "group")?.value || ",";
  const decimalSeparator = parts.find((p) => p.type === "decimal")?.value || ".";

  // Remove currency symbols, prefix, suffix, and whitespace
  let cleaned = value.replace(/[^\d\-.,]/g, "");

  // Normalize separators
  if (decimalSeparator !== ".") {
    // Replace group separator first (if it's different from decimal)
    if (groupSeparator !== decimalSeparator) {
      cleaned = cleaned.replace(new RegExp(`\\${groupSeparator}`, "g"), "");
    }
    // Replace decimal separator with standard dot
    cleaned = cleaned.replace(decimalSeparator, ".");
  } else {
    // Remove group separators
    cleaned = cleaned.replace(new RegExp(`\\${groupSeparator}`, "g"), "");
  }

  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? null : parsed;
}

function clampValue(value: number | null, min?: number, max?: number): number | null {
  if (value === null) return null;
  if (min !== undefined && value < min) return min;
  if (max !== undefined && value > max) return max;
  return value;
}

// ============================================================================
// Component
// ============================================================================

const WexInputNumber = React.forwardRef<HTMLInputElement, WexInputNumberProps>(
  (
    {
      className,
      value: controlledValue,
      defaultValue,
      onValueChange,
      mode = "decimal",
      currency = "USD",
      currencyDisplay = "symbol",
      locale,
      useGrouping = true,
      minFractionDigits,
      maxFractionDigits,
      min,
      max,
      step = 1,
      prefix = "",
      suffix = "",
      showButtons = false,
      buttonLayout = "none",
      allowEmpty = true,
      inputSize = "md",
      variant = "default",
      invalid = false,
      fluid = true,
      floatLabel = false,
      disabled,
      readOnly,
      placeholder,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      ...props
    },
    ref
  ) => {
    // Use internal state for uncontrolled mode
    const [internalValue, setInternalValue] = React.useState<number | null>(
      defaultValue ?? null
    );
    const [displayValue, setDisplayValue] = React.useState<string>("");
    const [isFocused, setIsFocused] = React.useState(false);

    const inputRef = React.useRef<HTMLInputElement>(null);
    const mergedRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    // Determine if controlled or uncontrolled
    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : internalValue;

    // Update display value when value changes (and not focused)
    React.useEffect(() => {
      if (!isFocused) {
        setDisplayValue(
          formatNumber(currentValue, {
            mode,
            locale,
            currency,
            currencyDisplay,
            useGrouping,
            minFractionDigits,
            maxFractionDigits,
            prefix: mode === "decimal" ? prefix : "",
            suffix: mode === "decimal" ? suffix : "",
          })
        );
      }
    }, [
      currentValue,
      isFocused,
      mode,
      locale,
      currency,
      currencyDisplay,
      useGrouping,
      minFractionDigits,
      maxFractionDigits,
      prefix,
      suffix,
    ]);

    const updateValue = React.useCallback(
      (newValue: number | null) => {
        const clampedValue = clampValue(newValue, min, max);
        const finalValue = clampedValue === null && !allowEmpty ? (min ?? 0) : clampedValue;

        if (!isControlled) {
          setInternalValue(finalValue);
        }
        onValueChange?.(finalValue);
      },
      [isControlled, min, max, allowEmpty, onValueChange]
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      
      // Get locale-specific decimal separator
      const parts = new Intl.NumberFormat(locale || navigator.language).formatToParts(1.1);
      const decimalSeparator = parts.find((p) => p.type === "decimal")?.value || ".";
      
      // Build regex to allow only valid numeric characters
      // Allow: digits, minus at start, one decimal separator
      const escapedDecimal = decimalSeparator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const validCharsRegex = new RegExp(`^-?[0-9]*${escapedDecimal}?[0-9]*$`);
      
      // Only update if input is valid numeric pattern or empty
      if (inputValue === "" || inputValue === "-" || validCharsRegex.test(inputValue)) {
        setDisplayValue(inputValue);

        // Parse and update value
        const parsed = parseNumber(inputValue, { locale, mode, currency });
        if (parsed !== null || allowEmpty) {
          updateValue(parsed);
        }
      }
      // If invalid, don't update displayValue - effectively rejecting the input
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      // Show raw value on focus for easier editing
      if (currentValue !== null) {
        setDisplayValue(String(currentValue));
      }
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      // Re-parse the display value and format
      const parsed = parseNumber(displayValue, { locale, mode, currency });
      const clamped = clampValue(parsed, min, max);
      updateValue(clamped);
      props.onBlur?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled || readOnly) return;

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          increment();
          break;
        case "ArrowDown":
          e.preventDefault();
          decrement();
          break;
        case "Home":
          if (min !== undefined) {
            e.preventDefault();
            updateValue(min);
            setDisplayValue(String(min));
          }
          break;
        case "End":
          if (max !== undefined) {
            e.preventDefault();
            updateValue(max);
            setDisplayValue(String(max));
          }
          break;
      }
      props.onKeyDown?.(e);
    };

    const increment = () => {
      if (disabled || readOnly) return;
      const newValue = (currentValue ?? min ?? 0) + step;
      const clampedValue = clampValue(newValue, min, max);
      updateValue(clampedValue);
      // Update display immediately (since we're focused, useEffect won't update it)
      if (clampedValue !== null) {
        setDisplayValue(String(clampedValue));
      }
    };

    const decrement = () => {
      if (disabled || readOnly) return;
      const newValue = (currentValue ?? min ?? 0) - step;
      const clampedValue = clampValue(newValue, min, max);
      updateValue(clampedValue);
      // Update display immediately (since we're focused, useEffect won't update it)
      if (clampedValue !== null) {
        setDisplayValue(String(clampedValue));
      }
    };

    // Spin button handlers for continuous increment/decrement
    const spinTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const spinIntervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

    const startSpin = (direction: "up" | "down") => {
      if (disabled || readOnly) return;

      const action = direction === "up" ? increment : decrement;
      action();

      // Start continuous spin after delay
      spinTimerRef.current = setTimeout(() => {
        spinIntervalRef.current = setInterval(action, 50);
      }, 400);
    };

    const stopSpin = () => {
      if (spinTimerRef.current) {
        clearTimeout(spinTimerRef.current);
        spinTimerRef.current = null;
      }
      if (spinIntervalRef.current) {
        clearInterval(spinIntervalRef.current);
        spinIntervalRef.current = null;
      }
    };

    React.useEffect(() => {
      return () => stopSpin();
    }, []);

    // Determine actual button layout
    const effectiveButtonLayout: ButtonLayout =
      showButtons && buttonLayout !== "none" ? buttonLayout : showButtons ? "stacked" : "none";

    const renderStackedButtons = () => {
      const iconSize = inputSize === "sm" ? "h-3 w-3" : inputSize === "lg" ? "h-4 w-4" : "h-3.5 w-3.5";
      const buttonWidth = inputSize === "sm" ? "w-7" : inputSize === "lg" ? "w-10" : "w-9";
      
      return (
        // Use self-stretch to match input height naturally instead of explicit height
        <div className="flex flex-col shrink-0 self-stretch border-l border-wex-input-border">
          {/* Up/Increment button */}
          <button
            type="button"
            className={cn(
              "flex-1 inline-flex items-center justify-center",
              "border-t border-r border-wex-input-border",
              "bg-wex-input-filled-bg text-wex-input-fg",
              "rounded-tr-md",
              "hover:bg-wex-input-filled-bg/80 active:bg-wex-input-filled-bg/70",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-wex-input-focus-ring",
              buttonWidth
            )}
            onPointerDown={() => startSpin("up")}
            onPointerUp={stopSpin}
            onPointerLeave={stopSpin}
            disabled={disabled || (max !== undefined && currentValue !== null && currentValue >= max)}
            tabIndex={-1}
            aria-label="Increment"
          >
            <ChevronUp className={iconSize} />
          </button>
          {/* Down/Decrement button */}
          <button
            type="button"
            className={cn(
              "flex-1 inline-flex items-center justify-center",
              "border-t border-r border-b border-wex-input-border",
              "bg-wex-input-filled-bg text-wex-input-fg",
              "rounded-br-md",
              "hover:bg-wex-input-filled-bg/80 active:bg-wex-input-filled-bg/70",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-wex-input-focus-ring",
              buttonWidth
            )}
            onPointerDown={() => startSpin("down")}
            onPointerUp={stopSpin}
            onPointerLeave={stopSpin}
            disabled={disabled || (min !== undefined && currentValue !== null && currentValue <= min)}
            tabIndex={-1}
            aria-label="Decrement"
          >
            <ChevronDown className={iconSize} />
          </button>
        </div>
      );
    };

    const renderHorizontalButtons = () => (
      <>
        <button
          type="button"
          className={cn(buttonVariants({ position: "left", horizontalSize: inputSize }))}
          onPointerDown={() => startSpin("down")}
          onPointerUp={stopSpin}
          onPointerLeave={stopSpin}
          disabled={disabled || (min !== undefined && currentValue !== null && currentValue <= min)}
          tabIndex={-1}
          aria-label="Decrement"
        >
          <Minus className="h-4 w-4" />
        </button>
      </>
    );

    const renderHorizontalButtonRight = () => (
      <button
        type="button"
        className={cn(buttonVariants({ position: "right", horizontalSize: inputSize }))}
        onPointerDown={() => startSpin("up")}
        onPointerUp={stopSpin}
        onPointerLeave={stopSpin}
        disabled={disabled || (max !== undefined && currentValue !== null && currentValue >= max)}
        tabIndex={-1}
        aria-label="Increment"
      >
        <Plus className="h-4 w-4" />
      </button>
    );

    // Float label mode: use taller heights and adjusted padding
    const floatLabelConfig = floatLabel ? {
      containerHeight: inputSize === "sm" ? "h-12" : inputSize === "lg" ? "h-16" : "h-14",
      inputPadding: "pt-5 pb-1",
    } : null;

    return (
      <div
        className={"wex-input-number " + cn(
          inputNumberContainerVariants({ buttonLayout: effectiveButtonLayout }),
          !fluid && "w-auto",
          floatLabelConfig?.containerHeight,
          className
        )}
      >
        {effectiveButtonLayout === "horizontal" && renderHorizontalButtons()}
        <input
          {...props}
          ref={mergedRef}
          type="text"
          inputMode="decimal"
          role="spinbutton"
          aria-valuenow={currentValue ?? undefined}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-invalid={invalid || undefined}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          className={cn(
            inputNumberInputVariants({
              variant,
              inputSize: floatLabel ? undefined : inputSize, // Skip size variant for floatLabel
              invalid,
              buttonLayout: effectiveButtonLayout,
            }),
            effectiveButtonLayout === "horizontal" && "text-center",
            // Float label: fill container height and add top padding for label
            floatLabelConfig && ["h-full", floatLabelConfig.inputPadding]
          )}
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
        />
        {effectiveButtonLayout === "stacked" && renderStackedButtons()}
        {effectiveButtonLayout === "horizontal" && renderHorizontalButtonRight()}
      </div>
    );
  }
);

WexInputNumber.displayName = "WexInputNumber";

export { WexInputNumber, inputNumberInputVariants };


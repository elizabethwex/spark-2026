import * as React from "react";
import { cn } from "../lib/utils";
import { WexInput, type WexInputProps } from "./wex-input";

/**
 * WexInputMask - WEX Design System InputMask Component
 *
 * Masked input for formatted data entry (phone numbers, SSN, dates, etc.)
 * Built on top of shadcn Input for consistent styling and accessibility.
 *
 * Mask character definitions:
 * - 9: Numeric (0-9)
 * - a: Alphabetic (A-Z, a-z)
 * - *: Alphanumeric (0-9, A-Z, a-z)
 *
 * @example
 * // Phone number
 * <WexInputMask mask="(999) 999-9999" value={phone} onValueChange={setPhone} />
 *
 * // SSN
 * <WexInputMask mask="999-99-9999" value={ssn} onValueChange={setSsn} />
 *
 * // Serial number (mixed)
 * <WexInputMask mask="a*-999-a999" value={serial} onValueChange={setSerial} />
 */

// ============================================================================
// Types
// ============================================================================

/** Mask slot definition */
interface MaskSlot {
  /** Character index in the mask */
  index: number;
  /** Type of slot: 'digit', 'alpha', 'alphanumeric', or 'literal' */
  type: "digit" | "alpha" | "alphanumeric" | "literal";
  /** The literal character (for literal slots) */
  char?: string;
}

export interface WexInputMaskProps
  extends Omit<WexInputProps, "value" | "onChange"> {
  /** Mask pattern (9=digit, a=alpha, *=alphanumeric) */
  mask: string;
  /** Placeholder character for unfilled slots */
  slotChar?: string;
  /** Current value (unmasked) */
  value?: string;
  /** Default value for uncontrolled usage */
  defaultValue?: string;
  /** Callback when value changes */
  onValueChange?: (value: string, isComplete: boolean) => void;
  /** Callback when complete (all slots filled) */
  onComplete?: (value: string) => void;
  /** Clear incomplete value on blur */
  autoClear?: boolean;
  /** Use inside WexFloatLabel - adjusts height and padding */
  floatLabel?: boolean;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Parse a mask string into an array of slot definitions
 */
function parseMask(mask: string): MaskSlot[] {
  const slots: MaskSlot[] = [];

  for (let i = 0; i < mask.length; i++) {
    const char = mask[i];
    switch (char) {
      case "9":
        slots.push({ index: i, type: "digit" });
        break;
      case "a":
        slots.push({ index: i, type: "alpha" });
        break;
      case "*":
        slots.push({ index: i, type: "alphanumeric" });
        break;
      default:
        slots.push({ index: i, type: "literal", char });
        break;
    }
  }

  return slots;
}

/**
 * Check if a character is valid for a given slot type
 */
function isValidForSlot(char: string, slotType: MaskSlot["type"]): boolean {
  switch (slotType) {
    case "digit":
      return /^[0-9]$/.test(char);
    case "alpha":
      return /^[a-zA-Z]$/.test(char);
    case "alphanumeric":
      return /^[a-zA-Z0-9]$/.test(char);
    case "literal":
      return false;
    default:
      return false;
  }
}

/**
 * Get only the input slots (non-literal) from parsed mask
 */
function getInputSlots(slots: MaskSlot[]): MaskSlot[] {
  return slots.filter((slot) => slot.type !== "literal");
}

/**
 * Format a raw value according to the mask
 */
function formatValue(
  rawValue: string,
  slots: MaskSlot[],
  slotChar: string
): string {
  let rawIndex = 0;
  let result = "";

  for (const slot of slots) {
    if (slot.type === "literal") {
      result += slot.char;
    } else {
      if (rawIndex < rawValue.length) {
        result += rawValue[rawIndex];
        rawIndex++;
      } else {
        result += slotChar;
      }
    }
  }

  return result;
}

/**
 * Find the next input slot position starting from a given index
 */
function findNextInputSlot(
  slots: MaskSlot[],
  startIndex: number
): number | null {
  for (let i = startIndex; i < slots.length; i++) {
    if (slots[i].type !== "literal") {
      return i;
    }
  }
  return null;
}

/**
 * Find the previous input slot position starting from a given index
 */
function findPrevInputSlot(
  slots: MaskSlot[],
  startIndex: number
): number | null {
  for (let i = startIndex - 1; i >= 0; i--) {
    if (slots[i].type !== "literal") {
      return i;
    }
  }
  return null;
}

/**
 * Check if the mask is complete (all input slots filled)
 */
function isComplete(rawValue: string, slots: MaskSlot[]): boolean {
  const inputSlots = getInputSlots(slots);
  return rawValue.length === inputSlots.length;
}

// ============================================================================
// Component
// ============================================================================

const WexInputMask = React.forwardRef<HTMLInputElement, WexInputMaskProps>(
  (
    {
      className,
      mask,
      slotChar = "_",
      value: controlledValue,
      defaultValue,
      onValueChange,
      onComplete,
      autoClear = false,
      floatLabel = false,
      variant,
      inputSize,
      invalid,
      disabled,
      readOnly,
      placeholder,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      onFocus: onFocusProp,
      onBlur: onBlurProp,
      onKeyDown: onKeyDownProp,
      ...props
    },
    ref
  ) => {
    // Parse the mask once
    const slots = React.useMemo(() => parseMask(mask), [mask]);
    const inputSlots = React.useMemo(() => getInputSlots(slots), [slots]);

    // Internal state
    const [internalRawValue, setInternalRawValue] = React.useState<string>(
      defaultValue ?? ""
    );
    const [isFocused, setIsFocused] = React.useState(false);

    const inputRef = React.useRef<HTMLInputElement>(null);
    const mergedRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        (inputRef as React.MutableRefObject<HTMLInputElement | null>).current =
          node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    // Track intended cursor position to apply synchronously after render
    const pendingCursorPosition = React.useRef<number | null>(null);

    // Determine if controlled or uncontrolled
    const isControlled = controlledValue !== undefined;
    const rawValue = isControlled ? controlledValue : internalRawValue;

    // Calculate display value
    // When unfocused and empty: show empty string so native placeholder can show
    // When focused or has value: show the formatted mask
    const displayValue = React.useMemo(() => {
      const hasValue = rawValue.length > 0;
      if (!isFocused && !hasValue) {
        return ""; // Hide mask placeholder when unfocused and empty so native placeholder shows
      }
      return formatValue(rawValue, slots, slotChar);
    }, [rawValue, slots, slotChar, isFocused]);

    // Apply pending cursor position synchronously after DOM updates
    React.useLayoutEffect(() => {
      if (pendingCursorPosition.current !== null && inputRef.current) {
        const pos = pendingCursorPosition.current;
        inputRef.current.setSelectionRange(pos, pos);
        pendingCursorPosition.current = null;
      }
    });

    // Update value helper
    const updateValue = React.useCallback(
      (newRawValue: string) => {
        // Validate each character against its slot
        let validatedValue = "";
        for (let i = 0; i < newRawValue.length && i < inputSlots.length; i++) {
          const char = newRawValue[i];
          const slot = inputSlots[i];
          if (isValidForSlot(char, slot.type)) {
            validatedValue += char;
          }
        }

        if (!isControlled) {
          setInternalRawValue(validatedValue);
        }

        const complete = isComplete(validatedValue, slots);
        onValueChange?.(validatedValue, complete);

        if (complete) {
          onComplete?.(validatedValue);
        }
      },
      [isControlled, inputSlots, slots, onValueChange, onComplete]
    );

    // Set cursor position - stores in ref to be applied by useLayoutEffect
    const setCursorPosition = React.useCallback((position: number) => {
      pendingCursorPosition.current = position;
      // Also try to set immediately in case no re-render happens
      if (inputRef.current) {
        inputRef.current.setSelectionRange(position, position);
      }
    }, []);

    // Handle change events
    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled || readOnly) return;

        const input = e.target;
        const inputValue = input.value;
        const cursorPos = input.selectionStart ?? 0;

        // Extract only valid characters from the input
        let newRawValue = "";
        for (const char of inputValue) {
          if (char === slotChar) continue;
          if (/[a-zA-Z0-9]/.test(char)) {
            newRawValue += char;
          }
        }

        // Limit to max length
        const clampedRawValue = newRawValue.slice(0, inputSlots.length);

        updateValue(clampedRawValue);

        // Calculate new cursor position
        const filledLength = clampedRawValue.length;
        let newCursorPos = 0;
        let rawCount = 0;
        for (let i = 0; i < slots.length; i++) {
          if (slots[i].type !== "literal") {
            rawCount++;
            if (rawCount > filledLength) {
              newCursorPos = i;
              break;
            }
          }
          newCursorPos = i + 1;
        }

        setCursorPosition(Math.min(newCursorPos, cursorPos + 1));
      },
      [
        disabled,
        readOnly,
        slots,
        slotChar,
        inputSlots.length,
        updateValue,
        setCursorPosition,
      ]
    );

    // Handle key down for special keys
    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (disabled || readOnly) return;

        const input = e.currentTarget;
        const cursorPos = input.selectionStart ?? 0;
        const selectionEnd = input.selectionEnd ?? 0;
        const hasSelection = cursorPos !== selectionEnd;

        switch (e.key) {
          case "Backspace": {
            e.preventDefault();

            if (hasSelection) {
              const beforeSelection = rawValue.slice(
                0,
                Math.min(
                  cursorPos,
                  inputSlots.findIndex((s) => s.index >= cursorPos) !== -1
                    ? inputSlots.findIndex((s) => s.index >= cursorPos)
                    : rawValue.length
                )
              );
              updateValue(beforeSelection);
              setCursorPosition(cursorPos);
            } else {
              const prevInputSlot = findPrevInputSlot(slots, cursorPos);
              if (prevInputSlot !== null) {
                let rawCharsBefore = 0;
                for (let i = 0; i < prevInputSlot; i++) {
                  if (slots[i].type !== "literal") {
                    rawCharsBefore++;
                  }
                }

                const newRaw =
                  rawValue.slice(0, rawCharsBefore) +
                  rawValue.slice(rawCharsBefore + 1);
                updateValue(newRaw);
                setCursorPosition(prevInputSlot);
              }
            }
            break;
          }

          case "Delete": {
            e.preventDefault();

            if (hasSelection) {
              const beforeSelection = rawValue.slice(
                0,
                Math.min(
                  cursorPos,
                  inputSlots.findIndex((s) => s.index >= cursorPos) !== -1
                    ? inputSlots.findIndex((s) => s.index >= cursorPos)
                    : rawValue.length
                )
              );
              updateValue(beforeSelection);
              setCursorPosition(cursorPos);
            } else {
              let targetSlot = cursorPos;
              if (slots[cursorPos]?.type === "literal") {
                const next = findNextInputSlot(slots, cursorPos);
                if (next !== null) {
                  targetSlot = next;
                }
              }

              let rawCharsBefore = 0;
              for (let i = 0; i < targetSlot; i++) {
                if (slots[i].type !== "literal") {
                  rawCharsBefore++;
                }
              }

              if (rawCharsBefore < rawValue.length) {
                const newRaw =
                  rawValue.slice(0, rawCharsBefore) +
                  rawValue.slice(rawCharsBefore + 1);
                updateValue(newRaw);
              }
              setCursorPosition(cursorPos);
            }
            break;
          }

          case "ArrowLeft": {
            setTimeout(() => {
              const newPos = input.selectionStart ?? 0;
              if (slots[newPos]?.type === "literal") {
                const prev = findPrevInputSlot(slots, newPos);
                if (prev !== null) {
                  setCursorPosition(prev);
                }
              }
            }, 0);
            break;
          }

          case "ArrowRight": {
            setTimeout(() => {
              const newPos = input.selectionStart ?? 0;
              if (slots[newPos]?.type === "literal") {
                const next = findNextInputSlot(slots, newPos + 1);
                if (next !== null) {
                  setCursorPosition(next);
                }
              }
            }, 0);
            break;
          }

          case "Home": {
            e.preventDefault();
            const firstInput = findNextInputSlot(slots, 0);
            if (firstInput !== null) {
              setCursorPosition(firstInput);
            }
            break;
          }

          case "End": {
            e.preventDefault();
            const formatted = formatValue(rawValue, slots, slotChar);
            const firstEmptySlotIndex = formatted.indexOf(slotChar);
            if (firstEmptySlotIndex !== -1) {
              setCursorPosition(firstEmptySlotIndex);
            } else {
              setCursorPosition(slots.length);
            }
            break;
          }

          default: {
            if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
              let slotIndex = cursorPos;
              if (slots[slotIndex]?.type === "literal") {
                const next = findNextInputSlot(slots, slotIndex);
                if (next !== null) {
                  slotIndex = next;
                }
              }

              const slot = slots[slotIndex];
              if (slot && !isValidForSlot(e.key, slot.type)) {
                e.preventDefault();
              }
            }
            break;
          }
        }

        onKeyDownProp?.(e);
      },
      [
        disabled,
        readOnly,
        rawValue,
        slots,
        slotChar,
        inputSlots,
        updateValue,
        setCursorPosition,
        onKeyDownProp,
      ]
    );

    // Handle focus
    const handleFocus = React.useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);

        // Position cursor at first empty slot or end
        const formatted = formatValue(rawValue, slots, slotChar);
        const firstEmptyIndex = formatted.indexOf(slotChar);
        if (firstEmptyIndex !== -1) {
          setCursorPosition(firstEmptyIndex);
        } else {
          setCursorPosition(formatted.length);
        }

        onFocusProp?.(e);
      },
      [rawValue, slots, slotChar, setCursorPosition, onFocusProp]
    );

    // Handle blur
    const handleBlur = React.useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);

        // Auto-clear incomplete values if enabled
        if (autoClear && !isComplete(rawValue, slots)) {
          updateValue("");
        }

        onBlurProp?.(e);
      },
      [autoClear, rawValue, slots, updateValue, onBlurProp]
    );

    // Handle paste
    const handlePaste = React.useCallback(
      (e: React.ClipboardEvent<HTMLInputElement>) => {
        if (disabled || readOnly) return;

        e.preventDefault();

        const pastedText = e.clipboardData.getData("text");
        const cursorPos = e.currentTarget.selectionStart ?? 0;

        // Find raw index at cursor position
        let rawIndex = 0;
        for (let i = 0; i < cursorPos; i++) {
          if (slots[i].type !== "literal") {
            rawIndex++;
          }
        }

        // Filter pasted text to only valid characters for remaining slots
        let validChars = "";
        let slotIdx = rawIndex;

        for (const char of pastedText) {
          if (slotIdx >= inputSlots.length) break;

          const slot = inputSlots[slotIdx];
          if (isValidForSlot(char, slot.type)) {
            validChars += char;
            slotIdx++;
          }
        }

        // Insert valid characters
        const newRaw =
          rawValue.slice(0, rawIndex) + validChars + rawValue.slice(rawIndex);
        updateValue(newRaw.slice(0, inputSlots.length));

        // Position cursor after pasted content
        const newRawLength = Math.min(
          rawIndex + validChars.length,
          inputSlots.length
        );
        let newCursorPos = 0;
        let rawCount = 0;
        for (let i = 0; i < slots.length; i++) {
          if (slots[i].type !== "literal") {
            rawCount++;
            if (rawCount > newRawLength) {
              newCursorPos = i;
              break;
            }
          }
          newCursorPos = i + 1;
        }
        setCursorPosition(newCursorPos);
      },
      [
        disabled,
        readOnly,
        slots,
        inputSlots,
        rawValue,
        updateValue,
        setCursorPosition,
      ]
    );

    // Float label height/padding overrides
    const floatLabelClasses = floatLabel
      ? inputSize === "sm"
        ? "!h-12 !pt-5 !pb-1"
        : inputSize === "lg"
        ? "!h-16 !pt-6 !pb-2"
        : "!h-14 !pt-5 !pb-2"
      : "";

    return (
      <WexInput
        {...props}
        ref={mergedRef}
        type="text"
        inputMode="text"
        autoComplete="off"
        value={displayValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onPaste={handlePaste}
        disabled={disabled}
        readOnly={readOnly}
        variant={variant}
        inputSize={inputSize}
        invalid={invalid}
        aria-invalid={invalid || undefined}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        // For float label mode: don't show native placeholder
        // For normal mode: show mask placeholder as native placeholder
        placeholder={
          floatLabel ? placeholder : (placeholder ?? formatValue("", slots, slotChar))
        }
        className={"wex-input-mask " + cn(floatLabelClasses, className)}
      />
    );
  }
);

WexInputMask.displayName = "WexInputMask";

export { WexInputMask };

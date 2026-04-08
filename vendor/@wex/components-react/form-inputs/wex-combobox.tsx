import * as React from "react";
import {
  Combobox as ComboboxRoot,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import { cn } from "../lib/utils";

export interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxProps {
  options?: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  searchPlaceholder?: string;
}

/**
 * WexCombobox - WEX Design System Combobox Component
 *
 * Autocomplete input combining Command search with Popover dropdown.
 * Allows users to search and select from a list of options.
 *
 * @example
 * const options = [
 *   { value: "apple", label: "Apple" },
 *   { value: "banana", label: "Banana" },
 * ];
 *
 * <WexCombobox
 *   options={options}
 *   value={value}
 *   onValueChange={setValue}
 *   placeholder="Select a fruit..."
 * />
 */

export const WexCombobox = ({
  className,
  options = [],
  value,
  onValueChange,
  placeholder = "Select option...",
  disabled = false,
  ...props
}: ComboboxProps) => {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const anchorRef = useComboboxAnchor();

  // Filter options based on input value
  // When inputValue is empty, show all options (unless there's a selected value and dropdown is closed)
  const filteredOptions = React.useMemo(() => {
    if (!inputValue.trim()) {
      // Show all options when no search input
      return options;
    }
    const searchLower = inputValue.toLowerCase();
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchLower)
    );
  }, [options, inputValue]);

  // Find selected option label
  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = selectedOption?.label || "";

  // Reset input when value is selected
  React.useEffect(() => {
    if (value && !open) {
      setInputValue("");
    }
  }, [value, open]);

  // Clear display value when value is cleared
  React.useEffect(() => {
    if (!value) {
      setInputValue("");
    }
  }, [value]);

  // Add aria-label to combobox trigger button for accessibility
  const comboboxRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (comboboxRef.current) {
      // Find the button that wraps the trigger (has data-slot="input-group-button")
      const triggerButton = comboboxRef.current.querySelector('[data-slot="input-group-button"]') as HTMLElement;
      if (triggerButton && !triggerButton.getAttribute('aria-label')) {
        triggerButton.setAttribute('aria-label', 'Open combobox options');
      }
      // Also set aria-hidden on the chevron icon
      const triggerIcon = comboboxRef.current.querySelector('[data-slot="combobox-trigger-icon"]') as HTMLElement;
      if (triggerIcon) {
        triggerIcon.setAttribute('aria-hidden', 'true');
      }
    }
  }, [open, disabled, value]); // Re-run when open/disabled/value changes to catch re-renders

  return (
    <div ref={comboboxRef} className={cn("wex-combobox inline-block w-[280px]", className)}>
      <ComboboxRoot
        value={value || null}
        inputValue={inputValue}
        onInputValueChange={setInputValue}
        onValueChange={(newValue) => {
          if (newValue !== null && newValue !== undefined) {
            onValueChange?.(newValue);
            setInputValue("");
          } else {
            // User cleared the value
            onValueChange?.("");
            setInputValue("");
          }
        }}
        open={open}
        onOpenChange={setOpen}
        {...props}
      >
        <div ref={anchorRef} className="w-full">
          <ComboboxInput
            placeholder={placeholder}
            disabled={disabled}
            showTrigger
          >
            {!inputValue && value && displayValue && !disabled ? (
              <ComboboxValue>{displayValue}</ComboboxValue>
            ) : null}
          </ComboboxInput>
        </div>
        <ComboboxContent 
          anchor={anchorRef}
          className="!w-[var(--anchor-width)] !min-w-[var(--anchor-width)] !max-w-[var(--anchor-width)]"
        >
          <ComboboxList>
            {filteredOptions.length === 0 && inputValue.trim() ? (
              <div className="py-1.5 px-2 text-sm text-wex-combobox-empty-fg">
                No results found.
              </div>
            ) : (
              filteredOptions.map((option) => (
                <ComboboxItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => {
                    onValueChange?.(option.value);
                    setInputValue("");
                    setOpen(false);
                  }}
                >
                  {option.label}
                </ComboboxItem>
              ))
            )}
          </ComboboxList>
        </ComboboxContent>
      </ComboboxRoot>
    </div>
  );
};
WexCombobox.displayName = "WexCombobox";

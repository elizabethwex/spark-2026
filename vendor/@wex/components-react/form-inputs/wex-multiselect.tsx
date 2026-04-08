"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import { Check, ChevronDown, Search, X } from "lucide-react"
import { cn } from "../lib/utils"
import {
  WexPopover,
  WexPopoverContent,
  WexPopoverTrigger,
} from "../overlays/wex-popover"
import { WexInput } from "./wex-input"

/**
 * WexMultiSelect - WEX Design System MultiSelect Component
 *
 * A dropdown component for selecting multiple options with various display modes.
 * Built on top of Popover for consistent dropdown behavior and accessibility.
 *
 * Display modes:
 * - comma: Shows selected items as "Item1, Item2, Item3"
 * - chips: Shows selected items as removable chip badges
 * - count: Shows "X items selected"
 *
 * @example
 * // Basic usage
 * <WexMultiSelect
 *   options={cities}
 *   value={selected}
 *   onValueChange={setSelected}
 *   placeholder="Select cities..."
 * />
 *
 * @example
 * // Chips mode with filter
 * <WexMultiSelect
 *   options={cities}
 *   value={selected}
 *   onValueChange={setSelected}
 *   display="chips"
 *   filter
 * />
 */

// ============================================================================
// Types
// ============================================================================

export interface MultiSelectOption {
  label: string
  value: string
  disabled?: boolean
  group?: string
}

export interface WexMultiSelectProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "id"> {
  /** ID for the trigger element (for label association) */
  id?: string
  /** Array of options */
  options: MultiSelectOption[]
  /** Currently selected values */
  value?: string[]
  /** Callback when selection changes */
  onValueChange?: (value: string[]) => void
  /** Display mode for selected items: comma (labels) or chips (badges) */
  display?: "comma" | "chips"
  /** Placeholder text when nothing selected */
  placeholder?: string
  /** Max labels/chips to show before switching to "X items selected" */
  maxSelectedLabels?: number
  /** Show filter input */
  filter?: boolean
  /** Filter input placeholder */
  filterPlaceholder?: string
  /** Show select all checkbox */
  showSelectAll?: boolean
  /** Label for select all checkbox */
  selectAllLabel?: string
  /** Size variant */
  size?: "sm" | "md" | "lg"
  /** Visual variant */
  variant?: "default" | "filled"
  /** Disabled state */
  disabled?: boolean
  /** Invalid state */
  invalid?: boolean
  /** Adjusts styling for WexFloatLabel wrapper */
  floatLabel?: boolean
  /** Accessible label */
  "aria-label"?: string
  /** ID of element that labels this component */
  "aria-labelledby"?: string
  /** Empty state text when filter returns no results */
  emptyText?: string
  /** Callback when trigger receives focus */
  onFocus?: (e: React.FocusEvent) => void
  /** Callback when trigger loses focus */
  onBlur?: (e: React.FocusEvent) => void
  /** Callback when dropdown open state changes (for float label integration) */
  onOpenChange?: (open: boolean) => void
}

// ============================================================================
// Styles
// ============================================================================

const multiSelectTriggerVariants = cva(
  [
    // Layout
    "flex w-full items-center justify-between gap-2 rounded-md px-3 text-sm shadow-sm transition-colors cursor-pointer",
    // Layer 3 tokens - text
    "text-wex-input-fg",
    // Focus ring
    "focus-visible:outline-none focus-visible:ring-1",
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
      size: {
        sm: "min-h-8 py-1 text-xs",
        md: "min-h-11 py-2",
        lg: "min-h-12 py-2.5 text-base",
      },
      invalid: {
        true: [
          "border-wex-input-invalid-border",
          "focus-visible:border-wex-input-invalid-border",
          "focus-visible:ring-wex-input-invalid-focus-ring",
        ].join(" "),
        false: "",
      },
      disabled: {
        true: [
          "cursor-not-allowed",
          "bg-wex-input-disabled-bg",
          "text-wex-input-disabled-fg",
          "border-wex-input-disabled-border",
          "opacity-[var(--wex-component-input-disabled-opacity)]",
        ].join(" "),
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      invalid: false,
      disabled: false,
    },
  }
)

const multiSelectOptionVariants = cva(
  "relative flex cursor-pointer select-none items-center gap-2 px-3 py-2 text-sm transition-colors rounded-sm",
  {
    variants: {
      selected: {
        true: "bg-wex-multiselect-item-selected-bg/15 text-wex-multiselect-item-fg",
        false: "",
      },
      disabled: {
        true: "pointer-events-none opacity-50 cursor-not-allowed",
        false: "",
      },
      focused: {
        true: "ring-2 ring-wex-multiselect-focus-ring ring-inset",
        false: "",
      },
    },
    compoundVariants: [
      // Unselected + not focused: hover shows accent
      {
        selected: false,
        disabled: false,
        focused: false,
        className: "hover:bg-wex-multiselect-item-hover-bg/50",
      },
      // Unselected + focused: show accent with outline
      {
        selected: false,
        disabled: false,
        focused: true,
        className: "bg-wex-multiselect-item-focus-bg/50",
      },
      // Selected + not focused: hover shows stronger primary
      {
        selected: true,
        disabled: false,
        focused: false,
        className: "hover:bg-wex-multiselect-item-selected-hover-bg/25",
      },
      // Selected + focused: show stronger primary with outline
      {
        selected: true,
        disabled: false,
        focused: true,
        className: "bg-wex-multiselect-item-selected-bg/25",
      },
    ],
    defaultVariants: {
      selected: false,
      disabled: false,
      focused: false,
    },
  }
)

// ============================================================================
// Component
// ============================================================================

const WexMultiSelect = React.forwardRef<HTMLDivElement, WexMultiSelectProps>(
  (
    {
      className,
      id,
      options = [],
      value = [],
      onValueChange,
      display = "comma",
      placeholder = "Select...",
      maxSelectedLabels = 3,
      filter = false,
      filterPlaceholder = "Search...",
      showSelectAll = false,
      selectAllLabel = "Select All",
      size = "md",
      variant = "default",
      disabled = false,
      invalid = false,
      floatLabel = false,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      emptyText = "No options found",
      onFocus,
      onBlur,
      onOpenChange,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false)
    
    // Handle open state changes
    const handleOpenChange = (newOpen: boolean) => {
      setOpen(newOpen)
      onOpenChange?.(newOpen)
    }
    const [filterValue, setFilterValue] = React.useState("")
    const [focusedIndex, setFocusedIndex] = React.useState(-1)
    const [isKeyboardFocus, setIsKeyboardFocus] = React.useState(false)
    const triggerRef = React.useRef<HTMLButtonElement>(null)
    const listRef = React.useRef<HTMLUListElement>(null)
    const optionRefs = React.useRef<Map<number, HTMLLIElement>>(new Map())

    // Filter options based on search input
    const filteredOptions = React.useMemo(() => {
      if (!filterValue) return options
      return options.filter((option) =>
        option.label.toLowerCase().includes(filterValue.toLowerCase())
      )
    }, [options, filterValue])

    // Group options if any have group property
    const groupedOptions = React.useMemo(() => {
      const groups: Record<string, MultiSelectOption[]> = {}
      const ungrouped: MultiSelectOption[] = []

      filteredOptions.forEach((option) => {
        if (option.group) {
          if (!groups[option.group]) {
            groups[option.group] = []
          }
          groups[option.group].push(option)
        } else {
          ungrouped.push(option)
        }
      })

      return { groups, ungrouped }
    }, [filteredOptions])

    const hasGroups = Object.keys(groupedOptions.groups).length > 0

    // Get all selectable option values
    const selectableValues = React.useMemo(
      () => filteredOptions.filter((o) => !o.disabled).map((o) => o.value),
      [filteredOptions]
    )

    // Calculate select all state
    const selectedCount = selectableValues.filter((v) => value.includes(v)).length
    const allSelected = selectedCount === selectableValues.length && selectableValues.length > 0
    const someSelected = selectedCount > 0 && selectedCount < selectableValues.length

    // Check if a value is selected
    const isSelected = React.useCallback(
      (optionValue: string) => value.includes(optionValue),
      [value]
    )

    // Handle option toggle
    const handleToggle = React.useCallback(
      (optionValue: string, optionDisabled?: boolean) => {
        if (disabled || optionDisabled) return

        const newValue = value.includes(optionValue)
          ? value.filter((v) => v !== optionValue)
          : [...value, optionValue]

        onValueChange?.(newValue)
      },
      [disabled, value, onValueChange]
    )

    // Handle select all toggle
    const handleSelectAll = React.useCallback(() => {
      if (disabled) return

      if (allSelected) {
        // Deselect all selectable options
        const remainingValues = value.filter((v) => !selectableValues.includes(v))
        onValueChange?.(remainingValues)
      } else {
        // Select all selectable options
        const newValues = Array.from(new Set([...value, ...selectableValues]))
        onValueChange?.(newValues)
      }
    }, [disabled, allSelected, value, selectableValues, onValueChange])

    // Handle chip remove
    const handleRemoveChip = React.useCallback(
      (e: React.MouseEvent, optionValue: string) => {
        e.stopPropagation()
        if (disabled) return
        onValueChange?.(value.filter((v) => v !== optionValue))
      },
      [disabled, value, onValueChange]
    )

    // Get enabled option indices for keyboard navigation
    const enabledIndices = React.useMemo(() => {
      return filteredOptions
        .map((option, index) => ({ index, disabled: option.disabled }))
        .filter((item) => !item.disabled)
        .map((item) => item.index)
    }, [filteredOptions])

    // Keyboard navigation
    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent) => {
        if (disabled) return

        const currentEnabledIndex = enabledIndices.indexOf(focusedIndex)

        switch (e.key) {
          case "ArrowDown":
            e.preventDefault()
            setIsKeyboardFocus(true)
            if (!open) {
              setOpen(true)
            } else if (currentEnabledIndex < enabledIndices.length - 1) {
              setFocusedIndex(enabledIndices[currentEnabledIndex + 1])
            } else if (focusedIndex === -1 && enabledIndices.length > 0) {
              setFocusedIndex(enabledIndices[0])
            }
            break

          case "ArrowUp":
            e.preventDefault()
            setIsKeyboardFocus(true)
            if (currentEnabledIndex > 0) {
              setFocusedIndex(enabledIndices[currentEnabledIndex - 1])
            }
            break

          case "Home":
            e.preventDefault()
            setIsKeyboardFocus(true)
            if (enabledIndices.length > 0) {
              setFocusedIndex(enabledIndices[0])
            }
            break

          case "End":
            e.preventDefault()
            setIsKeyboardFocus(true)
            if (enabledIndices.length > 0) {
              setFocusedIndex(enabledIndices[enabledIndices.length - 1])
            }
            break

          case "Enter":
          case " ":
            if (!open) {
              e.preventDefault()
              setOpen(true)
            } else if (focusedIndex >= 0) {
              e.preventDefault()
              const option = filteredOptions[focusedIndex]
              if (option && !option.disabled) {
                handleToggle(option.value, option.disabled)
              }
            }
            break

          case "Escape":
            e.preventDefault()
            setOpen(false)
            triggerRef.current?.focus()
            break

          case "Tab":
            if (open) {
              setOpen(false)
            }
            break
        }
      },
      [disabled, open, focusedIndex, enabledIndices, filteredOptions, handleToggle]
    )

    // Reset focus when dropdown opens
    React.useEffect(() => {
      if (open) {
        setFocusedIndex(-1)
        setFilterValue("")
        setIsKeyboardFocus(false)
      }
    }, [open])

    // Scroll focused option into view
    React.useEffect(() => {
      if (focusedIndex >= 0) {
        const optionEl = optionRefs.current.get(focusedIndex)
        optionEl?.scrollIntoView({ block: "nearest" })
      }
    }, [focusedIndex])

    // Get display text based on mode
    const getDisplayContent = () => {
      // When nothing is selected
      if (value.length === 0) {
        // For float label mode, don't show placeholder (label handles it)
        if (floatLabel) {
          return <span className="opacity-0">&nbsp;</span>
        }
        return (
          <span className="text-wex-multiselect-placeholder-fg truncate">{placeholder}</span>
        )
      }

      const selectedOptions = options.filter((o) => value.includes(o.value))

      // When exceeding maxSelectedLabels, show "X items selected" regardless of display mode
      if (value.length > maxSelectedLabels) {
        return (
          <span className="truncate">
            {value.length} item{value.length !== 1 ? "s" : ""} selected
          </span>
        )
      }

      switch (display) {
        case "chips": {
          // Adjust chip styling for float label mode: smaller chips, moved down slightly
          const chipClasses = floatLabel
            ? "inline-flex items-center gap-1 bg-wex-multiselect-tag-bg text-wex-multiselect-tag-fg text-xs px-2 py-0 rounded-full shrink-0"
            : "inline-flex items-center gap-1 bg-wex-multiselect-tag-bg text-wex-multiselect-tag-fg text-xs px-2 py-0.5 rounded-full shrink-0"
          
          const chipContainerClasses = floatLabel
            ? "flex flex-wrap gap-1 flex-1 min-w-0 overflow-hidden mt-0.5"
            : "flex flex-wrap gap-1 flex-1 min-w-0 overflow-hidden"
          
          const removeButtonClasses = floatLabel
            ? "inline-flex items-center justify-center rounded-full hover:bg-wex-multiselect-tag-remove-hover-bg/20 -mr-1 cursor-pointer min-h-6 min-w-6" /* Changed from min-h-5 to min-h-6 for WCAG 2.2 AA (24px minimum) */
            : "inline-flex items-center justify-center rounded-full hover:bg-wex-multiselect-tag-remove-hover-bg/20 -mr-1 cursor-pointer min-h-6 min-w-6"
          
          return (
            <div className={chipContainerClasses}>
              {selectedOptions.map((option) => (
                <span
                  key={option.value}
                  className={chipClasses}
                >
                  <span className="truncate max-w-[80px]">{option.label}</span>
                  <span
                    role="button"
                    tabIndex={disabled ? -1 : 0}
                    className={removeButtonClasses}
                    onClick={(e) => handleRemoveChip(e, option.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        handleRemoveChip(e as unknown as React.MouseEvent, option.value)
                      }
                    }}
                    aria-label={`Remove ${option.label}`}
                    aria-disabled={disabled}
                  >
                    <X className={floatLabel ? "h-2.5 w-2.5" : "h-3 w-3"} />
                  </span>
                </span>
              ))}
            </div>
          )
        }

        case "comma":
        default: {
          const labels = selectedOptions.map((o) => o.label)
          return <span className="truncate block">{labels.join(", ")}</span>
        }
      }
    }

    // Float label height/padding overrides
    // Include relative positioning and extra right padding for absolutely positioned chevron
    // When using chips, adjust padding to move label up slightly
    const floatLabelClasses = floatLabel
      ? display === "chips"
        ? size === "sm"
          ? "relative !min-h-12 !pt-[18px] !pb-1 !pr-10"
          : size === "lg"
          ? "relative !min-h-16 !pt-[22px] !pb-2 !pr-10"
          : "relative !min-h-14 !pt-[18px] !pb-2 !pr-10"
        : size === "sm"
        ? "relative !min-h-12 !pt-5 !pb-1 !pr-10"
        : size === "lg"
        ? "relative !min-h-16 !pt-6 !pb-2 !pr-10"
        : "relative !min-h-14 !pt-5 !pb-2 !pr-10"
      : ""

    // Check if there's a value for float label detection
    const hasValue = value.length > 0

    return (
      <WexPopover open={open} onOpenChange={handleOpenChange}>
        <WexPopoverTrigger asChild>
          <button
            ref={triggerRef}
            id={id}
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-invalid={invalid || undefined}
            aria-disabled={disabled || undefined}
            disabled={disabled}
            className={"wex-multiselect " + cn(
              multiSelectTriggerVariants({ variant, size, invalid, disabled }),
              floatLabelClasses,
              className
            )}
            onKeyDown={handleKeyDown}
            onFocus={onFocus}
            onBlur={onBlur}
            data-has-value={hasValue || undefined}
          >
            <div className={cn(
              "flex-1 min-w-0 text-left",
              floatLabel && "self-end"
            )}>
              {getDisplayContent()}
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 opacity-50 transition-transform",
                open && "rotate-180",
                // In float label mode, position chevron absolutely centered
                floatLabel && "absolute right-3 top-1/2 -translate-y-1/2"
              )}
            />
          </button>
        </WexPopoverTrigger>

        <WexPopoverContent
          ref={ref}
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
          onKeyDown={handleKeyDown}
          {...props}
        >
          {/* Filter input */}
          {filter && (
            <div className="p-2 border-b">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-wex-multiselect-search-icon-fg" />
                <WexInput
                  type="text"
                  placeholder={filterPlaceholder}
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  className="h-8 pl-8"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Select All */}
          {showSelectAll && filteredOptions.length > 0 && (
            <div
              className={cn(
                "flex items-center gap-2 px-3 py-2 border-b cursor-pointer hover:bg-wex-multiselect-item-hover-bg/50 transition-colors",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              onClick={handleSelectAll}
              role="checkbox"
              aria-checked={allSelected ? true : someSelected ? "mixed" : false}
              aria-disabled={disabled}
            >
              <div
                className={cn(
                  "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-wex-multiselect-checkbox-checked-bg transition-colors",
                  (allSelected || someSelected) ? "bg-wex-multiselect-checkbox-checked-bg text-wex-multiselect-checkbox-checked-fg" : "bg-wex-multiselect-checkbox-bg"
                )}
              >
                {allSelected && <Check className="h-3 w-3" />}
                {someSelected && !allSelected && (
                  <div className="h-0.5 w-2.5 bg-current" />
                )}
              </div>
              <span className="text-sm font-medium">{selectAllLabel}</span>
              {selectableValues.length > 0 && (
                <span className="text-xs text-wex-multiselect-count-fg ml-auto">
                  ({selectedCount}/{selectableValues.length})
                </span>
              )}
            </div>
          )}

          {/* Options list */}
          <ul
            ref={listRef}
            role="listbox"
            aria-multiselectable="true"
            aria-label={ariaLabel}
            className="max-h-60 overflow-auto p-1"
          >
            {filteredOptions.length === 0 ? (
              <li className="px-3 py-2 text-center text-sm text-wex-multiselect-empty-fg">
                {emptyText}
              </li>
            ) : hasGroups ? (
              <>
                {groupedOptions.ungrouped.map((option, index) => (
                  <MultiSelectOption
                    key={option.value}
                    option={option}
                    index={index}
                    isSelected={isSelected(option.value)}
                    isFocused={focusedIndex === index}
                    isKeyboardFocus={isKeyboardFocus}
                    onToggle={handleToggle}
                    onMouseFocus={() => {
                      setFocusedIndex(index)
                      setIsKeyboardFocus(false)
                    }}
                    optionRefs={optionRefs}
                  />
                ))}
                {Object.entries(groupedOptions.groups).map(([groupName, groupOptions]) => {
                  const startIndex = groupedOptions.ungrouped.length +
                    Object.entries(groupedOptions.groups)
                      .slice(0, Object.keys(groupedOptions.groups).indexOf(groupName))
                      .reduce((acc, [, opts]) => acc + opts.length, 0)

                  return (
                    <li key={groupName} role="presentation">
                      <div className="px-3 py-1.5 text-xs font-semibold text-wex-multiselect-group-heading-fg">
                        {groupName}
                      </div>
                      <ul role="group" aria-label={groupName}>
                        {groupOptions.map((option, groupIndex) => {
                          const absoluteIndex = startIndex + groupIndex
                          return (
                            <MultiSelectOption
                              key={option.value}
                              option={option}
                              index={absoluteIndex}
                              isSelected={isSelected(option.value)}
                              isFocused={focusedIndex === absoluteIndex}
                              isKeyboardFocus={isKeyboardFocus}
                              onToggle={handleToggle}
                              onMouseFocus={() => {
                                setFocusedIndex(absoluteIndex)
                                setIsKeyboardFocus(false)
                              }}
                              optionRefs={optionRefs}
                            />
                          )
                        })}
                      </ul>
                    </li>
                  )
                })}
              </>
            ) : (
              filteredOptions.map((option, index) => (
                <MultiSelectOption
                  key={option.value}
                  option={option}
                  index={index}
                  isSelected={isSelected(option.value)}
                  isFocused={focusedIndex === index}
                  isKeyboardFocus={isKeyboardFocus}
                  onToggle={handleToggle}
                  onMouseFocus={() => {
                    setFocusedIndex(index)
                    setIsKeyboardFocus(false)
                  }}
                  optionRefs={optionRefs}
                />
              ))
            )}
          </ul>
        </WexPopoverContent>
      </WexPopover>
    )
  }
)

WexMultiSelect.displayName = "WexMultiSelect"

// ============================================================================
// Option subcomponent
// ============================================================================

interface MultiSelectOptionProps {
  option: MultiSelectOption
  index: number
  isSelected: boolean
  isFocused: boolean
  isKeyboardFocus: boolean
  onToggle: (value: string, disabled?: boolean) => void
  onMouseFocus: () => void
  optionRefs: React.MutableRefObject<Map<number, HTMLLIElement>>
}

function MultiSelectOption({
  option,
  index,
  isSelected,
  isFocused,
  isKeyboardFocus,
  onToggle,
  onMouseFocus,
  optionRefs,
}: MultiSelectOptionProps) {
  const ref = React.useCallback(
    (node: HTMLLIElement | null) => {
      if (node) {
        optionRefs.current.set(index, node)
      } else {
        optionRefs.current.delete(index)
      }
    },
    [index, optionRefs]
  )

  // Only show ring outline for keyboard focus, not mouse hover
  const showRing = isFocused && isKeyboardFocus

  return (
    <li
      ref={ref}
      role="option"
      aria-selected={isSelected}
      aria-disabled={option.disabled}
      data-index={index}
      className={cn(
        multiSelectOptionVariants({
          selected: isSelected,
          disabled: option.disabled,
          focused: showRing,
        }),
        // For mouse hover without keyboard focus, show background but no ring
        isFocused && !isKeyboardFocus && !isSelected && "bg-wex-multiselect-item-focus-bg/50",
        isFocused && !isKeyboardFocus && isSelected && "bg-wex-multiselect-item-selected-bg/25"
      )}
      onClick={() => onToggle(option.value, option.disabled)}
      onMouseEnter={onMouseFocus}
    >
      <div
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-wex-multiselect-checkbox-checked-bg transition-colors",
          isSelected ? "bg-wex-multiselect-checkbox-checked-bg text-wex-multiselect-checkbox-checked-fg" : "bg-wex-multiselect-checkbox-bg"
        )}
      >
        {isSelected && <Check className="h-3 w-3" />}
      </div>
      <span className="flex-1">{option.label}</span>
    </li>
  )
}

export { WexMultiSelect, multiSelectTriggerVariants, multiSelectOptionVariants }
export type { MultiSelectOption }


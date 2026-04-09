/**
 * WexListbox - WEX Design System Listbox Component
 *
 * A list selection component with full accessibility support.
 * This is a custom component that exists only in wex-components-react.
 *
 * Features:
 * - Single and multiple selection modes
 * - Optional checkmarks or checkboxes
 * - Filtering support
 * - Grouped options
 * - Full keyboard navigation (Arrow keys, Home, End, Enter, Space, type-ahead)
 * - Roving tabindex for proper focus management
 * - ARIA compliant
 *
 * @example
 * // Basic single selection
 * <WexListbox
 *   options={cities}
 *   value={selected}
 *   onValueChange={setSelected}
 *   aria-label="Select a city"
 * >
 *   <WexListbox.Options />
 * </WexListbox>
 *
 * @example
 * // Multiple selection with checkboxes
 * <WexListbox
 *   options={cities}
 *   value={selectedCities}
 *   onValueChange={setSelectedCities}
 *   multiple
 *   checkbox
 *   aria-label="Select cities"
 * >
 *   <WexListbox.Options />
 * </WexListbox>
 *
 * @example
 * // With filter
 * <WexListbox
 *   options={cities}
 *   value={selected}
 *   onValueChange={setSelected}
 *   aria-label="Select a city"
 * >
 *   <WexListbox.Header>
 *     <WexListbox.Filter placeholder="Search city..." />
 *   </WexListbox.Header>
 *   <WexListbox.Options />
 *   <WexListbox.Empty>No cities found</WexListbox.Empty>
 * </WexListbox>
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Check, Search } from "lucide-react"
import { cn } from "../lib/utils"

// ============================================================================
// Base Input Component (from shadcn - copied for self-containment)
// ============================================================================

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-wex-listbox-border bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-wex-listbox-fg placeholder:text-wex-listbox-empty-fg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-wex-listbox-focus-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

// ============================================================================
// TYPES
// ============================================================================

export interface ListboxOptionData {
  label: string
  value: string
  disabled?: boolean
  group?: string
}

interface ListboxContextValue {
  // Data
  options: ListboxOptionData[]
  value: string | string[] | null
  // Config
  multiple: boolean
  checkmark: boolean
  checkbox: boolean
  disabled: boolean
  // Accessibility
  ariaLabel?: string
  ariaLabelledBy?: string
  // State
  focusedIndex: number
  hasFocus: boolean
  isKeyboardNav: boolean
  filterValue: string
  filteredOptions: ListboxOptionData[]
  // For manual options
  totalOptions: number
  firstEnabledIndex: number
  // Actions
  onValueChange: (value: string | string[] | null) => void
  setFocusedIndex: (index: number) => void
  setIsKeyboardNav: (isKeyboard: boolean) => void
  setFilterValue: (value: string) => void
  handleSelect: (optionValue: string, optionDisabled?: boolean) => void
  handleKeyDown: (e: React.KeyboardEvent) => void
  isSelected: (optionValue: string) => boolean
  registerOption: (disabled?: boolean) => number
  focusOption: (index: number, fromKeyboard?: boolean) => void
  // Refs
  listRef: React.RefObject<HTMLUListElement | null>
  optionRefs: React.MutableRefObject<Map<number, HTMLLIElement>>
}

const ListboxContext = React.createContext<ListboxContextValue | null>(null)

function useListboxContext() {
  const context = React.useContext(ListboxContext)
  if (!context) {
    throw new Error("Listbox components must be used within a <WexListbox>")
  }
  return context
}

// ============================================================================
// STYLES
// ============================================================================

export const listboxVariants = cva(
  "w-full rounded-md border bg-wex-listbox-bg text-sm shadow-sm transition-colors",
  {
    variants: {
      invalid: {
        true: "border-wex-listbox-invalid-border",
        false: "border-wex-listbox-border",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed",
        false: "",
      },
    },
    defaultVariants: {
      invalid: false,
      disabled: false,
    },
  }
)

export const listboxOptionVariants = cva(
  "relative flex cursor-pointer select-none items-center gap-2 px-3 py-2 text-sm outline-none transition-colors",
  {
    variants: {
      selected: {
        true: "bg-wex-listbox-item-selected-bg/15 text-wex-listbox-item-fg",
        false: "",
      },
      disabled: {
        true: "pointer-events-none opacity-50 cursor-not-allowed",
        false: "",
      },
      keyboardFocused: {
        true: "ring-2 ring-wex-listbox-focus-ring ring-inset",
        false: "",
      },
    },
    compoundVariants: [
      // Non-selected, non-disabled: show hover effect
      {
        selected: false,
        disabled: false,
        className: "hover:bg-wex-listbox-item-hover-bg/50",
      },
      // Selected, non-disabled: show slightly darker hover
      {
        selected: true,
        disabled: false,
        className: "hover:bg-wex-listbox-item-selected-hover-bg/25",
      },
    ],
    defaultVariants: {
      selected: false,
      disabled: false,
      keyboardFocused: false,
    },
  }
)

// ============================================================================
// LISTBOX ROOT
// ============================================================================

export interface ListboxRootProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof listboxVariants> {
  /** Array of options (for auto-generated options) */
  options?: ListboxOptionData[]
  /** Currently selected value(s) */
  value?: string | string[] | null
  /** Callback when selection changes */
  onValueChange?: (value: string | string[] | null) => void
  /** Enable multiple selection */
  multiple?: boolean
  /** Show checkmark next to selected items */
  checkmark?: boolean
  /** Show checkbox for multiple selection */
  checkbox?: boolean
  /** Accessible label */
  "aria-label"?: string
  /** ID of element that labels this listbox */
  "aria-labelledby"?: string
}

function ListboxRoot({
  className,
  children,
  options = [],
  value = null,
  onValueChange = () => {},
  multiple = false,
  checkmark = false,
  checkbox = false,
  invalid = false,
  disabled = false,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: ListboxRootProps) {
  const listRef = React.useRef<HTMLUListElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const optionRefs = React.useRef<Map<number, HTMLLIElement>>(new Map())
  const [focusedIndex, setFocusedIndex] = React.useState<number>(-1)
  const [hasFocus, setHasFocus] = React.useState(false)
  const [isKeyboardNav, setIsKeyboardNav] = React.useState(false)
  const [filterValue, setFilterValue] = React.useState("")
  const [typeaheadBuffer, setTypeaheadBuffer] = React.useState("")
  const typeaheadTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  
  // Counter and tracking for manual option registration
  const optionCounterRef = React.useRef(0)
  const firstEnabledIndexRef = React.useRef<number>(-1)

  // Filter options based on search input
  const filteredOptions = React.useMemo(() => {
    if (!filterValue) return options
    return options.filter((option) =>
      option.label.toLowerCase().includes(filterValue.toLowerCase())
    )
  }, [options, filterValue])

  // Total options count (from data or manual registration)
  const totalOptions = filteredOptions.length > 0 ? filteredOptions.length : optionCounterRef.current

  // First enabled index for data-driven options
  const firstEnabledDataIndex = React.useMemo(() => {
    return filteredOptions.findIndex((option) => !option.disabled)
  }, [filteredOptions])

  // First enabled index (data-driven or manual)
  const firstEnabledIndex = filteredOptions.length > 0 
    ? firstEnabledDataIndex 
    : firstEnabledIndexRef.current

  // Register a manual option and return its index
  const registerOption = React.useCallback((optionDisabled?: boolean) => {
    const index = optionCounterRef.current
    optionCounterRef.current += 1
    // Track first enabled option for manual options
    if (!optionDisabled && firstEnabledIndexRef.current === -1) {
      firstEnabledIndexRef.current = index
    }
    return index
  }, [])

  // Focus a specific option
  const focusOption = React.useCallback((index: number, fromKeyboard = false) => {
    const optionEl = optionRefs.current.get(index)
    if (optionEl) {
      optionEl.focus()
      setFocusedIndex(index)
      setIsKeyboardNav(fromKeyboard)
    }
  }, [])

  // Check if a value is selected
  const isSelected = React.useCallback(
    (optionValue: string) => {
      if (value === null || value === undefined) return false
      if (multiple && Array.isArray(value)) {
        return value.includes(optionValue)
      }
      return value === optionValue
    },
    [value, multiple]
  )

  // Handle option selection
  const handleSelect = React.useCallback(
    (optionValue: string, optionDisabled?: boolean) => {
      if (disabled || optionDisabled) return

      if (multiple) {
        const currentValue = Array.isArray(value) ? value : []
        if (currentValue.includes(optionValue)) {
          onValueChange(currentValue.filter((v) => v !== optionValue))
        } else {
          onValueChange([...currentValue, optionValue])
        }
      } else {
        onValueChange(optionValue)
      }
    },
    [disabled, multiple, value, onValueChange]
  )

  // Get flat list of enabled option indices for keyboard navigation
  const enabledIndices = React.useMemo(() => {
    if (filteredOptions.length > 0) {
      return filteredOptions
        .map((option, index) => ({ index, disabled: option.disabled }))
        .filter((item) => !item.disabled)
        .map((item) => item.index)
    }
    // For manual options, assume all are enabled (disabled ones handle it themselves)
    return Array.from({ length: totalOptions }, (_, i) => i)
  }, [filteredOptions, totalOptions])

  // Keyboard navigation
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return

      const currentEnabledIndex = enabledIndices.indexOf(focusedIndex)

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          if (currentEnabledIndex < enabledIndices.length - 1) {
            focusOption(enabledIndices[currentEnabledIndex + 1], true)
          } else if (focusedIndex === -1 && enabledIndices.length > 0) {
            focusOption(enabledIndices[0], true)
          }
          break

        case "ArrowUp":
          e.preventDefault()
          if (currentEnabledIndex > 0) {
            focusOption(enabledIndices[currentEnabledIndex - 1], true)
          }
          break

        case "Home":
          e.preventDefault()
          if (enabledIndices.length > 0) {
            focusOption(enabledIndices[0], true)
          }
          break

        case "End":
          e.preventDefault()
          if (enabledIndices.length > 0) {
            focusOption(enabledIndices[enabledIndices.length - 1], true)
          }
          break

        case "Enter":
        case " ":
          e.preventDefault()
          if (focusedIndex >= 0) {
            const option = filteredOptions[focusedIndex]
            if (option) {
              handleSelect(option.value, option.disabled)
            } else {
              // Manual option - let the option handle it via onClick
              const optionEl = optionRefs.current.get(focusedIndex)
              if (optionEl) {
                optionEl.click()
              }
            }
          }
          break

        case "a":
        case "A":
          if (e.ctrlKey && multiple) {
            e.preventDefault()
            const allValues = filteredOptions
              .filter((o) => !o.disabled)
              .map((o) => o.value)
            onValueChange(allValues)
          }
          break

        default:
          // Type-ahead: jump to option starting with typed character
          if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            const char = e.key.toLowerCase()

            if (typeaheadTimeoutRef.current) {
              clearTimeout(typeaheadTimeoutRef.current)
            }

            const newBuffer = typeaheadBuffer + char
            setTypeaheadBuffer(newBuffer)

            const matchIndex = filteredOptions.findIndex(
              (option) =>
                !option.disabled &&
                option.label.toLowerCase().startsWith(newBuffer)
            )

            if (matchIndex >= 0) {
              focusOption(matchIndex, true)
            }

            typeaheadTimeoutRef.current = setTimeout(() => {
              setTypeaheadBuffer("")
            }, 500)
          }
      }
    },
    [
      disabled,
      enabledIndices,
      focusedIndex,
      filteredOptions,
      handleSelect,
      multiple,
      onValueChange,
      typeaheadBuffer,
      focusOption,
    ]
  )

  // Reset option counter and first enabled index when children change
  React.useEffect(() => {
    optionCounterRef.current = 0
    firstEnabledIndexRef.current = -1
  }, [children])

  // Handle focus entering/leaving the listbox container
  const handleContainerFocus = React.useCallback(() => {
    setHasFocus(true)
  }, [])

  const handleContainerBlur = React.useCallback((e: React.FocusEvent) => {
    // Only set hasFocus to false if focus is leaving the container entirely
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      setHasFocus(false)
      setIsKeyboardNav(false)
    }
  }, [])

  const contextValue: ListboxContextValue = {
    options,
    value,
    multiple,
    checkmark,
    checkbox,
    disabled: disabled ?? false,
    ariaLabel,
    ariaLabelledBy,
    focusedIndex,
    hasFocus,
    isKeyboardNav,
    filterValue,
    filteredOptions,
    totalOptions,
    firstEnabledIndex,
    onValueChange,
    setFocusedIndex,
    setIsKeyboardNav,
    setFilterValue,
    handleSelect,
    handleKeyDown,
    isSelected,
    registerOption,
    focusOption,
    listRef,
    optionRefs,
  }

  return (
    <ListboxContext.Provider value={contextValue}>
      <div
        ref={containerRef}
        className={cn(listboxVariants({ invalid, disabled }), className)}
        onFocus={handleContainerFocus}
        onBlur={handleContainerBlur}
        {...props}
      >
        {children}
      </div>
    </ListboxContext.Provider>
  )
}

// ============================================================================
// LISTBOX.HEADER
// ============================================================================

export interface ListboxHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

function ListboxHeader({ className, children, ...props }: ListboxHeaderProps) {
  return (
    <div
      data-slot="listbox-header"
      className={cn("border-b p-2", className)}
      {...props}
    >
      {children}
    </div>
  )
}

// ============================================================================
// LISTBOX.FILTER
// ============================================================================

export interface ListboxFilterProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  /** Custom component to render as filter input */
  as?: React.ComponentType<React.InputHTMLAttributes<HTMLInputElement>>
  /** Icon to show in filter */
  showIcon?: boolean
}

function ListboxFilter({
  className,
  placeholder = "Search...",
  showIcon = true,
  as: Component,
  ...props
}: ListboxFilterProps) {
  const { filterValue, setFilterValue, disabled } = useListboxContext()

  const InputComponent = Component || Input

  return (
    <div className="relative">
      {showIcon && (
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-wex-listbox-search-icon-fg" />
      )}
      <InputComponent
        type="text"
        data-slot="listbox-filter"
        placeholder={placeholder}
        value={filterValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setFilterValue(e.target.value)
        }
        className={cn("h-8", showIcon && "pl-8", className)}
        disabled={disabled}
        {...props}
      />
    </div>
  )
}

// ============================================================================
// LISTBOX.SELECTALL
// ============================================================================

export interface ListboxSelectAllProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Label text for the select all checkbox */
  label?: string
}

function ListboxSelectAll({
  className,
  label = "Select All",
  ...props
}: ListboxSelectAllProps) {
  const {
    filteredOptions,
    value,
    multiple,
    disabled,
    onValueChange,
  } = useListboxContext()

  // Only works in multiple selection mode
  if (!multiple) return null

  // Get all selectable (non-disabled) option values
  const selectableValues = React.useMemo(
    () => filteredOptions.filter((o) => !o.disabled).map((o) => o.value),
    [filteredOptions]
  )

  // Calculate selection state
  const selectedValues = Array.isArray(value) ? value : []
  const selectedCount = selectableValues.filter((v) => selectedValues.includes(v)).length
  const allSelected = selectedCount === selectableValues.length && selectableValues.length > 0
  const someSelected = selectedCount > 0 && selectedCount < selectableValues.length

  // Determine checkbox state
  const checkboxState: boolean | "indeterminate" = allSelected
    ? true
    : someSelected
    ? "indeterminate"
    : false

  const handleToggle = () => {
    if (disabled) return

    if (allSelected) {
      // Deselect all selectable options (keep any manually selected disabled options)
      const remainingValues = selectedValues.filter(
        (v) => !selectableValues.includes(v)
      )
      onValueChange(remainingValues.length > 0 ? remainingValues : [])
    } else {
      // Select all selectable options (keep any already selected values)
      const newValues = Array.from(new Set([...selectedValues, ...selectableValues]))
      onValueChange(newValues)
    }
  }

  return (
    <div
      data-slot="listbox-selectall"
      className={cn(
        "flex items-center gap-2 px-3 py-2 border-b cursor-pointer hover:bg-wex-listbox-item-hover-bg/50 transition-colors",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={handleToggle}
      role="checkbox"
      aria-checked={checkboxState === "indeterminate" ? "mixed" : checkboxState}
      aria-disabled={disabled}
      {...props}
    >
      <div
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-wex-listbox-checkbox-checked-bg transition-colors",
          checkboxState === true && "bg-wex-listbox-checkbox-checked-bg text-wex-listbox-checkbox-checked-fg",
          checkboxState === "indeterminate" && "bg-wex-listbox-checkbox-checked-bg text-wex-listbox-checkbox-checked-fg"
        )}
      >
        {checkboxState === true && <Check className="h-3 w-3" />}
        {checkboxState === "indeterminate" && (
          <div className="h-0.5 w-2.5 bg-current" />
        )}
      </div>
      <span className="text-sm font-medium">{label}</span>
      {selectableValues.length > 0 && (
        <span className="text-xs text-wex-listbox-count-fg ml-auto">
          ({selectedCount}/{selectableValues.length})
        </span>
      )}
    </div>
  )
}

// ============================================================================
// LISTBOX.OPTIONS
// ============================================================================

export interface ListboxOptionsProps extends React.HTMLAttributes<HTMLUListElement> {
  /** Accessible label */
  "aria-label"?: string
  /** ID of element that labels this listbox */
  "aria-labelledby"?: string
}

function ListboxOptions({
  className,
  children,
  "aria-label": ariaLabelProp,
  "aria-labelledby": ariaLabelledByProp,
  ...props
}: ListboxOptionsProps) {
  const {
    filteredOptions,
    multiple,
    disabled,
    focusedIndex,
    listRef,
    ariaLabel: ariaLabelContext,
    ariaLabelledBy: ariaLabelledByContext,
  } = useListboxContext()

  // Use props if provided, otherwise fall back to context
  const ariaLabel = ariaLabelProp ?? ariaLabelContext
  const ariaLabelledBy = ariaLabelledByProp ?? ariaLabelledByContext

  // If no children provided, auto-generate from options
  const hasChildren = React.Children.count(children) > 0

  // Group options if any have group property
  const groupedOptions = React.useMemo(() => {
    const groups: Record<string, ListboxOptionData[]> = {}
    const ungrouped: ListboxOptionData[] = []

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

  let optionIndex = 0

  // Generate unique ID for aria-activedescendant
  const activeDescendantId = focusedIndex >= 0 ? `listbox-option-${focusedIndex}` : undefined

  return (
    <ul
      ref={listRef}
      role="listbox"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-multiselectable={multiple}
      aria-disabled={disabled}
      aria-activedescendant={activeDescendantId}
      data-slot="listbox-options"
      className={cn("max-h-60 overflow-auto p-1 focus:outline-none", className)}
      {...props}
    >
      {hasChildren ? (
        children
      ) : filteredOptions.length === 0 ? (
        <li className="px-3 py-2 text-center text-sm text-wex-listbox-empty-fg">
          No options found
        </li>
      ) : hasGroups ? (
        <>
          {groupedOptions.ungrouped.map((option) => {
            const index = optionIndex++
            return (
              <ListboxOption key={option.value} index={index} option={option} />
            )
          })}
          {Object.entries(groupedOptions.groups).map(
            ([groupName, groupOptions]) => (
              <ListboxGroup key={groupName} label={groupName}>
                {groupOptions.map((option) => {
                  const index = optionIndex++
                  return (
                    <ListboxOption
                      key={option.value}
                      index={index}
                      option={option}
                    />
                  )
                })}
              </ListboxGroup>
            )
          )}
        </>
      ) : (
        filteredOptions.map((option, index) => (
          <ListboxOption key={option.value} index={index} option={option} />
        ))
      )}
    </ul>
  )
}

// ============================================================================
// LISTBOX.OPTION
// ============================================================================

export interface ListboxOptionProps extends React.HTMLAttributes<HTMLLIElement> {
  /** Unique key for the option (required for manual options) */
  uKey?: string
  /** Option data (auto-provided when using options prop) */
  option?: ListboxOptionData
  /** Index in the list (auto-provided for data options, auto-registered for manual) */
  index?: number
  /** Disabled state */
  disabled?: boolean
}

function ListboxOption({
  className,
  children,
  uKey,
  option,
  index: providedIndex,
  disabled: propDisabled,
  ...props
}: ListboxOptionProps) {
  const {
    checkmark,
    checkbox,
    multiple,
    disabled: listboxDisabled,
    focusedIndex,
    isKeyboardNav,
    firstEnabledIndex,
    isSelected,
    handleSelect,
    handleKeyDown,
    setFocusedIndex,
    setIsKeyboardNav,
    registerOption,
    optionRefs,
  } = useListboxContext()

  // Support both auto-generated (option prop) and manual (uKey + children)
  const optionDisabled = option?.disabled ?? propDisabled ?? false

  // For manual options without index, register and get an index
  const indexRef = React.useRef<number | null>(null)
  if (providedIndex === undefined && indexRef.current === null) {
    indexRef.current = registerOption(optionDisabled)
  }
  const index = providedIndex ?? indexRef.current ?? 0

  const optionValue = option?.value ?? uKey ?? ""
  const optionLabel = option?.label ?? (typeof children === "string" ? children : "")

  const selected = isSelected(optionValue)
  const isFocusedOption = focusedIndex === index
  
  // Only show focus ring when navigating via keyboard
  const showKeyboardFocus = isKeyboardNav && isFocusedOption
  
  // Roving tabindex logic:
  // - If this option is focused, it should be tabbable
  // - If no option is focused (focusedIndex === -1) and this is the first enabled option, make it tabbable
  // - Otherwise, not tabbable
  const isFirstEnabled = index === firstEnabledIndex
  const noOptionFocused = focusedIndex === -1
  const shouldBeTabbable = isFocusedOption || (noOptionFocused && isFirstEnabled)

  // Register ref for focus management
  const optionRef = React.useCallback(
    (node: HTMLLIElement | null) => {
      if (node) {
        optionRefs.current.set(index, node)
      } else {
        optionRefs.current.delete(index)
      }
    },
    [index, optionRefs]
  )

  // Handle mouse click - reset keyboard nav mode
  const handleClick = React.useCallback(() => {
    setIsKeyboardNav(false)
    handleSelect(optionValue, optionDisabled)
  }, [handleSelect, optionValue, optionDisabled, setIsKeyboardNav])

  // Handle focus - detect if from keyboard (tab) using :focus-visible
  const handleFocus = React.useCallback((e: React.FocusEvent<HTMLLIElement>) => {
    setFocusedIndex(index)
    // Check if focus is visible (keyboard navigation) using :focus-visible
    // This works because browsers apply :focus-visible when focus comes from keyboard
    if (e.target.matches(':focus-visible')) {
      setIsKeyboardNav(true)
    }
  }, [index, setFocusedIndex, setIsKeyboardNav])

  return (
    <li
      ref={optionRef}
      id={`listbox-option-${index}`}
      role="option"
      aria-selected={selected}
      aria-disabled={optionDisabled}
      data-index={index}
      data-slot="listbox-option"
      // Roving tabindex: focused option (or first option if none focused) is tabbable
      tabIndex={listboxDisabled ? -1 : shouldBeTabbable ? 0 : -1}
      className={cn(
        listboxOptionVariants({
          selected,
          keyboardFocused: showKeyboardFocus,
          disabled: optionDisabled,
        }),
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      {...props}
    >
      {/* Checkbox for multiple selection */}
      {checkbox && multiple && (
        <div
          className={cn(
            "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-wex-listbox-checkbox-checked-bg",
            selected ? "bg-wex-listbox-checkbox-checked-bg text-wex-listbox-checkbox-checked-fg" : "bg-wex-listbox-checkbox-bg"
          )}
        >
          {selected && <Check className="h-3 w-3" />}
        </div>
      )}

      {/* Option label */}
      <span className="flex-1">{children ?? optionLabel}</span>

      {/* Checkmark for single selection */}
      {checkmark && selected && !checkbox && (
        <Check className="h-4 w-4 shrink-0" />
      )}
    </li>
  )
}

// ============================================================================
// LISTBOX.GROUP
// ============================================================================

export interface ListboxGroupProps extends React.HTMLAttributes<HTMLLIElement> {
  /** Group label */
  label: string
}

function ListboxGroup({
  className,
  children,
  label,
  ...props
}: ListboxGroupProps) {
  return (
    <li role="presentation" data-slot="listbox-group" {...props}>
      <div
        className={cn(
          "px-3 py-1.5 text-xs font-semibold text-wex-listbox-group-heading-fg",
          className
        )}
      >
        {label}
      </div>
      <ul role="group" aria-label={label}>
        {children}
      </ul>
    </li>
  )
}

// ============================================================================
// LISTBOX.EMPTY
// ============================================================================

export interface ListboxEmptyProps extends React.HTMLAttributes<HTMLDivElement> {}

function ListboxEmpty({ className, children, ...props }: ListboxEmptyProps) {
  const { filteredOptions } = useListboxContext()

  if (filteredOptions.length > 0) return null

  return (
    <div
      data-slot="listbox-empty"
      className={cn("px-3 py-2 text-center text-sm text-wex-listbox-empty-fg", className)}
      {...props}
    >
      {children ?? "No options found"}
    </div>
  )
}

// ============================================================================
// WEX COMPOUND COMPONENT EXPORT
// ============================================================================

// WEX wrapper with wex-listbox class
const WexListboxRoot = ({
  className,
  ...props
}: ListboxRootProps & { className?: string }) => (
  <ListboxRoot
    className={cn("wex-listbox", className)}
    {...props}
  />
);
WexListboxRoot.displayName = "WexListbox";

// Re-export the compound component with Wex prefix
export const WexListbox = Object.assign(WexListboxRoot, {
  Header: ListboxHeader,
  Filter: ListboxFilter,
  SelectAll: ListboxSelectAll,
  Options: ListboxOptions,
  Option: ListboxOption,
  Group: ListboxGroup,
  Empty: ListboxEmpty,
})

// Export base components for advanced usage
export {
  ListboxRoot,
  ListboxHeader,
  ListboxFilter,
  ListboxSelectAll,
  ListboxOptions,
  ListboxOption,
  ListboxGroup,
  ListboxEmpty,
}


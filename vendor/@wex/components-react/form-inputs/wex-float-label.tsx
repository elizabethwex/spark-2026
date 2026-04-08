"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

/**
 * WexFloatLabel - WEX Design System Floating Label Wrapper
 * 
 * A wrapper component that provides floating label functionality for any input.
 * Works with WexInputNumber, WexInput, WexTextarea, etc.
 * 
 * Uses compound component pattern like PrimeNG:
 * 
 * @example
 * // With InputNumber
 * <WexFloatLabel>
 *   <WexInputNumber value={value} onValueChange={setValue} />
 *   <WexLabel>Amount</WexLabel>
 * </WexFloatLabel>
 * 
 * // With Input
 * <WexFloatLabel>
 *   <Input value={value} onChange={e => setValue(e.target.value)} />
 *   <WexLabel>Username</WexLabel>
 * </WexFloatLabel>
 */

// ============================================================================
// Context for sharing focus/value state
// ============================================================================

interface FloatLabelContextValue {
  isFocused: boolean
  hasValue: boolean
  setFocused: (focused: boolean) => void
  setHasValue: (hasValue: boolean) => void
  inputId: string
  size: "sm" | "md" | "lg"
  // For MultiSelect: track if dropdown is open
  isOpen?: boolean
  setIsOpen?: (open: boolean) => void
}

const FloatLabelContext = React.createContext<FloatLabelContextValue | null>(null)

function useFloatLabelContext() {
  const context = React.useContext(FloatLabelContext)
  if (!context) {
    throw new Error("FloatLabel components must be used within WexFloatLabel")
  }
  return context
}

// ============================================================================
// Variants
// ============================================================================

const floatLabelWrapperVariants = cva(
  // w-full + basis-full ensures proper width in both flex and non-flex containers
  "relative w-full basis-full",
  {
    variants: {
      size: {
        sm: "",
        md: "",
        lg: "",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

// ============================================================================
// Main Wrapper Component
// ============================================================================

export interface WexFloatLabelProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof floatLabelWrapperVariants> {
  /** Size variant - affects label positioning and sizing */
  size?: "sm" | "md" | "lg"
  /** Children - should include an input and a label */
  children: React.ReactNode
}

const WexFloatLabelRoot = React.forwardRef<HTMLDivElement, WexFloatLabelProps>(
  ({ className, size = "md", children, ...props }, ref) => {
    const [isFocused, setFocused] = React.useState(false)
    const [hasValue, setHasValue] = React.useState(false)
    const inputId = React.useId()

    const [isOpen, setIsOpen] = React.useState(false)
    
    const contextValue: FloatLabelContextValue = {
      isFocused,
      hasValue,
      setFocused,
      setHasValue,
      inputId,
      size,
      isOpen,
      setIsOpen,
    }

    return (
      <FloatLabelContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={"wex-float-label " + cn(floatLabelWrapperVariants({ size }), className)}
          {...props}
        >
          {children}
        </div>
      </FloatLabelContext.Provider>
    )
  }
)
WexFloatLabelRoot.displayName = "WexFloatLabel"

// ============================================================================
// FloatLabel.Input - Wrapper for any input component
// ============================================================================

interface FloatLabelInputProps {
  children: React.ReactElement<any>
}

function FloatLabelInput({ children }: FloatLabelInputProps) {
  const { setFocused, setHasValue, inputId, size, setIsOpen } = useFloatLabelContext()

  const child = React.Children.only(children) as React.ReactElement<any>
  const childProps = child.props as Record<string, any>
  
  // Check component type by displayName or props
  const displayName = (child.type as any)?.displayName
  
  // WexInputNumber detection
  const isInputNumber = displayName === "WexInputNumber" || 
    childProps.showButtons !== undefined ||
    (childProps.mode === "currency" || childProps.mode === "decimal")
  
  // WexInputMask detection (has mask prop or displayName)
  const isInputMask = displayName === "WexInputMask" || 
    childProps.mask !== undefined
  
  // WexMultiSelect detection (has options prop or displayName)
  const isMultiSelect = displayName === "WexMultiSelect" || 
    childProps.options !== undefined ||
    childProps.floatLabel !== undefined

  // Height and padding classes for regular inputs (Input, Textarea)
  const regularInputSizeClasses = {
    sm: "!h-12 !pt-5 !pb-1",
    md: "!h-14 !pt-5 !pb-2", 
    lg: "!h-16 !pt-6 !pb-2",
  }

  // Detect initial value on mount
  const initialValue = childProps.value ?? childProps.defaultValue
  const hasInitialValue = initialValue !== undefined && initialValue !== null && initialValue !== ""
  
  // For InputNumber, check if value is a number (including 0)
  const hasInitialInputNumberValue = isInputNumber && (
    (typeof initialValue === "number" && !isNaN(initialValue)) ||
    (initialValue !== undefined && initialValue !== null && initialValue !== "")
  )
  
  // For MultiSelect, check if value array has items
  const hasInitialMultiSelectValue = isMultiSelect && Array.isArray(initialValue) && initialValue.length > 0
  
  React.useEffect(() => {
    if (hasInitialValue && !isMultiSelect && !isInputNumber) {
      setHasValue(true)
    } else if (hasInitialInputNumberValue) {
      setHasValue(true)
    } else if (hasInitialMultiSelectValue) {
      setHasValue(true)
    }
  }, [hasInitialValue, hasInitialInputNumberValue, hasInitialMultiSelectValue, isMultiSelect, isInputNumber, setHasValue])

  // Build new props
  const newProps: Record<string, any> = {
    id: inputId,
    onFocus: (e: React.FocusEvent) => {
      setFocused(true)
      childProps.onFocus?.(e)
    },
    onBlur: (e: React.FocusEvent) => {
      setFocused(false)
      childProps.onBlur?.(e)
    },
  }

  if (isInputNumber) {
    // For InputNumber: track value via onValueChange, don't modify styling
    // The inputSize prop on InputNumber handles its own height
    newProps.onValueChange = (value: number | null) => {
      setHasValue(value !== null && value !== undefined)
      childProps.onValueChange?.(value)
    }
    // Keep original className
    newProps.className = childProps.className
  } else if (isInputMask) {
    // For InputMask: track value via onValueChange (string value)
    // The floatLabel prop on InputMask handles its own height
    newProps.onValueChange = (value: string, isComplete: boolean) => {
      setHasValue(value !== null && value !== undefined && value !== "")
      childProps.onValueChange?.(value, isComplete)
    }
    // Keep original className
    newProps.className = childProps.className
  } else if (isMultiSelect) {
    // For MultiSelect: track value via onValueChange (array value)
    // The floatLabel prop on MultiSelect handles its own height
    // Use a ref to track the latest value for the onOpenChange handler
    const currentValueRef = React.useRef<string[]>(childProps.value ?? [])
    const isOpenRef = React.useRef<boolean>(false)
    
    newProps.onValueChange = (value: string[]) => {
      currentValueRef.current = value
      const hasValueNow = Array.isArray(value) && value.length > 0
      setHasValue(hasValueNow)
      // If value becomes empty and dropdown is closed, also clear focus
      if (!hasValueNow && !isOpenRef.current) {
        setFocused(false)
      }
      childProps.onValueChange?.(value)
    }
    // Merge focus handlers to track focus state
    const originalOnFocus = childProps.onFocus
    const originalOnBlur = childProps.onBlur
    newProps.onFocus = (e: React.FocusEvent) => {
      setFocused(true)
      originalOnFocus?.(e)
    }
    newProps.onBlur = (e: React.FocusEvent) => {
      setFocused(false)
      originalOnBlur?.(e)
    }
    // Pass setIsOpen callback to MultiSelect so it can notify float label when dropdown opens/closes
    if (setIsOpen) {
      // Store original onOpenChange if it exists
      const originalOnOpenChange = childProps.onOpenChange
      newProps.onOpenChange = (open: boolean) => {
        isOpenRef.current = open
        setIsOpen(open)
        // When dropdown closes, check if there's a value - if not, clear focus to unfloat the label
        if (!open) {
          // Check the latest value from the ref (updated by onValueChange)
          const hasCurrentValue = Array.isArray(currentValueRef.current) && currentValueRef.current.length > 0
          if (!hasCurrentValue) {
            setFocused(false)
          }
        }
        originalOnOpenChange?.(open)
      }
    }
    // Keep original className
    newProps.className = childProps.className
  } else {
    // For regular inputs (Input, Textarea): apply size classes and track onChange
    newProps.className = cn(childProps.className, regularInputSizeClasses[size])
    newProps.onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const val = e.target.value
      setHasValue(val !== null && val !== undefined && val !== "")
      childProps.onChange?.(e)
    }
  }

  return React.cloneElement(child, newProps)
}
FloatLabelInput.displayName = "WexFloatLabel.Input"

// ============================================================================
// FloatLabel.Label - The floating label
// ============================================================================

interface FloatLabelLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode
}

function FloatLabelLabel({ children, className, ...props }: FloatLabelLabelProps) {
  const { isFocused, hasValue, inputId, size, isOpen } = useFloatLabelContext()
  // Float label when: focused OR has value OR (for MultiSelect) dropdown is open
  // But if dropdown closes and there's no value, unfloat
  const isFloating = hasValue || isFocused || (isOpen ?? false)

  // Size-specific positioning
  const sizeConfig = {
    sm: {
      default: "top-3.5 text-sm",
      floating: "top-1 text-xs",
    },
    md: {
      default: "top-[17px] text-sm",
      floating: "top-1.5 text-xs",
    },
    lg: {
      default: "top-[19px] text-base",
      floating: "top-2 text-sm",
    },
  }

  return (
    <label
      htmlFor={inputId}
      className={cn(
        "absolute left-3 pointer-events-none z-10",
        "origin-top-left transition-all duration-200 ease-out",
        "text-wex-field-label-fg",
        isFloating 
          ? cn(sizeConfig[size].floating, "text-wex-field-value-fg font-medium")
          : sizeConfig[size].default,
        className
      )}
      {...props}
    >
      {children}
    </label>
  )
}
FloatLabelLabel.displayName = "WexFloatLabel.Label"

// ============================================================================
// Compound Component Export
// ============================================================================

export const WexFloatLabel = Object.assign(WexFloatLabelRoot, {
  Input: FloatLabelInput,
  Label: FloatLabelLabel,
})

export type { FloatLabelInputProps, FloatLabelLabelProps }

// ============================================================================
// Legacy: Keep the original self-contained FloatLabel for backwards compat
// ============================================================================

const floatLabelInputVariants = cva(
  [
    // Base input styles
    "peer w-full rounded-md px-3 text-sm shadow-sm transition-colors",
    // Layer 3 tokens
    "text-wex-input-fg",
    "bg-wex-input-bg",
    "border border-wex-input-border",
    // Hover
    "hover:border-wex-input-border-hover",
    // Focus
    "focus:outline-none focus:border-wex-input-border-focus focus:ring-1 focus:ring-wex-input-focus-ring",
    // Disabled
    "disabled:cursor-not-allowed disabled:opacity-50",
    "disabled:bg-wex-input-disabled-bg disabled:text-wex-input-disabled-fg",
    // Placeholder - hidden but needed for :placeholder-shown
    "placeholder:text-transparent",
  ],
  {
    variants: {
      size: {
        sm: "h-10 pt-4 pb-1 text-xs",
        md: "h-14 pt-5 pb-2",
        lg: "h-16 pt-6 pb-2 text-base",
      },
      invalid: {
        true: [
          "border-wex-input-invalid-border",
          "focus:border-wex-input-invalid-border",
          "focus:ring-wex-input-invalid-focus-ring",
        ].join(" "),
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      invalid: false,
    },
  }
)

const floatLabelLabelVariants = cva(
  [
    // Positioning
    "absolute pointer-events-none",
    "origin-top-left transition-all duration-200 ease-out",
    // Default state (inside input)
    "text-wex-floatlabel-label-fg",
    // Floated state - applied on focus OR when input has value
    "peer-focus:text-wex-floatlabel-label-focus-fg",
    "peer-focus:scale-75 peer-focus:-translate-y-2.5",
    "peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-2.5",
    // When both focused AND has value, use focus color
    "peer-focus:peer-[:not(:placeholder-shown)]:text-wex-floatlabel-label-focus-fg",
  ],
  {
      variants: {
        size: {
          sm: "top-2.5 text-sm peer-focus:text-xs peer-[:not(:placeholder-shown)]:text-xs",
          md: "top-[17px] text-sm peer-focus:text-xs peer-[:not(:placeholder-shown)]:text-xs",
          lg: "top-[19px] text-base peer-focus:text-sm peer-[:not(:placeholder-shown)]:text-sm",
        },
      },
    defaultVariants: {
      size: "md",
    },
  }
)

export interface FloatLabelProps
  extends Omit<React.ComponentProps<"input">, "size" | "placeholder">,
    VariantProps<typeof floatLabelWrapperVariants> {
  /** The floating label text */
  label: string
  /** Size variant */
  size?: "sm" | "md" | "lg"
  /** Invalid state for form validation */
  invalid?: boolean
  /** Container className */
  containerClassName?: string
  /** Icon to display on the left side of the input */
  leftIcon?: React.ReactNode
  /** Icon to display on the right side of the input */
  rightIcon?: React.ReactNode
}

/**
 * FloatLabel - Floating label input component (legacy self-contained version)
 * 
 * Provides a Material Design / PrimeNG-style floating label that animates
 * from inside the input to above it when focused or containing a value.
 * 
 * Uses CSS peer selectors for pure-CSS state detection:
 * - placeholder=" " enables :placeholder-shown detection
 * - peer-focus: detects focus state
 * - peer-[:not(:placeholder-shown)]: detects filled state
 */
const FloatLabel = React.forwardRef<HTMLInputElement, FloatLabelProps>(
  ({ className, containerClassName, label, size, invalid, id, leftIcon, rightIcon, ...props }, ref) => {
    // Generate a unique id if not provided
    const generatedId = React.useId()
    const inputId = id || generatedId

    return (
      <div className={cn(floatLabelWrapperVariants({ size }), containerClassName)}>
        {/* Left icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-wex-input-placeholder z-10">
            {leftIcon}
          </div>
        )}
        
        <input
          id={inputId}
          ref={ref}
          placeholder=" " // Required for :placeholder-shown detection
          aria-invalid={invalid || undefined}
          className={cn(
            floatLabelInputVariants({ size, invalid }),
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            className
          )}
          {...props}
        />
        
        <label
          htmlFor={inputId}
          className={cn(
            floatLabelLabelVariants({ size }),
            leftIcon ? "left-10" : "left-3"
          )}
        >
          {label}
        </label>
        
        {/* Right icon */}
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-wex-input-placeholder z-10">
            {rightIcon}
          </div>
        )}
      </div>
    )
  }
)
FloatLabel.displayName = "FloatLabel"

// Export as WexFloatLabelInput for backwards compatibility
export const WexFloatLabelInput = FloatLabel
export type { FloatLabelProps as WexFloatLabelInputProps }

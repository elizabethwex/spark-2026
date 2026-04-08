import * as React from "react"
import { format, parse, isValid } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "../lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { WexCalendar } from "./wex-calendar"
import { WexPopover } from "../overlays/wex-popover"

export interface DatePickerProps {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export interface DatePickerRangeProps {
  date?: DateRange
  onDateChange?: (date: DateRange | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export interface DatePickerWithInputProps {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  label?: string
}

function DatePicker({
  date,
  onDateChange,
  placeholder = "Pick a date",
  className,
  disabled = false,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <WexPopover open={open} onOpenChange={setOpen}>
      <WexPopover.Trigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          disabled={disabled}
          className={cn(
            "data-[empty=true]:text-wex-datepicker-placeholder-fg w-[280px] justify-start text-left font-normal",
            className
          )}
        >
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
          <CalendarIcon className="ml-auto" />
        </Button>
      </WexPopover.Trigger>
      <WexPopover.Content className="w-auto p-0" align="start">
        <WexCalendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            onDateChange?.(selectedDate)
            setOpen(false)
          }}
        />
      </WexPopover.Content>
    </WexPopover>
  )
}

DatePicker.displayName = "DatePicker"

function DatePickerRange({
  date,
  onDateChange,
  placeholder = "Pick a date range",
  className,
  disabled = false,
}: DatePickerRangeProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <WexPopover open={open} onOpenChange={setOpen}>
      <WexPopover.Trigger asChild>
        <Button
          variant="outline"
          data-empty={!date?.from}
          disabled={disabled}
          className={cn(
            "data-[empty=true]:text-wex-datepicker-placeholder-fg w-[280px] justify-start text-left font-normal",
            className
          )}
        >
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "LLL dd, y")} -{" "}
                {format(date.to, "LLL dd, y")}
              </>
            ) : (
              format(date.from, "LLL dd, y")
            )
          ) : (
            <span>{placeholder}</span>
          )}
          <CalendarIcon className="ml-auto" />
        </Button>
      </WexPopover.Trigger>
      <WexPopover.Content className="w-auto p-0" align="start">
        <WexCalendar
          mode="range"
          selected={date}
          onSelect={(range) => {
            onDateChange?.(range)
            // Don't close automatically - only close when clicking outside
          }}
          numberOfMonths={2}
        />
      </WexPopover.Content>
    </WexPopover>
  )
}

DatePickerRange.displayName = "DatePickerRange"

function DatePickerWithInput({
  date,
  onDateChange,
  placeholder = "Select date",
  className,
  disabled = false,
  label,
}: DatePickerWithInputProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState(
    date ? format(date, "PPP") : ""
  )
  const inputRef = React.useRef<HTMLInputElement>(null)
  const openedFromInputRef = React.useRef(false)

  React.useEffect(() => {
    if (date) {
      setInputValue(format(date, "PPP"))
    } else {
      setInputValue("")
    }
  }, [date])

  // Ensure popover stays open when opened from input focus
  React.useEffect(() => {
    if (open && openedFromInputRef.current && inputRef.current) {
      // Ensure input maintains focus when popover is open
      const timeoutId = setTimeout(() => {
        if (inputRef.current && document.activeElement !== inputRef.current) {
          inputRef.current.focus()
        }
      }, 10)
      return () => clearTimeout(timeoutId)
    }
  }, [open])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputValue(val)
    // Try to parse the input as a date in various formats
    let parsedDate: Date | undefined
    const formats = ["PPP", "PP", "P", "MM/dd/yyyy", "yyyy-MM-dd", "MM-dd-yyyy"]
    for (const fmt of formats) {
      try {
        const parsed = parse(val, fmt, new Date())
        if (isValid(parsed)) {
          parsedDate = parsed
          break
        }
      } catch {
        // Continue to next format
      }
    }
    if (parsedDate) {
      onDateChange?.(parsedDate)
    } else if (val === "") {
      onDateChange?.(undefined)
    }
  }

  return (
    <div className={cn("flex flex-col gap-2 w-[280px]", className)}>
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}
      <div className="relative w-full">
        <WexPopover open={open} onOpenChange={setOpen}>
          <WexPopover.Anchor asChild>
            <div className="relative w-full">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={handleInputChange}
                placeholder={placeholder}
                disabled={disabled}
                className="pr-10 w-full"
                aria-label="Date input"
                onFocus={() => {
                  openedFromInputRef.current = true
                  setOpen(true)
                }}
              />
              <WexPopover.Trigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  disabled={disabled}
                  aria-label="Open calendar"
                  type="button"
                  onClick={() => {
                    openedFromInputRef.current = false
                  }}
                >
                  <CalendarIcon className="h-4 w-4 text-wex-datepicker-placeholder-fg" />
                </Button>
              </WexPopover.Trigger>
            </div>
          </WexPopover.Anchor>
          <WexPopover.Content 
            className="w-auto p-0" 
            align="start" 
            side="bottom" 
            sideOffset={4}
            onOpenAutoFocus={(e) => {
              // Prevent popover from stealing focus from input when opened from input focus
              if (openedFromInputRef.current && inputRef.current) {
                e.preventDefault()
                // Refocus input immediately to allow typing
                setTimeout(() => {
                  inputRef.current?.focus()
                }, 0)
              }
            }}
            onInteractOutside={(e) => {
              // Prevent closing when clicking on the input field or its container
              const target = e.target as Node
              if (inputRef.current && (inputRef.current === target || inputRef.current.contains(target))) {
                e.preventDefault()
              }
            }}
            onEscapeKeyDown={() => {
              // Allow escape to close, but refocus input if it was opened from input
              if (openedFromInputRef.current && inputRef.current) {
                openedFromInputRef.current = false
                setTimeout(() => {
                  inputRef.current?.focus()
                }, 0)
              }
            }}
            onCloseAutoFocus={() => {
              // Reset the flag when popover closes
              openedFromInputRef.current = false
            }}
          >
            <WexCalendar
              mode="single"
              selected={date}
              onSelect={(selectedDate) => {
                onDateChange?.(selectedDate)
                setOpen(false)
              }}
              defaultMonth={date}
            />
          </WexPopover.Content>
        </WexPopover>
      </div>
    </div>
  )
}

DatePickerWithInput.displayName = "DatePickerWithInput"

/**
 * WexDatePicker - WEX Design System Date Picker Component
 *
 * Date selection input combining Calendar with Popover.
 * Supports single date selection with button trigger or input field.
 *
 * @example
 * <WexDatePicker
 *   date={date}
 *   onDateChange={setDate}
 *   placeholder="Pick a date"
 * />
 *
 * // With input field
 * <WexDatePicker.WithInput
 *   date={date}
 *   onDateChange={setDate}
 *   placeholder="Enter or pick a date"
 * />
 */

const WexDatePickerRoot = React.forwardRef<
  HTMLDivElement,
  DatePickerProps
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("wex-date-picker", className)}>
    <DatePicker {...props} />
  </div>
))
WexDatePickerRoot.displayName = "WexDatePicker"

const WexDatePickerWithInput = React.forwardRef<
  HTMLDivElement,
  DatePickerWithInputProps
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("wex-date-picker", className)}>
    <DatePickerWithInput {...props} />
  </div>
))
WexDatePickerWithInput.displayName = "WexDatePicker.WithInput"

const WexDatePickerRange = React.forwardRef<
  HTMLDivElement,
  DatePickerRangeProps
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("wex-date-picker", className)}>
    <DatePickerRange {...props} />
  </div>
))
WexDatePickerRange.displayName = "WexDatePicker.Range"

export const WexDatePicker = Object.assign(WexDatePickerRoot, {
  WithInput: WexDatePickerWithInput,
  Range: WexDatePickerRange,
})

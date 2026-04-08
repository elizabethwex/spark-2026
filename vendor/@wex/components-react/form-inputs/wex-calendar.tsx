import * as React from "react";
import {
  Calendar as CalendarRoot,
} from "@/components/ui/calendar";
import { getDefaultClassNames } from "react-day-picker";
import { cn } from "../lib/utils";

/**
 * WexCalendar - WEX Design System Calendar Component
 *
 * Date picker calendar component supporting single, multiple, and range selection.
 * Applies WEX customizations via classNames prop.
 *
 * @example
 * const [date, setDate] = useState<Date | undefined>(new Date());
 * <WexCalendar
 *   mode="single"
 *   selected={date}
 *   onSelect={setDate}
 *   className="rounded-md border"
 * />
 */

export const WexCalendar = ({
  className,
  classNames,
  ...props
}: React.ComponentProps<typeof CalendarRoot>) => {
  const defaultClassNames = getDefaultClassNames();

  return (
    <CalendarRoot
      className={cn(
        "bg-wex-calendar-bg text-wex-calendar-fg group/calendar p-3 [--cell-size:2rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        className
      )}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-[--cell-size] w-full items-center justify-center px-[--cell-size]",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-[--cell-size] w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "has-focus:border-wex-calendar-day-selected-bg border-wex-calendar-day-outside-fg shadow-xs has-focus:ring-wex-calendar-day-selected-bg/50 has-focus:ring-[3px] relative rounded-md border",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "bg-wex-popover-bg absolute inset-0 opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "select-none font-medium text-wex-calendar-header-fg",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-wex-calendar-weekday-fg flex-1 select-none rounded-md text-[0.8rem] font-normal",
          defaultClassNames.weekday
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-[--cell-size] select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-wex-calendar-day-outside-fg select-none text-[0.8rem]",
          defaultClassNames.week_number
        ),
        day: cn(
          "data-[selected-single=true]:bg-wex-calendar-day-selected-bg data-[selected-single=true]:text-wex-calendar-day-selected-fg data-[range-middle=true]:bg-wex-calendar-day-range-bg data-[range-middle=true]:text-wex-calendar-day-range-fg data-[range-start=true]:bg-wex-calendar-day-selected-bg data-[range-start=true]:text-wex-calendar-day-selected-fg data-[range-end=true]:bg-wex-calendar-day-selected-bg data-[range-end=true]:text-wex-calendar-day-selected-fg group-data-[focused=true]/day:border-wex-calendar-day-selected-bg group-data-[focused=true]/day:ring-wex-calendar-day-selected-bg/50 flex aspect-square h-auto w-full min-w-[--cell-size] flex-col gap-1 font-normal leading-none data-[range-end=true]:rounded-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] [&>span]:text-xs [&>span]:opacity-70",
          defaultClassNames.day
        ),
        range_start: cn(
          "bg-wex-calendar-day-range-bg rounded-l-md",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn(
          "bg-wex-calendar-day-range-bg rounded-r-md",
          defaultClassNames.range_end
        ),
        today: cn(
          "bg-wex-calendar-day-today-bg text-wex-calendar-day-today-fg rounded-md data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "text-wex-calendar-day-outside-fg aria-selected:text-wex-calendar-day-outside-fg",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-wex-calendar-day-disabled-fg opacity-50",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      {...props}
    />
  );
};
WexCalendar.displayName = "WexCalendar";

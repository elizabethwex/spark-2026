import * as React from "react";
import { cn } from "@/lib/utils";
import { WexCheckbox } from "@wex/components-react/form-inputs";
import { WexTooltip } from "@wex/components-react/overlays";

export type AccountSelectCardProps = {
  id: string;
  title: string;
  subtext?: string;
  description: string;
  icon?: React.ReactNode;
  checked?: boolean;
  disabled?: boolean;
  disabledTooltip?: string;
  viewMoreLabel?: string;
  onViewMore?: () => void;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
};

export function AccountSelectCard({
  title,
  subtext,
  description,
  icon,
  checked = false,
  disabled = false,
  disabledTooltip,
  viewMoreLabel = "View more",
  onViewMore,
  onCheckedChange,
  className,
}: AccountSelectCardProps) {
  const toggle = () => {
    if (disabled) return;
    onCheckedChange?.(!checked);
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  };

  const cardContent = (
    <div
      role="checkbox"
      aria-checked={checked}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={toggle}
      onKeyDown={onKeyDown}
      className={cn(
        "w-full rounded-lg border p-6 transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        !disabled && "cursor-pointer elevation-4 shadow-md",
        disabled && "cursor-not-allowed bg-muted border-border shadow-none",
        checked && !disabled ? "border-primary" : "border-border",
        className,
      )}
    >
      <div className={cn("flex items-start", icon ? "gap-2" : "")}>
        {icon ? <div className="shrink-0 pt-1">{icon}</div> : null}

        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
              <div className={cn("text-[16px] font-bold leading-6 tracking-[-0.176px]", disabled ? "text-muted-foreground" : "text-foreground")}>
                {title}
              </div>
              {subtext ? (
                <div className="text-[11px] leading-4 tracking-[0.055px] text-muted-foreground">{subtext}</div>
              ) : null}
            </div>

            <div
              className={cn("shrink-0 rounded-[6px]", disabled && "opacity-60")}
              onClick={(e) => {
                e.stopPropagation();
                toggle();
              }}
              aria-label={`${checked ? "Deselect" : "Select"} ${title}`}
            >
              <WexCheckbox
                checked={checked}
                disabled={disabled}
                aria-hidden="true"
                tabIndex={-1}
                onCheckedChange={() => {
                  // handled by parent button click
                }}
              />
            </div>
          </div>

          <p className={cn("text-[14px] leading-6 tracking-[-0.084px] text-muted-foreground", disabled && "opacity-70")}>
            {description}
          </p>

          {onViewMore ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onViewMore();
              }}
              disabled={disabled}
              className={cn(
                "text-[14px] font-semibold leading-6 tracking-[-0.084px] text-left self-start whitespace-nowrap",
                disabled ? "text-muted-foreground cursor-not-allowed" : "text-primary hover:underline",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded",
              )}
            >
              {viewMoreLabel}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );

  if (disabled && disabledTooltip) {
    return (
      <WexTooltip.Provider>
        <WexTooltip>
          <WexTooltip.Trigger asChild>
            <span className="w-full">{cardContent}</span>
          </WexTooltip.Trigger>
          <WexTooltip.Content side="top" className="max-w-[300px] text-center">
            <p>{disabledTooltip}</p>
          </WexTooltip.Content>
        </WexTooltip>
      </WexTooltip.Provider>
    );
  }

  return cardContent;
}
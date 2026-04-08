import { cn } from "@/lib/utils";
import { WexCheckbox } from "@wex/components-react/form-inputs";

export function ReadOnlyRadio({
  label,
  selected,
  disabled = true,
}: {
  label: string;
  selected: boolean;
  disabled?: boolean;
}) {
  return (
    <label
      className={cn(
        "inline-flex items-center gap-[7px] text-[14px] leading-[normal]",
        disabled && "opacity-60",
      )}
    >
      <span
        className={cn(
          "inline-flex items-center justify-center w-[17.5px] h-[17.5px] rounded-full border",
          "border-input bg-muted",
        )}
        aria-hidden="true"
      >
        {selected ? (
          <span className="w-[10.5px] h-[10.5px] rounded-full bg-muted-foreground" />
        ) : null}
      </span>
      <span className="text-foreground">{label}</span>
    </label>
  );
}

export function ReadOnlyCheckbox({
  label,
  checked,
  disabled = true,
}: {
  label: string;
  checked: boolean;
  disabled?: boolean;
}) {
  return (
    <label
      className={cn(
        "inline-flex items-center gap-[7px] text-[14px] leading-[normal] cursor-default",
        disabled && "opacity-60",
      )}
    >
      <WexCheckbox checked={checked} disabled={disabled} aria-label={label} />
      <span className="text-foreground">{label}</span>
    </label>
  );
}
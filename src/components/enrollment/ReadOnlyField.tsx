import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { WexFloatLabelInput } from "@wex/components-react/form-inputs";

type ReadOnlyFieldProps = {
  label: string;
  value: string;
  className?: string;
};

export function ReadOnlyField({ label, value, className }: ReadOnlyFieldProps) {
  return (
    <WexFloatLabelInput
      label={label}
      value={value}
      disabled
      readOnly
      className={cn(className)}
    />
  );
}

type ReadOnlySelectProps = {
  label: string;
  value: string;
  className?: string;
};

export function ReadOnlySelect({ label, value, className }: ReadOnlySelectProps) {
  return (
    <WexFloatLabelInput
      label={label}
      value={value}
      disabled
      readOnly
      rightIcon={<ChevronDown className="h-[14px] w-[14px]" />}
      className={cn(className)}
    />
  );
}
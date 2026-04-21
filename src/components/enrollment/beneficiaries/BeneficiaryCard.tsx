import { Check, MoreVertical, User } from "lucide-react";
import { WexDropdownMenu } from "@wex/components-react/overlays";
import { cn } from "@/lib/utils";

export type Beneficiary = {
  id: string;
  name: string;
  relationship: string;
  type: "primary" | "contingent";
  sharePercentage: number;
  isFromDependents?: boolean;
};

type BeneficiaryCardProps = {
  beneficiary: Beneficiary;
  selected: boolean;
  onClick: () => void;
  onEdit: () => void;
  onRemove: () => void;
};

export default function BeneficiaryCard({ beneficiary, selected, onClick, onEdit, onRemove }: BeneficiaryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-xl border bg-white px-4 py-3 shadow-[0px_1px_2px_0px_rgba(18,18,23,0.05)]",
        "transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected ? "border-primary ring-1 ring-primary/10" : "border-border",
      )}
      aria-pressed={selected}
    >
      <div className="flex items-start gap-3">
        <div className={cn("h-8 w-8 rounded-full flex items-center justify-center", selected ? "bg-primary/10" : "bg-muted")}>
          <User className={cn("h-4 w-4", selected ? "text-primary" : "text-muted-foreground")} />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="text-[14px] font-semibold leading-5 text-foreground">{beneficiary.name}</div>
            {selected ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                <Check className="h-3 w-3" />
                Selected
              </span>
            ) : null}
          </div>
          <div className="text-[13px] leading-5 text-muted-foreground">
            {beneficiary.relationship}
            {beneficiary.isFromDependents && <span className="ml-1 text-muted-foreground">(Dependent)</span>}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium", beneficiary.type === "primary" ? "bg-success/10 text-success-text" : "bg-warning/10 text-warning-text")}>
              {beneficiary.type === "primary" ? "Primary" : "Contingent"}
            </span>
            <span className="text-[13px] font-semibold text-foreground">{beneficiary.sharePercentage}%</span>
          </div>
        </div>

        <WexDropdownMenu>
          <WexDropdownMenu.Trigger asChild>
            <button
              type="button"
              className={cn(
                "inline-flex h-8 w-8 items-center justify-center rounded-md",
                "text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
              onClick={(e) => e.stopPropagation()}
              aria-label="Beneficiary actions"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          </WexDropdownMenu.Trigger>
          <WexDropdownMenu.Content
            align="end"
            onClick={(e) => e.stopPropagation()}
          >
            <WexDropdownMenu.Item onSelect={() => onEdit()}>
              Edit
            </WexDropdownMenu.Item>
            <WexDropdownMenu.Item
              className="text-destructive"
              onSelect={() => onRemove()}
            >
              Remove
            </WexDropdownMenu.Item>
          </WexDropdownMenu.Content>
        </WexDropdownMenu>
      </div>
    </button>
  );
}
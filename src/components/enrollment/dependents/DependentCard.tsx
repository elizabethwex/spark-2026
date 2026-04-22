import { Check, MoreVertical, User } from "lucide-react";
import { WexDropdownMenu } from "@wex/components-react/overlays";
import { cn } from "@/lib/utils";

export type Dependent = {
  id: string;
  name: string;
  ageLabel: string;
  userAdded?: boolean;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  ssn?: string;
  birthDate?: string;
  gender?: string;
  fullTimeStudent?: string;
  relationship?: string;
};

type DependentCardProps = {
  dependent: Dependent;
  selected: boolean;
  onClick: () => void;
  onEdit?: () => void;
  onRemove?: () => void;
};

export default function DependentCard({ dependent, selected, onClick, onEdit, onRemove }: DependentCardProps) {
  const showMenu = dependent.userAdded && (onEdit || onRemove);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } }}
      className={cn(
        "w-full text-left rounded-xl border bg-white px-4 py-3 shadow-[0px_1px_2px_0px_rgba(18,18,23,0.05)]",
        "transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer",
        selected ? "border-primary ring-1 ring-primary/10" : "border-border",
      )}
      aria-pressed={selected}
    >
      <div className="flex items-start gap-3">
        <div className={cn("h-8 w-8 rounded-full flex items-center justify-center", selected ? "bg-primary/10" : "bg-muted")}>
          <User className={cn("h-4 w-4", selected ? "text-primary" : "text-muted-foreground")} />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="text-[14px] font-semibold leading-5 text-foreground">{dependent.name}</div>
            {selected ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                <Check className="h-3 w-3" />
                Selected
              </span>
            ) : null}
          </div>
          <div className="text-[13px] leading-5 text-muted-foreground">{dependent.ageLabel}</div>
        </div>

        {showMenu && (
          <WexDropdownMenu>
            <WexDropdownMenu.Trigger asChild>
              <button
                type="button"
                onClick={(e) => e.stopPropagation()}
                className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Dependent options"
              >
                <MoreVertical className="h-4 w-4 text-muted-foreground" />
              </button>
            </WexDropdownMenu.Trigger>
            <WexDropdownMenu.Content
              align="end"
              onClick={(e) => e.stopPropagation()}
            >
              {onEdit && (
                <WexDropdownMenu.Item onSelect={() => onEdit()}>
                  Edit
                </WexDropdownMenu.Item>
              )}
              {onRemove && (
                <WexDropdownMenu.Item
                  className="text-destructive"
                  onSelect={() => onRemove()}
                >
                  Remove
                </WexDropdownMenu.Item>
              )}
            </WexDropdownMenu.Content>
          </WexDropdownMenu>
        )}
      </div>
    </div>
  );
}
import { Card } from "@wexinc-healthbenefits/ben-ui-kit";
import { cn } from "@/lib/utils";

/**
 * QuestionOptionCard Props
 */
export interface QuestionOptionCardProps {
  option: string;
  selected: boolean;
  onSelect: () => void;
  className?: string;
}

/**
 * QuestionOptionCard Component
 * 
 * Simple card component for Yes/No and other option selections in the eligibility questionnaire.
 * 
 * Features:
 * - White background with shadow
 * - Rounded corners (8px)
 * - Selected state with primary border
 * - Clickable to select option
 */
export function QuestionOptionCard({
  option,
  selected,
  onSelect,
  className,
}: QuestionOptionCardProps) {
  return (
    <Card
      className={cn(
        "w-[362px] p-4 cursor-pointer transition-all rounded-lg shadow-sm group",
        "hover:bg-primary",
        selected
          ? "border-primary border-2"
          : "border-border",
        className
      )}
      onClick={onSelect}
      role="button"
      aria-pressed={selected}
      aria-label={`Select ${option}`}
    >
      <div className="flex items-center justify-center">
        <p className={cn(
          "text-base font-semibold leading-6 tracking-[-0.176px] transition-colors",
          "group-hover:text-white",
          selected ? "text-foreground" : "text-foreground"
        )}>
          {option}
        </p>
      </div>
    </Card>
  );
}


import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  children?: React.ReactNode;
}

export function SectionHeader({
  title,
  actionLabel,
  actionHref,
  onAction,
  children,
}: SectionHeaderProps) {
  const navigate = useNavigate();

  const handleAction = onAction ?? (actionHref ? () => navigate(actionHref) : undefined);

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      {children}
      {actionLabel && handleAction && (
        <button
          type="button"
          className="flex items-center gap-[7px] rounded-[6px] px-[12px] py-[8px] text-[15.75px] font-medium text-[color:var(--system-link,#1c6eff)] hover:underline transition-colors -mr-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={handleAction}
        >
          {actionLabel}
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

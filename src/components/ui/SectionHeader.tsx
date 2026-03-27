import { useNavigate } from "react-router-dom";
import { Button } from "@wexinc-healthbenefits/ben-ui-kit";
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
        <Button
          intent="primary"
          variant="link"
          size="md"
          className="h-auto p-0"
          onClick={handleAction}
        >
          {actionLabel}
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import { Button } from "@wexinc-healthbenefits/ben-ui-kit";

/**
 * Title Bar Component
 * 
 * Page header with:
 * - "Account Overview" heading (H1/Bold)
 * - "Send a Payment" button (outline)
 * - "Reimburse Myself" button (primary)
 */
export function TitleBar() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between gap-4">
      <h1 className="text-3xl font-bold text-foreground tracking-tight">
        Account Overview
      </h1>
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="md"
          className="text-primary border-primary hover:bg-primary/10 active:bg-primary/20"
        >
          Send a Payment
        </Button>
        <Button size="md" onClick={() => navigate("/reimburse")}>
          Reimburse Myself
        </Button>
      </div>
    </div>
  );
}


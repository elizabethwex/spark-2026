import { cn } from "@/lib/utils";

interface AccessibilityTagProps {
  status: "pass" | "warn";
  ratio: number;
}

export function AccessibilityTag({ status, ratio }: AccessibilityTagProps) {
  const formattedRatio = ratio.toFixed(1);

  return (
    <div
      className={cn(
        "content-stretch flex items-center px-[7px] py-[3.5px] relative rounded-[6px] shrink-0 gap-[3.5px]",
        status === "pass"
          ? "bg-app-success-surface text-app-success-text"
          : "bg-app-warning-surface text-app-warning-text"
      )}
    >
      <p className="font-['Inter:Bold',sans-serif] font-[700] leading-[normal] not-italic relative shrink-0 text-[12.25px] whitespace-nowrap">
        AA: {formattedRatio}:1
      </p>
    </div>
  );
}

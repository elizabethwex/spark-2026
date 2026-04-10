import { Button } from "@wexinc-healthbenefits/ben-ui-kit";
import { Sparkles } from "lucide-react";

interface SuggestedFixBannerProps {
  suggestedColor: string;
  onApply: () => void;
}

export function SuggestedFixBanner({ suggestedColor, onApply }: SuggestedFixBannerProps) {
  return (
    <div className="bg-[#f8f9fe] content-stretch flex gap-[16px] items-start overflow-clip px-[12px] py-[8px] relative rounded-[8px] shrink-0 w-full mt-2">
      <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start justify-center min-h-px min-w-px relative">
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[16px] not-italic relative shrink-0 text-[12px] text-[color:var(--text\\/neutrals\\/body,#12181d)] whitespace-nowrap">
          Suggested Accessibility Fix:
        </p>
        <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
          <div className="h-[33px] overflow-clip relative rounded-[6px] shrink-0 w-[57px]">
            <div
              className="absolute h-[25px] left-[4px] rounded-[3px] top-[4px] w-[49px] border border-border"
              style={{ backgroundColor: suggestedColor }}
            />
          </div>
          <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[16px] min-h-px min-w-px not-italic relative text-[12px] text-[color:var(--text\\/neutrals\\/body,#12181d)]">
            {suggestedColor}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onApply}
            className="h-8 gap-1.5 text-[color:var(--button\\/primary\\/default,#0058a3)] border-[color:var(--button\\/primary\\/default,#0058a3)] hover:bg-blue-50"
          >
            <Sparkles className="h-4 w-4 text-icon-default" />
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
}

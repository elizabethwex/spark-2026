import {
  Badge,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@wexinc-healthbenefits/ben-ui-kit";
import { CircleCheck, CircleSlash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ELEV_SHADOW =
  "shadow-[0px_3.017px_9.051px_0px_rgba(43,49,78,0.04),0px_6.034px_18.101px_0px_rgba(43,49,78,0.06)]";

export type FsaPreviousPlanYearCardProps = {
  /** First summary line: “… your total {fundTypePhrase}”. */
  fundTypePhrase: "FSA funds" | "LPFSA funds" | "dependent FSA funds";
  /** Label before the plan-period select (Figma Health FSA / LPFSA: “Plan Period:”; DCFSA: “Plan Year:”). */
  planPeriodLabel?: string;
  /** Column titles for the four summary stats under Total Used. */
  statColumnVariant?: "default" | "dependentCare";
  onOpenMoreDetails: () => void;
};

/**
 * Previous Plan Year card (Consumer Experience) — shared by Health FSA and LPFSA account dashboards.
 */
export function FsaPreviousPlanYearCard({
  fundTypePhrase,
  planPeriodLabel = "Plan Period:",
  statColumnVariant = "default",
  onOpenMoreDetails,
}: FsaPreviousPlanYearCardProps) {
  const col1 = statColumnVariant === "dependentCare" ? "Annual Election" : "Elected";
  const col2 = "Unused/Forfeited";
  const col3 = "Rolled Over";
  const col4 = "Denied Claims";
  const totalUsedAmount = statColumnVariant === "dependentCare" ? "$5,000.00" : "$2,500.00";
  const electedAmount = statColumnVariant === "dependentCare" ? "$5,000.00" : "$2,500.00";

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <h2 className="text-[20px] font-bold leading-8 text-[#14182c]">Previous Plan Year</h2>
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <span className="text-sm text-[#5f6a94]">{planPeriodLabel}</span>
          <Select defaultValue="2025">
            <SelectTrigger className="h-14 w-[min(100%,280px)] min-w-[200px] sm:w-[230px]">
              <SelectValue placeholder="Plan period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">Jan 1, 2025 – Dec 31, 2025</SelectItem>
              <SelectItem value="2024">Jan 1, 2024 – Dec 31, 2024</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div
        className={cn(
          "mt-6 space-y-6 rounded-2xl border border-white/60 bg-white p-6",
          ELEV_SHADOW
        )}
      >
        <div>
          <p className="text-sm text-[#5f6a94]">Total Used</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="text-2xl font-semibold tracking-tight text-[#14182c]">{totalUsedAmount}</span>
            <Badge
              intent="success"
              className="rounded-md border-0 bg-[#ecfdf5] px-2 py-0.5 text-xs font-bold text-[#006045]"
            >
              100%
            </Badge>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-sm text-[#5f6a94]">{col1}</p>
            <p className="text-base font-semibold text-[#14182c]">{electedAmount}</p>
          </div>
          <div>
            <p className="text-sm text-[#5f6a94]">{col2}</p>
            <p className="text-base font-semibold text-[#14182c]">$0.00</p>
          </div>
          <div>
            <p className="text-sm text-[#5f6a94]">{col3}</p>
            <p className="text-base font-semibold text-[#14182c]">$0.00</p>
          </div>
          <div>
            <p className="text-sm text-[#5f6a94]">{col4}</p>
            <p className="text-base font-semibold text-[#14182c]">$0.00</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
          <button
            type="button"
            className="text-base font-medium text-[#3958c3] underline-offset-2 hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-primary"
            onClick={onOpenMoreDetails}
          >
            View More Details
          </button>
          <a
            href="#"
            className="text-base font-medium text-[#3958c3] underline-offset-2 hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-primary"
            onClick={(e) => e.preventDefault()}
          >
            View All Claims
          </a>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <h3 className="text-[20px] font-semibold leading-8 text-[#14182c]">Summary</h3>
        <div className="rounded-xl bg-[rgba(57,88,195,0.05)] p-4">
          <ul className="space-y-2 text-sm text-[#14182c]">
            <li className="flex gap-2">
              <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" aria-hidden />
              <span>
                You <strong className="font-bold">used 100%</strong> of your total {fundTypePhrase}
              </span>
            </li>
            <li className="flex gap-2">
              <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" aria-hidden />
              <span>
                You <strong className="font-bold">lost $0.00</strong>
              </span>
            </li>
            <li className="flex gap-2">
              <CircleSlash2 className="mt-0.5 h-4 w-4 shrink-0 text-[#460809]" aria-hidden />
              <span>
                <strong className="font-bold text-[#460809]">0 claims</strong> were denied
              </span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

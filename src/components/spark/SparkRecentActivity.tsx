import { Link } from "react-router-dom";
import { Clock, ChevronRight } from "lucide-react";
import {
  sparkRecentActivity,
  type SparkActivityStatus,
} from "@/data/sparkAiForwardMock";
import { cn } from "@/lib/utils";

function statusStyles(status: SparkActivityStatus): string {
  switch (status) {
    case "approved":
      return "text-[#009966]";
    case "needs_attention":
      return "text-[#996e00]";
    case "completed":
      return "text-[#009966]";
    default:
      return "text-[#5f6a94]";
  }
}

/**
 * SPARK-2026 simplified recent activity list (Figma).
 */
export function SparkRecentActivity() {
  return (
    <section className="space-y-4" aria-labelledby="spark-activity-heading">
      <div className="flex items-center justify-between w-full">
        <h2 id="spark-activity-heading" className="text-[12px] font-black uppercase tracking-[3px] text-[#5f6a94] leading-[16px]">
          Recent Activity
        </h2>
        <Link
          to="/account-overview"
          className="text-[12px] font-bold uppercase tracking-[1.2px] text-[#1c6eff] leading-[16px] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          View All
        </Link>
      </div>

      <div className="flex flex-col gap-[12px]">
        {sparkRecentActivity.map((row) => (
          <button
            key={`${row.merchant}-${row.meta}`}
            type="button"
            className="group relative flex w-full flex-col items-start overflow-hidden rounded-[16px] border border-white bg-white p-px text-left shadow-[0_3px_9px_rgba(43,49,78,0.04),0_6px_18px_rgba(43,49,78,0.06)] transition hover:border-[#3958c3]/20 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="relative w-full bg-white/40">
              <div className="flex w-full items-center justify-between p-[16px]">
                <div className="flex items-center gap-[16px]">
                  <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[12px] bg-[#eef2ff] text-[#3958c3]">
                    <Clock className="h-[18px] w-[18px]" />
                  </div>
                  <div className="flex flex-col items-start">
                    <p className="text-[14px] font-bold leading-[20px] text-[#14182c]">
                      {row.merchant}
                    </p>
                    <p className="text-[12px] font-medium leading-[16px] text-[#5f6a94]">
                      {row.meta}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-[24px]">
                  <div className="flex flex-col items-end">
                    <p className="text-[14px] font-bold leading-[20px] text-[#14182c]">
                      {row.amount}
                    </p>
                    <p
                      className={cn(
                        "text-[12px] font-bold uppercase tracking-[1.2px] leading-[16px]",
                        statusStyles(row.status)
                      )}
                    >
                      {row.statusLabel}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[#5f6a94] transition-transform group-hover:translate-x-0.5" aria-hidden />
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

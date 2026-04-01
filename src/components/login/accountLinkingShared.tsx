import { Stethoscope, Shield, CreditCard, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

export const MATCHED_ACCOUNT_ROWS = [
  {
    id: "mbe-stark",
    productLabel: "My Benefit Express",
    tagVariant: "cyan" as const,
    maskedUsername: "nic*******son",
    employer: "Stark Industries",
    lastActive: "November 9, 2022",
  },
  {
    id: "cobra-dm",
    productLabel: "COBRA & Direct Bill",
    tagVariant: "purple" as const,
    maskedUsername: "n.j***son",
    employer: "Dunder Mifflin Paper Co.",
    lastActive: "April 14, 2026",
  },
  {
    id: "cobra-stark2",
    productLabel: "COBRA & Direct Bill",
    tagVariant: "purple" as const,
    maskedUsername: "nj***son",
    employer: "Stark Industries",
    lastActive: "August 27, 2023",
  },
] as const

export type MatchedAccountRow = (typeof MATCHED_ACCOUNT_ROWS)[number]

/** "Linking account:" label + account detail card — shared by verify-access and link MFA steps. */
export function LinkingAccountSummary({ row }: { row: MatchedAccountRow }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="w-full text-left text-base font-bold leading-6 tracking-[-0.176px] text-foreground">
        Linking account:
      </p>
      <div className="rounded-xl border border-border p-4">
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-start gap-2">
            <ProductTag label={row.productLabel} variant={row.tagVariant} />
            <span className="text-base font-semibold leading-6 tracking-[-0.176px] text-foreground">
              {row.maskedUsername}
            </span>
          </div>
          <p className="text-[14px] font-normal leading-6 tracking-[-0.084px] text-foreground">
            {row.employer}
          </p>
          <p className="inline-flex items-center gap-1 text-[12px] font-normal leading-4 text-muted-foreground">
            <Clock className="h-3 w-3 shrink-0" aria-hidden />
            Last active: {row.lastActive}
          </p>
        </div>
      </div>
    </div>
  )
}

export function ProductTag({
  label,
  variant,
}: {
  label: string
  variant: "cyan" | "purple" | "info"
}) {
  const styles =
    variant === "cyan"
      ? "bg-[#9ce4ee] text-[#034b55]"
      : variant === "purple"
        ? "bg-[#cbb8ff] text-[#321f66]"
        : "bg-[#bee7fa] text-[#00437c]"

  const Icon =
    variant === "cyan"
      ? Stethoscope
      : variant === "purple"
        ? Shield
        : CreditCard

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded px-2 py-0.5 text-[13px] font-semibold leading-6 tracking-[-0.0325px]",
        styles
      )}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden />
      {label}
    </span>
  )
}

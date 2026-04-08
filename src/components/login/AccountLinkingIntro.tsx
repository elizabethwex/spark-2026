import { useState, type RefObject } from "react"
import { Button, Checkbox } from "@wexinc-healthbenefits/ben-ui-kit"
import { Lock, Clock, CircleCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  MATCHED_ACCOUNT_ROWS,
  ProductTag,
} from "@/components/login/accountLinkingShared"
import {
  loginSelectableSelected,
  loginSelectableUnselectedIntro,
} from "@/components/login/loginFlowCardStyles"
import {
  loginFlowLinkTextClass,
  loginFlowPrimaryButtonClass,
  loginFlowTertiaryGhostButtonClass,
} from "@/components/login/loginFlowTheme"

export interface AccountLinkingIntroProps {
  primaryUsername: string
  onContinue: (selectedAccountIds: string[]) => void
  onNotNow: () => void
  onAddAnotherAccount: () => void
  continueRef: RefObject<HTMLButtonElement | null>
}

/**
 * First screen of the account linking flow — matches Figma "Unlinked Accounts" (node 27732:25237).
 */
export function AccountLinkingIntro({
  primaryUsername,
  onContinue,
  onNotNow,
  onAddAnotherAccount,
  continueRef,
}: AccountLinkingIntroProps) {
  const [linked, setLinked] = useState<Record<string, boolean>>({
    "mbe-stark": false,
    "cobra-dm": false,
    "cobra-stark2": false,
  })

  const toggle = (id: string) => {
    setLinked((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const selectedIds = MATCHED_ACCOUNT_ROWS.filter((row) => linked[row.id]).map(
    (row) => row.id
  )
  const canContinue = selectedIds.length > 0

  return (
    <div className="flex w-full flex-col gap-8">
      {/* Primary account (read-only context) */}
      <div className="w-full rounded-xl border border-[#E3E7F4] p-4">
        <div className="flex flex-wrap items-center gap-1 gap-x-2">
          <span className="flex-1 text-left text-base font-bold leading-6 tracking-[-0.176px] text-[#12181d]">
            {primaryUsername || "ux-nicole"}
          </span>
          <span className="inline-flex items-center gap-1 text-[12px] font-bold leading-4 text-muted-foreground">
            <Lock className="h-3 w-3 shrink-0" aria-hidden />
            Primary Account
          </span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <ProductTag label="Spending Account(s)" variant="info" />
        </div>
        <p className="mt-1 text-[14px] font-normal leading-6 tracking-[-0.084px] text-foreground">
          Dunder Mifflin Paper Co.
        </p>
      </div>

      {/* Matched accounts */}
      <div className="flex flex-col gap-4">
        <p className="w-full text-left text-base font-bold leading-6 tracking-[-0.176px] text-foreground">
          Matched Accounts
        </p>
        <div className="flex flex-col gap-4">
          {MATCHED_ACCOUNT_ROWS.map((row) => {
            const isOn = linked[row.id]
            return (
              <div
                key={row.id}
                className={cn(
                  "flex gap-4 rounded-xl p-4 text-left transition-colors select-none",
                  "cursor-pointer",
                  isOn ? loginSelectableSelected : loginSelectableUnselectedIntro
                )}
                onClick={() => toggle(row.id)}
              >
                <div
                  className="mt-0.5 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Checkbox
                    id={`link-${row.id}`}
                    checked={isOn}
                    onCheckedChange={() => toggle(row.id)}
                    className="shrink-0"
                    aria-label={`Link ${row.productLabel} for ${row.employer}`}
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex flex-wrap items-start gap-2">
                    <ProductTag
                      label={row.productLabel}
                      variant={row.tagVariant}
                    />
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
            )
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-baseline gap-2 text-[16px] font-normal leading-6 tracking-[-0.176px]">
        <span className="text-[#2d333a]">Not seeing the right account?</span>
        <button
          type="button"
          onClick={onAddAnotherAccount}
          className={loginFlowLinkTextClass}
        >
          Add Another Account
        </button>
      </div>

      {/* Why link */}
      <div className="flex w-full flex-col gap-2 rounded-xl border border-[#E3E7F4] bg-[#eff6ff] p-4">
        <p className="text-base font-bold leading-6 tracking-[-0.176px] text-foreground">
          Why link your accounts?
        </p>
        <ul className="flex flex-col gap-2">
          {[
            "Manage all your benefits from a single login",
            "Secure and encrypted connection",
            "Streamlined access from one set of credentials",
          ].map((line) => (
            <li
              key={line}
              className="flex items-start gap-2 text-[14px] font-normal leading-6 tracking-[-0.084px] text-foreground"
            >
              <CircleCheck
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#096]"
                aria-hidden
              />
              {line}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-[17px]">
        <Button
          ref={continueRef}
          type="button"
          disabled={!canContinue}
          onClick={() => onContinue(selectedIds)}
          className={cn(
            "h-10 w-full rounded-lg text-[14px] font-medium leading-6 tracking-[-0.084px]",
            loginFlowPrimaryButtonClass
          )}
        >
          Continue
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onNotNow}
          className={cn(
            "h-10 w-full rounded-lg text-[14px] font-medium leading-6 tracking-[-0.084px]",
            loginFlowTertiaryGhostButtonClass
          )}
        >
          Not Now
        </Button>
      </div>

      <p className="text-center text-[12px] font-normal leading-4 text-muted-foreground">
        IMPORTANT: Exercise caution when linking accounts. Ensure you are claiming accounts that
        belong to you or have proper authorization to access.
      </p>
    </div>
  )
}

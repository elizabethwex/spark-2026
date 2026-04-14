import { useState, type RefObject } from "react"
import { Button, RadioGroup, RadioGroupItem } from "@wexinc-healthbenefits/ben-ui-kit"
import { cn } from "@/lib/utils"
import { ProductTag } from "@/components/login/accountLinkingShared"
import {
  getPrimaryCredentialsDisplay,
  type PrimaryOptionId,
} from "@/components/login/accountLinkingPrimary"
import { loginSelectableSelected, loginSelectableUnselected } from "@/components/login/loginFlowCardStyles"
import { loginFlowPrimaryButtonClass, loginFlowTertiaryGhostButtonClass } from "@/components/login/loginFlowTheme"

const OPTIONS: {
  id: PrimaryOptionId
  username: string
  productLabel: string
  tagVariant: "info" | "purple"
}[] = [
  {
    id: "pennysmith",
    username: "pennysmith",
    productLabel: "Spending Account(s)",
    tagVariant: "info",
  },
  {
    id: "p.smith",
    username: "p.smith",
    productLabel: "COBRA & Direct Bill",
    tagVariant: "purple",
  },
]

export interface SelectPrimaryAccountProps {
  /** Username from the current login session; shown when the primary option is pennysmith. */
  sessionUsername: string
  onMakePrimary: (_selectedId: PrimaryOptionId) => void
  onCancel: () => void
  makePrimaryRef: RefObject<HTMLButtonElement | null>
}

/**
 * Post–account-linking step: choose which credentials become primary (Figma node 27047:8652).
 */
export function SelectPrimaryAccount({
  sessionUsername,
  onMakePrimary,
  onCancel,
  makePrimaryRef,
}: SelectPrimaryAccountProps) {
  const [selected, setSelected] = useState<PrimaryOptionId>("pennysmith")

  const { username: displayUsername, passwordMasked: displayPasswordMasked } =
    getPrimaryCredentialsDisplay(selected, sessionUsername)

  return (
    <div className="flex w-full flex-col gap-[21px]">
      <RadioGroup
        value={selected}
        onValueChange={(v) => setSelected(v as PrimaryOptionId)}
        className="flex flex-col gap-4"
      >
        {OPTIONS.map((opt) => {
          const isOn = selected === opt.id
          return (
            <div
              key={opt.id}
              className={cn(
                "flex w-full cursor-pointer select-none items-start gap-4 rounded-xl p-4 text-left transition-colors",
                isOn ? loginSelectableSelected : loginSelectableUnselected
              )}
              onClick={() => setSelected(opt.id)}
            >
              <div
                className="mt-0.5 shrink-0"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              >
                <RadioGroupItem
                  value={opt.id}
                  id={`primary-account-${opt.id}`}
                  className="shrink-0"
                  aria-label={`Select ${opt.username} as primary`}
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className="text-base font-bold leading-6 tracking-[-0.176px] text-foreground">
                  {opt.username}
                </p>
                <div className="flex flex-wrap items-start gap-2">
                  <ProductTag label={opt.productLabel} variant={opt.tagVariant} />
                </div>
                <p className="text-[14px] font-normal leading-6 tracking-[-0.084px] text-foreground">
                  Dunder Mifflin Paper Co.
                </p>
              </div>
            </div>
          )
        })}
      </RadioGroup>

      <div className="flex flex-col gap-3 rounded-xl border border-[#E3E7F4] bg-[#eff6ff] p-4 text-left text-foreground">
        <p className="text-base font-bold leading-6 tracking-[-0.176px]">
          Username: {displayUsername}
        </p>
        <p className="text-base font-bold leading-6 tracking-[-0.176px]">
          Password: {displayPasswordMasked}
        </p>
        <p className="border-t border-[#E3E7F4] pt-3 text-[16px] font-normal leading-6 tracking-[-0.176px]">
          You&apos;ll use the credentials from this selected account to login to all accounts moving
          forward.
        </p>
      </div>

      <div className="flex flex-col gap-[17px]">
        <Button
          ref={makePrimaryRef}
          type="button"
          onClick={() => onMakePrimary(selected)}
          className={cn(
            "h-10 w-full rounded-lg text-[14px] font-medium leading-6 tracking-[-0.084px]",
            loginFlowPrimaryButtonClass
          )}
        >
          Make Primary
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className={cn(
            "h-10 w-full rounded-lg text-[14px] font-medium leading-6 tracking-[-0.084px]",
            loginFlowTertiaryGhostButtonClass
          )}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}

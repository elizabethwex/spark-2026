import { useState, type RefObject } from "react"
import { Button } from "@wexinc-healthbenefits/ben-ui-kit"
import { cn } from "@/lib/utils"
import { ProductTag } from "@/components/login/accountLinkingShared"
import {
  getPrimaryCredentialsDisplay,
  type PrimaryOptionId,
} from "@/components/login/accountLinkingPrimary"

const OPTIONS: {
  id: PrimaryOptionId
  username: string
  productLabel: string
  tagVariant: "info" | "purple"
}[] = [
  {
    id: "ux-nicole",
    username: "ux-nicole",
    productLabel: "Spending Account(s)",
    tagVariant: "info",
  },
  {
    id: "n.jackson",
    username: "n.jackson",
    productLabel: "COBRA & Direct Bill",
    tagVariant: "purple",
  },
]

export interface SelectPrimaryAccountProps {
  /** Username from the current login session; shown when the primary option is ux-nicole. */
  sessionUsername: string
  onMakePrimary: (selectedId: PrimaryOptionId) => void
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
  const [selected, setSelected] = useState<PrimaryOptionId>("ux-nicole")

  const { username: displayUsername, passwordMasked: displayPasswordMasked } =
    getPrimaryCredentialsDisplay(selected, sessionUsername)

  return (
    <div className="flex w-full flex-col gap-[21px]">
      <div className="flex flex-col gap-2 rounded-xl border border-border bg-[#eff6ff] p-4 text-left text-base font-bold leading-6 tracking-[-0.176px] text-foreground">
        <p>Username: {displayUsername}</p>
        <p>Password: {displayPasswordMasked}</p>
      </div>

      <div className="flex flex-col gap-4">
        {OPTIONS.map((opt) => {
          const isOn = selected === opt.id
          return (
            <button
              key={opt.id}
              type="button"
              aria-pressed={isOn}
              onClick={() => setSelected(opt.id)}
              className={cn(
                "w-full rounded-xl border p-4 text-left transition-colors",
                isOn
                  ? "border-[hsl(var(--wex-primary))] bg-[hsl(var(--wex-primary)/0.08)]"
                  : "border-border bg-card"
              )}
            >
              <p className="text-base font-bold leading-6 tracking-[-0.176px] text-foreground">
                {opt.username}
              </p>
              <div className="mt-1 flex flex-wrap items-start gap-2">
                <ProductTag label={opt.productLabel} variant={opt.tagVariant} />
              </div>
              <p className="mt-1 text-[14px] font-normal leading-6 tracking-[-0.084px] text-foreground">
                Dunder Mifflin Paper Co.
              </p>
            </button>
          )
        })}
      </div>

      <div className="flex flex-col gap-[17px]">
        <Button
          ref={makePrimaryRef}
          type="button"
          onClick={() => onMakePrimary(selected)}
          className="h-10 w-full rounded-lg text-[14px] font-medium leading-6 tracking-[-0.084px]"
        >
          Make Primary
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className="h-10 w-full rounded-lg text-[14px] font-medium leading-6 tracking-[-0.084px] text-[hsl(var(--wex-primary))] hover:bg-transparent hover:text-[hsl(var(--wex-primary))]"
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}

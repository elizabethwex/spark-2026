import type { RefObject } from "react"
import { Button, RadioGroup, RadioGroupItem } from "@wexinc-healthbenefits/ben-ui-kit"
import { cn } from "@/lib/utils"
import type { AccountGroup } from "@/components/login/accountSelectorConfig"
import { loginSelectableSelected, loginSelectableUnselected } from "@/components/login/loginFlowCardStyles"
import {
  loginFlowLinkTextClass,
  loginFlowPrimaryButtonClass,
  loginFlowSecondaryOutlineButtonClass,
} from "@/components/login/loginFlowTheme"

export interface SelectAccountScreenProps {
  groups: AccountGroup[]
  selectedAccountId: string
  onSelectAccount: (accountId: string) => void
  onLinkAnotherAccount: () => void
  onContinue: () => void
  onCancel: () => void
  accountContinueRef: RefObject<HTMLButtonElement | null>
  canContinue: boolean
  dunderMifflinLogoUrl: string
  acmeLogoUrl: string
}

/**
 * "Select an Account" — consumer login step 5; also used on `/select-profile` for authenticated entry.
 */
export function SelectAccountScreen({
  groups,
  selectedAccountId,
  onSelectAccount,
  onLinkAnotherAccount,
  onContinue,
  onCancel,
  accountContinueRef,
  canContinue,
  dunderMifflinLogoUrl,
  acmeLogoUrl,
}: SelectAccountScreenProps) {
  return (
    <div className="flex w-full flex-col gap-6">
      <RadioGroup
        value={selectedAccountId}
        onValueChange={onSelectAccount}
        className="flex flex-col gap-6"
      >
        {groups.map((group) => (
          <div key={group.employerName} className="flex flex-col gap-4">
            <p className="w-full text-left text-base font-bold leading-6 tracking-[-0.176px] text-foreground">
              {group.employerName}
            </p>
            <div className="flex flex-col gap-4">
              {group.accounts.map((account) => {
                const selected = selectedAccountId === account.id
                const radioId = `select-account-${account.id}`
                return (
                  <div
                    key={account.id}
                    className={cn(
                      "flex w-full cursor-pointer select-none items-center gap-4 rounded-lg px-4 py-2 text-left transition-colors",
                      selected ? loginSelectableSelected : loginSelectableUnselected
                    )}
                    onClick={() => onSelectAccount(account.id)}
                  >
                    <div
                      className="mt-0.5 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    >
                      <RadioGroupItem
                        value={account.id}
                        id={radioId}
                        className="shrink-0"
                        aria-label={`Select ${account.label}`}
                      />
                    </div>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded border border-[#E3E7F4] bg-background">
                      {account.icon === "building" ? (
                        <img
                          src={dunderMifflinLogoUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <img src={acmeLogoUrl} alt="" className="h-full w-full object-cover" />
                      )}
                    </div>
                    <span className="text-[14px] font-normal leading-6 tracking-[-0.084px] text-foreground">
                      {account.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </RadioGroup>

      <button
        type="button"
        onClick={onLinkAnotherAccount}
        className={cn(
          "w-full text-left text-[14px] font-normal leading-6 tracking-[-0.084px]",
          loginFlowLinkTextClass
        )}
      >
        Link Another Account
      </button>

      <div className="flex flex-col gap-[17px]">
        <Button
          ref={accountContinueRef}
          type="button"
          disabled={!canContinue}
          onClick={onContinue}
          className={cn(
            "h-10 w-full rounded-lg text-[14px] font-medium leading-6 tracking-[-0.084px]",
            loginFlowPrimaryButtonClass
          )}
        >
          Continue
        </Button>
        <Button
          type="button"
          intent="primary"
          variant="outline"
          onClick={onCancel}
          className={cn(
            "h-10 w-full rounded-lg text-[14px] font-medium leading-6 tracking-[-0.084px]",
            loginFlowSecondaryOutlineButtonClass
          )}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}

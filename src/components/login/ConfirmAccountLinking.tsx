import { useState, type RefObject } from "react"
import { Button, Checkbox } from "@wexinc-healthbenefits/ben-ui-kit"
import { Lock } from "lucide-react"
import { ProductTag } from "@/components/login/accountLinkingShared"
import {
  getPrimaryCredentialsDisplay,
  type PrimaryOptionId,
} from "@/components/login/accountLinkingPrimary"

const TERMS_COPY = {
  understand:
    "I understand that linking these accounts will allow me to access and manage both accounts with a single login using the credentials indicated above. Each account will maintain its separate balance, coverage, and account information.",
  authorize:
    "I authorize the secure linking of these benefits accounts and confirm that I am the authorized holder for both accounts.",
} as const

export interface ConfirmAccountLinkingProps {
  sessionUsername: string
  selectedPrimary: PrimaryOptionId
  onConfirm: () => void
  onCancel: () => void
  confirmRef: RefObject<HTMLButtonElement | null>
}

/**
 * Terms confirmation before completing account link — Figma node 27732:25519.
 */
export function ConfirmAccountLinking({
  sessionUsername,
  selectedPrimary,
  onConfirm,
  onCancel,
  confirmRef,
}: ConfirmAccountLinkingProps) {
  const [agreeUnderstand, setAgreeUnderstand] = useState(false)
  const [agreeAuthorize, setAgreeAuthorize] = useState(false)
  const canConfirm = agreeUnderstand && agreeAuthorize

  const { username, passwordMasked } = getPrimaryCredentialsDisplay(
    selectedPrimary,
    sessionUsername
  )

  return (
    <div className="flex w-full flex-col gap-[21px]">
      <div className="flex flex-col gap-2 rounded-xl border border-border bg-[#eff6ff] p-4 text-center text-base font-bold leading-6 tracking-[-0.176px] text-foreground">
        <p>Username: {username}</p>
        <p>Password: {passwordMasked}</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex flex-col items-start gap-1">
            <ProductTag label="Spending Account(s)" variant="info" />
            <p className="text-[14px] font-normal leading-6 tracking-[-0.084px] text-foreground">
              Dunder Mifflin Paper Co.
            </p>
            <p className="mt-1 inline-flex items-center gap-1 text-[12px] font-bold leading-4 text-muted-foreground">
              <Lock className="h-3 w-3 shrink-0" aria-hidden />
              Primary Account
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex flex-col items-start gap-1">
            <ProductTag label="COBRA & Direct Bill" variant="purple" />
            <p className="text-[14px] font-normal leading-6 tracking-[-0.084px] text-foreground">
              Dunder Mifflin Paper Co.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-[#eff6ff] p-4">
        <p className="text-base font-bold leading-6 tracking-[-0.176px] text-foreground">
          Confirm Account Linking
        </p>
        <div className="flex gap-2">
          <Checkbox
            id="link-terms-understand"
            checked={agreeUnderstand}
            onCheckedChange={(v) => setAgreeUnderstand(v === true)}
            className="mt-0.5 shrink-0"
            aria-label="Acknowledge single login and separate account details"
          />
          <label
            htmlFor="link-terms-understand"
            className="cursor-pointer text-left text-[14px] font-normal leading-6 tracking-[-0.084px] text-foreground"
          >
            {TERMS_COPY.understand}
          </label>
        </div>
        <div className="flex gap-2">
          <Checkbox
            id="link-terms-authorize"
            checked={agreeAuthorize}
            onCheckedChange={(v) => setAgreeAuthorize(v === true)}
            className="mt-0.5 shrink-0"
            aria-label="Authorize secure linking of benefits accounts"
          />
          <label
            htmlFor="link-terms-authorize"
            className="cursor-pointer text-left text-[14px] font-normal leading-6 tracking-[-0.084px] text-foreground"
          >
            {TERMS_COPY.authorize}
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-[17px]">
        <Button
          ref={confirmRef}
          type="button"
          disabled={!canConfirm}
          onClick={onConfirm}
          className="h-10 w-full rounded-lg text-[14px] font-medium leading-6 tracking-[-0.084px]"
        >
          Confirm & Link Accounts
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

import { useState, type RefObject } from "react"
import { Button, FloatLabel } from "@wexinc-healthbenefits/ben-ui-kit"
import { Eye, EyeOff, AlertCircle } from "lucide-react"
import {
  LinkingAccountSummary,
  type MatchedAccountRow,
} from "@/components/login/accountLinkingShared"

const LINK_VERIFY_ACCEPTED_USERNAME = "n.jackson"

export interface AccountLinkingVerifyAccessProps {
  row: MatchedAccountRow
  onContinue: () => void
  onSkip: () => void
  usernameInputRef: RefObject<HTMLInputElement | null>
}

/**
 * Credential verification step when linking an account — Figma node 26870:8113.
 */
export function AccountLinkingVerifyAccess({
  row,
  onContinue,
  onSkip,
  usernameInputRef,
}: AccountLinkingVerifyAccessProps) {
  const [linkUser, setLinkUser] = useState("")
  const [linkPassword, setLinkPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [credentialError, setCredentialError] = useState(false)

  const canContinue =
    linkUser.trim().length > 0 && linkPassword.trim().length > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canContinue) return
    const usernameOk =
      linkUser.trim().toLowerCase() === LINK_VERIFY_ACCEPTED_USERNAME
    if (!usernameOk) {
      setCredentialError(true)
      return
    }
    setCredentialError(false)
    onContinue()
  }

  return (
    <div className="flex w-full flex-col gap-8">
      <LinkingAccountSummary row={row} />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FloatLabel
          ref={usernameInputRef}
          label="Username"
          type="text"
          value={linkUser}
          onChange={(e) => {
            setLinkUser(e.target.value)
            setCredentialError(false)
          }}
          size="lg"
          className="text-[16px] leading-6 tracking-[-0.176px]"
        />
        <div className="flex flex-col gap-1">
          <FloatLabel
            label="Password"
            type={showPassword ? "text" : "password"}
            value={linkPassword}
            onChange={(e) => {
              setLinkPassword(e.target.value)
              setCredentialError(false)
            }}
            size="lg"
            invalid={credentialError}
            className="text-[16px] leading-6 tracking-[-0.176px]"
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer hover:text-foreground transition-colors pointer-events-auto"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            }
          />
          {credentialError && (
            <p className="text-[12px] text-[hsl(var(--wex-destructive))] px-3 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Invalid username or password
            </p>
          )}
        </div>

        <div className="flex flex-col gap-[17px] pt-2">
          <Button
            type="submit"
            disabled={!canContinue}
            className="h-10 w-full rounded-lg text-[14px] font-medium leading-6 tracking-[-0.084px]"
          >
            Continue
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onSkip}
            className="h-10 w-full rounded-lg text-[14px] font-medium leading-6 tracking-[-0.084px] text-[hsl(var(--wex-primary))] hover:bg-transparent hover:text-[hsl(var(--wex-primary))]"
          >
            Skip
          </Button>
        </div>
      </form>

      <p className="text-center text-[12px] font-normal leading-4 text-muted-foreground">
        IMPORTANT: Please exercise caution when linking accounts, as this action cannot be undone.
        Ensure you are claiming accounts that belong to you or have proper authorization to access.
      </p>
    </div>
  )
}

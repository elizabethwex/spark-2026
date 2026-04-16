import { useEffect, useMemo, useRef, useState } from "react"
import type { CSSProperties } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@wexinc-healthbenefits/ben-ui-kit"
import {
  ACCOUNT_SELECTION_ALLOWED_ID,
  LINKED_ACCOUNT_IDS_SESSION_KEY,
  buildAccountGroupsForDisplay,
} from "@/components/login/accountSelectorConfig"
import { SelectAccountScreen } from "@/components/login/SelectAccountScreen"
import { useAuth } from "@/context/AuthContext"
import { usePrototype } from "@/context/PrototypeContext"
import type { LoginRouteState } from "@/components/login/loginFlowTypes"
import { cn } from "@/lib/utils"
import { loginFlowFooterBgClass } from "@/components/login/loginFlowTheme"

function readLinkedAccountIdsFromSession(): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = sessionStorage.getItem(LINKED_ACCOUNT_IDS_SESSION_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : []
  } catch {
    return []
  }
}

/**
 * Authenticated route at `/select-profile`: same "Select an Account" screen as login step 5,
 * including **Link Another Account** → `/login` at the account linking flow (step 6).
 */
export default function SelectProfilePage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { logoMode } = usePrototype()
  const accountContinueRef = useRef<HTMLButtonElement>(null)
  const wexLogoUrl = `${import.meta.env.BASE_URL}${logoMode === "acme" ? "acme-health-wex.svg" : "WEX_Logo_Red_Vector.svg"}`
  const loginBgUrl = `${import.meta.env.BASE_URL}wexbrand_loginbg.svg`
  const dunderMifflinLogoUrl = `${import.meta.env.BASE_URL}dundermifflin.png`
  const acmeLogoUrl = `${import.meta.env.BASE_URL}acme.png`

  const [selectedAccountId, setSelectedAccountId] = useState(ACCOUNT_SELECTION_ALLOWED_ID)
  /** Linked rows — synced from the login wizard via `sessionStorage` (see Login.tsx). */
  const linkedAccountIdsForSelector = useMemo(() => readLinkedAccountIdsFromSession(), [])

  const accountGroupsForDisplay = useMemo(
    () => buildAccountGroupsForDisplay(linkedAccountIdsForSelector),
    [linkedAccountIdsForSelector]
  )

  const canContinue =
    selectedAccountId === ACCOUNT_SELECTION_ALLOWED_ID ||
    selectedAccountId.startsWith("linked-")

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      accountContinueRef.current?.focus({ preventScroll: true })
    })
    return () => cancelAnimationFrame(id)
  }, [])

  const loginBgStyle: CSSProperties = {
    backgroundImage: `url(${loginBgUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundColor: "hsl(var(--background))",
  }

  const handleContinue = () => {
    if (!canContinue) return
    login()
    navigate("/")
  }

  const handleCancel = () => {
    navigate(-1)
  }

  const handleLinkAnotherAccount = () => {
    const state: LoginRouteState = { initialStep: 6 }
    navigate("/login", { state })
  }

  return (
    <div className="relative min-h-screen w-full">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 min-h-[100dvh] w-full"
        style={loginBgStyle}
      />

      <div className="relative z-10 flex min-h-screen min-h-[100dvh] flex-col">
        <div className="flex flex-1 flex-col items-center justify-start px-4 py-8">
          <Card
            variant="elevated"
            className="w-full max-w-[464px] overflow-hidden border-0"
            style={{ borderRadius: "16px" }}
          >
            <CardContent className="p-8" style={{ borderRadius: "16px" }}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-6 items-center">
                  <div className="h-8 w-24">
                    <img src={wexLogoUrl} alt="WEX" className="h-full w-full object-contain" />
                  </div>
                  <div className="flex flex-col items-center gap-[14px] text-center">
                    <h3 className="text-xl font-display font-semibold tracking-tight text-foreground">
                      Select an Account
                    </h3>
                    <p className="max-w-[328px] text-[16px] font-normal leading-6 tracking-[-0.176px] text-foreground">
                      Please select which account you&apos;d like to access.
                    </p>
                  </div>
                </div>

                <SelectAccountScreen
                  groups={accountGroupsForDisplay}
                  selectedAccountId={selectedAccountId}
                  onSelectAccount={setSelectedAccountId}
                  onLinkAnotherAccount={handleLinkAnotherAccount}
                  onContinue={handleContinue}
                  onCancel={handleCancel}
                  accountContinueRef={accountContinueRef}
                  canContinue={canContinue}
                  dunderMifflinLogoUrl={dunderMifflinLogoUrl}
                  acmeLogoUrl={acmeLogoUrl}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <footer className={cn("w-full px-[131px] py-[13px]", loginFlowFooterBgClass)}>
          <div className="flex flex-col items-center gap-[14px]">
            <div className="flex items-start gap-8 text-[11px] font-semibold leading-4 tracking-[0.055px] text-white">
              <button
                type="button"
                className="underline decoration-solid underline-offset-2 hover:no-underline"
              >
                Browser Requirements
              </button>
              <button
                type="button"
                className="underline decoration-solid underline-offset-2 hover:no-underline"
              >
                Contact Us
              </button>
              <button
                type="button"
                className="underline decoration-solid underline-offset-2 hover:no-underline"
              >
                Privacy Policy
              </button>
              <button
                type="button"
                className="underline decoration-solid underline-offset-2 hover:no-underline"
              >
                Accessibility Statement
              </button>
            </div>
            <div className="flex items-start gap-[42px]">
              <p className="text-center text-[11px] font-normal leading-4 tracking-[0.055px] text-white">
                Copyright 2005-2024. Powered by [Company name], a WEX Inc. Proprietary Web Product.
                All Rights Reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

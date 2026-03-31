import { useState, useEffect, useRef, useMemo } from "react"
import { Button, Card, CardContent, FloatLabel, toast } from "@wexinc-healthbenefits/ben-ui-kit"
import {
  Eye,
  EyeOff,
  AlertCircle,
  Mail,
  MessageSquare,
  ChevronRight,
  UserLock,
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/lib/utils"
import { AccountLinkingIntro } from "@/components/login/AccountLinkingIntro"
import { AccountLinkingVerifyAccess } from "@/components/login/AccountLinkingVerifyAccess"
import {
  LinkingAccountSummary,
  MATCHED_ACCOUNT_ROWS,
} from "@/components/login/accountLinkingShared"
import { SelectPrimaryAccount } from "@/components/login/SelectPrimaryAccount"
import { ConfirmAccountLinking } from "@/components/login/ConfirmAccountLinking"
import type { PrimaryOptionId } from "@/components/login/accountLinkingPrimary"

interface LoginProps {
  onLoginSuccess: () => void
}

/** Prototype email for MFA when the code is sent via email; shown masked in the read-only Email field. */
const MFA_EMAIL_DISPLAY_SOURCE = "ux-nicole@dundermifflin.com"

/** Prototype destination for account-linking MFA (step 8); masked like primary MFA. */
const LINK_MFA_EMAIL_DISPLAY_SOURCE = "nicole.jackson@gmail.com"

type LoginStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11

const ACCOUNT_GROUPS: {
  employerName: string
  accounts: { id: string; label: string; icon: "building" | "landmark" }[]
}[] = [
  {
    employerName: "Dunder Mifflin Paper Co.",
    accounts: [
      { id: "dm-reimb", label: "Reimbursement Account(s)", icon: "building" },
      { id: "dm-mbe", label: "My Benefit Express", icon: "building" },
    ],
  },
  {
    employerName: "ACME Company",
    accounts: [{ id: "acme-hsa", label: "Health Savings Account", icon: "landmark" }],
  },
]

/** Prototype: only Reimbursement Account(s) may continue; other selections keep Continue disabled. */
const ACCOUNT_SELECTION_ALLOWED_ID = "dm-reimb"

export default function Login({ onLoginSuccess }: LoginProps) {
  const { login } = useAuth()
  const wexLogoUrl = `${import.meta.env.BASE_URL}WEX_Logo_Red_Vector.svg`
  const loginBgUrl = `${import.meta.env.BASE_URL}wexbrand_loginbg.svg`
  const dunderMifflinLogoUrl = `${import.meta.env.BASE_URL}dundermifflin.png`
  const acmeLogoUrl = `${import.meta.env.BASE_URL}acme.png`
  const [step, setStep] = useState<LoginStep>(1)
  const [selectedAccountId, setSelectedAccountId] = useState(ACCOUNT_SELECTION_ALLOWED_ID)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [mfaCode, setMfaCode] = useState("")
  const [resendTimer, setResendTimer] = useState(13)
  const [generatedCode, setGeneratedCode] = useState("")
  const [codeError, setCodeError] = useState(false)
  const [selectedMfaMethod, setSelectedMfaMethod] = useState<'email' | 'sms'>('email')
  const [linkMfaCode, setLinkMfaCode] = useState("")
  const [linkGeneratedCode, setLinkGeneratedCode] = useState("")
  const [linkCodeError, setLinkCodeError] = useState(false)
  const [linkResendTimer, setLinkResendTimer] = useState(13)
  const [linkMfaMethod, setLinkMfaMethod] = useState<"email" | "sms">("email")

  const usernameInputRef = useRef<HTMLInputElement>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null)
  const mfaCodeInputRef = useRef<HTMLInputElement>(null)
  const methodEmailButtonRef = useRef<HTMLButtonElement>(null)
  const accountContinueRef = useRef<HTMLButtonElement>(null)
  const accountLinkingContinueRef = useRef<HTMLButtonElement>(null)
  const verifyLinkUsernameRef = useRef<HTMLInputElement>(null)
  const linkMfaCodeInputRef = useRef<HTMLInputElement>(null)
  const linkMethodEmailButtonRef = useRef<HTMLButtonElement>(null)
  const selectPrimaryRef = useRef<HTMLButtonElement>(null)
  const confirmAccountLinkingRef = useRef<HTMLButtonElement>(null)
  const [selectedPrimaryAccountId, setSelectedPrimaryAccountId] =
    useState<PrimaryOptionId>("ux-nicole")
  /** Matched account row ids successfully linked in this session — shown on account selector (step 5). */
  const [linkedAccountIdsForSelector, setLinkedAccountIdsForSelector] = useState<string[]>([])
  const [pendingLinkAccountIds, setPendingLinkAccountIds] = useState<string[]>([])
  const prevStepRef = useRef<LoginStep>(step)

  /** Dismiss prototype MFA code toasts (Sonner) when leaving an MFA entry step. */
  useEffect(() => {
    const prev = prevStepRef.current
    if ((prev === 3 || prev === 8) && step !== 3 && step !== 8) {
      toast.dismiss()
    }
    prevStepRef.current = step
  }, [step])

  /** Account linking (steps 6–8, 10): reset scroll from prior step so the view starts at the top. */
  useEffect(() => {
    if (step !== 6 && step !== 7 && step !== 8 && step !== 10 && step !== 11)
      return
    window.scrollTo({ top: 0, left: 0, behavior: "auto" })
  }, [step])

  /** Move focus to the primary field for the current step after the step UI mounts. */
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (step === 1) usernameInputRef.current?.focus()
      else if (step === 2) passwordInputRef.current?.focus()
      else if (step === 3) mfaCodeInputRef.current?.focus()
      else if (step === 4) methodEmailButtonRef.current?.focus()
      else if (step === 5) accountContinueRef.current?.focus()
      else if (step === 6)
        accountLinkingContinueRef.current?.focus({ preventScroll: true })
      else if (step === 7)
        verifyLinkUsernameRef.current?.focus({ preventScroll: true })
      else if (step === 8) linkMfaCodeInputRef.current?.focus()
      else if (step === 9) linkMethodEmailButtonRef.current?.focus()
      else if (step === 10)
        selectPrimaryRef.current?.focus({ preventScroll: true })
    })
    return () => cancelAnimationFrame(id)
  }, [step])

  // Debug instrumentation (Debug Mode)
  useEffect(() => {
    const runId = 'pre-fix'
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/0f2d92c4-4c76-48a6-a34a-0a7a7699a103', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId,
        hypothesisId: 'H1',
        location: 'Login.tsx:initial',
        message: 'Login background asset resolved',
        data: {
          loginBg: loginBgUrl,
          baseUrl: import.meta.env.BASE_URL,
          windowPath: typeof window !== 'undefined' ? window.location.pathname : 'no-window'
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {})
    // #endregion
  }, [])

  // Debug instrumentation (asset reachability)
  useEffect(() => {
    const runId = 'pre-fix'
    const targetUrl = loginBgUrl

    // #region agent log
    fetch(targetUrl, { method: 'HEAD' })
      .then((res) => {
        fetch('http://127.0.0.1:7242/ingest/0f2d92c4-4c76-48a6-a34a-0a7a7699a103', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: 'debug-session',
            runId,
            hypothesisId: 'H1',
            location: 'Login.tsx:head-check',
            message: 'HEAD check for login background',
            data: { targetUrl, status: res.status, resolvedUrl: res.url },
            timestamp: Date.now(),
          }),
        }).catch(() => {})
      })
      .catch((err) => {
        fetch('http://127.0.0.1:7242/ingest/0f2d92c4-4c76-48a6-a34a-0a7a7699a103', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: 'debug-session',
            runId,
            hypothesisId: 'H1',
            location: 'Login.tsx:head-check',
            message: 'HEAD check failed',
            data: { targetUrl, error: String(err) },
            timestamp: Date.now(),
          }),
        }).catch(() => {})
      })
    // #endregion

    const img = new Image()
    img.onload = () => {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/0f2d92c4-4c76-48a6-a34a-0a7a7699a103', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: 'debug-session',
          runId,
          hypothesisId: 'H1',
          location: 'Login.tsx:image-load',
          message: 'Background image load success',
          data: { targetUrl },
          timestamp: Date.now(),
        }),
      }).catch(() => {})
      // #endregion
    }
    img.onerror = () => {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/0f2d92c4-4c76-48a6-a34a-0a7a7699a103', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: 'debug-session',
          runId,
          hypothesisId: 'H1',
          location: 'Login.tsx:image-load',
          message: 'Background image load failed',
          data: { targetUrl },
          timestamp: Date.now(),
        }),
      }).catch(() => {})
      // #endregion
    }
    img.src = targetUrl
  }, [])

  // Generate code when entering Step 3
  useEffect(() => {
    if (step === 3) {
      const code = Math.floor(10000 + Math.random() * 90000).toString()
      setGeneratedCode(code)
      setCodeError(false)
      setMfaCode("")
      
      toast(`Your MFA code is: ${code}`, {
        duration: 30000,
        position: 'top-right'
      })
    }
  }, [step])

  // Handle countdown timer
  useEffect(() => {
    if (step === 3 && resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [step, resendTimer])

  // Generate code when entering account-linking MFA (step 8)
  useEffect(() => {
    if (step !== 8) return
    const code = Math.floor(10000 + Math.random() * 90000).toString()
    setLinkGeneratedCode(code)
    setLinkCodeError(false)
    setLinkMfaCode("")
    setLinkResendTimer(13)
    toast(`Your MFA code is: ${code}`, {
      duration: 30000,
      position: "top-right",
    })
  }, [step])

  // Countdown for account-linking MFA resend (step 8)
  useEffect(() => {
    if (step === 8 && linkResendTimer > 0) {
      const timer = setTimeout(() => setLinkResendTimer(linkResendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [step, linkResendTimer])

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      setStep(2)
    }
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Validate credentials (both prototype accounts share the same experience).
    // Username/password checks are case-insensitive so copy/paste and casing variants still work.
    const trimmedUsername = username.trim()
    const usernameLower = trimmedUsername.toLowerCase()
    const isValidUsername =
      usernameLower === "ux@wex.com" || usernameLower === "ux-nicole"
    const passwordOk =
      password.trim().toLowerCase() === "uxprototype123!"
    const isValidCredentials = isValidUsername && passwordOk
    
    if (!isValidCredentials) {
      setPasswordError(true)
      return
    }
    
    // Credentials are valid, proceed to MFA step
    setPasswordError(false)
    setStep(3)
  }

  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (mfaCode.trim() === generatedCode) {
      setCodeError(false)
      setStep(5)
    } else {
      // Code doesn't match - show error
      setCodeError(true)
    }
  }

  const handleResendCode = () => {
    if (resendTimer === 0) {
      // Generate new code
      const code = Math.floor(10000 + Math.random() * 90000).toString()
      setGeneratedCode(code)
      setCodeError(false)
      setMfaCode("")
      setResendTimer(13)
      
      // Show new code in toast
      toast(`Your new MFA code is: ${code}`, {
        duration: 30000,
        position: 'top-right'
      })
    }
  }

  const handleEditUsername = () => {
    setStep(1)
  }

  const handleTryAnotherMethod = () => {
    setStep(4)
  }

  const handleAccountSelectionContinue = () => {
    const canProceed =
      selectedAccountId === ACCOUNT_SELECTION_ALLOWED_ID ||
      selectedAccountId.startsWith("linked-")
    if (!canProceed) return
    login()
    onLoginSuccess()
  }

  const canContinueAccountSelection =
    selectedAccountId === ACCOUNT_SELECTION_ALLOWED_ID ||
    selectedAccountId.startsWith("linked-")

  const accountGroupsForDisplay = useMemo(() => {
    if (linkedAccountIdsForSelector.length === 0) return ACCOUNT_GROUPS
    const groups = ACCOUNT_GROUPS.map((g) => ({
      ...g,
      accounts: [...g.accounts],
    }))
    const dmIdx = groups.findIndex(
      (g) => g.employerName === "Dunder Mifflin Paper Co."
    )
    if (dmIdx === -1) return groups
    for (const linkId of linkedAccountIdsForSelector) {
      const row = MATCHED_ACCOUNT_ROWS.find((r) => r.id === linkId)
      if (!row) continue
      const selectorId = `linked-${linkId}`
      if (groups[dmIdx].accounts.some((a) => a.id === selectorId)) continue
      groups[dmIdx].accounts.push({
        id: selectorId,
        label: row.productLabel,
        icon: "building" as const,
      })
    }
    return groups
  }, [linkedAccountIdsForSelector])

  const handleAccountSelectionCancel = () => {
    setStep(3)
  }

  const handleAccountLinkingContinue = (selectedIds: string[]) => {
    if (selectedIds.length === 0) return
    setPendingLinkAccountIds(selectedIds)
    setStep(7)
  }

  const handleVerifyAccessContinue = () => {
    setStep(8)
  }

  const handleLinkMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (linkMfaCode.trim() === linkGeneratedCode) {
      setLinkCodeError(false)
      setLinkedAccountIdsForSelector((prev) => [
        ...new Set([...prev, ...pendingLinkAccountIds]),
      ])
      setPendingLinkAccountIds([])
      setStep(10)
    } else {
      setLinkCodeError(true)
    }
  }

  const handleLinkResendCode = () => {
    if (linkResendTimer === 0) {
      const code = Math.floor(10000 + Math.random() * 90000).toString()
      setLinkGeneratedCode(code)
      setLinkCodeError(false)
      setLinkMfaCode("")
      setLinkResendTimer(13)
      toast(`Your new MFA code is: ${code}`, {
        duration: 30000,
        position: "top-right",
      })
    }
  }

  const handleLinkTryAnotherMethod = () => {
    setStep(9)
  }

  const handleLinkMethodSelect = (method: "email" | "sms") => {
    setLinkMfaMethod(method)
    const code = Math.floor(10000 + Math.random() * 90000).toString()
    setLinkGeneratedCode(code)
    setLinkCodeError(false)
    setLinkMfaCode("")
    setLinkResendTimer(13)
    toast(`Your MFA code is: ${code}`, {
      duration: 30000,
      position: "top-right",
    })
    setStep(8)
  }

  const handleVerifyAccessSkip = () => {
    setPendingLinkAccountIds([])
    setStep(5)
  }

  const handleAccountLinkingNotNow = () => {
    setStep(5)
  }

  const handleSelectPrimaryMakePrimary = (selectedId: PrimaryOptionId) => {
    setSelectedPrimaryAccountId(selectedId)
    setStep(11)
  }

  const handleSelectPrimaryCancel = () => {
    setStep(5)
  }

  const handleConfirmAccountLinking = () => {
    const firstLinked = linkedAccountIdsForSelector[0]
    if (firstLinked) {
      setSelectedAccountId(`linked-${firstLinked}`)
    }
    setStep(5)
  }

  const handleConfirmAccountLinkingCancel = () => {
    setStep(10)
  }

  const handleMethodSelect = (method: 'email' | 'sms') => {
    setSelectedMfaMethod(method)
    // Generate new code
    const code = Math.floor(10000 + Math.random() * 90000).toString()
    setGeneratedCode(code)
    setCodeError(false)
    setMfaCode("")
    setResendTimer(13)
    
    // Show toast with new code
    toast(`Your MFA code is: ${code}`, {
      duration: 30000,
      position: 'top-right'
    })
    
    // Return to Step 3
    setStep(3)
  }

  const maskUsername = (value: string): string => {
    if (value.includes('@')) {
      // Email masking: show first 4 chars + ****** + domain with ****
      const [local, domain] = value.split('@')
      const maskedLocal = local.substring(0, 4) + '******'
      const maskedDomain = domain.substring(0, 5) + '*****'
      return `${maskedLocal}@${maskedDomain}`
    } else {
      // Phone masking: show first 3 + ****** + last 2
      return value.substring(0, 3) + '******' + value.slice(-2)
    }
  }

  const maskPhoneForSms = (): string => {
    // SMS phone masking: show XXXXXX + last 4 digits
    // For prototype purposes, generate a mock phone number display
    return 'XXXXXX8789'
  }

  return (
    <div 
      className="min-h-screen w-full relative overflow-hidden"
      style={{ 
        backgroundImage: `url(${loginBgUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#f0f4f8'
      }}
    >

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Login Card */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          {/* variant="elevated" = large shadow (shadow-lg, hover:shadow-xl) per ben-ui-kit; inline radius overrides kit token */}
          <Card
            variant="elevated"
            className={cn(
              "w-full overflow-hidden border-0",
              step === 5 || step === 6 || step === 7 || step === 8 || step === 10 || step === 11
                ? "max-w-[464px]"
                : "max-w-[402px]"
            )}
            style={{ borderRadius: "16px" }}
          >
            <CardContent className="p-8" style={{ borderRadius: "16px" }}>
              <div className="flex flex-col gap-6">
                {/* Logo + Title + Subtext */}
                <div className="flex flex-col gap-6 items-center">
                  <div
                    className={
                      step === 5 || step === 6 || step === 7 || step === 8 || step === 10 || step === 11
                        ? "h-8 w-24"
                        : "w-[150px] h-[50px]"
                    }
                  >
                    <img src={wexLogoUrl} alt="WEX" className="w-full h-full object-contain" />
                  </div>
                  <div
                    className={cn(
                      "flex flex-col items-center text-center",
                      step === 5 || step === 6 || step === 7 || step === 8 || step === 10 || step === 11
                        ? "gap-[14px]"
                        : "gap-2"
                    )}
                  >
                    <h3 className="text-xl font-display font-semibold text-foreground tracking-tight">
                      {step === 1
                        ? "Welcome"
                        : step === 2
                          ? "Enter Your Password"
                          : step === 3 || step === 8
                            ? "Verify Your Identity"
                            : step === 4 || step === 9
                              ? "Keep Your Account Safe"
                              : step === 5
                                ? "Select an Account"
                                : step === 6
                                  ? "Unlinked Accounts"
                                  : step === 7
                                    ? "Verify Your Access"
                                    : step === 10
                                      ? "Select Primary Account"
                                      : step === 11
                                        ? "Confirm Account Linking"
                                        : ""}
                    </h3>
                    {step !== 11 && (
                    <p
                      className={cn(
                        "text-[16px] font-normal leading-6 tracking-[-0.176px] text-foreground",
                        step === 6 || step === 7
                          ? "w-full max-w-none"
                          : "max-w-[328px]"
                      )}
                    >
                      {step === 1
                        ? "Please enter your username to login"
                        : step === 2
                          ? "Please enter your password to login"
                          : step === 3
                            ? selectedMfaMethod === "sms"
                              ? "We've sent a text message to"
                              : "We've sent an email with your code to the email address you have on file."
                            : step === 4
                              ? "Select an authentication method"
                              : step === 5
                                ? "Please select which account you'd like to access."
                                : step === 6
                                  ? "We found other benefits accounts that may belong to you. Link them to access and manage everything in one place."
                                  : step === 7
                                    ? "To link this account, please verify your access by entering your account credentials."
                                    : step === 8
                                      ? linkMfaMethod === "sms"
                                        ? "We've sent a text message to"
                                        : "We've sent an email with your code to the email address you have on file."
                                      : step === 9
                                        ? "Select an authentication method"
                                        : step === 10
                                          ? "You'll use the credentials from this selected account to login to all accounts moving forward."
                                          : ""}
                    </p>
                    )}
                  </div>
                </div>

                {/* Step 1: Username/Email Form */}
                {step === 1 && (
                  <>
                    <form onSubmit={handleUsernameSubmit} className="flex flex-col gap-6">
                      {/* Input Field with Floating Label */}
                      <FloatLabel
                        ref={usernameInputRef}
                        label="Username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        size="lg"
                        className="text-[16px] leading-6 tracking-[-0.176px]"
                      />

                      <div className="w-full text-left">
                        <button
                          type="button"
                          className="text-[14px] font-normal leading-6 tracking-[-0.084px] text-[hsl(var(--wex-primary))] hover:underline"
                        >
                          Forgot Username
                        </button>
                      </div>

                      {/* Continue Button */}
                      <Button
                        type="submit"
                        className="w-full h-10 rounded-lg text-[14px] font-medium leading-6 tracking-[-0.084px]"
                      >
                        Continue
                      </Button>
                    </form>

                    {/* OR — Continue with Passkey */}
                    <div className="flex flex-col gap-5 w-full">
                      <div className="flex items-center gap-3 w-full" aria-hidden="true">
                        <div className="h-px flex-1 bg-border min-w-0" />
                        <span className="text-xs font-semibold uppercase tracking-[0.06em] text-muted-foreground shrink-0">
                          OR
                        </span>
                        <div className="h-px flex-1 bg-border min-w-0" />
                      </div>
                      <Button
                        type="button"
                        intent="primary"
                        variant="outline"
                        size="md"
                        className="inline-flex w-full h-10 items-center justify-center gap-2 rounded-lg text-[14px] font-medium leading-6 tracking-[-0.084px] border-border text-foreground hover:bg-muted/50"
                      >
                        <UserLock className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                        Continue with Passkey
                      </Button>
                    </div>

                    {/* Sign Up Link */}
                    <div className="flex gap-2 items-center justify-start text-[16px] leading-6 tracking-[-0.176px]">
                      <p className="text-muted-foreground">Don't have an account?</p>
                      <button
                        type="button"
                        className="text-[hsl(var(--wex-primary))] hover:underline cursor-pointer font-normal"
                      >
                        Register
                      </button>
                    </div>
                  </>
                )}

                {/* Step 2: Password Form */}
                {step === 2 && (
                  <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-[21px]">
                    {/* Username Display Field (read-only with Edit) */}
                    <div className="relative">
                      <FloatLabel
                        label="Username"
                        type="text"
                        value={username}
                        readOnly
                        size="lg"
                        className="text-[16px] leading-6 tracking-[-0.176px] pr-16 cursor-default"
                      />
                      <button
                        type="button"
                        onClick={handleEditUsername}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[14px] text-[hsl(var(--wex-primary))] hover:underline"
                      >
                        Edit
                      </button>
                    </div>

                    {/* Password Input with Eye Icon */}
                    <div className="flex flex-col gap-[30px]">
                      <div className="flex flex-col gap-1">
                        <FloatLabel
                          ref={passwordInputRef}
                          label="Password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value)
                            setPasswordError(false) // Clear error on input
                          }}
                          size="lg"
                          invalid={passwordError}
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
                        {passwordError && (
                          <p className="text-[12px] text-[hsl(var(--wex-destructive))] px-3 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Invalid username or password
                          </p>
                        )}
                      </div>

                      {/* Forgot Password Link */}
                      <button
                        type="button"
                        className="text-left text-[14px] font-normal leading-6 tracking-[-0.084px] text-[hsl(var(--wex-primary))] hover:underline"
                      >
                        Forgot password
                      </button>
                    </div>

                    {/* Continue Button */}
                    <Button
                      type="submit"
                      className="w-full h-10 rounded-lg text-[14px] font-medium leading-6 tracking-[-0.084px]"
                    >
                      Continue
                    </Button>
                  </form>
                )}

                {/* Step 3: MFA Verification */}
                {step === 3 && (
                  <form onSubmit={handleMfaSubmit} className="flex flex-col gap-[21px]">
                    {/* Masked Email/Phone Field (read-only) */}
                    <FloatLabel
                      label={selectedMfaMethod === 'sms' ? "Mobile number" : "Email"}
                      type="text"
                      value={
                        selectedMfaMethod === "sms"
                          ? maskPhoneForSms()
                          : maskUsername(MFA_EMAIL_DISPLAY_SOURCE)
                      }
                      readOnly
                      size="lg"
                      className="text-[16px] leading-6 tracking-[-0.176px] cursor-default"
                    />

                {/* Code Input Field */}
                <div className="flex flex-col gap-1">
                  <FloatLabel
                    ref={mfaCodeInputRef}
                    label="Enter the code"
                    type="text"
                    value={mfaCode}
                    onChange={(e) => {
                      setMfaCode(e.target.value)
                      setCodeError(false) // Clear error on input
                    }}
                    size="lg"
                    invalid={codeError}
                    className="text-[16px] leading-6 tracking-[-0.176px]"
                  />
                  {codeError && (
                    <p className="text-[12px] text-[hsl(var(--wex-destructive))] px-3 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      The code you entered is invalid
                    </p>
                  )}
                </div>

                    {/* Continue Button */}
                    <Button
                      type="submit"
                      className="w-full h-10 rounded-lg text-[14px] font-medium leading-6 tracking-[-0.084px]"
                    >
                      Continue
                    </Button>

                    {/* Resend Code Text with Timer */}
                    <p className="text-[16px] leading-6 tracking-[-0.176px] text-foreground">
                      Didn't receive an email?{" "}
                      {resendTimer > 0 ? (
                        <span className="font-semibold">
                          Send again in 00:{resendTimer.toString().padStart(2, '0')}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendCode}
                          className="font-semibold text-[hsl(var(--wex-primary))] hover:underline"
                        >
                          Send again
                        </button>
                      )}
                    </p>

                    {/* Try Another Method Link */}
                    <button
                      type="button"
                      onClick={handleTryAnotherMethod}
                      className="text-[16px] font-semibold leading-6 tracking-[-0.176px] text-[hsl(var(--wex-primary))] hover:underline text-left"
                    >
                      Try another method
                    </button>
                  </form>
                )}

                {/* Step 4: Method Selection */}
                {step === 4 && (
                  <div className="flex flex-col gap-4">
                      {/* Email Option */}
                      <button
                        ref={methodEmailButtonRef}
                        type="button"
                        onClick={() => handleMethodSelect('email')}
                        className="w-full"
                      >
                        <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-[hsl(var(--wex-primary))] hover:bg-accent transition-colors cursor-pointer">
                          <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-foreground" />
                            <span className="text-[16px] font-normal leading-6 tracking-[-0.176px] text-foreground">
                              Email Address
                            </span>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </button>

                      {/* SMS Option */}
                      <button
                        type="button"
                        onClick={() => handleMethodSelect('sms')}
                        className="w-full"
                      >
                        <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-[hsl(var(--wex-primary))] hover:bg-accent transition-colors cursor-pointer">
                          <div className="flex items-center gap-3">
                            <MessageSquare className="h-5 w-5 text-foreground" />
                            <span className="text-[16px] font-normal leading-6 tracking-[-0.176px] text-foreground">
                              SMS
                            </span>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </button>
                  </div>
                )}

                {/* Step 5: Account selection (after MFA) — Consumer-Experience Redesign / Login Account Selector */}
                {step === 5 && (
                  <div className="flex w-full flex-col gap-6">
                    <div className="flex flex-col gap-6">
                      {accountGroupsForDisplay.map((group) => (
                        <div key={group.employerName} className="flex flex-col gap-4">
                          <p className="w-full text-left text-base font-bold leading-6 tracking-[-0.176px] text-foreground">
                            {group.employerName}
                          </p>
                          <div className="flex flex-col gap-4">
                            {group.accounts.map((account) => {
                              const selected = selectedAccountId === account.id
                              return (
                                <button
                                  key={account.id}
                                  type="button"
                                  aria-pressed={selected}
                                  onClick={() => setSelectedAccountId(account.id)}
                                  className={cn(
                                    "flex w-full items-center gap-4 rounded-lg border px-4 py-2 text-left transition-colors",
                                    selected
                                      ? "border-[hsl(var(--wex-primary))] bg-[hsl(var(--wex-primary)/0.08)]"
                                      : "border-border bg-card hover:bg-accent/50"
                                  )}
                                >
                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded border border-border bg-background">
                                    {account.icon === "building" ? (
                                      <img
                                        src={dunderMifflinLogoUrl}
                                        alt=""
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      <img
                                        src={acmeLogoUrl}
                                        alt=""
                                        className="h-full w-full object-cover"
                                      />
                                    )}
                                  </div>
                                  <span className="text-[14px] font-normal leading-6 tracking-[-0.084px] text-foreground">
                                    {account.label}
                                  </span>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setStep(6)}
                      className="w-full text-left text-[14px] font-normal leading-6 tracking-[-0.084px] text-[hsl(var(--wex-primary))] hover:underline"
                    >
                      Link Another Account
                    </button>

                    <div className="flex flex-col gap-[17px]">
                      <Button
                        ref={accountContinueRef}
                        type="button"
                        disabled={!canContinueAccountSelection}
                        onClick={handleAccountSelectionContinue}
                        className="h-10 w-full rounded-lg text-[14px] font-medium leading-6 tracking-[-0.084px]"
                      >
                        Continue
                      </Button>
                      <Button
                        type="button"
                        intent="primary"
                        variant="outline"
                        onClick={handleAccountSelectionCancel}
                        className="h-10 w-full rounded-lg text-[14px] font-medium leading-6 tracking-[-0.084px] border-[hsl(var(--wex-primary))] text-[hsl(var(--wex-primary))] hover:bg-muted/50"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 6: Account linking — Unlinked Accounts (Figma 27732:25237) */}
                {step === 6 && (
                  <AccountLinkingIntro
                    primaryUsername={username.trim() || "ux-nicole"}
                    onContinue={handleAccountLinkingContinue}
                    onNotNow={handleAccountLinkingNotNow}
                    onAddAnotherAccount={() =>
                      toast("Add another account", { position: "top-right" })
                    }
                    continueRef={accountLinkingContinueRef}
                  />
                )}

                {step === 7 && (
                  <AccountLinkingVerifyAccess
                    row={
                      MATCHED_ACCOUNT_ROWS.find(
                        (r) => r.id === pendingLinkAccountIds[0]
                      ) ?? MATCHED_ACCOUNT_ROWS[1]
                    }
                    onContinue={handleVerifyAccessContinue}
                    onSkip={handleVerifyAccessSkip}
                    usernameInputRef={verifyLinkUsernameRef}
                  />
                )}

                {/* Step 8: Verify identity for the account being linked (mirrors step 3) */}
                {step === 8 && (
                  <div className="flex w-full flex-col gap-8">
                    <LinkingAccountSummary
                      row={
                        MATCHED_ACCOUNT_ROWS.find(
                          (r) => r.id === pendingLinkAccountIds[0]
                        ) ?? MATCHED_ACCOUNT_ROWS[1]
                      }
                    />
                    <form
                      onSubmit={handleLinkMfaSubmit}
                      className="flex flex-col gap-[21px]"
                    >
                    <FloatLabel
                      label={linkMfaMethod === "sms" ? "Mobile number" : "Email"}
                      type="text"
                      value={
                        linkMfaMethod === "sms"
                          ? maskPhoneForSms()
                          : maskUsername(LINK_MFA_EMAIL_DISPLAY_SOURCE)
                      }
                      readOnly
                      size="lg"
                      className="text-[16px] leading-6 tracking-[-0.176px] cursor-default"
                    />

                    <div className="flex flex-col gap-1">
                      <FloatLabel
                        ref={linkMfaCodeInputRef}
                        label="Enter the code"
                        type="text"
                        value={linkMfaCode}
                        onChange={(e) => {
                          setLinkMfaCode(e.target.value)
                          setLinkCodeError(false)
                        }}
                        size="lg"
                        invalid={linkCodeError}
                        className="text-[16px] leading-6 tracking-[-0.176px]"
                      />
                      {linkCodeError && (
                        <p className="text-[12px] text-[hsl(var(--wex-destructive))] px-3 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          The code you entered is invalid
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-[17px]">
                    <Button
                      type="submit"
                      className="w-full h-10 rounded-lg text-[14px] font-medium leading-6 tracking-[-0.084px]"
                    >
                      Continue
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleVerifyAccessSkip}
                      className="h-10 w-full rounded-lg text-[14px] font-medium leading-6 tracking-[-0.084px] text-[hsl(var(--wex-primary))] hover:bg-transparent hover:text-[hsl(var(--wex-primary))]"
                    >
                      Skip
                    </Button>
                    </div>

                    <p className="text-[16px] leading-6 tracking-[-0.176px] text-foreground">
                      Didn&apos;t receive an email?{" "}
                      {linkResendTimer > 0 ? (
                        <span className="font-semibold">
                          Send again in 00:{linkResendTimer.toString().padStart(2, "0")}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleLinkResendCode}
                          className="font-semibold text-[hsl(var(--wex-primary))] hover:underline"
                        >
                          Send again
                        </button>
                      )}
                    </p>

                    <button
                      type="button"
                      onClick={handleLinkTryAnotherMethod}
                      className="text-[16px] font-semibold leading-6 tracking-[-0.176px] text-[hsl(var(--wex-primary))] hover:underline text-left"
                    >
                      Try another method
                    </button>
                    </form>
                  </div>
                )}

                {/* Step 9: Authentication method for linked-account MFA (mirrors step 4) */}
                {step === 9 && (
                  <div className="flex flex-col gap-4">
                    <button
                      ref={linkMethodEmailButtonRef}
                      type="button"
                      onClick={() => handleLinkMethodSelect("email")}
                      className="w-full"
                    >
                      <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-[hsl(var(--wex-primary))] hover:bg-accent transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-foreground" />
                          <span className="text-[16px] font-normal leading-6 tracking-[-0.176px] text-foreground">
                            Email Address
                          </span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLinkMethodSelect("sms")}
                      className="w-full"
                    >
                      <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-[hsl(var(--wex-primary))] hover:bg-accent transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <MessageSquare className="h-5 w-5 text-foreground" />
                          <span className="text-[16px] font-normal leading-6 tracking-[-0.176px] text-foreground">
                            SMS
                          </span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </button>
                  </div>
                )}

                {step === 10 && (
                  <SelectPrimaryAccount
                    sessionUsername={username.trim() || "ux-nicole"}
                    onMakePrimary={handleSelectPrimaryMakePrimary}
                    onCancel={handleSelectPrimaryCancel}
                    makePrimaryRef={selectPrimaryRef}
                  />
                )}

                {step === 11 && (
                  <ConfirmAccountLinking
                    sessionUsername={username.trim() || "ux-nicole"}
                    selectedPrimary={selectedPrimaryAccountId}
                    onConfirm={handleConfirmAccountLinking}
                    onCancel={handleConfirmAccountLinkingCancel}
                    confirmRef={confirmAccountLinkingRef}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="bg-[hsl(var(--wex-primary-hover))] w-full py-[13px] px-[131px]">
          <div className="flex flex-col gap-[14px] items-center">
            {/* Footer Links */}
            <div className="flex gap-8 items-start text-[11px] font-semibold leading-4 tracking-[0.055px] text-white">
              <button className="underline decoration-solid underline-offset-2 hover:no-underline">
                Browser Requirements
              </button>
              <button className="underline decoration-solid underline-offset-2 hover:no-underline">
                Contact Us
              </button>
              <button className="underline decoration-solid underline-offset-2 hover:no-underline">
                Privacy Policy
              </button>
              <button className="underline decoration-solid underline-offset-2 hover:no-underline">
                Accessibility Statement
              </button>
            </div>
            {/* Copyright */}
            <div className="flex gap-[42px] items-start">
              <p className="text-[11px] font-normal leading-4 tracking-[0.055px] text-white text-center">
                Copyright 2005-2024. Powered by [Company name], a WEX Inc. Proprietary Web Product. All Rights Reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}


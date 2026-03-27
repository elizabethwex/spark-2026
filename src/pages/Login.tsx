import { useState, useEffect } from "react"
import { Button, Card, CardContent, FloatLabel, toast } from "@wexinc-healthbenefits/ben-ui-kit"
import { Eye, EyeOff, AlertCircle, Mail, MessageSquare, ChevronRight, UserLock } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

interface LoginProps {
  onLoginSuccess: () => void
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const { login } = useAuth()
  const wexLogoUrl = `${import.meta.env.BASE_URL}WEX_Logo_Red_Vector.svg`
  const loginBgUrl = `${import.meta.env.BASE_URL}wexbrand_loginbg.svg`
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [mfaCode, setMfaCode] = useState("")
  const [resendTimer, setResendTimer] = useState(13)
  const [generatedCode, setGeneratedCode] = useState("")
  const [codeError, setCodeError] = useState(false)
  const [selectedMfaMethod, setSelectedMfaMethod] = useState<'email' | 'sms'>('email')

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
      // Code matches - success
      setCodeError(false)
      // Set authenticated state
      login()
      // Call success callback to redirect
      onLoginSuccess()
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
            className="w-full max-w-[402px] overflow-hidden border-0"
            style={{ borderRadius: "16px" }}
          >
            <CardContent className="p-8" style={{ borderRadius: "16px" }}>
              <div className="flex flex-col gap-6">
                {/* Logo + Title + Subtext */}
                <div className="flex flex-col gap-6 items-center">
                  <div className="w-[150px] h-[50px]">
                    <img src={wexLogoUrl} alt="WEX" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex flex-col gap-2 items-center text-center">
                    <h1 className="text-[18px] font-semibold leading-6 tracking-[-0.252px] text-foreground">
                      {step === 1 ? "Welcome" : step === 2 ? "Enter your password" : step === 3 ? "Verify your identity" : "Keep your account safe"}
                    </h1>
                    <p className="text-[16px] font-normal leading-6 tracking-[-0.176px] text-foreground max-w-[328px]">
                      {step === 1 
                        ? "Please enter your username to log into WEX Health & Benefits"
                        : step === 2
                        ? "Please enter your password to log into WEX Health & Benefits"
                        : step === 3
                        ? (selectedMfaMethod === 'sms' ? "We've sent a text message to" : "We've sent an email with your code to")
                        : "Select an authentication method"}
                    </p>
                  </div>
                </div>

                {/* Step 1: Username/Email Form */}
                {step === 1 && (
                  <>
                    <form onSubmit={handleUsernameSubmit} className="flex flex-col gap-6">
                      {/* Input Field with Floating Label */}
                      <FloatLabel
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
                      value={selectedMfaMethod === 'sms' ? maskPhoneForSms() : maskUsername(username)}
                      readOnly
                      size="lg"
                      className="text-[16px] leading-6 tracking-[-0.176px] cursor-default"
                    />

                {/* Code Input Field */}
                <div className="flex flex-col gap-1">
                  <FloatLabel
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


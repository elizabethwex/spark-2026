import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@wexinc-healthbenefits/ben-ui-kit";
import {
  Bell,
  Camera,
  CheckCircle2,
  FileText,
  Upload,
} from "lucide-react";
import { AiChatInput } from "@/components/ui/ai-chat-input";
import {
  SPARK_MEMBER_FIRST_NAME,
  sparkAccountQuickActions,
} from "@/data/sparkAiForwardMock";
import { useReimburseWorkspace } from "@/context/ReimburseWorkspaceContext";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import QRCode from "react-qr-code";
import { ShineBorder } from "@/components/ui/shine-border";

type UploadPhase = "default" | "options" | "uploading" | "success";

const softEaseOut: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

/**
 * SPARK-2026 AI-forward hero: WEXly + "Your next steps" task insight (Figma).
 */
export function SparkAiForwardHero({ activeView = 1 }: { activeView?: 1 | 2 | 3 }) {
  const navigate = useNavigate();
  const { openReimburseWorkspace } = useReimburseWorkspace();
  const prefersReducedMotion = useReducedMotion();
  const [uploadPhase, setUploadPhase] = useState<UploadPhase>("default");
  const [isTaskVisible, setIsTaskVisible] = useState(true);
  const [isHeroExpanded, setIsHeroExpanded] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadPhase("uploading");
    }
  };

  const claimAccountText = 
    activeView === 1 ? "Limited Purpose FSA" : 
    activeView === 2 ? "Healthcare FSA" : 
    "HSA";

  const quickActions = sparkAccountQuickActions.map(action => {
    if (activeView === 2 && action.label === "HSA Store") {
      return { ...action, label: "FSA Store" };
    }
    return action;
  });

  useEffect(() => {
    if (uploadPhase === "uploading") {
      const timer = setTimeout(() => setUploadPhase("success"), 2500);
      return () => clearTimeout(timer);
    }
  }, [uploadPhase]);

  useEffect(() => {
    if (!isTaskVisible && !isHeroExpanded) {
      const timer = setTimeout(() => {
        setIsHeroExpanded(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isTaskVisible, isHeroExpanded]);

  // Check session storage synchronously so the first render has the correct state
  const [isFirstVisit] = useState(() => {
    if (typeof window !== "undefined") {
      if (import.meta.env.DEV) return true;
      return !sessionStorage.getItem("sparkHeroVisited");
    }
    return false;
  });

  useEffect(() => {
    if (isFirstVisit) {
      sessionStorage.setItem("sparkHeroVisited", "true");
    }
  }, [isFirstVisit]);

  const shouldAnimate = isFirstVisit && !prefersReducedMotion;

  const restrainedSpring = {
    type: "spring" as const,
    stiffness: 200,
    damping: 20,
  };

  const layoutSpring = {
    type: "spring" as const,
    stiffness: 220,
    damping: 24,
    mass: 0.9,
  };

  const phaseTransition = {
    duration: 0.32,
    ease: softEaseOut,
  };

  const phasePresenceMotion = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -6 },
    transition: phaseTransition,
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 4 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: softEaseOut },
    },
    instant: { opacity: 1, y: 0 },
  };

  const greetingVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, delay: 0.1, ease: softEaseOut },
    },
    instant: { opacity: 1, y: 0 },
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, delay: 0.25, ease: softEaseOut },
    },
    instant: { opacity: 1, y: 0 },
  };

  const pillsContainerVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, delay: 0.25, ease: softEaseOut },
    },
    instant: { opacity: 1, y: 0 },
  };

  const pillsWrapperVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.25,
        staggerChildren: 0.03,
      },
    },
    instant: { opacity: 1 },
  };

  const pillVariants = {
    hidden: { opacity: 0, x: -8 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: softEaseOut },
    },
    instant: { opacity: 1, x: 0 },
  };

  const dividerDesktopVariants = {
    hidden: { opacity: 0, scaleY: 0 },
    visible: {
      opacity: 1,
      scaleY: 1,
      transition: { duration: 0.3, delay: 0.4, ease: softEaseOut },
    },
    instant: { opacity: 1, scaleY: 1 },
  };

  const dividerMobileVariants = {
    hidden: { opacity: 0, scaleX: 0 },
    visible: {
      opacity: 1,
      scaleX: 1,
      transition: { duration: 0.3, delay: 0.4, ease: softEaseOut },
    },
    instant: { opacity: 1, scaleX: 1 },
  };

  const ctaHeaderVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, delay: 0.5, ease: softEaseOut },
    },
    instant: { opacity: 1, y: 0 },
  };

  const ctaCardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      boxShadow: "0 2px 4px rgba(18,24,29,0.1)",
    },
    visible: {
      opacity: 1,
      y: 0,
      boxShadow:
        "0 0 1px rgba(18,24,29,0.2), 0 12px 16px rgba(18,24,29,0.08), 0 4px 6px rgba(18,24,29,0.03)",
      transition: { delay: 0.5, ...restrainedSpring },
    },
    instant: {
      opacity: 1,
      y: 0,
      boxShadow:
        "0 0 1px rgba(18,24,29,0.2), 0 12px 16px rgba(18,24,29,0.08), 0 4px 6px rgba(18,24,29,0.03)",
    },
  };

  const animateState = shouldAnimate ? "visible" : "instant";

  return (
    <motion.div
      layout
      transition={{ layout: layoutSpring }}
      initial={shouldAnimate ? "hidden" : "instant"}
      animate={animateState}
      variants={containerVariants}
      className="spark-hero-root group relative isolate z-40 flex flex-col lg:flex-row w-full items-center lg:items-stretch justify-center gap-6 lg:gap-[32px] rounded-[24px] lg:rounded-[32px] border border-[#e3e7f4] p-6 sm:p-8 lg:p-[41px] shadow-[0_1.5px_4.5px_rgba(43,49,78,0.04)] bg-white [filter:drop-shadow(0_0_0_transparent)]"
      style={{
        backgroundImage:
          "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 1200 523.5\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(176.49 0 0 51.824 -48 157.05)\\'><stop stop-color=\\'rgba(23,45,161,0.09)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(23,45,161,0)\\' offset=\\'0.5\\'/></radialGradient></defs></svg>'), url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 1200 523.5\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(176.49 0 0 55.526 1248 392.62)\\'><stop stop-color=\\'rgba(200,16,46,0.07)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(200,16,46,0)\\' offset=\\'0.45\\'/></radialGradient></defs></svg>'), url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 1200 523.5\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(93.338 0 0 103.65 660 732.9)\\'><stop stop-color=\\'rgba(23,45,161,0.04)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(23,45,161,0)\\' offset=\\'0.4\\'/></radialGradient></defs></svg>'), linear-gradient(90deg, rgba(255, 255, 255, 0.93) 0%, rgba(255, 255, 255, 0.93) 100%)",
      }}
    >
      <ShineBorder
        borderWidth={1.5}
        duration={18}
        color={["#25146f", "#c8102e", "#25146f"]}
        className="absolute inset-0 pointer-events-none p-0 border-none bg-transparent dark:bg-transparent shadow-none z-50 rounded-[24px] lg:rounded-[32px]"
      >
        {null}
      </ShineBorder>
      {/* Left Column: AI Assist */}
      <motion.div
        layout
        transition={{ layout: layoutSpring }}
        className="flex w-full lg:flex-1 flex-col gap-[24px]"
      >
        <motion.div
          variants={greetingVariants}
          className="flex flex-col gap-[16px]"
        >
          <div
            className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full shadow-[0_1.057px_3.17px_rgba(2,13,36,0.2),0_0_0.528px_rgba(2,13,36,0.3)]"
            style={{
              backgroundImage:
                "linear-gradient(133.514deg, rgb(37, 20, 111) 2.4625%, rgb(200, 16, 46) 100%)",
            }}
          >
            <svg
              width="16.9"
              height="16.9"
              viewBox="0 0 24 24"
              fill="none"
              className="shrink-0"
            >
              <path d="M13.913 13.9149L11.9997 24.0033L10.087 13.9149L0 12.0013L10.087 10.0884L12.0003 0L13.913 10.0884L24 12.0013L13.913 13.9149Z" fill="white"/>
              <path d="M20.2758 19.7969L19.5994 23.3628L18.923 19.7969L15.3569 19.1204L18.923 18.4439L19.5994 14.8781L20.2752 18.4439L23.8412 19.1204L20.2758 19.7969Z" fill="white"/>
            </svg>
          </div>

          <div className="flex flex-col gap-[8px]">
            <h2 className="text-[40px] font-semibold leading-[56px] tracking-[-0.88px] text-foreground">
              Good morning, {SPARK_MEMBER_FIRST_NAME}
            </h2>
            <p className="text-[19px] leading-[32px] tracking-[-0.304px] text-[#5f6a94]">
              Benefits can be confusing, we can help make them simple.
            </p>
          </div>
        </motion.div>

        <motion.div variants={inputVariants}>
          <AiChatInput />
        </motion.div>

        <motion.div
          variants={pillsContainerVariants}
          className="flex flex-col gap-[16px]"
        >
          <p className="text-[12px] font-black uppercase leading-[16px] tracking-[2.4px] text-[#5f6a94]">
            Based on your account
          </p>
          <motion.div
            variants={pillsWrapperVariants}
            className="flex flex-wrap gap-[16px]"
          >
            {quickActions.map((action) => {
              const Icon = action.icon;
              const isInactive = action.label === "Send Payment";
              return (
                <motion.button
                  variants={pillVariants}
                  key={action.label}
                  type="button"
                  disabled={isInactive}
                  onClick={() => {
                    if (isInactive) return;
                    if (action.href === "/reimburse") {
                      openReimburseWorkspace();
                      return;
                    }
                    if (/^https?:\/\//i.test(action.href)) {
                      window.open(action.href, "_blank", "noopener,noreferrer");
                      return;
                    }
                    navigate(action.href);
                  }}
                  className="flex h-[38.5px] items-center gap-[7px] rounded-[28px] border border-[#b7c0da] bg-[#f8f9fe] px-[13.25px] transition-colors hover:border-[#5f6a94] hover:bg-[#eef2ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3958c3] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-[#b7c0da] disabled:hover:bg-[#f8f9fe]"
                >
                  <Icon className="h-[15.75px] w-[15.75px] shrink-0 text-[#5f6a94]" />
                  <span className="text-[15.75px] font-medium text-[#5f6a94]">
                    {action.label}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {!isHeroExpanded && (
          <motion.div
            layout
            transition={{ layout: layoutSpring }}
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              width: 0,
              height: 0,
              margin: 0,
              padding: 0,
              overflow: "hidden",
              transition: { duration: 0.42, ease: softEaseOut },
            }}
            className="flex flex-col lg:flex-row gap-6 lg:gap-[32px] items-center lg:items-stretch"
          >
            {/* Divider */}
            <motion.div
              variants={dividerDesktopVariants}
              style={{ originY: 0 }}
              className="hidden lg:block w-[1.5px] self-stretch shrink-0 bg-[#e3e7f4]"
            />
            <motion.div
              variants={dividerMobileVariants}
              style={{ originX: 0 }}
              className="block lg:hidden w-full h-[1.5px] shrink-0 bg-[#e3e7f4]"
            />

            {/* Right Column: Next Steps */}
            <motion.div
              layout
              transition={{ layout: layoutSpring }}
              className="flex w-full lg:w-[376px] shrink-0 flex-col gap-[8px]"
            >
              <motion.div
                layout="position"
                variants={ctaHeaderVariants}
                className="flex items-center gap-[8px]"
              >
                <Bell className="h-[18px] w-[18px] text-[#5f6a94] origin-top group-hover:animate-[ring_1.5s_ease-in-out]" />
                <h3 className="text-[12px] font-black uppercase leading-[16px] tracking-[2.4px] text-[#5f6a94]">
                  Your next steps
                </h3>
                <div className="rounded-[6px] bg-[#e1e8ff] px-[8px] py-[2px]">
                  <span className="text-[12px] font-bold leading-[16px] text-[#7a87b2]">
                    {isTaskVisible ? "1 Task" : "0 Tasks"}
                  </span>
                </div>
              </motion.div>

              <AnimatePresence mode="wait">
                {isTaskVisible ? (
                  <motion.div
                    key="task-card"
                    layout
                    transition={{ layout: layoutSpring }}
                    variants={ctaCardVariants}
                    initial={shouldAnimate ? "hidden" : "instant"}
                    animate={animateState}
                    exit={{ opacity: 0, y: -8, transition: phaseTransition }}
                    className="flex flex-col gap-[24px] rounded-[32px] border border-[#e2e8f0] bg-white p-[25px]"
                  >
              {/* ── Header area: contextual copy per phase ── */}
          <motion.div layout className="relative">
            <AnimatePresence mode="wait">
              {uploadPhase === "default" && (
                <motion.div
                  key="card-header-default"
                  layout
                  {...phasePresenceMotion}
                  className="flex flex-col gap-[12px]"
                >
                  <div className="self-start rounded-[6px] bg-[#ffbf00] px-[12px] py-[4px]">
                    <span className="text-[11px] font-extrabold uppercase leading-[16.5px] tracking-[0.275px] text-black">
                      28 days left to file
                    </span>
                  </div>
                  <h2 className="text-[24px] font-bold leading-[32px] tracking-[-0.456px] text-black">
                    Missing Documentation Required
                  </h2>
                  <p className="text-[16px] leading-[24.75px] text-[#5f6a94]">
                    Upload your documentation for Bigtown Dentistry in under a minute.
                  </p>
                </motion.div>
              )}

              {uploadPhase === "options" && (
                <motion.div
                  key="card-header-options"
                  layout
                  {...phasePresenceMotion}
                  className="flex flex-col gap-[16px]"
                >
                  <p className="text-[16px] leading-[24.75px] text-[#5f6a94]">
                    Upload your documentation for Bigtown Dentistry in under a minute.
                  </p>

                  <div className="flex flex-col gap-[12px] rounded-[24px] bg-[#f8f9fe] border border-[#e3e7f4] p-[17px]">
                    <p className="text-[13px] font-bold text-foreground">
                      Make sure your document includes:
                    </p>
                    <ul className="flex flex-col gap-[8px]">
                      {[
                        "Provider’s or merchant’s name",
                        "Date of service",
                        "Dollar amount",
                        "Category & type of service",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-[8px]">
                          <CheckCircle2 className="h-[16px] w-[16px] text-[#16a34a] shrink-0 mt-[2px]" />
                          <span className="text-[14px] tracking-tight leading-[20px] text-[#5f6a94]">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}

              {uploadPhase === "uploading" && (
                <motion.div
                  key="card-header-uploading"
                  layout
                  {...phasePresenceMotion}
                  className="flex flex-col"
                >
                  <p className="text-[16px] leading-[24.75px] text-[#5f6a94]">
                    Reviewing your documentation…
                  </p>
                </motion.div>
              )}

              {uploadPhase === "success" && (
                <motion.div
                  key="card-header-success"
                  layout
                  {...phasePresenceMotion}
                  className="flex flex-col gap-[4px]"
                >
                  <p className="text-[16px] font-semibold leading-[24.75px] text-[#16a34a]">
                    Documentation uploaded
                  </p>
                  <p className="text-[14px] leading-[22px] text-[#5f6a94]">
                    We've added it to this claim.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── Claim summary (hidden during options and uploading phases) ── */}
          <AnimatePresence mode="wait">
            {(uploadPhase === "default" || uploadPhase === "success") && (
              <motion.div
                key="claim-summary"
                layout
                {...phasePresenceMotion}
                className="flex items-center justify-between rounded-[24px] bg-[#f8f9fe] border border-[#f8f9fe] p-[17px]"
              >
                <div className="flex items-center gap-[16px]">
                  <div className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-[12px] border border-[#e2e8f0] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                    <FileText className="h-[18px] w-[18px] text-[#3958c3]" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[14px] font-bold leading-[24px] text-foreground">
                      Bigtown Dentistry
                    </p>
                    <p className="text-[12px] font-medium leading-[20px] text-[#5f6a94]">
                      4/27/26 • {claimAccountText}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-[16px] font-extrabold leading-[28px] tracking-[-0.5px] text-foreground">
                      $210.00
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Action area: 4 phases ── */}
          <motion.div layout className="relative">
            <AnimatePresence mode="wait">
              {uploadPhase === "default" && (
                <motion.div
                  key="action-default"
                  layout
                  {...phasePresenceMotion}
                  className="flex flex-col items-center gap-[16px]"
                >
                  <Button
                    type="button"
                    className="w-full gap-[7px] rounded-[12px] border-0 px-[13.25px] py-[9.75px] text-[15.75px] font-medium text-white hover:opacity-90 transition-opacity"
                    style={{
                      backgroundImage:
                        "linear-gradient(172.91deg, rgb(37, 20, 111) 2.4625%, rgb(200, 16, 46) 100%)",
                    }}
                    onClick={() => setUploadPhase("options")}
                  >
                    <Camera className="h-[15.75px] w-[15.75px] text-white" />
                    Upload Document
                  </Button>
                  <button
                    type="button"
                    className="text-[12px] font-medium leading-[16px] text-[#7a87b2] hover:underline"
                  >
                    Remind me tomorrow
                  </button>
                </motion.div>
              )}

              {uploadPhase === "options" && (
                <motion.div
                  key="action-options"
                  layout
                  {...phasePresenceMotion}
                  className="flex flex-col items-center gap-[12px] w-full min-h-[160px]"
                >
                    <div className="flex w-full items-center gap-[16px]">
                    <motion.div
                      className="flex flex-1 flex-col items-center gap-[8px]"
                      animate={{ scale: 1, y: 0 }}
                      transition={{ duration: 0.22, ease: softEaseOut }}
                    >
                      <motion.button
                        type="button"
                        onClick={() => setUploadPhase("uploading")}
                        whileTap={{ scale: 0.96 }}
                        animate={{
                          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                          borderColor: "#e2e8f0",
                          backgroundColor: "#ffffff",
                        }}
                        transition={{ duration: 0.2, ease: softEaseOut }}
                        className="rounded-[12px] border p-[8px] cursor-pointer"
                      >
                        <motion.div
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.28, ease: softEaseOut }}
                        >
                          <QRCode
                            value="https://wexinc.com/upload/claim/123"
                            size={80}
                          />
                        </motion.div>
                      </motion.button>
                      <motion.p
                        animate={{ color: "#14182c", opacity: 1 }}
                        transition={{ duration: 0.2, ease: softEaseOut }}
                        className="text-[11px] font-bold leading-tight text-center"
                      >
                        Scan with
                        <br />
                        phone
                      </motion.p>
                    </motion.div>

                    <motion.div
                      className="flex flex-col items-center gap-[6px] shrink-0"
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, ease: softEaseOut }}
                    >
                      <div className="w-[1px] h-[24px] bg-[#e3e7f4]" />
                      <span className="text-[10px] font-semibold uppercase tracking-[0.5px] text-[#b7c0da]">
                        or
                      </span>
                      <div className="w-[1px] h-[24px] bg-[#e3e7f4]" />
                    </motion.div>

                    <motion.div
                      className="flex flex-1 flex-col items-center gap-[8px]"
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.2, ease: softEaseOut }}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileChange}
                        accept="image/*,.pdf,.doc,.docx"
                      />
                      <motion.button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        aria-label="Upload Document"
                        title="Upload Document"
                        whileTap={{ scale: 0.96 }}
                        className="flex h-[96px] w-[96px] shrink-0 items-center justify-center rounded-[14px] border-2 border-[#b7c0da] bg-white text-[#5f6a94] shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-colors hover:border-[#5f6a94] hover:bg-[#eef2ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3958c3] focus-visible:ring-offset-2"
                      >
                        <Upload
                          className="h-9 w-9 shrink-0"
                          strokeWidth={1.75}
                          aria-hidden
                        />
                      </motion.button>
                      <p className="text-[11px] font-bold leading-tight text-foreground text-center">
                        Upload
                        <br />
                        Document
                      </p>
                    </motion.div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setUploadPhase("default")}
                    className="text-[12px] font-medium leading-[16px] text-[#7a87b2] hover:underline"
                  >
                    Back
                  </button>
                </motion.div>
              )}

              {uploadPhase === "uploading" && (
                <motion.div
                  key="action-uploading"
                  layout
                  {...phasePresenceMotion}
                  className="flex flex-col items-center justify-center gap-[16px] min-h-[160px]"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: softEaseOut }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.03, 1] }}
                      transition={{ duration: 1.4, ease: softEaseOut, repeat: Infinity }}
                    >
                      <svg
                        width="56"
                        height="56"
                        viewBox="0 0 56 56"
                        fill="none"
                        className="animate-[spin_1.35s_linear_infinite]"
                      >
                        <circle
                          cx="28"
                          cy="28"
                          r="24"
                          stroke="#e3e7f4"
                          strokeWidth="3"
                          fill="none"
                        />
                        <circle
                          cx="28"
                          cy="28"
                          r="24"
                          stroke="#3958c3"
                          strokeWidth="3"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray="80 200"
                          style={{
                            animation: "uploadSweep 1.35s ease-in-out infinite",
                          }}
                        />
                      </svg>
                    </motion.div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, delay: 0.08, ease: softEaseOut }}
                    className="flex flex-col items-center gap-[8px]"
                  >
                    <p className="text-[14px] font-medium text-[#5f6a94]">
                      Reviewing your documentation…
                    </p>
                    <div className="flex items-center gap-[6px] rounded-full bg-[#f8f9fe] px-[12px] py-[6px]">
                      {[0, 1, 2].map((dot) => (
                        <motion.span
                          key={dot}
                          className="h-[6px] w-[6px] rounded-full bg-[#9ca7c7]"
                          animate={{ opacity: [0.35, 1, 0.35], scale: [0.9, 1.1, 0.9] }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: dot * 0.14,
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                  <style>{`
                    @keyframes uploadSweep {
                      0% { stroke-dashoffset: 0; }
                      50% { stroke-dashoffset: -60; }
                      100% { stroke-dashoffset: -150; }
                    }
                  `}</style>
                </motion.div>
              )}

              {uploadPhase === "success" && (
                <motion.div
                  key="action-success"
                  layout
                  {...phasePresenceMotion}
                  className="flex flex-col items-center justify-center gap-[16px] min-h-[160px]"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.88, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.34, ease: softEaseOut }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{ duration: 0.6, delay: 0.16, ease: [0.2, 0, 0, 1] }}
                    >
                      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                        <circle
                          cx="28"
                          cy="28"
                          r="24"
                          fill="rgba(22,163,74,0.08)"
                          stroke="#16a34a"
                          strokeWidth="3"
                        />
                        <path
                          d="M18 28.5L24.5 35L38 21.5"
                          stroke="#16a34a"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                          style={{
                            strokeDasharray: 30,
                            strokeDashoffset: 30,
                            animation: "checkDraw 0.42s ease-out 0.12s forwards",
                          }}
                        />
                      </svg>
                    </motion.div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, delay: 0.14, ease: softEaseOut }}
                    className="flex flex-col items-center gap-[4px]"
                  >
                    <p className="text-[14px] font-semibold text-[#16a34a]">
                      Documentation uploaded
                    </p>
                    <p className="text-[12px] text-[#5f6a94]">
                      We've added it to this claim.
                    </p>
                  </motion.div>
                  <motion.button
                    type="button"
                    onClick={() => setIsTaskVisible(false)}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.24, delay: 0.24, ease: softEaseOut }}
                    className="mt-[8px] rounded-[12px] bg-[#f8f9fe] border border-[#e3e7f4] px-[16px] py-[8px] text-[14px] font-medium text-[#5f6a94] hover:bg-[#eef2ff] hover:text-[#3958c3] transition-colors"
                  >
                    Close
                  </motion.button>
                  <style>{`
                    @keyframes checkDraw {
                      to { stroke-dashoffset: 0; }
                    }
                  `}</style>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
          ) : (
            <motion.div
              key="empty-state"
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={phaseTransition}
              className="flex flex-col items-center justify-center gap-[16px] rounded-[32px] border border-[#e2e8f0] bg-white p-[32px] text-center min-h-[200px]"
            >
              <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#eef2ff]">
                <CheckCircle2 className="h-[24px] w-[24px] text-[#3958c3]" />
              </div>
              <div className="flex flex-col gap-[4px]">
                <p className="text-[16px] font-semibold text-foreground">
                  You're all caught up!
                </p>
                <p className="text-[14px] text-[#5f6a94]">
                  No pending tasks at the moment.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {uploadPhase === "default" && isTaskVisible && (
            <motion.div
              key="caught-up-message"
              variants={ctaHeaderVariants}
              exit={{ opacity: 0, height: 0, paddingTop: 0, transition: { duration: 0.3 } }}
              className="flex items-center justify-center gap-[8px] pt-2 overflow-hidden"
            >
              <CheckCircle2 className="h-[18px] w-[18px] text-[#9ca7c7]" />
              <p className="text-[14px] leading-[24px] tracking-[-0.084px] text-[#9ca7c7]">
                You're all caught up on other tasks
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

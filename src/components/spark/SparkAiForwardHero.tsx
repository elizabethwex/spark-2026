import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@wexinc-healthbenefits/ben-ui-kit";
import {
  Bell,
  Camera,
  CheckCircle2,
  FileText,
  Upload,
} from "lucide-react";
import { WexAiSparkleMark } from "@/components/ui/wex-ai-sparkle-mark";
import { AiChatInput } from "@/components/ui/ai-chat-input";
import {
  SPARK_MEMBER_FIRST_NAME,
  sparkAccountQuickActions,
} from "@/data/sparkAiForwardMock";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import QRCode from "react-qr-code";

type UploadPhase = "default" | "options" | "uploading" | "success";

const softEaseOut: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

/**
 * SPARK-2026 AI-forward hero: Assist IQ + "Your next steps" task insight (Figma).
 */
export function SparkAiForwardHero() {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const [uploadPhase, setUploadPhase] = useState<UploadPhase>("default");

  useEffect(() => {
    if (uploadPhase === "uploading") {
      const timer = setTimeout(() => setUploadPhase("success"), 2500);
      return () => clearTimeout(timer);
    }
    if (uploadPhase === "success") {
      const timer = setTimeout(() => setUploadPhase("default"), 2000);
      return () => clearTimeout(timer);
    }
  }, [uploadPhase]);

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
      initial={shouldAnimate ? "hidden" : "instant"}
      animate={animateState}
      variants={containerVariants}
      className="spark-hero-root relative flex flex-col lg:flex-row w-full items-center lg:items-stretch justify-center gap-6 lg:gap-[32px] rounded-[24px] lg:rounded-[32px] border border-[#e3e7f4] p-6 sm:p-8 lg:p-[41px] shadow-[0_1.5px_4.5px_rgba(43,49,78,0.04)]"
      style={{
        backgroundImage:
          "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 1200 523.5\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(176.49 0 0 51.824 -48 157.05)\\'><stop stop-color=\\'rgba(23,45,161,0.09)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(23,45,161,0)\\' offset=\\'0.5\\'/></radialGradient></defs></svg>'), url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 1200 523.5\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(176.49 0 0 55.526 1248 392.62)\\'><stop stop-color=\\'rgba(200,16,46,0.07)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(200,16,46,0)\\' offset=\\'0.45\\'/></radialGradient></defs></svg>'), url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 1200 523.5\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(93.338 0 0 103.65 660 732.9)\\'><stop stop-color=\\'rgba(23,45,161,0.04)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(23,45,161,0)\\' offset=\\'0.4\\'/></radialGradient></defs></svg>'), linear-gradient(90deg, rgba(255, 255, 255, 0.93) 0%, rgba(255, 255, 255, 0.93) 100%)",
      }}
    >
      {/* Left Column: AI Assist */}
      <div className="flex w-full lg:flex-1 flex-col gap-[24px]">
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
            <WexAiSparkleMark size="16.9px" />
          </div>

          <div className="flex flex-col gap-[8px]">
            <h2 className="text-[40px] font-semibold leading-[56px] tracking-[-0.88px] text-[#14182c]">
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
            {sparkAccountQuickActions.map((action) => {
              const Icon = action.icon;
              return (
                <motion.button
                  variants={pillVariants}
                  key={action.label}
                  type="button"
                  onClick={() => navigate(action.href)}
                  className="flex h-[38.5px] items-center gap-[7px] rounded-[28px] border border-[#b7c0da] bg-[#f8f9fe] px-[13.25px] transition-colors hover:border-[#5f6a94] hover:bg-[#eef2ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3958c3] focus-visible:ring-offset-2"
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
      </div>

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
      <div className="flex w-full lg:w-[376px] shrink-0 flex-col gap-[8px]">
        <motion.div
          variants={ctaHeaderVariants}
          className="flex items-center gap-[8px]"
        >
          <Bell className="h-[18px] w-[18px] text-[#5f6a94]" />
          <h3 className="text-[12px] font-black uppercase leading-[16px] tracking-[2.4px] text-[#5f6a94]">
            Your next steps
          </h3>
          <div className="rounded-[6px] bg-[#e1e8ff] px-[8px] py-[2px]">
            <span className="text-[12px] font-bold leading-[16px] text-[#7a87b2]">
              1 Task
            </span>
          </div>
        </motion.div>

        <motion.div
          variants={ctaCardVariants}
          className="flex flex-col gap-[24px] rounded-[32px] border border-[#e2e8f0] bg-white p-[25px]"
        >
          {/* ── Header area: contextual copy per phase ── */}
          <div className="relative">
            <AnimatePresence mode="popLayout">
              {uploadPhase === "default" && (
                <motion.div
                  key="card-header-default"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{
                    duration: 0.4,
                    ease: [0.2, 0, 0, 1],
                  }}
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
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{
                    duration: 0.4,
                    ease: [0.2, 0, 0, 1],
                  }}
                  className="flex flex-col gap-[16px]"
                >
                  <p className="text-[16px] leading-[24.75px] text-[#5f6a94]">
                    Upload your documentation for Bigtown Dentistry in under a minute.
                  </p>

                  <div className="flex flex-col gap-[12px] rounded-[24px] bg-[#f8f9fe] border border-[#e3e7f4] p-[17px]">
                    <p className="text-[13px] font-bold text-[#14182c]">
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
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{
                    duration: 0.4,
                    ease: [0.2, 0, 0, 1],
                  }}
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
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{
                    duration: 0.4,
                    ease: [0.2, 0, 0, 1],
                  }}
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
          </div>

          {/* ── Claim summary (hidden during options phase) ── */}
          {uploadPhase !== "options" && (
            <div className="flex items-center justify-between rounded-[24px] bg-[#f8f9fe] border border-[#f8f9fe] p-[17px]">
              <div className="flex items-center gap-[16px]">
                <div className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-[12px] border border-[#e2e8f0] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                  <FileText className="h-[18px] w-[18px] text-[#3958c3]" />
                </div>
                <div className="flex flex-col">
                  <p className="text-[14px] font-bold leading-[24px] text-[#14182c]">
                    Bigtown Dentistry
                  </p>
                  <p className="text-[12px] font-medium leading-[20px] text-[#5f6a94]">
                    Yesterday • FSA Account
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-[16px] font-extrabold leading-[28px] tracking-[-0.5px] text-[#14182c]">
                    $210.00
                </p>
              </div>
            </div>
          )}

          {/* ── Action area: 4 phases ── */}
          <div className="relative">
            <AnimatePresence mode="popLayout">
              {uploadPhase === "default" && (
                <motion.div
                  key="action-default"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{
                    duration: 0.4,
                    ease: [0.2, 0, 0, 1],
                  }}
                  className="flex flex-col items-center justify-center gap-[16px] min-h-[160px]"
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
                    <Camera className="h-[15.75px] w-[15.75px]" />
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
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{
                    duration: 0.4,
                    ease: [0.2, 0, 0, 1],
                  }}
                  className="flex flex-col items-center gap-[12px] w-full min-h-[160px]"
                >
                  <div className="flex w-full items-center gap-[16px]">
                    <div className="flex flex-1 flex-col items-center gap-[8px]">
                      <motion.button
                        type="button"
                        onClick={() => setUploadPhase("uploading")}
                        whileTap={{ scale: 0.96 }}
                        className="p-[8px] bg-white rounded-[12px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-[#e2e8f0] cursor-pointer transition-opacity hover:opacity-80"
                      >
                        <QRCode
                          value="https://wexinc.com/upload/claim/123"
                          size={80}
                        />
                      </motion.button>
                      <p className="text-[11px] font-bold leading-tight text-[#14182c] text-center">
                        Scan with
                        <br />
                        phone
                      </p>
                    </div>

                    <div className="flex flex-col items-center gap-[6px] shrink-0">
                      <div className="w-[1px] h-[24px] bg-[#e3e7f4]" />
                      <span className="text-[10px] font-semibold uppercase tracking-[0.5px] text-[#b7c0da]">
                        or
                      </span>
                      <div className="w-[1px] h-[24px] bg-[#e3e7f4]" />
                    </div>

                    <div className="flex flex-1 flex-col items-center gap-[8px]">
                      <motion.button
                        type="button"
                        onClick={() => navigate("/reimburse")}
                        aria-label="Take photo or upload"
                        title="Take photo or upload"
                        whileTap={{ scale: 0.96 }}
                        className="flex h-[96px] w-[96px] shrink-0 items-center justify-center rounded-[14px] border-2 border-[#b7c0da] bg-white text-[#5f6a94] shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-colors hover:border-[#5f6a94] hover:bg-[#eef2ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3958c3] focus-visible:ring-offset-2"
                      >
                        <Upload
                          className="h-9 w-9 shrink-0"
                          strokeWidth={1.75}
                          aria-hidden
                        />
                      </motion.button>
                      <p className="text-[11px] font-bold leading-tight text-[#14182c] text-center">
                        Take photo
                        <br />
                        or upload
                      </p>
                    </div>
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
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{
                    duration: 0.4,
                    ease: [0.2, 0, 0, 1],
                  }}
                  className="flex flex-col items-center justify-center gap-[16px] min-h-[160px]"
                >
                  <svg
                    width="56"
                    height="56"
                    viewBox="0 0 56 56"
                    fill="none"
                    className="animate-[spin_1.2s_linear_infinite]"
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
                        animation: "uploadSweep 1.2s ease-in-out infinite",
                      }}
                    />
                  </svg>
                  <p className="text-[14px] font-medium text-[#5f6a94]">
                    Reviewing your documentation…
                  </p>
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
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{
                    duration: 0.4,
                    ease: [0.2, 0, 0, 1],
                  }}
                  className="flex flex-col items-center justify-center gap-[16px] min-h-[160px]"
                >
                  <motion.div
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 0.6, delay: 0.4, ease: [0.2, 0, 0, 1] }}
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
                          animation: "checkDraw 0.4s ease-out 0.15s forwards",
                        }}
                      />
                    </svg>
                  </motion.div>
                  <div className="flex flex-col items-center gap-[4px]">
                    <p className="text-[14px] font-semibold text-[#16a34a]">
                      Documentation uploaded
                    </p>
                    <p className="text-[12px] text-[#5f6a94]">
                      We've added it to this claim.
                    </p>
                  </div>
                  <style>{`
                    @keyframes checkDraw {
                      to { stroke-dashoffset: 0; }
                    }
                  `}</style>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <AnimatePresence>
          {uploadPhase === "default" && (
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
      </div>
    </motion.div>
  );
}

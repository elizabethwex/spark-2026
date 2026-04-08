import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  FileText,
  TrendingUp,
  DollarSign,
  Mic,
  Send,
  PawPrint,
} from "lucide-react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { type SimulationMode } from "@/lib/simulatedExpenses";

const BRAND_LINEAR_GRADIENT =
  "linear-gradient(172.91deg, rgb(37, 20, 111) 2.4625%, rgb(200, 16, 46) 100%)";

const softEaseOut: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

interface QuickAction {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const QUICK_ACTIONS: QuickAction[] = [
  { label: "View Statement", href: "/enrollment/statement", icon: FileText },
  { label: "Learn About HSA", href: "#", icon: TrendingUp },
  { label: "Reimburse Myself", href: "/reimburse", icon: DollarSign },
];

interface Props {
  memberName: string;
  showHsaInvestCta: boolean;
  simulationMode?: SimulationMode;
}

export function AssistantIQHero({ memberName, showHsaInvestCta, simulationMode = "modern" }: Props) {
  const isSimulated = simulationMode === "simulated";
  const isCobra = simulationMode === "cobra";
  const isCobraEnroll = simulationMode === "cobraEnroll";
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const [isTaskVisible, setIsTaskVisible] = useState(true);
  const [isHeroExpanded, setIsHeroExpanded] = useState(false);

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
      return !sessionStorage.getItem("enrollHomeHeroVisited");
    }
    return false;
  });

  useEffect(() => {
    if (isFirstVisit) {
      sessionStorage.setItem("enrollHomeHeroVisited", "true");
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
  const hasTask = showHsaInvestCta && isTaskVisible;

  return (
    <motion.div
      layout
      initial={shouldAnimate ? "hidden" : "instant"}
      animate={animateState}
      variants={containerVariants}
      className="spark-hero-root relative flex flex-col lg:flex-row w-full items-center lg:items-stretch justify-center gap-6 lg:gap-[32px] rounded-[24px] lg:rounded-[32px] border border-[#e3e7f4] p-6 sm:p-8 lg:p-[41px] shadow-[0_1.5px_4.5px_rgba(43,49,78,0.04)] overflow-hidden"
      style={{
        backgroundImage:
          "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 1200 523.5\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(176.49 0 0 51.824 -48 157.05)\\'><stop stop-color=\\'rgba(23,45,161,0.09)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(23,45,161,0)\\' offset=\\'0.5\\'/></radialGradient></defs></svg>'), url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 1200 523.5\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(176.49 0 0 55.526 1248 392.62)\\'><stop stop-color=\\'rgba(200,16,46,0.07)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(200,16,46,0)\\' offset=\\'0.45\\'/></radialGradient></defs></svg>'), url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 1200 523.5\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(93.338 0 0 103.65 660 732.9)\\'><stop stop-color=\\'rgba(23,45,161,0.04)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(23,45,161,0)\\' offset=\\'0.4\\'/></radialGradient></defs></svg>'), linear-gradient(90deg, rgba(255, 255, 255, 0.93) 0%, rgba(255, 255, 255, 0.93) 100%)",
      }}
    >
      {/* Left Column: AI Assist */}
      <motion.div layout className="flex w-full lg:flex-1 flex-col gap-[24px]">
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
              viewBox="0 0 17 17"
              fill="none"
              className="shrink-0"
            >
              <path
                d="M8.5 0.5L9.65 5.35L14.5 6.5L9.65 7.65L8.5 12.5L7.35 7.65L2.5 6.5L7.35 5.35L8.5 0.5Z"
                fill="white"
              />
              <path
                d="M13.25 10.75L13.69 12.31L15.25 12.75L13.69 13.19L13.25 14.75L12.81 13.19L11.25 12.75L12.81 12.31L13.25 10.75Z"
                fill="white"
              />
            </svg>
          </div>

          <div className="flex flex-col gap-[8px]">
            <h2 className="text-[40px] font-semibold leading-[56px] tracking-[-0.88px] text-[#14182c]">
              {getGreeting()}, {memberName}
            </h2>
            <p className="text-[19px] leading-[32px] tracking-[-0.304px] text-[#5f6a94]">
              {isCobraEnroll
                ? "You have a qualifying life event. Enroll in COBRA to continue your coverage."
                : isCobra
                  ? "Your COBRA coverage is active. Here's a summary of your benefits and costs."
                  : isSimulated
                    ? "You're halfway through your plan year. Here's how your benefits are tracking."
                    : "Benefits can be confusing, we can help make them simple."}
            </p>
          </div>
        </motion.div>

        <motion.div variants={inputVariants}>
          <div className="flex items-center justify-between rounded-[32px] border border-[#e3e7f4] bg-white py-[11px] pl-[25px] pr-[17px]">
            <input
              type="text"
              placeholder="Ask me anything about your benefits..."
              className="w-full border-0 bg-transparent text-[14px] text-[#14182c] outline-none placeholder:text-[#7a87b2]"
              readOnly
            />
            <div className="flex items-center gap-[8px]">
              <div className="flex h-[35px] w-[35px] shrink-0 cursor-pointer items-center justify-center rounded-[28px] border border-[#eef2ff] bg-[#eef2ff] transition-colors hover:bg-[#e0e7ff]">
                <Mic className="h-[14px] w-[14px] text-[#3958c3]" />
              </div>
              <div
                className="flex h-[35px] w-[35px] shrink-0 cursor-pointer items-center justify-center rounded-[28px] border border-[#25146f] transition-all hover:bg-[rgba(37,20,111,0.2)]"
                style={{
                  backgroundImage:
                    "linear-gradient(133.514deg, rgba(37, 20, 111, 0.1) 2.4625%, rgba(200, 16, 46, 0.1) 100%)",
                }}
              >
                <Send className="h-[14px] w-[14px] text-[#25146f]" />
              </div>
            </div>
          </div>
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
            {QUICK_ACTIONS.map((action) => {
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
      </motion.div>

      <AnimatePresence>
        {!isHeroExpanded && (
          <motion.div
            layout
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              width: 0,
              height: 0,
              margin: 0,
              padding: 0,
              overflow: "hidden",
              transition: { duration: 0.5, ease: softEaseOut },
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
                    {hasTask ? "1 Task" : "0 Tasks"}
                  </span>
                </div>
              </motion.div>

              <AnimatePresence mode="wait">
                {hasTask ? (
                  <motion.div
                    key="task-card"
                    variants={ctaCardVariants}
                    initial={shouldAnimate ? "hidden" : "instant"}
                    animate={animateState}
                    exit={{
                      opacity: 0,
                      scale: 0.95,
                      transition: { duration: 0.2 },
                    }}
                    className="flex flex-col gap-[24px] rounded-[32px] border border-[#e2e8f0] bg-white p-[25px]"
                  >
                    {isCobraEnroll ? (
                      <>
                        <div className="flex flex-col gap-[12px]">
                          <span
                            className="inline-flex self-start items-center gap-1 rounded-[6px] text-[11px] font-extrabold uppercase px-[12px] py-[4px]"
                            style={{ backgroundColor: "#FFF7ED", color: "#C2410C" }}
                          >
                            <ClipboardList className="h-3 w-3" />
                            Enrollment Required
                          </span>
                          <h2 className="text-[24px] font-bold leading-[32px] tracking-[-0.456px] text-black">
                            Enrollment Required
                          </h2>
                          <p className="text-[16px] leading-[24.75px] text-[#5f6a94]">
                            You need to complete your COBRA benefits enrollment
                            to access your coverage and account features.
                          </p>
                        </div>

                        <div className="flex flex-col gap-[12px]">
                          <button
                            type="button"
                            className="w-full rounded-xl py-3.5 px-4 flex items-center justify-center gap-2 text-white font-semibold text-[15px] shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(37,20,111)] focus-visible:ring-offset-2"
                            style={{ background: BRAND_LINEAR_GRADIENT }}
                          >
                            Start Enrollment
                            <ChevronRight className="h-4 w-4 shrink-0 opacity-90" />
                          </button>
                        </div>
                      </>
                    ) : isCobra ? (
                      <>
                        <div className="flex flex-col gap-[12px]">
                          <span
                            className="inline-flex self-start items-center gap-1 rounded-[6px] text-[11px] font-extrabold uppercase px-[12px] py-[4px]"
                            style={{ backgroundColor: "#FFFBEB", color: "#B45309" }}
                          >
                            <Clock className="h-3 w-3" />
                            Upcoming Payment Due
                          </span>
                          <h2 className="text-[24px] font-bold leading-[32px] tracking-[-0.456px] text-black">
                            Upcoming Payment Due
                          </h2>
                          <p className="text-[16px] leading-[24.75px] text-[#5f6a94]">
                            Your next continuation coverage premium payment of{" "}
                            <span className="font-bold text-[#14182c]">$1,000.00</span>{" "}
                            is due soon
                          </p>
                          <span className="inline-flex self-start items-center gap-1 text-[12px] font-semibold text-amber-600">
                            <Calendar className="h-3.5 w-3.5" />
                            Due May 1, 2026
                          </span>
                        </div>

                        <div className="flex flex-col gap-[12px]">
                          <button
                            type="button"
                            className="w-full rounded-xl py-3.5 px-4 flex items-center justify-center gap-2 text-white font-semibold text-[15px] shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(37,20,111)] focus-visible:ring-offset-2"
                            style={{ background: BRAND_LINEAR_GRADIENT }}
                          >
                            Pay Now
                            <ChevronRight className="h-4 w-4 shrink-0 opacity-90" />
                          </button>
                          <button
                            type="button"
                            className="text-center text-[12px] font-medium leading-[16px] text-[#7a87b2] hover:underline"
                            onClick={() => setIsTaskVisible(false)}
                          >
                            Remind me later
                          </button>
                        </div>
                      </>
                    ) : isSimulated ? (
                      <>
                        <div className="flex flex-col gap-[12px]">
                          <span
                            className="inline-flex self-start items-center gap-1 rounded-[6px] text-[11px] font-extrabold uppercase px-[12px] py-[4px]"
                            style={{ backgroundColor: "#FFF7ED", color: "#C2410C" }}
                          >
                            <PawPrint className="h-3 w-3" />
                            New Benefit
                          </span>
                          <h2 className="text-[24px] font-bold leading-[32px] tracking-[-0.456px] text-black">
                            Enroll in Pet Insurance
                          </h2>
                          <p className="text-[16px] leading-[24.75px] text-[#5f6a94]">
                            Protect your furry family members with discounted
                            group rates. Cover vet visits, accidents, and
                            illnesses — plans start at $12/month.
                          </p>
                        </div>

                        <div className="flex flex-col gap-[12px]">
                          <button
                            type="button"
                            className="w-full rounded-xl py-3.5 px-4 flex items-center justify-center gap-2 text-white font-semibold text-[15px] shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(37,20,111)] focus-visible:ring-offset-2"
                            style={{ background: BRAND_LINEAR_GRADIENT }}
                          >
                            Explore Pet Plans
                            <ChevronRight className="h-4 w-4 shrink-0 opacity-90" />
                          </button>
                          <button
                            type="button"
                            className="text-center text-[12px] font-medium leading-[16px] text-[#7a87b2] hover:underline"
                            onClick={() => setIsTaskVisible(false)}
                          >
                            Not interested
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-col gap-[12px]">
                          <span
                            className="inline-flex self-start items-center gap-1 rounded-[6px] text-[11px] font-extrabold uppercase px-[12px] py-[4px]"
                            style={{ backgroundColor: "#EEF2FF", color: "#3958C3" }}
                          >
                            <TrendingUp className="h-3 w-3" />
                            Recommended
                          </span>
                          <h2 className="text-[24px] font-bold leading-[32px] tracking-[-0.456px] text-black">
                            Invest in your HSA
                          </h2>
                          <p className="text-[16px] leading-[24.75px] text-[#5f6a94]">
                            You&apos;re enrolled in an HDHP — your HSA is ready to
                            grow. Set up investments to make the most of your
                            tax-free savings.
                          </p>
                        </div>

                        <div className="flex flex-col gap-[12px]">
                          <button
                            type="button"
                            className="w-full rounded-xl py-3.5 px-4 flex items-center justify-center gap-2 text-white font-semibold text-[15px] shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(37,20,111)] focus-visible:ring-offset-2"
                            style={{ background: BRAND_LINEAR_GRADIENT }}
                          >
                            Set Up Investments
                            <ChevronRight className="h-4 w-4 shrink-0 opacity-90" />
                          </button>
                          <button
                            type="button"
                            className="text-center text-[12px] font-medium leading-[16px] text-[#7a87b2] hover:underline"
                            onClick={() => setIsTaskVisible(false)}
                          >
                            Remind me tomorrow
                          </button>
                        </div>
                      </>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty-state"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center gap-[16px] rounded-[32px] border border-[#e2e8f0] bg-white p-[32px] text-center min-h-[200px]"
                  >
                    <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#eef2ff]">
                      <CheckCircle2 className="h-[24px] w-[24px] text-[#3958c3]" />
                    </div>
                    <div className="flex flex-col gap-[4px]">
                      <p className="text-[16px] font-semibold text-[#14182c]">
                        You&apos;re all caught up!
                      </p>
                      <p className="text-[14px] text-[#5f6a94]">
                        No pending tasks at the moment.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {hasTask && (
                  <motion.div
                    key="caught-up-message"
                    variants={ctaHeaderVariants}
                    exit={{
                      opacity: 0,
                      height: 0,
                      paddingTop: 0,
                      transition: { duration: 0.3 },
                    }}
                    className="flex items-center justify-center gap-[8px] pt-2 overflow-hidden"
                  >
                    <CheckCircle2 className="h-[18px] w-[18px] text-[#9ca7c7]" />
                    <p className="text-[14px] leading-[24px] tracking-[-0.084px] text-[#9ca7c7]">
                      You&apos;re all caught up on other tasks
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

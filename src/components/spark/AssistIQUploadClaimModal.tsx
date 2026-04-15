import { useState, useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import {
  ArrowLeftToLine,
  Clock,
  Download,
  Mic,
  PanelRightDashed,
  Maximize2,
  Plus,
  Send,
  X,
  FileText,
  CheckSquare,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Info,
  Upload,
  Menu,
  Receipt,
  Sparkles,
  Wallet,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import QRCode from "react-qr-code";
import { AssistIQAvatar } from "@/components/app-shell/primitives/AppChatBubble";
import { SPARK_MEMBER_FIRST_NAME } from "@/data/sparkAiForwardMock";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


function chatGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function formatTime(): string {
  return new Date().toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

const RECENT_CHATS = [
  { label: "Upload Claim Documents", active: true },
  { label: "Claim status for family doctor vis…", active: false },
  { label: "Why was my claim denied?", active: false },
];

const PREVIOUS_CHATS = [
  { label: "My HSA balance", active: false },
  { label: "Find Medical FSA eligible expens…", active: false },
  { label: "What is my deductible?", active: false },
];

function ClaimPreviewCard({
  provider,
  amount,
  date,
  claimId,
  delay = 0,
  onWorkOnClaim,
  isDocked,
}: {
  provider: string;
  amount: string;
  date: string;
  claimId: string;
  delay?: number;
  onWorkOnClaim?: () => void;
  isDocked?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 28, delay }}
      className={`mt-2 w-full overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.04)] ${
        isDocked ? "max-w-[85%]" : "max-w-[358px]"
      }`}
    >
      <div
        className="flex items-start justify-between border-b border-[#e3e7f4] bg-[#f8f9fe] px-4 py-3.5"
      >
        <div className="flex flex-col">
          <span className="mb-[3px] text-[11px] font-medium uppercase tracking-[0.4px] text-[#5f6a94]">
            Claim
          </span>
          <span className="text-[16px] font-bold tracking-[-0.3px] text-[#14182c]">
            {provider}
          </span>
        </div>
        <span className="text-[22px] font-bold tracking-[-0.5px] text-[#14182c]">
          {amount}
        </span>
      </div>
      <div className="flex flex-col px-4 py-3.5">
        <div className="mb-3 flex gap-5">
          <div className="flex flex-col">
            <span className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.5px] text-[#5f6a94]">
              Date
            </span>
            <span className="text-[14px] font-medium text-[#14182c]">{date}</span>
          </div>
          <div className="flex flex-col">
            <span className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.5px] text-[#5f6a94]">
              Claim ID
            </span>
            <span className="text-[14px] font-medium text-[#14182c]">{claimId}</span>
          </div>
        </div>
        <div className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-[#f5c842] bg-[#fff7e0] px-2.5 py-1">
          <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#e6a800]" />
          <span className="text-[12px] font-semibold tracking-[0.1px] text-[#7a4a00]">
            Documentation Required
          </span>
        </div>
        <p className="mb-4 text-[14px] leading-snug text-[#5f6a94]">
          This claim requires an itemized receipt or EOB to verify eligibility.
        </p>
        <button
          type="button"
          onClick={onWorkOnClaim}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25146f] px-4 py-2.5 text-[15px] font-medium text-white transition-opacity hover:opacity-90"
        >
          <FileText className="h-4 w-4" />
          Work on this claim
        </button>
      </div>
    </motion.div>
  );
}

function DocumentUploadCard({
  claimId,
  onUpload,
  onSubmit,
  progress,
  phase,
  isDocked,
}: {
  claimId: string;
  onUpload: () => void;
  onSubmit: () => void;
  progress: number;
  phase: "working_upload" | "uploading" | "uploaded" | "submitted" | "final_typing" | "final_approval";
  isDocked?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 28 }}
      className={`mt-2 w-full overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.04)] ${
        isDocked ? "max-w-[85%]" : "max-w-[358px]"
      }`}
    >
      <div
        className="border-b border-[#e3e7f4] bg-[#f8f9fe] px-4 py-3.5"
      >
        <div className="mb-1 text-[11px] font-medium uppercase tracking-[0.4px] text-[#5f6a94]">
          Documentation required for
        </div>
        <div className="text-[15px] font-bold tracking-[-0.2px] text-[#14182c]">
          Bigtown Dentistry · {claimId}
        </div>
      </div>
      <div className="px-4 py-3.5">
        <div className="mb-3">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.5px] text-[#5f6a94]">
            Acceptable formats
          </div>
          <div className="flex gap-1.5">
            {["PDF", "JPEG", "PNG", "HEIC"].map((fmt) => (
              <span
                key={fmt}
                className="rounded-md border border-[#c9d1f5] bg-[#eef1fb] px-1.5 py-0.5 text-[11px] font-semibold text-[#25146f]"
              >
                {fmt}
              </span>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.5px] text-[#5f6a94]">
            Required documents
          </div>
          <div className="flex flex-col gap-2">
            {[
              "Explanation of Benefits (EOB)",
              "Itemized receipt from provider",
            ].map((doc) => (
              <div key={doc} className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4 shrink-0 text-[#1a6b45]" />
                <span className="text-[13px] leading-snug text-[#14182c]">{doc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.5px] text-[#5f6a94]">
            Make sure your document includes:
          </div>
          <ul className="flex flex-col gap-[8px]">
            {[
              "Provider’s or merchant’s name",
              "Date of service",
              "Dollar amount",
              "Category & type of service",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-[8px]">
                <CheckCircle2 className="h-[16px] w-[16px] text-[#16a34a] shrink-0 mt-[2px]" />
                <span className="text-[13px] leading-snug text-[#14182c] flex items-center gap-1">
                  {item}
                  {item === "Category & type of service" && (
                    <TooltipProvider delayDuration={200}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button type="button" className="text-[#5f6a94] hover:text-[#25146f] focus:outline-none">
                            <Info className="h-3.5 w-3.5" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="z-[400] max-w-[250px] p-3 text-[12px] leading-relaxed">
                          <p>
                            To determine your coverage, we look at the Category (the type of care, like Dental) and the Type (the specific service, like a Cleaning).
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {phase === "working_upload" && (
          <div className="flex w-full items-center gap-[16px]">
            <div className="flex flex-1 flex-col items-center gap-[8px]">
              <button
                type="button"
                onClick={onUpload}
                className="rounded-[12px] border border-[#e2e8f0] bg-white p-[8px] cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-transform hover:scale-[0.98] active:scale-95"
              >
                <QRCode
                  value="https://wexinc.com/upload/claim/123"
                  size={80}
                />
              </button>
              <p className="text-[11px] font-bold leading-tight text-center text-[#14182c]">
                Scan with
                <br />
                phone
              </p>
            </div>

            <div className="flex flex-col items-center gap-[6px] shrink-0">
              <div className="h-[24px] w-[1px] bg-[#e3e7f4]" />
              <span className="text-[11px] font-semibold text-[#a5aeb4] uppercase tracking-[0.5px]">
                Or
              </span>
              <div className="h-[24px] w-[1px] bg-[#e3e7f4]" />
            </div>

            <div className="flex flex-[2] flex-col items-center gap-[8px]">
              <button
                type="button"
                onClick={onUpload}
                className="flex w-full items-center justify-center gap-[8px] rounded-[12px] border border-[#e2e8f0] bg-white px-[16px] py-[12px] cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-transform hover:scale-[0.98] active:scale-95"
              >
                <Upload className="h-[18px] w-[18px] text-[#25146f]" />
                <span className="text-[14px] font-medium leading-[20px] text-[#25146f]">
                  Upload from computer
                </span>
              </button>
              <p className="text-[11px] font-medium leading-tight text-center text-[#5f6a94]">
                PDF, JPEG, PNG, HEIC
              </p>
            </div>
          </div>
        )}

        {(phase === "uploading" || phase === "uploaded") && (
          <div className="flex w-full items-center gap-3 rounded-xl border border-[#e3e7f4] bg-[#f8f9fe] p-3">
            <FileText className="h-6 w-6 shrink-0 text-[#3958c3]" />
            <div className="flex flex-1 flex-col gap-1.5">
              <div className="flex justify-between text-[12px] font-medium text-[#14182c]">
                <span>dentist-eob.pdf</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#e3e7f4]">
                <div
                  className="h-full bg-[#3958c3] transition-all duration-150 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            {phase === "uploaded" && (
              <button
                type="button"
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[#5f6a94] hover:bg-[#e3e7f4]"
                aria-label="Remove file"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {phase === "uploaded" && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onSubmit}
            className="mt-3 flex w-full items-center justify-center rounded-xl bg-[#25146f] px-4 py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            Submit documentation
          </motion.button>
        )}

        {phase === "submitted" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#a8e8c8] bg-[#e6f9f0] px-4 py-3 text-[14px] font-medium text-[#1a6b45]"
          >
            <CheckSquare className="h-5 w-5 shrink-0" />
            Document submitted
          </motion.div>
        )}

        {phase === "final_typing" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#c9d1f5] bg-[#eef1fb] px-4 py-3 text-[14px] font-medium text-[#25146f]"
          >
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#25146f] border-t-transparent" />
            Processing document...
          </motion.div>
        )}

        {phase === "final_approval" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#a8e8c8] bg-[#e6f9f0] px-4 py-3 text-[14px] font-medium text-[#1a6b45]"
          >
            <CheckSquare className="h-5 w-5 shrink-0" />
            Document verified
          </motion.div>
        )}

        <AnimatePresence>
          {phase === "final_typing" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 overflow-hidden"
            >
              <ExplainableAIProcessing />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function ExplainableAIProcessing() {
  const [step, setStep] = useState(0);
  const steps = [
    "Scanning document...",
    "Extracting claim details...",
    "Verifying provider and dates...",
    "Checking eligibility...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev < steps.length ? prev + 1 : prev));
    }, 1200);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="flex flex-col gap-3 py-2">
      {steps.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{
            opacity: i <= step ? 1 : 0,
            x: i <= step ? 0 : -10,
          }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-3"
        >
          {i < step ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex h-5 w-5 items-center justify-center rounded-full bg-[#10b981]"
            >
              <CheckSquare className="h-3 w-3 text-white" />
            </motion.div>
          ) : i === step ? (
            <div className="flex h-5 w-5 items-center justify-center">
              <div className="flex space-x-1">
                <motion.div
                  className="h-1.5 w-1.5 rounded-full bg-[#7a87b2]"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                  className="h-1.5 w-1.5 rounded-full bg-[#7a87b2]"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="h-1.5 w-1.5 rounded-full bg-[#7a87b2]"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                />
              </div>
            </div>
          ) : (
            <div className="h-5 w-5" />
          )}
          <span
            className={`text-[13px] leading-[16px] ${
              i < step
                ? "font-medium text-[#1d2c38]"
                : i === step
                  ? "italic text-[#7a87b2]"
                  : "text-transparent"
            }`}
          >
            {s}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * Assist IQ popup for “Upload Claim Documents” (SPARK-2026 Figma: Assist IQ Popup — Claim Doc request).
 */
export function AssistIQUploadClaimModal({ open, onOpenChange }: Props) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timeLabel = formatTime();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDocked, setIsDocked] = useState(false);
  const [chatPhase, setChatPhase] = useState<
    | "new_chat"
    | "typing"
    | "results"
    | "working_typing"
    | "working_upload"
    | "uploading"
    | "uploaded"
    | "submitted"
    | "final_typing"
    | "final_approval"
  >("typing");
  const [selectedClaim, setSelectedClaim] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-scroll to bottom when chatPhase or uploadProgress changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatPhase, uploadProgress]);

  useEffect(() => {
    if (open && chatPhase === "typing") {
      const timer = setTimeout(() => {
        setChatPhase("results");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [open, chatPhase]);

  useEffect(() => {
    if (!open) {
      setChatPhase("typing");
      setIsSidebarOpen(false);
      setSelectedClaim(null);
      setUploadProgress(0);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      return;
    }
    
    // Only lock scrolling if the modal is expanded (not docked)
    if (!isDocked) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open, isDocked]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();
  }, [open]);

  // Push the main page content to the left when docked
  useEffect(() => {
    const container = document.getElementById("docked-sidebar-container");
    const wrapper = document.getElementById("page-content-wrapper");
    if (!container) return;

    if (open && isDocked) {
      container.style.width = "400px";
      wrapper?.classList.add("is-docked");
    } else {
      container.style.width = "0px";
      wrapper?.classList.remove("is-docked");
    }
    
    return () => {
      container.style.width = "0px";
      wrapper?.classList.remove("is-docked");
    };
  }, [open, isDocked]);

  const handleWorkOnClaim = (claimId: string) => {
    setSelectedClaim(claimId);
    setChatPhase("working_typing");

    setTimeout(() => {
      setChatPhase("working_upload");
    }, 1500);
  };

  const handleUploadClick = () => {
    // Simulate opening file picker, then immediately uploading
    setChatPhase("uploading");
    setUploadProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20 + 8;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        progressIntervalRef.current = null;
        setUploadProgress(100);
        setTimeout(() => setChatPhase("uploaded"), 300);
      } else {
        setUploadProgress(Math.round(progress));
      }
    }, 150);
    progressIntervalRef.current = interval;
  };

  const handleSubmit = () => {
    setChatPhase("submitted");
    setTimeout(() => {
      setChatPhase("final_typing");
      setTimeout(() => {
        setChatPhase("final_approval");
      }, 5000); // Extended for explainable AI processing
    }, 800);
  };

  const handleStartNewChat = () => {
    setChatPhase("new_chat");
    setIsSidebarOpen(false);
    setSelectedClaim(null);
    setUploadProgress(0);
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  if (!open) return null;

  const node = (
    <div
      className={`flex transition-all duration-300 ${
        isDocked
          ? "fixed right-0 top-[80px] bottom-0 w-[400px] z-[40] items-stretch justify-end px-0"
          : "fixed inset-x-0 bottom-0 top-[80px] z-[300] items-end justify-center px-8"
      }`}
      role="presentation"
    >
      {!isDocked && (
        <button
          type="button"
          aria-label="Close dialog"
          className="fixed inset-0 bg-[rgba(18,24,29,0.45)] backdrop-blur-[2px] transition-opacity duration-300"
          onClick={() => onOpenChange(false)}
        />
      )}
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        initial={isDocked ? { x: "100%", opacity: 0 } : { scale: 0.95, opacity: 0 }}
        animate={isDocked ? { x: 0, opacity: 1 } : { scale: 1, opacity: 1 }}
        exit={isDocked ? { x: "100%", opacity: 0 } : { scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 420, damping: 36 }}
        className={`relative flex h-full w-full flex-col overflow-hidden outline-none lg:flex-row transition-all duration-300 ${
          isDocked
            ? "max-w-[400px] rounded-none border-l border-[#e3e7f4] shadow-none bg-white"
            : "mx-auto max-w-[1376px] rounded-t-[32px] border-x border-t border-[#e3e7f4] shadow-[0_8px_16px_rgba(2,13,36,0.15),0_0px_1px_rgba(2,13,36,0.3)]"
        }`}
        style={{
          backgroundImage: isDocked
            ? "none"
            : "url('data:image/svg+xml;utf8,<svg viewBox=\"0 0 1376 911\" xmlns=\"http://www.w3.org/2000/svg\" preserveAspectRatio=\"none\"><rect x=\"0\" y=\"0\" height=\"100%\" width=\"100%\" fill=\"url(%23grad)\" opacity=\"1\"/><defs><radialGradient id=\"grad\" gradientUnits=\"userSpaceOnUse\" cx=\"0\" cy=\"0\" r=\"10\" gradientTransform=\"matrix(202.38 0 0 90.184 -55.04 273.3)\"><stop stop-color=\"rgba(23,45,161,0.09)\" offset=\"0\"/><stop stop-color=\"rgba(23,45,161,0)\" offset=\"0.5\"/></radialGradient></defs></svg>'), url('data:image/svg+xml;utf8,<svg viewBox=\"0 0 1376 911\" xmlns=\"http://www.w3.org/2000/svg\" preserveAspectRatio=\"none\"><rect x=\"0\" y=\"0\" height=\"100%\" width=\"100%\" fill=\"url(%23grad)\" opacity=\"1\"/><defs><radialGradient id=\"grad\" gradientUnits=\"userSpaceOnUse\" cx=\"0\" cy=\"0\" r=\"10\" gradientTransform=\"matrix(202.38 0 0 96.626 1431 683.25)\"><stop stop-color=\"rgba(200,16,46,0.07)\" offset=\"0\"/><stop stop-color=\"rgba(200,16,46,0)\" offset=\"0.45\"/></radialGradient></defs></svg>'), url('data:image/svg+xml;utf8,<svg viewBox=\"0 0 1376 911\" xmlns=\"http://www.w3.org/2000/svg\" preserveAspectRatio=\"none\"><rect x=\"0\" y=\"0\" height=\"100%\" width=\"100%\" fill=\"url(%23grad)\" opacity=\"1\"/><defs><radialGradient id=\"grad\" gradientUnits=\"userSpaceOnUse\" cx=\"0\" cy=\"0\" r=\"10\" gradientTransform=\"matrix(107.03 0 0 180.37 756.8 1275.4)\"><stop stop-color=\"rgba(23,45,161,0.04)\" offset=\"0\"/><stop stop-color=\"rgba(23,45,161,0)\" offset=\"0.4\"/></radialGradient></defs></svg>'), linear-gradient(90deg, #fff 0%, #fff 100%)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sidebar Overlay for Docked Mode */}
        <AnimatePresence>
          {isDocked && isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 bg-[rgba(18,24,29,0.45)] backdrop-blur-[2px] lg:block"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <AnimatePresence>
          {isSidebarOpen ? (
            <motion.aside
              initial={isDocked ? { x: "-100%" } : { width: 64, opacity: 0 }}
              animate={isDocked ? { x: 0 } : { width: 308, opacity: 1 }}
              exit={isDocked ? { x: "-100%" } : { width: 64, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
              className={`flex shrink-0 flex-col justify-between bg-white pb-4 pt-3 border-r border-[#e3e7f4] ${
                isDocked
                  ? "absolute bottom-0 left-0 top-0 z-20 w-[308px] shadow-[4px_0_24px_rgba(0,0,0,0.15)]"
                  : "hidden w-[308px] rounded-tl-[32px] lg:flex"
              }`}
            >
              <div className="flex flex-col gap-6 overflow-y-auto px-4 w-[308px]">
                {/* Header row */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#5f6a94] transition-colors hover:bg-[#f8f9fe]"
                    aria-label="Close chat history"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <ArrowLeftToLine className="h-4 w-4" />
                  </button>
                  <span className="text-[14px] font-semibold leading-[24px] text-[#14182c]">
                    Chat History
                  </span>
                </div>

                {/* New chat button */}
                <button
                  type="button"
                  onClick={handleStartNewChat}
                  className="flex h-8 w-full items-center justify-center gap-2 rounded-lg border border-[#e3e7f4] bg-[#f8f9fe] text-[14px] font-medium text-[#3958c3] transition-colors hover:bg-[#eef2ff]"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Start new chat
                </button>

                {/* Recent */}
                <div>
                  <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wide text-[#7a87b2]">
                    Recent
                  </p>
                  <div className="flex flex-col gap-1">
                    {RECENT_CHATS.map((row) => (
                      <button
                        key={row.label}
                        type="button"
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-left text-[13px] leading-snug transition-colors ${
                          row.active
                            ? "bg-[#e1e8ff] font-semibold text-[#25146f]"
                            : "text-[#5f6a94] hover:bg-[#f8f9fe]"
                        }`}
                      >
                        <Clock className="h-3.5 w-3.5 shrink-0" />
                        {row.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Previous 30 days */}
                <div>
                  <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wide text-[#7a87b2]">
                    Previous 30 days
                  </p>
                  <div className="flex flex-col gap-1">
                    {PREVIOUS_CHATS.map((row) => (
                      <button
                        key={row.label}
                        type="button"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-[13px] leading-snug text-[#5f6a94] transition-colors hover:bg-[#f8f9fe]"
                      >
                        <Clock className="h-3.5 w-3.5 shrink-0" />
                        {row.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-4 pt-4 w-[308px]">
                <button
                  type="button"
                  className="flex w-full items-center gap-2 text-left text-[13px] font-medium text-[#5f6a94] transition-colors hover:text-[#3958c3]"
                >
                  <Download className="h-3.5 w-3.5 shrink-0" />
                  Export this transcript in PDF
                </button>
              </div>
            </motion.aside>
          ) : !isDocked ? (
            <aside className="hidden w-16 shrink-0 flex-col items-center rounded-tl-[32px] bg-white pt-3 border-r border-[#e3e7f4] lg:flex">
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#5f6a94] transition-colors hover:bg-[#f8f9fe]"
                aria-label="Expand chat history"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </button>
            </aside>
          ) : null}
        </AnimatePresence>

        {/* Main column — transparent so outer gradient shows through */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <header className={`relative flex h-14 shrink-0 items-center justify-between bg-white transition-all duration-300 ${
            isDocked ? "rounded-none px-4 border-b border-[#e3e7f4]" : "rounded-tr-[32px] px-6"
          }`}>
            <div className="flex min-w-0 items-center gap-2">
              {isDocked ? (
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-md text-[#5f6a94] hover:bg-[#f8f9fe]"
                        aria-label="Chat history"
                        onClick={() => setIsSidebarOpen(true)}
                      >
                        <Menu className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="z-[400] text-[12px]">
                      <p>Chat history</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <div className="flex items-center justify-center gap-1 rounded-full px-2 py-1">
                  <Sparkles className="h-3.5 w-3.5 text-[#5f6a94]" />
                  <span className="text-[14px] font-semibold leading-[24px] tracking-[-0.084px] text-[#5f6a94]">
                    WEXly
                  </span>
                </div>
              )}
            </div>
            
            <AnimatePresence mode="wait">
              <motion.span
                key={isDocked ? "docked" : "expanded"}
                id={titleId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[14px] font-bold leading-[24px] text-[#14182c]"
              >
                {isDocked ? "WEXly" : (chatPhase === "new_chat" ? "New Chat" : "Upload Claim Documents")}
              </motion.span>
            </AnimatePresence>

            <div className="flex min-w-0 items-center justify-end gap-1">
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="flex h-[35px] w-[35px] shrink-0 items-center justify-center rounded-md text-[#5f6a94] hover:bg-[#f8f9fe]"
                      aria-label={isDocked ? "Expand window" : "Dock to side"}
                      onClick={() => setIsDocked(!isDocked)}
                    >
                      {isDocked ? (
                        <Maximize2 className="h-4 w-4" />
                      ) : (
                        <PanelRightDashed className="h-4 w-4" />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="z-[400] text-[12px]">
                    <p>{isDocked ? "Expand window" : "Dock to side"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              {!isDocked && <div className="mx-1 h-4 w-[1px] bg-[#e3e7f4]" />}

              <button
                type="button"
                className="flex h-[35px] w-[35px] shrink-0 items-center justify-center rounded-md text-[#5f6a94] hover:bg-[#f8f9fe]"
                aria-label="Close"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </header>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div ref={scrollRef} className={`min-h-0 flex-1 overflow-y-auto py-6 transition-all duration-300 ${isDocked ? "px-4" : "px-4 sm:px-8"}`}>
              <div className="mx-auto max-w-[722px]">
                <div className="mb-8 flex flex-col gap-3">
                  <AssistIQAvatar size={isDocked ? 32 : 40} />
                  <h2 className={`font-semibold tracking-[-0.88px] text-[#444c72] transition-all duration-300 ${isDocked ? "text-[28px] leading-[36px]" : "text-[44px] leading-[56px]"}`}>
                    {chatGreeting()}, {SPARK_MEMBER_FIRST_NAME}!
                  </h2>
                  <p className={`tracking-[-0.304px] text-[#444c72] transition-all duration-300 ${isDocked ? "text-[15px] leading-[24px]" : "text-[19px] leading-[32px]"}`}>
                    I&apos;m{" "}
                    <strong
                      className="font-semibold"
                      style={{
                        backgroundImage:
                          "linear-gradient(174.29deg, #25146f 13.72%, #c8102e 27.32%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      WEXly
                    </strong>
                    , your Benefits helper.
                    <br />
                    How can I help you today?
                  </p>
                </div>

                {chatPhase === "new_chat" ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-8"
                  >
                    {/* Recent Conversations */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-[14px] font-semibold text-[#444c72]">Recent conversations:</h3>
                        <button className="text-[13px] font-medium text-[#3958c3] hover:underline">View all</button>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button className="group flex items-center justify-between rounded-xl border border-[#e3e7f4] bg-white p-4 text-left transition-all hover:-translate-y-[1px] hover:bg-[#f8f9fe] hover:shadow-sm">
                          <div className="flex items-center gap-3 text-[#3958c3]">
                            <Clock className="h-4 w-4" />
                            <span className="text-[14px]">Claim status for my family doctor visit</span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-[#a5aeb4] transition-colors group-hover:text-[#3958c3]" />
                        </button>
                        <button className="group flex items-center justify-between rounded-xl border border-[#e3e7f4] bg-white p-4 text-left transition-all hover:-translate-y-[1px] hover:bg-[#f8f9fe] hover:shadow-sm">
                          <div className="flex items-center gap-3 text-[#3958c3]">
                            <Clock className="h-4 w-4" />
                            <span className="text-[14px]">Why was my claim denied?</span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-[#a5aeb4] transition-colors group-hover:text-[#3958c3]" />
                        </button>
                      </div>
                    </motion.div>

                    {/* Suggested Actions */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <h3 className="mb-3 text-[14px] font-semibold text-[#444c72]">Suggested actions:</h3>
                      <div className="flex flex-row flex-wrap items-start gap-2">
                        <button 
                          onClick={() => setChatPhase("typing")}
                          className="flex items-center gap-2 rounded-full border border-[#9b2b5e] px-4 py-2 text-[14px] font-medium text-[#25146f] transition-all hover:-translate-y-[1px] hover:bg-[#fff5f8] hover:shadow-sm"
                        >
                          <Upload className="h-4 w-4" />
                          Upload Claim Documents
                        </button>
                        <button className="flex items-center gap-2 rounded-full border border-[#9b2b5e] px-4 py-2 text-[14px] font-medium text-[#25146f] transition-all hover:-translate-y-[1px] hover:bg-[#fff5f8] hover:shadow-sm">
                          <CreditCard className="h-4 w-4" />
                          Report Lost/Stolen Card
                        </button>
                        <button className="flex items-center gap-2 rounded-full border border-[#9b2b5e] px-4 py-2 text-[14px] font-medium text-[#25146f] transition-all hover:-translate-y-[1px] hover:bg-[#fff5f8] hover:shadow-sm">
                          <Receipt className="h-4 w-4" />
                          Find Medical FSA eligible expenses
                        </button>
                        <button className="flex items-center gap-2 rounded-full border border-[#9b2b5e] px-4 py-2 text-[14px] font-medium text-[#25146f] transition-all hover:-translate-y-[1px] hover:bg-[#fff5f8] hover:shadow-sm">
                          <Wallet className="h-4 w-4" />
                          Lookup Benefit Plan Balance
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                ) : (
                  <>
                    {/* User message */}
                    <div className="mb-4 flex flex-col items-end gap-2">
                      <div className="flex items-center gap-1 text-[11px] leading-[16px] tracking-[0.055px]">
                        <span className="text-[#243746]">{SPARK_MEMBER_FIRST_NAME}</span>
                        <span className="text-[#a5aeb4]">{timeLabel}</span>
                      </div>
                      <div className={`rounded-tl-[24px] rounded-tr-[24px] rounded-bl-[24px] border border-[#e3e7f4] bg-[#e3e7f4] p-4 ${isDocked ? "max-w-[85%]" : "max-w-[358px]"}`}>
                        <p className="text-[14px] leading-[24px] tracking-[-0.084px] text-[#1d2c38]">
                          Upload Claim Documents
                        </p>
                      </div>
                    </div>

                {/* Assistant typing or results */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <AssistIQAvatar size={28} />
                    <span className="text-[12px] text-[#7a87b2]">{timeLabel}</span>
                  </div>
                  <div className="flex flex-col gap-3 pl-1">
                    {chatPhase === "typing" ? (
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.span
                              key={i}
                              className="h-2 w-2 rounded-full bg-[#9ca7c7]"
                              animate={{ opacity: [0.35, 1, 0.35], y: [0, -3, 0] }}
                              transition={{
                                duration: 0.9,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 0.12,
                              }}
                            />
                          ))}
                        </div>
                        <p className="text-[12px] italic leading-[16px] text-[#7a87b2]">
                          Looking up your claims...
                        </p>
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 340, damping: 28 }}
                        className="flex flex-col gap-3"
                      >
                        <div className={`pb-2 ${isDocked ? "max-w-[85%]" : "max-w-[358px]"}`}>
                          <p className="text-[14px] leading-[24px] tracking-[-0.084px] text-[#253341]">
                            Sure! I found 2 claims that require you to submit
                            additional documentation:
                          </p>
                        </div>
                        <ClaimPreviewCard
                          provider="Bigtown Dentistry"
                          amount="$210.00"
                          date="Apr 26, 2026"
                          claimId="#123456"
                          delay={0.1}
                          onWorkOnClaim={() => handleWorkOnClaim("#123456")}
                        />
                        <ClaimPreviewCard
                          provider="Dr. Smith Vision"
                          amount="$120.00"
                          date="Nov 15, 2025"
                          claimId="#789012"
                          delay={0.2}
                          onWorkOnClaim={() => handleWorkOnClaim("#789012")}
                        />
                        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                          <button
                            type="button"
                            className="flex items-center justify-center rounded-full border border-[#25146f] bg-white px-5 py-2 text-[14px] font-medium text-[#25146f] transition-colors hover:bg-[#f8f9fe]"
                          >
                            See all claims
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Working on a claim flow */}
                <AnimatePresence>
                  {(chatPhase === "working_typing" ||
                    chatPhase === "working_upload" ||
                    chatPhase === "uploading" ||
                    chatPhase === "uploaded" ||
                    chatPhase === "submitted" ||
                    chatPhase === "final_typing" ||
                    chatPhase === "final_approval") && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 flex flex-col gap-4"
                    >
                      {/* User message */}
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-1 text-[11px] leading-[16px] tracking-[0.055px]">
                          <span className="text-[#243746]">{SPARK_MEMBER_FIRST_NAME}</span>
                          <span className="text-[#a5aeb4]">{timeLabel}</span>
                        </div>
                        <div className={`rounded-tl-[24px] rounded-tr-[24px] rounded-bl-[24px] border border-[#e3e7f4] bg-[#e3e7f4] p-4 ${isDocked ? "max-w-[85%]" : "max-w-[358px]"}`}>
                          <p className="text-[14px] leading-[24px] tracking-[-0.084px] text-[#1d2c38]">
                            Work on claim {selectedClaim}
                          </p>
                        </div>
                      </div>

                      {/* Assistant response */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <AssistIQAvatar size={28} />
                          <span className="text-[12px] text-[#7a87b2]">{timeLabel}</span>
                        </div>
                        <div className="flex flex-col gap-3 pl-1">
                          {chatPhase === "working_typing" ? (
                            <div className="flex items-center gap-3">
                              <div className="flex gap-1">
                                {[0, 1, 2].map((i) => (
                                  <motion.span
                                    key={i}
                                    className="h-2 w-2 rounded-full bg-[#9ca7c7]"
                                    animate={{ opacity: [0.35, 1, 0.35], y: [0, -3, 0] }}
                                    transition={{
                                      duration: 0.9,
                                      repeat: Infinity,
                                      ease: "easeInOut",
                                      delay: i * 0.12,
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                          ) : (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ type: "spring", stiffness: 340, damping: 28 }}
                              className="flex flex-col gap-3"
                            >
                              <div className={`pb-2 ${isDocked ? "max-w-[85%]" : "max-w-[358px]"}`}>
                                <p className="text-[14px] leading-[24px] tracking-[-0.084px] text-[#253341]">
                                  Sounds good! You can upload your document here:
                                </p>
                              </div>
                              <DocumentUploadCard
                                claimId={selectedClaim!}
                                onUpload={handleUploadClick}
                                onSubmit={handleSubmit}
                                progress={uploadProgress}
                                phase={chatPhase as any}
                              />
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Final Approval Flow */}
                <AnimatePresence>
                  {chatPhase === "final_approval" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="mt-6 flex w-full flex-col items-start gap-4"
                    >
                      <div className={`flex flex-col gap-2 pb-2 ${isDocked ? "max-w-[85%]" : "max-w-[358px]"}`}>
                        <p className="text-[14px] leading-[24px] tracking-[-0.084px] text-[#1d2c38]">
                          {selectedClaim === "#123456"
                            ? "Documentation uploaded! Once your claim is approved it will be paid out to your account."
                            : "Your document has been verified and your claim is approved for reimbursement! 🎉"}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                </>
                )}
              </div>
            </div>

            {/* Composer */}
            <div className="shrink-0 px-6 py-4">
              <div className="mx-auto max-w-[722px]">
                <div className="flex h-[60px] items-center gap-3 rounded-[32px] bg-white px-4 shadow-[0_2px_6px_rgba(14,56,144,0.2),0_0px_1px_rgba(14,56,144,0.3)]">
                  <input
                    type="text"
                    placeholder="Ask a question"
                    className="min-w-0 flex-1 border-0 bg-transparent text-[15px] text-[#14182c] outline-none placeholder:text-[#9ca7c7]"
                    readOnly aria-label="Ask a question"
                  />
                  <button
                    type="button"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#5f6a94] hover:bg-[#f8f9fe]"
                    aria-label="Voice input"
                  >
                    <Mic className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[24px] bg-[#5f6a94] text-white"
                    aria-label="Send"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-3 text-center text-[12px] leading-[21px] text-[#515e6c]">
                  WEXly may make mistakes.{" "}
                  <button type="button" className="underline decoration-solid">
                    See how WEXly works
                  </button>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  if (isDocked) {
    const container = document.getElementById("docked-sidebar-container");
    if (container) {
      return createPortal(node, container);
    }
  }

  return createPortal(node, document.body);
}

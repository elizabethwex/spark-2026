import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  X,
  Mic,
  Paperclip,
  FileText,
  ThumbsUp,
  ThumbsDown,
  CreditCard,
  Shield,
  MapPin,
  Camera,
  Image as ImageIcon,
  ShoppingCart,
  Search,
} from "lucide-react";
import { AppNavBar } from "@/components/app-shell/AppNavBar";
import { AppTopSpacer } from "@/components/app-shell/AppTopSpacer";
import {
  AppPromptChip,
  AssistIQAvatar,
} from "@/components/app-shell/primitives/AppChatBubble";

// ─── Design tokens ────────────────────────────────────────────────────────────
const ASSIST_IQ_GRADIENT =
  "linear-gradient(133.5deg, #25146f 2.5%, #c8102e 100%)";
const USER_BUBBLE_BG = "var(--app-border)";
const PRIMARY_BTN = "var(--app-primary)";
const CARD_SHADOW =
  "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)";
const TEXT_PRIMARY = "var(--app-text)";
const TEXT_SECONDARY = "var(--app-text-secondary)";
const WARNING_BG = "#fff7e0";
const WARNING_TEXT = "#7a4a00";
const SUCCESS_BG = "#e6f9f0";
const SUCCESS_TEXT = "#1a6b45";

// ─── Types ────────────────────────────────────────────────────────────────────
type MessageType = "text" | "claim-card" | "doc-upload-card";
type DocState = "idle" | "uploading" | "uploaded" | "submitted";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  type: MessageType;
  showFeedback?: boolean;
}

// ─── Motion variants ──────────────────────────────────────────────────────────
const msgVariants = {
  initial: { opacity: 0, y: 14 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 340, damping: 28 },
  },
};

const cardVariants = {
  initial: { opacity: 0, scale: 0.96, y: 10 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 280,
      damping: 28,
      delay: 0.12,
    },
  },
};

// ─── Utilities ────────────────────────────────────────────────────────────────
function now() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isClaimsTrigger(text: string) {
  const t = text.toLowerCase();
  return (
    (t.includes("claim") &&
      (t.includes("help") ||
        t.includes("need") ||
        t.includes("issue") ||
        t.includes("document"))) ||
    t.includes("upload claim") ||
    t.includes("claim document")
  );
}

// ─── Canned responses (non-claims) ───────────────────────────────────────────
const CANNED: Record<string, string> = {
  "hsa balance":
    "Your HSA For Life® currently has an available balance of $0.00. Your 2025 IRS contribution limit is $4,300. You've contributed $2,530.00 so far this year.",
  "submit a claim":
    "To submit a claim:\n\n1. Tap Claims in the tab bar\n2. Tap the + button in the top right\n3. Choose your expense category\n4. Upload your receipt or EOB\n5. Confirm the amount and account\n\nClaims are typically processed within 2–3 business days.",
  "hsa-eligible":
    "Common HSA-eligible expenses include:\n\n• Doctor visits and copays\n• Prescription medications\n• Dental care and orthodontia\n• Vision care and glasses\n• Mental health services\n• Certain medical equipment",
  "fsa expire":
    "Your Health FSA plan year runs January 1 – December 31, 2025. You currently have $250.00 remaining.",
  contribute:
    "For 2025:\n\n• HSA: Up to $4,300 (individual) or $8,550 (family)\n• Health FSA: Up to $3,200\n• Dependent Care FSA: Up to $5,000",
  "claim denied":
    "Your most recent denied claim was from CVS Pharmacy ($18.50) on December 10, 2024. It was denied because the item was a cosmetic product, not an IRS-eligible HSA expense.",
  braces:
    "Yes, you have $875 left to spend towards this purchase.",
};

function getResponse(input: string): string {
  const key = input.toLowerCase().trim();
  for (const [q, a] of Object.entries(CANNED)) {
    if (key.includes(q)) return a;
  }
  return "Great question! I'm here to help with your WEX health benefit accounts. I can assist with account balances, claims, eligible expenses, contribution limits, and more. Could you provide a bit more detail?";
}

// ─── Welcome chips ────────────────────────────────────────────────────────────
const WELCOME_CHIPS = [
  {
    label: "Upload Claim Documents",
    icon: <FileText size={16} color="#25146f" />,
  },
  { label: "Report Lost/Stolen Card", icon: <CreditCard size={16} color="#25146f" /> },
  { label: "Shop HSA Store", icon: <ShoppingCart size={16} color="#25146f" /> },
  { label: "Find recent claims", icon: <Search size={16} color="#25146f" /> },
];

// ─── CheckSquareIcon ──────────────────────────────────────────────────────────
function CheckSquareIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0, color: "var(--app-success, #1a6b45)" }}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// ─── AssistIQMessageHeader ────────────────────────────────────────────────────
function AssistIQMessageHeader({ timestamp }: { timestamp: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 8,
      }}
    >
      <AssistIQAvatar size={28} />
      <span
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: TEXT_PRIMARY,
          letterSpacing: -0.1,
        }}
      >
        WEXly
      </span>
      <span style={{ fontSize: 12, color: TEXT_SECONDARY }}>{timestamp}</span>
    </div>
  );
}

// ─── TypingIndicator ──────────────────────────────────────────────────────────
function TypingIndicator({ timestamp }: { timestamp: string }) {
  return (
    <motion.div
      variants={msgVariants}
      initial="initial"
      animate="animate"
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      style={{ marginBottom: 20, paddingRight: 48 }}
    >
      <AssistIQMessageHeader timestamp={timestamp} />
      <div style={{ display: "flex", gap: 5, paddingLeft: 36 }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -5, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: TEXT_SECONDARY,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ─── FeedbackRow ──────────────────────────────────────────────────────────────
function FeedbackRow() {
  const [voted, setVoted] = useState<"up" | "down" | null>(null);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginTop: 10,
        paddingLeft: 0,
      }}
    >
      <span
        style={{ fontSize: 13, color: TEXT_SECONDARY, fontStyle: "italic" }}
      >
        Was this reply helpful?
      </span>
      <div style={{ height: 14, width: 1, background: "#d0d6ea" }} />
      {(["up", "down"] as const).map((dir) => (
        <button
          key={dir}
          onClick={() => setVoted(dir)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 28,
            height: 28,
            borderRadius: "50%",
            border: "1px solid",
            borderColor:
              voted === dir
                ? dir === "up"
                  ? "var(--neutral-700)"
                  : "#c8102e"
                : "#d0d6ea",
            background:
              voted === dir
                ? dir === "up"
                  ? "#eef1fb"
                  : "#fdf0f2"
                : "transparent",
            cursor: "pointer",
            transition: "all 0.18s",
          }}
        >
          {dir === "up" ? (
            <ThumbsUp size={13} color={voted === "up" ? "var(--neutral-700)" : "#5f6a94"} />
          ) : (
            <ThumbsDown
              size={13}
              color={voted === "down" ? "#c8102e" : "#5f6a94"}
            />
          )}
        </button>
      ))}
    </motion.div>
  );
}

// ─── ClaimPreviewCard ─────────────────────────────────────────────────────────
function ClaimPreviewCard({
  onWorkOnClaim,
  isWorked,
}: {
  onWorkOnClaim: () => void;
  isWorked: boolean;
}) {
  return (
    <motion.div variants={cardVariants} initial="initial" animate="animate">
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          boxShadow: CARD_SHADOW,
          overflow: "hidden",
          marginTop: 6,
        }}
      >
        {/* Gradient header */}
        <div
          style={{
            background: ASSIST_IQ_GRADIENT,
            padding: "14px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.7)",
                fontWeight: 500,
                letterSpacing: 0.4,
                textTransform: "uppercase",
                marginBottom: 3,
              }}
            >
              Claim
            </div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#fff",
                letterSpacing: -0.3,
              }}
            >
              Bigtown Dentistry
            </div>
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: -0.5,
            }}
          >
            $210.00
          </div>
        </div>

        {/* Card body */}
        <div style={{ padding: "14px 16px" }}>
          {/* Meta */}
          <div style={{ display: "flex", gap: 20, marginBottom: 12 }}>
            <div>
              <div
                style={{
                  fontSize: 10,
                  color: TEXT_SECONDARY,
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                  marginBottom: 2,
                }}
              >
                Date
              </div>
              <div
                style={{ fontSize: 14, fontWeight: 500, color: TEXT_PRIMARY }}
              >
                Apr 26, 2027
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: 10,
                  color: TEXT_SECONDARY,
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                  marginBottom: 2,
                }}
              >
                Claim ID
              </div>
              <div
                style={{ fontSize: 14, fontWeight: 500, color: TEXT_PRIMARY }}
              >
                #123456
              </div>
            </div>
          </div>

          {/* Status badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 10px",
              borderRadius: 999,
              background: WARNING_BG,
              border: "1px solid #f5c842",
              marginBottom: 12,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#e6a800",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: WARNING_TEXT,
                letterSpacing: 0.1,
              }}
            >
              Documentation Required
            </span>
          </div>

          {/* Description */}
          <p
            style={{
              fontSize: 14,
              color: TEXT_SECONDARY,
              margin: "0 0 16px",
              lineHeight: 1.55,
            }}
          >
            Upload your document to complete this claim for Bigtown Dentistry.
          </p>

          {/* CTA button */}
          <button
            onClick={onWorkOnClaim}
            disabled={isWorked}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: 12,
              background: isWorked ? "#e8ebf5" : PRIMARY_BTN,
              border: "none",
              cursor: isWorked ? "default" : "pointer",
              color: isWorked ? TEXT_SECONDARY : "#fff",
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: -0.1,
              fontFamily: "var(--app-font)",
              transition: "background 0.2s, color 0.2s",
            }}
          >
            {isWorked ? "Opened ✓" : "Work on this claim"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── FileStatusRow ────────────────────────────────────────────────────────────
function FileStatusRow({
  fileName,
  status,
  progress,
  onRemove,
}: {
  fileName: string;
  status: "uploading" | "uploaded";
  progress: number;
  onRemove: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        borderRadius: 10,
        background: status === "uploaded" ? SUCCESS_BG : "#f4f6fb",
        border: `1px solid ${status === "uploaded" ? "#a8e8c8" : "#dde3f4"}`,
        marginBottom: 10,
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 8,
          background: status === "uploaded" ? "#1a6b45" : PRIMARY_BTN,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "background 0.3s",
        }}
      >
        <FileText size={17} color="#fff" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: TEXT_PRIMARY,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {fileName}
        </div>
        {status === "uploading" ? (
          <div style={{ marginTop: 5 }}>
            <div
              style={{
                height: 4,
                borderRadius: 2,
                background: "#dde3f4",
                overflow: "hidden",
              }}
            >
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeOut", duration: 0.1 }}
                style={{ height: "100%", background: PRIMARY_BTN, borderRadius: 2 }}
              />
            </div>
            <div
              style={{ fontSize: 11, color: TEXT_SECONDARY, marginTop: 3 }}
            >
              Uploading… {progress}%
            </div>
          </div>
        ) : (
          <div
            style={{ fontSize: 12, color: SUCCESS_TEXT, marginTop: 2, fontWeight: 500 }}
          >
            ✓ Uploaded successfully
          </div>
        )}
      </div>
      {status === "uploaded" && (
        <button
          onClick={onRemove}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
          }}
        >
          <X size={14} color={TEXT_SECONDARY} />
        </button>
      )}
    </div>
  );
}

// ─── DocumentUploadCard ───────────────────────────────────────────────────────
function DocumentUploadCard({
  docState,
  fileName,
  progress,
  onAddDocument,
  onRemove,
  onSubmit,
}: {
  docState: DocState;
  fileName: string;
  progress: number;
  onAddDocument: () => void;
  onRemove: () => void;
  onSubmit: () => void;
}) {
  const REQUIRED_DOCS = [
    "Explanation of Benefits (EOB)",
    "Itemized receipt from provider",
  ];
  const ACCEPTED_FMTS = ["PDF", "JPEG", "PNG", "HEIC"];

  return (
    <motion.div variants={cardVariants} initial="initial" animate="animate">
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          boxShadow: CARD_SHADOW,
          overflow: "hidden",
          marginTop: 6,
        }}
      >
        {/* Gradient header */}
        <div style={{ background: ASSIST_IQ_GRADIENT, padding: "14px 16px" }}>
          <div
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.7)",
              fontWeight: 500,
              letterSpacing: 0.4,
              textTransform: "uppercase",
              marginBottom: 3,
            }}
          >
            Documentation required for
          </div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: -0.2,
            }}
          >
            Bigtown Dentistry · #123456
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "14px 16px" }}>
          {/* Accepted formats */}
          <div style={{ marginBottom: 14 }}>
            <div
              style={{
                fontSize: 10,
                color: TEXT_SECONDARY,
                fontWeight: 600,
                marginBottom: 7,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Acceptable formats
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {ACCEPTED_FMTS.map((fmt) => (
                <span
                  key={fmt}
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: PRIMARY_BTN,
                    background: "#eef1fb",
                    border: "1px solid #c9d1f5",
                    borderRadius: 6,
                    padding: "2px 7px",
                  }}
                >
                  {fmt}
                </span>
              ))}
            </div>
          </div>

          {/* Required documents checklist */}
          <div style={{ marginBottom: 14 }}>
            <div
              style={{
                fontSize: 10,
                color: TEXT_SECONDARY,
                fontWeight: 600,
                marginBottom: 8,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Required documents
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {REQUIRED_DOCS.map((doc) => (
                <div
                  key={doc}
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <CheckSquareIcon />
                  <span style={{ fontSize: 13, color: TEXT_PRIMARY, lineHeight: 1.4 }}>
                    {doc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* File status row */}
          {(docState === "uploading" || docState === "uploaded") && (
            <FileStatusRow
              fileName={fileName}
              status={docState}
              progress={progress}
              onRemove={onRemove}
            />
          )}

          {/* Add document text button */}
          {docState === "idle" && (
            <button
              onClick={onAddDocument}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--app-font)",
                fontSize: 14,
                fontWeight: 600,
                color: PRIMARY_BTN,
                padding: "4px 0",
                marginBottom: 4,
              }}
            >
              <Paperclip size={15} />
              Add a document
            </button>
          )}

          {/* Submit button */}
          <AnimatePresence>
            {docState === "uploaded" && (
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                onClick={onSubmit}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: 12,
                  background: PRIMARY_BTN,
                  border: "none",
                  cursor: "pointer",
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 600,
                  letterSpacing: -0.1,
                  fontFamily: "var(--app-font)",
                  marginTop: 4,
                }}
              >
                Submit documentation
              </motion.button>
            )}
          </AnimatePresence>

          {/* Submitted confirmation */}
          {docState === "submitted" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                background: SUCCESS_BG,
                border: "1px solid #a8e8c8",
                fontSize: 14,
                color: SUCCESS_TEXT,
                fontWeight: 500,
                textAlign: "center",
              }}
            >
              ✓ Document submitted
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── IOSActionSheet ───────────────────────────────────────────────────────────
function IOSActionSheet({
  onSelect,
  onClose,
}: {
  onSelect: (option: string) => void;
  onClose: () => void;
}) {
  const OPTIONS = [
    { label: "Take a photo", icon: <Camera size={20} color={PRIMARY_BTN} /> },
    {
      label: "Select from photo library",
      icon: <ImageIcon size={20} color={PRIMARY_BTN} />,
    },
    {
      label: "Attach a file",
      icon: <Paperclip size={20} color={PRIMARY_BTN} />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      onClick={onClose}
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{
          y: 0,
          transition: { type: "spring", stiffness: 280, damping: 32 },
        }}
        exit={{ y: "100%", transition: { duration: 0.22, ease: "easeIn" } }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "rgba(242,242,247,0.96)",
          backdropFilter: "blur(40px) saturate(200%)",
          WebkitBackdropFilter: "blur(40px) saturate(200%)",
          borderRadius: "20px 20px 0 0",
          overflow: "hidden",
          paddingBottom: "calc(16px + env(safe-area-inset-bottom, 0px))",
        }}
      >
        {/* Drag handle */}
        <div
          style={{
            width: 36,
            height: 4,
            borderRadius: 2,
            background: "rgba(0,0,0,0.2)",
            margin: "10px auto 0",
          }}
        />

        {/* Title */}
        <div
          style={{
            textAlign: "center",
            padding: "12px 20px",
            borderBottom: "0.5px solid rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: TEXT_SECONDARY,
              letterSpacing: 0.1,
            }}
          >
            Add a document
          </div>
        </div>

        {/* Options */}
        <div>
          {OPTIONS.map((opt, i) => (
            <button
              key={opt.label}
              onClick={() => onSelect(opt.label)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "15px 20px",
                background: "none",
                border: "none",
                borderBottom:
                  i < OPTIONS.length - 1
                    ? "0.5px solid rgba(0,0,0,0.08)"
                    : "none",
                cursor: "pointer",
                fontFamily: "var(--app-font)",
                fontSize: 17,
                color: TEXT_PRIMARY,
                textAlign: "left",
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: 28,
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {opt.icon}
              </span>
              {opt.label}
            </button>
          ))}
        </div>

        {/* Cancel */}
        <div style={{ padding: "8px 16px 0" }}>
          <button
            onClick={onClose}
            style={{
              width: "100%",
              padding: "15px",
              borderRadius: 14,
              background: "rgba(255,255,255,0.9)",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--app-font)",
              fontSize: 17,
              fontWeight: 600,
              color: "#c8102e",
            }}
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── WelcomeSplash ────────────────────────────────────────────────────────────
function WelcomeSplash({ onChipSend }: { onChipSend: (text: string) => void }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: "28px 24px 20px",
        flex: 1,
      }}
    >
      {/* Logo sphere */}
      <motion.div
        initial={{ scale: 0.75, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          transition: { type: "spring", stiffness: 300, damping: 22 },
        }}
        style={{
          width: 54,
          height: 54,
          borderRadius: "50%",
          background: ASSIST_IQ_GRADIENT,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
          boxShadow: "0 8px 24px rgba(37,20,111,0.28)",
          letterSpacing: 0,
        }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.913 13.9149L11.9997 24.0033L10.087 13.9149L0 12.0013L10.087 10.0884L12.0003 0L13.913 10.0884L24 12.0013L13.913 13.9149Z" fill="white"/>
          <path d="M20.2758 19.7969L19.5994 23.3628L18.923 19.7969L15.3569 19.1204L18.923 18.4439L19.5994 14.8781L20.2752 18.4439L23.8412 19.1204L20.2758 19.7969Z" fill="white"/>
        </svg>
      </motion.div>

      {/* Greeting */}
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.1, duration: 0.4 } }}
        style={{
          fontSize: 30,
          fontWeight: 700,
          color: TEXT_PRIMARY,
          letterSpacing: -0.7,
          margin: "0 0 10px",
          lineHeight: 1.15,
          fontFamily: "var(--app-font)",
        }}
      >
        Good morning,
        <br />
        Penny!
      </motion.h1>

      {/* Subtitle with gradient brand name */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.17, duration: 0.4 } }}
        style={{
          fontSize: 16,
          color: TEXT_SECONDARY,
          margin: "0 0 28px",
          lineHeight: 1.55,
          fontFamily: "var(--app-font)",
        }}
      >
        I&apos;m{" "}
        <span
          style={{
            background: ASSIST_IQ_GRADIENT,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontWeight: 700,
          }}
        >
          WEXly
        </span>
        , your Benefits helper.
        <br />
        How can I help you today?
      </motion.p>

      {/* Suggested actions label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.26, duration: 0.3 } }}
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: TEXT_SECONDARY,
          letterSpacing: 0.4,
          textTransform: "uppercase",
          marginBottom: 12,
          fontFamily: "var(--app-font)",
        }}
      >
        Suggested actions
      </motion.div>

      {/* Chips */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          width: "100%",
        }}
      >
        {WELCOME_CHIPS.map((chip, i) => (
          <motion.div
            key={chip.label}
            initial={{ opacity: 0, x: -16 }}
            animate={{
              opacity: 1,
              x: 0,
              transition: {
                delay: 0.32 + i * 0.08,
                type: "spring",
                stiffness: 320,
                damping: 28,
              },
            }}
          >
            <AppPromptChip
              label={chip.label}
              icon={chip.icon}
              variant="outlined"
              onClick={() => onChipSend(chip.label)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── DentistEobPlaceholder ────────────────────────────────────────────────────
function DentistEobPlaceholder() {
  return (
    <div
      style={{
        width: 340,
        background: "#fff",
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: "0 4px 24px rgba(0,0,0,0.28)",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Header band */}
      <div
        style={{
          background: "#25146F",
          padding: "12px 16px 10px",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <div style={{ color: "#fff", fontSize: 14, fontWeight: 700, letterSpacing: 0.4 }}>
          DENTAL PLAN — EXPLANATION OF BENEFITS
        </div>
        <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 11 }}>
          WEX Benefits, Inc. · Claim #DEN-2025-004821
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "10px 16px 12px", display: "flex", flexDirection: "column", gap: 7 }}>
        {/* Patient/Provider rows */}
        {[
          ["Patient", "Penny Smith"],
          ["Provider", "Bright Smiles Dental"],
          ["Date of Service", "Mar 14, 2026"],
          ["Group #", "GRP-88421"],
        ].map(([label, value]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 11, color: "#888" }}>{label}</span>
            <span style={{ fontSize: 11, color: "#222", fontWeight: 500 }}>{value}</span>
          </div>
        ))}

        <div style={{ height: 1, background: "#eee", margin: "2px 0" }} />

        {/* Service line items */}
        <div style={{ fontSize: 10, color: "#555", fontWeight: 600, marginBottom: 2 }}>
          SERVICES
        </div>
        {[
          ["D0120 — Periodic Exam", "$95.00"],
          ["D1110 — Prophylaxis (Adult)", "$145.00"],
          ["D0330 — Panoramic X-Ray", "$180.00"],
        ].map(([svc, amt]) => (
          <div key={svc} style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 10, color: "#555" }}>{svc}</span>
            <span style={{ fontSize: 10, color: "#333" }}>{amt}</span>
          </div>
        ))}

        <div style={{ height: 1, background: "#eee", margin: "2px 0" }} />

        {/* Totals */}
        {[
          ["Total Billed", "$290.00"],
          ["Plan Paid", "$80.00"],
        ].map(([label, value]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 11, color: "#888" }}>{label}</span>
            <span style={{ fontSize: 11, color: "#444" }}>{value}</span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#25146F" }}>Patient Responsibility</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#25146F" }}>$210.00</span>
        </div>
      </div>
    </div>
  );
}

// ─── CameraViewfinder ─────────────────────────────────────────────────────────
interface CameraViewfinderProps {
  onCapture: () => void;
  onClose: () => void;
  isCapturing: boolean;
}

function CameraViewfinder({ onCapture, onClose, isCapturing }: CameraViewfinderProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 60,
        background: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px 20px 10px",
          flexShrink: 0,
        }}
      >
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "#fff",
            fontSize: 16,
            fontWeight: 500,
            cursor: "pointer",
            padding: "4px 0",
          }}
        >
          Cancel
        </button>
        {/* Flash icon (decorative) */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M13 2L4.5 13.5H11L10 22L20 10H13.5L13 2Z"
            fill="#FFD700"
            stroke="#FFD700"
            strokeWidth="0.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Viewfinder */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          padding: "0 20px",
          gap: 16,
        }}
      >
        {/* Corner brackets */}
        {(() => {
          const S = 28, T = 3, R = 4, C = "#fff";
          const corners = [
            { top: 0, left: 0, borderTop: `${T}px solid ${C}`, borderLeft: `${T}px solid ${C}`, borderTopLeftRadius: R },
            { top: 0, right: 0, borderTop: `${T}px solid ${C}`, borderRight: `${T}px solid ${C}`, borderTopRightRadius: R },
            { bottom: 0, left: 0, borderBottom: `${T}px solid ${C}`, borderLeft: `${T}px solid ${C}`, borderBottomLeftRadius: R },
            { bottom: 0, right: 0, borderBottom: `${T}px solid ${C}`, borderRight: `${T}px solid ${C}`, borderBottomRightRadius: R },
          ];
          return corners.map((style, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: S,
                height: S,
                ...style,
              }}
            />
          ));
        })()}

        <DentistEobPlaceholder />

        <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, letterSpacing: 0.2 }}>
          Align document with frame
        </div>
      </div>

      {/* Bottom bar — shutter button */}
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px 0 32px",
        }}
      >
        <button
          onClick={onCapture}
          style={{
            width: 70,
            height: 70,
            borderRadius: "50%",
            background: "#fff",
            border: "4px solid rgba(255,255,255,0.35)",
            outline: "3px solid #fff",
            cursor: "pointer",
            padding: 0,
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* Flash overlay */}
      <AnimatePresence>
        {isCapturing && (
          <motion.div
            key="flash"
            initial={{ opacity: 0.9 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              position: "absolute",
              inset: 0,
              background: "#fff",
              pointerEvents: "none",
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AppAssistIQ() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimestamp, setTypingTimestamp] = useState("");
  const [claimWorked, setClaimWorked] = useState(false);
  const [docState, setDocState] = useState<DocState>("idle");
  const [docFileName, setDocFileName] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [claimsFlowStep, setClaimsFlowStep] = useState(0);
  const [showCamera, setShowCamera] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  // Focus the input on mount so the keyboard opens immediately on mobile
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 350);
    return () => clearTimeout(t);
  }, []);

  // Auto-scroll to bottom whenever content changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isTyping, docState]);

  // Cleanup upload interval on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  // ── Helper: add a user message without triggering AI ──────────────
  const addUserMessage = useCallback((text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "user",
        content: text,
        timestamp: now(),
        type: "text",
      },
    ]);
  }, []);

  // ── Claims flow step 1: show claim card ─────────────────────────────
  const startClaimsFlow = useCallback(() => {
    setIsTyping(true);
    setTypingTimestamp(now());
    setClaimsFlowStep(1);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content:
            "Sure! I looked at your claims history and it seems like the following claim needs additional documentation:",
          timestamp: now(),
          type: "claim-card",
          showFeedback: true,
        },
      ]);
    }, 1400);
  }, []);

  // ── Claims flow step 2: show doc upload card ────────────────────────
  const continueClaimsFlow = useCallback(() => {
    setIsTyping(true);
    setTypingTimestamp(now());
    setClaimsFlowStep(2);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "Sounds good! You can upload your document here:",
          timestamp: now(),
          type: "doc-upload-card",
          showFeedback: false,
        },
      ]);
    }, 900);
  }, []);

  // ── Claims flow step 3: scanning + final approval ───────────────────
  const finalApproval = useCallback(() => {
    setIsTyping(true);
    setTypingTimestamp(now());

    // First AI message: scanning
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content:
            "Thanks! I'm scanning the uploaded document and extracting the details now…",
          timestamp: now(),
          type: "text",
          showFeedback: false,
        },
      ]);

      // Second round of typing → approval
      setTimeout(() => {
        setIsTyping(true);
        setTypingTimestamp(now());

        setTimeout(() => {
          setIsTyping(false);
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              role: "assistant",
              content:
                "Your document has been verified and your claim is approved for reimbursement! 🎉",
              timestamp: now(),
              type: "text",
              showFeedback: true,
            },
          ]);
          setClaimsFlowStep(3);
        }, 2000);
      }, 300);
    }, 1200);
  }, []);

  // ── Upload progress simulation ──────────────────────────────────────
  const simulateUpload = useCallback((fileName: string) => {
    setDocFileName(fileName);
    setDocState("uploading");
    setUploadProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20 + 8;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        progressIntervalRef.current = null;
        setUploadProgress(100);
        setTimeout(() => setDocState("uploaded"), 200);
      } else {
        setUploadProgress(Math.round(progress));
      }
    }, 150);
    progressIntervalRef.current = interval;
  }, []);

  // ── Main send handler ───────────────────────────────────────────────
  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      addUserMessage(trimmed);
      setInput("");

      if (isClaimsTrigger(trimmed)) {
        startClaimsFlow();
      } else {
        setIsTyping(true);
        setTypingTimestamp(now());
        setTimeout(() => {
          setIsTyping(false);
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              role: "assistant",
              content: getResponse(trimmed),
              timestamp: now(),
              type: "text",
              showFeedback: true,
            },
          ]);
        }, 1000 + Math.random() * 700);
      }
    },
    [addUserMessage, startClaimsFlow]
  );

  // ── Work on claim ───────────────────────────────────────────────────
  const handleWorkOnClaim = useCallback(() => {
    if (claimWorked) return;
    setClaimWorked(true);
    addUserMessage("Work on claim #123456");
    continueClaimsFlow();
  }, [claimWorked, addUserMessage, continueClaimsFlow]);

  // ── Action sheet selection ──────────────────────────────────────────
  const handleActionSheetSelect = useCallback((option: string) => {
    setShowActionSheet(false);
    if (option === "Take a photo") {
      setShowCamera(true);
    } else {
      simulateUpload("dentist-eob.pdf");
    }
  }, [simulateUpload]);

  // ── Camera capture ──────────────────────────────────────────────────
  const handleCameraCapture = useCallback(() => {
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
      setShowCamera(false);
      simulateUpload("dentist-eob.pdf");
    }, 420);
  }, [simulateUpload]);

  // ── Submit documentation ────────────────────────────────────────────
  const handleSubmitDoc = useCallback(() => {
    setDocState("submitted");
    finalApproval();
  }, [finalApproval]);

  const inWelcome = messages.length === 0 && !isTyping;

  return (
    <motion.div
      initial={{ opacity: 0, y: 56 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 320, damping: 30 }}
      style={{
        height: "var(--app-screen-height, 100dvh)",
        display: "flex",
        flexDirection: "column",
        background: `
          radial-gradient(ellipse at 8% 28%, rgba(37,20,111,0.065) 0%, transparent 48%),
          radial-gradient(ellipse at 92% 78%, rgba(200,16,46,0.055) 0%, transparent 42%),
          #f8f9fd
        `,
        fontFamily: "var(--app-font)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <AppTopSpacer variant="home" />
      {/* Nav bar */}
      <AppNavBar
        variant="full-page"
        title={inWelcome ? "" : "WEXly"}
        onClose={() => navigate(-1)}
      />

      {/* Scrollable content */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          padding: inWelcome ? "0" : "16px 16px 0",
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {inWelcome ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
              style={{ flex: 1, display: "flex", flexDirection: "column" }}
            >
              <WelcomeSplash onChipSend={send} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.2 } }}
              style={{ flex: 1 }}
            >
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  variants={msgVariants}
                  initial="initial"
                  animate="animate"
                  style={{
                    marginBottom: 20,
                    ...(msg.role === "user"
                      ? { display: "flex", justifyContent: "flex-end" }
                      : { paddingRight: 0 }),
                  }}
                >
                  {msg.role === "assistant" ? (
                    <div style={{ paddingRight: 40 }}>
                      <AssistIQMessageHeader timestamp={msg.timestamp} />
                      <div style={{ paddingLeft: 36 }}>
                        <p
                          style={{
                            margin: "0 0 4px",
                            fontSize: 15,
                            lineHeight: 1.6,
                            color: TEXT_PRIMARY,
                            letterSpacing: -0.1,
                          }}
                        >
                          {msg.content}
                        </p>
                        {msg.type === "claim-card" && (
                          <ClaimPreviewCard
                            onWorkOnClaim={handleWorkOnClaim}
                            isWorked={claimWorked && claimsFlowStep >= 2}
                          />
                        )}
                        {msg.type === "doc-upload-card" && (
                          <DocumentUploadCard
                            docState={docState}
                            fileName={docFileName}
                            progress={uploadProgress}
                            onAddDocument={() => setShowActionSheet(true)}
                            onRemove={() => {
                              if (progressIntervalRef.current) {
                                clearInterval(progressIntervalRef.current);
                                progressIntervalRef.current = null;
                              }
                              setDocState("idle");
                              setDocFileName("");
                              setUploadProgress(0);
                            }}
                            onSubmit={handleSubmitDoc}
                          />
                        )}
                        {msg.showFeedback && <FeedbackRow />}
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        maxWidth: "76%",
                        padding: "10px 16px",
                        borderRadius: "18px 18px 4px 18px",
                        background: USER_BUBBLE_BG,
                        fontSize: 15,
                        lineHeight: 1.55,
                        color: TEXT_PRIMARY,
                        letterSpacing: -0.1,
                      }}
                    >
                      {msg.content}
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing indicator */}
              <AnimatePresence>
                {isTyping && (
                  <TypingIndicator key="typing" timestamp={typingTimestamp} />
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom padding spacer */}
        <div style={{ height: 16, flexShrink: 0 }} />
      </div>

      {/* Input bar */}
      <div
        style={{
          padding: "10px 16px",
          paddingBottom: "calc(10px + env(safe-area-inset-bottom, 0px))",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          background: "rgba(248,249,253,0.88)",
          borderTop: "0.5px solid rgba(0,0,0,0.07)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#fff",
            borderRadius: 999,
            padding: "8px 8px 8px 14px",
            boxShadow:
              "0 2px 14px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
          }}
        >
          {/* Attach icon */}
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              padding: 2,
              flexShrink: 0,
            }}
            aria-label="Attach file"
            onClick={() =>
              claimsFlowStep === 2 && docState === "idle"
                ? setShowActionSheet(true)
                : undefined
            }
          >
            <Paperclip size={18} color={TEXT_SECONDARY} />
          </button>

          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder="Message WEXly…"
            style={{
              flex: 1,
              border: "none",
              background: "transparent",
              outline: "none",
              fontFamily: "var(--app-font)",
              fontSize: 16,
              letterSpacing: -0.3,
              color: TEXT_PRIMARY,
              lineHeight: "22px",
            }}
          />

          {/* Send / mic */}
          {input.trim() ? (
            <button
              onClick={() => send(input)}
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: PRIMARY_BTN,
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Send size={15} strokeWidth={2.5} color="#fff" style={{ marginLeft: 1 }} />
            </button>
          ) : (
            <button
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "#f0f2f7",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
              aria-label="Voice input"
            >
              <Mic size={16} color={TEXT_SECONDARY} />
            </button>
          )}
        </div>
      </div>

      {/* iOS Action Sheet overlay */}
      <AnimatePresence>
        {showActionSheet && (
          <IOSActionSheet
            key="action-sheet"
            onSelect={handleActionSheetSelect}
            onClose={() => setShowActionSheet(false)}
          />
        )}
      </AnimatePresence>

      {/* Camera viewfinder overlay */}
      <AnimatePresence>
        {showCamera && (
          <CameraViewfinder
            key="camera"
            onCapture={handleCameraCapture}
            onClose={() => setShowCamera(false)}
            isCapturing={isCapturing}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

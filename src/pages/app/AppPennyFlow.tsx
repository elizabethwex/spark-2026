import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Trash2, ChevronDown, Camera, Image as ImageIcon, Paperclip, CheckCircle2 } from "lucide-react";
import { AppNavBar } from "@/components/app-shell/AppNavBar";
import { AppTopSpacer } from "@/components/app-shell/AppTopSpacer";

// ─── Design tokens ────────────────────────────────────────────────────────────
const PRIMARY = "#3958c3";
const PRIMARY_DARK = "#172da0";
const BG_TINT = "#eef2ff";
const CARD_BG = "#fff";
const YELLOW_BG = "#fff8cc";
const SUCCESS_GREEN = "#007a55";
const SUCCESS_BG = "#dcfae6";
const TEXT_PRIMARY = "#111322";
const TEXT_SECONDARY = "rgba(60,60,67,0.6)";

// Bigtown Dentistry receipt photo (from Figma assets)
const RECEIPT_IMG =
  "https://www.figma.com/api/mcp/asset/10a206f8-ecc2-4bee-a1e1-061b7ac51f9e";
// Document folder illustration (from Figma assets)
const DOC_ILLUSTRATION =
  "https://www.figma.com/api/mcp/asset/1d7ed4b7-f166-4701-ae72-1e7cc50bb7bc";

// ─── Shared sub-components ────────────────────────────────────────────────────

/** Thin animated progress bar */
function ProgressBar({ progress }: { progress: number }) {
  return (
    <div
      style={{
        width: "100%",
        height: 4,
        background: "#edf1ff",
        borderRadius: 9999,
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <motion.div
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        style={{ height: "100%", background: PRIMARY, borderRadius: 9999 }}
      />
    </div>
  );
}

/** Pill button – primary (solid) or secondary (ghost) */
function PillButton({
  label,
  variant = "primary",
  onClick,
}: {
  label: string;
  variant?: "primary" | "secondary";
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        width: "100%",
        height: 48,
        borderRadius: 100,
        border: "none",
        cursor: "pointer",
        fontSize: 17,
        fontWeight: 510,
        fontFamily: "var(--app-font)",
        letterSpacing: -0.4,
        background: variant === "primary" ? PRIMARY : "#edf1ff",
        color: variant === "primary" ? "#fff" : PRIMARY_DARK,
        flexShrink: 0,
      }}
    >
      {label}
    </motion.button>
  );
}

// ─── Step 0 — Transaction detail ──────────────────────────────────────────────
function StepTransaction({ onNext }: { onNext: () => void }) {
  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        background: "#f1f3fb",
        display: "flex",
        flexDirection: "column",
        gap: 0,
      }}
    >
      {/* Yellow notification banner */}
      <div style={{ padding: 16 }}>
        <div
          style={{
            background: YELLOW_BG,
            borderRadius: 12,
            padding: 16,
            boxShadow: "0 4px 16px rgba(10,13,18,0.10)",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <span style={{ fontSize: 18, fontWeight: 600, color: TEXT_PRIMARY, letterSpacing: -0.18, lineHeight: "24px", flex: 1 }}>
              Documentation is required.
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 16, color: TEXT_PRIMARY, lineHeight: "24px" }}>
            To verify your purchase, you are required to upload documentation.
          </p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onNext}
            style={{
              width: "100%",
              height: 56,
              borderRadius: 9999,
              border: "none",
              cursor: "pointer",
              background: "#172da0",
              color: "#fff",
              fontSize: 16,
              fontWeight: 500,
              fontFamily: "var(--app-font)",
            }}
          >
            Upload a document
          </motion.button>
          <button
            style={{
              width: "100%",
              height: 56,
              borderRadius: 9999,
              border: "none",
              cursor: "pointer",
              background: "rgba(255,255,255,0.8)",
              color: PRIMARY_DARK,
              fontSize: 16,
              fontWeight: 500,
              fontFamily: "var(--app-font)",
            }}
          >
            I don&apos;t have documentation
          </button>
        </div>
      </div>

      {/* Transaction details list */}
      <div style={{ padding: "8px 16px 16px" }}>
        <div
          style={{
            background: CARD_BG,
            borderRadius: 12,
            border: "1px solid #dcdfea",
            overflow: "hidden",
          }}
        >
          {[
            { label: "Payment method", value: "Limited Purpose FSA Debit" },
            { label: "Transaction amount", value: "$210.00" },
            { label: "Date", value: "November 24, 2026" },
            { label: "Merchant", value: "Bigtown Dentistry" },
          ].map(({ label, value }, i) => (
            <div
              key={label}
              style={{
                padding: "14px 16px",
                borderTop: i > 0 ? "1px solid #e6e6e6" : "none",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <span style={{ fontSize: 17, color: TEXT_PRIMARY, fontFamily: "var(--app-font)", fontWeight: 400, letterSpacing: -0.4 }}>
                {value}
              </span>
              <span style={{ fontSize: 14, color: TEXT_SECONDARY, fontFamily: "var(--app-font)" }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Support card */}
      <div style={{ padding: "0 16px 32px" }}>
        <div
          style={{
            background: "#fcfcfd",
            borderRadius: 12,
            padding: 16,
            boxShadow: "3px 3px 4px rgba(57,88,195,0.2)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "linear-gradient(180deg, #e10600 0%, #c8102e 25%, #8a0f22 40%, #3b0a45 70%, #0b1e4a 100%)",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1l1.2 2.5L10 4.2 8 6.1l.5 2.9L6 7.7 3.5 9 4 6.1 2 4.2l2.8-.7z" fill="#fff" />
              </svg>
            </div>
            <span style={{ fontSize: 16, fontWeight: 700, color: TEXT_PRIMARY, fontFamily: "var(--app-font)" }}>
              Questions?
            </span>
          </div>
          <p style={{ margin: "0 0 4px", fontSize: 16, color: TEXT_PRIMARY, lineHeight: "24px", fontFamily: "var(--app-font)" }}>
            We can help with any questions you have about eligibility or documents.
          </p>
          <button style={{ background: "none", border: "none", padding: "8px 0", cursor: "pointer", fontSize: 16, fontWeight: 700, color: PRIMARY, fontFamily: "var(--app-font)" }}>
            Get support
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Step 1 — Upload method ───────────────────────────────────────────────────
function StepUploadMethod({ onSelect }: { onSelect: (method: string) => void }) {
  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        background: BG_TINT,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ProgressBar progress={25} />
      <div style={{ padding: "24px 24px 0", display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Illustration */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 161 }}>
          {DOC_ILLUSTRATION ? (
            <img src={DOC_ILLUSTRATION} alt="" style={{ width: 154, height: 117, objectFit: "contain" }} />
          ) : (
            <FileText size={80} color={PRIMARY} />
          )}
        </div>

        {/* Headline */}
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: TEXT_PRIMARY, textAlign: "center", lineHeight: "32px", letterSpacing: -0.48, fontFamily: "var(--app-font)" }}>
          How would you like to submit your document?
        </h2>

        {/* Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 6 }}>
          {[
            { label: "Take a photo", icon: <Camera size={20} color={PRIMARY_DARK} /> },
            { label: "Select from photo library", icon: <ImageIcon size={20} color={PRIMARY_DARK} /> },
            { label: "Attach a file", icon: <Paperclip size={20} color={PRIMARY_DARK} /> },
          ].map(({ label }) => (
            <motion.button
              key={label}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(label)}
              style={{
                width: "100%",
                height: 48,
                borderRadius: 100,
                border: "none",
                cursor: "pointer",
                background: "#edf1ff",
                color: PRIMARY_DARK,
                fontSize: 17,
                fontWeight: 510,
                letterSpacing: -0.4,
                fontFamily: "var(--app-font)",
              }}
            >
              {label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* What documents work best? */}
      <div style={{ padding: 16 }}>
        <div
          style={{
            background: "#f9f9fb",
            border: "1px solid #d0d6ea",
            borderRadius: 12,
            padding: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <div style={{ width: 24, height: 24, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" stroke="#5f6a94" strokeWidth="1.5" />
                <path d="M10 9v5M10 7v1" stroke="#5f6a94" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <span style={{ fontSize: 16, fontWeight: 700, color: TEXT_PRIMARY, fontFamily: "var(--app-font)" }}>
              What documents work best?
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 16, color: TEXT_PRIMARY, lineHeight: "24px", fontFamily: "var(--app-font)" }}>
            Use a clear photo of a receipt or EOB.{"\n"}Include provider name, date, service, and amount.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Step 2 — Camera viewfinder ───────────────────────────────────────────────
function StepCamera({ onCapture, onClose }: { onCapture: () => void; onClose: () => void }) {
  const [isCapturing, setIsCapturing] = useState(false);

  const handleShutter = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
      onCapture();
    }, 420);
  };

  return (
    <div style={{ flex: 1, position: "relative", background: "#0a0a0a", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Top guidance bar */}
      <div
        style={{
          background: "rgba(17,19,34,0.66)",
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          position: "relative",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close camera"
          style={{
            position: "absolute",
            left: 16,
            top: "50%",
            transform: "translateY(-50%)",
            border: "none",
            background: "rgba(255,255,255,0.12)",
            color: "#fff",
            fontSize: 15,
            fontWeight: 600,
            fontFamily: "var(--app-font)",
            padding: "8px 12px",
            borderRadius: 12,
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
        <p style={{ margin: 0, fontSize: 16, color: "#fff", textAlign: "center", lineHeight: "24px", fontFamily: "var(--app-font)" }}>
          Hold your camera steady and make sure all the information is visible
        </p>
      </div>

      {/* Viewfinder with receipt */}
      <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img
          src={RECEIPT_IMG}
          alt="Bigtown Dentistry receipt"
          style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }}
        />
      </div>

      {/* Bottom controls */}
      <div
        style={{
          flexShrink: 0,
          height: 122,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 32px",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "#111322", opacity: 0.5 }} />

        {/* Select button */}
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, width: 51 }}>
          <div style={{ width: 51, height: 51, borderRadius: "50%", background: "#111322", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ImageIcon size={22} color="#fff" />
          </div>
          <span style={{ color: "#fff", fontSize: 15, fontWeight: 500, fontFamily: "var(--app-font)" }}>Select</span>
        </div>

        {/* Shutter button */}
        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={handleShutter}
          style={{
            position: "relative",
            zIndex: 1,
            width: 74,
            height: 74,
            borderRadius: "50%",
            background: "#fff",
            border: "4px solid rgba(220,223,234,0.8)",
            outline: "3px solid rgba(255,255,255,0.5)",
            cursor: "pointer",
            padding: 0,
          }}
        />

        {/* Flash button */}
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, width: 51 }}>
          <div style={{ width: 51, height: 51, borderRadius: "50%", background: "#111322", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M13 2L4.5 13.5H11L10 22L20 10H13.5L13 2Z" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
              <line x1="4" y1="4" x2="20" y2="20" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span style={{ color: "#fff", fontSize: 15, fontWeight: 500, fontFamily: "var(--app-font)" }}>Flash off</span>
        </div>
      </div>

      {/* Capture flash overlay */}
      <AnimatePresence>
        {isCapturing && (
          <motion.div
            key="flash"
            initial={{ opacity: 0.9 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ position: "absolute", inset: 0, background: "#fff", pointerEvents: "none", zIndex: 10 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Step 3 — Document preview ────────────────────────────────────────────────
function StepDocPreview({ onContinue, onAddAnother }: { onContinue: () => void; onAddAnother: () => void }) {
  return (
    <div style={{ flex: 1, overflowY: "auto", background: BG_TINT, display: "flex", flexDirection: "column" }}>
      <ProgressBar progress={40} />
      <div style={{ padding: "24px 24px 0", display: "flex", flexDirection: "column", gap: 10 }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: TEXT_PRIMARY, textAlign: "center", lineHeight: "32px", letterSpacing: -0.48, fontFamily: "var(--app-font)" }}>
          Submit or add document
        </h2>

        {/* Document card */}
        <div style={{ background: CARD_BG, borderRadius: 12, overflow: "hidden" }}>
          {/* File row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 16px",
              borderBottom: "1px solid #eee",
            }}
          >
            <FileText size={20} color="#5f6a94" style={{ flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 16, fontWeight: 700, color: TEXT_PRIMARY, fontFamily: "var(--app-font)" }}>
              IMG_21017.jpg
            </span>
            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}>
              <Trash2 size={20} color="#5f6a94" />
            </button>
          </div>

          {/* Receipt thumbnail */}
          <div style={{ borderRadius: "0 0 12px 12px", overflow: "hidden", height: 280 }}>
            <img src={RECEIPT_IMG} alt="Receipt" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 6, paddingBottom: 32 }}>
          <PillButton label="Continue" onClick={onContinue} />
          <PillButton label="Add another document" variant="secondary" onClick={onAddAnother} />
        </div>
      </div>
    </div>
  );
}

// ─── Step 4 — Analyzing ───────────────────────────────────────────────────────
const ANALYSIS_STEPS = [
  "Reading document contents...",
  "Extracting data...",
  "Finishing up...",
];

function StepAnalyzing({ onDone }: { onDone: () => void }) {
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setCompleted(1), 900),
      setTimeout(() => setCompleted(2), 1800),
      setTimeout(() => setCompleted(3), 2700),
      setTimeout(onDone, 3400),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <div style={{ flex: 1, background: BG_TINT, display: "flex", flexDirection: "column" }}>
      <ProgressBar progress={57} />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px 128px",
          gap: 10,
        }}
      >
        {/* Illustration */}
        <div style={{ height: 161, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <motion.div
            animate={{ rotate: [0, -3, 3, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <FileText size={100} color="#b8c8f5" strokeWidth={1.2} />
          </motion.div>
        </div>

        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: TEXT_PRIMARY, textAlign: "center", lineHeight: "32px", letterSpacing: -0.48, fontFamily: "var(--app-font)" }}>
          Analyzing your document
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 0, paddingTop: 12, paddingLeft: 32 }}>
          {ANALYSIS_STEPS.map((step, i) => {
            const done = completed > i;
            return (
              <motion.div
                key={step}
                initial={{ opacity: 0.4 }}
                animate={{ opacity: done || completed === i ? 1 : 0.4 }}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 0" }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: done ? SUCCESS_BG : "#fcfcfd",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "background 0.3s",
                  }}
                >
                  {done && <CheckCircle2 size={16} color={SUCCESS_GREEN} />}
                </div>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: done ? 700 : 400,
                    color: TEXT_PRIMARY,
                    fontFamily: "var(--app-font)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {step}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Step 5 — Review & confirm ────────────────────────────────────────────────
function StepReview({ onSubmit }: { onSubmit: () => void }) {
  return (
    <div style={{ flex: 1, overflowY: "auto", background: BG_TINT, display: "flex", flexDirection: "column" }}>
      <ProgressBar progress={75} />
      <div style={{ padding: "24px 24px 32px", display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <h2 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 700, color: TEXT_PRIMARY, letterSpacing: -0.48, lineHeight: "32px", fontFamily: "var(--app-font)" }}>
            Review and confirm
          </h2>
          <p style={{ margin: 0, fontSize: 16, color: TEXT_SECONDARY, lineHeight: "24px", fontFamily: "var(--app-font)" }}>
            Review the details we&apos;ve filled in below and confirm everything is correct.
          </p>
        </div>

        {/* Uploaded document */}
        <div>
          <span style={{ fontSize: 16, fontWeight: 700, color: TEXT_PRIMARY, fontFamily: "var(--app-font)" }}>Uploaded documents</span>
          <div style={{ marginTop: 8, background: CARD_BG, borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
            <img src={RECEIPT_IMG} alt="Receipt thumbnail" style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6, flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 16, fontWeight: 600, color: TEXT_PRIMARY, fontFamily: "var(--app-font)" }}>
              BigtownDentistry.jpg
            </span>
            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}>
              <Trash2 size={20} color="#5f6a94" />
            </button>
          </div>
        </div>

        {/* Details table */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: TEXT_PRIMARY, fontFamily: "var(--app-font)" }}>Details</span>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: PRIMARY, fontSize: 16, fontWeight: 600, fontFamily: "var(--app-font)" }}>
              Edit
            </button>
          </div>
          <div style={{ background: CARD_BG, borderRadius: 12, overflow: "hidden", border: "1px solid #eee" }}>
            {[
              ["Date", "November 24, 2026"],
              ["Amount", "$210.00"],
              ["Merchant", "Bigtown Dentistry"],
              ["Category", "Dental"],
            ].map(([label, value], i) => (
              <div key={label} style={{ display: "flex", padding: "14px 16px", borderTop: i > 0 ? "1px solid #eee" : "none" }}>
                <span style={{ width: 100, fontSize: 16, color: TEXT_SECONDARY, fontFamily: "var(--app-font)", flexShrink: 0 }}>{label}</span>
                <span style={{ fontSize: 16, color: TEXT_PRIMARY, fontFamily: "var(--app-font)" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recipient */}
        <div>
          <span style={{ fontSize: 16, fontWeight: 700, color: TEXT_PRIMARY, fontFamily: "var(--app-font)", display: "block", marginBottom: 8 }}>
            Recipient
          </span>
          <div
            style={{
              background: CARD_BG,
              borderRadius: 12,
              border: "1px solid #eee",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: 16, color: TEXT_PRIMARY, fontFamily: "var(--app-font)" }}>Self</span>
            <ChevronDown size={18} color="#5f6a94" />
          </div>
        </div>

        {/* Items info box */}
        <div style={{ background: CARD_BG, borderRadius: 12, padding: 16, border: "1px solid #eee" }}>
          <p style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: TEXT_PRIMARY, fontFamily: "var(--app-font)" }}>
            Items found on your documentation
          </p>
          <p style={{ margin: 0, fontSize: 14, color: TEXT_SECONDARY, lineHeight: "20px", fontFamily: "var(--app-font)" }}>
            We found these items on your receipt. Items that look eligible are selected. You can adjust the selection.
          </p>
          {[
            ["Dental Exam", "$50.00"],
            ["Teeth Cleaning", "$90.00"],
            ["X-Rays", "$40.00"],
            ["Fluoride Treatment", "$30.00"],
          ].map(([name, amount]) => (
            <div key={name} style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              <span style={{ fontSize: 14, color: TEXT_PRIMARY, fontFamily: "var(--app-font)" }}>{name}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: TEXT_PRIMARY, fontFamily: "var(--app-font)" }}>{amount}</span>
            </div>
          ))}
          <div style={{ borderTop: "1px solid #eee", marginTop: 10, paddingTop: 10, display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: TEXT_PRIMARY, fontFamily: "var(--app-font)" }}>Total</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: TEXT_PRIMARY, fontFamily: "var(--app-font)" }}>$210.00</span>
          </div>
        </div>

        <PillButton label="Submit" onClick={onSubmit} />
      </div>
    </div>
  );
}

// ─── Step 6 — Claim approved ──────────────────────────────────────────────────
function StepApproved({ onGoHome }: { onGoHome: () => void }) {
  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        background: BG_TINT,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 24px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, width: "100%" }}>
        {/* Animated check icon */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 340, damping: 22 }}
          style={{ position: "relative" }}
        >
          {/* Glow ring */}
          <div
            style={{
              position: "absolute",
              inset: -25,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(52,199,89,0.15) 0%, transparent 70%)",
            }}
          />
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: "50%",
              background: SUCCESS_BG,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path d="M10 25l10 10L38 14" stroke={SUCCESS_GREEN} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ textAlign: "center", width: "100%" }}
        >
          <h2 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 600, color: "#1a1a1a", letterSpacing: -0.44, fontFamily: "var(--app-font)" }}>
            Claim approved!
          </h2>
          <p style={{ margin: 0, fontSize: 16, color: TEXT_SECONDARY, lineHeight: "24px", fontFamily: "var(--app-font)" }}>
            Your document has been verified and your claim is approved for reimbursement.
          </p>
        </motion.div>

        {/* Approved amount */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16 }}
        >
          <div
            style={{
              background: SUCCESS_GREEN,
              borderRadius: 12,
              padding: 16,
              textAlign: "center",
            }}
          >
            <p style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 500, color: "#f8f9fe", fontFamily: "var(--app-font)" }}>
              Approved amount
            </p>
            <p style={{ margin: 0, fontSize: 28, fontWeight: 900, color: "#fff", letterSpacing: 0.56, fontFamily: "var(--app-font)" }}>
              $210.00
            </p>
          </div>

          {/* Balance card */}
          <div
            style={{
              background: CARD_BG,
              borderRadius: 12,
              border: "1px solid #e3e7f4",
              padding: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#000", fontFamily: "var(--app-font)" }}>Current balance</p>
              <p style={{ margin: 0, fontSize: 16, color: TEXT_SECONDARY, fontFamily: "var(--app-font)" }}>Limited Purpose FSA 2026</p>
            </div>
            <span style={{ fontSize: 16, fontWeight: 600, color: TEXT_PRIMARY, fontFamily: "var(--app-font)" }}>$849.00</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ width: "100%", paddingTop: 8 }}
        >
          <PillButton label="Go to your homepage" onClick={onGoHome} />
        </motion.div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AppPennyFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback((next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  }, [step]);

  const next = useCallback(() => goTo(step + 1), [goTo, step]);

  const handleClose = useCallback(() => navigate("/app"), [navigate]);

  const navTitle = step === 0 ? "Recent transaction" : "Reimburse myself";

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      style={{
        height: "var(--app-screen-height, 100dvh)",
        display: "flex",
        flexDirection: "column",
        background: step === 2 ? "#0a0a0a" : BG_TINT,
        fontFamily: "var(--app-font)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Nav bar — hidden on camera step */}
      {step !== 2 && (
        <>
        <AppTopSpacer variant="home" />
        <AppNavBar variant="full-page" title={navTitle} onClose={handleClose} />
        </>
      )}

      {/* Step content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={step === 6 ? undefined : slideVariants}
          initial={step === 6 ? { opacity: 0 } : "enter"}
          animate={step === 6 ? { opacity: 1 } : "center"}
          exit={step === 6 ? { opacity: 0 } : "exit"}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}
        >
          {step === 0 && <StepTransaction onNext={next} />}
          {step === 1 && <StepUploadMethod onSelect={(method) => { if (method === "Take a photo") goTo(2); else goTo(3); }} />}
          {step === 2 && <StepCamera onCapture={() => goTo(3)} onClose={() => goTo(1)} />}
          {step === 3 && <StepDocPreview onContinue={() => goTo(4)} onAddAnother={() => goTo(2)} />}
          {step === 4 && <StepAnalyzing onDone={() => goTo(5)} />}
          {step === 5 && <StepReview onSubmit={() => goTo(6)} />}
          {step === 6 && <StepApproved onGoHome={() => navigate("/app")} />}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

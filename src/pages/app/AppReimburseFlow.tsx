import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Image as ImageIcon, Paperclip, Info, CheckCircle2, FileText, ChevronRight, Check, Search } from "lucide-react";
import { AppNavBar } from "@/components/app-shell/AppNavBar";
import { AppTopSpacer } from "@/components/app-shell/AppTopSpacer";

// ─── Design tokens ────────────────────────────────────────────────────────────
const PRIMARY = "var(--app-primary)";
const PRIMARY_DARK = "var(--app-primary-700)";
const BG_TINT = "var(--app-primary-50)";
const CARD_BG = "var(--app-neutral-00)";
const SUCCESS_GREEN = "var(--app-success)";
const SUCCESS_BG = "var(--app-success-surface)";
const TEXT_PRIMARY = "var(--app-text)";
const TEXT_SECONDARY = "var(--app-text-secondary)";

/** Static assets under `public/app-ui/` */
const assetPath = (file: string) => `${import.meta.env.BASE_URL}app-ui/${file}`;
const DOC_ILLUSTRATION = assetPath("penny-doc-illustration.svg");

// ─── Shared sub-components ────────────────────────────────────────────────────

/** Thin animated progress bar */
function ProgressBar({ progress }: { progress: number }) {
  return (
    <div
      style={{
        width: "100%",
        height: 6,
        background: "var(--app-primary-100, #e0e7ff)",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <motion.div
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        style={{ height: "100%", background: PRIMARY, borderTopRightRadius: 9999, borderBottomRightRadius: 9999 }}
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
        letterSpacing: -0.43,
        background: variant === "primary" ? PRIMARY : "var(--app-primary-50, #edf1ff)",
        color: variant === "primary" ? "#fff" : PRIMARY_DARK,
        flexShrink: 0,
      }}
    >
      {label}
    </motion.button>
  );
}

// ─── Step 1 — Upload Method ───────────────────────────────────────────────────
function StepUploadMethod({ onNext }: { onNext: () => void }) {
  return (
    <div style={{ flex: 1, overflowY: "auto", background: BG_TINT, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "24px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: TEXT_PRIMARY, textAlign: "center", lineHeight: "32px", letterSpacing: -0.48, fontFamily: "var(--app-font)" }}>
          Upload a document to start your claim.
        </h2>

        {/* Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 16 }}>
          {[
            { label: "Take a photo" },
            { label: "Select from photo library" },
            { label: "Attach a file" },
          ].map(({ label }) => (
            <motion.button
              key={label}
              whileTap={{ scale: 0.97 }}
              onClick={onNext}
              style={{
                width: "100%",
                height: 48,
                borderRadius: 100,
                border: "none",
                cursor: "pointer",
                background: "var(--app-primary-100)",
                color: "var(--app-primary-600)",
                fontSize: 17,
                fontWeight: 700,
                letterSpacing: -0.4,
                fontFamily: "var(--app-font)",
              }}
            >
              {label}
            </motion.button>
          ))}
          <button
            onClick={onNext}
            style={{
              background: "none",
              border: "none",
              color: PRIMARY,
              fontSize: 14,
              fontWeight: 500,
              padding: 16,
              cursor: "pointer",
              fontFamily: "var(--app-font)",
            }}
          >
            I don't have any documentation
          </button>
        </div>
      </div>

      {/* What documents work best? */}
      <div style={{ padding: 16, marginTop: "auto" }}>
        <div
          style={{
            background: "#f9f9fb",
            borderRadius: 12,
            padding: 16,
            boxShadow: "0px 3px 9px rgba(43,49,78,0.04), 0px 6px 18px rgba(43,49,78,0.06)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <div style={{ width: 24, height: 24, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Info size={20} color="var(--app-text)" />
            </div>
            <span style={{ fontSize: 16, fontWeight: 700, color: TEXT_PRIMARY, fontFamily: "var(--app-font)" }}>
              What documents work best?
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 16, color: TEXT_PRIMARY, lineHeight: "24px", fontFamily: "var(--app-font)" }}>
            Use a clear photo of a receipt or EOB.{"\n"}Include provider name, date, service, and amount.
          </p>
          <button style={{ background: "none", border: "none", padding: "8px 0 0", cursor: "pointer", fontSize: 16, fontWeight: 700, color: PRIMARY, fontFamily: "var(--app-font)" }}>
            View examples
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Step 2 — Camera Roll ─────────────────────────────────────────────────────
const CAMERA_ROLL_PHOTOS = [
  "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1607861716497-e65ab2917336?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1506784951206-b96e12a04d1a?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1498837167922-41c543bd07f6?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1488161628813-04466f872507?auto=format&fit=crop&w=300&q=80",
];

function StepCameraRoll({ onCancel, onUpload }: { onCancel: () => void; onUpload: () => void }) {
  const [selected, setSelected] = useState<Set<number>>(new Set([0, 1, 2]));

  const toggleSelect = (index: number) => {
    const newSelected = new Set(selected);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelected(newSelected);
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#fff", zIndex: 100 }}>
      {/* Top Navigation */}
      <div style={{ padding: "16px 16px 8px", display: "flex", flexDirection: "column", gap: 16, background: "rgba(249,249,249,0.9)", backdropFilter: "blur(10px)", borderBottom: "0.5px solid rgba(60,60,67,0.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={onCancel} style={{ background: "none", border: "none", color: "#007AFF", fontSize: 17, padding: 0, cursor: "pointer", fontFamily: "var(--app-font)" }}>
            Cancel
          </button>
          
          {/* Segmented Picker */}
          <div style={{ display: "flex", background: "rgba(118,118,128,0.12)", padding: 2, borderRadius: 8, width: 140 }}>
            <div style={{ flex: 1, background: "#fff", borderRadius: 6, padding: "4px 0", textAlign: "center", fontSize: 13, fontWeight: 600, boxShadow: "0 3px 8px rgba(0,0,0,0.12)", fontFamily: "var(--app-font)" }}>
              Photos
            </div>
            <div style={{ flex: 1, padding: "4px 0", textAlign: "center", fontSize: 13, fontWeight: 500, fontFamily: "var(--app-font)" }}>
              Albums
            </div>
          </div>

          <button onClick={onUpload} style={{ background: "none", border: "none", color: "#007AFF", fontSize: 17, fontWeight: 600, padding: 0, cursor: "pointer", fontFamily: "var(--app-font)" }}>
            Upload
          </button>
        </div>

        {/* Search */}
        <div style={{ display: "flex", alignItems: "center", background: "rgba(118,118,128,0.12)", borderRadius: 10, padding: "8px 12px", gap: 8 }}>
          <Search size={16} color="rgba(60,60,67,0.6)" />
          <input 
            type="text" 
            placeholder="Photos, People, Places..." 
            style={{ border: "none", background: "none", fontSize: 17, width: "100%", outline: "none", color: "#000", fontFamily: "var(--app-font)" }} 
          />
        </div>
      </div>

      {/* Grid */}
      <div style={{ flex: 1, overflowY: "auto", padding: "2px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, alignContent: "start" }}>
        {CAMERA_ROLL_PHOTOS.map((src, i) => {
          const isSelected = selected.has(i);
          return (
            <div 
              key={i} 
              onClick={() => toggleSelect(i)}
              style={{ aspectRatio: "1/1", position: "relative", cursor: "pointer" }}
            >
              <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              {isSelected && (
                <>
                  <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.3)" }} />
                  <div style={{ position: "absolute", bottom: 8, right: 8, width: 24, height: 24, borderRadius: "50%", background: "#007AFF", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Check size={14} color="#fff" strokeWidth={3} />
                  </div>
                </>
              )}
              {!isSelected && (
                <div style={{ position: "absolute", bottom: 8, right: 8, width: 24, height: 24, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.8)", background: "rgba(0,0,0,0.1)" }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Bar */}
      <div style={{ padding: "16px", background: "rgba(249,249,249,0.9)", backdropFilter: "blur(10px)", borderTop: "0.5px solid rgba(60,60,67,0.3)", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <span style={{ color: "#007AFF", fontSize: 17, fontWeight: 600, fontFamily: "var(--app-font)" }}>
          Show Selected ({selected.size})
        </span>
      </div>
    </div>
  );
}

// ─── Step 3 — Analyzing ───────────────────────────────────────────────────────
const ANALYSIS_STEPS = [
  "Uploading...",
  "Reading your document...",
  "Finding date and total...",
  "Preparing details to review...",
];

function StepAnalyzing({ onNext }: { onNext: () => void }) {
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setCompleted(1), 900),
      setTimeout(() => setCompleted(2), 1800),
      setTimeout(() => setCompleted(3), 2700),
      setTimeout(onNext, 3400),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onNext]);

  return (
    <div style={{ flex: 1, overflowY: "auto", background: BG_TINT, display: "flex", flexDirection: "column" }}>
      <ProgressBar progress={16} />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px 128px",
          gap: 24,
        }}
      >
        {/* Illustration */}
        <div style={{ height: 161, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <motion.div
            animate={{ rotate: [0, -3, 3, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <img src={DOC_ILLUSTRATION} alt="" style={{ width: 106, height: 139, objectFit: "contain" }} />
          </motion.div>
        </div>

        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: TEXT_PRIMARY, textAlign: "center", lineHeight: "32px", letterSpacing: -0.48, fontFamily: "var(--app-font)" }}>
          Getting your claim ready
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 12, width: "100%", maxWidth: 297 }}>
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
                    fontWeight: 400,
                    color: TEXT_SECONDARY,
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

// ─── Step 4 — Select Account ──────────────────────────────────────────────────
function StepSelectAccount({ onNext }: { onNext: () => void }) {
  return (
    <div style={{ flex: 1, overflowY: "auto", background: BG_TINT, display: "flex", flexDirection: "column" }}>
      <ProgressBar progress={33} />
      <div style={{ padding: "24px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: TEXT_PRIMARY, lineHeight: "32px", letterSpacing: -0.48, fontFamily: "var(--app-font)" }}>
            Select account to be reimbursed from
          </h2>
          <p style={{ margin: "8px 0 0", fontSize: 16, color: TEXT_SECONDARY, lineHeight: "24px", fontFamily: "var(--app-font)" }}>
            Based on your receipt, we've recommended the best match. You can change it if needed.
          </p>
        </div>

        {/* Claim amount pill */}
        <div style={{ background: CARD_BG, borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 8 }}>
          <Info size={16} color="var(--app-text)" />
          <span style={{ fontSize: 16, color: TEXT_PRIMARY, fontFamily: "var(--app-font)" }}>Claim amount:</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: TEXT_PRIMARY, fontFamily: "var(--app-font)" }}>$210.00*</span>
        </div>

        {/* Account Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Selected Account */}
          <div style={{ background: CARD_BG, borderRadius: 12, border: `2px solid ${PRIMARY}`, padding: 20, boxShadow: "0px 2px 6px rgba(2,13,36,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: TEXT_PRIMARY, fontFamily: "var(--app-font)" }}>Limited Purpose FSA</span>
                  <span style={{ background: "#e4f5fd", color: PRIMARY, fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 12, fontFamily: "var(--app-font)" }}>Best match</span>
                </div>
                <span style={{ fontSize: 11, color: TEXT_SECONDARY, fontFamily: "var(--app-font)" }}>01/01/2026 – 12/31/2026</span>
              </div>
              {/* Radio checked */}
              <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${PRIMARY}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: PRIMARY }} />
              </div>
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: TEXT_PRIMARY, fontFamily: "var(--app-font)" }}>$1,245.00</div>
          </div>

          {/* Unselected Account */}
          <div style={{ background: CARD_BG, borderRadius: 12, border: "2px solid var(--app-border)", padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div>
                <span style={{ fontSize: 16, fontWeight: 700, color: TEXT_PRIMARY, fontFamily: "var(--app-font)" }}>Health Savings Account</span>
              </div>
              {/* Radio unchecked */}
              <div style={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid var(--app-border)" }} />
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: TEXT_PRIMARY, fontFamily: "var(--app-font)" }}>$250.00</div>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <PillButton label="Continue" onClick={onNext} />
        </div>
      </div>
    </div>
  );
}

// ─── Step 5 — Review Details ──────────────────────────────────────────────────
function StepReviewDetails({ onNext }: { onNext: () => void }) {
  return (
    <div style={{ flex: 1, overflowY: "auto", background: BG_TINT, display: "flex", flexDirection: "column" }}>
      <ProgressBar progress={50} />
      <div style={{ padding: "24px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: TEXT_PRIMARY, lineHeight: "32px", letterSpacing: -0.48, fontFamily: "var(--app-font)" }}>
            Review claim details
          </h2>
          <p style={{ margin: "8px 0 0", fontSize: 16, color: TEXT_SECONDARY, lineHeight: "24px", fontFamily: "var(--app-font)" }}>
            Confirm what we found. You can edit anything before submitting.
          </p>
        </div>

        {/* Form fields (mocked as styled divs for the prototype) */}
        <div style={{ background: CARD_BG, borderRadius: 12, border: "1px solid var(--app-border)", overflow: "hidden" }}>
          {[
            { label: "Total amount", value: "210.00" },
            { label: "Start date of service", value: "Nov 24, 2026" },
            { label: "End date of service", value: "Nov 24, 2026" },
            { label: "Provider / merchant name", value: "Bigtown Dentistry" },
            { label: "Category / service type", value: "Dental" },
            { label: "Patient", value: "Self" },
          ].map((field, i) => (
            <div key={field.label} style={{ padding: "12px 16px", borderTop: i > 0 ? "1px solid var(--app-separator)" : "none" }}>
              <div style={{ fontSize: 12, color: TEXT_SECONDARY, fontFamily: "var(--app-font)", marginBottom: 4 }}>{field.label}</div>
              <div style={{ fontSize: 16, color: TEXT_PRIMARY, fontFamily: "var(--app-font)" }}>{field.value}</div>
            </div>
          ))}
        </div>

        {/* Items found */}
        <div style={{ background: CARD_BG, borderRadius: 12, border: "1px solid var(--app-border)", padding: 16 }}>
          <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: TEXT_PRIMARY, fontFamily: "var(--app-font)" }}>
            Items found on your receipt
          </h3>
          <p style={{ margin: "0 0 16px", fontSize: 14, color: TEXT_SECONDARY, lineHeight: "20px", fontFamily: "var(--app-font)" }}>
            We found these items on your receipt. Items that look eligible are selected. You can include any item or add one manually.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { name: "Dental Exam", amount: "$50.00" },
              { name: "Teeth cleaning", amount: "$90.00" },
              { name: "X-rays", amount: "$40.00" },
              { name: "Fluoride Treatment", amount: "$30.00" },
            ].map((item) => (
              <div key={item.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 24, height: 24, borderRadius: 6, background: PRIMARY, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Check size={16} color="#fff" />
                </div>
                <div style={{ flex: 1, fontSize: 16, color: TEXT_PRIMARY, fontFamily: "var(--app-font)" }}>{item.name}</div>
                <div style={{ background: "#dcfce7", color: "#008375", fontSize: 11, fontWeight: 600, padding: "2px 6px", borderRadius: 12, fontFamily: "var(--app-font)" }}>Eligible</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: TEXT_PRIMARY, fontFamily: "var(--app-font)", width: 60, textAlign: "right" }}>{item.amount}</div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid var(--app-separator)", marginTop: 16, paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: TEXT_PRIMARY, fontFamily: "var(--app-font)" }}>Selected total:</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: TEXT_PRIMARY, fontFamily: "var(--app-font)" }}>$210.00</span>
          </div>
        </div>

        <div style={{ marginTop: 8, paddingBottom: 32 }}>
          <PillButton label="Continue" onClick={onNext} />
        </div>
      </div>
    </div>
  );
}

// ─── Step 6 — Transfer Method ─────────────────────────────────────────────────
function StepTransferMethod({ onNext }: { onNext: () => void }) {
  return (
    <div style={{ flex: 1, overflowY: "auto", background: BG_TINT, display: "flex", flexDirection: "column" }}>
      <ProgressBar progress={66} />
      <div style={{ padding: "24px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: TEXT_PRIMARY, lineHeight: "32px", letterSpacing: -0.48, fontFamily: "var(--app-font)" }}>
            How would you like to get reimbursed?
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Direct Deposit */}
          <div style={{ background: CARD_BG, borderRadius: 12, border: `2px solid ${PRIMARY}`, padding: 20, boxShadow: "0px 2px 6px rgba(2,13,36,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <span style={{ fontSize: 16, fontWeight: 700, color: TEXT_PRIMARY, fontFamily: "var(--app-font)", display: "block", marginBottom: 4 }}>Direct Deposit</span>
                <span style={{ fontSize: 14, color: TEXT_SECONDARY, fontFamily: "var(--app-font)", display: "block" }}>3-5 business days</span>
                <span style={{ fontSize: 14, color: TEXT_SECONDARY, fontFamily: "var(--app-font)", display: "block" }}>Free</span>
              </div>
              <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${PRIMARY}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: PRIMARY }} />
              </div>
            </div>
          </div>

          {/* Check */}
          <div style={{ background: CARD_BG, borderRadius: 12, border: "2px solid var(--app-border)", padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <span style={{ fontSize: 16, fontWeight: 700, color: TEXT_PRIMARY, fontFamily: "var(--app-font)", display: "block", marginBottom: 4 }}>Check</span>
                <span style={{ fontSize: 14, color: TEXT_SECONDARY, fontFamily: "var(--app-font)", display: "block" }}>7-10 business days</span>
                <span style={{ fontSize: 14, color: TEXT_SECONDARY, fontFamily: "var(--app-font)", display: "block" }}>Free</span>
              </div>
              <div style={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid var(--app-border)" }} />
            </div>
          </div>

          {/* Instant Transfer */}
          <div style={{ background: CARD_BG, borderRadius: 12, border: "2px solid var(--app-border)", padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <span style={{ fontSize: 16, fontWeight: 700, color: TEXT_PRIMARY, fontFamily: "var(--app-font)", display: "block", marginBottom: 4 }}>Instant Transfer</span>
                <span style={{ fontSize: 14, color: TEXT_SECONDARY, fontFamily: "var(--app-font)", display: "block" }}>Within 30 minutes</span>
                <span style={{ fontSize: 14, color: TEXT_SECONDARY, fontFamily: "var(--app-font)", display: "block" }}>1.5% fee</span>
              </div>
              <div style={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid var(--app-border)" }} />
            </div>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <PillButton label="Continue" onClick={onNext} />
        </div>
      </div>
    </div>
  );
}

// ─── Step 7 — Ready To Submit ─────────────────────────────────────────────────
function StepReadyToSubmit({ onNext }: { onNext: () => void }) {
  return (
    <div style={{ flex: 1, overflowY: "auto", background: BG_TINT, display: "flex", flexDirection: "column" }}>
      <ProgressBar progress={83} />
      <div style={{ padding: "24px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: TEXT_PRIMARY, lineHeight: "32px", letterSpacing: -0.48, fontFamily: "var(--app-font)" }}>
            Ready to submit?
          </h2>
          <p style={{ margin: "8px 0 0", fontSize: 16, color: TEXT_SECONDARY, lineHeight: "24px", fontFamily: "var(--app-font)" }}>
            Review your claim details before submitting.
          </p>
        </div>

        <div style={{ background: CARD_BG, borderRadius: 12, border: "1px solid var(--app-border)", overflow: "hidden" }}>
          {[
            { label: "Total amount", value: "$210.00" },
            { label: "Account", value: "Limited Purpose FSA" },
            { label: "Transfer method", value: "Direct Deposit" },
            { label: "Provider / merchant name", value: "Bigtown Dentistry" },
            { label: "Patient", value: "Self" },
          ].map((field, i) => (
            <div key={field.label} style={{ padding: "12px 16px", borderTop: i > 0 ? "1px solid var(--app-separator)" : "none" }}>
              <div style={{ fontSize: 12, color: TEXT_SECONDARY, fontFamily: "var(--app-font)", marginBottom: 4 }}>{field.label}</div>
              <div style={{ fontSize: 16, color: TEXT_PRIMARY, fontFamily: "var(--app-font)" }}>{field.value}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16 }}>
          <PillButton label="Submit claim" onClick={onNext} />
        </div>
      </div>
    </div>
  );
}

// ─── Step 8 — Success ─────────────────────────────────────────────────────────
function StepSuccess({ onGoHome }: { onGoHome: () => void }) {
  return (
    <div style={{ flex: 1, overflowY: "auto", background: CARD_BG, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "48px 24px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: SUCCESS_BG,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 8,
          }}
        >
          <CheckCircle2 size={40} color={SUCCESS_GREEN} />
        </motion.div>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ margin: 0, fontSize: 32, fontWeight: 700, color: TEXT_PRIMARY, fontFamily: "var(--app-font)", letterSpacing: -0.64 }}
        >
          Claim approved!
        </motion.h2>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ fontSize: 48, fontWeight: 700, color: TEXT_PRIMARY, fontFamily: "var(--app-font)", letterSpacing: -1 }}
        >
          $210.00
        </motion.div>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ margin: 0, fontSize: 16, color: TEXT_SECONDARY, textAlign: "center", lineHeight: "24px", fontFamily: "var(--app-font)" }}
        >
          Your claim has been approved and your funds are on the way.
        </motion.p>

        {/* Timeline */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ width: "100%", marginTop: 24, display: "flex", flexDirection: "column", gap: 24 }}
        >
          {[
            { label: "Claim submitted", status: "done" },
            { label: "Claim approved", status: "done" },
            { label: "Funds sent", status: "pending", subtext: "Estimated arrival: Nov 28" },
          ].map((item, i) => (
            <div key={item.label} style={{ display: "flex", gap: 16, position: "relative" }}>
              {i < 2 && (
                <div style={{ position: "absolute", left: 11, top: 24, bottom: -24, width: 2, background: item.status === "done" ? SUCCESS_GREEN : "var(--app-border)" }} />
              )}
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: item.status === "done" ? SUCCESS_GREEN : "var(--app-neutral-100)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  zIndex: 1,
                }}
              >
                {item.status === "done" && <Check size={14} color="#fff" />}
              </div>
              <div style={{ paddingTop: 2 }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: item.status === "done" ? TEXT_PRIMARY : TEXT_SECONDARY, fontFamily: "var(--app-font)" }}>
                  {item.label}
                </div>
                {item.subtext && (
                  <div style={{ fontSize: 14, color: TEXT_SECONDARY, marginTop: 4, fontFamily: "var(--app-font)" }}>
                    {item.subtext}
                  </div>
                )}
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{ width: "100%", marginTop: 32 }}
        >
          <PillButton label="Go to your homepage" onClick={onGoHome} />
        </motion.div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AppReimburseFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback((next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  }, [step]);

  const next = useCallback(() => goTo(step + 1), [goTo, step]);

  const handleClose = useCallback(() => navigate("/app"), [navigate]);

  const navTitle = "Reimburse myself";

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
        background: step === 2 ? "#fff" : BG_TINT,
        fontFamily: "var(--app-font)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <AppTopSpacer variant="home" />
      {step !== 2 && (
        <AppNavBar variant="full-page" title={navTitle} onClose={handleClose} />
      )}

      {/* Step content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={step === 8 ? undefined : slideVariants}
          initial={step === 8 ? { opacity: 0 } : "enter"}
          animate={step === 8 ? { opacity: 1 } : "center"}
          exit={step === 8 ? { opacity: 0 } : "exit"}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}
        >
          {step === 1 && <StepUploadMethod onNext={next} />}
          {step === 2 && <StepCameraRoll onCancel={() => goTo(1)} onUpload={next} />}
          {step === 3 && <StepAnalyzing onNext={next} />}
          {step === 4 && <StepSelectAccount onNext={next} />}
          {step === 5 && <StepReviewDetails onNext={next} />}
          {step === 6 && <StepTransferMethod onNext={next} />}
          {step === 7 && <StepReadyToSubmit onNext={next} />}
          {step === 8 && <StepSuccess onGoHome={() => navigate("/app")} />}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
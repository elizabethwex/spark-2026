import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, Info, CheckCircle2, Check, Search, Trash2 } from "lucide-react";
import confetti from "canvas-confetti";
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
const DOC_ILLUSTRATION = assetPath("doc-illustration.svg");
const RECEIPT_IMG = assetPath("penny-receipt.svg");

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
        display: "flex",
        justifyContent: "flex-start",
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
function StepUploadMethod({ onSelect }: { onSelect: (method: string) => void }) {
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
              onClick={() => onSelect(label)}
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
            onClick={() => onSelect("none")}
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
      <div style={{ padding: "0 24px 24px" }}>
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
  const [selected, setSelected] = useState<Set<number>>(new Set());

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

// ─── Step 2.5 — Camera viewfinder ─────────────────────────────────────────────
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

// ─── Step 2.6 — Document preview ──────────────────────────────────────────────
function StepDocPreview({ 
  documents,
  onRemove,
  onContinue, 
  onAddAnother 
}: { 
  documents: { id: number, name: string }[];
  onRemove: (id: number) => void;
  onContinue: () => void; 
  onAddAnother: () => void; 
}) {
  return (
    <div style={{ flex: 1, overflowY: "auto", background: BG_TINT, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "24px 24px 0", display: "flex", flexDirection: "column", gap: 10 }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: TEXT_PRIMARY, textAlign: "center", lineHeight: "32px", letterSpacing: -0.48, fontFamily: "var(--app-font)" }}>
          Submit or add documents
        </h2>

        {/* Document cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {documents.map((doc) => (
            <div key={doc.id} style={{ background: CARD_BG, borderRadius: 12, overflow: "hidden", boxShadow: "0px 3px 9px rgba(43,49,78,0.04), 0px 6px 18px rgba(43,49,78,0.06)" }}>
              {/* File row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "16px",
                }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
                  <img src={RECEIPT_IMG} alt="Receipt" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <span style={{ flex: 1, fontSize: 16, fontWeight: 700, color: TEXT_PRIMARY, fontFamily: "var(--app-font)" }}>
                  {doc.name}
                </span>
                <button onClick={() => onRemove(doc.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 12, display: "flex" }}>
                  <Trash2 size={24} color="var(--app-text-secondary)" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 16, paddingBottom: 32 }}>
          <PillButton label="Continue" onClick={onContinue} />
          <PillButton label="Add another document" variant="secondary" onClick={onAddAnother} />
        </div>
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
  const [items, setItems] = useState([
    { name: "Dental Exam", amount: 50.00, selected: true },
    { name: "Teeth cleaning", amount: 90.00, selected: true },
    { name: "X-rays", amount: 40.00, selected: true },
    { name: "Fluoride Treatment", amount: 30.00, selected: true },
  ]);

  const toggleItem = (index: number) => {
    const newItems = [...items];
    newItems[index].selected = !newItems[index].selected;
    setItems(newItems);
  };

  const totalAmount = items.reduce((sum, item) => item.selected ? sum + item.amount : sum, 0);

  return (
    <div style={{ flex: 1, overflowY: "auto", background: BG_TINT, display: "flex", flexDirection: "column" }}>
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
            { label: "Total amount", value: totalAmount.toFixed(2) },
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
            {items.map((item, index) => (
              <div key={item.name} style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => toggleItem(index)}>
                <div style={{ 
                  width: 24, 
                  height: 24, 
                  borderRadius: 6, 
                  background: item.selected ? PRIMARY : "transparent", 
                  border: item.selected ? "none" : "2px solid var(--app-border)",
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  flexShrink: 0 
                }}>
                  {item.selected && <Check size={16} color="#fff" />}
                </div>
                <div style={{ flex: 1, fontSize: 16, color: TEXT_PRIMARY, fontFamily: "var(--app-font)" }}>{item.name}</div>
                <div style={{ background: "#dcfce7", color: "#008375", fontSize: 11, fontWeight: 600, padding: "2px 6px", borderRadius: 12, fontFamily: "var(--app-font)" }}>Eligible</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: TEXT_PRIMARY, fontFamily: "var(--app-font)", width: 60, textAlign: "right" }}>${item.amount.toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid var(--app-separator)", marginTop: 16, paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: TEXT_PRIMARY, fontFamily: "var(--app-font)" }}>Selected total:</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: TEXT_PRIMARY, fontFamily: "var(--app-font)" }}>${totalAmount.toFixed(2)}</span>
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
  const [completedSteps, setCompletedSteps] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setCompletedSteps(1), 800),
      setTimeout(() => setCompletedSteps(2), 1600),
      setTimeout(() => setCompletedSteps(3), 2400),
    ];
    
    // Fire confetti!
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.4 },
      colors: ["#34C759", "#007AFF", "#FF9500", "#FFCC00", "#FF3B30"]
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={{ flex: 1, overflowY: "auto", background: BG_TINT, display: "flex", flexDirection: "column" }}>
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
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: -25,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(52,199,89,0.15) 0%, transparent 70%)",
            }}
          />
          <CheckCircle2 size={40} color={SUCCESS_GREEN} style={{ position: "relative", zIndex: 1 }} />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ textAlign: "center", width: "100%" }}
        >
          <h2 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 600, color: "var(--app-text)", letterSpacing: -0.44, fontFamily: "var(--app-font)" }}>
            Claim approved!
          </h2>
          <p style={{ margin: 0, fontSize: 16, color: TEXT_SECONDARY, lineHeight: "24px", fontFamily: "var(--app-font)" }}>
            Your document has been verified and your claim is approved for reimbursement.
          </p>
        </motion.div>

        {/* Approved amount & Balance */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
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
              border: "1px solid var(--app-border)",
              padding: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <p style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 600, color: "var(--app-text)", fontFamily: "var(--app-font)" }}>Current balance</p>
              <p style={{ margin: 0, fontSize: 16, color: TEXT_SECONDARY, fontFamily: "var(--app-font)" }}>Limited Purpose FSA 2026</p>
            </div>
            <span style={{ fontSize: 16, fontWeight: 600, color: TEXT_PRIMARY, fontFamily: "var(--app-font)" }}>$849.00</span>
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ width: "100%", marginTop: 8 }}
        >
          <div style={{ background: CARD_BG, borderRadius: 12, border: "1px solid var(--app-border)", padding: "24px 24px", boxShadow: "0px 3px 9px rgba(43,49,78,0.04), 0px 6px 18px rgba(43,49,78,0.06)" }}>
            <p style={{ margin: "0 0 24px", fontSize: 14, fontWeight: 600, color: TEXT_PRIMARY, fontFamily: "var(--app-font)" }}>
              What happens next
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {[
                { label: "Submitted", isFinal: false },
                { label: "Under review", isFinal: false },
                { label: "Approved", isFinal: false },
                { label: "Payment on it's way", isFinal: true },
              ].map((item, i) => {
                const isDone = completedSteps > i;
                const isFinalPending = item.isFinal && completedSteps === 3;
                const lineIsGreen = completedSteps > i + 1 || (i === 2 && completedSteps === 3);

                return (
                  <div key={item.label} style={{ display: "flex", gap: 16, position: "relative" }}>
                    {i < 3 && (
                      <motion.div
                        initial={{ backgroundColor: "var(--app-border)" }}
                        animate={{ backgroundColor: lineIsGreen ? SUCCESS_GREEN : "var(--app-border)" }}
                        transition={{ duration: 0.4 }}
                        style={{ position: "absolute", left: 11, top: 24, bottom: -24, width: 2 }}
                      />
                    )}
                    <motion.div
                      initial={{ borderColor: "var(--app-border)" }}
                      animate={{ borderColor: isDone ? SUCCESS_GREEN : (isFinalPending ? PRIMARY : "var(--app-border)") }}
                      transition={{ duration: 0.4 }}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: CARD_BG,
                        border: `1px solid var(--app-border)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        zIndex: 1,
                      }}
                    >
                      <AnimatePresence mode="wait">
                        {isDone && !item.isFinal && (
                          <motion.div
                            key="check"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          >
                            <Check size={14} color={SUCCESS_GREEN} strokeWidth={3} />
                          </motion.div>
                        )}
                        {isFinalPending && (
                          <motion.span
                            key="dollar"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            style={{ color: PRIMARY, fontSize: 14, fontWeight: 600 }}
                          >
                            $
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                    <div style={{ paddingTop: 2 }}>
                      <motion.div
                        animate={{
                          color: isDone || isFinalPending ? TEXT_PRIMARY : TEXT_SECONDARY,
                          fontWeight: isDone || isFinalPending ? 600 : 500
                        }}
                        transition={{ duration: 0.4 }}
                        style={{ fontSize: 14, fontFamily: "var(--app-font)" }}
                      >
                        {item.label}
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{ width: "100%", marginTop: 16 }}
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
  const [documents, setDocuments] = useState<{ id: number; name: string }[]>([]);

  const goTo = useCallback((next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  }, [step]);

  const next = useCallback(() => goTo(step + 1), [goTo, step]);

  const handleClose = useCallback(() => navigate("/app"), [navigate]);

  const handleCapture = () => {
    setDocuments((prev) => [...prev, { id: Date.now(), name: `IMG_${Date.now().toString().slice(-5)}.jpg` }]);
    goTo(2.6);
  };

  const handleRemoveDoc = (id: number) => {
    const newDocs = documents.filter((d) => d.id !== id);
    setDocuments(newDocs);
    if (newDocs.length === 0) {
      goTo(1);
    }
  };

  const navTitle = "Reimburse myself";

  const slideVariants = {
    enter: { y: 60, opacity: 0 },
    center: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
  };

  const getProgress = (step: number) => {
    switch (step) {
      case 2.6: return 25;
      case 3: return 16;
      case 4: return 33;
      case 5: return 50;
      case 6: return 66;
      case 7: return 83;
      default: return 0;
    }
  };
  const progress = getProgress(step);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      style={{
        height: "var(--app-screen-height, 100dvh)",
        display: "flex",
        flexDirection: "column",
        background: step === 2 ? "#fff" : step === 2.5 ? "#0a0a0a" : BG_TINT,
        fontFamily: "var(--app-font)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {step !== 2.5 && step !== 2 && (
        <>
          <AppTopSpacer variant="home" />
          <AppNavBar variant="full-page" solid title={navTitle} onClose={handleClose} />
          {progress > 0 && <ProgressBar progress={progress} />}
        </>
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
          {step === 1 && <StepUploadMethod onSelect={(method) => { if (method === "Take a photo") goTo(2.5); else goTo(2); }} />}
          {step === 2 && <StepCameraRoll onCancel={() => goTo(1)} onUpload={() => goTo(3)} />}
          {step === 2.5 && <StepCamera onCapture={handleCapture} onClose={() => goTo(1)} />}
          {step === 2.6 && <StepDocPreview documents={documents} onRemove={handleRemoveDoc} onContinue={() => goTo(3)} onAddAnother={() => goTo(2.5)} />}
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
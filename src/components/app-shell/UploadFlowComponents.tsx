import { motion, AnimatePresence } from "framer-motion";
import { Camera, Image as ImageIcon, Paperclip } from "lucide-react";

export function DentistEobPlaceholder() {
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
      <div style={{ padding: "10px 16px 12px", display: "flex", flexDirection: "column", gap: 7 }}>
        {[
          ["Patient", "Penny Smith"],
          ["Provider", "Bigtown Dentistry"],
          ["Date of Service", "Mar 14, 2026"],
          ["Group #", "GRP-88421"],
        ].map(([label, value]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 11, color: "#888" }}>{label}</span>
            <span style={{ fontSize: 11, color: "#222", fontWeight: 500 }}>{value}</span>
          </div>
        ))}
        <div style={{ height: 1, background: "#eee", margin: "2px 0" }} />
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

export function CameraViewfinder({ onCapture, onClose, isCapturing }: { onCapture: () => void; onClose: () => void; isCapturing: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px 20px 10px",
          flexShrink: 0,
          paddingTop: "calc(14px + env(safe-area-inset-top, 0px))",
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

      <div
        style={{
          flexShrink: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px 0 32px",
          paddingBottom: "calc(32px + env(safe-area-inset-bottom, 0px))",
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

export function IOSActionSheet({
  onSelect,
  onClose,
}: {
  onSelect: (option: string) => void;
  onClose: () => void;
}) {
  const PRIMARY_BTN = "var(--app-primary, #25146f)";
  const TEXT_PRIMARY = "var(--app-text, #000)";
  const TEXT_SECONDARY = "var(--app-text-secondary, rgba(60, 60, 67, 0.6))";

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
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        zIndex: 9998,
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
        <div
          style={{
            width: 36,
            height: 4,
            borderRadius: 2,
            background: "rgba(0,0,0,0.2)",
            margin: "10px auto 0",
          }}
        />

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

export function CheckSquareIcon() {
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

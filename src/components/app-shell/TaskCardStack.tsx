import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { Receipt, Check, Paperclip, FileText, X, Upload } from "lucide-react";
import { IOSActionSheet, CameraViewfinder } from "./UploadFlowComponents";

import { useAppVariant } from "@/context/AppVariantContext";

const TEXT_PRIMARY = "#000";
const TEXT_SECONDARY = "rgba(60, 60, 67, 0.6)";
const CARD_SHADOW = "0px 3px 9px rgba(43, 49, 78, 0.04), 0px 6px 18px rgba(43, 49, 78, 0.06)";
const PRIMARY_BTN = "var(--app-primary, #25146f)";
const SUCCESS_BG = "#e6f9f0";
const SUCCESS_TEXT = "#1a6b45";

type CardPhase = "default" | "formats" | "uploading" | "uploaded" | "approval";

const PHASE_HEIGHTS: Record<CardPhase, number> = {
  default: 310,
  formats: 334, // expands by max 24px
  uploading: 310, // shrinks back to original
  uploaded: 310, // stays constant
  approval: 310, // stays constant
};

export interface TaskCardData {
  id: string;
  title: string;
  description: string;
  provider: string;
  dateAndAccount: string;
  amount: string;
}

const MOCK_TASKS: TaskCardData[] = [
  {
    id: "task-1",
    title: "Missing Documentation Required",
    description: "Upload your document to complete this claim for Bigtown Dentistry.",
    provider: "Bigtown Dentistry",
    dateAndAccount: "4/26/2027 · Limited Purpose FSA",
    amount: "$210.00",
  },
  {
    id: "task-2",
    title: "Action Required",
    description: "Please verify your dependent's information for the upcoming year.",
    provider: "WEX Benefits",
    dateAndAccount: "5/01/2027 · Dependent Care",
    amount: "Pending",
  },
  {
    id: "task-3",
    title: "Receipt Needed",
    description: "We need a receipt for your recent pharmacy purchase to approve the claim.",
    provider: "Corner Pharmacy",
    dateAndAccount: "4/15/2027 · HSA",
    amount: "$45.50",
  },
];

export function TaskCardStack() {
  const { variant } = useAppVariant();
  
  const [cards, setCards] = useState<TaskCardData[]>(() => {
    const saved = sessionStorage.getItem("taskCards");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Force update the title if it's the old one
        return parsed.map((card: TaskCardData) => 
          card.id === "task-1" && card.title === "Missing Document Required" 
            ? { ...card, title: "Missing Documentation Required" } 
            : card
        );
      } catch {
        return MOCK_TASKS;
      }
    }
    return MOCK_TASKS;
  });

  const [topCardPhase, setTopCardPhase] = useState<CardPhase>("default");

  useEffect(() => {
    sessionStorage.setItem("taskCards", JSON.stringify(cards));
  }, [cards]);

  const [showEmptyState, setShowEmptyState] = useState(() => cards.length > 0);

  useEffect(() => {
    if (cards.length === 0) {
      const timer = setTimeout(() => {
        setShowEmptyState(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [cards.length]);

  const handleSwipe = () => {
    setTopCardPhase("default");
    setCards((prev) => {
      const [topCard, ...rest] = prev;
      return [...rest, topCard];
    });
  };

  const handleDismiss = (id: string) => {
    setTopCardPhase("default");
    setCards((prev) => prev.filter((card) => card.id !== id));
  };

  const containerHeight = PHASE_HEIGHTS[topCardPhase];

  return (
    <AnimatePresence>
      {(cards.length > 0 || showEmptyState) && (
        <motion.div
          className="no-pull"
          initial={{ height: 310, opacity: 1 }}
          animate={{ height: containerHeight, opacity: 1 }}
          exit={{ height: 0, opacity: 0, marginTop: 0, marginBottom: 0, overflow: "hidden" }}
          transition={{ height: { type: "spring", stiffness: 300, damping: 30 }, duration: 0.4, ease: "easeInOut" }}
          style={{
            position: "relative",
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <AnimatePresence mode="popLayout">
            {cards.length === 0 && showEmptyState ? (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 16,
                  right: 16,
                  height: 260,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(255, 255, 255, 0.8)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(255, 255, 255, 0.5)",
                  borderRadius: 32,
                  boxShadow: CARD_SHADOW,
                  padding: 32,
                  gap: 16,
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    background: "#EEF2FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      background: "none",
                      border: "2.5px solid #3958C3",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Check size={16} strokeWidth={3.5} color="#3958C3" />
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <div style={{ fontSize: 20, fontWeight: 600, color: TEXT_PRIMARY }}>
                    You're all caught up!
                  </div>
                  <div style={{ fontSize: 15, color: TEXT_SECONDARY }}>
                    No pending tasks at the moment.
                  </div>
                </div>
              </motion.div>
            ) : (
              cards.map((card, index) => {
                const isTop = index === 0;
                return (
                  <SwipeableCard
                    key={card.id}
                    card={card}
                    index={index}
                    isTop={isTop}
                    onSwipe={handleSwipe}
                    onDismiss={() => handleDismiss(card.id)}
                    onPhaseChange={isTop ? setTopCardPhase : undefined}
                    variant={variant}
                  />
                );
              })
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
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
        borderRadius: 14,
        background: status === "uploaded" ? SUCCESS_BG : "#f4f6fb",
        border: `1px solid ${status === "uploaded" ? "#a8e8c8" : "#dde3f4"}`,
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 8,
          background: status === "uploaded" ? SUCCESS_TEXT : PRIMARY_BTN,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {status === "uploaded" ? (
          <Check size={16} color="#fff" strokeWidth={3} />
        ) : (
          <FileText size={16} color="#fff" />
        )}
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
        {status === "uploading" && (
          <div style={{ marginTop: 4 }}>
            <div
              style={{
                height: 4,
                borderRadius: 2,
                background: "#e8eaf6",
                overflow: "hidden",
              }}
            >
              <motion.div
                style={{
                  height: "100%",
                  borderRadius: 2,
                  background: PRIMARY_BTN,
                }}
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.15, ease: "linear" }}
              />
            </div>
          </div>
        )}
        {status === "uploaded" && (
          <div style={{ fontSize: 11, color: SUCCESS_TEXT, marginTop: 1 }}>
            Ready to submit
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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <X size={16} color={TEXT_SECONDARY} />
        </button>
      )}
    </div>
  );
}

// ─── SwipeableCard ────────────────────────────────────────────────────────────

function SwipeableCard({
  card,
  index,
  isTop,
  onSwipe,
  onDismiss,
  onPhaseChange,
  variant,
}: {
  card: TaskCardData;
  index: number;
  isTop: boolean;
  onSwipe: () => void;
  onDismiss: () => void;
  onPhaseChange?: (phase: CardPhase) => void;
  variant: number;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotate = useTransform(x, [-150, 150], [-10, 10]);
  const opacityX = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5]);
  const opacityY = useTransform(y, [-150, 0], [0.5, 1]);
  const opacity = useTransform([opacityX, opacityY], ([ox, oy]) => Math.min(ox as number, oy as number));

  // ── Upload flow state ────────────────────────────────────────────────
  const [cardPhase, setCardPhase] = useState<CardPhase>("default");
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [docFileName, setDocFileName] = useState("");
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  const updatePhase = useCallback(
    (phase: CardPhase) => {
      setCardPhase(phase);
      onPhaseChange?.(phase);
    },
    [onPhaseChange]
  );

  const simulateUpload = useCallback(
    (fileName: string) => {
      setDocFileName(fileName);
      updatePhase("uploading");
      setUploadProgress(0);

      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20 + 8;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          progressIntervalRef.current = null;
          setUploadProgress(100);
          setTimeout(() => updatePhase("uploaded"), 200);
        } else {
          setUploadProgress(Math.round(progress));
        }
      }, 150);
      progressIntervalRef.current = interval;
    },
    [updatePhase]
  );

  const handleActionSheetSelect = useCallback(
    (option: string) => {
      setShowActionSheet(false);
      if (option === "Take a photo") {
        setShowCamera(true);
      } else {
        simulateUpload("dentist-eob.pdf");
      }
    },
    [simulateUpload]
  );

  const handleCameraCapture = useCallback(() => {
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
      setShowCamera(false);
      simulateUpload("dentist-eob.pdf");
    }, 420);
  }, [simulateUpload]);

  const handleSubmit = useCallback(() => {
    updatePhase("approval");
    setTimeout(() => {
      onDismiss();
    }, 3000);
  }, [updatePhase, onDismiss]);

  const handleRemoveFile = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setDocFileName("");
    setUploadProgress(0);
    updatePhase("formats");
  }, [updatePhase]);

  const flowActive = cardPhase !== "default";

  const handleDragEnd = (_event: any, info: any) => {
    if (flowActive) return;
    const xThreshold = 100;
    const yThreshold = -80;
    if (info.offset.y < yThreshold) {
      onDismiss();
    } else if (info.offset.x > xThreshold || info.offset.x < -xThreshold) {
      onSwipe();
    }
  };

  const scale = 1 - index * 0.05;
  const yOffset = index * 12;
  const zIndex = 10 - index;

  return (
    <>
      <motion.div
        layout
        drag={isTop && !flowActive}
        dragDirectionLock
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        onDragEnd={handleDragEnd}
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{
          opacity: index > 2 ? 0 : 1,
          scale,
          y: yOffset,
          zIndex,
        }}
        exit={{
          opacity: 0,
          scale: 0.85,
          y: -400,
          x: 60,
          rotate: 8,
          zIndex: 50,
          transition: {
            y: { type: "spring", stiffness: 150, damping: 20, velocity: -200 },
            x: { type: "spring", stiffness: 150, damping: 20 },
            rotate: { duration: 0.4, ease: "easeOut" },
            opacity: { duration: 0.3 },
            scale: { duration: 0.4 },
          },
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{
          x: isTop && !flowActive ? x : 0,
          y: isTop && !flowActive ? y : yOffset,
          rotate: isTop && !flowActive ? rotate : 0,
          opacity: isTop ? opacity : 1,
          position: "absolute",
          top: 0,
          left: 16,
          right: 16,
          minHeight: 310,
          background: "#fff",
          borderRadius: 32,
          padding: 16,
          boxShadow: CARD_SHADOW,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          pointerEvents: isTop ? "auto" : "none",
          touchAction: isTop && !flowActive ? "none" : "auto",
        }}
      >
        {/* Header text */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: TEXT_PRIMARY,
              letterSpacing: -0.7,
              lineHeight: "25px",
            }}
          >
            {card.title}
          </div>
          <AnimatePresence initial={false}>
            {cardPhase === "default" && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.25 }}
                style={{
                  fontSize: 15,
                  fontWeight: 400,
                  color: TEXT_SECONDARY,
                  letterSpacing: -0.23,
                  lineHeight: "20px",
                  overflow: "hidden",
                }}
              >
                {card.description}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Claim row */}
        <div
          style={{
            background: "var(--app-primary-50)",
            border: "1px solid var(--app-primary-50)",
            borderRadius: 24,
            padding: 17,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "#fff",
                border: "1px solid var(--app-border)",
                boxShadow: "0px 1px 2px rgba(0,0,0,0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Receipt size={18} color="var(--app-text-secondary)" />
            </div>
            <div>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 600,
                  color: TEXT_PRIMARY,
                  letterSpacing: -0.43,
                  lineHeight: "22px",
                }}
              >
                {card.provider}
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 400,
                  color: TEXT_SECONDARY,
                  letterSpacing: -0.08,
                  lineHeight: "18px",
                }}
              >
                {card.dateAndAccount.includes(' · ') ? (
                  <>
                    <div>
                      {card.dateAndAccount.split(' · ')[1] === "Limited Purpose FSA"
                        ? variant === 3 
                          ? "HSA" 
                          : variant === 2 
                            ? "Healthcare FSA" 
                            : "Limited Purpose FSA"
                        : card.dateAndAccount.split(' · ')[1]}
                    </div>
                    <div>{card.dateAndAccount.split(' · ')[0]}</div>
                  </>
                ) : (
                  card.dateAndAccount
                )}
              </div>
            </div>
          </div>
          <div
            style={{
              fontSize: 17,
              fontWeight: 600,
              color: TEXT_PRIMARY,
              letterSpacing: -0.43,
              lineHeight: "22px",
              flexShrink: 0,
            }}
          >
            {card.amount}
          </div>
        </div>

        {/* ── Dynamic content area ─────────────────────────────────────── */}
        <AnimatePresence mode="wait" initial={false}>
          {cardPhase === "default" && (
            <motion.div
              key="default"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
              <button
                onClick={() => updatePhase("formats")}
                style={{
                  width: "100%",
                  borderRadius: 1000,
                  border: "none",
                  cursor: "pointer",
                  padding: "14px 20px",
                  background: "linear-gradient(170.9deg, #25146F 2.46%, #C8102E 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  fontFamily: "var(--app-font)",
                }}
              >
                <span
                  style={{
                    fontSize: 17,
                    fontWeight: 400,
                    color: "#fff",
                    letterSpacing: -0.43,
                    lineHeight: "22px",
                  }}
                >
                  Upload document
                </span>
              </button>

              <div style={{ textAlign: "center" }}>
                <button
                  onClick={() => onDismiss()}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 400,
                    color: TEXT_SECONDARY,
                    fontFamily: "var(--app-font)",
                    lineHeight: "16px",
                  }}
                >
                  Remind me tomorrow
                </button>
              </div>
            </motion.div>
          )}

          {cardPhase === "formats" && (
            <motion.div
              key="formats"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              style={{ display: "flex", flexDirection: "column", gap: 12 }}
            >
              <div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    color: "#5f6a94",
                    marginBottom: 6,
                  }}
                >
                  Acceptable formats
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {["PDF", "JPEG", "PNG", "HEIC"].map((fmt) => (
                    <span
                      key={fmt}
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: PRIMARY_BTN,
                        background: "#eef1fb",
                        border: "1px solid #c9d1f5",
                        borderRadius: 6,
                        padding: "3px 8px",
                      }}
                    >
                      {fmt}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    color: "#5f6a94",
                    marginBottom: 6,
                  }}
                >
                  Required documents
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {[
                    "Explanation of Benefits (EOB)",
                    "Itemized receipt from provider",
                  ].map((doc) => (
                    <div
                      key={doc}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 14,
                        color: TEXT_PRIMARY,
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ flexShrink: 0, color: SUCCESS_TEXT }}
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {doc}
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowActionSheet(true)}
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
                }}
              >
                <Paperclip size={15} />
                Add a document
              </button>
            </motion.div>
          )}

          {(cardPhase === "uploading" || cardPhase === "uploaded") && (
            <motion.div
              key="upload-progress"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              style={{ display: "flex", flexDirection: "column", gap: 12 }}
            >
              <FileStatusRow
                fileName={docFileName}
                status={cardPhase === "uploading" ? "uploading" : "uploaded"}
                progress={uploadProgress}
                onRemove={handleRemoveFile}
              />

              <AnimatePresence>
                {cardPhase === "uploaded" && (
                  <motion.button
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    onClick={handleSubmit}
                    style={{
                      width: "100%",
                      padding: "14px 20px",
                      borderRadius: 1000,
                      background: PRIMARY_BTN,
                      border: "none",
                      cursor: "pointer",
                      color: "var(--app-text-on-primary, #fff)",
                      fontSize: 15,
                      fontWeight: 600,
                      letterSpacing: -0.1,
                      fontFamily: "var(--app-font)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                    }}
                  >
                    <Upload size={16} color="var(--app-text-on-primary, #fff)" />
                    Submit documentation
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {cardPhase === "approval" && (
            <motion.div
              key="approval"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                padding: "8px 0 4px",
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  background: "#e6f9f0",
                  border: "3px solid #34c759",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <motion.div
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <Check size={28} color="#34c759" strokeWidth={3} />
                </motion.div>
              </motion.div>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 600,
                  color: SUCCESS_TEXT,
                  textAlign: "center",
                }}
              >
                Documentation uploaded
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: TEXT_SECONDARY,
                  textAlign: "center",
                }}
              >
                We've added it to this claim.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Overlays (portaled to fixed position) ───────────────────── */}
      {createPortal(
        <AnimatePresence>
          {showActionSheet && (
            <IOSActionSheet
              key="action-sheet"
              onSelect={handleActionSheetSelect}
              onClose={() => setShowActionSheet(false)}
            />
          )}
        </AnimatePresence>,
        document.querySelector('[data-app-mobile-scroll]') || document.body
      )}

      {createPortal(
        <AnimatePresence>
          {showCamera && (
            <CameraViewfinder
              key="camera"
              onCapture={handleCameraCapture}
              onClose={() => setShowCamera(false)}
              isCapturing={isCapturing}
            />
          )}
        </AnimatePresence>,
        document.querySelector('[data-app-mobile-scroll]') || document.body
      )}
    </>
  );
}

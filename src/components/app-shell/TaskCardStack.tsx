import { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Receipt, Check } from "lucide-react";

// Constants from AppHome
const TEXT_PRIMARY = "#000";
const TEXT_SECONDARY = "rgba(60, 60, 67, 0.6)";
const CARD_SHADOW = "0px 3px 9px rgba(43, 49, 78, 0.04), 0px 6px 18px rgba(43, 49, 78, 0.06)";

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
    title: "Missing Document Required",
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
  const [cards, setCards] = useState<TaskCardData[]>(() => {
    const saved = sessionStorage.getItem("taskCards");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return MOCK_TASKS;
      }
    }
    return MOCK_TASKS;
  });

  useEffect(() => {
    sessionStorage.setItem("taskCards", JSON.stringify(cards));
  }, [cards]);

  const [showEmptyState, setShowEmptyState] = useState(() => cards.length > 0);
  const navigate = useNavigate();

  // Auto-dismiss the empty state after a few seconds
  useEffect(() => {
    if (cards.length === 0) {
      const timer = setTimeout(() => {
        setShowEmptyState(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [cards.length]);

  // Move top card to the back
  const handleSwipe = () => {
    setCards((prev) => {
      const [topCard, ...rest] = prev;
      return [...rest, topCard];
    });
  };

  // Dismiss a card completely
  const handleDismiss = (id: string) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
  };

  return (
    <AnimatePresence>
      {(cards.length > 0 || showEmptyState) && (
        <motion.div
          className="no-pull"
          initial={{ height: 310, opacity: 1 }}
          animate={{ height: 310, opacity: 1 }}
          exit={{ height: 0, opacity: 0, marginTop: 0, marginBottom: 0, overflow: "hidden" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
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
                  height: 260, // Match typical card height
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
                    navigate={navigate}
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

function SwipeableCard({
  card,
  index,
  isTop,
  onSwipe,
  onDismiss,
  navigate,
}: {
  card: TaskCardData;
  index: number;
  isTop: boolean;
  onSwipe: () => void;
  onDismiss: () => void;
  navigate: (path: string) => void;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Rotate slightly as the card is dragged horizontally
  const rotate = useTransform(x, [-150, 150], [-10, 10]);
  
  // Fade out slightly at the edges (both X and Y)
  const opacityX = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5]);
  const opacityY = useTransform(y, [-150, 0], [0.5, 1]); // Fade when dragging up
  
  // Combine opacities
  const opacity = useTransform([opacityX, opacityY], ([ox, oy]) => Math.min(ox as number, oy as number));

  const handleDragEnd = (_event: any, info: any) => {
    const xThreshold = 100;
    const yThreshold = -80; // Drag up to dismiss

    if (info.offset.y < yThreshold) {
      onDismiss();
    } else if (info.offset.x > xThreshold || info.offset.x < -xThreshold) {
      onSwipe();
    }
  };

  // Stack visuals
  const scale = 1 - index * 0.05;
  const yOffset = index * 12;
  const zIndex = 10 - index;

  return (
    <motion.div
      layout
      drag={isTop}
      dragDirectionLock
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{
        opacity: index > 2 ? 0 : 1, // Only show top 3 cards
        scale,
        y: yOffset,
        zIndex,
      }}
      exit={{ 
        opacity: 0, 
        scale: 0.85,
        y: -400, // Swipe up on exit
        x: 60, // Arc slightly to the right
        rotate: 8, // Tilt slightly as it flies away
        zIndex: 50, // Force exiting card to the very front layer
        transition: { 
          y: { type: "spring", stiffness: 150, damping: 20, velocity: -200 },
          x: { type: "spring", stiffness: 150, damping: 20 },
          rotate: { duration: 0.4, ease: "easeOut" },
          opacity: { duration: 0.3 },
          scale: { duration: 0.4 }
        } 
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{
        x: isTop ? x : 0,
        y: isTop ? y : yOffset,
        rotate: isTop ? rotate : 0,
        opacity: isTop ? opacity : 1,
        position: "absolute",
        top: 0,
        left: 16,
        right: 16,
        background: "#fff",
        borderRadius: 32,
        padding: 16,
        boxShadow: CARD_SHADOW,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        // Make sure it doesn't block clicks when not on top
        pointerEvents: isTop ? "auto" : "none",
        touchAction: isTop ? "none" : "auto",
      }}
    >
      {/* Header text */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
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
        <div
          style={{
            fontSize: 15,
            fontWeight: 400,
            color: TEXT_SECONDARY,
            letterSpacing: -0.23,
            lineHeight: "20px",
          }}
        >
          {card.description}
        </div>
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
          {/* Icon box */}
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
            {/* Receipt icon */}
            <Receipt size={18} color="var(--app-text-secondary)" />
          </div>

          {/* Details */}
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
              {card.dateAndAccount}
            </div>
          </div>
        </div>

        {/* Amount */}
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

      {/* CTA button */}
      <button
        onClick={() => navigate("/app/claims")}
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

      {/* Remind me tomorrow */}
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
  );
}

import { useState } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Receipt } from "lucide-react";

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
    dateAndAccount: "4/26/2027 · LPFSA Account",
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
    dateAndAccount: "4/15/2027 · HSA Account",
    amount: "$45.50",
  },
];

export function TaskCardStack() {
  const [cards, setCards] = useState<TaskCardData[]>(MOCK_TASKS);
  const navigate = useNavigate();

  // Move top card to the back
  const handleSwipe = () => {
    setCards((prev) => {
      const [topCard, ...rest] = prev;
      return [...rest, topCard];
    });
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        // Give enough height so the stacked cards don't get cut off
        height: 310,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <AnimatePresence mode="popLayout">
        {cards.map((card, index) => {
          const isTop = index === 0;
          return (
            <SwipeableCard
              key={card.id}
              card={card}
              index={index}
              isTop={isTop}
              onSwipe={handleSwipe}
              navigate={navigate}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}

function SwipeableCard({
  card,
  index,
  isTop,
  onSwipe,
  navigate,
}: {
  card: TaskCardData;
  index: number;
  isTop: boolean;
  onSwipe: () => void;
  navigate: (path: string) => void;
}) {
  const x = useMotionValue(0);
  // Rotate slightly as the card is dragged
  const rotate = useTransform(x, [-150, 150], [-10, 10]);
  // Fade out slightly at the edges
  const opacity = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5]);

  const handleDragEnd = (_event: any, info: any) => {
    const threshold = 100;
    if (info.offset.x > threshold || info.offset.x < -threshold) {
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
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{
        opacity: index > 2 ? 0 : 1, // Only show top 3 cards
        scale,
        y: yOffset,
        zIndex,
      }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{
        x: isTop ? x : 0,
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
          onClick={() => onSwipe()}
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

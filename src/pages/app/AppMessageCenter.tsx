import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import {
  AlertTriangle,
  ChevronRight,
  Download,
  FileText,
  Mail,
  Paperclip,
  Star,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { AppNavBar } from "@/components/app-shell/AppNavBar";
import { AppTopSpacer } from "@/components/app-shell/AppTopSpacer";
import { useDeviceMockup } from "@/hooks/useDeviceMockup";
import { useAppChrome } from "@/context/AppChromeContext";
import { APP_NAV_HOME_INNER_H } from "@/components/app-shell/appChromeLayout";
import { STATUS_BAR_HEIGHT } from "@/components/app-shell/AppStatusBar";
import { AppCard } from "@/components/app-shell/primitives/AppCard";
import { getPrototypeInboxEntries, type MessageTag } from "./messageCatalog";

type FilterId =
  | "all"
  | "attention"
  | "unread"
  | "starred"
  | "archive"
  | "account-security"
  | "money-activity"
  | "tax-statements";

interface MessageRow {
  id: string;
  title: string;
  date: string;
  read: boolean;
  attentionNeeded: boolean;
  pdfAttached: boolean;
  body: string;
  starred: boolean;
  archived?: boolean;
  tags?: MessageTag[];
}

/** Max inbox rows shown in the Messages prototype (product cap). */
const MAX_MESSAGES = 20;

const PAGE_SIZE = 8;

/** Figma 520:9309 — Row with Swipe Actions (info / warning / critical). */
const SWIPE_ACTION_SIZE = 52;
const SWIPE_ACTION_GAP = 10;
const SWIPE_ROW_PR = 16;
const SWIPE_MAX_PX =
  SWIPE_ROW_PR + SWIPE_ACTION_SIZE * 3 + SWIPE_ACTION_GAP * 2;

/** One-time nudge so the first row briefly reveals swipe actions (app Messages only). */
const FIRST_ROW_INTRO_PEEK_PX = 40;
const FIRST_ROW_INTRO_DELAY_MS = 480;
const FIRST_ROW_INTRO_SLIDE_MS = 320;
const FIRST_ROW_INTRO_HOLD_MS = 160;

const SWIPE_ACTION_BLUE = "var(--app-info)";
const SWIPE_ACTION_GOLD = "var(--app-warning)";
const SWIPE_ACTION_RED = "var(--app-destructive)";

type SwipeGestureState =
  | { kind: "idle" }
  | { kind: "open"; id: string }
  | {
      kind: "drag";
      id: string;
      pointerId: number;
      startX: number;
      startOffset: number;
      currentX: number;
    };

function swipeOffsetFromState(
  state: SwipeGestureState,
  id: string
): number {
  if (state.kind === "drag" && state.id === id) {
    const dx = state.currentX - state.startX;
    return Math.max(
      -SWIPE_MAX_PX,
      Math.min(0, state.startOffset + dx)
    );
  }
  if (state.kind === "open" && state.id === id) return -SWIPE_MAX_PX;
  return 0;
}

/**
 * Seed inbox from the prototype catalog (20 max). Last row is archived for the Archive filter.
 */
function buildInboxRows(): MessageRow[] {
  const entries = getPrototypeInboxEntries();
  return entries.map((entry, i) => {
    const archived = i === MAX_MESSAGES - 1;
    const day = Math.max(1, 28 - (i % 20));
    return {
      id: `m${i + 1}`,
      title: entry.title,
      date: `April ${day}`,
      read: i % 3 !== 0,
      attentionNeeded: entry.attentionNeeded,
      pdfAttached: entry.pdfAttached ?? false,
      starred: i === 4,
      archived,
      tags: [entry.tag],
      body:
        entry.previewBody ??
        `Open this message to review details for ${entry.title}.`,
    };
  });
}

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "All Messages" },
  { id: "attention", label: "Attention Needed" },
  { id: "unread", label: "Unread" },
  { id: "starred", label: "Starred" },
  { id: "archive", label: "Archive" },
  { id: "account-security", label: "Account & Security" },
  { id: "money-activity", label: "Money Activity" },
  { id: "tax-statements", label: "Tax & Statements" },
];

/** Fills viewport above tab bar (AppShell adds bottom padding for tab bar). */
const PAGE_ROOT: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  minHeight:
    "calc(100dvh - var(--app-tabbar-height) - env(safe-area-inset-bottom, 0px))",
  fontFamily: "var(--app-font)",
};

const PILL_SELECTED_BG = "var(--app-primary-900)";
const PILL_SELECTED_TEXT = "#ffffff";
const PILL_IDLE_TEXT = "var(--app-text)";
const PILL_SHADOW = "var(--theme-card-shadow, 0 6.03px 18.1px 0 rgba(43, 49, 78, 0.06))";
const CRITICAL = "var(--app-destructive)";
const LABELS_SECONDARY = "var(--app-text-secondary)";
const CHEVRON_MUTED = "var(--app-text-secondary)";
const INFO_SURFACE = "var(--app-info-surface)";
const INFO_TEXT = "var(--app-info-text)";

/** Figma View message / Modal — attachment filename from title */
function pdfFileNameFromTitle(title: string): string {
  const slug = title
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 48);
  return `${slug || "message"}.pdf`;
}

/** Detail sheet timestamp — Figma: 11/23/25 11:05AM style */
function formatDetailTimestamp(dateLabel: string): string {
  return `${dateLabel}, 2026 · 11:05 AM`;
}

function filterMessages(list: MessageRow[], filter: FilterId): MessageRow[] {
  const base = (rows: MessageRow[]) => rows.filter((m) => {
    if (filter === "archive") return m.archived === true;
    return !m.archived;
  });

  switch (filter) {
    case "all":
      return base(list);
    case "attention":
      return base(list).filter((m) => m.attentionNeeded);
    case "unread":
      return base(list).filter((m) => !m.read);
    case "starred":
      return base(list).filter((m) => m.starred);
    case "archive":
      return list.filter((m) => m.archived === true);
    case "account-security":
      return base(list).filter((m) => m.tags?.includes("account-security"));
    case "money-activity":
      return base(list).filter((m) => m.tags?.includes("money-activity"));
    case "tax-statements":
      return base(list).filter((m) => m.tags?.includes("tax-statements"));
    default:
      return base(list);
  }
}

/**
 * Filter chip — Figma "Button - Liquid Glass - Text".
 * Selected (474:10160): primary-900, white label, glass highlight.
 * Idle (474:11927): frosted glass + 8px/40px shadow, dark label — matches app `--app-glass-*` tokens.
 */
function FilterPill({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  const base: CSSProperties = {
    position: "relative",
    flexShrink: 0,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    minHeight: 48,
    padding: "13px 20px",
    borderRadius: 1000,
    border: "none",
    cursor: "pointer",
    fontFamily: "var(--app-font)",
    fontSize: 17,
    fontWeight: 600,
    letterSpacing: -0.43,
    lineHeight: "22px",
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    boxShadow: PILL_SHADOW,
    WebkitTapHighlightColor: "transparent",
  };

  if (selected) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed="true"
        style={{
          ...base,
          color: PILL_SELECTED_TEXT,
          background: PILL_SELECTED_BG,
          /* Subtle top edge like Figma glass stack */
          boxShadow: `${PILL_SHADOW}, inset 0 1px 0 rgba(255, 255, 255, 0.18)`,
        }}
      >
        {label}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed="false"
      style={{
        ...base,
        color: PILL_IDLE_TEXT,
        background: "var(--app-glass-bg)",
        backdropFilter: "var(--app-glass-blur)",
        WebkitBackdropFilter: "var(--app-glass-blur)",
        border: "0.5px solid var(--app-glass-border)",
        boxShadow: PILL_SHADOW,
      }}
    >
      {label}
    </button>
  );
}

/** Figma 520:9309 — swipe left reveals circular actions; card slides over them. */
function MessageSwipeRow({
  translateX,
  isDragging,
  transformTransition,
  onForegroundPointerDown,
  onForegroundPointerMove,
  onForegroundPointerUp,
  onForegroundPointerCancel,
  onCardClick,
  onMarkRead,
  onToggleStar,
  onDelete,
  messageStarred,
  children,
}: {
  translateX: number;
  isDragging: boolean;
  /** When set, used instead of the default swipe release transition (e.g. intro peek). */
  transformTransition?: string;
  onForegroundPointerDown: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onForegroundPointerMove: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onForegroundPointerUp: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onForegroundPointerCancel: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onCardClick: () => void;
  onMarkRead: () => void;
  onToggleStar: () => void;
  onDelete: () => void;
  messageStarred: boolean;
  children: ReactNode;
}) {
  const actionsInteractive = translateX < -8;
  const actionBtn: CSSProperties = {
    width: SWIPE_ACTION_SIZE,
    height: SWIPE_ACTION_SIZE,
    minWidth: SWIPE_ACTION_SIZE,
    minHeight: SWIPE_ACTION_SIZE,
    borderRadius: 100,
    border: "none",
    padding: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
    WebkitTapHighlightColor: "transparent",
  };

  return (
    <div
      style={{
        position: "relative",
        height: 126,
        borderRadius: "var(--app-radius-lg)",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingRight: SWIPE_ROW_PR,
          gap: SWIPE_ACTION_GAP,
          pointerEvents: actionsInteractive ? "auto" : "none",
        }}
      >
        <button
          type="button"
          aria-label="Mark as read or unread"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onMarkRead();
          }}
          style={{ ...actionBtn, background: SWIPE_ACTION_BLUE }}
        >
          <Mail size={22} strokeWidth={2} color="#fff" aria-hidden />
        </button>
        <button
          type="button"
          aria-pressed={messageStarred}
          aria-label={
            messageStarred ? "Unstar message" : "Star message"
          }
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onToggleStar();
          }}
          style={{ ...actionBtn, background: SWIPE_ACTION_GOLD }}
        >
          <Star
            size={22}
            strokeWidth={2}
            color="#fff"
            fill={messageStarred ? "#fff" : "none"}
            aria-hidden
          />
        </button>
        <button
          type="button"
          aria-label="Delete message"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          style={{ ...actionBtn, background: SWIPE_ACTION_RED }}
        >
          <Trash2 size={22} strokeWidth={2} color="#fff" aria-hidden />
        </button>
      </div>

      <div
        role="presentation"
        onClick={onCardClick}
        onPointerDown={onForegroundPointerDown}
        onPointerMove={onForegroundPointerMove}
        onPointerUp={onForegroundPointerUp}
        onPointerCancel={onForegroundPointerCancel}
        style={{
          position: "relative",
          zIndex: 1,
          height: "100%",
          transform: `translate3d(${translateX}px, 0, 0)`,
          transition: isDragging
            ? "none"
            : transformTransition ??
              "transform 0.22s cubic-bezier(0.32, 0.72, 0, 1)",
          touchAction: "pan-y",
          background: "#fff",
          borderRadius: "var(--app-radius-lg)",
          boxShadow:
            "0 2px 16px rgba(0, 0, 0, 0.07), 0 0 0 0.5px rgba(0, 0, 0, 0.05)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default function AppMessageCenter() {
  const [filter, setFilter] = useState<FilterId>("all");
  const [rows, setRows] = useState<MessageRow[]>(() => buildInboxRows());
  const [visibleLimit, setVisibleLimit] = useState(PAGE_SIZE);
  const [selected, setSelected] = useState<MessageRow | null>(null);
  const [swipe, setSwipe] = useState<SwipeGestureState>({ kind: "idle" });

  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadMoreInFlight = useRef(false);
  const loadMoreFnRef = useRef<() => void>(() => {});
  const swipePointerStartRef = useRef({ x: 0, y: 0 });
  const swipeAxisRef = useRef<"undecided" | "x" | "y">("undecided");
  const swipeDidDragRef = useRef(false);

  const unreadCount = useMemo(
    () => rows.filter((m) => !m.read && !m.archived).length,
    [rows]
  );

  const starredCount = useMemo(
    () => rows.filter((m) => m.starred && !m.archived).length,
    [rows]
  );

  const filtered = useMemo(() => filterMessages(rows, filter), [rows, filter]);

  const displayed = useMemo(
    () => filtered.slice(0, visibleLimit),
    [filtered, visibleLimit]
  );

  const firstDisplayedId = displayed[0]?.id;
  const [firstRowIntroPeekPx, setFirstRowIntroPeekPx] = useState(0);
  const [firstRowIntroMotion, setFirstRowIntroMotion] = useState(false);
  /** Set after the intro peek finishes — avoids replay when filters change. */
  const firstRowIntroDoneRef = useRef(false);
  const firstRowIdForIntroRef = useRef<string | undefined>(undefined);
  const firstDisplayedIdRef = useRef<string | undefined>(undefined);
  firstDisplayedIdRef.current = firstDisplayedId;

  useEffect(() => {
    if (firstRowIntroDoneRef.current) return;
    if (!firstDisplayedId) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      firstRowIntroDoneRef.current = true;
      return;
    }

    firstRowIdForIntroRef.current = firstDisplayedId;

    let cancelled = false;
    let endMotionTimer = 0;

    const show = window.setTimeout(() => {
      if (cancelled) return;
      setFirstRowIntroMotion(true);
      setFirstRowIntroPeekPx(-FIRST_ROW_INTRO_PEEK_PX);
    }, FIRST_ROW_INTRO_DELAY_MS);

    const hide = window.setTimeout(() => {
      if (cancelled) return;
      setFirstRowIntroPeekPx(0);
      firstRowIdForIntroRef.current = undefined;
      endMotionTimer = window.setTimeout(() => {
        if (cancelled) return;
        setFirstRowIntroMotion(false);
        firstRowIntroDoneRef.current = true;
      }, 420);
    }, FIRST_ROW_INTRO_DELAY_MS + FIRST_ROW_INTRO_SLIDE_MS + FIRST_ROW_INTRO_HOLD_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(show);
      window.clearTimeout(hide);
      if (endMotionTimer) window.clearTimeout(endMotionTimer);
    };
  }, [firstDisplayedId]);

  const selectFilter = useCallback((next: FilterId) => {
    setSwipe({ kind: "idle" });
    setFilter(next);
    setVisibleLimit(PAGE_SIZE);
    queueMicrotask(() => {
      const scrollContainer = document.getElementById("app-scroll-container");
      if (scrollContainer) scrollContainer.scrollTo({ top: 0 });
    });
  }, []);

  const loadMore = useCallback(() => {
    if (loadMoreInFlight.current) return;

    if (visibleLimit < filtered.length) {
      loadMoreInFlight.current = true;
      setVisibleLimit((n) => Math.min(n + PAGE_SIZE, filtered.length));
      queueMicrotask(() => {
        loadMoreInFlight.current = false;
      });
    }
  }, [visibleLimit, filtered.length]);

  useEffect(() => {
    loadMoreFnRef.current = loadMore;
  }, [loadMore]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMoreFnRef.current();
      },
      { root: document.getElementById("app-scroll-container"), rootMargin: "200px 0px", threshold: 0 }
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, [displayed.length, filtered.length, filter]);

  const open = useCallback((msg: MessageRow) => {
    setSwipe({ kind: "idle" });
    setRows((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m))
    );
    setSelected({ ...msg, read: true });
  }, []);

  const beginRowPointer = useCallback(
    (id: string, e: ReactPointerEvent<HTMLDivElement>) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (id === firstDisplayedIdRef.current) {
        setFirstRowIntroPeekPx(0);
        setFirstRowIntroMotion(false);
        firstRowIdForIntroRef.current = undefined;
        firstRowIntroDoneRef.current = true;
      }
      swipeAxisRef.current = "undecided";
      swipeDidDragRef.current = false;
      swipePointerStartRef.current = { x: e.clientX, y: e.clientY };
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      setSwipe((prev) => {
        const startOffset = swipeOffsetFromState(prev, id);
        return {
          kind: "drag",
          id,
          pointerId: e.pointerId,
          startX: e.clientX,
          startOffset,
          currentX: e.clientX,
        };
      });
    },
    []
  );

  const moveRowPointer = useCallback((id: string, e: ReactPointerEvent<HTMLDivElement>) => {
    setSwipe((prev) => {
      if (
        prev.kind !== "drag" ||
        prev.id !== id ||
        e.pointerId !== prev.pointerId
      ) {
        return prev;
      }

      const dx = e.clientX - swipePointerStartRef.current.x;
      const dy = e.clientY - swipePointerStartRef.current.y;

      if (
        swipeAxisRef.current === "undecided" &&
        (Math.abs(dx) > 12 || Math.abs(dy) > 12)
      ) {
        swipeAxisRef.current =
          Math.abs(dy) > Math.abs(dx) ? "y" : "x";
      }

      /* Vertical scroll: keep drag state until pointer up so capture releases cleanly. */
      if (swipeAxisRef.current === "y") return prev;

      if (Math.abs(dx) > 14) swipeDidDragRef.current = true;
      e.preventDefault();
      return { ...prev, currentX: e.clientX };
    });
  }, []);

  const endRowPointer = useCallback(
    (id: string, e: ReactPointerEvent<HTMLDivElement>) => {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      setSwipe((prev) => {
        if (
          prev.kind !== "drag" ||
          prev.id !== id ||
          e.pointerId !== prev.pointerId
        ) {
          return prev;
        }

        if (swipeAxisRef.current === "y") {
          const off = swipeOffsetFromState(prev, id);
          return off < -SWIPE_MAX_PX * 0.35
            ? { kind: "open", id }
            : { kind: "idle" };
        }

        const off = swipeOffsetFromState(prev, id);
        if (off < -SWIPE_MAX_PX * 0.35) return { kind: "open", id };
        return { kind: "idle" };
      });
      swipeAxisRef.current = "undecided";
    },
    []
  );

  const handleCardActivate = useCallback(
    (msg: MessageRow) => {
      if (swipeDidDragRef.current) {
        swipeDidDragRef.current = false;
        return;
      }
      if (swipe.kind === "open" && swipe.id === msg.id) {
        setSwipe({ kind: "idle" });
        return;
      }
      open(msg);
    },
    [swipe, open]
  );

  const closeSheet = useCallback(() => setSelected(null), []);
  const { deviceOn } = useDeviceMockup();
  const { topChromeHidden } = useAppChrome();

  const hideY = deviceOn ? -(STATUS_BAR_HEIGHT + APP_NAV_HOME_INNER_H) : "-100%";

  return (
    <div style={PAGE_ROOT}>
      <AppTopSpacer variant="home" />
      <AppNavBar variant="title" title="Messages" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: topChromeHidden ? hideY : 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{
          position: "sticky",
          top: deviceOn ? STATUS_BAR_HEIGHT + APP_NAV_HOME_INNER_H : `calc(env(safe-area-inset-top, 0px) + ${APP_NAV_HOME_INNER_H}px)`,
          zIndex: 40,
        }}
      >
        <div
        data-name="Page filters"
        style={{
          flexShrink: 0,
          background: "transparent",
          /* Left inset matches message list; no right padding so pills reach the edge (scroll affordance). */
          padding: "8px 0 8px 16px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
            overflowX: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            background: "transparent",
          }}
          className="messages-filter-scroll"
        >
          {FILTERS.map((f) => {
            const label =
              f.id === "unread"
                ? `Unread (${unreadCount})`
                : f.id === "starred"
                  ? `Starred (${starredCount})`
                  : f.label;
            return (
              <FilterPill
                key={f.id}
                label={label}
                selected={filter === f.id}
                onClick={() => selectFilter(f.id)}
              />
            );
          })}
        </div>
      </div>

      <div
        style={{
          padding: "16px 16px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {filtered.length === 0 && (
          <p
            style={{
              font: "var(--app-font-body)",
              color: "var(--app-text-secondary)",
              textAlign: "center",
              padding: "24px 8px",
            }}
          >
            No messages in this view.
          </p>
        )}
        {displayed.map((msg) => (
          <MessageSwipeRow
            key={msg.id}
            translateX={
              swipeOffsetFromState(swipe, msg.id) +
              (msg.id === firstDisplayedId ? firstRowIntroPeekPx : 0)
            }
            transformTransition={
              msg.id === firstDisplayedId && firstRowIntroMotion
                ? "transform 0.38s cubic-bezier(0.34, 1.2, 0.64, 1)"
                : undefined
            }
            isDragging={swipe.kind === "drag" && swipe.id === msg.id}
            onForegroundPointerDown={(e) => beginRowPointer(msg.id, e)}
            onForegroundPointerMove={(e) => moveRowPointer(msg.id, e)}
            onForegroundPointerUp={(e) => endRowPointer(msg.id, e)}
            onForegroundPointerCancel={(e) => endRowPointer(msg.id, e)}
            onCardClick={() => handleCardActivate(msg)}
            onMarkRead={() => {
              setRows((prev) =>
                prev.map((m) =>
                  m.id === msg.id ? { ...m, read: !m.read } : m
                )
              );
              setSwipe({ kind: "idle" });
            }}
            messageStarred={msg.starred}
            onToggleStar={() => {
              setRows((prev) =>
                prev.map((m) =>
                  m.id === msg.id
                    ? { ...m, starred: !m.starred }
                    : m
                )
              );
              setSwipe({ kind: "idle" });
            }}
            onDelete={() => {
              setRows((prev) => prev.filter((m) => m.id !== msg.id));
              setSwipe({ kind: "idle" });
            }}
          >
            <AppCard
              variant="solid"
              padding="20px"
              style={{
                height: "100%",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                borderRadius: "var(--app-radius-lg)",
                background: "#fff",
                boxShadow: "none",
              }}
            >
            {msg.attentionNeeded && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr auto",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 6,
                  flexShrink: 0,
                }}
              >
                <AlertTriangle
                  size={17}
                  strokeWidth={2}
                  style={{ color: CRITICAL, flexShrink: 0 }}
                  aria-hidden
                />
                <span
                  style={{
                    font: "var(--app-font-subhead)",
                    color: CRITICAL,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  Attention Needed
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    flexShrink: 0,
                    font: "var(--app-font-caption1)",
                    color: LABELS_SECONDARY,
                  }}
                >
                  {msg.starred && (
                    <span
                      aria-label="Starred"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        lineHeight: 0,
                      }}
                    >
                      <Star
                        size={14}
                        strokeWidth={2}
                        color={SWIPE_ACTION_GOLD}
                        fill={SWIPE_ACTION_GOLD}
                        aria-hidden
                      />
                    </span>
                  )}
                  <span style={{ fontSize: "18px" }}>{msg.date}</span>
                  <ChevronRight
                    size={14}
                    strokeWidth={2.5}
                    style={{ color: CHEVRON_MUTED }}
                    aria-hidden
                  />
                </div>
              </div>
            )}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                flex: 1,
                minHeight: 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  width: "100%",
                  flexShrink: 0,
                }}
              >
                {!msg.read && (
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "var(--app-primary)",
                      flexShrink: 0,
                    }}
                    aria-hidden
                  />
                )}
                <div
                  style={{
                    display: "flex",
                    flex: 1,
                    alignItems: "center",
                    gap: 8,
                    minWidth: 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: 17,
                      fontWeight: msg.read ? 400 : 600,
                      letterSpacing: -0.43,
                      lineHeight: "22px",
                      color: "var(--app-text)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    {msg.title}
                  </span>
                  {!msg.attentionNeeded && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        flexShrink: 0,
                        font: "var(--app-font-caption1)",
                        color: LABELS_SECONDARY,
                      }}
                    >
                      {msg.starred && (
                        <span
                          aria-label="Starred"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            lineHeight: 0,
                          }}
                        >
                          <Star
                            size={14}
                            strokeWidth={2}
                            color={SWIPE_ACTION_GOLD}
                            fill={SWIPE_ACTION_GOLD}
                            aria-hidden
                          />
                        </span>
                      )}
                      <span style={{ fontSize: "18px" }}>{msg.date}</span>
                      <ChevronRight
                        size={14}
                        strokeWidth={2.5}
                        style={{ color: CHEVRON_MUTED }}
                        aria-hidden
                      />
                    </div>
                  )}
                </div>
              </div>

              {msg.pdfAttached && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "2px 8px 2px 4px",
                      borderRadius: 6,
                      background: INFO_SURFACE,
                      fontSize: 12,
                      fontWeight: 600,
                      lineHeight: "20px",
                      color: INFO_TEXT,
                    }}
                  >
                    <Paperclip size={12} strokeWidth={2} aria-hidden />
                    PDF Attached
                  </span>
                </div>
              )}
            </div>
          </AppCard>
          </MessageSwipeRow>
        ))}

        {filtered.length > 0 && (
          <div
            ref={sentinelRef}
            style={{ height: 1, flexShrink: 0 }}
            aria-hidden
          />
        )}

      </div>
      </motion.div>

      <AnimatePresence>
        {selected && (
          <>
            <motion.button
              key={`message-detail-backdrop-${selected.id}`}
              type="button"
              aria-label="Close message"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={closeSheet}
              style={{
                position: "fixed",
                inset: 0,
                width: "100%",
                maxWidth: 430,
                marginLeft: "auto",
                marginRight: "auto",
                zIndex: 100,
                padding: 0,
                border: "none",
                background: "rgba(18, 24, 29, 0.3)",
                cursor: "pointer",
              }}
            />
            <motion.div
              key={`message-detail-sheet-${selected.id}`}
              className="message-detail-sheet-panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="message-detail-title"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{
                duration: 0.38,
                ease: [0.32, 0.72, 0, 1],
              }}
              style={{
                position: "fixed",
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 101,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                width: "100%",
                maxWidth: 430,
                margin: "0 auto",
                maxHeight: "min(85dvh, 520px)",
                background: "#fff",
                borderTop: "1px solid var(--app-border)",
                borderLeft: "1px solid var(--app-border)",
                borderRight: "1px solid var(--app-border)",
                borderRadius: "16px 16px 0 0",
                padding: "0 16px calc(24px + env(safe-area-inset-bottom, 0px))",
                overflow: "auto",
                boxSizing: "border-box",
                touchAction: "pan-y",
              }}
              onClick={(e) => e.stopPropagation()}
            >
            <button
              type="button"
              aria-label="Close message"
              onClick={closeSheet}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                paddingTop: 5,
                minHeight: 44,
                width: "100%",
                margin: 0,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  width: 36,
                  height: 5,
                  borderRadius: 100,
                  background: "#ccc",
                  pointerEvents: "none",
                }}
              />
            </button>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {selected.attentionNeeded && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    color: CRITICAL,
                  }}
                >
                  <AlertTriangle size={17} strokeWidth={2} aria-hidden />
                  <span
                    style={{
                      font: "var(--app-font-subhead)",
                      lineHeight: "20px",
                      letterSpacing: -0.23,
                    }}
                  >
                    Attention Needed
                  </span>
                </div>
              )}

              <div style={{ position: "relative", minHeight: 48 }}>
                <h2
                  id="message-detail-title"
                  style={{
                    margin: 0,
                    fontSize: 17,
                    fontWeight: 600,
                    lineHeight: "22px",
                    letterSpacing: -0.43,
                    color: "var(--app-text)",
                  }}
                >
                  {selected.title}
                </h2>
                <p
                  style={{
                    margin: "6px 0 0",
                    fontSize: 13,
                    lineHeight: "18px",
                    letterSpacing: -0.08,
                    color: "var(--app-text-secondary)",
                  }}
                >
                  {formatDetailTimestamp(selected.date)}
                </p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                width: "100%",
              }}
            >
              <div style={{ padding: "8px 0" }}>
                <div style={{ height: 1, background: "var(--app-border)", width: "100%" }} />
              </div>

              <p
                style={{
                  margin: 0,
                  fontSize: 17,
                  fontWeight: 400,
                  lineHeight: "22px",
                  letterSpacing: -0.43,
                    color: "var(--app-text)",
                }}
              >
                {selected.pdfAttached
                  ? "Please see attachment."
                  : selected.body}
              </p>

              {selected.pdfAttached && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "20px 1fr 20px",
                    alignItems: "center",
                    gap: 12,
                    minHeight: 68,
                    padding: "12px 16px",
                    border: "1px solid var(--app-border)",
                    borderRadius: 6,
                    background: "#fff",
                    boxSizing: "border-box",
                  }}
                >
                  <FileText
                    size={20}
                    strokeWidth={1.75}
                    style={{ color: "var(--system-link, #1C6EFF)" }}
                    aria-hidden
                  />
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    style={{
                      fontFamily: "Inter, var(--app-font), sans-serif",
                      fontSize: 14,
                      fontWeight: 600,
                      lineHeight: "24px",
                      letterSpacing: -0.6,
                      color: "var(--system-link, #1C6EFF)",
                      textDecoration: "none",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {pdfFileNameFromTitle(selected.title)}
                  </a>
                  <button
                    type="button"
                    aria-label="Download attachment"
                    onClick={(e) => e.preventDefault()}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 0,
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      color: "var(--system-link, #1C6EFF)",
                    }}
                  >
                    <Download size={20} strokeWidth={2} aria-hidden />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .messages-filter-scroll {
          background: transparent;
        }
        .messages-filter-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

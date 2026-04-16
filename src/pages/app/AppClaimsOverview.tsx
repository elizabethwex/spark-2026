import type { CSSProperties } from "react";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, Mic, ChevronRight, Check, Clock, X, AlertCircle } from "lucide-react";
import { AppNavBar } from "@/components/app-shell/AppNavBar";
import { APP_TABBAR_END_SCROLL_PADDING } from "@/components/app-shell/appChromeLayout";
import { AppTopSpacer } from "@/components/app-shell/AppTopSpacer";
import { AppBadge } from "@/components/app-shell/primitives/AppBadge";
import {
  CLAIMS_PAGE_BACKGROUND,
  CLAIMS_STROKE,
  CLAIMS_LIST_BADGE_SUCCESS_BG,
  CLAIMS_LIST_BADGE_SUCCESS_FG,
} from "./claimsPageStyles";

type ClaimStatus = "approved" | "pending" | "denied" | "in_review";

interface Claim {
  id: string;
  provider: string;
  date: string;
  amount: string;
  account: string;
  status: ClaimStatus;
  category: string;
  claimNumber: string;
}

const CLAIMS: Claim[] = [
  {
    id: "c2",
    provider: "CVS Pharmacy",
    date: "February 24, 2026",
    amount: "$24.99",
    account: "Flexible Spending 2025 (FSA)",
    status: "approved",
    category: "Pharmacy",
    claimNumber: "01SMA251117P0000301",
  },
  { id: "c1", provider: "Dr. Lisa Monroe – Primary Care", date: "Jan 10, 2025", amount: "$120.00", account: "Health FSA", status: "approved", category: "Medical", claimNumber: "CLM-2025-C1" },
  { id: "c7", provider: "Walgreens", date: "Jan 8, 2025", amount: "$26.00", account: "HSA", status: "approved", category: "Pharmacy", claimNumber: "CLM-2025-C7" },
  { id: "c3", provider: "Vision Works", date: "Dec 28, 2024", amount: "$215.00", account: "Health FSA", status: "in_review", category: "Vision", claimNumber: "CLM-2025-C3" },
  { id: "c4", provider: "Advanced Dental Group", date: "Dec 15, 2024", amount: "$340.00", account: "Health FSA", status: "pending", category: "Dental", claimNumber: "CLM-2025-C4" },
  { id: "c5", provider: "CVS Pharmacy (prior)", date: "Dec 10, 2024", amount: "$18.50", account: "HSA", status: "denied", category: "Pharmacy", claimNumber: "CLM-2025-C5" },
  { id: "c6", provider: "MRI Imaging Center", date: "Nov 30, 2024", amount: "$850.00", account: "Health FSA", status: "approved", category: "Medical", claimNumber: "CLM-2025-C6" },
];

const STATUS_META: Record<
  ClaimStatus,
  { label: string; variant: "success" | "warning" | "info" | "destructive" | "neutral"; icon: typeof Check }
> = {
  approved: { label: "Approved", variant: "success", icon: Check },
  pending: { label: "Pending", variant: "warning", icon: Clock },
  denied: { label: "Denied", variant: "destructive", icon: X },
  in_review: { label: "In Review", variant: "info", icon: AlertCircle },
};

const FILTER_OPTIONS: { label: string; value: ClaimStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Approved", value: "approved" },
  { label: "Pending", value: "pending" },
  { label: "In Review", value: "in_review" },
  { label: "Denied", value: "denied" },
];

const LIQUID_SYMBOL: CSSProperties = {
  width: 48,
  height: 48,
  borderRadius: "50%",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  boxShadow: "0 8px 40px rgba(0,0,0,0.12), inset 0 0 0 0.5px rgba(255,255,255,0.4)",
  backdropFilter: "blur(20px) saturate(180%)",
  WebkitBackdropFilter: "blur(20px) saturate(180%)",
  background: "rgba(255, 255, 255, 0.65)",
};

function matchesSearch(claim: Claim, q: string): boolean {
  if (!q.trim()) return true;
  const s = q.trim().toLowerCase();
  const hay = [claim.provider, claim.account, claim.id, claim.category, claim.claimNumber, claim.amount]
    .join(" ")
    .toLowerCase();
  return hay.includes(s);
}

export default function AppClaimsOverview() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<ClaimStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  const filtered = useMemo(() => {
    const byStatus = filter === "all" ? CLAIMS : CLAIMS.filter((c) => c.status === filter);
    return byStatus.filter((c) => matchesSearch(c, search));
  }, [filter, search]);

  return (
    <div
      style={{
        minHeight: "100%",
        background: CLAIMS_PAGE_BACKGROUND,
        fontFamily: "var(--app-font)",
      }}
    >
      <AppTopSpacer variant="home" />
      <AppNavBar variant="title" title="Claims" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div style={{ padding: "8px 16px 0", display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "11px 11px",
            borderRadius: 12,
            border: `1px solid ${CLAIMS_STROKE}`,
            background: "linear-gradient(90deg, rgba(255,255,255,0.2), rgba(255,255,255,0.2)), #fff",
            boxSizing: "border-box",
          }}
        >
          <Search size={18} strokeWidth={1.75} style={{ color: "var(--app-text-secondary)", flexShrink: 0 }} />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by account or claim #"
            aria-label="Search claims"
            style={{
              flex: 1,
              minWidth: 0,
              border: "none",
              background: "transparent",
              fontFamily: "var(--app-font)",
              fontSize: 14,
              color: "var(--app-text)",
              outline: "none",
            }}
          />
          <button
            type="button"
            aria-label="Voice search (demo)"
            style={{ border: "none", background: "none", padding: 0, cursor: "default", color: "var(--app-text-secondary)", display: "flex" }}
          >
            <Mic size={18} strokeWidth={1.75} />
          </button>
        </div>
        <button type="button" aria-label="Filter claims" onClick={() => setFilterSheetOpen(true)} style={LIQUID_SYMBOL}>
          <SlidersHorizontal size={22} strokeWidth={1.75} style={{ color: "var(--app-text)" }} />
        </button>
      </div>

      <div
        style={{
          paddingLeft: 16,
          paddingRight: 16,
          paddingTop: 16,
          paddingBottom: APP_TABBAR_END_SCROLL_PADDING,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {filtered.length === 0 ? (
          <div
            style={{
              padding: "40px 16px",
              textAlign: "center",
              font: "var(--app-font-subhead)",
              color: "var(--app-text-secondary)",
            }}
          >
            No claims found
          </div>
        ) : (
          filtered.map((claim) => {
            const sm = STATUS_META[claim.status];
            return (
              <button
                key={claim.id}
                type="button"
                onClick={() => navigate(`/app/claims/${claim.id}`)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  width: "100%",
                  textAlign: "left",
                  cursor: "pointer",
                  padding: "20px 8px 20px 20px",
                  borderRadius: 12,
                  border: `1px solid ${CLAIMS_STROKE}`,
                  background: "#fff",
                  fontFamily: "var(--app-font)",
                  boxSizing: "border-box",
                }}
              >
                <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 8, paddingBottom: 2 }}>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: "var(--app-text)",
                      lineHeight: "24px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {claim.provider}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 400, color: "var(--app-text-secondary)", lineHeight: "20px" }}>{claim.date}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                  <span style={{ fontSize: 16, fontWeight: 600, color: "var(--app-text)", lineHeight: "24px" }}>{claim.amount}</span>
                  {claim.status === "approved" ? (
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        lineHeight: "20px",
                        padding: "4px 8px",
                        borderRadius: 6,
                        background: CLAIMS_LIST_BADGE_SUCCESS_BG,
                        color: CLAIMS_LIST_BADGE_SUCCESS_FG,
                      }}
                    >
                      {sm.label}
                    </span>
                  ) : (
                    <AppBadge label={sm.label} variant={sm.variant} size="sm" />
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", alignSelf: "stretch", paddingLeft: 4 }}>
                  <ChevronRight size={22} strokeWidth={2} style={{ color: "var(--app-text-tertiary)" }} />
                </div>
              </button>
            );
          })
        )}
      </div>

      </motion.div>

      <AnimatePresence>
        {filterSheetOpen && (
          <>
            <motion.div
              key="claims-filter-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFilterSheetOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.4)",
                zIndex: 9999,
              }}
            />
            <motion.div
              key="claims-filter-sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "fixed",
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 10000,
                background: "rgba(255,255,255,0.94)",
                backdropFilter: "blur(40px) saturate(200%)",
                WebkitBackdropFilter: "blur(40px) saturate(200%)",
                borderRadius: "24px 24px 0 0",
                boxShadow: "0px 15px 75px rgba(0,0,0,0.18)",
                paddingBottom: "calc(20px + env(safe-area-inset-bottom, 0px))",
                maxWidth: 430,
                margin: "0 auto",
              }}
            >
              <div style={{ display: "flex", justifyContent: "center", paddingTop: 8, paddingBottom: 8 }}>
                <div style={{ width: 36, height: 5, borderRadius: 100, background: "rgba(0,0,0,0.15)" }} />
              </div>
              <div style={{ padding: "0 20px 8px", fontSize: 18, fontWeight: 600, color: "var(--app-text)" }}>Filter by status</div>
              <div style={{ display: "flex", flexDirection: "column", padding: "8px 12px 16px" }}>
                {FILTER_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setFilter(opt.value);
                      setFilterSheetOpen(false);
                    }}
                    style={{
                      padding: "14px 12px",
                      border: "none",
                      borderRadius: 12,
                      background: filter === opt.value ? "var(--app-primary-surface)" : "transparent",
                      color: filter === opt.value ? "var(--app-primary)" : "var(--app-text)",
                      fontFamily: "var(--app-font)",
                      fontSize: 16,
                      fontWeight: filter === opt.value ? 600 : 400,
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronRight, FileSearch, SlidersHorizontal, HeartPulse, Baby, CalendarCheck2 } from "lucide-react";
import { AppNavBar } from "@/components/app-shell/AppNavBar";
import { AppTopSpacer } from "@/components/app-shell/AppTopSpacer";
import type { FsaTransactionRow } from "@/pages/fsa-account/fsaTransactionsMock";
import { fsaTransactionsData } from "@/pages/fsa-account/fsaTransactionsMock";
import { dcfsaTransactionsData } from "@/pages/dependent-care-fsa/dcfsaTransactionsMock";
import { lpfsaTransactionsData } from "@/pages/lpfsa-account/lpfsaTransactionsMock";
import type { TransactionRow } from "./AppAccountOverview";
import { TransactionDetailSheet } from "./AppAccountOverview";

function mapConsumerFsaRowToTransactionRow(t: FsaTransactionRow, account: string): TransactionRow {
  const status: TransactionRow["status"] = t.status === "Denied" ? "denied" : "complete";
  return {
    merchant: t.description,
    date: t.date,
    account,
    amount: t.amount,
    processedDate: t.date,
    description: t.description,
    planYear: t.planYear,
    status,
  };
}

const CARD_SHADOW = "0px 3.017px 9.051px rgba(43,49,78,0.04), 0px 6.034px 18.101px rgba(43,49,78,0.06)";
const TEXT_PRIMARY = "#14182c";
const TEXT_SECONDARY = "#5f6a94";
const TINT = "#3958c3";
const SEPARATOR = "#e6e6e6";
const SUCCESS_SURFACE = "#ecfdf5";
const SUCCESS_TEXT = "#002c22";
const BORDER_COLOR = "#b7c0da";
const INFO_SURFACE = "#eff6ff";
const TINT_50 = "#eef2ff";

/* ── Per-account-type mock data ─────────────────────────────────────── */

interface BalanceRow {
  label: string;
  value?: string;
  valueColor?: string;
  badge?: { text: string; bg: string; color: string };
}

interface AccountData {
  title: string;
  icon: React.ElementType;
  balanceSubtitle: string;
  balance: string;
  balanceRows: BalanceRow[];
  effectiveDate: string;
  planDuration: string;
  finalServiceDate: string;
  finalFilingDate: string;
  finalFilingDescription: string;
  debitCardAllowed: string;
  maxPerTransaction: string;
  claimsStats: { value: string; label: string }[];
  electionAmount: string;
  /** When set (e.g. DCFSA), shown above election amount instead of "Election Amount". */
  electionAmountLabel?: string;
  contributions: { label: string; value: string }[];
  status: { label: string; value: string }[];
  transactions: TransactionRow[];
}

const ACCOUNT_DATA: Record<string, AccountData> = {
  lpfsa: {
    title: "Limited Purpose FSA",
    icon: CalendarCheck2,
    balanceSubtitle: "Available Balance",
    balance: "$2,925.00",
    balanceRows: [
      { label: "Plan Year", value: "Jan 1, 2026 - Dec 31, 2026" },
      { label: "Eligible Amount", value: "$3,200.00" },
      { label: "Rollover Amount", value: "$0.00" },
      { label: "Use It or Lose It", value: "$2,925.00" },
      { label: "File by 3/31/27" },
    ],
    effectiveDate: "January 1, 2026",
    planDuration: "Jan 1, 2026 - Dec 31, 2026",
    finalServiceDate: "December 31, 2026",
    finalFilingDate: "March 31, 2027",
    finalFilingDescription: "Last date to submit claims for the 2026 plan year",
    debitCardAllowed: "Yes",
    maxPerTransaction: "No maximum",
    claimsStats: [
      { value: "$275.00", label: "Total Paid" },
      { value: "$275.00", label: "Total Submitted" },
      { value: "$0.00", label: "Total Pending" },
      { value: "$60.00", label: "Total Denied" },
    ],
    electionAmount: "$3,200.00",
    contributions: [
      { label: "Employer", value: "$0.00" },
      { label: "My Contribution to Date", value: "$615.35" },
    ],
    status: [
      { label: "Eligible Amount", value: "$3,200.00" },
      { label: "Estimated Payroll Deduction", value: "$123.07" },
    ],
    transactions: lpfsaTransactionsData.map((t) => mapConsumerFsaRowToTransactionRow(t, "LPFSA")),
  },
  fsa: {
    title: "Flexible Spending Account",
    icon: HeartPulse,
    balanceSubtitle: "Available Balance",
    balance: "$2,225.00",
    balanceRows: [
      { label: "Plan Year", value: "Jan 1, 2026 - Dec 31, 2026" },
      { label: "Eligible Amount", value: "$2,500.00" },
      { label: "Rollover Amount", value: "$0.00" },
      { label: "Use It or Lose It", value: "$2,225.00" },
      { label: "File by 3/31/27" },
    ],
    effectiveDate: "January 1, 2026",
    planDuration: "Jan 1, 2026 - Dec 31, 2026",
    finalServiceDate: "December 31, 2026",
    finalFilingDate: "March 31, 2027",
    finalFilingDescription: "Last date to submit claims for the 2026 plan year",
    debitCardAllowed: "Yes",
    maxPerTransaction: "No maximum",
    claimsStats: [
      { value: "$275.00", label: "Total Paid" },
      { value: "$275.00", label: "Total Submitted" },
      { value: "$0.00", label: "Total Pending" },
      { value: "$60.00", label: "Total Denied" },
    ],
    electionAmount: "$2,500.00",
    contributions: [
      { label: "Employer", value: "$0.00" },
      { label: "My Contribution to Date", value: "$378.80" },
    ],
    status: [
      { label: "Eligible Amount", value: "$2,500.00" },
      { label: "Estimated Payroll Deduction", value: "$75.76" },
    ],
    transactions: fsaTransactionsData.map((t) => mapConsumerFsaRowToTransactionRow(t, "FSA")),
  },
  dcfsa: {
    title: "Dependent Care FSA",
    icon: Baby,
    balanceSubtitle: "Available Balance",
    balance: "$0.00",
    balanceRows: [
      { label: "Plan Year", value: "Jan 1, 2026 - Dec 31, 2026" },
      { label: "Eligible Amount", value: "$5,000.00" },
      { label: "Plan Year Balance", value: "$1,153.86" },
      { label: "File by 3/31/27" },
    ],
    effectiveDate: "January 1, 2026",
    planDuration: "Jan 1, 2026 - Dec 31, 2026",
    finalServiceDate: "December 31, 2026",
    finalFilingDate: "March 31, 2027",
    finalFilingDescription: "Last date to submit claims for the 2026 plan year",
    debitCardAllowed: "Yes",
    maxPerTransaction: "No maximum",
    claimsStats: [
      { value: "$1,153.86", label: "Total Paid" },
      { value: "$1,153.86", label: "Total Submitted" },
      { value: "$0.00", label: "Total Pending" },
      { value: "$0.00", label: "Total Denied" },
    ],
    electionAmount: "$5,000.00",
    electionAmountLabel: "Annual Election",
    contributions: [
      { label: "Employer", value: "$0.00" },
      { label: "My Contribution to Date", value: "$1,153.86" },
    ],
    status: [
      { label: "Eligible Amount", value: "$5,000.00" },
      { label: "Estimated Payroll Deduction", value: "$192.31" },
    ],
    transactions: dcfsaTransactionsData.map((t) => mapConsumerFsaRowToTransactionRow(t, "DCFSA")),
  },
};

function SectionIcon() {
  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: INFO_SURFACE,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <FileSearch size={20} strokeWidth={1.75} style={{ color: TINT }} />
    </div>
  );
}

function ActiveBadge() {
  return (
    <div
      style={{
        background: SUCCESS_SURFACE,
        borderRadius: 6,
        padding: "4px 12px",
        fontSize: 12,
        fontWeight: 500,
        lineHeight: "16px",
        color: SUCCESS_TEXT,
      }}
    >
      Active
    </div>
  );
}

function InfoRow({
  label,
  value,
  valueColor,
  badge,
  showSeparator = true,
}: {
  label: string;
  value?: string;
  valueColor?: string;
  badge?: { text: string; bg: string; color: string };
  showSeparator?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {showSeparator && <div style={{ height: 1, background: SEPARATOR }} />}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 52,
        }}
      >
        <span
          style={{
            fontSize: 17,
            fontWeight: 400,
            lineHeight: "22px",
            letterSpacing: 0,
            color: "var(--app-text)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flex: 1,
          }}
        >
          {label}
        </span>
        {value && (
          <span
            style={{
              fontSize: 17,
              fontWeight: 600,
              lineHeight: "22px",
              letterSpacing: 0,
              color: valueColor ?? "var(--app-text-secondary)",
              textAlign: "right",
              flexShrink: 0,
            }}
          >
            {value}
          </span>
        )}
        {badge && (
          <div
            style={{
              background: badge.bg,
              borderRadius: 100,
              padding: "6px 11px",
              fontSize: 17,
              fontWeight: 400,
              lineHeight: "22px",
              letterSpacing: -0.43,
              color: badge.color,
              textAlign: "center",
              whiteSpace: "nowrap",
            }}
          >
            {badge.text}
          </div>
        )}
      </div>
    </div>
  );
}

function BorderedSubCard({ title, description, date }: { title: string; description?: string; date: string }) {
  return (
    <div
      style={{
        border: `1px solid ${BORDER_COLOR}`,
        borderRadius: 24,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            lineHeight: "21px",
            letterSpacing: -0.31,
            color: TEXT_PRIMARY,
          }}
        >
          {title}
        </div>
        {description && (
          <div
            style={{
              fontSize: 15,
              fontWeight: 400,
              lineHeight: "20px",
              letterSpacing: -0.23,
              color: TEXT_PRIMARY,
            }}
          >
            {description}
          </div>
        )}
      </div>
      <div
        style={{
          fontSize: 15,
          fontWeight: 600,
          lineHeight: "20px",
          letterSpacing: -0.23,
          color: TEXT_PRIMARY,
        }}
      >
        {date}
      </div>
    </div>
  );
}

function ElectionSubCard({ title, rows }: { title: string; rows: { label: string; value: string }[] }) {
  return (
    <div
      style={{
        border: `1px solid ${BORDER_COLOR}`,
        borderRadius: 24,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div
        style={{
          fontSize: 16,
          fontWeight: 600,
          lineHeight: "21px",
          letterSpacing: -0.31,
          color: TEXT_PRIMARY,
        }}
      >
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {rows.map((row, i) => (
          <div key={row.label} style={{ display: "flex", flexDirection: "column" }}>
            {i > 0 && <div style={{ height: 1, background: SEPARATOR }} />}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: 52,
              }}
            >
              <span
                style={{
                  fontSize: 17,
                  fontWeight: 400,
                  lineHeight: "22px",
                  letterSpacing: -0.43,
                  color: TEXT_PRIMARY,
                }}
              >
                {row.label}
              </span>
              <span
                style={{
                  fontSize: 17,
                  fontWeight: 600,
                  lineHeight: "22px",
                  letterSpacing: -0.43,
                  color: TEXT_SECONDARY,
                  textAlign: "right",
                }}
              >
                {row.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AppLpfsaDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const accountId = location.pathname.split("/").pop() ?? "lpfsa";
  const data = ACCOUNT_DATA[accountId] ?? ACCOUNT_DATA["lpfsa"];
  const [selectedTransaction, setSelectedTransaction] = React.useState<TransactionRow | null>(null);

  return (
    <div
      style={{
        minHeight: "auto",
        fontFamily: "var(--app-font)",
        paddingBottom: "calc(var(--app-tabbar-height, 95px) + env(safe-area-inset-bottom, 0px) + 64px)",
      }}
    >
      <AppTopSpacer variant="page" />
      <AppNavBar variant="sub-page" title={data.title} backTo="/app/account" />

      {/* Page Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          padding: "24px 16px 0",
        }}
      >
        {/* 1. Account Balance Card */}
        <div
          style={{
            background: "white",
            borderRadius: 24,
            boxShadow: CARD_SHADOW,
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: TINT_50,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <data.icon size={20} strokeWidth={1.75} style={{ color: TINT }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 600,
                  lineHeight: "22px",
                  letterSpacing: -0.43,
                  color: TEXT_PRIMARY,
                }}
              >
                Account Balance
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 400,
                  lineHeight: "16px",
                  color: TEXT_SECONDARY,
                }}
              >
                {data.balanceSubtitle}
              </div>
            </div>
          </div>

          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              lineHeight: "34px",
              letterSpacing: 0.38,
              color: TEXT_PRIMARY,
              paddingTop: 8,
            }}
          >
            {data.balance}
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {data.balanceRows.map((row, i) => (
              <InfoRow
                key={row.label}
                label={row.label}
                value={row.value}
                valueColor={row.valueColor}
                badge={row.badge}
                showSeparator={i > 0}
              />
            ))}
          </div>

          <div style={{ paddingTop: 8 }}>
            <button
              onClick={() => navigate("/app/reimburse")}
              style={{
                width: "100%",
                height: 50,
                borderRadius: 1000,
                background: TINT,
                border: "none",
                cursor: "pointer",
                fontSize: 17,
                fontWeight: 600,
                lineHeight: "22px",
                letterSpacing: -0.43,
                color: "white",
              }}
            >
              Reimburse Myself
            </button>
          </div>
        </div>

        {/* 2. My Plan Details Card */}
        <div
          style={{
            background: "white",
            borderRadius: 24,
            boxShadow: CARD_SHADOW,
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <SectionIcon />
              <span
                style={{
                  fontSize: 17,
                  fontWeight: 600,
                  lineHeight: "22px",
                  letterSpacing: -0.43,
                  color: TEXT_PRIMARY,
                }}
              >
                My Plan Details
              </span>
            </div>
            <ActiveBadge />
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <InfoRow label="Effective Date" value={data.effectiveDate} showSeparator={false} />
            <InfoRow label="Plan Duration" value={data.planDuration} />
          </div>

          <BorderedSubCard
            title="Final Service Date"
            description="Last date expenses can be incurred"
            date={data.finalServiceDate}
          />
          <BorderedSubCard
            title="Final Filing Date"
            description={data.finalFilingDescription}
            date={data.finalFilingDate}
          />
        </div>

        {/* 3. Plans Rules Card */}
        <div
          style={{
            background: "white",
            borderRadius: 24,
            boxShadow: CARD_SHADOW,
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <SectionIcon />
              <span
                style={{
                  fontSize: 17,
                  fontWeight: 600,
                  lineHeight: "22px",
                  letterSpacing: -0.43,
                  color: TEXT_PRIMARY,
                }}
              >
                Plans Rules
              </span>
            </div>
            <ActiveBadge />
          </div>

          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              lineHeight: "21px",
              letterSpacing: -0.31,
              color: TEXT_PRIMARY,
            }}
          >
            Filling Rules
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 400,
              lineHeight: "21px",
              letterSpacing: -0.31,
              color: TEXT_PRIMARY,
            }}
          >
            You must file claims before the final filling date with a service date no later than the final
            service date determined based on your current status.
          </div>

          <InfoRow label="Debit Card Transaction Allowed" value={data.debitCardAllowed} showSeparator={false} />
          <InfoRow label="Max per Transaction Amount" value={data.maxPerTransaction} />
        </div>

        {/* 4. Claims Summary */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              lineHeight: "24px",
              letterSpacing: -0.18,
              color: TEXT_PRIMARY,
            }}
          >
            Claims Summary
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            {data.claimsStats.map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: "white",
                  borderRadius: 24,
                  boxShadow: CARD_SHADOW,
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                }}
              >
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    lineHeight: "28px",
                    letterSpacing: -0.9,
                    color: TEXT_PRIMARY,
                    textAlign: "center",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 400,
                    lineHeight: "20px",
                    letterSpacing: -0.23,
                    color: TEXT_PRIMARY,
                    textAlign: "center",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Elections Card */}
        <div
          style={{
            background: "white",
            borderRadius: 24,
            boxShadow: CARD_SHADOW,
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <SectionIcon />
            <span
              style={{
                fontSize: 17,
                fontWeight: 600,
                lineHeight: "22px",
                letterSpacing: -0.43,
                color: TEXT_PRIMARY,
              }}
            >
              Elections
            </span>
          </div>

          <InfoRow
            label={data.electionAmountLabel ?? "Election Amount"}
            value={data.electionAmount}
            showSeparator={false}
          />

          <ElectionSubCard
            title="Contributions"
            rows={data.contributions}
          />
          <ElectionSubCard
            title="Status"
            rows={data.status}
          />
        </div>

        {/* 6. All Transactions */}
        <div
          style={{
            background: "white",
            borderRadius: 24,
            boxShadow: CARD_SHADOW,
            padding: "8px 16px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: 50,
              paddingBottom: 4,
            }}
          >
            <span
              style={{
                fontSize: 18,
                fontWeight: 600,
                lineHeight: "24px",
                letterSpacing: -0.18,
                color: TEXT_PRIMARY,
              }}
            >
              All Transactions
            </span>
            <button
              aria-label="Filter transactions"
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SlidersHorizontal size={20} strokeWidth={1.75} style={{ color: TINT }} />
            </button>
          </div>

          {data.transactions.map((tx, i) => (
            <div key={`${tx.date}-${tx.merchant}-${tx.amount}-${i}`}>
              <div style={{ height: 1, background: SEPARATOR }} />
              <div
                onClick={() => setSelectedTransaction(tx)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: 68,
                  gap: 12,
                  cursor: "pointer",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 17,
                      fontWeight: 600,
                      lineHeight: "22px",
                      letterSpacing: -0.43,
                      color: TEXT_PRIMARY,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {tx.merchant}
                  </div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 400,
                      lineHeight: "20px",
                      letterSpacing: -0.23,
                      color: TEXT_SECONDARY,
                    }}
                  >
                    {tx.date} &bull; {tx.account}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span
                    style={{
                      fontSize: 17,
                      fontWeight: 400,
                      lineHeight: "22px",
                      letterSpacing: -0.43,
                      color: TEXT_SECONDARY,
                      textAlign: "right",
                    }}
                  >
                    {tx.amount}
                  </span>
                  <ChevronRight size={14} strokeWidth={2.5} style={{ color: TEXT_SECONDARY }} />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      <TransactionDetailSheet
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
}

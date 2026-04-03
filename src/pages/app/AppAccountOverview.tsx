import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  CreditCard,
  ChevronRight,
  ChevronDown,
  SlidersHorizontal,
  Receipt,
  Send,
  User,
  Sparkles,
  Clock,
  X,
} from "lucide-react";

const CARD_SHADOW =
  "0px 3.017px 9.051px rgba(43,49,78,0.04), 0px 6.034px 18.101px rgba(43,49,78,0.06)";
const TEXT_PRIMARY = "#14182c";
const TEXT_SECONDARY = "#5f6a94";
const TINT = "#3958c3";
const TINT_50 = "#eef2ff";
const WARNING_BG = "#e6a800";
const WARNING_TEXT = "#4a3500";
const LINK_COLOR = "#1c6eff";
const SEPARATOR = "#e6e6e6";
const SUCCESS_SURFACE = "#ecfdf5";
const SUCCESS_TEXT = "#002c22";
const SHEET_BG = "rgba(255,255,255,0.96)";
const GRABBER_COLOR = "#ccc";

interface AccountCardData {
  id: string;
  name: string;
  subtitle: string;
  balanceLabel: string;
  balanceSubLabel?: string;
  balance: string;
  icon: "wallet" | "credit-card";
  warningTag?: string;
}

const ACCOUNTS: AccountCardData[] = [
  {
    id: "hsa",
    name: "Health Savings Account",
    subtitle: "HSA",
    balanceLabel: "Total Account Balance",
    balanceSubLabel: "Cash + Invested Assets",
    balance: "$15,900.00",
    icon: "wallet",
  },
  {
    id: "lpfsa",
    name: "Limited Purpose FSA",
    subtitle: "01/01/2026 - 12/31/2026",
    balanceLabel: "Available balance",
    balance: "$850.00",
    icon: "credit-card",
    warningTag: "28 Days left to spend",
  },
];

interface TransactionRow {
  merchant: string;
  date: string;
  account: string;
  amount: string;
  // Extended fields for detail sheet
  processedDate?: string;
  description?: string;
  planYear?: string;
  availableBalance?: string;
  runningBalance?: string;
  status?: "complete" | "pending" | "denied";
}

interface PreviousPlanYearAccount {
  name: string;
  dates: string;
  balance: string;
  // Detail fields
  availableBalance: string;
  effectiveDate: string;
  electionAmount: string;
  myAnnualElection: string;
  companyContributions: string;
  myContributionsToDate: string;
  estimatedPayrollDeductions: string;
  planYearBalance: string;
  // Claims fields
  claimsSubmitted: string;
  claimsPaid: string;
  claimsPending: string;
  claimsDenied: string;
}

const TRANSACTIONS: TransactionRow[] = [
  { 
    merchant: "Pharmacy", 
    date: "4/27/2026", 
    account: "LPFSA", 
    amount: "$42.50",
    processedDate: "04/27/2026",
    description: "Vision (New Frames)",
    planYear: "2026",
    availableBalance: "$785.00",
    runningBalance: "$742.50",
    status: "complete"
  },
  { 
    merchant: "Dr. Miller DDS", 
    date: "4/27/2026", 
    account: "LPFSA", 
    amount: "$340.00",
    processedDate: "04/27/2026",
    description: "Dental Care",
    planYear: "2026",
    availableBalance: "$445.00",
    runningBalance: "$402.50",
    status: "complete"
  },
  { 
    merchant: "Investment Buy", 
    date: "4/27/2026", 
    account: "HSA", 
    amount: "$500.00",
    processedDate: "04/27/2026",
    description: "Investment Transfer",
    planYear: "2026",
    availableBalance: "$15,400.00",
    runningBalance: "$14,900.00",
    status: "complete"
  },
  { 
    merchant: "Shell Gas Station", 
    date: "4/25/2026", 
    account: "HSA", 
    amount: "$54.12",
    processedDate: "04/25/2026",
    description: "Transportation",
    planYear: "2026",
    availableBalance: "$15,454.12",
    runningBalance: "$15,400.00",
    status: "complete"
  },
  { 
    merchant: "CVS Pharmacy", 
    date: "4/24/2026", 
    account: "LPFSA", 
    amount: "$28.10",
    processedDate: "04/24/2026",
    description: "Prescription Medicine",
    planYear: "2026",
    availableBalance: "$473.10",
    runningBalance: "$445.00",
    status: "complete"
  },
  { 
    merchant: "Target Store", 
    date: "4/20/2026", 
    account: "LPFSA", 
    amount: "$34.99",
    processedDate: "04/20/2026",
    description: "Health Products",
    planYear: "2026",
    availableBalance: "$508.09",
    runningBalance: "$473.10",
    status: "complete"
  },
  { 
    merchant: "Walgreens Pharmacy", 
    date: "4/18/2026", 
    account: "LPFSA", 
    amount: "$19.50",
    processedDate: "04/18/2026",
    description: "Prescription Medicine",
    planYear: "2026",
    availableBalance: "$527.59",
    runningBalance: "$508.09",
    status: "complete"
  },
  { 
    merchant: "Quest Diagnostics", 
    date: "3/22/2026", 
    account: "HSA", 
    amount: "$95.10",
    processedDate: "03/22/2026",
    description: "Lab Tests",
    planYear: "2026",
    availableBalance: "$15,549.22",
    runningBalance: "$15,454.12",
    status: "complete"
  },
  { 
    merchant: "Dr. Smith Family Med", 
    date: "3/18/2026", 
    account: "HSA", 
    amount: "$30.00",
    processedDate: "03/18/2026",
    description: "Primary Care Visit",
    planYear: "2026",
    availableBalance: "$15,579.22",
    runningBalance: "$15,549.22",
    status: "complete"
  },
  { 
    merchant: "Orthodontic Care", 
    date: "3/15/2026", 
    account: "LPFSA", 
    amount: "$150.50",
    processedDate: "03/15/2026",
    description: "Dental Orthodontics",
    planYear: "2026",
    availableBalance: "$678.09",
    runningBalance: "$527.59",
    status: "complete"
  },
];

const PREVIOUS_YEAR_ACCOUNTS: PreviousPlanYearAccount[] = [
  {
    name: "Limited Purpose FSA",
    dates: "01/01/2024 - 12/31/2024",
    balance: "$660.00",
    // Detail fields
    availableBalance: "$2,000.00",
    effectiveDate: "01/01/2024",
    electionAmount: "$1,200.00",
    myAnnualElection: "$1,200.00",
    companyContributions: "$100.00 of 100.00",
    myContributionsToDate: "$1,200.00",
    estimatedPayrollDeductions: "$23.08",
    planYearBalance: "$1,300.00",
    // Claims fields
    claimsSubmitted: "$252.00",
    claimsPaid: "$0.00",
    claimsPending: "$0.00",
    claimsDenied: "$252.00",
  },
];

export default function AppAccountOverview() {
  const navigate = useNavigate();
  const [showAllTx, setShowAllTx] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionRow | null>(null);
  const [selectedPlanYear, setSelectedPlanYear] = useState<PreviousPlanYearAccount | null>(null);
  const visibleTx = showAllTx ? TRANSACTIONS : TRANSACTIONS.slice(0, 10);

  return (
    <div
      style={{
        minHeight: "auto",
        fontFamily: "var(--app-font)",
        background: "linear-gradient(189.07deg, #eef2ff 50%, #a5b4fc 140%)",
        paddingBottom:
          "calc(var(--app-tabbar-height, 95px) + env(safe-area-inset-bottom, 0px) + 64px)",
      }}
    >
      {/* Large-title header */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          paddingTop: "env(safe-area-inset-top, 0px)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 16px 10px",
          }}
        >
          <div
            style={{
              fontSize: 34,
              fontWeight: 700,
              lineHeight: "41px",
              letterSpacing: 0.4,
              color: TEXT_PRIMARY,
            }}
          >
            Accounts
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              aria-label="Profile"
              onClick={() => navigate("/app/my-account")}
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.65)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
                flexShrink: 0,
              }}
            >
              <User size={19} strokeWidth={2} style={{ color: TEXT_PRIMARY }} />
            </button>
            <button
              aria-label="Assist IQ"
              onClick={() => navigate("/app/assist-iq")}
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "linear-gradient(133.5deg, #25146F 2.46%, #C8102E 100%)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 16px rgba(37,20,111,0.35)",
                flexShrink: 0,
              }}
            >
              <Sparkles size={20} strokeWidth={1.75} style={{ color: "#fff" }} />
            </button>
          </div>
        </div>
      </div>

      {/* Page content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          padding: "8px 16px 0",
        }}
      >
        {/* Account cards */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            width: "100%",
          }}
        >
          {ACCOUNTS.map((acct) => (
            <div
              key={acct.id}
              onClick={() => navigate(`/app/account/${acct.id}`)}
              style={{
                background: "white",
                borderRadius: 24,
                boxShadow: CARD_SHADOW,
                overflow: "hidden",
                cursor: "pointer",
                fontFamily: "var(--app-font)",
              }}
            >
              {/* Icon + Name header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "16px 16px 0",
                }}
              >
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
                  {acct.icon === "wallet" ? (
                    <Wallet size={20} strokeWidth={1.75} style={{ color: TINT }} />
                  ) : (
                    <CreditCard size={20} strokeWidth={1.75} style={{ color: TINT }} />
                  )}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 17,
                      fontWeight: 600,
                      lineHeight: "22px",
                      letterSpacing: -0.43,
                      color: TEXT_PRIMARY,
                    }}
                  >
                    {acct.name}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 400,
                      lineHeight: "16px",
                      color: TEXT_SECONDARY,
                    }}
                  >
                    {acct.subtitle}
                  </div>
                </div>
              </div>

              {/* Balance section */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  padding: "8px 16px 16px",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div>
                    <div
                      style={{
                        fontSize: 17,
                        fontWeight: 400,
                        lineHeight: "22px",
                        letterSpacing: -0.43,
                        color: TEXT_SECONDARY,
                      }}
                    >
                      {acct.balanceLabel}
                    </div>
                    {acct.balanceSubLabel && (
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 400,
                          lineHeight: "16px",
                          color: TEXT_SECONDARY,
                        }}
                      >
                        {acct.balanceSubLabel}
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      lineHeight: "28px",
                      letterSpacing: -0.9,
                      color: TEXT_PRIMARY,
                    }}
                  >
                    {acct.balance}
                  </div>
                  {acct.warningTag && (
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        background: WARNING_BG,
                        borderRadius: 6,
                        padding: "2px 8px 2px 4px",
                        marginTop: 2,
                        width: "fit-content",
                      }}
                    >
                      <Clock size={12} strokeWidth={2} style={{ color: WARNING_TEXT }} />
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 400,
                          lineHeight: "16px",
                          color: WARNING_TEXT,
                        }}
                      >
                        {acct.warningTag}
                      </span>
                    </div>
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: 68,
                    color: TEXT_SECONDARY,
                  }}
                >
                  <ChevronRight size={18} strokeWidth={2.5} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            width: "100%",
          }}
        >
          {[
            { label: "Reimburse Myself", icon: Receipt },
            { label: "Send a Payment", icon: Send },
          ].map(({ label, icon: Icon }) => (
            <div
              key={label}
              style={{
                background: "white",
                borderRadius: 24,
                boxShadow: CARD_SHADOW,
                padding: 16,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                cursor: "pointer",
                fontFamily: "var(--app-font)",
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: TINT_50,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={25} strokeWidth={1.75} style={{ color: TINT }} />
              </div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  lineHeight: "20px",
                  letterSpacing: -0.23,
                  color: TEXT_PRIMARY,
                  textAlign: "center",
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* All Transactions */}
        <div
          style={{
            background: "white",
            borderRadius: 24,
            padding: 16,
            width: "100%",
            fontFamily: "var(--app-font)",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 0",
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
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "white",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SlidersHorizontal size={20} strokeWidth={1.75} style={{ color: TEXT_PRIMARY }} />
            </button>
          </div>

          {/* Transaction rows */}
          {visibleTx.map((tx, i) => (
            <div
              key={`${tx.merchant}-${tx.date}-${i}`}
              onClick={() => setSelectedTransaction(tx)}
              style={{
                display: "flex",
                alignItems: "center",
                height: 68,
                position: "relative",
                cursor: "pointer",
              }}
            >
              {/* Separator */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 1,
                  borderTop: `1px solid ${SEPARATOR}`,
                }}
              />
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  minWidth: 0,
                }}
              >
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
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tx.date} &bull; {tx.account}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  flexShrink: 0,
                }}
              >
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
          ))}

          {/* View More */}
          {!showAllTx && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: 52,
                position: "relative",
                cursor: "pointer",
              }}
              onClick={() => setShowAllTx(true)}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 1,
                  borderTop: `1px solid ${SEPARATOR}`,
                }}
              />
              <span
                style={{
                  fontSize: 17,
                  fontWeight: 400,
                  lineHeight: "22px",
                  letterSpacing: -0.43,
                  color: LINK_COLOR,
                  textAlign: "center",
                }}
              >
                View More
              </span>
            </div>
          )}
        </div>

        {/* Previous Plan Year */}
        <div
          style={{
            background: "white",
            borderRadius: 24,
            padding: 16,
            width: "100%",
            fontFamily: "var(--app-font)",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              height: 50,
              paddingBottom: 16,
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
              Previous Plan Year
            </span>
          </div>

          {/* Select Plan Year picker row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "2px 0 10px",
            }}
          >
            <span
              style={{
                fontSize: 17,
                fontWeight: 400,
                lineHeight: "22px",
                letterSpacing: -0.43,
                color: TEXT_SECONDARY,
              }}
            >
              Select Plan Year
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
                01/01/2024
              </span>
              <ChevronDown size={16} strokeWidth={2.5} style={{ color: TEXT_SECONDARY }} />
            </div>
          </div>

          {/* Previous year account rows */}
          {PREVIOUS_YEAR_ACCOUNTS.map((acct) => (
            <div
              key={acct.name}
              onClick={() => setSelectedPlanYear(acct)}
              style={{
                display: "flex",
                alignItems: "center",
                height: 68,
                position: "relative",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 1,
                  borderTop: `1px solid ${SEPARATOR}`,
                }}
              />
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  minWidth: 0,
                }}
              >
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
                  {acct.name}
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
                  {acct.dates}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  flexShrink: 0,
                }}
              >
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
                  {acct.balance}
                </span>
                <ChevronRight size={14} strokeWidth={2.5} style={{ color: TEXT_SECONDARY }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction Detail Sheet */}
      <TransactionDetailSheet
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />

      {/* Plan Detail Sheet */}
      <PlanDetailSheet
        planYear={selectedPlanYear}
        onClose={() => setSelectedPlanYear(null)}
      />
    </div>
  );
}

function TransactionDetailSheet({
  transaction,
  onClose,
}: {
  transaction: TransactionRow | null;
  onClose: () => void;
}) {
  if (!transaction) return null;

  const statusBadge = transaction.status === "complete" ? "Complete" : transaction.status === "pending" ? "Pending" : "Denied";
  const statusBg = transaction.status === "complete" ? SUCCESS_SURFACE : "#fff9e6";
  const statusColor = transaction.status === "complete" ? SUCCESS_TEXT : WARNING_TEXT;

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          zIndex: 9999,
        }}
      />
      <motion.div
        key="sheet"
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
          background: SHEET_BG,
          backdropFilter: "blur(40px) saturate(200%)",
          WebkitBackdropFilter: "blur(40px) saturate(200%)",
          borderRadius: "38px 38px 0 0",
          boxShadow: "0px 15px 75px 0px rgba(0,0,0,0.18)",
          maxHeight: "80vh",
          overflowY: "auto",
          paddingBottom: "calc(16px + env(safe-area-inset-bottom, 0px))",
        }}
      >
        {/* Grabber */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: 5,
            paddingBottom: 5,
          }}
        >
          <div
            style={{
              width: 36,
              height: 5,
              borderRadius: 100,
              background: GRABBER_COLOR,
            }}
          />
        </div>

        {/* Toolbar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px 10px",
            position: "relative",
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
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
              flexShrink: 0,
            }}
          >
            <X size={20} strokeWidth={2} style={{ color: TEXT_SECONDARY }} />
          </button>

          {/* Centered Title and Subtitle */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                lineHeight: "20px",
                letterSpacing: -0.23,
                color: TEXT_PRIMARY,
                whiteSpace: "nowrap",
              }}
            >
              {transaction.merchant}
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 500,
                lineHeight: "16px",
                color: TEXT_SECONDARY,
                whiteSpace: "nowrap",
              }}
            >
              {transaction.date}
            </div>
          </div>

          {/* Spacer for balance */}
          <div style={{ width: 44 }} />
        </div>

        {/* Content */}
        <div
          style={{
            padding: "0 16px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          {/* Transaction Amount Card */}
          <div
            style={{
              background: "white",
              borderRadius: 24,
              boxShadow: CARD_SHADOW,
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  fontSize: 17,
                  fontWeight: 400,
                  lineHeight: "22px",
                  letterSpacing: -0.43,
                  color: TEXT_SECONDARY,
                }}
              >
                Transaction Amount
              </span>
              <div
                style={{
                  background: statusBg,
                  borderRadius: 6,
                  padding: "4px 12px",
                  fontSize: 12,
                  fontWeight: 500,
                  lineHeight: "16px",
                  color: statusColor,
                }}
              >
                {statusBadge}
              </div>
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                lineHeight: "34px",
                letterSpacing: 0.38,
                color: TEXT_PRIMARY,
              }}
            >
              {transaction.amount}
            </div>
          </div>

          {/* Detail Rows */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {transaction.processedDate && (
              <DetailRow label="Transaction Date" value={transaction.processedDate} showSeparator={false} />
            )}
            {transaction.processedDate && (
              <DetailRow label="Processed Date" value={transaction.processedDate} />
            )}
            {transaction.description && (
              <DetailRow label="Description" value={transaction.description} />
            )}
            {transaction.planYear && (
              <DetailRow label="Plan Year" value={transaction.planYear} />
            )}
            {transaction.availableBalance && (
              <DetailRow label="Available Balance" value={transaction.availableBalance} />
            )}
            {transaction.runningBalance && (
              <DetailRow label="Running Balance" value={transaction.runningBalance} />
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function DetailRow({ 
  label, 
  value, 
  showSeparator = true 
}: { 
  label: string; 
  value: string; 
  showSeparator?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {showSeparator && (
        <div
          style={{
            height: 1,
            background: SEPARATOR,
          }}
        />
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 0",
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
          {label}
        </span>
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
          {value}
        </span>
      </div>
    </div>
  );
}

function PlanDetailSheet({
  planYear,
  onClose,
}: {
  planYear: PreviousPlanYearAccount | null;
  onClose: () => void;
}) {
  if (!planYear) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          zIndex: 9999,
        }}
      />
      <motion.div
        key="sheet"
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
          background: SHEET_BG,
          backdropFilter: "blur(40px) saturate(200%)",
          WebkitBackdropFilter: "blur(40px) saturate(200%)",
          borderRadius: "38px 38px 0 0",
          boxShadow: "0px 15px 75px 0px rgba(0,0,0,0.18)",
          maxHeight: "56vh",
          overflowY: "auto",
          paddingBottom: "calc(16px + env(safe-area-inset-bottom, 0px))",
        }}
      >
        {/* Grabber */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: 5,
            paddingBottom: 5,
          }}
        >
          <div
            style={{
              width: 36,
              height: 5,
              borderRadius: 100,
              background: GRABBER_COLOR,
            }}
          />
        </div>

        {/* Toolbar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px 10px",
            position: "relative",
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
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
              flexShrink: 0,
            }}
          >
            <X size={20} strokeWidth={2} style={{ color: TEXT_SECONDARY }} />
          </button>

          {/* Centered Title and Subtitle */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                lineHeight: "20px",
                letterSpacing: -0.23,
                color: TEXT_PRIMARY,
                whiteSpace: "nowrap",
              }}
            >
              {planYear.name}
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 500,
                lineHeight: "16px",
                color: TEXT_SECONDARY,
                whiteSpace: "nowrap",
              }}
            >
              {planYear.dates}
            </div>
          </div>

          {/* Spacer for balance */}
          <div style={{ width: 44 }} />
        </div>

        {/* Content */}
        <div
          style={{
            padding: "0 16px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          {/* Details Section */}
          <div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 600,
                lineHeight: "24px",
                letterSpacing: -0.18,
                color: TEXT_PRIMARY,
                marginBottom: 16,
              }}
            >
              Details
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <DetailRow label="Available Balance" value={planYear.availableBalance} showSeparator={false} />
              <DetailRow label="Effective Date" value={planYear.effectiveDate} />
              <DetailRow label="Election Amount" value={planYear.electionAmount} />
              <DetailRow label="My Annual Election" value={planYear.myAnnualElection} />
              <DetailRow label="Company Contributions" value={planYear.companyContributions} />
              <DetailRow label="My Contributions to Date" value={planYear.myContributionsToDate} />
              <DetailRow label="Estimated Payroll Deductions" value={planYear.estimatedPayrollDeductions} />
              <DetailRow label="Plan Year Balance" value={planYear.planYearBalance} />
            </div>
          </div>

          {/* Claims Section */}
          <div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 600,
                lineHeight: "24px",
                letterSpacing: -0.18,
                color: TEXT_PRIMARY,
                marginBottom: 16,
              }}
            >
              Claims
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <DetailRow label="Submitted" value={planYear.claimsSubmitted} showSeparator={false} />
              <DetailRow label="Paid" value={planYear.claimsPaid} />
              <DetailRow label="Pending" value={planYear.claimsPending} />
              <DetailRow label="Denied" value={planYear.claimsDenied} />
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

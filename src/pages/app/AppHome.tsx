import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Wallet,
  CreditCard,
  HeartPulse,
  Baby,
  RefreshCw,
  Lock,
  Clock,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { AppNavBar } from "@/components/app-shell/AppNavBar";
import { AppTopSpacer } from "@/components/app-shell/AppTopSpacer";
import { TaskCardStack } from "@/components/app-shell/TaskCardStack";
import { useDeviceMockup } from "@/hooks/useDeviceMockup";
import { FsaStoreBrowser } from "@/components/app-shell/FsaStoreBrowser";
import { useReimburseWorkspace } from "@/context/ReimburseWorkspaceContext";
import { useAppVariant, type AppVariant } from "@/context/AppVariantContext";
import { TransactionDetailSheet, type TransactionRow as TransactionData } from "./AppAccountOverview";

const FSA_STORE_LOGO = `${import.meta.env.BASE_URL}app-ui/fsastore-logo.svg`;
const FSA_STORE_IMAGE = `${import.meta.env.BASE_URL}app-ui/fsa-store-image.svg`;

const CARD_SHADOW =
  "0px 3px 9px rgba(43,49,78,0.04), 0px 6px 18px rgba(43,49,78,0.06)";

const TEXT_PRIMARY = "var(--app-text)";
const TEXT_SECONDARY = "var(--app-text-secondary)";
const TINT = "var(--app-primary)";
const TINT_50 = "var(--app-primary-50)";

/* ── Variant-specific account card data ─────────────────────────────── */

interface HomeAccountCard {
  id: string;
  name: string;
  tag: string;
  balanceLabel?: string;
  balance: string;
  icon: typeof Wallet;
  warningTag?: string;
  route: string;
}

const HOME_ACCOUNTS: Record<AppVariant, HomeAccountCard[]> = {
  1: [
    { id: "hsa", name: "Health Savings Account", tag: "HSA", balanceLabel: "Cash + Invested Assets", balance: "$15,900.00", icon: Wallet, route: "/app/account/hsa" },
    { id: "lpfsa", name: "Limited Purpose FSA", tag: "01/01/2026 – 12/31/2026", balance: "$850.00", icon: CreditCard, warningTag: "28 Days left to spend", route: "/app/account/lpfsa" },
  ],
  2: [
    { id: "fsa", name: "Healthcare FSA", tag: "01/01/2026 – 12/31/2026", balance: "$850.00", icon: HeartPulse, warningTag: "28 Days left to spend", route: "/app/account/fsa" },
    { id: "dcfsa", name: "DCFSA", tag: "01/01/2025 – 12/31/2025", balance: "$620.00", icon: Baby, warningTag: "28 Days left to spend", route: "/app/account/dcfsa" },
  ],
  3: [
    { id: "hsa", name: "Health Savings Account", tag: "HSA", balanceLabel: "Cash + Invested Assets", balance: "$15,900.00", icon: Wallet, route: "/app/account/hsa" },
  ],
};

interface HomeTxRow {
  id: string;
  title: string;
  subtitle: string;
  amount: string;
  txData: TransactionData;
}

const HOME_TRANSACTIONS: Record<AppVariant, HomeTxRow[]> = {
  1: [
    { id: "c1", title: "Pharmacy", subtitle: "4/27/2026 · LPFSA", amount: "$42.50", txData: { merchant: "Pharmacy", date: "4/27/2026", account: "LPFSA", amount: "$42.50", processedDate: "04/27/2026", description: "Vision (New Frames)", planYear: "2026", availableBalance: "$785.00", runningBalance: "$742.50", status: "complete" } },
    { id: "c3", title: "Bigtown Dentistry", subtitle: "4/27/2026 · LPFSA", amount: "$210.00", txData: { merchant: "Bigtown Dentistry", date: "4/27/2026", account: "LPFSA", amount: "$210.00", processedDate: "04/27/2026", description: "Dental Care", planYear: "2026", availableBalance: "$445.00", runningBalance: "$402.50", status: "complete" } },
    { id: "c2", title: "Investment Buy", subtitle: "4/27/2026 · HSA", amount: "$500.00", txData: { merchant: "Investment Buy", date: "4/27/2026", account: "HSA", amount: "$500.00", processedDate: "04/27/2026", description: "Investment Transfer", planYear: "2026", availableBalance: "$15,400.00", runningBalance: "$14,900.00", status: "complete" } },
  ],
  2: [
    { id: "c1", title: "Pharmacy", subtitle: "4/27/2026 · FSA", amount: "$42.50", txData: { merchant: "Pharmacy", date: "4/27/2026", account: "FSA", amount: "$42.50", processedDate: "04/27/2026", description: "Prescription Medicine", planYear: "2026", availableBalance: "$807.50", runningBalance: "$765.00", status: "complete" } },
    { id: "c3", title: "Bright Horizons Daycare", subtitle: "4/27/2026 · DCFSA", amount: "$185.00", txData: { merchant: "Bright Horizons Daycare", date: "4/27/2026", account: "DCFSA", amount: "$185.00", processedDate: "04/27/2026", description: "Childcare", planYear: "2025", availableBalance: "$620.00", runningBalance: "$435.00", status: "complete" } },
    { id: "c2", title: "CVS Pharmacy", subtitle: "4/25/2026 · FSA", amount: "$28.10", txData: { merchant: "CVS Pharmacy", date: "4/25/2026", account: "FSA", amount: "$28.10", processedDate: "04/25/2026", description: "OTC Medicine", planYear: "2026", availableBalance: "$878.10", runningBalance: "$850.00", status: "complete" } },
  ],
  3: [
    { id: "c1", title: "Investment Buy", subtitle: "4/27/2026 · HSA", amount: "$500.00", txData: { merchant: "Investment Buy", date: "4/27/2026", account: "HSA", amount: "$500.00", processedDate: "04/27/2026", description: "Investment Transfer", planYear: "2026", availableBalance: "$15,400.00", runningBalance: "$14,900.00", status: "complete" } },
    { id: "c2", title: "Shell Gas Station", subtitle: "4/25/2026 · HSA", amount: "$54.12", txData: { merchant: "Shell Gas Station", date: "4/25/2026", account: "HSA", amount: "$54.12", processedDate: "04/25/2026", description: "Transportation", planYear: "2026", availableBalance: "$15,454.12", runningBalance: "$15,400.00", status: "complete" } },
    { id: "c3", title: "Quest Diagnostics", subtitle: "3/22/2026 · HSA", amount: "$95.10", txData: { merchant: "Quest Diagnostics", date: "3/22/2026", account: "HSA", amount: "$95.10", processedDate: "03/22/2026", description: "Lab Tests", planYear: "2026", availableBalance: "$15,549.22", runningBalance: "$15,454.12", status: "complete" } },
  ],
};

interface SectionHeaderProps {
  title: string;
  onMore?: () => void;
}

function SectionHeader({ title, onMore }: SectionHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        height: 50,
        paddingBottom: 16,
        fontFamily: "var(--app-font)",
      }}
    >
      <span
        style={{
          fontSize: 18,
          fontWeight: 600,
          color: TEXT_PRIMARY,
          letterSpacing: -0.18,
          lineHeight: "24px",
        }}
      >
        {title}
      </span>
      {onMore && (
        <button
          onClick={onMore}
          aria-label={`See all ${title}`}
          style={{
            width: 44,
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: TINT,
            marginBottom: -12,
          }}
        >
          <ArrowRight size={20} strokeWidth={2.25} />
        </button>
      )}
    </div>
  );
}

interface TransactionRowProps {
  title: string;
  subtitle: string;
  amount: string;
  onClick?: () => void;
}

function TransactionRow({ title, subtitle, amount, onClick }: TransactionRowProps) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        height: 68,
        cursor: onClick ? "pointer" : undefined,
        fontFamily: "var(--app-font)",
        position: "relative",
      }}
    >
      {/* Clock icon */}
      <div
        style={{
          paddingRight: 8,
          display: "flex",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Clock
          size={18}
          strokeWidth={1.75}
          style={{ color: TINT, flexShrink: 0 }}
        />
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          minWidth: 0,
        }}
      >
        {/* Top separator */}
        <div
          style={{
            height: 1,
            background: "var(--app-separator)",
            flexShrink: 0,
          }}
        />

        {/* Row content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingBottom: 1,
          }}
        >
          {/* Title + subtitle */}
          <div
            style={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              height: 60,
            }}
          >
            <div
              style={{
                fontSize: 17,
                fontWeight: 600,
                color: "var(--app-text)",
                letterSpacing: -0.43,
                lineHeight: "22px",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 400,
                color: TEXT_SECONDARY,
                letterSpacing: -0.23,
                lineHeight: "20px",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {subtitle}
            </div>
          </div>

          {/* Amount + chevron */}
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
                color: TEXT_SECONDARY,
                letterSpacing: -0.43,
                lineHeight: "22px",
                textAlign: "right",
              }}
            >
              {amount}
            </span>
            <ChevronRight
              size={17}
              strokeWidth={2.5}
              style={{ color: TEXT_SECONDARY }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AppHome() {
  const navigate = useNavigate();
  const { deviceOn } = useDeviceMockup();
  const [showFsaStore, setShowFsaStore] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionData | null>(null);
  const { openReimburseWorkspace } = useReimburseWorkspace();
  const { variant } = useAppVariant();
  const accounts = HOME_ACCOUNTS[variant];
  const transactions = HOME_TRANSACTIONS[variant];

  /** Device frame: tab bar is fixed over the scroll area — clear it. Mobile web: shell already reserves tab bar + safe area; add a small inner gap. */
  const contentPaddingBottom = deviceOn
    ? "calc(28px + var(--app-tabbar-height) + env(safe-area-inset-bottom, 0px))"
    : 56;

  return (
    <div
      style={{
        minHeight: "auto",
        fontFamily: "var(--app-font)",
        paddingBottom:
          "calc(var(--app-tabbar-height, 95px) + env(safe-area-inset-bottom, 0px))",
      }}
    >
      <AppTopSpacer variant="home" />
      <AppNavBar variant="main" />

      {/* Scrollable content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          paddingTop: 24,
          paddingBottom: contentPaddingBottom,
        }}
      >
        {/* ── Missing document (debit card / Bigtown Dentistry) ── */}
        <TaskCardStack />

        {/* ── Your Accounts ── */}
        <div style={{ padding: "0 16px" }}>
          <SectionHeader
            title="Your Accounts"
            onMore={() => navigate("/app/account")}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {accounts.map((acct) => {
              const Icon = acct.icon;
              return (
                <div
                  key={acct.id}
                  onClick={() => navigate(acct.route)}
                  style={{
                    background: "#fff",
                    borderRadius: 24,
                    overflow: "hidden",
                    boxShadow: CARD_SHADOW,
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 16px 0",
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 9999,
                        background: TINT_50,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={20} strokeWidth={1.75} style={{ color: TINT }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 17, fontWeight: 600, color: TEXT_PRIMARY, letterSpacing: -0.43, lineHeight: "22px" }}>
                        {acct.name}
                      </div>
                      <div style={{ fontSize: 12, color: TEXT_SECONDARY, lineHeight: "16px" }}>
                        {acct.tag}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      padding: "8px 16px 16px",
                      gap: 16,
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1, minWidth: 0 }}>
                      {acct.balanceLabel && (
                        <div style={{ fontSize: 12, color: TEXT_SECONDARY, lineHeight: "16px" }}>
                          {acct.balanceLabel}
                        </div>
                      )}
                      <div style={{ fontSize: 34, fontWeight: 700, color: TEXT_PRIMARY, letterSpacing: 0.4, lineHeight: "41px" }}>
                        {acct.balance}
                      </div>
                      {acct.warningTag && (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                              background: "var(--app-warning)",
                              borderRadius: 6,
                              padding: "2px 8px 2px 4px",
                            }}
                          >
                            <Clock size={12} strokeWidth={2} style={{ color: "#4a3500" }} />
                            <span style={{ fontSize: 12, fontWeight: 500, color: "#4a3500", lineHeight: "16px", whiteSpace: "nowrap" }}>
                              {acct.warningTag}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div style={{ height: 68, display: "flex", alignItems: "center", justifyContent: "flex-end", flexShrink: 0 }}>
                      <ChevronRight size={17} strokeWidth={2.5} style={{ color: TEXT_SECONDARY }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div style={{ padding: "0 16px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            {/* Reimburse Myself */}
            <button
              onClick={() => openReimburseWorkspace()}
              style={{
                background: "#fff",
                borderRadius: 24,
                boxShadow: CARD_SHADOW,
                border: "none",
                cursor: "pointer",
                padding: 16,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                fontFamily: "var(--app-font)",
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 9999,
                  background: TINT_50,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <RefreshCw size={26} strokeWidth={1.75} style={{ color: TINT }} />
              </div>
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: TEXT_PRIMARY,
                  letterSpacing: -0.23,
                  lineHeight: "20px",
                  textAlign: "center",
                }}
              >
                Reimburse Myself
              </span>
            </button>

            {/* Lost or stolen card */}
            <button
              style={{
                background: "#fff",
                borderRadius: 24,
                boxShadow: CARD_SHADOW,
                border: "none",
                cursor: "pointer",
                padding: 16,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                fontFamily: "var(--app-font)",
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 9999,
                  background: TINT_50,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Lock size={24} strokeWidth={1.75} style={{ color: TINT }} />
              </div>
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: TEXT_PRIMARY,
                  letterSpacing: -0.23,
                  lineHeight: "20px",
                  textAlign: "center",
                }}
              >
                Lost or stolen card
              </span>
            </button>
          </div>
        </div>

        {/* ── FSA Store promo card ── */}
        <div style={{ padding: "0 16px" }}>
          <div
            onClick={() => setShowFsaStore(true)}
            style={{
              background: "#fff",
              borderRadius: 24,
              boxShadow: CARD_SHADOW,
              padding: 16,
              display: "flex",
              alignItems: "center",
              gap: 13,
              overflow: "hidden",
              minHeight: 196,
              cursor: "pointer",
            }}
          >
            {/* Left: text content */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 10,
                minWidth: 0,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {/* FSAstore logo */}
                <div style={{ height: 22, width: 106 }}>
                  <img
                    src={FSA_STORE_LOGO}
                    alt="FSAstore®"
                    style={{ height: "100%", width: "auto", objectFit: "contain", display: "block" }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                      const next = e.currentTarget.nextElementSibling as HTMLElement;
                      if (next) next.style.display = "block";
                    }}
                  />
                  <span
                    style={{
                      display: "none",
                      fontSize: 14,
                      fontWeight: 700,
                      color: TINT,
                      letterSpacing: -0.2,
                    }}
                  >
                    FSAstore®
                  </span>
                </div>

                <div
                  style={{
                    fontSize: 17,
                    fontWeight: 600,
                    color: TEXT_PRIMARY,
                    letterSpacing: -0.43,
                    lineHeight: "22px",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {"Shop eligible items\nwith your FSA"}
                </div>
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
                Explore 100% FSA-eligible products from 500+ top brands.
              </div>
            </div>

            {/* Right: illustration */}
            <div
              style={{
                width: 144,
                height: 128,
                flexShrink: 0,
                position: "relative",
              }}
            >
              <img
                src={FSA_STORE_IMAGE}
                alt=""
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: "-20px -24px",
                  width: "calc(100% + 48px)",
                  height: "calc(100% + 40px)",
                  objectFit: "contain",
                }}
              />
            </div>
          </div>
        </div>

        {/* ── Recent Transactions ── */}
        <div style={{ padding: "0 16px" }}>
          <SectionHeader
            title="Recent Transactions"
            onMore={() => navigate("/app/account")}
          />

          <div
            style={{
              background: "#fff",
              borderRadius: 24,
              padding: "0 16px 0",
              boxShadow: CARD_SHADOW,
            }}
          >
            {transactions.map((tx) => (
              <TransactionRow
                key={tx.id}
                title={tx.title}
                subtitle={tx.subtitle}
                amount={tx.amount}
                onClick={() => setSelectedTransaction(tx.txData)}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {showFsaStore && (
        <div style={{ position: "fixed", inset: 0, zIndex: 60 }}>
          <FsaStoreBrowser onClose={() => setShowFsaStore(false)} />
        </div>
      )}

      {/* Transaction Detail Sheet */}
      <TransactionDetailSheet
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Wallet,
  CreditCard,
  RefreshCw,
  Lock,
  Clock,
  ChevronRight,
} from "lucide-react";
import { AppNavBar } from "@/components/app-shell/AppNavBar";
import { AppTopSpacer } from "@/components/app-shell/AppTopSpacer";
import { useDeviceMockup } from "@/hooks/useDeviceMockup";

// Figma asset URLs (valid for 7 days from design export)
const FSA_STORE_LOGO =
  "https://www.figma.com/api/mcp/asset/8abcb600-66e0-4370-a379-d031216d1324";
const ILLUSTRATION_BG = "/FSA-Store.svg";
const ILLUSTRATION_CHAR =
  "https://www.figma.com/api/mcp/asset/bf87285a-d9ef-4ebe-b7de-95e14ef41e1e";
const ILLUSTRATION_SCREEN =
  "https://www.figma.com/api/mcp/asset/450c126d-77a0-4cd0-ace9-e8ac61142593";

const CARD_SHADOW =
  "0px 3px 9px rgba(43,49,78,0.04), 0px 6px 18px rgba(43,49,78,0.06)";

const TEXT_PRIMARY = "#14182c";
const TEXT_SECONDARY = "#5f6a94";
const TINT = "hsl(208 100% 38%)";
const TINT_50 = "#eef2ff";

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
            background: "#e6e6e6",
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
                color: "#000",
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
              size={14}
              strokeWidth={2.5}
              style={{ color: TEXT_SECONDARY, width: 8 }}
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

  /** Device frame: tab bar is fixed over the scroll area — clear it. Mobile web: shell already reserves tab bar + safe area; add a small inner gap. */
  const contentPaddingBottom = deviceOn
    ? "calc(28px + var(--app-tabbar-height) + env(safe-area-inset-bottom, 0px))"
    : 56;

  return (
    <div
      style={{
        minHeight: "auto",
        background: "linear-gradient(189.07deg, #eef2ff 50%, #a5b4fc 140%)",
        fontFamily: "var(--app-font)",
        paddingBottom:
          "calc(var(--app-tabbar-height, 95px) + env(safe-area-inset-bottom, 0px))",
      }}
    >
      <AppTopSpacer variant="home" />
      <AppNavBar variant="main" />

      {/* Scrollable content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          paddingTop: 24,
          paddingBottom: contentPaddingBottom,
          background: TINT_50,
        }}
      >
        {/* ── Missing document (debit card / Bigtown Dentistry) ── */}
        <div style={{ padding: "0 16px" }}>
          <div
            style={{
              background: "#fff",
              borderRadius: 32,
              padding: 16,
              boxShadow: CARD_SHADOW,
              display: "flex",
              flexDirection: "column",
              gap: 16,
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
                Missing Document Required
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
                Upload your document to complete this claim for Bigtown Dentistry.
              </div>
            </div>

            {/* Claim row */}
            <div
              style={{
                background: "#f8f9fe",
                border: "1px solid #f8f9fe",
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
                    border: "1px solid #e3e7f4",
                    boxShadow: "0px 1px 2px rgba(0,0,0,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {/* Tooth / dental icon */}
                  <svg
                    width="18"
                    height="19"
                    viewBox="0 0 18 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M9 2C6.8 2 5 3.8 5 6c0 .8.2 1.5.6 2.1-.4 2.6-.8 5.2-1.2 6.8-.1.5.2 1.1.8 1.1.4 0 .8-.3.9-.7L7 12h4l1.9 3.3c.1.4.5.7.9.7.6 0 .9-.6.8-1.1-.4-1.6-.8-4.2-1.2-6.8.4-.6.6-1.3.6-2.1C14 3.8 12.2 2 10 2H9z"
                      fill="#5f6a94"
                    />
                  </svg>
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
                    Bigtown Dentistry
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
                    4/26/2027 · LPFSA Account
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
                $210.00
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
                background:
                  "linear-gradient(170.9deg, #25146F 2.46%, #C8102E 100%)",
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
          </div>
        </div>

        {/* ── Your Accounts ── */}
        <div style={{ padding: "0 16px" }}>
          <SectionHeader
            title="Your Accounts"
            onMore={() => navigate("/app/account")}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {/* HSA card */}
            <div
              onClick={() => navigate("/app/account/hsa")}
              style={{
                background: "#fff",
                borderRadius: 24,
                overflow: "hidden",
                boxShadow: CARD_SHADOW,
                cursor: "pointer",
              }}
            >
              {/* Top row: icon + name */}
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
                  <Wallet size={20} strokeWidth={1.75} style={{ color: TINT }} />
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
                    Health Savings Account
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: TEXT_SECONDARY,
                      lineHeight: "16px",
                    }}
                  >
                    HSA
                  </div>
                </div>
              </div>

              {/* Balance row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  padding: "8px 16px 16px",
                  gap: 16,
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <div
                      style={{
                        fontSize: 17,
                        fontWeight: 400,
                        color: TEXT_SECONDARY,
                        letterSpacing: -0.43,
                        lineHeight: "22px",
                      }}
                    >
                      Total Account Balance
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: TEXT_SECONDARY,
                        lineHeight: "16px",
                      }}
                    >
                      Cash + Invested Assets
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      color: TEXT_PRIMARY,
                      letterSpacing: -0.9,
                      lineHeight: "28px",
                    }}
                  >
                    $15,900.00
                  </div>
                </div>

                <div
                  style={{
                    height: 68,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    flexShrink: 0,
                  }}
                >
                  <ChevronRight size={14} strokeWidth={2.5} style={{ color: TEXT_SECONDARY, width: 8 }} />
                </div>
              </div>
            </div>

            {/* LPFSA card */}
            <div
              onClick={() => navigate("/app/account/lpfsa")}
              style={{
                background: "#fff",
                borderRadius: 24,
                boxShadow: CARD_SHADOW,
                cursor: "pointer",
              }}
            >
              {/* Top row: icon + name */}
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
                  <CreditCard size={20} strokeWidth={1.75} style={{ color: TINT }} />
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
                    Limited Purpose FSA
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: TEXT_SECONDARY,
                      lineHeight: "16px",
                    }}
                  >
                    01/01/2026 – 12/31/2026
                  </div>
                </div>
              </div>

              {/* Balance + warning tag */}
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
                  <div
                    style={{
                      fontSize: 17,
                      fontWeight: 400,
                      color: TEXT_SECONDARY,
                      letterSpacing: -0.43,
                      lineHeight: "22px",
                    }}
                  >
                    Available balance
                  </div>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      color: TEXT_PRIMARY,
                      letterSpacing: -0.9,
                      lineHeight: "28px",
                    }}
                  >
                    $850.00
                  </div>

                  {/* Warning tag */}
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        background: "#e6a800",
                        borderRadius: 6,
                        padding: "2px 8px 2px 4px",
                      }}
                    >
                      <span style={{ fontSize: 12, color: "#4a3500", lineHeight: "16px" }}>⏰</span>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 400,
                          color: "#4a3500",
                          lineHeight: "16px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        28 Days left to spend
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    height: 68,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    flexShrink: 0,
                  }}
                >
                  <ChevronRight size={14} strokeWidth={2.5} style={{ color: TEXT_SECONDARY, width: 8 }} />
                </div>
              </div>
            </div>
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
              onClick={() => navigate("/reimburse")}
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
                overflow: "hidden",
              }}
            >
              <img
                src={ILLUSTRATION_BG}
                alt=""
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: "0 -9.74% 7.11% -9.03%",
                  width: "118.77%",
                  height: "92.89%",
                  objectFit: "cover",
                }}
              />
            </div>
          </div>
        </div>

        {/* ── Recent Transactions ── */}
        <div style={{ padding: "0 16px" }}>
          <div
            style={{
              background: "#fff",
              borderRadius: 24,
              padding: "0 16px 0",
              boxShadow: CARD_SHADOW,
            }}
          >
            {/* Section header inside card */}
            <div style={{ padding: "0 0" }}>
              <SectionHeader
                title="Recent Transactions"
                onMore={() => navigate("/app/account")}
              />
            </div>

            {/* Transaction rows */}
            {[
              { title: "Pharmacy",      subtitle: "4/27/2026 · LPFSA", amount: "$42.50",  id: "c1" },
              { title: "Bigtown Dentistry",subtitle: "4/27/2026 · LPFSA", amount: "$210.00", id: "c3" },
              { title: "Investment Buy", subtitle: "4/27/2026 · HSA",   amount: "$500.00", id: "c2" },
            ].map((tx) => (
              <TransactionRow
                key={tx.id}
                title={tx.title}
                subtitle={tx.subtitle}
                amount={tx.amount}
                onClick={() => navigate(`/app/claims/${tx.id}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

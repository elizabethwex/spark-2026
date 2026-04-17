import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Users,
  UserCheck,
  CreditCard,
  Building2,
  Lock,
  Mail,
  LogOut,
  DollarSign,
  ChevronDown,
} from "lucide-react";
import {
  useAppVariant,
  APP_VARIANT_LABELS,
  type AppVariant,
} from "@/context/AppVariantContext";
import { AppNavBar } from "@/components/app-shell/AppNavBar";
import { AppTopSpacer } from "@/components/app-shell/AppTopSpacer";
import { AppListRow, AppListSection } from "@/components/app-shell/primitives/AppListRow";
import { CLAIMS_PAGE_BACKGROUND } from "./claimsPageStyles";

interface SectionItem {
  label: string;
  sublabel?: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>;
  iconBg: string;
  iconColor: string;
}

const PROFILE_SECTIONS: { header: string; items: SectionItem[] }[] = [
  {
    header: "",
    items: [
      { label: "Profile",              icon: User,      iconBg: "transparent", iconColor: "#5f6a94" },
      { label: "Dependents",           icon: Users,     iconBg: "transparent", iconColor: "#5f6a94" },
      { label: "Beneficiaries",        icon: UserCheck, iconBg: "transparent", iconColor: "#5f6a94" },
    ],
  },
  {
    header: "",
    items: [
      { label: "Bank Accounts",          icon: Building2, iconBg: "transparent", iconColor: "#5f6a94" },
      { label: "Debit Cards",            icon: CreditCard,iconBg: "transparent", iconColor: "#5f6a94" },
      { label: "Reimbursement Methods",  icon: DollarSign,iconBg: "transparent", iconColor: "#5f6a94" },
    ],
  },
  {
    header: "",
    items: [
      { label: "Login and Security",         icon: Lock,  iconBg: "transparent", iconColor: "#5f6a94" },
      { label: "Communication Preferences",  icon: Mail,  iconBg: "transparent", iconColor: "#5f6a94" },
    ],
  },
];

const VARIANT_KEYS: AppVariant[] = [1, 2, 3];

export default function AppMyAccount() {
  const navigate = useNavigate();
  const { variant, setVariant } = useAppVariant();
  const [variantOpen, setVariantOpen] = useState(false);

  return (
    <div
      style={{
        minHeight: "100%",
        background: CLAIMS_PAGE_BACKGROUND,
        fontFamily: "var(--app-font)",
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 64px)",
      }}
    >
      <AppTopSpacer variant="page" />
      <AppNavBar variant="sub-page" title="My Account" backTo={-1} backLabel="Back" />

      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 16, width: "100%", boxSizing: "border-box" }}>
        {/* Avatar + name hero */}
        <div
          style={{
            background: "var(--app-surface)",
            border: "1px solid var(--app-border)",
            borderRadius: "var(--app-radius-xl)",
            padding: "24px 16px",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "var(--app-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <User size={24} strokeWidth={1.5} style={{ color: "#fff" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1, minWidth: 0 }}>
            <div style={{ font: "var(--app-font-headline)", color: "var(--app-text)" }}>
              Penny Smith
            </div>
            <div style={{ font: "var(--app-font-subhead)", color: "var(--app-text-secondary)" }}>
              penny.smith@wexinc.com
            </div>

            {/* Variant picker */}
            <div style={{ position: "relative", marginTop: 4 }}>
              <button
                onClick={() => setVariantOpen((v) => !v)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "4px 10px",
                  borderRadius: 8,
                  border: "1px solid var(--app-border)",
                  background: "var(--app-primary-50, #eef2ff)",
                  cursor: "pointer",
                  fontFamily: "var(--app-font)",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--app-primary)",
                  lineHeight: "18px",
                  whiteSpace: "nowrap",
                }}
              >
                {APP_VARIANT_LABELS[variant]}
                <ChevronDown
                  size={14}
                  strokeWidth={2}
                  style={{
                    transition: "transform 0.2s",
                    transform: variantOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </button>

              {variantOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 4px)",
                    left: 0,
                    zIndex: 20,
                    background: "#fff",
                    border: "1px solid var(--app-border)",
                    borderRadius: 10,
                    boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                    overflow: "hidden",
                    minWidth: 200,
                  }}
                >
                  {VARIANT_KEYS.map((v) => (
                    <button
                      key={v}
                      onClick={() => {
                        setVariant(v);
                        setVariantOpen(false);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        width: "100%",
                        padding: "10px 14px",
                        border: "none",
                        background: v === variant ? "var(--app-primary-50, #eef2ff)" : "transparent",
                        cursor: "pointer",
                        fontFamily: "var(--app-font)",
                        fontSize: 13,
                        fontWeight: v === variant ? 600 : 400,
                        color: v === variant ? "var(--app-primary)" : "var(--app-text)",
                        lineHeight: "20px",
                        textAlign: "left",
                      }}
                    >
                      {APP_VARIANT_LABELS[v]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Settings sections */}
        {PROFILE_SECTIONS.map((section, idx) => (
          <AppListSection key={idx} header={section.header}>
            {section.items.map((item, i) => {
              const Icon = item.icon;
              return (
                <AppListRow
                  key={item.label}
                  label={item.label}
                  sublabel={item.sublabel}
                  last={i === section.items.length - 1}
                  icon={
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon size={20} strokeWidth={1.75} style={{ color: item.iconColor }} />
                    </div>
                  }
                />
              );
            })}
          </AppListSection>
        ))}

        {/* Sign out */}
        <div>
          <button
            style={{
              width: "100%",
              padding: "16px 20px",
              borderRadius: "var(--app-radius-pill)",
              background: "var(--app-info-surface)",
              border: "none",
              cursor: "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              fontFamily: "var(--app-font)",
              fontSize: 16,
              fontWeight: 500,
              color: "var(--app-primary-800)",
            }}
          >
            Log out
            <LogOut size={20} strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </div>
  );
}

import { lazy, Suspense } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { ConsumerNavigation } from "@/components/layout/ConsumerNavigation";
import { ConsumerFooter } from "@/components/layout/Footer";
import { UnderConstruction } from "@/components/UnderConstruction";
import { consumerPageBackgroundStyle } from "@/constants/consumerPageBackground";
import { FadeInItem } from "@/components/layout/PageFadeIn";

const FsaAccountPage = lazy(() => import("@/pages/fsa-account/FsaAccountPage"));
// Original imports preserved for future restoration:
// import { TitleBar } from "./hsa-details/TitleBar";
// import { AccountSummaryCards } from "./hsa-details/AccountSummaryCards";
// import { RecentTransactionsTable } from "./hsa-details/RecentTransactionsTable";
// import { PreviousPlanYearTable } from "./hsa-details/PreviousPlanYearTable";

/**
 * Account Overview Page
 * 
 * Standalone page showing detailed account information:
 * - Custom navigation header
 * - Title bar with action buttons
 * - Account summary cards
 * - Recent transactions table with filters
 * - Previous plan year table
 * - Footer
 * 
 * NOTE: Original content has been temporarily replaced with an "under construction" message.
 * All original content is preserved in comments below for easy restoration.
 */
export default function AccountOverviewPage() {
  const [searchParams] = useSearchParams();
  const account = searchParams.get("account");

  if (account === "hsa") {
    return <Navigate to="/hsa-details" replace />;
  }

  if (account === "fsa") {
    return (
      <Suspense
        fallback={
          <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
            Loading…
          </div>
        }
      >
        <FsaAccountPage />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen" style={consumerPageBackgroundStyle}>
      {/* Navigation Header */}
      <ConsumerNavigation />

      {/* Main Content */}
      <FadeInItem>
        <main className="w-full max-w-[1440px] mx-auto px-8 py-7">
          <UnderConstruction />
        </main>
      </FadeInItem>

      {/* Footer */}
      <ConsumerFooter />
    </div>
  );
}

/* 
 * ============================================================================
 * ORIGINAL CONTENT PRESERVED BELOW - Restore when ready to show full page
 * ============================================================================
 * 
 * Original main content structure:
 * 
 * <main className="w-full max-w-[1440px] mx-auto px-8 py-7 space-y-6">
 *   <TitleBar />
 *   <AccountSummaryCards />
 *   <RecentTransactionsTable />
 *   <PreviousPlanYearTable />
 * </main>
 * 
 * ============================================================================
 */

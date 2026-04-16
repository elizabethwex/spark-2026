import * as React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { DocumentViewLayout } from "@/components/documents/DocumentViewContext";
import { consumerPageBackgroundStyle } from "@/constants/consumerPageBackground";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { LightModeBoundary } from "@/components/LightModeBoundary";
import { useAppModeHotkey } from "@/hooks/useAppModeHotkey";
import { ReimburseWorkspaceHost } from "@/pages/reimburse/ReimburseWorkspaceHost";

// iOS app mode shell
const AppShell = React.lazy(() =>
  import("@/components/app-shell/AppShell").then((m) => ({ default: m.AppShell }))
);

// iOS app screen pages
const AppHomePage           = React.lazy(() => import("@/pages/app/AppHome"));
const AppAccountOverviewPage = React.lazy(() => import("@/pages/app/AppAccountOverview"));
const AppAccountDetailPage  = React.lazy(() => import("@/pages/app/AppAccountDetail"));
const AppLpfsaDetailPage    = React.lazy(() => import("@/pages/app/AppLpfsaDetail"));
const AppClaimsOverviewPage = React.lazy(() => import("@/pages/app/AppClaimsOverview"));
const AppClaimsDetailPage   = React.lazy(() => import("@/pages/app/AppClaimsDetail"));
const AppMessageCenterPage  = React.lazy(() => import("@/pages/app/AppMessageCenter"));
const AppMyAccountPage      = React.lazy(() => import("@/pages/app/AppMyAccount"));
const AppAssistIQPage       = React.lazy(() => import("@/pages/app/AppAssistIQ"));
const AppLockScreenPage     = React.lazy(() => import("@/pages/app/AppLockScreen"));
const AppPennyFlowPage      = React.lazy(() => import("@/pages/app/AppPennyFlow"));
const AppReimburseFlowPage  = React.lazy(() => import("@/pages/app/AppReimburseFlow"));

// Consumer Experience page - standalone route
const HomePage = React.lazy(() => import("@/pages/HomePage"));

// FSA account dashboard (consumer)
const FsaAccountPage = React.lazy(() => import("@/pages/fsa-account/FsaAccountPage"));

// HSA account details — /hsa-details
const HsaDetailsPage = React.lazy(() =>
  import("@/pages/hsa-details/HsaAccountDetails").then((m) => ({ default: m.HsaAccountDetails }))
);

// Message Center page - standalone route
const MessageCenterPage = React.lazy(() => import("@/pages/MessageCenter"));

// My Profile page - standalone route
const MyProfilePage = React.lazy(() => import("@/pages/MyProfile"));

// Resources page - standalone route
const ResourcesPage = React.lazy(() => import("@/pages/Resources"));

// Claims page - standalone route
const ClaimsPage = React.lazy(() => import("@/pages/Claims"));

// Account Documents page - standalone route
const AccountDocumentsPage = React.lazy(() => import("@/pages/AccountDocuments"));

// Document Organizer page - standalone route
const DocumentOrganizerPage = React.lazy(() => import("@/pages/DocumentOrganizer"));

// Document Folder page - standalone route
const DocumentFolderPage = React.lazy(() => import("@/pages/DocumentFolder"));

const ReimburseWorkspaceRouteBridge = React.lazy(
  () => import("@/pages/reimburse/ReimburseWorkspaceRouteBridge")
);

// Login page - standalone route
const LoginPage = React.lazy(() => import("@/pages/Login"));

// Theming Engine (Partner Admin)
const ThemingEnginePage = React.lazy(() => import("@/pages/ThemingEnginePage"));

// Modern documentation preview
const ModernDocumentPage = React.lazy(() => import("@/pages/ModernDocument"));

// Select an Account (authenticated; same UI as login step 5)
const SelectProfilePage = React.lazy(() => import("@/pages/SelectProfilePage"));

// Enrollment flow pages
const EnrollmentHomePage = React.lazy(() => import("@/pages/enrollment/EnrollmentHomePage"));
const EnrollmentStepRoute = React.lazy(() => import("@/pages/enrollment/EnrollmentStepRoute"));
const DecisionSupportOptInPage = React.lazy(() => import("@/pages/enrollment/DecisionSupportOptInPage"));
const PlansCheckpointPage = React.lazy(() => import("@/pages/enrollment/PlansCheckpointPage"));
const SpendingAccountsCheckpointPage = React.lazy(() => import("@/pages/enrollment/SpendingAccountsCheckpointPage"));
const EnrollmentSuccessPage = React.lazy(() => import("@/pages/enrollment/EnrollmentSuccessPage"));
const EnrollmentStatementPage = React.lazy(() => import("@/pages/enrollment/EnrollmentStatementPage"));


/**
 * Loading fallback for lazy-loaded pages
 */
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="text-muted-foreground">Loading...</div>
    </div>
  );
}

/** Mounts the Cmd+M hotkey inside the Router context */
function AppModeHotkey() {
  useAppModeHotkey();
  return null;
}

export function AppRoutes() {
  // Wrap consumer-facing pages to enforce light mode without persisting it
  const withConsumerLight = (node: React.ReactNode) => (
    <ProtectedRoute>
      <LightModeBoundary>{node}</LightModeBoundary>
    </ProtectedRoute>
  );

  // Wrap public pages (e.g., login) to enforce light mode without auth gate
  const withLightOnly = (node: React.ReactNode) => (
    <LightModeBoundary>{node}</LightModeBoundary>
  );

  return (
    <React.Suspense fallback={<PageLoader />}>
      <AppModeHotkey />
      <ScrollToTop />
      <Routes>
        {/* Login route */}
        <Route
          path="login"
          element={withLightOnly(
            <LoginPage
              onLoginSuccess={() => {
                window.location.href = import.meta.env.BASE_URL
              }}
            />
          )}
        />

        {/* Home */}
        <Route index element={withConsumerLight(<HomePage />)} />
        
        {/* FSA account dashboard (consumer) */}
        <Route path="fsa-account" element={withConsumerLight(<FsaAccountPage />)} />

        {/* HSA account details (consumer) */}
        <Route path="hsa-details" element={withConsumerLight(<HsaDetailsPage />)} />
        
        {/* Message Center */}
        <Route path="message-center" element={withConsumerLight(<MessageCenterPage />)} />
        
        {/* My Profile */}
        <Route path="my-profile" element={withConsumerLight(<MyProfilePage />)} />

        {/* Resources */}
        <Route path="resources" element={withConsumerLight(<ResourcesPage />)} />

        {/* Claims */}
        <Route path="claims" element={withConsumerLight(<ClaimsPage />)} />

        {/* Account Documents */}
        <Route path="account-documents" element={withConsumerLight(<AccountDocumentsPage />)} />

        {/* Document Organizer — shared layout preserves view-mode state across sub-pages */}
        <Route element={<DocumentViewLayout />}>
          <Route path="document-org" element={withConsumerLight(<DocumentOrganizerPage />)} />
          <Route path="document-org/:folderId" element={withConsumerLight(<DocumentFolderPage />)} />
        </Route>

        {/* Select an Account (authenticated; login wizard step 5 remains on /login) */}
        <Route path="select-profile" element={withConsumerLight(<SelectProfilePage />)} />

        {/* Reimbursement route bridge (deep-link compatibility) */}
        <Route
          path="reimburse/*"
          element={
            withConsumerLight(<ReimburseWorkspaceRouteBridge />)
          }
        />
        
        {/* Theming Engine - no LightModeBoundary so preview can toggle dark */}
        <Route path="theming-engine" element={<ProtectedRoute><ThemingEnginePage /></ProtectedRoute>} />

        {/* Modern documentation preview */}
        <Route path="modern-document" element={<ModernDocumentPage />} />

        {/* iOS Mobile App — /app/* (no auth gate, direct-link accessible on phone) */}
        <Route path="app" element={<AppShell />}>
          <Route index element={<AppHomePage />} />
          <Route path="account" element={<AppAccountOverviewPage />} />
          <Route path="account/lpfsa" element={<AppLpfsaDetailPage />} />
          <Route path="account/fsa" element={<AppLpfsaDetailPage />} />
          <Route path="account/dcfsa" element={<AppLpfsaDetailPage />} />
          <Route path="account/:id" element={<AppAccountDetailPage />} />
          <Route path="claims" element={<AppClaimsOverviewPage />} />
          <Route path="claims/:id" element={<AppClaimsDetailPage />} />
          <Route path="messages" element={<AppMessageCenterPage />} />
          <Route path="my-account" element={<AppMyAccountPage />} />
          <Route path="assist-iq" element={<AppAssistIQPage />} />
          <Route path="lock-screen" element={<AppLockScreenPage />} />
          <Route path="penny" element={<AppPennyFlowPage />} />
          <Route path="reimburse" element={<AppReimburseFlowPage />} />
        </Route>

        {/* Enrollment flow — /enrollment/* (standalone, no auth gate) */}
        <Route path="enrollment">
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={withLightOnly(<EnrollmentHomePage />)} />
          <Route path="decision-support-opt-in" element={withLightOnly(<DecisionSupportOptInPage />)} />
          <Route path="plans-checkpoint" element={withLightOnly(<PlansCheckpointPage />)} />
          <Route path="spending-accounts-checkpoint" element={withLightOnly(<SpendingAccountsCheckpointPage />)} />
          <Route path="success" element={withLightOnly(<EnrollmentSuccessPage />)} />
          <Route path="statement" element={withLightOnly(<EnrollmentStatementPage />)} />
          <Route path=":stepId" element={withLightOnly(<EnrollmentStepRoute />)} />
        </Route>

        {/* Catch-all for 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ReimburseWorkspaceHost />
    </React.Suspense>
  );
}

function NotFoundPage() {
  return (
    <div className="min-h-screen text-center py-12 px-4" style={consumerPageBackgroundStyle}>
      <h1 className="text-2xl font-display font-semibold text-foreground mb-2">
        Page Not Found
      </h1>
      <p className="text-muted-foreground">
        The page you're looking for doesn't exist.
      </p>
    </div>
  );
}

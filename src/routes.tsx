import * as React from "react";
import { Routes, Route } from "react-router-dom";
import { consumerPageBackgroundStyle } from "@/constants/consumerPageBackground";
import { ReimbursementProvider } from "@/pages/reimburse/ReimbursementContext";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { LightModeBoundary } from "@/components/LightModeBoundary";

// Consumer Experience page - standalone route
const HomePage = React.lazy(() => import("@/pages/HomePage"));

// Account Overview page - standalone route
const AccountOverviewPage = React.lazy(() => import("@/pages/AccountOverview"));

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

// Reimbursement flow pages - standalone routes
const ReimburseMyselfPage = React.lazy(() => import("@/pages/reimburse/ReimburseMyself"));
const ReimburseDocsPage = React.lazy(() => import("@/pages/reimburse/ReimburseDocs"));
const ReimburseAnalyzePage = React.lazy(() => import("@/pages/reimburse/ReimburseAnalyze"));
const ReimburseReviewPage = React.lazy(() => import("@/pages/reimburse/ReimburseReview"));
const ReimburseConfirmPage = React.lazy(() => import("@/pages/reimburse/ReimburseConfirm"));

// Login page - standalone route
const LoginPage = React.lazy(() => import("@/pages/Login"));

// Theming Engine (Partner Admin)
const ThemingEnginePage = React.lazy(() => import("@/pages/ThemingEnginePage"));

// Modern documentation preview
const ModernDocumentPage = React.lazy(() => import("@/pages/ModernDocument"));


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

/**
 * Application routes configuration
 */
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
        
        {/* Account Overview */}
        <Route path="account-overview" element={withConsumerLight(<AccountOverviewPage />)} />
        
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

        {/* Reimbursement flow routes */}
        <Route
          path="reimburse/*"
          element={
            withConsumerLight(
              <ReimbursementProvider>
                <Routes>
                  <Route index element={<ReimburseMyselfPage />} />
                  <Route path="docs" element={<ReimburseDocsPage />} />
                  <Route path="analyze" element={<ReimburseAnalyzePage />} />
                  <Route path="review" element={<ReimburseReviewPage />} />
                  <Route path="confirm" element={<ReimburseConfirmPage />} />
                </Routes>
              </ReimbursementProvider>
            )
          }
        />
        
        {/* Theming Engine - no LightModeBoundary so preview can toggle dark */}
        <Route path="theming-engine" element={<ProtectedRoute><ThemingEnginePage /></ProtectedRoute>} />

        {/* Modern documentation preview */}
        <Route path="modern-document" element={<ModernDocumentPage />} />

        
        {/* Catch-all for 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
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

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import type { ReactNode } from "react";

/**
 * ProtectedRoute Component
 * 
 * Wraps routes that require authentication.
 * Redirects to /login if user is not authenticated.
 */
interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Show nothing while checking/auth redirecting
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}


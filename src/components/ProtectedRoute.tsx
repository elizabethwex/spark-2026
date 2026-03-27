import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import type { ReactNode } from "react";

/**
 * ProtectedRoute Component
 *
 * Wraps routes that require a signed-in prototype session.
 * Redirects to /login only after the user has signed out (see AuthContext).
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


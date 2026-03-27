import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

/**
 * Authentication Context Interface
 * 
 * Manages authentication state for the application:
 * - Tracks if user is authenticated
 * - Provides login/logout functions
 * - Persists state in sessionStorage
 */
interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_STORAGE_KEY = "wex_auth_authenticated";

/**
 * AuthProvider
 * 
 * Provides authentication state management for the entire application.
 * State persists in sessionStorage until browser session ends or logout.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize from sessionStorage on mount
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
      return stored === "true";
    }
    return false;
  });

  // Sync sessionStorage when state changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isAuthenticated) {
        sessionStorage.setItem(SESSION_STORAGE_KEY, "true");
      } else {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      }
    }
  }, [isAuthenticated]);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to access AuthContext
 * 
 * @throws Error if used outside AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}


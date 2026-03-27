import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

/**
 * Authentication Context Interface
 *
 * Prototype: default signed-in; logout persists "signed out" until login again.
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
 * Prototype behavior: users start signed in (no login gate) until they choose
 * Log out. Explicit "false" in sessionStorage keeps them on the login flow
 * across refresh; any other/missing value treats the session as signed in.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
      return stored !== "false";
    }
    return true;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        SESSION_STORAGE_KEY,
        isAuthenticated ? "true" : "false"
      );
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


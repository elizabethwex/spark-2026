import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * Registers a Cmd+M (Mac) / Ctrl+M (Windows) keyboard shortcut to toggle
 * between the desktop app and the iOS-style /app/* routes.
 *
 * - When currently on /app/*, navigates back to /
 * - Otherwise, navigates to /app
 *
 * Ignores the shortcut when focus is inside an interactive text element
 * to avoid interfering with user input.
 */
export function useAppModeHotkey() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const triggerKey = isMac ? e.metaKey : e.ctrlKey;

      if (!triggerKey || e.key !== "m") return;

      // Ignore when typing in a text field
      const target = e.target as HTMLElement;
      const tag = target.tagName.toLowerCase();
      if (
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        target.isContentEditable
      ) {
        return;
      }

      e.preventDefault();

      if (location.pathname.startsWith("/app")) {
        navigate("/");
      } else {
        navigate("/app");
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate, location.pathname]);
}

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls the window to top on route change
 * WCAG 2.4.3: Focus order - ensures users start at the top of new pages
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}


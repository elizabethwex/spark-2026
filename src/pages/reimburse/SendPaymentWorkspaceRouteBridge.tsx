import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useReimburseWorkspace } from "@/context/ReimburseWorkspaceContext";

/**
 * Opens the Send Payment workspace then returns the user to the prior page (or home).
 * Handles direct navigation to `/send-payment` so mock hrefs never hit the 404 catch-all.
 */
export default function SendPaymentWorkspaceRouteBridge() {
  const location = useLocation();
  const navigate = useNavigate();
  const { openSendPaymentWorkspace } = useReimburseWorkspace();

  useEffect(() => {
    const returnTo = (location.state as { from?: string } | null)?.from ?? "/";
    openSendPaymentWorkspace();
    navigate(returnTo, { replace: true });
  }, [location.pathname, location.state, navigate, openSendPaymentWorkspace]);

  return null;
}

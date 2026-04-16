import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useReimburseWorkspace } from "@/context/ReimburseWorkspaceContext";

export default function ReimburseWorkspaceRouteBridge() {
  const location = useLocation();
  const navigate = useNavigate();
  const { openReimburseWorkspaceFromPath } = useReimburseWorkspace();

  useEffect(() => {
    const returnTo = (location.state as { from?: string } | null)?.from ?? "/";
    openReimburseWorkspaceFromPath(location.pathname);
    navigate(returnTo, { replace: true });
  }, [location.pathname, location.state, navigate, openReimburseWorkspaceFromPath]);

  return null;
}

import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useReimburseWorkspace } from "@/context/ReimburseWorkspaceContext";

export default function ReimburseWorkspaceRouteBridge() {
  const location = useLocation();
  const navigate = useNavigate();
  const { openReimburseWorkspaceFromPath } = useReimburseWorkspace();

  useEffect(() => {
    openReimburseWorkspaceFromPath(location.pathname);
    navigate("/", { replace: true });
  }, [location.pathname, navigate, openReimburseWorkspaceFromPath]);

  return null;
}

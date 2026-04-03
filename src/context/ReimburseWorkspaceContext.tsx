import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type ReimburseWorkspaceStep =
  | "start"
  | "processing"
  | "account"
  | "review"
  | "manual"
  | "destination"
  | "validation"
  | "confirmation";

interface ReimburseWorkspaceContextValue {
  isOpen: boolean;
  initialStep: ReimburseWorkspaceStep;
  sessionKey: number;
  openReimburseWorkspace: (step?: ReimburseWorkspaceStep) => void;
  openReimburseWorkspaceFromPath: (path: string) => void;
  closeReimburseWorkspace: () => void;
}

const ReimburseWorkspaceContext = createContext<ReimburseWorkspaceContextValue | undefined>(
  undefined
);

function stepFromPath(path: string): ReimburseWorkspaceStep {
  const cleanPath = path.split("?")[0].split("#")[0];
  const segments = cleanPath.split("/").filter(Boolean);
  const subPath = segments[1] ?? "";

  if (subPath === "processing") return "processing";
  if (subPath === "account") return "account";
  if (subPath === "review") return "review";
  if (subPath === "manual") return "manual";
  if (subPath === "destination") return "destination";
  if (subPath === "validation") return "validation";
  if (subPath === "confirmation") return "confirmation";
  return "start";
}

export function ReimburseWorkspaceProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialStep, setInitialStep] = useState<ReimburseWorkspaceStep>("start");
  const [sessionKey, setSessionKey] = useState(0);

  const openReimburseWorkspace = useCallback((step: ReimburseWorkspaceStep = "start") => {
    setInitialStep(step);
    setSessionKey((prev) => prev + 1);
    setIsOpen(true);
  }, []);

  const openReimburseWorkspaceFromPath = useCallback(
    (path: string) => {
      openReimburseWorkspace(stepFromPath(path));
    },
    [openReimburseWorkspace]
  );

  const closeReimburseWorkspace = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      initialStep,
      sessionKey,
      openReimburseWorkspace,
      openReimburseWorkspaceFromPath,
      closeReimburseWorkspace,
    }),
    [closeReimburseWorkspace, initialStep, isOpen, openReimburseWorkspace, openReimburseWorkspaceFromPath, sessionKey]
  );

  return (
    <ReimburseWorkspaceContext.Provider value={value}>
      {children}
    </ReimburseWorkspaceContext.Provider>
  );
}

export function useReimburseWorkspace() {
  const context = useContext(ReimburseWorkspaceContext);
  if (!context) {
    throw new Error("useReimburseWorkspace must be used within ReimburseWorkspaceProvider");
  }
  return context;
}

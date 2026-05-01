import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type ReimburseWorkspaceStep =
  | "start"
  | "processing"
  | "account"
  | "review"
  | "manual"
  | "destination"
  | "payee"
  | "validation"
  | "confirmation";

export type WorkspaceFlowKind = "reimburse" | "sendPayment";

interface ReimburseWorkspaceContextValue {
  isOpen: boolean;
  activeWorkspace: WorkspaceFlowKind | null;
  initialStep: ReimburseWorkspaceStep;
  sessionKey: number;
  openReimburseWorkspace: (step?: ReimburseWorkspaceStep) => void;
  openSendPaymentWorkspace: (step?: ReimburseWorkspaceStep) => void;
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
  if (subPath === "payee") return "payee";
  if (subPath === "validation") return "validation";
  if (subPath === "confirmation") return "confirmation";
  return "start";
}

export function ReimburseWorkspaceProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceFlowKind | null>(null);
  const [initialStep, setInitialStep] = useState<ReimburseWorkspaceStep>("start");
  const [sessionKey, setSessionKey] = useState(0);

  const openReimburseWorkspace = useCallback((step: ReimburseWorkspaceStep = "start") => {
    setActiveWorkspace("reimburse");
    setInitialStep(step);
    setSessionKey((prev) => prev + 1);
    setIsOpen(true);
  }, []);

  const openSendPaymentWorkspace = useCallback((step: ReimburseWorkspaceStep = "start") => {
    setActiveWorkspace("sendPayment");
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
    setActiveWorkspace(null);
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      activeWorkspace,
      initialStep,
      sessionKey,
      openReimburseWorkspace,
      openSendPaymentWorkspace,
      openReimburseWorkspaceFromPath,
      closeReimburseWorkspace,
    }),
    [
      activeWorkspace,
      closeReimburseWorkspace,
      initialStep,
      isOpen,
      openReimburseWorkspace,
      openReimburseWorkspaceFromPath,
      openSendPaymentWorkspace,
      sessionKey,
    ]
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

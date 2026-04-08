import * as React from "react";
import { Plus, AlertTriangle, User } from "lucide-react";

import EnrollmentLayout from "./EnrollmentLayout";
import BeneficiaryCard, { type Beneficiary } from "@/components/enrollment/beneficiaries/BeneficiaryCard";
import AddBeneficiaryModal from "@/components/enrollment/beneficiaries/AddBeneficiaryModal";
import { WexButton } from "@wex/components-react/actions";
import { WexDialog } from "@wex/components-react/overlays";
import { cn } from "@/lib/utils";

type BeneficiariesPageProps = {
  currentStepId: string;
  onStepChange: (stepId: string) => void;
  onBack: () => void;
  onNext: () => void;
  onCancel: () => void;
};

type StoredBeneficiariesState = {
  version: 1;
  beneficiaries: Beneficiary[];
  skipped: boolean;
};

const STORAGE_KEY = "enrollment.beneficiaries.v1";
const DEPENDENTS_STORAGE_KEY = "enrollment.dependents.v1";

type DependentFromStorage = {
  id: string;
  name: string;
  ageLabel: string;
};

function loadDependentsFromStorage(): DependentFromStorage[] {
  try {
    const raw = localStorage.getItem(DEPENDENTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (parsed?.version !== 1 || !Array.isArray(parsed.dependents)) return [];
    return parsed.dependents;
  } catch {
    return [];
  }
}

export default function BeneficiariesPage({
  currentStepId,
  onStepChange,
  onBack,
  onNext,
  onCancel,
}: BeneficiariesPageProps) {
  const [beneficiaries, setBeneficiaries] = React.useState<Beneficiary[]>([]);
  const [skipped, setSkipped] = React.useState(false);
  const [addOpen, setAddOpen] = React.useState(false);
  const [dependents, setDependents] = React.useState<DependentFromStorage[]>([]);

  // Edit flow for non-dependent: open AddBeneficiaryModal with pre-filled data
  const [editingNewBeneficiary, setEditingNewBeneficiary] = React.useState<Beneficiary | null>(null);
  // Remove confirmation: only for non-dependent beneficiaries
  const [removeConfirmBeneficiary, setRemoveConfirmBeneficiary] = React.useState<Beneficiary | null>(null);

  // Modal for adding/editing dependent as beneficiary
  const [depModalOpen, setDepModalOpen] = React.useState(false);
  const [selectedDepForModal, setSelectedDepForModal] = React.useState<DependentFromStorage | null>(
    null,
  );
  const [depModalType, setDepModalType] = React.useState<"primary" | "contingent">("primary");
  const [depModalShare, setDepModalShare] = React.useState("100");
  const [editingBeneficiaryId, setEditingBeneficiaryId] = React.useState<string | null>(null);

  // Load persisted state
  React.useEffect(() => {
    // Load beneficiaries
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredBeneficiariesState;
        if (parsed?.version === 1) {
          if (Array.isArray(parsed.beneficiaries)) setBeneficiaries(parsed.beneficiaries);
          if (typeof parsed.skipped === "boolean") setSkipped(parsed.skipped);
        }
      }
    } catch {
      // ignore
    }

    // Load dependents
    setDependents(loadDependentsFromStorage());
  }, []);

  // Persist state
  React.useEffect(() => {
    try {
      const payload: StoredBeneficiariesState = {
        version: 1,
        beneficiaries,
        skipped,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore
    }
  }, [beneficiaries, skipped]);

  // Calculate totals
  const primaryBenef = beneficiaries.find((b) => b.type === "primary");
  const hasPrimary = !!primaryBenef;

  const totalAllocation = beneficiaries.reduce((sum, b) => sum + b.sharePercentage, 0);
  const allocationValid = totalAllocation === 100;

  // Can proceed if skipped OR no beneficiaries OR total equals 100% with a primary
  const allValid = skipped || (beneficiaries.length === 0) || (allocationValid && hasPrimary);

  // Dependents not yet added as beneficiaries
  const availableDependents = dependents.filter(
    (d) => !beneficiaries.some((b) => b.isFromDependents && b.id === d.id),
  );

  const handleAdd = (benef: Beneficiary) => {
    setBeneficiaries((prev) => [benef, ...prev]);
    setSkipped(false);
  };

  const handleRemove = (id: string) => {
    setBeneficiaries((prev) => prev.filter((b) => b.id !== id));
  };

  const handleRemoveOrConfirm = (beneficiary: Beneficiary) => {
    if (beneficiary.isFromDependents) {
      handleRemove(beneficiary.id);
    } else {
      setRemoveConfirmBeneficiary(beneficiary);
    }
  };

  const handleEdit = (id: string) => {
    const existing = beneficiaries.find((b) => b.id === id);
    if (!existing) return;

    if (existing.isFromDependents) {
      // For dependent-based beneficiaries, open the type/percentage modal
      const dep = dependents.find((d) => d.id === existing.id);
      if (dep) {
        setSelectedDepForModal(dep);
      } else {
        // Dependent might have been removed, create a fake one for the modal
        setSelectedDepForModal({ id: existing.id, name: existing.name, ageLabel: "" });
      }
      setDepModalType(existing.type);
      setDepModalShare(String(existing.sharePercentage));
      setEditingBeneficiaryId(id);
      setDepModalOpen(true);
    } else {
      // For non-dependent beneficiaries, open add modal with existing data (edit mode)
      setEditingNewBeneficiary(existing);
      setAddOpen(true);
    }
  };

  const handleAddDependentAsBeneficiary = (dep: DependentFromStorage) => {
    setSelectedDepForModal(dep);
    setEditingBeneficiaryId(null);
    // If there's already a primary, default to contingent
    const remaining = Math.max(0, 100 - totalAllocation);
    if (hasPrimary) {
      setDepModalType("contingent");
      setDepModalShare(remaining > 0 ? String(remaining) : "0");
    } else {
      setDepModalType("primary");
      setDepModalShare(remaining > 0 ? String(remaining) : "100");
    }
    setDepModalOpen(true);
  };

  const handleConfirmDepAsBeneficiary = () => {
    if (!selectedDepForModal) return;
    const shareNum = parseInt(depModalShare, 10);
    if (Number.isNaN(shareNum) || shareNum < 1 || shareNum > 100) return;

    const benef: Beneficiary = {
      id: selectedDepForModal.id,
      name: selectedDepForModal.name,
      relationship: "Dependent",
      type: depModalType,
      sharePercentage: shareNum,
      isFromDependents: true,
    };

    if (editingBeneficiaryId) {
      // Update existing beneficiary
      setBeneficiaries((prev) =>
        prev.map((b) => (b.id === editingBeneficiaryId ? benef : b)),
      );
    } else {
      // Add new beneficiary
      handleAdd(benef);
    }

    setDepModalOpen(false);
    setSelectedDepForModal(null);
    setEditingBeneficiaryId(null);
  };

  const handleNext = () => {
    if (allValid) {
      onNext();
    }
  };

  return (
    <EnrollmentLayout
      currentStepId={currentStepId}
      cancelAction={{ label: "Cancel", onClick: onCancel }}
      onStepChange={onStepChange}
      onBack={onBack}
      onNext={handleNext}
      skipAction={{
        label: "Skip this step",
        onClick: () => {
          setBeneficiaries([]);
          setSkipped(true);
          onNext();
        },
      }}
    >
      <div className="pt-14 flex justify-center">
        <div className="w-[min(860px,92vw)]">
          <h2 className="text-[24px] font-bold leading-8 tracking-[-0.456px] text-foreground text-center">
            Beneficiaries
          </h2>
          <p className="mt-2 text-[14px] leading-6 tracking-[-0.084px] text-muted-foreground text-center">
            Designate who will receive your benefits in the event of your passing.
            This step is optional.
          </p>
          <p className="mt-1 text-[13px] leading-5 text-muted-foreground text-center">
            You may need to designate a beneficiary for your Health Savings Account (HSA).
          </p>

          {/* Allocation Summary */}
          {beneficiaries.length > 0 && (
            <div className="mt-4 flex flex-col items-center gap-2">
              <div
                className={cn(
                  "rounded-full border px-4 py-2 text-[13px]",
                  !allocationValid
                    ? "border-destructive bg-destructive/10 text-destructive"
                    : "border-border bg-muted text-foreground",
                )}
              >
                Total allocation: <span className="font-semibold">{totalAllocation}%</span>
                {!allocationValid && (
                  <span className="ml-1">(must equal 100%)</span>
                )}
              </div>
              {!allValid && !skipped && (
                <div className="flex items-center gap-1 text-[12px] text-destructive">
                  <AlertTriangle className="h-3 w-3" />
                  {!hasPrimary
                    ? "You must designate a primary beneficiary"
                    : "Total allocation must equal 100%"}
                </div>
              )}
            </div>
          )}

          {/* Add new beneficiary affordance */}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => {
                setEditingNewBeneficiary(null);
                setAddOpen(true);
              }}
              className={cn(
                "mt-6 w-full rounded-xl border-2 border-dashed border-border bg-background px-4 py-4",
                "text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="inline-flex items-center justify-center gap-2 text-[14px] font-medium">
                  <Plus className="h-4 w-4" />
                  Add a Beneficiary
                </span>
                <span className="text-[12px] text-muted-foreground">
                  Add someone not listed as a dependent
                </span>
              </div>
            </button>
          </div>

          {/* Select dependent as beneficiary */}
          {availableDependents.length > 0 && (
            <div className="mt-6">
              <div className="text-[14px] font-semibold text-foreground mb-3">
                Or select a dependent as beneficiary:
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {availableDependents.map((dep) => (
                  <button
                    key={dep.id}
                    type="button"
                    onClick={() => handleAddDependentAsBeneficiary(dep)}
                    className={cn(
                      "w-full text-left rounded-xl border border-border bg-background px-4 py-3 shadow-[0px_1px_2px_0px_rgba(18,18,23,0.05)]",
                      "transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="text-[14px] font-semibold leading-5 text-foreground">
                          {dep.name}
                        </div>
                        <div className="text-[13px] leading-5 text-muted-foreground">{dep.ageLabel}</div>
                      </div>
                      <div className="ml-auto">
                        <Plus className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Beneficiary cards */}
          {beneficiaries.length > 0 && (
            <div className="mt-6">
              <div className="text-[14px] font-semibold text-foreground mb-3">
                Your Beneficiaries:
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {beneficiaries.map((b) => (
                  <BeneficiaryCard
                    key={b.id}
                    beneficiary={b}
                    selected={true}
                    onClick={() => {}}
                    onEdit={() => handleEdit(b.id)}
                    onRemove={() => handleRemoveOrConfirm(b)}
                  />
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      <AddBeneficiaryModal
        open={addOpen}
        onOpenChange={(open) => {
          setAddOpen(open);
          if (!open) setEditingNewBeneficiary(null);
        }}
        onAdd={handleAdd}
        editingBeneficiary={editingNewBeneficiary}
        onUpdate={(benef) => {
          setBeneficiaries((prev) => prev.map((b) => (b.id === benef.id ? benef : b)));
          setEditingNewBeneficiary(null);
          setAddOpen(false);
        }}
        primaryDisabled={hasPrimary}
      />

      {/* Remove confirmation: only for non-dependent (newly added) beneficiaries */}
      <WexDialog open={removeConfirmBeneficiary != null} onOpenChange={(open) => { if (!open) setRemoveConfirmBeneficiary(null); }}>
        <WexDialog.Content size="md" aria-describedby={undefined}>
          <WexDialog.Header>
            <WexDialog.Title>Remove Beneficiary?</WexDialog.Title>
          </WexDialog.Header>
          <p className="text-[14px] leading-6 text-muted-foreground">
            Are you sure you want to remove {removeConfirmBeneficiary?.name}?
          </p>
          <WexDialog.Footer className="justify-end gap-2">
            <WexDialog.Close asChild>
              <WexButton variant="outline" intent="secondary">Cancel</WexButton>
            </WexDialog.Close>
            <WexButton
              intent="destructive"
              onClick={() => {
                if (removeConfirmBeneficiary) {
                  handleRemove(removeConfirmBeneficiary.id);
                  setRemoveConfirmBeneficiary(null);
                }
              }}
            >
              Remove
            </WexButton>
          </WexDialog.Footer>
        </WexDialog.Content>
      </WexDialog>

      {/* Modal to set type/percentage when adding/editing dependent as beneficiary */}
      {depModalOpen && selectedDepForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-[min(400px,90vw)] rounded-xl bg-background p-6 shadow-xl">
            <h3 className="text-[18px] font-bold text-foreground">
              {editingBeneficiaryId ? "Edit" : "Add"} {selectedDepForModal.name} as Beneficiary
            </h3>
            <p className="mt-1 text-[14px] text-muted-foreground">
              Set the beneficiary type and share percentage.
            </p>
            {(() => {
              const currentBenefShare = editingBeneficiaryId
                ? beneficiaries.find((b) => b.id === editingBeneficiaryId)?.sharePercentage ?? 0
                : 0;
              const usedByOthers = totalAllocation - currentBenefShare;
              const remaining = 100 - usedByOthers;
              return remaining < 100 ? (
                <p className="mt-1 text-[12px] text-muted-foreground">
                  Remaining allocation available: <span className="font-semibold">{remaining}%</span>
                </p>
              ) : null;
            })()}

            <div className="mt-4 flex flex-col gap-4">
              <div>
                <div className="text-[14px] text-muted-foreground mb-2">Beneficiary Type:</div>
                <div className="flex gap-4">
                  {(() => {
                    // Disable primary if there's already a primary AND we're not editing that primary
                    const existingPrimaryId = primaryBenef?.id;
                    const primaryDisabled = hasPrimary && editingBeneficiaryId !== existingPrimaryId;
                    return (
                      <>
                        <label
                          className={cn(
                            "inline-flex items-center gap-2 text-[14px]",
                            primaryDisabled ? "text-muted-foreground cursor-not-allowed" : "text-foreground",
                          )}
                        >
                          <input
                            type="radio"
                            name="dep-benef-type"
                            checked={depModalType === "primary"}
                            onChange={() => setDepModalType("primary")}
                            disabled={primaryDisabled}
                            className="accent-primary"
                          />
                          Primary
                          {primaryDisabled && (
                            <span className="text-[11px] text-muted-foreground">(already assigned)</span>
                          )}
                        </label>
                        <label className="inline-flex items-center gap-2 text-[14px] text-foreground">
                          <input
                            type="radio"
                            name="dep-benef-type"
                            checked={depModalType === "contingent"}
                            onChange={() => setDepModalType("contingent")}
                            className="accent-primary"
                          />
                          Contingent
                        </label>
                      </>
                    );
                  })()}
                </div>
              </div>

              <div>
                <label className="text-[14px] text-muted-foreground">Share Percentage:</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={depModalShare}
                  onChange={(e) => setDepModalShare(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border px-3 py-2 text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <WexButton
                variant="ghost"
                onClick={() => {
                  setDepModalOpen(false);
                  setSelectedDepForModal(null);
                  setEditingBeneficiaryId(null);
                }}
              >
                Cancel
              </WexButton>
              <WexButton intent="primary" onClick={handleConfirmDepAsBeneficiary}>
                {editingBeneficiaryId ? "Save Changes" : "Add as Beneficiary"}
              </WexButton>
            </div>
          </div>
        </div>
      )}
    </EnrollmentLayout>
  );
}
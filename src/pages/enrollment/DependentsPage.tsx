import * as React from "react";
import { Plus } from "lucide-react";

import EnrollmentLayout from "./EnrollmentLayout";
import DependentCard, { type Dependent } from "@/components/enrollment/dependents/DependentCard";
import AddDependentModal from "@/components/enrollment/dependents/AddDependentModal";
import { WexButton } from "@wex/components-react/actions";
import { WexDialog } from "@wex/components-react/overlays";
import { cn } from "@/lib/utils";

type DependentsPageProps = {
  currentStepId: string;
  onStepChange: (stepId: string) => void;
  onBack: () => void;
  onNext: () => void;
  onCancel: () => void;
};

const initialDependents: Dependent[] = [
  { id: "spouse", name: "Alex Smith", ageLabel: "35 years old" },
];

type StoredDependentsState = {
  version: 1;
  dependents: Dependent[];
  selectedIds: string[];
  selfOnly: boolean;
};

const STORAGE_KEY = "enrollment.dependents.v1";

export default function DependentsPage({ currentStepId, onStepChange, onBack, onNext, onCancel }: DependentsPageProps) {
  const [dependents, setDependents] = React.useState<Dependent[]>(initialDependents);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [selfOnly, setSelfOnly] = React.useState<boolean>(true);
  const [addOpen, setAddOpen] = React.useState(false);
  const [editingDependent, setEditingDependent] = React.useState<Dependent | null>(null);
  const [confirmRemoveDependent, setConfirmRemoveDependent] = React.useState<Dependent | null>(null);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as StoredDependentsState;
      if (parsed?.version !== 1) return;

      if (Array.isArray(parsed.dependents) && parsed.dependents.length >= 0) {
        const migratedDependents = parsed.dependents.map((dependent) => {
          if (dependent.id === "spouse" && ["Spouse Name", "Alex Parker"].includes(dependent.name)) {
            return { ...dependent, name: "Alex Smith" };
          }
          return dependent;
        }).filter((dependent) => dependent.name !== "Fernanda Smith");
        setDependents(migratedDependents.length ? migratedDependents : initialDependents);
      }
      if (Array.isArray(parsed.selectedIds)) setSelectedIds(parsed.selectedIds);
      if (typeof parsed.selfOnly === "boolean") setSelfOnly(parsed.selfOnly);
    } catch {
      // ignore
    }
  }, []);

  React.useEffect(() => {
    try {
      const payload: StoredDependentsState = {
        version: 1,
        dependents,
        selectedIds,
        selfOnly,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore
    }
  }, [dependents, selectedIds, selfOnly]);

  const handleToggleDependent = (id: string) => {
    setSelfOnly(false);
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleSelfOnly = () => {
    setSelectedIds([]);
    setSelfOnly(true);
  };

  const handleAdd = (dep: Dependent) => {
    setDependents((prev) => [{ ...dep, userAdded: true }, ...prev]);
    setSelfOnly(false);
    setSelectedIds((prev) => (prev.includes(dep.id) ? prev : [...prev, dep.id]));
  };

  const handleRemove = (id: string) => {
    setDependents((prev) => prev.filter((d) => d.id !== id));
    setSelectedIds((prev) => prev.filter((x) => x !== id));
    setSelfOnly((prevSelfOnly) => {
      const remainingSelected = selectedIds.filter((x) => x !== id);
      return prevSelfOnly || remainingSelected.length === 0;
    });
  };

  const handleEdit = (d: Dependent) => {
    setEditingDependent(d);
    setAddOpen(true);
  };


  const hasDependents = dependents.length > 0;

  return (
    <EnrollmentLayout
      currentStepId={currentStepId}
      cancelAction={{ label: "Cancel", onClick: onCancel }}
      onStepChange={onStepChange}
      onBack={onBack}
      onNext={onNext}
    >
      <div className="pt-14 flex justify-center">
        <div className="w-[min(860px,92vw)]">
          <h2 className="text-[24px] font-bold leading-8 tracking-[-0.456px] text-foreground text-center">
            Dependents
          </h2>
          <p className="mt-2 text-[14px] leading-6 tracking-[-0.084px] text-muted-foreground text-center">
            This information will be used to identify who needs to be covered on your plan.
          </p>
          <p className="mt-1 text-[13px] leading-5 text-muted-foreground text-center">
            Select who you want to cover. You can choose multiple dependents, or enroll as self-only.
          </p>

          {/* Summary */}
          

          {/* Cards / Empty state */}
          {hasDependents ? (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {dependents.map((d) => (
                <DependentCard
                  key={d.id}
                  dependent={d}
                  selected={selectedIds.includes(d.id)}
                  onClick={() => handleToggleDependent(d.id)}
                  onEdit={d.userAdded ? () => handleEdit(d) : undefined}
                  onRemove={d.userAdded ? () => setConfirmRemoveDependent(d) : undefined}
                />
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-border bg-background p-8 text-center shadow-[0px_1px_2px_0px_rgba(18,18,23,0.05)]">
              <div className="text-[16px] font-semibold text-foreground">No dependents added yet</div>
              <div className="mt-1 text-[14px] text-muted-foreground">
                Add dependents you'd like to include in coverage, or continue as self-only.
              </div>
              <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center">
                <WexButton intent="primary" onClick={() => { setEditingDependent(null); setAddOpen(true); }}>
                  <Plus className="h-4 w-4" />
                  Add a Dependent
                </WexButton>
                <WexButton variant="outline" onClick={handleSelfOnly}>
                  I&apos;m just covering myself
                </WexButton>
              </div>
            </div>
          )}

          <div className="mt-6">
            <WexButton
              variant="outline"
              className={cn(
                "w-full h-12 border-border text-foreground hover:bg-muted",
                (selfOnly || selectedIds.length === 0) && "border-primary text-primary bg-primary/5",
              )}
              onClick={handleSelfOnly}
            >
              I&apos;m just covering myself
            </WexButton>
          </div>

          {/* Primary add affordance */}
          <div className="mt-4">
            <button
              type="button"
              onClick={() => { setEditingDependent(null); setAddOpen(true); }}
              className={cn(
                "w-full rounded-xl border-2 border-dashed border-border bg-background px-4 py-4",
                "text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="inline-flex items-center justify-center gap-2 text-[14px] font-medium">
                  <Plus className="h-4 w-4" />
                  Add a Dependent
                </span>
                <span className="text-[12px] text-muted-foreground">
                  Add a spouse, child, or domestic partner
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <AddDependentModal
        open={addOpen}
        onOpenChange={(open) => {
          setAddOpen(open);
          if (!open) setEditingDependent(null);
        }}
        onAdd={handleAdd}
        editDependent={editingDependent}
        onUpdate={(updated) => {
          setDependents((prev) =>
            prev.map((d) => (d.id === updated.id ? { ...updated, userAdded: true } : d))
          );
          setAddOpen(false);
          setEditingDependent(null);
        }}
      />

      <WexDialog open={confirmRemoveDependent !== null} onOpenChange={(open) => { if (!open) setConfirmRemoveDependent(null); }}>
        <WexDialog.Content size="md" aria-describedby={undefined}>
          <WexDialog.Header>
            <WexDialog.Title>Remove dependent?</WexDialog.Title>
          </WexDialog.Header>
          <p className="text-[14px] leading-6 text-muted-foreground">
            Are you sure you want to remove {confirmRemoveDependent?.name}? They were just added during this session.
          </p>
          <WexDialog.Footer className="justify-end gap-2">
            <WexDialog.Close asChild>
              <WexButton variant="outline" intent="secondary">Cancel</WexButton>
            </WexDialog.Close>
            <WexButton
              intent="destructive"
              onClick={() => {
                if (confirmRemoveDependent) {
                  handleRemove(confirmRemoveDependent.id);
                  setConfirmRemoveDependent(null);
                }
              }}
            >
              Remove
            </WexButton>
          </WexDialog.Footer>
        </WexDialog.Content>
      </WexDialog>
    </EnrollmentLayout>
  );
}
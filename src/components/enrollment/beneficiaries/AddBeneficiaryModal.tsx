import * as React from "react";
import { Plus } from "lucide-react";
import { WexButton } from "@wex/components-react/actions";
import { WexDialog } from "@wex/components-react/overlays";
import { WexSelect, WexInput, WexDatePicker, WexRadioGroup } from "@wex/components-react/form-inputs";
import { WexLabel } from "@wex/components-react/form-structure";
import { cn } from "@/lib/utils";
import type { Beneficiary } from "./BeneficiaryCard";

function formStateFromBeneficiary(b: Beneficiary): FormState {
  const parts = b.name.trim().split(/\s+/);
  const firstName = parts[0] ?? "";
  const lastName = parts.slice(1).join(" ") ?? "";
  return {
    firstName,
    middleName: "",
    lastName,
    ssn: "",
    birthDate: undefined,
    relationship: b.relationship,
    type: b.type,
    sharePercentage: String(b.sharePercentage),
  };
}

type AddBeneficiaryModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (beneficiary: Beneficiary) => void;
  editingBeneficiary?: Beneficiary | null;
  onUpdate?: (beneficiary: Beneficiary) => void;
  primaryDisabled?: boolean;
  isEnrollmentFlow?: boolean;
};

type FormState = {
  firstName: string;
  middleName: string;
  lastName: string;
  ssn: string;
  birthDate: Date | undefined;
  relationship: string;
  type: "primary" | "contingent" | "";
  sharePercentage: string;
};

const initialState: FormState = {
  firstName: "",
  middleName: "",
  lastName: "",
  ssn: "",
  birthDate: undefined,
  relationship: "",
  type: "",
  sharePercentage: "",
};

export default function AddBeneficiaryModal({
  open,
  onOpenChange,
  onAdd,
  editingBeneficiary = null,
  onUpdate,
  primaryDisabled = false,
  isEnrollmentFlow,
}: AddBeneficiaryModalProps) {
  const [state, setState] = React.useState<FormState>(initialState);
  const [submitted, setSubmitted] = React.useState(false);

  const isEditMode = open && editingBeneficiary != null;

  React.useEffect(() => {
    if (!open) {
      setState(initialState);
      setSubmitted(false);
      return;
    }
    if (editingBeneficiary) {
      setState(formStateFromBeneficiary(editingBeneficiary));
    } else {
      setState(initialState);
    }
    setSubmitted(false);
  }, [open, editingBeneficiary]);

  React.useEffect(() => {
    if (open && primaryDisabled && state.type === "") {
      setState((s) => ({ ...s, type: "contingent" }));
    }
  }, [open, primaryDisabled, state.type]);

  const shareNum = parseInt(state.sharePercentage, 10);
  const shareValid = !Number.isNaN(shareNum) && shareNum >= 1 && shareNum <= 100;

  const requiredMissing =
    !state.firstName.trim() ||
    !state.lastName.trim() ||
    !state.relationship ||
    !state.type ||
    !shareValid;

  const canSubmit = !requiredMissing;

  const handleSubmit = () => {
    setSubmitted(true);
    if (!canSubmit) return;

    const benef: Beneficiary = {
      id: isEditMode && editingBeneficiary ? editingBeneficiary.id : crypto?.randomUUID ? crypto.randomUUID() : `ben_${Date.now()}`,
      name: `${state.firstName.trim()} ${state.lastName.trim()}`.trim() || state.firstName.trim() || state.lastName.trim(),
      relationship: state.relationship,
      type: state.type as "primary" | "contingent",
      sharePercentage: shareNum,
      isFromDependents: false,
    };
    if (isEditMode && onUpdate) {
      onUpdate(benef);
    } else {
      onAdd(benef);
    }
    onOpenChange(false);
  };

  const formContent = (
    <div className="flex flex-col gap-4">

      {/* First Name */}
      <div className="flex flex-col gap-1">
        <WexLabel className="text-[14px] text-muted-foreground">First Name</WexLabel>
        <WexInput
          inputSize="lg"
          placeholder="First Name"
          value={state.firstName}
          onChange={(e) => setState((s) => ({ ...s, firstName: e.target.value }))}
        />
        {submitted && !state.firstName.trim() && (
          <div className="text-xs text-destructive">First name is required.</div>
        )}
      </div>

      {/* Middle Name */}
      <div className="flex flex-col gap-1">
        <WexLabel className="text-[14px] text-muted-foreground">Middle Name</WexLabel>
        <WexInput
          inputSize="lg"
          placeholder="Middle Name"
          value={state.middleName}
          onChange={(e) => setState((s) => ({ ...s, middleName: e.target.value }))}
        />
      </div>

      {/* Last Name */}
      <div className="flex flex-col gap-1">
        <WexLabel className="text-[14px] text-muted-foreground">Last Name</WexLabel>
        <WexInput
          inputSize="lg"
          placeholder="Last Name"
          value={state.lastName}
          onChange={(e) => setState((s) => ({ ...s, lastName: e.target.value }))}
        />
        {submitted && !state.lastName.trim() && (
          <div className="text-xs text-destructive">Last name is required.</div>
        )}
      </div>

      {/* SSN */}
      <div className="flex flex-col gap-1">
        <WexLabel className="text-[14px] text-muted-foreground">Social Security Number</WexLabel>
        <WexInput
          inputSize="lg"
          placeholder="Social Security Number"
          inputMode="numeric"
          value={state.ssn}
          onChange={(e) => setState((s) => ({ ...s, ssn: e.target.value }))}
        />
      </div>

      {/* Birth Date */}
      <div className="flex flex-col gap-1">
        <WexLabel className="text-[14px] text-muted-foreground">Birth Date</WexLabel>
        <WexDatePicker
          date={state.birthDate}
          onDateChange={(d) => setState((s) => ({ ...s, birthDate: d }))}
          placeholder="Select birth date"
          className="w-full [&_button]:w-full [&_button]:h-12 [&_button]:border [&_button]:border-input [&_button]:rounded-md"
        />
      </div>

      {/* Relationship */}
      <div className="flex flex-col gap-1">
        <WexLabel className="text-[14px] text-muted-foreground">Relationship</WexLabel>
        <WexSelect value={state.relationship} onValueChange={(v) => setState((s) => ({ ...s, relationship: v }))}>
          <WexSelect.Trigger className="w-full h-12 border border-input rounded-md">
            <WexSelect.Value placeholder="Select relationship" />
          </WexSelect.Trigger>
          <WexSelect.Content>
            <WexSelect.Item value="Spouse">Spouse</WexSelect.Item>
            <WexSelect.Item value="Child">Child</WexSelect.Item>
            <WexSelect.Item value="Parent">Parent</WexSelect.Item>
            <WexSelect.Item value="Sibling">Sibling</WexSelect.Item>
            <WexSelect.Item value="Trust">Trust</WexSelect.Item>
            <WexSelect.Item value="Estate">Estate</WexSelect.Item>
            <WexSelect.Item value="Other">Other</WexSelect.Item>
          </WexSelect.Content>
        </WexSelect>
        {submitted && !state.relationship && (
          <div className="text-xs text-destructive">Relationship is required.</div>
        )}
      </div>

      {/* Beneficiary Type */}
      <div className="flex items-center gap-2">
        <WexLabel className="text-[14px] text-muted-foreground">
          Beneficiary Type:
        </WexLabel>
        <WexRadioGroup
          value={state.type}
          onValueChange={(v) => setState((s) => ({ ...s, type: v as "primary" | "contingent" }))}
          className="flex items-center gap-4"
        >
          <div className="flex items-center gap-2">
            <WexRadioGroup.Item
              value="primary"
              id="benef-primary"
              disabled={primaryDisabled}
            />
            <WexLabel
              htmlFor="benef-primary"
              className={cn("text-[14px]", primaryDisabled ? "text-muted-foreground cursor-not-allowed" : "text-foreground")}
            >
              Primary
              {primaryDisabled && (
                <span className="ml-1 text-[11px] text-muted-foreground">(already assigned)</span>
              )}
            </WexLabel>
          </div>
          <div className="flex items-center gap-2">
            <WexRadioGroup.Item value="contingent" id="benef-contingent" />
            <WexLabel htmlFor="benef-contingent" className="text-[14px] text-foreground">
              Contingent
            </WexLabel>
          </div>
        </WexRadioGroup>
      </div>
      {submitted && !state.type && (
        <div className="-mt-2 text-xs text-destructive">Beneficiary type is required.</div>
      )}

      {/* Share Percentage */}
      <div className="flex flex-col gap-1">
        <WexLabel className="text-[14px] text-muted-foreground">Share Percentage</WexLabel>
        <WexInput
          inputSize="lg"
          placeholder="Share Percentage"
          type="number"
          min={1}
          max={100}
          value={state.sharePercentage}
          onChange={(e) => setState((s) => ({ ...s, sharePercentage: e.target.value }))}
        />
        {submitted && !shareValid && (
          <div className="text-xs text-destructive">Share percentage must be between 1 and 100.</div>
        )}
      </div>

    </div>
  );

  if (isEnrollmentFlow) {
    if (!open) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-[min(512px,90vw)] max-h-[90vh] flex flex-col rounded-xl bg-background p-6 shadow-xl">
          <h3 className="text-[20px] font-bold text-foreground mb-4">
            {isEditMode ? "Edit Beneficiary Information" : "Add Beneficiary Information"}
          </h3>
          
          <div className="overflow-y-auto pr-2 -mr-2">
            <div className="pb-4">
              {formContent}
            </div>
          </div>

          <div className="mt-6 flex justify-between gap-2">
            <WexButton
              variant="ghost"
              className="text-foreground"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </WexButton>
            <WexButton intent="primary" onClick={handleSubmit} disabled={!canSubmit && submitted}>
              {isEditMode ? (
                "Save Changes"
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Beneficiary
                </>
              )}
            </WexButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <WexDialog open={open} onOpenChange={onOpenChange}>
      <WexDialog.Content aria-describedby={undefined}>
        <WexDialog.Header>
          <WexDialog.Title>{isEditMode ? "Edit Beneficiary Information" : "Add Beneficiary Information"}</WexDialog.Title>
        </WexDialog.Header>

        <div className="px-6 pt-4 pb-2">
          {formContent}
        </div>

        <WexDialog.Footer className="justify-between">
          <WexButton
            variant="ghost"
            className="text-foreground"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </WexButton>
          <WexButton intent="primary" onClick={handleSubmit} disabled={!canSubmit && submitted}>
            {isEditMode ? (
              "Save Changes"
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Add Beneficiary
              </>
            )}
          </WexButton>
        </WexDialog.Footer>
      </WexDialog.Content>
    </WexDialog>
  );
}

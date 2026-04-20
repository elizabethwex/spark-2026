import * as React from "react";
import { Plus } from "lucide-react";
import { WexButton } from "@wex/components-react/actions";
import { WexDialog } from "@wex/components-react/overlays";
import { WexSelect, WexInput, WexDatePicker, WexRadioGroup } from "@wex/components-react/form-inputs";
import { WexLabel } from "@wex/components-react/form-structure";
import type { Dependent } from "./DependentCard";

type AddDependentModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (dependent: Dependent) => void;
  editDependent?: Dependent | null;
  onUpdate?: (dependent: Dependent) => void;
  isEnrollmentFlow?: boolean;
};

type FormState = {
  firstName: string;
  middleName: string;
  lastName: string;
  ssn: string;
  birthDate: Date | undefined;
  gender: string;
  fullTimeStudent: "yes" | "no" | "";
  relationship: string;
};

const initialState: FormState = {
  firstName: "",
  middleName: "",
  lastName: "",
  ssn: "",
  birthDate: undefined,
  gender: "",
  fullTimeStudent: "",
  relationship: "",
};

function yearsOldLabel(birthDate: Date | undefined): string {
  if (!birthDate) return "";
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return `${age} years old`;
}

function formStateFromDependent(ed: Dependent): FormState {
  const parts = (ed.firstName != null && ed.lastName != null)
    ? { first: ed.firstName, middle: ed.middleName ?? "", last: ed.lastName }
    : (() => {
        const tokens = ed.name.trim().split(/\s+/);
        if (tokens.length >= 2) {
          return { first: tokens[0], middle: tokens.slice(1, -1).join(" "), last: tokens[tokens.length - 1] };
        }
        return { first: tokens[0] ?? "", middle: "", last: "" };
      })();
  return {
    firstName: parts.first,
    middleName: parts.middle,
    lastName: parts.last,
    ssn: ed.ssn ?? "",
    birthDate: ed.birthDate ? new Date(ed.birthDate) : undefined,
    gender: ed.gender ?? "",
    fullTimeStudent: (ed.fullTimeStudent as "yes" | "no" | "") ?? "",
    relationship: ed.relationship ?? "",
  };
}

export default function AddDependentModal({ open, onOpenChange, onAdd, editDependent = null, onUpdate, isEnrollmentFlow }: AddDependentModalProps) {
  const [state, setState] = React.useState<FormState>(initialState);
  const [submitted, setSubmitted] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      setState(initialState);
      setSubmitted(false);
      return;
    }
    if (editDependent) {
      setState(formStateFromDependent(editDependent));
    } else {
      setState(initialState);
    }
    setSubmitted(false);
  }, [open, editDependent]);

  const requiredMissing =
    !state.firstName.trim() ||
    !state.lastName.trim() ||
    !state.birthDate ||
    !state.gender ||
    !state.relationship;

  const canSubmit = !requiredMissing;

  const buildDependentFromState = (id: string): Dependent => {
    const age = yearsOldLabel(state.birthDate);
    const name = `${state.firstName.trim()} ${state.lastName.trim()}`;
    return {
      id,
      name,
      ageLabel: age || "—",
      firstName: state.firstName.trim() || undefined,
      middleName: state.middleName.trim() || undefined,
      lastName: state.lastName.trim() || undefined,
      ssn: state.ssn.trim() || undefined,
      birthDate: state.birthDate?.toISOString?.() ?? undefined,
      gender: state.gender || undefined,
      fullTimeStudent: state.fullTimeStudent || undefined,
      relationship: state.relationship || undefined,
    };
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (!canSubmit) return;

    if (editDependent && onUpdate) {
      const updated = { ...buildDependentFromState(editDependent.id), userAdded: true };
      onUpdate(updated);
    } else {
      const dep: Dependent = {
        ...buildDependentFromState(crypto?.randomUUID ? crypto.randomUUID() : `dep_${Date.now()}`),
      };
      onAdd(dep);
    }
    onOpenChange(false);
  };

  const isEditMode = Boolean(editDependent);

  const formContent = (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <WexLabel className="text-[14px] text-muted-foreground">First Name</WexLabel>
        <WexInput
          inputSize="lg"
          placeholder="First Name"
          value={state.firstName}
          onChange={(e) => setState((s) => ({ ...s, firstName: e.target.value }))}
        />
        {submitted && !state.firstName.trim() && (
          <div className="mt-1 text-xs text-destructive">First name is required.</div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <WexLabel className="text-[14px] text-muted-foreground">Middle Name</WexLabel>
        <WexInput
          inputSize="lg"
          placeholder="Middle Name"
          value={state.middleName}
          onChange={(e) => setState((s) => ({ ...s, middleName: e.target.value }))}
        />
      </div>

      <div className="flex flex-col gap-1">
        <WexLabel className="text-[14px] text-muted-foreground">Last Name</WexLabel>
        <WexInput
          inputSize="lg"
          placeholder="Last Name"
          value={state.lastName}
          onChange={(e) => setState((s) => ({ ...s, lastName: e.target.value }))}
        />
        {submitted && !state.lastName.trim() && (
          <div className="mt-1 text-xs text-destructive">Last name is required.</div>
        )}
      </div>

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

      <div className="flex flex-col gap-1">
        <WexLabel className="text-[14px] text-muted-foreground">Birth Date</WexLabel>
        <WexDatePicker
          date={state.birthDate}
          onDateChange={(d) => setState((s) => ({ ...s, birthDate: d }))}
          placeholder="Select birth date"
          className="w-full [&_button]:w-full [&_button]:h-12 [&_button]:border [&_button]:border-input [&_button]:rounded-md"
        />
        {submitted && !state.birthDate && (
          <div className="text-xs text-destructive">Birth date is required.</div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <WexLabel className="text-[14px] text-muted-foreground">Gender</WexLabel>
        <WexSelect value={state.gender} onValueChange={(v) => setState((s) => ({ ...s, gender: v }))}>
          <WexSelect.Trigger className="w-full h-12 border border-input rounded-md">
            <WexSelect.Value placeholder="Select gender" />
          </WexSelect.Trigger>
          <WexSelect.Content>
            <WexSelect.Item value="female">Female</WexSelect.Item>
            <WexSelect.Item value="male">Male</WexSelect.Item>
            <WexSelect.Item value="nonbinary">Non-binary</WexSelect.Item>
            <WexSelect.Item value="prefer-not">Prefer not to say</WexSelect.Item>
          </WexSelect.Content>
        </WexSelect>
        {submitted && !state.gender && (
          <div className="text-xs text-destructive">Gender is required.</div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <WexLabel className="w-[146px] text-[16px] leading-6 tracking-[0.32px] text-muted-foreground">
          Full Time Student:
        </WexLabel>
        <WexRadioGroup
          value={state.fullTimeStudent}
          onValueChange={(v) => setState((s) => ({ ...s, fullTimeStudent: v as "yes" | "no" }))}
          className="flex items-center gap-4"
        >
          <div className="flex items-center gap-2">
            <WexRadioGroup.Item value="yes" id="fts-yes" />
            <WexLabel htmlFor="fts-yes" className="text-[14px] text-foreground">Yes</WexLabel>
          </div>
          <div className="flex items-center gap-2">
            <WexRadioGroup.Item value="no" id="fts-no" />
            <WexLabel htmlFor="fts-no" className="text-[14px] text-foreground">No</WexLabel>
          </div>
        </WexRadioGroup>
      </div>

      <div className="flex flex-col gap-1">
        <WexLabel className="text-[14px] text-muted-foreground">Relationship</WexLabel>
        <WexSelect value={state.relationship} onValueChange={(v) => setState((s) => ({ ...s, relationship: v }))}>
          <WexSelect.Trigger className="w-full h-12 border border-input rounded-md">
            <WexSelect.Value placeholder="Select relationship" />
          </WexSelect.Trigger>
          <WexSelect.Content>
            <WexSelect.Item value="spouse">Spouse</WexSelect.Item>
            <WexSelect.Item value="child">Child</WexSelect.Item>
            <WexSelect.Item value="domestic-partner">Domestic Partner</WexSelect.Item>
            <WexSelect.Item value="other">Other</WexSelect.Item>
          </WexSelect.Content>
        </WexSelect>
        {submitted && !state.relationship && (
          <div className="text-xs text-destructive">Relationship is required.</div>
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
            {isEditMode ? "Edit Dependent Information" : "Add Dependent Information"}
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
                "Save changes"
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Dependent
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
          <WexDialog.Title className="text-[20px] text-[24px] text-[20px]">
            {isEditMode ? "Edit Dependent Information" : "Add Dependent Information"}
          </WexDialog.Title>
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
              "Save changes"
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Add Dependent
              </>
            )}
          </WexButton>
        </WexDialog.Footer>
      </WexDialog.Content>
    </WexDialog>
  );
}
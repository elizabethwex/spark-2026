import * as React from "react";
import { Plus, Trash2, Info } from "lucide-react";
import {
  Button,
  Checkbox,
  FloatLabel,
  Label,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@wexinc-healthbenefits/ben-ui-kit";
import { QuestionOptionCard } from "@/components/QuestionOptionCard";

interface Beneficiary {
  id: string;
  type: "existing_dependent" | "new";
  dependentId?: string;
  dependentName?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  ssn?: string;
  birthDate?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  relationship?: string;
  sharePercentage: string;
  beneficiaryType: "Primary" | "Contingent" | "";
}

interface Dependent {
  id: string;
  name: string;
}

export default function HSABeneficiariesPage() {
  const availableDependents: Dependent[] = [
    { id: "1", name: "Ben Smith" },
    { id: "2", name: "James Smith" },
  ];

  const [hasBeneficiaries, setHasBeneficiaries] = React.useState<string | null>(null);
  const [selectedDependentIds, setSelectedDependentIds] = React.useState<Set<string>>(new Set());
  const [dependentBeneficiaries, setDependentBeneficiaries] = React.useState<Map<string, Partial<Beneficiary>>>(new Map());
  const [newBeneficiaries, setNewBeneficiaries] = React.useState<Beneficiary[]>([]);
  const [validationError] = React.useState<string>("");

  const handleDependentToggle = (dependentId: string, dependentName: string) => {
    const newSelected = new Set(selectedDependentIds);
    const newBens = new Map(dependentBeneficiaries);

    if (newSelected.has(dependentId)) {
      newSelected.delete(dependentId);
      newBens.delete(dependentId);
    } else {
      newSelected.add(dependentId);
      newBens.set(dependentId, {
        id: dependentId,
        type: "existing_dependent",
        dependentId,
        dependentName,
        sharePercentage: "",
        beneficiaryType: "",
      });
    }

    setSelectedDependentIds(newSelected);
    setDependentBeneficiaries(newBens);
  };

  const handleDependentBeneficiaryChange = (dependentId: string, field: keyof Beneficiary, value: string) => {
    const newBens = new Map(dependentBeneficiaries);
    const current = newBens.get(dependentId) || {};
    newBens.set(dependentId, { ...current, [field]: value });
    setDependentBeneficiaries(newBens);
  };

  const handleAddNewBeneficiary = () => {
    setNewBeneficiaries((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: "new",
        firstName: "", middleName: "", lastName: "", ssn: "", birthDate: "",
        addressLine1: "", addressLine2: "", city: "", state: "", zipCode: "",
        relationship: "", sharePercentage: "", beneficiaryType: "",
      },
    ]);
  };

  const handleRemoveNewBeneficiary = (index: number) => {
    setNewBeneficiaries((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNewBeneficiaryChange = (index: number, field: keyof Beneficiary, value: string) => {
    setNewBeneficiaries((prev) =>
      prev.map((ben, i) => (i === index ? { ...ben, [field]: value } : ben))
    );
  };

  const showForm = hasBeneficiaries === "yes";
  const canRemoveNewBeneficiary = newBeneficiaries.length > 1;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex justify-center pt-14 px-8 pb-8">
        <div className="w-[362px] flex flex-col gap-12">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold leading-8 tracking-[-0.456px] text-black">
              Do you have Beneficiaries?
            </h2>

            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-foreground" />
              <p className="text-sm leading-6 tracking-[-0.084px] text-muted-foreground">
                Why you may designate a beneficiary for your HSA?
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <QuestionOptionCard option="Yes" selected={hasBeneficiaries === "yes"} onSelect={() => setHasBeneficiaries("yes")} />
              <QuestionOptionCard option="No" selected={hasBeneficiaries === "no"} onSelect={() => setHasBeneficiaries("no")} />
            </div>
          </div>

          {showForm && (
            <>
              <div className="flex flex-col gap-4">
                <h3 className="text-base font-semibold leading-[22px] tracking-[0.32px] text-black">
                  Select an existing dependent
                </h3>
                <p className="text-base leading-6 tracking-[-0.176px] text-muted-foreground">
                  You can select a beneficiary from your dependents or pre-fill the form with the dependent information
                </p>

                <div className="flex flex-col gap-3">
                  {availableDependents.map((dependent) => {
                    const isSelected = selectedDependentIds.has(dependent.id);
                    const beneficiaryData = dependentBeneficiaries.get(dependent.id);

                    return (
                      <div key={dependent.id} className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`dependent-${dependent.id}`}
                            checked={isSelected}
                            onCheckedChange={() => handleDependentToggle(dependent.id, dependent.name)}
                          />
                          <Label htmlFor={`dependent-${dependent.id}`} className="text-sm leading-6 tracking-[-0.084px] text-foreground">
                            {dependent.name}
                          </Label>
                        </div>

                        {isSelected && (
                          <div className="ml-6 flex flex-col gap-3">
                            <div className="relative">
                              <FloatLabel
                                label="Share Percentage" size="lg"
                                value={beneficiaryData?.sharePercentage || ""}
                                onChange={(e) => handleDependentBeneficiaryChange(dependent.id, "sharePercentage", e.target.value)}
                                required
                              />
                              <Info className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground" />
                            </div>

                            <div className="flex items-center gap-3">
                              <Info className="h-5 w-5 text-foreground" />
                              <span className="text-base leading-6 tracking-[0.32px] text-muted-foreground">Type:</span>
                              <RadioGroup value={beneficiaryData?.beneficiaryType || ""} onValueChange={(value) => handleDependentBeneficiaryChange(dependent.id, "beneficiaryType", value)} className="flex gap-3">
                                <div className="flex items-center gap-1">
                                  <RadioGroupItem value="Primary" id={`type-primary-${dependent.id}`} />
                                  <Label htmlFor={`type-primary-${dependent.id}`} className="text-sm leading-6 tracking-[-0.084px] text-foreground">Primary</Label>
                                </div>
                                <div className="flex items-center gap-1">
                                  <RadioGroupItem value="Contingent" id={`type-contingent-${dependent.id}`} />
                                  <Label htmlFor={`type-contingent-${dependent.id}`} className="text-sm leading-6 tracking-[-0.084px] text-foreground">Contingent</Label>
                                </div>
                              </RadioGroup>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h3 className="text-base font-semibold leading-[22px] tracking-[0.32px] text-black">
                  Add a new Beneficiary
                </h3>

                {newBeneficiaries.map((beneficiary, index) => (
                  <div key={beneficiary.id} className="flex flex-col gap-4">
                    {index > 0 && (
                      <div className="border-t border-border pt-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-sm font-semibold text-foreground">New Beneficiary {index + 1}</h4>
                          {canRemoveNewBeneficiary && (
                            <Button variant="ghost" onClick={() => handleRemoveNewBeneficiary(index)} className="px-3 py-1 text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4 mr-1.5" />Remove
                            </Button>
                          )}
                        </div>
                      </div>
                    )}

                    {index === 0 && canRemoveNewBeneficiary && (
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold text-foreground">New Beneficiary 1</h4>
                        <Button variant="ghost" onClick={() => handleRemoveNewBeneficiary(index)} className="px-3 py-1 text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4 mr-1.5" />Remove
                        </Button>
                      </div>
                    )}

                    <FloatLabel label="First Name" size="lg" value={beneficiary.firstName || ""} onChange={(e) => handleNewBeneficiaryChange(index, "firstName", e.target.value)} required />
                    <FloatLabel label="Middle Name" size="lg" value={beneficiary.middleName || ""} onChange={(e) => handleNewBeneficiaryChange(index, "middleName", e.target.value)} />
                    <FloatLabel label="Last Name" size="lg" value={beneficiary.lastName || ""} onChange={(e) => handleNewBeneficiaryChange(index, "lastName", e.target.value)} required />
                    <FloatLabel label="Social Security Number" size="lg" value={beneficiary.ssn || ""} onChange={(e) => handleNewBeneficiaryChange(index, "ssn", e.target.value)} required />
                    <FloatLabel label="Birth Date" size="lg" type="text" value={beneficiary.birthDate || ""} onChange={(e) => handleNewBeneficiaryChange(index, "birthDate", e.target.value)} required />
                    <FloatLabel label="Address Line 1" size="lg" value={beneficiary.addressLine1 || ""} onChange={(e) => handleNewBeneficiaryChange(index, "addressLine1", e.target.value)} required />
                    <FloatLabel label="Address Line 2" size="lg" value={beneficiary.addressLine2 || ""} onChange={(e) => handleNewBeneficiaryChange(index, "addressLine2", e.target.value)} />
                    <FloatLabel label="City" size="lg" value={beneficiary.city || ""} onChange={(e) => handleNewBeneficiaryChange(index, "city", e.target.value)} required />

                    <Select value={beneficiary.state || ""} onValueChange={(value) => handleNewBeneficiaryChange(index, "state", value)} required>
                      <SelectTrigger className="h-16"><SelectValue placeholder="State" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NY">New York</SelectItem>
                        <SelectItem value="CA">California</SelectItem>
                        <SelectItem value="TX">Texas</SelectItem>
                        <SelectItem value="FL">Florida</SelectItem>
                        <SelectItem value="IL">Illinois</SelectItem>
                      </SelectContent>
                    </Select>

                    <FloatLabel label="Zip Code" size="lg" value={beneficiary.zipCode || ""} onChange={(e) => handleNewBeneficiaryChange(index, "zipCode", e.target.value)} required />

                    <div className="flex items-center gap-3">
                      <Info className="h-5 w-5 text-foreground" />
                      <span className="text-base leading-6 tracking-[0.32px] text-muted-foreground">Type:</span>
                      <RadioGroup value={beneficiary.beneficiaryType || ""} onValueChange={(value) => handleNewBeneficiaryChange(index, "beneficiaryType", value)} className="flex gap-3">
                        <div className="flex items-center gap-1">
                          <RadioGroupItem value="Primary" id={`new-type-primary-${index}`} />
                          <Label htmlFor={`new-type-primary-${index}`} className="text-sm leading-6 tracking-[-0.084px] text-foreground">Primary</Label>
                        </div>
                        <div className="flex items-center gap-1">
                          <RadioGroupItem value="Contingent" id={`new-type-contingent-${index}`} />
                          <Label htmlFor={`new-type-contingent-${index}`} className="text-sm leading-6 tracking-[-0.084px] text-foreground">Contingent</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <Select value={beneficiary.relationship || ""} onValueChange={(value) => handleNewBeneficiaryChange(index, "relationship", value)} required>
                      <SelectTrigger className="h-16"><SelectValue placeholder="Relationship" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="sibling">Sibling</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="relative">
                      <FloatLabel label="Share Percentage" size="lg" value={beneficiary.sharePercentage || ""} onChange={(e) => handleNewBeneficiaryChange(index, "sharePercentage", e.target.value)} required />
                      <Info className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground pointer-events-none" />
                    </div>
                  </div>
                ))}

                <Button variant="ghost" onClick={handleAddNewBeneficiary} className="self-start px-3 py-1">
                  <Plus className="h-4 w-4 mr-1.5" />Add New Beneficiary
                </Button>
              </div>

              {validationError && (
                <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
                  <p className="text-sm text-destructive font-medium">{validationError}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

import * as React from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  Button,
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

interface Dependent {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  ssn: string;
  birthDate: string;
  gender: string;
  fullTimeStudent: string;
  relationship: string;
}

export default function HSADependentsPage() {
  const [hasDependents, setHasDependents] = React.useState<string | null>(null);
  const [dependents, setDependents] = React.useState<Dependent[]>([
    {
      id: "1",
      firstName: "",
      middleName: "",
      lastName: "",
      ssn: "",
      birthDate: "",
      gender: "",
      fullTimeStudent: "no",
      relationship: "",
    },
  ]);

  const handleDependentChange = (index: number, field: keyof Dependent, value: string) => {
    setDependents((prev) =>
      prev.map((dep, i) => (i === index ? { ...dep, [field]: value } : dep))
    );
  };

  const handleAddDependent = () => {
    setDependents((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        firstName: "",
        middleName: "",
        lastName: "",
        ssn: "",
        birthDate: "",
        gender: "",
        fullTimeStudent: "no",
        relationship: "",
      },
    ]);
  };

  const handleRemoveDependent = (index: number) => {
    setDependents((prev) => prev.filter((_, i) => i !== index));
  };

  const showForm = hasDependents === "yes";
  const canRemove = dependents.length > 1;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex justify-center pt-14 px-8 pb-8">
        <div className="w-[362px] flex flex-col gap-12">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold leading-8 tracking-[-0.456px] text-black">
              Do you have dependents?
            </h2>

            <div className="flex flex-col gap-4">
              <QuestionOptionCard
                option="Yes"
                selected={hasDependents === "yes"}
                onSelect={() => setHasDependents("yes")}
              />
              <QuestionOptionCard
                option="No"
                selected={hasDependents === "no"}
                onSelect={() => setHasDependents("no")}
              />
            </div>
          </div>

          {showForm && (
            <div className="flex flex-col gap-4">
              <h3 className="text-base font-semibold leading-[22px] tracking-[0.32px] text-black">
                Add dependent information
              </h3>

              {dependents.map((dependent, index) => (
                <div key={dependent.id} className="flex flex-col gap-4">
                  {index > 0 && (
                    <div className="border-t border-border pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-semibold text-foreground">
                          Dependent {index + 1}
                        </h4>
                        {canRemove && (
                          <Button
                            variant="ghost"
                            onClick={() => handleRemoveDependent(index)}
                            className="px-3 py-1 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-1.5" />
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  {index === 0 && canRemove && (
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-foreground">
                        Dependent 1
                      </h4>
                      <Button
                        variant="ghost"
                        onClick={() => handleRemoveDependent(index)}
                        className="px-3 py-1 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-1.5" />
                        Remove
                      </Button>
                    </div>
                  )}

                  <FloatLabel label="First Name" size="lg" value={dependent.firstName} onChange={(e) => handleDependentChange(index, "firstName", e.target.value)} required />
                  <FloatLabel label="Middle Name" size="lg" value={dependent.middleName} onChange={(e) => handleDependentChange(index, "middleName", e.target.value)} />
                  <FloatLabel label="Last Name" size="lg" value={dependent.lastName} onChange={(e) => handleDependentChange(index, "lastName", e.target.value)} required />
                  <FloatLabel label="Social Security Number" size="lg" value={dependent.ssn} onChange={(e) => handleDependentChange(index, "ssn", e.target.value)} required />
                  <FloatLabel label="Birth Date" size="lg" type="text" value={dependent.birthDate} onChange={(e) => handleDependentChange(index, "birthDate", e.target.value)} required />

                  <Select value={dependent.gender} onValueChange={(value) => handleDependentChange(index, "gender", value)} required>
                    <SelectTrigger className="h-16">
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-base leading-6 tracking-[0.32px] text-muted-foreground">Full Time Student:</span>
                    <RadioGroup value={dependent.fullTimeStudent} onValueChange={(value) => handleDependentChange(index, "fullTimeStudent", value)} className="flex gap-3">
                      <div className="flex items-center gap-1">
                        <RadioGroupItem value="yes" id={`student-yes-${index}`} />
                        <Label htmlFor={`student-yes-${index}`} className="text-sm leading-6 tracking-[-0.084px] text-foreground">Yes</Label>
                      </div>
                      <div className="flex items-center gap-1">
                        <RadioGroupItem value="no" id={`student-no-${index}`} />
                        <Label htmlFor={`student-no-${index}`} className="text-sm leading-6 tracking-[-0.084px] text-foreground">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Select value={dependent.relationship} onValueChange={(value) => handleDependentChange(index, "relationship", value)} required>
                    <SelectTrigger className="h-16">
                      <SelectValue placeholder="Relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spouse">Spouse</SelectItem>
                      <SelectItem value="child">Child</SelectItem>
                      <SelectItem value="stepchild">Stepchild</SelectItem>
                      <SelectItem value="domestic-partner">Domestic Partner</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}

              <Button variant="ghost" onClick={handleAddDependent} className="self-start px-3 py-1">
                <Plus className="h-4 w-4 mr-1.5" />
                Add Dependent
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import * as React from "react";
import {
  Checkbox,
  FloatLabel,
  FloatLabelSelect,
  Label,
  RadioGroup,
  RadioGroupItem,
} from "@wexinc-healthbenefits/ben-ui-kit";

export default function HSAProfileReview() {
  const [formData, setFormData] = React.useState({
    firstName: "Penny",
    middleName: "",
    lastName: "Smith",
    birthDate: "07/05/1995",
    participantId: "78445225",
    gender: "Female",
    maritalStatus: "married",
    addressLine1: "123 Main Street",
    addressLine2: "",
    city: "Anytown",
    state: "NY",
    zipCode: "10011",
    mailingAddressSame: true,
    homePhone: "+1 212 555 4567",
    email: "useremail@email.com",
    confirmEmail: "useremail@email.com",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMaritalStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, maritalStatus: value }));
  };

  const handleMailingAddressChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, mailingAddressSame: checked }));
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex justify-center pt-14 px-8 pb-8">
        <div className="w-[400px] flex flex-col gap-12">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold leading-8 tracking-[-0.456px] text-black">
              Review your profile
            </h2>
            <p className="text-base font-normal leading-6 tracking-[-0.176px] text-foreground">
              All fields must be completed. If you need to update any information please contact the administrator
            </p>

            <div className="flex flex-col gap-4">
              <FloatLabel
                label="First Name"
                size="lg"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                disabled
              />
              <FloatLabel
                label="Middle Name"
                size="lg"
                value={formData.middleName}
                onChange={(e) => handleInputChange("middleName", e.target.value)}
                disabled
              />
              <FloatLabel
                label="Last Name"
                size="lg"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                disabled
              />
              <FloatLabel
                label="Birth Date"
                size="lg"
                type="text"
                value={formData.birthDate}
                onChange={(e) => handleInputChange("birthDate", e.target.value)}
                disabled
              />
              <FloatLabel
                label="Participant Account ID"
                size="lg"
                value={formData.participantId}
                onChange={(e) => handleInputChange("participantId", e.target.value)}
                disabled
              />
              <FloatLabelSelect value={formData.gender} onValueChange={(v) => handleInputChange("gender", v)} disabled>
                <FloatLabelSelect.Trigger label="Gender" size="lg" />
                <FloatLabelSelect.Content>
                  <FloatLabelSelect.Item value="Female">Female</FloatLabelSelect.Item>
                  <FloatLabelSelect.Item value="Male">Male</FloatLabelSelect.Item>
                  <FloatLabelSelect.Item value="Other">Other</FloatLabelSelect.Item>
                </FloatLabelSelect.Content>
              </FloatLabelSelect>

              <div className="flex items-center gap-3 h-6 mt-2">
                <span className="text-base leading-6 tracking-[0.32px] text-muted-foreground">
                  Marital Status:
                </span>
                <RadioGroup
                  value={formData.maritalStatus}
                  onValueChange={handleMaritalStatusChange}
                  className="flex gap-3"
                  disabled
                >
                  <div className="flex items-center gap-1">
                    <RadioGroupItem value="married" id="married" disabled />
                    <Label htmlFor="married" className="text-sm leading-6 tracking-[-0.084px] text-foreground">
                      Married
                    </Label>
                  </div>
                  <div className="flex items-center gap-1">
                    <RadioGroupItem value="single" id="single" disabled />
                    <Label htmlFor="single" className="text-sm leading-6 tracking-[-0.084px] text-foreground">
                      Single
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold leading-8 tracking-[-0.456px] text-black">
              Contact Information
            </h2>

            <div className="flex flex-col gap-4">
              <FloatLabel
                label="Address Line 1"
                size="lg"
                value={formData.addressLine1}
                onChange={(e) => handleInputChange("addressLine1", e.target.value)}
                disabled
              />
              <FloatLabel
                label="Address Line 2"
                size="lg"
                value={formData.addressLine2}
                onChange={(e) => handleInputChange("addressLine2", e.target.value)}
                disabled
              />
              <FloatLabel
                label="City"
                size="lg"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                disabled
              />
              <FloatLabel
                label="State"
                size="lg"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                disabled
              />
              <FloatLabel
                label="Zip Code"
                size="lg"
                value={formData.zipCode}
                onChange={(e) => handleInputChange("zipCode", e.target.value)}
                disabled
              />

              <div className="flex items-center gap-2 mt-2">
                <span className="text-base leading-6 tracking-[0.32px] text-muted-foreground">
                  Mailing Address:
                </span>
                <div className="flex items-center gap-1">
                  <Checkbox
                    checked={formData.mailingAddressSame}
                    onCheckedChange={handleMailingAddressChange}
                    disabled
                  />
                  <Label htmlFor="mailing-address" className="text-sm leading-6 tracking-[-0.084px] text-foreground">
                    Same as Home Address
                  </Label>
                </div>
              </div>

              <FloatLabel
                label="Home Phone"
                size="lg"
                type="tel"
                value={formData.homePhone}
                onChange={(e) => handleInputChange("homePhone", e.target.value)}
                disabled
              />
              <FloatLabel
                label="Email Address"
                size="lg"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled
              />
              <FloatLabel
                label="Confirm Email Address"
                size="lg"
                type="email"
                value={formData.confirmEmail}
                onChange={(e) => handleInputChange("confirmEmail", e.target.value)}
                disabled
              />
            </div>

            <p className="text-sm leading-[22px] tracking-[0.28px] text-muted-foreground">
              You will receive communications electronically about your benefits in lieu of paper documents. Your email address will not be shared or used for any other purpose.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

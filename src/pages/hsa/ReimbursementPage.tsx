import * as React from "react";
import { Building, Receipt, CreditCard, Info, Copy } from "lucide-react";
import {
  FloatLabel,
  Label,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectCardGroup,
} from "@wexinc-healthbenefits/ben-ui-kit";

type ReimbursementMethod = "direct-deposit" | "check" | "debit-card" | null;

interface BankAccountData {
  routingNumber: string;
  accountNumber: string;
  confirmAccountNumber: string;
  accountType: string;
  accountNickname: string;
}

interface BankInformationData {
  bankName: string;
  addressLine: string;
  city: string;
  state: string;
  zipCode: string;
}

interface DebitCardData {
  alternateMethod: string;
  separateCards: string;
}

const WEX_LOGO_SVG = "http://localhost:3845/assets/7060817bc7b10e987b718d2e158a2317d0216b42.svg";
const MASTERCARD_LOGO_SVG = "http://localhost:3845/assets/183128c06b9f2e5d26e081a01b9d83b3147cebec.svg";

export default function HSAReimbursementPage() {
  const [selectedMethod, setSelectedMethod] = React.useState<ReimbursementMethod>(null);

  const [bankAccount, setBankAccount] = React.useState<BankAccountData>({
    routingNumber: "", accountNumber: "", confirmAccountNumber: "", accountType: "", accountNickname: "",
  });

  const [bankInformation, setBankInformation] = React.useState<BankInformationData>({
    bankName: "", addressLine: "", city: "", state: "", zipCode: "",
  });

  const [debitCardData, setDebitCardData] = React.useState<DebitCardData>({
    alternateMethod: "", separateCards: "",
  });

  const reimbursementCards = [
    {
      id: "direct-deposit",
      title: "Direct Deposit",
      description: "Your reimbursement will be deposited into your bank account within 2-3 business days from the date we receive substantiation of your claims.",
      icon: <Building className="h-4 w-4 text-muted-foreground" />,
      showLink: false,
    },
    {
      id: "check",
      title: "Check",
      description: "Your reimbursement check will be sent to your home within 3-5 business days from the date we receive substantiation of your claims.",
      icon: <Receipt className="h-4 w-4 text-muted-foreground" />,
      showLink: false,
    },
    {
      id: "debit-card",
      title: "Debit Card",
      description: "Your Debit Card provides convenient access to your benefit dollars. Use the card to pay qualified medical expenses for you and your qualified dependents.",
      icon: <CreditCard className="h-4 w-4 text-muted-foreground" />,
      showLink: false,
    },
  ];

  const handleMethodChange = (value: string | string[]) => {
    const stringValue = Array.isArray(value) ? value[0] : value;
    setSelectedMethod(stringValue as ReimbursementMethod);
  };

  const handleCopyCardNumber = () => {
    navigator.clipboard.writeText("•••• •••• •••• 2344");
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex justify-center pt-14 px-8 pb-8">
        <div className="w-[362px] flex flex-col gap-12">
          <div className="flex flex-col gap-4">
            <h1 className="font-bold text-2xl leading-8 tracking-[-0.456px] text-black">
              Reimbursement method
            </h1>
            <p className="text-base leading-6 tracking-[-0.176px] text-foreground">
              Select the method in which you like to be reimbursed.
            </p>

            <SelectCardGroup
              type="radio"
              value={selectedMethod || ""}
              onValueChange={handleMethodChange}
              cards={reimbursementCards}
            />
          </div>

          {selectedMethod === "direct-deposit" && (
            <>
              <div className="flex flex-col gap-4">
                <h2 className="font-semibold text-base leading-[22px] tracking-[0.32px] text-black">Bank Account</h2>
                <p className="text-base leading-6 tracking-[-0.176px] text-foreground">Enter your bank account information to setup your direct deposit</p>

                <div className="flex flex-col gap-4">
                  <div className="relative">
                    <FloatLabel value={bankAccount.routingNumber} onChange={(e) => setBankAccount({ ...bankAccount, routingNumber: e.target.value })} label="Routing Number" required className="h-14" />
                    <Info className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground pointer-events-none" />
                  </div>
                  <FloatLabel value={bankAccount.accountNumber} onChange={(e) => setBankAccount({ ...bankAccount, accountNumber: e.target.value })} label="Account Number" required className="h-14" />
                  <FloatLabel value={bankAccount.confirmAccountNumber} onChange={(e) => setBankAccount({ ...bankAccount, confirmAccountNumber: e.target.value })} label="Confirm Account Number" required className="h-14" />

                  <div className="relative">
                    <Select value={bankAccount.accountType} onValueChange={(value) => setBankAccount({ ...bankAccount, accountType: value })}>
                      <SelectTrigger className="h-14 w-full"><SelectValue placeholder="Account Type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="checking">Checking</SelectItem>
                        <SelectItem value="savings">Savings</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="absolute left-[5px] top-[5px] w-[6px] h-[6px] rounded-full bg-destructive" />
                  </div>

                  <div className="relative">
                    <FloatLabel value={bankAccount.accountNickname} onChange={(e) => setBankAccount({ ...bankAccount, accountNickname: e.target.value })} label="Account Nickname" required className="h-14" />
                    <Info className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h2 className="font-semibold text-base leading-[22px] tracking-[0.32px] text-black">Bank Information</h2>
                <p className="text-base leading-6 tracking-[-0.176px] text-foreground">Enter your bank account information to setup your direct deposit</p>

                <div className="flex flex-col gap-4">
                  <FloatLabel value={bankInformation.bankName} onChange={(e) => setBankInformation({ ...bankInformation, bankName: e.target.value })} label="Bank Name" required className="h-14" />
                  <FloatLabel value={bankInformation.addressLine} onChange={(e) => setBankInformation({ ...bankInformation, addressLine: e.target.value })} label="Address Line" required className="h-14" />
                  <FloatLabel value={bankInformation.city} onChange={(e) => setBankInformation({ ...bankInformation, city: e.target.value })} label="City" required className="h-14" />

                  <div className="relative">
                    <Select value={bankInformation.state} onValueChange={(value) => setBankInformation({ ...bankInformation, state: value })}>
                      <SelectTrigger className="h-14 w-full"><SelectValue placeholder="State" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AL">Alabama</SelectItem>
                        <SelectItem value="AK">Alaska</SelectItem>
                        <SelectItem value="AZ">Arizona</SelectItem>
                        <SelectItem value="CA">California</SelectItem>
                        <SelectItem value="FL">Florida</SelectItem>
                        <SelectItem value="NY">New York</SelectItem>
                        <SelectItem value="TX">Texas</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="absolute left-[5px] top-[5px] w-[6px] h-[6px] rounded-full bg-destructive" />
                  </div>

                  <FloatLabel value={bankInformation.zipCode} onChange={(e) => setBankInformation({ ...bankInformation, zipCode: e.target.value })} label="Zip Code" required className="h-14" />
                </div>
              </div>
            </>
          )}

          {selectedMethod === "debit-card" && (
            <div className="flex flex-col gap-4 items-center">
              <p className="text-base leading-6 tracking-[-0.176px] text-foreground w-full">
                Debit Card selected. Please answer the questions below.
              </p>

              <div className="w-[362px] h-[240px] bg-[#253746] rounded-[14px] relative shadow-[0px_4.169px_10.422px_0px_rgba(2,13,36,0.15),0px_0px_1.042px_0px_rgba(2,13,36,0.3)]">
                <div className="absolute left-[16.67px] top-[16.67px]">
                  <img src={WEX_LOGO_SVG} alt="WEX" className="w-[129.231px] h-[36.864px]" />
                </div>
                <div className="absolute bottom-[85.46px] left-[22.93px] flex items-center gap-[12.506px]">
                  <p className="font-['Roboto_Mono'] text-[18.76px] leading-[27.097px] text-white">•••• •••• •••• 2344</p>
                  <button onClick={handleCopyCardNumber} className="flex items-center justify-center w-[20.844px] h-[20.844px] text-white hover:opacity-80">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="absolute bottom-[18.76px] left-[22.93px] font-['Roboto_Mono'] text-white">
                  <p className="text-[14.59px] leading-normal">EXP</p>
                  <p className="text-[18.76px] leading-[27.097px]">04/27</p>
                </div>
                <div className="absolute bottom-[18.76px] left-[126.1px] font-['Roboto_Mono'] text-white">
                  <p className="text-[14.59px] leading-normal">CVC/CVV</p>
                  <p className="text-[18.76px] leading-[27.097px]">•••</p>
                </div>
                <div className="absolute bottom-[16.25px] right-[15.63px]">
                  <img src={MASTERCARD_LOGO_SVG} alt="Mastercard" className="w-[66.7px] h-[41.065px]" />
                </div>
              </div>

              <div className="w-full">
                <ol className="list-decimal ml-6 mb-4">
                  <li className="text-base leading-6 tracking-[-0.176px] text-foreground">
                    What alternate reimbursement method would you like to use for the reimbursement of claims that are filled online?
                  </li>
                </ol>
                <RadioGroup value={debitCardData.alternateMethod} onValueChange={(value) => setDebitCardData({ ...debitCardData, alternateMethod: value })} className="flex flex-col gap-3 pl-4">
                  <div className="flex items-center gap-2"><RadioGroupItem value="direct-deposit" id="alt-direct-deposit" /><Label htmlFor="alt-direct-deposit" className="text-sm leading-6 tracking-[-0.084px] text-foreground cursor-pointer">Direct Deposit</Label></div>
                  <div className="flex items-center gap-2"><RadioGroupItem value="check" id="alt-check" /><Label htmlFor="alt-check" className="text-sm leading-6 tracking-[-0.084px] text-foreground cursor-pointer">Check</Label></div>
                  <div className="flex items-center gap-2"><RadioGroupItem value="stored-value-card" id="alt-stored-value" /><Label htmlFor="alt-stored-value" className="text-sm leading-6 tracking-[-0.084px] text-foreground cursor-pointer">Stored Value Card</Label></div>
                </RadioGroup>
              </div>

              <div className="w-full">
                <ol className="list-decimal ml-6 mb-4" start={2}>
                  <li className="text-base leading-6 tracking-[-0.176px] text-foreground">
                    Are any of your dependents using or would like to use separate debit cards?
                  </li>
                </ol>
                <RadioGroup value={debitCardData.separateCards} onValueChange={(value) => setDebitCardData({ ...debitCardData, separateCards: value })} className="flex flex-col gap-3 pl-4">
                  <div className="flex items-center gap-2"><RadioGroupItem value="yes" id="separate-yes" /><Label htmlFor="separate-yes" className="text-sm leading-6 tracking-[-0.084px] text-foreground cursor-pointer">Yes</Label></div>
                  <div className="flex items-center gap-2"><RadioGroupItem value="no" id="separate-no" /><Label htmlFor="separate-no" className="text-sm leading-6 tracking-[-0.084px] text-foreground cursor-pointer">No</Label></div>
                </RadioGroup>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

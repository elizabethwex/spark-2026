import { useState, useEffect, useMemo, useRef } from "react";
import { FadeInItem } from "@/components/layout/PageFadeIn";
import { useSearchParams, useLocation } from "react-router-dom";
import {
  Button, Alert, AlertDescription, AlertDialog, AlertDialogAction,
  AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, Badge,
  Calendar as CalendarComponent, Card, CardContent, Checkbox, Dialog, DialogClose,
  DialogContent, DialogFooter, DialogHeader, DialogTitle, DropdownMenu,
  DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Empty,
  EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle,
  FloatLabel, FloatLabelSelect, Label, Popover, PopoverContent, PopoverTrigger, RadioGroup,
  RadioGroupItem, Select, SelectCard, SelectContent, SelectItem, SelectTrigger,
  SelectValue, Separator, Sidebar, SidebarContent, SidebarGroup,
  SidebarGroupContent, SidebarGroupLabel, SidebarInset, SidebarMenu,
  SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarSeparator,
  Stepper, Switch, Tabs, TabsContent, TabsList, TabsTrigger, toast,
  Tooltip, TooltipContent, TooltipTrigger, Workspace, WorkspaceContent,
  WorkspaceMain, WorkspaceSidebar
} from "@wexinc-healthbenefits/ben-ui-kit";
import { ConsumerFooter } from "@/components/layout/Footer";
import { ConsumerNavigation } from "@/components/layout/ConsumerNavigation";
import { consumerPageBackgroundStyle } from "@/constants/consumerPageBackground";
import { Pencil, Info, Plus, Calendar, X, Trash2, MoreVertical, Eye, EyeOff, RefreshCw, AlertCircle, User, Users, HeartPlus, ShieldCheck, Landmark, CreditCard, Bell, UserLock, Lock, SquareArrowRight, DollarSign } from "lucide-react";
import { ReimbursementMethodsContent } from "@/pages/ReimbursementMethodsContent";
import {
  WEX_PROFILE_BANK_ACCOUNTS_KEY,
  migrateLegacyEllaBankLabel,
} from "@/lib/profileBankAccountsSession";

type SubPage = "my-profile" | "dependents" | "beneficiaries" | "authorized-signers" | "banking" | "reimbursement-method" | "debit-card" | "login-security" | "communication" | "report-lost-stolen" | "order-replacement-card";

type Dependent = {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  ssn: string;
  birthDate: string;
  gender: string;
  isFullTimeStudent: boolean;
  relationship: string;
};

type Beneficiary = {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  ssn: string;
  birthDate: string;
  relationship: string;
  beneficiaryType: "primary" | "contingent";
  sharePercentage?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
};

type WorkspaceBeneficiary = {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  relationship: string;
  sharePercentage: string;
  source: "dependent" | "added";
  dependentId?: string;
  beneficiaryType: "primary" | "contingent";
};

type AuthorizedSigner = {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  ssn: string;
  birthDate: string;
  type: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
};

type BankAccount = {
  id: string;
  routingNumber: string;
  accountNumber: string;
  confirmAccountNumber: string;
  accountNickname: string;
  accountType: "checking" | "saving";
  verificationMethod: "text" | "email";
  selectedDirectDepositOptions: string[]; // Array of selected plan years/accounts
  bankName?: string;
  addressLine1?: string;
  city?: string;
  bankState?: string;
  zipCode?: string;
  /** Newly added accounts show verification UI until deposit is confirmed */
  activationStatus?: "pending_deposit" | "active";
  /** Failed deposit-amount verifications (locks activation UI at 2) */
  activationVerifyAttemptCount?: number;
};

/** Demo micro-deposit amount users must enter to activate (consumer prototype). */
const DEMO_MICRO_DEPOSIT_VERIFICATION_AMOUNT = 0.32;

function parseBankDepositAmountInput(raw: string): number | null {
  const cleaned = raw.trim().replace(/[$,\s]/g, "");
  if (!cleaned) return null;
  const n = Number.parseFloat(cleaned);
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

type PurseStatus = {
  accountName: string;
  status: string;
};

type DebitCard = {
  id: string;
  cardholderName: string;
  cardNumber: string; // Last 4 digits
  fullCardNumber?: string; // Full card number for display in modal
  status: "ready-to-activate" | "active" | "deactivated" | "suspended" | "replacement-ordered";
  expirationDate: string;
  effectiveDate: string;
  purseStatuses?: PurseStatus[]; // Purse status information
};

const SESSION_STORAGE_DEPENDENTS_KEY = "wex_profile_dependents_v2";
const SESSION_STORAGE_BENEFICIARIES_KEY = "wex_profile_beneficiaries";

/** First visit (no saved list): show one active account so Bank Accounts is not empty. */
const DEFAULT_BANK_ACCOUNTS: BankAccount[] = [
  {
    id: "bank-default-1",
    routingNumber: "021000021",
    accountNumber: "0000000005423",
    confirmAccountNumber: "0000000005423",
    accountNickname: "",
    accountType: "checking",
    verificationMethod: "email",
    selectedDirectDepositOptions: [],
    bankName: "Wells Fargo Bank",
    activationStatus: "active",
  },
];

const DEFAULT_DEPENDENTS: Dependent[] = [
  {
    id: "dep-1",
    firstName: "Ben",
    lastName: "Smith",
    ssn: "***-**-1234",
    birthDate: "03/14/1986",
    gender: "Male",
    isFullTimeStudent: false,
    relationship: "Spouse",
  },
  {
    id: "dep-2",
    firstName: "James",
    lastName: "Smith",
    ssn: "***-**-5678",
    birthDate: "07/22/2012",
    gender: "Male",
    isFullTimeStudent: false,
    relationship: "Child",
  },
];

function loadDependentsFromStorage(): Dependent[] {
  if (typeof window === "undefined") return DEFAULT_DEPENDENTS;
  try {
    const stored = sessionStorage.getItem(SESSION_STORAGE_DEPENDENTS_KEY);
    if (!stored) return DEFAULT_DEPENDENTS;
    const parsed: Dependent[] = JSON.parse(stored);
    return parsed.length > 0 ? parsed : DEFAULT_DEPENDENTS;
  } catch {
    return DEFAULT_DEPENDENTS;
  }
}

function saveDependentsToStorage(dependents: Dependent[]): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SESSION_STORAGE_DEPENDENTS_KEY, JSON.stringify(dependents));
  } catch (e) {
    console.warn("Failed to save dependents to sessionStorage:", e);
  }
}

function loadBeneficiariesFromStorage(): Beneficiary[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = sessionStorage.getItem(SESSION_STORAGE_BENEFICIARIES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveBeneficiariesToStorage(beneficiaries: Beneficiary[]): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SESSION_STORAGE_BENEFICIARIES_KEY, JSON.stringify(beneficiaries));
  } catch (e) {
    console.warn("Failed to save beneficiaries to sessionStorage:", e);
  }
}

function loadBankAccountsFromStorage(): BankAccount[] {
  if (typeof window === "undefined") return DEFAULT_BANK_ACCOUNTS;
  try {
    const stored = sessionStorage.getItem(WEX_PROFILE_BANK_ACCOUNTS_KEY);
    if (!stored) return DEFAULT_BANK_ACCOUNTS;
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return DEFAULT_BANK_ACCOUNTS;
    if (parsed.length === 0) return DEFAULT_BANK_ACCOUNTS;
    return parsed.map((raw: BankAccount) => ({
      ...raw,
      accountNickname: migrateLegacyEllaBankLabel(raw.accountNickname) ?? raw.accountNickname,
      bankName: migrateLegacyEllaBankLabel(raw.bankName) ?? raw.bankName,
      activationStatus:
        raw.activationStatus === "pending_deposit" ? "pending_deposit" : "active",
    }));
  } catch {
    return DEFAULT_BANK_ACCOUNTS;
  }
}

function saveBankAccountsToStorage(bankAccounts: BankAccount[]): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(WEX_PROFILE_BANK_ACCOUNTS_KEY, JSON.stringify(bankAccounts));
  } catch (e) {
    console.warn("Failed to save bank accounts to sessionStorage:", e);
  }
}

export default function MyProfile() {
  const personalName = "Penny Smith";
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  
  // Communication preferences state
  const [activeTab, setActiveTab] = useState("statements");
  const [hsaAccountSummaryPaper, setHsaAccountSummaryPaper] = useState(false);
  const [hsaAccountSummaryEmail, setHsaAccountSummaryEmail] = useState(true);
  const [hsaTaxDocumentsPaper, setHsaTaxDocumentsPaper] = useState(false);
  const [hsaTaxDocumentsEmail, setHsaTaxDocumentsEmail] = useState(true);
  const [goPaperless, setGoPaperless] = useState(false);
  
  // Contact information state
  const [isContactInfoModalOpen, setIsContactInfoModalOpen] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("123-456-7890");
  const [emailAddress, setEmailAddress] = useState("penny.smith@wexinc.com");
  
  // Contributions preferences state
  const [contributionPostedEmail, setContributionPostedEmail] = useState(true);
  const [balanceBelowAmount, setBalanceBelowAmount] = useState("");
  const [balanceBelowEmail, setBalanceBelowEmail] = useState(true);
  const [contributionsWithinAmount, setContributionsWithinAmount] = useState("");
  const [contributionsWithinEmail, setContributionsWithinEmail] = useState(true);
  
  // Payments preferences state
  const [paymentIssuedEmail, setPaymentIssuedEmail] = useState(true);
  const [withdrawalExceedsAmount, setWithdrawalExceedsAmount] = useState("");
  const [withdrawalExceedsEmail, setWithdrawalExceedsEmail] = useState(true);
  
  // WEX Benefits Card preferences state
  const [cardMailedEmail, setCardMailedEmail] = useState(true);
  const [cardMailedText, setCardMailedText] = useState(true);
  const [followUpNoticeText, setFollowUpNoticeText] = useState(true);
  const [purchaseMadeEmail, setPurchaseMadeEmail] = useState(true);
  const [purchaseMadeText, setPurchaseMadeText] = useState(true);
  const [cardSuspendedText, setCardSuspendedText] = useState(true);
  const [cardPurseSuspendedText, setCardPurseSuspendedText] = useState(true);
  
  // Unsaved changes tracking
  const [pendingTabChange, setPendingTabChange] = useState<string | null>(null);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [isUnsavedChangesDialogOpen, setIsUnsavedChangesDialogOpen] = useState(false);
  
  const [savedState, setSavedState] = useState(() => ({
    hsaAccountSummaryPaper: false,
    hsaAccountSummaryEmail: true,
    hsaTaxDocumentsPaper: false,
    hsaTaxDocumentsEmail: true,
    goPaperless: false,
    contributionPostedEmail: true,
    balanceBelowAmount: "",
    balanceBelowEmail: true,
    contributionsWithinAmount: "",
    contributionsWithinEmail: true,
    paymentIssuedEmail: true,
    withdrawalExceedsAmount: "",
    withdrawalExceedsEmail: true,
    cardMailedEmail: true,
    cardMailedText: true,
    followUpNoticeText: true,
    purchaseMadeEmail: true,
    purchaseMadeText: true,
    cardSuspendedText: true,
    cardPurseSuspendedText: true,
  }));
  
  const hasUnsavedChanges = () => {
    return (
      hsaAccountSummaryPaper !== savedState.hsaAccountSummaryPaper ||
      hsaAccountSummaryEmail !== savedState.hsaAccountSummaryEmail ||
      hsaTaxDocumentsPaper !== savedState.hsaTaxDocumentsPaper ||
      hsaTaxDocumentsEmail !== savedState.hsaTaxDocumentsEmail ||
      goPaperless !== savedState.goPaperless ||
      contributionPostedEmail !== savedState.contributionPostedEmail ||
      balanceBelowAmount !== savedState.balanceBelowAmount ||
      balanceBelowEmail !== savedState.balanceBelowEmail ||
      contributionsWithinAmount !== savedState.contributionsWithinAmount ||
      contributionsWithinEmail !== savedState.contributionsWithinEmail ||
      paymentIssuedEmail !== savedState.paymentIssuedEmail ||
      withdrawalExceedsAmount !== savedState.withdrawalExceedsAmount ||
      withdrawalExceedsEmail !== savedState.withdrawalExceedsEmail ||
      cardMailedEmail !== savedState.cardMailedEmail ||
      cardMailedText !== savedState.cardMailedText ||
      followUpNoticeText !== savedState.followUpNoticeText ||
      purchaseMadeEmail !== savedState.purchaseMadeEmail ||
      purchaseMadeText !== savedState.purchaseMadeText ||
      cardSuspendedText !== savedState.cardSuspendedText ||
      cardPurseSuspendedText !== savedState.cardPurseSuspendedText
    );
  };
  
  const handleTabChange = (newTab: string) => {
    if (hasUnsavedChanges()) {
      setPendingTabChange(newTab);
      setIsUnsavedChangesDialogOpen(true);
    } else {
      setActiveTab(newTab);
    }
  };
  
  const handleSaveAndSwitch = () => {
    setSavedState({
      hsaAccountSummaryPaper,
      hsaAccountSummaryEmail,
      hsaTaxDocumentsPaper,
      hsaTaxDocumentsEmail,
      goPaperless,
      contributionPostedEmail,
      balanceBelowAmount,
      balanceBelowEmail,
      contributionsWithinAmount,
      contributionsWithinEmail,
      paymentIssuedEmail,
      withdrawalExceedsAmount,
      withdrawalExceedsEmail,
      cardMailedEmail,
      cardMailedText,
      followUpNoticeText,
      purchaseMadeEmail,
      purchaseMadeText,
      cardSuspendedText,
      cardPurseSuspendedText,
    });
    toast.success("Communication preferences saved successfully");
    setIsUnsavedChangesDialogOpen(false);
    if (pendingTabChange) {
      setActiveTab(pendingTabChange);
      setPendingTabChange(null);
    }
    if (pendingNavigation) {
      const url = new URL(pendingNavigation, window.location.origin);
      const subPage = url.searchParams.get("subPage");
      if (subPage) {
        setActiveSubPage(subPage as SubPage);
        setSearchParams({ subPage });
      }
      setPendingNavigation(null);
    }
  };
  
  // When "Go paperless" is checked, check all email checkboxes across all tabs and turn off paper
  useEffect(() => {
    if (goPaperless) {
      // Statements tab
      setHsaAccountSummaryEmail(true);
      setHsaTaxDocumentsEmail(true);
      setHsaAccountSummaryPaper(false);
      setHsaTaxDocumentsPaper(false);
      // Contributions tab
      setContributionPostedEmail(true);
      setBalanceBelowEmail(true);
      setContributionsWithinEmail(true);
      // Payments tab
      setPaymentIssuedEmail(true);
      setWithdrawalExceedsEmail(true);
      // WEX Benefits Card tab
      setCardMailedEmail(true);
      setPurchaseMadeEmail(true);
    }
  }, [goPaperless]);
  
  // Handler for HSA Account Summary Paper toggle
  const handleHsaAccountSummaryPaperChange = (checked: boolean) => {
    setHsaAccountSummaryPaper(checked);
    // If turning Paper ON and goPaperless is ON, turn off goPaperless
    if (checked && goPaperless) {
      setGoPaperless(false);
    }
  };
  
  // Handler for HSA Tax Documents Paper toggle
  const handleHsaTaxDocumentsPaperChange = (checked: boolean) => {
    setHsaTaxDocumentsPaper(checked);
    // If turning Paper ON and goPaperless is ON, turn off goPaperless
    if (checked && goPaperless) {
      setGoPaperless(false);
    }
  };
  
  // Dependents state
  const [dependents, setDependents] = useState<Dependent[]>(() => loadDependentsFromStorage());
  
  // Beneficiaries state
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(() => loadBeneficiariesFromStorage());
  
  // Authorized signers state
  const [authorizedSigners, setAuthorizedSigners] = useState<AuthorizedSigner[]>([]);
  
  // Banking state
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(() => loadBankAccountsFromStorage());
  
  // Sync state to sessionStorage whenever data changes
  useEffect(() => {
    saveDependentsToStorage(dependents);
  }, [dependents]);

  useEffect(() => {
    saveBeneficiariesToStorage(beneficiaries);
  }, [beneficiaries]);

  useEffect(() => {
    saveBankAccountsToStorage(bankAccounts);
  }, [bankAccounts]);
  
  // Debit card state
  const [debitCards, setDebitCards] = useState<DebitCard[]>([
    {
      id: "1",
      cardholderName: "Ben Smith",
      cardNumber: "3522",
      fullCardNumber: "1234 5678 9012 3522",
      status: "ready-to-activate",
      expirationDate: "08/31/2027",
      effectiveDate: "09/01/2024",
      purseStatuses: [
        { accountName: "FSA 2024", status: "Active" },
        { accountName: "HRA 2024", status: "Active" },
        { accountName: "FSA 2018-2026", status: "Suspended" },
      ],
    },
    {
      id: "2",
      cardholderName: "Penny Smith",
      cardNumber: "7741",
      fullCardNumber: "1234 5678 9012 7741",
      status: "active",
      expirationDate: "12/31/2027",
      effectiveDate: "01/01/2024",
      purseStatuses: [
        { accountName: "FSA 2024", status: "Active" },
        { accountName: "HRA 2024", status: "Active" },
        { accountName: "FSA 2022", status: "Suspended" },
      ],
    },
    {
      id: "3",
      cardholderName: "James Smith",
      cardNumber: "8412",
      fullCardNumber: "1234 5678 9012 8412",
      status: "deactivated",
      expirationDate: "03/31/2026",
      effectiveDate: "04/01/2022",
      purseStatuses: [
        { accountName: "FSA 2022", status: "Suspended" },
        { accountName: "HRA 2022", status: "Suspended" },
      ],
    },
  ]);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [openDependentDropdownId, setOpenDependentDropdownId] = useState<string | null>(null);
  const [openBeneficiaryDropdownId, setOpenBeneficiaryDropdownId] = useState<string | null>(null);
  
  // Card details modal state
  const [isCardDetailsModalOpen, setIsCardDetailsModalOpen] = useState(false);
  const [selectedCardForDetails, setSelectedCardForDetails] = useState<DebitCard | null>(null);
  
  // Card activation authentication modal state
  const [isActivationAuthModalOpen, setIsActivationAuthModalOpen] = useState(false);
  const [activationVerificationMethod, setActivationVerificationMethod] = useState<"text" | "email" | "">("");
  
  // Verification code modal state
  const [isVerificationCodeModalOpen, setIsVerificationCodeModalOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationResendTimer, setVerificationResendTimer] = useState(0);
  
  // Card activation confirmation modal state
  const [isActivateCardModalOpen, setIsActivateCardModalOpen] = useState(false);
  const [cardBeingActivated, setCardBeingActivated] = useState<DebitCard | null>(null);
  
  // Report Lost/Stolen workspace state
  const [isReportLostStolenWorkspaceOpen, setIsReportLostStolenWorkspaceOpen] = useState(false);
  const [cardBeingReported, setCardBeingReported] = useState<DebitCard | null>(null);

  // Order Replacement workspace state
  const [isOrderReplacementWorkspaceOpen, setIsOrderReplacementWorkspaceOpen] = useState(false);
  const [cardBeingReplaced, setCardBeingReplaced] = useState<DebitCard | null>(null);

  // Report Lost/Stolen page state
  const [confirmationAnswer, setConfirmationAnswer] = useState<"yes" | "no" | "">("");
  const [mailingAddress, setMailingAddress] = useState({
    name: "Ben Smith",
    street: "5050 Lincoln Dr",
    addressLine2: "",
    city: "Edina",
    state: "MN",
    zip: "55436",
    country: "United States",
  });
  const [isMailingAddressModalOpen, setIsMailingAddressModalOpen] = useState(false);
  const [mailingAddressForm, setMailingAddressForm] = useState({
    street: "5050 Lincoln Dr",
    addressLine2: "",
    city: "Edina",
    state: "MN",
    zip: "55436",
    country: "United States",
  });
  
  // Modal state
  const [isAddDependentModalOpen, setIsAddDependentModalOpen] = useState(false);
  const [editingDependentId, setEditingDependentId] = useState<string | null>(null);
  const [isViewDependentModalOpen, setIsViewDependentModalOpen] = useState(false);
  const [viewingDependent, setViewingDependent] = useState<Dependent | null>(null);
  const [isViewBeneficiaryModalOpen, setIsViewBeneficiaryModalOpen] = useState(false);
  const [viewingBeneficiary, setViewingBeneficiary] = useState<Beneficiary | null>(null);
  const [isRemoveConfirmOpen, setIsRemoveConfirmOpen] = useState(false);
  const [dependentToRemove, setDependentToRemove] = useState<Dependent | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  // Beneficiary modal state
  const [isAddBeneficiaryModalOpen, setIsAddBeneficiaryModalOpen] = useState(false);
  const [isAddBeneficiaryWorkspaceOpen, setIsAddBeneficiaryWorkspaceOpen] = useState(false);
  const [isEditPercentagesModalOpen, setIsEditPercentagesModalOpen] = useState(false);
  const [editPercentagesShares, setEditPercentagesShares] = useState<Record<string, string>>({});
  const [editPercentagesSplitEqually, setEditPercentagesSplitEqually] = useState(false);
  const [selectedDependentIds, setSelectedDependentIds] = useState<string[]>([]);
  const [workspaceBeneficiaries, setWorkspaceBeneficiaries] = useState<WorkspaceBeneficiary[]>([]);
  const [splitSharesEqually, setSplitSharesEqually] = useState(false);
  
  // Load existing beneficiaries into workspace when it opens
  useEffect(() => {
    if (isAddBeneficiaryWorkspaceOpen) {
      const existingWorkspaceBeneficiaries: WorkspaceBeneficiary[] = beneficiaries.map((ben) => {
        const matchingDependent = dependents.find((dep) => dep.ssn === ben.ssn);
        
        if (matchingDependent) {
          return {
            id: ben.id,
            firstName: ben.firstName,
            middleName: ben.middleName || undefined,
            lastName: ben.lastName,
            relationship: ben.relationship,
            sharePercentage: ben.sharePercentage || (beneficiaries.length === 1 ? "100" : "0"),
            source: "dependent" as const,
            dependentId: matchingDependent.id,
            beneficiaryType: ben.beneficiaryType,
          };
        } else {
          return {
            id: ben.id,
            firstName: ben.firstName,
            middleName: ben.middleName || undefined,
            lastName: ben.lastName,
            relationship: ben.relationship,
            sharePercentage: ben.sharePercentage || (beneficiaries.length === 1 ? "100" : "0"),
            source: "added" as const,
            beneficiaryType: ben.beneficiaryType,
          };
        }
      });
      setWorkspaceBeneficiaries((prev) => {
        const dependentBeneficiaries = prev.filter(wb => wb.source === "dependent");
        return [...existingWorkspaceBeneficiaries, ...dependentBeneficiaries];
      });
    }
  }, [isAddBeneficiaryWorkspaceOpen, beneficiaries, dependents]);
  
  const [isRemoveWorkspaceBeneficiaryConfirmOpen, setIsRemoveWorkspaceBeneficiaryConfirmOpen] = useState(false);
  const [workspaceBeneficiaryToRemove, setWorkspaceBeneficiaryToRemove] = useState<WorkspaceBeneficiary | null>(null);
  const [editingBeneficiaryId, setEditingBeneficiaryId] = useState<string | null>(null);
  const [isRemoveBeneficiaryConfirmOpen, setIsRemoveBeneficiaryConfirmOpen] = useState(false);
  const [beneficiaryToRemove, setBeneficiaryToRemove] = useState<Beneficiary | null>(null);
  const [isBeneficiaryCalendarOpen, setIsBeneficiaryCalendarOpen] = useState(false);
  
  // Dependent beneficiary type selection dialog state
  const [isDependentTypeDialogOpen, setIsDependentTypeDialogOpen] = useState(false);
  const [pendingDependent, setPendingDependent] = useState<Dependent | null>(null);
  const [selectedDependentType, setSelectedDependentType] = useState<"primary" | "contingent">("primary");
  
  // Authorized signer modal state
  const [isAddAuthorizedSignerModalOpen, setIsAddAuthorizedSignerModalOpen] = useState(false);
  const [editingAuthorizedSignerId, setEditingAuthorizedSignerId] = useState<string | null>(null);
  const [isRemoveAuthorizedSignerConfirmOpen, setIsRemoveAuthorizedSignerConfirmOpen] = useState(false);
  const [authorizedSignerToRemove, setAuthorizedSignerToRemove] = useState<AuthorizedSigner | null>(null);
  const [isAuthorizedSignerCalendarOpen, setIsAuthorizedSignerCalendarOpen] = useState(false);
  const [isAuthorizedSignerSsnInvalid, setIsAuthorizedSignerSsnInvalid] = useState(false);
  const [isViewAuthorizedSignerModalOpen, setIsViewAuthorizedSignerModalOpen] = useState(false);
  const [viewingAuthorizedSigner, setViewingAuthorizedSigner] = useState<AuthorizedSigner | null>(null);
  
  // Banking modal state
  const [isAddBankAccountModalOpen, setIsAddBankAccountModalOpen] = useState(false);
  const [isAddBankAccountWorkspaceOpen, setIsAddBankAccountWorkspaceOpen] = useState(false);
  const [editingBankAccountId, setEditingBankAccountId] = useState<string | null>(null);
  const [isRemoveBankAccountConfirmOpen, setIsRemoveBankAccountConfirmOpen] = useState(false);
  const [bankAccountToRemove, setBankAccountToRemove] = useState<BankAccount | null>(null);
  const [bankAccountStep, setBankAccountStep] = useState<string>("step1");
  const [isRemoveBankAccountAuthModalOpen, setIsRemoveBankAccountAuthModalOpen] = useState(false);
  const [removeBankAuthShowCode, setRemoveBankAuthShowCode] = useState(false);
  const [removeBankAuthMethod, setRemoveBankAuthMethod] = useState<"" | "text" | "email">("");
  const [removeBankAuthCode, setRemoveBankAuthCode] = useState("");
  const [removeBankAuthCodePlain, setRemoveBankAuthCodePlain] = useState(false);
  const [removeBankAuthResendTimer, setRemoveBankAuthResendTimer] = useState(0);
  /** When true, closing Remove confirmation opens auth; do not clear bankAccountToRemove in AlertDialog onOpenChange. */
  const preserveBankAccountToRemoveAfterConfirmCloseRef = useRef(false);
  const [isActivateBankAccountModalOpen, setIsActivateBankAccountModalOpen] = useState(false);
  const [activateBankAccountId, setActivateBankAccountId] = useState<string | null>(null);
  const [bankAccountDepositAmountInput, setBankAccountDepositAmountInput] = useState("");
  
  // Form state for dependents
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    ssn: "",
    birthDate: "",
    gender: "",
    isFullTimeStudent: "no",
    relationship: "",
  });
  const [isBeneficiarySsnInvalid, setIsBeneficiarySsnInvalid] = useState(false);
  
  // Form state for beneficiaries
  const [beneficiaryFormData, setBeneficiaryFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    ssn: "",
    birthDate: "",
    relationship: "",
    beneficiaryType: "primary",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
  });
  
  // Form state for authorized signers
  const [authorizedSignerFormData, setAuthorizedSignerFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    ssn: "",
    birthDate: "",
    type: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
  });
  
  // Form state for bank accounts
  const [bankAccountFormData, setBankAccountFormData] = useState({
    verificationMethod: "" as "" | "text" | "email",
    verificationCode: "",
    routingNumber: "",
    accountNumber: "",
    confirmAccountNumber: "",
    accountNickname: "",
    accountType: "checking" as "checking" | "saving",
    bankName: "",
    addressLine1: "",
    city: "",
    bankState: "",
    zipCode: "",
    selectedDirectDepositOptions: [] as string[],
  });
  
  // Verification code resend timer state
  const [resendTimer, setResendTimer] = useState(0);
  const [showVerificationCode, setShowVerificationCode] = useState(false);
  /** Show digits vs masked dots in add-bank verification field */
  const [showBankVerificationCodePlain, setShowBankVerificationCodePlain] = useState(false);


  const [activeSubPage, setActiveSubPage] = useState<SubPage>(() => {
    const subPage = searchParams.get("subPage");
    const validSubPages: SubPage[] = ["my-profile", "dependents", "beneficiaries", "authorized-signers", "banking", "reimbursement-method", "debit-card", "login-security", "communication", "report-lost-stolen", "order-replacement-card"];
    if (subPage && validSubPages.includes(subPage as SubPage)) {
      return subPage as SubPage;
    }
    return "my-profile";
  });

  // Sync activeSubPage with URL params
  useEffect(() => {
    const subPage = searchParams.get("subPage");
    const validSubPages: SubPage[] = ["my-profile", "dependents", "beneficiaries", "authorized-signers", "banking", "reimbursement-method", "debit-card", "login-security", "communication", "report-lost-stolen", "order-replacement-card"];
    queueMicrotask(() => {
      if (subPage && validSubPages.includes(subPage as SubPage)) {
        setActiveSubPage(subPage as SubPage);
      } else if (!subPage) {
        setActiveSubPage("my-profile");
      }
    });
  }, [searchParams]);

  // Intercept navigation away from communication subPage with unsaved changes
  useEffect(() => {
    if (activeSubPage === "communication" && hasUnsavedChanges()) {
      if (location.pathname !== "/my-profile") {
        setPendingNavigation(location.pathname + location.search);
        setIsUnsavedChangesDialogOpen(true);
        window.history.back();
      }
    }
  }, [location.pathname, location.search, activeSubPage]);

  // Verification code resend timer countdown
  useEffect(() => {
    if (verificationResendTimer > 0) {
      const timer = setTimeout(() => {
        setVerificationResendTimer(verificationResendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [verificationResendTimer]);

  const handleSubPageChange = (subPage: SubPage) => {
    if (activeSubPage === "communication" && hasUnsavedChanges()) {
      setPendingNavigation(`/my-profile?subPage=${subPage}`);
      setIsUnsavedChangesDialogOpen(true);
    } else {
      setActiveSubPage(subPage);
      setSearchParams({ subPage });
    }
  };

  const handleFormChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateSsn = (value: string): boolean => {
    if (value === "") return false;
    return !/^[0-9-]*$/.test(value);
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      middleName: "",
      lastName: "",
      ssn: "",
      birthDate: "",
      gender: "",
      isFullTimeStudent: "no",
      relationship: "",
    });
  };

  const handleEditDependent = (dependent: Dependent) => {
    setFormData({
      firstName: dependent.firstName,
      middleName: dependent.middleName || "",
      lastName: dependent.lastName,
      ssn: dependent.ssn,
      birthDate: dependent.birthDate,
      gender: dependent.gender,
      isFullTimeStudent: dependent.isFullTimeStudent ? "yes" : "no",
      relationship: dependent.relationship,
    });
    setEditingDependentId(dependent.id);
    setIsAddDependentModalOpen(true);
  };

  const handleViewDependent = (dependent: Dependent) => {
    setViewingDependent(dependent);
    setIsViewDependentModalOpen(true);
  };

  const handleViewBeneficiary = (beneficiary: Beneficiary) => {
    setViewingBeneficiary(beneficiary);
    setIsViewBeneficiaryModalOpen(true);
  };

  const handleSaveDependent = () => {
    const fullName = `${formData.firstName} ${formData.lastName}`;
    
    if (editingDependentId) {
      // Update existing dependent
      setDependents((prev) =>
        prev.map((dep) =>
          dep.id === editingDependentId
            ? {
                ...dep,
                firstName: formData.firstName,
                middleName: formData.middleName || undefined,
                lastName: formData.lastName,
                ssn: formData.ssn,
                birthDate: formData.birthDate,
                gender: formData.gender,
                isFullTimeStudent: formData.isFullTimeStudent === "yes",
                relationship: formData.relationship,
              }
            : dep
        )
      );
      
      // Show success toast for edit
      toast.success("Dependent successfully updated", {
        description: `${fullName}'s information has been updated`,
      });
    } else {
      // Add new dependent
      const newDependent: Dependent = {
        id: Date.now().toString(),
        firstName: formData.firstName,
        middleName: formData.middleName || undefined,
        lastName: formData.lastName,
        ssn: formData.ssn,
        birthDate: formData.birthDate,
        gender: formData.gender,
        isFullTimeStudent: formData.isFullTimeStudent === "yes",
        relationship: formData.relationship,
      };
      setDependents((prev) => [...prev, newDependent]);
      
      // Show success toast for add
      toast.success("Dependent successfully added", {
        description: `${fullName} is now a dependent`,
      });
    }
    resetForm();
    setEditingDependentId(null);
    setIsAddDependentModalOpen(false);
  };

  const handleRemoveDependent = (id: string) => {
    const dependent = dependents.find((dep) => dep.id === id);
    const fullName = dependent ? `${dependent.firstName} ${dependent.lastName}` : "Dependent";
    
    setDependents((prev) => prev.filter((dep) => dep.id !== id));
    setIsRemoveConfirmOpen(false);
    setDependentToRemove(null);
    
    // Show success toast for removal
    toast.success("Dependent successfully removed", {
      description: `${fullName} has been removed from your dependents`,
    });
  };

  const handleRemoveClick = (dependent: Dependent) => {
    setDependentToRemove(dependent);
    setIsRemoveConfirmOpen(true);
  };

  // Beneficiary handlers
  const handleBeneficiaryFormChange = (field: string, value: string) => {
    setBeneficiaryFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetBeneficiaryForm = () => {
    setBeneficiaryFormData({
      firstName: "",
      middleName: "",
      lastName: "",
      ssn: "",
      birthDate: "",
      relationship: "",
      beneficiaryType: "primary",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      zipCode: "",
    });
    setIsBeneficiarySsnInvalid(false);
  };

  const handleEditBeneficiary = (beneficiary: Beneficiary) => {
    setBeneficiaryFormData({
      firstName: beneficiary.firstName,
      middleName: beneficiary.middleName || "",
      lastName: beneficiary.lastName,
      ssn: beneficiary.ssn,
      birthDate: beneficiary.birthDate,
      relationship: beneficiary.relationship,
      beneficiaryType: beneficiary.beneficiaryType,
      addressLine1: beneficiary.addressLine1,
      addressLine2: beneficiary.addressLine2 || "",
      city: beneficiary.city,
      state: beneficiary.state,
      zipCode: beneficiary.zipCode,
    });
    setIsBeneficiarySsnInvalid(false);
    setEditingBeneficiaryId(beneficiary.id);
    setIsAddBeneficiaryModalOpen(true);
  };

  const handleSaveBeneficiary = () => {
    const fullName = `${beneficiaryFormData.firstName} ${beneficiaryFormData.lastName}`;
    
    if (editingBeneficiaryId) {
      setBeneficiaries((prev) =>
        prev.map((ben) =>
          ben.id === editingBeneficiaryId
            ? {
                ...ben,
                firstName: beneficiaryFormData.firstName,
                middleName: beneficiaryFormData.middleName || undefined,
                lastName: beneficiaryFormData.lastName,
                ssn: beneficiaryFormData.ssn,
                birthDate: beneficiaryFormData.birthDate,
                relationship: beneficiaryFormData.relationship,
                beneficiaryType: beneficiaryFormData.beneficiaryType as "primary" | "contingent",
                addressLine1: beneficiaryFormData.addressLine1,
                addressLine2: beneficiaryFormData.addressLine2 || undefined,
                city: beneficiaryFormData.city,
                state: beneficiaryFormData.state,
                zipCode: beneficiaryFormData.zipCode,
              }
            : ben
        )
      );
      
      toast.success("Beneficiary successfully updated", {
        description: `${fullName}'s information has been updated`,
      });
    } else {
      const newBeneficiary: Beneficiary = {
        id: Date.now().toString(),
        firstName: beneficiaryFormData.firstName,
        middleName: beneficiaryFormData.middleName || undefined,
        lastName: beneficiaryFormData.lastName,
        ssn: beneficiaryFormData.ssn,
        birthDate: beneficiaryFormData.birthDate,
        relationship: beneficiaryFormData.relationship,
        beneficiaryType: beneficiaryFormData.beneficiaryType as "primary" | "contingent",
        addressLine1: beneficiaryFormData.addressLine1,
        addressLine2: beneficiaryFormData.addressLine2 || undefined,
        city: beneficiaryFormData.city,
        state: beneficiaryFormData.state,
        zipCode: beneficiaryFormData.zipCode,
      };
      setBeneficiaries((prev) => [...prev, newBeneficiary]);
      
      if (isAddBeneficiaryWorkspaceOpen) {
        const workspaceBeneficiary: WorkspaceBeneficiary = {
          id: newBeneficiary.id,
          firstName: newBeneficiary.firstName,
          middleName: newBeneficiary.middleName,
          lastName: newBeneficiary.lastName,
          relationship: newBeneficiary.relationship,
          sharePercentage: workspaceBeneficiaries.length === 0 ? "100" : "0",
          source: "added",
          beneficiaryType: newBeneficiary.beneficiaryType,
        };
        setWorkspaceBeneficiaries([...workspaceBeneficiaries, workspaceBeneficiary]);
      }
      
      toast.success("Beneficiary successfully added", {
        description: `${fullName} is now a beneficiary`,
      });
    }
    resetBeneficiaryForm();
    setEditingBeneficiaryId(null);
    setIsAddBeneficiaryModalOpen(false);
  };

  // Workspace beneficiary handlers
  const handleSharePercentageChange = (beneficiaryId: string, value: string) => {
    setWorkspaceBeneficiaries((prev) =>
      prev.map((ben) =>
        ben.id === beneficiaryId
          ? { ...ben, sharePercentage: value }
          : ben
      )
    );
  };

  const handleRemoveWorkspaceBeneficiaryClick = (beneficiary: WorkspaceBeneficiary) => {
    setWorkspaceBeneficiaryToRemove(beneficiary);
    setIsRemoveWorkspaceBeneficiaryConfirmOpen(true);
  };

  const handleAddDependentAsBeneficiary = () => {
    if (!pendingDependent) return;
    
    setSelectedDependentIds([...selectedDependentIds, pendingDependent.id]);
    const workspaceBeneficiary: WorkspaceBeneficiary = {
      id: `dependent-${pendingDependent.id}`,
      firstName: pendingDependent.firstName,
      middleName: pendingDependent.middleName,
      lastName: pendingDependent.lastName,
      relationship: pendingDependent.relationship,
      sharePercentage: workspaceBeneficiaries.length === 0 ? "100" : "0",
      source: "dependent",
      dependentId: pendingDependent.id,
      beneficiaryType: selectedDependentType,
    };
    setWorkspaceBeneficiaries([...workspaceBeneficiaries, workspaceBeneficiary]);
    
    setIsDependentTypeDialogOpen(false);
    setPendingDependent(null);
    setSelectedDependentType("primary");
  };

  const handleRemoveWorkspaceBeneficiary = () => {
    if (!workspaceBeneficiaryToRemove) return;
    
    const beneficiaryId = workspaceBeneficiaryToRemove.id;
    if (workspaceBeneficiaryToRemove.source === "dependent" && workspaceBeneficiaryToRemove.dependentId) {
      setSelectedDependentIds(selectedDependentIds.filter(id => id !== workspaceBeneficiaryToRemove.dependentId));
    }
    setWorkspaceBeneficiaries(workspaceBeneficiaries.filter(b => b.id !== beneficiaryId));
    setIsRemoveWorkspaceBeneficiaryConfirmOpen(false);
    setWorkspaceBeneficiaryToRemove(null);
  };

  const handleSplitSharesToggle = (checked: boolean) => {
    setSplitSharesEqually(checked);
    if (checked && workspaceBeneficiaries.length > 0) {
      setWorkspaceBeneficiaries((prev) => {
        const primaryBeneficiaries = prev.filter((ben) => ben.beneficiaryType === "primary");
        const contingentBeneficiaries = prev.filter((ben) => ben.beneficiaryType === "contingent");
        
        const primaryShare = primaryBeneficiaries.length > 0 
          ? Math.floor(100 / primaryBeneficiaries.length).toString()
          : "0";
        const contingentShare = contingentBeneficiaries.length > 0 
          ? Math.floor(100 / contingentBeneficiaries.length).toString()
          : "0";
        
        return prev.map((ben) => ({
          ...ben,
          sharePercentage: ben.beneficiaryType === "primary" ? primaryShare : contingentShare,
        }));
      });
    }
  };

  const handleSaveWorkspaceBeneficiaries = () => {
    setBeneficiaries((prev) => {
      const updatedBeneficiaries: Beneficiary[] = [];
      
      workspaceBeneficiaries.forEach((workspaceBen) => {
        if (workspaceBen.source === "dependent") {
          const dependent = dependents.find((dep) => dep.id === workspaceBen.dependentId);
          if (!dependent) return;

          const existingBeneficiary = prev.find((ben) => ben.ssn === dependent.ssn);

          if (existingBeneficiary) {
            updatedBeneficiaries.push({
              ...existingBeneficiary,
              sharePercentage: workspaceBen.sharePercentage,
              beneficiaryType: workspaceBen.beneficiaryType,
            });
          } else {
            const newBeneficiary: Beneficiary = {
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              firstName: dependent.firstName,
              middleName: dependent.middleName || undefined,
              lastName: dependent.lastName,
              ssn: dependent.ssn,
              birthDate: dependent.birthDate,
              relationship: dependent.relationship,
              beneficiaryType: workspaceBen.beneficiaryType,
              sharePercentage: workspaceBen.sharePercentage,
              addressLine1: "",
              addressLine2: undefined,
              city: "",
              state: "",
              zipCode: "",
            };
            updatedBeneficiaries.push(newBeneficiary);
          }
        } else if (workspaceBen.source === "added") {
          const existingBeneficiary = prev.find((ben) => ben.id === workspaceBen.id);

          if (existingBeneficiary) {
            updatedBeneficiaries.push({
              ...existingBeneficiary,
              sharePercentage: workspaceBen.sharePercentage,
            });
          }
        }
      });

      saveBeneficiariesToStorage(updatedBeneficiaries);
      return updatedBeneficiaries;
    });

    const count = workspaceBeneficiaries.length;
    if (count === 0) {
      toast.success("All beneficiaries removed", {
        description: "All beneficiaries have been cleared.",
      });
    } else {
      toast.success(
        count === 1 ? "Beneficiary saved" : `${count} beneficiaries saved`,
        { description: "Your beneficiaries have been updated with their share percentages." }
      );
    }

    setIsAddBeneficiaryWorkspaceOpen(false);
    setWorkspaceBeneficiaries([]);
    setSelectedDependentIds([]);
    setSplitSharesEqually(false);
  };

  const calculatePrimaryTotalShares = () => {
    return workspaceBeneficiaries
      .filter((ben) => ben.beneficiaryType === "primary")
      .reduce((total, ben) => total + (parseFloat(ben.sharePercentage) || 0), 0);
  };

  const calculateContingentTotalShares = () => {
    return workspaceBeneficiaries
      .filter((ben) => ben.beneficiaryType === "contingent")
      .reduce((total, ben) => total + (parseFloat(ben.sharePercentage) || 0), 0);
  };

  const areSharesValid = () => {
    if (workspaceBeneficiaries.length === 0) return true;
    if (splitSharesEqually) return true;
    
    const primaryBeneficiaries = workspaceBeneficiaries.filter((ben) => ben.beneficiaryType === "primary");
    const contingentBeneficiaries = workspaceBeneficiaries.filter((ben) => ben.beneficiaryType === "contingent");
    
    if (primaryBeneficiaries.some((ben) => !ben.sharePercentage || parseFloat(ben.sharePercentage) === 0)) return false;
    if (contingentBeneficiaries.some((ben) => !ben.sharePercentage || parseFloat(ben.sharePercentage) === 0)) return false;
    
    if (primaryBeneficiaries.length > 0 && Math.abs(calculatePrimaryTotalShares() - 100) >= 0.01) return false;
    if (contingentBeneficiaries.length > 0 && Math.abs(calculateContingentTotalShares() - 100) >= 0.01) return false;
    
    return true;
  };

  const getSharesErrorMessage = () => {
    if (workspaceBeneficiaries.length === 0) return null;
    if (splitSharesEqually) return null;
    
    const primaryBeneficiaries = workspaceBeneficiaries.filter((ben) => ben.beneficiaryType === "primary");
    const contingentBeneficiaries = workspaceBeneficiaries.filter((ben) => ben.beneficiaryType === "contingent");
    
    const errors: string[] = [];
    let hasPrimaryError = false;
    let hasContingentError = false;
    
    if (primaryBeneficiaries.length > 0) {
      if (primaryBeneficiaries.some((ben) => !ben.sharePercentage || parseFloat(ben.sharePercentage) === 0)) {
        errors.push("Primary beneficiaries: A beneficiary cannot have 0% as shares");
        hasPrimaryError = true;
      } else if (Math.abs(calculatePrimaryTotalShares() - 100) >= 0.01) {
        errors.push("Total allocation for primary beneficiaries must equal 100%");
        hasPrimaryError = true;
      }
    }
    
    if (contingentBeneficiaries.length > 0) {
      if (contingentBeneficiaries.some((ben) => !ben.sharePercentage || parseFloat(ben.sharePercentage) === 0)) {
        errors.push("Contingent beneficiaries: A beneficiary cannot have 0% as shares");
        hasContingentError = true;
      } else if (Math.abs(calculateContingentTotalShares() - 100) >= 0.01) {
        errors.push("Total allocation for contingent beneficiaries must equal 100%");
        hasContingentError = true;
      }
    }
    
    if (errors.length === 0) return null;
    
    if (hasPrimaryError && hasContingentError && 
        errors.some(e => e.includes("Total allocation for primary")) &&
        errors.some(e => e.includes("Total allocation for contingent"))) {
      return "Total allocation must equal to 100%, for each type of beneficiary";
    }
    
    return errors.join(" ");
  };

  const handleRemoveBeneficiaryClick = (beneficiary: Beneficiary) => {
    setBeneficiaryToRemove(beneficiary);
    setIsRemoveBeneficiaryConfirmOpen(true);
  };

  const handleRemoveBeneficiary = (id: string) => {
    const beneficiary = beneficiaries.find((ben) => ben.id === id);
    const fullName = beneficiary ? `${beneficiary.firstName} ${beneficiary.lastName}` : "Beneficiary";
    
    setBeneficiaries((prev) => prev.filter((ben) => ben.id !== id));
    setIsRemoveBeneficiaryConfirmOpen(false);
    setBeneficiaryToRemove(null);
    
    // Show success toast for removal
    toast.success("Beneficiary successfully removed", {
      description: `${fullName} has been removed from your beneficiaries`,
    });
  };

  // Authorized signer handlers
  const handleAuthorizedSignerFormChange = (field: string, value: string) => {
    setAuthorizedSignerFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateAuthorizedSignerSsn = (value: string): boolean => {
    if (value === "") return false;
    return !/^[0-9-]*$/.test(value);
  };

  const resetAuthorizedSignerForm = () => {
    setAuthorizedSignerFormData({
      firstName: "",
      middleName: "",
      lastName: "",
      ssn: "",
      birthDate: "",
      type: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      zipCode: "",
    });
    setIsAuthorizedSignerSsnInvalid(false);
  };

  const handleViewAuthorizedSigner = (signer: AuthorizedSigner) => {
    setViewingAuthorizedSigner(signer);
    setIsViewAuthorizedSignerModalOpen(true);
  };

  const handleEditAuthorizedSigner = (signer: AuthorizedSigner) => {
    setAuthorizedSignerFormData({
      firstName: signer.firstName,
      middleName: signer.middleName || "",
      lastName: signer.lastName,
      ssn: signer.ssn,
      birthDate: signer.birthDate,
      type: signer.type,
      phone: signer.phone,
      addressLine1: signer.addressLine1,
      addressLine2: signer.addressLine2 || "",
      city: signer.city,
      state: signer.state,
      zipCode: signer.zipCode,
    });
    setEditingAuthorizedSignerId(signer.id);
    setIsAddAuthorizedSignerModalOpen(true);
  };

  const handleSaveAuthorizedSigner = () => {
    const fullName = `${authorizedSignerFormData.firstName} ${authorizedSignerFormData.lastName}`;
    
    if (editingAuthorizedSignerId) {
      // Update existing authorized signer
      setAuthorizedSigners((prev) =>
        prev.map((signer) =>
          signer.id === editingAuthorizedSignerId
            ? {
                ...signer,
                firstName: authorizedSignerFormData.firstName,
                middleName: authorizedSignerFormData.middleName || undefined,
                lastName: authorizedSignerFormData.lastName,
                ssn: authorizedSignerFormData.ssn,
                birthDate: authorizedSignerFormData.birthDate,
                type: authorizedSignerFormData.type,
                phone: authorizedSignerFormData.phone,
                addressLine1: authorizedSignerFormData.addressLine1,
                addressLine2: authorizedSignerFormData.addressLine2 || undefined,
                city: authorizedSignerFormData.city,
                state: authorizedSignerFormData.state,
                zipCode: authorizedSignerFormData.zipCode,
              }
            : signer
        )
      );
      
      // Show success toast for edit
      toast.success("Authorized signer successfully updated", {
        description: `${fullName}'s information has been updated`,
      });
    } else {
      // Add new authorized signer
      const newAuthorizedSigner: AuthorizedSigner = {
        id: Date.now().toString(),
        firstName: authorizedSignerFormData.firstName,
        middleName: authorizedSignerFormData.middleName || undefined,
        lastName: authorizedSignerFormData.lastName,
        ssn: authorizedSignerFormData.ssn,
        birthDate: authorizedSignerFormData.birthDate,
        type: authorizedSignerFormData.type,
        phone: authorizedSignerFormData.phone,
        addressLine1: authorizedSignerFormData.addressLine1,
        addressLine2: authorizedSignerFormData.addressLine2 || undefined,
        city: authorizedSignerFormData.city,
        state: authorizedSignerFormData.state,
        zipCode: authorizedSignerFormData.zipCode,
      };
      setAuthorizedSigners((prev) => [...prev, newAuthorizedSigner]);
      
      // Show success toast for add
      toast.success("Authorized signer successfully added", {
        description: `${fullName} is now an authorized signer`,
      });
    }
    resetAuthorizedSignerForm();
    setEditingAuthorizedSignerId(null);
    setIsAddAuthorizedSignerModalOpen(false);
  };

  const handleRemoveAuthorizedSignerClick = (signer: AuthorizedSigner) => {
    setAuthorizedSignerToRemove(signer);
    setIsRemoveAuthorizedSignerConfirmOpen(true);
  };

  const handleRemoveAuthorizedSigner = (id: string) => {
    const signer = authorizedSigners.find((s) => s.id === id);
    const fullName = signer ? `${signer.firstName} ${signer.lastName}` : "Authorized Signer";
    
    setAuthorizedSigners((prev) => prev.filter((s) => s.id !== id));
    setIsRemoveAuthorizedSignerConfirmOpen(false);
    setAuthorizedSignerToRemove(null);
    
    // Show success toast for removal
    toast.success("Authorized signer successfully removed", {
      description: `${fullName} has been removed from your authorized signers`,
    });
  };

  // Bank account handlers
  const handleBankAccountFormChange = (field: string, value: string) => {
    setBankAccountFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBankAccountNext = () => {
    if (bankAccountStep === "step1") {
      setShowVerificationCode(false);
      setBankAccountStep("step2");
    } else if (bankAccountStep === "step2") {
      // Ensure selectedDirectDepositOptions is initialized before moving to step 3
      setBankAccountFormData((prev) => ({
        ...prev,
        selectedDirectDepositOptions: prev.selectedDirectDepositOptions || [],
      }));
      setBankAccountStep("step3");
    }
  };

  const handleBankAccountBack = () => {
    if (bankAccountStep === "step2") {
      setShowVerificationCode(false);
      setBankAccountStep("step1");
    } else if (bankAccountStep === "step3") {
      setBankAccountStep("step2");
    }
  };

  const handleSaveBankAccount = () => {
    // This will be called on step 3 completion
    const verificationMethod: BankAccount["verificationMethod"] =
      bankAccountFormData.verificationMethod === "email" ? "email" : "text";
    const existingAccount = editingBankAccountId
      ? bankAccounts.find((a) => a.id === editingBankAccountId)
      : undefined;
    const isNewBankAccount = !editingBankAccountId;
    const newBankAccount: BankAccount = {
      id: editingBankAccountId || Date.now().toString(),
      routingNumber: bankAccountFormData.routingNumber,
      accountNumber: bankAccountFormData.accountNumber,
      confirmAccountNumber: bankAccountFormData.confirmAccountNumber,
      accountNickname: bankAccountFormData.accountNickname,
      accountType: bankAccountFormData.accountType,
      verificationMethod,
      selectedDirectDepositOptions: bankAccountFormData.selectedDirectDepositOptions || [],
      bankName: bankAccountFormData.bankName || undefined,
      addressLine1: bankAccountFormData.addressLine1 || undefined,
      city: bankAccountFormData.city || undefined,
      bankState: bankAccountFormData.bankState || undefined,
      zipCode: bankAccountFormData.zipCode || undefined,
      activationStatus: isNewBankAccount
        ? "pending_deposit"
        : (existingAccount?.activationStatus ?? "active"),
      activationVerifyAttemptCount: existingAccount?.activationVerifyAttemptCount,
    };
    
    if (editingBankAccountId) {
      setBankAccounts((prev) =>
        prev.map((acc) =>
          acc.id === editingBankAccountId
            ? { ...newBankAccount, id: acc.id }
            : acc
        )
      );
      const accountName = bankAccountFormData.accountNickname || `${bankAccountFormData.accountType.charAt(0).toUpperCase() + bankAccountFormData.accountType.slice(1)} Account`;
      toast.success("Bank account successfully updated", {
        description: `${accountName}'s information has been updated`,
      });
    } else {
      setBankAccounts((prev) => [...prev, newBankAccount]);
      const displayName =
        bankAccountFormData.accountNickname.trim() ||
        bankAccountFormData.bankName.trim() ||
        `${bankAccountFormData.accountType.charAt(0).toUpperCase() + bankAccountFormData.accountType.slice(1)} Account`;
      const acctDigits = bankAccountFormData.accountNumber.replace(/\D/g, "");
      const last4 = acctDigits.length >= 4 ? acctDigits.slice(-4) : acctDigits;
      toast.success("Bank Account Successfully Added", {
        description: `${displayName} ....${last4} was successfully added`,
      });
    }
    
    setIsAddBankAccountModalOpen(false);
    setIsAddBankAccountWorkspaceOpen(false);
    setBankAccountStep("step1");
    setEditingBankAccountId(null);
    setShowVerificationCode(false);
  };

  const handleEditBankAccount = (bankAccount: BankAccount) => {
    setBankAccountFormData({
      verificationMethod: bankAccount.verificationMethod,
      verificationCode: "",
      routingNumber: bankAccount.routingNumber,
      accountNumber: bankAccount.accountNumber,
      confirmAccountNumber: bankAccount.accountNumber, // Pre-fill with account number for editing
      accountNickname: bankAccount.accountNickname,
      accountType: bankAccount.accountType,
      selectedDirectDepositOptions: bankAccount.selectedDirectDepositOptions || [],
      bankName: bankAccount.bankName ?? "",
      addressLine1: bankAccount.addressLine1 ?? "",
      city: bankAccount.city ?? "",
      bankState: bankAccount.bankState ?? "",
      zipCode: bankAccount.zipCode ?? "",
    });
    setEditingBankAccountId(bankAccount.id);
    setIsAddBankAccountModalOpen(true);
    setBankAccountStep("edit");
    setShowVerificationCode(false);
  };

  const closeActivateBankAccountModal = () => {
    setIsActivateBankAccountModalOpen(false);
    setActivateBankAccountId(null);
    setBankAccountDepositAmountInput("");
  };

  const handleOpenActivateBankAccountModal = (bankAccount: BankAccount) => {
    setActivateBankAccountId(bankAccount.id);
    setBankAccountDepositAmountInput("");
    setIsActivateBankAccountModalOpen(true);
  };

  const handleSubmitBankAccountActivation = () => {
    if (!activateBankAccountId) return;
    const account = bankAccounts.find((a) => a.id === activateBankAccountId);
    if (!account) {
      closeActivateBankAccountModal();
      return;
    }
    const prevFailures = account.activationVerifyAttemptCount ?? 0;
    if (prevFailures >= 2) {
      toast.error("This bank account is locked after two incorrect attempts.");
      closeActivateBankAccountModal();
      return;
    }

    const entered = parseBankDepositAmountInput(bankAccountDepositAmountInput);
    if (entered === null) {
      toast.error("Enter a valid deposit amount.");
      return;
    }

    const matchesDemoDeposit =
      Math.abs(entered - DEMO_MICRO_DEPOSIT_VERIFICATION_AMOUNT) < 0.009;

    if (matchesDemoDeposit) {
      setBankAccounts((prev) =>
        prev.map((a) =>
          a.id === activateBankAccountId
            ? {
                ...a,
                activationStatus: "active" as const,
                activationVerifyAttemptCount: undefined,
              }
            : a
        )
      );
      toast.success("Bank account activated", {
        description: "Your account is ready to use for deposits and reimbursements.",
      });
      closeActivateBankAccountModal();
      return;
    }

    const nextFailures = prevFailures + 1;
    setBankAccounts((prev) =>
      prev.map((a) =>
        a.id === activateBankAccountId ? { ...a, activationVerifyAttemptCount: nextFailures } : a
      )
    );

    if (nextFailures >= 2) {
      toast.error("This bank account has been locked after two incorrect attempts.", {
        description: "Remove the account and add it again, or contact support for help.",
      });
      closeActivateBankAccountModal();
    } else {
      toast.error("Incorrect amount.", {
        description: "You have one attempt remaining before this account is locked.",
      });
      setBankAccountDepositAmountInput("");
    }
  };

  const closeRemoveBankAccountAuthModal = () => {
    setIsRemoveBankAccountAuthModalOpen(false);
    setRemoveBankAuthShowCode(false);
    setRemoveBankAuthMethod("");
    setRemoveBankAuthCode("");
    setRemoveBankAuthCodePlain(false);
    setRemoveBankAuthResendTimer(0);
    setBankAccountToRemove(null);
  };

  const handleRemoveBankAccountClick = (bankAccount: BankAccount) => {
    setBankAccountToRemove(bankAccount);
    setIsRemoveBankAccountConfirmOpen(true);
  };

  const openRemoveBankAccountAuthAfterConfirm = () => {
    preserveBankAccountToRemoveAfterConfirmCloseRef.current = true;
    setRemoveBankAuthShowCode(false);
    setRemoveBankAuthMethod("");
    setRemoveBankAuthCode("");
    setRemoveBankAuthCodePlain(false);
    setRemoveBankAuthResendTimer(0);
    setIsRemoveBankAccountConfirmOpen(false);
    setIsRemoveBankAccountAuthModalOpen(true);
  };

  const handleRemoveBankAccount = (id: string) => {
    const bankAccount = bankAccounts.find((acc) => acc.id === id);
    const displayName = bankAccount
      ? (bankAccount.accountNickname || "").trim() ||
        bankAccount.bankName?.trim() ||
        `${bankAccount.accountType.charAt(0).toUpperCase() + bankAccount.accountType.slice(1)} Account`
      : "Bank account";

    setBankAccounts((prev) => prev.filter((acc) => acc.id !== id));
    setIsRemoveBankAccountConfirmOpen(false);
    setIsRemoveBankAccountAuthModalOpen(false);
    setBankAccountToRemove(null);
    setRemoveBankAuthShowCode(false);
    setRemoveBankAuthMethod("");
    setRemoveBankAuthCode("");
    setRemoveBankAuthCodePlain(false);
    setRemoveBankAuthResendTimer(0);

    setActiveSubPage("banking");
    setSearchParams({ subPage: "banking" });

    toast.success("Bank account removed", {
      description: `${displayName} has been removed from your Bank Accounts.`,
      duration: 5000,
    });
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "Not provided";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // US States list for dropdown
  const usStates = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
  ];

  // Reset form when modal closes (only if not editing)
  useEffect(() => {
    if (!isAddDependentModalOpen && !editingDependentId) {
      resetForm();
      setEditingDependentId(null);
    }
  }, [isAddDependentModalOpen, editingDependentId]);

  // Reset beneficiary form when modal closes (only if not editing)
  useEffect(() => {
    if (!isAddBeneficiaryModalOpen && !editingBeneficiaryId) {
      resetBeneficiaryForm();
      setEditingBeneficiaryId(null);
    }
  }, [isAddBeneficiaryModalOpen, editingBeneficiaryId]);

  // Reset authorized signer form when modal closes (only if not editing)
  useEffect(() => {
    if (!isAddAuthorizedSignerModalOpen && !editingAuthorizedSignerId) {
      resetAuthorizedSignerForm();
      setEditingAuthorizedSignerId(null);
    }
  }, [isAddAuthorizedSignerModalOpen, editingAuthorizedSignerId]);

  // Reset bank account form when modal closes, unless Add Bank Account workspace is open (post-auth flow)
  useEffect(() => {
    if (!isAddBankAccountModalOpen && !isAddBankAccountWorkspaceOpen) {
      setBankAccountFormData({
        verificationMethod: "",
        verificationCode: "",
        routingNumber: "",
        accountNumber: "",
        confirmAccountNumber: "",
        accountNickname: "",
        accountType: "checking",
        bankName: "",
        addressLine1: "",
        city: "",
        bankState: "",
        zipCode: "",
        selectedDirectDepositOptions: [],
      });
      setBankAccountStep("step1");
      setEditingBankAccountId(null);
      setShowVerificationCode(false);
      setResendTimer(0);
      setShowBankVerificationCodePlain(false);
    }
  }, [isAddBankAccountModalOpen, isAddBankAccountWorkspaceOpen]);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Start timer when verification code is shown
  useEffect(() => {
    if (showVerificationCode && resendTimer === 0) {
      setResendTimer(45); // 45 seconds
    }
  }, [showVerificationCode]);

  useEffect(() => {
    if (removeBankAuthResendTimer > 0) {
      const timer = setTimeout(() => {
        setRemoveBankAuthResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [removeBankAuthResendTimer]);

  const addBankWorkspaceRoutingDigits = bankAccountFormData.routingNumber.replace(/\D/g, "");
  const addBankWorkspaceRoutingInvalid =
    addBankWorkspaceRoutingDigits.length > 0 && addBankWorkspaceRoutingDigits.length !== 9;

  const addBankWorkspaceConfirmMismatch =
    bankAccountFormData.confirmAccountNumber.length > 0 &&
    bankAccountFormData.accountNumber !== bankAccountFormData.confirmAccountNumber;

  const addBankWorkspaceSaveDisabled = useMemo(() => {
    const d = bankAccountFormData;
    const routingOk = d.routingNumber.replace(/\D/g, "").length === 9;
    const account = d.accountNumber.trim();
    const confirm = d.confirmAccountNumber.trim();
    return (
      !routingOk ||
      !account ||
      !confirm ||
      account !== confirm ||
      !d.accountNickname.trim() ||
      !d.bankName.trim() ||
      !d.addressLine1.trim() ||
      !d.city.trim() ||
      !d.bankState.trim() ||
      !d.zipCode.trim()
    );
  }, [bankAccountFormData]);

  const bankAccountForActivationModal = useMemo((): BankAccount | null => {
    if (!activateBankAccountId) return null;
    return bankAccounts.find((a) => a.id === activateBankAccountId) ?? null;
  }, [activateBankAccountId, bankAccounts]);

  /** Last 9-digit routing we used to autofill Wells Fargo demo bank details (workspace). */
  const bankDetailAutofillRoutingRef = useRef<string>("");

  useEffect(() => {
    if (!isAddBankAccountWorkspaceOpen) {
      bankDetailAutofillRoutingRef.current = "";
      return;
    }
    const digits = bankAccountFormData.routingNumber.replace(/\D/g, "");
    if (digits.length === 9) {
      if (bankDetailAutofillRoutingRef.current !== digits) {
        bankDetailAutofillRoutingRef.current = digits;
        setBankAccountFormData((prev) => ({
          ...prev,
          bankName: "Wells Fargo Bank",
          addressLine1: "Address Street 123",
          city: "Fargo",
          bankState: "ND",
          zipCode: "12345",
        }));
      }
    } else {
      bankDetailAutofillRoutingRef.current = "";
    }
  }, [bankAccountFormData.routingNumber, isAddBankAccountWorkspaceOpen]);

  const menuSections: { 
    title: string; 
    items: { label: string; key: SubPage; icon: React.ComponentType<{ className?: string }> }[] 
  }[] = [
    {
      title: "ACCOUNT",
      items: [
        { label: "My Profile", key: "my-profile", icon: User },
        { label: "Dependents", key: "dependents", icon: Users },
        { label: "Beneficiaries", key: "beneficiaries", icon: HeartPlus },
        { label: "Authorized Signers", key: "authorized-signers", icon: ShieldCheck },
      ],
    },
    {
      title: "PAYMENTS",
      items: [
        { label: "Bank Accounts", key: "banking", icon: Landmark },
        { label: "Reimbursement Methods", key: "reimbursement-method", icon: DollarSign },
        { label: "Debit Card", key: "debit-card", icon: CreditCard },
      ],
    },
    {
      title: "PREFERENCES & SECURITY",
      items: [
        { label: "Login & Security", key: "login-security", icon: UserLock },
        { label: "Communication Preferences", key: "communication", icon: Bell },
      ],
    },
  ];

  const renderContent = (subPage: SubPage) => {
    switch (subPage) {
      case "my-profile":
        return (
          <>
            {/* Page Header */}
            <div className="pt-4 pb-2">
              <div className="px-6 flex items-center">
                <h2 className="text-2xl font-semibold text-gray-800">My Profile</h2>
              </div>
              <Separator className="mt-4" />
            </div>

            <div className="space-y-0">
              {/* Personal Information Section */}
              <div className="px-6 pt-4 pb-6">
                <div className="mb-4 flex items-center gap-4">
                  <h3 className="text-xl font-medium text-gray-800">Personal Information</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[color:var(--system-link)] hover:text-[color:var(--system-link)] active:text-[color:var(--system-link)] [&>svg]:text-[color:var(--system-link)]"
                  >
                    <Pencil />
                    Edit
                  </Button>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-normal text-gray-800">{personalName}</p>
                  </div>
                  <div className="flex gap-1.5 text-sm">
                    <span className="text-gray-500">Date of birth:</span>
                    <span className="text-gray-800">12/13/1989</span>
                  </div>
                  <div className="flex gap-1.5 text-sm">
                    <span className="text-gray-500">Gender:</span>
                    <span className="text-gray-800">Female</span>
                  </div>
                  <div className="flex gap-1.5 text-sm">
                    <span className="text-gray-500">Marital Status:</span>
                    <span className="text-gray-800">Married</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Contact Information Section */}
              <div className="px-6 pt-4 pb-6">
                <div className="mb-4 flex items-center gap-4">
                  <h3 className="text-xl font-medium text-gray-800">Contact Information</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[color:var(--system-link)] hover:text-[color:var(--system-link)] active:text-[color:var(--system-link)] [&>svg]:text-[color:var(--system-link)]"
                  >
                    <Pencil />
                    Edit
                  </Button>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex gap-1.5">
                    <span className="text-gray-500">Primary email address:</span>
                    <span className="text-gray-800">penny.smith@wexinc.com</span>
                  </div>
                  <div className="flex gap-1.5">
                    <span className="text-gray-500">Secondary email address:</span>
                    <span className="text-gray-800">pennysmith@gmail.com</span>
                  </div>
                  <div className="flex gap-1.5">
                    <span className="text-gray-500">Mobile Number:</span>
                    <span className="text-gray-800">+1 (859) 123-12345</span>
                  </div>
                  <div className="flex gap-1.5">
                    <span className="text-gray-500">Home Number:</span>
                    <span className="text-gray-800">+1 (859) 123-12345</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Address Information Section */}
              <div className="px-6 pt-4 pb-6">
                <div className="mb-4 flex items-center gap-4">
                  <h3 className="text-xl font-medium text-gray-800">Address Information</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[color:var(--system-link)] hover:text-[color:var(--system-link)] active:text-[color:var(--system-link)] [&>svg]:text-[color:var(--system-link)]"
                  >
                    <Pencil />
                    Edit
                  </Button>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="space-y-0.5">
                    <span className="text-gray-500">Home Address:</span>
                    <div className="text-gray-800">123 Main Street</div>
                    <div className="text-gray-800">Anytown, NY 12345</div>
                    <div className="text-gray-800">United States</div>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-gray-500">Mailing Address:</span>
                    <div className="text-gray-800">Same as home address</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case "dependents":
        return (
          <>
            <div className="pt-4 pb-2">
              <div className="px-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-2xl font-semibold text-gray-800">Dependents</h2>
                <Button
                  intent="primary"
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto justify-center border-primary text-primary hover:bg-blue-50 [&_svg]:text-current"
                  onClick={() => {
                    resetForm();
                    setEditingDependentId(null);
                    setIsAddDependentModalOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 text-current" />
                  <span className="sm:ml-2">Add Dependent</span>
                </Button>
              </div>
              <Separator className="mt-4" />
            </div>
            {dependents.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-8 py-16">
                <Empty className="border-0 py-12">
                  <EmptyHeader>
                    <EmptyMedia variant="default">
                      <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-gray-100">
                        <Users className="h-10 w-10 text-gray-400" />
                      </div>
                    </EmptyMedia>
                    <EmptyTitle className="text-lg font-semibold text-foreground">
                      Add a Dependent
                    </EmptyTitle>
                    <EmptyDescription>
                      You have no dependents added yet. Add a dependent to manage their information and benefits.
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button
                      intent="primary"
                      onClick={() => {
                        resetForm();
                        setEditingDependentId(null);
                        setIsAddDependentModalOpen(true);
                      }}
                    >
                      <Plus className="h-4 w-4 text-current" />
                      <span>Add Dependent</span>
                    </Button>
                  </EmptyContent>
                </Empty>
              </div>
            ) : (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dependents.map((dependent) => (
                    <Card
                      key={dependent.id}
                      className="p-4 bg-white rounded-lg shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]"
                    >
                      <CardContent className="p-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-foreground mb-0">
                              {dependent.firstName} {dependent.middleName ? `${dependent.middleName} ` : ""}{dependent.lastName}
                            </h3>
                            <p className="text-[11px] text-gray-500 mb-3 capitalize">
                              {dependent.relationship}
                            </p>
                            <div className="space-y-1 text-sm text-foreground">
                              <div>
                                <span>Date of Birth: </span>
                                <span>{formatDate(dependent.birthDate)}</span>
                              </div>
                              <div>
                                <span>Full Time Student: </span>
                                <span>{dependent.isFullTimeStudent ? "Yes" : "No"}</span>
                              </div>
                            </div>
                          </div>
                          <DropdownMenu
                            open={openDependentDropdownId === dependent.id}
                            onOpenChange={(open) =>
                              setOpenDependentDropdownId(open ? dependent.id : null)
                            }
                          >
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 p-0"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[198px] min-w-[175px]">
                              <DropdownMenuItem
                                className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                                onClick={() => {
                                  handleViewDependent(dependent);
                                  setOpenDependentDropdownId(null);
                                }}
                              >
                                <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="text-sm leading-none">View</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                                onClick={() => {
                                  handleEditDependent(dependent);
                                  setOpenDependentDropdownId(null);
                                }}
                              >
                                <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="text-sm leading-none">Edit</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                                onClick={() => {
                                  handleRemoveClick(dependent);
                                  setOpenDependentDropdownId(null);
                                }}
                              >
                                <Trash2 className="h-3.5 w-3.5 text-red-500" />
                                <span className="text-sm text-red-500 leading-none">Remove</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        );

      case "beneficiaries":
        return (
          <>
            <div className="pt-4 pb-2">
              <div className="px-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-2xl font-semibold text-gray-800">Beneficiaries</h2>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    intent="primary"
                    variant="ghost"
                    size="sm"
                    className="w-full sm:w-auto justify-center"
                    onClick={() => {
                      const initialShares: Record<string, string> = {};
                      beneficiaries.forEach((ben) => {
                        initialShares[ben.id] = ben.sharePercentage || (beneficiaries.length === 1 ? "100" : "0");
                      });
                      setEditPercentagesShares(initialShares);
                      setEditPercentagesSplitEqually(false);
                      setIsEditPercentagesModalOpen(true);
                    }}
                  >
                    Edit Shares
                  </Button>
                  <Button
                    intent="primary"
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto justify-center border-primary text-primary hover:bg-blue-50 [&_svg]:text-current"
                    onClick={() => {
                      resetBeneficiaryForm();
                      setEditingBeneficiaryId(null);
                      setSelectedDependentIds([]);
                      setIsAddBeneficiaryWorkspaceOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4 text-current" />
                    <span>Add Beneficiary</span>
                  </Button>
                </div>
              </div>
              <Separator className="mt-4" />
            </div>
            {beneficiaries.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-8 py-16">
                <Empty className="border-0 py-12">
                  <EmptyHeader>
                    <EmptyMedia variant="default">
                      <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-gray-100">
                        <HeartPlus className="h-10 w-10 text-gray-400" />
                      </div>
                    </EmptyMedia>
                    <EmptyTitle className="text-lg font-semibold text-foreground">
                      Add a Beneficiary
                    </EmptyTitle>
                    <EmptyDescription>
                      You have no beneficiaries added yet. Add a beneficiary to designate who will receive your benefits.
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button
                      intent="primary"
                      onClick={() => {
                        resetBeneficiaryForm();
                        setEditingBeneficiaryId(null);
                        setSelectedDependentIds([]);
                        setIsAddBeneficiaryWorkspaceOpen(true);
                      }}
                    >
                      <Plus className="h-4 w-4 text-current" />
                      <span>Add Beneficiary</span>
                    </Button>
                  </EmptyContent>
                </Empty>
              </div>
            ) : (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {beneficiaries.map((beneficiary) => (
                    <Card
                      key={beneficiary.id}
                      className="p-4 bg-white rounded-lg shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]"
                    >
                      <CardContent className="p-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-foreground mb-0">
                              {beneficiary.firstName} {beneficiary.middleName ? `${beneficiary.middleName} ` : ""}{beneficiary.lastName}
                            </h3>
                            <p className="text-[11px] text-gray-500 mb-3 capitalize">
                              {beneficiary.relationship}
                            </p>
                            <div className="space-y-1 text-sm text-foreground">
                              <div>
                                <span>Beneficiary Type: </span>
                                <span className="capitalize">{beneficiary.beneficiaryType === "primary" ? "Primary" : "Contingent"}</span>
                              </div>
                              <div>
                                <span>Share: </span>
                                <span>
                                  {beneficiaries.length === 1 ? "100" : (beneficiary.sharePercentage || "0")}%
                                </span>
                              </div>
                            </div>
                          </div>
                          <DropdownMenu
                            open={openBeneficiaryDropdownId === beneficiary.id}
                            onOpenChange={(open) =>
                              setOpenBeneficiaryDropdownId(open ? beneficiary.id : null)
                            }
                          >
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 p-0"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[198px] min-w-[175px]">
                              <DropdownMenuItem
                                className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                                onClick={() => {
                                  handleViewBeneficiary(beneficiary);
                                  setOpenBeneficiaryDropdownId(null);
                                }}
                              >
                                <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="text-sm leading-none">View</span>
                              </DropdownMenuItem>
                              {(() => {
                                const isDependent = dependents.some((dep) => dep.ssn === beneficiary.ssn);
                                
                                const editItem = (
                                  <DropdownMenuItem
                                    className={`flex items-center gap-2 px-3 py-2 ${
                                      isDependent
                                        ? "cursor-not-allowed opacity-50"
                                        : "cursor-pointer"
                                    }`}
                                    disabled={isDependent}
                                    onClick={() => {
                                      if (!isDependent) {
                                        handleEditBeneficiary(beneficiary);
                                        setOpenBeneficiaryDropdownId(null);
                                      }
                                    }}
                                  >
                                    <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span className="text-sm leading-none">Edit</span>
                                  </DropdownMenuItem>
                                );

                                if (isDependent) {
                                  return (
                                    <div className="w-full">
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <div className="w-full">
                                            {editItem}
                                          </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          You can edit personal dependent information going to the dependent section on the left menubar
                                        </TooltipContent>
                                      </Tooltip>
                                    </div>
                                  );
                                }

                                return editItem;
                              })()}
                              <DropdownMenuItem
                                className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                                onClick={() => {
                                  handleRemoveBeneficiaryClick(beneficiary);
                                  setOpenBeneficiaryDropdownId(null);
                                }}
                              >
                                <Trash2 className="h-3.5 w-3.5 text-red-500" />
                                <span className="text-sm text-red-500 leading-none">Remove</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        );

      case "authorized-signers":
        return (
          <>
            <div className="pt-4 pb-2">
              <div className="px-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-2xl font-semibold text-gray-800">Authorized Signers</h2>
                <Button
                  intent="primary"
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto justify-center border-primary text-primary hover:bg-blue-50 [&_svg]:text-current"
                  onClick={() => {
                    resetAuthorizedSignerForm();
                    setEditingAuthorizedSignerId(null);
                    setIsAddAuthorizedSignerModalOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 text-current" />
                  <span className="sm:ml-2">Add Authorized Signer</span>
                </Button>
              </div>
              <Separator className="mt-4" />
            </div>
            {authorizedSigners.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-8 py-16">
                <Empty className="border-0 py-12">
                  <EmptyHeader>
                    <EmptyMedia variant="default">
                      <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-gray-100">
                        <ShieldCheck className="h-10 w-10 text-gray-400" />
                      </div>
                    </EmptyMedia>
                    <EmptyTitle className="text-lg font-semibold text-foreground">
                      Add an Authorized Signer
                    </EmptyTitle>
                    <EmptyDescription>
                      You have no authorized signers added yet. Add an authorized signer to grant them permission to act on your behalf.
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button
                      intent="primary"
                      onClick={() => {
                        resetAuthorizedSignerForm();
                        setEditingAuthorizedSignerId(null);
                        setIsAddAuthorizedSignerModalOpen(true);
                      }}
                    >
                      <Plus className="h-4 w-4 text-current" />
                      <span>Add Authorized Signer</span>
                    </Button>
                  </EmptyContent>
                </Empty>
              </div>
            ) : (
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {authorizedSigners.map((signer) => (
                  <Card key={signer.id} className="p-4 w-80">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-0">
                          {signer.firstName} {signer.middleName ? `${signer.middleName} ` : ""}{signer.lastName}
                        </h3>
                        <p className="text-[11px] text-gray-500 mb-3 capitalize">
                          {signer.type}
                        </p>
                        <div className="flex gap-1.5 text-sm text-foreground">
                          <span className="text-gray-500">Birth Date:</span>
                          <span>{signer.birthDate || "Not provided"}</span>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 p-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4 text-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                            onClick={() => handleViewAuthorizedSigner(signer)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="text-sm text-foreground leading-none">View</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                            onClick={() => handleEditAuthorizedSigner(signer)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="text-sm text-foreground leading-none">Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex items-center gap-2 px-3 py-2 cursor-pointer text-red-500"
                            onClick={() => handleRemoveAuthorizedSignerClick(signer)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" aria-hidden />
                            <span className="text-sm leading-none">Remove</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        );

      case "reimbursement-method":
        return <ReimbursementMethodsContent />;

      case "banking":
        return (
          <>
            <div className="pt-4 pb-2">
              <div className="px-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-2xl font-semibold text-gray-800">Bank Accounts</h2>
                <Button
                  intent="primary"
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto justify-center border-primary text-primary hover:bg-blue-50 [&_svg]:text-current"
                  onClick={() => {
                    setBankAccountFormData({
                      verificationMethod: "",
                      verificationCode: "",
                      accountType: "checking",
                      accountNumber: "",
                      confirmAccountNumber: "",
                      routingNumber: "",
                      accountNickname: "",
                      bankName: "",
                      addressLine1: "",
                      city: "",
                      bankState: "",
                      zipCode: "",
                      selectedDirectDepositOptions: [],
                    });
                    setBankAccountStep("step1");
                    setEditingBankAccountId(null);
                    setIsAddBankAccountModalOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 text-current" />
                  <span className="sm:ml-2">Add Bank Account</span>
                </Button>
              </div>
              <Separator className="mt-4" />
            </div>
            {bankAccounts.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-8 py-16">
                <Empty className="border-0 py-12">
                  <EmptyHeader>
                    <EmptyMedia variant="default">
                      <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-gray-100">
                        <Landmark className="h-10 w-10 text-gray-400" />
                      </div>
                    </EmptyMedia>
                    <EmptyTitle className="text-lg font-semibold text-foreground">
                      Add a Bank Account
                    </EmptyTitle>
                    <EmptyDescription>
                      You have no bank accounts added yet. Connect a bank account to receive reimbursements and deposits directly.
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button
                      intent="primary"
                      onClick={() => {
                        setBankAccountFormData({
                          verificationMethod: "",
                          verificationCode: "",
                          accountType: "checking",
                          accountNumber: "",
                          confirmAccountNumber: "",
                          routingNumber: "",
                          accountNickname: "",
                          bankName: "",
                          addressLine1: "",
                          city: "",
                          bankState: "",
                          zipCode: "",
                          selectedDirectDepositOptions: [],
                        });
                        setBankAccountStep("step1");
                        setEditingBankAccountId(null);
                        setIsAddBankAccountModalOpen(true);
                      }}
                    >
                      <Plus className="h-4 w-4 text-current" />
                      <span>Add Bank Account</span>
                    </Button>
                  </EmptyContent>
                </Empty>
                <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                  <Lock className="h-4 w-4" />
                  <span>Your bank information is protected</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-start gap-6 p-6">
                {bankAccounts.map((bankAccount) => {
                  const displayTitle =
                    bankAccount.accountNickname.trim() ||
                    bankAccount.bankName?.trim() ||
                    `${bankAccount.accountType.charAt(0).toUpperCase() + bankAccount.accountType.slice(1)} Account`;
                  const accountDigits = bankAccount.accountNumber.replace(/\D/g, "");
                  const last4 =
                    accountDigits.length >= 4 ? accountDigits.slice(-4) : accountDigits || "—";
                  const accountTypeWord =
                    bankAccount.accountType === "checking" ? "Checking" : "Saving";
                  const bankNameForTypeLine = bankAccount.bankName?.trim() ?? "";
                  const accountTypeLine = bankNameForTypeLine
                    ? `${accountTypeWord} Account | ${bankNameForTypeLine}`
                    : `${accountTypeWord} Account`;
                  const isPendingDeposit = bankAccount.activationStatus !== "active";
                  const isBankActivationLocked = (bankAccount.activationVerifyAttemptCount ?? 0) >= 2;

                  return (
                    <div
                      key={bankAccount.id}
                      className="flex w-[325px] max-w-full shrink-0 flex-col rounded-lg border border-[#e4e6e9] bg-white p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.1)]"
                    >
                      <div className="mb-2 flex flex-col gap-1">
                        <div className="flex min-h-[35px] items-center justify-between gap-2">
                          <p className="min-w-0 flex-1 text-base font-semibold leading-6 tracking-[-0.176px] text-[#1d2c38]">
                            {displayTitle}
                          </p>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-[35px] w-[35px] shrink-0 text-[#1d2c38]"
                                aria-label="Bank account options"
                              >
                                <MoreVertical className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="min-w-[160px]">
                            {isPendingDeposit ? (
                              <DropdownMenuItem
                                className="flex cursor-pointer items-center gap-2 text-[#1d2c38] focus:text-[#1d2c38]"
                                onClick={() => handleEditBankAccount(bankAccount)}
                              >
                                <Pencil className="h-4 w-4" />
                                <span>Edit</span>
                              </DropdownMenuItem>
                            ) : null}
                            <DropdownMenuItem
                              className="flex cursor-pointer items-center gap-2 text-destructive focus:text-destructive"
                              onClick={() => handleRemoveBankAccountClick(bankAccount)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" aria-hidden />
                              <span>Remove</span>
                            </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <p className="text-[13px] font-normal leading-5 tracking-[0.055px] text-[#515f6b]">
                          {accountTypeLine}
                        </p>
                      </div>
                      <div className="mb-4 flex flex-wrap items-center gap-2">
                        <span className="whitespace-nowrap text-sm font-normal leading-6 tracking-[-0.084px] text-[#1d2c38]">
                          •••• {last4}
                        </span>
                        {isPendingDeposit ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                className="inline-flex cursor-help items-center rounded-md border-0 bg-[#ffecc7] px-[7px] py-[3.5px] text-[12.25px] font-bold leading-none text-[#b37a2b]"
                              >
                                Verify Deposit to Activate
                              </button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs text-left">
                              A small deposit will be sent within 1–3 business days. Once received,
                              you&apos;ll have 10 days to confirm the amount and activate your account.
                            </TooltipContent>
                          </Tooltip>
                        ) : null}
                      </div>
                      {isPendingDeposit ? (
                        <Button
                          intent="primary"
                          className="w-full"
                          disabled={isBankActivationLocked}
                          title={
                            isBankActivationLocked
                              ? "This account is locked after two incorrect activation attempts."
                              : undefined
                          }
                          onClick={() => handleOpenActivateBankAccountModal(bankAccount)}
                        >
                          Activate
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          className="h-auto w-full rounded-md border-[#0058a3] bg-transparent px-[13.25px] py-[9.75px] text-[15.75px] font-medium leading-normal text-[#0058a3] shadow-none hover:bg-[#0058a3]/10"
                          onClick={() => handleEditBankAccount(bankAccount)}
                        >
                          Edit
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        );

      case "debit-card":
        return (
          <>
            {/* Page Header */}
            <div className="border-b border-border px-6 py-4">
              <h2 className="text-2xl font-semibold text-foreground tracking-[-0.456px] leading-8">
                Debit Card
              </h2>
            </div>

            {/* Description */}
            <div className="px-6 py-6">
              <p className="text-[17px] text-foreground leading-6 tracking-[-0.221px]">
                Manage your debit cards, activation, status, and replacements.
              </p>
            </div>

            {debitCards.length === 0 ? (
              /* ── Empty State (Figma: node 14087:19568) ── */
              <div className="flex flex-1 items-start justify-center px-6 pb-6 pt-4">
                <Empty className="w-full">
                  <EmptyHeader className="max-w-xl">
                    <EmptyMedia variant="default">
                      <div className="flex items-center justify-center rounded-lg bg-muted p-4">
                        <CreditCard className="h-10 w-10 text-muted-foreground" />
                      </div>
                    </EmptyMedia>
                    <EmptyTitle className="text-2xl font-semibold text-foreground tracking-[-0.456px]">
                      You don&apos;t have a debit card yet
                    </EmptyTitle>
                    <EmptyDescription className="text-sm text-foreground tracking-[-0.084px] text-center">
                      Debit cards are automatically issued by your employer when you are enrolled in an eligible plan. For more details, contact your administrator.
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <div className="flex items-center gap-6">
                      <Button variant="link" intent="primary" className="text-[15.75px] font-medium p-0 h-auto">
                        View eligible plans
                      </Button>
                      <Button variant="link" intent="primary" className="text-[15.75px] font-medium p-0 h-auto">
                        Learn how WEX debit cards work
                      </Button>
                    </div>
                  </EmptyContent>
                </Empty>
              </div>
            ) : (
            /* ── Cards present ── */
            <div className="px-6 pb-6">
              <div className="flex flex-col gap-6">
                {/* Cards Row */}
                <div className="grid grid-cols-3 gap-6">
                  {debitCards.map((card) => (
                    <Card
                      key={card.id}
                      className="p-4 bg-white rounded-lg shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] relative"
                    >
                      <div className="flex flex-col gap-2">
                        {/* Card Header */}
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-semibold text-foreground tracking-[-0.176px] leading-6 whitespace-nowrap">
                            {card.cardholderName}
                          </h3>
                          <DropdownMenu
                            open={openDropdownId === card.id}
                            onOpenChange={(open) =>
                              setOpenDropdownId(open ? card.id : null)
                            }
                          >
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-[35px] w-[35px] p-0"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="h-3.5 w-3.5 text-foreground" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[198px] min-w-[175px]">
                              <DropdownMenuItem
                                className="flex items-center gap-2 px-[10.5px] py-[7px] cursor-pointer"
                                onClick={() => {
                                  setSelectedCardForDetails(card);
                                  setIsCardDetailsModalOpen(true);
                                  setOpenDropdownId(null);
                                }}
                              >
                                <Eye className="h-3.5 w-3.5 text-foreground" />
                                <span className="text-sm text-foreground leading-none">View Details</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="flex items-center gap-2 px-[10.5px] py-[7px] cursor-pointer"
                                onClick={() => {
                                  setCardBeingReplaced(card);
                                  setIsOrderReplacementWorkspaceOpen(true);
                                  setOpenDropdownId(null);
                                }}
                              >
                                <RefreshCw className="h-3.5 w-3.5 text-foreground" />
                                <span className="text-sm text-foreground leading-none">Order Replacement</span>
                              </DropdownMenuItem>
                              {card.status === "ready-to-activate" && (
                                <DropdownMenuItem
                                  className="flex items-center gap-2 px-[10.5px] py-[7px] cursor-pointer"
                                  onClick={() => {
                                    setCardBeingReported(card);
                                    setIsReportLostStolenWorkspaceOpen(true);
                                    setOpenDropdownId(null);
                                  }}
                                >
                                  <Lock className="h-3.5 w-3.5 text-destructive" />
                                  <span className="text-sm text-destructive leading-none">Report Lost/Stolen</span>
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Card Details */}
                        <div className="flex flex-col gap-1">
                          {/* Card Number + Status Tag */}
                          <div className="flex items-center gap-1.5">
                            <span className="text-[14px] text-foreground tracking-[-0.084px] leading-6 whitespace-nowrap">
                              •••• {card.cardNumber}
                            </span>
                            {card.status === "ready-to-activate" && (
                              <span className="inline-flex items-center px-[7px] py-[3.5px] rounded-[12px] bg-[#dcfce7] text-[#008375] text-[11px] font-semibold leading-none whitespace-nowrap">
                                Ready to Activate
                              </span>
                            )}
                            {card.status === "deactivated" && (
                              <>
                                <span className="inline-flex items-center px-[7px] py-[3.5px] rounded-[12px] bg-[#ffecc7] text-[#b37a2b] text-[11px] font-semibold leading-none whitespace-nowrap">
                                  Deactivated
                                </span>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button type="button" className="inline-flex items-center focus:outline-none">
                                      <Info className="h-4 w-4 text-muted-foreground shrink-0" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-[200px] text-center">
                                    Online card activation cannot be completed due to an issue with the cardholder agreement. Please contact your administrator for assistance.
                                  </TooltipContent>
                                </Tooltip>
                              </>
                            )}
                            {card.status === "active" && (
                              <span className="inline-flex items-center px-[7px] py-[3.5px] rounded-[12px] bg-[#dbeafe] text-[#1d4ed8] text-[11px] font-semibold leading-none whitespace-nowrap">
                                Active
                              </span>
                            )}
                            {card.status === "suspended" && (
                              <span className="inline-flex items-center px-[7px] py-[3.5px] rounded-[12px] bg-[#ffe4e6] text-[#e11d48] text-[11px] font-semibold leading-none whitespace-nowrap">
                                Suspended
                              </span>
                            )}
                            {card.status === "replacement-ordered" && (
                              <span className="inline-flex items-center px-[7px] py-[3.5px] rounded-[12px] bg-[#e0e7ff] text-[#3730a3] text-[11px] font-semibold leading-none whitespace-nowrap">
                                Replacement Ordered
                              </span>
                            )}
                          </div>

                          {/* Expiration Date */}
                          <div className="flex items-center gap-1.5">
                            <span className="text-[14px] text-muted-foreground tracking-[-0.084px] leading-6 whitespace-nowrap">
                              Expires:
                            </span>
                            <span className="text-[14px] text-foreground tracking-[-0.084px] leading-6 whitespace-nowrap">
                              {card.expirationDate}
                            </span>
                          </div>

                          {/* Effective Date */}
                          <div className="flex items-center gap-1.5">
                            <span className="text-[14px] text-muted-foreground tracking-[-0.084px] leading-6 whitespace-nowrap">
                              Effective:
                            </span>
                            <span className="text-[14px] text-foreground tracking-[-0.084px] leading-6 whitespace-nowrap">
                              {card.effectiveDate}
                            </span>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="mt-2">
                          {card.status === "ready-to-activate" ? (
                            <Button
                              intent="primary"
                              className="w-full"
                              onClick={() => {
                                setCardBeingActivated(card);
                                setIsActivationAuthModalOpen(true);
                              }}
                            >
                              Activate
                            </Button>
                          ) : (
                            <Button
                              intent="destructive"
                              variant="outline"
                              className="w-full"
                              disabled={card.status === "suspended" || card.status === "replacement-ordered"}
                              onClick={() => {
                                setCardBeingReported(card);
                                setIsReportLostStolenWorkspaceOpen(true);
                              }}
                            >
                              Report Lost/Stolen
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Informational Alert — matches Figma message component */}
                <Alert
                  intent="info"
                  className="border border-blue-200 bg-[rgba(239,246,255,0.95)] rounded-md shadow-[0px_4px_8px_0px_rgba(2,5,10,0.04)]"
                >
                  <AlertCircle className="h-[15.75px] w-[15.75px] text-[hsl(var(--wex-info))]" />
                  <AlertDescription className="text-base text-[hsl(var(--wex-info))] leading-6 tracking-[-0.176px]">
                    <span className="font-normal">
                      Request New Personal Identification Number (PIN) Toll Free Number:{" "}
                    </span>
                    <span className="font-semibold">(866) 898-9795</span>
                  </AlertDescription>
                </Alert>
              </div>
            </div>
            )} {/* end debitCards.length > 0 */}

            {/* Card Details Modal */}
            <Dialog open={isCardDetailsModalOpen} onOpenChange={setIsCardDetailsModalOpen}>
              <DialogContent className="w-[448px] p-0 gap-0">
                {/* Header */}
                <div className="flex items-center justify-between p-[17.5px]">
                  <DialogTitle className="text-[17.5px] font-semibold text-foreground leading-normal whitespace-nowrap">
                    Card Details
                  </DialogTitle>
                </div>

                {selectedCardForDetails && (
                  <div className="flex flex-col gap-6 pb-6 px-[18px]">
                    {/* ── Card info bordered box ── */}
                    <div className="border border-border rounded-[8px] py-4 flex flex-col gap-[9px]">
                      {/* Cardholder row */}
                      <div className="flex items-center gap-1.5 px-4">
                        <CreditCard className="h-4 w-4 text-foreground shrink-0" />
                        <span className="text-[16px] font-medium text-foreground leading-6 tracking-[-0.176px]">
                          {selectedCardForDetails.cardholderName}
                        </span>
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-border w-full" />

                      {/* Key-value rows */}
                      <div className="flex flex-col gap-2 px-4">
                        {/* Card Status */}
                        <div className="flex items-center justify-between">
                          <span className="text-[14px] text-muted-foreground tracking-[-0.084px] leading-6 whitespace-nowrap">
                            Card Status:
                          </span>
                          {selectedCardForDetails.status === "ready-to-activate" && (
                            <span className="inline-flex items-center px-[7px] py-[3.5px] rounded-[12px] bg-[#dcfce7] text-[#008375] text-[11px] font-semibold leading-none whitespace-nowrap">
                              Ready to Activate
                            </span>
                          )}
                          {selectedCardForDetails.status === "deactivated" && (
                            <span className="inline-flex items-center px-[7px] py-[3.5px] rounded-[12px] bg-[#ffecc7] text-[#b37a2b] text-[11px] font-semibold leading-none whitespace-nowrap">
                              Deactivated
                            </span>
                          )}
                          {selectedCardForDetails.status === "active" && (
                            <span className="inline-flex items-center px-[7px] py-[3.5px] rounded-[12px] bg-[#dbeafe] text-[#1d4ed8] text-[11px] font-semibold leading-none whitespace-nowrap">
                              Active
                            </span>
                          )}
                        </div>

                        {/* Card Number */}
                        <div className="flex items-center justify-between">
                          <span className="text-[14px] text-muted-foreground tracking-[-0.084px] leading-6 whitespace-nowrap">
                            Card Number:
                          </span>
                          <span className="text-[14px] text-foreground tracking-[-0.084px] leading-6 whitespace-nowrap">
                            •••• {selectedCardForDetails.cardNumber}
                          </span>
                        </div>

                        {/* Expires */}
                        <div className="flex items-center justify-between">
                          <span className="text-[14px] text-muted-foreground tracking-[-0.084px] leading-6 whitespace-nowrap">
                            Expires:
                          </span>
                          <span className="text-[14px] text-foreground tracking-[-0.084px] leading-6 whitespace-nowrap">
                            {selectedCardForDetails.expirationDate}
                          </span>
                        </div>

                        {/* Effective */}
                        <div className="flex items-center justify-between">
                          <span className="text-[14px] text-muted-foreground tracking-[-0.084px] leading-6 whitespace-nowrap">
                            Effective:
                          </span>
                          <span className="text-[14px] text-foreground tracking-[-0.084px] leading-6 whitespace-nowrap">
                            {selectedCardForDetails.effectiveDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* ── Purse Status section ── */}
                    {selectedCardForDetails.purseStatuses && selectedCardForDetails.purseStatuses.length > 0 && (
                      <div className="flex flex-col gap-4">
                        <h3 className="text-[16px] font-semibold text-foreground leading-6 tracking-[-0.176px]">
                          Purse Status
                        </h3>
                        <div className="flex flex-col">
                          {selectedCardForDetails.purseStatuses.map((purse, index) => (
                            <div key={index}>
                              <div className="flex items-center justify-between py-2">
                                <span className="text-[14px] text-muted-foreground tracking-[-0.084px] leading-6 whitespace-nowrap">
                                  {purse.accountName}:
                                </span>
                                <span className="text-[14px] text-foreground tracking-[-0.084px] leading-6 whitespace-nowrap">
                                  {purse.status}
                                </span>
                              </div>
                              {index < selectedCardForDetails.purseStatuses!.length - 1 && (
                                <div className="h-px bg-border" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-end pb-[17.5px] px-[17.5px]">
                  <Button
                    intent="primary"
                    onClick={() => setIsCardDetailsModalOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            {/* Card Activation Authentication Modal */}
            <Dialog open={isActivationAuthModalOpen} onOpenChange={setIsActivationAuthModalOpen}>
              <DialogContent className="w-[448px] p-0 gap-6 [&>div:last-child]:hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-[17.5px]">
                  <DialogTitle className="text-[17.5px] font-semibold text-foreground leading-normal">
                    Authentication
                  </DialogTitle>
                  <DialogClose asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      aria-label="Close"
                      onClick={() => {
                        setActivationVerificationMethod("");
                      }}
                    >
                      <X className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  </DialogClose>
                </div>
                
                {/* Content */}
                <div className="px-0 pb-0 flex flex-col gap-6 w-full">
                  {/* Explanatory Text */}
                  <div className="px-6 flex flex-col items-start justify-center">
                    <p className="text-[17px] font-normal text-foreground tracking-[-0.221px] leading-6">
                      Your protection is important to us. We need to take some extra steps to verify your identity. Choose how you'd like to receive a verification code.
                    </p>
                  </div>
                  
                  {/* Verification Method Selection */}
                  <div className="px-6 flex flex-col gap-4">
                    <RadioGroup
                      value={activationVerificationMethod}
                      onValueChange={(value) => setActivationVerificationMethod(value as "text" | "email")}
                      className="flex flex-col gap-4"
                    >
                      <div className="flex items-center gap-2 p-4 border border-border rounded-[11px] hover:bg-muted">
                        <RadioGroupItem value="text" id="verify-text-activation" />
                        <Label htmlFor="verify-text-activation" className="cursor-pointer flex-1 text-sm text-foreground">
                          <span className="font-semibold">Text Message</span> at (***) ***-1111
                        </Label>
                      </div>
                      <div className="flex items-center gap-2 p-4 border border-border rounded-[11px] hover:bg-muted">
                        <RadioGroupItem value="email" id="verify-email-activation" />
                        <Label htmlFor="verify-email-activation" className="cursor-pointer flex-1 text-sm text-foreground">
                          <span className="font-semibold">Email</span> at my***m**@******.com
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                
                {/* Footer */}
                <DialogFooter className="flex gap-2 justify-end p-[17.5px]">
                  <Button
                    intent="secondary"
                    variant="outline"
                    onClick={() => {
                      setIsActivationAuthModalOpen(false);
                      setActivationVerificationMethod("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    intent="primary"
                    onClick={() => {
                      if (activationVerificationMethod) {
                        if (activationVerificationMethod === "text") {
                          // Close authentication modal and open verification code modal
                          setIsActivationAuthModalOpen(false);
                          setIsVerificationCodeModalOpen(true);
                          setVerificationResendTimer(45); // Start 45-second timer
                        } else {
                          // Handle email method - show toast for now
                          toast.success("Verification code will be sent via email");
                          setIsActivationAuthModalOpen(false);
                          setActivationVerificationMethod("");
                        }
                      } else {
                        toast.error("Please select a verification method");
                      }
                    }}
                    disabled={!activationVerificationMethod}
                  >
                    Next
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            {/* Verification Code Modal */}
            <Dialog open={isVerificationCodeModalOpen} onOpenChange={setIsVerificationCodeModalOpen}>
              <DialogContent className="w-[448px] p-0 gap-6 [&>div:last-child]:hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-[17.5px]">
                  <DialogTitle className="text-[17.5px] font-semibold text-foreground leading-normal">
                    Authentication
                  </DialogTitle>
                  <DialogClose asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      aria-label="Close"
                      onClick={() => {
                        setVerificationCode("");
                        setVerificationResendTimer(0);
                      }}
                    >
                      <X className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  </DialogClose>
                </div>
                
                {/* Content */}
                <div className="px-0 pb-0 flex flex-col gap-6 w-full">
                  {/* Message Text */}
                  <div className="px-6 flex flex-col items-start justify-center">
                    <p className="text-[17px] font-normal text-foreground tracking-[-0.221px] leading-6">
                      We sent a 6-digit verification code to (***) ***-1111.
                    </p>
                  </div>
                  
                  {/* Verification Code Input */}
                  <div className="px-6 flex flex-col gap-2">
                    <FloatLabel
                      label="Verification Code"
                      value={verificationCode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                        setVerificationCode(value);
                      }}
                      maxLength={6}
                      type="text"
                      inputMode="numeric"
                    />
                    
                    {/* Resend Timer */}
                    <p className="text-xs font-normal text-foreground leading-[21px]">
                      {verificationResendTimer > 0
                        ? `Resend in ${Math.floor(verificationResendTimer / 60)}:${String(verificationResendTimer % 60).padStart(2, "0")}`
                        : ""}
                    </p>
                  </div>
                  
                  {/* Resend Code + Use a different method */}
                  <div className="px-6 flex items-center gap-4">
                    <Button
                      intent="secondary"
                      variant="outline"
                      className="w-fit"
                      onClick={() => {
                        setVerificationResendTimer(45);
                        toast.success("Verification code resent");
                      }}
                      disabled={verificationResendTimer > 0}
                    >
                      Resend Code
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-primary hover:underline h-auto p-0 font-normal text-[14px]"
                      onClick={() => {
                        setIsVerificationCodeModalOpen(false);
                        setVerificationCode("");
                        setVerificationResendTimer(0);
                        setIsActivationAuthModalOpen(true);
                      }}
                    >
                      Use a different method
                    </Button>
                  </div>
                </div>
                
                {/* Footer */}
                <DialogFooter className="flex gap-2 justify-end p-[17.5px]">
                  <Button
                    intent="secondary"
                    variant="outline"
                    onClick={() => {
                      setIsVerificationCodeModalOpen(false);
                      setVerificationCode("");
                      setVerificationResendTimer(0);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    intent="primary"
                    onClick={() => {
                      if (verificationCode.length === 6) {
                        // Close verification code modal and open activation confirmation modal
                        setIsVerificationCodeModalOpen(false);
                        setVerificationCode("");
                        setVerificationResendTimer(0);
                        setIsActivateCardModalOpen(true);
                      } else {
                        toast.error("Please enter a 6-digit verification code");
                      }
                    }}
                    disabled={verificationCode.length !== 6}
                  >
                    Verify
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            
            {/* Card Activation Confirmation Modal */}
            <Dialog open={isActivateCardModalOpen} onOpenChange={setIsActivateCardModalOpen}>
              <DialogContent className="w-[448px] p-0 gap-6 [&>div:last-child]:hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-[17.5px]">
                  <DialogTitle className="text-[17.5px] font-semibold text-foreground leading-normal">
                    Activate Card
                  </DialogTitle>
                  <DialogClose asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      aria-label="Close"
                    >
                      <X className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  </DialogClose>
                </div>
                
                {/* Content */}
                <div className="px-0 pb-0 flex flex-col gap-4 w-full">
                  {/* Cardholder Information */}
                  <div className="px-6 flex flex-col gap-2">
                    {cardBeingActivated && (
                      <>
                        {/* Cardholder Name */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm text-muted-foreground tracking-[-0.084px] leading-6 whitespace-nowrap">
                            Cardholder Name:
                          </span>
                          <span className="text-sm text-foreground tracking-[-0.084px] leading-6 whitespace-nowrap">
                            {cardBeingActivated.cardholderName}
                          </span>
                        </div>
                        
                        {/* Card Number */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm text-muted-foreground tracking-[-0.084px] leading-6 whitespace-nowrap">
                            Card Number:
                          </span>
                          <span className="text-sm text-foreground tracking-[-0.084px] leading-6 whitespace-nowrap">
                            x{cardBeingActivated.cardNumber}
                          </span>
                        </div>
                        
                        {/* Marital Status */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm text-muted-foreground tracking-[-0.084px] leading-6 whitespace-nowrap">
                            Marital Status:
                          </span>
                          <span className="text-sm text-foreground tracking-[-0.084px] leading-6 whitespace-nowrap">
                            Single
                          </span>
                        </div>
                        
                        {/* Status Badge */}
                        <Badge intent="success" size="sm" className="w-fit">
                          Ready to Activate
                        </Badge>
                      </>
                    )}
                  </div>
                  
                  {/* Disclaimer Text */}
                  <div className="px-6">
                    <p className="text-sm text-foreground tracking-[-0.084px] leading-6">
                      By activating your card, you agree and consent that you have carefully read and understand the{" "}
                      <a
                        href="#"
                        className="text-primary hover:underline font-normal"
                        onClick={(e) => {
                          e.preventDefault();
                          toast.info("Cardholder agreement link clicked");
                        }}
                      >
                        cardholder agreement
                      </a>
                      . If you are activating your card prior to receiving it, please closely monitor your account notifications and transactions for any unauthorized activity.
                    </p>
                  </div>
                </div>
                
                {/* Footer */}
                <DialogFooter className="flex gap-2 justify-end p-[17.5px]">
                  <Button
                    intent="secondary"
                    variant="outline"
                    onClick={() => {
                      setIsActivateCardModalOpen(false);
                      setCardBeingActivated(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    intent="primary"
                    onClick={() => {
                      if (cardBeingActivated) {
                        // Update card status to active
                        setDebitCards((prevCards) =>
                          prevCards.map((card) =>
                            card.id === cardBeingActivated.id
                              ? { ...card, status: "active" as const }
                              : card
                          )
                        );
                        toast.success("Card successfully activated", {
                          description: `Card number xxxx${cardBeingActivated.cardNumber} has been successfully activated`,
                        });
                        setIsActivateCardModalOpen(false);
                        setCardBeingActivated(null);
                      }
                    }}
                  >
                    Activate
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        );

      case "report-lost-stolen":
        // Redirect to debit-card — this flow is now handled by the workspace
        setSearchParams({ subPage: "debit-card" });
        return null;

      case "order-replacement-card":
        // Redirect to debit-card — this flow is now handled by the workspace
        setSearchParams({ subPage: "debit-card" });
        return null;
      case "login-security":
        return (
          <>
            <div className="pt-4 pb-2">
              <div className="px-6 flex items-center">
                <h2 className="text-2xl font-semibold text-gray-800">Login & Security</h2>
              </div>
              <Separator className="mt-4" />
            </div>
            <div className="space-y-0">
              <div className="px-6 pt-4 pb-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-medium text-gray-800">Login Info</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <div className="flex gap-1.5 text-sm">
                      <span className="text-gray-500">Username:</span>
                      <span className="text-gray-800">pennysmith</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[color:var(--system-link)] hover:text-[color:var(--system-link)] active:text-[color:var(--system-link)] [&>svg]:text-[color:var(--system-link)]"
                    >
                      <Pencil />
                      Update Username
                    </Button>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex gap-1.5 text-sm">
                        <span className="text-gray-500">Password:</span>
                        <span className="text-gray-800">•••••••••••••••</span>
                      </div>
                      <p className="text-sm text-gray-600">Last Update: 01/19/2026</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[color:var(--system-link)] hover:text-[color:var(--system-link)] active:text-[color:var(--system-link)] [&>svg]:text-[color:var(--system-link)]"
                    >
                      <Pencil />
                      Change Password
                    </Button>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="px-6 pt-4 pb-6">
                <div className="mb-4">
                  <h3 className="text-xl font-medium text-gray-800">Authentication Methods</h3>
                </div>
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-base font-semibold text-gray-800">Email</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[color:var(--system-link)] hover:text-[color:var(--system-link)] active:text-[color:var(--system-link)] [&>svg]:text-[color:var(--system-link)]"
                  >
                    <Pencil />
                    Update
                  </Button>
                </div>
                <div className="space-y-1 mb-4">
                  <p className="text-sm text-gray-800">penny.smith@wexinc.com</p>
                  <p className="text-xs text-gray-600">Last Used: Today</p>
                </div>
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-base font-semibold text-gray-800">Mobile Number</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[color:var(--system-link)] hover:text-[color:var(--system-link)] active:text-[color:var(--system-link)] [&>svg]:text-[color:var(--system-link)]"
                  >
                    <Pencil />
                    Update
                  </Button>
                </div>
                <div className="space-y-1 mb-4">
                  <p className="text-sm text-gray-800">+1 (859) 123-1234</p>
                  <p className="text-xs text-gray-600">Last Used: 12/30/2025</p>
                </div>
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-base font-semibold text-gray-800">Authenticator App</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[color:var(--system-link)] hover:text-[color:var(--system-link)] active:text-[color:var(--system-link)] [&>svg]:text-[color:var(--system-link)]"
                  >
                    <Pencil />
                    Setup Now
                  </Button>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-800">Not Setup</p>
                </div>
                <div className="mb-4">
                  <h4 className="text-base font-semibold text-gray-800 mb-3">Authentication Settings</h4>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-800 whitespace-nowrap">MFA Frequency:</span>
                    <Select defaultValue="only-when-required">
                      <SelectTrigger className="w-[200px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="only-when-required">Only when required</SelectItem>
                        <SelectItem value="every-login">At every login</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case "communication":
        return (
          <>

            {/* Contact Information Section */}
            <div className="px-6 pt-6 pb-6">
              <div className="flex items-center gap-4 mb-4">
                <h2 className="text-xl font-medium leading-8 tracking-[-0.34px] text-foreground">
                  Contact information
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1.5 px-3 py-1 text-sm font-medium text-[color:var(--system-link)] hover:bg-gray-100"
                  onClick={() => setIsContactInfoModalOpen(true)}
                >
                  <Pencil className="h-4 w-4 text-[color:var(--system-link)]" />
                  Edit
                </Button>
              </div>
              <div className="flex flex-col gap-2 text-sm tracking-[-0.084px]">
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">Mobile number:</span>
                  <span className="text-foreground">{mobileNumber}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">Email address:</span>
                  <span className="text-foreground">{emailAddress}</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="px-6">
              <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList>
                  <TabsTrigger
                    value="statements"
                  >
                    Statements
                  </TabsTrigger>
                  <TabsTrigger
                    value="contributions"
                  >
                    Contributions
                  </TabsTrigger>
                  <TabsTrigger
                    value="payments"
                  >
                    Payments
                  </TabsTrigger>
                  <TabsTrigger
                    value="wex-benefits-card"
                  >
                    WEX Benefits Card
                  </TabsTrigger>
                </TabsList>

                {/* Statements Tab Content */}
                <TabsContent value="statements" className="pt-6">
                  <div className="flex flex-col gap-6">
                    {/* Statement Delivery Preferences Header */}
                    <div className="flex flex-col gap-1">
                      <h3 className="text-xl font-bold leading-8 tracking-[-0.34px] text-foreground">
                        Statement delivery preferences
                      </h3>
                      <p className="text-sm font-normal leading-6 tracking-[-0.084px] text-foreground max-w-[1094px]">
                        Set how you want to receive your account documents. Select either Paper, Email, and/or Text for each statement type. Standard text message rates may apply. Disable text alerts by unchecking the boxes below. By opting into our text alerts, you agree to our{" "}
                        <a href="#" className="text-[color:var(--system-link)] hover:underline">terms of service</a>. Please review our{" "}
                        <a href="#" className="text-[color:var(--system-link)] hover:underline">privacy policy</a> for more information.
                      </p>
                      <div className="flex items-center justify-end gap-2 mt-2">
                        <span className="text-sm font-normal text-foreground">Go paperless</span>
                        <Checkbox
                          checked={goPaperless}
                          onCheckedChange={(checked) => setGoPaperless(checked === true)}
                        />
                      </div>
                    </div>

                    {/* Table Header */}
                    <div className="h-6">
                      <div className="flex items-center justify-between h-full px-6">
                        <div className="pr-8" style={{ width: "493px" }}>
                          <span className="text-lg font-medium leading-6 tracking-[-0.252px] text-foreground">Statements</span>
                        </div>
                        <div className="flex items-center" style={{ gap: "153px" }}>
                          <div style={{ width: "35px" }}>
                            <span className="text-lg font-medium leading-6 tracking-[-0.252px] text-foreground">Paper</span>
                          </div>
                          <div style={{ width: "35px" }}>
                            <span className="text-lg font-medium leading-6 tracking-[-0.252px] text-foreground">Email</span>
                          </div>
                          <div style={{ width: "80px" }}>
                            <span className="text-lg font-medium leading-6 tracking-[-0.252px] text-foreground">Text</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* HSA Account Summary Row */}
                    <div className="border-t border-border">
                      <div className="flex items-center justify-between px-6 py-4 min-h-[90px]">
                        <div className="flex flex-col gap-1 pr-8" style={{ width: "493px" }}>
                          <div className="flex flex-col gap-1">
                            <h4 className="text-sm font-medium leading-6 tracking-[-0.084px] text-black">
                              HSA Account Summary
                            </h4>
                            <p className="text-sm font-normal italic leading-6 tracking-[-0.084px] text-foreground">
                              $1.50 fee per printed summary
                            </p>
                            <p className="text-sm font-normal leading-6 tracking-[-0.084px] text-foreground">
                              Automatically emailed based on whether or not you have an email address.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center" style={{ gap: "153px" }}>
                          <div style={{ width: "35px", height: "21px" }}>
                            <Checkbox
                              checked={hsaAccountSummaryPaper}
                              onCheckedChange={handleHsaAccountSummaryPaperChange}
                            />
                          </div>
                          <div style={{ width: "35px", height: "21px" }}>
                            <Checkbox
                              checked={hsaAccountSummaryEmail}
                              onCheckedChange={(checked) => { setHsaAccountSummaryEmail(checked === true); if (checked !== true) setGoPaperless(false); }}
                            />
                          </div>
                          <span className="text-xs font-normal leading-6 text-black" style={{ width: "80px" }}>Not available</span>
                        </div>
                      </div>
                    </div>

                    {/* HSA Tax Documents Row */}
                    <div className="border-t border-border">
                      <div className="flex items-center justify-between px-6 py-4 min-h-[90px]">
                        <div className="flex flex-col gap-1 pr-8" style={{ width: "493px" }}>
                          <div className="flex flex-col gap-1">
                            <h4 className="text-sm font-medium leading-6 tracking-[-0.084px] text-black">
                              HSA Tax Documents
                            </h4>
                            <p className="text-sm font-normal leading-6 tracking-[-0.084px] text-foreground">
                              Automatically emailed based on whether or not you have an email address.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center" style={{ gap: "153px" }}>
                          <div style={{ width: "35px", height: "21px" }}>
                            <Checkbox
                              checked={hsaTaxDocumentsPaper}
                              onCheckedChange={handleHsaTaxDocumentsPaperChange}
                            />
                          </div>
                          <div style={{ width: "35px", height: "21px" }}>
                            <Checkbox
                              checked={hsaTaxDocumentsEmail}
                              onCheckedChange={(checked) => { setHsaTaxDocumentsEmail(checked === true); if (checked !== true) setGoPaperless(false); }}
                            />
                          </div>
                          <span className="text-xs font-normal leading-6 text-black" style={{ width: "80px" }}>Not available</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-end gap-2 md:gap-3 pt-6 mt-6 mb-6 border-t border-border px-4 md:px-0">
                      <Button
                        intent="primary"
                        onClick={() => {
                          setSavedState({
                            hsaAccountSummaryPaper,
                            hsaAccountSummaryEmail,
                            hsaTaxDocumentsPaper,
                            hsaTaxDocumentsEmail,
                            goPaperless,
                            contributionPostedEmail,
                            balanceBelowAmount,
                            balanceBelowEmail,
                            contributionsWithinAmount,
                            contributionsWithinEmail,
                            paymentIssuedEmail,
                            withdrawalExceedsAmount,
                            withdrawalExceedsEmail,
                            cardMailedEmail,
                            cardMailedText,
                            followUpNoticeText,
                            purchaseMadeEmail,
                            purchaseMadeText,
                            cardSuspendedText,
                            cardPurseSuspendedText,
                          });
                          toast.success("Communication preferences saved successfully");
                        }}
                        className="w-full md:min-w-[100px] md:w-auto bg-primary text-primary-foreground hover:bg-primary/90 order-1 md:order-2"
                      >
                        Save Preferences
                      </Button>
                      <Button
                        intent="secondary"
                        variant="outline"
                        onClick={() => {
                          setHsaAccountSummaryPaper(savedState.hsaAccountSummaryPaper);
                          setHsaAccountSummaryEmail(savedState.hsaAccountSummaryEmail);
                          setHsaTaxDocumentsPaper(savedState.hsaTaxDocumentsPaper);
                          setHsaTaxDocumentsEmail(savedState.hsaTaxDocumentsEmail);
                          setGoPaperless(savedState.goPaperless);
                          setContributionPostedEmail(savedState.contributionPostedEmail);
                          setBalanceBelowAmount(savedState.balanceBelowAmount);
                          setBalanceBelowEmail(savedState.balanceBelowEmail);
                          setContributionsWithinAmount(savedState.contributionsWithinAmount);
                          setContributionsWithinEmail(savedState.contributionsWithinEmail);
                          setPaymentIssuedEmail(savedState.paymentIssuedEmail);
                          setWithdrawalExceedsAmount(savedState.withdrawalExceedsAmount);
                          setWithdrawalExceedsEmail(savedState.withdrawalExceedsEmail);
                          setCardMailedEmail(savedState.cardMailedEmail);
                          setCardMailedText(savedState.cardMailedText);
                          setFollowUpNoticeText(savedState.followUpNoticeText);
                          setPurchaseMadeEmail(savedState.purchaseMadeEmail);
                          setPurchaseMadeText(savedState.purchaseMadeText);
                          setCardSuspendedText(savedState.cardSuspendedText);
                          setCardPurseSuspendedText(savedState.cardPurseSuspendedText);
                        }}
                        className="w-full md:min-w-[100px] md:w-auto order-2 md:order-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* Contributions Tab Content */}
                <TabsContent value="contributions" className="pt-6">
                  <div className="flex flex-col gap-6">
                    {/* Notification Preferences Header */}
                    <div className="flex flex-col gap-1 px-6">
                      <h3 className="text-xl font-bold leading-8 tracking-[-0.34px] text-foreground">
                        Notification preferences
                      </h3>
                      <p className="text-sm font-normal leading-6 tracking-[-0.084px] text-foreground max-w-[1094px]">
                        Manage how you receive real-time alerts for account activity. You can enable Email and/or Text for each notification. Standard text message rates may apply. Disable text alerts by unchecking the boxes below. By opting into our text alerts, you agree to our{" "}
                        <a href="#" className="text-[color:var(--system-link)] hover:underline">terms of service</a>. Please review our{" "}
                        <a href="#" className="text-[color:var(--system-link)] hover:underline">privacy policy</a> for more information.
                      </p>
                      <div className="flex items-center justify-end gap-2 mt-2">
                        <span className="text-sm font-normal text-foreground">Go paperless</span>
                        <Checkbox
                          checked={goPaperless}
                          onCheckedChange={(checked) => setGoPaperless(checked === true)}
                        />
                      </div>
                    </div>

                    {/* Table Header */}
                    <div className="h-6">
                      <div className="flex items-center justify-between h-full px-6">
                        <div className="pr-8" style={{ width: "493px" }}>
                          <span className="text-lg font-medium leading-6 tracking-[-0.252px] text-foreground">Notification type</span>
                        </div>
                        <div className="flex items-center" style={{ gap: "153px" }}>
                          <div style={{ width: "35px" }}>
                            <span className="text-lg font-medium leading-6 tracking-[-0.252px] text-foreground">Paper</span>
                          </div>
                          <div style={{ width: "35px" }}>
                            <span className="text-lg font-medium leading-6 tracking-[-0.252px] text-foreground">Email</span>
                          </div>
                          <div style={{ width: "80px" }}>
                            <span className="text-lg font-medium leading-6 tracking-[-0.252px] text-foreground">Text</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contribution Posted Row */}
                    <div className="border-t border-border">
                      <div className="flex items-center justify-between px-6 py-4 min-h-[90px]">
                        <div className="pr-8" style={{ width: "493px" }}>
                          <h4 className="text-sm font-medium leading-6 tracking-[-0.084px] text-black">
                            Contribution posted to your HSA
                          </h4>
                        </div>
                        <div className="flex items-center" style={{ gap: "153px" }}>
                          <span className="text-xs font-normal leading-6 text-black whitespace-nowrap" style={{ width: "35px" }}>Not available</span>
                          <div style={{ width: "35px", height: "21px" }}>
                            <Checkbox
                              checked={contributionPostedEmail}
                              onCheckedChange={(checked) => { setContributionPostedEmail(checked === true); if (checked !== true) setGoPaperless(false); }}
                            />
                          </div>
                          <span className="text-xs font-normal leading-6 text-black whitespace-nowrap" style={{ width: "80px" }}>Not available</span>
                        </div>
                      </div>
                    </div>

                    {/* Balance Below Row */}
                    <div className="border-t border-border">
                      <div className="flex items-center justify-between px-6 py-4 min-h-[90px]">
                        <div className="flex flex-col gap-1 pr-8" style={{ width: "493px" }}>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium leading-6 tracking-[-0.084px] text-black">
                              HSA available cash balance is below
                            </span>
                            <div className="flex items-center border border-input rounded-md overflow-hidden shadow-[0px_1px_2px_0px_rgba(18,18,23,0.05)]">
                              <div className="bg-white border-r border-input px-2 py-2 text-sm text-muted-foreground flex items-center justify-center min-w-[35px]">
                                $
                              </div>
                              <input
                                type="text"
                                value={balanceBelowAmount}
                                onChange={(e) => setBalanceBelowAmount(e.target.value)}
                                className="px-3 py-2 text-sm border-0 focus:outline-none focus:ring-0 bg-white"
                                style={{ minWidth: "80px", width: "80px" }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center" style={{ gap: "153px" }}>
                          <span className="text-xs font-normal leading-6 text-black whitespace-nowrap" style={{ width: "35px" }}>Not available</span>
                          <div style={{ width: "35px", height: "21px" }}>
                            <Checkbox
                              checked={balanceBelowEmail}
                              onCheckedChange={(checked) => { setBalanceBelowEmail(checked === true); if (checked !== true) setGoPaperless(false); }}
                            />
                          </div>
                          <span className="text-xs font-normal leading-6 text-black whitespace-nowrap" style={{ width: "80px" }}>Not available</span>
                        </div>
                      </div>
                    </div>

                    {/* Contributions Within Row */}
                    <div className="border-t border-border">
                      <div className="flex items-center justify-between px-6 py-4 min-h-[90px]">
                        <div className="flex flex-col gap-1 pr-8" style={{ width: "493px" }}>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium leading-6 tracking-[-0.084px] text-black">
                              HSA contributions year-to-date are within
                            </span>
                            <div className="flex items-center border border-input rounded-md overflow-hidden shadow-[0px_1px_2px_0px_rgba(18,18,23,0.05)]">
                              <div className="bg-white border-r border-input px-2 py-2 text-sm text-muted-foreground flex items-center justify-center min-w-[35px]">
                                $
                              </div>
                              <input
                                type="text"
                                value={contributionsWithinAmount}
                                onChange={(e) => setContributionsWithinAmount(e.target.value)}
                                className="px-3 py-2 text-sm border-0 focus:outline-none focus:ring-0 bg-white"
                                style={{ minWidth: "80px", width: "80px" }}
                              />
                            </div>
                            <span className="text-sm font-medium leading-6 tracking-[-0.084px] text-black">
                              of the IRS maximum
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center" style={{ gap: "153px" }}>
                          <span className="text-xs font-normal leading-6 text-black whitespace-nowrap" style={{ width: "35px" }}>Not available</span>
                          <div style={{ width: "35px", height: "21px" }}>
                            <Checkbox
                              checked={contributionsWithinEmail}
                              onCheckedChange={(checked) => { setContributionsWithinEmail(checked === true); if (checked !== true) setGoPaperless(false); }}
                            />
                          </div>
                          <span className="text-xs font-normal leading-6 text-black whitespace-nowrap" style={{ width: "80px" }}>Not available</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-end gap-2 md:gap-3 pt-6 mt-6 mb-6 border-t border-border px-4 md:px-0">
                      <Button
                        intent="primary"
                        onClick={() => {
                          setSavedState({
                            hsaAccountSummaryPaper,
                            hsaAccountSummaryEmail,
                            hsaTaxDocumentsPaper,
                            hsaTaxDocumentsEmail,
                            goPaperless,
                            contributionPostedEmail,
                            balanceBelowAmount,
                            balanceBelowEmail,
                            contributionsWithinAmount,
                            contributionsWithinEmail,
                            paymentIssuedEmail,
                            withdrawalExceedsAmount,
                            withdrawalExceedsEmail,
                            cardMailedEmail,
                            cardMailedText,
                            followUpNoticeText,
                            purchaseMadeEmail,
                            purchaseMadeText,
                            cardSuspendedText,
                            cardPurseSuspendedText,
                          });
                          toast.success("Communication preferences saved successfully");
                        }}
                        className="w-full md:min-w-[100px] md:w-auto bg-primary text-primary-foreground hover:bg-primary/90 order-1 md:order-2"
                      >
                        Save Preferences
                      </Button>
                      <Button
                        intent="secondary"
                        variant="outline"
                        onClick={() => {
                          setHsaAccountSummaryPaper(savedState.hsaAccountSummaryPaper);
                          setHsaAccountSummaryEmail(savedState.hsaAccountSummaryEmail);
                          setHsaTaxDocumentsPaper(savedState.hsaTaxDocumentsPaper);
                          setHsaTaxDocumentsEmail(savedState.hsaTaxDocumentsEmail);
                          setGoPaperless(savedState.goPaperless);
                          setContributionPostedEmail(savedState.contributionPostedEmail);
                          setBalanceBelowAmount(savedState.balanceBelowAmount);
                          setBalanceBelowEmail(savedState.balanceBelowEmail);
                          setContributionsWithinAmount(savedState.contributionsWithinAmount);
                          setContributionsWithinEmail(savedState.contributionsWithinEmail);
                          setPaymentIssuedEmail(savedState.paymentIssuedEmail);
                          setWithdrawalExceedsAmount(savedState.withdrawalExceedsAmount);
                          setWithdrawalExceedsEmail(savedState.withdrawalExceedsEmail);
                          setCardMailedEmail(savedState.cardMailedEmail);
                          setCardMailedText(savedState.cardMailedText);
                          setFollowUpNoticeText(savedState.followUpNoticeText);
                          setPurchaseMadeEmail(savedState.purchaseMadeEmail);
                          setPurchaseMadeText(savedState.purchaseMadeText);
                          setCardSuspendedText(savedState.cardSuspendedText);
                          setCardPurseSuspendedText(savedState.cardPurseSuspendedText);
                        }}
                        className="w-full md:min-w-[100px] md:w-auto order-2 md:order-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                {/* Payments Tab Content */}
                <TabsContent value="payments" className="pt-6">
                  <div className="flex flex-col gap-6">
                    {/* Notification Preferences Header */}
                    <div className="flex flex-col gap-1 px-6">
                      <h3 className="text-xl font-bold leading-8 tracking-[-0.34px] text-foreground">
                        Notification preferences
                      </h3>
                      <p className="text-sm font-normal leading-6 tracking-[-0.084px] text-foreground max-w-[1094px]">
                        Manage how you receive real-time alerts for account activity. You can enable Email and/or Text for each notification. Standard text message rates may apply. Disable text alerts by unchecking the boxes below. By opting into our text alerts, you agree to our{" "}
                        <a href="#" className="text-[color:var(--system-link)] hover:underline">terms of service</a>. Please review our{" "}
                        <a href="#" className="text-[color:var(--system-link)] hover:underline">privacy policy</a> for more information.
                      </p>
                      <div className="flex items-center justify-end gap-2 mt-2">
                        <span className="text-sm font-normal text-foreground">Go paperless</span>
                        <Checkbox
                          checked={goPaperless}
                          onCheckedChange={(checked) => setGoPaperless(checked === true)}
                        />
                      </div>
                    </div>

                    {/* Table Header */}
                    <div className="h-6">
                      <div className="flex items-center justify-between h-full px-6">
                        <div className="pr-8" style={{ width: "493px" }}>
                          <span className="text-lg font-medium leading-6 tracking-[-0.252px] text-foreground">Notification type</span>
                        </div>
                        <div className="flex items-center" style={{ gap: "153px" }}>
                          <div style={{ width: "35px" }}>
                            <span className="text-lg font-medium leading-6 tracking-[-0.252px] text-foreground">Paper</span>
                          </div>
                          <div style={{ width: "35px" }}>
                            <span className="text-lg font-medium leading-6 tracking-[-0.252px] text-foreground">Email</span>
                          </div>
                          <div style={{ width: "80px" }}>
                            <span className="text-lg font-medium leading-6 tracking-[-0.252px] text-foreground">Text</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Issued Row */}
                    <div className="border-t border-border">
                      <div className="flex items-center justify-between px-6 py-4 min-h-[90px]">
                        <div className="flex flex-col gap-1 pr-8" style={{ width: "493px" }}>
                          <h4 className="text-sm font-medium leading-6 tracking-[-0.084px] text-black">
                            Payment issued out of your HSA
                          </h4>
                          <p className="text-sm font-normal leading-6 tracking-[-0.084px] text-foreground">
                            Automatically emailed based on whether or not you have an email address.
                          </p>
                        </div>
                        <div className="flex items-center" style={{ gap: "153px" }}>
                          <span className="text-xs font-normal leading-6 text-black whitespace-nowrap" style={{ width: "35px" }}>Not available</span>
                          <div style={{ width: "35px", height: "21px" }}>
                            <Checkbox
                              checked={paymentIssuedEmail}
                              onCheckedChange={(checked) => { setPaymentIssuedEmail(checked === true); if (checked !== true) setGoPaperless(false); }}
                            />
                          </div>
                          <span className="text-xs font-normal leading-6 text-black whitespace-nowrap" style={{ width: "80px" }}>Not available</span>
                        </div>
                      </div>
                    </div>

                    {/* Withdrawal Exceeds Row */}
                    <div className="border-t border-border">
                      <div className="flex items-center justify-between px-6 py-4 min-h-[90px]">
                        <div className="flex flex-col gap-1 pr-8" style={{ width: "493px" }}>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium leading-6 tracking-[-0.084px] text-black">
                              Withdrawal from your HSA exceeds
                            </span>
                            <div className="flex items-center border border-input rounded-md overflow-hidden shadow-[0px_1px_2px_0px_rgba(18,18,23,0.05)]">
                              <div className="bg-white border-r border-input px-2 py-2 text-sm text-muted-foreground flex items-center justify-center min-w-[35px]">
                                $
                              </div>
                              <input
                                type="text"
                                value={withdrawalExceedsAmount}
                                onChange={(e) => setWithdrawalExceedsAmount(e.target.value)}
                                className="px-3 py-2 text-sm border-0 focus:outline-none focus:ring-0 bg-white"
                                style={{ minWidth: "80px", width: "80px" }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center" style={{ gap: "153px" }}>
                          <span className="text-xs font-normal leading-6 text-black whitespace-nowrap" style={{ width: "35px" }}>Not available</span>
                          <div style={{ width: "35px", height: "21px" }}>
                            <Checkbox
                              checked={withdrawalExceedsEmail}
                              onCheckedChange={(checked) => { setWithdrawalExceedsEmail(checked === true); if (checked !== true) setGoPaperless(false); }}
                            />
                          </div>
                          <span className="text-xs font-normal leading-6 text-black whitespace-nowrap" style={{ width: "80px" }}>Not available</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-end gap-2 md:gap-3 pt-6 mt-6 mb-6 border-t border-border px-4 md:px-0">
                      <Button
                        intent="primary"
                        onClick={() => {
                          setSavedState({
                            hsaAccountSummaryPaper,
                            hsaAccountSummaryEmail,
                            hsaTaxDocumentsPaper,
                            hsaTaxDocumentsEmail,
                            goPaperless,
                            contributionPostedEmail,
                            balanceBelowAmount,
                            balanceBelowEmail,
                            contributionsWithinAmount,
                            contributionsWithinEmail,
                            paymentIssuedEmail,
                            withdrawalExceedsAmount,
                            withdrawalExceedsEmail,
                            cardMailedEmail,
                            cardMailedText,
                            followUpNoticeText,
                            purchaseMadeEmail,
                            purchaseMadeText,
                            cardSuspendedText,
                            cardPurseSuspendedText,
                          });
                          toast.success("Communication preferences saved successfully");
                        }}
                        className="w-full md:min-w-[100px] md:w-auto bg-primary text-primary-foreground hover:bg-primary/90 order-1 md:order-2"
                      >
                        Save Preferences
                      </Button>
                      <Button
                        intent="secondary"
                        variant="outline"
                        onClick={() => {
                          setHsaAccountSummaryPaper(savedState.hsaAccountSummaryPaper);
                          setHsaAccountSummaryEmail(savedState.hsaAccountSummaryEmail);
                          setHsaTaxDocumentsPaper(savedState.hsaTaxDocumentsPaper);
                          setHsaTaxDocumentsEmail(savedState.hsaTaxDocumentsEmail);
                          setGoPaperless(savedState.goPaperless);
                          setContributionPostedEmail(savedState.contributionPostedEmail);
                          setBalanceBelowAmount(savedState.balanceBelowAmount);
                          setBalanceBelowEmail(savedState.balanceBelowEmail);
                          setContributionsWithinAmount(savedState.contributionsWithinAmount);
                          setContributionsWithinEmail(savedState.contributionsWithinEmail);
                          setPaymentIssuedEmail(savedState.paymentIssuedEmail);
                          setWithdrawalExceedsAmount(savedState.withdrawalExceedsAmount);
                          setWithdrawalExceedsEmail(savedState.withdrawalExceedsEmail);
                          setCardMailedEmail(savedState.cardMailedEmail);
                          setCardMailedText(savedState.cardMailedText);
                          setFollowUpNoticeText(savedState.followUpNoticeText);
                          setPurchaseMadeEmail(savedState.purchaseMadeEmail);
                          setPurchaseMadeText(savedState.purchaseMadeText);
                          setCardSuspendedText(savedState.cardSuspendedText);
                          setCardPurseSuspendedText(savedState.cardPurseSuspendedText);
                        }}
                        className="w-full md:min-w-[100px] md:w-auto order-2 md:order-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                {/* WEX Benefits Card Tab Content */}
                <TabsContent value="wex-benefits-card" className="pt-6">
                  <div className="flex flex-col gap-6">
                    {/* Notification Preferences Header */}
                    <div className="flex flex-col gap-1 px-6">
                      <h3 className="text-xl font-bold leading-8 tracking-[-0.34px] text-foreground">
                        Notification preferences
                      </h3>
                      <p className="text-sm font-normal leading-6 tracking-[-0.084px] text-foreground max-w-[1094px]">
                        Manage how you receive real-time alerts for account activity. You can enable Email and/or Text for each notification. Standard text message rates may apply. Disable text alerts by unchecking the boxes below. By opting into our text alerts, you agree to our{" "}
                        <a href="#" className="text-[color:var(--system-link)] hover:underline">terms of service</a>. Please review our{" "}
                        <a href="#" className="text-[color:var(--system-link)] hover:underline">privacy policy</a> for more information.
                      </p>
                      <div className="flex items-center justify-end gap-2 mt-2">
                        <span className="text-sm font-normal text-foreground">Go paperless</span>
                        <Checkbox
                          checked={goPaperless}
                          onCheckedChange={(checked) => setGoPaperless(checked === true)}
                        />
                      </div>
                    </div>

                    {/* Table Header */}
                    <div className="h-6">
                      <div className="flex items-center justify-between h-full px-6">
                        <div className="pr-8" style={{ width: "493px" }}>
                          <span className="text-lg font-medium leading-6 tracking-[-0.252px] text-foreground">Notification type</span>
                        </div>
                        <div className="flex items-center" style={{ gap: "153px" }}>
                          <div style={{ width: "35px" }}>
                            <span className="text-lg font-medium leading-6 tracking-[-0.252px] text-foreground">Paper</span>
                          </div>
                          <div style={{ width: "35px" }}>
                            <span className="text-lg font-medium leading-6 tracking-[-0.252px] text-foreground">Email</span>
                          </div>
                          <div style={{ width: "80px" }}>
                            <span className="text-lg font-medium leading-6 tracking-[-0.252px] text-foreground">Text</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Mailed Row */}
                    <div className="border-t border-border">
                      <div className="flex items-center justify-between px-6 py-4 min-h-[90px]">
                        <div className="pr-8" style={{ width: "493px" }}>
                          <h4 className="text-sm font-medium leading-6 tracking-[-0.084px] text-black">
                            WEX Benefit Card has been mailed
                          </h4>
                        </div>
                        <div className="flex items-center" style={{ gap: "153px" }}>
                          <span className="text-xs font-normal leading-6 text-black whitespace-nowrap" style={{ width: "35px" }}>Not available</span>
                          <div style={{ width: "35px", height: "21px" }}>
                            <Checkbox
                              checked={cardMailedEmail}
                              onCheckedChange={(checked) => { setCardMailedEmail(checked === true); if (checked !== true) setGoPaperless(false); }}
                            />
                          </div>
                          <div style={{ width: "80px", height: "21px" }}>
                            <Checkbox
                              checked={cardMailedText}
                              onCheckedChange={(checked) => setCardMailedText(checked === true)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Follow Up Notice Row */}
                    <div className="border-t border-border">
                      <div className="flex items-center justify-between px-6 py-4 min-h-[90px]">
                        <div className="flex flex-col gap-1 pr-8" style={{ width: "493px" }}>
                          <h4 className="text-sm font-medium leading-6 tracking-[-0.084px] text-black">
                            WEX Benefit Card follow up notice has been sent
                          </h4>
                          <p className="text-sm font-normal leading-6 tracking-[-0.084px] text-foreground">
                            Automatically alert when a debit card follow up notice has been sent about on of your purchases. Helps to quickly know when documentation needs to be supplied.
                          </p>
                        </div>
                        <div className="flex items-center" style={{ gap: "153px" }}>
                          <span className="text-xs font-normal leading-6 text-black whitespace-nowrap" style={{ width: "35px" }}>Not available</span>
                          <span className="text-xs font-normal leading-6 text-black whitespace-nowrap" style={{ width: "35px" }}>Not available</span>
                          <div style={{ width: "80px", height: "21px" }}>
                            <Checkbox
                              checked={followUpNoticeText}
                              onCheckedChange={(checked) => setFollowUpNoticeText(checked === true)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Purchase Made Row */}
                    <div className="border-t border-border">
                      <div className="flex items-center justify-between px-6 py-4 min-h-[90px]">
                        <div className="flex flex-col gap-1 pr-8" style={{ width: "493px" }}>
                          <h4 className="text-sm font-medium leading-6 tracking-[-0.084px] text-black">
                            WEX Benefit Card purchase has been made
                          </h4>
                          <p className="text-sm font-normal leading-6 tracking-[-0.084px] text-foreground">
                            Automatically alert when a debit card purchase has been made on one of your accounts. Helps to quickly identify possible fraudulent activity.
                          </p>
                        </div>
                        <div className="flex items-center" style={{ gap: "153px" }}>
                          <span className="text-xs font-normal leading-6 text-black whitespace-nowrap" style={{ width: "35px" }}>Not available</span>
                          <div style={{ width: "35px", height: "21px" }}>
                            <Checkbox
                              checked={purchaseMadeEmail}
                              onCheckedChange={(checked) => { setPurchaseMadeEmail(checked === true); if (checked !== true) setGoPaperless(false); }}
                            />
                          </div>
                          <div style={{ width: "80px", height: "21px" }}>
                            <Checkbox
                              checked={purchaseMadeText}
                              onCheckedChange={(checked) => setPurchaseMadeText(checked === true)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Suspended Row */}
                    <div className="border-t border-border">
                      <div className="flex items-center justify-between px-6 py-4 min-h-[90px]">
                        <div className="pr-8" style={{ width: "493px" }}>
                          <h4 className="text-sm font-medium leading-6 tracking-[-0.084px] text-black">
                            WEX Benefits Card has been suspended or unsuspended
                          </h4>
                        </div>
                        <div className="flex items-center" style={{ gap: "153px" }}>
                          <span className="text-xs font-normal leading-6 text-black whitespace-nowrap" style={{ width: "35px" }}>Not available</span>
                          <span className="text-xs font-normal leading-6 text-black whitespace-nowrap" style={{ width: "35px" }}>Not available</span>
                          <div style={{ width: "80px", height: "21px" }}>
                            <Checkbox
                              checked={cardSuspendedText}
                              onCheckedChange={(checked) => setCardSuspendedText(checked === true)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Purse Suspended Row */}
                    <div className="border-t border-border">
                      <div className="flex items-center justify-between px-6 py-4 min-h-[90px]">
                        <div className="pr-8" style={{ width: "493px" }}>
                          <h4 className="text-sm font-medium leading-6 tracking-[-0.084px] text-black">
                            WEX Benefit Card Purse has been suspended or unsuspended
                          </h4>
                        </div>
                        <div className="flex items-center" style={{ gap: "153px" }}>
                          <span className="text-xs font-normal leading-6 text-black whitespace-nowrap" style={{ width: "35px" }}>Not available</span>
                          <span className="text-xs font-normal leading-6 text-black whitespace-nowrap" style={{ width: "35px" }}>Not available</span>
                          <div style={{ width: "80px", height: "21px" }}>
                            <Checkbox
                              checked={cardPurseSuspendedText}
                              onCheckedChange={(checked) => setCardPurseSuspendedText(checked === true)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-end gap-2 md:gap-3 pt-6 mt-6 mb-6 border-t border-border px-4 md:px-0">
                      <Button
                        intent="primary"
                        onClick={() => {
                          setSavedState({
                            hsaAccountSummaryPaper,
                            hsaAccountSummaryEmail,
                            hsaTaxDocumentsPaper,
                            hsaTaxDocumentsEmail,
                            goPaperless,
                            contributionPostedEmail,
                            balanceBelowAmount,
                            balanceBelowEmail,
                            contributionsWithinAmount,
                            contributionsWithinEmail,
                            paymentIssuedEmail,
                            withdrawalExceedsAmount,
                            withdrawalExceedsEmail,
                            cardMailedEmail,
                            cardMailedText,
                            followUpNoticeText,
                            purchaseMadeEmail,
                            purchaseMadeText,
                            cardSuspendedText,
                            cardPurseSuspendedText,
                          });
                          toast.success("Communication preferences saved successfully");
                        }}
                        className="w-full md:min-w-[100px] md:w-auto bg-primary text-primary-foreground hover:bg-primary/90 order-1 md:order-2"
                      >
                        Save Preferences
                      </Button>
                      <Button
                        intent="secondary"
                        variant="outline"
                        onClick={() => {
                          setHsaAccountSummaryPaper(savedState.hsaAccountSummaryPaper);
                          setHsaAccountSummaryEmail(savedState.hsaAccountSummaryEmail);
                          setHsaTaxDocumentsPaper(savedState.hsaTaxDocumentsPaper);
                          setHsaTaxDocumentsEmail(savedState.hsaTaxDocumentsEmail);
                          setGoPaperless(savedState.goPaperless);
                          setContributionPostedEmail(savedState.contributionPostedEmail);
                          setBalanceBelowAmount(savedState.balanceBelowAmount);
                          setBalanceBelowEmail(savedState.balanceBelowEmail);
                          setContributionsWithinAmount(savedState.contributionsWithinAmount);
                          setContributionsWithinEmail(savedState.contributionsWithinEmail);
                          setPaymentIssuedEmail(savedState.paymentIssuedEmail);
                          setWithdrawalExceedsAmount(savedState.withdrawalExceedsAmount);
                          setWithdrawalExceedsEmail(savedState.withdrawalExceedsEmail);
                          setCardMailedEmail(savedState.cardMailedEmail);
                          setCardMailedText(savedState.cardMailedText);
                          setFollowUpNoticeText(savedState.followUpNoticeText);
                          setPurchaseMadeEmail(savedState.purchaseMadeEmail);
                          setPurchaseMadeText(savedState.purchaseMadeText);
                          setCardSuspendedText(savedState.cardSuspendedText);
                          setCardPurseSuspendedText(savedState.cardPurseSuspendedText);
                        }}
                        className="w-full md:min-w-[100px] md:w-auto order-2 md:order-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Unsaved Changes Dialog */}
            <AlertDialog open={isUnsavedChangesDialogOpen} onOpenChange={setIsUnsavedChangesDialogOpen}>
              <AlertDialogContent className="w-[448px]">
                <AlertDialogHeader className="text-left">
                  <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
                  <AlertDialogDescription>
                    You have unsaved changes to your communication preferences. What would you like to do?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex gap-2 justify-end items-end">
                  <AlertDialogCancel asChild>
                    <Button
                      intent="secondary"
                      variant="outline"
                      onClick={() => {
                        setIsUnsavedChangesDialogOpen(false);
                        setPendingTabChange(null);
                        setPendingNavigation(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button
                      intent="primary"
                      onClick={handleSaveAndSwitch}
                    >
                      Save preferences
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen" style={consumerPageBackgroundStyle}>
      <ConsumerNavigation />

      {/* Main Content */}
      <FadeInItem>
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 md:px-8">
        <div className="mx-auto max-w-[1376px]">
          {/* Page Header */}
          <div className="mb-6 space-y-3 md:mb-8">
            <h1 className="text-2xl font-semibold text-gray-800">My Account</h1>
          </div>

          {/* Mobile menu */}
          <div className="mb-4 md:hidden">
            <Card className="rounded-2xl">
              <CardContent className="space-y-3 p-4">
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-[0.24px] text-foreground">
                    Select section
                  </p>
                  <Select
                    value={activeSubPage}
                    onValueChange={(val) => handleSubPageChange(val as SubPage)}
                  >
                    <SelectTrigger className="h-[44px] w-full">
                      <SelectValue placeholder="Choose section" />
                    </SelectTrigger>
                    <SelectContent>
                      {menuSections.flatMap((section) =>
                        section.items.map((item) => (
                          <SelectItem key={item.key} value={item.key}>
                            {item.label}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          <SidebarProvider defaultOpen={true} className="h-full">
            <Card className="rounded-2xl overflow-hidden h-full w-full">
              <div className="flex w-full min-h-[756px]">
                {/* Left Sidebar (desktop) */}
                <Sidebar
                  collapsible="none"
                  className="hidden md:flex w-[264px] border-r border-wex-card-border bg-wex-card-bg flex-col h-auto"
                >
                  <SidebarContent className="flex-1 h-full px-2 py-4 w-[267px]">
                    <SidebarGroup className="flex-1 h-full">
                      <SidebarGroupContent className="flex-1 h-full">
                        <SidebarMenu className="flex-1 h-full">
                          {menuSections.map((section, sectionIndex) => (
                            <div key={section.title}>
                              <SidebarGroupLabel className="px-3 py-[7px]">
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-[0.24px]">
                                  {section.title}
                                </span>
                              </SidebarGroupLabel>
                              <div className="space-y-1">
                                {section.items.map((item) => {
                                  const Icon = item.icon;
                                  const isActive = activeSubPage === item.key;
                                  return (
                                    <SidebarMenuItem key={item.key}>
                                      <SidebarMenuButton
                                        isActive={isActive}
                                        onClick={() => handleSubPageChange(item.key)}
                                        className="h-[32px] min-h-[32px] whitespace-normal px-3 py-1 rounded-md data-[active=true]:bg-[var(--theme-secondary-ramp-50)] data-[active=true]:text-[var(--theme-secondary)] data-[active=false]:text-foreground hover:bg-muted"
                                      >
                                        <div className="flex items-center gap-2 w-full">
                                          <Icon className={`h-[14px] w-[14px] shrink-0 ${isActive ? 'text-[var(--theme-secondary)]' : 'text-[var(--icon-default)]'}`} />
                                          <span className="text-sm tracking-[-0.084px]">{item.label}</span>
                                        </div>
                                      </SidebarMenuButton>
                                    </SidebarMenuItem>
                                  );
                                })}
                              </div>
                              {sectionIndex < menuSections.length - 1 && (
                                <SidebarSeparator className="my-2" />
                              )}
                            </div>
                          ))}
                        </SidebarMenu>
                      </SidebarGroupContent>
                    </SidebarGroup>
                  </SidebarContent>
                </Sidebar>

                {/* Main Content Area */}
                <SidebarInset className="flex-1 min-w-0 bg-wex-card-bg md:peer-data-[variant=inset]:m-0 md:peer-data-[variant=inset]:rounded-none md:peer-data-[variant=inset]:shadow-none md:peer-data-[variant=inset]:ml-0 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-0">
                  <div className="flex h-full flex-col">
                    {renderContent(activeSubPage)}
                  </div>
                </SidebarInset>
              </div>
            </Card>
          </SidebarProvider>
        </div>
      </div>
      </FadeInItem>

      <ConsumerFooter />

      {/* Add New Dependent Modal */}
      <Dialog open={isAddDependentModalOpen} onOpenChange={setIsAddDependentModalOpen}>
        <DialogContent className="w-[448px] p-0 [&>div:last-child]:hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-[17.5px]">
            <DialogTitle className="text-base font-semibold text-foreground tracking-[-0.176px] leading-6">
              {editingDependentId ? "Edit Dependent" : "Add New Dependent"}
            </DialogTitle>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                aria-label="Close"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DialogClose>
          </div>

          {/* Form Content */}
          <div className="flex flex-col gap-4 px-[24px] pb-0">
            <FloatLabel
              label="First Name"
              value={formData.firstName}
              onChange={(e) => handleFormChange("firstName", e.target.value)}
            />
            <FloatLabel
              label="Middle Name"
              value={formData.middleName}
              onChange={(e) => handleFormChange("middleName", e.target.value)}
            />
            <FloatLabel
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => handleFormChange("lastName", e.target.value)}
            />
            <FloatLabel
              label="SSN"
              value={formData.ssn}
              onChange={(e) => handleFormChange("ssn", e.target.value)}
            />
            {/* Birth Date with Calendar Picker */}
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <div className="relative w-full">
                  <FloatLabel
                    label="Birth Date"
                    value={formData.birthDate}
                    onChange={(e) => handleFormChange("birthDate", e.target.value)}
                    onClick={() => setIsCalendarOpen(true)}
                    rightIcon={<Calendar className="h-4 w-4" />}
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start" side="bottom" sideOffset={4}>
                <CalendarComponent
                  mode="single"
                  selected={
                    formData.birthDate
                      ? (() => {
                          // Parse MM/DD/YYYY format
                          const parts = formData.birthDate.split("/");
                          if (parts.length === 3) {
                            const month = parseInt(parts[0], 10) - 1; // Month is 0-indexed
                            const day = parseInt(parts[1], 10);
                            const year = parseInt(parts[2], 10);
                            const date = new Date(year, month, day);
                            if (!isNaN(date.getTime())) {
                              return date;
                            }
                          }
                          // Fallback: try parsing as ISO string
                          const date = new Date(formData.birthDate);
                          return !isNaN(date.getTime()) ? date : undefined;
                        })()
                      : undefined
                  }
                  onSelect={(date: Date | undefined) => {
                    if (date) {
                      // Format date as MM/DD/YYYY
                      const month = String(date.getMonth() + 1).padStart(2, "0");
                      const day = String(date.getDate()).padStart(2, "0");
                      const year = date.getFullYear();
                      handleFormChange("birthDate", `${month}/${day}/${year}`);
                    } else {
                      handleFormChange("birthDate", "");
                    }
                    setIsCalendarOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            {/* Gender Select */}
            <FloatLabelSelect
              value={formData.gender}
              onValueChange={(value) => handleFormChange("gender", value)}
            >
              <FloatLabelSelect.Trigger label="Gender" size="md">
                <FloatLabelSelect.Value placeholder=" " />
              </FloatLabelSelect.Trigger>
              <FloatLabelSelect.Content>
                <FloatLabelSelect.Item value="male">Male</FloatLabelSelect.Item>
                <FloatLabelSelect.Item value="female">Female</FloatLabelSelect.Item>
                <FloatLabelSelect.Item value="other">Other</FloatLabelSelect.Item>
                <FloatLabelSelect.Item value="prefer-not-to-say">Prefer not to say</FloatLabelSelect.Item>
              </FloatLabelSelect.Content>
            </FloatLabelSelect>

            {/* Full time student Radio Group */}
            <div className="flex gap-4 items-center">
              <span className="text-base text-foreground tracking-[-0.176px]">Full time student?</span>
              <RadioGroup
                value={formData.isFullTimeStudent}
                onValueChange={(value) => handleFormChange("isFullTimeStudent", value)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="student-yes" />
                  <Label htmlFor="student-yes" className="cursor-pointer">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="student-no" />
                  <Label htmlFor="student-no" className="cursor-pointer">No</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Relationship Select */}
            <FloatLabelSelect
              value={formData.relationship}
              onValueChange={(value) => handleFormChange("relationship", value)}
            >
              <FloatLabelSelect.Trigger label="Relationship" size="md">
                <FloatLabelSelect.Value placeholder=" " />
              </FloatLabelSelect.Trigger>
              <FloatLabelSelect.Content>
                <FloatLabelSelect.Item value="spouse">Spouse</FloatLabelSelect.Item>
                <FloatLabelSelect.Item value="child">Child</FloatLabelSelect.Item>
                <FloatLabelSelect.Item value="other">Other</FloatLabelSelect.Item>
              </FloatLabelSelect.Content>
            </FloatLabelSelect>
          </div>

          {/* Footer */}
          <div className="flex gap-2 justify-end p-[17.5px] pt-0">
            <DialogClose asChild>
              <Button
                intent="secondary"
                variant="outline"
                onClick={() => {
                  resetForm();
                  setEditingDependentId(null);
                  setIsAddDependentModalOpen(false);
                }}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              intent="primary"
              onClick={handleSaveDependent}
              disabled={!formData.firstName || !formData.lastName || !formData.ssn || !formData.birthDate || !formData.gender || !formData.relationship}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Remove Dependent Confirmation Modal */}
      <AlertDialog open={isRemoveConfirmOpen} onOpenChange={setIsRemoveConfirmOpen}>
        <AlertDialogContent className="w-[448px]">
          <AlertDialogHeader className="text-left">
            <AlertDialogTitle>Remove Dependent</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{dependentToRemove ? `${dependentToRemove.firstName} ${dependentToRemove.lastName}` : ""}</strong> from your dependents? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2 justify-end items-end">
            <AlertDialogCancel asChild>
              <Button intent="secondary" variant="outline">
                Cancel
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                intent="destructive"
                className="bg-wex-button-destructive-bg text-wex-button-destructive-fg border border-wex-button-destructive-border hover:bg-wex-button-destructive-hover-bg active:bg-wex-button-destructive-active-bg"
                onClick={() => dependentToRemove && handleRemoveDependent(dependentToRemove.id)}
              >
                Remove
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add New Beneficiary Modal */}
      <Dialog open={isAddBeneficiaryModalOpen} onOpenChange={setIsAddBeneficiaryModalOpen}>
        <DialogContent className="w-[448px] [&>div:last-child]:hidden">
          {/* Header */}
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base font-semibold text-foreground tracking-[-0.176px] leading-6">
              {editingBeneficiaryId ? "Edit Beneficiary" : "Add New Beneficiary"}
            </DialogTitle>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 border-0 shadow-none bg-transparent hover:bg-wex-button-tertiary-hover-bg"
                aria-label="Close"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DialogClose>
          </div>

          {/* Form Content */}
          <div className="flex flex-col gap-4">
            {/* First Name and MI on same row */}
            <div className="flex gap-4">
              <FloatLabel
                label="First Name"
                value={beneficiaryFormData.firstName}
                onChange={(e) => handleBeneficiaryFormChange("firstName", e.target.value)}
                containerClassName="flex-1"
              />
              <FloatLabel
                label="MI"
                value={beneficiaryFormData.middleName}
                onChange={(e) => handleBeneficiaryFormChange("middleName", e.target.value)}
                containerClassName="w-20"
              />
            </div>
            <FloatLabel
              label="Last Name"
              value={beneficiaryFormData.lastName}
              onChange={(e) => handleBeneficiaryFormChange("lastName", e.target.value)}
            />
            <div className="flex flex-col gap-1">
              <FloatLabel
                label="SSN"
                value={beneficiaryFormData.ssn}
                onChange={(e) => {
                  const originalValue = e.target.value;
                  const filteredValue = originalValue.replace(/[^0-9-]/g, "");
                  const hasInvalidChars = originalValue !== filteredValue;
                  setIsBeneficiarySsnInvalid(hasInvalidChars || validateSsn(filteredValue));
                  handleBeneficiaryFormChange("ssn", filteredValue);
                }}
                invalid={isBeneficiarySsnInvalid}
              />
              {isBeneficiarySsnInvalid && (
                <p className="text-sm text-destructive font-medium px-3">
                  SSN must be numbers only
                </p>
              )}
            </div>
            
            {/* Birth Date with Calendar Picker */}
            <Popover open={isBeneficiaryCalendarOpen} onOpenChange={setIsBeneficiaryCalendarOpen}>
              <PopoverTrigger asChild>
                <div className="relative w-full">
                  <FloatLabel
                    label="Birth Date"
                    value={beneficiaryFormData.birthDate}
                    onChange={(e) => handleBeneficiaryFormChange("birthDate", e.target.value)}
                    onClick={() => setIsBeneficiaryCalendarOpen(true)}
                    rightIcon={<Calendar className="h-4 w-4" />}
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start" side="bottom" sideOffset={4}>
                <CalendarComponent
                  mode="single"
                  selected={
                    beneficiaryFormData.birthDate
                      ? (() => {
                          const parts = beneficiaryFormData.birthDate.split("/");
                          if (parts.length === 3) {
                            const month = parseInt(parts[0], 10) - 1;
                            const day = parseInt(parts[1], 10);
                            const year = parseInt(parts[2], 10);
                            const date = new Date(year, month, day);
                            if (!isNaN(date.getTime())) {
                              return date;
                            }
                          }
                          const date = new Date(beneficiaryFormData.birthDate);
                          return !isNaN(date.getTime()) ? date : undefined;
                        })()
                      : undefined
                  }
                  onSelect={(date: Date | undefined) => {
                    if (date) {
                      const month = String(date.getMonth() + 1).padStart(2, "0");
                      const day = String(date.getDate()).padStart(2, "0");
                      const year = date.getFullYear();
                      handleBeneficiaryFormChange("birthDate", `${month}/${day}/${year}`);
                    } else {
                      handleBeneficiaryFormChange("birthDate", "");
                    }
                    setIsBeneficiaryCalendarOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {/* Relationship Select */}
            <FloatLabelSelect
              value={beneficiaryFormData.relationship}
              onValueChange={(value) => handleBeneficiaryFormChange("relationship", value)}
            >
              <FloatLabelSelect.Trigger label="Relationship" size="md">
                <FloatLabelSelect.Value placeholder=" " />
              </FloatLabelSelect.Trigger>
              <FloatLabelSelect.Content>
                <FloatLabelSelect.Item value="spouse">Spouse</FloatLabelSelect.Item>
                <FloatLabelSelect.Item value="child">Child</FloatLabelSelect.Item>
                <FloatLabelSelect.Item value="parent">Parent</FloatLabelSelect.Item>
                <FloatLabelSelect.Item value="sibling">Sibling</FloatLabelSelect.Item>
                <FloatLabelSelect.Item value="other">Other</FloatLabelSelect.Item>
              </FloatLabelSelect.Content>
            </FloatLabelSelect>

            {/* Beneficiary Type Radio Group */}
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-1">
                <span className="text-base text-foreground tracking-[-0.176px]">Beneficiary Type</span>
                <Info className="h-4 w-4 text-muted-foreground" />
              </div>
              <RadioGroup
                value={beneficiaryFormData.beneficiaryType}
                onValueChange={(value) => handleBeneficiaryFormChange("beneficiaryType", value)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="primary" id="beneficiary-primary" />
                  <Label htmlFor="beneficiary-primary" className="cursor-pointer">Primary</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="contingent" id="beneficiary-contingent" />
                  <Label htmlFor="beneficiary-contingent" className="cursor-pointer">Contingent</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Address Information */}
            <FloatLabel
              label="Address line 1"
              value={beneficiaryFormData.addressLine1}
              onChange={(e) => handleBeneficiaryFormChange("addressLine1", e.target.value)}
            />
            <FloatLabel
              label="Address line 2"
              value={beneficiaryFormData.addressLine2}
              onChange={(e) => handleBeneficiaryFormChange("addressLine2", e.target.value)}
            />
            <FloatLabel
              label="City"
              value={beneficiaryFormData.city}
              onChange={(e) => handleBeneficiaryFormChange("city", e.target.value)}
            />
            
            {/* State Select */}
            <FloatLabelSelect
              value={beneficiaryFormData.state}
              onValueChange={(value) => handleBeneficiaryFormChange("state", value)}
            >
              <FloatLabelSelect.Trigger label="State" size="md">
                <FloatLabelSelect.Value placeholder=" " />
              </FloatLabelSelect.Trigger>
              <FloatLabelSelect.Content>
                {usStates.map((state) => (
                  <FloatLabelSelect.Item key={state} value={state}>
                    {state}
                  </FloatLabelSelect.Item>
                ))}
              </FloatLabelSelect.Content>
            </FloatLabelSelect>

            <FloatLabel
              label="Zip Code"
              value={beneficiaryFormData.zipCode}
              onChange={(e) => handleBeneficiaryFormChange("zipCode", e.target.value)}
            />
          </div>

          {/* Footer */}
          <div className="flex gap-2 justify-end">
            <DialogClose asChild>
              <Button
                intent="secondary"
                variant="outline"
                onClick={() => {
                  resetBeneficiaryForm();
                  setEditingBeneficiaryId(null);
                  setIsAddBeneficiaryModalOpen(false);
                }}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              intent="primary"
              onClick={handleSaveBeneficiary}
              disabled={!beneficiaryFormData.firstName || !beneficiaryFormData.lastName || !beneficiaryFormData.ssn || !beneficiaryFormData.birthDate || !beneficiaryFormData.relationship || !beneficiaryFormData.addressLine1 || !beneficiaryFormData.city || !beneficiaryFormData.state || !beneficiaryFormData.zipCode}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Remove Beneficiary Confirmation Modal */}
      <AlertDialog open={isRemoveBeneficiaryConfirmOpen} onOpenChange={setIsRemoveBeneficiaryConfirmOpen}>
        <AlertDialogContent className="w-[448px]">
          <AlertDialogHeader className="text-left">
            <AlertDialogTitle>Remove Beneficiary</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{beneficiaryToRemove ? `${beneficiaryToRemove.firstName} ${beneficiaryToRemove.lastName}` : ""}</strong> from your beneficiaries? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2 justify-end items-end">
            <AlertDialogCancel asChild>
              <Button intent="secondary" variant="outline">
                Cancel
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                intent="destructive"
                className="bg-wex-button-destructive-bg text-wex-button-destructive-fg border border-wex-button-destructive-border hover:bg-wex-button-destructive-hover-bg active:bg-wex-button-destructive-active-bg"
                onClick={() => beneficiaryToRemove && handleRemoveBeneficiary(beneficiaryToRemove.id)}
              >
                Remove
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add New Authorized Signers Modal */}
      <Dialog open={isAddAuthorizedSignerModalOpen} onOpenChange={setIsAddAuthorizedSignerModalOpen}>
        <DialogContent className="w-[448px] p-0 [&>div:last-child]:hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-[17.5px]">
            <DialogTitle className="text-base font-semibold text-foreground tracking-[-0.176px] leading-6">
              {editingAuthorizedSignerId ? "Edit Authorized Signer" : "Add Authorized Signer"}
            </DialogTitle>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 border-0 shadow-none bg-transparent hover:bg-wex-button-tertiary-hover-bg"
                aria-label="Close"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DialogClose>
          </div>

          {/* Form Content */}
          <div className="flex flex-col gap-4 px-[24px] pb-0">
            {/* First Name & MI on same row */}
            <div className="flex gap-4">
              <FloatLabel
                label="First Name"
                value={authorizedSignerFormData.firstName}
                onChange={(e) => handleAuthorizedSignerFormChange("firstName", e.target.value)}
                containerClassName="flex-1"
              />
              <FloatLabel
                label="MI"
                value={authorizedSignerFormData.middleName}
                onChange={(e) => handleAuthorizedSignerFormChange("middleName", e.target.value)}
                containerClassName="w-20"
              />
            </div>

            {/* Last Name */}
            <FloatLabel
              label="Last Name"
              value={authorizedSignerFormData.lastName}
              onChange={(e) => handleAuthorizedSignerFormChange("lastName", e.target.value)}
            />

            {/* SSN & Birth Date on same row */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <FloatLabel
                  label="SSN"
                  value={authorizedSignerFormData.ssn}
                  onChange={(e) => {
                    const originalValue = e.target.value;
                    const filteredValue = originalValue.replace(/[^0-9-]/g, "");
                    const hasInvalidChars = originalValue !== filteredValue;
                    setIsAuthorizedSignerSsnInvalid(hasInvalidChars || validateAuthorizedSignerSsn(filteredValue));
                    handleAuthorizedSignerFormChange("ssn", filteredValue);
                  }}
                  invalid={isAuthorizedSignerSsnInvalid}
                />
                {isAuthorizedSignerSsnInvalid && (
                  <p className="text-sm text-destructive font-medium px-3">
                    SSN must be numbers only
                  </p>
                )}
              </div>
              <div className="relative flex-1">
                <Popover open={isAuthorizedSignerCalendarOpen} onOpenChange={setIsAuthorizedSignerCalendarOpen}>
                  <PopoverTrigger asChild>
                    <div className="relative w-full">
                      <FloatLabel
                        label="Birth Date"
                        value={authorizedSignerFormData.birthDate}
                        onChange={(e) => handleAuthorizedSignerFormChange("birthDate", e.target.value)}
                        onClick={() => setIsAuthorizedSignerCalendarOpen(true)}
                        rightIcon={<Calendar className="h-4 w-4" />}
                      />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start" side="bottom" sideOffset={4}>
                    <CalendarComponent
                      mode="single"
                      selected={
                        authorizedSignerFormData.birthDate
                          ? (() => {
                              const parts = authorizedSignerFormData.birthDate.split("/");
                              if (parts.length === 3) {
                                const month = parseInt(parts[0], 10) - 1;
                                const day = parseInt(parts[1], 10);
                                const year = parseInt(parts[2], 10);
                                const date = new Date(year, month, day);
                                if (!isNaN(date.getTime())) {
                                  return date;
                                }
                              }
                              const date = new Date(authorizedSignerFormData.birthDate);
                              return !isNaN(date.getTime()) ? date : undefined;
                            })()
                          : undefined
                      }
                      onSelect={(date: Date | undefined) => {
                        if (date) {
                          const month = String(date.getMonth() + 1).padStart(2, "0");
                          const day = String(date.getDate()).padStart(2, "0");
                          const year = date.getFullYear();
                          handleAuthorizedSignerFormChange("birthDate", `${month}/${day}/${year}`);
                        } else {
                          handleAuthorizedSignerFormChange("birthDate", "");
                        }
                        setIsAuthorizedSignerCalendarOpen(false);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Type Select */}
            <FloatLabelSelect
              value={authorizedSignerFormData.type}
              onValueChange={(value) => handleAuthorizedSignerFormChange("type", value)}
            >
              <FloatLabelSelect.Trigger label="Type" size="md">
                <FloatLabelSelect.Value placeholder=" " />
              </FloatLabelSelect.Trigger>
              <FloatLabelSelect.Content>
                <FloatLabelSelect.Item value="authorized-representative">Authorized Representative</FloatLabelSelect.Item>
                <FloatLabelSelect.Item value="authorized-signer">Authorized Signer</FloatLabelSelect.Item>
                <FloatLabelSelect.Item value="conservator">Conservator</FloatLabelSelect.Item>
                <FloatLabelSelect.Item value="guardian">Guardian</FloatLabelSelect.Item>
                <FloatLabelSelect.Item value="parent">Parent</FloatLabelSelect.Item>
                <FloatLabelSelect.Item value="power-of-attorney">Power of Attorney</FloatLabelSelect.Item>
              </FloatLabelSelect.Content>
            </FloatLabelSelect>

            {/* Phone */}
            <FloatLabel
              label="Phone"
              value={authorizedSignerFormData.phone}
              onChange={(e) => handleAuthorizedSignerFormChange("phone", e.target.value)}
            />

            {/* Address Line 1 */}
            <FloatLabel
              label="Address Line 1"
              value={authorizedSignerFormData.addressLine1}
              onChange={(e) => handleAuthorizedSignerFormChange("addressLine1", e.target.value)}
            />

            {/* Address Line 2 */}
            <FloatLabel
              label="Address Line 2"
              value={authorizedSignerFormData.addressLine2}
              onChange={(e) => handleAuthorizedSignerFormChange("addressLine2", e.target.value)}
            />

            {/* City */}
            <FloatLabel
              label="City"
              value={authorizedSignerFormData.city}
              onChange={(e) => handleAuthorizedSignerFormChange("city", e.target.value)}
            />

            {/* State & Zip Code on same row */}
            <div className="flex gap-4">
              <div className="flex-1">
                <FloatLabelSelect
                  value={authorizedSignerFormData.state}
                  onValueChange={(value) => handleAuthorizedSignerFormChange("state", value)}
                >
                  <FloatLabelSelect.Trigger label="Select State" size="md">
                    <FloatLabelSelect.Value placeholder=" " />
                  </FloatLabelSelect.Trigger>
                  <FloatLabelSelect.Content>
                    <FloatLabelSelect.Item value="AL">Alabama</FloatLabelSelect.Item>
                    <FloatLabelSelect.Item value="AK">Alaska</FloatLabelSelect.Item>
                    <FloatLabelSelect.Item value="AZ">Arizona</FloatLabelSelect.Item>
                    <FloatLabelSelect.Item value="AR">Arkansas</FloatLabelSelect.Item>
                    <FloatLabelSelect.Item value="CA">California</FloatLabelSelect.Item>
                    <FloatLabelSelect.Item value="CO">Colorado</FloatLabelSelect.Item>
                    <FloatLabelSelect.Item value="CT">Connecticut</FloatLabelSelect.Item>
                    <FloatLabelSelect.Item value="DE">Delaware</FloatLabelSelect.Item>
                    <FloatLabelSelect.Item value="FL">Florida</FloatLabelSelect.Item>
                    <FloatLabelSelect.Item value="GA">Georgia</FloatLabelSelect.Item>
                    <FloatLabelSelect.Item value="HI">Hawaii</FloatLabelSelect.Item>
                    <FloatLabelSelect.Item value="ID">Idaho</FloatLabelSelect.Item>
                    <FloatLabelSelect.Item value="IL">Illinois</FloatLabelSelect.Item>
                    <FloatLabelSelect.Item value="IN">Indiana</FloatLabelSelect.Item>
                    <FloatLabelSelect.Item value="IA">Iowa</FloatLabelSelect.Item>
                    <FloatLabelSelect.Item value="KS">Kansas</FloatLabelSelect.Item>
                    <FloatLabelSelect.Item value="KY">Kentucky</FloatLabelSelect.Item>
                    <FloatLabelSelect.Item value="LA">Louisiana</FloatLabelSelect.Item>
                    <FloatLabelSelect.Item value="ME">Maine</FloatLabelSelect.Item>
                    <FloatLabelSelect.Item value="MD">Maryland</FloatLabelSelect.Item>
                    <FloatLabelSelect.Item value="MA">Massachusetts</FloatLabelSelect.Item>
                    <FloatLabelSelect.Item value="MI">Michigan</FloatLabelSelect.Item>
                    <FloatLabelSelect.Item value="MN">Minnesota</FloatLabelSelect.Item>
                    <FloatLabelSelect.Item value="MS">Mississippi</FloatLabelSelect.Item>
                    <FloatLabelSelect.Item value="MO">Missouri</FloatLabelSelect.Item>
                    <FloatLabelSelect.Item value="MT">Montana</FloatLabelSelect.Item>
                    <FloatLabelSelect.Item value="NE">Nebraska</FloatLabelSelect.Item>
                    <FloatLabelSelect.Item value="NV">Nevada</FloatLabelSelect.Item>
                    <FloatLabelSelect.Item value="NH">New Hampshire</FloatLabelSelect.Item>
                    <FloatLabelSelect.Item value="NJ">New Jersey</FloatLabelSelect.Item>
                    <FloatLabelSelect.Item value="NM">New Mexico</FloatLabelSelect.Item>
                    <FloatLabelSelect.Item value="NY">New York</FloatLabelSelect.Item>
                    <FloatLabelSelect.Item value="NC">North Carolina</FloatLabelSelect.Item>
                    <FloatLabelSelect.Item value="ND">North Dakota</FloatLabelSelect.Item>
                    <FloatLabelSelect.Item value="OH">Ohio</FloatLabelSelect.Item>
                    <FloatLabelSelect.Item value="OK">Oklahoma</FloatLabelSelect.Item>
                    <FloatLabelSelect.Item value="OR">Oregon</FloatLabelSelect.Item>
                    <FloatLabelSelect.Item value="PA">Pennsylvania</FloatLabelSelect.Item>
                    <FloatLabelSelect.Item value="RI">Rhode Island</FloatLabelSelect.Item>
                    <FloatLabelSelect.Item value="SC">South Carolina</FloatLabelSelect.Item>
                    <FloatLabelSelect.Item value="SD">South Dakota</FloatLabelSelect.Item>
                    <FloatLabelSelect.Item value="TN">Tennessee</FloatLabelSelect.Item>
                    <FloatLabelSelect.Item value="TX">Texas</FloatLabelSelect.Item>
                    <FloatLabelSelect.Item value="UT">Utah</FloatLabelSelect.Item>
                    <FloatLabelSelect.Item value="VT">Vermont</FloatLabelSelect.Item>
                    <FloatLabelSelect.Item value="VA">Virginia</FloatLabelSelect.Item>
                    <FloatLabelSelect.Item value="WA">Washington</FloatLabelSelect.Item>
                    <FloatLabelSelect.Item value="WV">West Virginia</FloatLabelSelect.Item>
                    <FloatLabelSelect.Item value="WI">Wisconsin</FloatLabelSelect.Item>
                    <FloatLabelSelect.Item value="WY">Wyoming</FloatLabelSelect.Item>
                  </FloatLabelSelect.Content>
                </FloatLabelSelect>
              </div>
              <FloatLabel
                label="Zip Code"
                value={authorizedSignerFormData.zipCode}
                onChange={(e) => handleAuthorizedSignerFormChange("zipCode", e.target.value)}
                containerClassName="flex-1"
              />
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="flex gap-2 justify-end p-[17.5px] pt-0">
            <DialogClose asChild>
              <Button
                intent="secondary"
                variant="outline"
                onClick={() => {
                  resetAuthorizedSignerForm();
                  setEditingAuthorizedSignerId(null);
                  setIsAddAuthorizedSignerModalOpen(false);
                }}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              intent="primary"
              onClick={handleSaveAuthorizedSigner}
              disabled={!authorizedSignerFormData.firstName || !authorizedSignerFormData.lastName || !authorizedSignerFormData.ssn || !authorizedSignerFormData.birthDate || !authorizedSignerFormData.type || !authorizedSignerFormData.phone || !authorizedSignerFormData.addressLine1 || !authorizedSignerFormData.city || !authorizedSignerFormData.state || !authorizedSignerFormData.zipCode || isAuthorizedSignerSsnInvalid}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Authorized Signer Confirmation Modal */}
      <AlertDialog open={isRemoveAuthorizedSignerConfirmOpen} onOpenChange={setIsRemoveAuthorizedSignerConfirmOpen}>
        <AlertDialogContent className="w-[448px]">
          <AlertDialogHeader className="text-left">
            <AlertDialogTitle>Remove Authorized Signer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{authorizedSignerToRemove ? `${authorizedSignerToRemove.firstName} ${authorizedSignerToRemove.lastName}` : ""}</strong> from your authorized signers? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2 justify-end items-end">
            <AlertDialogCancel asChild>
              <Button intent="secondary" variant="outline">
                Cancel
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                intent="destructive"
                className="bg-wex-button-destructive-bg text-wex-button-destructive-fg border border-wex-button-destructive-border hover:bg-wex-button-destructive-hover-bg active:bg-wex-button-destructive-active-bg"
                onClick={() => authorizedSignerToRemove && handleRemoveAuthorizedSigner(authorizedSignerToRemove.id)}
              >
                Remove
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Authorized Signer Modal */}
      <Dialog open={isViewAuthorizedSignerModalOpen} onOpenChange={setIsViewAuthorizedSignerModalOpen}>
        <DialogContent className="w-[448px]" size="md">
          <DialogHeader className="text-left">
            <DialogTitle>View Authorized Signer</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {viewingAuthorizedSigner && (
              <>
                {/* Name */}
                <div className="space-y-0.5 mt-0">
                  <Label className="text-xs text-muted-foreground mb-0 font-normal">Name</Label>
                  <p className="text-base font-normal text-foreground m-0 mt-0">
                    {viewingAuthorizedSigner.firstName} {viewingAuthorizedSigner.middleName ? `${viewingAuthorizedSigner.middleName} ` : ""}{viewingAuthorizedSigner.lastName}
                  </p>
                </div>

                {/* SSN, Birth Date, Type - 3 columns */}
                <div className="grid grid-cols-3 gap-x-4 gap-y-[14px] mt-2">
                  <div className="space-y-0.5 mt-0">
                    <Label className="text-xs text-muted-foreground mb-0 font-normal">SSN</Label>
                    <p className="text-base font-normal text-foreground m-0 mt-0">{viewingAuthorizedSigner.ssn}</p>
                  </div>
                  <div className="space-y-0.5 mt-0">
                    <Label className="text-xs text-muted-foreground mb-0 font-normal">Birth Date</Label>
                    <p className="text-base font-normal text-foreground m-0 mt-0">{viewingAuthorizedSigner.birthDate}</p>
                  </div>
                  <div className="space-y-0.5 mt-0">
                    <Label className="text-xs text-muted-foreground mb-0 font-normal">Type</Label>
                    <p className="text-base font-normal text-foreground capitalize m-0 mt-0">{viewingAuthorizedSigner.type}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-0.5 mt-0">
                  <Label className="text-xs text-muted-foreground mb-0 font-normal">Phone</Label>
                  <p className="text-base font-normal text-foreground m-0 mt-0">{viewingAuthorizedSigner.phone}</p>
                </div>

                {/* Address Line 1 */}
                <div className="space-y-0.5 mt-0">
                  <Label className="text-xs text-muted-foreground mb-0 font-normal">Address Line 1</Label>
                  <p className="text-base font-normal text-foreground m-0 mt-0">{viewingAuthorizedSigner.addressLine1}</p>
                </div>

                {/* Address Line 2 - conditional */}
                {viewingAuthorizedSigner.addressLine2 && (
                  <div className="space-y-0.5 mt-0">
                    <Label className="text-xs text-muted-foreground mb-0 font-normal">Address Line 2</Label>
                    <p className="text-base font-normal text-foreground m-0 mt-0">{viewingAuthorizedSigner.addressLine2}</p>
                  </div>
                )}

                {/* City, State, Zip Code */}
                <div className="grid grid-cols-3 gap-x-4 gap-y-[14px] mt-2">
                  <div className="space-y-0.5 mt-0">
                    <Label className="text-xs text-muted-foreground mb-0 font-normal">City</Label>
                    <p className="text-base font-normal text-foreground m-0 mt-0">{viewingAuthorizedSigner.city}</p>
                  </div>
                  <div className="space-y-0.5 mt-0">
                    <Label className="text-xs text-muted-foreground mb-0 font-normal">State</Label>
                    <p className="text-base font-normal text-foreground m-0 mt-0">{viewingAuthorizedSigner.state}</p>
                  </div>
                  <div className="space-y-0.5 mt-0">
                    <Label className="text-xs text-muted-foreground mb-0 font-normal">Zip Code</Label>
                    <p className="text-base font-normal text-foreground m-0 mt-0">{viewingAuthorizedSigner.zipCode}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Bank Account Multi-Step Modal — step 1 matches Consumer Experience Redesign (Figma) */}
      <Dialog open={isAddBankAccountModalOpen} onOpenChange={setIsAddBankAccountModalOpen}>
        <DialogContent
          className={
            bankAccountStep === "step1"
              ? "w-full max-w-[440px] gap-0 rounded-xl border-border bg-background p-0 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] [&>div:last-child]:hidden"
              : bankAccountStep === "edit" && editingBankAccountId
                ? "w-full max-w-[448px] gap-0 rounded-xl border-[#edeff0] bg-background p-0 shadow-[0px_20px_25px_0px_rgba(0,0,0,0.1),0px_8px_10px_0px_rgba(0,0,0,0.1)] [&>div:last-child]:hidden"
                : "w-[800px] max-w-[calc(100vw-2rem)] gap-0 p-0 [&>div:last-child]:hidden"
          }
        >
          {bankAccountStep === "step1" ? (
            <div className="flex flex-col overflow-hidden rounded-xl">
              <div className="flex items-center justify-between px-6 pb-4 pt-6">
                <DialogTitle className="m-0 text-[17.5px] font-semibold leading-normal tracking-tight text-foreground">
                  Authentication
                </DialogTitle>
                <DialogClose asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 shrink-0 border-0 bg-transparent shadow-none hover:bg-muted"
                    aria-label="Close"
                  >
                    <X className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                </DialogClose>
              </div>

              <div className="flex flex-col gap-6 px-6 pb-2 pt-0">
                {!showVerificationCode ? (
                  <>
                    <p className="text-[17px] font-normal leading-6 tracking-[-0.221px] text-foreground">
                      Your protection is important to us. We need to take some extra steps to verify your identity.
                      Choose how you&apos;d like to receive a verification code.
                    </p>
                    <RadioGroup
                      value={bankAccountFormData.verificationMethod || undefined}
                      onValueChange={(value) =>
                        handleBankAccountFormChange("verificationMethod", value as "text" | "email")
                      }
                      className="flex flex-col gap-4"
                    >
                      <label
                        htmlFor="bank-verify-text"
                        className="flex cursor-pointer items-center gap-[7px] rounded-[11px]"
                      >
                        <RadioGroupItem value="text" id="bank-verify-text" />
                        <span className="text-sm text-foreground">
                          <span className="font-bold">Text Message</span>
                          <span className="font-normal">{` at (***) ***-1111`}</span>
                        </span>
                      </label>
                      <label
                        htmlFor="bank-verify-email"
                        className="flex cursor-pointer items-center gap-[7px] rounded-[11px]"
                      >
                        <RadioGroupItem value="email" id="bank-verify-email" />
                        <span className="text-sm text-foreground">
                          <span className="font-bold">Email</span>
                          <span className="font-normal">{` at my***m**@******.com`}</span>
                        </span>
                      </label>
                    </RadioGroup>
                  </>
                ) : (
                  <div className="flex flex-col gap-6">
                    <p className="text-[17px] font-normal leading-6 tracking-[-0.221px] text-[#243746]">
                      We sent a 6-digit verification code to{" "}
                      {bankAccountFormData.verificationMethod === "text"
                        ? "(***) ***-1111"
                        : "my***m**@******.com"}
                      .
                    </p>
                    <div className="flex flex-col gap-3">
                      <div
                        className="[&_input]:rounded-lg [&_input]:border [&_input]:border-[#cdd6dd] [&_input]:bg-background [&_input]:shadow-none [&_input]:transition-colors [&_input]:focus-visible:border-primary [&_input]:focus-visible:ring-1 [&_input]:focus-visible:ring-primary/30"
                      >
                        <FloatLabel
                          label="Verification Code"
                          size="lg"
                          type={showBankVerificationCodePlain ? "text" : "password"}
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          value={bankAccountFormData.verificationCode}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, "").slice(0, 6);
                            handleBankAccountFormChange("verificationCode", digits);
                          }}
                          maxLength={6}
                          invalid={
                            bankAccountFormData.verificationCode.length > 0 &&
                            bankAccountFormData.verificationCode.length < 6
                          }
                          aria-describedby={
                            bankAccountFormData.verificationCode.length > 0 &&
                            bankAccountFormData.verificationCode.length < 6
                              ? "bank-verify-code-feedback"
                              : undefined
                          }
                          className="text-base tracking-[0.2em]"
                          rightIcon={
                            <button
                              type="button"
                              onClick={() => setShowBankVerificationCodePlain((v) => !v)}
                              className="cursor-pointer text-[#5c6b78] transition-colors hover:text-foreground"
                              aria-label={
                                showBankVerificationCodePlain ? "Hide verification code" : "Show verification code"
                              }
                            >
                              {showBankVerificationCodePlain ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          }
                        />
                      </div>
                      {bankAccountFormData.verificationCode.length > 0 &&
                        bankAccountFormData.verificationCode.length < 6 && (
                          <p
                            id="bank-verify-code-feedback"
                            role="status"
                            className="text-xs leading-4 text-[hsl(var(--wex-destructive))]"
                          >
                            Enter all 6 digits to verify.
                          </p>
                        )}
                      {resendTimer > 0 ? (
                        <p className="text-sm leading-5 text-[#5c6b78]">
                          Resend in {Math.floor(resendTimer / 60)}:
                          {String(resendTimer % 60).padStart(2, "0")}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={resendTimer > 0}
                        onClick={() => {
                          setResendTimer(45);
                        }}
                        className="h-9 rounded-md border border-primary bg-background px-4 text-sm font-normal text-primary shadow-none hover:bg-primary/[0.04]"
                      >
                        Resend Code
                      </Button>
                      <button
                        type="button"
                        className="text-sm font-normal text-primary hover:opacity-90"
                        onClick={() => {
                          setShowVerificationCode(false);
                          setShowBankVerificationCodePlain(false);
                          setBankAccountFormData((prev) => ({ ...prev, verificationCode: "" }));
                        }}
                      >
                        Use a different method
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div
                className={
                  showVerificationCode
                    ? "flex w-full items-center justify-end gap-[7px] px-6 pb-6 pt-8"
                    : "flex w-full items-center justify-end gap-[7px] px-6 pb-6 pt-4"
                }
              >
                {showVerificationCode ? (
                  <>
                    <Button
                      variant="ghost"
                      className="h-9 px-3 text-foreground hover:bg-muted"
                      onClick={() => setIsAddBankAccountModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      intent="primary"
                      className="h-9 rounded-md px-5"
                      disabled={!/^\d{6}$/.test(bankAccountFormData.verificationCode)}
                      onClick={() => {
                        setShowBankVerificationCodePlain(false);
                        setShowVerificationCode(false);
                        setBankAccountFormData((prev) => ({
                          ...prev,
                          selectedDirectDepositOptions: ["hsa", "2025"],
                        }));
                        setIsAddBankAccountWorkspaceOpen(true);
                        setIsAddBankAccountModalOpen(false);
                      }}
                    >
                      Verify
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      className="h-9 px-3 text-foreground hover:bg-muted"
                      onClick={() => setIsAddBankAccountModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      intent="primary"
                      className="h-9 rounded-md px-5"
                      disabled={!bankAccountFormData.verificationMethod}
                      onClick={() => {
                        setShowBankVerificationCodePlain(false);
                        setShowVerificationCode(true);
                      }}
                    >
                      Next
                    </Button>
                  </>
                )}
              </div>
            </div>
          ) : bankAccountStep === "edit" && editingBankAccountId ? (
            <div className="flex max-h-[min(90vh,840px)] flex-col gap-[26px] overflow-y-auto rounded-xl bg-background">
              <div className="flex shrink-0 items-center justify-between px-[17.5px] pt-[17.5px]">
                <DialogTitle className="m-0 text-[17.5px] font-semibold leading-normal text-[#243746]">
                  Edit Bank Account
                </DialogTitle>
                <DialogClose asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-[35px] w-[35px] shrink-0 border-0 bg-transparent shadow-none hover:bg-muted"
                    aria-label="Close"
                  >
                    <X className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                </DialogClose>
              </div>

              <div className="flex flex-col gap-2 px-[17.5px]">
                <h3 className="text-base font-semibold leading-6 tracking-[-0.176px] text-[#243746]">
                  Account Information
                </h3>
                <div className="flex flex-col gap-[9px] rounded-lg border border-[#e4e6e9] py-4">
                  <div className="flex items-center gap-1.5 px-4">
                    <Landmark className="h-4 w-4 shrink-0 text-[#1d2c38]" aria-hidden />
                    <span className="text-base font-medium leading-6 tracking-[-0.176px] text-[#1d2c38]">
                      {bankAccountFormData.bankName.trim() || "Wells Fargo Bank, NA"}
                    </span>
                  </div>
                  <Separator className="bg-[#e4e6e9]" />
                  <div className="flex flex-col gap-2 px-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-normal leading-6 tracking-[-0.084px] text-[#515f6b]">
                        Account Type
                      </span>
                      <span className="inline-flex shrink-0 items-center rounded-md bg-[#dbeafe] px-[7px] py-[3.5px] text-[12.25px] font-bold leading-none text-[#1d4ed8]">
                        {bankAccountFormData.accountType === "checking" ? "Checking" : "Saving"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4 text-sm font-normal leading-6 tracking-[-0.084px]">
                      <span className="text-[#515f6b]">Account Number</span>
                      <span className="text-[#1d2c38]">
                        ••••{" "}
                        {(bankAccountFormData.accountNumber.replace(/\D/g, "").length >= 4
                          ? bankAccountFormData.accountNumber.replace(/\D/g, "").slice(-4)
                          : bankAccountFormData.accountNumber.replace(/\D/g, "") || "—")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4 text-sm font-normal leading-6 tracking-[-0.084px]">
                      <span className="text-[#515f6b]">Routing Number</span>
                      <span className="text-[#1d2c38]">
                        ••••{" "}
                        {(bankAccountFormData.routingNumber.replace(/\D/g, "").length >= 4
                          ? bankAccountFormData.routingNumber.replace(/\D/g, "").slice(-4)
                          : bankAccountFormData.routingNumber.replace(/\D/g, "") || "—")}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-4 text-sm font-normal leading-6 tracking-[-0.084px]">
                      <span className="shrink-0 text-[#515f6b]">Bank Address</span>
                      <div className="text-right text-[#1d2c38]">
                        {bankAccountFormData.addressLine1.trim() ||
                        bankAccountFormData.city.trim() ||
                        bankAccountFormData.bankState.trim() ||
                        bankAccountFormData.zipCode.trim() ? (
                          <>
                            {bankAccountFormData.addressLine1.trim() ? (
                              <p className="mb-0 leading-6">{bankAccountFormData.addressLine1.trim()}</p>
                            ) : null}
                            {bankAccountFormData.city.trim() ? (
                              <p className="mb-0 leading-6">{bankAccountFormData.city.trim()}</p>
                            ) : null}
                            {(bankAccountFormData.bankState.trim() || bankAccountFormData.zipCode.trim()) ? (
                              <p className="leading-6">
                                {[
                                  bankAccountFormData.bankState.trim(),
                                  bankAccountFormData.zipCode.trim(),
                                ]
                                  .filter(Boolean)
                                  .join(", ")}
                              </p>
                            ) : null}
                          </>
                        ) : (
                          <p className="mb-0 leading-6">—</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 px-[17.5px]">
                <div className="relative w-full [&_input]:rounded-md [&_input]:border-[#a5aeb4] [&_input]:shadow-[0px_1px_2px_0px_rgba(18,18,23,0.05)]">
                  <FloatLabel
                    label="Account Nickname"
                    value={bankAccountFormData.accountNickname}
                    onChange={(e) => handleBankAccountFormChange("accountNickname", e.target.value)}
                    rightIcon={
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="flex shrink-0 text-[#5c6b78] hover:text-foreground"
                            aria-label="Account nickname help"
                          >
                            <Info className="h-3.5 w-3.5" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs text-left">
                          A name to help you identify this account.
                        </TooltipContent>
                      </Tooltip>
                    }
                  />
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="text-base font-normal leading-6 tracking-[-0.176px] text-[#243746]">
                    Account Type
                  </span>
                  <RadioGroup
                    value={bankAccountFormData.accountType}
                    onValueChange={(value) => handleBankAccountFormChange("accountType", value)}
                    className="flex flex-wrap items-center gap-4"
                  >
                    <label
                      htmlFor="edit-bank-account-checking"
                      className="flex cursor-pointer items-center gap-[7px] rounded-[11px]"
                    >
                      <RadioGroupItem value="checking" id="edit-bank-account-checking" />
                      <span className="text-sm text-[#243746]">Checking</span>
                    </label>
                    <label
                      htmlFor="edit-bank-account-saving"
                      className="flex cursor-pointer items-center gap-[7px] rounded-[11px]"
                    >
                      <RadioGroupItem value="saving" id="edit-bank-account-saving" />
                      <span className="text-sm text-[#243746]">Saving</span>
                    </label>
                  </RadioGroup>
                </div>
              </div>

              <div className="mx-[17.5px] rounded-md border border-[#ffe0a4] bg-[#fefce8]/95 p-px shadow-[0px_4px_8px_0px_rgba(9,7,0,0.04)]">
                <p className="px-[10.5px] py-2 text-sm font-medium leading-normal text-[#a16207]">
                  Updates are limited to the account nickname and account type. To modify the account or routing
                  number, remove the existing bank account and add a new one.
                </p>
              </div>

              <div className="mt-auto flex shrink-0 justify-end gap-[7px] px-[17.5px] pb-[17.5px]">
                <Button
                  variant="ghost"
                  className="h-auto px-[12.25px] py-[8.75px] text-[15.75px] font-medium text-foreground hover:bg-muted"
                  onClick={() => setIsAddBankAccountModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  intent="primary"
                  className="h-auto rounded-md border border-[#0058a3] bg-[#0058a3] px-[13.25px] py-[9.75px] text-[15.75px] font-medium text-white hover:opacity-95"
                  onClick={() => handleSaveBankAccount()}
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
          <div className="flex">
            {/* Left Sidebar - Progress Indicator */}
            <div className="w-[240px] border-r border-border bg-muted p-6">
              <Stepper
                steps={[
                  { id: "step1", label: "Authentication" },
                  { id: "step2", label: "Bank Information" },
                  { id: "step3", label: "Direct Deposit (optional)" },
                ]}
                currentStepId={bankAccountStep}
                onStepChange={(stepId) => {
                  setBankAccountStep(stepId);
                }}
              />
            </div>

            {/* Right Content Area */}
            <div className="flex-1">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border p-[17.5px]">
                <DialogTitle className="text-base font-semibold leading-6 tracking-[-0.176px] text-foreground">
                  Add Bank Account
                </DialogTitle>
                <DialogClose asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 border-0 bg-transparent shadow-none hover:bg-wex-button-tertiary-hover-bg"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DialogClose>
              </div>

              {/* Step Content */}
              <div className="p-6">
                {bankAccountStep === "step2" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Bank Information</h3>
                    
                    {/* Routing Number */}
                    <div className="relative">
                      <FloatLabel
                        label="Routing Number"
                        value={bankAccountFormData.routingNumber}
                        onChange={(e) => handleBankAccountFormChange("routingNumber", e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        aria-label="Help"
                      >
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                    
                    {/* Account Number */}
                    <FloatLabel
                      label="Account Number"
                      value={bankAccountFormData.accountNumber}
                      onChange={(e) => handleBankAccountFormChange("accountNumber", e.target.value)}
                    />
                    
                    {/* Confirm Account Number */}
                    <FloatLabel
                      label="Confirm Account Number"
                      value={bankAccountFormData.confirmAccountNumber}
                      onChange={(e) => handleBankAccountFormChange("confirmAccountNumber", e.target.value)}
                    />
                    
                    {/* Account Nickname */}
                    <div className="relative">
                      <FloatLabel
                        label="Account Nickname"
                        value={bankAccountFormData.accountNickname}
                        onChange={(e) => handleBankAccountFormChange("accountNickname", e.target.value)}
                      />
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            aria-label="Account nickname help"
                          >
                            <Info className="h-4 w-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs text-left">
                          A name to help you identify this account.
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    
                    {/* Account Type */}
                    <div className="space-y-2">
                      <Label className="text-sm text-foreground">Account Type:</Label>
                      <RadioGroup
                        value={bankAccountFormData.accountType}
                        onValueChange={(value) => handleBankAccountFormChange("accountType", value)}
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="checking" id="account-checking" />
                          <Label htmlFor="account-checking" className="cursor-pointer">Checking</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="saving" id="account-saving" />
                          <Label htmlFor="account-saving" className="cursor-pointer">Saving</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                )}

                {bankAccountStep === "step3" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Direct Deposit (optional)</h3>
                      <p className="text-sm text-foreground leading-6">
                        Select one or multiple plan years. You can update this later at any time.
                      </p>
                    </div>
                    
                    {/* Information Alert */}
                    <Alert intent="info" className="bg-blue-50 border-blue-200">
                      <Info className="h-4 w-4 text-primary" />
                      <AlertDescription className="text-sm text-foreground">
                        Don't want to set up direct deposit right now? You can finish without enabling it. Your payments will continue by check.
                      </AlertDescription>
                    </Alert>
                    
                    {/* Direct Deposit Options */}
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3 p-4 border border-border rounded-md hover:bg-muted">
                        <Checkbox
                          id="direct-deposit-hsa"
                          checked={(bankAccountFormData.selectedDirectDepositOptions || []).includes("hsa")}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setBankAccountFormData((prev) => ({
                                ...prev,
                                selectedDirectDepositOptions: [...(prev.selectedDirectDepositOptions || []), "hsa"],
                              }));
                            } else {
                              setBankAccountFormData((prev) => ({
                                ...prev,
                                selectedDirectDepositOptions: (prev.selectedDirectDepositOptions || []).filter((opt) => opt !== "hsa"),
                              }));
                            }
                          }}
                          className="mt-1"
                        />
                        <label htmlFor="direct-deposit-hsa" className="flex-1 cursor-pointer">
                          <div className="text-sm font-medium text-foreground">Health Savings Account</div>
                          <div className="text-xs text-muted-foreground mt-1">Current method: Check</div>
                        </label>
                      </div>
                      
                      <div className="flex items-start space-x-3 p-4 border border-border rounded-md hover:bg-muted">
                        <Checkbox
                          id="direct-deposit-plan-year"
                          checked={(bankAccountFormData.selectedDirectDepositOptions || []).includes("2025")}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setBankAccountFormData((prev) => ({
                                ...prev,
                                selectedDirectDepositOptions: [...(prev.selectedDirectDepositOptions || []), "2025"],
                              }));
                            } else {
                              setBankAccountFormData((prev) => ({
                                ...prev,
                                selectedDirectDepositOptions: (prev.selectedDirectDepositOptions || []).filter((opt) => opt !== "2025"),
                              }));
                            }
                          }}
                          className="mt-1"
                        />
                        <label htmlFor="direct-deposit-plan-year" className="flex-1 cursor-pointer">
                          <div className="text-sm font-medium text-foreground">01/01/2025-12/31/2025</div>
                          <div className="text-xs text-muted-foreground mt-1">Current method: Check</div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer (bank info & direct deposit steps) */}
              <div className="flex items-center justify-between border-t border-border p-[17.5px]">
                <Button intent="secondary" variant="outline" onClick={() => handleBankAccountBack()}>
                  Back
                </Button>
                <Button
                  intent="primary"
                  onClick={() => {
                    if (bankAccountStep === "step3") {
                      handleSaveBankAccount();
                    } else {
                      handleBankAccountNext();
                    }
                  }}
                >
                  {bankAccountStep === "step3" ? "Finish" : "Next"}
                </Button>
              </div>
            </div>
          </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Bank Account workspace (post-authentication) — Consumer Experience Redesign */}
      <Workspace
        open={isAddBankAccountWorkspaceOpen}
        onOpenChange={setIsAddBankAccountWorkspaceOpen}
        title="Add Bank Account"
        showFooter
        primaryButton={
          <Button
            intent="primary"
            disabled={addBankWorkspaceSaveDisabled}
            onClick={() => handleSaveBankAccount()}
          >
            Add Bank Account
          </Button>
        }
        tertiaryButton={
          <Button variant="ghost" onClick={() => setIsAddBankAccountWorkspaceOpen(false)}>
            Cancel
          </Button>
        }
      >
        <WorkspaceContent className="h-full">
          <WorkspaceMain className="flex-1 overflow-y-auto px-6 py-8">
            <div className="mx-auto flex w-full max-w-[400px] flex-col gap-6">
              <div>
                <h3 className="text-xl font-semibold leading-8 tracking-[-0.34px] text-[#243746]">
                  Bank Information
                </h3>
                <div className="mt-6 flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="relative">
                      <FloatLabel
                        label="Routing Number"
                        size="lg"
                        inputMode="numeric"
                        autoComplete="off"
                        value={bankAccountFormData.routingNumber}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, "").slice(0, 9);
                          handleBankAccountFormChange("routingNumber", digits);
                        }}
                        maxLength={9}
                        invalid={addBankWorkspaceRoutingInvalid}
                        aria-describedby={
                          addBankWorkspaceRoutingInvalid ? "add-bank-routing-feedback" : undefined
                        }
                        className="shadow-sm"
                      />
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            aria-label="Routing number help"
                          >
                            <Info className="h-3.5 w-3.5" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs text-left">
                          9-digit code that identifies your bank. Found on checks or in your bank app.
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    {addBankWorkspaceRoutingInvalid ? (
                      <p
                        id="add-bank-routing-feedback"
                        role="status"
                        className="text-xs leading-4 text-[hsl(var(--wex-destructive))]"
                      >
                        Enter a valid 9-digit routing number.
                      </p>
                    ) : null}
                  </div>
                  <FloatLabel
                    label="Account Number"
                    size="lg"
                    value={bankAccountFormData.accountNumber}
                    onChange={(e) => handleBankAccountFormChange("accountNumber", e.target.value)}
                    className="shadow-sm"
                  />
                  <div className="flex flex-col gap-1.5">
                    <FloatLabel
                      label="Confirm Account Number"
                      size="lg"
                      value={bankAccountFormData.confirmAccountNumber}
                      onChange={(e) => handleBankAccountFormChange("confirmAccountNumber", e.target.value)}
                      invalid={addBankWorkspaceConfirmMismatch}
                      aria-describedby={
                        addBankWorkspaceConfirmMismatch ? "add-bank-confirm-feedback" : undefined
                      }
                      className="shadow-sm"
                    />
                    {addBankWorkspaceConfirmMismatch ? (
                      <p
                        id="add-bank-confirm-feedback"
                        role="status"
                        className="text-xs leading-4 text-[hsl(var(--wex-destructive))]"
                      >
                        Account numbers do not match.
                      </p>
                    ) : null}
                  </div>
                  <div className="relative">
                    <FloatLabel
                      label="Account Nickname"
                      size="lg"
                      value={bankAccountFormData.accountNickname}
                      onChange={(e) => handleBankAccountFormChange("accountNickname", e.target.value)}
                      className="shadow-sm"
                    />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          aria-label="Account nickname help"
                        >
                          <Info className="h-3.5 w-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs text-left">
                        A name to help you identify this account.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="text-base tracking-[-0.176px] text-[#243746]">Account Type:</span>
                    <RadioGroup
                      value={bankAccountFormData.accountType}
                      onValueChange={(value) => handleBankAccountFormChange("accountType", value)}
                      className="flex flex-wrap items-center gap-4"
                    >
                      <label
                        htmlFor="ws-account-checking"
                        className="flex cursor-pointer items-center gap-[7px] rounded-[11px]"
                      >
                        <RadioGroupItem value="checking" id="ws-account-checking" />
                        <span className="text-sm text-foreground">Checking</span>
                      </label>
                      <label
                        htmlFor="ws-account-saving"
                        className="flex cursor-pointer items-center gap-[7px] rounded-[11px]"
                      >
                        <RadioGroupItem value="saving" id="ws-account-saving" />
                        <span className="text-sm text-foreground">Saving</span>
                      </label>
                    </RadioGroup>
                  </div>
                  <FloatLabel
                    label="Bank Name"
                    size="lg"
                    value={bankAccountFormData.bankName}
                    onChange={(e) => handleBankAccountFormChange("bankName", e.target.value)}
                    className="shadow-sm"
                  />
                  <FloatLabel
                    label="Address Line 1"
                    size="lg"
                    value={bankAccountFormData.addressLine1}
                    onChange={(e) => handleBankAccountFormChange("addressLine1", e.target.value)}
                    className="shadow-sm"
                  />
                  <FloatLabel
                    label="City"
                    size="lg"
                    value={bankAccountFormData.city}
                    onChange={(e) => handleBankAccountFormChange("city", e.target.value)}
                    className="shadow-sm"
                  />
                  <div className="flex gap-2">
                    <div className="w-[192px] min-w-0 shrink-0">
                      <FloatLabelSelect
                        value={bankAccountFormData.bankState || undefined}
                        onValueChange={(value) => handleBankAccountFormChange("bankState", value)}
                      >
                        <FloatLabelSelect.Trigger label="State" size="lg">
                          <FloatLabelSelect.Value placeholder=" " />
                        </FloatLabelSelect.Trigger>
                        <FloatLabelSelect.Content>
                          {usStates.map((state) => (
                            <FloatLabelSelect.Item key={state} value={state}>
                              {state}
                            </FloatLabelSelect.Item>
                          ))}
                        </FloatLabelSelect.Content>
                      </FloatLabelSelect>
                    </div>
                    <div className="min-w-0 flex-1">
                      <FloatLabel
                        label="Zip Code"
                        size="lg"
                        value={bankAccountFormData.zipCode}
                        onChange={(e) => handleBankAccountFormChange("zipCode", e.target.value)}
                        className="shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-border" />

              <div className="flex flex-col gap-6">
                <h3 className="text-xl font-semibold leading-8 tracking-[-0.34px] text-[#243746]">
                  Alternate Reimbursement Method
                </h3>
                <p className="text-base leading-6 tracking-[-0.176px] text-[#243746]">
                  Unselect if you don&apos;t want this bank account linked to a plan/plan year listed below.
                </p>
                <div className="flex flex-col gap-4">
                  <div
                    className={`relative cursor-pointer rounded-lg border-2 p-6 shadow-sm transition-colors ${
                      (bankAccountFormData.selectedDirectDepositOptions || []).includes("hsa")
                        ? "border-[#3958c3] shadow-[0_2px_6px_0_rgba(2,13,36,0.2),0_0_1px_0_rgba(2,13,36,0.3)]"
                        : "border-border hover:border-muted-foreground/40"
                    }`}
                    onClick={() => {
                      const has = (bankAccountFormData.selectedDirectDepositOptions || []).includes("hsa");
                      if (has) {
                        setBankAccountFormData((prev) => ({
                          ...prev,
                          selectedDirectDepositOptions: (prev.selectedDirectDepositOptions || []).filter(
                            (o) => o !== "hsa"
                          ),
                        }));
                      } else {
                        setBankAccountFormData((prev) => ({
                          ...prev,
                          selectedDirectDepositOptions: [...(prev.selectedDirectDepositOptions || []), "hsa"],
                        }));
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        (e.currentTarget as HTMLDivElement).click();
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="flex flex-col gap-2 pr-10">
                      <p className="text-base font-bold leading-6 tracking-[-0.176px] text-[#243746]">
                        Health Savings Account
                      </p>
                      <p className="text-[11px] font-normal leading-4 tracking-[0.055px] text-[#243746]">
                        Current method: Check
                      </p>
                    </div>
                    <div
                      className="absolute right-6 top-6"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        checked={(bankAccountFormData.selectedDirectDepositOptions || []).includes("hsa")}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setBankAccountFormData((prev) => ({
                              ...prev,
                              selectedDirectDepositOptions: [...(prev.selectedDirectDepositOptions || []), "hsa"],
                            }));
                          } else {
                            setBankAccountFormData((prev) => ({
                              ...prev,
                              selectedDirectDepositOptions: (prev.selectedDirectDepositOptions || []).filter(
                                (o) => o !== "hsa"
                              ),
                            }));
                          }
                        }}
                        aria-label="Health Savings Account alternate payment"
                      />
                    </div>
                  </div>

                  <div
                    className={`relative cursor-pointer rounded-lg border-2 p-6 shadow-sm transition-colors ${
                      (bankAccountFormData.selectedDirectDepositOptions || []).includes("2025")
                        ? "border-[#3958c3] shadow-[0_2px_6px_0_rgba(2,13,36,0.2),0_0_1px_0_rgba(2,13,36,0.3)]"
                        : "border-border hover:border-muted-foreground/40"
                    }`}
                    onClick={() => {
                      const has = (bankAccountFormData.selectedDirectDepositOptions || []).includes("2025");
                      if (has) {
                        setBankAccountFormData((prev) => ({
                          ...prev,
                          selectedDirectDepositOptions: (prev.selectedDirectDepositOptions || []).filter(
                            (o) => o !== "2025"
                          ),
                        }));
                      } else {
                        setBankAccountFormData((prev) => ({
                          ...prev,
                          selectedDirectDepositOptions: [...(prev.selectedDirectDepositOptions || []), "2025"],
                        }));
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        (e.currentTarget as HTMLDivElement).click();
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="flex flex-col gap-2 pr-10">
                      <p className="text-base font-bold leading-6 tracking-[-0.176px] text-[#243746]">
                        01/01/2025-12/31/2025
                      </p>
                      <p className="text-[11px] font-normal leading-4 tracking-[0.055px] text-[#243746]">
                        Current method: Check
                      </p>
                    </div>
                    <div
                      className="absolute right-6 top-6"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        checked={(bankAccountFormData.selectedDirectDepositOptions || []).includes("2025")}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setBankAccountFormData((prev) => ({
                              ...prev,
                              selectedDirectDepositOptions: [...(prev.selectedDirectDepositOptions || []), "2025"],
                            }));
                          } else {
                            setBankAccountFormData((prev) => ({
                              ...prev,
                              selectedDirectDepositOptions: (prev.selectedDirectDepositOptions || []).filter(
                                (o) => o !== "2025"
                              ),
                            }));
                          }
                        }}
                        aria-label="Plan year 2025 alternate payment"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </WorkspaceMain>
        </WorkspaceContent>
      </Workspace>

      {/* Activate Bank Account — Consumer Experience Redesign (Figma 19653:15928) */}
      <Dialog
        open={isActivateBankAccountModalOpen}
        onOpenChange={(open) => {
          if (!open) closeActivateBankAccountModal();
        }}
      >
        <DialogContent className="w-full max-w-[448px] gap-0 rounded-xl border-[#edeff0] bg-background p-0 shadow-[0px_20px_25px_0px_rgba(0,0,0,0.1),0px_8px_10px_0px_rgba(0,0,0,0.1)] [&>div:last-child]:hidden">
          {bankAccountForActivationModal ? (
            <>
              <div className="flex shrink-0 items-center justify-between px-[17.5px] pt-[17.5px]">
                <DialogTitle className="m-0 text-[17.5px] font-semibold leading-normal text-[#243746]">
                  Activate Bank Account
                </DialogTitle>
                <DialogClose asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-[35px] w-[35px] shrink-0 border-0 bg-transparent shadow-none hover:bg-muted"
                    aria-label="Close"
                  >
                    <X className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                </DialogClose>
              </div>

              <div className="flex flex-col gap-6 px-6 pb-6">
                <p className="text-sm font-normal leading-6 tracking-[-0.084px] text-[#243746]">
                  To activate this bank account you must verify the amount that was deposited to the account
                  below.
                </p>

                <div className="rounded-md border border-[#ffe0a4] bg-[#fefce8]/95 p-px shadow-[0px_4px_8px_0px_rgba(9,7,0,0.04)]">
                  <p className="px-[10.5px] py-[7px] text-sm font-medium leading-normal text-[#a16207]">
                    You are allowed only{" "}
                    <span className="font-bold">two attempts</span> before the account will be locked.
                  </p>
                </div>

                <div className="flex flex-col gap-[9px] rounded-lg border border-[#e4e6e9] py-4">
                  <div className="flex items-center gap-1.5 px-4">
                    <Landmark className="h-4 w-4 shrink-0 text-[#1d2c38]" aria-hidden />
                    <span className="text-base font-medium leading-6 tracking-[-0.176px] text-[#1d2c38]">
                      {bankAccountForActivationModal.bankName?.trim() || "Wells Fargo Bank, NA"}
                    </span>
                  </div>
                  <Separator className="bg-[#e4e6e9]" />
                  <div className="flex flex-col gap-2 px-4">
                    <div className="flex items-center justify-between gap-4 text-sm font-normal leading-6 tracking-[-0.084px]">
                      <span className="text-[#515f6b]">Account Number</span>
                      <span className="text-[#1d2c38]">
                        ••••{" "}
                        {(() => {
                          const d = bankAccountForActivationModal.accountNumber.replace(/\D/g, "");
                          return d.length >= 4 ? d.slice(-4) : d || "—";
                        })()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4 text-sm font-normal leading-6 tracking-[-0.084px]">
                      <span className="text-[#515f6b]">Routing Number</span>
                      <span className="text-[#1d2c38]">
                        ••••{" "}
                        {(() => {
                          const d = bankAccountForActivationModal.routingNumber.replace(/\D/g, "");
                          return d.length >= 4 ? d.slice(-4) : d || "—";
                        })()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="relative w-full">
                  <div className="relative rounded-md border border-[#a5aeb4] bg-white px-[11.5px] pb-2 pt-[22px] shadow-[0px_1px_2px_0px_rgba(18,18,23,0.05)]">
                    <span className="pointer-events-none absolute left-[11.5px] top-[7px] text-[10.5px] font-normal text-[#7c858e]">
                      Deposit Amount
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-[#243746]" aria-hidden>
                        $
                      </span>
                      <input
                        type="text"
                        inputMode="decimal"
                        autoComplete="transaction-amount"
                        className="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-[#243746] outline-none placeholder:text-[#7c858e]"
                        placeholder="0.00"
                        value={bankAccountDepositAmountInput}
                        onChange={(e) => {
                          let v = e.target.value.replace(/[^0-9.]/g, "");
                          const firstDot = v.indexOf(".");
                          if (firstDot !== -1) {
                            v =
                              v.slice(0, firstDot + 1) +
                              v.slice(firstDot + 1).replace(/\./g, "");
                          }
                          setBankAccountDepositAmountInput(v);
                        }}
                        aria-label="Deposit amount in dollars"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 justify-end gap-[7px] px-[17.5px] pb-[17.5px]">
                <Button
                  variant="ghost"
                  className="h-auto px-[12.25px] py-[8.75px] text-[15.75px] font-medium text-foreground hover:bg-muted"
                  onClick={closeActivateBankAccountModal}
                >
                  Cancel
                </Button>
                <Button
                  intent="primary"
                  className="h-auto rounded-md border border-[#0058a3] bg-[#0058a3] px-[13.25px] py-[9.75px] text-[15.75px] font-medium text-white hover:opacity-95 disabled:opacity-50"
                  disabled={
                    parseBankDepositAmountInput(bankAccountDepositAmountInput) === null
                  }
                  onClick={handleSubmitBankAccountActivation}
                >
                  Activate Account
                </Button>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Remove Bank Account Confirmation Modal */}
      <AlertDialog
        open={isRemoveBankAccountConfirmOpen}
        onOpenChange={(open) => {
          setIsRemoveBankAccountConfirmOpen(open);
          if (!open) {
            if (preserveBankAccountToRemoveAfterConfirmCloseRef.current) {
              preserveBankAccountToRemoveAfterConfirmCloseRef.current = false;
            } else {
              setBankAccountToRemove(null);
            }
          }
        }}
      >
        <AlertDialogContent className="w-[448px]">
          <AlertDialogHeader className="text-left">
            <AlertDialogTitle>Remove Bank Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete your bank account{" "}
              <strong>
                {bankAccountToRemove
                  ? (bankAccountToRemove.accountNickname || "").trim() ||
                    bankAccountToRemove.bankName?.trim() ||
                    `${bankAccountToRemove.accountType.charAt(0).toUpperCase() + bankAccountToRemove.accountType.slice(1)} Account`
                  : ""}
              </strong>
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 flex gap-2 justify-end items-end">
            <AlertDialogCancel asChild>
              <Button intent="secondary" variant="outline">
                Cancel
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                intent="destructive"
                className="bg-wex-button-destructive-bg text-wex-button-destructive-fg border border-wex-button-destructive-border hover:bg-wex-button-destructive-hover-bg active:bg-wex-button-destructive-active-bg"
                onClick={() => {
                  if (bankAccountToRemove) openRemoveBankAccountAuthAfterConfirm();
                }}
              >
                Remove
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Remove Bank Account — Authentication (after confirmation) */}
      <Dialog
        open={isRemoveBankAccountAuthModalOpen}
        onOpenChange={(open) => {
          if (!open) closeRemoveBankAccountAuthModal();
        }}
      >
        <DialogContent className="w-full max-w-[440px] gap-0 rounded-xl border-border bg-background p-0 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] [&>div:last-child]:hidden">
          <div className="flex flex-col overflow-hidden rounded-xl">
            <div className="flex items-center justify-between px-6 pb-4 pt-6">
              <DialogTitle className="m-0 text-[17.5px] font-semibold leading-normal tracking-tight text-foreground">
                Authentication
              </DialogTitle>
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 shrink-0 border-0 bg-transparent shadow-none hover:bg-muted"
                  aria-label="Close"
                >
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </DialogClose>
            </div>

            <div className="flex flex-col gap-6 px-6 pb-2 pt-0">
              {!removeBankAuthShowCode ? (
                <>
                  <p className="text-[17px] font-normal leading-6 tracking-[-0.221px] text-foreground">
                    Your protection is important to us. We need to take some extra steps to verify your identity.
                    Choose how you&apos;d like to receive a verification code.
                  </p>
                  <RadioGroup
                    value={removeBankAuthMethod || undefined}
                    onValueChange={(value) => setRemoveBankAuthMethod(value as "text" | "email")}
                    className="flex flex-col gap-4"
                  >
                    <label
                      htmlFor="remove-bank-verify-text"
                      className="flex cursor-pointer items-center gap-[7px] rounded-[11px]"
                    >
                      <RadioGroupItem value="text" id="remove-bank-verify-text" />
                      <span className="text-sm text-foreground">
                        <span className="font-bold">Text Message</span>
                        <span className="font-normal">{` at (***) ***-1111`}</span>
                      </span>
                    </label>
                    <label
                      htmlFor="remove-bank-verify-email"
                      className="flex cursor-pointer items-center gap-[7px] rounded-[11px]"
                    >
                      <RadioGroupItem value="email" id="remove-bank-verify-email" />
                      <span className="text-sm text-foreground">
                        <span className="font-bold">Email</span>
                        <span className="font-normal">{` at my***m**@******.com`}</span>
                      </span>
                    </label>
                  </RadioGroup>
                </>
              ) : (
                <div className="flex flex-col gap-6">
                  <p className="text-[17px] font-normal leading-6 tracking-[-0.221px] text-[#243746]">
                    We sent a 6-digit verification code to{" "}
                    {removeBankAuthMethod === "text" ? "(***) ***-1111" : "my***m**@******.com"}.
                  </p>
                  <div className="flex flex-col gap-3">
                    <div
                      className="[&_input]:rounded-lg [&_input]:border [&_input]:border-[#cdd6dd] [&_input]:bg-background [&_input]:shadow-none [&_input]:transition-colors [&_input]:focus-visible:border-primary [&_input]:focus-visible:ring-1 [&_input]:focus-visible:ring-primary/30"
                    >
                      <FloatLabel
                        label="Verification Code"
                        size="lg"
                        type={removeBankAuthCodePlain ? "text" : "password"}
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        value={removeBankAuthCode}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, "").slice(0, 6);
                          setRemoveBankAuthCode(digits);
                        }}
                        maxLength={6}
                        invalid={
                          removeBankAuthCode.length > 0 && removeBankAuthCode.length < 6
                        }
                        aria-describedby={
                          removeBankAuthCode.length > 0 && removeBankAuthCode.length < 6
                            ? "remove-bank-verify-code-feedback"
                            : undefined
                        }
                        className="text-base tracking-[0.2em]"
                        rightIcon={
                          <button
                            type="button"
                            onClick={() => setRemoveBankAuthCodePlain((v) => !v)}
                            className="cursor-pointer text-[#5c6b78] transition-colors hover:text-foreground"
                            aria-label={
                              removeBankAuthCodePlain ? "Hide verification code" : "Show verification code"
                            }
                          >
                            {removeBankAuthCodePlain ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        }
                      />
                    </div>
                    {removeBankAuthCode.length > 0 && removeBankAuthCode.length < 6 ? (
                      <p
                        id="remove-bank-verify-code-feedback"
                        role="status"
                        className="text-xs leading-4 text-[hsl(var(--wex-destructive))]"
                      >
                        Enter all 6 digits to verify.
                      </p>
                    ) : null}
                    {removeBankAuthResendTimer > 0 ? (
                      <p className="text-sm leading-5 text-[#5c6b78]">
                        Resend in {Math.floor(removeBankAuthResendTimer / 60)}:
                        {String(removeBankAuthResendTimer % 60).padStart(2, "0")}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={removeBankAuthResendTimer > 0}
                      onClick={() => setRemoveBankAuthResendTimer(45)}
                      className="h-9 rounded-md border border-primary bg-background px-4 text-sm font-normal text-primary shadow-none hover:bg-primary/[0.04]"
                    >
                      Resend Code
                    </Button>
                    <button
                      type="button"
                      className="text-sm font-normal text-primary hover:opacity-90"
                      onClick={() => {
                        setRemoveBankAuthShowCode(false);
                        setRemoveBankAuthCodePlain(false);
                        setRemoveBankAuthCode("");
                      }}
                    >
                      Use a different method
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div
              className={
                removeBankAuthShowCode
                  ? "flex w-full items-center justify-end gap-[7px] px-6 pb-6 pt-8"
                  : "flex w-full items-center justify-end gap-[7px] px-6 pb-6 pt-4"
              }
            >
              {removeBankAuthShowCode ? (
                <>
                  <Button
                    variant="ghost"
                    className="h-9 px-3 text-foreground hover:bg-muted"
                    onClick={closeRemoveBankAccountAuthModal}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    intent="primary"
                    className="h-9 rounded-md px-5"
                    disabled={!/^\d{6}$/.test(removeBankAuthCode)}
                    onClick={() => {
                      if (!bankAccountToRemove) return;
                      handleRemoveBankAccount(bankAccountToRemove.id);
                    }}
                  >
                    Verify
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="h-9 px-3 text-foreground hover:bg-muted"
                    onClick={closeRemoveBankAccountAuthModal}
                  >
                    Cancel
                  </Button>
                  <Button
                    intent="primary"
                    className="h-9 rounded-md px-5"
                    disabled={!removeBankAuthMethod}
                    onClick={() => {
                      setRemoveBankAuthCodePlain(false);
                      setRemoveBankAuthShowCode(true);
                      setRemoveBankAuthResendTimer(45);
                    }}
                  >
                    Next
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Contact Information Modal */}
      <Dialog open={isContactInfoModalOpen} onOpenChange={setIsContactInfoModalOpen}>
        <DialogContent className="w-[448px] p-0 gap-6 [&>div:last-child]:hidden">
          <div className="flex items-center justify-between p-[17.5px] border-b border-border">
            <DialogTitle className="text-[17.5px] font-semibold text-foreground leading-normal">
              Edit Contact Information
            </DialogTitle>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
          
          <div className="flex flex-col gap-4 px-[17.5px] pb-[17.5px]">
            <FloatLabel
              label="Mobile Phone Number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
            />
            
            <FloatLabel
              label="Email Address"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
            />
          </div>
          
          <DialogFooter className="flex gap-2 justify-end p-[17.5px] border-t border-border">
            <Button
              intent="secondary"
              variant="outline"
              onClick={() => setIsContactInfoModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              intent="primary"
              onClick={() => {
                setIsContactInfoModalOpen(false);
                // Here you would typically save the data to your backend
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dependent Modal */}
      <Dialog open={isViewDependentModalOpen} onOpenChange={setIsViewDependentModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>View Dependent</DialogTitle>
          </DialogHeader>

          <div className="mt-4 flex flex-col gap-6">
            <div>
              <label className="text-sm text-muted-foreground block">Name</label>
              <p className="text-lg text-foreground">
                {viewingDependent ? `${viewingDependent.firstName}${viewingDependent.middleName ? ` ${viewingDependent.middleName}` : ""} ${viewingDependent.lastName}` : ""}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-muted-foreground block">SSN</label>
                <p className="text-lg text-foreground">{viewingDependent?.ssn || ""}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground block">Birth Date</label>
                <p className="text-lg text-foreground">{viewingDependent ? formatDate(viewingDependent.birthDate) : ""}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground block">Gender</label>
                <p className="text-lg text-foreground capitalize">{viewingDependent?.gender || ""}</p>
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground block">Full time student</label>
              <p className="text-lg text-foreground">{viewingDependent?.isFullTimeStudent ? "Yes" : "No"}</p>
            </div>

            <div>
              <label className="text-sm text-muted-foreground block">Relationship</label>
              <p className="text-lg text-foreground capitalize">{viewingDependent?.relationship || ""}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Beneficiary Modal */}
      <Dialog open={isViewBeneficiaryModalOpen} onOpenChange={setIsViewBeneficiaryModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>View Beneficiary</DialogTitle>
          </DialogHeader>

          <div className="mt-4 flex flex-col gap-6">
            <div>
              <label className="text-sm text-muted-foreground block">Name</label>
              <p className="text-lg text-foreground">
                {viewingBeneficiary ? `${viewingBeneficiary.firstName}${viewingBeneficiary.middleName ? ` ${viewingBeneficiary.middleName}` : ""} ${viewingBeneficiary.lastName}` : ""}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-muted-foreground block">SSN</label>
                <p className="text-lg text-foreground">{viewingBeneficiary?.ssn || ""}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground block">Birth Date</label>
                <p className="text-lg text-foreground">{viewingBeneficiary ? formatDate(viewingBeneficiary.birthDate) : ""}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground block">Relationship</label>
                <p className="text-lg text-foreground capitalize">{viewingBeneficiary?.relationship || ""}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground block">Beneficiary Type</label>
                <p className="text-lg text-foreground capitalize">{viewingBeneficiary?.beneficiaryType === "primary" ? "Primary" : "Contingent"}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground block">Share</label>
                <p className="text-lg text-foreground">
                  {viewingBeneficiary ? (beneficiaries.length === 1 ? "100" : (viewingBeneficiary.sharePercentage || "0")) : "0"}%
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground block">Address</label>
              <p className="text-lg text-foreground">
                {viewingBeneficiary ? (
                  <>
                    {viewingBeneficiary.addressLine1}
                    {viewingBeneficiary.addressLine2 && <>, {viewingBeneficiary.addressLine2}</>}
                    <br />
                    {viewingBeneficiary.city}, {viewingBeneficiary.state} {viewingBeneficiary.zipCode}
                  </>
                ) : ""}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Beneficiary Workspace */}
      <Workspace
        open={isAddBeneficiaryWorkspaceOpen}
        onOpenChange={(open) => {
          setIsAddBeneficiaryWorkspaceOpen(open);
          if (!open) {
            setWorkspaceBeneficiaries([]);
            setSelectedDependentIds([]);
            setSplitSharesEqually(false);
          }
        }}
        title="Add Beneficiary"
        showFooter={true}
        primaryButton={
          <Button 
            intent="primary" 
            onClick={handleSaveWorkspaceBeneficiaries}
            disabled={workspaceBeneficiaries.length > 0 && !areSharesValid()}
          >
            Save
          </Button>
        }
        tertiaryButton={
          <Button variant="ghost" onClick={() => setIsAddBeneficiaryWorkspaceOpen(false)}>
            Cancel
          </Button>
        }
      >
        <WorkspaceContent className="h-full">
          {/* Left Section */}
          <WorkspaceMain className="flex-[2] p-6">
            <h2 className="text-2xl font-semibold text-foreground mb-2">Beneficiaries</h2>
            
            <p className="text-sm text-foreground mb-6">
              Designate your beneficiaries to protect your assets; note that in community property or common-law states,{" "}
              <button
                type="button"
                className="text-primary hover:underline font-semibold"
              >
                spousal consent
              </button>
              {" "}is required to name someone other than your spouse.
            </p>

            <Button
              intent="primary"
              variant="outline"
              className="mb-8"
              onClick={() => {
                resetBeneficiaryForm();
                setEditingBeneficiaryId(null);
                setIsAddBeneficiaryModalOpen(true);
              }}
            >
              <Plus className="h-4 w-4 text-current" />
              <span>Add Beneficiary</span>
            </Button>

            {dependents.length > 0 && (() => {
              const availableDependents = dependents.filter(
                (dependent) => !workspaceBeneficiaries.some((wb) => wb.dependentId === dependent.id)
              );
              
              return availableDependents.length > 0 ? (
                <>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Select an existing dependent</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableDependents.map((dependent) => (
                      <SelectCard
                        key={dependent.id}
                        id={dependent.id}
                        title={`${dependent.firstName} ${dependent.middleName ? `${dependent.middleName} ` : ""}${dependent.lastName}`}
                        subtext={dependent.relationship.charAt(0).toUpperCase() + dependent.relationship.slice(1)}
                        description=""
                        type="checkbox"
                        checked={workspaceBeneficiaries.some((wb) => wb.dependentId === dependent.id)}
                        icon={<Users className="h-6 w-6 text-muted-foreground" />}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setPendingDependent(dependent);
                            setSelectedDependentType("primary");
                            setIsDependentTypeDialogOpen(true);
                          } else {
                            const beneficiaryToRemove = workspaceBeneficiaries.find((wb) => wb.dependentId === dependent.id);
                            if (beneficiaryToRemove) {
                              setSelectedDependentIds(selectedDependentIds.filter(id => id !== dependent.id));
                              setWorkspaceBeneficiaries(workspaceBeneficiaries.filter(b => b.id !== beneficiaryToRemove.id));
                            }
                          }
                        }}
                        showLink={false}
                      />
                    ))}
                  </div>
                </>
              ) : null;
            })()}
          </WorkspaceMain>

          {/* Right Section */}
          <WorkspaceSidebar className="flex-1 min-w-[360px] border-r-0 border-l border-border bg-white flex flex-col relative">
            <div className="flex-1 overflow-y-auto p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Your Beneficiaries</h3>
              
              {workspaceBeneficiaries.length > 1 && (
                <div className="flex items-center gap-2 mb-6">
                  <Switch
                    checked={splitSharesEqually}
                    onCheckedChange={handleSplitSharesToggle}
                  />
                  <label className="text-sm text-foreground">Split shares equally</label>
                </div>
              )}

              {workspaceBeneficiaries.length === 0 ? (
                <p className="text-sm text-muted-foreground">No beneficiaries added/selected yet</p>
              ) : (
                <div className="space-y-4">
                  {[...workspaceBeneficiaries].sort((a, b) => {
                    if (a.beneficiaryType === "primary" && b.beneficiaryType === "contingent") return -1;
                    if (a.beneficiaryType === "contingent" && b.beneficiaryType === "primary") return 1;
                    return 0;
                  }).map((beneficiary) => (
                    <Card key={beneficiary.id} className="p-4 border border-primary">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 flex items-start gap-2">
                          {beneficiary.source === "dependent" ? (
                            <Users className="h-6 w-6 text-muted-foreground shrink-0 mt-0.5" />
                          ) : (
                            <HeartPlus className="h-6 w-6 text-muted-foreground shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <h4 className="text-base font-semibold text-foreground">
                              {beneficiary.firstName} {beneficiary.middleName ? `${beneficiary.middleName} ` : ""}{beneficiary.lastName}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-xs text-gray-500 capitalize">{beneficiary.relationship}</p>
                              <Badge
                                intent={beneficiary.beneficiaryType === "primary" ? "info" : "default"}
                                size="sm"
                                className="text-xs"
                              >
                                {beneficiary.beneficiaryType === "primary" ? "Primary" : "Contingent"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        {beneficiary.source === "dependent" ? (
                          <Checkbox 
                            checked={true} 
                            onCheckedChange={(checked) => {
                              if (!checked) {
                                const beneficiaryId = beneficiary.id;
                                if (beneficiary.dependentId) {
                                  setSelectedDependentIds(selectedDependentIds.filter(id => id !== beneficiary.dependentId));
                                }
                                setWorkspaceBeneficiaries(workspaceBeneficiaries.filter(b => b.id !== beneficiaryId));
                              }
                            }}
                          />
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-red-50"
                            onClick={() => handleRemoveWorkspaceBeneficiaryClick(beneficiary)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" aria-hidden />
                          </Button>
                        )}
                      </div>
                      <FloatLabel
                        label="Share Percentage"
                        type="number"
                        value={beneficiary.sharePercentage}
                        onChange={(e) => handleSharePercentageChange(beneficiary.id, e.target.value)}
                        disabled={splitSharesEqually}
                        rightIcon={<span className="text-sm text-muted-foreground">%</span>}
                        invalid={
                          !splitSharesEqually && (
                            !beneficiary.sharePercentage || 
                            parseFloat(beneficiary.sharePercentage) === 0 ||
                            !areSharesValid()
                          )
                        }
                      />
                    </Card>
                  ))}
                </div>
              )}
            </div>
            
            {workspaceBeneficiaries.length > 0 && getSharesErrorMessage() && (
              <div className="sticky bottom-0 left-0 right-0 bg-red-50 py-2 px-4 flex items-center gap-2 text-red-500 z-10">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p className="text-sm font-normal">{getSharesErrorMessage()}</p>
              </div>
            )}
          </WorkspaceSidebar>
        </WorkspaceContent>
      </Workspace>

      {/* Remove Workspace Beneficiary Confirmation */}
      <AlertDialog open={isRemoveWorkspaceBeneficiaryConfirmOpen} onOpenChange={setIsRemoveWorkspaceBeneficiaryConfirmOpen}>
        <AlertDialogContent className="w-[448px]">
          <AlertDialogHeader className="text-left">
            <AlertDialogTitle>Remove Beneficiary</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{workspaceBeneficiaryToRemove ? `${workspaceBeneficiaryToRemove.firstName} ${workspaceBeneficiaryToRemove.middleName ? `${workspaceBeneficiaryToRemove.middleName} ` : ""}${workspaceBeneficiaryToRemove.lastName}` : ""}</strong> from your beneficiaries? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2 justify-end items-end">
            <AlertDialogCancel asChild>
              <Button intent="secondary" variant="outline" onClick={() => {
                setIsRemoveWorkspaceBeneficiaryConfirmOpen(false);
                setWorkspaceBeneficiaryToRemove(null);
              }}>
                Cancel
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                intent="destructive"
                className="bg-wex-button-destructive-bg text-wex-button-destructive-fg border border-wex-button-destructive-border hover:bg-wex-button-destructive-hover-bg active:bg-wex-button-destructive-active-bg"
                onClick={handleRemoveWorkspaceBeneficiary}
              >
                Remove
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Select Beneficiary Type Dialog */}
      <Dialog open={isDependentTypeDialogOpen} onOpenChange={setIsDependentTypeDialogOpen}>
        <DialogContent className="w-[448px]">
          <DialogHeader>
            <DialogTitle>Select beneficiary type</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Select the beneficiary type for <strong>{pendingDependent ? `${pendingDependent.firstName} ${pendingDependent.middleName ? `${pendingDependent.middleName} ` : ""}${pendingDependent.lastName}` : ""}</strong>.
          </p>
          <div className="py-4">
            <RadioGroup
              value={selectedDependentType}
              onValueChange={(value) => setSelectedDependentType(value as "primary" | "contingent")}
              className="flex flex-col gap-4"
            >
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="primary" id="dependent-type-primary" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="dependent-type-primary" className="cursor-pointer font-semibold">
                    Primary
                  </Label>
                  <p className="text-sm text-gray-500 mt-1">
                    They are the ones to inherit your assets in the event of your death, according to chosen share percentage.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="contingent" id="dependent-type-contingent" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="dependent-type-contingent" className="cursor-pointer font-semibold">
                    Contingent
                  </Label>
                  <p className="text-sm text-gray-500 mt-1">
                    They will receive your assets in the event of your primaries passing or choosing not to receive.
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDependentTypeDialogOpen(false);
                setPendingDependent(null);
                setSelectedDependentType("primary");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddDependentAsBeneficiary}>
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Percentages Modal */}
      <Dialog open={isEditPercentagesModalOpen} onOpenChange={setIsEditPercentagesModalOpen}>
        <DialogContent className="w-[600px] p-0 [&>div:last-child]:hidden">
          <div className="flex items-center justify-between px-[24px] pt-[12px] pb-1">
            <DialogTitle className="text-base font-semibold text-foreground tracking-[-0.176px] leading-6">
              Edit Percentages
            </DialogTitle>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                aria-label="Close"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DialogClose>
          </div>

          <div className="px-[24px] pb-0 flex flex-col gap-4">
            <p className="text-sm text-foreground">
              Update the share percentage for the beneficiaries, they must add up to 100%.
            </p>

            {beneficiaries.length > 1 && (
              <div className="flex items-center gap-2">
                <Switch
                  checked={editPercentagesSplitEqually}
                  onCheckedChange={(checked) => {
                    setEditPercentagesSplitEqually(checked);
                    if (checked && beneficiaries.length > 0) {
                      const equalShare = Math.floor(100 / beneficiaries.length);
                      const remainder = 100 % beneficiaries.length;
                      const updatedShares: Record<string, string> = {};
                      beneficiaries.forEach((ben, index) => {
                        updatedShares[ben.id] = index === beneficiaries.length - 1
                          ? (equalShare + remainder).toString()
                          : equalShare.toString();
                      });
                      setEditPercentagesShares(updatedShares);
                    }
                  }}
                />
                <label className="text-sm text-foreground">Split shares equally</label>
              </div>
            )}

            {beneficiaries.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {beneficiaries.map((beneficiary) => (
                  <div key={beneficiary.id} className="flex flex-col gap-2">
                    <h4 className="text-sm font-semibold text-foreground">
                      {beneficiary.firstName} {beneficiary.middleName ? `${beneficiary.middleName} ` : ""}{beneficiary.lastName}
                    </h4>
                    <FloatLabel
                      label="Share percentage"
                      type="number"
                      value={editPercentagesShares[beneficiary.id] || beneficiary.sharePercentage || "0"}
                      onChange={(e) => {
                        setEditPercentagesShares((prev) => ({
                          ...prev,
                          [beneficiary.id]: e.target.value,
                        }));
                      }}
                      disabled={editPercentagesSplitEqually}
                      rightIcon={<span className="text-sm text-muted-foreground">%</span>}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No beneficiaries to edit.</p>
            )}

            {(() => {
              if (editPercentagesSplitEqually) return null;
              
              const total = beneficiaries.reduce((sum, ben) => {
                const share = parseFloat(editPercentagesShares[ben.id] || ben.sharePercentage || "0");
                return sum + (isNaN(share) ? 0 : share);
              }, 0);
              const isValid = Math.abs(total - 100) < 0.01;
              
              if (!isValid && beneficiaries.length > 0) {
                return (
                  <div className="flex items-center gap-2 text-red-500 text-sm">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>Shares percentage should equal to 100%</span>
                  </div>
                );
              }
              return null;
            })()}
          </div>

          <div className="flex gap-2 justify-end px-[24px] pb-[24px]">
            <Button
              variant="ghost"
              onClick={() => {
                setIsEditPercentagesModalOpen(false);
                setEditPercentagesShares({});
                setEditPercentagesSplitEqually(false);
              }}
            >
              Cancel
            </Button>
            <Button
              intent="primary"
              disabled={(() => {
                if (editPercentagesSplitEqually) return false;
                const total = beneficiaries.reduce((sum, ben) => {
                  const share = parseFloat(editPercentagesShares[ben.id] || ben.sharePercentage || "0");
                  return sum + (isNaN(share) ? 0 : share);
                }, 0);
                return beneficiaries.length === 0 || Math.abs(total - 100) >= 0.01;
              })()}
              onClick={() => {
                setBeneficiaries((prev) => {
                  const updated = prev.map((ben) => ({
                    ...ben,
                    sharePercentage: editPercentagesShares[ben.id] || ben.sharePercentage || "0",
                  }));
                  saveBeneficiariesToStorage(updated);
                  return updated;
                });

                toast.success("Share percentages updated", {
                  description: "Beneficiary share percentages have been updated successfully.",
                });

                setIsEditPercentagesModalOpen(false);
                setEditPercentagesShares({});
              }}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Report Card Lost/Stolen Workspace */}
      <Workspace
        open={isReportLostStolenWorkspaceOpen}
        onOpenChange={(open) => {
          setIsReportLostStolenWorkspaceOpen(open);
          if (!open) {
            setConfirmationAnswer("");
            setCardBeingReported(null);
          }
        }}
        title="Report Card Lost/Stolen"
        showFooter={true}
        primaryButton={
          <Button
            intent="primary"
            disabled={confirmationAnswer !== "yes"}
            onClick={() => {
              if (cardBeingReported) {
                setDebitCards((prev) =>
                  prev.map((c) =>
                    c.id === cardBeingReported.id ? { ...c, status: "suspended" as const } : c
                  )
                );
                toast.success("Card reported as lost/stolen", {
                  description: `Card xxxx${cardBeingReported.cardNumber} has been reported. A replacement card will be mailed within 5–7 business days.`,
                });
              }
              setIsReportLostStolenWorkspaceOpen(false);
              setConfirmationAnswer("");
              setCardBeingReported(null);
            }}
          >
            Submit Report
          </Button>
        }
        tertiaryButton={
          <Button
            variant="ghost"
            onClick={() => {
              setIsReportLostStolenWorkspaceOpen(false);
              setConfirmationAnswer("");
              setCardBeingReported(null);
            }}
          >
            Cancel
          </Button>
        }
      >
        <WorkspaceContent className="h-full">
          <WorkspaceMain className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-[560px] mx-auto flex flex-col gap-8">

              {/* Card Information */}
              <div className="flex flex-col gap-4">
                <h3 className="text-[20px] font-medium text-foreground leading-8 tracking-[-0.34px]">
                  Card Information
                </h3>
                <div className="border border-border rounded-[8px] px-4 py-3 flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-primary shrink-0" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[14px] font-medium text-foreground leading-6">
                      {cardBeingReported?.cardholderName}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] text-muted-foreground leading-6">
                        •••• {cardBeingReported?.cardNumber}
                      </span>
                      {cardBeingReported?.status === "active" && (
                        <span className="inline-flex items-center px-[7px] py-[3.5px] rounded-[12px] bg-[#dbeafe] text-[#1d4ed8] text-[11px] font-semibold leading-none">
                          Active
                        </span>
                      )}
                      {cardBeingReported?.status === "ready-to-activate" && (
                        <span className="inline-flex items-center px-[7px] py-[3.5px] rounded-[12px] bg-[#dcfce7] text-[#008375] text-[11px] font-semibold leading-none">
                          Ready to Activate
                        </span>
                      )}
                      {cardBeingReported?.status === "deactivated" && (
                        <span className="inline-flex items-center px-[7px] py-[3.5px] rounded-[12px] bg-[#ffecc7] text-[#b37a2b] text-[11px] font-semibold leading-none">
                          Deactivated
                        </span>
                      )}
                      {cardBeingReported?.status === "suspended" && (
                        <span className="inline-flex items-center px-[7px] py-[3.5px] rounded-[12px] bg-[#ffe4e6] text-[#e11d48] text-[11px] font-semibold leading-none">
                          Suspended
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Mailing Address */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-[20px] font-medium text-foreground leading-8 tracking-[-0.34px]">
                    Mailing Address
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 gap-1 text-[color:var(--system-link)] hover:text-[color:var(--system-link)] active:text-[color:var(--system-link)] [&>svg]:text-[color:var(--system-link)]"
                    onClick={() => {
                      setMailingAddressForm({
                        street: mailingAddress.street,
                        addressLine2: mailingAddress.addressLine2 || "",
                        city: mailingAddress.city,
                        state: mailingAddress.state,
                        zip: mailingAddress.zip,
                        country: mailingAddress.country,
                      });
                      setIsMailingAddressModalOpen(true);
                    }}
                  >
                    <Pencil className="h-3.5 w-3.5 text-[color:var(--system-link)]" />
                    <span className="text-sm font-medium text-[color:var(--system-link)]">Edit</span>
                  </Button>
                </div>
                <div className="flex flex-col text-[14px] text-foreground leading-6">
                  <span>{mailingAddress.street}</span>
                  {mailingAddress.addressLine2 && <span>{mailingAddress.addressLine2}</span>}
                  <span>{mailingAddress.city}, {mailingAddress.state} {mailingAddress.zip}</span>
                  <span>{mailingAddress.country}</span>
                </div>
                <div className="h-px bg-border mt-1" />
              </div>

              {/* Update Card Status */}
              <div className="flex flex-col gap-4">
                <h3 className="text-[20px] font-medium text-foreground leading-8 tracking-[-0.34px]">
                  Update Card Status
                </h3>
                <div className="flex items-start gap-6">
                  <span className="text-[14px] text-muted-foreground leading-6 w-[180px] shrink-0">New Status:</span>
                  <span className="text-[14px] text-foreground leading-6">Lost/Stolen</span>
                </div>
                <div className="flex items-start gap-6">
                  <span className="text-[14px] text-muted-foreground leading-6 w-[180px] shrink-0">
                    Can you confirm this card has been lost/stolen?
                  </span>
                  <RadioGroup
                    value={confirmationAnswer}
                    onValueChange={(value) => setConfirmationAnswer(value as "yes" | "no")}
                    className="flex gap-4 pt-0.5"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="yes" id="rls-confirm-yes" />
                      <Label htmlFor="rls-confirm-yes" className="cursor-pointer text-[14px] text-foreground">Yes</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="no" id="rls-confirm-no" />
                      <Label htmlFor="rls-confirm-no" className="cursor-pointer text-[14px] text-foreground">No</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="flex items-start gap-6">
                  <span className="text-[14px] text-muted-foreground leading-6 w-[180px] shrink-0">Replacement Fee:</span>
                  <span className="text-[14px] text-foreground leading-6">$3.00</span>
                </div>
                <div className="h-px bg-border mt-1" />
              </div>

              {/* What Happens Next */}
              <div className="flex flex-col gap-4">
                <h3 className="text-[20px] font-medium text-foreground leading-8 tracking-[-0.34px]">
                  What Happens Next
                </h3>
                <div className="flex flex-col gap-3">
                  {[
                    "Your current card will be deactivated immediately.",
                    "A new card with a new number will be issued and mailed.",
                    "Your replacement card will arrive in 5-7 business days at your U.S. address.",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <SquareArrowRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span className="text-[14px] text-foreground leading-6">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="h-px bg-border" />
                <p className="text-[13px] text-muted-foreground leading-6">
                  * A United States mailing address is required to receive a replacement card.
                </p>
                <Alert
                  intent="info"
                  className="border border-blue-200 bg-[rgba(239,246,255,0.95)] rounded-md shadow-[0px_4px_8px_0px_rgba(2,5,10,0.04)]"
                >
                  <AlertCircle className="h-4 w-4 text-[hsl(var(--wex-info))] shrink-0" />
                  <AlertDescription className="text-[14px] text-primary leading-6">
                    <span className="font-normal">
                      A replacement card fee may apply. If you suspect fraud, please mark the card as Lost/Stolen and contact XX Bank HSA Customer Support at{" "}
                    </span>
                    <span className="font-semibold">1-888-350-5353</span>
                    <span className="font-normal"> to file a report and initiate an investigation.</span>
                  </AlertDescription>
                </Alert>
              </div>

            </div>
          </WorkspaceMain>
        </WorkspaceContent>

        {/* Mailing Address Dialog (shared state, accessible from workspace) */}
        <Dialog open={isMailingAddressModalOpen} onOpenChange={setIsMailingAddressModalOpen}>
          <DialogContent className="w-[400px] p-0 gap-6 [&>div:last-child]:hidden">
            <div className="flex items-center justify-between p-[17.5px]">
              <DialogTitle className="text-[17.5px] font-semibold text-foreground leading-normal">
                Update Mailing Address
              </DialogTitle>
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Close">
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </DialogClose>
            </div>
            <div className="px-6 pb-6 flex flex-col gap-4">
              <FloatLabel label="Address" value={mailingAddressForm.street} onChange={(e) => setMailingAddressForm({ ...mailingAddressForm, street: e.target.value })} />
              <FloatLabel label="Address line 2" value={mailingAddressForm.addressLine2} onChange={(e) => setMailingAddressForm({ ...mailingAddressForm, addressLine2: e.target.value })} />
              <FloatLabel label="City" value={mailingAddressForm.city} onChange={(e) => setMailingAddressForm({ ...mailingAddressForm, city: e.target.value })} />
              <div className="relative w-full">
                <Select value={mailingAddressForm.state} onValueChange={(value) => setMailingAddressForm({ ...mailingAddressForm, state: value })}>
                  <SelectTrigger className="h-14 pt-5 pb-2"><SelectValue placeholder=" " /></SelectTrigger>
                  <SelectContent>
                    {["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"].map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <label className={`absolute pointer-events-none origin-top-left transition-all duration-200 ease-out left-3 text-sm text-muted-foreground ${mailingAddressForm.state ? "top-2 scale-75 text-xs" : "top-4"}`}>State</label>
              </div>
              <FloatLabel label="Zip Code" value={mailingAddressForm.zip} onChange={(e) => setMailingAddressForm({ ...mailingAddressForm, zip: e.target.value })} />
              <div className="relative w-full">
                <Select value={mailingAddressForm.country} onValueChange={(value) => setMailingAddressForm({ ...mailingAddressForm, country: value })}>
                  <SelectTrigger className="h-14 pt-5 pb-2"><SelectValue placeholder=" " /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="Mexico">Mexico</SelectItem>
                  </SelectContent>
                </Select>
                <label className={`absolute pointer-events-none origin-top-left transition-all duration-200 ease-out left-3 text-sm text-muted-foreground ${mailingAddressForm.country ? "top-2 scale-75 text-xs" : "top-4"}`}>Country</label>
              </div>
            </div>
            <DialogFooter className="flex gap-2 justify-end p-[17.5px]">
              <Button intent="secondary" variant="outline" onClick={() => setIsMailingAddressModalOpen(false)}>Cancel</Button>
              <Button intent="primary" onClick={() => {
                setMailingAddress({ ...mailingAddress, street: mailingAddressForm.street, addressLine2: mailingAddressForm.addressLine2, city: mailingAddressForm.city, state: mailingAddressForm.state, zip: mailingAddressForm.zip, country: mailingAddressForm.country });
                setIsMailingAddressModalOpen(false);
                toast.success("Address updated");
              }}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Workspace>

      {/* Order Replacement Card Workspace */}
      <Workspace
        open={isOrderReplacementWorkspaceOpen}
        onOpenChange={(open) => {
          setIsOrderReplacementWorkspaceOpen(open);
          if (!open) setCardBeingReplaced(null);
        }}
        title="Order Replacement Card"
        showFooter={true}
        primaryButton={
          <Button
            intent="primary"
            onClick={() => {
              if (cardBeingReplaced) {
                setDebitCards((prev) =>
                  prev.map((c) =>
                    c.id === cardBeingReplaced.id ? { ...c, status: "replacement-ordered" as const } : c
                  )
                );
                toast.success("Replacement card ordered", {
                  description: `A replacement card for ${cardBeingReplaced.cardholderName} xxxx${cardBeingReplaced.cardNumber} will be mailed within 5–7 business days.`,
                });
              }
              setIsOrderReplacementWorkspaceOpen(false);
              setCardBeingReplaced(null);
            }}
          >
            Submit Order
          </Button>
        }
        tertiaryButton={
          <Button
            variant="ghost"
            onClick={() => {
              setIsOrderReplacementWorkspaceOpen(false);
              setCardBeingReplaced(null);
            }}
          >
            Cancel
          </Button>
        }
      >
        <WorkspaceContent className="h-full">
          <WorkspaceMain className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-[560px] mx-auto flex flex-col gap-8">

              {/* Card Information */}
              <div className="flex flex-col gap-4">
                <h3 className="text-[20px] font-medium text-foreground leading-8 tracking-[-0.34px]">
                  Card Information
                </h3>
                <div className="border border-border rounded-[8px] px-4 py-3 flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-primary shrink-0" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[14px] font-medium text-foreground leading-6">
                      {cardBeingReplaced?.cardholderName}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] text-muted-foreground leading-6">
                        •••• {cardBeingReplaced?.cardNumber}
                      </span>
                      {cardBeingReplaced?.status === "active" && (
                        <span className="inline-flex items-center px-[7px] py-[3.5px] rounded-[12px] bg-[#dbeafe] text-[#1d4ed8] text-[11px] font-semibold leading-none">
                          Active
                        </span>
                      )}
                      {cardBeingReplaced?.status === "ready-to-activate" && (
                        <span className="inline-flex items-center px-[7px] py-[3.5px] rounded-[12px] bg-[#dcfce7] text-[#008375] text-[11px] font-semibold leading-none">
                          Ready to Activate
                        </span>
                      )}
                      {cardBeingReplaced?.status === "deactivated" && (
                        <span className="inline-flex items-center px-[7px] py-[3.5px] rounded-[12px] bg-[#ffecc7] text-[#b37a2b] text-[11px] font-semibold leading-none">
                          Deactivated
                        </span>
                      )}
                      {cardBeingReplaced?.status === "suspended" && (
                        <span className="inline-flex items-center px-[7px] py-[3.5px] rounded-[12px] bg-[#ffe4e6] text-[#e11d48] text-[11px] font-semibold leading-none">
                          Suspended
                        </span>
                      )}
                      {cardBeingReplaced?.status === "replacement-ordered" && (
                        <span className="inline-flex items-center px-[7px] py-[3.5px] rounded-[12px] bg-[#e0e7ff] text-[#3730a3] text-[11px] font-semibold leading-none">
                          Replacement Ordered
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Mailing Address */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-[20px] font-medium text-foreground leading-8 tracking-[-0.34px]">
                    Mailing Address
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 gap-1 text-[color:var(--system-link)] hover:text-[color:var(--system-link)] active:text-[color:var(--system-link)] [&>svg]:text-[color:var(--system-link)]"
                    onClick={() => {
                      setMailingAddressForm({
                        street: mailingAddress.street,
                        addressLine2: mailingAddress.addressLine2 || "",
                        city: mailingAddress.city,
                        state: mailingAddress.state,
                        zip: mailingAddress.zip,
                        country: mailingAddress.country,
                      });
                      setIsMailingAddressModalOpen(true);
                    }}
                  >
                    <Pencil className="h-3.5 w-3.5 text-[color:var(--system-link)]" />
                    <span className="text-sm font-medium text-[color:var(--system-link)]">Edit</span>
                  </Button>
                </div>
                <div className="flex flex-col text-[14px] text-foreground leading-6">
                  <span>{mailingAddress.street}</span>
                  {mailingAddress.addressLine2 && <span>{mailingAddress.addressLine2}</span>}
                  <span>{mailingAddress.city}, {mailingAddress.state} {mailingAddress.zip}</span>
                  <span>{mailingAddress.country}</span>
                </div>
                <div className="h-px bg-border mt-1" />
              </div>

              {/* What Happens Next */}
              <div className="flex flex-col gap-4">
                <h3 className="text-[20px] font-medium text-foreground leading-8 tracking-[-0.34px]">
                  What Happens Next
                </h3>
                <div className="flex flex-col gap-3">
                  {[
                    "Your current card will be deactivated immediately.",
                    "A new card with the same card number will be issued and mailed.",
                    "Your replacement card will arrive in 5-7 business days at your U.S. address.",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <SquareArrowRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span className="text-[14px] text-foreground leading-6">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="h-px bg-border" />
                <p className="text-[13px] text-muted-foreground leading-6">
                  * A United States mailing address is required to receive a replacement card.
                </p>
                <Alert
                  intent="info"
                  className="border border-blue-200 bg-[rgba(239,246,255,0.95)] rounded-md shadow-[0px_4px_8px_0px_rgba(2,5,10,0.04)]"
                >
                  <AlertCircle className="h-4 w-4 text-[hsl(var(--wex-info))] shrink-0" />
                  <AlertDescription className="text-[14px] text-primary leading-6">
                    <span className="font-normal">
                      A replacement card fee may apply. If you suspect fraud, please mark the card as Lost/Stolen and contact XX Bank HSA Customer Support at{" "}
                    </span>
                    <span className="font-semibold">1-888-350-5353</span>
                    <span className="font-normal"> to file a report and initiate an investigation.</span>
                  </AlertDescription>
                </Alert>
              </div>

            </div>
          </WorkspaceMain>
        </WorkspaceContent>
      </Workspace>
    </div>
  );
}


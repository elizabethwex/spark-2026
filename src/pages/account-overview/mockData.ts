/**
 * Mock Data for Account Overview Page
 * 
 * Centralized data for all sections of the account overview.
 */

// Account Summary Types
export interface AccountSummary {
  id: string;
  name: string;
  balance: string;
  lastDayToFile: string;
  daysLeftWarning?: number;
}

// Transaction Types
export type TransactionStatus = "Pending" | "Complete";

export interface Transaction {
  id: string;
  date: string;
  status: TransactionStatus;
  account: string;
  description: string;
  subtext?: string;
  category: string;
  amount: string;
  isPositive: boolean;
}

// Previous Plan Year Types
export interface PreviousPlanYearAccount {
  id: string;
  year: string;
  account: string;
  electionAmount: string;
  claimsProcessed: string;
  amountForfeited: string;
  amountRollover: string;
}

// Account Summary Data
export const accountSummaryData: AccountSummary[] = [
  {
    id: "fsa",
    name: "Flexible Spending Account (FSA)",
    balance: "$1,750.00",
    lastDayToFile: "03/31/2026",
  },
  {
    id: "dcfsa",
    name: "Dependent Care FSA",
    balance: "$440.00",
    lastDayToFile: "03/31/2026",
    daysLeftWarning: 90,
  },
  {
    id: "lfsa",
    name: "Lifestyle FSA",
    balance: "$250.00",
    lastDayToFile: "03/31/2026",
    daysLeftWarning: 90,
  },
  {
    id: "tfsa",
    name: "Transit FSA",
    balance: "$90.00",
    lastDayToFile: "03/31/2026",
    daysLeftWarning: 90,
  },
];

// Transactions Data
export const transactionsData: Transaction[] = [
  {
    id: "1",
    date: "01/01/2026",
    status: "Pending",
    account: "HSA",
    description: "Employer Contribution",
    category: "Contribution",
    amount: "$60.00",
    isPositive: true,
  },
  {
    id: "2",
    date: "01/01/2026",
    status: "Pending",
    account: "HSA",
    description: "Payroll Contribution",
    category: "Contribution",
    amount: "$150.00",
    isPositive: true,
  },
  {
    id: "3",
    date: "01/01/2026",
    status: "Complete",
    account: "HSA",
    description: "CVS Pharmacy",
    category: "Pharmacy",
    amount: "- $26.00",
    isPositive: false,
  },
  {
    id: "4",
    date: "01/01/2026",
    status: "Complete",
    account: "Lifestyle FSA",
    description: "-",
    category: "Distribution",
    amount: "- $250.00",
    isPositive: false,
  },
  {
    id: "5",
    date: "01/01/2026",
    status: "Complete",
    account: "HSA",
    description: "Dr. Dolittle",
    category: "Medical",
    amount: "- $250.00",
    isPositive: false,
  },
  {
    id: "6",
    date: "01/01/2026",
    status: "Complete",
    account: "Dependent Care FSA",
    description: "Little One's Daycare",
    category: "Dependent Care",
    amount: "- $146.00",
    isPositive: false,
  },
  {
    id: "7",
    date: "01/01/2026",
    status: "Complete",
    account: "HSA",
    description: "Interest",
    category: "Interest",
    amount: "$0.06",
    isPositive: true,
  },
  {
    id: "8",
    date: "01/01/2026",
    status: "Complete",
    account: "Transit FSA",
    description: "CityMetro Card",
    category: "Commuter",
    amount: "- $90.00",
    isPositive: false,
  },
  {
    id: "9",
    date: "01/01/2026",
    status: "Complete",
    account: "HSA",
    description: "Crystal Lastname",
    subtext: "Claim 123456",
    category: "Distribution",
    amount: "- $250.00",
    isPositive: false,
  },
  {
    id: "10",
    date: "01/01/2026",
    status: "Complete",
    account: "HSA",
    description: "Bright Smiles Dental",
    category: "Dental",
    amount: "- $250.00",
    isPositive: false,
  },
];

// Previous Plan Year Data
export const previousPlanYearData: PreviousPlanYearAccount[] = [
  {
    id: "1",
    year: "01/01/2024 - 12/31/2024",
    account: "LPFSA",
    electionAmount: "$1,300.00 USD",
    claimsProcessed: "$100.00",
    amountForfeited: "$0.00",
    amountRollover: "N/A",
  },
  {
    id: "2",
    year: "01/01/2024 - 12/31/2024",
    account: "LPFSA",
    electionAmount: "$150.00",
    claimsProcessed: "$150.00",
    amountForfeited: "$10.00",
    amountRollover: "$0.00",
  },
];

// Date range options for Previous Plan Year dropdown
export const dateRangeOptions = [
  { value: "2024", label: "01/01/2024 - 12/31/2024" },
  { value: "2023", label: "01/01/2023 - 12/31/2023" },
  { value: "2022", label: "01/01/2022 - 12/31/2022" },
];

// Transaction Detail Types (for sheet/sidebar)
export interface TransactionDetail {
  yearRange: string;
  accountName: string;
  electionAmount: string;
  amountForfeited: string;
  amountRollover: string;
  availableBalance: string;
  effective: string;
  myAnnualElection: string;
  companyContributions: string;
  myContributionsToDate: string;
  estimatedPayrollDeductions: string;
  planYearBalance: string;
  claims: {
    submitted: string;
    paid: string;
    pending: string;
    denied: string;
  };
}

// Transaction Detail Mock Data (mapped by transaction ID)
export const transactionDetailData: Record<string, TransactionDetail> = {
  "1": {
    yearRange: "01/01/2024 - 12/31/2024",
    accountName: "Health Savings Account (HSA)",
    electionAmount: "$1,300.00",
    amountForfeited: "$0.00",
    amountRollover: "$0.00",
    availableBalance: "$1,300.00",
    effective: "01/01/2024",
    myAnnualElection: "$1,200.00",
    companyContributions: "$100.00 of 100.00",
    myContributionsToDate: "$1,200.00",
    estimatedPayrollDeductions: "$23.08",
    planYearBalance: "$1,300.00",
    claims: {
      submitted: "$100.00",
      paid: "$100.00",
      pending: "$0.00",
      denied: "$0.00",
    },
  },
  "2": {
    yearRange: "01/01/2024 - 12/31/2024",
    accountName: "Health Savings Account (HSA)",
    electionAmount: "$1,300.00",
    amountForfeited: "$0.00",
    amountRollover: "$0.00",
    availableBalance: "$1,150.00",
    effective: "01/01/2024",
    myAnnualElection: "$1,200.00",
    companyContributions: "$100.00 of 100.00",
    myContributionsToDate: "$1,050.00",
    estimatedPayrollDeductions: "$23.08",
    planYearBalance: "$1,150.00",
    claims: {
      submitted: "$150.00",
      paid: "$150.00",
      pending: "$0.00",
      denied: "$0.00",
    },
  },
  "3": {
    yearRange: "01/01/2024 - 12/31/2024",
    accountName: "Health Savings Account (HSA)",
    electionAmount: "$1,300.00",
    amountForfeited: "$0.00",
    amountRollover: "$0.00",
    availableBalance: "$1,274.00",
    effective: "01/01/2024",
    myAnnualElection: "$1,200.00",
    companyContributions: "$100.00 of 100.00",
    myContributionsToDate: "$1,200.00",
    estimatedPayrollDeductions: "$23.08",
    planYearBalance: "$1,274.00",
    claims: {
      submitted: "$26.00",
      paid: "$26.00",
      pending: "$0.00",
      denied: "$0.00",
    },
  },
  "4": {
    yearRange: "01/01/2024 - 12/31/2024",
    accountName: "Lifestyle Flexible Spending Account",
    electionAmount: "$500.00",
    amountForfeited: "$0.00",
    amountRollover: "$0.00",
    availableBalance: "$250.00",
    effective: "01/01/2024",
    myAnnualElection: "$500.00",
    companyContributions: "$0.00 of 0.00",
    myContributionsToDate: "$500.00",
    estimatedPayrollDeductions: "$19.23",
    planYearBalance: "$250.00",
    claims: {
      submitted: "$250.00",
      paid: "$250.00",
      pending: "$0.00",
      denied: "$0.00",
    },
  },
  "5": {
    yearRange: "01/01/2024 - 12/31/2024",
    accountName: "Health Savings Account (HSA)",
    electionAmount: "$1,300.00",
    amountForfeited: "$0.00",
    amountRollover: "$0.00",
    availableBalance: "$1,050.00",
    effective: "01/01/2024",
    myAnnualElection: "$1,200.00",
    companyContributions: "$100.00 of 100.00",
    myContributionsToDate: "$1,200.00",
    estimatedPayrollDeductions: "$23.08",
    planYearBalance: "$1,050.00",
    claims: {
      submitted: "$250.00",
      paid: "$250.00",
      pending: "$0.00",
      denied: "$0.00",
    },
  },
  "6": {
    yearRange: "01/01/2024 - 12/31/2024",
    accountName: "Dependent Care Flexible Spending Account",
    electionAmount: "$5,000.00",
    amountForfeited: "$0.00",
    amountRollover: "N/A",
    availableBalance: "$4,854.00",
    effective: "01/01/2024",
    myAnnualElection: "$5,000.00",
    companyContributions: "$0.00 of 0.00",
    myContributionsToDate: "$5,000.00",
    estimatedPayrollDeductions: "$192.31",
    planYearBalance: "$4,854.00",
    claims: {
      submitted: "$146.00",
      paid: "$146.00",
      pending: "$0.00",
      denied: "$0.00",
    },
  },
  "7": {
    yearRange: "01/01/2024 - 12/31/2024",
    accountName: "Health Savings Account (HSA)",
    electionAmount: "$1,300.00",
    amountForfeited: "$0.00",
    amountRollover: "$0.00",
    availableBalance: "$1,300.06",
    effective: "01/01/2024",
    myAnnualElection: "$1,200.00",
    companyContributions: "$100.00 of 100.00",
    myContributionsToDate: "$1,200.00",
    estimatedPayrollDeductions: "$23.08",
    planYearBalance: "$1,300.06",
    claims: {
      submitted: "$0.00",
      paid: "$0.00",
      pending: "$0.00",
      denied: "$0.00",
    },
  },
  "8": {
    yearRange: "01/01/2024 - 12/31/2024",
    accountName: "Transit Flexible Spending Account",
    electionAmount: "$3,600.00",
    amountForfeited: "$0.00",
    amountRollover: "$0.00",
    availableBalance: "$3,510.00",
    effective: "01/01/2024",
    myAnnualElection: "$3,600.00",
    companyContributions: "$0.00 of 0.00",
    myContributionsToDate: "$3,600.00",
    estimatedPayrollDeductions: "$138.46",
    planYearBalance: "$3,510.00",
    claims: {
      submitted: "$90.00",
      paid: "$90.00",
      pending: "$0.00",
      denied: "$0.00",
    },
  },
  "9": {
    yearRange: "01/01/2024 - 12/31/2024",
    accountName: "Health Savings Account (HSA)",
    electionAmount: "$1,300.00",
    amountForfeited: "$0.00",
    amountRollover: "$0.00",
    availableBalance: "$1,050.00",
    effective: "01/01/2024",
    myAnnualElection: "$1,200.00",
    companyContributions: "$100.00 of 100.00",
    myContributionsToDate: "$1,200.00",
    estimatedPayrollDeductions: "$23.08",
    planYearBalance: "$1,050.00",
    claims: {
      submitted: "$250.00",
      paid: "$250.00",
      pending: "$0.00",
      denied: "$0.00",
    },
  },
  "10": {
    yearRange: "01/01/2024 - 12/31/2024",
    accountName: "Health Savings Account (HSA)",
    electionAmount: "$1,300.00",
    amountForfeited: "$0.00",
    amountRollover: "$0.00",
    availableBalance: "$1,050.00",
    effective: "01/01/2024",
    myAnnualElection: "$1,200.00",
    companyContributions: "$100.00 of 100.00",
    myContributionsToDate: "$1,200.00",
    estimatedPayrollDeductions: "$23.08",
    planYearBalance: "$1,050.00",
    claims: {
      submitted: "$250.00",
      paid: "$250.00",
      pending: "$0.00",
      denied: "$100.00",
    },
  },
};


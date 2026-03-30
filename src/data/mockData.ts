/**
 * Mock Data for Consumer Experience Page
 *
 * Centralized data for all sections of the consumer experience demo.
 */

export interface Account {
  type: string;
  balance: string;
  daysLeft?: number;
  hasAlert?: boolean;
}

export interface AccountCard {
  title: string;
  accounts: Account[];
}

export interface HSAAccountData {
  title: string;
  subtitle: string;
  totalAccountValue: string;
  availableCash: string;
  investments: string;
}

export type TransactionStatus = "pending" | "processing" | "paid" | "denied";
export type TransactionCategory = "medical" | "dental" | "vision" | "pharmacy" | "childcare" | "contribution";

export interface TransactionTimelineStep {
  label: string;
  date?: string;
  completed: boolean;
  active: boolean;
}

export interface Transaction {
  date: string;
  merchant: string;
  account: string;
  amount: string;
  status: TransactionStatus;
  category: TransactionCategory;
  member: string;
  timeline: TransactionTimelineStep[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  isPending: boolean;
  actionLabel: string;
  category?: string;
  isUrgent?: boolean;
}

export interface QuickLink {
  label: string;
}

export interface InfoCard {
  title: string;
  description: string;
  buttonText: string;
  imageAlt: string;
}

export interface ChartData {
  year: string;
  amount: number;
}

export interface HSAContributionBar {
  year: string;
  contributed: number;
  remaining: number;
  irsMax: number;
}

export interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
}

export const hsaData: AccountCard = {
  title: "HSA For Life\u00AE",
  accounts: [
    { type: "Cash Account", balance: "$0.00" },
    { type: "Investment Account", balance: "$0.00" },
  ],
};

export const fsaData: AccountCard = {
  title: "01/01/2025 - 12/31/2025",
  accounts: [
    {
      type: "Health FSA",
      balance: "$250.00",
      daysLeft: 49,
      hasAlert: true,
    },
  ],
};

export const hsaAccountData: HSAAccountData = {
  title: "HSA For Life\u00AE",
  subtitle: "Health Savings Account \u2022 2025 Plan Year",
  totalAccountValue: "$0.00",
  availableCash: "$0.00",
  investments: "$0.00",
};

export const tasksData: Task[] = [
  {
    id: "1",
    title: "Set up Direct Deposit",
    description: "Get your money faster by linking your bank account.",
    isPending: true,
    actionLabel: "Add Account",
    category: "banking",
  },
  {
    id: "2",
    title: "LSA Expiring Soon",
    description: "Today is the last day to spend your remaining balance.",
    isPending: true,
    actionLabel: "View Balance",
    isUrgent: true,
    category: "clock",
  },
  {
    id: "3",
    title: "Verify your Email",
    description: "Secure your account by confirming your email address.",
    isPending: true,
    actionLabel: "Verify Now",
    category: "mail",
  },
];

export const transactionsData: Transaction[] = [
  {
    date: "01/17/2025",
    merchant: "Payroll Contribution",
    account: "HSA",
    amount: "$158.00",
    status: "pending",
    category: "contribution",
    member: "You",
    timeline: [
      { label: "Submitted", date: "01/17/2025", completed: true, active: false },
      { label: "Processing", completed: false, active: true },
      { label: "Complete", completed: false, active: false },
    ],
  },
  {
    date: "01/14/2025",
    merchant: "Walgreens",
    account: "HSA",
    amount: "- $26.00",
    status: "paid",
    category: "pharmacy",
    member: "You",
    timeline: [
      { label: "Submitted", date: "01/14/2025", completed: true, active: false },
      { label: "Processing", date: "01/15/2025", completed: true, active: false },
      { label: "Complete", date: "01/16/2025", completed: true, active: false },
    ],
  },
  {
    date: "01/14/2025",
    merchant: "Payroll Contribution",
    account: "HSA",
    amount: "$158.00",
    status: "paid",
    category: "contribution",
    member: "You",
    timeline: [
      { label: "Submitted", date: "01/14/2025", completed: true, active: false },
      { label: "Processing", date: "01/15/2025", completed: true, active: false },
      { label: "Complete", date: "01/16/2025", completed: true, active: false },
    ],
  },
  {
    date: "01/14/2025",
    merchant: "Little One's Daycare",
    account: "Dependent Care FSA",
    amount: "- $146.00",
    status: "processing",
    category: "childcare",
    member: "Emma D.",
    timeline: [
      { label: "Submitted", date: "01/14/2025", completed: true, active: false },
      { label: "Processing", date: "01/15/2025", completed: false, active: true },
      { label: "Complete", completed: false, active: false },
    ],
  },
];

export const quickLinksData: QuickLink[] = [
  { label: "Contribute to HSA" },
  { label: "Send Payment" },
  { label: "Manage Investments" },
  { label: "Set up update bank account" },
  { label: "Reimburse Myself" },
  { label: "Add/HSA beneficiary" },
  { label: "Manage My Expenses" },
  { label: "View statement and notifications" },
  { label: "Update notification preferences" },
];

export interface QuickAction {
  label: string;
  href: string;
}

export const quickActions: QuickAction[] = [
  { label: "Reimburse Myself", href: "/reimburse" },
  { label: "Send Payment", href: "/send-payment" },
  { label: "Contribute to HSA", href: "/contribute" },
  { label: "Manage My Expenses", href: "/expenses" },
  { label: "Enroll in HSA", href: "/enroll-hsa" },
];

export const aiSuggestions: string[] = [
  "Reimburse Myself",
  "Send Payment",
  "Contribute to HSA",
  "Manage Investments",
  "Manage My Expenses",
  "Enroll in HSA",
];

export const infoCardsData: InfoCard[] = [
  {
    title: "HSA +401(k) = Retire a millionaire",
    description: "With an HSA in hand plus a 401(k), standard that you can exceed your retirement savings goal to retirement with $1M+ after 40(k), standard that you can exceed your retirement savings goal",
    buttonText: "Learn More",
    imageAlt: "Family together",
  },
  {
    title: "Don't put off designating a beneficiary",
    description: "Designate a beneficiary for your Health Savings Account so your loved ones can be in your account and easily transfer funds to their accounts. Once a claim is approved.",
    buttonText: "Get Started",
    imageAlt: "Beneficiary designation",
  },
  {
    title: "Get reimbursed faster",
    description: "If you've paid for qualified health care expenses with your own money, you can access your benefit account checks instead to use the eligible health care expenses using our tool.",
    buttonText: "Learn More",
    imageAlt: "Reimbursement process",
  },
  {
    title: "App like change and stabilization process",
    description: "When using the tools in your Health and benefit account to pay for eligible health care expenses. It's where it is calculated, it handles all documents and transaction. A fee legit tax.",
    buttonText: "Learn More",
    imageAlt: "Account tools",
  },
];

export const hsaContributionsData: ChartData[] = [
  { year: "2025", amount: 8550 },
  { year: "2024", amount: 8300 },
  { year: "2023", amount: 7750 },
];

export const hsaContributionBars: HSAContributionBar[] = [
  { year: "2023", contributed: 5900, remaining: 1850, irsMax: 7750 },
  { year: "2024", contributed: 7800, remaining: 500, irsMax: 8300 },
  { year: "2025", contributed: 6200, remaining: 2350, irsMax: 8550 },
];

export const paidClaimsCategoryData: CategoryData[] = [
  { category: "Medical", amount: 450, percentage: 60 },
  { category: "Dental", amount: 200, percentage: 27 },
  { category: "Vision", amount: 100, percentage: 13 },
];

export interface HSAPlannerGoal {
  contributed: number;
  target: number;
  status: "on-track" | "behind";
  message: string;
  estimatedExpenses: number;
}

export interface HSAPlannerData {
  annualGoal: HSAPlannerGoal;
  longTermGoal: HSAPlannerGoal;
}

export const hsaPlannerData: HSAPlannerData = {
  annualGoal: {
    contributed: 600,
    target: 3_000,
    status: "on-track",
    message: "Great job! You are on track to meet your HSA contribution goal.",
    estimatedExpenses: 2_500,
  },
  longTermGoal: {
    contributed: 12_450,
    target: 50_000,
    status: "on-track",
    message: "You're building a strong long-term health savings foundation.",
    estimatedExpenses: 15_000,
  },
};

export const navigationItems = [
  { label: "Home", href: "/", icon: "home", hasDropdown: false },
  {
    label: "Accounts",
    href: "#",
    icon: "wallet",
    hasDropdown: true,
    subItems: [
      { label: "Account Overview", href: "/account-overview" },
      { label: "Health Savings Account (HSA)", href: "/account-overview?account=hsa" },
      { label: "Flexible Savings Account (FSA)", href: "/account-overview?account=fsa" },
      { label: "Dependent Care", href: "/account-overview?account=dependent-care" },
      { label: "Lifestyle Spending Account", href: "/account-overview?account=lifestyle" },
    ],
  },
  { label: "Claims", href: "/claims", icon: "document", hasDropdown: false },
  {
    label: "Resources",
    href: "#",
    icon: "file-text",
    hasDropdown: true,
    subItems: [
      { label: "Resources", href: "/resources" },
      { label: "Forms & Documents", href: "/resources?section=forms" },
      { label: "Videos & Guides", href: "/resources?section=videos" },
      { label: "FAQs", href: "/resources?section=faqs" },
    ],
  },
];

import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  Badge,
  Button,
  Card,
  CardContent,
  Input,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  ToggleGroup,
  ToggleGroupItem,
} from "@wexinc-healthbenefits/ben-ui-kit"
import { cn } from "@/lib/utils"
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Check,
  ChevronsLeft,
  ChevronsRight,
  ClipboardList,
  Clock,
  CreditCard,
  Download,
  FileText,
  Info,
  MoreVertical,
  Paperclip,
  Pencil,
  Search,
  Trash2,
  Upload,
} from "lucide-react"
import { ClaimExpenseDetailSheet } from "@/components/claims/ClaimExpenseDetailSheet"
import { expenseStatusBadgeClass, type ExpenseRow } from "@/components/claims/expenseTypes"
import { DOCUMENTS, type DocumentItem } from "@/components/documents/documentData"
import { FilePreviewModal } from "@/components/documents/FilePreviewModal"

const ACTION_ITEMS = [
  {
    id: "doc-needed",
    rowId: "8",
    alertTitle: "Documentation Needed",
    alertDescription: "Documentation is required to complete this claim.",
    deadlineLabel: "28 Days Remaining",
    provider: "Bigtown Dentistry",
    dateLine: "Jan 22, 2026",
    account: "Healthcare FSA",
    amount: "$210.00",
    primaryAction: { label: "Upload Documentation", icon: "upload" as const },
    secondaryAction: { label: "View Details" },
  },
  {
    id: "repayment",
    rowId: "5",
    alertTitle: "Repayment Due",
    alertDescription:
      "This expense is not eligible for reimbursement under a Dependent Care FSA.",
    deadlineLabel: "14 Days Remaining",
    provider: "Buddy's Overnight Camp",
    dateLine: "Feb 20-21, 2026",
    account: "Dependent Care FSA",
    amount: "$180.00",
    primaryAction: { label: "Repay Expense", icon: "card" as const },
    secondaryAction: { label: "View Details" },
  },
] as const

const EXPENSE_ROWS: ExpenseRow[] = [
  {
    id: "1",
    dateOfService: "Mar 5, 2026",
    status: { label: "Payment Processing", tone: "blue" },
    origin: "manual",
    account: "Healthcare FSA",
    provider: "Dr. John Doe",
    recipient: "BS",
    category: "Medical",
    categoryType: "Office Visit",
    payTo: { cardholderName: "Ben Smith", last4: "4523" },
    attachments: "2 Documents",
    amount: "$150.00",
  },
  {
    id: "2",
    dateOfService: "Feb 28, 2026",
    status: { label: "Documentation Review", tone: "blue" },
    origin: "card",
    account: "Healthcare FSA",
    provider: "Dr. John Doe",
    recipient: "BS",
    category: "Medical",
    categoryType: "Specialist Visit",
    payTo: { cardholderName: "Ben Smith", last4: "4523" },
    attachments: "2 Documents",
    amount: "$60.00",
  },
  {
    id: "3",
    dateOfService: "Feb 7, 2026",
    status: { label: "Approved", tone: "green" },
    origin: "manual",
    account: "Healthcare FSA",
    provider: "Dr. John Doe",
    recipient: "BS",
    category: "Medical",
    categoryType: "Office Visit",
    payTo: { cardholderName: "Ben Smith", last4: "4523" },
    attachments: "2 Documents",
    amount: "$88.00",
  },
  {
    id: "4",
    dateOfService: "Jan 31, 2026",
    status: { label: "Denied", tone: "amber" },
    origin: "card",
    denialReason: "Expense is not eligible under Healthcare FSA plan.",
    account: "Healthcare FSA",
    provider: "Walgreens",
    recipient: "BS",
    category: "Prescription",
    categoryType: "OTC Item",
    payTo: { cardholderName: "Ben Smith", last4: "4523" },
    attachments: "2 Documents",
    amount: "$16.00",
  },
  {
    id: "5",
    dateOfService: "Feb 20–21, 2026",
    status: { label: "Repayment Due", tone: "red", icon: true },
    origin: "card",
    denialReason: "Dependent care expense is not eligible under this plan.",
    account: "Dependent Care FSA",
    provider: "Buddy's Overnight Camp",
    recipient: "JS",
    category: "Dependent Care",
    categoryType: "Overnight Camp",
    payTo: { cardholderName: "James Smith", last4: "4523" },
    attachments: "1 Document",
    amount: "$210.00",
  },
  {
    id: "6",
    dateOfService: "Feb 10, 2026",
    status: { label: "Hold", tone: "amber" },
    origin: "manual",
    holdReason: "Additional review required for this expense category.",
    account: "Healthcare FSA",
    provider: "Walgreens Pharmacy",
    recipient: "JS",
    category: "Prescription",
    categoryType: "Generic Drug",
    payTo: { cardholderName: "James Smith", last4: "4523" },
    attachments: "2 Documents",
    amount: "$150.00",
  },
  {
    id: "7",
    dateOfService: "Jan 18, 2026",
    status: { label: "Paid", tone: "green" },
    origin: "card",
    account: "Healthcare FSA",
    provider: "Dr. John Doe",
    recipient: "JS",
    category: "Medical",
    categoryType: "Office Visit",
    payTo: { cardholderName: "James Smith", last4: "4523" },
    attachments: "2 Documents",
    amount: "$45.00",
  },
  {
    id: "8",
    dateOfService: "Jan 22, 2026",
    status: { label: "Documentation Needed", tone: "red", icon: true },
    origin: "manual",
    account: "Healthcare FSA",
    provider: "Bigtown Dentistry",
    recipient: "BS",
    category: "Dental",
    categoryType: "Dental Exam",
    payTo: { cardholderName: "Ben Smith", last4: "4523" },
    attachments: null,
    amount: "$85.00",
  },
  {
    id: "9",
    dateOfService: "Jan 10, 2026",
    status: { label: "Not Submitted", tone: "gray" },
    origin: "manual",
    account: "Healthcare FSA",
    provider: "Target Optical",
    recipient: "BS",
    category: "Vision",
    categoryType: "Eye Exam",
    payTo: { cardholderName: "Ben Smith", last4: "4523" },
    attachments: "1 Document",
    amount: "$150.00",
  },
  {
    id: "10",
    dateOfService: "Jan 4, 2026",
    status: { label: "Paid", tone: "green" },
    origin: "card",
    account: "Healthcare FSA",
    provider: "CVS Pharmacy",
    recipient: "BS",
    category: "Prescription",
    categoryType: "Brand Name Drug",
    payTo: { cardholderName: "Ben Smith", last4: "4523" },
    attachments: "2 Documents",
    amount: "$36.00",
  },
  {
    id: "11",
    dateOfService: "Mar 12, 2026",
    status: { label: "Submitted", tone: "blue" },
    origin: "manual",
    account: "Healthcare FSA",
    provider: "City Medical Center",
    recipient: "BS",
    category: "Medical",
    categoryType: "Urgent Care",
    payTo: { cardholderName: "Ben Smith", last4: "4523" },
    attachments: null,
    amount: "$220.00",
  },
]

// Show the 3 most recent loose files from the shared document store
const DOCUMENT_CARDS = DOCUMENTS.filter((d) => d.folderId === null).slice(0, 3)

/** SparkAccountsSection-aligned shell for main Claims section cards */
const CLAIMS_SPARK_CARD_PROPS = {
  variant: "outlined" as const,
  className:
    "group/card flex w-full flex-col overflow-hidden rounded-[24px] border border-white/60 bg-white text-foreground shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] transition-shadow hover:shadow-md",
  style: { borderRadius: "24px" as const },
}

/** Rows per page — set to 10 so “All Claims” shows every row on one page. */
const EXPENSE_PAGE_SIZE = 10

type ExpenseFilterId = "all" | "drafts" | "progress" | "complete" | "actionRequired"

/** Maps status label → filter bucket (single source of truth for the toggle group). */
function getExpenseBucket(statusLabel: string): Exclude<ExpenseFilterId, "all"> {
  switch (statusLabel) {
    case "Not Submitted":
      return "drafts"
    case "Submitted":
    case "Payment Processing":
    case "Documentation Review":
    case "Hold":
      return "progress"
    case "Approved":
    case "Paid":
    case "Denied":
      return "complete"
    case "Documentation Needed":
    case "Repayment Due":
      return "actionRequired"
    default:
      return "progress"
  }
}

const EXPENSE_BUCKET_COUNTS = EXPENSE_ROWS.reduce(
  (acc, row) => {
    acc[getExpenseBucket(row.status.label)]++
    return acc
  },
  { drafts: 0, progress: 0, complete: 0, actionRequired: 0 }
)

const EXPENSE_FILTER_OPTIONS: { id: ExpenseFilterId; label: string }[] = [
  { id: "all", label: "All Claims" },
  { id: "drafts", label: `Drafts (${EXPENSE_BUCKET_COUNTS.drafts})` },
  { id: "progress", label: `In Progress (${EXPENSE_BUCKET_COUNTS.progress})` },
  { id: "complete", label: `Complete (${EXPENSE_BUCKET_COUNTS.complete})` },
  { id: "actionRequired", label: `Action Required (${EXPENSE_BUCKET_COUNTS.actionRequired})` },
]

function matchesExpenseSearch(row: ExpenseRow, query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const haystack = [
    row.dateOfService,
    row.status.label,
    row.account,
    row.provider,
    row.recipient,
    row.category,
    row.amount,
    row.attachments ?? "",
  ]
    .join(" ")
    .toLowerCase()
  return haystack.includes(q)
}

/** Sortable claim table columns (aligned with header buttons). */
type ExpenseSortKey =
  | "dateOfService"
  | "status"
  | "account"
  | "provider"
  | "recipient"
  | "category"
  | "attachments"
  | "amount"

function parseDateOfServiceForSort(s: string): number {
  let t = s.replace(/\bSept\b/g, "Sep")
  const range = /^([\w\s]+?\d{1,2})[–—]\s*\d{1,2},\s*(\d{4})$/.exec(t)
  if (range) {
    t = `${range[1].trim()}, ${range[2]}`
  }
  const ms = Date.parse(t)
  return Number.isNaN(ms) ? 0 : ms
}

function formatDateOfService(s: string): string {
  const pad = (n: number) => String(n).padStart(2, "0")
  const fmt = (d: Date) => `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()}`
  let t = s.replace(/\bSept\b/g, "Sep")
  const rangeMatch = /^(\w+)\s+(\d{1,2})[–—](\d{1,2}),\s*(\d{4})$/.exec(t)
  if (rangeMatch) {
    const [, month, d1, d2, year] = rangeMatch
    const start = new Date(`${month} ${d1}, ${year}`)
    const end = new Date(`${month} ${d2}, ${year}`)
    if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())) {
      return `${fmt(start)}–${fmt(end)}`
    }
  }
  const d = new Date(t)
  return Number.isNaN(d.getTime()) ? s : fmt(d)
}

function parseAmountForSort(amount: string): number {
  const n = Number.parseFloat(amount.replace(/[$,]/g, ""))
  return Number.isNaN(n) ? 0 : n
}

/** Ascending comparison only; caller applies direction and attachment empty-last rules. */
function compareExpenseRowsAsc(a: ExpenseRow, b: ExpenseRow, key: ExpenseSortKey): number {
  switch (key) {
    case "dateOfService":
      return parseDateOfServiceForSort(a.dateOfService) - parseDateOfServiceForSort(b.dateOfService)
    case "status":
      return a.status.label.localeCompare(b.status.label, undefined, { sensitivity: "base" })
    case "account":
      return a.account.localeCompare(b.account, undefined, { sensitivity: "base" })
    case "provider":
      return a.provider.localeCompare(b.provider, undefined, { sensitivity: "base" })
    case "recipient":
      return a.recipient.localeCompare(b.recipient, undefined, { sensitivity: "base" })
    case "category":
      return a.category.localeCompare(b.category, undefined, { sensitivity: "base" })
    case "attachments": {
      const as = a.attachments?.trim() ?? ""
      const bs = b.attachments?.trim() ?? ""
      return as.localeCompare(bs, undefined, { sensitivity: "base" })
    }
    case "amount":
      return parseAmountForSort(a.amount) - parseAmountForSort(b.amount)
    default:
      return 0
  }
}

function sortExpenseRows(
  rows: ExpenseRow[],
  key: ExpenseSortKey,
  dir: "asc" | "desc"
): ExpenseRow[] {
  return [...rows].sort((a, b) => {
    if (key === "attachments") {
      const ae = !a.attachments?.trim()
      const be = !b.attachments?.trim()
      if (ae && be) return 0
      if (ae) return 1
      if (be) return -1
    }
    const cmp = compareExpenseRowsAsc(a, b, key)
    return dir === "asc" ? cmp : -cmp
  })
}

const EXPENSE_TABLE_COLUMNS: { key: ExpenseSortKey; label: string; align?: "right" }[] = [
  { key: "dateOfService", label: "Date of Service" },
  { key: "status", label: "Status" },
  { key: "account", label: "Account" },
  { key: "provider", label: "Provider/Service" },
  { key: "recipient", label: "Recipient" },
  { key: "category", label: "Category" },
  { key: "attachments", label: "Attachments" },
  { key: "amount", label: "Amount", align: "right" },
]

function expenseSortAriaSort(
  activeKey: ExpenseSortKey,
  columnKey: ExpenseSortKey,
  dir: "asc" | "desc"
): "none" | "ascending" | "descending" {
  if (activeKey !== columnKey) return "none"
  return dir === "asc" ? "ascending" : "descending"
}

export function ClaimsPaymentsContent() {
  const [expenseSearch, setExpenseSearch] = useState("")
  const [expenseFilter, setExpenseFilter] = useState<ExpenseFilterId>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(EXPENSE_PAGE_SIZE)
  const [expenseSort, setExpenseSort] = useState<{
    key: ExpenseSortKey
    dir: "asc" | "desc"
  }>({ key: "dateOfService", dir: "desc" })
  const [selectedClaimRow, setSelectedClaimRow] = useState<ExpenseRow | null>(null)
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null)

  const filteredExpenseRows = useMemo(() => {
    return EXPENSE_ROWS.filter((row) => {
      if (expenseFilter !== "all" && getExpenseBucket(row.status.label) !== expenseFilter) {
        return false
      }
      return matchesExpenseSearch(row, expenseSearch)
    })
  }, [expenseFilter, expenseSearch])

  const sortedFilteredExpenseRows = useMemo(
    () => sortExpenseRows(filteredExpenseRows, expenseSort.key, expenseSort.dir),
    [filteredExpenseRows, expenseSort]
  )

  const totalPages = Math.max(1, Math.ceil(sortedFilteredExpenseRows.length / rowsPerPage))

  const effectivePage = Math.min(currentPage, totalPages)

  const paginatedExpenseRows = useMemo(() => {
    const start = (effectivePage - 1) * rowsPerPage
    return sortedFilteredExpenseRows.slice(start, start + rowsPerPage)
  }, [sortedFilteredExpenseRows, effectivePage, rowsPerPage])

  const handleExpenseSort = (key: ExpenseSortKey) => {
    setExpenseSort((prev) =>
      prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }
    )
    setCurrentPage(1)
  }

  return (
    <div className="mx-auto w-full max-w-[1376px] space-y-6">

      {/* Page title + primary actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Claims
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            intent="primary"
            variant="outline"
            size="md"
          >
            Add / Pay Expense
          </Button>
          <Button
            type="button"
            intent="primary"
            size="md"
            asChild
          >
            <Link to="/reimburse" state={{ from: "/claims" }}>Reimburse Myself</Link>
          </Button>
        </div>
      </div>

      {/* Action Required */}
      <Card {...CLAIMS_SPARK_CARD_PROPS}>
        <CardContent className="border-0 p-0">
          {/* Section header */}
          <div className="flex items-center gap-2 px-6 pt-5 pb-4">
            <h2 className="text-xl font-semibold text-foreground">Action Required</h2>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[11px] font-bold leading-none text-white">
              2
            </span>
          </div>

          {/* Action items — nested cards inset to align with section title */}
          <div className="flex flex-col gap-4 px-6 pb-6 pt-0">
            {ACTION_ITEMS.map((item) => {
              const actionRow = EXPENSE_ROWS.find((r) => r.id === item.rowId) ?? null
              return (
                <Card
                  key={item.id}
                  variant="outlined"
                  className="cursor-pointer overflow-hidden border-border bg-card shadow-none transition-shadow hover:shadow-sm"
                  tabIndex={0}
                  aria-label={`Open details for ${item.provider}`}
                  onClick={() => { if (actionRow) setSelectedClaimRow(actionRow) }}
                  onKeyDown={(e) => {
                    if ((e.key === "Enter" || e.key === " ") && actionRow) {
                      e.preventDefault()
                      setSelectedClaimRow(actionRow)
                    }
                  }}
                >
                  <CardContent className="p-0">
                    {/* Alert banner */}
                    <div className="flex items-center justify-between gap-4 bg-red-50 px-4 py-3 sm:px-5">
                      <div className="flex min-w-0 items-start gap-3">
                        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-red-700">{item.alertTitle}</p>
                          <p className="text-sm text-red-600/80">{item.alertDescription}</p>
                        </div>
                      </div>
                      <Badge
                        intent="destructive"
                        size="md"
                        pill
                        className="shrink-0 whitespace-nowrap"
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 shrink-0 text-current" aria-hidden />
                          {item.deadlineLabel}
                        </span>
                      </Badge>
                    </div>

                    {/* Provider / amount */}
                    <div className="px-4 py-4 sm:px-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-base font-semibold text-foreground">{item.provider}</p>
                          <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-muted-foreground">
                            <span>{item.dateLine}</span>
                            <span className="h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                            <span>{item.account}</span>
                          </p>
                        </div>
                        <p className="shrink-0 text-2xl font-bold tabular-nums text-foreground">
                          {item.amount}
                        </p>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
                        <Button
                          type="button"
                          intent="primary"
                          variant="solid"
                          size="sm"
                          className="gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {item.primaryAction.icon === "upload" && (
                            <Upload className="size-4 shrink-0 text-current" aria-hidden />
                          )}
                          {item.primaryAction.icon === "card" && (
                            <CreditCard className="size-4 shrink-0 text-current" aria-hidden />
                          )}
                          {item.primaryAction.label}
                        </Button>
                        <Button
                          type="button"
                          intent="primary"
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            if (actionRow) setSelectedClaimRow(actionRow)
                          }}
                        >
                          {item.secondaryAction.label}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Claims */}
      <Card {...CLAIMS_SPARK_CARD_PROPS}>
        <CardContent className="p-0">
          {/* Section header */}
          <div className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-foreground">Claims</h2>
            <div className="w-full max-w-[240px]">
              <Input
                inputSize="md"
                type="search"
                placeholder="Find a claim..."
                leftIcon={<Search className="h-4 w-4 text-current" />}
                value={expenseSearch}
                onChange={(e) => {
                  setExpenseSearch(e.target.value)
                  setCurrentPage(1)
                }}
                autoComplete="off"
              />
            </div>
          </div>

          {/* Expense filter */}
          <div className="px-6 pt-0 pb-4">
            <ToggleGroup
              type="single"
              value={expenseFilter}
              onValueChange={(value) => {
                if (value) {
                  setExpenseFilter(value as ExpenseFilterId)
                  setCurrentPage(1)
                }
              }}
              variant="default"
              size="sm"
              aria-label="Filter claims"
              className="inline-flex w-fit justify-start rounded-md bg-muted/50 p-0.5"
            >
              {EXPENSE_FILTER_OPTIONS.map(({ id, label }) => (
                <ToggleGroupItem
                  key={id}
                  value={id}
                  className="px-4 text-sm shadow-none"
                >
                  {label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          {/* Table — padding on wrapper (not margin on table) avoids overflow; table-fixed + colgroup fits desktop width */}
          <div className="min-w-0 px-6">
            <Table className="table-fixed">
              <colgroup>
                <col className="w-[12%]" />
                <col className="w-[16%]" />
                <col className="w-[15%]" />
                <col className="w-[18%]" />
                <col className="w-[7%]" />
                <col className="w-[11%]" />
                <col className="w-[13%]" />
                <col className="w-[8%]" />
              </colgroup>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-y border-border bg-muted/30">
                  {EXPENSE_TABLE_COLUMNS.map(({ key, label, align }) => {
                    const active = expenseSort.key === key
                    const sortIcon =
                      active && expenseSort.dir === "asc" ? (
                        <ArrowUp className="h-3 w-3 shrink-0 text-foreground" aria-hidden />
                      ) : active && expenseSort.dir === "desc" ? (
                        <ArrowDown className="h-3 w-3 shrink-0 text-foreground" aria-hidden />
                      ) : (
                        <ArrowUpDown className="h-3 w-3 shrink-0 opacity-60" aria-hidden />
                      )
                    return (
                      <TableHead
                        key={key}
                        aria-sort={expenseSortAriaSort(expenseSort.key, key, expenseSort.dir)}
                        className={cn(
                          "px-2 py-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground",
                          align === "right" && "text-right"
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => handleExpenseSort(key)}
                          className={cn(
                            "inline-flex max-w-full items-center gap-1 truncate rounded-sm hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wex-input-focus-ring",
                            align === "right" && "w-full justify-end"
                          )}
                          aria-label={`Sort by ${label}, ${active ? (expenseSort.dir === "asc" ? "ascending" : "descending") : "not sorted"}. Activate to change sort.`}
                        >
                          {label}
                          {sortIcon}
                        </button>
                      </TableHead>
                    )
                  })}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedExpenseRows.length === 0 ? (
                  <TableRow className="border-b border-border/60">
                    <TableCell
                      colSpan={8}
                      className="py-10 text-center text-sm text-muted-foreground"
                    >
                      No claims match this filter
                      {expenseSearch.trim() ? " and search" : ""}.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedExpenseRows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="cursor-pointer hover:bg-muted/30 border-b border-border/60"
                      tabIndex={0}
                      aria-label={`Open details for ${row.provider}, ${row.amount}`}
                      onClick={() => setSelectedClaimRow(row)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          setSelectedClaimRow(row)
                        }
                      }}
                    >
                    <TableCell className="min-w-0 px-2 py-4 text-sm text-foreground">
                      <span className="line-clamp-2 break-words">{formatDateOfService(row.dateOfService)}</span>
                    </TableCell>
                    <TableCell className="min-w-0 px-2 py-2.5">
                      <span
                        className={cn(
                          "inline-flex max-w-full items-center gap-1 truncate rounded-full px-2 py-0.5 text-xs font-medium",
                          expenseStatusBadgeClass(row.status.tone)
                        )}
                      >
                        {row.status.icon && <AlertTriangle className="h-3 w-3 shrink-0 text-current" aria-hidden />}
                        <span className="min-w-0 truncate">{row.status.label}</span>
                      </span>
                    </TableCell>
                    <TableCell className="min-w-0 px-2 py-4 text-sm text-foreground">
                      <span className="block truncate">{row.account}</span>
                    </TableCell>
                    <TableCell className="min-w-0 px-2 py-4 text-sm text-foreground">
                      <span className="line-clamp-2 break-words">{row.provider}</span>
                    </TableCell>
                    <TableCell className="min-w-0 px-2 py-2.5">
                      <span
                        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F7F7F7] text-xs font-semibold text-[#515F6B]"
                        aria-label={`Recipient ${row.recipient}`}
                      >
                        {row.recipient}
                      </span>
                    </TableCell>
                    <TableCell className="min-w-0 px-2 py-2.5">
                      <span className="inline-flex max-w-full items-center truncate rounded-full bg-[#F7F7F7] px-2 py-0.5 text-xs font-medium text-[#515F6B]">
                        {row.category}
                      </span>
                    </TableCell>
                    <TableCell className="min-w-0 px-2 py-2.5 text-sm text-muted-foreground">
                      {row.attachments ? (
                        <span className="inline-flex min-w-0 max-w-full items-center gap-1.5 truncate">
                          <Paperclip className="h-3.5 w-3.5 shrink-0 text-current" aria-hidden />
                          <span className="min-w-0 truncate">{row.attachments}</span>
                        </span>
                      ) : (
                        <span className="text-muted-foreground/50">—</span>
                      )}
                    </TableCell>
                    <TableCell className="min-w-0 px-2 py-2.5 text-right text-sm font-semibold tabular-nums text-foreground">
                      {row.amount}
                    </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination — border inset to match table padding, not full card width */}
          <div className="px-6 pb-4 pt-0">
            <div className="flex items-center justify-center border-t border-border pt-4">
              <div className="flex w-fit flex-col gap-0 sm:flex-row sm:items-center sm:justify-start sm:gap-[4px]">
                <Pagination className="flex w-fit items-center justify-start">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        className="gap-0 px-2"
                        onClick={(e) => {
                          e.preventDefault()
                          setCurrentPage(1)
                        }}
                        aria-disabled={effectivePage <= 1}
                        aria-label="First page"
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }}
                      />
                    </PaginationItem>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((p) => (
                      <PaginationItem key={p}>
                        <PaginationLink
                          href="#"
                          isActive={p === effectivePage}
                          onClick={(e) => {
                            e.preventDefault()
                            setCurrentPage(p)
                          }}
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }}
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        className="gap-0 px-2"
                        onClick={(e) => {
                          e.preventDefault()
                          setCurrentPage(totalPages)
                        }}
                        aria-disabled={effectivePage >= totalPages}
                        aria-label="Last page"
                      >
                        <ChevronsRight className="h-4 w-4" />
                      </PaginationLink>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
                <div className="flex shrink-0 items-center">
                  <Select
                    value={String(rowsPerPage)}
                    onValueChange={(value) => {
                      setRowsPerPage(Number(value))
                      setCurrentPage(1)
                    }}
                  >
                    <SelectTrigger className="h-8 w-[70px]" aria-label="Select rows per page">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Organizer */}
      <Card {...CLAIMS_SPARK_CARD_PROPS}>
        <CardContent className="p-0">
          {/* Section header */}
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-xl font-semibold text-foreground">Document Organizer</h2>
            <Button type="button" intent="primary" variant="outline" size="md" asChild>
              <Link to="/document-org">See All Documents</Link>
            </Button>
          </div>

          {/* Document grid */}
          <div className="grid grid-cols-1 gap-4 px-6 pb-6 pt-0 sm:grid-cols-2 lg:grid-cols-4">
            {/* Upload card */}
            <div className="flex min-h-[220px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/20 px-6 py-8 text-center">
              <Upload className="mb-3 h-6 w-6 text-muted-foreground" aria-hidden />
              <p className="text-sm font-semibold text-foreground">Upload Files</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Supported formats: PDF, JPG, PNG (Max 10MB per file)
              </p>
              <Button
                type="button"
                intent="primary"
                variant="outline"
                size="sm"
                className="mt-5"
              >
                Choose File
              </Button>
            </div>

            {/* Document preview cards */}
            {DOCUMENT_CARDS.map((doc) => (
              <div
                key={doc.id}
                className="group relative overflow-hidden rounded-[8px] border border-[#d1d6d8] bg-white transition-shadow hover:shadow-md"
              >
                {/* Clickable thumbnail */}
                <button
                  type="button"
                  aria-label={`Preview ${doc.title}`}
                  onClick={() => setPreviewDoc(doc)}
                  className="relative h-[153px] w-full rounded-t-[8px] bg-[#d9d9d9] block cursor-pointer overflow-hidden ring-[3px] ring-inset ring-[#f8f9fe] focus-visible:outline-none focus-visible:ring-wex-input-focus-ring"
                >
                  {doc.imageUrl && (
                    <img src={doc.imageUrl} alt={doc.title} className="h-full w-full object-cover" />
                  )}
                  {doc.status === "attached" ? (
                    <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-[#dcfce7] px-[7px] py-[3.5px] text-[12px] font-bold text-[#008375]">
                      <Check className="h-[10.5px] w-[10.5px] shrink-0 text-current" aria-hidden />
                      Attached
                    </span>
                  ) : (
                    <span className="absolute bottom-2 right-2 inline-flex items-center rounded-full bg-[#f7f7f7] px-[7px] py-[3.5px] text-[12px] font-bold text-[#515f6b]">
                      Unattached
                    </span>
                  )}
                </button>

                {/* Footer — title + three-dots menu */}
                <div className="space-y-1.5 bg-[#f8f9fe] p-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewDoc(doc)}
                      className="flex-1 truncate text-left text-sm font-semibold leading-5 text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wex-input-focus-ring"
                    >
                      {doc.title}
                    </button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          aria-label={`More options for ${doc.title}`}
                          className="shrink-0 rounded p-0.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wex-input-focus-ring"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        {doc.status === "attached" ? (
                          <DropdownMenuItem className="gap-2">
                            <ClipboardList className="h-4 w-4 shrink-0 text-muted-foreground" />
                            Edit Claim
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="gap-2">
                            <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                            File Claim
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2">
                          <Download className="h-4 w-4 shrink-0 text-muted-foreground" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Pencil className="h-4 w-4 shrink-0 text-muted-foreground" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Info className="h-4 w-4 shrink-0 text-muted-foreground" />
                          See Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
                          <Trash2 className="h-4 w-4 shrink-0 text-current" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <p className="text-xs leading-4 text-[#7c858e]">{doc.date} — 3mb</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <ClaimExpenseDetailSheet
        key={selectedClaimRow?.id ?? "closed"}
        open={selectedClaimRow !== null}
        onOpenChange={(next) => {
          if (!next) setSelectedClaimRow(null)
        }}
        row={selectedClaimRow}
      />

      <FilePreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />
    </div>
  )
}

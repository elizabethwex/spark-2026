import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Input,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@wexinc-healthbenefits/ben-ui-kit"
import { cn } from "@/lib/utils"
import {
  AlertTriangle,
  ArrowUpDown,
  Check,
  Clock,
  CreditCard,
  Paperclip,
  Search,
  Upload,
} from "lucide-react"

const ACTION_ITEMS = [
  {
    id: "doc-needed",
    alertTitle: "Document Needed",
    alertDescription: "Documentation is required to complete transaction.",
    deadlineLabel: "28 Days Remaining",
    provider: "Bigtown Dentistry",
    dateLine: "Jan 12, 2026",
    account: "Healthcare FSA",
    amount: "$210.00",
    primaryAction: { label: "Upload Document", icon: "upload" as const },
    secondaryAction: { label: "View Denial Details" },
  },
  {
    id: "repayment",
    alertTitle: "Repayment Due",
    alertDescription:
      "This expense is not eligible for reimbursement under a Dependent Care FSA.",
    deadlineLabel: "14 Days Remaining",
    provider: "Buddy's Overnight Camp",
    dateLine: "Feb 13-14, 2026",
    account: "Dependent Care FSA",
    amount: "$180.00",
    primaryAction: { label: "Repay Expense", icon: "card" as const },
    secondaryAction: { label: "View Denial Details" },
  },
] as const

type ExpenseRow = {
  id: string
  dateOfService: string
  status: { label: string; tone: "blue" | "sky" | "green" | "orange" | "amber" | "red" | "gray"; icon?: boolean }
  account: string
  provider: string
  recipient: string
  category: string
  attachments: string | null
  amount: string
}

const EXPENSE_ROWS: ExpenseRow[] = [
  {
    id: "1",
    dateOfService: "Feb 14, 2026",
    status: { label: "Payment Processing", tone: "blue" },
    account: "Healthcare FSA",
    provider: "Dr. John Doe",
    recipient: "ES",
    category: "Medical",
    attachments: "2 Documents",
    amount: "$150.00",
  },
  {
    id: "2",
    dateOfService: "Feb 14, 2026",
    status: { label: "Document Review", tone: "sky" },
    account: "Healthcare FSA",
    provider: "Dr. John Doe",
    recipient: "ES",
    category: "Medical",
    attachments: "2 Documents",
    amount: "$60.00",
  },
  {
    id: "3",
    dateOfService: "Feb 14, 2026",
    status: { label: "Approved", tone: "green" },
    account: "Healthcare FSA",
    provider: "Dr. John Doe",
    recipient: "ES",
    category: "Medical",
    attachments: "2 Documents",
    amount: "$88.00",
  },
  {
    id: "4",
    dateOfService: "Feb 14, 2026",
    status: { label: "Denied", tone: "orange" },
    account: "Healthcare FSA",
    provider: "Walgreens",
    recipient: "ES",
    category: "Prescription",
    attachments: "2 Documents",
    amount: "$16.00",
  },
  {
    id: "5",
    dateOfService: "Feb 13-14, 2026",
    status: { label: "Repayment Due", tone: "red", icon: true },
    account: "Dependent Care F...",
    provider: "Buddy's Overnight...",
    recipient: "JS",
    category: "Dependent Care",
    attachments: "1 Document",
    amount: "$210.00",
  },
  {
    id: "6",
    dateOfService: "Feb 14, 2026",
    status: { label: "Hold", tone: "amber" },
    account: "Healthcare FSA",
    provider: "Pharmacy",
    recipient: "JS",
    category: "Prescription",
    attachments: "2 Documents",
    amount: "$150.00",
  },
  {
    id: "7",
    dateOfService: "Feb 14, 2026",
    status: { label: "Paid", tone: "green" },
    account: "Healthcare FSA",
    provider: "Dr. John Doe",
    recipient: "JS",
    category: "Medical",
    attachments: "2 Documents",
    amount: "$45.00",
  },
  {
    id: "8",
    dateOfService: "Jan 12, 2025",
    status: { label: "Document Needed", tone: "red", icon: true },
    account: "Healthcare FSA",
    provider: "Bigtown Dentistry",
    recipient: "ES",
    category: "Dental",
    attachments: null,
    amount: "$85.00",
  },
  {
    id: "9",
    dateOfService: "Nov 11, 2025",
    status: { label: "Not Submitted", tone: "gray" },
    account: "Healthcare FSA",
    provider: "Target Optical",
    recipient: "ES",
    category: "Vision",
    attachments: "1 Document",
    amount: "$150.00",
  },
  {
    id: "10",
    dateOfService: "Sept 22, 2025",
    status: { label: "Paid", tone: "green" },
    account: "Healthcare FSA",
    provider: "Pharmacy",
    recipient: "ES",
    category: "Prescription",
    attachments: "2 Documents",
    amount: "$36.00",
  },
]

const DOCUMENT_CARDS = [
  { id: "1", title: "EOB", date: "Dec 12, 2025", tag: "Unattached", attached: false },
  { id: "2", title: "Walgreens", date: "Dec 12, 2025", tag: "Attached", attached: true },
  { id: "3", title: "Bright Smiles Dental", date: "Dec 12, 2025", tag: "Attached", attached: true },
] as const

/** Rows per page — set to 10 so “All Expenses” shows every row on one page. */
const EXPENSE_PAGE_SIZE = 10

type ExpenseFilterId = "all" | "drafts" | "progress" | "complete" | "actionRequired"

/** Maps status label → filter bucket (single source of truth for the button group). */
function getExpenseBucket(statusLabel: string): Exclude<ExpenseFilterId, "all"> {
  switch (statusLabel) {
    case "Not Submitted":
      return "drafts"
    case "Payment Processing":
    case "Document Review":
    case "Hold":
      return "progress"
    case "Approved":
    case "Paid":
    case "Denied":
      return "complete"
    case "Document Needed":
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
  { id: "all", label: "All Expenses" },
  { id: "drafts", label: `Drafts (${EXPENSE_BUCKET_COUNTS.drafts})` },
  { id: "progress", label: `In Progress (${EXPENSE_BUCKET_COUNTS.progress})` },
  { id: "complete", label: `Complete (${EXPENSE_BUCKET_COUNTS.complete})` },
  { id: "actionRequired", label: `Action Required (${EXPENSE_BUCKET_COUNTS.actionRequired})` },
]

function statusBadgeClass(tone: ExpenseRow["status"]["tone"]) {
  switch (tone) {
    case "blue":
      return "bg-blue-100 text-blue-700 border-transparent"
    case "sky":
      return "bg-sky-100 text-sky-700 border-transparent"
    case "green":
      return "bg-green-100 text-green-700 border-transparent"
    case "orange":
      return "bg-orange-100 text-orange-700 border-transparent"
    case "amber":
      return "bg-amber-100 text-amber-700 border-transparent"
    case "red":
      return "bg-red-100 text-red-700 border-transparent"
    default:
      return "bg-gray-100 text-gray-600 border-transparent"
  }
}

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

export function ClaimsPaymentsContent() {
  const [expenseSearch, setExpenseSearch] = useState("")
  const [expenseFilter, setExpenseFilter] = useState<ExpenseFilterId>("all")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredExpenseRows = useMemo(() => {
    return EXPENSE_ROWS.filter((row) => {
      if (expenseFilter !== "all" && getExpenseBucket(row.status.label) !== expenseFilter) {
        return false
      }
      return matchesExpenseSearch(row, expenseSearch)
    })
  }, [expenseFilter, expenseSearch])

  const totalPages = Math.max(1, Math.ceil(filteredExpenseRows.length / EXPENSE_PAGE_SIZE))

  const effectivePage = Math.min(currentPage, totalPages)

  const paginatedExpenseRows = useMemo(() => {
    const start = (effectivePage - 1) * EXPENSE_PAGE_SIZE
    return filteredExpenseRows.slice(start, start + EXPENSE_PAGE_SIZE)
  }, [filteredExpenseRows, effectivePage])

  return (
    <div className="mx-auto w-full max-w-[1376px] space-y-6">

      {/* Page title + primary actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Expenses
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
            <Link to="/reimburse">Reimburse Myself</Link>
          </Button>
        </div>
      </div>

      {/* Action Required */}
      <Card className="overflow-hidden rounded-2xl border-0 shadow-[0_0_1px_0_rgba(18,24,29,0.20),0_4px_8px_-2px_rgba(18,24,29,0.10),0_2px_4px_-2px_rgba(18,24,29,0.06)]">
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
            {ACTION_ITEMS.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden bg-card shadow-[0_0_1px_0_rgba(18,24,29,0.20),0_4px_8px_-2px_rgba(18,24,29,0.10),0_2px_4px_-2px_rgba(18,24,29,0.06)]"
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
                    <div className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-red-300 bg-white px-3 py-1 text-xs font-medium text-red-700">
                      <Clock className="h-3.5 w-3.5" aria-hidden />
                      {item.deadlineLabel}
                    </div>
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
                      <Button type="button" intent="primary" variant="outline" size="sm">
                        {item.primaryAction.icon === "upload" && (
                          <Upload className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                        )}
                        {item.primaryAction.icon === "card" && (
                          <CreditCard className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                        )}
                        {item.primaryAction.label}
                      </Button>
                      <Button type="button" intent="primary" variant="outline" size="sm">
                        {item.secondaryAction.label}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* All Expenses */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {/* Section header */}
          <div className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-foreground">All Expenses</h2>
            <div className="w-full max-w-[240px]">
              <Input
                inputSize="md"
                type="search"
                placeholder="Find an expense..."
                leftIcon={<Search className="h-4 w-4" />}
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
            <ButtonGroup
              aria-label="Filter expenses"
              className="inline-flex rounded-md bg-muted/50 p-0.5"
            >
              {EXPENSE_FILTER_OPTIONS.map(({ id, label }) => {
                const isActive = expenseFilter === id
                return (
                  <Button
                    key={id}
                    type="button"
                    intent="primary"
                    variant={isActive ? "solid" : "outline"}
                    size="sm"
                    className="h-8 rounded px-4 text-sm shadow-none"
                    aria-pressed={isActive}
                    onClick={() => {
                      setExpenseFilter(id)
                      setCurrentPage(1)
                    }}
                  >
                    {label}
                  </Button>
                )
              })}
            </ButtonGroup>
          </div>

          {/* Table — padding on wrapper (not margin on table) avoids overflow; table-fixed + colgroup fits desktop width */}
          <div className="min-w-0 px-6">
            <Table className="table-fixed">
              <colgroup>
                <col className="w-[12%]" />
                <col className="w-[16%]" />
                <col className="w-[11%]" />
                <col className="w-[18%]" />
                <col className="w-[7%]" />
                <col className="w-[11%]" />
                <col className="w-[13%]" />
                <col className="w-[12%]" />
              </colgroup>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-y border-border bg-muted/30">
                  <TableHead className="h-10 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <button type="button" className="inline-flex max-w-full items-center gap-1 truncate">
                      Date of Service
                      <ArrowUpDown className="h-3 w-3 shrink-0 opacity-60" aria-hidden />
                    </button>
                  </TableHead>
                  <TableHead className="h-10 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <button type="button" className="inline-flex max-w-full items-center gap-1 truncate">
                      Status
                      <ArrowUpDown className="h-3 w-3 shrink-0 opacity-60" aria-hidden />
                    </button>
                  </TableHead>
                  <TableHead className="h-10 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <button type="button" className="inline-flex max-w-full items-center gap-1 truncate">
                      Account
                      <ArrowUpDown className="h-3 w-3 shrink-0 opacity-60" aria-hidden />
                    </button>
                  </TableHead>
                  <TableHead className="h-10 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <button type="button" className="inline-flex max-w-full items-center gap-1 truncate">
                      Provider/Service
                      <ArrowUpDown className="h-3 w-3 shrink-0 opacity-60" aria-hidden />
                    </button>
                  </TableHead>
                  <TableHead className="h-10 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <button type="button" className="inline-flex max-w-full items-center gap-1 truncate">
                      Recipient
                      <ArrowUpDown className="h-3 w-3 shrink-0 opacity-60" aria-hidden />
                    </button>
                  </TableHead>
                  <TableHead className="h-10 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <button type="button" className="inline-flex max-w-full items-center gap-1 truncate">
                      Category
                      <ArrowUpDown className="h-3 w-3 shrink-0 opacity-60" aria-hidden />
                    </button>
                  </TableHead>
                  <TableHead className="h-10 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <button type="button" className="inline-flex max-w-full items-center gap-1 truncate">
                      Attachments
                      <ArrowUpDown className="h-3 w-3 shrink-0 opacity-60" aria-hidden />
                    </button>
                  </TableHead>
                  <TableHead className="h-10 px-2 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <button type="button" className="inline-flex w-full max-w-full items-center justify-end gap-1 truncate">
                      Amount
                      <ArrowUpDown className="h-3 w-3 shrink-0 opacity-60" aria-hidden />
                    </button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedExpenseRows.length === 0 ? (
                  <TableRow className="border-b border-border/60">
                    <TableCell
                      colSpan={8}
                      className="py-10 text-center text-sm text-muted-foreground"
                    >
                      No expenses match this filter
                      {expenseSearch.trim() ? " and search" : ""}.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedExpenseRows.map((row) => (
                    <TableRow key={row.id} className="cursor-pointer hover:bg-muted/30 border-b border-border/60">
                    <TableCell className="min-w-0 px-2 py-2.5 text-sm text-foreground">
                      <span className="line-clamp-2 break-words">{row.dateOfService}</span>
                    </TableCell>
                    <TableCell className="min-w-0 px-2 py-2.5">
                      <span
                        className={cn(
                          "inline-flex max-w-full items-center gap-1 truncate rounded-full px-2 py-0.5 text-xs font-medium",
                          statusBadgeClass(row.status.tone)
                        )}
                      >
                        {row.status.icon && <AlertTriangle className="h-3 w-3 shrink-0" aria-hidden />}
                        <span className="min-w-0 truncate">{row.status.label}</span>
                      </span>
                    </TableCell>
                    <TableCell className="min-w-0 px-2 py-2.5 text-sm text-foreground">
                      <span className="line-clamp-2 break-words">{row.account}</span>
                    </TableCell>
                    <TableCell className="min-w-0 px-2 py-2.5 text-sm text-foreground">
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
                          <Paperclip className="h-3.5 w-3.5 shrink-0" aria-hidden />
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

          {/* Pagination */}
          <div className="flex items-center justify-center border-t border-border px-6 py-4">
            <Pagination className="mx-0 w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage((p) => Math.max(1, p - 1))
                    }}
                    className={cn(effectivePage === 1 && "pointer-events-none opacity-40")}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
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
                    className={cn(effectivePage === totalPages && "pointer-events-none opacity-40")}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      {/* Document Organizer */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {/* Section header */}
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-xl font-semibold text-foreground">Document Organizer</h2>
            <Button type="button" intent="primary" variant="outline" size="md">
              See All Documents
            </Button>
          </div>

          {/* Document grid */}
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
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
                className="overflow-hidden rounded-lg border border-border bg-card"
              >
                <div className="h-[153px] w-full bg-muted/60" />
                <div className="space-y-2 p-4">
                  <p className="text-sm font-semibold text-foreground">{doc.title}</p>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">{doc.date}</span>
                    {doc.attached ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                        <Check className="h-3 w-3" aria-hidden />
                        {doc.tag}
                      </span>
                    ) : (
                      <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                        {doc.tag}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

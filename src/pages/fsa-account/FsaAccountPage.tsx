import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  Input,
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@wexinc-healthbenefits/ben-ui-kit";
import {
  ArrowDown,
  Banknote,
  CalendarDays,
  CircleCheck,
  CircleDollarSign,
  CircleSlash2,
  CircleX,
  Clock,
  DollarSign,
  Download,
  Info,
  Landmark,
  ReceiptText,
  Search,
  ShoppingBag,
  UserRound,
  WalletCards,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { ConsumerNavigation } from "@/components/layout/ConsumerNavigation";
import { ConsumerFooter } from "@/components/layout/Footer";
import { FadeInItem } from "@/components/layout/PageFadeIn";
import { MobileAppBanner } from "@/components/sections/MobileAppBanner";
import { consumerPageBackgroundStyle } from "@/constants/consumerPageBackground";
import { usePrototype } from "@/context/PrototypeContext";
import { useReimburseWorkspace } from "@/context/ReimburseWorkspaceContext";
import { cn, homepageAccountSurfaceClass } from "@/lib/utils";
import { fsaTransactionsData, type FsaTransactionRow } from "./fsaTransactionsMock";

const ELEV_SHADOW =
  "shadow-[0px_3.017px_9.051px_0px_rgba(43,49,78,0.04),0px_6.034px_18.101px_0px_rgba(43,49,78,0.06)]";

function SectionCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/60 bg-white p-6 text-[#14182c]",
        ELEV_SHADOW,
        className
      )}
    >
      {children}
    </div>
  );
}

function InfoTip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="inline-flex text-[#5f6a94] hover:text-[#14182c] focus-visible:outline focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={label}
        >
          <Info className="h-4 w-4" aria-hidden />
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" className="max-w-[220px] text-left text-sm">
        {children}
      </TooltipContent>
    </Tooltip>
  );
}

/**
 * Flexible Spending Account dashboard for /account-overview?account=fsa
 * (Consumer Experience Redesign — Figma node 29515:8367).
 */
export default function FsaAccountPage() {
  const { homepageMode } = usePrototype();
  const cardSurface = homepageAccountSurfaceClass(homepageMode === "partner-safe");
  const { openReimburseWorkspace } = useReimburseWorkspace();

  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return fsaTransactionsData;
    const q = searchQuery.toLowerCase();
    return fsaTransactionsData.filter(
      (t) =>
        t.date.toLowerCase().includes(q) ||
        t.status.toLowerCase().includes(q) ||
        t.account.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.amount.toLowerCase().includes(q) ||
        t.runningBalance.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const start = (currentPage - 1) * rowsPerPage;
  const pageRows = filtered.slice(start, start + rowsPerPage);

  return (
    <div className="min-h-screen" style={consumerPageBackgroundStyle}>
      <ConsumerNavigation />

      <FadeInItem>
        <main className="mx-auto w-full max-w-[1440px] space-y-6 px-8 py-7">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Flexible Spending Account
          </h1>

          {/* Account overview */}
          <div
            className={cn(
              "rounded-2xl border border-white/60 bg-white p-6",
              ELEV_SHADOW,
              cardSurface
            )}
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-12">
              {/* Left: available balance */}
              <div className="min-w-0 flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef2ff] text-[#3958c3]">
                    <Landmark className="h-5 w-5" aria-hidden />
                  </div>
                  <h2 className="text-[20px] font-bold leading-8 text-[#14182c] md:text-2xl">
                    Account Overview
                  </h2>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-[#5f6a94]">
                    <span className="text-base font-semibold">Available Balance</span>
                    <InfoTip label="About available balance">
                      Your available balance reflects the funds available for payment requests made at
                      this time.
                    </InfoTip>
                  </div>
                  <p className="mt-1 text-[40px] font-bold leading-[56px] tracking-tight text-[#14182c]">
                    $2,225.00
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="relative h-5 min-w-[200px] flex-1 overflow-hidden rounded-full bg-[#edeff0]">
                    <div
                      className="absolute left-0 top-0 h-full rounded-l-full bg-[#3958c3]"
                      style={{ width: "11%" }}
                    />
                    <div
                      className="absolute top-0 h-full w-px bg-[#a0dcf8]"
                      style={{ left: "11%" }}
                    />
                  </div>
                  <Badge
                    intent="secondary"
                    className="shrink-0 rounded-2xl bg-[#f7f7f7] px-2 py-1 text-xs font-bold text-[#515f6b]"
                  >
                    11% of $2,500 used
                  </Badge>
                </div>

                <div className="rounded-xl bg-white p-4 shadow-[0px_0px_1px_0px_rgba(18,24,29,0.2),0px_1px_3px_0px_rgba(18,24,29,0.1),0px_1px_2px_0px_rgba(18,24,29,0.06)]">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-4 text-base">
                      <div className="flex min-w-0 items-center gap-3 text-[#5f6a94]">
                        <CalendarDays className="h-4 w-4 shrink-0" aria-hidden />
                        <span className="font-medium">Plan Year</span>
                      </div>
                      <span className="shrink-0 font-semibold text-[#14182c]">
                        Jan 1, 2026 – Dec 31, 2026
                      </span>
                    </div>
                    <div className="h-px w-full bg-[#b7c0da]" />
                    <div className="flex items-center justify-between gap-4 text-base">
                      <div className="flex min-w-0 items-center gap-3 text-[#5f6a94]">
                        <CircleDollarSign className="h-4 w-4 shrink-0" aria-hidden />
                        <span className="font-medium">Eligible Amount</span>
                      </div>
                      <span className="shrink-0 font-semibold text-[#14182c]">$2,500.00</span>
                    </div>
                    <div className="h-px w-full bg-[#b7c0da]" />
                    <div className="flex items-center justify-between gap-4 text-base">
                      <div className="flex min-w-0 items-center gap-2 text-[#5f6a94]">
                        <DollarSign className="h-4 w-4 shrink-0" aria-hidden />
                        <span className="font-medium">Plan Year Balance</span>
                        <InfoTip label="About plan year balance">
                          Your plan year balance reflects the total funds currently available for
                          payment based on your contributions to date.
                        </InfoTip>
                      </div>
                      <span className="shrink-0 font-semibold text-[#14182c]">$2,225.00</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-0 border-t border-[#b7c0da]">
                  <div className="flex items-center justify-between border-b border-[#b7c0da] py-3 text-sm">
                    <span className="text-[#5f6a94]">Rollover Amount</span>
                    <span className="font-semibold text-[#14182c]">$0.00</span>
                  </div>
                  <div className="flex items-center justify-between py-3 text-sm">
                    <span className="text-[#5f6a94]">Use It or Lose It</span>
                    <span className="font-semibold text-[#14182c]">$2,225.00</span>
                  </div>
                </div>

                <Button
                  type="button"
                  className="h-10 w-full bg-[#3958c3] font-medium text-white hover:bg-[#3958c3]/90"
                  onClick={() => openReimburseWorkspace()}
                >
                  Reimburse Myself
                </Button>
              </div>

              {/* Right: ready to use */}
              <div className="min-w-0 flex-1 rounded-lg bg-[#f1f3fb] p-6 shadow-[0px_0px_1px_0px_rgba(18,24,29,0.2),0px_1px_3px_0px_rgba(18,24,29,0.1),0px_1px_2px_0px_rgba(18,24,29,0.06)]">
                <div className="space-y-1">
                  <p className="text-2xl font-bold tracking-tight text-[#14182c]">
                    $2,225.00 ready to use
                  </p>
                  <p className="text-sm leading-6 text-[#5f6a94]">
                    Use your funds for eligible services through{" "}
                    <strong className="font-bold text-[#14182c]">Mar 15, 2027</strong>
                  </p>
                  <p className="text-sm leading-6 text-[#5f6a94]">
                    Submit claims by{" "}
                    <strong className="font-bold text-[#14182c]">Mar 31, 2027</strong>
                  </p>
                </div>

                <div className="my-6 h-px w-full bg-[#b7c0da]" />

                <div className="space-y-4">
                  <h3 className="text-[19px] font-semibold leading-8 text-[#14182c]">
                    Ways to use your funds
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-6 rounded-3xl border border-[#f8f9fe] bg-[#f8f9fe] p-[17px]">
                      <div className="flex gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#e2e8f0] bg-white shadow-sm">
                          <ReceiptText className="h-6 w-6 text-[#3958c3]" aria-hidden />
                        </div>
                        <div className="min-w-0 space-y-1">
                          <p className="text-sm font-bold text-[#14182c]">Request Reimbursement</p>
                          <p className="text-xs font-medium leading-5 text-[#5f6a94]">
                            Get reimbursed for eligible expenses you&apos;ve already paid
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        className="h-10 w-full rounded-xl border-0 bg-gradient-to-br from-[#25146f] to-[#c8102e] font-medium text-white hover:opacity-95"
                        onClick={() => openReimburseWorkspace()}
                      >
                        Reimburse Myself
                      </Button>
                    </div>
                    <div className="flex flex-col gap-6 rounded-3xl border border-[#f8f9fe] bg-[#f8f9fe] p-[17px]">
                      <div className="flex gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#e2e8f0] bg-white shadow-sm">
                          <ShoppingBag className="h-5 w-5 text-[#3958c3]" aria-hidden />
                        </div>
                        <div className="min-w-0 space-y-1">
                          <p className="text-sm font-bold text-[#14182c]">Shop FSA Store</p>
                          <p className="text-xs font-medium leading-5 text-[#5f6a94]">
                            Browse eligible products
                          </p>
                          <p className="text-xs font-medium leading-5 text-[#5f6a94]">
                            Use your FSA funds easily
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-10 w-full rounded-xl border-primary text-primary hover:bg-primary/10"
                      >
                        Shop now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Claim summary + Elections */}
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard>
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef2ff] text-[#3958c3]">
                    <ReceiptText className="h-5 w-5" aria-hidden />
                  </div>
                  <h2 className="text-[20px] font-bold leading-8 text-[#14182c] md:text-2xl">
                    Claim Summary
                  </h2>
                </div>
                <div>
                  <p className="text-sm text-[#5f6a94]">Paid</p>
                  <p className="text-2xl font-semibold tracking-tight text-[#14182c]">$275.00</p>
                </div>
                <ClaimRows />
              </div>
            </SectionCard>

            <SectionCard>
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef2ff] text-[#3958c3]">
                    <WalletCards className="h-5 w-5" aria-hidden />
                  </div>
                  <h2 className="text-[20px] font-bold leading-8 text-[#14182c] md:text-2xl">
                    Elections
                  </h2>
                </div>
                <div>
                  <p className="text-sm text-[#5f6a94]">Election Amount</p>
                  <p className="text-2xl font-semibold tracking-tight text-[#14182c]">$2,500.00</p>
                </div>
                <ElectionRows />
              </div>
            </SectionCard>
          </div>

          {/* Transactions */}
          <Card className={cn(cardSurface, "rounded-2xl")} style={{ borderRadius: "16px" }}>
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex flex-wrap items-center gap-4">
                  <h2 className="text-2xl font-semibold text-[#14182c]">Transactions</h2>
                  <Badge
                    intent="warning"
                    className="rounded-md bg-[#fff9e6] px-2 py-1 text-xs font-bold text-[#4a3500]"
                  >
                    1 needs action
                  </Badge>
                </div>
                <div className="flex w-full flex-col gap-3 sm:max-w-none sm:flex-row sm:items-center lg:w-auto">
                  <div className="w-full min-w-[200px] sm:w-[330px]">
                    <Input
                      inputSize="md"
                      type="search"
                      placeholder="Search"
                      leftIcon={<Search className="h-4 w-4" />}
                      value={searchQuery}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="md"
                    type="button"
                    className="shrink-0 text-[#5f6a94] hover:text-[#14182c]"
                  >
                    <Download className="mr-2 h-4 w-4" aria-hidden />
                    Export
                  </Button>
                </div>
              </div>

              <div className="mt-6 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <div className="flex items-center gap-1 whitespace-nowrap">
                          Date
                          <ArrowDown className="h-3 w-3" aria-hidden />
                        </div>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Account</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          Amount
                          <ArrowDown className="h-3 w-3" aria-hidden />
                        </div>
                      </TableHead>
                      <TableHead className="text-right">Running Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pageRows.map((t) => (
                      <FsaTransactionTableRow key={t.id} row={t} />
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Pagination className="mx-auto w-fit">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        className="gap-0 px-2"
                        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                          e.preventDefault();
                          setCurrentPage(1);
                        }}
                        aria-disabled={currentPage <= 1}
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                          e.preventDefault();
                          setCurrentPage((p) => Math.max(1, p - 1));
                        }}
                      />
                    </PaginationItem>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            href="#"
                            isActive={currentPage === pageNum}
                            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                              e.preventDefault();
                              setCurrentPage(pageNum);
                            }}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                          e.preventDefault();
                          setCurrentPage((p) => Math.min(totalPages, p + 1));
                        }}
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        className="gap-0 px-2"
                        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                          e.preventDefault();
                          setCurrentPage(totalPages);
                        }}
                        aria-disabled={currentPage >= totalPages}
                      >
                        <ChevronsRight className="h-4 w-4" />
                      </PaginationLink>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
                <Select
                  value={String(rowsPerPage)}
                  onValueChange={(value) => {
                    setRowsPerPage(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px]" aria-label="Rows per page">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Plan rules + Previous plan year */}
          <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
            <SectionCard>
              <h2 className="text-[20px] font-bold leading-8 text-[#14182c]">Plan Rules</h2>
              <div className="mt-6 space-y-8">
                <div>
                  <h3 className="text-[20px] font-semibold leading-8 text-[#14182c]">
                    Claim Deadlines
                  </h3>
                  <div className="mt-4 rounded-xl bg-[#f8f9fe] p-4">
                    <div className="flex gap-3">
                      <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#5f6a94]" aria-hidden />
                      <p className="text-sm font-medium leading-5 text-[#5f6a94]">
                        Submit claims by <strong className="font-bold text-[#14182c]">Mar 31, 2027.</strong>{" "}
                        Based on your <strong className="font-bold text-[#14182c]">Active</strong> employment
                        status, only services received on or before{" "}
                        <strong className="font-bold text-[#14182c]">Mar 15, 2027</strong> are eligible for
                        reimbursement.
                      </p>
                    </div>
                  </div>
                  <PlanDeadlineRows />
                </div>
                <div>
                  <h3 className="text-[20px] font-semibold leading-8 text-[#14182c]">
                    Debit Card Rules
                  </h3>
                  <div className="mt-4 space-y-0">
                    <div className="flex items-center justify-between border-b border-[#b7c0da] py-3 text-sm">
                      <span className="text-[#5f6a94]">Card Transactions</span>
                      <span className="font-medium text-[#14182c]">Allowed</span>
                    </div>
                    <div className="flex items-center justify-between py-3 text-sm">
                      <span className="text-[#5f6a94]">Maximum per Transaction</span>
                      <span className="font-medium text-[#14182c]">No maximum</span>
                    </div>
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-[20px] font-bold leading-8 text-[#14182c]">Previous Plan Year</h2>
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <span className="text-sm text-[#5f6a94]">Plan Period:</span>
                  <Select defaultValue="2025">
                    <SelectTrigger className="h-14 w-[min(100%,280px)] min-w-[200px] sm:w-[230px]">
                      <SelectValue placeholder="Plan period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025">Jan 1, 2025 – Dec 31, 2025</SelectItem>
                      <SelectItem value="2024">Jan 1, 2024 – Dec 31, 2024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-6 space-y-6 rounded-xl border border-[#e8ecf7] p-6">
                <div>
                  <p className="text-sm text-[#5f6a94]">Total Used</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="text-[40px] font-bold leading-none text-[#14182c]">$2,500.00</span>
                    <Badge
                      intent="secondary"
                      className="rounded-md bg-[#eef2ff] px-2 py-0.5 text-xs font-bold text-[#3958c3]"
                    >
                      100%
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div>
                    <p className="text-sm text-[#5f6a94]">Elected</p>
                    <p className="text-base font-semibold text-[#14182c]">$2,500.00</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#5f6a94]">Unused/Forfeited</p>
                    <p className="text-base font-semibold text-[#14182c]">$0.00</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#5f6a94]">Rolled Over</p>
                    <p className="text-base font-semibold text-[#14182c]">$0.00</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#5f6a94]">Denied Claims</p>
                    <p className="text-base font-semibold text-[#14182c]">$0.00</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <h3 className="text-[20px] font-semibold leading-8 text-[#14182c]">Summary</h3>
                <div className="rounded-xl bg-[rgba(57,88,195,0.05)] p-4">
                  <ul className="space-y-2 text-sm text-[#14182c]">
                    <li className="flex gap-2">
                      <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" aria-hidden />
                      <span>
                        You <strong className="font-bold">used 100%</strong> of your total FSA funds
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" aria-hidden />
                      <span>
                        You <strong className="font-bold">lost $0.00</strong>
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <CircleSlash2 className="mt-0.5 h-4 w-4 shrink-0 text-[#460809]" aria-hidden />
                      <span>
                        <strong className="font-bold text-[#460809]">0 claims</strong> were denied
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </SectionCard>
          </div>

          <MobileAppBanner />
        </main>
      </FadeInItem>

      <ConsumerFooter />
    </div>
  );
}

function ClaimRows() {
  return (
    <div className="space-y-0">
      <div className="relative flex items-center justify-between border-b border-[#b7c0da] py-3 text-sm">
        <div className="flex items-center gap-2 text-[#5f6a94]">
          <CircleCheck className="h-4 w-4 text-[#3958c3]" aria-hidden />
          <span>Total Submitted</span>
        </div>
        <span className="font-medium text-[#14182c]">$275.00</span>
      </div>
      <div className="relative flex items-center justify-between border-b border-[#b7c0da] py-3 text-sm">
        <div className="flex items-center gap-2 text-[#5f6a94]">
          <Clock className="h-4 w-4 text-[#3958c3]" aria-hidden />
          <span>Total Pending</span>
        </div>
        <span className="font-medium text-[#14182c]">$0.00</span>
      </div>
      <div className="relative flex items-center justify-between py-3 text-sm">
        <div className="flex items-center gap-2 text-[#5f6a94]">
          <CircleX className="h-4 w-4 text-[#3958c3]" aria-hidden />
          <span>Total Denied</span>
        </div>
        <span className="font-medium text-[#14182c]">$60.00</span>
      </div>
    </div>
  );
}

function ElectionRows() {
  return (
    <div className="space-y-0">
      <div className="relative flex items-center justify-between border-b border-[#b7c0da] py-3 text-sm">
        <div className="flex items-center gap-2 text-[#5f6a94]">
          <UserRound className="h-4 w-4" aria-hidden />
          <span>My Contribution to Date</span>
        </div>
        <span className="font-medium text-[#14182c]">$378.80</span>
      </div>
      <div className="relative flex items-center justify-between border-b border-[#b7c0da] py-3 text-sm">
        <div className="flex items-center gap-2 text-[#5f6a94]">
          <Banknote className="h-4 w-4" aria-hidden />
          <span>Estimated Payroll Deduction</span>
        </div>
        <span className="font-medium text-[#14182c]">$75.76</span>
      </div>
      <div className="h-px w-full bg-[#b7c0da]" />
      <div className="relative flex items-center justify-between py-3 text-sm">
        <div className="flex items-center gap-2 text-[#5f6a94]">
          <CalendarDays className="h-4 w-4" aria-hidden />
          <span>Effective Date</span>
        </div>
        <span className="font-medium text-[#14182c]">01/01/2026</span>
      </div>
    </div>
  );
}

function PlanDeadlineRows() {
  return (
    <div className="mt-4 space-y-0">
      <div className="relative flex flex-wrap items-center justify-between gap-2 border-b border-[#b7c0da] py-2 text-sm">
        <div className="flex items-center gap-2 text-[#5f6a94]">
          <span>Current Status</span>
          <InfoTip label="About current status">Your participation status for this plan year.</InfoTip>
        </div>
        <Badge
          intent="success"
          className="gap-1 rounded-md bg-[#ecfdf5] px-2 py-1 text-xs font-bold text-[#002c22]"
        >
          <CircleCheck className="h-3.5 w-3.5" aria-hidden />
          Active
        </Badge>
      </div>
      <div className="relative flex items-center justify-between gap-2 border-b border-[#b7c0da] py-2 text-sm">
        <div className="flex items-center gap-2 text-[#5f6a94]">
          <span>Status Effective Date</span>
          <InfoTip label="Status effective date">The date your current status took effect.</InfoTip>
        </div>
        <span className="font-medium text-[#14182c]">10/15/2024</span>
      </div>
      <div className="relative flex items-center justify-between gap-2 border-b border-[#b7c0da] py-2 text-sm">
        <div className="flex items-center gap-2 text-[#5f6a94]">
          <span>Final Filing Date</span>
          <InfoTip label="Final filing date">Last day to submit claims for this plan.</InfoTip>
        </div>
        <span className="font-medium text-[#14182c]">03/15/2027</span>
      </div>
      <div className="relative flex items-center justify-between gap-2 py-2 text-sm">
        <div className="flex items-center gap-2 text-[#5f6a94]">
          <span>Final Service Date</span>
          <InfoTip label="Final service date">Last date services can be received for reimbursement.</InfoTip>
        </div>
        <span className="font-medium text-[#14182c]">03/15/2027</span>
      </div>
    </div>
  );
}

function FsaTransactionTableRow({ row }: { row: FsaTransactionRow }) {
  return (
    <TableRow>
      <TableCell className="whitespace-nowrap">{row.date}</TableCell>
      <TableCell>
        <Badge
          intent={row.status === "Pending" ? "warning" : "success"}
          className="text-xs"
        >
          {row.status}
        </Badge>
      </TableCell>
      <TableCell>{row.account}</TableCell>
      <TableCell>{row.description}</TableCell>
      <TableCell>{row.category}</TableCell>
      <TableCell
        className={cn(
          "text-right font-medium",
          row.isPositive === false ? "text-destructive" : "text-foreground"
        )}
      >
        {row.amount}
      </TableCell>
      <TableCell className="text-right font-medium">{row.runningBalance}</TableCell>
    </TableRow>
  );
}

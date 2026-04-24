import { useMemo, useState, type KeyboardEvent } from "react";
import { ClaimExpenseDetailSheet } from "@/components/claims/ClaimExpenseDetailSheet";
import {
  expenseStatusBadgeClass,
  expenseStatusBadgeIntent,
  transactionTableStatusTone,
} from "@/components/claims/expenseTypes";
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
} from "@wexinc-healthbenefits/ben-ui-kit";
import { ArrowDown, ChevronsLeft, ChevronsRight, Download, Search } from "lucide-react";
import { usePrototype } from "@/context/PrototypeContext";
import { cn, homepageAccountSurfaceClass } from "@/lib/utils";
import type { Transaction } from "./mockData";
import { hsaTransactionToExpenseRow } from "./hsaTransactionToExpenseRow";

interface HsaRecentTransactionsTableProps {
  transactions: Transaction[];
}

/**
 * Recent transactions for HSA details (Date, Status, Description, Category, Amount — no Account column).
 */
export function HsaRecentTransactionsTable({ transactions }: HsaRecentTransactionsTableProps) {
  const { homepageMode } = usePrototype();
  const cardSurface = homepageAccountSurfaceClass(homepageMode === "partner-safe");
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const filteredTransactions = useMemo(() => {
    if (!searchQuery.trim()) return transactions;
    const q = searchQuery.toLowerCase();
    return transactions.filter(
      (t) =>
        t.date.toLowerCase().includes(q) ||
        t.status.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.amount.toLowerCase().includes(q)
    );
  }, [searchQuery, transactions]);

  const totalItems = filteredTransactions.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginated = filteredTransactions.slice(startIndex, startIndex + rowsPerPage);

  return (
    <>
    <Card className={cn(cardSurface)} style={{ borderRadius: "24px" }}>
      <CardContent className="p-6">
        <div className="flex w-full flex-col items-center space-y-4">
          <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-[20px] font-bold leading-8 text-[#14182c] md:text-2xl">Transactions</h2>
            <div className="flex w-full flex-col gap-3 sm:max-w-none sm:flex-row sm:items-center lg:w-auto">
              <div className="w-full min-w-[200px] sm:w-[330px]">
                <Input
                  inputSize="md"
                  type="text"
                  placeholder="Search"
                  leftIcon={<Search className="h-4 w-4 text-current" />}
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

          <div className="w-full overflow-x-auto">
            <Table className="table-fixed w-full">
              <TableHeader>
                <TableRow className="hover:bg-transparent border-y border-border bg-muted/30">
                  <TableHead className="min-w-0 w-[20%]">
                    <div className="flex items-center gap-1">
                      Date
                      <ArrowDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="min-w-0 w-[20%]">Status</TableHead>
                  <TableHead className="min-w-0 w-[20%]">Description</TableHead>
                  <TableHead className="min-w-0 w-[20%]">Category</TableHead>
                  <TableHead className="min-w-0 w-[20%] text-left">
                    <div className="flex items-center gap-1">
                      Amount
                      <ArrowDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((transaction) => {
                  const statusTone = transactionTableStatusTone(transaction.status);
                  return (
                  <TableRow
                    key={transaction.id}
                    className="h-[49px] cursor-pointer hover:bg-muted/40"
                    role="button"
                    tabIndex={0}
                    aria-label={`View details, ${transaction.description}, ${transaction.date}`}
                    onClick={() => setSelectedTx(transaction)}
                    onKeyDown={(e: KeyboardEvent<HTMLTableRowElement>) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedTx(transaction);
                      }
                    }}
                  >
                    <TableCell className="min-w-0 w-[20%]">{transaction.date}</TableCell>
                    <TableCell className="min-w-0 w-[20%]">
                      <Badge
                        intent={expenseStatusBadgeIntent(statusTone)}
                        size="sm"
                        pill
                        className={cn("max-w-full", expenseStatusBadgeClass(statusTone))}
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="min-w-0 w-[20%]">{transaction.description}</TableCell>
                    <TableCell className="min-w-0 w-[20%]">{transaction.category}</TableCell>
                    <TableCell className="min-w-0 w-[20%] text-left text-sm font-semibold tabular-nums text-[#14182c]">
                      {transaction.amount}
                    </TableCell>
                  </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="flex w-fit flex-col gap-0 sm:flex-row sm:items-center sm:justify-start sm:gap-0">
            <Pagination className="flex w-fit items-center justify-start">
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
                    <ChevronsLeft className="h-4 w-4 text-current" />
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
                    <ChevronsRight className="h-4 w-4 text-current" />
                  </PaginationLink>
                </PaginationItem>
              </PaginationContent>
            </Pagination>

            <div className="flex shrink-0 items-center">
              <Select
                value={String(rowsPerPage)}
                onValueChange={(value) => {
                  setRowsPerPage(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger
                  className="h-8 w-[64px] gap-0"
                  aria-label="Select rows per page"
                >
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
      </CardContent>
    </Card>

    <ClaimExpenseDetailSheet
      key={selectedTx?.id ?? "closed"}
      open={selectedTx !== null}
      onOpenChange={(next) => {
        if (!next) setSelectedTx(null);
      }}
      row={selectedTx ? hsaTransactionToExpenseRow(selectedTx) : null}
      variant="hsa"
    />
    </>
  );
}

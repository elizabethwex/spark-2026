import { useMemo, useState } from "react";
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
import { ArrowDown, ChevronsLeft, ChevronsRight, Search, Upload } from "lucide-react";
import { usePrototype } from "@/context/PrototypeContext";
import { cn, homepageAccountSurfaceClass } from "@/lib/utils";
import type { Transaction } from "./mockData";

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
    <Card className={cn(cardSurface)} style={{ borderRadius: "24px" }}>
      <CardContent className="p-6">
        <div className="flex w-full flex-col items-center space-y-4">
          <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-semibold text-foreground">Transactions</h2>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="w-full min-w-[200px] sm:w-[280px]">
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
                variant="outline"
                size="md"
                className="shrink-0 border-primary text-primary rounded-xl"
                type="button"
              >
                <Upload className="mr-2 h-4 w-4 text-current" aria-hidden />
                Export
              </Button>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-y border-border bg-muted/30">
                  <TableHead>
                    <div className="flex items-center gap-1">
                      Date
                      <ArrowDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      Amount
                      <ArrowDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((transaction) => (
                  <TableRow key={transaction.id} className="h-[49px]">
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>
                      <Badge
                        intent={transaction.status === "Pending" ? "warning" : "success"}
                        className="text-xs"
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>{transaction.category}</TableCell>
                    <TableCell
                      className={`text-right font-medium ${
                        transaction.isPositive ? "text-foreground" : "text-destructive"
                      }`}
                    >
                      {transaction.amount}
                    </TableCell>
                  </TableRow>
                ))}
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
  );
}

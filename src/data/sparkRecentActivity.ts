import type { FsaTransactionRow } from "@/pages/fsa-account/fsaTransactionsMock";
import { fsaTransactionsData } from "@/pages/fsa-account/fsaTransactionsMock";
import { lpfsaTransactionsData } from "@/pages/lpfsa-account/lpfsaTransactionsMock";
import { dcfsaTransactionsData } from "@/pages/dependent-care-fsa/dcfsaTransactionsMock";
import type { Transaction } from "@/pages/hsa-details/mockData";
import { hsaDetailTransactions } from "@/pages/hsa-details/hsaDetailMockData";

export type SparkActivityStatus = "approved" | "needs_attention" | "completed";

export interface SparkActivityRow {
  merchant: string;
  meta: string;
  amount: string;
  status: SparkActivityStatus;
  statusLabel: string;
  timeline?: {
    label: string;
    date?: string;
    completed: boolean;
    active: boolean;
  }[];
}

const RECENT_LIMIT = 5;

function parseUsTimestamp(dateStr: string): number {
  const parts = dateStr.split("/").map((p) => parseInt(p, 10));
  if (parts.length !== 3 || parts.some(Number.isNaN)) return 0;
  const [mm, dd, yyyy] = parts;
  const fullY = yyyy < 100 ? 2000 + yyyy : yyyy;
  return new Date(fullY, mm - 1, dd).getTime();
}

/** "03/01/2026" → "3/1/26" (matches existing Recent Activity meta pattern). */
function toShortMetaDate(mdy: string): string {
  const parts = mdy.split("/").map((p) => parseInt(p, 10));
  if (parts.length !== 3 || parts.some(Number.isNaN)) return mdy;
  const [mm, dd, yyyy] = parts;
  const yy = yyyy < 100 ? yyyy : yyyy % 100;
  return `${mm}/${dd}/${yy}`;
}

function normalizeAmount(amount: string): string {
  return amount.replace(/\s+/g, "").replace(/^-\s*\$/, "-$");
}

function fsaRowToSpark(row: FsaTransactionRow, planTag: string): SparkActivityRow {
  const denied = row.status === "Denied";
  const status: SparkActivityStatus = denied ? "needs_attention" : "completed";
  const statusLabel = denied ? "NEEDS ATTENTION" : "COMPLETED";
  return {
    merchant: row.description,
    meta: `${toShortMetaDate(row.date)} • ${planTag}`,
    amount: normalizeAmount(row.amount),
    status,
    statusLabel,
  };
}

function hsaRowToSpark(row: Transaction): SparkActivityRow {
  const pending = row.status === "Pending";
  return {
    merchant: row.description,
    meta: `${toShortMetaDate(row.date)} • HSA`,
    amount: normalizeAmount(row.amount),
    status: "completed",
    statusLabel: pending ? "PENDING" : "COMPLETED",
  };
}

type TaggedRow = { row: SparkActivityRow; ts: number; tie: number };

function takeRecent(rows: TaggedRow[]): SparkActivityRow[] {
  rows.sort((a, b) => b.ts - a.ts || a.tie - b.tie);
  return rows.slice(0, RECENT_LIMIT).map((r) => r.row);
}

/**
 * Recent Activity rows aligned with account detail transaction mocks:
 * - View 1: `/lpfsa-account` + `/hsa-details`
 * - View 2: `/fsa-account` + `/dependent-care-fsa`
 * - View 3: `/hsa-details` only (HSA-only homepage layout)
 */
export function getSparkRecentActivity(activeView: 1 | 2 | 3): SparkActivityRow[] {
  let tie = 0;

  if (activeView === 1) {
    const tagged: TaggedRow[] = [
      ...lpfsaTransactionsData.map((r) => ({
        row: fsaRowToSpark(r, "Limited Purpose FSA"),
        ts: parseUsTimestamp(r.date),
        tie: tie++,
      })),
      ...hsaDetailTransactions.map((r) => ({
        row: hsaRowToSpark(r),
        ts: parseUsTimestamp(r.date),
        tie: tie++,
      })),
    ];
    return takeRecent(tagged);
  }

  if (activeView === 2) {
    const tagged: TaggedRow[] = [
      ...fsaTransactionsData.map((r) => ({
        row: fsaRowToSpark(r, "Healthcare FSA"),
        ts: parseUsTimestamp(r.date),
        tie: tie++,
      })),
      ...dcfsaTransactionsData.map((r) => ({
        row: fsaRowToSpark(r, "DCFSA"),
        ts: parseUsTimestamp(r.date),
        tie: tie++,
      })),
    ];
    return takeRecent(tagged);
  }

  const tagged = hsaDetailTransactions.map((r) => ({
    row: hsaRowToSpark(r),
    ts: parseUsTimestamp(r.date),
    tie: tie++,
  }));
  return takeRecent(tagged);
}

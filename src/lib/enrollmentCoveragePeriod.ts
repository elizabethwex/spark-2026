export const EFFECTIVE_DATE = "01/01/25";

export function coveragePeriodFromEffectiveDate(effectiveDate: string): string {
  const yy = effectiveDate.slice(-2);
  if (yy.length !== 2) return effectiveDate;
  return `${effectiveDate} - 12/31/${yy}`;
}

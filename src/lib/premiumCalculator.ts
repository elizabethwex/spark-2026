const PAY_PERIODS_PER_YEAR = 26;

export interface PremiumYTDBreakdown {
  totalPaidYTD: number;
  annualProjected: number;
  yourShareYTD: number;
  employerShareYTD: number;
}

export function calculatePayPeriodsSince(submittedAtIso: string): number {
  const submittedDate = new Date(submittedAtIso);
  const currentDate = new Date();
  
  const diffMs = currentDate.getTime() - submittedDate.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  
  const payPeriodsSince = Math.floor(diffDays / 14);
  
  return Math.max(0, payPeriodsSince);
}

export function calculateAnnualProjected(biWeeklyCents: number): number {
  return biWeeklyCents * PAY_PERIODS_PER_YEAR;
}

export function calculateYTD(
  submittedAtIso: string,
  biWeeklyCents: number,
  employerPaysBiWeeklyCents: number
): PremiumYTDBreakdown {
  const payPeriods = calculatePayPeriodsSince(submittedAtIso);
  
  const totalPaidYTD = biWeeklyCents * payPeriods;
  const annualProjected = calculateAnnualProjected(biWeeklyCents);
  const employerShareYTD = employerPaysBiWeeklyCents * payPeriods;
  const yourShareYTD = totalPaidYTD - employerShareYTD;
  
  return {
    totalPaidYTD,
    annualProjected,
    yourShareYTD,
    employerShareYTD,
  };
}

export function formatCentsAsCurrency(cents: number): string {
  const dollars = cents / 100;
  return `$${dollars.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

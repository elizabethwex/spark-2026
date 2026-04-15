/**
 * 2026 HSA contribution mock — shared by /hsa-details and SPARK homepage HSA card.
 */
export const HSA_2026_CONTRIBUTION_MOCK = {
  contributionLimit: 4_400,
  yourContrib: 3_000,
  employerContrib: 400,
  leftToContribute: 1_000,
  planYear: "2026",
} as const;

export function hsa2026ContributionPctUsed(): number {
  const { contributionLimit, yourContrib, employerContrib } = HSA_2026_CONTRIBUTION_MOCK;
  const totalYtd = yourContrib + employerContrib;
  return Math.round((totalYtd / contributionLimit) * 100);
}

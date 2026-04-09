const DEPENDENTS_STORAGE_KEY = "enrollment.dependents.v1";

type StoredDependentsState = {
  version: 1;
  dependents: { id: string; name: string; ageLabel: string }[];
  selectedIds: string[];
  selfOnly: boolean;
};

/**
 * Returns the default enrollees array based on what was selected on the Dependents page.
 */
export function getDefaultEnrolleesFromDependents(): string[] {
  try {
    const raw = localStorage.getItem(DEPENDENTS_STORAGE_KEY);
    if (!raw) return ["myself"];
    const parsed = JSON.parse(raw) as StoredDependentsState;
    if (parsed?.version !== 1) return ["myself"];
    if (parsed.selfOnly) return ["myself"];
    if (!Array.isArray(parsed.selectedIds) || parsed.selectedIds.length === 0) {
      return ["myself"];
    }
    return ["myself", ...parsed.selectedIds];
  } catch {
    return ["myself"];
  }
}

/**
 * Returns enrollees for a step: uses default from dependents when savedEnrollees
 * is missing, empty, or only ["myself"]; otherwise returns savedEnrollees.
 */
export function getEnrolleesForStep(savedEnrollees: string[] | undefined): string[] {
  if (!savedEnrollees?.length) return getDefaultEnrolleesFromDependents();
  if (savedEnrollees.length === 1 && savedEnrollees[0] === "myself") {
    return getDefaultEnrolleesFromDependents();
  }
  return savedEnrollees;
}

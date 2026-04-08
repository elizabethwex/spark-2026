export type Dependent = {
  id: string;
  firstName: string;
  lastName: string;
  birthDate?: string; // yyyy-mm-dd preferred
  ageLabel?: string; // fallback display if birthDate not provided
  relationship?: string;
};

export function computeAge(birthDate: string): number | null {
  const d = new Date(birthDate);
  if (Number.isNaN(d.getTime())) return null;

  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age -= 1;
  return age;
}



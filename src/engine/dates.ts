// All dates stored as ISO strings (YYYY-MM-DD). Simulation uses exact dates.

export function parseDate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}

export function formatDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function todayStr(): string {
  return formatDate(new Date())
}

/** Exact age in fractional years at a given date. */
export function exactAgeAt(birthDate: string, atDate: string): number {
  const birth = parseDate(birthDate)
  const at = parseDate(atDate)
  return (at.getTime() - birth.getTime()) / (365.25 * 86_400_000)
}

/** Integer years (birthday-aware) — use this for tax/benefit eligibility checks. */
export function intAgeAt(birthDate: string, atDate: string): number {
  const birth = parseDate(birthDate)
  const at = parseDate(atDate)
  let age = at.getFullYear() - birth.getFullYear()
  if (
    at.getMonth() < birth.getMonth() ||
    (at.getMonth() === birth.getMonth() && at.getDate() < birth.getDate())
  ) {
    age--
  }
  return age
}

/** ISO date string for the person's Nth birthday. */
export function dateAtAge(birthDate: string, age: number): string {
  const birth = parseDate(birthDate)
  return formatDate(new Date(birth.getFullYear() + age, birth.getMonth(), birth.getDate()))
}

/**
 * ISO date string for the last day of a person's Nth year of life —
 * the day before their (N+1)th birthday.
 * "Plan to age 90" means alive through the entire 90th year, dying this date.
 */
export function deathDate(birthDate: string, planningEndAge: number): string {
  const d = parseDate(dateAtAge(birthDate, planningEndAge + 1))
  d.setDate(d.getDate() - 1)
  return formatDate(d)
}

/** Years between two ISO date strings (exact, fractional). */
export function yearsBetween(from: string, to: string): number {
  return (parseDate(to).getTime() - parseDate(from).getTime()) / (365.25 * 86_400_000)
}

export function addYears(dateStr: string, years: number): string {
  const d = parseDate(dateStr)
  d.setFullYear(d.getFullYear() + years)
  return formatDate(d)
}

export function jan1(year: number): string {
  return `${year}-01-01`
}

export function getYear(dateStr: string): number {
  return parseInt(dateStr.slice(0, 4))
}

/** True if testDate is on or after startDate. */
export function onOrAfter(testDate: string, startDate: string): boolean {
  return testDate >= startDate
}

/** True if testDate is strictly before endDate. */
export function before(testDate: string, endDate: string): boolean {
  return testDate < endDate
}

export function isActive(testDate: string, startDate: string, endDate: string): boolean {
  return onOrAfter(testDate, startDate) && before(testDate, endDate)
}

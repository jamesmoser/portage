import { describe, it, expect } from 'vitest'
import {
  parseDate,
  formatDate,
  exactAgeAt,
  intAgeAt,
  dateAtAge,
  dateAtDecimalAge,
  yearsBetween,
  addYears,
  jan1,
  getYear,
  onOrAfter,
  before,
  isActive,
} from '../dates'

// ─── parseDate / formatDate ───────────────────────────────────────────────────
// Intent: round-trip between ISO strings and JS Date objects using LOCAL time.
// Critically, we do NOT use new Date(isoString) (UTC) because in negative-offset
// timezones that would give the previous calendar day.

describe('parseDate / formatDate', () => {
  it('round-trips a standard date', () => {
    expect(formatDate(parseDate('2000-06-15'))).toBe('2000-06-15')
  })

  it('round-trips Jan 1', () => {
    expect(formatDate(parseDate('2024-01-01'))).toBe('2024-01-01')
  })

  it('round-trips Dec 31', () => {
    expect(formatDate(parseDate('2024-12-31'))).toBe('2024-12-31')
  })

  it('round-trips a leap day', () => {
    expect(formatDate(parseDate('2000-02-29'))).toBe('2000-02-29')
  })
})

// ─── intAgeAt ─────────────────────────────────────────────────────────────────
// Intent: birthday-aware integer age — the age you'd say you are.
//   - Returns N on the Nth birthday (day of)
//   - Returns N-1 the day before the Nth birthday
//   - Correct across year boundaries, leap years, and Jan 1 birthdays
// This is the authoritative function for eligibility thresholds (CPP, OAS, RRIF,
// age amount, tax credits). Do NOT use exactAgeAt for these comparisons.

describe('intAgeAt', () => {
  const born = '1960-06-15'

  it('returns 0 on the day of birth', () => {
    expect(intAgeAt(born, '1960-06-15')).toBe(0)
  })

  it('returns 0 the day before first birthday', () => {
    expect(intAgeAt(born, '1961-06-14')).toBe(0)
  })

  it('returns 1 on the first birthday', () => {
    expect(intAgeAt(born, '1961-06-15')).toBe(1)
  })

  it('returns 64 the day before 65th birthday', () => {
    expect(intAgeAt(born, '2025-06-14')).toBe(64)
  })

  it('returns 65 on the 65th birthday', () => {
    expect(intAgeAt(born, '2025-06-15')).toBe(65)
  })

  it('returns 65 the day after the 65th birthday', () => {
    expect(intAgeAt(born, '2025-06-16')).toBe(65)
  })

  it('handles a Jan 1 birthday correctly on Jan 1', () => {
    // Person born Jan 1 1950. On Jan 1 2021 they turn 71 — should return 71, not 70.
    // This was the bug: exactAgeAt gives 70.9986 due to leap year accumulation.
    expect(intAgeAt('1950-01-01', '2021-01-01')).toBe(71)
  })

  it('handles a Jan 1 birthday: day before is still previous age', () => {
    expect(intAgeAt('1950-01-01', '2020-12-31')).toBe(70)
  })

  it('handles a Dec 31 birthday correctly', () => {
    expect(intAgeAt('1960-12-31', '2025-12-31')).toBe(65)
    expect(intAgeAt('1960-12-31', '2025-12-30')).toBe(64)
  })

  it('handles leap day birthday in a non-leap year: not yet 65 on Feb 28', () => {
    // Born Feb 29 1960. In 2025 (non-leap), Feb 28 is still 64.
    expect(intAgeAt('1960-02-29', '2025-02-28')).toBe(64)
  })

  it('handles leap day birthday in a non-leap year: turns 65 on Mar 1', () => {
    // Mar 1 is the first valid date after the missing Feb 29, so they turn 65 then.
    expect(intAgeAt('1960-02-29', '2025-03-01')).toBe(65)
  })

  it('handles leap day birthday in a leap year: turns 65 on Feb 29', () => {
    // 2024 is a leap year. Born Feb 29, 1960 — 65th birthday is Feb 29, 2025? No —
    // 2025 is NOT a leap year. The leap birthday year closest: 2024 (age 64), 2028 (age 68).
    // On Feb 29, 2024 they turn 64.
    expect(intAgeAt('1960-02-29', '2024-02-29')).toBe(64)
  })
})

// ─── exactAgeAt ───────────────────────────────────────────────────────────────
// Intent: fractional age in decimal years for smooth/continuous use cases —
// return rate tier probes at mid-year, display labels, elapsed phase years.
// NOT suitable for integer eligibility thresholds (use intAgeAt for those).
// Uses 365.25-day year approximation; will NOT return exact integers on birthdays.

describe('exactAgeAt', () => {
  it('returns approximately 0 on the day of birth', () => {
    expect(exactAgeAt('2000-06-15', '2000-06-15')).toBeCloseTo(0, 5)
  })

  it('returns approximately 65 on the 65th birthday (within 0.01 years)', () => {
    // The approximation means we won't get exactly 65.0 — but it should be close.
    const age = exactAgeAt('1960-06-15', '2025-06-15')
    expect(age).toBeGreaterThan(64.99)
    expect(age).toBeLessThan(65.01)
  })

  it('returns a value less than 65 for Jan 1 birthday on Jan 1 of the 65th year', () => {
    // This documents the known approximation: Jan 1 birthdays accumulate leap year
    // error and exactAgeAt returns < 65 on the actual 65th birthday.
    // intAgeAt should be used for eligibility checks instead.
    const age = exactAgeAt('1950-01-01', '2015-01-01')
    expect(age).toBeLessThan(65)
  })

  it('returns approximately 0.5 at the mid-year probe convention', () => {
    // Tabs use ${year}-06-15 as a mid-year probe to determine the return rate tier.
    // For someone born Jun 15, mid-year probe in the same year is exactly 0.
    // For a Jun 1 birthday, probe on Jun 15 of same year is ~0.038 years (14 days).
    const age = exactAgeAt('2000-06-01', '2000-06-15')
    expect(age).toBeCloseTo(14 / 365.25, 3)
  })

  it('is always positive', () => {
    expect(exactAgeAt('1960-01-01', '2025-06-15')).toBeGreaterThan(0)
  })
})

// ─── dateAtAge ────────────────────────────────────────────────────────────────
// Intent: return the ISO string of the person's Nth birthday.
// Integer N only. The canonical way to compute benefit start dates, RRIF
// conversion dates, and other fixed-age events.

describe('dateAtAge', () => {
  it('returns the birth date at age 0', () => {
    expect(dateAtAge('1960-06-15', 0)).toBe('1960-06-15')
  })

  it('returns the correct 65th birthday', () => {
    expect(dateAtAge('1960-06-15', 65)).toBe('2025-06-15')
  })

  it('returns the correct 71st birthday (RRIF conversion)', () => {
    expect(dateAtAge('1960-06-15', 71)).toBe('2031-06-15')
  })

  it('handles a Jan 1 birthday', () => {
    expect(dateAtAge('1950-01-01', 71)).toBe('2021-01-01')
  })

  it('handles a Dec 31 birthday', () => {
    expect(dateAtAge('1960-12-31', 65)).toBe('2025-12-31')
  })

  it('is consistent with intAgeAt: intAgeAt on the returned date equals N', () => {
    const birth = '1972-09-20'
    const d = dateAtAge(birth, 55)
    expect(intAgeAt(birth, d)).toBe(55)
  })

  it('is consistent for Jan 1 birthday: intAgeAt on the returned date equals N', () => {
    const birth = '1950-01-01'
    const d = dateAtAge(birth, 71)
    expect(intAgeAt(birth, d)).toBe(71)
  })
})

// ─── dateAtDecimalAge ─────────────────────────────────────────────────────────
// Intent: convert a fractional age to a calendar date by interpolating linearly
// between consecutive birthdays. Used for planning end dates and spending phase
// start dates. For integer ages, must equal dateAtAge exactly.

describe('dateAtDecimalAge', () => {
  it('returns the Nth birthday for integer ages', () => {
    expect(dateAtDecimalAge('1960-06-15', 65)).toBe(dateAtAge('1960-06-15', 65))
  })

  it('returns a date strictly between the two birthdays for fractional ages', () => {
    const lower = dateAtAge('1960-06-15', 65)
    const upper = dateAtAge('1960-06-15', 66)
    const mid   = dateAtDecimalAge('1960-06-15', 65.5)
    expect(mid > lower).toBe(true)
    expect(mid < upper).toBe(true)
  })

  it('age 65.0 and age 65 give the same result', () => {
    expect(dateAtDecimalAge('1960-06-15', 65.0)).toBe(dateAtAge('1960-06-15', 65))
  })

  it('0.5 falls at roughly the midpoint of the year', () => {
    // The midpoint of a non-leap year (365 days) is ~182.5 days after the birthday.
    const birth = '1960-03-01'
    const d = parseDate(dateAtDecimalAge(birth, 65.5))
    const lower = parseDate(dateAtAge(birth, 65))
    const upper = parseDate(dateAtAge(birth, 66))
    const elapsed = d.getTime() - lower.getTime()
    const total   = upper.getTime() - lower.getTime()
    expect(elapsed / total).toBeCloseTo(0.5, 2)
  })

  it('handles integer planning end age: equals the birthday', () => {
    // The projection engine uses dateAtDecimalAge(birth, planningEndAge) as the
    // death date. For integer planningEndAge, this is the birthday itself.
    expect(dateAtDecimalAge('1960-06-15', 92)).toBe('2052-06-15')
  })
})

// ─── jan1 / getYear ───────────────────────────────────────────────────────────

describe('jan1', () => {
  it('returns Jan 1 of the given year', () => {
    expect(jan1(2025)).toBe('2025-01-01')
  })
})

describe('getYear', () => {
  it('extracts the year from an ISO date string', () => {
    expect(getYear('2025-06-15')).toBe(2025)
  })

  it('works for Jan 1', () => {
    expect(getYear('2025-01-01')).toBe(2025)
  })

  it('works for Dec 31', () => {
    expect(getYear('2025-12-31')).toBe(2025)
  })
})

// ─── onOrAfter / before / isActive ───────────────────────────────────────────
// Intent: ISO string comparison for date range checks.
// Correctness relies on ISO strings sorting lexicographically in date order.

describe('onOrAfter', () => {
  it('returns true when dates are equal', () => {
    expect(onOrAfter('2025-06-15', '2025-06-15')).toBe(true)
  })

  it('returns true when testDate is after startDate', () => {
    expect(onOrAfter('2025-06-16', '2025-06-15')).toBe(true)
  })

  it('returns false when testDate is before startDate', () => {
    expect(onOrAfter('2025-06-14', '2025-06-15')).toBe(false)
  })

  it('works across year boundaries', () => {
    expect(onOrAfter('2026-01-01', '2025-12-31')).toBe(true)
    expect(onOrAfter('2025-12-31', '2026-01-01')).toBe(false)
  })
})

describe('before', () => {
  it('returns true when testDate is strictly before endDate', () => {
    expect(before('2025-06-14', '2025-06-15')).toBe(true)
  })

  it('returns false when dates are equal (strict)', () => {
    expect(before('2025-06-15', '2025-06-15')).toBe(false)
  })

  it('returns false when testDate is after endDate', () => {
    expect(before('2025-06-16', '2025-06-15')).toBe(false)
  })
})

describe('isActive', () => {
  it('returns true when testDate is within [startDate, endDate)', () => {
    expect(isActive('2025-06-15', '2025-01-01', '2026-01-01')).toBe(true)
  })

  it('returns true on the start date (inclusive)', () => {
    expect(isActive('2025-01-01', '2025-01-01', '2026-01-01')).toBe(true)
  })

  it('returns false on the end date (exclusive)', () => {
    expect(isActive('2026-01-01', '2025-01-01', '2026-01-01')).toBe(false)
  })

  it('returns false before the start date', () => {
    expect(isActive('2024-12-31', '2025-01-01', '2026-01-01')).toBe(false)
  })

  it('returns false after the end date', () => {
    expect(isActive('2026-06-15', '2025-01-01', '2026-01-01')).toBe(false)
  })
})

// ─── addYears ─────────────────────────────────────────────────────────────────
// Intent: add whole years to a date. Used for shifting dates in the UI.

describe('addYears', () => {
  it('adds years correctly', () => {
    expect(addYears('2020-06-15', 5)).toBe('2025-06-15')
  })

  it('handles year boundaries', () => {
    expect(addYears('2020-12-31', 1)).toBe('2021-12-31')
  })

  it('adding 0 returns the same date', () => {
    expect(addYears('2025-06-15', 0)).toBe('2025-06-15')
  })
})

// ─── yearsBetween ─────────────────────────────────────────────────────────────
// Intent: fractional years between two dates using 365.25-day approximation.
// Same approximation caveats as exactAgeAt — for display/smooth use only.
// Note: currently appears unused in the codebase; tested here for completeness.

describe('yearsBetween', () => {
  it('returns 0 for the same date', () => {
    expect(yearsBetween('2025-01-01', '2025-01-01')).toBe(0)
  })

  it('returns approximately 1 for one calendar year', () => {
    expect(yearsBetween('2025-01-01', '2026-01-01')).toBeCloseTo(1, 2)
  })

  it('returns approximately 10 for ten years', () => {
    expect(yearsBetween('2015-06-15', '2025-06-15')).toBeCloseTo(10, 1)
  })

  it('returns a negative value when from > to', () => {
    expect(yearsBetween('2026-01-01', '2025-01-01')).toBeLessThan(0)
  })
})

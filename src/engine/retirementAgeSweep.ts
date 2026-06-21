import type { AppState } from './types'
import { runProjection } from './projection'

import { dateAtAge, dateAtDecimalAge, exactAgeAt, parseDate, formatDate, todayStr, getYear } from './dates'

export interface RetirementAgeSweepPoint {
  ageA: number
  ageB: number
  shortfallYears: number
  firstShortfallYear: number | null
  finalBalance: number
  successRate: number // 100% or 0% under 'plan', or actual % under 'historical'
  success: boolean
  shortfallTotal: number
}

export interface RetirementAgeSweepResult {
  points: RetirementAgeSweepPoint[]
  hasSpouse: boolean
  baseA: number
  baseB: number
  earliestA: number | null
  earliestB: number | null
  earliestTogetherA: number | null
  earliestTogetherB: number | null
  bestOutcomeA: number | null
  bestOutcomeB: number | null
}

export interface RetirementAgeSweepOptions {
  startAgeA: number
  endAgeA: number
  startAgeB: number
  endAgeB: number
  step: number
  cascadePension: boolean
  cascadeRrsp: boolean
  cascadeTfsa: boolean
  cascadeNonReg: boolean
}

// Helper to determine the next birthday age, avoiding timezone or leap-year drift.
function getNextBirthdayAge(birthDate: string, today: string): number {
  if (!birthDate) return 0
  const birth = parseDate(birthDate)
  const at = parseDate(today)
  let nextAge = at.getFullYear() - birth.getFullYear()
  if (
    at.getMonth() > birth.getMonth() ||
    (at.getMonth() === birth.getMonth() && at.getDate() > birth.getDate())
  ) {
    nextAge++
  }
  return nextAge
}

// Helper to snap an ISO date to the first of the nearest month (matches whatifs.ts).
function snapToMonthStart(dateStr: string): string {
  const d = parseDate(dateStr)
  if (d.getDate() >= 15) {
    return formatDate(new Date(d.getFullYear(), d.getMonth() + 1, 1))
  }
  return formatDate(new Date(d.getFullYear(), d.getMonth(), 1))
}

// Shift an ISO date string by deltaMs milliseconds (matches whatifs.ts).
function shiftDateMs(dateStr: string, deltaMs: number): string {
  return formatDate(new Date(parseDate(dateStr).getTime() + deltaMs))
}

// Return the earlier of two ISO date strings (matches whatifs.ts).
function minDate(a: string, b: string): string {
  return a <= b ? a : b
}

// Return the death date (matches whatifs.ts).
function getDeathDate(birthDate: string, planningEndAge: number): string {
  const d = parseDate(dateAtAge(birthDate, planningEndAge + 1))
  d.setDate(d.getDate() - 1)
  return formatDate(d)
}

/**
 * Calculates a precise decimal age corresponding to targetDate, matching dateAtDecimalAge logic.
 * Avoids leap-year calendar drift issues.
 */
export function decimalAgeAt(birthDate: string, atDate: string): number {
  const birth = parseDate(birthDate)
  const at = parseDate(atDate)
  
  let whole = at.getFullYear() - birth.getFullYear()
  let bdayThisYear = new Date(birth.getFullYear() + whole, birth.getMonth(), birth.getDate())
  if (bdayThisYear > at) {
    whole--
    bdayThisYear = new Date(birth.getFullYear() + whole, birth.getMonth(), birth.getDate())
  }
  
  const bdayNextYear = new Date(birth.getFullYear() + whole + 1, birth.getMonth(), birth.getDate())
  const denominator = bdayNextYear.getTime() - bdayThisYear.getTime()
  const numerator = at.getTime() - bdayThisYear.getTime()
  
  return whole + (numerator / denominator)
}

/**
 * Modifies AppState to simulate specific retirement ages for both spouses.
 */
export function applyRetirementAges(
  state: AppState,
  ageA: number,
  ageB: number,
  options: Pick<RetirementAgeSweepOptions, 'cascadePension' | 'cascadeRrsp' | 'cascadeTfsa' | 'cascadeNonReg'>
): AppState {
  let s = { ...state }

  // 1. Person A retirement modifications
  const birthA = s.personA.birthDate
  const newDateA = snapToMonthStart(dateAtDecimalAge(birthA, ageA))
  const deltaMsA = parseDate(newDateA).getTime() - parseDate(s.personA.retirementDate).getTime()
  const deadlineA = getDeathDate(birthA, s.personA.planningEndAge)

  s.personA = { ...s.personA, retirementDate: newDateA }

  if (options.cascadePension && s.dbPensionA.enabled) {
    s.dbPensionA = { ...s.dbPensionA, startDate: newDateA }
  }
  if (options.cascadeRrsp) {
    s.rrspA = {
      ...s.rrspA,
      contributionEndDate: minDate(shiftDateMs(s.rrspA.contributionEndDate, deltaMsA), deadlineA),
      spousalLastContributionDate: minDate(shiftDateMs(s.rrspA.spousalLastContributionDate, deltaMsA), deadlineA),
    }
  }
  if (options.cascadeTfsa) {
    s.tfsaA = { ...s.tfsaA, contributionEndDate: minDate(shiftDateMs(s.tfsaA.contributionEndDate, deltaMsA), deadlineA) }
  }
  if (options.cascadeNonReg) {
    s.nonRegA = { ...s.nonRegA, contributionEndDate: minDate(shiftDateMs(s.nonRegA.contributionEndDate, deltaMsA), deadlineA) }
  }

  // 2. Person B retirement modifications
  const birthB = s.personB.birthDate
  const newDateB = snapToMonthStart(dateAtDecimalAge(birthB, ageB))
  const deltaMsB = parseDate(newDateB).getTime() - parseDate(s.personB.retirementDate).getTime()
  const deadlineB = getDeathDate(birthB, s.personB.planningEndAge)

  s.personB = { ...s.personB, retirementDate: newDateB }

  if (options.cascadePension && s.dbPensionB.enabled) {
    s.dbPensionB = { ...s.dbPensionB, startDate: newDateB }
  }
  if (options.cascadeRrsp) {
    s.rrspB = {
      ...s.rrspB,
      contributionEndDate: minDate(shiftDateMs(s.rrspB.contributionEndDate, deltaMsB), deadlineB),
      spousalLastContributionDate: minDate(shiftDateMs(s.rrspB.spousalLastContributionDate, deltaMsB), deadlineB),
    }
  }
  if (options.cascadeTfsa) {
    s.tfsaB = { ...s.tfsaB, contributionEndDate: minDate(shiftDateMs(s.tfsaB.contributionEndDate, deltaMsB), deadlineB) }
  }
  if (options.cascadeNonReg) {
    s.nonRegB = { ...s.nonRegB, contributionEndDate: minDate(shiftDateMs(s.nonRegB.contributionEndDate, deltaMsB), deadlineB) }
  }

  // 3. Shifting Go-Go Years (first retirement phase only)
  // Transition to slow-go is based on health, not retirement date, so we only shift phase-1.
  if (s.spendingPhases.length > 1) {
    const refBirth = s.ageReferencePerson === 'personB' ? s.personB.birthDate : s.personA.birthDate
    const dateGoGo = s.personA.retirementDate > s.personB.retirementDate
      ? s.personA.retirementDate
      : s.personB.retirementDate

    const newGoGoAge = decimalAgeAt(refBirth, dateGoGo)

    s.spendingPhases = s.spendingPhases.map((phase, idx) => {
      // Pre-Retirement is index 0. Survivor phase has linkedToFirstDeath.
      if (idx === 0 || phase.linkedToFirstDeath) {
        return phase
      }
      if (idx === 1) {
        return { ...phase, startAge: newGoGoAge }
      }
      // Clamping subsequent phases to be no earlier than the retirement date (Go-Go start)
      return { ...phase, startAge: Math.max(newGoGoAge, phase.startAge) }
    })
  }

  return s
}

/**
 * Runs a 2D grid sweep over retirement ages for both spouses.
 */
export function runRetirementAgeSweep(
  state: AppState,
  rateSchedule: number[] | undefined,
  options: RetirementAgeSweepOptions
): RetirementAgeSweepResult {
  const points: RetirementAgeSweepPoint[] = []

  const currentAgeA = Math.max(35, getNextBirthdayAge(state.personA.birthDate, todayStr()))
  const currentAgeB = Math.max(35, getNextBirthdayAge(state.personB.birthDate, todayStr()))

  const baseA = Math.max(currentAgeA, Math.round(decimalAgeAt(state.personA.birthDate, state.personA.retirementDate)))
  const baseB = Math.max(currentAgeB, Math.round(decimalAgeAt(state.personB.birthDate, state.personB.retirementDate)))

  // Loop through ages for A and B
  for (let ageA = options.startAgeA; ageA <= options.endAgeA; ageA += options.step) {
    for (let ageB = options.startAgeB; ageB <= options.endAgeB; ageB += options.step) {
      const testState = applyRetirementAges(state, ageA, ageB, options)

      const { warnings, dataPoints } = runProjection(testState, rateSchedule)
      const shortfallYears = warnings.filter(w => w.includes('spending shortfall')).length
      const success = shortfallYears === 0
      const successRate = success ? 100 : 0
      const finalBalance = dataPoints[dataPoints.length - 1]?.totalPortfolio ?? 0

      let firstShortfallYear: number | null = null
      const firstWarning = warnings.find(w => w.includes('spending shortfall'))
      if (firstWarning) {
        const match = firstWarning.match(/Year (\d+):/)
        if (match) firstShortfallYear = parseInt(match[1], 10)
      }

      let shortfallTotal = 0
      for (const w of warnings) {
        if (w.includes('spending shortfall')) {
          const idx = w.indexOf('$')
          if (idx !== -1) {
            const digits = w.substring(idx + 1).replace(/\D/g, '')
            if (digits) {
              shortfallTotal += parseInt(digits, 10)
            }
          }
        }
      }

      points.push({
        ageA,
        ageB,
        shortfallYears,
        firstShortfallYear,
        finalBalance,
        successRate,
        success,
        shortfallTotal
      })
    }
  }

  // 1. Earliest A can retire given B is at configured plan age (baseB)
  let earliestA: number | null = null
  const pointsBBase = points.filter(p => p.ageB === baseB && p.success)
  if (pointsBBase.length > 0) {
    earliestA = Math.min(...pointsBBase.map(p => p.ageA))
  }

  // 2. Earliest B can retire given A is at configured plan age (baseA)
  let earliestB: number | null = null
  const pointsABase = points.filter(p => p.ageA === baseA && p.success)
  if (pointsABase.length > 0) {
    earliestB = Math.min(...pointsABase.map(p => p.ageB))
  }

  // 3. Earliest they can retire together (same calendar year)
  let earliestTogetherA: number | null = null
  let earliestTogetherB: number | null = null
  let minTogetherYear = Infinity

  const currentYear = new Date().getFullYear()

  for (const p of points) {
    if (p.success) {
      const yearA = getYear(state.personA.birthDate) + p.ageA
      const yearB = getYear(state.personB.birthDate) + p.ageB
      if (yearA === yearB) {
        if (yearA < minTogetherYear) {
          minTogetherYear = yearA
          earliestTogetherA = p.ageA
          earliestTogetherB = p.ageB
        }
      }
    }
  }

  // 4. Best Outcome: lowest combined age (sum), tie breaker is the lowest age of the youngest person to retire
  let bestOutcomeA: number | null = null
  let bestOutcomeB: number | null = null
  let minSum = Infinity
  let minYoungest = Infinity

  for (const p of points) {
    if (p.success) {
      const sum = p.ageA + p.ageB
      const youngest = Math.min(p.ageA, p.ageB)
      if (sum < minSum) {
        minSum = sum
        minYoungest = youngest
        bestOutcomeA = p.ageA
        bestOutcomeB = p.ageB
      } else if (sum === minSum) {
        if (youngest < minYoungest) {
          minYoungest = youngest
          bestOutcomeA = p.ageA
          bestOutcomeB = p.ageB
        }
      }
    }
  }

  return {
    points,
    hasSpouse: true,
    baseA,
    baseB,
    earliestA,
    earliestB,
    earliestTogetherA,
    earliestTogetherB,
    bestOutcomeA,
    bestOutcomeB
  }
}

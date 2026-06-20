import { runProjection } from './projection'
import { getYear, dateAtDecimalAge, intAgeAt, jan1 } from './dates'
import type { AppState } from './types'

export interface InsuranceSweepPoint {
  ageA: number
  ageB: number
  yearA: number
  yearB: number
  payoutYear: number
  lumpSumPd: number
  lumpSumNom: number
  beneficiary: 'personA' | 'personB' | 'none'
}

export interface InsuranceAnalyserResult {
  sweep1D_A: InsuranceSweepPoint[]
  sweep1D_B: InsuranceSweepPoint[]
  sweep2D: InsuranceSweepPoint[][]
  maxNeededA: number // Today's dollars
  maxNeededB: number // Today's dollars
  maxNeededNomA: number // Nominal
  maxNeededNomB: number // Nominal
  baselineShortfall: boolean
}

/**
 * Checks if there is a spending shortfall warning in or after the payout year.
 */
function hasShortfallInOrAfterYear(warnings: string[], payoutYear: number): boolean {
  return warnings.some(w => {
    if (!w.toLowerCase().includes('spending shortfall')) return false
    const match = w.match(/Year (\d+):/)
    if (match) {
      const yr = parseInt(match[1], 10)
      return yr >= payoutYear
    }
    return true
  })
}

/**
 * Runs a bisection search to find the exact required nominal life insurance payout
 * at the year of first death to eliminate all subsequent spending shortfalls.
 */
export function findRequiredInsurance(
  state: AppState,
  rateSchedule: number[] | undefined,
  ageA: number,
  ageB: number,
  depositAccount: 'hisa' | 'nonReg'
): { nominal: number; pd: number; payoutYear: number; beneficiary: 'personA' | 'personB' | 'none' } {
  const currentYear = new Date().getFullYear()
  
  // Calculate exact death years from ages
  const deathDateA = dateAtDecimalAge(state.personA.birthDate, ageA)
  const deathDateB = dateAtDecimalAge(state.personB.birthDate, ageB)
  const endYearA = getYear(deathDateA)
  const endYearB = getYear(deathDateB)
  const payoutYear = Math.max(currentYear, Math.min(endYearA, endYearB))

  // If both die in the same year, there is no survivor to support, so no insurance is needed
  if (endYearA === endYearB) {
    return { nominal: 0, pd: 0, payoutYear, beneficiary: 'none' }
  }

  const beneficiary = endYearA < endYearB ? 'personB' : 'personA'
  const targetAccount: 'hisa' | 'nonRegA' | 'nonRegB' =
    depositAccount === 'hisa'
      ? 'hisa'
      : beneficiary === 'personB' ? 'nonRegB' : 'nonRegA'

  // 1. Quick check: does 0 insurance work?
  const testStateZero: AppState = {
    ...state,
    personA: { ...state.personA, planningEndAge: ageA },
    personB: { ...state.personB, planningEndAge: ageB },
  }
  const resZero = runProjection(testStateZero, rateSchedule)
  const hasShortfallZero = hasShortfallInOrAfterYear(resZero.warnings, payoutYear)
  if (!hasShortfallZero) {
    return { nominal: 0, pd: 0, payoutYear, beneficiary }
  }

  // 2. Bisection search to find the exact boundary
  let low = 0
  let high = 15_000_000 // default large upper bound

  for (let i = 0; i < 18; i++) {
    const mid = (low + high) / 2
    const testState: AppState = {
      ...state,
      personA: { ...state.personA, planningEndAge: ageA },
      personB: { ...state.personB, planningEndAge: ageB },
      insuranceEvent: {
        year: payoutYear,
        amount: mid,
        account: targetAccount,
      },
    }
    const res = runProjection(testState, rateSchedule)
    const hasShortfall = hasShortfallInOrAfterYear(res.warnings, payoutYear)

    if (hasShortfall) {
      low = mid
    } else {
      high = mid
    }
  }

  const requiredNom = Math.round(high)
  const pi = state.personalInflationRatePct / 100
  const yearsFromNow = Math.max(0, payoutYear - currentYear)
  const requiredPd = Math.round(requiredNom / Math.pow(1 + pi, yearsFromNow))

  return { nominal: requiredNom, pd: requiredPd, payoutYear, beneficiary }
}

/**
 * Sweeps ages at death for both spouses and calculates required insurance values.
 */
export function runInsuranceAnalysis(
  state: AppState,
  rateSchedule: number[] | undefined,
  options: {
    depositAccount: 'hisa' | 'nonReg'
    sweepStart: 'current' | 'retirement'
    stepSize: number
  }
): InsuranceAnalyserResult {
  const currentYear = new Date().getFullYear()

  // Baseline end ages and years
  const ageA_base = state.personA.planningEndAge
  const ageB_base = state.personB.planningEndAge
  const yearA_base = getYear(dateAtDecimalAge(state.personA.birthDate, ageA_base))
  const yearB_base = getYear(dateAtDecimalAge(state.personB.birthDate, ageB_base))
  const year_max = Math.max(yearA_base, yearB_base)

  // Retirement years
  const retYearA = getYear(state.personA.retirementDate)
  const retYearB = getYear(state.personB.retirementDate)

  // Determine starting years for sweeps
  const startYearA = options.sweepStart === 'retirement' 
    ? Math.max(currentYear, retYearA) 
    : currentYear
  const startYearB = options.sweepStart === 'retirement'
    ? Math.max(currentYear, retYearB)
    : currentYear

  // Perform baseline run to check for existing shortfall
  const baseRes = runProjection(state, rateSchedule)
  const baselineShortfall = baseRes.warnings.some(w => w.toLowerCase().includes('spending shortfall'))

  // ─── 1D Sweep A (A's death year sweeps, B held at base) ─────────────────────
  const sweep1D_A: InsuranceSweepPoint[] = []
  const birthYearA = getYear(state.personA.birthDate)
  for (let yr = startYearA; yr <= year_max; yr++) {
    const ageA = yr - birthYearA
    const res = findRequiredInsurance(state, rateSchedule, ageA, ageB_base, options.depositAccount)
    sweep1D_A.push({
      ageA,
      ageB: ageB_base,
      yearA: yr,
      yearB: yearB_base,
      payoutYear: res.payoutYear,
      lumpSumPd: res.pd,
      lumpSumNom: res.nominal,
      beneficiary: res.beneficiary,
    })
  }

  // ─── 1D Sweep B (B's death year sweeps, A held at base) ─────────────────────
  const sweep1D_B: InsuranceSweepPoint[] = []
  const birthYearB = getYear(state.personB.birthDate)
  for (let yr = startYearB; yr <= year_max; yr++) {
    const ageB = yr - birthYearB
    const res = findRequiredInsurance(state, rateSchedule, ageA_base, ageB, options.depositAccount)
    sweep1D_B.push({
      ageA: ageA_base,
      ageB,
      yearA: yearA_base,
      yearB: yr,
      payoutYear: res.payoutYear,
      lumpSumPd: res.pd,
      lumpSumNom: res.nominal,
      beneficiary: res.beneficiary,
    })
  }

  // ─── 2D Sweep Matrix (A vs B deaths) ────────────────────────────────────────
  // We sweep both using the stepSize to ensure fast UI performance
  const sweep2D: InsuranceSweepPoint[][] = []
  const step = options.stepSize

  const yrListA: number[] = []
  for (let yr = startYearA; yr < year_max; yr += step) {
    yrListA.push(yr)
  }
  if (!yrListA.includes(year_max)) {
    yrListA.push(year_max)
  }

  const yrListB: number[] = []
  for (let yr = startYearB; yr < year_max; yr += step) {
    yrListB.push(yr)
  }
  if (!yrListB.includes(year_max)) {
    yrListB.push(year_max)
  }

  for (const yrA of yrListA) {
    const ageA = yrA - birthYearA
    const row: InsuranceSweepPoint[] = []
    
    for (const yrB of yrListB) {
      const ageB = yrB - birthYearB
      const res = findRequiredInsurance(state, rateSchedule, ageA, ageB, options.depositAccount)
      row.push({
        ageA,
        ageB,
        yearA: yrA,
        yearB: yrB,
        payoutYear: res.payoutYear,
        lumpSumPd: res.pd,
        lumpSumNom: res.nominal,
        beneficiary: res.beneficiary,
      })
    }
    sweep2D.push(row)
  }

  // Calculate maximum values across 1D sweeps
  const maxNeededA = Math.max(0, ...sweep1D_A.map(p => p.lumpSumPd))
  const maxNeededB = Math.max(0, ...sweep1D_B.map(p => p.lumpSumPd))
  const maxNeededNomA = Math.max(0, ...sweep1D_A.map(p => p.lumpSumNom))
  const maxNeededNomB = Math.max(0, ...sweep1D_B.map(p => p.lumpSumNom))

  return {
    sweep1D_A,
    sweep1D_B,
    sweep2D,
    maxNeededA,
    maxNeededB,
    maxNeededNomA,
    maxNeededNomB,
    baselineShortfall,
  }
}

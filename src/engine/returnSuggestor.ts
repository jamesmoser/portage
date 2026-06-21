import { runProjection } from './projection'
import { getYear, dateAtAge } from './dates'
import type { AppState } from './types'
import { HISTORICAL_MONTHLY_RETURNS } from './historicalData'
import { generateRateSchedule } from './rateProfiles'

export interface HistoricalSuggestion {
  startYear: number
  label: string
  suggestedEquity: number
  suggestedBond: number
  avgReturn: number
  isInsufficient: boolean
}

export interface RequiredReturnResult {
  requiredRate: number // in percentage, e.g. 5.14 for 5.14%
  sweepPoints: { rate: number; shortfall: number }[]
  historicalSuggestions: HistoricalSuggestion[]
  baselineRate: number // the average return rate of the baseline plan
}

/**
 * Builds a flat rate schedule using the same generateRateSchedule path as the Dashboard,
 * so that the sweep is testing exactly what the Dashboard will run after "Apply to Dashboard".
 */
function buildFlatSchedule(state: AppState, flatRatePct: number): number[] {
  const currentYear = new Date().getFullYear()
  const eA = getYear(dateAtAge(state.personA.birthDate, state.personA.planningEndAge))
  const eB = getYear(dateAtAge(state.personB.birthDate, state.personB.planningEndAge))
  const endYear = Math.max(eA, eB)
  const refBirth = state.ageReferencePerson === 'personB'
    ? state.personB.birthDate
    : state.personA.birthDate
  return generateRateSchedule(
    state.returnRates,
    { profileType: 'flat', flatRate: flatRatePct, outlookOffset: 0, beta: 1,
      cyclePeriodYears: 10, dutyCycle: 0.5, shockOffset: 5, shockMagnitude: -20,
      shockRecovery: 10, shockDamping: 0.7, noiseSeed: 42 },
    currentYear,
    endYear,
    refBirth,
    state.personalInflationRatePct,
  )
}

/**
 * Runs the projection for a given flat return rate and parses the spending shortfall.
 */
export function getShortfallForRate(state: AppState, flatRatePct: number): { hasShortfall: boolean; totalShortfall: number } {
  const schedule = buildFlatSchedule(state, flatRatePct)
  const res = runProjection(state, schedule)

  let totalShortfall = 0
  let hasShortfall = false

  for (const d of res.dataPoints) {
    if (d.cashFlow < -0.01) {
      hasShortfall = true
      totalShortfall += -d.cashFlow
    }
  }

  return { hasShortfall, totalShortfall }
}

/**
 * Calculates the average annual compounded return for a given equity/bond weight over a period.
 */
export function getHistoricalAverageReturn(startYear: number, endYear: number, equityPct: number): number {
  const eqWeight = equityPct / 100
  const bondWeight = 1.0 - eqWeight

  const yearsData: Record<number, number[]> = {}
  for (const item of HISTORICAL_MONTHLY_RETURNS) {
    if (item.year >= startYear && item.year <= endYear) {
      if (!yearsData[item.year]) {
        yearsData[item.year] = []
      }
      const monthlyNomRet = eqWeight * item.equity + bondWeight * item.bond
      yearsData[item.year].push(monthlyNomRet)
    }
  }

  const annualReturns: number[] = []
  for (const yrStr in yearsData) {
    const monthlyReturns = yearsData[yrStr]
    // Compounded annual return
    if (monthlyReturns.length >= 11) {
      let compounded = 1.0
      for (const r of monthlyReturns) {
        compounded *= (1.0 + r)
      }
      annualReturns.push(compounded - 1.0)
    }
  }

  if (annualReturns.length === 0) return 0
  const sum = annualReturns.reduce((a, b) => a + b, 0)
  return sum / annualReturns.length
}

/**
 * Finds the asset mix (equity/bond) that achieves at least the target return rate.
 */
export function suggestAssetAllocation(targetRatePct: number, startYear: number, endYear: number): { equity: number; bond: number; avgReturn: number; isInsufficient: boolean } {
  const targetRate = targetRatePct / 100

  // We test from 0% to 100% equity in steps of 10%
  for (let eq = 0; eq <= 100; eq += 10) {
    const avgReturn = getHistoricalAverageReturn(startYear, endYear, eq)
    if (avgReturn >= targetRate) {
      return { equity: eq, bond: 100 - eq, avgReturn, isInsufficient: false }
    }
  }

  // If no mix is sufficient, return 100% Equity / 0% Bond and mark as insufficient
  const bestAvgReturn = getHistoricalAverageReturn(startYear, endYear, 100)
  return { equity: 100, bond: 0, avgReturn: bestAvgReturn, isInsufficient: true }
}

/**
 * Run the full required return rate sweep and historical suggestions.
 */
export function runRequiredReturnAnalysis(state: AppState): RequiredReturnResult {
  const currentYear = new Date().getFullYear()
  const eA = getYear(dateAtAge(state.personA.birthDate, state.personA.planningEndAge))
  const eB = getYear(dateAtAge(state.personB.birthDate, state.personB.planningEndAge))
  const endYear = Math.max(eA, eB)
  const n = Math.max(1, endYear - currentYear + 1)

  // 1. Calculate baseline average return rate
  const refBirthDate = state.ageReferencePerson === 'personB' ? state.personB.birthDate : state.personA.birthDate
  
  function getPlanStepRate(yearOffset: number): number {
    const birthYear = getYear(refBirthDate)
    const age = (currentYear + yearOffset) - birthYear
    if (age < 55)       return state.returnRates.upTo55
    else if (age < 65)  return state.returnRates.from55to65
    else if (age < 70)  return state.returnRates.from65to70
    else                return state.returnRates.from70plus
  }
  const baselineRate = Array.from({ length: n }, (_, i) => getPlanStepRate(i)).reduce((a, b) => a + b, 0) / n

  // 2. Perform bisection search to find the exact required rate
  let low = 0
  let high = 30
  let requiredRate = 30

  // Check 0%
  const zeroShortfall = getShortfallForRate(state, 0)
  if (!zeroShortfall.hasShortfall) {
    requiredRate = 0
  } else {
    // Check if 30% still has shortfall
    const maxShortfall = getShortfallForRate(state, 30)
    if (maxShortfall.hasShortfall) {
      requiredRate = 30
    } else {
      for (let i = 0; i < 18; i++) {
        const mid = (low + high) / 2
        const { hasShortfall } = getShortfallForRate(state, mid)
        if (hasShortfall) {
          low = mid
        } else {
          high = mid
          requiredRate = mid
        }
      }
    }
  }

  // 3. Determine sweep range for chart (from 0% to ceil(requiredRate + 2%))
  // Always end on a whole number % that is >= requiredRate + 2%, at least 2%
  const targetStop = requiredRate + 2
  const maxSweepRate = Math.max(2, Math.ceil(targetStop))
  const sweepPoints: { rate: number; shortfall: number }[] = []

  for (let r = 0; r <= maxSweepRate; r += 0.25) {
    const { totalShortfall } = getShortfallForRate(state, r)
    sweepPoints.push({ rate: r, shortfall: totalShortfall })
  }

  // 4. Get suggestions for typical historical periods
  const periods = [
    { startYear: 1871, label: '1871–2025 (Full History)' },
    { startYear: 1950, label: '1950–2025 (Modern Era)' },
    { startYear: 1980, label: '1980–2025 (Post-Stagflation)' },
    { startYear: 2000, label: '2000–2025 (21st Century)' },
    { startYear: 2015, label: '2015–2025 (Recent Decade)' },
  ]

  const historicalSuggestions: HistoricalSuggestion[] = periods.map(p => {
    const alloc = suggestAssetAllocation(requiredRate, p.startYear, 2025)
    return {
      startYear: p.startYear,
      label: p.label,
      suggestedEquity: alloc.equity,
      suggestedBond: alloc.bond,
      avgReturn: alloc.avgReturn * 100, // as percentage
      isInsufficient: alloc.isInsufficient,
    }
  })

  return {
    requiredRate,
    sweepPoints,
    historicalSuggestions,
    baselineRate,
  }
}

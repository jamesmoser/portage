// RRSP Meltdown Optimizer — sweeps the proactive meltdown grossIncomeCeiling
// independently for each person to find the lifetime-tax-minimizing ceiling.
//
// All reference thresholds (OAS clawback, bracket boundaries) are read from
// state.taxSettings — nothing is hardcoded.  Changing tax parameters in the
// Settings tab is automatically reflected in any subsequent optimizer run.

import type { AppState, DataPoint, OASSettings } from './types'
import { runProjection, oasFactor } from './projection'
import { getYear, dateAtDecimalAge } from './dates'

// ─── Public types ─────────────────────────────────────────────────────────────

export interface MeltdownSweepPoint {
  grossIncomeCeiling: number    // today's dollars
  lifetimeTax: number           // today's dollars — combined federal + Ontario, all years
  avgEffectiveTaxRate: number   // 0–1, lifetime (total tax / total gross income)
  totalPortfolioAtEnd: number   // today's dollars, final year of plan
}

export interface MeltdownOptimizerResult {
  sweepA: MeltdownSweepPoint[]
  sweepB: MeltdownSweepPoint[]
  optimalCeilingA: number | null  // null when Person A has no meltdown phase
  optimalCeilingB: number | null
  /** True when the sweep reached the hard cap without finding a confirmed rising region.
   *  The curve is still decreasing at the chart boundary — optimal ceiling may be higher. */
  optimalAtBoundaryA: boolean
  optimalAtBoundaryB: boolean
  incomeFloorA: number            // avg non-RRSP income in A's meltdown years (today's $)
  incomeFloorB: number            // avg non-RRSP income in B's meltdown years (today's $)
  meltdownYearsA: number[]        // calendar years comprising A's meltdown phase
  meltdownYearsB: number[]        // calendar years comprising B's meltdown phase
  hasMeltdownA: boolean
  hasMeltdownB: boolean
  // Reference thresholds from taxSettings (today's $) for chart annotations
  oasClawbackThreshold: number      // state.taxSettings.oasClawbackThreshold
  fullClawbackIncomeA: number       // income at which A's OAS is completely clawed back
  fullClawbackIncomeB: number       // income at which B's OAS is completely clawed back
  federalBracket1: number           // state.taxSettings.federalBrackets[0].upTo
  federalBracket2: number           // state.taxSettings.federalBrackets[1].upTo
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

/**
 * Income level at which a person's OAS is completely clawed back (today's $).
 * Uses the same deferral formula as the projection engine (`oasFactor`).
 * Returns oasClawbackThreshold when the person has no OAS (effectiveAnnual = 0).
 */
function fullClawbackIncome(
  oasSettings: OASSettings,
  birthDate: string,
  oasClawbackThreshold: number,
  oasClawbackRate: number,
): number {
  const effectiveMonthly = oasSettings.estimatedMonthlyAt65 * oasFactor(oasSettings.startDate, birthDate)
  const effectiveAnnual  = effectiveMonthly * 12
  if (effectiveAnnual <= 0) return oasClawbackThreshold
  return oasClawbackThreshold + effectiveAnnual / oasClawbackRate
}

/** Calendar years in the meltdown phase: [retirementYear, min(rrifYear−1, deathYear)]. */
function getMeltdownYears(retireYear: number, rrifYear: number, deathYear: number): number[] {
  const start = retireYear
  const end   = Math.min(rrifYear - 1, deathYear)
  if (start > end) return []
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

/**
 * Compute the income floor for a person: the average gross income from non-RRSP
 * sources in their meltdown-phase years, derived from a baseline projection with
 * grossIncomeCeiling = 0.  This is the minimum useful ceiling — below this value
 * the ceiling has no effect on RRSP draws.
 *
 * Uses DataPoint fields employment + DB pension (base + bridge) + CPP + OAS
 * + other income.  "Other income" here includes both taxable and non-taxable items
 * from the projection; the slight over-count is inconsequential for display purposes.
 */
function computeIncomeFloor(
  dataPoints: DataPoint[],
  meltdownYears: number[],
  person: 'A' | 'B',
): number {
  if (meltdownYears.length === 0) return 0
  const byYear = new Map(dataPoints.map(dp => [dp.year, dp]))
  let total = 0, count = 0
  for (const year of meltdownYears) {
    const dp = byYear.get(year)
    if (!dp) continue
    const income = person === 'A'
      ? dp.employmentA + dp.dbPensionBase + dp.dbBridge + dp.cppA + dp.oasA + dp.otherIncomeA
      : dp.employmentB + dp.dbPensionBaseB + dp.dbBridgeB + dp.cppB + dp.oasB + dp.otherIncomeB
    total += income
    count++
  }
  return count > 0 ? total / count : 0
}

/**
 * Return a copy of state with SpendGap forced as the active drawdown strategy
 * and the meltdown ceilings replaced with the supplied values.  All other
 * SpendGap settings (deficit order, surplus routing, RRIF phase) are preserved.
 */
function forceSpendGapCeilings(state: AppState, ceilingA: number, ceilingB: number): AppState {
  return {
    ...state,
    withdrawalStrategy: {
      ...state.withdrawalStrategy,
      drawdownStrategy: 'spendGap',
      spendGapConfig: {
        ...state.withdrawalStrategy.spendGapConfig,
        meltdownA: {
          ...state.withdrawalStrategy.spendGapConfig.meltdownA,
          grossIncomeCeiling: ceilingA,
        },
        meltdownB: {
          ...state.withdrawalStrategy.spendGapConfig.meltdownB,
          grossIncomeCeiling: ceilingB,
        },
      },
    },
  }
}

function buildSweepPoint(ceiling: number, dataPoints: DataPoint[]): MeltdownSweepPoint {
  let lifetimeTax = 0
  let totalGross  = 0
  let lastPortfolio = 0
  for (const dp of dataPoints) {
    lifetimeTax  += dp.taxA + dp.taxB
    totalGross   += dp.grossIncomeA + dp.grossIncomeB
    lastPortfolio = dp.totalPortfolio
  }
  return {
    grossIncomeCeiling: ceiling,
    lifetimeTax,
    avgEffectiveTaxRate: totalGross > 0 ? lifetimeTax / totalGross : 0,
    totalPortfolioAtEnd: lastPortfolio,
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Run the meltdown optimizer.
 *
 * For each person that has a meltdown phase (retired AND pre-RRIF), sweeps
 * grossIncomeCeiling from $0 to oasClawbackThreshold in `steps` increments,
 * holding the other person's ceiling at $0 for that sweep.
 *
 * @param state        Effective AppState (whatIfs already merged in).
 * @param rateSchedule Optional rate schedule from the active market profile.
 * @param options.steps Number of sweep intervals (default 40 → 41 data points).
 */
export function runMeltdownOptimizer(
  state: AppState,
  rateSchedule: number[] | undefined,
  options: { steps?: number } = {},
): MeltdownOptimizerResult {
  const steps = options.steps ?? 40

  // ── Determine meltdown phase years per person ────────────────────────────
  const aRetireYear    = getYear(state.personA.retirementDate)
  const aRrifYear      = getYear(state.rrspA.rrifConversionDate)
  const aDeathYear     = getYear(dateAtDecimalAge(state.personA.birthDate, state.personA.planningEndAge))
  const meltdownYearsA = getMeltdownYears(aRetireYear, aRrifYear, aDeathYear)

  const bRetireYear    = getYear(state.personB.retirementDate)
  const bRrifYear      = getYear(state.rrspB.rrifConversionDate)
  const bDeathYear     = getYear(dateAtDecimalAge(state.personB.birthDate, state.personB.planningEndAge))
  const meltdownYearsB = getMeltdownYears(bRetireYear, bRrifYear, bDeathYear)

  const hasMeltdownA = meltdownYearsA.length > 0
  const hasMeltdownB = meltdownYearsB.length > 0

  // ── Reference thresholds from taxSettings (today's $) ───────────────────
  const { oasClawbackThreshold, oasClawbackRate } = state.taxSettings
  const federalBrackets = state.taxSettings.federalBrackets
  const federalBracket1 = federalBrackets[0]?.upTo ?? 0
  const federalBracket2 = federalBrackets[1]?.upTo ?? 0

  // Full OAS clawback income per person — the sweep extends here so the chart
  // shows whether the tax minimum falls inside or outside the clawback zone.
  const fullClawbackA = fullClawbackIncome(
    state.oasA, state.personA.birthDate, oasClawbackThreshold, oasClawbackRate,
  )
  const fullClawbackB = fullClawbackIncome(
    state.oasB, state.personB.birthDate, oasClawbackThreshold, oasClawbackRate,
  )

  // ── Baseline run (ceiling = 0 for both) — used to compute income floors ─
  const baseState               = forceSpendGapCeilings(state, 0, 0)
  const { dataPoints: baseDPs } = runProjection(baseState, rateSchedule)
  const incomeFloorA            = computeIncomeFloor(baseDPs, meltdownYearsA, 'A')
  const incomeFloorB            = computeIncomeFloor(baseDPs, meltdownYearsB, 'B')

  // ── Dynamic sweep ─────────────────────────────────────────────────────────
  // Step size gives `steps` points across the full-clawback range; the same
  // increment continues past it.  Hard cap = 3 × full-clawback income.
  // Sweep stops early when RISING_CONFIRMATION consecutive points all sit
  // above the running minimum — the curve has clearly turned and stayed up.
  const RISING_CONFIRMATION = 5

  function dynamicSweep(
    fullClawback: number,
    runFn: (ceiling: number) => MeltdownSweepPoint,
  ): { sweep: MeltdownSweepPoint[]; atBoundary: boolean } {
    const step    = Math.max(1000, Math.round(fullClawback / steps))
    const hardCap = fullClawback * 3

    const sweep: MeltdownSweepPoint[] = []
    let minTax           = Infinity
    let consecutiveAbove = 0

    for (let ceiling = 0; ceiling <= hardCap; ceiling += step) {
      const pt = runFn(Math.round(ceiling))
      sweep.push(pt)

      if (pt.lifetimeTax <= minTax) {
        minTax           = pt.lifetimeTax
        consecutiveAbove = 0
      } else {
        consecutiveAbove++
        if (consecutiveAbove >= RISING_CONFIRMATION) {
          return { sweep, atBoundary: false }
        }
      }
    }

    return { sweep, atBoundary: true }
  }

  const sweepA: MeltdownSweepPoint[] = []
  const sweepB: MeltdownSweepPoint[] = []
  let optimalAtBoundaryA = false
  let optimalAtBoundaryB = false

  if (hasMeltdownA) {
    const { sweep, atBoundary } = dynamicSweep(fullClawbackA, ceiling => {
      const { dataPoints } = runProjection(forceSpendGapCeilings(state, ceiling, 0), rateSchedule)
      return buildSweepPoint(ceiling, dataPoints)
    })
    sweepA.push(...sweep)
    optimalAtBoundaryA = atBoundary
  }

  if (hasMeltdownB) {
    const { sweep, atBoundary } = dynamicSweep(fullClawbackB, ceiling => {
      const { dataPoints } = runProjection(forceSpendGapCeilings(state, 0, ceiling), rateSchedule)
      return buildSweepPoint(ceiling, dataPoints)
    })
    sweepB.push(...sweep)
    optimalAtBoundaryB = atBoundary
  }

  const optimalCeilingA = hasMeltdownA && sweepA.length > 0
    ? sweepA.reduce((best, pt) => pt.lifetimeTax < best.lifetimeTax ? pt : best).grossIncomeCeiling
    : null
  const optimalCeilingB = hasMeltdownB && sweepB.length > 0
    ? sweepB.reduce((best, pt) => pt.lifetimeTax < best.lifetimeTax ? pt : best).grossIncomeCeiling
    : null

  return {
    sweepA, sweepB,
    optimalCeilingA, optimalCeilingB,
    optimalAtBoundaryA, optimalAtBoundaryB,
    incomeFloorA, incomeFloorB,
    meltdownYearsA, meltdownYearsB,
    hasMeltdownA, hasMeltdownB,
    oasClawbackThreshold,
    fullClawbackIncomeA: fullClawbackA,
    fullClawbackIncomeB: fullClawbackB,
    federalBracket1,
    federalBracket2,
  }
}

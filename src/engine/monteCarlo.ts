// Monte Carlo simulation — runs the projection engine N times with normally
// distributed random perturbations applied to each year's return rate.
// The active rate profile (if any) provides the mean return for each year;
// only market sequence varies. All other plan inputs (income, tax, spending,
// drawdown strategy) are held fixed.

import type { AppState } from './types'
import { runProjection, nominalReturnForAge } from './projection'
import { dateAtDecimalAge, exactAgeAt, getYear, intAgeAt, jan1 } from './dates'

// Box-Muller transform: standard normal random variable.
function randn(): number {
  let u = 0, v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
}

// Interpolating percentile on a pre-sorted array.
function pct(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0
  const idx = (p / 100) * (sorted.length - 1)
  const lo = Math.floor(idx), hi = Math.ceil(idx)
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo)
}

export interface MilestonePx {
  label: string
  year: number
  p10: number
  p25: number
  p50: number
  p75: number
  p90: number
}

export interface MonteCarloResult {
  years: number[]
  p10: number[]
  p25: number[]
  p50: number[]
  p75: number[]
  p90: number[]
  pMax: number[]
  pMin: number[]
  probabilityOfSuccess: number        // 0–1: portfolio > 0 at end of plan
  depletionPct: number                // 0–1: fraction of sims that depleted
  earliestDepletionAge: number | null // ref-person age at first depletion across all sims; null when none deplete
  medianDepletionAge: number | null   // median depletion age; null when < 5% deplete
  milestones: MilestonePx[]
  simulationCount: number
}

export function runMonteCarlo(
  state: AppState,
  baseRateSchedule: number[] | undefined,
  options: { simulations: number; volatilityPct: number },
): MonteCarloResult {
  const sigma = options.volatilityPct / 100
  const currentYear = new Date().getFullYear()

  const deathDateA = dateAtDecimalAge(state.personA.birthDate, state.personA.planningEndAge)
  const deathDateB = dateAtDecimalAge(state.personB.birthDate, state.personB.planningEndAge)
  const endYearA   = getYear(deathDateA)
  const endYearB   = getYear(deathDateB)
  const endYear    = Math.max(endYearA, endYearB)

  const refPerson    = state.ageReferencePerson === 'personB' ? state.personB : state.personA
  const refBirthDate = refPerson.birthDate
  const n            = endYear - currentYear + 1

  // Base return for each year: profile schedule if provided, else age-tiered step rates.
  const baseRates: number[] = Array.from({ length: n }, (_, i) => {
    if (baseRateSchedule && i < baseRateSchedule.length) return baseRateSchedule[i]
    return nominalReturnForAge(intAgeAt(refBirthDate, jan1(currentYear + i)), state.returnRates)
  })

  // Milestone years for the Px table.
  const retYearA = getYear(state.personA.retirementDate)
  const retYearB = getYear(state.personB.retirementDate)
  const aName    = state.personA.name || 'Person A'
  const bName    = state.personB.name || 'Person B'

  const firstDeathYear = Math.min(endYearA, endYearB)
  const lastDeathYear  = Math.max(endYearA, endYearB)
  const firstDeathName = endYearA <= endYearB ? aName : bName
  const lastDeathName  = endYearA <= endYearB ? bName : aName

  const milestoneSpecs: { label: string; year: number }[] = [
    { label: 'Today', year: currentYear },
    ...(retYearA !== retYearB
      ? [
          { label: `${retYearA <= retYearB ? aName : bName} Retires`, year: Math.min(retYearA, retYearB) },
          { label: `${retYearA <= retYearB ? bName : aName} Retires`, year: Math.max(retYearA, retYearB) },
        ]
      : [{ label: 'Both Retire', year: retYearA }]),
    ...(firstDeathYear < lastDeathYear ? [{ label: `${firstDeathName}'s Death`, year: firstDeathYear }] : []),
    { label: firstDeathYear < lastDeathYear ? `${lastDeathName}'s Death` : 'End of Plan', year: lastDeathYear },
  ].filter(m => m.year >= currentYear && m.year <= endYear)

  // Per-year portfolio value accumulator; sorted after all simulations run.
  const portfoliosByYear: number[][] = Array.from({ length: n }, () => [])
  let successCount = 0
  const depletionAges: number[] = []

  for (let sim = 0; sim < options.simulations; sim++) {
    // Perturb each year's rate with independent N(0, σ) noise; floor at −50%.
    const perturbedSchedule = baseRates.map(r => Math.max(-0.5, r + randn() * sigma))
    const { dataPoints } = runProjection(state, perturbedSchedule)

    const yearMap = new Map(dataPoints.map(dp => [dp.year, dp]))

    let depleted = false
    for (let i = 0; i < n; i++) {
      const dp  = yearMap.get(currentYear + i)
      const val = dp ? dp.totalPortfolio : 0
      portfoliosByYear[i].push(val)
      if (!depleted && val < 1000 && dp) {
        depleted = true
        depletionAges.push(exactAgeAt(refBirthDate, dp.date))
      }
    }

    const lastDp = dataPoints[dataPoints.length - 1]
    if (lastDp && lastDp.totalPortfolio > 0) successCount++
  }

  for (const arr of portfoliosByYear) arr.sort((a, b) => a - b)

  const years = Array.from({ length: n }, (_, i) => currentYear + i)

  const milestones: MilestonePx[] = milestoneSpecs.map(m => {
    const arr = portfoliosByYear[m.year - currentYear] ?? []
    return {
      label: m.label, year: m.year,
      p10: pct(arr, 10), p25: pct(arr, 25), p50: pct(arr, 50),
      p75: pct(arr, 75), p90: pct(arr, 90),
    }
  })

  depletionAges.sort((a, b) => a - b)
  const depletionPct        = depletionAges.length / options.simulations
  const earliestDepletionAge = depletionAges.length > 0 ? depletionAges[0] : null
  const medianDepletionAge   = depletionPct >= 0.05 ? pct(depletionAges, 50) : null

  return {
    years,
    p10:  portfoliosByYear.map(a => pct(a, 10)),
    p25:  portfoliosByYear.map(a => pct(a, 25)),
    p50:  portfoliosByYear.map(a => pct(a, 50)),
    p75:  portfoliosByYear.map(a => pct(a, 75)),
    p90:  portfoliosByYear.map(a => pct(a, 90)),
    pMax: portfoliosByYear.map(a => a[a.length - 1] ?? 0),
    pMin: portfoliosByYear.map(a => a[0] ?? 0),
    probabilityOfSuccess: successCount / options.simulations,
    depletionPct,
    earliestDepletionAge,
    medianDepletionAge,
    milestones,
    simulationCount: options.simulations,
  }
}

// Monte Carlo simulation — runs the projection engine N times with normally
// distributed random perturbations applied to each year's return rate.
// The active rate profile (if any) provides the mean return for each year;
// only market sequence varies. All other plan inputs (income, tax, spending,
// drawdown strategy) are held fixed.

import type { AppState } from './types'
import { runProjection, nominalReturnForAge } from './projection'
import { dateAtDecimalAge, exactAgeAt, getYear, intAgeAt, jan1 } from './dates'
import { HISTORICAL_MONTHLY_RETURNS } from './historicalData'

// Box-Muller transform: standard normal random variable.
function randn(): number {
  let u = 0, v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
}

// Student's t random variable (sum of squares of nu normals for Chi-squared)
function randt(nu: number): number {
  const z = randn()
  let v = 0
  for (let i = 0; i < nu; i++) {
    const zn = randn()
    v += zn * zn
  }
  return z / Math.sqrt(v / nu)
}

// Skewed Normal random variable
function randSkewNormal(alpha: number): number {
  const z0 = randn()
  const z1 = randn()
  const delta = alpha / Math.sqrt(1 + alpha * alpha)
  return delta * Math.abs(z0) + Math.sqrt(1 - delta * delta) * z1
}

// Standardized Student's t noise (variance = 1 for nu > 2)
function getStudentTNoise(nu: number): number {
  const t = randt(nu)
  const scale = Math.sqrt((nu - 2) / nu)
  return t * scale
}

// Standardized Skewed Normal noise (mean = 0, variance = 1)
function getSkewNormalNoise(alpha: number): number {
  const y = randSkewNormal(alpha)
  const delta = alpha / Math.sqrt(1 + alpha * alpha)
  const mean = delta * Math.sqrt(2 / Math.PI)
  const variance = 1 - (2 * delta * delta) / Math.PI
  const stdDev = Math.sqrt(variance)
  return (y - mean) / stdDev
}

// Generalized noise sampler
function getNoise(
  distribution: 'normal' | 'student_t' | 'skewed_normal',
  degreesOfFreedom: number,
  skewness: number
): number {
  switch (distribution) {
    case 'student_t':
      return getStudentTNoise(Math.max(3, Math.round(degreesOfFreedom)))
    case 'skewed_normal':
      return getSkewNormalNoise(skewness)
    case 'normal':
    default:
      return randn()
  }
}

// Group and compound monthly equity/bond returns into calendar year annual returns for a given allocation mix.
export function getHistoricalAnnualReturns(equityWeight: number, startYear?: number): number[] {
  const bondWeight = 1.0 - equityWeight
  const returnsByYear: { [year: number]: number[] } = {}
  const limitYear = startYear ?? 1871
  
  for (const r of HISTORICAL_MONTHLY_RETURNS) {
    if (r.year >= limitYear) {
      if (!returnsByYear[r.year]) {
        returnsByYear[r.year] = []
      }
      returnsByYear[r.year].push(equityWeight * r.equity + bondWeight * r.bond)
    }
  }
  
  const annualReturns: number[] = []
  for (const yearStr in returnsByYear) {
    const year = parseInt(yearStr)
    const monthlyReturns = returnsByYear[year]
    
    // Only include complete calendar years (12 months)
    if (monthlyReturns.length === 12) {
      let compounded = 1.0
      for (const mRet of monthlyReturns) {
        compounded *= (1.0 + mRet)
      }
      annualReturns.push(compounded - 1.0)
    }
  }
  return annualReturns
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

export interface MonteCarloOptions {
  method: 'traditional' | 'reduced' | 'dynamic' | 'simple_bootstrap' | 'block_bootstrap' | 'regime'
  simulations: number
  volatilityPct: number
  distribution?: 'normal' | 'student_t' | 'skewed_normal'
  degreesOfFreedom?: number
  skewness?: number
  cmaReductionPct?: number
  dynamicCmaInitialReductionPct?: number
  dynamicCmaDecayYears?: number
  equityAllocationPct?: number
  historicalStartYear?: number
  bootstrapBlockSize?: number
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
  options: MonteCarloOptions,
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
  const rawBaseRates: number[] = Array.from({ length: n }, (_, i) => {
    if (baseRateSchedule && i < baseRateSchedule.length) return baseRateSchedule[i]
    return nominalReturnForAge(intAgeAt(refBirthDate, jan1(currentYear + i)), state.returnRates)
  })

  // Apply CMA reduction if applicable (constant or linear decay)
  const baseRates = rawBaseRates.map((r, i) => {
    if (options.method === 'reduced') {
      const reduction = (options.cmaReductionPct ?? 0) / 100
      return r - reduction
    } else if (options.method === 'dynamic') {
      const initialReduction = (options.dynamicCmaInitialReductionPct ?? 0) / 100
      const decayYears = Math.max(1, options.dynamicCmaDecayYears ?? 10)
      const reduction = Math.max(0, initialReduction * (1 - i / decayYears))
      return r - reduction
    }
    return r
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

  const distribution = options.distribution ?? 'normal'
  const degreesOfFreedom = options.degreesOfFreedom ?? 4
  const skewness = options.skewness ?? -1.5

  // Pre-calculate annual returns if bootstrapping
  const isBootstrap = options.method === 'simple_bootstrap' || options.method === 'block_bootstrap'
  const eqWeight = (options.equityAllocationPct ?? 60) / 100
  const histAnnualReturns = isBootstrap ? getHistoricalAnnualReturns(eqWeight, options.historicalStartYear) : []

  for (let sim = 0; sim < options.simulations; sim++) {
    // Generate rate schedule: either by drawing from historical returns or perturbing baseRates
    let perturbedSchedule: number[]
    if (isBootstrap) {
      const blockSize = options.method === 'simple_bootstrap' ? 1 : Math.max(1, options.bootstrapBlockSize ?? 5)
      perturbedSchedule = []
      let blockRemaining = 0
      let currentIdx = 0
      
      for (let y = 0; y < n; y++) {
        if (blockRemaining === 0) {
          const maxStartIdx = Math.max(0, histAnnualReturns.length - blockSize)
          currentIdx = Math.floor(Math.random() * (maxStartIdx + 1))
          blockRemaining = blockSize
        }
        if (currentIdx >= histAnnualReturns.length) {
          currentIdx = Math.floor(Math.random() * histAnnualReturns.length)
        }
        const draw = histAnnualReturns[currentIdx]
        perturbedSchedule.push(Math.max(-0.5, draw))
        currentIdx++
        blockRemaining--
      }
    } else {
      perturbedSchedule = baseRates.map(r => {
        const noise = getNoise(distribution, degreesOfFreedom, skewness)
        return Math.max(-0.5, r + noise * sigma)
      })
    }
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

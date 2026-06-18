import type { AppState } from './types'
import { runProjection } from './projection'
import { dateAtDecimalAge, getYear, exactAgeAt } from './dates'
import { HISTORICAL_MONTHLY_RETURNS } from './historicalData'

export interface HistoricalAnalysisOptions {
  equityAllocationPct: number
  historicalStartYear: number
  resolution: 'annual' | 'monthly'
}

export interface HistoricalPathResult {
  startYear: number
  startMonth: number
  label: string
  years: number[]
  portfolioBalances: number[]
  depleted: boolean
  depletionAge: number | null
  finalBalance: number;
}

export interface HistoricalAnalysisResult {
  paths: HistoricalPathResult[]
  successRate: number
  bestYearLabel: string
  bestYearBalance: number
  worstYearLabel: string
  worstYearBalance: number
  medianFinalBalance: number
  depletionCount: number
  totalCount: number
}

export function runHistoricalAnalysis(
  state: AppState,
  options: HistoricalAnalysisOptions
): HistoricalAnalysisResult {
  const currentYear = new Date().getFullYear()

  const deathDateA = dateAtDecimalAge(state.personA.birthDate, state.personA.planningEndAge)
  const deathDateB = dateAtDecimalAge(state.personB.birthDate, state.personB.planningEndAge)
  const endYearA   = getYear(deathDateA)
  const endYearB   = getYear(deathDateB)
  const endYear    = Math.max(endYearA, endYearB)

  const refPerson    = state.ageReferencePerson === 'personB' ? state.personB : state.personA
  const refBirthDate = refPerson.birthDate
  const n            = endYear - currentYear + 1

  const eqWeight = options.equityAllocationPct / 100
  const bondWeight = 1.0 - eqWeight

  // Filter monthly returns by historicalStartYear
  const filteredReturns = HISTORICAL_MONTHLY_RETURNS.filter(r => r.year >= options.historicalStartYear)

  // We need exactly n * 12 months for a full plan sequence
  const monthsNeeded = n * 12
  const paths: HistoricalPathResult[] = []

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  for (let startIdx = 0; startIdx <= filteredReturns.length - monthsNeeded; startIdx++) {
    const startItem = filteredReturns[startIdx]
    
    // If annual resolution, only start in January (month === 1)
    if (options.resolution === 'annual' && startItem.month !== 1) {
      continue
    }

    // Construct nominal rate schedule of length n
    const schedule: number[] = []
    for (let y = 0; y < n; y++) {
      let compounded = 1.0
      for (let m = 0; m < 12; m++) {
        const r = filteredReturns[startIdx + y * 12 + m]
        const monthlyRet = eqWeight * r.equity + bondWeight * r.bond
        compounded *= (1.0 + monthlyRet)
      }
      schedule.push(compounded - 1.0)
    }

    const { dataPoints } = runProjection(state, schedule)

    const balances = dataPoints.map(dp => dp.totalPortfolio)
    const years = dataPoints.map(dp => dp.year)

    let depleted = false
    let depletionAge: number | null = null

    for (const dp of dataPoints) {
      if (dp.totalPortfolio < 1000) {
        depleted = true
        // Calculate exact age at this point
        const exactAge = Math.floor(exactAgeAt(refBirthDate, dp.date))
        depletionAge = exactAge
        break
      }
    }

    const finalBalance = balances[balances.length - 1] ?? 0
    const label = options.resolution === 'annual' 
      ? `${startItem.year}` 
      : `${monthNames[startItem.month - 1]} ${startItem.year}`

    paths.push({
      startYear: startItem.year,
      startMonth: startItem.month,
      label,
      years,
      portfolioBalances: balances,
      depleted,
      depletionAge,
      finalBalance,
    })
  }

  if (paths.length === 0) {
    return {
      paths: [],
      successRate: 0,
      bestYearLabel: 'N/A',
      bestYearBalance: 0,
      worstYearLabel: 'N/A',
      worstYearBalance: 0,
      medianFinalBalance: 0,
      depletionCount: 0,
      totalCount: 0
    }
  }

  const successCount = paths.filter(p => !p.depleted).length
  const successRate = successCount / paths.length

  // Find best and worst paths by final balance
  let bestPath = paths[0]
  let worstPath = paths[0]
  for (const p of paths) {
    if (p.finalBalance > bestPath.finalBalance) {
      bestPath = p
    }
    if (p.finalBalance < worstPath.finalBalance) {
      worstPath = p
    }
  }

  // Compute median final balance
  const sortedFinalBalances = paths.map(p => p.finalBalance).sort((a, b) => a - b)
  const mid = Math.floor(sortedFinalBalances.length / 2)
  const medianFinalBalance = sortedFinalBalances.length % 2 !== 0
    ? sortedFinalBalances[mid]
    : (sortedFinalBalances[mid - 1] + sortedFinalBalances[mid]) / 2

  return {
    paths,
    successRate,
    bestYearLabel: bestPath.label,
    bestYearBalance: bestPath.finalBalance,
    worstYearLabel: worstPath.label,
    worstYearBalance: worstPath.finalBalance,
    medianFinalBalance,
    depletionCount: paths.length - successCount,
    totalCount: paths.length
  }
}

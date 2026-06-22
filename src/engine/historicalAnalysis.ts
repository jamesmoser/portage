import type { AppState, MonthlyDataPoint, AnnualDataPoint } from './types'
import { runProjection } from './projection'
import { dateAtDecimalAge, getYear, exactAgeAt, intAgeAt } from './dates'
import { getDatasetById } from './datasets'

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

  const dataset = getDatasetById(state.activeDatasetId || 'us_shiller')
  const userInflation = state.personalInflationRatePct / 100

  const paths: HistoricalPathResult[] = []
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  if (dataset.resolution === 'monthly') {
    const data = dataset.data as MonthlyDataPoint[]
    const filteredReturns = data.filter(r => r.year >= options.historicalStartYear)

    // We need exactly n * 12 months for a full plan sequence
    const monthsNeeded = n * 12

    for (let startIdx = 0; startIdx <= filteredReturns.length - monthsNeeded; startIdx++) {
      const startItem = filteredReturns[startIdx]
      
      // If annual resolution, only start in January (month === 1)
      if (options.resolution === 'annual' && startItem.month !== 1) {
        continue
      }

      // Construct nominal rate schedule of length n, adjusted for historical CPI inflation
      // to map real returns correctly into the projection engine's constant personal inflation rate.
      const schedule: number[] = []

      for (let y = 0; y < n; y++) {
        let compoundedReal = 1.0
        for (let m = 0; m < 12; m++) {
          const item = filteredReturns[startIdx + y * 12 + m]
          
          // Find index in master list to get previous month's CPI for inflation calculation
          const masterIdx = data.findIndex(r => r.year === item.year && r.month === item.month)
          const prevItem = masterIdx > 0 ? data[masterIdx - 1] : item
          
          const monthlyNomRet = eqWeight * item.equity + bondWeight * item.bond
          const monthlyInfl = prevItem.cpi > 0 ? (item.cpi - prevItem.cpi) / prevItem.cpi : 0
          
          // Compounded real return of this month: (1 + nominal) / (1 + inflation)
          compoundedReal *= (1.0 + monthlyNomRet) / (1.0 + monthlyInfl)
        }
        
        // Re-inflate by the user's constant personal inflation rate so that the real return remains unchanged
        const adjustedAnnualReturn = compoundedReal * (1.0 + userInflation) - 1.0
        schedule.push(adjustedAnnualReturn)
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
  } else {
    // Annual resolution (like global_jst)
    const data = dataset.data as AnnualDataPoint[]
    const filteredReturns = data.filter(r => r.year >= options.historicalStartYear)

    // We need exactly n years for a full plan sequence
    const yearsNeeded = n

    for (let startIdx = 0; startIdx <= filteredReturns.length - yearsNeeded; startIdx++) {
      const startItem = filteredReturns[startIdx]
      const schedule: number[] = []

      for (let y = 0; y < n; y++) {
        const item = filteredReturns[startIdx + y]
        const annualNomRet = eqWeight * item.equity + bondWeight * item.bond
        const annualInfl = item.cpiChange
        
        const yearReal = (1.0 + annualNomRet) / (1.0 + annualInfl)
        const adjustedAnnualReturn = yearReal * (1.0 + userInflation) - 1.0
        schedule.push(adjustedAnnualReturn)
      }

      const { dataPoints } = runProjection(state, schedule)

      const balances = dataPoints.map(dp => dp.totalPortfolio)
      const years = dataPoints.map(dp => dp.year)

      let depleted = false
      let depletionAge: number | null = null

      for (const dp of dataPoints) {
        if (dp.totalPortfolio < 1000) {
          depleted = true
          const exactAge = Math.floor(exactAgeAt(refBirthDate, dp.date))
          depletionAge = exactAge
          break
        }
      }

      const finalBalance = balances[balances.length - 1] ?? 0
      const label = `${startItem.year}`

      paths.push({
        startYear: startItem.year,
        startMonth: 1,
        label,
        years,
        portfolioBalances: balances,
        depleted,
        depletionAge,
        finalBalance,
      })
    }
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

export interface SpendingSweepPoint {
  spending: number
  successRate: number
}

export function runSpendingSweep(
  state: AppState,
  options: Omit<HistoricalAnalysisOptions, 'resolution'> & { resolution?: 'annual' | 'monthly' }
): { points: SpendingSweepPoint[], currentSpending: number, currentSuccessRate: number } {
  // Find the first retirement phase amount as reference, or average of non-zero retirement phases
  const retPhases = state.spendingPhases.filter(p => p.annualAmount > 0)
  const refSpend = retPhases.length > 0 ? retPhases[0].annualAmount : 50000

  // Sweep from 0.4 * base rounded down to nearest $10K, to 2x * base rounded up to nearest $10K, in $10K increments
  const sweepMin = Math.max(10000, Math.floor((refSpend * 0.4) / 10000) * 10000)
  const sweepMax = Math.max(100000, Math.ceil((refSpend * 2.0) / 10000) * 10000)
  const step = 10000

  const points: SpendingSweepPoint[] = []

  const currentYear = new Date().getFullYear()
  const deathDateA = dateAtDecimalAge(state.personA.birthDate, state.personA.planningEndAge)
  const deathDateB = dateAtDecimalAge(state.personB.birthDate, state.personB.planningEndAge)
  const endYearA   = getYear(deathDateA)
  const endYearB   = getYear(deathDateB)
  const endYear    = Math.max(endYearA, endYearB)
  const n            = endYear - currentYear + 1

  const eqWeight = options.equityAllocationPct / 100
  const bondWeight = 1.0 - eqWeight

  const dataset = getDatasetById(state.activeDatasetId || 'us_shiller')
  const userInflation = state.personalInflationRatePct / 100

  const schedules: number[][] = []

  if (dataset.resolution === 'monthly') {
    const data = dataset.data as MonthlyDataPoint[]
    const filteredReturns = data.filter(r => r.year >= options.historicalStartYear)
    const monthsNeeded = n * 12
    const resolution = options.resolution ?? 'annual'

    for (let startIdx = 0; startIdx <= filteredReturns.length - monthsNeeded; startIdx++) {
      const startItem = filteredReturns[startIdx]
      if (resolution === 'annual' && startItem.month !== 1) {
        continue
      }

      const schedule: number[] = []
      for (let y = 0; y < n; y++) {
        let compoundedReal = 1.0
        for (let m = 0; m < 12; m++) {
          const item = filteredReturns[startIdx + y * 12 + m]
          const masterIdx = data.findIndex(r => r.year === item.year && r.month === item.month)
          const prevItem = masterIdx > 0 ? data[masterIdx - 1] : item
          const monthlyNomRet = eqWeight * item.equity + bondWeight * item.bond
          const monthlyInfl = prevItem.cpi > 0 ? (item.cpi - prevItem.cpi) / prevItem.cpi : 0
          compoundedReal *= (1.0 + monthlyNomRet) / (1.0 + monthlyInfl)
        }
        schedule.push(compoundedReal * (1.0 + userInflation) - 1.0)
      }
      schedules.push(schedule)
    }
  } else {
    // Annual resolution
    const data = dataset.data as AnnualDataPoint[]
    const filteredReturns = data.filter(r => r.year >= options.historicalStartYear)
    const yearsNeeded = n

    for (let startIdx = 0; startIdx <= filteredReturns.length - yearsNeeded; startIdx++) {
      const schedule: number[] = []
      for (let y = 0; y < n; y++) {
        const item = filteredReturns[startIdx + y]
        const annualNomRet = eqWeight * item.equity + bondWeight * item.bond
        const annualInfl = item.cpiChange
        const yearReal = (1.0 + annualNomRet) / (1.0 + annualInfl)
        schedule.push(yearReal * (1.0 + userInflation) - 1.0)
      }
      schedules.push(schedule)
    }
  }

  // Pre-calculate retirement age and base state overrides
  const firstRetirementDate = state.personA.retirementDate <= state.personB.retirementDate
    ? state.personA.retirementDate
    : state.personB.retirementDate
  const refPerson = state.ageReferencePerson === 'personB' ? state.personB : state.personA
  const retirementAgeForRef = intAgeAt(refPerson.birthDate, firstRetirementDate)

  // Run sweep
  for (let sVal = sweepMin; sVal <= sweepMax; sVal += step) {
    let tempState: AppState = {
      ...state,
      spendingPhases: [
        {
          id: 'flat-override',
          label: 'Flat Retirement Spending',
          startAge: retirementAgeForRef,
          annualAmount: sVal,
          growthRatePct: 0
        }
      ],
      additionalSpending: [] // Clear lumpy expenses for a clean baseline sweep
    }

    if (tempState.withdrawalStrategy.drawdownStrategy === 'none') {
      tempState = {
        ...tempState,
        withdrawalStrategy: {
          ...tempState.withdrawalStrategy,
          drawdownStrategy: 'spendGap'
        }
      }
    }

    let successCount = 0
    for (const schedule of schedules) {
      const { dataPoints } = runProjection(tempState, schedule)
      let depleted = false
      for (const dp of dataPoints) {
        if (dp.totalPortfolio < 1000) {
          depleted = true
          break
        }
      }
      if (!depleted) successCount++
    }

    points.push({
      spending: sVal,
      successRate: schedules.length > 0 ? successCount / schedules.length : 0
    })
  }

  // Calculate success rate of the user's current actual configured plan as a reference
  let currentSuccessCount = 0
  let currentRefState = state
  if (currentRefState.withdrawalStrategy.drawdownStrategy === 'none') {
    currentRefState = {
      ...currentRefState,
      withdrawalStrategy: {
        ...currentRefState.withdrawalStrategy,
        drawdownStrategy: 'spendGap'
      }
    }
  }

  for (const schedule of schedules) {
    const { dataPoints } = runProjection(currentRefState, schedule)
    let depleted = false
    for (const dp of dataPoints) {
      if (dp.totalPortfolio < 1000) {
        depleted = true
        break
      }
    }
    if (!depleted) currentSuccessCount++
  }
  const currentSuccessRate = schedules.length > 0 ? currentSuccessCount / schedules.length : 0

  return {
    points,
    currentSpending: refSpend,
    currentSuccessRate
  }
}

export function interpolateMonotoneCubic(x: number[], y: number[], targetPointsCount = 100): { x: number[], y: number[] } {
  const n = x.length;
  if (n < 2) return { x: [...x], y: [...y] };
  if (n === 2) {
    const newX: number[] = [];
    const newY: number[] = [];
    for (let i = 0; i < targetPointsCount; i++) {
      const t = i / (targetPointsCount - 1);
      newX.push(x[0] + t * (x[1] - x[0]));
      newY.push(y[0] + t * (y[1] - y[0]));
    }
    return { x: newX, y: newY };
  }

  // 1. Compute secants
  const secants: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    secants.push((y[i + 1] - y[i]) / (x[i + 1] - x[i]));
  }

  // 2. Initialize tangents at nodes
  const tangents: number[] = [];
  tangents.push(secants[0]);
  for (let i = 1; i < n - 1; i++) {
    if (secants[i - 1] * secants[i] <= 0) {
      tangents.push(0);
    } else {
      const w1 = x[i + 1] - x[i];
      const w2 = x[i] - x[i - 1];
      const w = w1 + w2;
      tangents.push((3 * w) / ((w + w1) / secants[i - 1] + (w + w2) / secants[i]));
    }
  }
  tangents.push(secants[n - 2]);

  // 3. Adjust tangents to ensure monotonicity (Fritsch-Butland method)
  for (let i = 0; i < n - 1; i++) {
    if (secants[i] === 0) {
      tangents[i] = 0;
      tangents[i + 1] = 0;
    } else {
      const alpha = tangents[i] / secants[i];
      const beta = tangents[i + 1] / secants[i];
      const squareSum = alpha * alpha + beta * beta;
      if (squareSum > 9) {
        const tau = 3 / Math.sqrt(squareSum);
        tangents[i] = tau * alpha * secants[i];
        tangents[i + 1] = tau * beta * secants[i];
      }
    }
  }

  // 4. Generate interpolated points
  const newX: number[] = [];
  const newY: number[] = [];
  const minX = x[0];
  const maxX = x[n - 1];
  const span = maxX - minX;

  for (let step = 0; step < targetPointsCount; step++) {
    const xVal = minX + (step / (targetPointsCount - 1)) * span;
    newX.push(xVal);

    let idx = 0;
    for (let i = 0; i < n - 1; i++) {
      if (xVal >= x[i] && (i === n - 2 ? xVal <= x[i + 1] : xVal < x[i + 1])) {
        idx = i;
        break;
      }
    }

    const x0 = x[idx];
    const x1 = x[idx + 1];
    const h = x1 - x0;
    const t = h === 0 ? 0 : (xVal - x0) / h;

    const y0 = y[idx];
    const y1 = y[idx + 1];
    const m0 = tangents[idx];
    const m1 = tangents[idx + 1];

    const h00 = 2 * t * t * t - 3 * t * t + 1;
    const h10 = t * t * t - 2 * t * t + t;
    const h01 = -2 * t * t * t + 3 * t * t;
    const h11 = t * t * t - t * t;

    const yVal = h00 * y0 + h10 * h * m0 + h01 * y1 + h11 * h * m1;
    newY.push(Math.max(0, Math.min(100, yVal)));
  }

  return { x: newX, y: newY };
}


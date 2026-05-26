// What-if merge and headline metrics computation.

import type { AppState, WhatIfs, HeadlineMetrics, DataPoint } from './types'
import { dateAtAge, dateAtDecimalAge, deathDate, getYear, onOrAfter, parseDate, formatDate } from './dates'

// Snap an ISO date to the first of the nearest month.
function snapToMonthStart(dateStr: string): string {
  const d = parseDate(dateStr)
  if (d.getDate() >= 15) {
    return formatDate(new Date(d.getFullYear(), d.getMonth() + 1, 1))
  }
  return formatDate(new Date(d.getFullYear(), d.getMonth(), 1))
}

// Shift an ISO date string by deltaMs milliseconds.
function shiftDateMs(dateStr: string, deltaMs: number): string {
  return formatDate(new Date(parseDate(dateStr).getTime() + deltaMs))
}

// Return the earlier of two ISO date strings.
function minDate(a: string, b: string): string {
  return a <= b ? a : b
}

// ─── mergeWhatIfs ─────────────────────────────────────────────────────────────
// Applies all enabled what-if overrides to the base plan and returns a modified
// AppState. The engine runs on the merged state; the base plan is unchanged.

export function mergeWhatIfs(base: AppState, wi: WhatIfs): AppState {
  let s = base

  if (wi.returnRateOffset.enabled && wi.returnRateOffset.value !== 0) {
    const d = wi.returnRateOffset.value
    s = {
      ...s, returnRates: {
        upTo55:     s.returnRates.upTo55     + d,
        from55to65: s.returnRates.from55to65 + d,
        from65to70: s.returnRates.from65to70 + d,
        from70plus: s.returnRates.from70plus + d,
      },
    }
  }

  if (wi.inflationRate.enabled) {
    s = { ...s, personalInflationRatePct: wi.inflationRate.value }
  }

  if (wi.cpiRate?.enabled) {
    s = { ...s, cpiRatePct: wi.cpiRate.value }
  }

  if (wi.longevityA.enabled) {
    s = { ...s, personA: { ...s.personA, planningEndAge: wi.longevityA.value } }
  }

  if (wi.longevityB.enabled) {
    s = { ...s, personB: { ...s.personB, planningEndAge: wi.longevityB.value } }
  }

  if (wi.cppStartAgeA.enabled) {
    const date = dateAtAge(s.personA.birthDate, wi.cppStartAgeA.value)
    s = { ...s, cppA: { ...s.cppA, startDate: date } }
  }

  if (wi.cppStartAgeB.enabled) {
    const date = dateAtAge(s.personB.birthDate, wi.cppStartAgeB.value)
    s = { ...s, cppB: { ...s.cppB, startDate: date } }
  }

  if (wi.oasStartAgeA.enabled) {
    const date = dateAtAge(s.personA.birthDate, wi.oasStartAgeA.value)
    s = { ...s, oasA: { ...s.oasA, startDate: date } }
  }

  if (wi.oasStartAgeB.enabled) {
    const date = dateAtAge(s.personB.birthDate, wi.oasStartAgeB.value)
    s = { ...s, oasB: { ...s.oasB, startDate: date } }
  }

  if (wi.withdrawalOrder.enabled) {
    s = { ...s, withdrawalStrategy: { ...s.withdrawalStrategy, withdrawalOrder: wi.withdrawalOrder.value } }
  }

  if (wi.pensionSplit.enabled) {
    s = {
      ...s, withdrawalStrategy: {
        ...s.withdrawalStrategy,
        pensionSplitMode: wi.pensionSplit.value.mode,
        pensionSplitPct:  wi.pensionSplit.value.pct,
      },
    }
  }

  if (wi.drawdownStrategy.enabled && wi.drawdownStrategy.value.strategyType !== 'none') {
    const ds = wi.drawdownStrategy.value
    s = {
      ...s, withdrawalStrategy: {
        ...s.withdrawalStrategy,
        drawdownStrategy:        ds.strategyType,
        drawdownFixedPct:        ds.fixedPct,
        drawdownFixedWithdrawal: ds.fixedWithdrawal,
      },
    }
  }

  // ── Retirement date — Person A ──────────────────────────────────────────────
  if (wi.retirementA?.enabled) {
    const cfg       = wi.retirementA.value
    const newDate   = snapToMonthStart(dateAtDecimalAge(s.personA.birthDate, cfg.retirementAge))
    const deltaMs   = parseDate(newDate).getTime() - parseDate(s.personA.retirementDate).getTime()
    const deadlineA = deathDate(s.personA.birthDate, s.personA.planningEndAge)
    s = { ...s, personA: { ...s.personA, retirementDate: newDate } }
    if (cfg.cascadePension && s.dbPensionA.enabled) {
      s = { ...s, dbPensionA: { ...s.dbPensionA, startDate: newDate } }
    }
    if (cfg.cascadeRrsp) {
      s = { ...s, rrspA: { ...s.rrspA,
        contributionEndDate:         minDate(shiftDateMs(s.rrspA.contributionEndDate,         deltaMs), deadlineA),
        spousalLastContributionDate: minDate(shiftDateMs(s.rrspA.spousalLastContributionDate, deltaMs), deadlineA),
      }}
    }
    if (cfg.cascadeTfsa) {
      s = { ...s, tfsaA: { ...s.tfsaA, contributionEndDate: minDate(shiftDateMs(s.tfsaA.contributionEndDate, deltaMs), deadlineA) } }
    }
    if (cfg.cascadeNonReg) {
      s = { ...s, nonRegA: { ...s.nonRegA, contributionEndDate: minDate(shiftDateMs(s.nonRegA.contributionEndDate, deltaMs), deadlineA) } }
    }
  }

  // ── Retirement date — Person B ──────────────────────────────────────────────
  if (wi.retirementB?.enabled) {
    const cfg       = wi.retirementB.value
    const newDate   = snapToMonthStart(dateAtDecimalAge(s.personB.birthDate, cfg.retirementAge))
    const deltaMs   = parseDate(newDate).getTime() - parseDate(s.personB.retirementDate).getTime()
    const deadlineB = deathDate(s.personB.birthDate, s.personB.planningEndAge)
    s = { ...s, personB: { ...s.personB, retirementDate: newDate } }
    if (cfg.cascadePension && s.dbPensionB.enabled) {
      s = { ...s, dbPensionB: { ...s.dbPensionB, startDate: newDate } }
    }
    if (cfg.cascadeRrsp) {
      s = { ...s, rrspB: { ...s.rrspB,
        contributionEndDate:         minDate(shiftDateMs(s.rrspB.contributionEndDate,         deltaMs), deadlineB),
        spousalLastContributionDate: minDate(shiftDateMs(s.rrspB.spousalLastContributionDate, deltaMs), deadlineB),
      }}
    }
    if (cfg.cascadeTfsa) {
      s = { ...s, tfsaB: { ...s.tfsaB, contributionEndDate: minDate(shiftDateMs(s.tfsaB.contributionEndDate, deltaMs), deadlineB) } }
    }
    if (cfg.cascadeNonReg) {
      s = { ...s, nonRegB: { ...s.nonRegB, contributionEndDate: minDate(shiftDateMs(s.nonRegB.contributionEndDate, deltaMs), deadlineB) } }
    }
  }

  return s
}

// ─── computeHeadlineMetrics ───────────────────────────────────────────────────


export function computeHeadlineMetrics(
  dataPoints: DataPoint[],
  _ageReferencePerson: 'personA' | 'personB',
  state: AppState,
): HeadlineMetrics {
  const currentYear = new Date().getFullYear()
  const pi  = state.personalInflationRatePct / 100
  const cpi = state.cpiRatePct / 100

  const zero: HeadlineMetrics = {
    portfolioAtStart: 0, peakPortfolio: 0, peakPortfolioYear: currentYear,
    portfolioAtRetirementA: 0, portfolioAtRetirementB: 0,
    portfolioAtDeathA: 0, portfolioAtDeathB: 0,
    shortfallYears: 0, totalYears: 0, shortfallPct: 0,
    avgAnnualShortfall: 0, peakAnnualShortfall: 0, peakShortfallYear: 0,
    lifetimeTaxPaid: 0, avgEffectiveTaxRate: 0, peakTaxYear: 0, peakTaxAmount: 0,
    totalCPPCollected: 0, totalOASCollected: 0, totalOASClawback: 0,
    oasClawbackYears: 0, oasClawbackPct: 0, cppVs65: 0, oasVs65: 0,
  }
  if (dataPoints.length === 0) return zero

  // Planning-end years for each person
  const endYearA = getYear(dateAtAge(state.personA.birthDate, state.personA.planningEndAge))
  const endYearB = getYear(dateAtAge(state.personB.birthDate, state.personB.planningEndAge))
  const pointAtDeathA = dataPoints.find(d => d.year === endYearA) ?? dataPoints[dataPoints.length - 1]
  const pointAtDeathB = dataPoints.find(d => d.year === endYearB) ?? dataPoints[dataPoints.length - 1]

  // Retirement years for each person
  const retirementYearA = getYear(state.personA.retirementDate)
  const retirementYearB = getYear(state.personB.retirementDate)
  const pointAtRetirementA = dataPoints.find(d => d.year === retirementYearA) ?? dataPoints[0]
  const pointAtRetirementB = dataPoints.find(d => d.year === retirementYearB) ?? dataPoints[0]

  // Portfolio
  const peakPoint = dataPoints.reduce((a, b) => b.totalPortfolio > a.totalPortfolio ? b : a)

  // Spending shortfall
  const shortfallPoints = dataPoints.filter(d => d.cashFlow < -0.01)
  const shortfallYears  = shortfallPoints.length
  const totalYears      = dataPoints.length
  const avgAnnualShortfall = shortfallYears > 0
    ? shortfallPoints.reduce((sum, d) => sum + -d.cashFlow, 0) / shortfallYears : 0
  const peakShortfallPoint = shortfallPoints.length > 0
    ? shortfallPoints.reduce((a, b) => -b.cashFlow > -a.cashFlow ? b : a) : null

  // Tax
  const lifetimeTaxPaid = dataPoints.reduce(
    (sum, d) => sum + d.taxA + d.taxB + d.oasClawbackA + d.oasClawbackB, 0)
  const totalGross = dataPoints.reduce((sum, d) => sum + d.grossIncomeA + d.grossIncomeB, 0)
  const peakTaxPoint = dataPoints.reduce((a, b) => (b.taxA + b.taxB) > (a.taxA + a.taxB) ? b : a)

  // Benefits
  const totalCPPCollected = dataPoints.reduce((sum, d) => sum + d.cppA + d.cppB, 0)
  const totalOASCollected = dataPoints.reduce((sum, d) => sum + d.oasA + d.oasB, 0)
  const totalOASClawback  = dataPoints.reduce((sum, d) => sum + d.oasClawbackA + d.oasClawbackB, 0)
  const oasClawbackYears  = dataPoints.filter(d => d.oasClawbackA + d.oasClawbackB > 0).length
  const oasActiveYears    = dataPoints.filter(d => d.oasA + d.oasB > 0).length

  // CPP / OAS timing delta vs. both people starting at age 65.
  // Positive = your start-age choice collected MORE than the age-65 baseline (timing benefited you).
  // Negative = timing cost you (e.g. deferred too long or took early and died young).
  // OAS is gross vs gross — clawback is shown separately.
  const baseCPPA = state.cppA.estimatedMonthlyAt65 * 12   // factor = 1.0 at 65
  const baseCPPB = state.cppB.estimatedMonthlyAt65 * 12
  const baseOASA = state.oasA.estimatedMonthlyAt65 * 12
  const baseOASB = state.oasB.estimatedMonthlyAt65 * 12

  const a65 = dateAtAge(state.personA.birthDate, 65)
  const b65 = dateAtAge(state.personB.birthDate, 65)
  const dA  = dateAtAge(state.personA.birthDate, state.personA.planningEndAge)
  const dB  = dateAtAge(state.personB.birthDate, state.personB.planningEndAge)

  // Count months in a year where '${year}-MM-01' falls in [startDate, endDate].
  // Mirrors the engine's monthly loop: income flows when monthDate >= startDate && <= endDate.
  function activeFrac(year: number, startDate: string, endDate: string): number {
    let count = 0
    for (let m = 1; m <= 12; m++) {
      const md = `${year}-${String(m).padStart(2, '0')}-01`
      if (md >= startDate && md <= endDate) count++
    }
    return count / 12
  }
  // Count months in a year where '${year}-MM-01' <= date (no lower bound).
  // Used to compute the post-death survivor fraction within the death year itself.
  function monthFracUpTo(year: number, date: string): number {
    let count = 0
    for (let m = 1; m <= 12; m++) {
      if (`${year}-${String(m).padStart(2, '0')}-01` <= date) count++
    }
    return count / 12
  }

  let baseCPP65 = 0, baseOAS65 = 0
  for (const d of dataPoints) {
    const pdFactor = Math.pow((1 + cpi) / (1 + pi), d.year - currentYear)
    const aAlive = d.year <= endYearA
    const bAlive = d.year <= endYearB

    // A's own CPP at 65, pro-rated for start year and death year
    if (aAlive) baseCPP65 += baseCPPA * activeFrac(d.year, a65, dA) * pdFactor
    // B's survivor CPP from A: full years after A's death
    if (!aAlive && bAlive) baseCPP65 += baseCPPA * 0.60 * activeFrac(d.year, a65, dB) * pdFactor
    // B's survivor CPP from A: partial months within A's death year (post-death months)
    if (d.year === endYearA && bAlive) {
      const survFrac = monthFracUpTo(d.year, dB) - monthFracUpTo(d.year, dA)
      if (survFrac > 0) baseCPP65 += baseCPPA * 0.60 * survFrac * pdFactor
    }

    // B's own CPP at 65, pro-rated
    if (bAlive) baseCPP65 += baseCPPB * activeFrac(d.year, b65, dB) * pdFactor
    // A's survivor CPP from B: full years after B's death
    if (!bAlive && aAlive) baseCPP65 += baseCPPB * 0.60 * activeFrac(d.year, b65, dA) * pdFactor
    // A's survivor CPP from B: partial months within B's death year (post-death months)
    if (d.year === endYearB && aAlive) {
      const survFrac = monthFracUpTo(d.year, dA) - monthFracUpTo(d.year, dB)
      if (survFrac > 0) baseCPP65 += baseCPPB * 0.60 * survFrac * pdFactor
    }

    // OAS: own collection only, pro-rated for start and death years
    if (aAlive) baseOAS65 += baseOASA * activeFrac(d.year, a65, dA) * pdFactor
    if (bAlive) baseOAS65 += baseOASB * activeFrac(d.year, b65, dB) * pdFactor
  }
  const cppVs65 = totalCPPCollected - baseCPP65
  const oasVs65 = totalOASCollected - baseOAS65

  return {
    portfolioAtStart:       dataPoints[0].totalPortfolio,
    peakPortfolio:          peakPoint.totalPortfolio,
    peakPortfolioYear:      peakPoint.year,
    portfolioAtRetirementA: pointAtRetirementA.totalPortfolio,
    portfolioAtRetirementB: pointAtRetirementB.totalPortfolio,
    portfolioAtDeathA:      pointAtDeathA.totalPortfolio,
    portfolioAtDeathB:      pointAtDeathB.totalPortfolio,

    shortfallYears,
    totalYears,
    shortfallPct:        totalYears > 0 ? shortfallYears / totalYears : 0,
    avgAnnualShortfall,
    peakAnnualShortfall: peakShortfallPoint ? -peakShortfallPoint.cashFlow : 0,
    peakShortfallYear:   peakShortfallPoint?.year ?? 0,

    lifetimeTaxPaid,
    avgEffectiveTaxRate: totalGross > 0 ? lifetimeTaxPaid / totalGross : 0,
    peakTaxYear:         peakTaxPoint.year,
    peakTaxAmount:       peakTaxPoint.taxA + peakTaxPoint.taxB,

    totalCPPCollected,
    totalOASCollected,
    totalOASClawback,
    oasClawbackYears,
    oasClawbackPct:      oasActiveYears > 0 ? oasClawbackYears / oasActiveYears : 0,
    cppVs65,
    oasVs65,
  }
}

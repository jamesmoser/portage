// What-if merge and headline metrics computation.

import type { AppState, WhatIfs, HeadlineMetrics, DataPoint } from './types'
import { dateAtAge, getYear } from './dates'

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

  let baseCPP65 = 0, baseOAS65 = 0
  for (const d of dataPoints) {
    const pdFactor = Math.pow((1 + cpi) / (1 + pi), d.year - currentYear)
    if (d.year <= endYearA && d.personAAge >= 65) { baseCPP65 += baseCPPA * pdFactor; baseOAS65 += baseOASA * pdFactor }
    if (d.year <= endYearB && d.personBAge >= 65) { baseCPP65 += baseCPPB * pdFactor; baseOAS65 += baseOASB * pdFactor }
  }
  const cppVs65 = totalCPPCollected - baseCPP65
  const oasVs65 = totalOASCollected - baseOAS65

  return {
    portfolioAtStart:    dataPoints[0].totalPortfolio,
    peakPortfolio:       peakPoint.totalPortfolio,
    peakPortfolioYear:   peakPoint.year,
    portfolioAtDeathA:   pointAtDeathA.totalPortfolio,
    portfolioAtDeathB:   pointAtDeathB.totalPortfolio,

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

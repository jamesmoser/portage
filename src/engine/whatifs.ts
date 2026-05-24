// What-if merge and headline metrics computation.

import type { AppState, WhatIfs, HeadlineMetrics, DataPoint } from './types'
import { dateAtAge } from './dates'

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

  if (wi.fixedPctStrategy.enabled) {
    const fp = wi.fixedPctStrategy.value
    s = {
      ...s, withdrawalStrategy: {
        ...s.withdrawalStrategy,
        drawdownEnabled:   true,
        drawdownRrspPct:   fp.rrspPct,
        drawdownRrspMin:   fp.rrspMin,
        drawdownTfsaPct:   fp.tfsaPct,
        drawdownTfsaMin:   fp.tfsaMin,
        drawdownNonRegPct: fp.nonRegPct,
        drawdownNonRegMin: fp.nonRegMin,
      },
    }
  }

  return s
}

// ─── computeHeadlineMetrics ───────────────────────────────────────────────────

export function computeHeadlineMetrics(
  dataPoints: DataPoint[],
  ageReferencePerson: 'personA' | 'personB',
): HeadlineMetrics {
  const empty: HeadlineMetrics = {
    planFullyFunded:     false,
    solventThroughAge:   null,
    solventThroughYear:  null,
    portfolioAtDeath:    0,
    peakPortfolio:       0,
    peakPortfolioYear:   new Date().getFullYear(),
    lifetimeTaxPaid:     0,
    avgEffectiveTaxRate: 0,
    oasClawbackYears:    0,
  }
  if (dataPoints.length === 0) return empty

  const refAge = (d: DataPoint) => ageReferencePerson === 'personB' ? d.personBAge : d.personAAge

  let lastSolventAge: number | null = null
  let lastSolventYear: number | null = null
  for (const d of dataPoints) {
    if (d.cashFlow >= 0) {
      lastSolventAge  = refAge(d)
      lastSolventYear = d.year
    }
  }
  const planFullyFunded = lastSolventYear === dataPoints[dataPoints.length - 1].year

  const peakPoint = dataPoints.reduce((a, b) => b.totalPortfolio > a.totalPortfolio ? b : a)
  const lastPoint  = dataPoints[dataPoints.length - 1]

  const lifetimeTaxPaid = dataPoints.reduce(
    (sum, d) => sum + d.taxA + d.taxB + d.oasClawbackA + d.oasClawbackB, 0)
  const totalGross = dataPoints.reduce(
    (sum, d) => sum + d.grossIncomeA + d.grossIncomeB, 0)

  return {
    planFullyFunded,
    solventThroughAge:   lastSolventAge,
    solventThroughYear:  lastSolventYear,
    portfolioAtDeath:    lastPoint.totalPortfolio,
    peakPortfolio:       peakPoint.totalPortfolio,
    peakPortfolioYear:   peakPoint.year,
    lifetimeTaxPaid,
    avgEffectiveTaxRate: totalGross > 0 ? lifetimeTaxPaid / totalGross : 0,
    oasClawbackYears:    dataPoints.filter(d => d.oasClawbackA + d.oasClawbackB > 0).length,
  }
}

// Annual projection engine — all output values in present-day (today's) dollars.
//
// Strategy:
//   1. Walk year-by-year from today to the last planning end date.
//   2. For each year, calculate nominal income from all active sources.
//   3. Calculate taxes (with optional pension splitting).
//   4. If net income < spending target, draw from accounts in configured order.
//   5. Update account balances (growth, contributions, withdrawals).
//   6. Deflate everything back to present-day dollars before storing.

import type { AppState, DataPoint, ProjectionResult } from './types'
import { jan1, getYear, exactAgeAt, intAgeAt, onOrAfter, before, dateAtAge } from './dates'
import { calculateTax, optimizePensionSplit, rrifMinFactor, type TaxInput } from './tax'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function nominalReturnForAge(age: number, rates: AppState['returnRates']): number {
  if (age < 55)  return rates.upTo55 / 100
  if (age < 65)  return rates.from55to65 / 100
  if (age < 70)  return rates.from65to70 / 100
  return rates.from70plus / 100
}

function accountReturn(overridePct: number, defaultRate: number): number {
  return overridePct > 0 ? overridePct / 100 : defaultRate
}

function grow(balance: number, rate: number): number {
  return balance * (1 + rate)
}

function toPD(nominalValue: number, personalInflation: number, yearsFromNow: number): number {
  return nominalValue / Math.pow(1 + personalInflation, yearsFromNow)
}

function cppFactor(startDate: string, birthDate: string): number {
  const age = exactAgeAt(birthDate, startDate)
  const monthsFromAge65 = (age - 65) * 12
  if (monthsFromAge65 <= 0) return Math.max(0, 1 + 0.006 * monthsFromAge65)
  return 1 + 0.007 * monthsFromAge65
}

function oasFactor(startDate: string, birthDate: string): number {
  const age = exactAgeAt(birthDate, startDate)
  if (age <= 65) return 1.0
  return Math.min(1 + 0.006 * (age - 65) * 12, 1.36)
}

// ─── Main projection ──────────────────────────────────────────────────────────

export function runProjection(state: AppState): ProjectionResult {
  const warnings: string[] = []
  const dataPoints: DataPoint[] = []

  const pi  = state.personalInflationRatePct / 100
  const cpi = state.cpiRatePct / 100
  const { taxSettings, withdrawalStrategy } = state

  const currentYear = new Date().getFullYear()
  const endYearA = getYear(dateAtAge(state.personA.birthDate, state.personA.planningEndAge))
  const endYearB = getYear(dateAtAge(state.personB.birthDate, state.personB.planningEndAge))
  const endYear  = Math.max(endYearA, endYearB)

  if (endYear <= currentYear) {
    warnings.push('Planning end dates are in the past. Check birth dates and planning end ages.')
    return { dataPoints, warnings }
  }

  // ── Mutable account balances (nominal) ───────────────────────────────────
  let rrspA     = state.rrspA.balance
  let rrspB     = state.rrspB.balance
  let tfsaA     = state.tfsaA.balance
  let tfsaB     = state.tfsaB.balance
  let nonRegA   = state.nonRegA.balance
  let nonRegB   = state.nonRegB.balance
  let nonRegAcbA = state.nonRegA.acb
  let nonRegAcbB = state.nonRegB.acb
  let hisa      = state.cash.hisaBalance + state.cash.chequingBalance

  const cppFactorA = cppFactor(state.cppA.startDate, state.personA.birthDate)
  const cppFactorB = cppFactor(state.cppB.startDate, state.personB.birthDate)
  const oasFactorA = oasFactor(state.oasA.startDate, state.personA.birthDate)
  const oasFactorB = oasFactor(state.oasB.startDate, state.personB.birthDate)

  const baseYear = currentYear

  for (let year = currentYear; year <= endYear; year++) {
    const dateStr     = jan1(year)
    const yearsFromNow = year - currentYear
    const inflFactor  = Math.pow(1 + pi,  yearsFromNow)
    const cpiFactorForYear = Math.pow(1 + cpi, yearsFromNow)

    const personAAgeExact = exactAgeAt(state.personA.birthDate, dateStr)
    const personBAgeExact = exactAgeAt(state.personB.birthDate, dateStr)
    const personAAgeInt   = intAgeAt(state.personA.birthDate, dateStr)
    const personBAgeInt   = intAgeAt(state.personB.birthDate, dateStr)

    const refAge     = state.ageReferencePerson === 'personB' ? personBAgeExact : personAAgeExact
    const nomReturn  = nominalReturnForAge(refAge, state.returnRates)

    const retiredA = onOrAfter(dateStr, state.personA.retirementDate)
    const retiredB = onOrAfter(dateStr, state.personB.retirementDate)
    const aAlive   = year <= endYearA
    const bAlive   = year <= endYearB

    // ── Employment income ────────────────────────────────────────────────────
    const empGrowthA = Math.pow(1 + state.employmentA.growthRatePct / 100, yearsFromNow)
    const empGrowthB = Math.pow(1 + state.employmentB.growthRatePct / 100, yearsFromNow)
    const empA_nom = !retiredA && aAlive ? state.employmentA.annualAmount * empGrowthA : 0
    const empB_nom = !retiredB && bAlive ? state.employmentB.annualAmount * empGrowthB : 0

    // ── DB Pension A ─────────────────────────────────────────────────────────
    const dbAActive = state.dbPensionA.enabled && aAlive && onOrAfter(dateStr, state.dbPensionA.startDate)
    let dbBase_nom = 0, dbBridge_nom = 0
    if (dbAActive) {
      const yop = yearsFromNow - Math.max(0, getYear(state.dbPensionA.startDate) - currentYear)
      const ir  = state.dbPensionA.cpiIndexed
        ? (state.dbPensionA.cpiIndexingCap > 0 ? Math.min(cpi, state.dbPensionA.cpiIndexingCap / 100) : cpi)
        : 0
      const cppIntRed = state.dbPensionA.cppIntegration && personAAgeInt >= 65
        ? state.dbPensionA.cppIntegrationAmount * Math.pow(1 + ir, Math.max(0, year - getYear(state.personA.retirementDate)))
        : 0
      dbBase_nom = Math.max(0, state.dbPensionA.annualAmount - cppIntRed) * Math.pow(1 + ir, Math.max(0, yop))
      if (before(dateStr, state.dbPensionA.bridgeBenefitEndDate) && state.dbPensionA.bridgeBenefitAmount > 0) {
        dbBridge_nom = state.dbPensionA.bridgeBenefitAmount * Math.pow(1 + ir, Math.max(0, yop))
      }
    }

    // ── DB Pension B ─────────────────────────────────────────────────────────
    const dbBActive = state.dbPensionB.enabled && bAlive && onOrAfter(dateStr, state.dbPensionB.startDate)
    let dbBaseB_nom = 0, dbBridgeB_nom = 0
    if (dbBActive) {
      const yop = yearsFromNow - Math.max(0, getYear(state.dbPensionB.startDate) - currentYear)
      const ir  = state.dbPensionB.cpiIndexed
        ? (state.dbPensionB.cpiIndexingCap > 0 ? Math.min(cpi, state.dbPensionB.cpiIndexingCap / 100) : cpi)
        : 0
      const cppIntRed = state.dbPensionB.cppIntegration && personBAgeInt >= 65
        ? state.dbPensionB.cppIntegrationAmount * Math.pow(1 + ir, Math.max(0, year - getYear(state.personB.retirementDate)))
        : 0
      dbBaseB_nom = Math.max(0, state.dbPensionB.annualAmount - cppIntRed) * Math.pow(1 + ir, Math.max(0, yop))
      if (before(dateStr, state.dbPensionB.bridgeBenefitEndDate) && state.dbPensionB.bridgeBenefitAmount > 0) {
        dbBridgeB_nom = state.dbPensionB.bridgeBenefitAmount * Math.pow(1 + ir, Math.max(0, yop))
      }
    }

    // ── CPP / OAS ────────────────────────────────────────────────────────────
    const cppA_nom = aAlive && onOrAfter(dateStr, state.cppA.startDate)
      ? state.cppA.estimatedMonthlyAt65 * 12 * cppFactorA * cpiFactorForYear : 0
    const cppB_nom = bAlive && onOrAfter(dateStr, state.cppB.startDate)
      ? state.cppB.estimatedMonthlyAt65 * 12 * cppFactorB * cpiFactorForYear : 0
    const oasA_nom = aAlive && onOrAfter(dateStr, state.oasA.startDate)
      ? state.oasA.estimatedMonthlyAt65 * 12 * oasFactorA * cpiFactorForYear : 0
    const oasB_nom = bAlive && onOrAfter(dateStr, state.oasB.startDate)
      ? state.oasB.estimatedMonthlyAt65 * 12 * oasFactorB * cpiFactorForYear : 0

    // ── RRIF minimums ────────────────────────────────────────────────────────
    const isRrifA = aAlive && onOrAfter(dateStr, state.rrspA.rrifConversionDate)
    const isRrifB = bAlive && onOrAfter(dateStr, state.rrspB.rrifConversionDate)
    const ageForRrifA = state.rrspA.useSpouseAgeForMinimums ? personBAgeExact : personAAgeExact
    const ageForRrifB = state.rrspB.useSpouseAgeForMinimums ? personAAgeExact : personBAgeExact
    let rrifMinA = isRrifA ? rrspA * rrifMinFactor(ageForRrifA) : 0
    let rrifMinB = isRrifB ? rrspB * rrifMinFactor(ageForRrifB) : 0
    const rrifAddA = isRrifA ? state.rrspA.additionalWithdrawalAboveMinimum * inflFactor : 0
    const rrifAddB = isRrifB ? state.rrspB.additionalWithdrawalAboveMinimum * inflFactor : 0
    let rrifA_nom = Math.min(rrifMinA + rrifAddA, rrspA)
    let rrifB_nom = Math.min(rrifMinB + rrifAddB, rrspB)

    // ── Part-time / rental / other income ────────────────────────────────────
    const ptA_nom = aAlive && onOrAfter(dateStr, state.otherIncome.partTimeA.startDate) && before(dateStr, state.otherIncome.partTimeA.endDate)
      ? state.otherIncome.partTimeA.amount * Math.pow(1 + state.otherIncome.partTimeA.growthRatePct / 100, yearsFromNow) : 0
    const ptB_nom = bAlive && onOrAfter(dateStr, state.otherIncome.partTimeB.startDate) && before(dateStr, state.otherIncome.partTimeB.endDate)
      ? state.otherIncome.partTimeB.amount * Math.pow(1 + state.otherIncome.partTimeB.growthRatePct / 100, yearsFromNow) : 0
    const rentalNet_nom = (state.otherIncome.rentalGrossAnnual - state.otherIncome.rentalExpensesAnnual) * inflFactor
    let otherNom = 0
    for (const item of state.otherIncome.otherItems) {
      if (onOrAfter(dateStr, item.startDate) && before(dateStr, item.endDate)) {
        otherNom += item.annualAmount * Math.pow(1 + item.growthRatePct / 100, yearsFromNow)
      }
    }
    const inheritNom = year === getYear(state.otherIncome.inheritanceDate) && state.otherIncome.inheritanceAmount > 0
      ? state.otherIncome.inheritanceAmount * inflFactor : 0

    // ── Non-reg portfolio income ──────────────────────────────────────────────
    // Yields are annual income flows taxable each year regardless of sales.
    // Capital gains arise only from deliberate harvesting or withdrawals (via ACB).
    const nonRegRetA = state.nonRegA.returnRateOverrideEnabled ? state.nonRegA.returnRateOverridePct / 100 : nomReturn
    const nonRegRetB = state.nonRegB.returnRateOverrideEnabled ? state.nonRegB.returnRateOverridePct / 100 : nomReturn
    const nonRegDivEligA_nom  = nonRegA * (state.nonRegA.eligibleDivYieldPct  / 100)
    const nonRegDivEligB_nom  = nonRegB * (state.nonRegB.eligibleDivYieldPct  / 100)
    const nonRegForeignA_nom  = nonRegA * (state.nonRegA.foreignIncomeYieldPct / 100)
    const nonRegForeignB_nom  = nonRegB * (state.nonRegB.foreignIncomeYieldPct / 100)
    const nonRegInterestA_nom = nonRegA * (state.nonRegA.interestYieldPct / 100)
    const nonRegInterestB_nom = nonRegB * (state.nonRegB.interestYieldPct / 100)
    // Capital gains on withdrawal are tracked via ACB but not yet fed back into annual tax


    // ── Spending target ───────────────────────────────────────────────────────
    let spendingPhase = state.spendingPhases[0]
    for (const phase of state.spendingPhases) {
      if (personAAgeExact >= phase.startAge) spendingPhase = phase
    }
    const spendYrs  = Math.max(0, personAAgeExact - (spendingPhase?.startAge ?? 0))
    const spendBase = (spendingPhase?.annualAmount ?? 0) * inflFactor
    let spending_nom = spendBase * Math.pow(1 + (spendingPhase?.growthRatePct ?? 0) / 100, spendYrs)
    for (const item of state.additionalSpending) {
      const refBirth = state.ageReferencePerson === 'personB' ? state.personB.birthDate : state.personA.birthDate
      const itemDate = dateAtAge(refBirth, item.startAge)
      if (item.recurring) {
        if (jan1(year) >= itemDate) spending_nom += item.amount * inflFactor
      } else {
        if (getYear(itemDate) === year) spending_nom += item.amount * inflFactor
      }
    }

    // ── Tax with pension splitting ────────────────────────────────────────────
    const taxInputA: TaxInput = {
      employmentIncome: empA_nom,
      pensionIncome:    dbBase_nom + dbBridge_nom + rrifA_nom,
      cppIncome:        cppA_nom,
      oasIncome:        oasA_nom,
      eligibleDividends: nonRegDivEligA_nom,
      nonEligibleDividends: 0,
      foreignIncome: nonRegForeignA_nom,
      capitalGainsRealized: 0,
      age: personAAgeInt,
    }
    const taxInputB: TaxInput = {
      employmentIncome: empB_nom + ptA_nom + ptB_nom + rentalNet_nom + otherNom,
      pensionIncome:    dbBaseB_nom + dbBridgeB_nom + rrifB_nom,
      cppIncome:        cppB_nom,
      oasIncome:        oasB_nom,
      eligibleDividends: nonRegDivEligB_nom,
      nonEligibleDividends: 0,
      foreignIncome: nonRegForeignB_nom,
      capitalGainsRealized: 0,
      age: personBAgeInt,
    }

    const eligibleForSplitA = (aAlive ? dbBase_nom + dbBridge_nom : 0) +
      (personAAgeInt >= 65 && aAlive ? rrifA_nom : 0)

    let taxA, taxB, splitPct
    if (withdrawalStrategy.pensionSplitMode === 'auto' && aAlive && bAlive) {
      const opt = optimizePensionSplit(taxInputA, taxInputB, eligibleForSplitA, taxSettings, yearsFromNow, state.cpiRatePct)
      taxA = opt.taxA; taxB = opt.taxB; splitPct = opt.splitPct
    } else {
      const manualPct = withdrawalStrategy.pensionSplitMode === 'manual' ? withdrawalStrategy.pensionSplitPct : 0
      const transfer  = eligibleForSplitA * (manualPct / 100)
      taxA = calculateTax({ ...taxInputA, pensionIncome: taxInputA.pensionIncome - transfer }, taxSettings, yearsFromNow - baseYear + baseYear, state.cpiRatePct)
      taxB = calculateTax({ ...taxInputB, pensionIncome: taxInputB.pensionIncome + transfer }, taxSettings, yearsFromNow - baseYear + baseYear, state.cpiRatePct)
      splitPct = manualPct
    }
    void splitPct

    const totalNetNom = (aAlive ? taxA.netAfterTax : 0) + (bAlive ? taxB.netAfterTax : 0)

    // ── Withdrawal gap ────────────────────────────────────────────────────────
    let gap_nom = Math.max(0, spending_nom - totalNetNom)

    const hisaDraw = Math.min(gap_nom, hisa)
    hisa -= hisaDraw
    gap_nom -= hisaDraw

    let tfsaWithdrawA = 0, tfsaWithdrawB = 0
    let nonRegWithdrawA = 0, nonRegWithdrawB = 0

    if (gap_nom > 0) {
      const order = withdrawalStrategy.withdrawalOrder
      const half  = gap_nom / 2

      if (order === 'tfsa_first' || order === 'optimized') {
        tfsaWithdrawA = Math.min(aAlive ? half : 0, tfsaA)
        tfsaWithdrawB = Math.min(bAlive ? half : 0, tfsaB)
        gap_nom = Math.max(0, gap_nom - tfsaWithdrawA - tfsaWithdrawB)
        tfsaA -= tfsaWithdrawA
        tfsaB -= tfsaWithdrawB
      }
      if (gap_nom > 0 && (order === 'nonreg_first' || order === 'optimized')) {
        nonRegWithdrawA = Math.min(aAlive ? gap_nom / 2 : 0, nonRegA)
        nonRegWithdrawB = Math.min(bAlive ? gap_nom / 2 : 0, nonRegB)
        gap_nom = Math.max(0, gap_nom - nonRegWithdrawA - nonRegWithdrawB)
        if (nonRegA > 0) nonRegAcbA -= nonRegAcbA * (nonRegWithdrawA / nonRegA)
        if (nonRegB > 0) nonRegAcbB -= nonRegAcbB * (nonRegWithdrawB / nonRegB)
        nonRegA -= nonRegWithdrawA
        nonRegB -= nonRegWithdrawB
      }
      if (gap_nom > 0 && (order === 'rrsp_first' || order === 'optimized')) {
        const rrspDrawA = !isRrifA && aAlive ? Math.min(gap_nom / 2, rrspA) : 0
        const rrspDrawB = !isRrifB && bAlive ? Math.min(gap_nom / 2, rrspB) : 0
        rrifA_nom += rrspDrawA
        rrifB_nom += rrspDrawB
        rrspA -= rrspDrawA
        rrspB -= rrspDrawB
        gap_nom = Math.max(0, gap_nom - rrspDrawA - rrspDrawB)
      }
    }

    if (gap_nom > 0.01) {
      warnings.push(`Year ${year}: spending shortfall of $${Math.round(toPD(gap_nom, pi, yearsFromNow)).toLocaleString()} (PD)`)
    }

    // ── Grow accounts for next year ───────────────────────────────────────────
    const rrspRetA  = accountReturn(state.rrspA.returnRateOverridePct, nomReturn)
    const rrspRetB  = accountReturn(state.rrspB.returnRateOverridePct, nomReturn)
    const tfsaRetA  = state.tfsaA.returnRateOverrideEnabled ? state.tfsaA.returnRateOverridePct / 100 : nomReturn
    const tfsaRetB  = state.tfsaB.returnRateOverrideEnabled ? state.tfsaB.returnRateOverridePct / 100 : nomReturn

    const tfsaContribA = aAlive && (state.tfsaA.contributionStopAtRetirement ? !retiredA : year <= state.tfsaA.contributionEndYear)
      ? state.tfsaA.annualContribution * inflFactor : 0
    const tfsaContribB = bAlive && (state.tfsaB.contributionStopAtRetirement ? !retiredB : year <= state.tfsaB.contributionEndYear)
      ? state.tfsaB.annualContribution * inflFactor : 0

    rrspA  = grow(Math.max(0, rrspA  - (isRrifA ? rrifA_nom - rrifMinA : 0)), rrspRetA)
    rrspB  = grow(Math.max(0, rrspB  - (isRrifB ? rrifB_nom - rrifMinB : 0)), rrspRetB)
    tfsaA  = grow(tfsaA  + tfsaContribA, tfsaRetA)
    tfsaB  = grow(tfsaB  + tfsaContribB, tfsaRetB)
    nonRegA = grow(nonRegA + (!retiredA && aAlive ? state.nonRegA.annualContribution * inflFactor : 0), nonRegRetA)
    nonRegB = grow(nonRegB + (!retiredB && bAlive ? state.nonRegB.annualContribution * inflFactor : 0), nonRegRetB)
    hisa   = grow(hisa, state.riskFreeRatePct / 100)

    // ── Convert to present-day dollars ────────────────────────────────────────
    const pd = (n: number) => toPD(n, pi, yearsFromNow)
    const totalPortfolio = pd(rrspA + rrspB + tfsaA + tfsaB + nonRegA + nonRegB + hisa)

    dataPoints.push({
      year,
      date: dateStr,
      personAAge: personAAgeExact,
      personBAge: personBAgeExact,

      employmentA:    pd(empA_nom),
      employmentB:    pd(empB_nom),
      dbPensionBase:  pd(dbBase_nom),
      dbBridge:       pd(dbBridge_nom),
      dbPensionBaseB: pd(dbBaseB_nom),
      dbBridgeB:      pd(dbBridgeB_nom),
      cppA:           pd(cppA_nom),
      cppB:           pd(cppB_nom),
      oasA:           pd(oasA_nom),
      oasB:           pd(oasB_nom),
      rrifA:          pd(rrifA_nom),
      rrifB:          pd(rrifB_nom),
      tfsaWithdrawalA:   pd(tfsaWithdrawA),
      tfsaWithdrawalB:   pd(tfsaWithdrawB),
      nonRegWithdrawalA: pd(nonRegWithdrawA),
      nonRegWithdrawalB: pd(nonRegWithdrawB),
      rentalIncome:   pd(rentalNet_nom),
      partTimeA:      pd(ptA_nom),
      partTimeB:      pd(ptB_nom),
      otherIncome:    pd(otherNom),
      inheritance:    pd(inheritNom),

      grossIncomeA: pd(aAlive ? taxA.grossIncome : 0),
      grossIncomeB: pd(bAlive ? taxB.grossIncome : 0),
      taxA:         pd(aAlive ? taxA.totalTax    : 0),
      taxB:         pd(bAlive ? taxB.totalTax    : 0),
      oasClawbackA: pd(aAlive ? taxA.oasClawback : 0),
      oasClawbackB: pd(bAlive ? taxB.oasClawback : 0),
      netIncomeA:   pd(aAlive ? taxA.netAfterTax : 0),
      netIncomeB:   pd(bAlive ? taxB.netAfterTax : 0),
      totalHouseholdNet: pd(totalNetNom),
      effectiveTaxRateA: aAlive ? taxA.effectiveRate : 0,
      effectiveTaxRateB: bAlive ? taxB.effectiveRate : 0,

      householdSpending: pd(spending_nom),
      cashFlow:          pd(totalNetNom - spending_nom),

      rrspA:  pd(rrspA),
      rrspB:  pd(rrspB),
      tfsaA:  pd(tfsaA),
      tfsaB:  pd(tfsaB),
      nonRegA: pd(nonRegA),
      nonRegB: pd(nonRegB),
      hisa:   pd(hisa),
      totalPortfolio,
      netWorth: totalPortfolio,
    })
  }

  return { dataPoints, warnings }
}

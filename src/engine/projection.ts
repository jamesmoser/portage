// Monthly projection engine — income is accumulated month-by-month so that
// mid-year starts and ends (retirement, pension, CPP/OAS eligibility, etc.)
// are naturally pro-rated without per-source special cases.
// Annual DataPoints are produced for display; account balances compound annually.
//
// Strategy:
//   1. Walk year-by-year from today to the last planning end date.
//   2. For each year, run a 12-month inner loop.
//      Each month, check which income sources are active and add 1 month of income.
//   3. After the monthly loop, run taxes on annual totals, apply drawdown,
//      update account balances, and emit a DataPoint in present-day dollars.

import type { AppState, DataPoint, ProjectionResult } from './types'
import { jan1, getYear, exactAgeAt, intAgeAt, onOrAfter, before, dateAtAge, dateAtDecimalAge } from './dates'
import { calculateTax, optimizePensionSplit, rrifMinFactor, type TaxInput } from './tax'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function nominalReturnForAge(age: number, rates: AppState['returnRates']): number {
  if (age < 55)  return rates.upTo55 / 100
  if (age < 65)  return rates.from55to65 / 100
  if (age < 70)  return rates.from65to70 / 100
  return rates.from70plus / 100
}

function grow(balance: number, rate: number): number {
  return balance * (1 + rate)
}

function toPD(nominalValue: number, personalInflation: number, yearsFromNow: number): number {
  return nominalValue / Math.pow(1 + personalInflation, yearsFromNow)
}

function rrspContribNom(account: AppState['rrspA'], year: number, alive: boolean, isRrif: boolean, inflFactor: number): number {
  if (isRrif) return 0
  return contribNom(account.annualContribution, account.contributionEndDate, account.contributionTiming, year, alive, inflFactor)
}

function contribNom(annualContribution: number, contributionEndDate: string, contributionTiming: 'lump' | 'spread', year: number, alive: boolean, inflFactor: number): number {
  if (!alive || annualContribution <= 0) return 0
  const endYear = getYear(contributionEndDate)
  if (year > endYear) return 0
  const base = annualContribution * inflFactor
  if (contributionTiming === 'lump') return base
  if (year < endYear) return base
  const endMonth = parseInt(contributionEndDate.substring(5, 7), 10)
  return base * endMonth / 12
}

function tfsaContribNom(account: AppState['tfsaA'], year: number, alive: boolean, inflFactor: number): number {
  return contribNom(account.annualContribution, account.contributionEndDate, account.contributionTiming, year, alive, inflFactor)
}

// Calendar-aware age: uses exact birthday boundaries to avoid 365.25 approximation errors.
function calendarAge(birthDate: string, atDate: string): number {
  const wholeYears = intAgeAt(birthDate, atDate)
  const prevBirthday = new Date(dateAtAge(birthDate, wholeYears)).getTime()
  const nextBirthday = new Date(dateAtAge(birthDate, wholeYears + 1)).getTime()
  const at = new Date(atDate).getTime()
  const fraction = (at - prevBirthday) / (nextBirthday - prevBirthday)
  return wholeYears + fraction
}

function cppFactor(startDate: string, birthDate: string): number {
  const age = calendarAge(birthDate, startDate)
  const monthsFromAge65 = (age - 65) * 12
  if (monthsFromAge65 <= 0) return Math.max(0, 1 + 0.006 * monthsFromAge65)
  return 1 + 0.007 * monthsFromAge65
}

function oasFactor(startDate: string, birthDate: string): number {
  const age = calendarAge(birthDate, startDate)
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
  // Death date = exact date at planningEndAge (decimal). 88.0 = 88th birthday, 88.9 = near end of age 88.
  const deathDateA = dateAtDecimalAge(state.personA.birthDate, state.personA.planningEndAge)
  const deathDateB = dateAtDecimalAge(state.personB.birthDate, state.personB.planningEndAge)
  const endYearA = getYear(deathDateA)
  const endYearB = getYear(deathDateB)
  const endYear  = Math.max(endYearA, endYearB)

  if (endYear <= currentYear) {
    warnings.push('Planning end dates are in the past. Check birth dates and planning end ages.')
    return { dataPoints, warnings }
  }

  // ── Mutable account balances (nominal) ───────────────────────────────────
  let rrspA      = state.rrspA.balance
  let rrspB      = state.rrspB.balance
  let tfsaA      = state.tfsaA.balance
  let tfsaB      = state.tfsaB.balance
  let nonRegA    = state.nonRegA.balance
  let nonRegB    = state.nonRegB.balance
  let nonRegAcbA = state.nonRegA.acb
  let nonRegAcbB = state.nonRegB.acb
  let hisa       = state.cash.hisaBalance

  const cppFactorA = cppFactor(state.cppA.startDate, state.personA.birthDate)
  const cppFactorB = cppFactor(state.cppB.startDate, state.personB.birthDate)
  const oasFactorA = oasFactor(state.oasA.startDate, state.personA.birthDate)
  const oasFactorB = oasFactor(state.oasB.startDate, state.personB.birthDate)

  const baseYear = currentYear

  for (let year = currentYear; year <= endYear; year++) {
    const dateStr      = jan1(year)
    const yearsFromNow = year - currentYear
    const inflFactor   = Math.pow(1 + pi,  yearsFromNow)
    const cpiFactorForYear = Math.pow(1 + cpi, yearsFromNow)

    // Ages at Jan 1 — used for tax credits, RRIF minimums, and DataPoint display.
    const personAAgeExact = exactAgeAt(state.personA.birthDate, dateStr)
    const personBAgeExact = exactAgeAt(state.personB.birthDate, dateStr)
    const personAAgeInt   = intAgeAt(state.personA.birthDate, dateStr)
    const personBAgeInt   = intAgeAt(state.personB.birthDate, dateStr)

    const refAge    = state.ageReferencePerson === 'personB' ? personBAgeExact : personAAgeExact
    const nomReturn = nominalReturnForAge(refAge, state.returnRates)

    const aAlive = year <= endYearA
    const bAlive = year <= endYearB

    // ── Asset rollover to surviving spouse at death ───────────────────────────
    // Runs at the start of the first year a person is no longer alive.
    // All transfers use the spousal rollover election (no immediate tax).
    if (!aAlive && bAlive) {
      if (rrspA   > 0) { rrspB   += rrspA;   rrspA   = 0 }
      if (tfsaA   > 0) { tfsaB   += tfsaA;   tfsaA   = 0 }
      if (nonRegA > 0) { nonRegB += nonRegA;  nonRegA = 0
                         nonRegAcbB += nonRegAcbA; nonRegAcbA = 0 }
    }
    if (!bAlive && aAlive) {
      if (rrspB   > 0) { rrspA   += rrspB;   rrspB   = 0 }
      if (tfsaB   > 0) { tfsaA   += tfsaB;   tfsaB   = 0 }
      if (nonRegB > 0) { nonRegA += nonRegB;  nonRegB = 0
                         nonRegAcbA += nonRegAcbB; nonRegAcbB = 0 }
    }

    // ── RRIF minimums (annual — based on Jan 1 balance and Jan 1 age) ────────
    const isRrifA = aAlive && onOrAfter(dateStr, state.rrspA.rrifConversionDate)
    const isRrifB = bAlive && onOrAfter(dateStr, state.rrspB.rrifConversionDate)
    const ageForRrifA = state.rrspA.useSpouseAgeForMinimums ? personBAgeExact : personAAgeExact
    const ageForRrifB = state.rrspB.useSpouseAgeForMinimums ? personAAgeExact : personBAgeExact
    const rrifMinA = isRrifA ? rrspA * rrifMinFactor(ageForRrifA) : 0
    const rrifMinB = isRrifB ? rrspB * rrifMinFactor(ageForRrifB) : 0
    const rrifAddA = isRrifA ? state.rrspA.additionalWithdrawalAboveMinimum * inflFactor : 0
    const rrifAddB = isRrifB ? state.rrspB.additionalWithdrawalAboveMinimum * inflFactor : 0
    let rrifA_nom = Math.min(rrifMinA + rrifAddA, rrspA)
    let rrifB_nom = Math.min(rrifMinB + rrifAddB, rrspB)

    // ── RRSP/RRIF draws (pre-tax, set before tax engine so they flow through splitting) ──
    if (withdrawalStrategy.drawdownStrategy === 'none') {
      rrifA_nom = 0
      rrifB_nom = 0
    } else if (withdrawalStrategy.drawdownStrategy === 'fixedPct') {
      const fp = withdrawalStrategy.drawdownFixedPct
      if (aAlive) {
        const target = Math.max(fp.rrspPct / 100 * rrspA, fp.rrspMin * inflFactor, isRrifA ? rrifMinA : 0)
        rrifA_nom = Math.min(target, rrspA)
        if (!isRrifA) rrspA = Math.max(0, rrspA - rrifA_nom)
      }
      if (bAlive) {
        const target = Math.max(fp.rrspPct / 100 * rrspB, fp.rrspMin * inflFactor, isRrifB ? rrifMinB : 0)
        rrifB_nom = Math.min(target, rrspB)
        if (!isRrifB) rrspB = Math.max(0, rrspB - rrifB_nom)
      }
    } else if (withdrawalStrategy.drawdownStrategy === 'fixedWithdrawal') {
      const fw = withdrawalStrategy.drawdownFixedWithdrawal
      if (aAlive) {
        const target = Math.max(fw.rrspAmount * inflFactor, isRrifA ? rrifMinA : 0)
        rrifA_nom = Math.min(target, rrspA)
        if (!isRrifA) rrspA = Math.max(0, rrspA - rrifA_nom)
      }
      if (bAlive) {
        const target = Math.max(fw.rrspAmount * inflFactor, isRrifB ? rrifMinB : 0)
        rrifB_nom = Math.min(target, rrspB)
        if (!isRrifB) rrspB = Math.max(0, rrspB - rrifB_nom)
      }
    }
    // 'spendGap': rrifA/B_nom stays at mandatory minimum + additionalWithdrawalAboveMinimum

    // ── Pre-compute annual DB pension amounts for this year ───────────────────
    // These are the full-year indexed amounts; the monthly loop divides by 12
    // and multiplies by the number of active months.

    // DB Pension A
    const dbAStartYear = getYear(state.dbPensionA.startDate)
    const yopA         = Math.max(0, year - dbAStartYear)
    const dbARateRaw   = (state.dbPensionA.indexingRatePct != null ? state.dbPensionA.indexingRatePct : cpi * 100) / 100
    const dbACapOn     = state.dbPensionA.cpiIndexingCapEnabled ?? (state.dbPensionA.cpiIndexingCap > 0)
    const irA          = state.dbPensionA.cpiIndexed
      ? (dbACapOn && state.dbPensionA.cpiIndexingCap > 0 ? Math.min(dbARateRaw, state.dbPensionA.cpiIndexingCap / 100) : dbARateRaw)
      : 0
    const annualDbBaseA_nom   = state.dbPensionA.annualAmount * Math.pow(1 + irA, yopA)
    const annualCppIntRedA    = state.dbPensionA.cppIntegration
      ? state.dbPensionA.cppIntegrationAmount * Math.pow(1 + irA, Math.max(0, year - getYear(state.personA.retirementDate)))
      : 0
    const annualDbBridgeA_nom = state.dbPensionA.bridgeBenefitAmount > 0
      ? state.dbPensionA.bridgeBenefitAmount * Math.pow(1 + irA, yopA)
      : 0

    // DB Pension B
    const dbBStartYear = getYear(state.dbPensionB.startDate)
    const yopB         = Math.max(0, year - dbBStartYear)
    const dbBRateRaw   = (state.dbPensionB.indexingRatePct != null ? state.dbPensionB.indexingRatePct : cpi * 100) / 100
    const dbBCapOn     = state.dbPensionB.cpiIndexingCapEnabled ?? (state.dbPensionB.cpiIndexingCap > 0)
    const irB          = state.dbPensionB.cpiIndexed
      ? (dbBCapOn && state.dbPensionB.cpiIndexingCap > 0 ? Math.min(dbBRateRaw, state.dbPensionB.cpiIndexingCap / 100) : dbBRateRaw)
      : 0
    const annualDbBaseB_nom   = state.dbPensionB.annualAmount * Math.pow(1 + irB, yopB)
    const annualCppIntRedB    = state.dbPensionB.cppIntegration
      ? state.dbPensionB.cppIntegrationAmount * Math.pow(1 + irB, Math.max(0, year - getYear(state.personB.retirementDate)))
      : 0
    const annualDbBridgeB_nom = state.dbPensionB.bridgeBenefitAmount > 0
      ? state.dbPensionB.bridgeBenefitAmount * Math.pow(1 + irB, yopB)
      : 0

    // Pre-compute annual employment amounts (growth-adjusted for this year)
    const empGrowthA    = Math.pow(1 + state.employmentA.growthRatePct / 100, yearsFromNow)
    const empGrowthB    = Math.pow(1 + state.employmentB.growthRatePct / 100, yearsFromNow)
    const annualEmpA_nom = state.employmentA.annualAmount * empGrowthA
    const annualEmpB_nom = state.employmentB.annualAmount * empGrowthB

    // ── Pre-compute spending phase data for this year ─────────────────────────
    // Phases are date-checked monthly so mid-year transitions (e.g. survivor phase
    // starting on the death birthday) are correctly captured.
    const refBirth = state.ageReferencePerson === 'personB' ? state.personB.birthDate : state.personA.birthDate
    const phaseCalcs = state.spendingPhases.map(p => {
      const startDate = dateAtDecimalAge(refBirth, p.startAge)
      const spendYrs  = Math.max(0, exactAgeAt(refBirth, dateStr) - p.startAge)
      const annual    = p.annualAmount * inflFactor * Math.pow(1 + p.growthRatePct / 100, spendYrs)
      return { startDate, monthly: annual / 12 }
    })

    // ── Monthly income + spending accumulation ────────────────────────────────
    // mAAlive / mBAlive use the exact death date so income is pro-rated to the
    // death month — no more binary full-year / zero-year cliff at year boundaries.
    let empA_nom = 0, empB_nom = 0
    let dbBase_nom = 0, dbBridge_nom = 0
    let dbBaseB_nom = 0, dbBridgeB_nom = 0
    let cppA_nom = 0, cppB_nom = 0
    let oasA_nom = 0, oasB_nom = 0
    let otherTaxableA_nom = 0, otherTaxableB_nom = 0
    let otherNonTaxA_nom  = 0, otherNonTaxB_nom  = 0
    let spending_nom = 0
    let aliveMonths = 0  // count of months where at least one person is alive

    for (let month = 1; month <= 12; month++) {
      const monthDate = `${year}-${String(month).padStart(2, '0')}-01`

      // Per-month alive: active in a month if the month start is on or before the death date.
      const mAAlive = aAlive && monthDate <= deathDateA
      const mBAlive = bAlive && monthDate <= deathDateB
      const anyAlive = mAAlive || mBAlive

      // ── Spending phase ──────────────────────────────────────────────────────
      // Only accumulate spending in months where at least one person is alive.
      if (anyAlive) {
        aliveMonths++
        if (phaseCalcs.length > 0) {
          let activeIdx = 0
          for (let i = 0; i < phaseCalcs.length; i++) {
            if (monthDate >= phaseCalcs[i].startDate) activeIdx = i
          }
          spending_nom += phaseCalcs[activeIdx].monthly
        }
      }

      // ── Employment ─────────────────────────────────────────────────────────
      if (mAAlive && !onOrAfter(monthDate, state.personA.retirementDate)) {
        empA_nom += annualEmpA_nom / 12
      }
      if (mBAlive && !onOrAfter(monthDate, state.personB.retirementDate)) {
        empB_nom += annualEmpB_nom / 12
      }

      // ── DB Pension A ────────────────────────────────────────────────────────
      if (state.dbPensionA.enabled && mAAlive && onOrAfter(monthDate, state.dbPensionA.startDate)) {
        const mAgeA   = intAgeAt(state.personA.birthDate, monthDate)
        const intRedM = (state.dbPensionA.cppIntegration && mAgeA >= 65) ? annualCppIntRedA / 12 : 0
        dbBase_nom += Math.max(0, annualDbBaseA_nom / 12 - intRedM)
        if (annualDbBridgeA_nom > 0 && before(monthDate, state.dbPensionA.bridgeBenefitEndDate)) {
          dbBridge_nom += annualDbBridgeA_nom / 12
        }
      }

      // ── DB Pension B ────────────────────────────────────────────────────────
      if (state.dbPensionB.enabled && mBAlive && onOrAfter(monthDate, state.dbPensionB.startDate)) {
        const mAgeB   = intAgeAt(state.personB.birthDate, monthDate)
        const intRedM = (state.dbPensionB.cppIntegration && mAgeB >= 65) ? annualCppIntRedB / 12 : 0
        dbBaseB_nom += Math.max(0, annualDbBaseB_nom / 12 - intRedM)
        if (annualDbBridgeB_nom > 0 && before(monthDate, state.dbPensionB.bridgeBenefitEndDate)) {
          dbBridgeB_nom += annualDbBridgeB_nom / 12
        }
      }

      // ── CPP A ───────────────────────────────────────────────────────────────
      if (mAAlive && onOrAfter(monthDate, state.cppA.startDate)) {
        cppA_nom += state.cppA.estimatedMonthlyAt65 * cppFactorA * cpiFactorForYear
        // Survivor CPP from B: active in any month B is dead and B's CPP had started.
        if (!mBAlive && onOrAfter(monthDate, state.cppB.startDate)) {
          cppA_nom += state.cppB.estimatedMonthlyAt65 * cppFactorB * 0.60 * cpiFactorForYear
        }
      }

      // ── CPP B ───────────────────────────────────────────────────────────────
      if (mBAlive && onOrAfter(monthDate, state.cppB.startDate)) {
        cppB_nom += state.cppB.estimatedMonthlyAt65 * cppFactorB * cpiFactorForYear
        if (!mAAlive && onOrAfter(monthDate, state.cppA.startDate)) {
          cppB_nom += state.cppA.estimatedMonthlyAt65 * cppFactorA * 0.60 * cpiFactorForYear
        }
      }

      // ── OAS A ───────────────────────────────────────────────────────────────
      if (mAAlive && onOrAfter(monthDate, state.oasA.startDate)) {
        oasA_nom += state.oasA.estimatedMonthlyAt65 * oasFactorA * cpiFactorForYear
        if (state.oasA.gisEligible) {
          oasA_nom += (state.oasA.gisMonthlyAmount ?? 0) * cpiFactorForYear
        }
      }

      // ── OAS B ───────────────────────────────────────────────────────────────
      if (mBAlive && onOrAfter(monthDate, state.oasB.startDate)) {
        oasB_nom += state.oasB.estimatedMonthlyAt65 * oasFactorB * cpiFactorForYear
        if (state.oasB.gisEligible) {
          oasB_nom += (state.oasB.gisMonthlyAmount ?? 0) * cpiFactorForYear
        }
      }

      // ── Other income ────────────────────────────────────────────────────────
      for (const item of state.otherIncome.otherItems) {
        const itemAlive = item.attributedTo === 'personA' ? mAAlive
                        : item.attributedTo === 'personB' ? mBAlive
                        : mAAlive || mBAlive
        if (!itemAlive) continue
        if (!onOrAfter(monthDate, item.startDate) || !before(monthDate, item.endDate)) continue
        const monthlyValue = item.annualAmount * Math.pow(1 + item.growthRatePct / 100, yearsFromNow) / 12
        const toA = item.attributedTo === 'personA' ? monthlyValue : item.attributedTo === 'joint' ? monthlyValue / 2 : 0
        const toB = item.attributedTo === 'personB' ? monthlyValue : item.attributedTo === 'joint' ? monthlyValue / 2 : 0
        if (item.taxable) {
          otherTaxableA_nom += toA
          otherTaxableB_nom += toB
        } else {
          otherNonTaxA_nom += toA
          otherNonTaxB_nom += toB
        }
      }
    }

    // ── Non-reg portfolio income (annual — yield on beginning-of-year balance) ─
    const nonRegRetA = state.nonRegA.returnRateOverrideEnabled ? state.nonRegA.returnRateOverridePct / 100 : nomReturn
    const nonRegRetB = state.nonRegB.returnRateOverrideEnabled ? state.nonRegB.returnRateOverridePct / 100 : nomReturn
    const nonRegDivEligA_nom  = nonRegA * (state.nonRegA.eligibleDivYieldPct  / 100)
    const nonRegDivEligB_nom  = nonRegB * (state.nonRegB.eligibleDivYieldPct  / 100)
    const nonRegForeignA_nom  = nonRegA * (state.nonRegA.foreignIncomeYieldPct / 100)
    const nonRegForeignB_nom  = nonRegB * (state.nonRegB.foreignIncomeYieldPct / 100)

    // ── Additional spending items (annual — one-time or recurring from a start age) ──
    // Pro-rate by alive months so the final year of the plan isn't inflated.
    const aliveMonthFrac = aliveMonths / 12
    for (const item of state.additionalSpending) {
      const itemDate = dateAtDecimalAge(refBirth, item.startAge)
      if (item.recurring) {
        if (jan1(year) >= itemDate) spending_nom += item.amount * inflFactor * aliveMonthFrac
      } else {
        if (getYear(itemDate) === year) spending_nom += item.amount * inflFactor * aliveMonthFrac
      }
    }

    // ── Tax with pension splitting ────────────────────────────────────────────
    const taxInputA: TaxInput = {
      employmentIncome:     empA_nom + otherTaxableA_nom,
      pensionIncome:        dbBase_nom + dbBridge_nom + rrifA_nom,
      cppIncome:            cppA_nom,
      oasIncome:            oasA_nom,
      eligibleDividends:    nonRegDivEligA_nom,
      nonEligibleDividends: 0,
      foreignIncome:        nonRegForeignA_nom,
      capitalGainsRealized: 0,
      age:                  personAAgeInt,
    }
    const taxInputB: TaxInput = {
      employmentIncome:     empB_nom + otherTaxableB_nom,
      pensionIncome:        dbBaseB_nom + dbBridgeB_nom + rrifB_nom,
      cppIncome:            cppB_nom,
      oasIncome:            oasB_nom,
      eligibleDividends:    nonRegDivEligB_nom,
      nonEligibleDividends: 0,
      foreignIncome:        nonRegForeignB_nom,
      capitalGainsRealized: 0,
      age:                  personBAgeInt,
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

    // Non-reg yield (dividends, foreign income) stays in the account — it is NOT received as
    // spendable cash.  The T-slip tax liability is real and must be paid from actual income or
    // account draws, but the yield itself is not an inflow.  Remove it from the cash net so the
    // gap calculation correctly treats the tax as a cost without crediting phantom income.
    const nonRegYieldA = aAlive ? nonRegDivEligA_nom + nonRegForeignA_nom : 0
    const nonRegYieldB = bAlive ? nonRegDivEligB_nom + nonRegForeignB_nom : 0
    const totalNetNom = (aAlive ? taxA.netAfterTax - nonRegYieldA + otherNonTaxA_nom : 0)
                      + (bAlive ? taxB.netAfterTax - nonRegYieldB + otherNonTaxB_nom : 0)

    // ── Gap fill / account draws ──────────────────────────────────────────────
    let tfsaWithdrawA = 0, tfsaWithdrawB = 0
    let nonRegWithdrawA = 0, nonRegWithdrawB = 0
    let proactiveExtra = 0
    let gap_nom: number

    if (withdrawalStrategy.drawdownStrategy === 'none') {
      gap_nom = Math.max(0, spending_nom - totalNetNom)

    } else if (withdrawalStrategy.drawdownStrategy === 'spendGap') {
      gap_nom = Math.max(0, spending_nom - totalNetNom)
      const hisaDraw = Math.min(gap_nom, hisa)
      hisa    -= hisaDraw
      gap_nom -= hisaDraw
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

    } else {
      // fixedPct / fixedWithdrawal: proactive TFSA and Non-Reg draws (RRSP/RRIF already set above).
      if (withdrawalStrategy.drawdownStrategy === 'fixedPct') {
        const fp = withdrawalStrategy.drawdownFixedPct
        if (aAlive) {
          tfsaWithdrawA = Math.min(Math.max(fp.tfsaPct / 100 * tfsaA, fp.tfsaMin * inflFactor), tfsaA)
          tfsaA -= tfsaWithdrawA
          nonRegWithdrawA = Math.min(Math.max(fp.nonRegPct / 100 * nonRegA, fp.nonRegMin * inflFactor), nonRegA)
          if (nonRegA > 0) nonRegAcbA -= nonRegAcbA * (nonRegWithdrawA / nonRegA)
          nonRegA -= nonRegWithdrawA
        }
        if (bAlive) {
          tfsaWithdrawB = Math.min(Math.max(fp.tfsaPct / 100 * tfsaB, fp.tfsaMin * inflFactor), tfsaB)
          tfsaB -= tfsaWithdrawB
          nonRegWithdrawB = Math.min(Math.max(fp.nonRegPct / 100 * nonRegB, fp.nonRegMin * inflFactor), nonRegB)
          if (nonRegB > 0) nonRegAcbB -= nonRegAcbB * (nonRegWithdrawB / nonRegB)
          nonRegB -= nonRegWithdrawB
        }
      } else {
        const fw = withdrawalStrategy.drawdownFixedWithdrawal
        if (aAlive) {
          tfsaWithdrawA = Math.min(fw.tfsaAmount * inflFactor, tfsaA)
          tfsaA -= tfsaWithdrawA
          nonRegWithdrawA = Math.min(fw.nonRegAmount * inflFactor, nonRegA)
          if (nonRegA > 0) nonRegAcbA -= nonRegAcbA * (nonRegWithdrawA / nonRegA)
          nonRegA -= nonRegWithdrawA
        }
        if (bAlive) {
          tfsaWithdrawB = Math.min(fw.tfsaAmount * inflFactor, tfsaB)
          tfsaB -= tfsaWithdrawB
          nonRegWithdrawB = Math.min(fw.nonRegAmount * inflFactor, nonRegB)
          if (nonRegB > 0) nonRegAcbB -= nonRegAcbB * (nonRegWithdrawB / nonRegB)
          nonRegB -= nonRegWithdrawB
        }
      }
      proactiveExtra = tfsaWithdrawA + tfsaWithdrawB + nonRegWithdrawA + nonRegWithdrawB
      const shortfall = Math.max(0, spending_nom - totalNetNom - proactiveExtra)
      const hisaDraw  = Math.min(shortfall, hisa)
      hisa    -= hisaDraw
      gap_nom  = Math.max(0, shortfall - hisaDraw)
    }

    if (gap_nom > 0.01) {
      warnings.push(`Year ${year}: spending shortfall of $${Math.round(toPD(gap_nom, pi, yearsFromNow)).toLocaleString()} (PD)`)
    }
    if (state.cash.hisaMinBalance > 0 && toPD(hisa, pi, yearsFromNow) < state.cash.hisaMinBalance) {
      warnings.push(`Year ${year}: HISA balance ($${Math.round(toPD(hisa, pi, yearsFromNow)).toLocaleString()}) is below the minimum balance target ($${Math.round(state.cash.hisaMinBalance).toLocaleString()})`)
    }

    // ── Grow accounts for next year ───────────────────────────────────────────
    const rrspRetA = state.rrspA.returnRateOverrideEnabled ? state.rrspA.returnRateOverridePct / 100 : nomReturn
    const rrspRetB = state.rrspB.returnRateOverrideEnabled ? state.rrspB.returnRateOverridePct / 100 : nomReturn
    const tfsaRetA = state.tfsaA.returnRateOverrideEnabled ? state.tfsaA.returnRateOverridePct / 100 : nomReturn
    const tfsaRetB = state.tfsaB.returnRateOverrideEnabled ? state.tfsaB.returnRateOverridePct / 100 : nomReturn

    const tfsaContribA = tfsaContribNom(state.tfsaA, year, aAlive, inflFactor)
    const tfsaContribB = tfsaContribNom(state.tfsaB, year, bAlive, inflFactor)
    const rrspContribA = rrspContribNom(state.rrspA, year, aAlive, isRrifA, inflFactor)
    const rrspContribB = rrspContribNom(state.rrspB, year, bAlive, isRrifB, inflFactor)

    rrspA   = grow(Math.max(0, rrspA  + rrspContribA - (isRrifA ? rrifA_nom : 0)), rrspRetA)
    rrspB   = grow(Math.max(0, rrspB  + rrspContribB - (isRrifB ? rrifB_nom : 0)), rrspRetB)
    tfsaA   = grow(tfsaA  + tfsaContribA, tfsaRetA)
    tfsaB   = grow(tfsaB  + tfsaContribB, tfsaRetB)
    nonRegA = grow(nonRegA + contribNom(state.nonRegA.annualContribution, state.nonRegA.contributionEndDate, state.nonRegA.contributionTiming, year, aAlive, inflFactor), nonRegRetA)
    nonRegB = grow(nonRegB + contribNom(state.nonRegB.annualContribution, state.nonRegB.contributionEndDate, state.nonRegB.contributionTiming, year, bAlive, inflFactor), nonRegRetB)
    hisa    = grow(hisa, state.cash.hisaRatePct / 100)

    // ── Convert to present-day dollars and emit DataPoint ────────────────────
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
      nonRegYieldA: pd(nonRegDivEligA_nom + nonRegForeignA_nom),
      nonRegYieldB: pd(nonRegDivEligB_nom + nonRegForeignB_nom),
      otherIncomeA: pd(otherTaxableA_nom + otherNonTaxA_nom),
      otherIncomeB: pd(otherTaxableB_nom + otherNonTaxB_nom),

      grossIncomeA: pd(aAlive ? taxA.grossIncome : 0),
      grossIncomeB: pd(bAlive ? taxB.grossIncome : 0),
      taxA:         pd(aAlive ? taxA.totalTax    : 0),
      taxB:         pd(bAlive ? taxB.totalTax    : 0),
      oasClawbackA: pd(aAlive ? taxA.oasClawback : 0),
      oasClawbackB: pd(bAlive ? taxB.oasClawback : 0),
      netIncomeA:   pd(aAlive ? taxA.netAfterTax - nonRegYieldA : 0),
      netIncomeB:   pd(bAlive ? taxB.netAfterTax - nonRegYieldB : 0),
      totalHouseholdNet: pd(totalNetNom + proactiveExtra),
      effectiveTaxRateA: aAlive ? taxA.effectiveRate : 0,
      effectiveTaxRateB: bAlive ? taxB.effectiveRate : 0,

      householdSpending: pd(spending_nom),
      cashFlow:          pd(totalNetNom + proactiveExtra - spending_nom),

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

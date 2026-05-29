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

import type { AppState, DataPoint, ProjectionResult, SpendGapAccountType, SpendGapDeficitItem, SpendGapSurplusAccountType } from './types'
import { jan1, getYear, exactAgeAt, intAgeAt, onOrAfter, before, dateAtAge, dateAtDecimalAge } from './dates'
import { calculateTax, optimizePensionSplit, rrifMinFactor, type TaxInput } from './tax'

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function nominalReturnForAge(age: number, rates: AppState['returnRates']): number {
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

export function cppFactor(startDate: string, birthDate: string): number {
  const age = calendarAge(birthDate, startDate)
  const monthsFromAge65 = (age - 65) * 12
  if (monthsFromAge65 <= 0) return Math.max(0, 1 + 0.006 * monthsFromAge65)
  return 1 + 0.007 * monthsFromAge65
}

export function oasFactor(startDate: string, birthDate: string): number {
  const age = calendarAge(birthDate, startDate)
  if (age <= 65) return 1.0
  return Math.min(1 + 0.006 * (age - 65) * 12, 1.36)
}

// ─── Main projection ──────────────────────────────────────────────────────────

export function runProjection(state: AppState, rateSchedule?: number[]): ProjectionResult {
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

  // Effective non-reg yield rates — blended on spousal rollover so the transferred
  // portfolio continues to generate the correct T-slip income for the survivor.
  let nonRegDivYieldA_eff     = state.nonRegA.eligibleDivYieldPct
  let nonRegForeignYieldA_eff = state.nonRegA.foreignIncomeYieldPct
  let nonRegDivYieldB_eff     = state.nonRegB.eligibleDivYieldPct
  let nonRegForeignYieldB_eff = state.nonRegB.foreignIncomeYieldPct

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

    const refAge    = state.ageReferencePerson === 'personB' ? personBAgeInt : personAAgeInt
    const nomReturn = rateSchedule?.[year - currentYear] ?? nominalReturnForAge(refAge, state.returnRates)

    const aAlive = year <= endYearA
    const bAlive = year <= endYearB

    // ── Asset rollover to surviving spouse at death ───────────────────────────
    // Runs at the start of the first year a person is no longer alive.
    // All transfers use the spousal rollover election (no immediate tax).
    if (!aAlive && bAlive) {
      if (rrspA   > 0) { rrspB   += rrspA;   rrspA   = 0 }
      if (tfsaA   > 0) { tfsaB   += tfsaA;   tfsaA   = 0 }
      if (nonRegA > 0) {
        // Blend yield rates before merging — survivor's account takes on a weighted mix
        // of A's and B's original rates proportional to their balances at time of transfer.
        const tot = nonRegB + nonRegA
        const wA = nonRegA / tot, wB = nonRegB / tot
        nonRegDivYieldB_eff     = wB * nonRegDivYieldB_eff     + wA * nonRegDivYieldA_eff
        nonRegForeignYieldB_eff = wB * nonRegForeignYieldB_eff + wA * nonRegForeignYieldA_eff
        nonRegB += nonRegA;  nonRegA = 0
        nonRegAcbB += nonRegAcbA; nonRegAcbA = 0
      }
    }
    if (!bAlive && aAlive) {
      if (rrspB   > 0) { rrspA   += rrspB;   rrspB   = 0 }
      if (tfsaB   > 0) { tfsaA   += tfsaB;   tfsaB   = 0 }
      if (nonRegB > 0) {
        const tot = nonRegA + nonRegB
        const wB = nonRegB / tot, wA = nonRegA / tot
        nonRegDivYieldA_eff     = wA * nonRegDivYieldA_eff     + wB * nonRegDivYieldB_eff
        nonRegForeignYieldA_eff = wA * nonRegForeignYieldA_eff + wB * nonRegForeignYieldB_eff
        nonRegA += nonRegB;  nonRegB = 0
        nonRegAcbA += nonRegAcbB; nonRegAcbB = 0
      }
    }

    // ── RRIF minimums (annual — based on Jan 1 balance and Jan 1 age) ────────
    const isRrifA = aAlive && onOrAfter(dateStr, state.rrspA.rrifConversionDate)
    const isRrifB = bAlive && onOrAfter(dateStr, state.rrspB.rrifConversionDate)
    const ageForRrifA = state.rrspA.useSpouseAgeForMinimums ? personBAgeInt : personAAgeInt
    const ageForRrifB = state.rrspB.useSpouseAgeForMinimums ? personAAgeInt : personBAgeInt
    const rrifMinA = isRrifA ? rrspA * rrifMinFactor(ageForRrifA) : 0
    const rrifMinB = isRrifB ? rrspB * rrifMinFactor(ageForRrifB) : 0
    const rrifAddA = isRrifA ? state.rrspA.additionalWithdrawalAboveMinimum * inflFactor : 0
    const rrifAddB = isRrifB ? state.rrspB.additionalWithdrawalAboveMinimum * inflFactor : 0
    let rrifA_nom = Math.min(rrifMinA + rrifAddA, rrspA)
    let rrifB_nom = Math.min(rrifMinB + rrifAddB, rrspB)

    // ── Fixed withdrawal retirement + death fractions ─────────────────────────
    // Draws start at retirement and stop at death, pro-rated in both boundary years.
    // startMo = retirement month in retirement year, 1 otherwise.
    // endMo   = death month in death year, 12 otherwise.
    // frac    = (endMo - startMo + 1) / 12
    let drawFracA = 1, drawFracB = 1, drawFracHisa = 1
    if (withdrawalStrategy.drawdownStrategy === 'fixedWithdrawal' || withdrawalStrategy.drawdownStrategy === 'fixedPct') {
      const retYA = getYear(state.personA.retirementDate)
      const retMoA = parseInt(state.personA.retirementDate.substring(5, 7), 10)
      const deathMoA = parseInt(deathDateA.substring(5, 7), 10)
      drawFracA = year < retYA ? 0
        : Math.max(0, (year === endYearA ? deathMoA : 12) - (year === retYA ? retMoA : 1) + 1) / 12

      const retYB = getYear(state.personB.retirementDate)
      const retMoB = parseInt(state.personB.retirementDate.substring(5, 7), 10)
      const deathMoB = parseInt(deathDateB.substring(5, 7), 10)
      drawFracB = year < retYB ? 0
        : Math.max(0, (year === endYearB ? deathMoB : 12) - (year === retYB ? retMoB : 1) + 1) / 12

      const firstRetire = state.personA.retirementDate <= state.personB.retirementDate
        ? state.personA.retirementDate : state.personB.retirementDate
      const retYH  = getYear(firstRetire)
      const retMoH = parseInt(firstRetire.substring(5, 7), 10)
      const lastDeathMo = endYearA >= endYearB ? deathMoA : deathMoB
      drawFracHisa = year < retYH ? 0
        : Math.max(0, (year === endYear ? lastDeathMo : 12) - (year === retYH ? retMoH : 1) + 1) / 12
    }

    // ── RRSP/RRIF draws (pre-tax, set before tax engine so they flow through splitting) ──
    if (withdrawalStrategy.drawdownStrategy === 'none') {
      rrifA_nom = 0
      rrifB_nom = 0
    } else if (withdrawalStrategy.drawdownStrategy === 'fixedPct') {
      const fp = withdrawalStrategy.drawdownFixedPct
      if (aAlive) {
        const target = Math.max(fp.rrspPct / 100 * rrspA * drawFracA, fp.rrspMin * inflFactor * drawFracA, isRrifA ? rrifMinA : 0)
        rrifA_nom = Math.min(target, rrspA)
        if (!isRrifA) rrspA = Math.max(0, rrspA - rrifA_nom)
      }
      if (bAlive) {
        const target = Math.max(fp.rrspPct / 100 * rrspB * drawFracB, fp.rrspMin * inflFactor * drawFracB, isRrifB ? rrifMinB : 0)
        rrifB_nom = Math.min(target, rrspB)
        if (!isRrifB) rrspB = Math.max(0, rrspB - rrifB_nom)
      }
    } else if (withdrawalStrategy.drawdownStrategy === 'fixedWithdrawal') {
      const fw = withdrawalStrategy.drawdownFixedWithdrawal
      if (aAlive) {
        const rawAmt = bAlive ? fw.rrspAmountA : Math.max(fw.rrspAmountA, fw.rrspAmountB)
        const target = Math.max(rawAmt * inflFactor * drawFracA, isRrifA ? rrifMinA : 0)
        rrifA_nom = Math.min(target, rrspA)
        if (!isRrifA) rrspA = Math.max(0, rrspA - rrifA_nom)
      }
      if (bAlive) {
        const rawAmt = aAlive ? fw.rrspAmountB : Math.max(fw.rrspAmountA, fw.rrspAmountB)
        const target = Math.max(rawAmt * inflFactor * drawFracB, isRrifB ? rrifMinB : 0)
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

      // ── DB Pension survivor benefits ─────────────────────────────────────────
      // After A dies, B receives A's base pension × survivor benefit %.
      // Bridge does not survive — only the indexed base.
      if (state.dbPensionA.enabled && !mAAlive && mBAlive
          && state.dbPensionA.survivorBenefitPct > 0
          && onOrAfter(monthDate, state.dbPensionA.startDate)) {
        dbBaseB_nom += (annualDbBaseA_nom * state.dbPensionA.survivorBenefitPct) / 12
      }
      // After B dies, A receives B's base pension × survivor benefit %.
      if (state.dbPensionB.enabled && !mBAlive && mAAlive
          && state.dbPensionB.survivorBenefitPct > 0
          && onOrAfter(monthDate, state.dbPensionB.startDate)) {
        dbBase_nom += (annualDbBaseB_nom * state.dbPensionB.survivorBenefitPct) / 12
      }

      // ── CPP A ───────────────────────────────────────────────────────────────
      if (mAAlive && onOrAfter(monthDate, state.cppA.startDate)) {
        cppA_nom += state.cppA.estimatedMonthlyAt65 * cppFactorA * cpiFactorForYear
      }
      // Survivor CPP: A receives 60% of B's pension in any month B is dead and B's CPP had started.
      // Independent of A's own CPP start date — survivor benefit is a separate CRA entitlement.
      if (mAAlive && !mBAlive && onOrAfter(monthDate, state.cppB.startDate)) {
        cppA_nom += state.cppB.estimatedMonthlyAt65 * cppFactorB * 0.60 * cpiFactorForYear
      }

      // ── CPP B ───────────────────────────────────────────────────────────────
      if (mBAlive && onOrAfter(monthDate, state.cppB.startDate)) {
        cppB_nom += state.cppB.estimatedMonthlyAt65 * cppFactorB * cpiFactorForYear
      }
      // Survivor CPP: B receives 60% of A's pension in any month A is dead and A's CPP had started.
      if (mBAlive && !mAAlive && onOrAfter(monthDate, state.cppA.startDate)) {
        cppB_nom += state.cppA.estimatedMonthlyAt65 * cppFactorA * 0.60 * cpiFactorForYear
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
    // Use effective yield rates (blended after spousal rollover) so the transferred
    // portfolio generates the correct T-slip income for the surviving spouse.
    const nonRegDivEligA_nom  = nonRegA * (nonRegDivYieldA_eff  / 100)
    const nonRegDivEligB_nom  = nonRegB * (nonRegDivYieldB_eff  / 100)
    const nonRegForeignA_nom  = nonRegA * (nonRegForeignYieldA_eff / 100)
    const nonRegForeignB_nom  = nonRegB * (nonRegForeignYieldB_eff / 100)

    // ── Additional spending items (annual — one-time or recurring from a start age) ──
    // Pro-rate by alive months so the final year of the plan isn't inflated.
    // Items injected by what-if modifiers (id prefix 'whatif-') are tracked separately.
    const aliveMonthFrac = aliveMonths / 12
    let unexpectedSpend_nom = 0
    for (const item of state.additionalSpending) {
      const itemDate = dateAtDecimalAge(refBirth, item.startAge)
      const active = item.recurring ? jan1(year) >= itemDate : getYear(itemDate) === year
      if (!active) continue
      const amt = item.amount * inflFactor * aliveMonthFrac
      if (item.id.startsWith('whatif-')) {
        unexpectedSpend_nom += amt
      } else {
        spending_nom += amt
      }
    }
    const spendingLifestyle_nom = spending_nom  // phases + regular additional, before contributions
    spending_nom += unexpectedSpend_nom

    // ── Proactive non-reg draws computed pre-tax so capital gains flow through tax engine ──
    // ACB is updated and balance reduced here; the gap section picks up the amounts.
    let proNonRegWithdrawA = 0, proNonRegWithdrawB = 0
    let proNonRegGainA = 0, proNonRegGainB = 0
    if (withdrawalStrategy.drawdownStrategy === 'fixedWithdrawal') {
      const fw = withdrawalStrategy.drawdownFixedWithdrawal
      if (aAlive) {
        const rawAmt = bAlive ? fw.nonRegAmountA : Math.max(fw.nonRegAmountA, fw.nonRegAmountB)
        proNonRegWithdrawA = Math.min(rawAmt * inflFactor * drawFracA, nonRegA)
        const acbRatio = nonRegA > 0 ? nonRegAcbA / nonRegA : 0
        proNonRegGainA = proNonRegWithdrawA * (1 - acbRatio)
        if (nonRegA > 0) nonRegAcbA -= nonRegAcbA * (proNonRegWithdrawA / nonRegA)
        nonRegA -= proNonRegWithdrawA
      }
      if (bAlive) {
        const rawAmt = aAlive ? fw.nonRegAmountB : Math.max(fw.nonRegAmountA, fw.nonRegAmountB)
        proNonRegWithdrawB = Math.min(rawAmt * inflFactor * drawFracB, nonRegB)
        const acbRatio = nonRegB > 0 ? nonRegAcbB / nonRegB : 0
        proNonRegGainB = proNonRegWithdrawB * (1 - acbRatio)
        if (nonRegB > 0) nonRegAcbB -= nonRegAcbB * (proNonRegWithdrawB / nonRegB)
        nonRegB -= proNonRegWithdrawB
      }
    } else if (withdrawalStrategy.drawdownStrategy === 'fixedPct') {
      const fp = withdrawalStrategy.drawdownFixedPct
      if (aAlive) {
        proNonRegWithdrawA = Math.min(Math.max(fp.nonRegPct / 100 * nonRegA * drawFracA, fp.nonRegMin * inflFactor * drawFracA), nonRegA)
        const acbRatio = nonRegA > 0 ? nonRegAcbA / nonRegA : 0
        proNonRegGainA = proNonRegWithdrawA * (1 - acbRatio)
        if (nonRegA > 0) nonRegAcbA -= nonRegAcbA * (proNonRegWithdrawA / nonRegA)
        nonRegA -= proNonRegWithdrawA
      }
      if (bAlive) {
        proNonRegWithdrawB = Math.min(Math.max(fp.nonRegPct / 100 * nonRegB * drawFracB, fp.nonRegMin * inflFactor * drawFracB), nonRegB)
        const acbRatio = nonRegB > 0 ? nonRegAcbB / nonRegB : 0
        proNonRegGainB = proNonRegWithdrawB * (1 - acbRatio)
        if (nonRegB > 0) nonRegAcbB -= nonRegAcbB * (proNonRegWithdrawB / nonRegB)
        nonRegB -= proNonRegWithdrawB
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
      capitalGainsRealized: proNonRegGainA,
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
      capitalGainsRealized: proNonRegGainB,
      age:                  personBAgeInt,
    }

    const eligibleForSplitA = (aAlive ? dbBase_nom + dbBridge_nom : 0) +
      (personAAgeInt >= 65 && aAlive ? rrifA_nom : 0)

    let taxA, taxB, splitAmount = 0
    if (withdrawalStrategy.pensionSplitMode === 'auto' && aAlive && bAlive) {
      const opt = optimizePensionSplit(taxInputA, taxInputB, eligibleForSplitA, taxSettings, yearsFromNow, state.cpiRatePct)
      taxA = opt.taxA; taxB = opt.taxB
      splitAmount = eligibleForSplitA * (opt.splitPct / 100)
    } else {
      const manualPct = withdrawalStrategy.pensionSplitMode === 'manual' ? withdrawalStrategy.pensionSplitPct : 0
      splitAmount  = eligibleForSplitA * (manualPct / 100)
      taxA = calculateTax({ ...taxInputA, pensionIncome: taxInputA.pensionIncome - splitAmount }, taxSettings, yearsFromNow - baseYear + baseYear, state.cpiRatePct)
      taxB = calculateTax({ ...taxInputB, pensionIncome: taxInputB.pensionIncome + splitAmount }, taxSettings, yearsFromNow - baseYear + baseYear, state.cpiRatePct)
    }

    // Non-reg yield (dividends, foreign income) stays in the account — it is NOT received as
    // spendable cash.  The T-slip tax liability is real and must be paid from actual income or
    // account draws, but the yield itself is not an inflow.  Remove it from the cash net so the
    // gap calculation correctly treats the tax as a cost without crediting phantom income.
    const nonRegYieldA = aAlive ? nonRegDivEligA_nom + nonRegForeignA_nom : 0
    const nonRegYieldB = bAlive ? nonRegDivEligB_nom + nonRegForeignB_nom : 0
    let totalNetNom = (aAlive ? taxA.netAfterTax - nonRegYieldA + otherNonTaxA_nom : 0)
                   + (bAlive ? taxB.netAfterTax - nonRegYieldB + otherNonTaxB_nom : 0)

    // ── Contributions — computed here so they can be added to spending_nom ──────
    // Contributions are real cash outflows (money leaving the household and going
    // into investment accounts). Including them in spending gives an accurate
    // cash flow: income - lifestyle spending - contributions = true surplus/deficit.
    //
    // stopContributionsWhenPartnerRetired: when enabled under the spendGap strategy,
    // a person's contributions cease once their partner has retired.
    const sgStop = withdrawalStrategy.drawdownStrategy === 'spendGap'
      && withdrawalStrategy.spendGapConfig.stopContributionsWhenPartnerRetired
    const aPartnerRetired = bAlive && onOrAfter(dateStr, state.personB.retirementDate)
    const bPartnerRetired = aAlive && onOrAfter(dateStr, state.personA.retirementDate)
    const aContribActive = aAlive && !(sgStop && aPartnerRetired)
    const bContribActive = bAlive && !(sgStop && bPartnerRetired)

    const tfsaContribA  = tfsaContribNom(state.tfsaA,  year, aContribActive, inflFactor)
    const tfsaContribB  = tfsaContribNom(state.tfsaB,  year, bContribActive, inflFactor)
    const rrspContribA  = rrspContribNom(state.rrspA,  year, aContribActive, isRrifA, inflFactor)
    const rrspContribB  = rrspContribNom(state.rrspB,  year, bContribActive, isRrifB, inflFactor)
    const nonRegContribA = contribNom(state.nonRegA.annualContribution, state.nonRegA.contributionEndDate, state.nonRegA.contributionTiming, year, aContribActive, inflFactor)
    const nonRegContribB = contribNom(state.nonRegB.annualContribution, state.nonRegB.contributionEndDate, state.nonRegB.contributionTiming, year, bContribActive, inflFactor)
    const totalContribs_nom = rrspContribA + rrspContribB + tfsaContribA + tfsaContribB + nonRegContribA + nonRegContribB

    // Contributions are funded from surplus only — no gap-fill or account draws are used.
    // Cap total contributions at income remaining after lifestyle + unexpected spending.
    const surplusBeforeContribs = Math.max(0, totalNetNom - spending_nom)
    const contribScale = totalContribs_nom > 0 ? Math.min(1, surplusBeforeContribs / totalContribs_nom) : 0
    let effTfsaContribA   = tfsaContribA   * contribScale
    let effTfsaContribB   = tfsaContribB   * contribScale
    const effRrspContribA   = rrspContribA   * contribScale
    const effRrspContribB   = rrspContribB   * contribScale
    let effNonRegContribA = nonRegContribA * contribScale
    let effNonRegContribB = nonRegContribB * contribScale
    const effTotalContribs  = effTfsaContribA + effTfsaContribB + effRrspContribA + effRrspContribB + effNonRegContribA + effNonRegContribB
    spending_nom += effTotalContribs

    // ── Gap fill / account draws ──────────────────────────────────────────────
    let tfsaWithdrawA = 0, tfsaWithdrawB = 0
    let nonRegWithdrawA = 0, nonRegWithdrawB = 0
    let hisaWithdraw_nom = 0
    let hisaSurplusContrib_nom = 0
    let proactiveExtra = 0
    let gap_nom: number
    let surplusRoutedTotal_nom = 0

    if (withdrawalStrategy.drawdownStrategy === 'none') {
      gap_nom = Math.max(0, spending_nom - totalNetNom)

    } else if (withdrawalStrategy.drawdownStrategy === 'spendGap') {
      const sgConfig = withdrawalStrategy.spendGapConfig
      const aRetired = onOrAfter(dateStr, state.personA.retirementDate)
      const bRetired = onOrAfter(dateStr, state.personB.retirementDate)
      const inMeltdownA = aAlive && aRetired && !isRrifA
      const inMeltdownB = bAlive && bRetired && !isRrifB

      // ── Phase 2 — Meltdown: proactively draw RRSP up to gross income ceiling ──
      // Use pre-split gross income as the ceiling baseline.  taxA/B.grossIncome
      // reflects pension splitting and may understate each person's individual
      // income (optimizer transfers income between spouses).  The pre-split gross
      // is the correct reference for per-person meltdown ceiling decisions.
      let meltdownExtraA = 0, meltdownExtraB = 0
      if (inMeltdownA && sgConfig.meltdownA.grossIncomeCeiling > 0) {
        const preGrossA = calculateTax(taxInputA, taxSettings, yearsFromNow, state.cpiRatePct).grossIncome
        const ceiling_nom = sgConfig.meltdownA.grossIncomeCeiling * inflFactor
        meltdownExtraA = Math.max(0, Math.min(ceiling_nom - preGrossA, rrspA))
        rrifA_nom += meltdownExtraA
        rrspA = Math.max(0, rrspA - meltdownExtraA)
      }
      if (inMeltdownB && sgConfig.meltdownB.grossIncomeCeiling > 0) {
        const preGrossB = calculateTax(taxInputB, taxSettings, yearsFromNow, state.cpiRatePct).grossIncome
        const ceiling_nom = sgConfig.meltdownB.grossIncomeCeiling * inflFactor
        meltdownExtraB = Math.max(0, Math.min(ceiling_nom - preGrossB, rrspB))
        rrifB_nom += meltdownExtraB
        rrspB = Math.max(0, rrspB - meltdownExtraB)
      }

      // ── Recompute tax if meltdown draws changed RRSP/RRIF income ─────────
      if (meltdownExtraA > 0 || meltdownExtraB > 0) {
        const updInputA = { ...taxInputA, pensionIncome: dbBase_nom + dbBridge_nom + rrifA_nom }
        const updInputB = { ...taxInputB, pensionIncome: dbBaseB_nom + dbBridgeB_nom + rrifB_nom }
        const eligSplitA2 = (aAlive ? dbBase_nom + dbBridge_nom : 0)
                          + (personAAgeInt >= 65 && aAlive ? rrifA_nom : 0)
        if (withdrawalStrategy.pensionSplitMode === 'auto' && aAlive && bAlive) {
          const opt = optimizePensionSplit(updInputA, updInputB, eligSplitA2, taxSettings, yearsFromNow, state.cpiRatePct)
          taxA = opt.taxA; taxB = opt.taxB
          splitAmount = eligSplitA2 * (opt.splitPct / 100)
        } else {
          const manualPct = withdrawalStrategy.pensionSplitMode === 'manual' ? withdrawalStrategy.pensionSplitPct : 0
          splitAmount  = eligSplitA2 * (manualPct / 100)
          taxA = calculateTax({ ...updInputA, pensionIncome: updInputA.pensionIncome - splitAmount }, taxSettings, yearsFromNow, state.cpiRatePct)
          taxB = calculateTax({ ...updInputB, pensionIncome: updInputB.pensionIncome + splitAmount }, taxSettings, yearsFromNow, state.cpiRatePct)
        }
        totalNetNom = (aAlive ? taxA.netAfterTax - nonRegYieldA + otherNonTaxA_nom : 0)
                    + (bAlive ? taxB.netAfterTax - nonRegYieldB + otherNonTaxB_nom : 0)
      }

      // ── Gap after proactive meltdown/RRIF draws ───────────────────────────
      gap_nom = Math.max(0, spending_nom - totalNetNom)

      // ── Deficit routing: draw accounts in merged phase-specific order ─────
      // Caps are per-person per-account — A's cap limits draws from A's account,
      // B's cap limits draws from B's account, independently.
      // Account ordering: A's items first, then any accounts B introduces, then fallbacks.
      // HISA is joint: use A's cap when A is active, else B's (one cap for one pool).
      const phaseItemsA: SpendGapDeficitItem[] = inMeltdownA ? sgConfig.meltdownA.deficitItems
        : isRrifA ? sgConfig.rrifA.deficitItems : []
      const phaseItemsB: SpendGapDeficitItem[] = inMeltdownB ? sgConfig.meltdownB.deficitItems
        : isRrifB ? sgConfig.rrifB.deficitItems : []
      type CapEntry = { cap: number; unlimited: boolean }
      const capMapA = new Map<SpendGapAccountType, CapEntry>()
      const capMapB = new Map<SpendGapAccountType, CapEntry>()
      // backward compat: if unlimited is undefined (old saved data), treat cap===0 as unlimited
      for (const item of phaseItemsA) capMapA.set(item.account, { cap: item.cap, unlimited: item.unlimited ?? (item.cap === 0) })
      for (const item of phaseItemsB) capMapB.set(item.account, { cap: item.cap, unlimited: item.unlimited ?? (item.cap === 0) })

      const acctOrder: SpendGapAccountType[] = []
      const seenAccts = new Set<SpendGapAccountType>()
      for (const item of [...phaseItemsA, ...phaseItemsB]) {
        if (!seenAccts.has(item.account)) { seenAccts.add(item.account); acctOrder.push(item.account) }
      }
      for (const acct of ['tfsa', 'nonReg', 'hisa'] as SpendGapAccountType[]) {
        if (!seenAccts.has(acct)) acctOrder.push(acct)
      }

      for (const acct of acctOrder) {
        if (gap_nom <= 0) break
        // Per-person cap: 0 = no cap (unlimited draw from that person's account).
        const entryA = capMapA.get(acct)
        const entryB = capMapB.get(acct)
        const capA_nom = (!entryA || entryA.unlimited) ? Infinity : entryA.cap * inflFactor
        const capB_nom = (!entryB || entryB.unlimited) ? Infinity : entryB.cap * inflFactor

        if (acct === 'hisa') {
          // Joint account — use A's cap when A is active, else B's.
          const cap_nom = phaseItemsA.length > 0 ? capA_nom : capB_nom
          const draw = Math.min(gap_nom, cap_nom, hisa)
          hisa -= draw; gap_nom -= draw; proactiveExtra += draw; hisaWithdraw_nom += draw
        } else if (acct === 'tfsa') {
          // Per-person caps: maxA and maxB each independently limited.
          const maxA = aAlive ? Math.min(capA_nom, tfsaA) : 0
          const maxB = bAlive ? Math.min(capB_nom, tfsaB) : 0
          const maxTotal = maxA + maxB
          if (maxTotal > 0) {
            const draw = Math.min(gap_nom, maxTotal)
            const drawA = draw * (maxA / maxTotal)
            const drawB = draw - drawA
            tfsaWithdrawA += drawA; tfsaWithdrawB += drawB
            tfsaA -= drawA; tfsaB -= drawB
            gap_nom -= draw; proactiveExtra += draw
          }
        } else if (acct === 'nonReg') {
          const maxA = aAlive ? Math.min(capA_nom, nonRegA) : 0
          const maxB = bAlive ? Math.min(capB_nom, nonRegB) : 0
          const maxTotal = maxA + maxB
          if (maxTotal > 0) {
            const draw = Math.min(gap_nom, maxTotal)
            const drawA = draw * (maxA / maxTotal)
            const drawB = draw - drawA
            if (nonRegA > 0) nonRegAcbA -= nonRegAcbA * (drawA / nonRegA)
            if (nonRegB > 0) nonRegAcbB -= nonRegAcbB * (drawB / nonRegB)
            nonRegWithdrawA += drawA; nonRegWithdrawB += drawB
            nonRegA -= drawA; nonRegB -= drawB
            gap_nom -= draw; proactiveExtra += draw
          }
        } else if (acct === 'rrif') {
          // Extra draw above mandatory minimum — per-person caps applied independently.
          // Tax on the extra draw is NOT recomputed in this pass (known single-pass limitation).
          const maxA = isRrifA && aAlive ? Math.min(capA_nom, rrspA) : 0
          const maxB = isRrifB && bAlive ? Math.min(capB_nom, rrspB) : 0
          const maxTotal = maxA + maxB
          if (maxTotal > 0) {
            const draw = Math.min(gap_nom, maxTotal)
            const drawA = draw * (maxA / maxTotal)
            rrifA_nom += drawA; rrifB_nom += draw - drawA
            gap_nom -= draw
          }
        }
      }

      // ── Emergency fallback: retired accounts still have balance ───────────
      // Covers the case where the ceiling was set low and deficit accounts exhausted.
      // Draws from any remaining RRSP (meltdown) or RRIF balance proportionally.
      if (gap_nom > 0) {
        const availA = (inMeltdownA || isRrifA) && aAlive ? rrspA : 0
        const availB = (inMeltdownB || isRrifB) && bAlive ? rrspB : 0
        const total = availA + availB
        if (total > 0) {
          const draw = Math.min(gap_nom, total)
          const drawA = draw * (availA / total)
          const drawB = draw - drawA
          rrifA_nom += drawA; rrifB_nom += drawB
          if (!isRrifA) rrspA = Math.max(0, rrspA - drawA)
          if (!isRrifB) rrspB = Math.max(0, rrspB - drawB)
          gap_nom -= draw
        }
      }

      // ── Surplus routing ────────────────────────────────────────────────────
      // When income exceeds spending + contributions (gap_nom = 0), route the
      // remaining surplus into accounts in the configured order.  Each non-last
      // account fills up to its limit (today's $, CPI-indexed); limit=0 skips
      // the account.  The last account always receives all remaining surplus
      // regardless of its limit.  TFSA and Non-Reg are split 50/50 A/B; HISA
      // is a joint pool.
      const activeSurplusItems = (isRrifA || isRrifB)
        ? sgConfig.surplusRrifItems
        : (inMeltdownA || inMeltdownB)
        ? sgConfig.surplusMeltdownItems
        : []
      if (gap_nom <= 0 && activeSurplusItems.length > 0) {
        let surplusRemaining = Math.max(0, totalNetNom + proactiveExtra - spending_nom)
        for (let si = 0; si < activeSurplusItems.length && surplusRemaining > 0.01; si++) {
          const item = activeSurplusItems[si]
          const isUnlimited = item.unlimited ?? false
          if (!isUnlimited && item.limit === 0) continue  // skip: no draw from this account
          const limit_nom = isUnlimited ? Infinity : item.limit * inflFactor
          const alloc = Math.min(surplusRemaining, limit_nom)
          if (alloc <= 0) continue
          const acct = item.account as SpendGapSurplusAccountType
          if (acct === 'hisa') {
            hisa += alloc
            hisaSurplusContrib_nom += alloc
          } else if (acct === 'tfsa') {
            const addA = (aAlive && bAlive) ? alloc / 2 : (aAlive ? alloc : 0)
            const addB = alloc - addA
            effTfsaContribA += addA
            effTfsaContribB += addB
          } else if (acct === 'nonReg') {
            const addA = (aAlive && bAlive) ? alloc / 2 : (aAlive ? alloc : 0)
            const addB = alloc - addA
            effNonRegContribA += addA
            effNonRegContribB += addB
            nonRegAcbA += addA
            nonRegAcbB += addB
          }
          surplusRoutedTotal_nom += alloc
          surplusRemaining -= alloc
        }
      }

    } else if (withdrawalStrategy.drawdownStrategy === 'fixedPct') {
      // Fixed percentage: all draws are explicit — no automatic gap-fill from any source.
      // RRSP/RRIF and non-reg already drawn pre-tax above.
      const fp = withdrawalStrategy.drawdownFixedPct
      if (aAlive) {
        tfsaWithdrawA = Math.min(Math.max(fp.tfsaPct / 100 * tfsaA * drawFracA, fp.tfsaMin * inflFactor * drawFracA), tfsaA)
        tfsaA -= tfsaWithdrawA
      }
      if (bAlive) {
        tfsaWithdrawB = Math.min(Math.max(fp.tfsaPct / 100 * tfsaB * drawFracB, fp.tfsaMin * inflFactor * drawFracB), tfsaB)
        tfsaB -= tfsaWithdrawB
      }
      nonRegWithdrawA = proNonRegWithdrawA
      nonRegWithdrawB = proNonRegWithdrawB
      const hisaDraw = Math.min(Math.max(fp.hisaPct / 100 * hisa * drawFracHisa, fp.hisaMin * inflFactor * drawFracHisa), hisa)
      hisa -= hisaDraw; hisaWithdraw_nom += hisaDraw
      proactiveExtra = tfsaWithdrawA + tfsaWithdrawB + nonRegWithdrawA + nonRegWithdrawB + hisaDraw
      gap_nom = Math.max(0, spending_nom - totalNetNom - proactiveExtra)

    } else {
      // Fixed withdrawal: ALL draws are explicit — no automatic gap-fill from any source.
      // RRSP/RRIF and non-reg draws already handled above (pre-tax). TFSA and HISA drawn here.
      const fw = withdrawalStrategy.drawdownFixedWithdrawal
      if (aAlive) {
        const rawAmt = bAlive ? fw.tfsaAmountA : Math.max(fw.tfsaAmountA, fw.tfsaAmountB)
        tfsaWithdrawA = Math.min(rawAmt * inflFactor * drawFracA, tfsaA)
        tfsaA -= tfsaWithdrawA
      }
      if (bAlive) {
        const rawAmt = aAlive ? fw.tfsaAmountB : Math.max(fw.tfsaAmountA, fw.tfsaAmountB)
        tfsaWithdrawB = Math.min(rawAmt * inflFactor * drawFracB, tfsaB)
        tfsaB -= tfsaWithdrawB
      }
      nonRegWithdrawA = proNonRegWithdrawA
      nonRegWithdrawB = proNonRegWithdrawB
      const hisaDraw = Math.min(fw.hisaAmount * inflFactor * drawFracHisa, hisa)
      hisa -= hisaDraw; hisaWithdraw_nom += hisaDraw
      proactiveExtra = tfsaWithdrawA + tfsaWithdrawB + nonRegWithdrawA + nonRegWithdrawB + hisaDraw
      gap_nom = Math.max(0, spending_nom - totalNetNom - proactiveExtra)
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

    rrspA   = grow(Math.max(0, rrspA  + effRrspContribA - (isRrifA ? rrifA_nom : 0)), rrspRetA)
    rrspB   = grow(Math.max(0, rrspB  + effRrspContribB - (isRrifB ? rrifB_nom : 0)), rrspRetB)
    tfsaA   = grow(tfsaA  + effTfsaContribA, tfsaRetA)
    tfsaB   = grow(tfsaB  + effTfsaContribB, tfsaRetB)
    nonRegA = grow(nonRegA + effNonRegContribA, nonRegRetA)
    nonRegB = grow(nonRegB + effNonRegContribB, nonRegRetB)
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
      hisaWithdrawal: pd(hisaWithdraw_nom),
      otherIncomeA: pd(otherTaxableA_nom + otherNonTaxA_nom),
      otherIncomeB: pd(otherTaxableB_nom + otherNonTaxB_nom),
      pensionSplitPaid:     pd(aAlive && bAlive ? splitAmount : 0),
      pensionSplitReceived: pd(aAlive && bAlive ? splitAmount : 0),

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

      householdSpending:  pd(spending_nom),
      spendingLifestyle:  pd(spendingLifestyle_nom),
      contributions:      pd(effTotalContribs + surplusRoutedTotal_nom),
      contribRrspA:   pd(effRrspContribA),
      contribRrspB:   pd(effRrspContribB),
      contribTfsaA:   pd(effTfsaContribA),
      contribTfsaB:   pd(effTfsaContribB),
      contribNonRegA: pd(effNonRegContribA),
      contribNonRegB: pd(effNonRegContribB),
      hisaContrib: pd(hisaSurplusContrib_nom),
      spendingUnexpected: pd(unexpectedSpend_nom),
      cashFlow:           pd(totalNetNom + proactiveExtra - spending_nom - surplusRoutedTotal_nom),

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

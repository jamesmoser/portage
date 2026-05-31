import { describe, it, expect } from 'vitest'
import { runProjection } from '../projection'
import { DEFAULT_STATE, CPP_COMBINED_MAX_MONTHLY } from '../defaults'
import { dateAtAge } from '../dates'
import type { AppState } from '../types'

// ─── Setup ────────────────────────────────────────────────────────────────────

const CY = new Date().getFullYear()

// All corner tests use pi=0, cpi=0 so PD = nominal, and return=0 so balances
// are exact and traceable.  Override only what each test needs to exercise.

function makeState(
  birthA: string, planEndA: number, retireA: string,
  birthB: string, planEndB: number, retireB: string,
  overrides: Partial<AppState> = {}
): AppState {
  return {
    ...DEFAULT_STATE,
    personalInflationRatePct: 0,
    cpiRatePct: 0,
    returnRates: { upTo55: 0, from55to65: 0, from65to70: 0, from70plus: 0 },
    personA: { ...DEFAULT_STATE.personA, birthDate: birthA, retirementDate: retireA, planningEndAge: planEndA },
    personB: { ...DEFAULT_STATE.personB, birthDate: birthB, retirementDate: retireB, planningEndAge: planEndB },
    employmentA: { annualAmount: 0, growthRatePct: 0 },
    employmentB: { annualAmount: 0, growthRatePct: 0 },
    dbPensionA: { ...DEFAULT_STATE.dbPensionA, enabled: false, annualAmount: 0 },
    dbPensionB: { ...DEFAULT_STATE.dbPensionB, enabled: false, annualAmount: 0 },
    cppA: { ...DEFAULT_STATE.cppA, estimatedMonthlyAt65: 0, startDate: dateAtAge(birthA, 65) },
    cppB: { ...DEFAULT_STATE.cppB, estimatedMonthlyAt65: 0, startDate: dateAtAge(birthB, 65) },
    oasA: { ...DEFAULT_STATE.oasA, estimatedMonthlyAt65: 0, startDate: dateAtAge(birthA, 65) },
    oasB: { ...DEFAULT_STATE.oasB, estimatedMonthlyAt65: 0, startDate: dateAtAge(birthB, 65) },
    rrspA: { ...DEFAULT_STATE.rrspA, balance: 0, annualContribution: 0, rrifConversionDate: dateAtAge(birthA, 71), returnRateOverrideEnabled: true, returnRateOverridePct: 0 },
    rrspB: { ...DEFAULT_STATE.rrspB, balance: 0, annualContribution: 0, rrifConversionDate: dateAtAge(birthB, 71), returnRateOverrideEnabled: true, returnRateOverridePct: 0 },
    tfsaA: { ...DEFAULT_STATE.tfsaA, balance: 0, annualContribution: 0, returnRateOverrideEnabled: true, returnRateOverridePct: 0 },
    tfsaB: { ...DEFAULT_STATE.tfsaB, balance: 0, annualContribution: 0, returnRateOverrideEnabled: true, returnRateOverridePct: 0 },
    nonRegA: { ...DEFAULT_STATE.nonRegA, balance: 0, acb: 0, annualContribution: 0 },
    nonRegB: { ...DEFAULT_STATE.nonRegB, balance: 0, acb: 0, annualContribution: 0 },
    cash: { hisaBalance: 0, hisaRatePct: 0, hisaMinBalance: 0 },
    spendingPhases: [],
    additionalSpending: [],
    withdrawalStrategy: { ...DEFAULT_STATE.withdrawalStrategy, drawdownStrategy: 'none' },
    ...overrides,
  }
}

// Helpers to find data points by year
function dp(points: ReturnType<typeof runProjection>['dataPoints'], year: number) {
  const d = points.find(p => p.year === year)
  if (!d) throw new Error(`No data point for year ${year}`)
  return d
}

// ─── Birth dates ──────────────────────────────────────────────────────────────
// Retirement group: person retires July 1
const bRetA  = `${CY - 55}-07-01`   // turns 55 this year in July; retires July 1 CY
const bRetA2 = `${CY - 54}-07-01`   // turns 54 this year; retires July 1 CY+1
const bRetB  = `${CY - 52}-01-01`   // companion, already retired long ago

// CPP/OAS group: Jan 1 birthday, turns 65 this year
const bGovA  = `${CY - 65}-01-01`
const bGovB  = `${CY - 62}-01-01`

// Death group: A dies July 1 in CY+2; B dies March 15 in CY+8
const bDthA  = `${CY - 71}-07-01`   // planEnd=73 → deathDate = CY+2-07-01
const bDthB  = `${CY - 68}-03-15`   // planEnd=76 → deathDate = CY+8-03-15

// ─── Retirement corners ───────────────────────────────────────────────────────
// A retires July 1 this year (month 7).
// Employment: monthly loop fires when !onOrAfter(monthDate, retirementDate).
//   Jan 1–Jun 1 < Jul 1 → employed (6 months)
//   Jul 1 onwards → not employed
// drawFrac: retirementMonth = 7; (12 − 7 + 1)/12 = 6/12 = 0.5
// DB pension startDate = Jul 1: onOrAfter fires for Jul–Dec (6 months)

describe('retirement corners', () => {
  const retireJul1  = `${CY}-07-01`
  const retireJul1B = `${CY - 20}-07-01`   // B already retired

  it('employment income is pro-rated to months worked in retirement year', () => {
    // A retires July 1 — employed Jan–Jun = 6 months out of 12
    const state = makeState(bRetA, 58, retireJul1, bRetB, 55, retireJul1B, {
      employmentA: { annualAmount: 120_000, growthRatePct: 0 },
    })
    const { dataPoints } = runProjection(state)
    expect(dp(dataPoints, CY).employmentA).toBeCloseTo(60_000, 0)
  })

  it('employment income is zero in years after retirement', () => {
    const state = makeState(bRetA, 58, retireJul1, bRetB, 55, retireJul1B, {
      employmentA: { annualAmount: 120_000, growthRatePct: 0 },
    })
    const { dataPoints } = runProjection(state)
    expect(dp(dataPoints, CY + 1).employmentA).toBe(0)
    expect(dp(dataPoints, CY + 2).employmentA).toBe(0)
  })

  it('DB pension is pro-rated in the pension start year', () => {
    // Pension starts July 1 — active Jul–Dec = 6 months
    const state = makeState(bRetA, 58, retireJul1, bRetB, 55, retireJul1B, {
      dbPensionA: {
        ...DEFAULT_STATE.dbPensionA,
        enabled: true,
        startDate: `${CY}-07-01`,
        annualAmount: 60_000,
        cpiIndexed: false,
        bridgeBenefitAmount: 0,
        survivorBenefitPct: 0,
        cppIntegration: false,
      },
    })
    const { dataPoints } = runProjection(state)
    expect(dp(dataPoints, CY).dbPensionBase).toBeCloseTo(30_000, 0)
  })

  it('DB pension is full in years after the start year', () => {
    const state = makeState(bRetA, 58, retireJul1, bRetB, 55, retireJul1B, {
      dbPensionA: {
        ...DEFAULT_STATE.dbPensionA,
        enabled: true,
        startDate: `${CY}-07-01`,
        annualAmount: 60_000,
        cpiIndexed: false,
        bridgeBenefitAmount: 0,
        survivorBenefitPct: 0,
        cppIntegration: false,
      },
    })
    const { dataPoints } = runProjection(state)
    expect(dp(dataPoints, CY + 1).dbPensionBase).toBeCloseTo(60_000, 0)
  })

  it('no fixed draws before retirement year (drawFrac = 0)', () => {
    // A retires July 1 of CY+1 — no TFSA draws in year CY
    const retireNextYear = `${CY + 1}-07-01`
    const state = makeState(bRetA2, 58, retireNextYear, bRetB, 55, retireJul1B, {
      tfsaA: { ...DEFAULT_STATE.tfsaA, balance: 100_000, annualContribution: 0, returnRateOverrideEnabled: true, returnRateOverridePct: 0 },
      withdrawalStrategy: {
        ...DEFAULT_STATE.withdrawalStrategy,
        drawdownStrategy: 'fixedWithdrawal',
        drawdownFixedWithdrawal: { ...DEFAULT_STATE.withdrawalStrategy.drawdownFixedWithdrawal, tfsaAmountA: 10_000 },
      },
    })
    const { dataPoints } = runProjection(state)
    expect(dp(dataPoints, CY).tfsaWithdrawalA).toBe(0)
  })

  it('fixed draws are pro-rated in the retirement year (drawFrac = 0.5 for July 1)', () => {
    // A retires July 1 of CY+1 — drawFrac = (12−7+1)/12 = 6/12 = 0.5
    const retireNextYear = `${CY + 1}-07-01`
    const state = makeState(bRetA2, 58, retireNextYear, bRetB, 55, retireJul1B, {
      tfsaA: { ...DEFAULT_STATE.tfsaA, balance: 100_000, annualContribution: 0, returnRateOverrideEnabled: true, returnRateOverridePct: 0 },
      withdrawalStrategy: {
        ...DEFAULT_STATE.withdrawalStrategy,
        drawdownStrategy: 'fixedWithdrawal',
        drawdownFixedWithdrawal: { ...DEFAULT_STATE.withdrawalStrategy.drawdownFixedWithdrawal, tfsaAmountA: 12_000 },
      },
    })
    const { dataPoints } = runProjection(state)
    expect(dp(dataPoints, CY + 1).tfsaWithdrawalA).toBeCloseTo(6_000, 0)
    expect(dp(dataPoints, CY + 2).tfsaWithdrawalA).toBeCloseTo(12_000, 0)
  })
})

// ─── CPP / OAS corners ────────────────────────────────────────────────────────
// Monthly gate: onOrAfter(monthDate, startDate) where monthDate = YYYY-MM-01.
// A July 1 start: Jul 1 >= Jul 1 → active Jul–Dec = 6 months in start year.
// cpi=0 so all years have the same per-month amount; ratio of years = ratio of months.

describe('CPP and OAS corners', () => {
  const retiredLongAgo = `${CY - 10}-01-01`

  it('CPP is zero before the start year', () => {
    // CPP starts next year; this year should have zero
    const state = makeState(bGovA, 70, retiredLongAgo, bGovB, 67, retiredLongAgo, {
      cppA: { ...DEFAULT_STATE.cppA, estimatedMonthlyAt65: 1_000, startDate: `${CY + 1}-01-01` },
    })
    const { dataPoints } = runProjection(state)
    expect(dp(dataPoints, CY).cppA).toBe(0)
  })

  it('CPP is pro-rated in the start year (July 1 start → ~half of full year)', () => {
    // Starts July 1 of CY+1: active Jul–Dec = 6 months.
    // Year CY+2 is the first full year (12 months). Ratio must be 6/12 = 0.5.
    const state = makeState(bGovA, 70, retiredLongAgo, bGovB, 67, retiredLongAgo, {
      cppA: { ...DEFAULT_STATE.cppA, estimatedMonthlyAt65: 1_000, startDate: `${CY + 1}-07-01` },
    })
    const { dataPoints } = runProjection(state)
    const startYear  = dp(dataPoints, CY + 1).cppA
    const fullYear   = dp(dataPoints, CY + 2).cppA
    expect(startYear / fullYear).toBeCloseTo(0.5, 2)
  })

  it('OAS is zero before the start year', () => {
    const state = makeState(bGovA, 70, retiredLongAgo, bGovB, 67, retiredLongAgo, {
      oasA: { ...DEFAULT_STATE.oasA, estimatedMonthlyAt65: 713, startDate: `${CY + 1}-01-01` },
    })
    const { dataPoints } = runProjection(state)
    expect(dp(dataPoints, CY).oasA).toBe(0)
  })

  it('OAS is pro-rated in the start year (July 1 start → 6 months)', () => {
    const state = makeState(bGovA, 70, retiredLongAgo, bGovB, 67, retiredLongAgo, {
      oasA: { ...DEFAULT_STATE.oasA, estimatedMonthlyAt65: 713, startDate: `${CY + 1}-07-01` },
    })
    const { dataPoints } = runProjection(state)
    const startYear = dp(dataPoints, CY + 1).oasA
    const fullYear  = dp(dataPoints, CY + 2).oasA
    expect(startYear / fullYear).toBeCloseTo(0.5, 2)
  })

  it("survivor CPP flows to B after A dies (60% of A's CPP, starting the month after death)", () => {
    // A: birthDate CY-71-07-01, CPP started at 65 (factor=1.0), $1000/month.
    // A dies July 1 of CY+2. Month 7 (Jul 1 ≤ Jul 1) → A still alive in July.
    // Survivor starts in August. Months 8–12 of CY+2 = 5 months.
    // B has no own CPP (estimatedMonthlyAt65=0). So all cppB in CY+3 is survivor.
    // CY+3 (first full post-death year): 1000 × 1.0 × 0.60 × 12 = 7200
    const state = makeState(bDthA, 73, `${CY - 15}-07-01`, bDthB, 76, `${CY - 12}-03-15`, {
      cppA: { ...DEFAULT_STATE.cppA, estimatedMonthlyAt65: 1_000, startDate: dateAtAge(bDthA, 65) },
      cppB: { ...DEFAULT_STATE.cppB, estimatedMonthlyAt65: 0,     startDate: dateAtAge(bDthB, 65) },
    })
    const { dataPoints } = runProjection(state)
    // CY+2: survivor benefit for 5 months (Aug–Dec) = 1000×0.6×5 = 3000
    expect(dp(dataPoints, CY + 2).cppB).toBeCloseTo(3_000, 0)
    // CY+3: full year survivor = 7200
    expect(dp(dataPoints, CY + 3).cppB).toBeCloseTo(7_200, 0)
  })

  it("no survivor CPP when A never started CPP before dying", () => {
    // A's CPP start date is after A's death (CY+2). B should receive no survivor CPP.
    const state = makeState(bDthA, 73, `${CY - 15}-07-01`, bDthB, 76, `${CY - 12}-03-15`, {
      cppA: { ...DEFAULT_STATE.cppA, estimatedMonthlyAt65: 1_000, startDate: `${CY + 10}-01-01` },
      cppB: { ...DEFAULT_STATE.cppB, estimatedMonthlyAt65: 0,     startDate: dateAtAge(bDthB, 65) },
    })
    const { dataPoints } = runProjection(state)
    // No survivor CPP in the years immediately after A's death
    expect(dp(dataPoints, CY + 3).cppB).toBe(0)
    expect(dp(dataPoints, CY + 4).cppB).toBe(0)
  })
})

// ─── Death corners ────────────────────────────────────────────────────────────
// Person A: birthDate bDthA = CY-71-07-01, planEnd=73 → deathDate = CY+2-07-01, endYearA = CY+2
// Person B: birthDate bDthB = CY-68-03-15, planEnd=76 → deathDate = CY+8-03-15, endYearB = CY+8
// A dies Jul 1. mAAlive=true in July (Jul 1 ≤ Jul 1), false from August.
// B dies Mar 15. mBAlive=true in March (Mar 1 ≤ Mar 15), false from April.

describe('death corners', () => {
  const retiredA = `${CY - 15}-07-01`
  const retiredB = `${CY - 12}-03-15`

  function deathState(extra: Partial<AppState> = {}) {
    return makeState(bDthA, 73, retiredA, bDthB, 76, retiredB, extra)
  }

  it('CPP income for A is zero in years after death', () => {
    const state = deathState({
      cppA: { ...DEFAULT_STATE.cppA, estimatedMonthlyAt65: 1_000, startDate: dateAtAge(bDthA, 65) },
    })
    const { dataPoints } = runProjection(state)
    expect(dp(dataPoints, CY + 3).cppA).toBe(0)
    expect(dp(dataPoints, CY + 4).cppA).toBe(0)
  })

  it('CPP income for A is pro-rated in the death year (7 months for July 1 death)', () => {
    // Jul 1 death: mAAlive in months 1–7 (Jul 1 ≤ Jul 1). 8 months ago is wrong.
    // Active months: Jan(1), Feb(2), Mar(3), Apr(4), May(5), Jun(6), Jul(7) = 7 months.
    // Ratio of death year to prior full year = 7/12.
    const state = deathState({
      cppA: { ...DEFAULT_STATE.cppA, estimatedMonthlyAt65: 1_000, startDate: dateAtAge(bDthA, 65) },
    })
    const { dataPoints } = runProjection(state)
    const deathYear  = dp(dataPoints, CY + 2).cppA
    const priorYear  = dp(dataPoints, CY + 1).cppA
    expect(deathYear / priorYear).toBeCloseTo(7 / 12, 2)
  })

  it('OAS income for A is pro-rated in the death year (7 months for July 1 death)', () => {
    const state = deathState({
      oasA: { ...DEFAULT_STATE.oasA, estimatedMonthlyAt65: 713, startDate: dateAtAge(bDthA, 65) },
    })
    const { dataPoints } = runProjection(state)
    expect(dp(dataPoints, CY + 2).oasA / dp(dataPoints, CY + 1).oasA).toBeCloseTo(7 / 12, 2)
  })

  it('fixed TFSA draw is pro-rated in the death year (drawFrac = 7/12 for July 1)', () => {
    // drawFrac in death year = deathMonth/12 = 7/12. tfsaAmountA = 12000/yr → 7000 in death year.
    const state = deathState({
      tfsaA: { ...DEFAULT_STATE.tfsaA, balance: 100_000, annualContribution: 0, returnRateOverrideEnabled: true, returnRateOverridePct: 0 },
      withdrawalStrategy: {
        ...DEFAULT_STATE.withdrawalStrategy,
        drawdownStrategy: 'fixedWithdrawal',
        drawdownFixedWithdrawal: { ...DEFAULT_STATE.withdrawalStrategy.drawdownFixedWithdrawal, tfsaAmountA: 12_000 },
      },
    })
    const { dataPoints } = runProjection(state)
    expect(dp(dataPoints, CY + 2).tfsaWithdrawalA).toBeCloseTo(7_000, 0)
  })

  it('no TFSA draw for A in years after death', () => {
    const state = deathState({
      tfsaA: { ...DEFAULT_STATE.tfsaA, balance: 100_000, annualContribution: 0, returnRateOverrideEnabled: true, returnRateOverridePct: 0 },
      withdrawalStrategy: {
        ...DEFAULT_STATE.withdrawalStrategy,
        drawdownStrategy: 'fixedWithdrawal',
        drawdownFixedWithdrawal: { ...DEFAULT_STATE.withdrawalStrategy.drawdownFixedWithdrawal, tfsaAmountA: 12_000 },
      },
    })
    const { dataPoints } = runProjection(state)
    expect(dp(dataPoints, CY + 3).tfsaWithdrawalA).toBe(0)
  })

  it('household spending continues at full annual amount in the year A dies (B is alive all year)', () => {
    // B alive all 12 months of CY+2. anyAlive = true all year. Full spending.
    const spending = 24_000
    const state = deathState({
      spendingPhases: [{ id: 'p0', label: 'Test', startAge: 0, annualAmount: spending, growthRatePct: 0, linkedToFirstDeath: undefined}],
    })
    const { dataPoints } = runProjection(state)
    // CY+2 spending should equal CY+1 spending (A dying doesn't reduce spending)
    expect(dp(dataPoints, CY + 2).householdSpending).toBeCloseTo(dp(dataPoints, CY + 1).householdSpending, 0)
  })

  it('household spending is pro-rated in the final year (B dies March 15 → 3 months)', () => {
    // Year CY+8: A already dead. B alive Jan(1 ≤ Mar 15), Feb(1 ≤ Mar 15), Mar(1 ≤ Mar 15),
    // not Apr(1 > Mar 15). aliveMonths = 3. Spending = 24000 × 3/12 = 6000.
    const spending = 24_000
    const state = deathState({
      spendingPhases: [{ id: 'p0', label: 'Test', startAge: 0, annualAmount: spending, growthRatePct: 0, linkedToFirstDeath: undefined}],
    })
    const { dataPoints } = runProjection(state)
    expect(dp(dataPoints, CY + 8).householdSpending).toBeCloseTo(6_000, 0)
  })

  it('DB pension survivor benefit starts the month after A dies and is correct in the death year', () => {
    // A dies July 1. Survivor months: Aug–Dec = 5 months.
    // Annual pension = 60000, survivorBenefitPct = 0.6.
    // Survivor payment in CY+2 = 60000 × 0.6 × 5/12 = 15000.
    const state = deathState({
      dbPensionA: {
        ...DEFAULT_STATE.dbPensionA,
        enabled: true,
        startDate: dateAtAge(bDthA, 65),
        annualAmount: 60_000,
        cpiIndexed: false,
        bridgeBenefitAmount: 0,
        survivorBenefitPct: 0.6,
        cppIntegration: false,
      },
    })
    const { dataPoints } = runProjection(state)
    expect(dp(dataPoints, CY + 2).dbPensionBaseB).toBeCloseTo(15_000, 0)
  })

  it('DB pension survivor benefit is a full year in years after A dies', () => {
    // Year CY+3: 60000 × 0.6 × 12/12 = 36000
    const state = deathState({
      dbPensionA: {
        ...DEFAULT_STATE.dbPensionA,
        enabled: true,
        startDate: dateAtAge(bDthA, 65),
        annualAmount: 60_000,
        cpiIndexed: false,
        bridgeBenefitAmount: 0,
        survivorBenefitPct: 0.6,
        cppIntegration: false,
      },
    })
    const { dataPoints } = runProjection(state)
    expect(dp(dataPoints, CY + 3).dbPensionBaseB).toBeCloseTo(36_000, 0)
  })

  it("DB pension for A is zero after death", () => {
    const state = deathState({
      dbPensionA: {
        ...DEFAULT_STATE.dbPensionA,
        enabled: true,
        startDate: dateAtAge(bDthA, 65),
        annualAmount: 60_000,
        cpiIndexed: false,
        bridgeBenefitAmount: 0,
        survivorBenefitPct: 0.6,
        cppIntegration: false,
      },
    })
    const { dataPoints } = runProjection(state)
    expect(dp(dataPoints, CY + 3).dbPensionBase).toBe(0)
  })

  it("RRSP rolls over to B in the first year after A's death", () => {
    // A holds 100k in RRSP. A dies in CY+2. In CY+3, aAlive=false → rollover fires.
    // B's RRSP should jump from 0 to 100k at start of CY+3 (then grows at 0%).
    const state = deathState({
      rrspA: { ...DEFAULT_STATE.rrspA, balance: 100_000, annualContribution: 0, rrifConversionDate: dateAtAge(bDthA, 71), returnRateOverrideEnabled: true, returnRateOverridePct: 0 },
      rrspB: { ...DEFAULT_STATE.rrspB, balance: 0,       annualContribution: 0, rrifConversionDate: dateAtAge(bDthB, 71), returnRateOverrideEnabled: true, returnRateOverridePct: 0 },
    })
    const { dataPoints } = runProjection(state)
    // Before death: A has RRSP, B has none
    expect(dp(dataPoints, CY + 1).rrspA).toBeGreaterThan(0)
    expect(dp(dataPoints, CY + 1).rrspB).toBe(0)
    // First year after death: B has inherited A's balance, A is zero
    expect(dp(dataPoints, CY + 3).rrspA).toBe(0)
    expect(dp(dataPoints, CY + 3).rrspB).toBeGreaterThan(0)
  })

  it("RRSP for A remains zero in all years after the rollover", () => {
    const state = deathState({
      rrspA: { ...DEFAULT_STATE.rrspA, balance: 100_000, annualContribution: 0, rrifConversionDate: dateAtAge(bDthA, 71), returnRateOverrideEnabled: true, returnRateOverridePct: 0 },
    })
    const { dataPoints } = runProjection(state)
    expect(dp(dataPoints, CY + 4).rrspA).toBe(0)
    expect(dp(dataPoints, CY + 5).rrspA).toBe(0)
  })
})

// ─── Edge cases ───────────────────────────────────────────────────────────────

describe('death edge cases', () => {
  it('when retirement year = death year, drawFrac uses both proration correctly', () => {
    // A retires April 1 and dies September 1 in the same year (CY).
    // drawFrac = (deathMonth − retirementMonth + 1)/12 = (9 − 4 + 1)/12 = 6/12 = 0.5
    // tfsaAmountA = 12000 → draw = 12000 × 0.5 = 6000
    const bEdge = `${CY - 55}-09-01`  // turns 55 in Sept; dies Sept 1 this year
    const state = makeState(
      bEdge, 55, `${CY}-04-01`,          // retires April 1, dies Sept 1 (planEnd 55 = this year)
      bRetB, 55, `${CY - 20}-01-01`,
      {
        tfsaA: { ...DEFAULT_STATE.tfsaA, balance: 100_000, annualContribution: 0, returnRateOverrideEnabled: true, returnRateOverridePct: 0 },
        withdrawalStrategy: {
          ...DEFAULT_STATE.withdrawalStrategy,
          drawdownStrategy: 'fixedWithdrawal',
          drawdownFixedWithdrawal: { ...DEFAULT_STATE.withdrawalStrategy.drawdownFixedWithdrawal, tfsaAmountA: 12_000 },
        },
      }
    )
    const { dataPoints } = runProjection(state)
    expect(dp(dataPoints, CY).tfsaWithdrawalA).toBeCloseTo(6_000, 0)
  })

  it('no income when person dies before the benefit start date', () => {
    // A dies CY+2. CPP startDate = CY+5 (after death). A should receive no CPP ever.
    const state = makeState(bDthA, 73, `${CY - 15}-07-01`, bDthB, 76, `${CY - 12}-03-15`, {
      cppA: { ...DEFAULT_STATE.cppA, estimatedMonthlyAt65: 1_000, startDate: `${CY + 5}-01-01` },
    })
    const { dataPoints } = runProjection(state)
    for (const d of dataPoints) {
      expect(d.cppA).toBe(0)
    }
  })
})

// ─── Contribution surplus capping ─────────────────────────────────────────────
// Contributions are funded from surplus only — income remaining after lifestyle
// and unexpected spending.  If surplus < planned contributions, they are scaled
// proportionally.  Account balances must reflect the effective (scaled) amount,
// not the planned amount, so no money is created from nothing.

describe('contribution surplus capping', () => {
  // Pre-retirement couple; both working, retire far in future.
  // pi=0, cpi=0, return=0 → PD = nominal, balances are exact.
  const bA50 = `${CY - 50}-01-01`
  const bB47 = `${CY - 47}-01-01`
  const retireFar = `${CY + 20}-01-01`

  function contribState(overrides: Partial<AppState> = {}): AppState {
    return makeState(bA50, 52, retireFar, bB47, 50, retireFar, overrides)
  }

  it('contributions are suppressed entirely when there is no income surplus', () => {
    // No income, no spending → totalNetNom = 0 → surplus = 0 → all contributions = 0.
    const state = contribState({
      tfsaA: { ...DEFAULT_STATE.tfsaA, balance: 0, annualContribution: 10_000,
               contributionEndDate: dateAtAge(bA50, 55), returnRateOverrideEnabled: true, returnRateOverridePct: 0 },
    })
    const { dataPoints } = runProjection(state)
    const d = dp(dataPoints, CY)
    expect(d.contribTfsaA).toBe(0)
    expect(d.tfsaA).toBe(0)
    expect(d.contributions).toBe(0)
  })

  it('existing account balance is unchanged when contributions are suppressed', () => {
    // Starting balance 50,000; no income → surplus = 0 → no contribution → balance stays.
    const state = contribState({
      tfsaA: { ...DEFAULT_STATE.tfsaA, balance: 50_000, annualContribution: 10_000,
               contributionEndDate: dateAtAge(bA50, 55), returnRateOverrideEnabled: true, returnRateOverridePct: 0 },
    })
    const { dataPoints } = runProjection(state)
    expect(dp(dataPoints, CY).tfsaA).toBeCloseTo(50_000, 0)
  })

  it('full planned contribution lands when surplus clearly exceeds it', () => {
    // Large employment income → after-tax net >> spending + contribution.
    const state = contribState({
      employmentA: { annualAmount: 200_000, growthRatePct: 0 },
      tfsaA: { ...DEFAULT_STATE.tfsaA, balance: 0, annualContribution: 10_000,
               contributionEndDate: dateAtAge(bA50, 55), returnRateOverrideEnabled: true, returnRateOverridePct: 0 },
    })
    const { dataPoints } = runProjection(state)
    const d = dp(dataPoints, CY)
    expect(d.contribTfsaA).toBeCloseTo(10_000, 0)
    expect(d.tfsaA).toBeCloseTo(10_000, 0)
    expect(d.contributions).toBeCloseTo(10_000, 0)
  })

  it('contribution is capped at available surplus — below-BPA income gives exact math', () => {
    // Employment $5,000 < federal BPA ($15,705) and Ontario BPA ($11,865) → tax = 0 exactly.
    // totalNetNom = $5,000.  Lifestyle spending = $1,000.  Surplus = $4,000.
    // Planned TFSA contribution = $10,000 → scale = 4,000/10,000 = 0.4 → effective = $4,000.
    const state = contribState({
      employmentA: { annualAmount: 5_000, growthRatePct: 0 },
      spendingPhases: [{ id: 'p0', label: 'test', startAge: 0, annualAmount: 1_000,
                         growthRatePct: 0, linkedToFirstDeath: undefined}],
      tfsaA: { ...DEFAULT_STATE.tfsaA, balance: 0, annualContribution: 10_000,
               contributionEndDate: dateAtAge(bA50, 55), returnRateOverrideEnabled: true, returnRateOverridePct: 0 },
    })
    const { dataPoints } = runProjection(state)
    const d = dp(dataPoints, CY)
    expect(d.contribTfsaA).toBeCloseTo(4_000, 0)
    expect(d.tfsaA).toBeCloseTo(4_000, 0)
  })

  it('multiple account contributions are scaled proportionally when total exceeds surplus', () => {
    // Same below-BPA setup: totalNetNom = $5,000, spending = $1,000, surplus = $4,000.
    // TFSA A $3,000 + TFSA B $3,000 = $6,000 total > $4,000 surplus.
    // Scale = 4,000/6,000 = 2/3 → each person gets $2,000.
    const state = contribState({
      employmentA: { annualAmount: 5_000, growthRatePct: 0 },
      spendingPhases: [{ id: 'p0', label: 'test', startAge: 0, annualAmount: 1_000,
                         growthRatePct: 0, linkedToFirstDeath: undefined}],
      tfsaA: { ...DEFAULT_STATE.tfsaA, balance: 0, annualContribution: 3_000,
               contributionEndDate: dateAtAge(bA50, 55), returnRateOverrideEnabled: true, returnRateOverridePct: 0 },
      tfsaB: { ...DEFAULT_STATE.tfsaB, balance: 0, annualContribution: 3_000,
               contributionEndDate: dateAtAge(bB47, 55), returnRateOverrideEnabled: true, returnRateOverridePct: 0 },
    })
    const { dataPoints } = runProjection(state)
    const d = dp(dataPoints, CY)
    expect(d.contribTfsaA).toBeCloseTo(2_000, 0)
    expect(d.contribTfsaB).toBeCloseTo(2_000, 0)
    expect(d.tfsaA).toBeCloseTo(2_000, 0)
    expect(d.tfsaB).toBeCloseTo(2_000, 0)
  })
})

// ─── Pension split tracking ────────────────────────────────────────────────────
// pensionSplitPaid (A's deduction) and pensionSplitReceived (B's addition) must
// always be equal — the split is a zero-sum transfer between spouses.
// Both must be zero when only one person is alive.

describe('pension split tracking (pensionSplitPaid / pensionSplitReceived)', () => {
  const bSplitA = `${CY - 65}-01-01`   // A age 65; planEnd 68 → 3 data points
  const bSplitB = `${CY - 62}-01-01`   // B age 62; planEnd 65 → 3 data points
  const retiredLongAgo = `${CY - 20}-01-01`

  // DB pension for A: $80k/year, already started, no indexing, no survivor benefit.
  const dbPension80k = {
    ...DEFAULT_STATE.dbPensionA,
    enabled: true,
    startDate: retiredLongAgo,
    annualAmount: 80_000,
    cpiIndexed: false,
    indexingRatePct: 0,
    bridgeBenefitAmount: 0,
    survivorBenefitPct: 0,
    cppIntegration: false,
  }

  it('both fields are zero when there is no eligible pension income', () => {
    const state = makeState(bSplitA, 68, retiredLongAgo, bSplitB, 65, retiredLongAgo)
    const { dataPoints } = runProjection(state)
    for (const d of dataPoints) {
      expect(d.pensionSplitPaid).toBe(0)
      expect(d.pensionSplitReceived).toBe(0)
    }
  })

  it('pensionSplitPaid equals pensionSplitReceived in all years when splitting occurs', () => {
    // A has $80k pension, B has no income — auto split should transfer a significant amount.
    const state = makeState(bSplitA, 68, retiredLongAgo, bSplitB, 65, retiredLongAgo, {
      dbPensionA: dbPension80k,
      withdrawalStrategy: { ...DEFAULT_STATE.withdrawalStrategy, drawdownStrategy: 'none', pensionSplitMode: 'auto' },
    })
    const { dataPoints } = runProjection(state)
    const hasSplit = dataPoints.some(d => d.pensionSplitPaid > 0)
    expect(hasSplit).toBe(true)
    for (const d of dataPoints) {
      expect(d.pensionSplitPaid).toBeGreaterThanOrEqual(0)
      expect(d.pensionSplitReceived).toBeGreaterThanOrEqual(0)
      expect(d.pensionSplitPaid).toBeCloseTo(d.pensionSplitReceived, 1)
    }
  })

  it('both fields are zero after A dies — split requires both spouses alive', () => {
    const bADies  = `${CY - 65}-01-01`  // planEnd 67 → A's last year is CY+2
    const bBLives = `${CY - 60}-01-01`  // planEnd 65 → B lives to CY+5
    const state = makeState(bADies, 67, retiredLongAgo, bBLives, 65, retiredLongAgo, {
      dbPensionA: { ...dbPension80k, startDate: retiredLongAgo },
      withdrawalStrategy: { ...DEFAULT_STATE.withdrawalStrategy, drawdownStrategy: 'none', pensionSplitMode: 'auto' },
    })
    const { dataPoints } = runProjection(state)
    const afterDeath = dataPoints.filter(d => d.year >= CY + 3)
    expect(afterDeath.length).toBeGreaterThan(0)
    for (const d of afterDeath) {
      expect(d.pensionSplitPaid).toBe(0)
      expect(d.pensionSplitReceived).toBe(0)
    }
  })

  it('total household gross income is conserved regardless of split percentage', () => {
    // Splitting transfers income from A to B but must not create or destroy taxable income.
    // grossIncomeA + grossIncomeB must be the same whether split is 0% or auto-optimised.
    const base = {
      dbPensionA: dbPension80k,
    }
    const stateNoSplit = makeState(bSplitA, 68, retiredLongAgo, bSplitB, 65, retiredLongAgo, {
      ...base,
      withdrawalStrategy: { ...DEFAULT_STATE.withdrawalStrategy, drawdownStrategy: 'none',
                             pensionSplitMode: 'manual', pensionSplitPct: 0 },
    })
    const stateAutoSplit = makeState(bSplitA, 68, retiredLongAgo, bSplitB, 65, retiredLongAgo, {
      ...base,
      withdrawalStrategy: { ...DEFAULT_STATE.withdrawalStrategy, drawdownStrategy: 'none', pensionSplitMode: 'auto' },
    })
    const dpNo   = runProjection(stateNoSplit).dataPoints
    const dpAuto = runProjection(stateAutoSplit).dataPoints
    expect(dpNo).toHaveLength(dpAuto.length)
    for (let i = 0; i < dpNo.length; i++) {
      const totalNo   = dpNo[i].grossIncomeA   + dpNo[i].grossIncomeB
      const totalAuto = dpAuto[i].grossIncomeA + dpAuto[i].grossIncomeB
      expect(totalAuto).toBeCloseTo(totalNo, 0)
    }
  })
})

// ─── CPP survivor benefit combined maximum cap ─────────────────────────────────
// CRA rule: combined (own retirement + survivor) cannot exceed CPP_COMBINED_MAX_MONTHLY
// (CPI-indexed).  The survivor benefit is reduced first — own CPP is never cut.
//
// Setup: pi=0, cpi=0 so monthly amounts are constant and PD=nominal.
// A (born Jan 1, age 68) lives for 4 years.  B (born Jan 1, age 65) dies end of CY+1.
// Both started CPP at 65 (factor = 1.0).  CY+2 is the first full post-death year.
//
//   Uncapped:  combined = own + 0.60×deceased   if combined ≤ cap
//   Capped:    survivor reduced so own + survivor = cap

describe('CPP survivor combined maximum cap', () => {
  const bCapA = `${CY - 68}-01-01`   // A: age 68, planEnd 72 → endYearA = CY+4
  const bCapB = `${CY - 65}-01-01`   // B: age 65, planEnd 66 → deathDate Jan 1 CY+1, endYearB = CY+1
  const retiredLongAgo = `${CY - 15}-01-01`

  function capState(monthlyA: number, monthlyB: number, startAgeA = 65, startAgeB = 65): AppState {
    return makeState(bCapA, 72, retiredLongAgo, bCapB, 66, retiredLongAgo, {
      cppA: { ...DEFAULT_STATE.cppA, estimatedMonthlyAt65: monthlyA, startDate: dateAtAge(bCapA, startAgeA) },
      cppB: { ...DEFAULT_STATE.cppB, estimatedMonthlyAt65: monthlyB, startDate: dateAtAge(bCapB, startAgeB) },
    })
  }

  it('survivor is uncapped when combined is below the monthly maximum', () => {
    // A: $700/mo own; B (deceased): $700/mo → raw survivor $420/mo
    // Combined $1,120/mo < $1,563 cap → uncapped; annual CY+2 = 1120 × 12 = 13,440
    const { dataPoints } = runProjection(capState(700, 700))
    const full = dp(dataPoints, CY + 2).cppA
    expect(full).toBeCloseTo((700 + 700 * 0.60) * 12, 0)
    expect(full).toBeLessThan(CPP_COMBINED_MAX_MONTHLY * 12)
  })

  it('survivor is reduced when combined would exceed the monthly maximum', () => {
    // A: $1,000/mo own; B (deceased): $1,000/mo → raw survivor $600/mo
    // Combined $1,600/mo > $1,563 cap → survivor capped at $563/mo
    // Annual CY+2 = 1,563 × 12 = 18,756
    const { dataPoints } = runProjection(capState(1_000, 1_000))
    const capped = dp(dataPoints, CY + 2).cppA
    expect(capped).toBeCloseTo(CPP_COMBINED_MAX_MONTHLY * 12, 0)
    expect(capped).toBeLessThan((1_000 + 1_000 * 0.60) * 12)
  })

  it('full survivor benefit flows when A has no own CPP (survivor well below cap)', () => {
    // A: no CPP; B (deceased): $1,000/mo → survivor $600/mo < $1,563 cap → uncapped
    // Annual CY+2 = 600 × 12 = 7,200
    const { dataPoints } = runProjection(capState(0, 1_000))
    expect(dp(dataPoints, CY + 2).cppA).toBeCloseTo(600 * 12, 0)
  })

  it('survivor is zero when own CPP (deferred to 70) already fills the scaled cap', () => {
    // A: $1,563/mo at 65 deferred to 70 → factor 1.42 → own = $2,219/mo
    // Scaled cap = 1,563 × 1.42 = $2,219/mo → headroom = 0 → no survivor benefit
    // Annual CY+2 = 2,219 × 12 ≈ 26,628  (own CPP is NOT reduced)
    const { dataPoints } = runProjection(capState(CPP_COMBINED_MAX_MONTHLY, 1_000, 70, 65))
    const ownOnly = dp(dataPoints, CY + 2).cppA
    const expectedOwn = CPP_COMBINED_MAX_MONTHLY * 1.42 * 12
    expect(ownOnly).toBeCloseTo(expectedOwn, 0)
    expect(ownOnly).toBeGreaterThan(CPP_COMBINED_MAX_MONTHLY * 12)
  })

  it("survivor receives 60% of deceased's age-65 amount, not their deferred amount", () => {
    // B deferred to 70 (factor 1.42) but the deferral premium is not transferable.
    // A (survivor): no own CPP; B (deceased): $1,000/mo at 65, deferred to 70.
    // Correct:  survivor = 1,000 × 0.60 = 600/mo → 7,200/yr
    // Wrong:    survivor = 1,000 × 1.42 × 0.60 = 852/mo → 10,224/yr
    const bOldB = `${CY - 80}-01-01`   // B: age 80 now, planEnd=81 → dies end CY+1; CPP started at 70 (CY-10)
    const bOldA = `${CY - 68}-01-01`   // A: age 68 now, planEnd=72; CPP started at 65 (CY-3)
    const state = makeState(bOldA, 72, retiredLongAgo, bOldB, 81, retiredLongAgo, {
      cppA: { ...DEFAULT_STATE.cppA, estimatedMonthlyAt65: 0,     startDate: dateAtAge(bOldA, 65) },
      cppB: { ...DEFAULT_STATE.cppB, estimatedMonthlyAt65: 1_000, startDate: dateAtAge(bOldB, 70) },
    })
    const { dataPoints } = runProjection(state)
    // CY+2: first full year after B's death
    expect(dp(dataPoints, CY + 2).cppA).toBeCloseTo(1_000 * 0.60 * 12, 0)  // 7,200
  })

  it("combined maximum cap scales with survivor's own deferral factor", () => {
    // A deferred to 70 (factor 1.42): own = 1,000 × 1.42 = 1,420/mo; raw survivor = 1,000 × 0.60 = 600/mo
    // Correct cap  = 1,563 × 1.42 = 2,219/mo → combined 2,020 < 2,219 → uncapped → 2,020 × 12 = 24,240
    // Wrong flat cap = 1,563/mo → combined 2,020 > 1,563 → capped at 1,563 × 12 = 18,756
    const { dataPoints } = runProjection(capState(1_000, 1_000, 70, 65))
    // CY+2: A starts CPP (deferred to 70); B died Dec 31 CY+1
    expect(dp(dataPoints, CY + 2).cppA).toBeCloseTo((1_000 * 1.42 + 1_000 * 0.60) * 12, 0)
  })

  it('symmetric: cap applies to B when A is the deceased', () => {

    // Same logic in the other direction — B survives A.
    // Use bDthA (dies CY+2) and bCapA as survivor to confirm symmetry.
    // A: $1,000/mo; B: $1,000/mo → in years after A's death, B's combined is capped.
    const bSurvA = `${CY - 71}-07-01`   // dies CY+2-07-01 (reusing bDthA birth)
    const bSurvB = `${CY - 65}-01-01`   // lives to CY+5
    const state = makeState(bSurvA, 73, retiredLongAgo, bSurvB, 70, retiredLongAgo, {
      cppA: { ...DEFAULT_STATE.cppA, estimatedMonthlyAt65: 1_000, startDate: dateAtAge(bSurvA, 65) },
      cppB: { ...DEFAULT_STATE.cppB, estimatedMonthlyAt65: 1_000, startDate: dateAtAge(bSurvB, 65) },
    })
    const { dataPoints } = runProjection(state)
    // CY+3: first full year after A's death (A dies July CY+2).
    // B's combined = 1000 + 600 = 1600 > 1563 → capped at 1563 × 12 = 18,756
    expect(dp(dataPoints, CY + 3).cppB).toBeCloseTo(CPP_COMBINED_MAX_MONTHLY * 12, 0)
  })
})

// ─── RRSP contribution tax deduction ──────────────────────────────────────────
//
// RRSP contributions reduce net income for tax purposes (CRA T1 line 20800).
// The engine applies the deduction by subtracting the contribution from
// employment income before passing to calculateTax.

describe('RRSP contribution tax deduction', () => {
  const birthA    = `${CY - 50}-01-01`   // A: age 50, retires CY+10
  const birthB    = `${CY - 48}-01-01`   // B: age 48, not contributing
  const retireA   = dateAtAge(birthA, 60)
  const retireB   = dateAtAge(birthB, 60)

  function deductionState(rrspContrib: number): AppState {
    return makeState(birthA, 90, retireA, birthB, 90, retireB, {
      employmentA: { annualAmount: 120_000, growthRatePct: 0 },
      rrspA: {
        ...DEFAULT_STATE.rrspA,
        balance: 0,
        annualContribution:  rrspContrib,
        contributionEndDate: dateAtAge(birthA, 60),
        contributionTiming:  'lump',
        rrifConversionDate:  dateAtAge(birthA, 71),
        returnRateOverrideEnabled: true,
        returnRateOverridePct: 0,
      },
    })
  }

  it('RRSP contribution reduces gross income by the contribution amount', () => {
    const { dataPoints: withoutD } = runProjection(deductionState(0))
    const { dataPoints: withD    } = runProjection(deductionState(20_000))
    // CY+1: A working, contributing.  grossIncomeA = net income for tax purposes.
    // With deduction: employment income passed to tax engine = 120,000 − 20,000 = 100,000.
    expect(dp(withD, CY + 1).grossIncomeA).toBeCloseTo(
      dp(withoutD, CY + 1).grossIncomeA - 20_000, 0)
  })

  it('RRSP contribution reduces tax paid', () => {
    const { dataPoints: withoutD } = runProjection(deductionState(0))
    const { dataPoints: withD    } = runProjection(deductionState(20_000))
    expect(dp(withD, CY + 1).taxA).toBeLessThan(dp(withoutD, CY + 1).taxA)
  })

  it('RRSP deduction does not apply after contributions stop (retirement year)', () => {
    const { dataPoints: withoutD } = runProjection(deductionState(0))
    const { dataPoints: withD    } = runProjection(deductionState(20_000))
    // Contributions end at age 60 (CY+10).  From CY+11 onward: no contribution → no deduction.
    // With zero income after retirement and no other sources, both gross incomes are equal.
    expect(dp(withD, CY + 11).grossIncomeA).toBeCloseTo(
      dp(withoutD, CY + 11).grossIncomeA, 0)
  })
})

// ─── Spousal RRSP ─────────────────────────────────────────────────────────────
//
// spousalBalance on rrspA = money A contributed to B's spousal RRSP (held in B's name).
// It should seed B's working balance, NOT A's.
// spousalAnnualContribution on rrspA = A's ongoing contributions into B's RRSP.
// A gets the tax deduction; B's balance grows; B pays tax on eventual withdrawals.

describe('Spousal RRSP', () => {
  const birthA  = `${CY - 50}-01-01`
  const birthB  = `${CY - 48}-01-01`
  const retireA = dateAtAge(birthA, 60)
  const retireB = dateAtAge(birthB, 60)

  function spousalState(spousalBal: number, spousalContrib: number): AppState {
    return makeState(birthA, 90, retireA, birthB, 90, retireB, {
      employmentA: { annualAmount: 120_000, growthRatePct: 0 },
      rrspA: {
        ...DEFAULT_STATE.rrspA,
        balance: 0,
        annualContribution: 0,
        spousalBalance: spousalBal,
        spousalAnnualContribution: spousalContrib,
        spousalLastContributionDate: dateAtAge(birthA, 60),
        spousalContributionTiming: 'lump',
        rrifConversionDate: dateAtAge(birthA, 71),
        returnRateOverrideEnabled: true, returnRateOverridePct: 0,
      },
      rrspB: {
        ...DEFAULT_STATE.rrspB,
        balance: 0,
        annualContribution: 0,
        rrifConversionDate: dateAtAge(birthB, 71),
        returnRateOverrideEnabled: true, returnRateOverridePct: 0,
      },
    })
  }

  it('spousal RRSP starting balance seeds B\'s RRSP, not A\'s', () => {
    const { dataPoints } = runProjection(spousalState(50_000, 0))
    // A has no own RRSP; B should start with the $50k spousal balance.
    expect(dp(dataPoints, CY).rrspA).toBeCloseTo(0, 0)
    expect(dp(dataPoints, CY).rrspB).toBeCloseTo(50_000, 0)
  })

  it('spousal annual contribution grows B\'s RRSP and deducts from A\'s taxable income', () => {
    const without = runProjection(spousalState(0, 0))
    const withS   = runProjection(spousalState(0, 10_000))
    // After year CY, B's RRSP = 1 year × $10k contribution (return=0, no prior balance)
    expect(dp(withS.dataPoints, CY).rrspB).toBeCloseTo(10_000, 0)
    // A gets the deduction → A's gross income is lower by $10k
    expect(dp(withS.dataPoints, CY).grossIncomeA)
      .toBeCloseTo(dp(without.dataPoints, CY).grossIncomeA - 10_000, 0)
  })

  it('spousal contribution does not affect A\'s RRSP balance', () => {
    const { dataPoints } = runProjection(spousalState(0, 10_000))
    // A has no own RRSP and no spousal balance; A's RRSP should stay 0
    expect(dp(dataPoints, CY + 1).rrspA).toBeCloseTo(0, 0)
  })
})

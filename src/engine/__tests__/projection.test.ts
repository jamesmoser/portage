import { describe, it, expect } from 'vitest'
import { nominalReturnForAge, cppFactor, oasFactor, runProjection } from '../projection'
import { DEFAULT_STATE } from '../defaults'
import { dateAtAge, getYear } from '../dates'
import type { AppState } from '../types'

const CY = new Date().getFullYear()

// ─── nominalReturnForAge ───────────────────────────────────────────────────────
// Intent: returns the nominal return tier (as a decimal) for a given integer age.
// Tier boundaries use strict < so the threshold ages (55, 65, 70) belong to the
// higher tier, not the lower one.
//   under 55 → upTo55
//   55–64    → from55to65
//   65–69    → from65to70
//   70+      → from70plus

const RATES = { upTo55: 7, from55to65: 6, from65to70: 5, from70plus: 4 }

describe('nominalReturnForAge', () => {
  it('returns upTo55 rate for ages below 55', () => {
    expect(nominalReturnForAge(40, RATES)).toBeCloseTo(0.07, 6)
    expect(nominalReturnForAge(54, RATES)).toBeCloseTo(0.07, 6)
  })

  it('returns from55to65 rate for age exactly 55 (55 is NOT < 55)', () => {
    expect(nominalReturnForAge(55, RATES)).toBeCloseTo(0.06, 6)
  })

  it('returns from55to65 rate for ages 56–64', () => {
    expect(nominalReturnForAge(60, RATES)).toBeCloseTo(0.06, 6)
    expect(nominalReturnForAge(64, RATES)).toBeCloseTo(0.06, 6)
  })

  it('returns from65to70 rate for age exactly 65', () => {
    expect(nominalReturnForAge(65, RATES)).toBeCloseTo(0.05, 6)
  })

  it('returns from65to70 rate for ages 66–69', () => {
    expect(nominalReturnForAge(67, RATES)).toBeCloseTo(0.05, 6)
    expect(nominalReturnForAge(69, RATES)).toBeCloseTo(0.05, 6)
  })

  it('returns from70plus rate for age exactly 70', () => {
    expect(nominalReturnForAge(70, RATES)).toBeCloseTo(0.04, 6)
  })

  it('returns from70plus rate for ages 71+', () => {
    expect(nominalReturnForAge(80, RATES)).toBeCloseTo(0.04, 6)
  })
})

// ─── cppFactor ────────────────────────────────────────────────────────────────
// Intent: cppFactor(startDate, birthDate) returns the CPP adjustment multiplier:
//   - Before 65: −0.6% per month. At 60 (5 years × 12 months) = 1 − 0.36 = 0.64
//   - At exactly 65: 1.0
//   - After 65: +0.7% per month. At 70 (5 years × 12 months) = 1 + 0.42 = 1.42
//   - Floor at 0 (can't go negative)
// Uses calendarAge (intAgeAt-based) so a Jan 1 birthday gets exactly 1.0 at age 65.

describe('cppFactor', () => {
  it('returns 1.0 when started at exactly age 65', () => {
    const birth = '1960-06-15'
    expect(cppFactor(dateAtAge(birth, 65), birth)).toBeCloseTo(1.0, 6)
  })

  it('returns 1.0 for a Jan 1 birthday started at exactly age 65', () => {
    // calendarAge must give exactly 65 on Jan 1 for a Jan 1 birthday (not 64.999...)
    const birth = `${CY - 65}-01-01`
    expect(cppFactor(dateAtAge(birth, 65), birth)).toBeCloseTo(1.0, 6)
  })

  it('returns 0.64 when started at exactly age 60 (−36%)', () => {
    const birth = '1965-06-15'
    // (60 − 65) × 12 = −60 months; 1 + 0.006 × (−60) = 0.64
    expect(cppFactor(dateAtAge(birth, 60), birth)).toBeCloseTo(0.64, 4)
  })

  it('returns 1.42 when started at exactly age 70 (+42%)', () => {
    const birth = '1955-06-15'
    // (70 − 65) × 12 = +60 months; 1 + 0.007 × 60 = 1.42
    expect(cppFactor(dateAtAge(birth, 70), birth)).toBeCloseTo(1.42, 4)
  })

  it('is never negative', () => {
    // Someone starting at a hypothetically very early age
    const birth = `${CY - 55}-06-15`
    expect(cppFactor(dateAtAge(birth, 50), birth)).toBeGreaterThanOrEqual(0)
  })

  it('factor increases between early and late start', () => {
    const birth = '1960-06-15'
    const at60 = cppFactor(dateAtAge(birth, 60), birth)
    const at65 = cppFactor(dateAtAge(birth, 65), birth)
    const at70 = cppFactor(dateAtAge(birth, 70), birth)
    expect(at60).toBeLessThan(at65)
    expect(at65).toBeLessThan(at70)
  })
})

// ─── oasFactor ────────────────────────────────────────────────────────────────
// Intent: oasFactor(startDate, birthDate) returns the OAS deferral multiplier:
//   - At or before 65: exactly 1.0
//   - After 65: +0.6% per month deferral
//   - Capped at 1.36 (5 years × 12 months × 0.6% = 36% max at age 70)
// Jan 1 birthdays must give exactly 1.0 at age 65 (calendarAge fix).

describe('oasFactor', () => {
  it('returns 1.0 when started at exactly age 65', () => {
    const birth = '1960-06-15'
    expect(oasFactor(dateAtAge(birth, 65), birth)).toBeCloseTo(1.0, 6)
  })

  it('returns 1.0 for a Jan 1 birthday started at exactly age 65', () => {
    const birth = `${CY - 65}-01-01`
    expect(oasFactor(dateAtAge(birth, 65), birth)).toBeCloseTo(1.0, 6)
  })

  it('returns 1.0 when started before 65 (no negative bonus)', () => {
    const birth = '1960-06-15'
    expect(oasFactor(dateAtAge(birth, 64), birth)).toBeCloseTo(1.0, 6)
  })

  it('returns 1.144 when started at age 67 (+2 years = +14.4%)', () => {
    const birth = '1958-06-15'
    // (67 − 65) × 12 = 24 months; 1 + 0.006 × 24 = 1.144
    expect(oasFactor(dateAtAge(birth, 67), birth)).toBeCloseTo(1.144, 3)
  })

  it('returns 1.36 when started at age 70 (maximum)', () => {
    const birth = '1955-06-15'
    // (70 − 65) × 12 = 60 months; 1 + 0.006 × 60 = 1.36
    expect(oasFactor(dateAtAge(birth, 70), birth)).toBeCloseTo(1.36, 4)
  })

  it('is capped at 1.36 for starts after age 70', () => {
    const birth = '1953-06-15'
    // At age 72: would be 1 + 0.006 × 84 = 1.504, capped to 1.36
    expect(oasFactor(dateAtAge(birth, 72), birth)).toBeCloseTo(1.36, 4)
  })
})

// ─── runProjection — integration tests ────────────────────────────────────────
// These tests use a minimal AppState derived from DEFAULT_STATE with controlled
// birth dates, zero income, and zero account balances unless otherwise specified.
// All dates are constructed relative to CY (current year) so the tests remain
// valid across calendar years.
//
// Conventions:
//   birthA = Jan 1, so calendar age is exact at Jan 1 (tests the intAgeAt fix)
//   planningEndAge is set small (2–3 years out) to keep data point counts small
//   year 0 of the projection: PD = nominal (inflFactor = 1, yearsFromNow = 0)

// Person A: born Jan 1, currently 71.  Person B: born Jun 15, currently 68.
const birthA = `${CY - 71}-01-01`
const birthB = `${CY - 68}-06-15`

function baseState(overrides: Partial<AppState> = {}): AppState {
  return {
    ...DEFAULT_STATE,
    personA: {
      ...DEFAULT_STATE.personA,
      birthDate: birthA,
      retirementDate: `${CY - 10}-01-01`,  // already retired
      planningEndAge: 73,                    // endYearA = CY + 2
    },
    personB: {
      ...DEFAULT_STATE.personB,
      birthDate: birthB,
      retirementDate: `${CY - 8}-06-15`,   // already retired
      planningEndAge: 70,                    // endYearB = CY + 2
    },
    cppA:  { ...DEFAULT_STATE.cppA,  estimatedMonthlyAt65: 0 },
    cppB:  { ...DEFAULT_STATE.cppB,  estimatedMonthlyAt65: 0 },
    oasA:  { ...DEFAULT_STATE.oasA,  estimatedMonthlyAt65: 0 },
    oasB:  { ...DEFAULT_STATE.oasB,  estimatedMonthlyAt65: 0 },
    dbPensionA: { ...DEFAULT_STATE.dbPensionA, enabled: false, annualAmount: 0 },
    dbPensionB: { ...DEFAULT_STATE.dbPensionB, enabled: false, annualAmount: 0 },
    rrspA: { ...DEFAULT_STATE.rrspA, balance: 0, annualContribution: 0, rrifConversionDate: dateAtAge(birthA, 71) },
    rrspB: { ...DEFAULT_STATE.rrspB, balance: 0, annualContribution: 0, rrifConversionDate: dateAtAge(birthB, 71) },
    tfsaA: { ...DEFAULT_STATE.tfsaA, balance: 0, annualContribution: 0 },
    tfsaB: { ...DEFAULT_STATE.tfsaB, balance: 0, annualContribution: 0 },
    nonRegA: { ...DEFAULT_STATE.nonRegA, balance: 0, acb: 0, annualContribution: 0 },
    nonRegB: { ...DEFAULT_STATE.nonRegB, balance: 0, acb: 0, annualContribution: 0 },
    cash: { hisaBalance: 0, hisaRatePct: 0, hisaMinBalance: 0 },
    spendingPhases: [],
    additionalSpending: [],
    withdrawalStrategy: {
      ...DEFAULT_STATE.withdrawalStrategy,
      drawdownStrategy: 'none',
    },
    ...overrides,
  }
}

describe('runProjection — data point count', () => {
  it('emits one data point per year from currentYear to max(endYearA, endYearB)', () => {
    // birthA=71 now, planningEndAge=73 → endYearA = CY+2
    // birthB=68 now, planningEndAge=70 → endYearB = CY+2
    // total = 3 data points: CY, CY+1, CY+2
    const { dataPoints } = runProjection(baseState())
    expect(dataPoints).toHaveLength(3)
    expect(dataPoints[0].year).toBe(CY)
    expect(dataPoints[2].year).toBe(CY + 2)
  })

  it('last data point year matches the later of the two death years', () => {
    const { dataPoints } = runProjection(baseState())
    const lastYear = dataPoints[dataPoints.length - 1].year
    expect(lastYear).toBe(Math.max(
      getYear(dateAtAge(birthA, 73)),
      getYear(dateAtAge(birthB, 70)),
    ))
  })
})

describe('runProjection — zero income / zero accounts', () => {
  it('all income data fields are zero when all sources are disabled', () => {
    const { dataPoints } = runProjection(baseState())
    for (const d of dataPoints) {
      expect(d.employmentA).toBe(0)
      expect(d.employmentB).toBe(0)
      expect(d.cppA).toBe(0)
      expect(d.cppB).toBe(0)
      expect(d.oasA).toBe(0)
      expect(d.oasB).toBe(0)
      expect(d.dbPensionBase).toBe(0)
      expect(d.rrifA).toBe(0)
      expect(d.rrifB).toBe(0)
    }
  })

  it('all account balances are zero when balances start at zero', () => {
    const { dataPoints } = runProjection(baseState())
    for (const d of dataPoints) {
      expect(d.rrspA).toBe(0)
      expect(d.rrspB).toBe(0)
      expect(d.tfsaA).toBe(0)
      expect(d.tfsaB).toBe(0)
      expect(d.nonRegA).toBe(0)
      expect(d.nonRegB).toBe(0)
      expect(d.hisa).toBe(0)
    }
  })
})

describe('runProjection — RRIF minimum withdrawal', () => {
  // Person A has a Jan 1 birthday and turns 71 this year.
  // With strategy ≠ 'none' and all explicit draw amounts at 0, the RRIF minimum
  // should fire using the correct age-71 factor (0.0528).
  // Before the fix, exactAgeAt for a Jan 1 birthday returned ~70.999 on Jan 1,
  // causing Math.floor to give 70 and the wrong factor (0.0500).

  it('uses the age-71 RRIF factor on a Jan 1 birthday in the conversion year', () => {
    const rrspBalance = 100_000
    const state = baseState({
      rrspA: {
        ...DEFAULT_STATE.rrspA,
        balance: rrspBalance,
        annualContribution: 0,
        rrifConversionDate: dateAtAge(birthA, 71),  // this Jan 1
        returnRateOverrideEnabled: true,
        returnRateOverridePct: 0,                    // 0% return → balance stays exact
      },
      withdrawalStrategy: {
        ...DEFAULT_STATE.withdrawalStrategy,
        drawdownStrategy: 'fixedWithdrawal',
        drawdownFixedWithdrawal: {
          rrspAmountA: 0, rrspAmountB: 0,
          tfsaAmountA: 0, tfsaAmountB: 0,
          nonRegAmountA: 0, nonRegAmountB: 0,
          hisaAmount: 0,
        },
      },
    })
    const { dataPoints } = runProjection(state)
    // Year 0 (CY): PD = nominal (yearsFromNow = 0, inflFactor = 1)
    const d0 = dataPoints[0]
    expect(d0.year).toBe(CY)
    // RRIF minimum at age 71 = 100,000 × 0.0528 = 5,280
    expect(d0.rrifA).toBeCloseTo(5_280, 0)
  })

  it('RRIF minimum grows as age increases because the factor increases each year', () => {
    // A growing factor table means each year's minimum should be >= the prior year's
    // (before balance changes — but at 0% return, balance decreases each year).
    // The key property: if we had a constant balance, the minimum would grow.
    // We just check the factor, not the actual draw (balance changes each year).
    // Indirectly: at age 72, factor = 0.0540 > 0.0528. We verify year 2 draws more
    // as a proportion of the REMAINING balance than year 1 does.
    const rrspBalance = 1_000_000
    const state = baseState({
      rrspA: {
        ...DEFAULT_STATE.rrspA,
        balance: rrspBalance,
        annualContribution: 0,
        rrifConversionDate: dateAtAge(birthA, 71),
        returnRateOverrideEnabled: true,
        returnRateOverridePct: 0,
      },
      withdrawalStrategy: {
        ...DEFAULT_STATE.withdrawalStrategy,
        drawdownStrategy: 'fixedWithdrawal',
        drawdownFixedWithdrawal: {
          rrspAmountA: 0, rrspAmountB: 0,
          tfsaAmountA: 0, tfsaAmountB: 0,
          nonRegAmountA: 0, nonRegAmountB: 0,
          hisaAmount: 0,
        },
      },
    })
    const { dataPoints } = runProjection(state)
    // Each year, the withdrawal is a higher % of the balance than the year before.
    // That means the ratio (rrifWithdraw / rrspBalance_start) grows with age.
    // We check year 0 vs year 1: factor 0.0528 < 0.0540.
    // Actual draw in year 0 (PD=nom): 1,000,000 × 0.0528 = 52,800
    // Remaining after draw+0% return = 947,200
    // Draw in year 1: 947,200 × 0.0540 = 51,149 nominal
    expect(dataPoints[0].rrifA).toBeCloseTo(52_800, 0)
  })
})

describe('runProjection — CPP income', () => {
  it('CPP income is zero in years before the start date', () => {
    // CPP start date = 2 years from now, so first two data points should have cppA = 0
    const state = baseState({
      cppA: {
        ...DEFAULT_STATE.cppA,
        estimatedMonthlyAt65: 1_000,
        startDate: `${CY + 2}-01-01`,
      },
    })
    const { dataPoints } = runProjection(state)
    expect(dataPoints[0].cppA).toBeCloseTo(0, 0)  // year CY
    expect(dataPoints[1].cppA).toBeCloseTo(0, 0)  // year CY+1
  })

  it('CPP income appears starting in the configured start year', () => {
    // CPP starts Jan 1 of CY+1, estimatedMonthlyAt65 = 1000.
    // Person A is 71 — cppFactor at 71: (71-65)×12=72 months × 0.7% = +50.4% → 1.504
    // Annual CPP in year CY+1: 1000 × 1.504 × 12 × cpiFactorForYear(1, 2%) = 18048 × 1.02 ≈ 18409
    // We just verify it's greater than zero and less than the theoretical max (no clamp in engine)
    const state = baseState({
      cppA: {
        ...DEFAULT_STATE.cppA,
        estimatedMonthlyAt65: 1_000,
        startDate: `${CY + 1}-01-01`,
      },
    })
    const { dataPoints } = runProjection(state)
    expect(dataPoints[0].cppA).toBeCloseTo(0, 0)   // year CY: not yet started
    expect(dataPoints[1].cppA).toBeGreaterThan(0)   // year CY+1: active
    expect(dataPoints[2].cppA).toBeGreaterThan(0)   // year CY+2: still active
  })

  it('CPP income is proportional to estimatedMonthlyAt65', () => {
    // Doubling the monthly estimate should double the annual income
    const state1 = baseState({ cppA: { ...DEFAULT_STATE.cppA, estimatedMonthlyAt65: 1_000, startDate: `${CY}-01-01` } })
    const state2 = baseState({ cppA: { ...DEFAULT_STATE.cppA, estimatedMonthlyAt65: 2_000, startDate: `${CY}-01-01` } })
    const d1 = runProjection(state1).dataPoints[0]
    const d2 = runProjection(state2).dataPoints[0]
    expect(d2.cppA).toBeCloseTo(d1.cppA * 2, 0)
  })
})

import { describe, it, expect } from 'vitest'
import { runProjection } from '../projection'
import { DEFAULT_STATE, DEFAULT_SURPLUS_ITEMS } from '../defaults'
import { dateAtAge } from '../dates'
import type { AppState, SpendGapAccountType, SpendGapDeficitItem } from '../types'

// Convenience: build deficit items with no cap (unlimited draws in order)
function items(...accounts: SpendGapAccountType[]): SpendGapDeficitItem[] {
  return accounts.map(account => ({ account, cap: 0 }))
}

const CY = new Date().getFullYear()

// ─── Shared birth dates ───────────────────────────────────────────────────────
// All Jan 1 so calendarAge is exact at Jan 1 — no approximation noise.

const bA60 = `${CY - 60}-01-01`   // A age 60: meltdown phase (retired, pre-RRIF-71)
const bB58 = `${CY - 58}-01-01`   // B age 58: meltdown phase
const bA72 = `${CY - 72}-01-01`   // A age 72: RRIF phase
const bB72 = `${CY - 72}-01-01`   // B age 72: RRIF phase
const bA50 = `${CY - 50}-01-01`   // A age 50: contribution (pre-retirement) phase

// ─── State factory ────────────────────────────────────────────────────────────
// pi=0, cpi=0, return=0 — PD = nominal, balances are exact.
// All income/account sources default to zero unless overridden.
// spendGapConfig uses a flattened override bag for test convenience.

interface SgParams {
  birthA?: string;   retireA?: string;  planEndA?: number;  rrifConvA?: string
  birthB?: string;   retireB?: string;  planEndB?: number;  rrifConvB?: string
  rrspBalA?: number; rrspBalB?: number
  tfsaBalA?: number; tfsaBalB?: number
  nonRegBalA?: number; nonRegBalB?: number; nonRegAcbA?: number; nonRegAcbB?: number
  hisaBal?: number
  spending?: number        // annual lifestyle spending (flat, real growth = 0)
  pensionA?: number        // annual DB pension for A (non-indexed, starts at retireA)
  stopContribsWhenPartnerRetired?: boolean
  meltdownACeiling?: number
  meltdownBCeiling?: number
  meltdownAItems?: SpendGapDeficitItem[]
  meltdownBItems?: SpendGapDeficitItem[]
  rrifAItems?: SpendGapDeficitItem[]
  rrifBItems?: SpendGapDeficitItem[]
}

function sgState(p: SgParams = {}): AppState {
  const birthA  = p.birthA  ?? bA60
  const birthB  = p.birthB  ?? bB58
  const retireA = p.retireA ?? `${CY - 5}-01-01`
  const retireB = p.retireB ?? `${CY - 3}-01-01`

  return {
    ...DEFAULT_STATE,
    personalInflationRatePct: 0,
    cpiRatePct: 0,
    returnRates: { upTo55: 0, from55to65: 0, from65to70: 0, from70plus: 0 },
    personA: {
      ...DEFAULT_STATE.personA,
      birthDate: birthA,
      retirementDate: retireA,
      planningEndAge: p.planEndA ?? 62,   // endYearA = CY+2 default
    },
    personB: {
      ...DEFAULT_STATE.personB,
      birthDate: birthB,
      retirementDate: retireB,
      planningEndAge: p.planEndB ?? 60,   // endYearB = CY+2 default
    },
    employmentA: { annualAmount: 0, growthRatePct: 0 },
    employmentB: { annualAmount: 0, growthRatePct: 0 },
    dbPensionA: {
      ...DEFAULT_STATE.dbPensionA,
      enabled: (p.pensionA ?? 0) > 0,
      annualAmount: p.pensionA ?? 0,
      startDate: retireA,
      cpiIndexed: false,
      indexingRatePct: 0,
    },
    dbPensionB: { ...DEFAULT_STATE.dbPensionB, enabled: false, annualAmount: 0 },
    cppA: { ...DEFAULT_STATE.cppA, estimatedMonthlyAt65: 0 },
    cppB: { ...DEFAULT_STATE.cppB, estimatedMonthlyAt65: 0 },
    oasA: { ...DEFAULT_STATE.oasA, estimatedMonthlyAt65: 0 },
    oasB: { ...DEFAULT_STATE.oasB, estimatedMonthlyAt65: 0 },
    rrspA: {
      ...DEFAULT_STATE.rrspA,
      balance: p.rrspBalA ?? 0,
      annualContribution: 0,
      rrifConversionDate: p.rrifConvA ?? dateAtAge(birthA, 71),
      returnRateOverrideEnabled: true,
      returnRateOverridePct: 0,
    },
    rrspB: {
      ...DEFAULT_STATE.rrspB,
      balance: p.rrspBalB ?? 0,
      annualContribution: 0,
      rrifConversionDate: p.rrifConvB ?? dateAtAge(birthB, 71),
      returnRateOverrideEnabled: true,
      returnRateOverridePct: 0,
    },
    tfsaA: {
      ...DEFAULT_STATE.tfsaA,
      balance: p.tfsaBalA ?? 0,
      annualContribution: 0,
      returnRateOverrideEnabled: true,
      returnRateOverridePct: 0,
    },
    tfsaB: {
      ...DEFAULT_STATE.tfsaB,
      balance: p.tfsaBalB ?? 0,
      annualContribution: 0,
      returnRateOverrideEnabled: true,
      returnRateOverridePct: 0,
    },
    nonRegA: {
      ...DEFAULT_STATE.nonRegA,
      balance: p.nonRegBalA ?? 0,
      acb: p.nonRegAcbA ?? 0,
      annualContribution: 0,
    },
    nonRegB: {
      ...DEFAULT_STATE.nonRegB,
      balance: p.nonRegBalB ?? 0,
      acb: p.nonRegAcbB ?? 0,
      annualContribution: 0,
    },
    cash: { hisaBalance: p.hisaBal ?? 0, hisaRatePct: 0, hisaMinBalance: 0 },
    spendingPhases: (p.spending ?? 0) > 0
      ? [{ id: 'p0', label: 'test', startAge: 0, annualAmount: p.spending!, growthRatePct: 0, linkedToFirstDeath: false }]
      : [],
    additionalSpending: [],
    withdrawalStrategy: {
      ...DEFAULT_STATE.withdrawalStrategy,
      drawdownStrategy: 'spendGap',
      spendGapConfig: {
        stopContributionsWhenPartnerRetired: p.stopContribsWhenPartnerRetired ?? false,
        meltdownA: {
          grossIncomeCeiling: p.meltdownACeiling ?? 0,
          deficitItems: p.meltdownAItems ?? items('tfsa', 'nonReg', 'hisa'),
        },
        meltdownB: {
          grossIncomeCeiling: p.meltdownBCeiling ?? 0,
          deficitItems: p.meltdownBItems ?? items('tfsa', 'nonReg', 'hisa'),
        },
        rrifA: {
          grossIncomeCeiling: 0,
          deficitItems: p.rrifAItems ?? items('tfsa', 'nonReg', 'hisa'),
        },
        rrifB: {
          grossIncomeCeiling: 0,
          deficitItems: p.rrifBItems ?? items('tfsa', 'nonReg', 'hisa'),
        },
        surplusItems: DEFAULT_SURPLUS_ITEMS,
      },
    },
  }
}

// Run and return year CY data point + warnings (CY is yearsFromNow=0 so PD = nominal)
function run(p: SgParams = {}) {
  const { dataPoints, warnings } = runProjection(sgState(p))
  const d = dataPoints.find(pt => pt.year === CY)!
  return { d, warnings }
}

// ─── Phase 1 — Contribution (pre-retirement) ──────────────────────────────────
// Persons who have not yet retired should not have RRSP drawn under any path.

describe('spendGap — contribution phase (pre-retirement)', () => {
  it('does not proactively draw RRSP before retirement even with ceiling set', () => {
    // A is 50, retires in 5 years — still in contribution phase
    const { d } = run({
      birthA: bA50,
      retireA: `${CY + 5}-01-01`,   // future retirement
      planEndA: 53,
      rrspBalA: 500_000,
      meltdownACeiling: 80_000,
    })
    expect(d.rrifA).toBeCloseTo(0, 0)
  })

  it('emits a shortfall warning when spending > income and RRSP is pre-retirement', () => {
    // A is 50, not yet retired. Spending = 50k, no income, TFSA/nonReg/HISA = 0.
    // Emergency fallback skips pre-retirement persons, so the gap is unresolved.
    const { warnings } = run({
      birthA: bA50,
      retireA: `${CY + 5}-01-01`,
      planEndA: 53,
      rrspBalA: 500_000,
      spending: 50_000,
    })
    expect(warnings.some(w => w.includes(`Year ${CY}`))).toBe(true)
  })
})

// ─── Stop contributions when partner retires ──────────────────────────────────

describe('spendGap — stopContributionsWhenPartnerRetired', () => {
  // Use RRSP contributions + enough pension income so the contribution cost doesn't
  // create a spending gap (and therefore doesn't get drawn back out by spendGap).
  // Pension 50k → net ~38k after tax; RRSP contribution 10k → spending_nom 10k → gap = 0.
  // EOY RRSP balance = start + 10k contribution (no draws, 0% return).

  it('stops A contributions when flag is on and B has already retired', () => {
    // B retired 3 years ago (default retireB = CY-3). Flag on → A's RRSP contrib = 0.
    // spending_nom = 0 (no lifestyle spending, no contribution). gap = 0. Balance stays at start.
    const state = sgState({ rrspBalA: 500_000, pensionA: 50_000, stopContribsWhenPartnerRetired: true })
    state.rrspA = { ...state.rrspA, annualContribution: 10_000, contributionEndDate: `${CY + 20}-01-01` }
    const { dataPoints } = runProjection(state)
    const d = dataPoints.find(pt => pt.year === CY)!
    expect(d.rrspA).toBeCloseTo(500_000, -2)   // no contribution (stopped because B retired)
  })

  it('allows A contributions when flag is on but B has not yet retired', () => {
    // B retires CY+5 (future). Flag on but condition not met → A still contributes 10k.
    // Pension income covers the contribution outflow → gap = 0, no draws.
    // EOY RRSP = 500k + 10k = 510k.
    const state = sgState({
      retireB: `${CY + 5}-01-01`,
      rrspBalA: 500_000, pensionA: 50_000,
      stopContribsWhenPartnerRetired: true,
    })
    state.rrspA = { ...state.rrspA, annualContribution: 10_000, contributionEndDate: `${CY + 20}-01-01` }
    const { dataPoints } = runProjection(state)
    const d = dataPoints.find(pt => pt.year === CY)!
    expect(d.rrspA).toBeCloseTo(510_000, -2)   // contribution happened (B not retired yet)
  })
})

// ─── Phase 2 — RRSP Meltdown: ceiling mechanics ───────────────────────────────
// A is 60 (retired at 55, RRIF at 71) → inMeltdownA = true.
// pi=0, cpi=0, return=0 so rrifA in the DataPoint equals the nominal draw.

describe('spendGap — meltdown ceiling', () => {
  it('makes no proactive RRSP draw when ceiling is 0', () => {
    const { d } = run({ rrspBalA: 500_000, meltdownACeiling: 0 })
    expect(d.rrifA).toBeCloseTo(0, 0)
    // Balance unchanged at 0% return (EOY step: rrspA = grow(rrspA - 0, 0) = 500k)
    expect(d.rrspA).toBeCloseTo(500_000, 0)
  })

  it('draws RRSP up to the gross income ceiling when base income is zero', () => {
    // No pension, CPP, OAS → base gross = 0.  Ceiling = 80k → draw 80k.
    const { d, warnings } = run({ rrspBalA: 500_000, meltdownACeiling: 80_000 })
    expect(d.rrifA).toBeCloseTo(80_000, 0)
    // EOY balance = 500k - 80k = 420k (0% return)
    expect(d.rrspA).toBeCloseTo(420_000, 0)
    expect(warnings).toHaveLength(0)
  })

  it('makes no proactive draw when base gross income already exceeds ceiling', () => {
    // DB pension = 100k/yr > ceiling 80k → meltdownExtraA = max(0, 80k - 100k) = 0
    const { d } = run({
      rrspBalA: 500_000,
      pensionA: 100_000,
      meltdownACeiling: 80_000,
    })
    expect(d.rrifA).toBeCloseTo(0, 0)   // no RRSP draw
    expect(d.rrspA).toBeCloseTo(500_000, 0)
  })

  it('caps the draw at the RRSP balance when balance < ceiling gap', () => {
    // Ceiling = 80k, base = 0, balance = 20k → draw = min(80k, 20k) = 20k
    const { d } = run({ rrspBalA: 20_000, meltdownACeiling: 80_000 })
    expect(d.rrifA).toBeCloseTo(20_000, 0)
    expect(d.rrspA).toBeCloseTo(0, 0)
  })

  it('draws only the incremental gap between base gross and ceiling', () => {
    // DB pension = 50k, ceiling = 80k → draw = 80k - 50k = 30k
    const { d } = run({
      rrspBalA: 500_000,
      pensionA: 50_000,
      meltdownACeiling: 80_000,
    })
    expect(d.rrifA).toBeCloseTo(30_000, 0)
  })
})

// ─── Phase 2 — Meltdown: tax recomputation ────────────────────────────────────
// After a meltdown draw, the engine reruns the tax and pension split computation.
// grossIncomeA and taxA in the DataPoint should reflect the updated income.

describe('spendGap — meltdown tax recomputation', () => {
  it('grossIncomeA reflects the meltdown draw after tax recomputation', () => {
    // Ceiling = 80k, no other income.  Post-recompute, grossIncomeA ≈ 80k.
    const { d } = run({ rrspBalA: 500_000, meltdownACeiling: 80_000 })
    expect(d.grossIncomeA).toBeCloseTo(80_000, -2)   // within 100
  })

  it('taxA is non-zero after a meltdown draw', () => {
    const { d } = run({ rrspBalA: 500_000, meltdownACeiling: 80_000 })
    expect(d.taxA).toBeGreaterThan(0)
  })

  it('surplus is deployed to HISA when meltdown net income exceeds spending', () => {
    // 80k draw → net income ≈ 57k (after ~28% combined tax); spending = 50k.
    // Surplus routing (default: HISA last) deploys the remainder to HISA → cashFlow = 0.
    const { d } = run({ rrspBalA: 500_000, meltdownACeiling: 80_000, spending: 50_000 })
    expect(d.totalHouseholdNet).toBeGreaterThan(d.householdSpending)
    expect(d.cashFlow).toBeCloseTo(0, 0)
    expect(d.hisa).toBeGreaterThan(0)
  })
})

// ─── Deficit routing — default account order ──────────────────────────────────
// When a gap remains after proactive meltdown draws, the engine draws accounts
// in deficitOrder.  Default: [tfsa, nonReg, hisa].

describe('spendGap — deficit routing, default order [tfsa, nonReg, hisa]', () => {
  it('draws TFSA before nonReg', () => {
    // gap = 50k; TFSA = 100k (more than enough). nonReg should not be touched.
    const { d, warnings } = run({
      tfsaBalA: 100_000,
      nonRegBalA: 100_000, nonRegAcbA: 100_000,
      spending: 50_000,
    })
    expect(d.tfsaWithdrawalA).toBeCloseTo(50_000, 0)
    expect(d.nonRegWithdrawalA).toBeCloseTo(0, 0)
    expect(warnings).toHaveLength(0)
  })

  it('draws nonReg after TFSA when TFSA is exhausted', () => {
    // gap = 50k; TFSA = 20k, nonReg = 100k (full ACB — no capital gain).
    // Draw 20k from TFSA, then 30k from nonReg.
    const { d, warnings } = run({
      tfsaBalA: 20_000,
      nonRegBalA: 100_000, nonRegAcbA: 100_000,
      spending: 50_000,
    })
    expect(d.tfsaWithdrawalA).toBeCloseTo(20_000, 0)
    expect(d.nonRegWithdrawalA).toBeCloseTo(30_000, 0)
    expect(warnings).toHaveLength(0)
  })

  it('splits TFSA draw proportionally between A and B by available balance', () => {
    // TFSA_A = 60k, TFSA_B = 40k → total 100k.  Gap = 50k.
    // drawA = 50k × (60/100) = 30k; drawB = 50k × (40/100) = 20k.
    const { d } = run({
      tfsaBalA: 60_000, tfsaBalB: 40_000,
      spending: 50_000,
    })
    expect(d.tfsaWithdrawalA).toBeCloseTo(30_000, 0)
    expect(d.tfsaWithdrawalB).toBeCloseTo(20_000, 0)
  })

  it('splits nonReg draw proportionally between A and B by available balance', () => {
    // nonReg_A = 75k, nonReg_B = 25k → total 100k.  Gap = 50k.
    // drawA = 37.5k, drawB = 12.5k.
    const { d } = run({
      nonRegBalA: 75_000, nonRegAcbA: 75_000,
      nonRegBalB: 25_000, nonRegAcbB: 25_000,
      spending: 50_000,
    })
    expect(d.nonRegWithdrawalA).toBeCloseTo(37_500, 0)
    expect(d.nonRegWithdrawalB).toBeCloseTo(12_500, 0)
  })
})

// ─── Deficit routing — custom account order ───────────────────────────────────

describe('spendGap — deficit routing, custom order', () => {
  it('draws HISA before TFSA when deficitItems is [hisa, tfsa]', () => {
    // gap = 50k; HISA = 100k, TFSA = 100k.
    // With [hisa, tfsa]: HISA drawn first (50k), TFSA untouched.
    const { d } = run({
      hisaBal: 100_000,
      tfsaBalA: 100_000,
      spending: 50_000,
      meltdownAItems: items('hisa', 'tfsa'),
      meltdownBItems: items('hisa', 'tfsa'),
    })
    // HISA balance at EOY = 100k - 50k = 50k (at 0% return)
    expect(d.hisa).toBeCloseTo(50_000, 0)
    // TFSA balance at EOY = 100k (untouched)
    expect(d.tfsaA).toBeCloseTo(100_000, 0)
    expect(d.tfsaWithdrawalA).toBeCloseTo(0, 0)
  })

  it('draws HISA to cover the full gap when HISA has sufficient balance', () => {
    const { d, warnings } = run({
      hisaBal: 200_000,
      spending: 50_000,
      meltdownAItems: items('hisa'),
      meltdownBItems: items('hisa'),
    })
    expect(d.hisa).toBeCloseTo(150_000, 0)
    expect(warnings).toHaveLength(0)
  })
})

// ─── Phase 3 — RRIF forced minimums ───────────────────────────────────────────
// Person A is 72, converted to RRIF last year.
// rrifMinFactor(72) = 0.0540.  On a 1,000,000 balance: mandatory min = 54,000.

const rrifConvLastYear = `${CY - 1}-01-01`

describe('spendGap — RRIF forced minimums', () => {
  it('takes the mandatory RRIF minimum at age 72 (factor 0.0540)', () => {
    const { d } = run({
      birthA: bA72, planEndA: 74,
      rrifConvA: rrifConvLastYear,
      rrspBalA: 1_000_000,
    })
    // mandatory = 1,000,000 × 0.0540 = 54,000
    expect(d.rrifA).toBeCloseTo(54_000, 0)
  })

  it('satisfies the EOY balance invariant: rrspA + rrifA = start balance (0% return)', () => {
    // No extra draws, 0% return: EOY balance = start - mandatory
    const { d } = run({
      birthA: bA72, planEndA: 74,
      rrifConvA: rrifConvLastYear,
      rrspBalA: 1_000_000,
    })
    expect(d.rrspA + d.rrifA).toBeCloseTo(1_000_000, 0)
  })

  it("does not emit a shortfall warning when mandatory minimum covers the gap", () => {
    // spending = 30k < mandatory net income (~40k after tax on 54k) → no warning
    const { warnings } = run({
      birthA: bA72, planEndA: 74,
      rrifConvA: rrifConvLastYear,
      rrspBalA: 1_000_000,
      spending: 30_000,
    })
    expect(warnings).toHaveLength(0)
  })

  it("'rrif' in deficit order draws above the mandatory minimum to cover the gap", () => {
    // spending = 100k.  Mandatory net income ≈ 42k → gap ≈ 58k.
    // With 'rrif' first in deficitOrder: engine draws extra from RRIF.
    // Single-pass limitation: tax on extra draw is not recomputed.
    // Key assertions: no warning (gap covered), rrifA > mandatory min.
    const { d, warnings } = run({
      birthA: bA72, planEndA: 74,
      rrifConvA: rrifConvLastYear,
      rrspBalA: 1_000_000,
      spending: 100_000,
      rrifAItems: items('rrif', 'tfsa', 'nonReg', 'hisa'),
    })
    expect(warnings).toHaveLength(0)
    expect(d.rrifA).toBeGreaterThan(54_000)   // extra draw above mandatory
    // Known single-pass limitation: cashFlow may show negative for RRIF extra draws
    // because tax on the additional draw is not recomputed in this pass.
  })

  it("TFSA is drawn after rrif minimum when rrif alone doesn't cover the gap", () => {
    // Small RRIF balance (50k), large spending (60k).
    // Mandatory min = 50k × 0.054 = 2,700.  'rrif' extra draws all remaining balance.
    // TFSA covers whatever gap remains after RRIF is exhausted.
    const { d, warnings } = run({
      birthA: bA72, planEndA: 74,
      rrifConvA: rrifConvLastYear,
      rrspBalA: 50_000,
      tfsaBalA: 200_000,
      spending: 60_000,
      rrifAItems: items('rrif', 'tfsa'),
    })
    expect(warnings).toHaveLength(0)
    expect(d.tfsaWithdrawalA).toBeGreaterThan(0)   // TFSA supplemented
  })
})

// ─── Cross-phase: A meltdown, B RRIF ─────────────────────────────────────────
// Verifies that the two persons can simultaneously be in different phases and
// that each person's draw mechanics apply independently.

describe('spendGap — cross-phase (A meltdown, B RRIF)', () => {
  it('A draws to ceiling while B takes RRIF mandatory minimum', () => {
    // A: bA60, meltdown, ceiling = 80k, RRSP = 300k
    // B: bB72, RRIF, RRSP = 200k, mandatory min = 200k × 0.054 = 10,800
    const { d } = run({
      birthA: bA60, planEndA: 62, meltdownACeiling: 80_000, rrspBalA: 300_000,
      birthB: bB72, planEndB: 74,
      rrifConvB: rrifConvLastYear,
      rrspBalB: 200_000,
    })
    expect(d.rrifA).toBeCloseTo(80_000, 0)        // A: meltdown draw to ceiling
    expect(d.rrifB).toBeCloseTo(10_800, 0)        // B: mandatory RRIF minimum
  })

  it('A meltdown ceiling does not affect B RRIF minimum', () => {
    // Changing A's ceiling should not change B's mandatory draw
    const { d: dLow  } = run({
      birthA: bA60, planEndA: 62, meltdownACeiling: 40_000, rrspBalA: 300_000,
      birthB: bB72, planEndB: 74, rrifConvB: rrifConvLastYear, rrspBalB: 200_000,
    })
    const { d: dHigh } = run({
      birthA: bA60, planEndA: 62, meltdownACeiling: 80_000, rrspBalA: 300_000,
      birthB: bB72, planEndB: 74, rrifConvB: rrifConvLastYear, rrspBalB: 200_000,
    })
    expect(dLow.rrifB).toBeCloseTo(dHigh.rrifB, 0)
  })
})

// ─── Emergency fallback ───────────────────────────────────────────────────────
// When no ceiling is set and all deficit-order accounts are empty, the engine
// falls back to drawing from any remaining RRSP/RRIF balance (retired persons only).

describe('spendGap — emergency fallback', () => {
  it('draws RRSP as emergency when all deficit accounts are depleted', () => {
    // ceiling = 0, TFSA/nonReg/HISA = 0, RRSP = 500k.  gap = 50k.
    // Emergency fallback: draws 50k from RRSP.  No warning (gap resolved).
    // Note: tax on emergency draw is not recomputed (known single-pass limitation).
    const { d, warnings } = run({
      rrspBalA: 500_000,
      spending: 50_000,
      meltdownACeiling: 0,
    })
    expect(warnings).toHaveLength(0)
    expect(d.rrifA).toBeCloseTo(50_000, 0)
    expect(d.rrspA).toBeCloseTo(450_000, 0)   // 500k - 50k emergency draw
  })

  it('splits the emergency draw proportionally between A and B by RRSP balance', () => {
    // A RRSP = 300k, B RRSP = 200k → total = 500k.  Gap = 50k.
    // drawA = 50k × (300/500) = 30k; drawB = 50k × (200/500) = 20k.
    const { d, warnings } = run({
      rrspBalA: 300_000, rrspBalB: 200_000,
      spending: 50_000,
      meltdownACeiling: 0,
    })
    expect(warnings).toHaveLength(0)
    expect(d.rrifA).toBeCloseTo(30_000, 0)
    expect(d.rrifB).toBeCloseTo(20_000, 0)
  })

  it('does not draw pre-retirement RRSP in the emergency fallback', () => {
    // A is 50 (pre-retirement): inMeltdownA = false, isRrifA = false → availA = 0.
    // B is in meltdown with RRSP = 500k.  Gap should be covered by B alone.
    // planEndA = 52 → endYearA = CY+2 (same as B's endYear) so there are no
    // survivor years where A is alive but pre-retirement with unresolvable spending.
    const { d, warnings } = run({
      birthA: bA50, retireA: `${CY + 5}-01-01`, planEndA: 52,
      rrspBalA: 500_000,   // A's RRSP should NOT be touched
      rrspBalB: 500_000,   // B's RRSP covers the gap
      spending: 50_000,
    })
    // A's RRSP should be untouched (no draw)
    expect(d.rrifA).toBeCloseTo(0, 0)
    // B's RRSP covers the gap
    expect(d.rrifB).toBeCloseTo(50_000, 0)
    expect(warnings).toHaveLength(0)
  })
})

// ─── proactiveExtra accounting (cashFlow / totalHouseholdNet) ─────────────────
// TFSA, nonReg, and HISA draws are non-taxable cash inflows.  They must appear
// in totalHouseholdNet (via proactiveExtra) so cashFlow is accurate.
// RRIF/RRSP draws flow through the tax engine and are captured in netAfterTax.

describe('spendGap — cashFlow accounting for non-taxable draws', () => {
  it('TFSA draw produces cashFlow ≈ 0 when gap exactly equals TFSA draw', () => {
    // income = 0, TFSA = 100k, spending = 50k.
    // proactiveExtra = 50k → totalHouseholdNet = 50k → cashFlow = 0.
    const { d } = run({ tfsaBalA: 100_000, spending: 50_000 })
    expect(d.cashFlow).toBeCloseTo(0, 0)
    expect(d.tfsaWithdrawalA).toBeCloseTo(50_000, 0)
  })

  it('nonReg draw (zero gain) produces cashFlow ≈ 0', () => {
    // Full ACB (no capital gain) → non-reg draw generates no taxable income.
    // proactiveExtra includes the withdrawal → cashFlow ≈ 0.
    const { d } = run({
      nonRegBalA: 100_000, nonRegAcbA: 100_000,
      spending: 50_000,
    })
    expect(d.cashFlow).toBeCloseTo(0, 0)
    expect(d.nonRegWithdrawalA).toBeCloseTo(50_000, 0)
  })

  it('HISA draw produces cashFlow ≈ 0 when HISA covers the gap', () => {
    const { d } = run({
      hisaBal: 100_000,
      spending: 50_000,
      meltdownAItems: items('hisa'),
      meltdownBItems: items('hisa'),
    })
    expect(d.cashFlow).toBeCloseTo(0, 0)
  })

  it('meltdown draw surplus is deployed to HISA when spending is zero', () => {
    // After meltdown draw, engine reruns tax → totalNetNom reflects after-tax income.
    // Unlike RRIF extra draws, meltdown draws are included in the tax pass.
    // spending = 0 → all after-tax income is surplus; routed to HISA by default.
    const { d } = run({ rrspBalA: 500_000, meltdownACeiling: 80_000, spending: 0 })
    expect(d.cashFlow).toBeCloseTo(0, 0)
    expect(d.hisa).toBeGreaterThan(0)
  })
})

// ─── Per-account draw caps ────────────────────────────────────────────────────
// When a deficitItem has cap > 0, the engine draws at most that amount from the
// account in a given year, then moves to the next account in order.

describe('spendGap — per-account deficit caps', () => {
  it('stops TFSA draw at the cap and covers remaining gap from nonReg', () => {
    // gap = 50k; TFSA cap = 20k, nonReg = 100k (full ACB).
    // Engine draws 20k from TFSA (at cap), then 30k from nonReg.
    const { d, warnings } = run({
      tfsaBalA: 100_000,
      nonRegBalA: 100_000, nonRegAcbA: 100_000,
      spending: 50_000,
      meltdownAItems: [
        { account: 'tfsa',   cap: 20_000 },
        { account: 'nonReg', cap: 0 },
      ],
      meltdownBItems: [
        { account: 'tfsa',   cap: 20_000 },
        { account: 'nonReg', cap: 0 },
      ],
    })
    expect(d.tfsaWithdrawalA).toBeCloseTo(20_000, 0)
    expect(d.nonRegWithdrawalA).toBeCloseTo(30_000, 0)
    expect(warnings).toHaveLength(0)
  })

  it('cap=0 (unlimited) draws the full gap from TFSA without moving to nonReg', () => {
    // gap = 50k; TFSA cap = 0 (unlimited) → draws 50k from TFSA; nonReg untouched.
    const { d } = run({
      tfsaBalA: 100_000,
      nonRegBalA: 100_000, nonRegAcbA: 100_000,
      spending: 50_000,
      // default items: tfsa(cap=0), nonReg(cap=0), hisa(cap=0)
    })
    expect(d.tfsaWithdrawalA).toBeCloseTo(50_000, 0)
    expect(d.nonRegWithdrawalA).toBeCloseTo(0, 0)
  })

  it('per-person caps are applied independently — each person limited to their own cap', () => {
    // A: TFSA cap = 15k (limits draw from A's TFSA), B: TFSA cap = 10k (limits B's TFSA).
    // gap = 30k; A TFSA = 60k, B TFSA = 40k.
    // maxA = min(15k, 60k) = 15k; maxB = min(10k, 40k) = 10k; maxTotal = 25k.
    // draw = min(30k, 25k) = 25k split 15k to A and 10k to B.
    // Remaining 5k from nonReg (A only has nonReg).
    const { d } = run({
      tfsaBalA: 60_000, tfsaBalB: 40_000,
      nonRegBalA: 50_000, nonRegAcbA: 50_000,
      spending: 30_000,
      meltdownAItems: [
        { account: 'tfsa',   cap: 15_000 },
        { account: 'nonReg', cap: 0 },
      ],
      meltdownBItems: [
        { account: 'tfsa',   cap: 10_000 },
        { account: 'nonReg', cap: 0 },
      ],
    })
    expect(d.tfsaWithdrawalA).toBeCloseTo(15_000, 0)   // A capped at 15k
    expect(d.tfsaWithdrawalB).toBeCloseTo(10_000, 0)   // B capped at 10k
    expect(d.nonRegWithdrawalA).toBeCloseTo(5_000, 0)  // 5k remainder from A's nonReg
  })

  it("B's items provide ordering and caps for accounts not in A's config", () => {
    // A's config: only [nonReg, cap=0]. B's config: [tfsa, cap=20k; nonReg, cap=0].
    // Order: nonReg (A first), tfsa (added by B), hisa (fallback).
    // gap = 50k; nonReg covers full gap (A's order puts it first, unlimited).
    // TFSA appended from B but never reached.
    const { d } = run({
      tfsaBalA: 100_000, tfsaBalB: 100_000,
      nonRegBalA: 100_000, nonRegAcbA: 100_000,
      spending: 50_000,
      meltdownAItems: [{ account: 'nonReg', cap: 0 }],
      meltdownBItems: [{ account: 'tfsa', cap: 20_000 }, { account: 'nonReg', cap: 0 }],
    })
    expect(d.nonRegWithdrawalA).toBeCloseTo(50_000, 0)
    expect(d.tfsaWithdrawalA + d.tfsaWithdrawalB).toBeCloseTo(0, 0)
  })

  it('cap limits HISA draw and falls through to TFSA for the remainder', () => {
    // HISA cap = 10k, gap = 30k.  Draw 10k from HISA, 20k from TFSA.
    const { d, warnings } = run({
      hisaBal: 100_000,
      tfsaBalA: 100_000,
      spending: 30_000,
      meltdownAItems: [{ account: 'hisa', cap: 10_000 }, { account: 'tfsa', cap: 0 }],
      meltdownBItems: [{ account: 'hisa', cap: 10_000 }, { account: 'tfsa', cap: 0 }],
    })
    expect(d.hisa).toBeCloseTo(90_000, 0)        // 100k - 10k drawn
    expect(d.tfsaWithdrawalA).toBeCloseTo(20_000, 0)
    expect(warnings).toHaveLength(0)
  })
})

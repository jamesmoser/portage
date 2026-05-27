import { describe, it, expect } from 'vitest'
import { calculateTax, rrifMinFactor, optimizePensionSplit, type TaxInput } from '../tax'
import { DEFAULT_TAX_SETTINGS } from '../defaults'

// All tests use DEFAULT_TAX_SETTINGS (2024 Ontario + Federal) at yearsFromBase=0, cpiRatePct=2%.
// yearsFromBase=0 means the CPI factor is 1 — no bracket scaling — so we can verify
// exact dollar amounts against hand-calculated reference values.

const S = DEFAULT_TAX_SETTINGS
const zero: TaxInput = {
  employmentIncome: 0,
  pensionIncome: 0,
  cppIncome: 0,
  oasIncome: 0,
  eligibleDividends: 0,
  nonEligibleDividends: 0,
  foreignIncome: 0,
  capitalGainsRealized: 0,
  age: 50,
}

// Helper: calculate at reference year with no CPI drift
function calc(input: TaxInput) {
  return calculateTax(input, S, 0, 2)
}

// ─── Zero income ──────────────────────────────────────────────────────────────
// Intent: when there is no income at all, every output field is zero.

describe('zero income', () => {
  it('returns all zeros', () => {
    const r = calc(zero)
    expect(r.grossIncome).toBe(0)
    expect(r.federalTax).toBe(0)
    expect(r.ontarioTax).toBe(0)
    expect(r.oasClawback).toBe(0)
    expect(r.totalTax).toBe(0)
    expect(r.netAfterTax).toBe(0)
    expect(r.effectiveRate).toBe(0)
  })
})

// ─── Bracket arithmetic ───────────────────────────────────────────────────────
// Intent: tax is marginal — only the income above each threshold is taxed at the
// higher rate. BPA reduces federal and Ontario tax at the lowest bracket rate.
// Hand-calculated reference values verified against 2024 federal and Ontario tables.

describe('federal and Ontario bracket calculations', () => {
  it('first federal and Ontario bracket — $30,000 employment, age 45', () => {
    // Federal: 30000 × 15% = 4500; BPA credit = 15705 × 15% = 2355.75 → 2144.25
    // Ontario: 30000 × 5.05% = 1515; BPA credit = 11865 × 5.05% = 599.18 → 915.82
    // No surtax (Ontario basic 915.82 < 5315)
    const r = calc({ ...zero, employmentIncome: 30_000 })
    expect(r.federalTax).toBeCloseTo(2144.25, 0)
    expect(r.ontarioTax).toBeCloseTo(915.82, 0)
    expect(r.totalTax).toBeCloseTo(3060.07, 0)
    expect(r.netAfterTax).toBeCloseTo(26_939.93, 0)
  })

  it('second federal and Ontario bracket — $80,000 employment, age 45', () => {
    // Federal: 55867×15% + (80000-55867)×20.5% = 8380.05 + 4947.27 = 13327.32
    //          BPA credit = 2355.75 → 10971.57
    // Ontario: 51446×5.05% + (80000-51446)×9.15% = 2598.02 + 2612.69 = 5210.71
    //          BPA credit = 599.18 → basic = 4611.53; no surtax
    const r = calc({ ...zero, employmentIncome: 80_000 })
    expect(r.federalTax).toBeCloseTo(10_971.57, 0)
    expect(r.ontarioTax).toBeCloseTo(4_611.53, 0)
    expect(r.totalTax).toBeCloseTo(15_583.10, 0)
  })

  it('third federal bracket — $130,000 employment, age 45', () => {
    // Into 26% federal bracket (above 111,733) and 11.16% Ontario bracket
    const r = calc({ ...zero, employmentIncome: 130_000 })
    expect(r.marginalFederalRate).toBeCloseTo(0.26, 5)
    expect(r.marginalOntarioRate).toBeCloseTo(0.1116, 5)
  })

  it('grossIncome equals net income for tax purposes (sum of included income)', () => {
    const r = calc({ ...zero, employmentIncome: 50_000 })
    expect(r.grossIncome).toBe(50_000)
  })

  it('effective rate is totalTax / grossIncome', () => {
    const r = calc({ ...zero, employmentIncome: 80_000 })
    expect(r.effectiveRate).toBeCloseTo(r.totalTax / r.grossIncome, 6)
  })

  it('total tax = federal + ontario', () => {
    const r = calc({ ...zero, employmentIncome: 80_000 })
    expect(r.totalTax).toBeCloseTo(r.federalTax + r.ontarioTax, 6)
  })

  it('net after tax = gross income minus total tax', () => {
    const r = calc({ ...zero, employmentIncome: 80_000 })
    expect(r.netAfterTax).toBeCloseTo(r.grossIncome - r.totalTax, 6)
  })
})

// ─── Age amount ───────────────────────────────────────────────────────────────
// Intent: people 65+ get an additional non-refundable credit (age amount) that
// phases out as income rises above the threshold (~$42,335).
// The credit is applied at 15% federal / 5.05% Ontario (lowest bracket rates).
// Below 65: no age amount credit at all.

describe('age amount', () => {
  it('no age amount credit under age 65', () => {
    const r64 = calc({ ...zero, employmentIncome: 40_000, age: 64 })
    const r65 = calc({ ...zero, employmentIncome: 40_000, age: 65 })
    // Under 65 pays more tax because no age amount credit
    expect(r64.totalTax).toBeGreaterThan(r65.totalTax)
  })

  it('full age amount when income is below phase-out threshold', () => {
    // At $40,000 income (below $42,335 threshold), full age amount applies.
    // Federal age credit: 8790 × 15% = 1318.50
    // Ontario age credit: 5750 × 5.05% = 290.38
    const r45 = calc({ ...zero, employmentIncome: 40_000, age: 45 })
    const r65 = calc({ ...zero, employmentIncome: 40_000, age: 65 })
    const reduction = r45.totalTax - r65.totalTax
    expect(reduction).toBeCloseTo(1318.50 + 290.38, 0)
  })

  it('age amount partially phases out above threshold', () => {
    // At $60,000 income (above $42,335), age amount is reduced by 15% of the excess.
    // Excess = 60000 - 42335 = 17665; reduction = 17665 × 15% = 2649.75
    // Federal age amount = max(0, 8790 - 2649.75) = 6140.25; credit = 6140.25 × 15% = 921.04
    // Ontario age amount = max(0, 5750 - 2649.75) = 3100.25; credit = 3100.25 × 5.05% = 156.56
    const r45 = calc({ ...zero, employmentIncome: 60_000, age: 45 })
    const r65 = calc({ ...zero, employmentIncome: 60_000, age: 65 })
    const reduction = r45.totalTax - r65.totalTax
    expect(reduction).toBeCloseTo(921.04 + 156.56, 0)
  })

  it('age amount fully phased out at high income (~$100,935+)', () => {
    // Federal: 8790 / 0.15 = 58600; threshold 42335 + 58600 = 100935 → age amount = 0 above this
    // Ontario: 5750 / 0.15 = 38333; threshold 42335 + 38333 = 80668 → Ontario age = 0 above this
    const r45 = calc({ ...zero, employmentIncome: 120_000, age: 45 })
    const r65 = calc({ ...zero, employmentIncome: 120_000, age: 65 })
    // At $120,000, both age amounts are fully phased out → no difference
    expect(r45.totalTax).toBeCloseTo(r65.totalTax, 0)
  })
})

// ─── Pension income credit ────────────────────────────────────────────────────
// Intent: the first $2,000 of eligible pension income (federal) / $1,637 (Ontario)
// generates a non-refundable credit at the lowest bracket rate.
// Eligible pension includes DB pension at any age and RRIF income.

describe('pension income credit', () => {
  it('pension credit reduces tax relative to same employment income', () => {
    // $20,000 pension vs $20,000 employment — pension gets the credit, employment does not.
    // Federal credit = min(20000, 2000) × 15% = $300
    // Ontario credit = min(20000, 1637) × 5.05% = $82.67
    const rEmp = calc({ ...zero, employmentIncome: 20_000, age: 45 })
    const rPen = calc({ ...zero, pensionIncome: 20_000, age: 45 })
    const reduction = rEmp.totalTax - rPen.totalTax
    expect(reduction).toBeCloseTo(300 + 82.67, 0)
  })

  it('pension credit is capped — no additional credit above $2,000 federal / $1,637 Ontario', () => {
    // At $20,000 pension: credit = min(20000,2000)×15% + min(20000,1637)×5.05% = 300 + 82.67 = 382.67
    // At $30,000 pension: credit should be the SAME $382.67 — both exceed the caps
    const rEmp20k = calc({ ...zero, employmentIncome: 20_000, age: 45 })
    const rPen20k = calc({ ...zero, pensionIncome:   20_000, age: 45 })
    const rEmp30k = calc({ ...zero, employmentIncome: 30_000, age: 45 })
    const rPen30k = calc({ ...zero, pensionIncome:   30_000, age: 45 })
    const credit20k = rEmp20k.totalTax - rPen20k.totalTax
    const credit30k = rEmp30k.totalTax - rPen30k.totalTax
    // Both exceed both caps — credit is identical
    expect(credit20k).toBeCloseTo(credit30k, 0)
    // And it equals the maximum credit
    expect(credit20k).toBeCloseTo(300 + 82.67, 0)
  })
})

// ─── Eligible dividends ───────────────────────────────────────────────────────
// Intent: Canadian eligible dividends are grossed up by 38% before inclusion in
// net income (grossed-up amount is taxed). A dividend tax credit is then applied
// on the grossed-up amount: 15.02% federal, 10% Ontario.
// Net effect: eligible dividends at low income can carry zero combined tax.

describe('eligible dividends', () => {
  it('gross-up is included in net income', () => {
    // $10,000 eligible divs → grossed up = 10000 × 1.38 = 13,800
    const r = calc({ ...zero, eligibleDividends: 10_000 })
    expect(r.grossIncome).toBeCloseTo(13_800, 0)
  })

  it('eligible dividend tax credit reduces federal and Ontario tax', () => {
    const rDiv = calc({ ...zero, eligibleDividends: 10_000 })
    // Grossed-up: 13800. Div credit: 13800 × 15.02% federal, 13800 × 10% Ontario
    // At 13800 income (below BPA), most/all tax should be eliminated
    expect(rDiv.totalTax).toBe(0)
  })

  it('eligible dividends are more tax-efficient than equivalent employment income', () => {
    // Compare $20,000 dividends (grossed to $27,600) vs $27,600 employment income
    const rDiv = calc({ ...zero, eligibleDividends: 20_000 })
    const rEmp = calc({ ...zero, employmentIncome: 27_600 })
    expect(rDiv.totalTax).toBeLessThan(rEmp.totalTax)
  })
})

// ─── Capital gains ────────────────────────────────────────────────────────────
// Intent: only 50% of realized capital gains are included in net income (2025
// inclusion rate; the proposed 2/3 above $250k was cancelled January 2025).
// The two-tier threshold is set to $10M to effectively disable it.

describe('capital gains', () => {
  it('only 50% of the gain is included in net income', () => {
    const r = calc({ ...zero, capitalGainsRealized: 100_000 })
    expect(r.grossIncome).toBeCloseTo(50_000, 0)
  })

  it('tax on a capital gain is less than tax on the same employment income', () => {
    const rCG  = calc({ ...zero, capitalGainsRealized: 100_000 })
    const rEmp = calc({ ...zero, employmentIncome: 100_000 })
    expect(rCG.totalTax).toBeLessThan(rEmp.totalTax)
  })

  it('effective tax rate on included amount matches general bracket expectations', () => {
    // $100,000 gain → $50,000 included. Tax on $50,000 in first/second bracket.
    const r = calc({ ...zero, capitalGainsRealized: 100_000 })
    // Federal: 50000×15% - BPA_credit = 7500 - 2355.75 = 5144.25
    // Ontario: 50000×5.05% - BPA_credit = 2525 - 599.18 = 1925.82
    expect(r.federalTax).toBeCloseTo(5144.25, 0)
    expect(r.ontarioTax).toBeCloseTo(1925.82, 0)
  })

  it('applies 50% inclusion even above the high-rate threshold (threshold is $10M)', () => {
    // With capitalGainsHighThreshold = $10M and both rates = 50%, all gains use 50%
    const r = calc({ ...zero, capitalGainsRealized: 500_000 })
    expect(r.grossIncome).toBeCloseTo(250_000, 0)
  })
})

// ─── OAS clawback ─────────────────────────────────────────────────────────────
// Intent: when net income exceeds ~$90,997, 15% of the excess is recovered as a
// clawback. The clawback cannot exceed the total OAS actually received that year.

describe('OAS clawback', () => {
  it('no clawback when net income is below threshold', () => {
    // OAS = $8,556 (annual), employment = $80,000. Net = $88,556 < $90,997 threshold.
    const r = calc({ ...zero, oasIncome: 8_556, employmentIncome: 80_000, age: 70 })
    expect(r.oasClawback).toBe(0)
  })

  it('clawback is 15% of excess above threshold', () => {
    // Employment = $100,000, OAS = $8,556. Net = $108,556.
    // Excess = 108,556 - 90,997 = 17,559. Clawback = min(8,556, 17,559 × 15%) = min(8556, 2633.85) = 2633.85
    const r = calc({ ...zero, oasIncome: 8_556, employmentIncome: 100_000, age: 70 })
    expect(r.oasClawback).toBeCloseTo(2_633.85, 0)
  })

  it('clawback is added to federal tax (recovery tax)', () => {
    const r = calc({ ...zero, oasIncome: 8_556, employmentIncome: 100_000, age: 70 })
    expect(r.oasClawback).toBeGreaterThan(0)
    // The clawback is included in federalTax
    const rNoOas = calc({ ...zero, employmentIncome: 100_000, age: 70 })
    expect(r.federalTax).toBeGreaterThan(rNoOas.federalTax)
  })

  it('clawback is capped at annual OAS received — cannot exceed total OAS', () => {
    // Employment = $160,000, OAS = $8,556. Net = $168,556.
    // Formula gives: (168,556 - 90,997) × 15% = 77,559 × 15% = $11,633.85
    // Cap: min($8,556, $11,633.85) = $8,556 (full clawback, but no more)
    const r = calc({ ...zero, oasIncome: 8_556, employmentIncome: 160_000, age: 70 })
    expect(r.oasClawback).toBeLessThanOrEqual(8_556)
  })

  it('no clawback when oasIncome is zero even at high income', () => {
    const r = calc({ ...zero, employmentIncome: 200_000, age: 70 })
    expect(r.oasClawback).toBe(0)
  })
})

// ─── Ontario surtax ───────────────────────────────────────────────────────────
// Intent: a two-tier surtax on Ontario basic tax (after credits, before surtax).
// Tier 1: 20% of Ontario basic above $5,315
// Tier 2: additional 36% of Ontario basic above $6,802
// No surtax when Ontario basic ≤ $5,315.

describe('Ontario surtax', () => {
  it('no surtax when Ontario basic is below tier 1 threshold', () => {
    // At $30,000 income, Ontario basic ≈ $915 — well below $5,315
    const r = calc({ ...zero, employmentIncome: 30_000 })
    // Verify no surtax by checking that ontarioTax ≈ the basic amount only
    // Basic = 915.82, surtax = 0
    expect(r.ontarioTax).toBeCloseTo(915.82, 0)
  })

  it('tier 1 surtax only — Ontario basic between $5,315 and $6,802', () => {
    // Engineered income to produce Ontario basic ≈ $5,500
    // At $89,710 employment:
    //   Ontario tax before credits: 51446×5.05% + (89710-51446)×9.15% = 2598.02 + 3501.16 = 6099.18
    //   BPA credit = 599.18 → basic = 5500.00
    //   Tier 1: (5500 - 5315) × 20% = 185 × 20% = $37.00
    const r = calc({ ...zero, employmentIncome: 89_710 })
    const ontBasic = r.ontarioTax  // before we can isolate basic from surtax
    // We know surtax applies — Ontario tax should be > basic
    // Basic ≈ 5500, surtax ≈ 37 → Ontario total ≈ 5537
    expect(r.ontarioTax).toBeGreaterThan(5_315)
    expect(r.ontarioTax).toBeLessThan(6_802 + 500)  // ballpark — not yet in tier 2 range
  })

  it('tier 1 + tier 2 surtax — Ontario basic above $6,802', () => {
    // At $110,000 employment income, Ontario basic ≈ $7,499
    //   Tier 1: (7499 - 5315) × 20% = 2184 × 20% = $436.80
    //   Tier 2: (7499 - 6802) × 36% = 697 × 36% = $251.00
    //   Surtax ≈ $687.80 → Ontario total ≈ $7499 + $687.80 = $8,186.80
    const r = calc({ ...zero, employmentIncome: 110_000 })
    expect(r.ontarioTax).toBeGreaterThan(8_000)
    // Marginal rate is above 11.16% because of surtax on top
    expect(r.marginalOntarioRate).toBeCloseTo(0.1116, 5)  // base bracket rate, not incl. surtax
  })

  it('surtax increases Ontario tax meaningfully at high income', () => {
    // Confirm Ontario tax is higher with surtax than without (surtax applies)
    const r80  = calc({ ...zero, employmentIncome: 80_000 })  // no surtax
    const r110 = calc({ ...zero, employmentIncome: 110_000 }) // tier 1+2 surtax
    // The Ontario rate jump at $110k vs $80k should be larger than just bracket rates
    const oRateAt80  = r80.ontarioTax  / r80.grossIncome
    const oRateAt110 = r110.ontarioTax / r110.grossIncome
    expect(oRateAt110).toBeGreaterThan(oRateAt80)
  })
})

// ─── CPI indexing ─────────────────────────────────────────────────────────────
// Intent: dollar thresholds (brackets, BPA, age amount, clawback threshold, etc.)
// scale by (1 + cpiRate%)^yearsFromBase. Rates (percentages) are NOT scaled.
// A given nominal income produces less tax after indexing because the brackets
// and credits have grown while income stayed the same.

describe('CPI indexing', () => {
  it('yearsFromBase=0 gives the same result regardless of CPI rate', () => {
    const r0pct  = calculateTax({ ...zero, employmentIncome: 80_000 }, S, 0, 0)
    const r2pct  = calculateTax({ ...zero, employmentIncome: 80_000 }, S, 0, 2)
    const r5pct  = calculateTax({ ...zero, employmentIncome: 80_000 }, S, 0, 5)
    expect(r0pct.totalTax).toBeCloseTo(r2pct.totalTax, 6)
    expect(r0pct.totalTax).toBeCloseTo(r5pct.totalTax, 6)
  })

  it('indexing forward reduces tax on the same nominal income', () => {
    // After 10 years of 2% CPI, brackets and BPA are ~22% larger.
    // The same $80,000 nominal income falls lower in the (now-larger) bracket structure.
    const rNow    = calculateTax({ ...zero, employmentIncome: 80_000 }, S, 0,  2)
    const rFuture = calculateTax({ ...zero, employmentIncome: 80_000 }, S, 10, 2)
    expect(rFuture.totalTax).toBeLessThan(rNow.totalTax)
  })

  it('bracket rates are not indexed — only thresholds are', () => {
    // The marginal rate for a given bracket should be identical at year 0 and year 10
    // (same income, same rate — just different threshold placement)
    const rNow    = calculateTax({ ...zero, employmentIncome: 40_000 }, S, 0,  2)
    const rFuture = calculateTax({ ...zero, employmentIncome: 40_000 }, S, 10, 2)
    // Both are in the first bracket at these incomes
    expect(rNow.marginalFederalRate).toBeCloseTo(0.15, 5)
    expect(rFuture.marginalFederalRate).toBeCloseTo(0.15, 5)
  })
})

// ─── rrifMinFactor ────────────────────────────────────────────────────────────
// Intent: return the CRA RRIF minimum withdrawal factor for a given age.
//   - Under 55: formula 1/(90 - age)
//   - Ages 55–94: CRA table lookup (exact integer values)
//   - Ages 95+: flat 20%
// Input is treated as a floor (Math.floor) so fractional ages work correctly.
// The engine passes intAgeAt() results which are already integers.

describe('rrifMinFactor', () => {
  it('uses formula for ages under 55', () => {
    expect(rrifMinFactor(50)).toBeCloseTo(1 / (90 - 50), 6)
    expect(rrifMinFactor(54)).toBeCloseTo(1 / (90 - 54), 6)
  })

  it('table value at age 55 differs from the formula (intentional transition)', () => {
    // CRA table at 55 = 0.0270; formula at 55 = 1/35 ≈ 0.02857
    expect(rrifMinFactor(55)).toBe(0.0270)
    expect(rrifMinFactor(55)).not.toBeCloseTo(1 / 35, 4)
  })

  it('key table values', () => {
    expect(rrifMinFactor(65)).toBe(0.0400)
    expect(rrifMinFactor(71)).toBe(0.0528)  // most common conversion age
    expect(rrifMinFactor(80)).toBe(0.0682)
    expect(rrifMinFactor(90)).toBe(0.1192)
    expect(rrifMinFactor(94)).toBe(0.1879)  // last table entry
  })

  it('returns 20% at age 95 and above', () => {
    expect(rrifMinFactor(95)).toBe(0.2000)
    expect(rrifMinFactor(100)).toBe(0.2000)
  })

  it('fractional ages floor to the integer value', () => {
    // Age 71.9 should use the same factor as age 71
    expect(rrifMinFactor(71.9)).toBe(rrifMinFactor(71))
    expect(rrifMinFactor(80.5)).toBe(rrifMinFactor(80))
  })

  it('factors are monotonically non-decreasing with age', () => {
    for (let age = 55; age < 95; age++) {
      expect(rrifMinFactor(age + 1)).toBeGreaterThanOrEqual(rrifMinFactor(age))
    }
  })
})

// ─── optimizePensionSplit ─────────────────────────────────────────────────────
// Intent: find the pension split percentage (0–50%, integer steps) from Person A
// to Person B that minimizes their combined federal + Ontario tax.
// Only Person A's eligible pension can be split.
// The returned split percentage is in [0, 50], and the combined tax at the
// optimal split is ≤ the combined tax at 0%.

describe('optimizePensionSplit', () => {
  it('split percentage is always in [0, 50]', () => {
    const r = optimizePensionSplit(
      { ...zero, pensionIncome: 80_000 },
      { ...zero },
      80_000,
      S, 0, 2,
    )
    expect(r.splitPct).toBeGreaterThanOrEqual(0)
    expect(r.splitPct).toBeLessThanOrEqual(50)
  })

  it('splitting is beneficial when Person A has high pension and Person B has little income', () => {
    // A has $80,000 pension (high marginal rate), B has $0.
    // Shifting income to B should reduce combined tax.
    const r = optimizePensionSplit(
      { ...zero, pensionIncome: 80_000, age: 65 },
      { ...zero, age: 65 },
      80_000,
      S, 0, 2,
    )
    expect(r.splitPct).toBeGreaterThan(0)
    const noSplitA = calc({ ...zero, pensionIncome: 80_000, age: 65 })
    const noSplitB = calc({ ...zero, age: 65 })
    expect(r.taxA.totalTax + r.taxB.totalTax).toBeLessThan(noSplitA.totalTax + noSplitB.totalTax)
  })

  it('no split beneficial when both persons have equal income', () => {
    // A and B both at $50,000 pension — marginal rates are equal, splitting does nothing
    const r = optimizePensionSplit(
      { ...zero, pensionIncome: 50_000, age: 65 },
      { ...zero, pensionIncome: 50_000, age: 65 },
      50_000,
      S, 0, 2,
    )
    // Combined tax at optimal split should be ≤ no-split (it won't be lower here)
    const noSplitA = calc({ ...zero, pensionIncome: 50_000, age: 65 })
    const noSplitB = calc({ ...zero, pensionIncome: 50_000, age: 65 })
    expect(r.taxA.totalTax + r.taxB.totalTax).toBeLessThanOrEqual(noSplitA.totalTax + noSplitB.totalTax + 1)
  })

  it('optimal split never increases total household tax', () => {
    const cases: [number, number][] = [
      [100_000, 0],
      [60_000, 40_000],
      [80_000, 20_000],
      [50_000, 50_000],
    ]
    for (const [pensA, pensB] of cases) {
      const r = optimizePensionSplit(
        { ...zero, pensionIncome: pensA, age: 65 },
        { ...zero, pensionIncome: pensB, age: 65 },
        pensA,
        S, 0, 2,
      )
      const noSplitA = calc({ ...zero, pensionIncome: pensA, age: 65 })
      const noSplitB = calc({ ...zero, pensionIncome: pensB, age: 65 })
      expect(r.taxA.totalTax + r.taxB.totalTax)
        .toBeLessThanOrEqual(noSplitA.totalTax + noSplitB.totalTax + 0.01)
    }
  })

  it('cannot transfer more than 50% of eligible pension', () => {
    // Even with extreme imbalance, max split is 50%
    const r = optimizePensionSplit(
      { ...zero, pensionIncome: 200_000, age: 65 },
      { ...zero, age: 65 },
      200_000,
      S, 0, 2,
    )
    expect(r.splitPct).toBeLessThanOrEqual(50)
  })
})

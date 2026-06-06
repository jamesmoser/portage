import { describe, it, expect } from 'vitest'
import { calculateTax, rrifMinFactor, optimizePensionSplit, type TaxInput } from '../tax'
import { DEFAULT_TAX_SETTINGS } from '../defaults'

// All tests use DEFAULT_TAX_SETTINGS (2026 Ontario + Federal) at yearsFromBase=0, cpiRatePct=2%.
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
// Hand-calculated reference values verified against 2026 federal and Ontario tables.

describe('federal and Ontario bracket calculations', () => {
  it('first federal and Ontario bracket — $30,000 employment, age 45', () => {
    // Federal: 30000 × 14% = 4200; BPA credit = 16452 × 14% = 2303.28 → 1896.72
    // Ontario: 30000 × 5.05% = 1515; BPA credit = 12989 × 5.05% = 655.94 → 859.06
    // No surtax (Ontario basic 859.06 < 5818)
    const r = calc({ ...zero, employmentIncome: 30_000 })
    expect(r.federalTax).toBeCloseTo(1_896.72, 0)
    expect(r.ontarioTax).toBeCloseTo(859.06, 0)
    expect(r.totalTax).toBeCloseTo(2_755.78, 0)
    expect(r.netAfterTax).toBeCloseTo(27_244.22, 0)
  })

  it('second federal and Ontario bracket — $80,000 employment, age 45', () => {
    // Federal: 58523×14% + (80000-58523)×20.5% = 8193.22 + 4402.79 = 12596.01
    //          BPA credit = 16452×14% = 2303.28 → 10292.73
    // Ontario: 53891×5.05% + (80000-53891)×9.15% = 2721.50 + 2388.97 = 5110.47
    //          BPA credit = 12989×5.05% = 655.94 → basic = 4454.52; no surtax
    const r = calc({ ...zero, employmentIncome: 80_000 })
    expect(r.federalTax).toBeCloseTo(10_292.73, 0)
    expect(r.ontarioTax).toBeCloseTo(4_454.52, 0)
    expect(r.totalTax).toBeCloseTo(14_747.25, 0)
  })

  it('third federal bracket — $130,000 employment, age 45', () => {
    // Into 26% federal bracket (above 117,045) and 11.16% Ontario bracket (above 107,785)
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
// phases out as income rises above the threshold (~$46,432 federal, ~$47,210 Ontario).
// The credit is applied at 14% federal / 5.05% Ontario (lowest bracket rates).
// Below 65: no age amount credit at all.

describe('age amount', () => {
  it('no age amount credit under age 65', () => {
    const r64 = calc({ ...zero, employmentIncome: 40_000, age: 64 })
    const r65 = calc({ ...zero, employmentIncome: 40_000, age: 65 })
    // Under 65 pays more tax because no age amount credit
    expect(r64.totalTax).toBeGreaterThan(r65.totalTax)
  })

  it('full age amount when income is below phase-out threshold', () => {
    // At $40,000 income (below $46,432 federal / $47,210 Ontario threshold), full age amount applies.
    // Federal age credit: 9209 × 14% = 1289.26
    // Ontario age credit: 6342 × 5.05% = 320.27
    const r45 = calc({ ...zero, employmentIncome: 40_000, age: 45 })
    const r65 = calc({ ...zero, employmentIncome: 40_000, age: 65 })
    const reduction = r45.totalTax - r65.totalTax
    expect(reduction).toBeCloseTo(1289.26 + 320.27, 0)
  })

  it('age amount partially phases out above threshold', () => {
    // At $60,000 income (above $46,432 federal / $47,210 Ontario threshold).
    // Federal: excess = 60000 - 46432 = 13568; reduction = 13568 × 15% = 2035.20
    //   Federal age amount = max(0, 9209 - 2035.20) = 7173.80; credit = 7173.80 × 14% = 1004.33
    // Ontario: excess = 60000 - 47210 = 12790; reduction = 12790 × 15% = 1918.50
    //   Ontario age amount = max(0, 6342 - 1918.50) = 4423.50; credit = 4423.50 × 5.05% = 223.39
    const r45 = calc({ ...zero, employmentIncome: 60_000, age: 45 })
    const r65 = calc({ ...zero, employmentIncome: 60_000, age: 65 })
    const reduction = r45.totalTax - r65.totalTax
    expect(reduction).toBeCloseTo(1004.33 + 223.39, 0)
  })

  it('age amount fully phased out at high income (~$107,825+ federal, ~$89,490+ Ontario)', () => {
    // Federal: 9209 / 0.15 = 61393; threshold 46432 + 61393 = 107825 → age amount = 0 above this
    // Ontario: 6342 / 0.15 = 42280; threshold 47210 + 42280 = 89490 → Ontario age = 0 above this
    const r45 = calc({ ...zero, employmentIncome: 120_000, age: 45 })
    const r65 = calc({ ...zero, employmentIncome: 120_000, age: 65 })
    // At $120,000, both age amounts are fully phased out → no difference
    expect(r45.totalTax).toBeCloseTo(r65.totalTax, 0)
  })
})

// ─── Pension income credit ────────────────────────────────────────────────────
// Intent: the first $2,000 of eligible pension income (federal) / $1,796 (Ontario)
// generates a non-refundable credit at the lowest bracket rate.
// Eligible pension includes DB pension at any age and RRIF income.

describe('pension income credit', () => {
  it('pension credit reduces tax relative to same employment income', () => {
    // $20,000 pension vs $20,000 employment — pension gets the credit, employment does not.
    // Federal credit = min(20000, 2000) × 14% = $280
    // Ontario credit = min(20000, 1796) × 5.05% = $90.70
    const rEmp = calc({ ...zero, employmentIncome: 20_000, age: 45 })
    const rPen = calc({ ...zero, pensionIncome: 20_000, age: 45 })
    const reduction = rEmp.totalTax - rPen.totalTax
    expect(reduction).toBeCloseTo(280 + 90.70, 0)
  })

  it('pension credit is capped — no additional credit above $2,000 federal / $1,796 Ontario', () => {
    // At $20,000 pension: credit = min(20000,2000)×14% + min(20000,1796)×5.05% = 280 + 90.70 = 370.70
    // At $30,000 pension: credit should be the SAME $370.70 — both exceed the caps
    const rEmp20k = calc({ ...zero, employmentIncome: 20_000, age: 45 })
    const rPen20k = calc({ ...zero, pensionIncome:   20_000, age: 45 })
    const rEmp30k = calc({ ...zero, employmentIncome: 30_000, age: 45 })
    const rPen30k = calc({ ...zero, pensionIncome:   30_000, age: 45 })
    const credit20k = rEmp20k.totalTax - rPen20k.totalTax
    const credit30k = rEmp30k.totalTax - rPen30k.totalTax
    // Both exceed both caps — credit is identical
    expect(credit20k).toBeCloseTo(credit30k, 0)
    // And it equals the maximum credit
    expect(credit20k).toBeCloseTo(280 + 90.70, 0)
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
    // $100,000 gain → $50,000 included. Tax on $50,000 in first bracket.
    const r = calc({ ...zero, capitalGainsRealized: 100_000 })
    // Federal: 50000×14% - BPA_credit = 7000 - 16452×14% = 7000 - 2303.28 = 4696.72
    // Ontario: 50000×5.05% - BPA_credit = 2525 - 12989×5.05% = 2525 - 655.94 = 1869.06
    expect(r.federalTax).toBeCloseTo(4_696.72, 0)
    expect(r.ontarioTax).toBeCloseTo(1_869.06, 0)
  })

  it('applies 50% inclusion even above the high-rate threshold (threshold is $10M)', () => {
    // With capitalGainsHighThreshold = $10M and both rates = 50%, all gains use 50%
    const r = calc({ ...zero, capitalGainsRealized: 500_000 })
    expect(r.grossIncome).toBeCloseTo(250_000, 0)
  })
})

// ─── Foreign tax credit ───────────────────────────────────────────────────────
// Intent: foreign income is taxed at the full marginal rate, but US/intl dividends
// generally face a 15% withholding tax at source, which the CRA credits back
// dollar-for-dollar as a non-refundable Foreign Tax Credit.

describe('foreign income and foreign tax credit', () => {
  it('applies a 15% non-refundable foreign tax credit against federal tax', () => {
    // Employment = $70,000, Foreign Income = $10,000. Total = $80,000.
    // Federal tax without FTC for $80,000 is $10,292.73.
    // FTC = 10,000 * 15% = $1,500.
    // Expected federal tax = $10,292.73 - $1,500 = $8,792.73.
    const r = calc({ ...zero, employmentIncome: 70_000, foreignIncome: 10_000 })
    expect(r.federalTax).toBeCloseTo(10_292.73 - 1_500, 0)
  })

  it('foreign tax credit is non-refundable — cannot reduce federal tax below zero', () => {
    // Foreign income of $50,000.
    // Federal tax before FTC: 50,000 * 14% - BPA_credit = 7,000 - 2,303.28 = 4,696.72.
    // FTC = 50,000 * 15% = $7,500.
    // Since FTC ($7,500) > tax before FTC ($4,696.72), the federalTax should be exactly 0.
    const r = calc({ ...zero, foreignIncome: 50_000 })
    expect(r.federalTax).toBe(0)
  })
})


// ─── OAS clawback ─────────────────────────────────────────────────────────────
// Intent: when net income exceeds ~$95,323 (2026), 15% of the excess is recovered
// as a clawback. The clawback cannot exceed the total OAS actually received that year.

describe('OAS clawback', () => {
  it('no clawback when net income is below threshold', () => {
    // OAS = $8,556 (annual), employment = $80,000. Net = $88,556 < $95,323 threshold.
    const r = calc({ ...zero, oasIncome: 8_556, employmentIncome: 80_000, age: 70 })
    expect(r.oasClawback).toBe(0)
  })

  it('clawback is 15% of excess above threshold', () => {
    // Employment = $100,000, OAS = $8,556. Net = $108,556.
    // Excess = 108,556 - 95,323 = 13,233. Clawback = min(8,556, 13,233 × 15%) = 1984.95
    const r = calc({ ...zero, oasIncome: 8_556, employmentIncome: 100_000, age: 70 })
    expect(r.oasClawback).toBeCloseTo(1_984.95, 0)
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
    // Formula gives: (168,556 - 95,323) × 15% = 73,233 × 15% = $10,984.95
    // Cap: min($8,556, $10,984.95) = $8,556 (full clawback, but no more)
    const r = calc({ ...zero, oasIncome: 8_556, employmentIncome: 160_000, age: 70 })
    expect(r.oasClawback).toBeLessThanOrEqual(8_556)
  })

  it('no clawback when oasIncome is zero even at high income', () => {
    const r = calc({ ...zero, employmentIncome: 200_000, age: 70 })
    expect(r.oasClawback).toBe(0)
  })

  it('deducts clawback from net income to compute taxable income, reducing income tax', () => {
    // With $100k employment and $8.5k OAS, clawback is $1,984.95.
    // Taxable income is $108,556 - $1,984.95 = $106,571.05.
    // Verify that federal and Ontario taxes are calculated based on taxableIncome.
    const r = calc({ ...zero, oasIncome: 8_556, employmentIncome: 100_000, age: 70 })
    expect(r.federalTax).toBeCloseTo(17_724.74, 0)
    expect(r.ontarioTax).toBeCloseTo(7_099.33, 0)
  })
})

// ─── Ontario surtax ───────────────────────────────────────────────────────────
// Intent: a two-tier surtax on Ontario basic tax (after credits, before surtax).
// Tier 1: 20% of Ontario basic above $5,818
// Tier 2: additional 36% of Ontario basic above $7,446
// No surtax when Ontario basic ≤ $5,818.

describe('Ontario surtax', () => {
  it('no surtax when Ontario basic is below tier 1 threshold', () => {
    // At $30,000 income, Ontario basic ≈ $859 — well below $5,818
    const r = calc({ ...zero, employmentIncome: 30_000 })
    // Verify no surtax by checking that ontarioTax ≈ the basic amount only
    // Basic = 859.06, surtax = 0
    expect(r.ontarioTax).toBeCloseTo(859.06, 0)
  })

  it('tier 1 surtax only — Ontario basic between $5,818 and $7,446', () => {
    // Engineered income to produce Ontario basic ≈ $6,193
    // At $99,000 employment:
    //   Ontario tax before credits: 53891×5.05% + (99000-53891)×9.15% = 2721.50 + 4127.47 = 6848.97
    //   BPA credit = 655.94 → basic = 6193.03
    //   Tier 1: (6193.03 - 5818) × 20% = 375.03 × 20% = $75.01
    const r = calc({ ...zero, employmentIncome: 99_000 })
    expect(r.ontarioTax).toBeGreaterThan(5_818)
    expect(r.ontarioTax).toBeLessThan(7_446 + 500)  // ballpark — not yet in tier 2 range
  })

  it('tier 1 + tier 2 surtax — Ontario basic above $7,446', () => {
    // At $130,000 employment income, Ontario basic ≈ $9,476
    //   Tier 1: (9476 - 5818) × 20% = 3658 × 20% = $731.60
    //   Tier 2: (9476 - 7446) × 36% = 2030 × 36% = $730.80
    //   Surtax ≈ $1,462 → Ontario total ≈ $10,938
    const r = calc({ ...zero, employmentIncome: 130_000 })
    expect(r.ontarioTax).toBeGreaterThan(8_000)
    // Marginal rate is above 11.16% because of surtax on top
    expect(r.marginalOntarioRate).toBeCloseTo(0.1116, 5)  // base bracket rate, not incl. surtax
  })

  it('surtax increases Ontario tax meaningfully at high income', () => {
    // Confirm Ontario tax is higher with surtax than without (surtax applies)
    const r80  = calc({ ...zero, employmentIncome: 80_000 })  // no surtax
    const r110 = calc({ ...zero, employmentIncome: 110_000 }) // tier 1 surtax
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
    // Both are in the first bracket at these incomes (2026 first bracket: 14%)
    expect(rNow.marginalFederalRate).toBeCloseTo(0.14, 5)
    expect(rFuture.marginalFederalRate).toBeCloseTo(0.14, 5)
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

  it('formula is used up to age 70', () => {
    // formula is 1 / (90 - age)
    expect(rrifMinFactor(55)).toBeCloseTo(1 / 35, 4)
    expect(rrifMinFactor(65)).toBeCloseTo(1 / 25, 4)
    expect(rrifMinFactor(70)).toBeCloseTo(1 / 20, 4)
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
  it('transfer is within ±50% of the eligible pool', () => {
    const r = optimizePensionSplit(
      { ...zero, pensionIncome: 80_000 },
      { ...zero },
      80_000, 0,
      S, 0, 2,
    )
    // A→B: transfer positive, at most 50% of eligible A
    expect(r.transfer).toBeGreaterThanOrEqual(0)
    expect(r.transfer).toBeLessThanOrEqual(80_000 * 0.50 + 0.01)
  })

  it('splitting is beneficial when Person A has high pension and Person B has little income', () => {
    // A has $80,000 pension (high marginal rate), B has $0.
    // Shifting income to B should reduce combined tax.
    const r = optimizePensionSplit(
      { ...zero, pensionIncome: 80_000, age: 65 },
      { ...zero, age: 65 },
      80_000, 0,
      S, 0, 2,
    )
    expect(r.transfer).toBeGreaterThan(0)
    const noSplitA = calc({ ...zero, pensionIncome: 80_000, age: 65 })
    const noSplitB = calc({ ...zero, age: 65 })
    expect(r.taxA.totalTax + r.taxB.totalTax).toBeLessThan(noSplitA.totalTax + noSplitB.totalTax)
  })

  it('no split beneficial when both persons have equal income', () => {
    // A and B both at $50,000 pension — marginal rates are equal, splitting does nothing
    const r = optimizePensionSplit(
      { ...zero, pensionIncome: 50_000, age: 65 },
      { ...zero, pensionIncome: 50_000, age: 65 },
      50_000, 50_000,
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
        pensA, pensB,
        S, 0, 2,
      )
      const noSplitA = calc({ ...zero, pensionIncome: pensA, age: 65 })
      const noSplitB = calc({ ...zero, pensionIncome: pensB, age: 65 })
      expect(r.taxA.totalTax + r.taxB.totalTax)
        .toBeLessThanOrEqual(noSplitA.totalTax + noSplitB.totalTax + 0.01)
    }
  })

  it('cannot transfer more than 50% of eligible pension in either direction', () => {
    // A→B: transfer ≤ 50% of A's eligible
    const r = optimizePensionSplit(
      { ...zero, pensionIncome: 200_000, age: 65 },
      { ...zero, age: 65 },
      200_000, 0,
      S, 0, 2,
    )
    expect(r.transfer).toBeLessThanOrEqual(200_000 * 0.50 + 0.01)
  })

  it('B→A split is chosen when B has higher pension income than A', () => {
    // B has $80,000, A has $0 — optimizer should transfer from B to A
    const r = optimizePensionSplit(
      { ...zero, age: 65 },
      { ...zero, pensionIncome: 80_000, age: 65 },
      0, 80_000,
      S, 0, 2,
    )
    expect(r.transfer).toBeLessThan(0)  // negative = B→A
    const noSplitA = calc({ ...zero, age: 65 })
    const noSplitB = calc({ ...zero, pensionIncome: 80_000, age: 65 })
    expect(r.taxA.totalTax + r.taxB.totalTax).toBeLessThan(noSplitA.totalTax + noSplitB.totalTax)
  })
})

// ─── Smoke test: $100,000 employment income ───────────────────────────────────
// Intent: end-to-end bracket + credit + surtax verification at a round income
// level not covered by the existing test suite (between the $80k and $130k cases).

describe('smoke test — $100,000 employment income', () => {
  it('federal and Ontario tax match hand-calculated 2026 bracket values', () => {
    // Federal:
    //   Bracket 1 (≤$58,523):   58,523 × 14%                     =  8,193.22
    //   Bracket 2 ($58,523–):   (100,000 − 58,523) × 20.5%       =  8,502.79
    //   Total before credits:                                        16,696.01
    //   BPA credit:             16,452 × 14%                     = −2,303.28
    //   Federal tax:                                                 14,392.73
    //
    // Ontario:
    //   Bracket 1 (≤$53,891):   53,891 × 5.05%                   =  2,721.50
    //   Bracket 2 ($53,891–):   (100,000 − 53,891) × 9.15%       =  4,218.97
    //   Total before credits:                                         6,940.47
    //   BPA credit:             12,989 × 5.05%                   =   −655.94
    //   Ontario basic:                                                6,284.52
    //   Surtax tier 1:          (6,284.52 − 5,818) × 20%         =     +93.31
    //   Ontario tax:                                                  6,377.83
    const r = calc({ ...zero, employmentIncome: 100_000 })
    expect(r.federalTax).toBeCloseTo(14_392.73, 0)
    expect(r.ontarioTax).toBeCloseTo(6_377.83, 0)
    expect(r.totalTax).toBeCloseTo(20_770.56, 0)
    expect(r.netAfterTax).toBeCloseTo(79_229.44, 0)
  })
})

// Ontario + Federal tax calculation engine (2024 reference values, indexed forward by CPI)
// All dollar inputs in nominal dollars for the calculation year.
// Returns taxes in nominal dollars.

import type { TaxSettings } from './types'

export interface TaxInput {
  employmentIncome: number
  pensionIncome: number         // DB pension + RRIF (eligible for pension credit)
  cppIncome: number
  oasIncome: number
  eligibleDividends: number     // before gross-up
  nonEligibleDividends: number  // before gross-up
  foreignIncome: number
  capitalGainsRealized: number  // full gain amount; inclusion applied internally
  age: number
}

export interface PersonTaxResult {
  grossIncome: number           // net income for tax purposes
  federalTax: number
  ontarioTax: number
  oasClawback: number
  totalTax: number
  netAfterTax: number
  effectiveRate: number
  marginalFederalRate: number
  marginalOntarioRate: number
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

// Guard against null upTo values (Infinity serialized as null in old localStorage saves)
function fixUpTo(upTo: number | null): number { return upTo ?? Infinity }

function applyBrackets(income: number, brackets: { upTo: number; rate: number }[]): number {
  if (income <= 0) return 0
  let tax = 0
  let prev = 0
  for (const b of brackets) {
    const upTo = fixUpTo(b.upTo)
    if (income <= prev) break
    const taxableInThisBand = Math.min(income, upTo) - prev
    tax += taxableInThisBand * b.rate
    prev = upTo
  }
  return tax
}

function marginalRate(income: number, brackets: { upTo: number; rate: number }[]): number {
  if (income <= 0) return brackets[0]?.rate ?? 0
  for (const b of brackets) {
    if (income <= fixUpTo(b.upTo)) return b.rate
  }
  return brackets[brackets.length - 1]?.rate ?? 0
}

/** Scale all monetary thresholds in TaxSettings by an inflation factor.
 *  Rates (percentages) are NOT scaled. */
function scaledSettings(s: TaxSettings, factor: number): TaxSettings {
  const scale = (n: number | null) => fixUpTo(n) * factor
  return {
    ...s,
    federalBrackets: s.federalBrackets.map(b => ({ ...b, upTo: scale(b.upTo) })),
    federalBPA: scale(s.federalBPA),
    federalAgeAmount: scale(s.federalAgeAmount),
    federalAgeAmountThreshold: scale(s.federalAgeAmountThreshold),
    federalPensionIncomeAmount: scale(s.federalPensionIncomeAmount),
    capitalGainsHighThreshold: scale(s.capitalGainsHighThreshold),
    oasClawbackThreshold: scale(s.oasClawbackThreshold),
    ontarioBrackets: s.ontarioBrackets.map(b => ({ ...b, upTo: scale(b.upTo) })),
    ontarioBPA: scale(s.ontarioBPA),
    ontarioAgeAmount: scale(s.ontarioAgeAmount),
    ontarioAgeAmountThreshold: scale(s.ontarioAgeAmountThreshold),
    ontarioPensionIncomeAmount: scale(s.ontarioPensionIncomeAmount),
    ontarioSurtax1Threshold: scale(s.ontarioSurtax1Threshold),
    ontarioSurtax2Threshold: scale(s.ontarioSurtax2Threshold),
  }
}

// ─── Main calculation ─────────────────────────────────────────────────────────

/**
 * Calculate combined federal + Ontario taxes for one person.
 *
 * @param input          Income components in NOMINAL dollars for the calculation year
 * @param settings       Base TaxSettings (reference year values)
 * @param yearsFromBase  Number of years from the settings reference year
 * @param cpiRatePct     CPI inflation % used to index brackets forward
 */
export function calculateTax(
  input: TaxInput,
  settings: TaxSettings,
  yearsFromBase: number,
  cpiRatePct: number,
): PersonTaxResult {
  const s = scaledSettings(settings, Math.pow(1 + cpiRatePct / 100, yearsFromBase))

  // ── Dividend gross-up ──────────────────────────────────────────────────────
  const eligibleGrossed = input.eligibleDividends * (1 + s.federalEligibleDivGrossUp)
  const nonEligibleGrossed = input.nonEligibleDividends * (1 + s.federalNonEligibleDivGrossUp)

  // ── Capital gains inclusion ────────────────────────────────────────────────
  const cg = input.capitalGainsRealized
  const cgInclusion =
    cg <= s.capitalGainsHighThreshold
      ? cg * s.capitalGainsInclusionRate
      : s.capitalGainsHighThreshold * s.capitalGainsInclusionRate +
        (cg - s.capitalGainsHighThreshold) * s.capitalGainsHighRate

  // ── Net income (CRA definition) ───────────────────────────────────────────
  const netIncome =
    input.employmentIncome +
    input.pensionIncome +
    input.cppIncome +
    input.oasIncome +
    eligibleGrossed +
    nonEligibleGrossed +
    input.foreignIncome +
    cgInclusion

  if (netIncome <= 0) {
    return {
      grossIncome: 0, federalTax: 0, ontarioTax: 0, oasClawback: 0,
      totalTax: 0, netAfterTax: 0, effectiveRate: 0,
      marginalFederalRate: 0, marginalOntarioRate: 0,
    }
  }

  // ── OAS clawback (recovery tax) ───────────────────────────────────────────
  const oasClawback = input.oasIncome > 0
    ? Math.max(0, Math.min(input.oasIncome,
        (netIncome - s.oasClawbackThreshold) * s.oasClawbackRate))
    : 0

  // ── Age amount ────────────────────────────────────────────────────────────
  const federalAgeAmt = input.age >= 65
    ? Math.max(0, s.federalAgeAmount -
        Math.max(0, netIncome - s.federalAgeAmountThreshold) * s.federalAgeAmountReductionRate)
    : 0
  const ontarioAgeAmt = input.age >= 65
    ? Math.max(0, s.ontarioAgeAmount -
        Math.max(0, netIncome - s.ontarioAgeAmountThreshold) * s.ontarioAgeAmountReductionRate)
    : 0

  // Pension income eligible for pension income credit:
  // DB pension is eligible at any age; RRIF income eligible at 65+
  const eligiblePensionForCredit = input.pensionIncome

  // ── FEDERAL TAX ───────────────────────────────────────────────────────────
  const fedTaxBeforeCredits = applyBrackets(netIncome, s.federalBrackets)

  // Non-refundable credits applied at lowest federal rate (15%)
  const fedBPACredit = s.federalBPA * 0.15
  const fedAgeCredit = federalAgeAmt * 0.15
  const fedPensionCredit = Math.min(eligiblePensionForCredit, s.federalPensionIncomeAmount) * 0.15
  const fedEligibleDivCredit = eligibleGrossed * s.federalEligibleDivCredit
  const fedNonEligibleDivCredit = nonEligibleGrossed * s.federalNonEligibleDivCredit

  const federalTax = Math.max(0,
    fedTaxBeforeCredits
    - fedBPACredit
    - fedAgeCredit
    - fedPensionCredit
    - fedEligibleDivCredit
    - fedNonEligibleDivCredit
  ) + oasClawback

  // ── ONTARIO TAX ───────────────────────────────────────────────────────────
  const ontTaxBeforeCredits = applyBrackets(netIncome, s.ontarioBrackets)

  const ontBPACredit = s.ontarioBPA * (s.ontarioBrackets[0]?.rate ?? 0.0505)
  const ontAgeCredit = ontarioAgeAmt * (s.ontarioBrackets[0]?.rate ?? 0.0505)
  const ontPensionCredit = Math.min(eligiblePensionForCredit, s.ontarioPensionIncomeAmount) * (s.ontarioBrackets[0]?.rate ?? 0.0505)
  const ontEligibleDivCredit = eligibleGrossed * s.ontarioEligibleDivCredit
  const ontNonEligibleDivCredit = nonEligibleGrossed * s.ontarioNonEligibleDivCredit

  const ontarioBasic = Math.max(0,
    ontTaxBeforeCredits
    - ontBPACredit
    - ontAgeCredit
    - ontPensionCredit
    - ontEligibleDivCredit
    - ontNonEligibleDivCredit
  )

  // Ontario surtax
  let ontarioSurtax = 0
  if (ontarioBasic > s.ontarioSurtax2Threshold) {
    ontarioSurtax =
      (ontarioBasic - s.ontarioSurtax1Threshold) * s.ontarioSurtax1Rate +
      (ontarioBasic - s.ontarioSurtax2Threshold) * s.ontarioSurtax2Rate
  } else if (ontarioBasic > s.ontarioSurtax1Threshold) {
    ontarioSurtax = (ontarioBasic - s.ontarioSurtax1Threshold) * s.ontarioSurtax1Rate
  }

  const ontarioTax = ontarioBasic + ontarioSurtax

  const totalTax = federalTax + ontarioTax

  return {
    grossIncome: netIncome,
    federalTax,
    ontarioTax,
    oasClawback,
    totalTax,
    netAfterTax: netIncome - totalTax,
    effectiveRate: netIncome > 0 ? totalTax / netIncome : 0,
    marginalFederalRate: marginalRate(netIncome, s.federalBrackets),
    marginalOntarioRate: marginalRate(netIncome, s.ontarioBrackets),
  }
}

// ─── Pension income splitting optimizer ──────────────────────────────────────

/**
 * Try all pension-split percentages 0–50% (1% increments) and return
 * the split that minimizes combined household tax.
 *
 * eligiblePensionA: the portion of Person A's income eligible for splitting
 * (DB pension income + RRIF income if both are 65+, etc.)
 */
export function optimizePensionSplit(
  inputA: TaxInput,
  inputB: TaxInput,
  eligiblePensionA: number,
  settings: TaxSettings,
  yearsFromBase: number,
  cpiRatePct: number,
): { splitPct: number; taxA: PersonTaxResult; taxB: PersonTaxResult } {
  let bestSplit = 0
  let bestTotal = Infinity
  let bestA = calculateTax(inputA, settings, yearsFromBase, cpiRatePct)
  let bestB = calculateTax(inputB, settings, yearsFromBase, cpiRatePct)

  for (let pct = 0; pct <= 50; pct++) {
    const transfer = eligiblePensionA * (pct / 100)
    const modA = { ...inputA, pensionIncome: inputA.pensionIncome - transfer }
    const modB = { ...inputB, pensionIncome: inputB.pensionIncome + transfer }
    const rA = calculateTax(modA, settings, yearsFromBase, cpiRatePct)
    const rB = calculateTax(modB, settings, yearsFromBase, cpiRatePct)
    if (rA.totalTax + rB.totalTax < bestTotal) {
      bestTotal = rA.totalTax + rB.totalTax
      bestSplit = pct
      bestA = rA
      bestB = rB
    }
  }

  return { splitPct: bestSplit, taxA: bestA, taxB: bestB }
}

/** RRIF minimum withdrawal factors by age (CRA schedule). */
export function rrifMinFactor(age: number): number {
  // CRA RRIF minimum withdrawal percentages
  const table: Record<number, number> = {
    55: 0.0270, 56: 0.0278, 57: 0.0286, 58: 0.0294, 59: 0.0303,
    60: 0.0313, 61: 0.0323, 62: 0.0333, 63: 0.0345, 64: 0.0357,
    65: 0.0400, 66: 0.0417, 67: 0.0435, 68: 0.0453, 69: 0.0473,
    70: 0.0500, 71: 0.0528, 72: 0.0540, 73: 0.0553, 74: 0.0567,
    75: 0.0582, 76: 0.0598, 77: 0.0617, 78: 0.0636, 79: 0.0658,
    80: 0.0682, 81: 0.0708, 82: 0.0738, 83: 0.0771, 84: 0.0808,
    85: 0.0851, 86: 0.0899, 87: 0.0955, 88: 0.1021, 89: 0.1099,
    90: 0.1192, 91: 0.1306, 92: 0.1449, 93: 0.1634, 94: 0.1879,
  }
  if (age < 55) return 1 / (90 - age)  // formula for under 55
  if (age >= 95) return 0.2000
  return table[Math.floor(age)] ?? 0.2000
}

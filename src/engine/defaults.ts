// Default values for the full AppState — all monetary values in today's dollars.
// Tax brackets use 2024 reference values and are indexed forward by CPI in the engine.

import type { AppState, TaxSettings, WhatIfs } from './types'
import { todayStr, dateAtAge } from './dates'
import { DEFAULT_MARKET_PROFILE } from './rateProfiles'

const today = todayStr()

// ─── CPP maximum monthly benefit (2024, today's dollars) ────────────────────
// Base CPP max at age 65 with full contributions (39 effective years at YMPE).
// CPP2 max assumes 39 years of contributions at/above YAMPE; note CPP2 only
// started January 2024, so this overstates CPP2 for near-term retirees.
export const CPP_BASE_MAX_MONTHLY = 1364    // $1,364.60 — base CPP, 2024
export const CPP2_MAX_MONTHLY     = 130     // ~$130/month — CPP2 fully phased in
export const CPP_COMBINED_MAX_MONTHLY = CPP_BASE_MAX_MONTHLY + CPP2_MAX_MONTHLY  // $1,494

export const OAS_MAX_MONTHLY = 713          // ~$713/month — full OAS at 65, 2024
export const GIS_MAX_MONTHLY = 641          // ~$641/month — max GIS for coupled recipient, 2024

export const DEFAULT_TAX_SETTINGS: TaxSettings = {
  taxYear: 2024,

  // Federal 2024
  federalBrackets: [
    { upTo: 55_867,  rate: 0.1500 },
    { upTo: 111_733, rate: 0.2050 },
    { upTo: 154_906, rate: 0.2600 },
    { upTo: 220_000, rate: 0.2900 },
    { upTo: Infinity, rate: 0.3300 },
  ],
  federalBPA: 15_705,
  federalAgeAmount: 8_790,
  federalAgeAmountThreshold: 42_335,
  federalAgeAmountReductionRate: 0.15,
  federalPensionIncomeAmount: 2_000,
  federalEligibleDivGrossUp: 0.38,
  federalEligibleDivCredit: 0.1502,
  federalNonEligibleDivGrossUp: 0.15,
  federalNonEligibleDivCredit: 0.090301,
  capitalGainsInclusionRate: 0.5,
  capitalGainsHighRate: 0.5,
  capitalGainsHighThreshold: 10_000_000,
  oasClawbackThreshold: 90_997,
  oasClawbackRate: 0.15,

  // Ontario 2024
  ontarioBrackets: [
    { upTo: 51_446,  rate: 0.0505 },
    { upTo: 102_894, rate: 0.0915 },
    { upTo: 150_000, rate: 0.1116 },
    { upTo: 220_000, rate: 0.1216 },
    { upTo: Infinity, rate: 0.1316 },
  ],
  ontarioBPA: 11_865,
  ontarioAgeAmount: 5_750,
  ontarioAgeAmountThreshold: 42_335,
  ontarioAgeAmountReductionRate: 0.15,
  ontarioPensionIncomeAmount: 1_637,
  ontarioEligibleDivCredit: 0.10,
  ontarioNonEligibleDivCredit: 0.0329,
  ontarioSurtax1Threshold: 5_315,
  ontarioSurtax1Rate: 0.20,
  ontarioSurtax2Threshold: 6_802,
  ontarioSurtax2Rate: 0.36,
}

// Helper: a person born ~52 years ago with a retirement date ~3 years from now
const birthA = `${new Date().getFullYear() - 52}-06-15`
const birthB = `${new Date().getFullYear() - 50}-03-22`
const retireA = dateAtAge(birthA, 55)
const retireB = dateAtAge(birthB, 53)

export const DEFAULT_WHATIFS: WhatIfs = {
  returnRateOffset:  { enabled: false, value: 0 },
  inflationRate:     { enabled: false, value: 3.0 },
  cpiRate:           { enabled: false, value: 2.0 },
  longevityA:        { enabled: false, value: 92 },
  longevityB:        { enabled: false, value: 95 },
  cppStartAgeA:      { enabled: false, value: 65 },
  cppStartAgeB:      { enabled: false, value: 65 },
  oasStartAgeA:      { enabled: false, value: 65 },
  oasStartAgeB:      { enabled: false, value: 65 },
  withdrawalOrder:   { enabled: false, value: 'optimized' },
  pensionSplit:      { enabled: false, value: { mode: 'auto', pct: 0 } },
  drawdownStrategy:  {
    enabled: false,
    value: {
      strategyType: 'none',
      fixedPct:        { rrspPct: 4, rrspMin: 0, tfsaPct: 4, tfsaMin: 0, nonRegPct: 4, nonRegMin: 0 },
      fixedWithdrawal: { rrspAmountA: 0, rrspAmountB: 0, tfsaAmountA: 0, tfsaAmountB: 0, nonRegAmountA: 0, nonRegAmountB: 0, hisaAmount: 0 },
    },
  },
  marketProfile: { enabled: false, value: DEFAULT_MARKET_PROFILE },
  retirementA: {
    enabled: false,
    value: { retirementAge: 55, cascadePension: true, cascadeRrsp: true, cascadeTfsa: true, cascadeNonReg: true },
  },
  retirementB: {
    enabled: false,
    value: { retirementAge: 53, cascadePension: true, cascadeRrsp: true, cascadeTfsa: true, cascadeNonReg: true },
  },
  layoffA: { enabled: false, value: { date: today, severance: 0 } },
  layoffB: { enabled: false, value: { date: today, severance: 0 } },
  unexpectedExpense: { enabled: false, value: { date: today, amount: 0 } },
}

export const DEFAULT_STATE: AppState = {
  personA: {
    name: '',
    color: '#3b82f6',
    birthDate: birthA,
    gender: 'male',
    retirementDate: retireA,
    planningEndAge: 92,
  },
  personB: {
    name: '',
    color: '#a855f7',
    birthDate: birthB,
    gender: 'female',
    retirementDate: retireB,
    planningEndAge: 95,
  },

  ageReferencePerson: 'personA',

  personalInflationRatePct: 3.0,
  cpiRatePct: 2.0,
  returnRates: {
    upTo55:     7.0,
    from55to65: 6.0,
    from65to70: 5.0,
    from70plus: 4.0,
  },

  dbPensionA: {
    enabled: false,
    planName: '',
    startDate: retireA,
    annualAmount: 0,
    cpiIndexed: false,
    indexingRatePct: 0,
    cpiIndexingCapEnabled: false,
    cpiIndexingCap: 0,
    bridgeBenefitAmount: 0,
    bridgeBenefitEndDate: dateAtAge(birthA, 65),
    survivorBenefitPct: 0.6,
    cppIntegration: false,
    cppIntegrationAmount: 0,
    normalRetirementAge: 65,
    earlyReductionPctPerYear: 0,
  },
  dbPensionB: {
    enabled: false,
    planName: '',
    startDate: retireB,
    annualAmount: 0,
    cpiIndexed: false,
    indexingRatePct: 0,
    cpiIndexingCapEnabled: false,
    cpiIndexingCap: 0,
    bridgeBenefitAmount: 0,
    bridgeBenefitEndDate: dateAtAge(birthB, 65),
    survivorBenefitPct: 0.6,
    cppIntegration: false,
    cppIntegrationAmount: 0,
    normalRetirementAge: 65,
    earlyReductionPctPerYear: 0,
  },

  cppA: {
    estimatedMonthlyAt65: 0,
    startDate: dateAtAge(birthA, 65),
    inputMode: 'direct',
    maxMonthlyBenefit: CPP_COMBINED_MAX_MONTHLY,
    pctOfMax: 0,
    yearsAtMax: 0,
  },
  cppB: {
    estimatedMonthlyAt65: 0,
    startDate: dateAtAge(birthB, 65),
    inputMode: 'direct',
    maxMonthlyBenefit: CPP_COMBINED_MAX_MONTHLY,
    pctOfMax: 0,
    yearsAtMax: 0,
  },
  oasA: {
    estimatedMonthlyAt65: OAS_MAX_MONTHLY,
    startDate: dateAtAge(birthA, 65),
    inputMode: 'direct',
    maxMonthlyBenefit: OAS_MAX_MONTHLY,
    yearsOfResidency: 40,
    gisEligible: false,
    gisMonthlyAmount: GIS_MAX_MONTHLY,
  },
  oasB: {
    estimatedMonthlyAt65: OAS_MAX_MONTHLY,
    startDate: dateAtAge(birthB, 65),
    inputMode: 'direct',
    maxMonthlyBenefit: OAS_MAX_MONTHLY,
    yearsOfResidency: 40,
    gisEligible: false,
    gisMonthlyAmount: GIS_MAX_MONTHLY,
  },

  employmentA: { annualAmount: 0, growthRatePct: 0 },
  employmentB: { annualAmount: 0, growthRatePct: 0 },

  rrspA: {
    balance: 0,
    annualContribution: 0,
    contributionEndDate: retireA,
    contributionTiming: 'lump',
    spousalBalance: 0,
    spousalAnnualContribution: 0,
    spousalContributionTiming: 'lump',
    spousalLastContributionDate: retireA,
    rrifConversionDate: dateAtAge(birthA, 71),
    useSpouseAgeForMinimums: false,
    additionalWithdrawalAboveMinimum: 0,
    returnRateOverrideEnabled: false,
    returnRateOverridePct: 0,
  },
  rrspB: {
    balance: 0,
    annualContribution: 0,
    contributionEndDate: retireB,
    contributionTiming: 'lump',
    spousalBalance: 0,
    spousalAnnualContribution: 0,
    spousalContributionTiming: 'lump',
    spousalLastContributionDate: retireB,
    rrifConversionDate: dateAtAge(birthB, 71),
    useSpouseAgeForMinimums: false,
    additionalWithdrawalAboveMinimum: 0,
    returnRateOverrideEnabled: false,
    returnRateOverridePct: 0,
  },

  tfsaA: { balance: 0, annualContribution: 0, contributionEndDate: dateAtAge(birthA, 92), contributionTiming: 'lump', returnRateOverrideEnabled: false, returnRateOverridePct: 0 },
  tfsaB: { balance: 0, annualContribution: 0, contributionEndDate: dateAtAge(birthB, 95), contributionTiming: 'lump', returnRateOverrideEnabled: false, returnRateOverridePct: 0 },

  nonRegA: {
    balance: 0, acb: 0, annualContribution: 0,
    contributionEndDate: retireA, contributionTiming: 'lump',
    returnRateOverrideEnabled: false, returnRateOverridePct: 0,
    eligibleDivYieldPct: 0, foreignIncomeYieldPct: 0, interestYieldPct: 0,
  },
  nonRegB: {
    balance: 0, acb: 0, annualContribution: 0,
    contributionEndDate: retireB, contributionTiming: 'lump',
    returnRateOverrideEnabled: false, returnRateOverridePct: 0,
    eligibleDivYieldPct: 0, foreignIncomeYieldPct: 0, interestYieldPct: 0,
  },

  cash: {
    hisaBalance: 0,
    hisaRatePct: 4.5,
    hisaMinBalance: 0,
  },

  otherIncome: {
    otherItems: [],
  },

  spendingPhases: [
    { id: 'phase-0', label: 'Pre-Retirement',                 startAge: 50, annualAmount: 0, growthRatePct: 3.0, linkedToFirstDeath: false },
    { id: 'phase-1', label: 'Go-Go Years (both retired)',     startAge: 55, annualAmount: 0, growthRatePct: 3.0, linkedToFirstDeath: false },
    { id: 'phase-2', label: 'Slow-Go Years',                  startAge: 70, annualAmount: 0, growthRatePct: 2.5, linkedToFirstDeath: false },
    { id: 'phase-3', label: 'No-Go Years',                    startAge: 80, annualAmount: 0, growthRatePct: 2.0, linkedToFirstDeath: false },
    { id: 'phase-4', label: 'Survivor',                       startAge: 85, annualAmount: 0, growthRatePct: 2.0, linkedToFirstDeath: true  },
  ],
  additionalSpending: [],

  taxSettings: DEFAULT_TAX_SETTINGS,

  withdrawalStrategy: {
    withdrawalOrder:  'optimized',
    pensionSplitMode: 'auto',
    pensionSplitPct:  0,
    drawdownStrategy:        'none',
    drawdownFixedPct:        { rrspPct: 4, rrspMin: 0, tfsaPct: 4, tfsaMin: 0, nonRegPct: 4, nonRegMin: 0 },
    drawdownFixedWithdrawal: { rrspAmountA: 0, rrspAmountB: 0, tfsaAmountA: 0, tfsaAmountB: 0, nonRegAmountA: 0, nonRegAmountB: 0, hisaAmount: 0 },
  },

  scenarios: [],
}

// ─── People ─────────────────────────────────────────────────────────────────

export interface Person {
  name: string
  color: string            // hex color for card theming, e.g. '#3b82f6'
  birthDate: string        // ISO YYYY-MM-DD
  gender: 'male' | 'female' | 'other'
  retirementDate: string   // ISO YYYY-MM-DD
  planningEndAge: number   // e.g. 90 or 95
}

// ─── Return Rates (keyed by Person A's age) ──────────────────────────────────

export interface ReturnRates {
  upTo55: number       // nominal annual %, e.g. 7
  from55to65: number
  from65to70: number
  from70plus: number
}

// ─── DB Pension ───────────────────────────────────────────────────────────────

export interface DBPension {
  enabled: boolean
  planName: string
  startDate: string             // first payment date
  annualAmount: number          // today's dollars, at start date, BEFORE bridge
  cpiIndexed: boolean
  indexingRatePct: number       // explicit annual indexing rate (% per year); auto-set to CPI when cpiIndexed toggled on
  cpiIndexingCapEnabled: boolean // whether to apply the indexing cap
  cpiIndexingCap: number        // max indexing rate per year when cap is enabled
  bridgeBenefitAmount: number   // additional annual amount until bridge end
  bridgeBenefitEndDate: string  // typically when CPP starts
  survivorBenefitPct: number    // 0–1, fraction of pension paid to survivor
  cppIntegration: boolean       // pension reduces at 65 by CPP integration amount
  cppIntegrationAmount: number  // annual reduction amount
  normalRetirementAge: number   // plan's normal retirement age
  earlyReductionPctPerYear: number // % reduction per year before normal retirement age
}

// ─── CPP ─────────────────────────────────────────────────────────────────────

export interface CPPSettings {
  estimatedMonthlyAt65: number                          // today's dollars — canonical value used by engine
  startDate: string                                     // first payment date (must be 60–70)
  inputMode: 'direct' | 'pctOfMax' | 'yearsAtMax'      // how the estimate was derived
  maxMonthlyBenefit: number                             // combined CPP+CPP2 max used for pctOfMax/yearsAtMax
  pctOfMax: number                                      // 0–100, used in pctOfMax mode
  yearsAtMax: number                                    // years at/above YAMPE, used in yearsAtMax mode
}

// ─── OAS ─────────────────────────────────────────────────────────────────────

export interface OASSettings {
  estimatedMonthlyAt65: number                      // today's dollars — canonical value used by engine
  startDate: string                                 // first payment date (must be 65–70)
  inputMode: 'direct' | 'yearsOfResidency'          // how the estimate was derived
  maxMonthlyBenefit: number                         // editable OAS max (default: 2024 max)
  yearsOfResidency: number                          // Canadian residency years after age 18
  gisEligible: boolean                              // include GIS supplement
  gisMonthlyAmount: number                          // GIS monthly amount (today's $, not means-tested)
}

// ─── Employment Income ────────────────────────────────────────────────────────

export interface EmploymentIncome {
  annualAmount: number     // current income, today's dollars
  growthRatePct: number    // annual % increase until retirement
}

// ─── RRSP / RRIF ─────────────────────────────────────────────────────────────

export interface RRSPAccount {
  balance: number
  annualContribution: number
  contributionEndDate: string           // date of last contribution (often = retirement date)
  contributionTiming: 'lump' | 'spread' // lump = full year applied Jan 1; spread = pro-rated to end date
  spousalBalance: number
  spousalAnnualContribution: number
  spousalContributionTiming: 'lump' | 'spread'
  spousalLastContributionDate: string   // for 3-year attribution rule
  rrifConversionDate: string           // YYYY-MM-DD, max Dec 31 of year turning 71
  useSpouseAgeForMinimums: boolean     // use younger spouse's age to reduce RRIF minimums
  additionalWithdrawalAboveMinimum: number  // annual $ above RRIF minimum
  returnRateOverrideEnabled: boolean
  returnRateOverridePct: number
}

// ─── TFSA ─────────────────────────────────────────────────────────────────────

export interface TFSAAccount {
  balance: number
  annualContribution: number
  contributionEndDate: string           // date of last contribution (often = retirement date)
  contributionTiming: 'lump' | 'spread' // lump = full year applied Jan 1; spread = pro-rated to end date
  returnRateOverrideEnabled: boolean
  returnRateOverridePct: number
}

// ─── Non-Registered ───────────────────────────────────────────────────────────

export interface NonRegAccount {
  balance: number
  acb: number                              // adjusted cost base (book value)
  annualContribution: number
  contributionEndDate: string              // date of last contribution
  contributionTiming: 'lump' | 'spread'   // lump = full year applied Jan 1; spread = pro-rated to end date
  returnRateOverrideEnabled: boolean
  returnRateOverridePct: number

  // Annual yield rates as % of portfolio balance — taxable each year regardless of sales
  eligibleDivYieldPct: number              // Canadian eligible dividends (e.g. 2% for Canadian equity mix)
  foreignIncomeYieldPct: number            // US/intl distributions, taxed at marginal rate
  interestYieldPct: number                 // bonds, GICs, HISA interest

  // Capital gains arise on withdrawal via ACB ratio — no annual crystallization modelled
}

// ─── Cash & Savings ───────────────────────────────────────────────────────────

export interface CashAccounts {
  hisaBalance: number
  hisaRatePct: number       // nominal annual interest rate
  hisaMinBalance: number    // warning threshold — plan flags years HISA falls below this (today's $)
}

// ─── Other Income ─────────────────────────────────────────────────────────────

export interface OtherIncomeItem {
  id: string
  label: string
  annualAmount: number              // today's dollars
  startDate: string
  endDate: string
  taxable: boolean
  growthRatePct: number
  attributedTo: 'personA' | 'personB' | 'joint'
}

export interface OtherIncome {
  otherItems: OtherIncomeItem[]
}

// ─── Spending ─────────────────────────────────────────────────────────────────

export interface SpendingPhase {
  id: string
  label: string                // e.g. "Early Retirement", "Slow-Go Years"
  startAge: number             // age reference person's age when this phase begins
  annualAmount: number         // household spending in today's dollars
  growthRatePct: number        // can differ from personal inflation
  linkedToFirstDeath?: boolean // when true, startAge is auto-set to ref person's age at first death
}

export interface AdditionalSpending {
  id: string
  label: string
  amount: number               // today's dollars
  startAge: number             // reference person's age — converts to their birthday
  recurring: boolean           // true = every year from startAge; false = one-time in that year
}

// ─── Tax Settings (Ontario + Federal, 2024 values, editable) ─────────────────

export interface TaxBracket {
  upTo: number    // upper threshold; last bracket: Infinity
  rate: number    // marginal rate, e.g. 0.15
}

export interface TaxSettings {
  taxYear: number  // reference year for bracket values (indexed forward with CPI)

  // Federal
  federalBrackets: TaxBracket[]
  federalBPA: number                       // basic personal amount
  federalAgeAmount: number                 // credit at 65+
  federalAgeAmountThreshold: number        // income where age amount begins to reduce
  federalAgeAmountReductionRate: number    // e.g. 0.15
  federalPensionIncomeAmount: number       // max pension income credit base ($2,000)
  federalEligibleDivGrossUp: number        // e.g. 0.38
  federalEligibleDivCredit: number         // % of grossed-up, e.g. 0.1502
  federalNonEligibleDivGrossUp: number     // e.g. 0.15
  federalNonEligibleDivCredit: number      // % of grossed-up, e.g. 0.090301
  capitalGainsInclusionRate: number        // e.g. 0.5
  capitalGainsHighRate: number             // e.g. 0.6667 above threshold
  capitalGainsHighThreshold: number        // e.g. 250000
  oasClawbackThreshold: number             // 2024: ~$90,997
  oasClawbackRate: number                  // 0.15

  // Ontario
  ontarioBrackets: TaxBracket[]
  ontarioBPA: number
  ontarioAgeAmount: number
  ontarioAgeAmountThreshold: number
  ontarioAgeAmountReductionRate: number
  ontarioPensionIncomeAmount: number       // max pension income credit base
  ontarioEligibleDivCredit: number         // % of grossed-up, e.g. 0.10
  ontarioNonEligibleDivCredit: number      // % of grossed-up, e.g. 0.0329
  ontarioSurtax1Threshold: number          // e.g. 5315
  ontarioSurtax1Rate: number               // e.g. 0.20
  ontarioSurtax2Threshold: number          // e.g. 6802
  ontarioSurtax2Rate: number               // e.g. 0.36
}

// ─── Withdrawal Strategy ─────────────────────────────────────────────────────

export type WithdrawalOrder = 'tfsa_first' | 'rrsp_first' | 'nonreg_first' | 'optimized'
export type PensionSplitMode = 'auto' | 'manual'

// ─── Drawdown Strategies ──────────────────────────────────────────────────────

export type DrawdownStrategyType = 'none' | 'spendGap' | 'fixedWithdrawal' | 'fixedPct'

// Fixed % of balance per year, with a floor amount
export interface DrawdownConfig {
  rrspPct:   number    // % of balance withdrawn per year
  rrspMin:   number    // minimum annual withdrawal (today's $)
  tfsaPct:   number
  tfsaMin:   number
  nonRegPct: number
  nonRegMin: number
}

// Fixed annual dollar withdrawal per account (today's $, inflated each year)
export interface FixedWithdrawalConfig {
  rrspAmount:    number
  tfsaAmount:    number
  nonRegAmount:  number
}

// Shape stored in the drawdownStrategy what-if value
export interface DrawdownStrategyConfig {
  strategyType:    DrawdownStrategyType
  fixedPct:        DrawdownConfig
  fixedWithdrawal: FixedWithdrawalConfig
}

export interface WithdrawalStrategy {
  withdrawalOrder:  WithdrawalOrder
  pensionSplitMode: PensionSplitMode
  pensionSplitPct:  number           // 0–50, person A to person B; used when mode=manual

  // Active drawdown strategy — 'none' means spend-gap-only (no proactive draws)
  drawdownStrategy:        DrawdownStrategyType
  drawdownFixedPct:        DrawdownConfig
  drawdownFixedWithdrawal: FixedWithdrawalConfig
}

// ─── Market Profile ───────────────────────────────────────────────────────────

export type MarketProfileType =
  | 'step'           // base plan tiers (default)
  | 'frontLoaded'    // starts at peak, falls linearly to low
  | 'backLoaded'     // starts at low, rises linearly to peak
  | 'cyclicalCrest'  // cosine wave — starts at peak
  | 'cyclicalTrough' // inverted cosine — starts at trough
  | 'noise'          // seeded uniform random between peak and low

export interface MarketProfileConfig {
  profileType:       MarketProfileType
  outlookOffset:     number   // ±% shift applied to all rates (e.g. +2 shifts curve up 2 pp)
  beta:              number   // amplitude multiplier: 1 = no change, 2 = double swing, 0.5 = half swing
  cyclePeriodYears:  number   // cycle length in years (cyclical profiles only)
  noiseSeed:         number   // PRNG seed (noise profile only; re-roll changes this)
}

// ─── Retirement What-if ───────────────────────────────────────────────────────

export interface RetirementWhatIfConfig {
  retirementAge:  number   // decimal age; snapped to nearest month when converting to date
  cascadePension: boolean  // shift dbPension startDate 1:1
  cascadeRrsp:    boolean  // shift RRSP contributionEndDate + spousalLastContributionDate by delta
  cascadeTfsa:    boolean  // shift TFSA contributionEndDate by delta
  cascadeNonReg:  boolean  // shift NonReg contributionEndDate by delta
}

// ─── What-if Overrides ────────────────────────────────────────────────────────

export interface WhatIf<T> {
  enabled: boolean
  value: T
}

export interface WhatIfs {
  returnRateOffset:  WhatIf<number>              // ±% added to all return rate tiers
  inflationRate:     WhatIf<number>              // personal inflation rate override
  cpiRate:           WhatIf<number>              // CPI rate override (indexes tax brackets, CPP/OAS, DB pension)
  longevityA:        WhatIf<number>              // planning end age override
  longevityB:        WhatIf<number>
  cppStartAgeA:      WhatIf<number>              // CPP start age (60–70)
  cppStartAgeB:      WhatIf<number>
  oasStartAgeA:      WhatIf<number>              // OAS start age (65–70)
  oasStartAgeB:      WhatIf<number>
  withdrawalOrder:   WhatIf<WithdrawalOrder>
  pensionSplit:      WhatIf<{ mode: PensionSplitMode; pct: number }>
  drawdownStrategy:  WhatIf<DrawdownStrategyConfig>
  marketProfile:     WhatIf<MarketProfileConfig>
  retirementA:       WhatIf<RetirementWhatIfConfig>
  retirementB:       WhatIf<RetirementWhatIfConfig>
  layoffA?:          WhatIf<{ date: string; severance: number }> // employment/RRSP stop + optional lump-sum severance
  layoffB?:          WhatIf<{ date: string; severance: number }>
  unexpectedExpense?: WhatIf<{ date: string; amount: number }>  // one-time household spending hit
}

// ─── Headline Metrics ─────────────────────────────────────────────────────────

export interface HeadlineMetrics {
  // Portfolio — today's $
  portfolioAtStart:    number
  peakPortfolio:       number
  peakPortfolioYear:   number
  portfolioAtRetirementA: number // total portfolio in personA's retirement year
  portfolioAtRetirementB: number // total portfolio in personB's retirement year
  portfolioAtDeathA:   number   // total portfolio in year personA reaches planningEndAge
  portfolioAtDeathB:   number   // total portfolio in final year (personB planning end)

  // Spending shortfall — today's $
  shortfallYears:      number   // years where cashFlow < 0
  totalYears:          number
  shortfallPct:        number   // 0–1
  avgAnnualShortfall:  number   // average over shortfall years only
  peakAnnualShortfall: number
  peakShortfallYear:   number

  // Tax — today's $, household
  lifetimeTaxPaid:     number
  avgEffectiveTaxRate: number   // 0–1
  peakTaxYear:         number
  peakTaxAmount:       number   // household tax in peak year

  // Government benefits — today's $
  totalCPPCollected:   number   // household
  totalOASCollected:   number   // household gross (before clawback)
  totalOASClawback:    number   // household total clawback repaid
  oasClawbackYears:    number
  oasClawbackPct:      number   // 0–1, clawback years / OAS-active years
  cppVs65:             number   // actual collected minus what collecting at 65 would have yielded; positive = timing benefited you
  oasVs65:             number   // same for OAS (gross vs gross; clawback shown separately)
}

// ─── Scenarios ────────────────────────────────────────────────────────────────

export interface Scenario {
  id: string
  name: string
  whatIfs: WhatIfs
  savedAt: string   // ISO date string
}

// ─── Full Application State ───────────────────────────────────────────────────

export interface AppState {
  personA: Person
  personB: Person

  /** Which person's age is used as the reference for age-tiered calculations
   *  (portfolio return rates, etc.) */
  ageReferencePerson: 'personA' | 'personB'

  personalInflationRatePct: number
  cpiRatePct: number
  returnRates: ReturnRates

  dbPensionA: DBPension
  dbPensionB: DBPension
  cppA: CPPSettings
  cppB: CPPSettings
  oasA: OASSettings
  oasB: OASSettings
  employmentA: EmploymentIncome
  employmentB: EmploymentIncome

  rrspA: RRSPAccount
  rrspB: RRSPAccount
  tfsaA: TFSAAccount
  tfsaB: TFSAAccount
  nonRegA: NonRegAccount
  nonRegB: NonRegAccount
  cash: CashAccounts

  otherIncome: OtherIncome
  spendingPhases: SpendingPhase[]
  additionalSpending: AdditionalSpending[]

  taxSettings: TaxSettings
  withdrawalStrategy: WithdrawalStrategy

  scenarios: Scenario[]
}

// ─── Projection Output ────────────────────────────────────────────────────────

export interface DataPoint {
  year: number
  date: string           // Jan 1 of that year
  personAAge: number     // exact decimal age
  personBAge: number

  // Gross income components (present-day dollars)
  employmentA: number
  employmentB: number
  dbPensionBase: number
  dbBridge: number
  dbPensionBaseB: number
  dbBridgeB: number
  cppA: number
  cppB: number
  oasA: number
  oasB: number
  rrifA: number
  rrifB: number
  tfsaWithdrawalA: number
  tfsaWithdrawalB: number
  nonRegWithdrawalA: number
  nonRegWithdrawalB: number
  nonRegYieldA: number
  nonRegYieldB: number
  otherIncomeA: number
  otherIncomeB: number

  // Tax summary (present-day dollars)
  grossIncomeA: number
  grossIncomeB: number
  taxA: number
  taxB: number
  oasClawbackA: number
  oasClawbackB: number
  netIncomeA: number
  netIncomeB: number
  totalHouseholdNet: number
  effectiveTaxRateA: number   // 0–1
  effectiveTaxRateB: number

  // Spending (present-day dollars)
  householdSpending:  number   // total: lifestyle + contributions + unexpected expense
  spendingLifestyle:  number   // spending phases + regular additional spending items only
  contributions:      number   // total RRSP + TFSA + non-reg contributions (both people)
  spendingUnexpected: number   // what-if unexpected expense only
  cashFlow: number             // totalHouseholdNet - householdSpending

  // Account balances end-of-year (present-day dollars)
  rrspA: number
  rrspB: number
  tfsaA: number
  tfsaB: number
  nonRegA: number
  nonRegB: number
  hisa: number
  totalPortfolio: number
  netWorth: number
}

export interface ProjectionResult {
  dataPoints: DataPoint[]
  warnings: string[]
}

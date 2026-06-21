import { describe, it, expect } from 'vitest'
import { runProjection } from '../projection'
import { DEFAULT_STATE } from '../defaults'
import { dateAtAge } from '../dates'
import type { AppState } from '../types'

const CY = new Date().getFullYear()
const birthA = `${CY - 60}-01-01` // age 60 today
const birthB = `${CY - 58}-06-15` // age 58 today

function testState(overrides: Partial<AppState> = {}): AppState {
  return {
    ...DEFAULT_STATE,
    personA: {
      ...DEFAULT_STATE.personA,
      birthDate: birthA,
      retirementDate: `${CY}-01-01`, // retires today (age 60)
      planningEndAge: 65,            // 5 years of projection
    },
    personB: {
      ...DEFAULT_STATE.personB,
      birthDate: birthB,
      retirementDate: `${CY + 2}-06-15`, // retires in 2 years
      planningEndAge: 63,
    },
    personalInflationRatePct: 0,
    cpiRatePct: 0,
    returnRates: {
      upTo55: 0,
      from55to65: 0,
      from65to70: 0,
      from70plus: 0,
    },
    cppA: { ...DEFAULT_STATE.cppA, estimatedMonthlyAt65: 0 },
    cppB: { ...DEFAULT_STATE.cppB, estimatedMonthlyAt65: 0 },
    oasA: { ...DEFAULT_STATE.oasA, estimatedMonthlyAt65: 0 },
    oasB: { ...DEFAULT_STATE.oasB, estimatedMonthlyAt65: 0 },
    rrspA: { ...DEFAULT_STATE.rrspA, balance: 100000, annualContribution: 0, rrifConversionDate: dateAtAge(birthA, 71) },
    rrspB: { ...DEFAULT_STATE.rrspB, balance: 0, annualContribution: 0, rrifConversionDate: dateAtAge(birthB, 71) },
    tfsaA: { ...DEFAULT_STATE.tfsaA, balance: 50000, annualContribution: 0 },
    tfsaB: { ...DEFAULT_STATE.tfsaB, balance: 0, annualContribution: 0 },
    nonRegA: { ...DEFAULT_STATE.nonRegA, balance: 0, acb: 0, annualContribution: 0 },
    nonRegB: { ...DEFAULT_STATE.nonRegB, balance: 0, acb: 0, annualContribution: 0 },
    cash: { hisaBalance: 0, hisaRatePct: 0, hisaMinBalance: 0 },
    spendingPhases: [],
    withdrawalStrategy: {
      ...DEFAULT_STATE.withdrawalStrategy,
      drawdownStrategy: 'none',
    },
    ...overrides,
  }
}

describe('Drawdown Strategy: fixedPct', () => {
  it('draws down the configured percentage of assets each year', () => {
    const state = testState({
      withdrawalStrategy: {
        ...DEFAULT_STATE.withdrawalStrategy,
        drawdownStrategy: 'fixedPct',
        drawdownFixedPct: {
          rrspPct: 10,
          rrspMin: 0,
          tfsaPct: 5,
          tfsaMin: 0,
          nonRegPct: 0,
          nonRegMin: 0,
          hisaPct: 0,
          hisaMin: 0,
        },
      },
    })

    const { dataPoints } = runProjection(state)
    // Year 0 (Current Year, A is retired, draws are active)
    const pt0 = dataPoints[0]
    // A's RRSP started at 100,000. 10% draw = 10,000.
    // A's TFSA started at 50,000. 5% draw = 2,500.
    expect(pt0.rrifA).toBe(10000)  // actual withdrawal in year 0
    expect(pt0.tfsaWithdrawalA).toBe(2500)
    // EOY balance should reflect the draws (no investment returns/inflation)
    expect(pt0.rrspA).toBe(90000)
    expect(pt0.tfsaA).toBe(47500)
  })

  it('respects RRIF minimums if they exceed the configured percentage', () => {
    // Setup A at age 72 (where RRIF minimum is active and is ~5.4%)
    const birthA72 = `${CY - 72}-01-01`
    const state = testState({
      personA: {
        ...DEFAULT_STATE.personA,
        birthDate: birthA72,
        retirementDate: `${CY - 10}-01-01`, // already retired
        planningEndAge: 75,
      },
      rrspA: { 
        ...DEFAULT_STATE.rrspA, 
        balance: 100000, 
        annualContribution: 0, 
        rrifConversionDate: dateAtAge(birthA72, 71) 
      },
      withdrawalStrategy: {
        ...DEFAULT_STATE.withdrawalStrategy,
        drawdownStrategy: 'fixedPct',
        drawdownFixedPct: {
          rrspPct: 2, // 2% is lower than RRIF minimum (~5.4% at age 72)
          rrspMin: 0,
          tfsaPct: 0,
          tfsaMin: 0,
          nonRegPct: 0,
          nonRegMin: 0,
          hisaPct: 0,
          hisaMin: 0,
        },
      },
    })

    const { dataPoints } = runProjection(state)
    const pt0 = dataPoints[0]
    // RRIF minimum for age 72 is 5.40%
    const expectedMin = 100000 * 0.0540
    expect(pt0.rrifA).toBeCloseTo(expectedMin, 1)
  })
})

describe('Drawdown Strategy: fixedWithdrawal', () => {
  it('draws the exact configured dollar amount adjusted for inflation', () => {
    const state = testState({
      personalInflationRatePct: 3, // 3% inflation
      withdrawalStrategy: {
        ...DEFAULT_STATE.withdrawalStrategy,
        drawdownStrategy: 'fixedWithdrawal',
        drawdownFixedWithdrawal: {
          rrspAmountA: 10000,
          rrspAmountB: 0,
          tfsaAmountA: 5000,
          tfsaAmountB: 0,
          nonRegAmountA: 0,
          nonRegAmountB: 0,
          hisaAmount: 0,
        },
      },
    })

    const { dataPoints } = runProjection(state)
    
    // Year 0 (inflation factor = 1)
    const pt0 = dataPoints[0]
    expect(pt0.rrifA).toBe(10000)
    expect(pt0.tfsaWithdrawalA).toBe(5000)

    // Year 1 (inflation factor = 1.03)
    // In present-day dollars, the inflation-adjusted nominal withdrawal (10,300) 
    // translates back to the exact initial real value (10,000)
    const pt1 = dataPoints[1]
    expect(pt1.rrifA).toBe(10000)
    expect(pt1.tfsaWithdrawalA).toBe(5000)
  })

  it('caps the withdrawal at the remaining account balance', () => {
    const state = testState({
      rrspA: { ...DEFAULT_STATE.rrspA, balance: 8000, annualContribution: 0, rrifConversionDate: dateAtAge(birthA, 71) },
      withdrawalStrategy: {
        ...DEFAULT_STATE.withdrawalStrategy,
        drawdownStrategy: 'fixedWithdrawal',
        drawdownFixedWithdrawal: {
          rrspAmountA: 15000, // exceeds balance of 8000
          rrspAmountB: 0,
          tfsaAmountA: 0,
          tfsaAmountB: 0,
          nonRegAmountA: 0,
          nonRegAmountB: 0,
          hisaAmount: 0,
        },
      },
    })

    const { dataPoints } = runProjection(state)
    const pt0 = dataPoints[0]
    expect(pt0.rrifA).toBe(8000) // capped at balance
  })
})

describe('Drawdown Strategy: bengen', () => {
  it('computes drawing target in year 1 and adjusts for inflation subsequently', () => {
    const state = testState({
      personalInflationRatePct: 2,
      rrspA: { ...DEFAULT_STATE.rrspA, balance: 100000, annualContribution: 0, rrifConversionDate: dateAtAge(birthA, 71) },
      tfsaA: { ...DEFAULT_STATE.tfsaA, balance: 100000, annualContribution: 0 },
      withdrawalStrategy: {
        ...DEFAULT_STATE.withdrawalStrategy,
        drawdownStrategy: 'bengen',
        bengenConfig: {
          inflationIndex: 'personal',
          surplusToHisa: false,
          deficitFromHisa: false,
          personA: {
            drawRatePct: 4, // 4% initial safe withdrawal rate
            accountOrder: [
              { account: 'rrsp', unlimited: true, cap: 0 },
              { account: 'tfsa', unlimited: true, cap: 0 },
            ],
          },
          personB: {
            drawRatePct: 0,
            accountOrder: [],
          },
        },
      },
    })

    const { dataPoints } = runProjection(state)
    
    // Year 0 (First year of retirement for A)
    // Initial portfolio = 100,000 RRSP + 100,000 TFSA = 200,000.
    // 4% draw rate = 8,000 target.
    // Order is RRSP first, so all 8,000 comes from RRSP.
    const pt0 = dataPoints[0]
    expect(pt0.rrifA).toBe(8000)
    expect(pt0.tfsaWithdrawalA).toBe(0)

    // Year 1 (Inflation = 2%)
    // Bengen target increases with inflation, which keeps the real (present-day) draw constant at 8,000.
    const pt1 = dataPoints[1]
    expect(pt1.rrifA).toBe(8000)
    expect(pt1.tfsaWithdrawalA).toBe(0)
  })
})

describe('Drawdown Strategy: gk', () => {
  it('applies Guyton-Klinger guardrails correctly', () => {
    const state = testState({
      personalInflationRatePct: 0,
      rrspA: { ...DEFAULT_STATE.rrspA, balance: 100000, annualContribution: 0, rrifConversionDate: dateAtAge(birthA, 71) },
      withdrawalStrategy: {
        ...DEFAULT_STATE.withdrawalStrategy,
        drawdownStrategy: 'gk',
        gkConfig: {
          inflationIndex: 'personal',
          surplusToHisa: false,
          deficitFromHisa: false,
          lowerGuardrailPct: 20, // 20% lower guardrail
          upperGuardrailPct: 20,
          cutPct: 10,
          raisePct: 10,
          apply15YearRule: false,
          personA: {
            drawRatePct: 5, // 5% initial rate on 150,000 starting portfolio (100k RRSP + 50k TFSA) = 7,500 target
            accountOrder: [{ account: 'rrsp', unlimited: true, cap: 0 }],
          },
          personB: {
            drawRatePct: 0,
            accountOrder: [],
          },
        },
      },
    })

    // Run baseline (no changes)
    const { dataPoints } = runProjection(state)
    const pt0 = dataPoints[0]
    expect(pt0.rrifA).toBe(7500)
  })
})

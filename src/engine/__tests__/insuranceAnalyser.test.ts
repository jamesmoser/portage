import { describe, it, expect } from 'vitest'
import { runInsuranceAnalysis, findRequiredInsurance } from '../insuranceAnalyser'
import { runProjection } from '../projection'
import { DEFAULT_STATE } from '../defaults'
import { dateAtAge, getYear } from '../dates'
import type { AppState } from '../types'
import { mergeWhatIfs } from '../whatifs'
import { generateRateSchedule } from '../rateProfiles'

const CY = new Date().getFullYear()
const birthA = `${CY - 60}-01-01` // age 60 today
const birthB = `${CY - 60}-06-15` // age 60 today

function baseState(overrides: Partial<AppState> = {}): AppState {
  return {
    ...DEFAULT_STATE,
    personA: {
      ...DEFAULT_STATE.personA,
      birthDate: birthA,
      retirementDate: `${CY}-01-01`, // retires today
      planningEndAge: 90,
    },
    personB: {
      ...DEFAULT_STATE.personB,
      birthDate: birthB,
      retirementDate: `${CY}-06-15`, // retires today
      planningEndAge: 90,
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
    cash: { hisaBalance: 0, hisaRatePct: 2.0, hisaMinBalance: 0 },
    spendingPhases: [],
    additionalSpending: [],
    withdrawalStrategy: {
      ...DEFAULT_STATE.withdrawalStrategy,
      drawdownStrategy: 'none',
    },
    ...overrides,
  }
}

describe('insuranceAnalyser', () => {
  it('returns 0 insurance if there is no spending configured in the plan', () => {
    const state = baseState({
      spendingPhases: [],
    })
    // Simulate Person A dying age 70, Person B dying age 80
    const res = findRequiredInsurance(state, undefined, 70, 80, 'hisa')
    expect(res.nominal).toBe(0)
    expect(res.pd).toBe(0)
    expect(res.beneficiary).toBe('personB')
  })

  it('calculates positive required insurance when there is spending but no income/assets', () => {
    const state = baseState({
      spendingPhases: [
        {
          id: 'p1',
          label: 'Retirement Lifestyle',
          startAge: 60,
          annualAmount: 20000,
          growthRatePct: 0,
        },
      ],
    })
    // A dies at age 70 (in 10 years), B dies at age 80 (in 20 years).
    // B survives A for 10 years, needing to fund $20,000/year spending with 0 assets.
    // So life insurance on A must pay out a positive lump sum at A's death (year of A's death).
    const res = findRequiredInsurance(state, undefined, 70, 80, 'hisa')
    expect(res.nominal).toBeGreaterThan(0)
    expect(res.pd).toBeGreaterThan(0)
    expect(res.payoutYear).toBe(CY + 10)
    expect(res.beneficiary).toBe('personB')
  })

  it('runs runInsuranceAnalysis and returns valid 1D and 2D sweeps', () => {
    const state = baseState({
      spendingPhases: [
        {
          id: 'p1',
          label: 'Retirement Lifestyle',
          startAge: 60,
          annualAmount: 10000,
          growthRatePct: 0,
        },
      ],
      personA: {
        ...DEFAULT_STATE.personA,
        birthDate: birthA,
        retirementDate: `${CY}-01-01`,
        planningEndAge: 64, // Keep plan years short for speed
      },
      personB: {
        ...DEFAULT_STATE.personB,
        birthDate: birthB,
        retirementDate: `${CY}-06-15`,
        planningEndAge: 64, // Keep plan years short for speed
      },
    })

    const analysis = runInsuranceAnalysis(state, undefined, {
      depositAccount: 'hisa',
      sweepStart: 'current',
      stepSize: 2,
    })

    expect(analysis.sweep1D_A.length).toBeGreaterThan(0)
    expect(analysis.sweep1D_B.length).toBeGreaterThan(0)
    expect(analysis.sweep2D.length).toBeGreaterThan(0)
    expect(analysis.maxNeededA).toBeGreaterThanOrEqual(0)
    expect(analysis.maxNeededB).toBeGreaterThanOrEqual(0)
    expect(analysis.maxNeededNomA).toBeGreaterThanOrEqual(0)
    expect(analysis.maxNeededNomB).toBeGreaterThanOrEqual(0)
  })
})

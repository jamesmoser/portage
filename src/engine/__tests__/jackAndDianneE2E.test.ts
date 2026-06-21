import { describe, it, expect } from 'vitest'
import { runProjection } from '../projection'
import { runInsuranceAnalysis } from '../insuranceAnalyser'
import { getYear } from '../dates'
import type { AppState } from '../types'
import jackAndDianneJson from '../../../examples/jack_and_dianne.json'

const CY = new Date().getFullYear()

function getJdState(overrides: Partial<AppState> = {}): AppState {
  const base = jackAndDianneJson as unknown as AppState
  const offset = CY - 2026

  const adjustDate = (dateStr: string) => {
    if (!dateStr) return dateStr
    const parts = dateStr.split('-')
    if (parts.length !== 3) return dateStr
    const year = parseInt(parts[0], 10)
    return `${year + offset}-${parts[1]}-${parts[2]}`
  }

  return {
    ...base,
    personA: {
      ...base.personA,
      birthDate: adjustDate(base.personA.birthDate),
      retirementDate: adjustDate(base.personA.retirementDate),
    },
    personB: {
      ...base.personB,
      birthDate: adjustDate(base.personB.birthDate),
      retirementDate: adjustDate(base.personB.retirementDate),
    },
    dbPensionA: {
      ...base.dbPensionA,
      startDate: adjustDate(base.dbPensionA.startDate),
      bridgeBenefitEndDate: adjustDate(base.dbPensionA.bridgeBenefitEndDate),
    },
    dbPensionB: {
      ...base.dbPensionB,
      startDate: adjustDate(base.dbPensionB.startDate),
      bridgeBenefitEndDate: adjustDate(base.dbPensionB.bridgeBenefitEndDate),
    },
    cppA: {
      ...base.cppA,
      startDate: adjustDate(base.cppA.startDate),
    },
    cppB: {
      ...base.cppB,
      startDate: adjustDate(base.cppB.startDate),
    },
    oasA: {
      ...base.oasA,
      startDate: adjustDate(base.oasA.startDate),
    },
    oasB: {
      ...base.oasB,
      startDate: adjustDate(base.oasB.startDate),
    },
    rrspA: {
      ...base.rrspA,
      contributionEndDate: adjustDate(base.rrspA.contributionEndDate),
      spousalLastContributionDate: adjustDate(base.rrspA.spousalLastContributionDate),
      rrifConversionDate: adjustDate(base.rrspA.rrifConversionDate),
    },
    rrspB: {
      ...base.rrspB,
      contributionEndDate: adjustDate(base.rrspB.contributionEndDate),
      spousalLastContributionDate: adjustDate(base.rrspB.spousalLastContributionDate),
      rrifConversionDate: adjustDate(base.rrspB.rrifConversionDate),
    },
    tfsaA: {
      ...base.tfsaA,
      contributionEndDate: adjustDate(base.tfsaA.contributionEndDate),
    },
    tfsaB: {
      ...base.tfsaB,
      contributionEndDate: adjustDate(base.tfsaB.contributionEndDate),
    },
    nonRegA: {
      ...base.nonRegA,
      contributionEndDate: adjustDate(base.nonRegA.contributionEndDate),
    },
    nonRegB: {
      ...base.nonRegB,
      contributionEndDate: adjustDate(base.nonRegB.contributionEndDate),
    },
    ...overrides,
  }
}

describe('Jack & Dianne E2E baseline projection', () => {
  it('projects 56 years of retirement timeline', () => {
    const state = getJdState()
    const { dataPoints } = runProjection(state)

    // Jack is 42 to 85 (planning end)
    // Dianne is 40 to 95 (planning end)
    // The projection runs up to max(endYearA, endYearB), which is Dianne turning 95.
    // 95 - 40 = 55 years of projection (56 data points inclusive of year 0)
    expect(dataPoints).toHaveLength(56)
  })

  it('correctly models accumulation phase in Year 0', () => {
    const state = getJdState()
    const { dataPoints } = runProjection(state)
    const pt0 = dataPoints[0]

    expect(pt0.year).toBe(CY)
    expect(pt0.employmentA).toBeCloseTo(150000, 0)
    expect(pt0.employmentB).toBeCloseTo(90000, 0)
    expect(pt0.contribRrspA).toBeCloseTo(20000, 0)
    expect(pt0.contribRrspB).toBeCloseTo(9200, 0)
    expect(pt0.contribTfsaA).toBeCloseTo(7000, 0)
    expect(pt0.contribTfsaB).toBeCloseTo(7000, 0)
  })

  it('correctly transitions when Dianne retires but Jack is still working (Year 16)', () => {
    const state = getJdState()
    const { dataPoints } = runProjection(state)
    const pt16 = dataPoints[16] // CY + 16 (Jack age 58, Dianne age 56)

    expect(pt16.year).toBe(CY + 16)
    // Dianne is retired
    expect(pt16.employmentB).toBe(0)
    expect(pt16.contribRrspB).toBe(0)
    expect(pt16.contribTfsaB).toBe(0)

    // Jack is still working and contributing
    // Values in the projection data points are in present-day dollars.
    // Since inflation is 3%, the nominal amounts (150,000 salary, 20,000 RRSP, 7,000 TFSA)
    // are discounted. In Year 16, Jack's flat nominal salary has shrunk to 93,475 in real terms,
    // which is not enough to cover the real lifestyle spending of 120,422.
    // Therefore, the cash surplus is 0, and the RRSP/TFSA contributions are scaled to 0.
    const inflFact = Math.pow(1.03, 16)
    expect(pt16.employmentA).toBeCloseTo(150000 / inflFact, 0)
    expect(pt16.contribRrspA).toBe(0)
    expect(pt16.contribTfsaA).toBe(0)

    // Dianne is receiving her DB pension
    expect(pt16.dbPensionBaseB).toBeGreaterThan(0)
  })

  it('models survivorship correctly when Jack dies (Year 45)', () => {
    const state = getJdState()
    const { dataPoints } = runProjection(state)
    const pt45 = dataPoints[45] // CY + 45 (Jack's planning horizon of 85 was CY + 43)

    // Jack has passed away
    expect(pt45.grossIncomeA).toBe(0)
    // Dianne's pension should be reduced to 60% survivor benefit
    expect(pt45.dbPensionBaseB).toBeGreaterThan(0)
    // TFSA should reflect only Dianne's active balance (rolled over or inherited)
    expect(pt45.tfsaA).toBe(0)
    expect(pt45.tfsaB).toBeGreaterThan(0)
  })
})

describe('Jack & Dianne E2E Life Insurance Analysis', () => {
  it('runs insurance needs analysis successfully', () => {
    // Override planning end ages to be closer (e.g., age 55 for A, 53 for B)
    // to speed up sweeps significantly in the test runner environment.
    const state = getJdState({
      personA: {
        ...getJdState().personA,
        planningEndAge: 55,
      },
      personB: {
        ...getJdState().personB,
        planningEndAge: 53,
      },
    })
    const result = runInsuranceAnalysis(state, undefined, {
      depositAccount: 'hisa',
      sweepStart: 'current',
      stepSize: 5
    })

    // Should return 1D and 2D sweeps
    expect(result.sweep1D_A.length).toBeGreaterThan(0)
    expect(result.sweep1D_B.length).toBeGreaterThan(0)
    expect(result.sweep2D.length).toBeGreaterThan(0)
  })
})

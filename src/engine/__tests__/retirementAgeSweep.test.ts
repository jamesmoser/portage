import { describe, it, expect } from 'vitest'
import { runRetirementAgeSweep, applyRetirementAges, decimalAgeAt } from '../retirementAgeSweep'
import { DEFAULT_STATE } from '../defaults'

describe('applyRetirementAges', () => {
  it('modifies AppState correctly for retirement age shifts and pension/asset contribution cascades', () => {
    const testState = {
      ...DEFAULT_STATE,
      personA: { ...DEFAULT_STATE.personA, birthDate: '1980-01-01', retirementDate: '2045-01-01', planningEndAge: 90 },
      personB: { ...DEFAULT_STATE.personB, birthDate: '1982-01-01', retirementDate: '2047-01-01', planningEndAge: 90 },
      dbPensionA: { ...DEFAULT_STATE.dbPensionA, enabled: true, startDate: '2045-01-01' },
      dbPensionB: { ...DEFAULT_STATE.dbPensionB, enabled: true, startDate: '2047-01-01' },
    }

    const modified = applyRetirementAges(testState, 60, 62, {
      cascadePension: true,
      cascadeRrsp: true,
      cascadeTfsa: true,
      cascadeNonReg: true,
    })

    // Dec 31 of year turning 60 is dateAtDecimalAge('1980-01-01', 60) -> approx 2040-01-01
    // Let's verify the retirement date and pension start dates were shifted.
    expect(modified.personA.retirementDate).toContain('2040-01-01')
    expect(modified.dbPensionA.startDate).toContain('2040-01-01')

    // Person B turning 62: 1982-01-01 + 62 -> 2044-01-01
    expect(modified.personB.retirementDate).toContain('2044-01-01')
    expect(modified.dbPensionB.startDate).toContain('2044-01-01')
  })
})

describe('runRetirementAgeSweep', () => {
  it('runs the sweep using plan rates (flat rates schedule)', () => {
    const testState = {
      ...DEFAULT_STATE,
      personA: { ...DEFAULT_STATE.personA, birthDate: '1980-01-01', retirementDate: '2045-01-01', planningEndAge: 90 },
      personB: { ...DEFAULT_STATE.personB, birthDate: '1982-01-01', retirementDate: '2047-01-01', planningEndAge: 90 },
      rrspA: { ...DEFAULT_STATE.rrspA, balance: 1_000_000 },
      tfsaA: { ...DEFAULT_STATE.tfsaA, balance: 500_000 },
    }

    const result = runRetirementAgeSweep(testState, undefined, {
      startAgeA: 60,
      endAgeA: 65,
      startAgeB: 58,
      endAgeB: 63,
      step: 1,
      cascadePension: true,
      cascadeRrsp: true,
      cascadeTfsa: true,
      cascadeNonReg: true,
      rateType: 'plan',
    })

    expect(result.points.length).toBe(6 * 6) // ages 60..65 and 58..63
    expect(result.hasSpouse).toBe(true)
    expect(result.points[0].successRate).toBeDefined()
    expect(result.points[0].finalBalance).toBeDefined()
  })

  it('runs the sweep using historical rates with annual resolution', () => {
    const testState = {
      ...DEFAULT_STATE,
      personA: { ...DEFAULT_STATE.personA, birthDate: '1980-01-01', retirementDate: '2045-01-01', planningEndAge: 90 },
      personB: { ...DEFAULT_STATE.personB, birthDate: '1982-01-01', retirementDate: '2047-01-01', planningEndAge: 90 },
      rrspA: { ...DEFAULT_STATE.rrspA, balance: 1_000_000 },
      tfsaA: { ...DEFAULT_STATE.tfsaA, balance: 500_000 },
    }

    const result = runRetirementAgeSweep(testState, undefined, {
      startAgeA: 62,
      endAgeA: 64,
      startAgeB: 60,
      endAgeB: 62,
      step: 1,
      cascadePension: true,
      cascadeRrsp: true,
      cascadeTfsa: true,
      cascadeNonReg: true,
      rateType: 'historical',
      equityAllocationPct: 80,
      historicalStartYear: 1980,
    })

    expect(result.points.length).toBe(3 * 3) // ages 62..64 and 60..62
    // Check that success rate is a value between 0 and 100
    for (const point of result.points) {
      expect(point.successRate).toBeGreaterThanOrEqual(0)
      expect(point.successRate).toBeLessThanOrEqual(100)
    }
  })
})

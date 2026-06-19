import { describe, it, expect } from 'vitest'
import { runHistoricalAnalysis, runSpendingSweep, interpolateMonotoneCubic } from '../historicalAnalysis'
import { DEFAULT_STATE } from '../defaults'

describe('runHistoricalAnalysis', () => {
  it('runs rolling historical analysis with annual resolution', () => {
    const result = runHistoricalAnalysis(DEFAULT_STATE, {
      equityAllocationPct: 60,
      historicalStartYear: 1950,
      resolution: 'annual',
    })

    expect(result.totalCount).toBeGreaterThan(0)
    expect(result.paths.length).toBe(result.totalCount)
    // Check that all start months are 1 (January)
    for (const path of result.paths) {
      expect(path.startMonth).toBe(1)
      expect(path.portfolioBalances.length).toBeGreaterThan(0)
    }
    expect(result.successRate).toBeGreaterThanOrEqual(0)
    expect(result.successRate).toBeLessThanOrEqual(1)
  })

  it('runs rolling historical analysis with monthly resolution', () => {
    const result = runHistoricalAnalysis(DEFAULT_STATE, {
      equityAllocationPct: 60,
      historicalStartYear: 1950,
      resolution: 'monthly',
    })

    expect(result.totalCount).toBeGreaterThan(0)
    
    const annualResult = runHistoricalAnalysis(DEFAULT_STATE, {
      equityAllocationPct: 60,
      historicalStartYear: 1950,
      resolution: 'annual',
    })
    expect(result.totalCount).toBeGreaterThan(annualResult.totalCount)

    // Check that there are starting months other than January (1)
    const months = result.paths.map(p => p.startMonth)
    const hasDifferentMonths = months.some(m => m !== 1)
    expect(hasDifferentMonths).toBe(true)
  })

  it('filters by historicalStartYear correctly', () => {
    const full = runHistoricalAnalysis(DEFAULT_STATE, {
      equityAllocationPct: 60,
      historicalStartYear: 1871,
      resolution: 'annual',
    })

    const modern = runHistoricalAnalysis(DEFAULT_STATE, {
      equityAllocationPct: 60,
      historicalStartYear: 1950,
      resolution: 'annual',
    })

    expect(modern.totalCount).toBeLessThan(full.totalCount)
    for (const path of modern.paths) {
      expect(path.startYear).toBeGreaterThanOrEqual(1950)
    }
  })
})

describe('runSpendingSweep', () => {
  it('runs spending sweep and returns points in correct bounds', () => {
    const testState = {
      ...DEFAULT_STATE,
      personA: { ...DEFAULT_STATE.personA, birthDate: '1970-01-01', retirementDate: '2030-01-01', planningEndAge: 90 },
      personB: { ...DEFAULT_STATE.personB, birthDate: '1972-01-01', retirementDate: '2032-01-01', planningEndAge: 90 },
      rrspA: { ...DEFAULT_STATE.rrspA, balance: 1_500_000 },
      tfsaA: { ...DEFAULT_STATE.tfsaA, balance: 500_000 },
      nonRegA: { ...DEFAULT_STATE.nonRegA, balance: 1_500_000 },
      spendingPhases: [
        { id: 'p0', label: 'Retirement', startAge: 60, annualAmount: 150_000, growthRatePct: 0 }
      ],
      withdrawalStrategy: {
        ...DEFAULT_STATE.withdrawalStrategy,
        drawdownStrategy: 'spendGap' as const
      }
    }

    const result = runSpendingSweep(testState, {
      equityAllocationPct: 60,
      historicalStartYear: 1950,
      resolution: 'annual',
    })

    expect(result.points.length).toBeGreaterThan(0)
    expect(result.currentSpending).toBe(150_000)
    expect(result.currentSuccessRate).toBeGreaterThanOrEqual(0)
    expect(result.currentSuccessRate).toBeLessThanOrEqual(1)

    // Verify that success rates drop from low spending to high spending
    const firstPoint = result.points[0]
    const lastPoint = result.points[result.points.length - 1]
    expect(firstPoint.successRate).toBeGreaterThan(lastPoint.successRate)
    expect(lastPoint.successRate).toBeLessThan(1.0)

    // Check that points are ordered by spending value, and success rate decreases as spending increases
    for (let i = 1; i < result.points.length; i++) {
      expect(result.points[i].spending).toBeGreaterThan(result.points[i-1].spending)
      expect(result.points[i].successRate).toBeLessThanOrEqual(result.points[i-1].successRate)
    }
  })
})

describe('interpolateMonotoneCubic', () => {
  it('correctly interpolates points monotonically', () => {
    const x = [0, 10, 20, 30]
    const y = [100, 80, 20, 0]
    const result = interpolateMonotoneCubic(x, y, 50)
    expect(result.x.length).toBe(50)
    expect(result.y.length).toBe(50)
    
    // Bounds check
    for (const val of result.y) {
      expect(val).toBeGreaterThanOrEqual(0)
      expect(val).toBeLessThanOrEqual(100)
    }

    // Monotonicity check (input y is decreasing, so output y should be non-increasing)
    for (let i = 1; i < result.y.length; i++) {
      expect(result.y[i]).toBeLessThanOrEqual(result.y[i - 1])
    }
  })
})

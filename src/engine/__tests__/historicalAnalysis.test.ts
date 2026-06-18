import { describe, it, expect } from 'vitest'
import { runHistoricalAnalysis } from '../historicalAnalysis'
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

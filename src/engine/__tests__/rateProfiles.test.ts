import { describe, it, expect } from 'vitest'
import { generateRateSchedule, DEFAULT_MARKET_PROFILE } from '../rateProfiles'
import type { ReturnRates, MarketProfileConfig, MonthlyDataPoint } from '../types'
import { getDatasetById } from '../datasets'

const dummyRates: ReturnRates = {
  upTo55: 7.0,
  from55to65: 6.0,
  from65to70: 5.0,
  from70plus: 4.0,
}

describe('generateRateSchedule with historical profile', () => {
  it('generates the correct schedule length', () => {
    const config: MarketProfileConfig = {
      ...DEFAULT_MARKET_PROFILE,
      profileType: 'historical',
      historicalStartYear: 2008,
      historicalEquityAllocationPct: 60,
    }
    const schedule = generateRateSchedule(dummyRates, config, 2026, 2035, '1966-01-01', 3.0)
    expect(schedule.length).toBe(10) // 2035 - 2026 + 1
  })

  it('correctly uses actual historical returns and falls back to era average for overflow years', () => {
    const config: MarketProfileConfig = {
      ...DEFAULT_MARKET_PROFILE,
      profileType: 'historical',
      historicalStartYear: 2008, // Available full years: 2008 to 2022 (15 years)
      historicalEquityAllocationPct: 60,
      beta: 1,
      outlookOffset: 0,
    }
    // Request a 25-year plan. The first 15 years should be actuals, remaining 10 years should be the era's average.
    const schedule = generateRateSchedule(dummyRates, config, 2026, 2050, '1966-01-01', 3.0)
    expect(schedule.length).toBe(25)

    // Check that years 15 through 24 have identical values (all using the era's average CAGR)
    const overflowValue = schedule[15]
    for (let i = 15; i < 25; i++) {
      expect(schedule[i]).toBeCloseTo(overflowValue, 6)
    }

    // Verify that the overflow value is close to a reasonable balanced historical rate
    // e.g. ~4.25% real + 3.0% inflation = ~7.38% nominal
    expect(overflowValue).toBeGreaterThan(0.05)
    expect(overflowValue).toBeLessThan(0.09)
  })

  it('respects beta scaling for historical returns', () => {
    const config1: MarketProfileConfig = {
      ...DEFAULT_MARKET_PROFILE,
      profileType: 'historical',
      historicalStartYear: 2008,
      historicalEquityAllocationPct: 60,
      beta: 1.0,
      outlookOffset: 0,
    }
    const config2: MarketProfileConfig = {
      ...DEFAULT_MARKET_PROFILE,
      profileType: 'historical',
      historicalStartYear: 2008,
      historicalEquityAllocationPct: 60,
      beta: 2.0, // Double the swings around the mean
      outlookOffset: 0,
    }

    const schedule1 = generateRateSchedule(dummyRates, config1, 2026, 2045, '1966-01-01', 3.0)
    const schedule2 = generateRateSchedule(dummyRates, config2, 2026, 2045, '1966-01-01', 3.0)

    // Year 0 (2008) is a crash year (returns fell). So with beta=2, the crash should be even deeper.
    expect(schedule2[0]).toBeLessThan(schedule1[0])

    // Average/overflow years should be identical because deviation is 0 (mean scaled is still mean)
    const schedule1Overflow = schedule1[15]
    const schedule2Overflow = schedule2[15]
    expect(schedule2Overflow).toBeCloseTo(schedule1Overflow, 6)
  })

  it('respects outlookOffset for historical returns', () => {
    const config1: MarketProfileConfig = {
      ...DEFAULT_MARKET_PROFILE,
      profileType: 'historical',
      historicalStartYear: 2008,
      historicalEquityAllocationPct: 60,
      beta: 1.0,
      outlookOffset: 0,
    }
    const config2: MarketProfileConfig = {
      ...DEFAULT_MARKET_PROFILE,
      profileType: 'historical',
      historicalStartYear: 2008,
      historicalEquityAllocationPct: 60,
      beta: 1.0,
      outlookOffset: 2.0, // +2 pp shift
    }

    const schedule1 = generateRateSchedule(dummyRates, config1, 2026, 2040, '1966-01-01', 3.0)
    const schedule2 = generateRateSchedule(dummyRates, config2, 2026, 2040, '1966-01-01', 3.0)

    // Every year should be shifted up by exactly 2% (0.02)
    for (let i = 0; i < schedule1.length; i++) {
      expect(schedule2[i] - schedule1[i]).toBeCloseTo(0.02, 6)
    }
  })
})

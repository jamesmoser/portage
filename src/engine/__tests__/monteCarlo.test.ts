import { describe, it, expect } from 'vitest'
import { runMonteCarlo, getHistoricalAnnualReturns } from '../monteCarlo'
import { DEFAULT_STATE } from '../defaults'

describe('runMonteCarlo', () => {
  it('runs traditional Monte Carlo with Normal (Gaussian) distribution and returns valid structure', () => {
    const result = runMonteCarlo(DEFAULT_STATE, undefined, {
      method: 'traditional',
      simulations: 100,
      volatilityPct: 12,
      distribution: 'normal',
    })

    expect(result.simulationCount).toBe(100)
    expect(result.years.length).toBeGreaterThan(0)
    expect(result.p50.length).toBe(result.years.length)
    expect(result.p10.length).toBe(result.years.length)
    expect(result.p90.length).toBe(result.years.length)
    expect(result.milestones.length).toBeGreaterThan(0)
    expect(result.probabilityOfSuccess).toBeGreaterThanOrEqual(0)
    expect(result.probabilityOfSuccess).toBeLessThanOrEqual(1)
  })

  it('runs traditional Monte Carlo with Student\'s t distribution (fat tails)', () => {
    const result = runMonteCarlo(DEFAULT_STATE, undefined, {
      method: 'traditional',
      simulations: 100,
      volatilityPct: 12,
      distribution: 'student_t',
      degreesOfFreedom: 4,
    })

    expect(result.simulationCount).toBe(100)
    expect(result.years.length).toBeGreaterThan(0)
    expect(result.p50.length).toBe(result.years.length)
    expect(result.milestones.length).toBeGreaterThan(0)
  })

  it('runs traditional Monte Carlo with Skewed Normal distribution (asymmetric)', () => {
    const result = runMonteCarlo(DEFAULT_STATE, undefined, {
      method: 'traditional',
      simulations: 100,
      volatilityPct: 12,
      distribution: 'skewed_normal',
      skewness: -1.5,
    })

    expect(result.simulationCount).toBe(100)
    expect(result.years.length).toBeGreaterThan(0)
    expect(result.p50.length).toBe(result.years.length)
    expect(result.milestones.length).toBeGreaterThan(0)
  })

  it('runs Reduced CMA Monte Carlo and returns valid structure', () => {
    const result = runMonteCarlo(DEFAULT_STATE, undefined, {
      method: 'reduced',
      simulations: 100,
      volatilityPct: 12,
      cmaReductionPct: 2.0,
      distribution: 'normal',
    })

    expect(result.simulationCount).toBe(100)
    expect(result.years.length).toBeGreaterThan(0)
    expect(result.p50.length).toBe(result.years.length)
    expect(result.milestones.length).toBeGreaterThan(0)
  })

  it('yields lower median outcomes (P50) for Reduced CMA than Traditional Monte Carlo', () => {
    // Create state with positive starting assets so portfolio values don't remain at $0
    const stateWithAssets = {
      ...DEFAULT_STATE,
      tfsaA: {
        ...DEFAULT_STATE.tfsaA,
        balance: 1000000,
      },
    }

    // Run Traditional MC
    const traditionalResult = runMonteCarlo(stateWithAssets, undefined, {
      method: 'traditional',
      simulations: 150,
      volatilityPct: 10,
      distribution: 'normal',
    })

    // Run Reduced CMA MC with a 3% reduction
    const reducedResult = runMonteCarlo(stateWithAssets, undefined, {
      method: 'reduced',
      simulations: 150,
      volatilityPct: 10,
      cmaReductionPct: 3.0,
      distribution: 'normal',
    })

    // The final year P50 (median) should be lower for the reduced CMA simulation
    const lastIdx = traditionalResult.years.length - 1
    const tradP50Last = traditionalResult.p50[lastIdx]
    const redP50Last = reducedResult.p50[lastIdx]

    expect(redP50Last).toBeLessThan(tradP50Last)
  })

  it('runs Dynamic Reduced CMA Monte Carlo and returns valid structure', () => {
    const result = runMonteCarlo(DEFAULT_STATE, undefined, {
      method: 'dynamic',
      simulations: 100,
      volatilityPct: 12,
      dynamicCmaInitialReductionPct: 2.0,
      dynamicCmaDecayYears: 10,
      distribution: 'normal',
    })

    expect(result.simulationCount).toBe(100)
    expect(result.years.length).toBeGreaterThan(0)
    expect(result.p50.length).toBe(result.years.length)
    expect(result.milestones.length).toBeGreaterThan(0)
  })

  it('yields P50 outcomes for Dynamic Reduced CMA that sit between Traditional and constant Reduced CMA', () => {
    const stateWithAssets = {
      ...DEFAULT_STATE,
      tfsaA: {
        ...DEFAULT_STATE.tfsaA,
        balance: 1000000,
      },
    }

    // Traditional MC (0% reduction)
    const traditionalResult = runMonteCarlo(stateWithAssets, undefined, {
      method: 'traditional',
      simulations: 150,
      volatilityPct: 8,
      distribution: 'normal',
    })

    // Dynamic Reduced CMA MC (3% initial reduction, decaying over 10 years to 0%)
    const dynamicResult = runMonteCarlo(stateWithAssets, undefined, {
      method: 'dynamic',
      simulations: 150,
      volatilityPct: 8,
      dynamicCmaInitialReductionPct: 3.0,
      dynamicCmaDecayYears: 10,
      distribution: 'normal',
    })

    // Constant Reduced CMA MC (constant 3% reduction)
    const reducedResult = runMonteCarlo(stateWithAssets, undefined, {
      method: 'reduced',
      simulations: 150,
      volatilityPct: 8,
      cmaReductionPct: 3.0,
      distribution: 'normal',
    })

    const lastIdx = traditionalResult.years.length - 1
    const tradP50 = traditionalResult.p50[lastIdx]
    const dynP50 = dynamicResult.p50[lastIdx]
    const redP50 = reducedResult.p50[lastIdx]

    // We expect redP50 < dynP50 < tradP50
    expect(redP50).toBeLessThan(dynP50)
    expect(dynP50).toBeLessThan(tradP50)
  })

  it('runs Simple Bootstrap Monte Carlo and returns valid structure', () => {
    const result = runMonteCarlo(DEFAULT_STATE, undefined, {
      method: 'simple_bootstrap',
      simulations: 100,
      volatilityPct: 12, // ignored in bootstrap, but required by type
      equityAllocationPct: 60,
    })

    expect(result.simulationCount).toBe(100)
    expect(result.years.length).toBeGreaterThan(0)
    expect(result.p50.length).toBe(result.years.length)
    expect(result.milestones.length).toBeGreaterThan(0)
  })

  it('yields higher long-term median outcomes (P50) for 100% Equity than 20% Equity under Simple Bootstrap', () => {
    const stateWithAssets = {
      ...DEFAULT_STATE,
      tfsaA: {
        ...DEFAULT_STATE.tfsaA,
        balance: 1000000,
      },
    }

    // Run 100% Equity Bootstrap
    const equityResult = runMonteCarlo(stateWithAssets, undefined, {
      method: 'simple_bootstrap',
      simulations: 150,
      volatilityPct: 12,
      equityAllocationPct: 100,
    })

    // Run 20% Equity Bootstrap
    const conservativeResult = runMonteCarlo(stateWithAssets, undefined, {
      method: 'simple_bootstrap',
      simulations: 150,
      volatilityPct: 12,
      equityAllocationPct: 20,
    })

    const lastIdx = equityResult.years.length - 1
    const eqP50Last = equityResult.p50[lastIdx]
    const consP50Last = conservativeResult.p50[lastIdx]

    expect(consP50Last).toBeLessThan(eqP50Last)
  })

  it('runs Block Bootstrap Monte Carlo and returns valid structure', () => {
    const result = runMonteCarlo(DEFAULT_STATE, undefined, {
      method: 'block_bootstrap',
      simulations: 100,
      volatilityPct: 12, // ignored in bootstrap, but required by type
      equityAllocationPct: 60,
      bootstrapBlockSize: 5,
    })

    expect(result.simulationCount).toBe(100)
    expect(result.years.length).toBeGreaterThan(0)
    expect(result.p50.length).toBe(result.years.length)
    expect(result.p10.length).toBe(result.years.length)
    expect(result.p90.length).toBe(result.years.length)
    expect(result.milestones.length).toBeGreaterThan(0)
    expect(result.probabilityOfSuccess).toBeGreaterThanOrEqual(0)
    expect(result.probabilityOfSuccess).toBeLessThanOrEqual(1)
  })

  it('yields different paths for Block Bootstrap than Simple Bootstrap', () => {
    const stateWithAssets = {
      ...DEFAULT_STATE,
      tfsaA: {
        ...DEFAULT_STATE.tfsaA,
        balance: 1000000,
      },
    }

    const simpleResult = runMonteCarlo(stateWithAssets, undefined, {
      method: 'simple_bootstrap',
      simulations: 100,
      volatilityPct: 12,
      equityAllocationPct: 60,
    })

    const blockResult = runMonteCarlo(stateWithAssets, undefined, {
      method: 'block_bootstrap',
      simulations: 100,
      volatilityPct: 12,
      equityAllocationPct: 60,
      bootstrapBlockSize: 5,
    })

    expect(simpleResult.p50.length).toBe(blockResult.p50.length)
    const lastIdx = simpleResult.years.length - 1
    // The exact P50 values will differ due to the structure of block sampling vs. point-wise sampling
    expect(simpleResult.p50[lastIdx]).not.toBe(blockResult.p50[lastIdx])
  })
})

describe('getHistoricalAnnualReturns', () => {
  it('filters returns by startYear correctly', () => {
    const full = getHistoricalAnnualReturns(0.6)
    const modern = getHistoricalAnnualReturns(0.6, 1950)
    const postStagflation = getHistoricalAnnualReturns(0.6, 1980)

    expect(full.length).toBeGreaterThan(0)
    expect(modern.length).toBeLessThan(full.length)
    expect(postStagflation.length).toBeLessThan(modern.length)
  })
})

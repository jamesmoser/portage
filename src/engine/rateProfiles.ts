// Rate profile generation — converts a MarketProfileConfig into an annual return-rate
// schedule (decimal, e.g. 0.07 for 7%) for use by the projection engine.
// One rate per calendar year from startYear to endYear inclusive.

import type { ReturnRates, MarketProfileConfig } from './types'
import { intAgeAt, jan1 } from './dates'

// Mulberry32 seeded pseudo-random number generator.
function seededRand(seed: number): () => number {
  let s = (seed | 0) >>> 0
  return () => {
    s = (s + 0x6D2B79F5) >>> 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Returns an annual rate schedule as decimals ready for the projection engine.
// refBirthDate is the age-reference person's birth date (used only for 'step' profile).
export function generateRateSchedule(
  baseRates: ReturnRates,
  config: MarketProfileConfig,
  startYear: number,
  endYear: number,
  refBirthDate: string,
): number[] {
  const { profileType, outlookOffset, beta, cyclePeriodYears, dutyCycle,
          shockOffset, shockMagnitude, shockRecovery, shockDamping, noiseSeed } = config

  const peak = Math.max(baseRates.upTo55, baseRates.from55to65, baseRates.from65to70, baseRates.from70plus)
  const low  = Math.min(baseRates.upTo55, baseRates.from55to65, baseRates.from65to70, baseRates.from70plus)
  const amp  = (peak - low) / 2
  const n    = Math.max(1, endYear - startYear + 1)
  const rand = seededRand(noiseSeed)

  // Compute mid as the time-weighted average of the base step schedule so that
  // all shaped profiles have the same expected average return as the base plan.
  // This isolates sequencing as the only variable when comparing profiles.
  function stepRate(i: number): number {
    const age = intAgeAt(refBirthDate, jan1(startYear + i))
    if (age < 55)       return baseRates.upTo55
    else if (age < 65)  return baseRates.from55to65
    else if (age < 70)  return baseRates.from65to70
    else                return baseRates.from70plus
  }
  const mid = Array.from({ length: n }, (_, i) => stepRate(i)).reduce((a, b) => a + b, 0) / n

  return Array.from({ length: n }, (_, i) => {
    let pct: number
    switch (profileType) {
      case 'flat':
        return config.flatRate / 100
      case 'step':
        pct = stepRate(i)
        break
      case 'frontLoaded':
        pct = n > 1 ? peak - (peak - low) * i / (n - 1) : mid
        break
      case 'backLoaded':
        pct = n > 1 ? low + (peak - low) * i / (n - 1) : mid
        break
      case 'cyclicalCrest':
      case 'cyclicalTrough': {
        // Phase-distorted cosine: D = fraction of period above midpoint.
        // 4 quadrant mapping — each above-mid segment gets D/2, each below-mid gets (1-D)/2.
        const D = Math.max(0.01, Math.min(0.99, dutyCycle))
        const T = cyclePeriodYears
        const theta = ((i % T) + T) % T / T  // position in cycle [0, 1)
        const hD  = D / 2
        const h1D = (1 - D) / 2
        let phi: number
        if (theta < hD) {
          phi = (theta / hD) * (Math.PI / 2)
        } else if (theta < 0.5) {
          phi = Math.PI / 2 + ((theta - hD) / h1D) * (Math.PI / 2)
        } else if (theta < 0.5 + h1D) {
          phi = Math.PI + ((theta - 0.5) / h1D) * (Math.PI / 2)
        } else {
          phi = 3 * Math.PI / 2 + ((theta - (1 - hD)) / hD) * (Math.PI / 2)
        }
        pct = profileType === 'cyclicalCrest'
          ? mid + amp * Math.cos(phi)
          : mid - amp * Math.cos(phi)
        break
      }
      case 'marketShock': {
        // Damped oscillator impulse response centred on flatRate.
        // deviation(t) = M · e^(−k·t) · cos(ω·t)   where t = years since shock
        // k = 3/N  → envelope at 5% of M when t = N (recovery years)
        // ω = 2π · MAX_RINGS · (1−D) / N  → 0 rings at D=1, MAX_RINGS at D=0
        // Returns directly (like 'flat') — beta/outlook do not apply.
        const t = i - shockOffset
        if (t < 0) return config.flatRate / 100
        const N  = Math.max(1, shockRecovery)
        const D  = Math.max(0, Math.min(1, shockDamping))
        const M  = shockMagnitude                    // already in %, e.g. -30
        const k  = 3 / N
        const MAX_RINGS = 3
        const omega = (2 * Math.PI * MAX_RINGS * (1 - D)) / N
        return (config.flatRate + M * Math.exp(-k * t) * Math.cos(omega * t)) / 100
      }
      case 'noise':
      default:
        pct = low + rand() * (peak - low)
        break
    }
    // Beta scales deviations around mid (amplitude control).
    // beta=1: unchanged. beta=2: double swing. beta=0: flat line at mid.
    // Outlook shifts the entire curve up/down after beta scaling.
    return (mid + (pct - mid) * beta + outlookOffset) / 100
  })
}

export const DEFAULT_MARKET_PROFILE: MarketProfileConfig = {
  profileType:      'step',
  flatRate:         6,
  outlookOffset:    0,
  beta:             1,
  cyclePeriodYears: 10,
  dutyCycle:        0.5,
  shockOffset:      5,
  shockMagnitude:   -20,
  shockRecovery:    10,
  shockDamping:     0.7,
  noiseSeed:        42,
}

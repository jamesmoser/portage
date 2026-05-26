// Rate profile generation — converts a MarketProfileConfig into an annual return-rate
// schedule (decimal, e.g. 0.07 for 7%) for use by the projection engine.
// One rate per calendar year from startYear to endYear inclusive.

import type { ReturnRates, MarketProfileConfig } from './types'
import { exactAgeAt, jan1 } from './dates'

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
  const { profileType, outlookOffset, beta, cyclePeriodYears, noiseSeed } = config

  const peak = Math.max(baseRates.upTo55, baseRates.from55to65, baseRates.from65to70, baseRates.from70plus)
  const low  = Math.min(baseRates.upTo55, baseRates.from55to65, baseRates.from65to70, baseRates.from70plus)
  const mid  = (peak + low) / 2
  const amp  = (peak - low) / 2
  const n    = Math.max(1, endYear - startYear + 1)
  const rand = seededRand(noiseSeed)

  return Array.from({ length: n }, (_, i) => {
    let pct: number
    switch (profileType) {
      case 'step': {
        const age = exactAgeAt(refBirthDate, jan1(startYear + i))
        if (age < 55)       pct = baseRates.upTo55
        else if (age < 65)  pct = baseRates.from55to65
        else if (age < 70)  pct = baseRates.from65to70
        else                pct = baseRates.from70plus
        break
      }
      case 'frontLoaded':
        pct = n > 1 ? peak - (peak - low) * i / (n - 1) : mid
        break
      case 'backLoaded':
        pct = n > 1 ? low + (peak - low) * i / (n - 1) : mid
        break
      case 'cyclicalCrest':
        pct = mid + amp * Math.cos(2 * Math.PI * i / cyclePeriodYears)
        break
      case 'cyclicalTrough':
        pct = mid - amp * Math.cos(2 * Math.PI * i / cyclePeriodYears)
        break
      case 'noise':
      default:
        pct = low + rand() * (peak - low)
        break
    }
    // Beta scales deviations around mid (amplitude control).
    // beta=1: unchanged. beta=2: double swing. beta=0: flat line at mid.
    // Outlook shifts the entire curve up/down.
    return (mid + (pct - mid) * beta + outlookOffset) / 100
  })
}

export const DEFAULT_MARKET_PROFILE: MarketProfileConfig = {
  profileType:      'step',
  outlookOffset:    0,
  beta:             1,
  cyclePeriodYears: 10,
  noiseSeed:        42,
}

// CPP / OAS Timing Optimizer — sweeps CPP start ages (60–70) and OAS start ages
// (65–70) independently for each person to find the household-lifetime-benefit-
// maximising start ages.
//
// For CPP the metric is total household CPP collected across all plan years,
// including survivor benefits.  Survivor benefits are handled automatically by
// the projection engine: when the first person dies the survivor receives up to
// 60% of the deceased's effective CPP, capped by the survivor's own combined-cap
// (which scales with the *survivor's* deferral factor, not the deceased's).
// Because of this interaction, sweeping one person's start age also indirectly
// changes the survivor benefit exposure — that is captured in the household
// lifetime CPP metric.
//
// For OAS the metric is total household net OAS: gross OAS minus the clawback
// paid.  At ages 65–70 the deferral factor gives +0.6%/month.  For high-income
// plans the additional gross OAS earned by deferring may be partially or fully
// clawed back, so net OAS can peak before age 70.
//
// All source values are read from state — no hardcoded constants.

import type { AppState, DataPoint } from './types'
import { runProjection } from './projection'
import { dateAtAge } from './dates'

// ─── Public types ─────────────────────────────────────────────────────────────

export interface GovBenefitSweepPoint {
  age: number
  /** Total household CPP collected, today's dollars (includes survivor benefit). */
  lifetimeCPP: number
  /** Total household OAS net of clawback, today's dollars. */
  lifetimeOASNet: number
}

export interface GovBenefitOptimizerResult {
  /** A's CPP sweep (60–70); B's CPP start held at base plan. */
  cppSweepA: GovBenefitSweepPoint[]
  /** B's CPP sweep (60–70); A's CPP start held at base plan. */
  cppSweepB: GovBenefitSweepPoint[]
  /** A's OAS sweep (65–70); B's OAS start held at base plan. */
  oasSweepA: GovBenefitSweepPoint[]
  /** B's OAS sweep (65–70); B's OAS start held at base plan. */
  oasSweepB: GovBenefitSweepPoint[]

  /** Start age yielding maximum household lifetime CPP in each person's sweep. */
  optimalCppAgeA: number
  optimalCppAgeB: number
  /** Start age yielding maximum household lifetime net OAS in each person's sweep. */
  optimalOasAgeA: number
  optimalOasAgeB: number

  /** Current base-plan start ages, for delta display. */
  baseCppAgeA: number
  baseCppAgeB: number
  baseOasAgeA: number
  baseOasAgeB: number
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Nearest integer start age for a given start date relative to birth date. */
function nearestIntAge(birthDate: string, startDate: string): number {
  const birthMs = new Date(birthDate).getTime()
  const startMs = new Date(startDate).getTime()
  return Math.round((startMs - birthMs) / (365.25 * 24 * 3600 * 1000))
}

/** Return a copy of state with Person A or B's CPP start date set to their exact
 *  birthday at the given integer age. */
function withCppAge(state: AppState, person: 'A' | 'B', age: number): AppState {
  const birth = person === 'A' ? state.personA.birthDate : state.personB.birthDate
  const startDate = dateAtAge(birth, age)
  return person === 'A'
    ? { ...state, cppA: { ...state.cppA, startDate } }
    : { ...state, cppB: { ...state.cppB, startDate } }
}

/** Return a copy of state with Person A or B's OAS start date set to their exact
 *  birthday at the given integer age. */
function withOasAge(state: AppState, person: 'A' | 'B', age: number): AppState {
  const birth = person === 'A' ? state.personA.birthDate : state.personB.birthDate
  const startDate = dateAtAge(birth, age)
  return person === 'A'
    ? { ...state, oasA: { ...state.oasA, startDate } }
    : { ...state, oasB: { ...state.oasB, startDate } }
}

function buildPoint(age: number, dataPoints: DataPoint[]): GovBenefitSweepPoint {
  let lifetimeCPP    = 0
  let lifetimeOASNet = 0
  for (const dp of dataPoints) {
    lifetimeCPP    += dp.cppA + dp.cppB
    lifetimeOASNet += dp.oasA + dp.oasB - dp.oasClawbackA - dp.oasClawbackB
  }
  return { age, lifetimeCPP, lifetimeOASNet }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Run the CPP / OAS timing optimizer.
 *
 * Runs 34 projections total:
 *   - 11 for CPP age sweep A (ages 60–70, B held at base)
 *   - 11 for CPP age sweep B (ages 60–70, A held at base)
 *   -  6 for OAS age sweep A (ages 65–70, B held at base)
 *   -  6 for OAS age sweep B (ages 65–70, A held at base)
 *
 * @param state        Effective AppState (whatIfs already merged in).
 * @param rateSchedule Optional rate schedule from the active market profile.
 */
export function runGovBenefitOptimizer(
  state: AppState,
  rateSchedule: number[] | undefined,
): GovBenefitOptimizerResult {
  const CPP_MIN = 60
  const CPP_MAX = 70
  const OAS_MIN = 65
  const OAS_MAX = 70

  const baseCppAgeA = nearestIntAge(state.personA.birthDate, state.cppA.startDate)
  const baseCppAgeB = nearestIntAge(state.personB.birthDate, state.cppB.startDate)
  const baseOasAgeA = nearestIntAge(state.personA.birthDate, state.oasA.startDate)
  const baseOasAgeB = nearestIntAge(state.personB.birthDate, state.oasB.startDate)

  // CPP sweeps
  const cppSweepA: GovBenefitSweepPoint[] = []
  for (let age = CPP_MIN; age <= CPP_MAX; age++) {
    const { dataPoints } = runProjection(withCppAge(state, 'A', age), rateSchedule)
    cppSweepA.push(buildPoint(age, dataPoints))
  }

  const cppSweepB: GovBenefitSweepPoint[] = []
  for (let age = CPP_MIN; age <= CPP_MAX; age++) {
    const { dataPoints } = runProjection(withCppAge(state, 'B', age), rateSchedule)
    cppSweepB.push(buildPoint(age, dataPoints))
  }

  // OAS sweeps
  const oasSweepA: GovBenefitSweepPoint[] = []
  for (let age = OAS_MIN; age <= OAS_MAX; age++) {
    const { dataPoints } = runProjection(withOasAge(state, 'A', age), rateSchedule)
    oasSweepA.push(buildPoint(age, dataPoints))
  }

  const oasSweepB: GovBenefitSweepPoint[] = []
  for (let age = OAS_MIN; age <= OAS_MAX; age++) {
    const { dataPoints } = runProjection(withOasAge(state, 'B', age), rateSchedule)
    oasSweepB.push(buildPoint(age, dataPoints))
  }

  const optimalCppAgeA = cppSweepA.reduce((b, p) => p.lifetimeCPP > b.lifetimeCPP ? p : b).age
  const optimalCppAgeB = cppSweepB.reduce((b, p) => p.lifetimeCPP > b.lifetimeCPP ? p : b).age
  const optimalOasAgeA = oasSweepA.reduce((b, p) => p.lifetimeOASNet > b.lifetimeOASNet ? p : b).age
  const optimalOasAgeB = oasSweepB.reduce((b, p) => p.lifetimeOASNet > b.lifetimeOASNet ? p : b).age

  return {
    cppSweepA, cppSweepB,
    oasSweepA, oasSweepB,
    optimalCppAgeA, optimalCppAgeB,
    optimalOasAgeA, optimalOasAgeB,
    baseCppAgeA, baseCppAgeB,
    baseOasAgeA, baseOasAgeB,
  }
}

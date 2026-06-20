// Analysis tab — projection looped for probabilistic analysis and optimisation.
// Runs on the same effective plan (base plan + active what-ifs) as the Dashboard
// but executes the engine multiple times to explore uncertainty and optimal parameters.

import { useMemo, useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { SectionCard } from '../components/SectionCard'
import { CardGrid } from '../components/CardGrid'
import { SectionDivider } from '../components/SectionDivider'
import { NumberInput } from '../components/NumberInput'
import { SelectInput } from '../components/SelectInput'
import { PlotlyChart } from '../components/PlotlyChart'
import { InfoPanel } from '../components/InfoPanel'
import { runProjection } from '../engine/projection'
import { mergeWhatIfs } from '../engine/whatifs'
import { getYear, dateAtAge, intAgeAt, jan1 } from '../engine/dates'
import type { AppState } from '../engine/types'
import { DEFAULT_WHATIFS } from '../engine/defaults'
import { generateRateSchedule } from '../engine/rateProfiles'
import { runMonteCarlo } from '../engine/monteCarlo'
import type { MonteCarloResult, MonteCarloOptions } from '../engine/monteCarlo'
import { runMeltdownOptimizer } from '../engine/meltdownOptimizer'
import type { MeltdownOptimizerResult } from '../engine/meltdownOptimizer'
import { runGovBenefitOptimizer } from '../engine/govBenefitOptimizer'
import type { GovBenefitOptimizerResult } from '../engine/govBenefitOptimizer'
import { runHistoricalAnalysis, runSpendingSweep, interpolateMonotoneCubic } from '../engine/historicalAnalysis'
import type { HistoricalAnalysisResult, HistoricalPathResult, SpendingSweepPoint } from '../engine/historicalAnalysis'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Data = any

// ─── Formatters ───────────────────────────────────────────────────────────────

const _fmtObj = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 })
const fmt = (v: number) => _fmtObj.format(v)

// ─── AnalysisTab ──────────────────────────────────────────────────────────────

export function AnalysisTab() {
  const state = useStore()
  const currentYear = new Date().getFullYear()
  const {
    whatIfs, ageReferencePerson, personA, personB,
    withdrawalStrategy, updateWhatIf,
  } = state

  const aName = personA.name || 'Person A'
  const bName = personB.name || 'Person B'

  // ── Effective state and rate schedule (mirrors DashboardTab setup) ─────────

  const effectiveState = useMemo(
    () => mergeWhatIfs(state as AppState, whatIfs),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state, whatIfs],
  )

  const rateSchedule = useMemo(() => {
    if (!whatIfs.marketProfile?.enabled) return undefined
    const currentYear = new Date().getFullYear()
    const eA = getYear(dateAtAge(effectiveState.personA.birthDate, effectiveState.personA.planningEndAge))
    const eB = getYear(dateAtAge(effectiveState.personB.birthDate, effectiveState.personB.planningEndAge))
    const refBirth = effectiveState.ageReferencePerson === 'personB'
      ? effectiveState.personB.birthDate
      : effectiveState.personA.birthDate
    return generateRateSchedule(
      effectiveState.returnRates,
      whatIfs.marketProfile.value,
      currentYear,
      Math.max(eA, eB),
      refBirth,
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [whatIfs.marketProfile, effectiveState])

  const { dataPoints } = useMemo(
    () => runProjection(effectiveState, rateSchedule),
    [effectiveState, rateSchedule],
  )

  // ── Monte Carlo state ─────────────────────────────────────────────────────

  const [mcMethod,        setMcMethod]        = useState<MonteCarloOptions['method']>('traditional')
  const [mcDistribution,  setMcDistribution]  = useState<NonNullable<MonteCarloOptions['distribution']>>('normal')
  const [mcDegreesOfFreedom, setMcDegreesOfFreedom] = useState(4)
  const [mcSkewness,      setMcSkewness]      = useState(-1.5)
  const [mcCmaReductionPct, setMcCmaReductionPct] = useState(1.5)
  const [mcDynamicCmaInitialReductionPct, setMcDynamicCmaInitialReductionPct] = useState(2.0)
  const [mcDynamicCmaDecayYears, setMcDynamicCmaDecayYears] = useState(10)
  const [mcEquityAllocationPct, setMcEquityAllocationPct] = useState(60)
  const [mcHistoricalStartYear, setMcHistoricalStartYear] = useState(1871)
  const [mcBootstrapBlockSize, setMcBootstrapBlockSize] = useState(5)
  const [mcSimulations,   setMcSimulations]   = useState(500)
  const [mcVolatilityPct, setMcVolatilityPct] = useState(12)
  
  // Regime switching parameters
  const [mcRegimePreset, setMcRegimePreset] = useState<'standard' | 'stagnation' | 'stagflation' | 'custom'>('standard')
  const [mcRegime1ReturnPct, setMcRegime1ReturnPct] = useState(8.0)
  const [mcRegime1VolPct, setMcRegime1VolPct] = useState(10.0)
  const [mcRegime1Duration, setMcRegime1Duration] = useState(6.0)
  const [mcRegime2ReturnPct, setMcRegime2ReturnPct] = useState(-4.0)
  const [mcRegime2VolPct, setMcRegime2VolPct] = useState(22.0)
  const [mcRegime2Duration, setMcRegime2Duration] = useState(1.5)

  const [mcResult,        setMcResult]        = useState<MonteCarloResult | null>(null)
  const [mcRunning,       setMcRunning]       = useState(false)

  function handleRegimeChange(param: string, value: number) {
    setMcRegimePreset('custom')
    if (param === 'r1Ret') setMcRegime1ReturnPct(value)
    else if (param === 'r1Vol') setMcRegime1VolPct(value)
    else if (param === 'r1Dur') setMcRegime1Duration(value)
    else if (param === 'r2Ret') setMcRegime2ReturnPct(value)
    else if (param === 'r2Vol') setMcRegime2VolPct(value)
    else if (param === 'r2Dur') setMcRegime2Duration(value)
  }

  function handleRegimePresetChange(preset: 'standard' | 'stagnation' | 'stagflation' | 'custom') {
    setMcRegimePreset(preset)
    if (preset === 'standard') {
      setMcRegime1ReturnPct(8.0)
      setMcRegime1VolPct(10.0)
      setMcRegime1Duration(6.0)
      setMcRegime2ReturnPct(-4.0)
      setMcRegime2VolPct(22.0)
      setMcRegime2Duration(1.5)
    } else if (preset === 'stagnation') {
      setMcRegime1ReturnPct(5.0)
      setMcRegime1VolPct(10.0)
      setMcRegime1Duration(4.0)
      setMcRegime2ReturnPct(-2.0)
      setMcRegime2VolPct(15.0)
      setMcRegime2Duration(3.0)
    } else if (preset === 'stagflation') {
      setMcRegime1ReturnPct(3.0)
      setMcRegime1VolPct(15.0)
      setMcRegime1Duration(3.0)
      setMcRegime2ReturnPct(-6.0)
      setMcRegime2VolPct(25.0)
      setMcRegime2Duration(2.0)
    }
  }

  function runMC() {
    setMcRunning(true)
    setTimeout(() => {
      const result = runMonteCarlo(effectiveState, rateSchedule, {
        method:                        mcMethod,
        simulations:                   mcSimulations,
        volatilityPct:                 mcVolatilityPct,
        distribution:                  mcDistribution,
        degreesOfFreedom:              mcDegreesOfFreedom,
        skewness:                      mcSkewness,
        cmaReductionPct:               mcCmaReductionPct,
        dynamicCmaInitialReductionPct: mcDynamicCmaInitialReductionPct,
        dynamicCmaDecayYears:          mcDynamicCmaDecayYears,
        equityAllocationPct:           mcEquityAllocationPct,
        historicalStartYear:           mcHistoricalStartYear,
        bootstrapBlockSize:            mcBootstrapBlockSize,
        regime1ReturnPct:              mcRegime1ReturnPct,
        regime1VolPct:                 mcRegime1VolPct,
        regime1Duration:               mcRegime1Duration,
        regime2ReturnPct:              mcRegime2ReturnPct,
        regime2VolPct:                 mcRegime2VolPct,
        regime2Duration:               mcRegime2Duration,
      })
      setMcResult(result)
      setMcRunning(false)
    }, 20)
  }

  // ── Common variables for Monte Carlo and Historical analysis ───────────────
  const refPerson = effectiveState.ageReferencePerson === 'personB' ? effectiveState.personB : effectiveState.personA
  const refName = effectiveState.ageReferencePerson === 'personB' ? bName : aName
  const startAge = intAgeAt(refPerson.birthDate, jan1(currentYear))

  const eA = getYear(dateAtAge(effectiveState.personA.birthDate, effectiveState.personA.planningEndAge))
  const eB = getYear(dateAtAge(effectiveState.personB.birthDate, effectiveState.personB.planningEndAge))
  const endYear = Math.max(eA, eB)
  const maxStartYearLimit = 2025 - (endYear - currentYear)

  // ── Historical Sequence Stress Test state ──────────────────────────────────
  const [histEqAllocation, setHistEqAllocation] = useState(60)
  const [histStartYear, setHistStartYear] = useState(1871)
  const [histResolution, setHistResolution] = useState<'annual' | 'monthly'>('monthly')
  const [histResult, setHistResult] = useState<HistoricalAnalysisResult | null>(null)
  const [histRunning, setHistRunning] = useState(false)

  useEffect(() => {
    if (histStartYear > maxStartYearLimit) {
      const options = [2000, 1980, 1950, 1871]
      const best = options.find(yr => yr <= maxStartYearLimit) ?? 1871
      setHistStartYear(best)
    }
  }, [maxStartYearLimit, histStartYear])

  function runHistAnalysis() {
    setHistRunning(true)
    setTimeout(() => {
      const res = runHistoricalAnalysis(effectiveState, {
        equityAllocationPct: histEqAllocation,
        historicalStartYear: histStartYear,
        resolution: histResolution,
      })
      setHistResult(res)
      setHistRunning(false)
    }, 20)
  }

  // Compile Plotly Traces for Historical
  const histChartTraces = useMemo<Data[]>(() => {
    if (!histResult || histResult.paths.length === 0) return []

    const traces: Data[] = []

    let bestPath: HistoricalPathResult = histResult.paths[0]
    let worstPath: HistoricalPathResult = histResult.paths[0]
    for (const p of histResult.paths) {
      if (p.finalBalance > bestPath.finalBalance) bestPath = p
      if (p.finalBalance < worstPath.finalBalance) worstPath = p
    }

    for (const path of histResult.paths) {
      if (path.label === bestPath.label || path.label === worstPath.label) {
        continue
      }
      const ages = path.years.map(y => startAge + (y - currentYear))
      traces.push({
        x: ages,
        y: path.portfolioBalances,
        type: 'scatter',
        mode: 'lines',
        name: `Started ${path.label}`,
        line: { color: 'rgba(148, 163, 184, 0.18)', width: 1 },
        hovertemplate: `Start Year: ${path.label}<br>Age: %{x}<br>Portfolio: %{y:$,.0f}<extra></extra>`
      })
    }

    const worstAges = worstPath.years.map(y => startAge + (y - currentYear))
    traces.push({
      x: worstAges,
      y: worstPath.portfolioBalances,
      type: 'scatter',
      mode: 'lines',
      name: `Worst Case (${worstPath.label})`,
      line: { color: '#7B1515', width: 3 },
      hovertemplate: `<b>Worst: ${worstPath.label}</b><br>Age: %{x}<br>Portfolio: %{y:$,.0f}<extra></extra>`
    })

    const bestAges = bestPath.years.map(y => startAge + (y - currentYear))
    traces.push({
      x: bestAges,
      y: bestPath.portfolioBalances,
      type: 'scatter',
      mode: 'lines',
      name: `Best Case (${bestPath.label})`,
      line: { color: '#10b981', width: 3 },
      hovertemplate: `<b>Best: ${bestPath.label}</b><br>Age: %{x}<br>Portfolio: %{y:$,.0f}<extra></extra>`
    })

    return traces
  }, [histResult, startAge, currentYear])

  const histSortedPaths = useMemo(() => {
    if (!histResult) return []
    return [...histResult.paths].sort((a, b) => a.finalBalance - b.finalBalance)
  }, [histResult])

  // ── Sustainable Spending Sweep state ──────────────────────────────────────
  const [sweepEqAllocation, setSweepEqAllocation] = useState(60)
  const [sweepStartYear, setSweepStartYear] = useState(1871)
  const sweepResolution = 'annual'
  const [sweepResult, setSweepResult] = useState<{ points: SpendingSweepPoint[], currentSpending: number, currentSuccessRate: number } | null>(null)
  const [sweepRunning, setSweepRunning] = useState(false)

  useEffect(() => {
    if (sweepStartYear > maxStartYearLimit) {
      const options = [2000, 1980, 1950, 1871]
      const best = options.find(yr => yr <= maxStartYearLimit) ?? 1871
      setSweepStartYear(best)
    }
  }, [maxStartYearLimit, sweepStartYear])

  function runSweep() {
    setSweepRunning(true)
    setTimeout(() => {
      const res = runSpendingSweep(effectiveState, {
        equityAllocationPct: sweepEqAllocation,
        historicalStartYear: sweepStartYear,
        resolution: sweepResolution,
      })
      setSweepResult(res)
      setSweepRunning(false)
    }, 20)
  }

  // Compile Plotly Traces for Spending Sweep
  const sweepChartTraces = useMemo<Data[]>(() => {
    if (!sweepResult || sweepResult.points.length === 0) return []

    const xVals = sweepResult.points.map(p => p.spending)
    const yVals = sweepResult.points.map(p => p.successRate * 100)

    const smoothed = interpolateMonotoneCubic(xVals, yVals, 100)

    const traces: Data[] = [
      // The Success Curve (smoothed monotone cubic)
      {
        x: smoothed.x,
        y: smoothed.y,
        type: 'scatter',
        mode: 'lines',
        name: 'Flat Spending Success Rate',
        line: { color: '#7B1515', width: 2 },
        hovertemplate: 'Base Spending: %{x:$,.0f}<br>Success Rate: %{y:.1f}%<extra></extra>'
      },
      // Actual simulated points as markers
      {
        x: xVals,
        y: yVals,
        type: 'scatter',
        mode: 'markers',
        name: 'Simulated Levels',
        marker: { color: '#7B1515', size: 6 },
        hovertemplate: 'Simulated Base Spending: %{x:$,.0f}<br>Success Rate: %{y:.1f}%<extra></extra>',
        showlegend: false
      }
    ]

    // Add reference dot for user's actual configured plan
    traces.push({
      x: [sweepResult.currentSpending],
      y: [sweepResult.currentSuccessRate * 100],
      type: 'scatter',
      mode: 'markers',
      name: 'Your Configured Plan',
      marker: { color: '#d97706', size: 12, symbol: 'diamond' },
      hovertemplate: `<b>Your Configured Plan</b><br>Base Spending: $%{x:,.0f}<br>Success Rate: %{y:.1f}%<extra></extra>`
    })

    // Add open circles for benchmarks (if in sweep range)
    const benchmarks = [
      { name: 'Lean FIRE', amount: 50000, color: '#64748b' },
      { name: 'Avg. Household', amount: 80000, color: '#10b981' },
      { name: 'Chubby FIRE', amount: 120000, color: '#3b82f6' },
      { name: 'Fat FIRE', amount: 180000, color: '#ef4444' },
    ]

    const benchmarkPoints = benchmarks
      .map(b => {
        const pt = sweepResult.points.find(p => p.spending === b.amount)
        if (!pt) return null
        return {
          x: pt.spending,
          y: pt.successRate * 100,
          color: b.color,
          name: b.name
        }
      })
      .filter((bp): bp is NonNullable<typeof bp> => bp !== null)

    if (benchmarkPoints.length > 0) {
      traces.push({
        x: benchmarkPoints.map(bp => bp.x),
        y: benchmarkPoints.map(bp => bp.y),
        type: 'scatter',
        mode: 'markers',
        name: 'Benchmarks',
        marker: {
          symbol: 'circle',
          size: 14,
          color: benchmarkPoints.map(() => 'rgba(0,0,0,0)'), // transparent fill
          line: {
            color: benchmarkPoints.map(bp => bp.color),
            width: 2.5
          }
        },
        hovertemplate: '<b>%{text}</b><br>Spending: %{x:$,.0f}<br>Success Rate: %{y:.1f}%<extra></extra>',
        text: benchmarkPoints.map(bp => bp.name),
        showlegend: false
      })
    }

    return traces
  }, [sweepResult])

  const getClosestSuccessRate = (spending: number) => {
    if (!sweepResult || sweepResult.points.length === 0) return '—'
    if (spending < sweepResult.points[0].spending) {
      return `≥ ${(sweepResult.points[0].successRate * 100).toFixed(1)}%`
    }
    if (spending > sweepResult.points[sweepResult.points.length - 1].spending) {
      return `≤ ${(sweepResult.points[sweepResult.points.length - 1].successRate * 100).toFixed(1)}%`
    }
    let closest = sweepResult.points[0]
    let minDiff = Math.abs(closest.spending - spending)
    for (const p of sweepResult.points) {
      const diff = Math.abs(p.spending - spending)
      if (diff < minDiff) {
        minDiff = diff
        closest = p
      }
    }
    return `${(closest.successRate * 100).toFixed(1)}%`
  }

  const p90SpendingLabel = useMemo(() => {
    if (!sweepResult || sweepResult.points.length === 0) return '—'
    const eligible = sweepResult.points.filter(p => p.successRate >= 0.9)
    if (eligible.length === 0) {
      return `< ${fmt(sweepResult.points[0].spending)}`
    }
    return fmt(eligible[eligible.length - 1].spending)
  }, [sweepResult])

  // ── CPP / OAS optimizer state ─────────────────────────────────────────────

  const [govResult,  setGovResult]  = useState<GovBenefitOptimizerResult | null>(null)
  const [govRunning, setGovRunning] = useState(false)

  function runGov() {
    setGovRunning(true)
    setTimeout(() => {
      const result = runGovBenefitOptimizer(effectiveState, rateSchedule)
      setGovResult(result)
      setGovRunning(false)
    }, 20)
  }

  function applyOptimalGovAges() {
    if (!govResult) return
    updateWhatIf('cppStartAgeA', { enabled: true, value: govResult.optimalCppAgeA })
    updateWhatIf('cppStartAgeB', { enabled: true, value: govResult.optimalCppAgeB })
    updateWhatIf('oasStartAgeA', { enabled: true, value: govResult.optimalOasAgeA })
    updateWhatIf('oasStartAgeB', { enabled: true, value: govResult.optimalOasAgeB })
  }

  // ── CPP / OAS chart builder ───────────────────────────────────────────────

  function buildGovChart(
    sweep: GovBenefitOptimizerResult['cppSweepA'],
    metric: 'cpp' | 'oas',
    optimalAge: number,
    baseAge: number,
  ) {
    const ages = sweep.map(p => p.age)
    const values = sweep.map(p => metric === 'cpp' ? p.lifetimeCPP : p.lifetimeOASNet)

    // Per-point marker styling:
    //   optimal age  → red filled dot, larger
    //   base plan    → hollow grey circle (white fill, grey border), larger
    //   other ages   → small grey dot
    const markerFill   = ages.map(a => a === optimalAge ? '#7B1515' : a === baseAge ? 'white' : '#cbd5e1')
    const markerBorder = ages.map(a => a === optimalAge ? '#7B1515' : '#94a3b8')
    const markerSize   = ages.map(a => (a === optimalAge || a === baseAge) ? 10 : 6)
    const markerWidth  = ages.map(a => (a === optimalAge || a === baseAge) ? 2 : 1)

    const trace: Data = {
      x: ages,
      y: values,
      type: 'scatter',
      mode: 'lines+markers',
      line: { color: '#cbd5e1', width: 1.5 },
      marker: {
        size: markerSize,
        color: markerFill,
        line: { color: markerBorder, width: markerWidth },
      },
      hovertemplate: 'Age %{x}<br>%{y:$,.0f}<extra></extra>',
    }

    const optimalValue = values[ages.indexOf(optimalAge)]
    const baseValue    = ages.indexOf(baseAge) !== -1 ? values[ages.indexOf(baseAge)] : undefined

    const annotations: object[] = [
      {
        x: optimalAge, xref: 'x', y: optimalValue, yref: 'y',
        text: 'Optimal', showarrow: false, yshift: 12,
        font: { size: 9, color: '#7B1515' }, xanchor: 'center', yanchor: 'bottom',
      },
    ]
    if (baseAge !== optimalAge && baseValue !== undefined) {
      annotations.push({
        x: baseAge, xref: 'x', y: baseValue, yref: 'y',
        text: 'Configured', showarrow: false, yshift: 12,
        font: { size: 9, color: '#64748b' }, xanchor: 'center', yanchor: 'bottom',
      })
    }

    return { trace, annotations }
  }

  // ── Meltdown Optimizer state ──────────────────────────────────────────────

  const [meltSteps,   setMeltSteps]   = useState(40)
  const [meltResult,  setMeltResult]  = useState<MeltdownOptimizerResult | null>(null)
  const [meltRunning, setMeltRunning] = useState(false)

  function runMelt() {
    setMeltRunning(true)
    setTimeout(() => {
      const result = runMeltdownOptimizer(effectiveState, rateSchedule, { steps: meltSteps })
      setMeltResult(result)
      setMeltRunning(false)
    }, 20)
  }

  function applyOptimalCeilings() {
    if (!meltResult) return
    const currentValue = whatIfs.drawdownStrategy?.value ?? DEFAULT_WHATIFS.drawdownStrategy.value
    updateWhatIf('drawdownStrategy', {
      enabled: true,
      value: {
        ...currentValue,
        strategyType: 'spendGap',
        spendGapConfig: {
          ...withdrawalStrategy.spendGapConfig,
          meltdownA: {
            ...withdrawalStrategy.spendGapConfig.meltdownA,
            grossIncomeCeiling: meltResult.optimalCeilingA ?? withdrawalStrategy.spendGapConfig.meltdownA.grossIncomeCeiling,
          },
          meltdownB: {
            ...withdrawalStrategy.spendGapConfig.meltdownB,
            grossIncomeCeiling: meltResult.optimalCeilingB ?? withdrawalStrategy.spendGapConfig.meltdownB.grossIncomeCeiling,
          },
        },
      },
    })
  }

  // ── Coast FIRE Calculator state ───────────────────────────────────────────
  const [coastRateType, setCoastRateType] = useState<'plan' | 'historical'>('plan')
  const [coastEqAllocation, setCoastEqAllocation] = useState(60)
  const [coastStartYear, setCoastStartYear] = useState(1871)
  const [coastMinSuccessRate, setCoastMinSuccessRate] = useState(100)
  const [coastPlotMetric, setCoastPlotMetric] = useState<'worst' | 'median'>('worst')
  const [coastPlanResult, setCoastPlanResult] = useState<{
    coastYear: number | null
    coastAge: number | null
    currentPlanPathArray: number[]
    stopTodayPathArray: number[]
    stopCoastPathArray: number[]
    agesArray: number[]
    yearsArray: number[]
  } | null>(null)
  const [coastHistResult, setCoastHistResult] = useState<{
    coastYear: number | null
    coastAge: number | null
    successRateToday: number
    successRateCoast: number | null
    currentPlanSuccessRate: number
    currentPlanMedianPath: number[]
    currentPlanWorstPath: number[]
    stopTodayMedianPath: number[]
    stopTodayWorstPath: number[]
    stopCoastMedianPath: number[]
    stopCoastWorstPath: number[]
    agesArray: number[]
    yearsArray: number[]
  } | null>(null)
  const [coastRunning, setCoastRunning] = useState(false)

  const resetCoastCalculator = () => {
    setCoastRateType('plan')
    setCoastEqAllocation(60)
    setCoastStartYear(1871)
    setCoastMinSuccessRate(100)
    setCoastPlotMetric('worst')
    setCoastPlanResult(null)
    setCoastHistResult(null)
  }

  // Helper to generate modified AppState for stopping contributions in year Y (household)
  const getCoastState = (baseState: AppState, Y: number): AppState => {
    let testState = {
      ...baseState,
      rrspA: { ...baseState.rrspA },
      rrspB: { ...baseState.rrspB },
      tfsaA: { ...baseState.tfsaA },
      tfsaB: { ...baseState.tfsaB },
      nonRegA: { ...baseState.nonRegA },
      nonRegB: { ...baseState.nonRegB },
    }
    const lastDate = `${Y - 1}-12-31`
    
    if (testState.rrspA.contributionEndDate > lastDate) testState.rrspA.contributionEndDate = lastDate
    if (testState.rrspA.spousalLastContributionDate > lastDate) testState.rrspA.spousalLastContributionDate = lastDate
    if (testState.tfsaA.contributionEndDate > lastDate) testState.tfsaA.contributionEndDate = lastDate
    if (testState.nonRegA.contributionEndDate > lastDate) testState.nonRegA.contributionEndDate = lastDate

    if (testState.rrspB.contributionEndDate > lastDate) testState.rrspB.contributionEndDate = lastDate
    if (testState.rrspB.spousalLastContributionDate > lastDate) testState.rrspB.spousalLastContributionDate = lastDate
    if (testState.tfsaB.contributionEndDate > lastDate) testState.tfsaB.contributionEndDate = lastDate
    if (testState.nonRegB.contributionEndDate > lastDate) testState.nonRegB.contributionEndDate = lastDate
    
    return testState
  }

  // Helper to compute median trajectory across historical paths
  const getMedianPath = (paths: HistoricalPathResult[]): number[] => {
    if (paths.length === 0) return []
    const n = paths[0].portfolioBalances.length
    const medianBalances: number[] = []
    for (let i = 0; i < n; i++) {
      const vals = paths.map(p => p.portfolioBalances[i] ?? 0).sort((a, b) => a - b)
      const mid = Math.floor(vals.length / 2)
      const medianVal = vals.length % 2 !== 0
        ? vals[mid]
        : (vals[mid - 1] + vals[mid]) / 2
      medianBalances.push(medianVal)
    }
    return medianBalances
  }

  // Helper to compute worst-case trajectory across historical paths
  const getWorstPath = (paths: HistoricalPathResult[]): number[] => {
    if (paths.length === 0) return []
    let worst = paths[0]
    for (const p of paths) {
      if (p.finalBalance < worst.finalBalance) {
        worst = p
      }
    }
    return worst.portfolioBalances
  }

  useEffect(() => {
    if (coastStartYear > maxStartYearLimit) {
      const options = [2000, 1980, 1950, 1871]
      const best = options.find(yr => yr <= maxStartYearLimit) ?? 1871
      setCoastStartYear(best)
    }
  }, [maxStartYearLimit, coastStartYear])

  // ── Coast FIRE Calculator — Plan Rates Simulation ─────────────────────────
  const runCoastPlanCalculation = () => {
    setCoastRunning(true)
    setTimeout(() => {
      // Helper to test if stopping contributions in year Y succeeds (no shortfall warnings)
      const testCoastYear = (Y: number): boolean => {
        const testState = getCoastState(effectiveState, Y)
        const { warnings } = runProjection(testState, rateSchedule)
        return !warnings.some(w => w.includes('shortfall'))
      }

      const basePlanSucceeds = (() => {
        const { warnings } = runProjection(effectiveState, rateSchedule)
        return !warnings.some(w => w.includes('shortfall'))
      })()

      let coastYearResult: number | null = null
      if (basePlanSucceeds) {
        let lastSucceeded = endYear
        for (let Y = endYear; Y >= currentYear; Y--) {
          if (testCoastYear(Y)) {
            lastSucceeded = Y
          } else {
            break
          }
        }
        coastYearResult = lastSucceeded
      }

      const coastAgeResult = coastYearResult !== null ? startAge + (coastYearResult - currentYear) : null

      // Build chart paths (all the way to endYear)
      const agesArray: number[] = []
      const yearsArray: number[] = []
      for (let year = currentYear; year <= endYear; year++) {
        yearsArray.push(year)
        agesArray.push(startAge + (year - currentYear))
      }

      // 1. Current Plan Path
      const currentPlanPathArray = agesArray.map(age => {
        const year = currentYear + (age - startAge)
        const d = dataPoints.find(dp => dp.year === year)
        return d ? d.totalPortfolio : 0
      })

      // 2. Stop Saving Today Path
      const stopTodayState = getCoastState(effectiveState, currentYear)
      const stopTodayProj = runProjection(stopTodayState, rateSchedule)
      const stopTodayPathArray = agesArray.map(age => {
        const year = currentYear + (age - startAge)
        const d = stopTodayProj.dataPoints.find(dp => dp.year === year)
        return d ? d.totalPortfolio : 0
      })

      // 3. Stop Saving at Coast Age Path (only if coastYearResult is valid and in future)
      let stopCoastPathArray: number[] = []
      if (coastYearResult !== null && coastYearResult > currentYear) {
        const stopCoastState = getCoastState(effectiveState, coastYearResult)
        const stopCoastProj = runProjection(stopCoastState, rateSchedule)
        stopCoastPathArray = agesArray.map(age => {
          const year = currentYear + (age - startAge)
          const d = stopCoastProj.dataPoints.find(dp => dp.year === year)
          return d ? d.totalPortfolio : 0
        })
      }

      setCoastPlanResult({
        coastYear: coastYearResult,
        coastAge: coastAgeResult,
        currentPlanPathArray,
        stopTodayPathArray,
        stopCoastPathArray,
        agesArray,
        yearsArray,
      })
      setCoastRunning(false)
    }, 20)
  }

  const runCoastHistSimulation = () => {
    setCoastRunning(true)
    setTimeout(() => {
      // 1. Run historical analysis on the base plan (Current Plan)
      const histBase = runHistoricalAnalysis(effectiveState, {
        equityAllocationPct: coastEqAllocation,
        historicalStartYear: coastStartYear,
        resolution: 'annual',
      })

      const baseSucceeds = histBase.successRate >= coastMinSuccessRate / 100

      let coastYearResult: number | null = null
      let histCoast: HistoricalAnalysisResult | null = null

      if (baseSucceeds) {
        // Helper to test a year
        const testCoastYear = (Y: number): boolean => {
          const testState = getCoastState(effectiveState, Y)
          const hist = runHistoricalAnalysis(testState, {
            equityAllocationPct: coastEqAllocation,
            historicalStartYear: coastStartYear,
            resolution: 'annual',
          })
          return hist.successRate >= coastMinSuccessRate / 100
        }

        // Work backwards from endYear to currentYear
        let lastSucceeded = endYear
        for (let Y = endYear; Y >= currentYear; Y--) {
          if (testCoastYear(Y)) {
            lastSucceeded = Y
          } else {
            break
          }
        }
        coastYearResult = lastSucceeded

        // Run historical analysis for the chosen Coast Year
        if (coastYearResult !== null) {
          const coastState = getCoastState(effectiveState, coastYearResult)
          histCoast = runHistoricalAnalysis(coastState, {
            equityAllocationPct: coastEqAllocation,
            historicalStartYear: coastStartYear,
            resolution: 'annual',
          })
        }
      }

      // Run historical analysis for Stop Saving Today
      const todayState = getCoastState(effectiveState, currentYear)
      const histToday = runHistoricalAnalysis(todayState, {
        equityAllocationPct: coastEqAllocation,
        historicalStartYear: coastStartYear,
        resolution: 'annual',
      })

      // Compute median paths
      const agesArr: number[] = []
      const yearsArr: number[] = []
      for (let year = currentYear; year <= endYear; year++) {
        yearsArr.push(year)
        agesArr.push(startAge + (year - currentYear))
      }

      const currentPlanMedianPath = getMedianPath(histBase.paths)
      const currentPlanWorstPath = getWorstPath(histBase.paths)
      const stopTodayMedianPath = getMedianPath(histToday.paths)
      const stopTodayWorstPath = getWorstPath(histToday.paths)
      const stopCoastMedianPath = histCoast ? getMedianPath(histCoast.paths) : []
      const stopCoastWorstPath = histCoast ? getWorstPath(histCoast.paths) : []

      setCoastHistResult({
        coastYear: coastYearResult,
        coastAge: coastYearResult !== null ? startAge + (coastYearResult - currentYear) : null,
        successRateToday: histToday.successRate,
        successRateCoast: histCoast ? histCoast.successRate : null,
        currentPlanSuccessRate: histBase.successRate,
        currentPlanMedianPath,
        currentPlanWorstPath,
        stopTodayMedianPath,
        stopTodayWorstPath,
        stopCoastMedianPath,
        stopCoastWorstPath,
        agesArray: agesArr,
        yearsArray: yearsArr,
      })
      setCoastRunning(false)
    }, 20)
  }

  // ── Meltdown chart builder ────────────────────────────────────────────────

  function buildMeltdownChart(
    sweep: MeltdownOptimizerResult['sweepA'],
    optimalCeiling: number | null,
    incomeFloor: number,
    oasClawbackThreshold: number,
    fullClawbackIncome: number,
  ) {
    const xs = sweep.map(p => p.grossIncomeCeiling)
    const ys = sweep.map(p => p.lifetimeTax)

    const trace: Data = {
      x: xs, y: ys,
      type: 'scatter', mode: 'lines',
      line: { color: '#334155', width: 2 },
      name: 'Lifetime Tax',
      hovertemplate: 'Ceiling: %{x:$,.0f}<br>Tax: %{y:$,.0f}<extra></extra>',
    }

    const shapes: object[] = []
    const annotations: object[] = []

    // Income floor line
    if (incomeFloor > 0) {
      shapes.push({
        type: 'line', x0: incomeFloor, x1: incomeFloor, y0: 0, y1: 1, yref: 'paper',
        line: { color: '#94a3b8', dash: 'dot', width: 1.5 },
      })
      annotations.push({
        x: incomeFloor, xref: 'x', y: 0.97, yref: 'paper',
        text: 'Floor', showarrow: false,
        font: { size: 9, color: '#64748b' }, xanchor: 'left', yanchor: 'top',
      })
    }

    // OAS clawback start line
    if (oasClawbackThreshold > 0) {
      shapes.push({
        type: 'line', x0: oasClawbackThreshold, x1: oasClawbackThreshold,
        y0: 0, y1: 1, yref: 'paper',
        line: { color: '#f59e0b', dash: 'dot', width: 1 },
      })
      annotations.push({
        x: oasClawbackThreshold, xref: 'x', y: 0.80, yref: 'paper',
        text: 'Clawback<br>Start', showarrow: false,
        font: { size: 9, color: '#d97706' }, xanchor: 'left', yanchor: 'top',
      })
    }

    // OAS fully clawed back line (only draw if it falls within the sweep range)
    const xMax = xs[xs.length - 1] ?? 0
    if (fullClawbackIncome > oasClawbackThreshold && fullClawbackIncome <= xMax + 1) {
      shapes.push({
        type: 'line', x0: fullClawbackIncome, x1: fullClawbackIncome,
        y0: 0, y1: 1, yref: 'paper',
        line: { color: '#f59e0b', dash: 'dash', width: 1 },
      })
      annotations.push({
        x: fullClawbackIncome, xref: 'x', y: 0.65, yref: 'paper',
        text: 'OAS Fully<br>Clawed Back', showarrow: false,
        font: { size: 9, color: '#d97706' }, xanchor: 'left', yanchor: 'top',
      })
    }

    // Optimal ceiling line
    if (optimalCeiling !== null) {
      shapes.push({
        type: 'line', x0: optimalCeiling, x1: optimalCeiling, y0: 0, y1: 1, yref: 'paper',
        line: { color: '#7B1515', dash: 'dash', width: 2 },
      })
      annotations.push({
        x: optimalCeiling, xref: 'x', y: 0.90, yref: 'paper',
        text: `Optimal: ${fmt(optimalCeiling)}`, showarrow: false,
        font: { size: 9, color: '#7B1515' }, xanchor: 'left', yanchor: 'top',
      })
    }

    return { trace, shapes, annotations }
  }

  // ── JSX ───────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {/* ── Probability Analysis ──────────────────────────────────────────── */}
      <SectionDivider title="Probability Analysis" />
            <CardGrid>
  <SectionCard title="Monte Carlo Simulation" width="full"
          onReset={() => {
            setMcMethod('traditional')
            setMcDistribution('normal')
            setMcDegreesOfFreedom(4)
            setMcSkewness(-1.5)
            setMcCmaReductionPct(1.5)
            setMcDynamicCmaInitialReductionPct(2.0)
            setMcDynamicCmaDecayYears(10)
            setMcEquityAllocationPct(60)
            setMcHistoricalStartYear(1871)
            setMcBootstrapBlockSize(5)
            setMcSimulations(500)
            setMcVolatilityPct(12)
            setMcRegimePreset('standard')
            setMcRegime1ReturnPct(8.0)
            setMcRegime1VolPct(10.0)
            setMcRegime1Duration(6.0)
            setMcRegime2ReturnPct(-4.0)
            setMcRegime2VolPct(22.0)
            setMcRegime2Duration(1.5)
            setMcResult(null)
          }}
          info={
            <div className="space-y-2 text-sm">
              <p>Monte Carlo runs your plan hundreds of times, varying annual market returns randomly around the configured rate profile. Everything else — income, tax, spending phases, drawdown strategy, and all active modifications — is held fixed. Only market sequence varies.</p>
              <p><strong>Monte Carlo Method</strong> — Choose the underlying simulation model:
                <ul className="list-disc pl-4 mt-1 space-y-1">
                  <li><em>Traditional</em> — Uses the baseline rate profile as the mean expected return.</li>
                  <li><em>Reduced CMA</em> — Lowers the baseline expected return rates across the entire plan by a fixed reduction percentage to build in a conservative margin of safety.</li>
                  <li><em>Dynamic Reduced CMA</em> — Lowers baseline expected return rates in the early years of the plan. The reduction starts at a maximum and decays linearly to 0% over a configured decay period (e.g. 10 years). This models short-term market headwinds (like high starting valuations) returning to historical norms.</li>
                  <li><em>Simple Bootstrap</em> — Non-parametric sampling. Draws random calendar-year returns directly from actual history (Shiller monthly dataset: 1871–2025) for a selected asset allocation and historical period.</li>
                  <li><em>Block Bootstrap</em> — Draws random *consecutive blocks* of historical returns (e.g. 5-year blocks) to preserve business cycles, multi-year recessions, and momentum in market sequences.</li>
                  <li><em>Regime Switching</em> — Simulates economic expansions (long, high return, low volatility) and contractions (short, negative return, high volatility), with Markov transitions between the two regimes.</li>
                </ul>
              </p>
              <p><strong>Historical Period</strong> — Filters the dataset for bootstrapping to specific economic epochs:
                <ul className="list-disc pl-4 mt-1 space-y-1">
                  <li><em>1871–2025</em> — Full history (155 years), capturing early industrial cycles, depressions, and wars.</li>
                  <li><em>1950–2025</em> — Post-WWII modern era (76 years).</li>
                  <li><em>1980–2025</em> — Post-Stagflation declining interest rate era (46 years).</li>
                  <li><em>2000–2025</em> — 21st Century tech-bubble and recovery era (26 years).</li>
                  <li><em>2015–2025</em> — Recent high-growth and high-volatility decade (11 years).</li>
                </ul>
              </p>
              <p><strong>Noise Distribution</strong> — Sets the shape of the random market perturbations:
                <ul className="list-disc pl-4 mt-1 space-y-1">
                  <li><em>Normal (Gaussian)</em> — Standard symmetric bell curve.</li>
                  <li><em>Student's t (Fat Tails)</em> — Models more frequent extreme positive and negative market shocks.</li>
                  <li><em>Skewed Normal</em> — Introduces asymmetry. Negative skewness models sharp, severe market crashes and quieter bull markets.</li>
                </ul>
              </p>
              <p>All distributions are mathematically standardized to preserve your exact configured mean return (adjusted by any CMA reduction) and volatility, changing only the shape and severity of extreme events.</p>
              <p><strong>Return Volatility (σ)</strong> — The standard deviation of annual return noise added to each year's base rate. 12% is a reasonable default for a balanced equity/bond portfolio. Lower values produce a tighter fan; higher values widen it.</p>
              <p><strong>Probability of Success</strong> — Percentage of simulations where the portfolio remains above zero at the final year of the plan. 90%+ is generally considered robust; below 70% warrants strategy changes.</p>
              <p><strong>Median Depletion Age</strong> — In simulations that do deplete, the median age of the reference person when the portfolio first reaches zero. Only shown when at least 5% of simulations deplete.</p>
              <p>The fan chart shows the distribution of portfolio outcomes over time. The red line is the deterministic result of the configured rate profile. Grey bands show the 10th–90th and 25th–75th percentile ranges. Black dotted lines are the best and worst case outcomes across all simulations.</p>
            </div>
          }>
  
          {/* Controls */}
          <div className="flex items-end gap-4 mb-4 flex-wrap">
            <button className="btn-primary" onClick={runMC} disabled={mcRunning}>
              {mcRunning ? 'Running…' : mcResult ? 'Re-Run' : 'Run'}
            </button>

            <SelectInput
              label="Method"
              value={mcMethod}
              onChange={v => setMcMethod(v as MonteCarloOptions['method'])}
              options={[
                { value: 'traditional', label: 'Traditional' },
                { value: 'reduced', label: 'Reduced CMA' },
                { value: 'dynamic', label: 'Dynamic Reduced CMA' },
                { value: 'simple_bootstrap', label: 'Simple Bootstrap' },
                { value: 'block_bootstrap', label: 'Block Bootstrap' },
                { value: 'regime', label: 'Regime Switching' },
              ]}
            />

            {mcMethod === 'regime' && (
              <SelectInput
                label="Regime Preset"
                value={mcRegimePreset}
                onChange={v => handleRegimePresetChange(v as 'standard' | 'stagnation' | 'stagflation' | 'custom')}
                options={[
                  { value: 'standard', label: 'Standard Economic Cycles' },
                  { value: 'stagnation', label: 'Secular Stagnation' },
                  { value: 'stagflation', label: 'Stagflationary Era' },
                  { value: 'custom', label: 'Custom Parameters' },
                ]}
                tooltip="Select a preset economic cycle profile or customize parameters manually below"
              />
            )}

            <NumberInput label="Simulations" value={mcSimulations} onChange={setMcSimulations}
              min={100} max={2000} step={100} decimals={0} size="sm" />

            {(mcMethod === 'simple_bootstrap' || mcMethod === 'block_bootstrap') && (
              <>
                <SelectInput
                  label="Asset Allocation"
                  value={mcEquityAllocationPct.toString()}
                  onChange={v => setMcEquityAllocationPct(parseInt(v))}
                  options={[
                    { value: '100', label: '100% Equity / 0% Bond' },
                    { value: '80', label: '80% Equity / 20% Bond' },
                    { value: '60', label: '60% Equity / 40% Bond' },
                    { value: '40', label: '40% Equity / 60% Bond' },
                    { value: '20', label: '20% Equity / 80% Bond' },
                  ]}
                  tooltip="Compounds historical monthly returns for this target allocation"
                />

                <SelectInput
                  label="Historical Period"
                  value={mcHistoricalStartYear.toString()}
                  onChange={v => setMcHistoricalStartYear(parseInt(v))}
                  options={[
                    { value: '1871', label: '1871–2025 (Full History)' },
                    { value: '1950', label: '1950–2025 (Modern Era)' },
                    { value: '1980', label: '1980–2025 (Post-Stagflation)' },
                    { value: '2000', label: '2000–2025 (21st Century)' },
                    { value: '2015', label: '2015–2025 (Recent Decade)' },
                  ]}
                  tooltip="Filters the historical dataset to only draw from this period"
                />

                {mcMethod === 'block_bootstrap' && (
                  <NumberInput
                    label="Block Size (Years)"
                    value={mcBootstrapBlockSize}
                    onChange={setMcBootstrapBlockSize}
                    min={2}
                    max={20}
                    step={1}
                    decimals={0}
                    size="sm"
                    tooltip="The number of consecutive years to draw from history as a single block"
                  />
                )}
              </>
            )}

            {(mcMethod === 'traditional' || mcMethod === 'reduced' || mcMethod === 'dynamic') && (
              <>
                <NumberInput label="Volatility σ (%)" value={mcVolatilityPct} onChange={setMcVolatilityPct}
                  min={1} max={30} step={1} decimals={0} size="sm" />

                {mcMethod === 'reduced' && (
                  <NumberInput
                    label="CMA Reduction (%)"
                    value={mcCmaReductionPct}
                    onChange={setMcCmaReductionPct}
                    min={0}
                    max={10}
                    step={0.1}
                    decimals={2}
                    size="sm"
                    tooltip="Subtracts a constant percentage from expected returns to stress-test plans conservatively"
                  />
                )}

                {mcMethod === 'dynamic' && (
                  <>
                    <NumberInput
                      label="Initial Reduction (%)"
                      value={mcDynamicCmaInitialReductionPct}
                      onChange={setMcDynamicCmaInitialReductionPct}
                      min={0}
                      max={10}
                      step={0.1}
                      decimals={2}
                      size="sm"
                      tooltip="Subtracts this expected return percentage in year 1"
                    />
                    <NumberInput
                      label="Decay Period (Years)"
                      value={mcDynamicCmaDecayYears}
                      onChange={setMcDynamicCmaDecayYears}
                      min={1}
                      max={50}
                      step={1}
                      decimals={0}
                      size="sm"
                      tooltip="The number of years over which the reduction linearly decays to 0%"
                    />
                  </>
                )}

                <SelectInput
                  label="Distribution"
                  value={mcDistribution}
                  onChange={v => setMcDistribution(v as NonNullable<MonteCarloOptions['distribution']>)}
                  options={[
                    { value: 'normal', label: 'Normal (Gaussian)' },
                    { value: 'student_t', label: "Student's t (Fat Tails)" },
                    { value: 'skewed_normal', label: 'Skewed Normal (Asymmetric)' },
                  ]}
                />

                {mcDistribution === 'student_t' && (
                  <NumberInput
                    label="Deg. of Freedom (ν)"
                    value={mcDegreesOfFreedom}
                    onChange={setMcDegreesOfFreedom}
                    min={3}
                    max={30}
                    step={1}
                    decimals={0}
                    size="sm"
                    tooltip="Lower values create thicker/fatter tails (more extreme market moves)"
                  />
                )}

                {mcDistribution === 'skewed_normal' && (
                  <NumberInput
                    label="Skewness (α)"
                    value={mcSkewness}
                    onChange={setMcSkewness}
                    min={-5}
                    max={5}
                    step={0.1}
                    decimals={1}
                    size="sm"
                    tooltip="Negative values represent negative skewness (larger/more frequent market crashes)"
                  />
                )}
              </>
            )}


          </div>

          {mcMethod === 'regime' && (
            <div className="mb-6 max-w-xl overflow-x-auto rounded border border-slate-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th colSpan={3} className="px-3 py-2 text-left font-medium text-slate-700">Regime Parameters</th>
                  </tr>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                    <th className="px-3 py-2 text-left font-medium">Parameter</th>
                    <th className="px-3 py-2 text-center font-medium">Regime 1 (Expansion / Bull)</th>
                    <th className="px-3 py-2 text-center font-medium">Regime 2 (Contraction / Bear)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/50">
                    <td className="px-3 py-2 text-slate-600">Expected Return (%)</td>
                    <td className="px-3 py-2 text-center w-1/3">
                      <NumberInput label="" value={mcRegime1ReturnPct} onChange={v => handleRegimeChange('r1Ret', v)} size="sm" decimals={1} step={0.1} />
                    </td>
                    <td className="px-3 py-2 text-center w-1/3">
                      <NumberInput label="" value={mcRegime2ReturnPct} onChange={v => handleRegimeChange('r2Ret', v)} size="sm" decimals={1} step={0.1} />
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="px-3 py-2 text-slate-600">Volatility σ (%)</td>
                    <td className="px-3 py-2 text-center">
                      <NumberInput label="" value={mcRegime1VolPct} onChange={v => handleRegimeChange('r1Vol', v)} size="sm" decimals={1} step={0.1} min={1} max={50} />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <NumberInput label="" value={mcRegime2VolPct} onChange={v => handleRegimeChange('r2Vol', v)} size="sm" decimals={1} step={0.1} min={1} max={50} />
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="px-3 py-2 text-slate-600">Average Duration (Years)</td>
                    <td className="px-3 py-2 text-center">
                      <NumberInput label="" value={mcRegime1Duration} onChange={v => handleRegimeChange('r1Dur', v)} size="sm" decimals={1} step={0.5} min={0.5} max={50} />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <NumberInput label="" value={mcRegime2Duration} onChange={v => handleRegimeChange('r2Dur', v)} size="sm" decimals={1} step={0.5} min={0.5} max={50} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
  
          {mcRunning && (
            <div className="flex flex-col items-center justify-center h-80 border border-dashed border-slate-200 rounded-lg text-slate-400 text-sm">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                <span>Running simulation…</span>
              </div>
            </div>
          )}

          {!mcRunning && !mcResult && (
            <div className="flex flex-col items-center justify-center h-20 border border-dashed border-slate-200 rounded-lg text-slate-400 text-sm">
              <span>Select options and click "Run" to simulate Monte Carlo outcomes.</span>
            </div>
          )}
  
          {mcResult && !mcRunning && (() => {
            const refName    = ageReferencePerson === 'personB' ? bName : aName
            const successPct = mcResult.probabilityOfSuccess * 100
            const deplPct    = mcResult.depletionPct * 100
  
            const mcTraces: Data[] = [
              // Outer band: P10 → P90
              { x: mcResult.years, y: mcResult.p10, type: 'scatter', mode: 'lines',
                line: { color: '#94a3b8', width: 0 }, showlegend: false,
                hovertemplate: '%{y:$,.0f}<extra>P10</extra>' },
              { x: mcResult.years, y: mcResult.p90, type: 'scatter', mode: 'lines',
                fill: 'tonexty', fillcolor: 'rgba(140,140,140,0.15)',
                line: { color: '#94a3b8', width: 0 }, name: 'P10–P90',
                hovertemplate: '%{y:$,.0f}<extra>P90</extra>' },
              // Inner band: P25 → P75
              { x: mcResult.years, y: mcResult.p25, type: 'scatter', mode: 'lines',
                line: { color: '#64748b', width: 0 }, showlegend: false,
                hovertemplate: '%{y:$,.0f}<extra>P25</extra>' },
              { x: mcResult.years, y: mcResult.p75, type: 'scatter', mode: 'lines',
                fill: 'tonexty', fillcolor: 'rgba(100,100,100,0.20)',
                line: { color: '#64748b', width: 0 }, name: 'P25–P75',
                hovertemplate: '%{y:$,.0f}<extra>P75</extra>' },
              // Median
              { x: mcResult.years, y: mcResult.p50, type: 'scatter', mode: 'lines',
                line: { color: '#94a3b8', width: 1.5 }, name: 'Median (P50)',
                hovertemplate: '%{y:$,.0f}<extra>Median</extra>' },
              // Worst case envelope
              { x: mcResult.years, y: mcResult.pMin, type: 'scatter', mode: 'lines',
                line: { color: '#1e293b', width: 1, dash: 'dot' }, name: 'Worst case',
                hovertemplate: '%{y:$,.0f}<extra>Worst</extra>' },
              // Configured rate profile (deterministic)
              { x: dataPoints.map(d => d.year), y: dataPoints.map(d => d.totalPortfolio),
                type: 'scatter', mode: 'lines',
                line: { color: '#7B1515', width: 2 }, name: 'Configured profile',
                hovertemplate: '%{y:$,.0f}<extra>Configured</extra>' },
            ]
  
            return (
              <>
                <div className="border-t border-slate-200 my-6" />
                {/* Stats tiles */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-3 text-center">
                    <div className="text-xs text-slate-400">Probability of Success</div>
                    <div className="text-2xl font-bold mt-0.5" style={{ color: '#7B1515' }}>
                      {successPct.toFixed(1)}%
                    </div>
                    <div className="text-xs text-slate-400">portfolio survives to end of plan</div>
                  </div>
                  <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-3 text-center">
                    <div className="text-xs text-slate-400">Depletion Rate</div>
                    <div className="text-2xl font-bold mt-0.5" style={{ color: '#7B1515' }}>
                      {deplPct.toFixed(1)}%
                    </div>
                    <div className="text-xs text-slate-400">of simulations depleted</div>
                  </div>
                  <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-3 text-center">
                    <div className="text-xs text-slate-400">Earliest Depletion Age</div>
                    <div className="text-2xl font-bold mt-0.5" style={{ color: '#7B1515' }}>
                      {mcResult.earliestDepletionAge !== null ? mcResult.earliestDepletionAge.toFixed(1) : '—'}
                    </div>
                    <div className="text-xs text-slate-400">
                      {mcResult.earliestDepletionAge !== null ? `${refName}'s age` : 'no simulations depleted'}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-3 text-center">
                    <div className="text-xs text-slate-400">Median Depletion Age</div>
                    <div className="text-2xl font-bold mt-0.5" style={{ color: '#7B1515' }}>
                      {mcResult.medianDepletionAge !== null ? mcResult.medianDepletionAge.toFixed(1) : '—'}
                    </div>
                    <div className="text-xs text-slate-400">
                      {mcResult.medianDepletionAge !== null
                        ? `${refName}'s age at depletion`
                        : 'fewer than 5% of sims depleted'}
                    </div>
                  </div>
                </div>
  
                {/* Fan chart */}
                <div>
                  <div className="text-sm font-semibold mb-2 text-slate-700">Monte Carlo Portfolio Projections</div>
                  <PlotlyChart
                    data={mcTraces}
                    layout={{
                      yaxis: { tickformat: ',.0f', title: { text: 'Portfolio', font: { size: 11 } } },
                      xaxis: { title: { text: 'Year', font: { size: 11 } } },
                      legend: { orientation: 'h', yanchor: 'bottom', y: 1.02, x: 0 },
                    }}
                    style={{ height: 380 }}
                  />
                </div>
  
                {/* Milestone Px table */}
                <div className="mt-4 overflow-x-auto rounded border border-slate-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th colSpan={7} className="px-3 py-2 text-left font-medium text-slate-700">
                          Portfolio by Percentile
                        </th>
                      </tr>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs">
                        <th className="px-3 py-2 text-left font-medium">Milestone</th>
                        <th className="px-3 py-2 text-right font-medium">Year</th>
                        <th className="px-3 py-2 text-right font-medium text-slate-700 bg-amber-50">P10</th>
                        <th className="px-3 py-2 text-right font-medium">P25</th>
                        <th className="px-3 py-2 text-right font-medium">P50</th>
                        <th className="px-3 py-2 text-right font-medium">P75</th>
                        <th className="px-3 py-2 text-right font-medium">P90</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {mcResult.milestones.map(m => (
                        <tr key={m.year} className="hover:bg-slate-50/50">
                          <td className="px-3 py-2 text-slate-600">{m.label}</td>
                          <td className="px-3 py-2 text-right text-slate-500 text-xs">{m.year}</td>
                          <td className="px-3 py-2 text-right font-semibold text-slate-800 bg-amber-50">{fmt(m.p10)}</td>
                          <td className="px-3 py-2 text-right text-slate-600">{fmt(m.p25)}</td>
                          <td className="px-3 py-2 text-right text-slate-600">{fmt(m.p50)}</td>
                          <td className="px-3 py-2 text-right text-slate-600">{fmt(m.p75)}</td>
                          <td className="px-3 py-2 text-right text-slate-600">{fmt(m.p90)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )
          })()}
        </SectionCard>

        <SectionCard
          title="Historical Sequence Stress Test"
          width="full"
          onReset={() => {
            setHistEqAllocation(60)
            setHistStartYear(1871)
            setHistResolution('monthly')
            setHistResult(null)
          }}
          info={
            <div className="space-y-2 text-sm">
              <p>
                The Historical Rolling Periods Analyzer runs your plan against actual chronological windows of historical market data. 
                Unlike randomized Monte Carlo methods, this preserves the exact multi-year inflation, interest rate, and stock cycles (e.g. the 1929 Great Depression, the 1970s Stagflation) as they occurred.
              </p>
              <p><strong>Start Date Resolution:</strong>
                <ul className="list-disc pl-4 mt-1 space-y-1">
                  <li><em>Annual (Jan 1st):</em> Simulates paths starting on Jan 1st of each calendar year (~125 paths).</li>
                  <li><em>Monthly (Any Month):</em> Creates 12 times as many simulation paths by starting a new timeline in any month of history (~1,500 paths). This is highly recommended as it captures precise peaks and troughs (e.g., retiring right before a mid-year crash).</li>
                </ul>
              </p>
              <p><strong>Worst and Best Paths:</strong> The chart highlights the worst historical period in solid red, the best historical period in solid green, and all other historical paths in light gray.</p>
            </div>
          }
        >
          {/* Controls */}
          <div className="flex items-end gap-4 mb-4 flex-wrap">
            <button className="btn-primary" onClick={runHistAnalysis} disabled={histRunning}>
              {histRunning ? 'Running…' : histResult ? 'Re-Run' : 'Run'}
            </button>

            <SelectInput
              label="Asset Allocation"
              value={histEqAllocation.toString()}
              onChange={v => setHistEqAllocation(parseInt(v))}
              options={[
                { value: '100', label: '100% Equity / 0% Bond' },
                { value: '80', label: '80% Equity / 20% Bond' },
                { value: '60', label: '60% Equity / 40% Bond' },
                { value: '40', label: '40% Equity / 60% Bond' },
                { value: '20', label: '20% Equity / 80% Bond' },
              ]}
              tooltip="Target mix compiled dynamically from historical monthly returns"
            />

            <SelectInput
              label="Period"
              value={histStartYear.toString()}
              onChange={v => setHistStartYear(parseInt(v))}
              options={[
                { value: '1871', label: '1871 (Full History)', disabled: 1871 > maxStartYearLimit },
                { value: '1950', label: '1950 (Modern Era)', disabled: 1950 > maxStartYearLimit },
                { value: '1980', label: '1980 (Post-Stagflation)', disabled: 1980 > maxStartYearLimit },
                { value: '2000', label: '2000 (21st Century)', disabled: 2000 > maxStartYearLimit },
              ]}
              tooltip="The starting year boundary for the simulation series"
            />

            <SelectInput
              label="Resolution"
              value={histResolution}
              onChange={v => setHistResolution(v as 'annual' | 'monthly')}
              options={[
                { value: 'annual', label: 'Annual' },
                { value: 'monthly', label: 'Monthly' },
              ]}
              tooltip="Annual uses January starts only; Monthly runs 12x more paths starting in any month"
            />


          </div>

          {histRunning && (
            <div className="flex flex-col items-center justify-center h-80 border border-dashed border-slate-200 rounded-lg text-slate-400 text-sm">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                <span>Running simulation…</span>
              </div>
            </div>
          )}

          {!histRunning && !histResult && (
            <div className="flex flex-col items-center justify-center h-20 border border-dashed border-slate-200 rounded-lg text-slate-400 text-sm">
              <span>Select options and click "Run" to stress-test historical rolling periods.</span>
            </div>
          )}

          {histResult && !histRunning && (
            <>
              <div className="border-t border-slate-200 my-6" />
              <div className="space-y-6">
              {/* Stats tiles */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-3 text-center">
                  <div className="text-xs text-slate-400">Historical Success Rate</div>
                  <div className="text-2xl font-bold mt-0.5" style={{ color: '#7B1515' }}>
                    {(histResult.successRate * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-slate-400">
                    {histResult.paths.length - histResult.depletionCount} of {histResult.paths.length} periods survived
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-3 text-center">
                  <div className="text-xs text-slate-400">Worst Start Period</div>
                  <div className="text-2xl font-bold mt-0.5 truncate" style={{ color: '#7B1515' }}>
                    {histResult.worstYearLabel}
                  </div>
                  <div className="text-xs text-slate-400">
                    Ended with {histResult.worstYearBalance < 1000 ? 'Depletion' : fmt(histResult.worstYearBalance)}
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-3 text-center">
                  <div className="text-xs text-slate-400">Best Start Period</div>
                  <div className="text-2xl font-bold mt-0.5 truncate" style={{ color: '#7B1515' }}>
                    {histResult.bestYearLabel}
                  </div>
                  <div className="text-xs text-slate-400">
                    Ended with {fmt(histResult.bestYearBalance)}
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-3 text-center">
                  <div className="text-xs text-slate-400">Median Final Balance</div>
                  <div className="text-2xl font-bold mt-0.5 truncate" style={{ color: '#7B1515' }}>
                    {fmt(histResult.medianFinalBalance)}
                  </div>
                  <div className="text-xs text-slate-400">
                    todays value across all periods
                  </div>
                </div>
              </div>

              {/* Spaghetti Plot */}
              <div>
                <div className="text-sm font-semibold mb-2 text-slate-700">Projections for Historical Periods Since {histStartYear}</div>
                <PlotlyChart
                  data={histChartTraces}
                  layout={{
                    yaxis: { tickformat: ',.0f', title: { text: 'Portfolio Balance ($)', font: { size: 11 } } },
                    xaxis: { title: { text: `${refName}'s Age`, font: { size: 11 } } },
                    legend: { orientation: 'h', yanchor: 'bottom', y: 1.02, x: 0 },
                  }}
                  style={{ height: 420 }}
                />
              </div>

              {/* Scrollable details table of historical periods */}
              <div className="overflow-x-auto rounded border border-slate-200 max-h-80 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 z-10 bg-slate-50">
                    <tr className="bg-slate-50">
                      <th colSpan={4} className="px-3 py-2 text-left font-medium text-slate-700 shadow-[inset_0_-1px_0_0_#e2e8f0]">
                        Historical Periods Sorted By Performance
                      </th>
                    </tr>
                    <tr className="bg-slate-50 text-slate-500">
                      <th className="px-3 py-2 text-left font-medium shadow-[inset_0_-1px_0_0_#e2e8f0]">Start Year</th>
                      <th className="px-3 py-2 text-center font-medium shadow-[inset_0_-1px_0_0_#e2e8f0]">Status</th>
                      <th className="px-3 py-2 text-center font-medium shadow-[inset_0_-1px_0_0_#e2e8f0]">Depletion Age</th>
                      <th className="px-3 py-2 text-right font-medium shadow-[inset_0_-1px_0_0_#e2e8f0]">Final Portfolio Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {histSortedPaths.map((p, idx) => (
                      <tr key={idx} className={`hover:bg-slate-50/50 ${p.depleted ? 'bg-red-50/20' : ''}`}>
                        <td className="px-3 py-2 font-medium text-slate-700">{p.label}</td>
                        <td className="px-3 py-2 text-center">
                          {p.depleted ? (
                            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-800">
                              Depleted
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800">
                              Succeeded
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-center text-slate-600">
                          {p.depleted && p.depletionAge ? `${p.depletionAge} yrs` : '—'}
                        </td>
                        <td className="px-3 py-2 text-right font-mono text-slate-700">
                          {fmt(p.finalBalance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            </>
          )}
        </SectionCard>

        <SectionCard
          title="Sustainable Spending Sweep"
          width="full"
          onReset={() => {
            setSweepEqAllocation(60)
            setSweepStartYear(1871)
            setSweepResult(null)
          }}
          info={
            <div className="space-y-2 text-sm">
              <p>
                The Sustainable Spending Sweep simulates your plan across a range of flat base retirement spending levels using historical rolling periods.
              </p>
              <p>
                For each simulated spending level, the engine overrides all retirement spending phases with that flat level, clears additional/lumpy expenses for a clean baseline check, and calculates the historical success rate.
              </p>
              <p>
                This allows you to visualize how sensitive your plan's viability is to different levels of ongoing basic retirement expenses.
              </p>
              <p>
                The <strong>Flat Spending Success Rate</strong> curve (red line) simulates a simplified plan with constant baseline spending and no additional/lumpy expenses. Your <strong>Full Configured Plan</strong> (gold diamond) includes all your custom spending phases and extra/lumpy expenses. If your actual plan has higher spending later or large one-time expenses, the gold diamond will naturally sit below the red curve.
              </p>
            </div>
          }
        >
          {/* Controls */}
          <div className="flex items-end gap-4 mb-4 flex-wrap">
            <button className="btn-primary" onClick={runSweep} disabled={sweepRunning}>
              {sweepRunning ? 'Running…' : sweepResult ? 'Re-Run' : 'Run'}
            </button>

            <SelectInput
              label="Asset Allocation"
              value={sweepEqAllocation.toString()}
              onChange={v => setSweepEqAllocation(parseInt(v))}
              options={[
                { value: '100', label: '100% Equity / 0% Bond' },
                { value: '80', label: '80% Equity / 20% Bond' },
                { value: '60', label: '60% Equity / 40% Bond' },
                { value: '40', label: '40% Equity / 60% Bond' },
                { value: '20', label: '20% Equity / 80% Bond' },
              ]}
              tooltip="Target mix compiled dynamically from historical monthly returns"
            />

            <SelectInput
              label="Period"
              value={sweepStartYear.toString()}
              onChange={v => setSweepStartYear(parseInt(v))}
              options={[
                { value: '1871', label: '1871 (Full History)', disabled: 1871 > maxStartYearLimit },
                { value: '1950', label: '1950 (Modern Era)', disabled: 1950 > maxStartYearLimit },
                { value: '1980', label: '1980 (Post-Stagflation)', disabled: 1980 > maxStartYearLimit },
                { value: '2000', label: '2000 (21st Century)', disabled: 2000 > maxStartYearLimit },
              ]}
              tooltip="The starting year boundary for the simulation series"
            />


          </div>

          {sweepRunning && (
            <div className="flex flex-col items-center justify-center h-80 border border-dashed border-slate-200 rounded-lg text-slate-400 text-sm">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                <span>Running simulation…</span>
              </div>
            </div>
          )}

          {!sweepRunning && !sweepResult && (
            <div className="flex flex-col items-center justify-center h-20 border border-dashed border-slate-200 rounded-lg text-slate-400 text-sm">
              <span>Select options and click "Run" to sweep sustainable spending levels.</span>
            </div>
          )}

          {sweepResult && !sweepRunning && (
            <>
              <div className="border-t border-slate-200 my-6" />
              <div className="space-y-6">
              {/* Stats tiles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-3 text-center">
                  <div className="text-xs text-slate-400">Full Plan Success Rate</div>
                  <div className="text-2xl font-bold mt-0.5" style={{ color: '#7B1515' }}>
                    {(sweepResult.currentSuccessRate * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-slate-400">
                    Includes all configured spending phases and extra expenses
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-3 text-center">
                  <div className="text-xs text-slate-400">P90 Sustainable Spending</div>
                  <div className="text-2xl font-bold mt-0.5" style={{ color: '#7B1515' }}>
                    {p90SpendingLabel}
                  </div>
                  <div className="text-xs text-slate-400">
                    Sustainable spending with at least 90% survival rate
                  </div>
                </div>
              </div>

              {/* Chart & Benchmarks Table */}
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold mb-2 text-slate-700">Success Rate at Base Spending Levels</div>
                  <PlotlyChart
                    data={sweepChartTraces}
                    layout={{
                      yaxis: { 
                        title: { text: 'Success Rate (%)', font: { size: 11 } },
                        range: [0, 105] 
                      },
                      xaxis: { 
                        tickformat: ',.0f', 
                        title: { text: 'Flat Base Spending ($ / year)', font: { size: 11 } } 
                      },
                      legend: { orientation: 'h', yanchor: 'bottom', y: 1.02, x: 0 },
                    }}
                    style={{ height: 420 }}
                  />
                </div>

                <div className="w-full lg:w-80 shrink-0">
                  <div className="overflow-x-auto rounded border border-slate-200">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th colSpan={2} className="px-3 py-2 text-left font-medium text-slate-700">Retirement Spending Benchmarks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr className="hover:bg-slate-50/50">
                          <td className="px-3 py-2 text-slate-600">
                            <div className="flex items-center gap-1.5">
                              <span className="inline-block w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: '#64748b' }} />
                              <strong>Lean FIRE:</strong> {fmt(50000)}
                            </div>
                            <div className="text-[10px] text-slate-400 pl-4">Basic spending, Canadian average</div>
                          </td>
                          <td className="px-3 py-2 text-right font-mono font-medium text-slate-700">
                            {getClosestSuccessRate(50000)}
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50/50">
                          <td className="px-3 py-2 text-slate-600">
                            <div className="flex items-center gap-1.5">
                              <span className="inline-block w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: '#10b981' }} />
                              <strong>Avg. Household:</strong> {fmt(80000)}
                            </div>
                            <div className="text-[10px] text-slate-400 pl-4">Household spending, Canadian average</div>
                          </td>
                          <td className="px-3 py-2 text-right font-mono font-medium text-slate-700">
                            {getClosestSuccessRate(80000)}
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50/50">
                          <td className="px-3 py-2 text-slate-600">
                            <div className="flex items-center gap-1.5">
                              <span className="inline-block w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: '#3b82f6' }} />
                              <strong>Chubby FIRE:</strong> {fmt(120000)}
                            </div>
                            <div className="text-[10px] text-slate-400 pl-4">Active retirement, frequent travel</div>
                          </td>
                          <td className="px-3 py-2 text-right font-mono font-medium text-slate-700">
                            {getClosestSuccessRate(120000)}
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50/50">
                          <td className="px-3 py-2 text-slate-600">
                            <div className="flex items-center gap-1.5">
                              <span className="inline-block w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: '#ef4444' }} />
                              <strong>Fat FIRE:</strong> {fmt(180000)}
                            </div>
                            <div className="text-[10px] text-slate-400 pl-4">Premium lifestyle and travel budget</div>
                          </td>
                          <td className="px-3 py-2 text-right font-mono font-medium text-slate-700">
                            {getClosestSuccessRate(180000)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            </>
          )}
        </SectionCard>

        {/* Coast FIRE Calculator */}
        {/* Coast FIRE Calculator */}
        <SectionCard
          title="Coast FIRE Calculator"
          width="full"
          onReset={resetCoastCalculator}
          info={
            <div className="space-y-2 text-sm">
              <p>
                <strong>Coast FIRE</strong> is the point where you have saved enough retirement assets that, even if you stop making all new contributions today, your existing portfolio will grow by compound interest alone to support your retirement at your target age.
              </p>
              <p>
                Once you reach Coast FIRE, you only need to earn enough to cover your current living expenses (no active retirement savings required).
              </p>
              <p>
                <strong>How it's calculated:</strong>
              </p>
              <p className="text-xs text-slate-600">
                Unlike simple calculations that use mathematical SWR approximations, this calculator runs the <strong>entire Canadian tax and projection engine</strong> year-by-year working backwards from the end of your plan, testing stopping dates to find the earliest year you can stop household contributions without experiencing any spending shortfalls.
              </p>
              <ul className="list-disc pl-4 space-y-1 text-xs text-slate-600">
                <li><strong>Current Plan Path</strong> — Shows your portfolio trajectory under your current contribution schedule.</li>
                <li><strong>Stop Saving Today</strong> — Simulates the portfolio trajectory if all future contributions are immediately set to $0 starting today.</li>
                <li><strong>Stop Saving at Coast Age</strong> — Shows the trajectory if you keep saving until your Coast FIRE age, and then stop all contributions. Where this path diverges is the exact milestone age you can "coast" from.</li>
              </ul>
              <p>
                <em>This account-based analysis automatically includes all pensions, government benefits (CPP/OAS), lumpy expenses (such as home sales), inflation, and tax brackets. It can also stress-test your plan against actual historical market sequences.</em>
              </p>
            </div>
          }
        >
          {(() => {
            const refPerson = effectiveState.ageReferencePerson === 'personB' ? effectiveState.personB : effectiveState.personA
            const refName = effectiveState.ageReferencePerson === 'personB' ? bName : aName
            const startAge = intAgeAt(refPerson.birthDate, jan1(currentYear))
            const planningEndAge = refPerson.planningEndAge

            const hasResult = coastRateType === 'plan' ? (coastPlanResult !== null) : (coastHistResult !== null)
            const currentAssetsVal = dataPoints[0]?.totalPortfolio ?? 0

            const retirementAgeA = intAgeAt(effectiveState.personA.birthDate, effectiveState.personA.retirementDate)
            const retirementAgeB = effectiveState.personB.birthDate
              ? intAgeAt(effectiveState.personB.birthDate, effectiveState.personB.retirementDate)
              : null
            const hasSpouse = !!effectiveState.personB.name

            // Extract the result values if ready
            const result = coastRateType === 'plan' ? coastPlanResult! : coastHistResult!
            const coastYear = result?.coastYear ?? null
            const coastAge = result?.coastAge ?? null
            const agesArray = result?.agesArray ?? []
            const yearsArray = result?.yearsArray ?? []

            const isCoastFireToday = coastYear === currentYear

            const currentPlanPath = coastRateType === 'plan'
              ? coastPlanResult?.currentPlanPathArray ?? []
              : (coastPlotMetric === 'worst' ? coastHistResult?.currentPlanWorstPath ?? [] : coastHistResult?.currentPlanMedianPath ?? [])

            const stopTodayPath = coastRateType === 'plan'
              ? coastPlanResult?.stopTodayPathArray ?? []
              : (coastPlotMetric === 'worst' ? coastHistResult?.stopTodayWorstPath ?? [] : coastHistResult?.stopTodayMedianPath ?? [])

            const stopCoastPath = coastRateType === 'plan'
              ? coastPlanResult?.stopCoastPathArray ?? []
              : (coastPlotMetric === 'worst' ? coastHistResult?.stopCoastWorstPath ?? [] : coastHistResult?.stopCoastMedianPath ?? [])

            const isSucceedingToday = coastRateType === 'plan'
              ? isCoastFireToday
              : (coastHistResult !== null && coastHistResult.successRateToday >= coastMinSuccessRate / 100)

            const currentPlanName = coastRateType === 'plan'
              ? 'Current Plan (With Contributions)'
              : `Current Plan (${coastPlotMetric === 'worst' ? 'Worst Case' : 'Median'} — Success Rate: ${((coastHistResult?.currentPlanSuccessRate ?? 0) * 100).toFixed(0)}%)`

            const stopTodayName = coastRateType === 'plan'
              ? (isCoastFireToday ? 'Compounding Only (Stop Saving Today - Succeeds)' : 'Compounding Only (Stop Saving Today - Depletes)')
              : `Compounding Only (${coastPlotMetric === 'worst' ? 'Worst Case' : 'Median'} — Success Rate: ${((coastHistResult?.successRateToday ?? 0) * 100).toFixed(0)}%)`

            const stopCoastName = coastRateType === 'plan'
              ? `Stop Saving at Coast Age ${coastAge} (Succeeds)`
              : `Stop Saving at Coast Age ${coastAge} (${coastPlotMetric === 'worst' ? 'Worst Case' : 'Median'} — Success Rate: ${((coastHistResult?.successRateCoast ?? 0) * 100).toFixed(0)}%)`

            const coastChartTraces: Data[] = [
              {
                x: agesArray,
                y: currentPlanPath,
                customdata: yearsArray,
                type: 'scatter',
                mode: 'lines',
                name: currentPlanName,
                line: { color: '#d97706', width: 2 },
                hovertemplate: 'Current Plan<br>Age %{x} (%{customdata}): %{y:$,.0f}<extra></extra>'
              },
              {
                x: agesArray,
                y: stopTodayPath,
                customdata: yearsArray,
                type: 'scatter',
                mode: 'lines',
                name: stopTodayName,
                line: { color: isSucceedingToday ? '#10b981' : '#ef4444', width: 2 },
                hovertemplate: 'Stop Saving Today<br>Age %{x} (%{customdata}): %{y:$,.0f}<extra></extra>'
              }
            ]

            if (coastYear !== null && coastYear > currentYear) {
              coastChartTraces.push({
                x: agesArray,
                y: stopCoastPath,
                customdata: yearsArray,
                type: 'scatter',
                mode: 'lines',
                name: stopCoastName,
                line: { color: '#10b981', width: 2.5 },
                hovertemplate: 'Stop Saving at Coast Age<br>Age %{x} (%{customdata}): %{y:$,.0f}<extra></extra>'
              })
            }

            const shapes: any[] = []
            const annotations: any[] = []

            if (hasResult && coastAge !== null) {
              shapes.push({
                type: 'line',
                x0: coastAge,
                x1: coastAge,
                y0: 0,
                y1: 1,
                yref: 'paper',
                line: { color: '#10b981', dash: 'dash', width: 2 }
              })
              annotations.push({
                x: coastAge,
                xref: 'x',
                y: 0.05,
                yref: 'paper',
                text: `<b>Coast Age: ${coastAge}</b>`,
                showarrow: false,
                font: { size: 10, color: '#10b981' },
                xanchor: 'left',
                yanchor: 'bottom'
              })
            }

            const handleRun = () => {
              if (coastRateType === 'plan') {
                runCoastPlanCalculation()
              } else {
                runCoastHistSimulation()
              }
            }

            return (
              <div className="space-y-4">
                {/* Controls */}
                <div className="flex items-end gap-4 mb-4 flex-wrap">
                  <button
                    className="btn-primary"
                    onClick={handleRun}
                    disabled={coastRunning}
                  >
                    {coastRunning ? 'Running…' : hasResult ? 'Re-Run' : 'Run'}
                  </button>

                  <SelectInput
                    label="Rate Simulation"
                    value={coastRateType}
                    onChange={v => setCoastRateType(v as 'plan' | 'historical')}
                    options={[
                      { value: 'plan', label: 'Plan Rates' },
                      { value: 'historical', label: 'Historical Rates' }
                    ]}
                    tooltip="Choose whether to evaluate Coast FIRE using the flat rates defined in your plan, or stress-test against actual historical market data."
                  />

                  {coastRateType === 'historical' && (
                    <>
                      <SelectInput
                        label="Asset Allocation"
                        value={coastEqAllocation.toString()}
                        onChange={v => setCoastEqAllocation(parseInt(v))}
                        options={[
                          { value: '100', label: '100% Equity / 0% Bond' },
                          { value: '80', label: '80% Equity / 20% Bond' },
                          { value: '60', label: '60% Equity / 40% Bond' },
                          { value: '40', label: '40% Equity / 60% Bond' },
                          { value: '20', label: '20% Equity / 80% Bond' },
                        ]}
                        tooltip="Target mix compiled dynamically from historical monthly returns"
                      />

                      <SelectInput
                        label="Period"
                        value={coastStartYear.toString()}
                        onChange={v => setCoastStartYear(parseInt(v))}
                        options={[
                          { value: '1871', label: '1871 (Full History)', disabled: 1871 > maxStartYearLimit },
                          { value: '1950', label: '1950 (Modern Era)', disabled: 1950 > maxStartYearLimit },
                          { value: '1980', label: '1980 (Post-Stagflation)', disabled: 1980 > maxStartYearLimit },
                          { value: '2000', label: '2000 (21st Century)', disabled: 2000 > maxStartYearLimit },
                        ]}
                        tooltip="The starting year boundary for the simulation series"
                      />

                      <SelectInput
                        label="Success Rate"
                        value={coastMinSuccessRate.toString()}
                        onChange={v => setCoastMinSuccessRate(parseInt(v))}
                        options={[
                          { value: '100', label: '100%' },
                          { value: '95', label: '95%' },
                          { value: '90', label: '90%' },
                        ]}
                        tooltip="The minimum historical success rate required to consider a retirement year successful."
                      />

                      <SelectInput
                        label="Plot"
                        value={coastPlotMetric}
                        onChange={v => setCoastPlotMetric(v as 'worst' | 'median')}
                        options={[
                          { value: 'worst', label: 'Worst-Case Path' },
                          { value: 'median', label: 'Median Path' }
                        ]}
                        tooltip="Choose whether the chart plots the worst-case historical sequence (the gating factor for success) or the median (average) outcome."
                      />
                    </>
                  )}
                </div>

                {/* Loading State */}
                {coastRunning && (
                  <div className="flex flex-col items-center justify-center h-80 border border-dashed border-slate-200 rounded-lg text-slate-400 text-sm">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                      <span>Running simulation…</span>
                    </div>
                  </div>
                )}

                {/* No Result Placeholder */}
                {!coastRunning && !hasResult && (
                  <div className="flex flex-col items-center justify-center h-20 border border-dashed border-slate-200 rounded-lg text-slate-400 text-sm">
                    <span>Select options and click "Run" to calculate Coast FIRE.</span>
                  </div>
                )}

                {/* Results Panel */}
                {!coastRunning && hasResult && (
                  <>
                    <div className="border-t border-slate-200 my-6" />
                    <div className="flex flex-col lg:flex-row gap-6">
                    {/* Plotly Chart (Left Side) */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold mb-2 text-slate-700">
                        {coastRateType === 'plan'
                          ? 'Projections based on Configured Plan Rates'
                          : `Projections for Historical Periods Since ${coastStartYear}`}
                      </div>
                      <PlotlyChart
                        data={coastChartTraces}
                        layout={{
                          yaxis: { tickformat: ',.0f', title: { text: 'Portfolio Balance ($)', font: { size: 11 } } },
                          xaxis: { title: { text: `${refName}'s Age`, font: { size: 11 } } },
                          legend: { orientation: 'h', yanchor: 'bottom', y: 1.02, x: 0 },
                          shapes,
                          annotations
                        }}
                        style={{ height: 380 }}
                      />
                    </div>

                    {/* Status Alert Box (Right Side) */}
                    <div className="w-full lg:w-96 shrink-0 flex flex-col justify-center">
                      {coastRateType === 'plan' ? (
                        <>
                          {isCoastFireToday ? (
                            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-emerald-800 text-sm">
                              <div className="flex items-center gap-2 font-bold mb-1">
                                <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Coast FIRE Achieved!
                              </div>
                              <p className="text-xs text-emerald-700 leading-relaxed">
                                Your current plan is already in Coast FIRE. You can stop making future contributions starting <strong>today (Age {startAge} / Year {currentYear})</strong> and your portfolio is projected to successfully cover all retirement spending and lumpy expenses through the end of the plan (Year {endYear}).
                              </p>
                            </div>
                          ) : coastYear !== null ? (
                            <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-blue-800 text-sm">
                              <div className="flex items-center gap-2 font-bold mb-1">
                                <svg className="w-5 h-5 text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" fill="none" />
                                </svg>
                                On Track to Coast at Age {coastAge}
                              </div>
                              <p className="text-xs text-blue-700 leading-relaxed">
                                If you stop contributions today, your portfolio is projected to deplete before the end of the plan. However, by continuing your planned contributions for <strong>{coastYear! - currentYear} more years</strong>, you will reach Coast FIRE status at <strong>Age {coastAge} (Year {coastYear!})</strong>. Beyond that point, all future contributions can safely be stopped.
                              </p>
                            </div>
                          ) : (
                            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-amber-800 text-sm">
                              <div className="flex items-center gap-2 font-bold mb-1">
                                <svg className="w-5 h-5 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                Contributions Required
                              </div>
                              <p className="text-xs text-amber-700 leading-relaxed">
                                Your current plan is not yet projected to reach Coast FIRE before retirement. Even if you contribute all the way to retirement, the plan is projected to experience a spending shortfall. Consider increasing savings or adjusting your retirement spending.
                              </p>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          {isCoastFireToday ? (
                            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-emerald-800 text-sm">
                              <div className="flex items-center gap-2 font-bold mb-1">
                                <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Coast FIRE Achieved!
                              </div>
                              <p className="text-xs text-emerald-700 leading-relaxed">
                                Your current plan is already in Coast FIRE. You can stop making future contributions starting <strong>today (Age {startAge} / Year {currentYear})</strong> and your portfolio is projected to successfully cover all retirement spending and lumpy expenses in at least <strong>{coastMinSuccessRate}%</strong> of historical rolling periods.
                              </p>
                            </div>
                          ) : coastYear !== null ? (
                            <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-blue-800 text-sm">
                              <div className="flex items-center gap-2 font-bold mb-1">
                                <svg className="w-5 h-5 text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" fill="none" />
                                </svg>
                                On Track to Coast at Age {coastAge}
                              </div>
                              <p className="text-xs text-blue-700 leading-relaxed">
                                If you stop contributions today, your portfolio does not meet the {coastMinSuccessRate}% required success rate. However, by continuing your planned contributions for <strong>{coastYear! - currentYear} more years</strong>, you will reach Coast FIRE status at <strong>Age {coastAge} (Year {coastYear!})</strong> with a <strong>{(coastHistResult!.successRateCoast! * 100).toFixed(0)}%</strong> historical success rate. Beyond that point, all future contributions can safely be stopped.
                              </p>
                            </div>
                          ) : (
                            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-amber-800 text-sm">
                              <div className="flex items-center gap-2 font-bold mb-1">
                                <svg className="w-5 h-5 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                Contributions Required
                              </div>
                              <p className="text-xs text-amber-700 leading-relaxed">
                                Your current plan is not projected to reach Coast FIRE. Even with contributions to the end of the plan, the historical success rate is <strong>{(coastHistResult!.currentPlanSuccessRate * 100).toFixed(0)}%</strong> (less than your required {coastMinSuccessRate}%). Consider increasing savings, adjusting retirement spending, or lowering your required success rate.
                              </p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  </>
                )}
              </div>
            )
          })()}
        </SectionCard>
      </CardGrid>

      {/* ── CPP / OAS Timing Optimizer ────────────────────────────────────────── */}
      <SectionDivider title="Optimizers" />
            <CardGrid>
  <SectionCard title="CPP / OAS Timing Optimizer" width="full"
          onReset={() => setGovResult(null)}
          info={
            <div className="space-y-2 text-sm">
              <p>The CPP / OAS timing optimizer sweeps start ages to find the household-lifetime-benefit-maximising ages for each person independently.</p>
              <p><strong>CPP sweep (ages 60–70)</strong> — The objective is total household CPP collected across all plan years, including survivor benefits. Because the combined CPP cap for the surviving spouse scales with the <em>survivor's own deferral factor</em>, the optimal start age for one person depends on whether the other person is likely to predecease them: a later start by B raises B's cap, potentially allowing more of A's CPP to transfer on A's death.</p>
              <p><strong>OAS sweep (ages 65–70)</strong> — The objective is total household net OAS: gross OAS minus clawback paid. Each month of deferral past 65 adds +0.6% to the monthly benefit (maximum +36% at 70). For high-income households where OAS is fully clawed back, the optimal OAS start age may still be 65 because you collect more total benefits before the income threshold becomes binding.</p>
              <p><strong>How to read the charts</strong> — Each chart shows a line connecting all tested start ages. The red filled dot marks the optimal age; a hollow grey circle marks the currently configured age (when it differs from optimal). All other ages are shown as small grey dots.</p>
              <p><strong>Independent sweeps</strong> — When sweeping one person's start age, the other's is held at the currently configured value. The optimal ages are those that maximise lifetime benefit holding all other plan parameters constant.</p>
              <p><strong>Survivor benefits are automatic</strong> — the projection engine fully models CPP survivor logic (60% of deceased's effective monthly, capped by the combined maximum that scales with the survivor's deferral factor). No special configuration is needed.</p>
              <p><strong>Apply to Dashboard</strong> — sets all four CPP and OAS start ages to the optimal values in the Dashboard what-if overrides.</p>
            </div>
          }>
  
          {/* Controls */}
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <button className="btn-primary self-end" onClick={runGov} disabled={govRunning}>
              {govRunning ? 'Optimizing…' : govResult ? 'Re-Run' : 'Run'}
            </button>

          </div>
  
          {govRunning && (
            <div className="flex flex-col items-center justify-center h-80 border border-dashed border-slate-200 rounded-lg text-slate-400 text-sm">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                <span>Running optimizer…</span>
              </div>
            </div>
          )}

          {!govRunning && !govResult && (
            <div className="flex flex-col items-center justify-center h-20 border border-dashed border-slate-200 rounded-lg text-slate-400 text-sm">
              <span>Click "Run" to optimize CPP / OAS start ages.</span>
            </div>
          )}
  
          {govResult && !govRunning && (() => {
            const cppDeltaA = govResult.cppSweepA.find(p => p.age === govResult.optimalCppAgeA)!.lifetimeCPP
                             - govResult.baseLifetimeCPP
            const cppDeltaB = govResult.cppSweepB.find(p => p.age === govResult.optimalCppAgeB)!.lifetimeCPP
                             - govResult.baseLifetimeCPP
            const oasDeltaA = govResult.oasSweepA.find(p => p.age === govResult.optimalOasAgeA)!.lifetimeOASNet
                             - govResult.baseLifetimeOASNet
            const oasDeltaB = govResult.oasSweepB.find(p => p.age === govResult.optimalOasAgeB)!.lifetimeOASNet
                             - govResult.baseLifetimeOASNet
  
            function deltaLabel(delta: number) {
              if (Math.abs(delta) < 500) return <span className="text-slate-400">no change vs configured</span>
              const sign = delta > 0 ? '+' : ''
              const color = delta > 0 ? '#166534' : '#991b1b'
              return <span style={{ color }}>{sign}{fmt(delta)} vs configured</span>
            }
  
            return (
              <>
                <div className="border-t border-slate-200 my-6" />
                {/* Two-column layout: CPP left, OAS right */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
  
                  {/* ── CPP column ── */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-3 text-center">
                        <div className="text-xs text-slate-400">{aName} — CPP Start</div>
                        <div className="text-2xl font-bold mt-0.5" style={{ color: '#7B1515' }}>Age {govResult.optimalCppAgeA}</div>
                        <div className="text-xs text-slate-400">{deltaLabel(cppDeltaA)}</div>
                      </div>
                      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-3 text-center">
                        <div className="text-xs text-slate-400">{bName} — CPP Start</div>
                        <div className="text-2xl font-bold mt-0.5" style={{ color: '#7B1515' }}>Age {govResult.optimalCppAgeB}</div>
                        <div className="text-xs text-slate-400">{deltaLabel(cppDeltaB)}</div>
                      </div>
                    </div>
                    {(() => {
                      const { trace, annotations } = buildGovChart(
                        govResult.cppSweepA, 'cpp', govResult.optimalCppAgeA, govResult.baseCppAgeA,
                      )
                      return (
                        <div>
                          <div className="text-sm font-semibold text-slate-700 mb-1">
                            {aName} — CPP Sweep
                          </div>
                          <PlotlyChart
                            data={[trace]}
                            layout={{
                              annotations,
                              xaxis: { title: { text: `${aName}'s CPP Start Age`, font: { size: 11 } }, dtick: 1 },
                              yaxis: { tickformat: ',.0f', title: { text: 'Lifetime Household CPP ($)', font: { size: 11 } } },
                              showlegend: false,
                              margin: { t: 12, r: 12, b: 48, l: 80 },
                            }}
                            style={{ height: 220 }}
                          />
                        </div>
                      )
                    })()}
                    {(() => {
                      const { trace, annotations } = buildGovChart(
                        govResult.cppSweepB, 'cpp', govResult.optimalCppAgeB, govResult.baseCppAgeB,
                      )
                      return (
                        <div>
                          <div className="text-sm font-semibold text-slate-700 mb-1">
                            {bName} — CPP Sweep
                          </div>
                          <PlotlyChart
                            data={[trace]}
                            layout={{
                              annotations,
                              xaxis: { title: { text: `${bName}'s CPP Start Age`, font: { size: 11 } }, dtick: 1 },
                              yaxis: { tickformat: ',.0f', title: { text: 'Lifetime Household CPP ($)', font: { size: 11 } } },
                              showlegend: false,
                              margin: { t: 12, r: 12, b: 48, l: 80 },
                            }}
                            style={{ height: 220 }}
                          />
                        </div>
                      )
                    })()}
                  </div>
  
                  {/* ── OAS column ── */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-3 text-center">
                        <div className="text-xs text-slate-400">{aName} — OAS Start</div>
                        <div className="text-2xl font-bold mt-0.5" style={{ color: '#7B1515' }}>Age {govResult.optimalOasAgeA}</div>
                        <div className="text-xs text-slate-400">{deltaLabel(oasDeltaA)}</div>
                      </div>
                      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-3 text-center">
                        <div className="text-xs text-slate-400">{bName} — OAS Start</div>
                        <div className="text-2xl font-bold mt-0.5" style={{ color: '#7B1515' }}>Age {govResult.optimalOasAgeB}</div>
                        <div className="text-xs text-slate-400">{deltaLabel(oasDeltaB)}</div>
                      </div>
                    </div>
                    {(() => {
                      const { trace, annotations } = buildGovChart(
                        govResult.oasSweepA, 'oas', govResult.optimalOasAgeA, govResult.baseOasAgeA,
                      )
                      return (
                        <div>
                          <div className="text-sm font-semibold text-slate-700 mb-1">
                            {aName} — OAS Sweep
                          </div>
                          <PlotlyChart
                            data={[trace]}
                            layout={{
                              annotations,
                              xaxis: { title: { text: `${aName}'s OAS Start Age`, font: { size: 11 } }, dtick: 1 },
                              yaxis: { tickformat: ',.0f', title: { text: 'Lifetime Household Net OAS ($)', font: { size: 11 } } },
                              showlegend: false,
                              margin: { t: 12, r: 12, b: 48, l: 80 },
                            }}
                            style={{ height: 220 }}
                          />
                        </div>
                      )
                    })()}
                    {(() => {
                      const { trace, annotations } = buildGovChart(
                        govResult.oasSweepB, 'oas', govResult.optimalOasAgeB, govResult.baseOasAgeB,
                      )
                      return (
                        <div>
                          <div className="text-sm font-semibold text-slate-700 mb-1">
                            {bName} — OAS Sweep
                          </div>
                          <PlotlyChart
                            data={[trace]}
                            layout={{
                              annotations,
                              xaxis: { title: { text: `${bName}'s OAS Start Age`, font: { size: 11 } }, dtick: 1 },
                              yaxis: { tickformat: ',.0f', title: { text: 'Lifetime Household Net OAS ($)', font: { size: 11 } } },
                              showlegend: false,
                              margin: { t: 12, r: 12, b: 48, l: 80 },
                            }}
                            style={{ height: 220 }}
                          />
                        </div>
                      )
                    })()}
                  </div>
  
                </div>
  
                {/* Apply button */}
                <div className="mt-5 pt-4 border-t border-slate-200 flex items-center gap-4">
                  <button className="btn-primary" onClick={applyOptimalGovAges}>
                    Apply to Dashboard
                  </button>
                  <span className="text-xs text-slate-400">
                    Set CPP and OAS start ages to optimal values in the Dashboard.
                  </span>
                </div>
              </>
            )
          })()}
        </SectionCard>
  
        {/* ── RRSP Meltdown Optimizer ───────────────────────────────────────────── */}
        <SectionCard title="RRSP Meltdown Optimizer" width="full"
          onReset={() => { setMeltSteps(40); setMeltResult(null) }}
          info={
            <div className="space-y-2 text-sm">
              <p>The meltdown optimizer sweeps the <strong>Gross Income Ceiling</strong> parameter of the Cover Spending Gap strategy to find the ceiling that minimises lifetime income tax paid.</p>
              <p>The <strong>meltdown phase</strong> runs from the year a person retires until the year before their RRSP converts to a RRIF. During this window the engine can proactively draw RRSP up to a gross income ceiling, filling tax brackets that would otherwise be wasted — reducing the mandatory RRIF minimums that follow, which are taxed at higher marginal rates.</p>
              <p><strong>How to read the chart</strong> — The x-axis is the gross income ceiling in today's dollars. The y-axis is lifetime household tax (OAS clawback is counted as tax). The red dashed line marks the optimal ceiling where the curve reaches its minimum. The grey dotted line marks the income floor: the average gross income from non-RRSP sources in those years — below it, the ceiling has no effect. A dotted amber line marks where the OAS clawback starts; a dashed amber line marks the income at which OAS is fully clawed back. The sweep extends past full clawback so you can see whether a minimum exists inside or outside the clawback zone — for large RRSPs the meltdown savings can outweigh the clawback cost.</p>
              <p><strong>Each person's sweep is independent</strong> — when sweeping one person's ceiling, the other's is held at zero. The result reflects the marginal contribution of each person's meltdown draws.</p>
              <p><strong>Apply to Dashboard</strong> — changes the Dashboard drawdown strategy to Cover Spending Gap and updates the gross income ceiling to the optimal value found.</p>
              <p><strong>Dynamic sweep</strong> — the optimizer continues past the OAS full-clawback point until the curve has clearly turned upward (five consecutive data points all above the running minimum), or until a hard cap of 3× full-clawback income is reached. If the minimum is still not found, an amber warning is shown — this indicates that aggressive meltdown is beneficial throughout the entire realistic income range, typically because future RRIF minimums will always face higher marginal rates than the meltdown draws today.</p>
              <p>All reference thresholds (OAS clawback, bracket boundaries) are read from your Tax Settings — they update automatically if you change them.</p>
            </div>
          }>
  
          {/* Controls */}
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <button className="btn-primary self-end" onClick={runMelt} disabled={meltRunning}>
              {meltRunning ? 'Optimizing…' : meltResult ? 'Re-Run' : 'Run'}
            </button>
            <NumberInput label="Sweep Steps" value={meltSteps} onChange={setMeltSteps}
              min={10} max={80} step={5} decimals={0} size="sm" />

          </div>
  
          {meltRunning && (
            <div className="flex flex-col items-center justify-center h-80 border border-dashed border-slate-200 rounded-lg text-slate-400 text-sm">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                <span>Running optimizer…</span>
              </div>
            </div>
          )}

          {!meltRunning && !meltResult && (
            <div className="flex flex-col items-center justify-center h-20 border border-dashed border-slate-200 rounded-lg text-slate-400 text-sm">
              <span>Select options and click "Run" to optimize RRSP meltdown ceiling.</span>
            </div>
          )}
  
          {meltResult && !meltRunning && (() => {
            const { hasMeltdownA, hasMeltdownB } = meltResult
  
            if (!hasMeltdownA && !hasMeltdownB) {
              return (
                <>
                  <div className="border-t border-slate-200 my-6" />
                  <p className="text-sm text-slate-500 py-4">
                    Neither person has a meltdown phase under the current plan. A meltdown phase exists between retirement and RRIF conversion — verify that retirement dates precede the RRIF conversion dates in the Investments tab.
                  </p>
                </>
              )
            }
  
            const bothActive = hasMeltdownA && hasMeltdownB
  
            return (
              <>
                <div className="border-t border-slate-200 my-6" />
                <div className={`grid gap-6 ${bothActive ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1'}`}>
  
                  {/* ── Person A sweep ── */}
                  {hasMeltdownA && (() => {
                    const { trace, shapes, annotations } = buildMeltdownChart(
                      meltResult.sweepA,
                      meltResult.optimalCeilingA,
                      meltResult.incomeFloorA,
                      meltResult.oasClawbackThreshold,
                      meltResult.fullClawbackIncomeA,
                    )
                    const firstYear = meltResult.meltdownYearsA[0]
                    const lastYear  = meltResult.meltdownYearsA[meltResult.meltdownYearsA.length - 1]
                    return (
                      <div>
                        <div className="text-sm font-semibold text-slate-700 mb-1">
                          {aName} — Meltdown Phase ({firstYear}–{lastYear}, {meltResult.meltdownYearsA.length} year{meltResult.meltdownYearsA.length !== 1 ? 's' : ''})
                        </div>
                        <PlotlyChart
                          data={[trace]}
                          layout={{
                            shapes,
                            annotations,
                            xaxis: { tickformat: ',.0f', title: { text: 'Gross Income Ceiling ($)', font: { size: 11 } } },
                            yaxis: { tickformat: ',.0f', title: { text: 'Lifetime Tax ($)', font: { size: 11 } } },
                            showlegend: false,
                            margin: { t: 16, r: 16, b: 48, l: 72 },
                          }}
                          style={{ height: 300 }}
                        />
                        <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
                          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-3 text-center">
                            <div className="text-xs text-slate-400">Optimal Ceiling</div>
                            <div className="text-2xl font-bold mt-0.5" style={{ color: '#7B1515' }}>
                              {meltResult.optimalCeilingA !== null ? fmt(meltResult.optimalCeilingA) : '—'}
                            </div>
                          </div>
                          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-3 text-center">
                            <div className="text-xs text-slate-400">Income Floor</div>
                            <div className="text-2xl font-bold mt-0.5" style={{ color: '#7B1515' }}>
                              {fmt(meltResult.incomeFloorA)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })()}
  
                  {/* ── Person B sweep ── */}
                  {hasMeltdownB && (() => {
                    const { trace, shapes, annotations } = buildMeltdownChart(
                      meltResult.sweepB,
                      meltResult.optimalCeilingB,
                      meltResult.incomeFloorB,
                      meltResult.oasClawbackThreshold,
                      meltResult.fullClawbackIncomeB,
                    )
                    const firstYear = meltResult.meltdownYearsB[0]
                    const lastYear  = meltResult.meltdownYearsB[meltResult.meltdownYearsB.length - 1]
                    return (
                      <div>
                        <div className="text-sm font-semibold text-slate-700 mb-1">
                          {bName} — Meltdown Phase ({firstYear}–{lastYear}, {meltResult.meltdownYearsB.length} year{meltResult.meltdownYearsB.length !== 1 ? 's' : ''})
                        </div>
                        <PlotlyChart
                          data={[trace]}
                          layout={{
                            shapes,
                            annotations,
                            xaxis: { tickformat: ',.0f', title: { text: 'Gross Income Ceiling ($)', font: { size: 11 } } },
                            yaxis: { tickformat: ',.0f', title: { text: 'Lifetime Tax ($)', font: { size: 11 } } },
                            showlegend: false,
                            margin: { t: 16, r: 16, b: 48, l: 72 },
                          }}
                          style={{ height: 300 }}
                        />
                        <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
                          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-3 text-center">
                            <div className="text-xs text-slate-400">Optimal Ceiling</div>
                            <div className="text-2xl font-bold mt-0.5" style={{ color: '#7B1515' }}>
                              {meltResult.optimalCeilingB !== null ? fmt(meltResult.optimalCeilingB) : '—'}
                            </div>
                          </div>
                          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-3 text-center">
                            <div className="text-xs text-slate-400">Income Floor</div>
                            <div className="text-2xl font-bold mt-0.5" style={{ color: '#7B1515' }}>
                              {fmt(meltResult.incomeFloorB)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })()}
                </div>
  
                {/* Boundary warnings */}
                {(meltResult.optimalAtBoundaryA || meltResult.optimalAtBoundaryB) && (
                  <div className="mt-4 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 space-y-1">
                    {meltResult.optimalAtBoundaryA && meltResult.hasMeltdownA && (
                      <p><strong>{aName}:</strong> The curve is still decreasing at the sweep boundary (3× OAS full-clawback). No tax minimum was found — the optimal ceiling may be higher still. This typically means the RRSP is large enough that higher meltdown draws always improve the lifetime tax outcome within any realistic income range.</p>
                    )}
                    {meltResult.optimalAtBoundaryB && meltResult.hasMeltdownB && (
                      <p><strong>{bName}:</strong> The curve is still decreasing at the sweep boundary. Same interpretation as above.</p>
                    )}
                  </div>
                )}
  
                {/* Apply button */}
                <div className="mt-5 pt-4 border-t border-slate-200 flex items-center gap-4">
                  <button className="btn-primary" onClick={applyOptimalCeilings}>
                    Apply to Dashboard
                  </button>
                  <span className="text-xs text-slate-400">
                    Changes the Dashboard drawdown strategy to Cover Spending Gap and updates the optimal gross income ceiling.
                  </span>
                </div>
              </>
            )
          })()}
        </SectionCard>
      </CardGrid>
    </div>
  )
}

// Analysis tab — projection looped for probabilistic analysis and optimisation.
// Runs on the same effective plan (base plan + active what-ifs) as the Dashboard
// but executes the engine multiple times to explore uncertainty and optimal parameters.

import { useMemo, useState } from 'react'
import { useStore } from '../store/useStore'
import { SectionCard } from '../components/SectionCard'
import { SectionDivider } from '../components/SectionDivider'
import { NumberInput } from '../components/NumberInput'
import { PlotlyChart } from '../components/PlotlyChart'
import { runProjection } from '../engine/projection'
import { mergeWhatIfs } from '../engine/whatifs'
import { getYear, dateAtAge } from '../engine/dates'
import type { AppState } from '../engine/types'
import { DEFAULT_WHATIFS } from '../engine/defaults'
import { generateRateSchedule } from '../engine/rateProfiles'
import { runMonteCarlo } from '../engine/monteCarlo'
import type { MonteCarloResult } from '../engine/monteCarlo'
import { runMeltdownOptimizer } from '../engine/meltdownOptimizer'
import type { MeltdownOptimizerResult } from '../engine/meltdownOptimizer'
import { runGovBenefitOptimizer } from '../engine/govBenefitOptimizer'
import type { GovBenefitOptimizerResult } from '../engine/govBenefitOptimizer'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Data = any

// ─── Formatters ───────────────────────────────────────────────────────────────

const _fmtObj = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 })
const fmt = (v: number) => _fmtObj.format(v)

// ─── AnalysisTab ──────────────────────────────────────────────────────────────

export function AnalysisTab() {
  const state = useStore()
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

  const [mcSimulations,   setMcSimulations]   = useState(500)
  const [mcVolatilityPct, setMcVolatilityPct] = useState(12)
  const [mcResult,        setMcResult]        = useState<MonteCarloResult | null>(null)
  const [mcRunning,       setMcRunning]       = useState(false)

  function runMC() {
    setMcRunning(true)
    setTimeout(() => {
      const result = runMonteCarlo(effectiveState, rateSchedule, {
        simulations:   mcSimulations,
        volatilityPct: mcVolatilityPct,
      })
      setMcResult(result)
      setMcRunning(false)
    }, 20)
  }

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
    const baseValue    = values[ages.indexOf(baseAge)]

    const annotations: object[] = [
      {
        x: optimalAge, xref: 'x', y: optimalValue, yref: 'y',
        text: 'Optimal', showarrow: false, yshift: 12,
        font: { size: 9, color: '#7B1515' }, xanchor: 'center', yanchor: 'bottom',
      },
    ]
    if (baseAge !== optimalAge) {
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
    <>
      {/* ── Probability Analysis ──────────────────────────────────────────── */}
      <SectionDivider title="Probability Analysis" />
      <SectionCard title="Monte Carlo Simulation" width="full"
        onReset={() => { setMcSimulations(500); setMcVolatilityPct(12); setMcResult(null) }}
        info={
          <div className="space-y-2 text-sm">
            <p>Monte Carlo runs your plan hundreds of times, varying annual market returns randomly around the configured rate profile. Everything else — income, tax, spending phases, drawdown strategy, and all active modifications — is held fixed. Only market sequence varies.</p>
            <p><strong>Return Volatility (σ)</strong> — The standard deviation of annual return noise added to each year's base rate. 12% is a reasonable default for a balanced equity/bond portfolio. Lower values produce a tighter fan; higher values widen it.</p>
            <p><strong>Probability of Success</strong> — Percentage of simulations where the portfolio remains above zero at the final year of the plan. 90%+ is generally considered robust; below 70% warrants strategy changes.</p>
            <p><strong>Median Depletion Age</strong> — In simulations that do deplete, the median age of the reference person when the portfolio first reaches zero. Only shown when at least 5% of simulations deplete.</p>
            <p>The fan chart shows the distribution of portfolio outcomes over time. The red line is the deterministic result of the configured rate profile. Grey bands show the 10th–90th and 25th–75th percentile ranges. Black dotted lines are the best and worst case outcomes across all simulations.</p>
          </div>
        }>

        {/* Controls */}
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <NumberInput label="Simulations" value={mcSimulations} onChange={setMcSimulations}
            min={100} max={2000} step={100} decimals={0} size="sm" />
          <NumberInput label="Volatility σ (%)" value={mcVolatilityPct} onChange={setMcVolatilityPct}
            min={1} max={30} step={1} decimals={0} size="sm" />
          <button className="btn-primary self-end" onClick={runMC} disabled={mcRunning}>
            {mcRunning ? 'Running…' : mcResult ? 'Re-run' : 'Run Simulation'}
          </button>
          {mcResult && !mcRunning && (
            <span className="text-xs text-slate-400 self-end pb-1">
              Last run: {mcResult.simulationCount.toLocaleString()} simulations
            </span>
          )}
        </div>

        {mcRunning && (
          <div className="flex items-center justify-center h-32 text-slate-400 text-sm">
            Running {mcSimulations.toLocaleString()} simulations…
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
              <PlotlyChart
                data={mcTraces}
                layout={{
                  yaxis: { tickformat: ',.0f', title: { text: 'Portfolio', font: { size: 11 } } },
                  xaxis: { title: { text: 'Year', font: { size: 11 } } },
                  legend: { orientation: 'h', yanchor: 'bottom', y: 1.02, x: 0 },
                }}
                style={{ height: 380 }}
              />

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

      {/* ── RRSP Meltdown Optimizer ───────────────────────────────────────────── */}
      <SectionDivider title="Optimizers" />
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
          <NumberInput label="Sweep Steps" value={meltSteps} onChange={setMeltSteps}
            min={10} max={80} step={5} decimals={0} size="sm" />
          <button className="btn-primary self-end" onClick={runMelt} disabled={meltRunning}>
            {meltRunning ? 'Optimizing…' : meltResult ? 'Re-run' : 'Run Optimizer'}
          </button>
          {meltResult && !meltRunning && (
            <span className="text-xs text-slate-400 self-end pb-1">
              {meltResult.sweepA.length + meltResult.sweepB.length + 1} projection runs
            </span>
          )}
        </div>

        {meltRunning && (
          <div className="flex items-center justify-center h-32 text-slate-400 text-sm">
            Running {(meltSteps + 1) * ((effectiveState.rrspA.balance > 0 || effectiveState.rrspB.balance > 0) ? 2 : 1)} projection sweeps…
          </div>
        )}

        {meltResult && !meltRunning && (() => {
          const { hasMeltdownA, hasMeltdownB } = meltResult

          if (!hasMeltdownA && !hasMeltdownB) {
            return (
              <p className="text-sm text-slate-500 py-4">
                Neither person has a meltdown phase under the current plan. A meltdown phase exists between retirement and RRIF conversion — verify that retirement dates precede the RRIF conversion dates in the Investments tab.
              </p>
            )
          }

          const bothActive = hasMeltdownA && hasMeltdownB

          return (
            <>
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
                        <div className="bg-white rounded border border-slate-200 p-2.5">
                          <div className="text-xs text-slate-400">Optimal Ceiling</div>
                          <div className="font-bold" style={{ color: '#7B1515' }}>
                            {meltResult.optimalCeilingA !== null ? fmt(meltResult.optimalCeilingA) : '—'}
                          </div>
                        </div>
                        <div className="bg-white rounded border border-slate-200 p-2.5">
                          <div className="text-xs text-slate-400">Income Floor</div>
                          <div className="font-semibold text-slate-700">{fmt(meltResult.incomeFloorA)}</div>
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
                        <div className="bg-white rounded border border-slate-200 p-2.5">
                          <div className="text-xs text-slate-400">Optimal Ceiling</div>
                          <div className="font-bold" style={{ color: '#7B1515' }}>
                            {meltResult.optimalCeilingB !== null ? fmt(meltResult.optimalCeilingB) : '—'}
                          </div>
                        </div>
                        <div className="bg-white rounded border border-slate-200 p-2.5">
                          <div className="text-xs text-slate-400">Income Floor</div>
                          <div className="font-semibold text-slate-700">{fmt(meltResult.incomeFloorB)}</div>
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

      {/* ── CPP / OAS Timing Optimizer ────────────────────────────────────────── */}
      <div className="mt-6" />
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
            {govRunning ? 'Optimizing…' : govResult ? 'Re-run' : 'Run Optimizer'}
          </button>
          {govResult && !govRunning && (
            <span className="text-xs text-slate-400 self-end pb-1">
              34 projection runs completed
            </span>
          )}
        </div>

        {govRunning && (
          <div className="flex items-center justify-center h-32 text-slate-400 text-sm">
            Running 34 projections across CPP and OAS start ages…
          </div>
        )}

        {govResult && !govRunning && (() => {
          const cppDeltaA = govResult.cppSweepA.find(p => p.age === govResult.optimalCppAgeA)!.lifetimeCPP
                           - govResult.cppSweepA.find(p => p.age === govResult.baseCppAgeA)!.lifetimeCPP
          const cppDeltaB = govResult.cppSweepB.find(p => p.age === govResult.optimalCppAgeB)!.lifetimeCPP
                           - govResult.cppSweepB.find(p => p.age === govResult.baseCppAgeB)!.lifetimeCPP
          const oasDeltaA = govResult.oasSweepA.find(p => p.age === govResult.optimalOasAgeA)!.lifetimeOASNet
                           - govResult.oasSweepA.find(p => p.age === govResult.baseOasAgeA)!.lifetimeOASNet
          const oasDeltaB = govResult.oasSweepB.find(p => p.age === govResult.optimalOasAgeB)!.lifetimeOASNet
                           - govResult.oasSweepB.find(p => p.age === govResult.baseOasAgeB)!.lifetimeOASNet

          function deltaLabel(delta: number) {
            if (Math.abs(delta) < 500) return <span className="text-slate-400">no change vs configured</span>
            const sign = delta > 0 ? '+' : ''
            const color = delta > 0 ? '#166534' : '#991b1b'
            return <span style={{ color }}>{sign}{fmt(delta)} vs configured</span>
          }

          return (
            <>
              {/* Two-column layout: CPP left, OAS right */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                {/* ── CPP column ── */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded border border-slate-200 p-2.5">
                      <div className="text-xs text-slate-400">{aName} — CPP Start</div>
                      <div className="text-xl font-bold" style={{ color: '#7B1515' }}>Age {govResult.optimalCppAgeA}</div>
                      <div className="text-xs mt-0.5">{deltaLabel(cppDeltaA)}</div>
                    </div>
                    <div className="bg-white rounded border border-slate-200 p-2.5">
                      <div className="text-xs text-slate-400">{bName} — CPP Start</div>
                      <div className="text-xl font-bold" style={{ color: '#7B1515' }}>Age {govResult.optimalCppAgeB}</div>
                      <div className="text-xs mt-0.5">{deltaLabel(cppDeltaB)}</div>
                    </div>
                  </div>
                  {(() => {
                    const { trace, annotations } = buildGovChart(
                      govResult.cppSweepA, 'cpp', govResult.optimalCppAgeA, govResult.baseCppAgeA,
                    )
                    return (
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
                    )
                  })()}
                  {(() => {
                    const { trace, annotations } = buildGovChart(
                      govResult.cppSweepB, 'cpp', govResult.optimalCppAgeB, govResult.baseCppAgeB,
                    )
                    return (
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
                    )
                  })()}
                </div>

                {/* ── OAS column ── */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded border border-slate-200 p-2.5">
                      <div className="text-xs text-slate-400">{aName} — OAS Start</div>
                      <div className="text-xl font-bold" style={{ color: '#7B1515' }}>Age {govResult.optimalOasAgeA}</div>
                      <div className="text-xs mt-0.5">{deltaLabel(oasDeltaA)}</div>
                    </div>
                    <div className="bg-white rounded border border-slate-200 p-2.5">
                      <div className="text-xs text-slate-400">{bName} — OAS Start</div>
                      <div className="text-xl font-bold" style={{ color: '#7B1515' }}>Age {govResult.optimalOasAgeB}</div>
                      <div className="text-xs mt-0.5">{deltaLabel(oasDeltaB)}</div>
                    </div>
                  </div>
                  {(() => {
                    const { trace, annotations } = buildGovChart(
                      govResult.oasSweepA, 'oas', govResult.optimalOasAgeA, govResult.baseOasAgeA,
                    )
                    return (
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
                    )
                  })()}
                  {(() => {
                    const { trace, annotations } = buildGovChart(
                      govResult.oasSweepB, 'oas', govResult.optimalOasAgeB, govResult.baseOasAgeB,
                    )
                    return (
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
    </>
  )
}

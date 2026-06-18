// Historical tab — projects the plan against all rolling historical sequences.
// Preserves real sequence-of-returns, inflation, and market cycles.

import { useMemo, useState } from 'react'
import { useStore } from '../store/useStore'
import { SectionCard } from '../components/SectionCard'
import { CardGrid } from '../components/CardGrid'
import { SectionDivider } from '../components/SectionDivider'
import { SelectInput } from '../components/SelectInput'
import { PlotlyChart } from '../components/PlotlyChart'
import { mergeWhatIfs } from '../engine/whatifs'
import { intAgeAt, jan1 } from '../engine/dates'
import type { AppState } from '../engine/types'
import { runHistoricalAnalysis } from '../engine/historicalAnalysis'
import type { HistoricalAnalysisResult, HistoricalPathResult } from '../engine/historicalAnalysis'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Data = any

const _fmtObj = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 })
const fmt = (v: number) => _fmtObj.format(v)

export function HistoricalTab() {
  const state = useStore()
  const { whatIfs, personA, personB } = state

  const aName = personA.name || 'Person A'
  const bName = personB.name || 'Person B'

  // Resolve effective state by merging active what-ifs
  const effectiveState = useMemo(
    () => mergeWhatIfs(state as AppState, whatIfs),
    [state, whatIfs]
  )

  // ── Tab State ─────────────────────────────────────────────────────────────
  const [eqAllocation, setEqAllocation] = useState(60)
  const [startYear, setStartYear] = useState(1871)
  const [resolution, setResolution] = useState<'annual' | 'monthly'>('monthly')
  const [result, setResult] = useState<HistoricalAnalysisResult | null>(null)
  const [running, setRunning] = useState(false)

  function runAnalysis() {
    setRunning(true)
    setTimeout(() => {
      const res = runHistoricalAnalysis(effectiveState, {
        equityAllocationPct: eqAllocation,
        historicalStartYear: startYear,
        resolution,
      })
      setResult(res)
      setRunning(false)
    }, 20)
  }

  // Determine x-axis: Age of Reference Person
  const refPerson = effectiveState.ageReferencePerson === 'personB' ? effectiveState.personB : effectiveState.personA
  const refName = effectiveState.ageReferencePerson === 'personB' ? bName : aName
  const currentYear = new Date().getFullYear()
  const startAge = intAgeAt(refPerson.birthDate, jan1(currentYear))

  // Compile Plotly Traces
  const chartTraces = useMemo<Data[]>(() => {
    if (!result || result.paths.length === 0) return []

    const traces: Data[] = []

    // 1. Find the best and worst path objects
    let bestPath: HistoricalPathResult = result.paths[0]
    let worstPath: HistoricalPathResult = result.paths[0]
    for (const p of result.paths) {
      if (p.finalBalance > bestPath.finalBalance) bestPath = p
      if (p.finalBalance < worstPath.finalBalance) worstPath = p
    }

    // 2. Add all paths as light gray background lines first
    for (const path of result.paths) {
      if (path.label === bestPath.label || path.label === worstPath.label) {
        continue // Skip to draw on top later
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

    // 3. Highlight Worst Path in Brand Red on top
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

    // 4. Highlight Best Path in Emerald Green on top
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
  }, [result, startAge, currentYear])

  // Sort paths for the details table (worst performing first, to show failures clearly)
  const sortedPaths = useMemo(() => {
    if (!result) return []
    return [...result.paths].sort((a, b) => a.finalBalance - b.finalBalance)
  }, [result])

  return (
    <div className="space-y-4">
      <SectionDivider title="Historical Rolling Runs" />
      <CardGrid>
        <SectionCard
          title="Historical Sequence Stress Test"
          width="full"
          onReset={() => {
            setEqAllocation(60)
            setStartYear(1871)
            setResolution('monthly')
            setResult(null)
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
            <button className="btn-primary" onClick={runAnalysis} disabled={running}>
              {running ? 'Running…' : result ? 'Re-run Test' : 'Run Test'}
            </button>

            <SelectInput
              label="Asset Allocation"
              value={eqAllocation.toString()}
              onChange={v => setEqAllocation(parseInt(v))}
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
              label="Historical Start Year"
              value={startYear.toString()}
              onChange={v => setStartYear(parseInt(v))}
              options={[
                { value: '1871', label: '1871 (Full History)' },
                { value: '1950', label: '1950 (Modern Era)' },
                { value: '1980', label: '1980 (Post-Stagflation)' },
                { value: '2000', label: '2000 (21st Century)' },
              ]}
              tooltip="The starting year boundary for the simulation series"
            />

            <SelectInput
              label="Start Date Resolution"
              value={resolution}
              onChange={v => setResolution(v as 'annual' | 'monthly')}
              options={[
                { value: 'annual', label: 'Annual (Jan 1st)' },
                { value: 'monthly', label: 'Monthly (Any Month)' },
              ]}
              tooltip="Annual uses January starts only; Monthly runs 12x more paths starting in any month"
            />

            {result && !running && (
              <span className="text-xs text-slate-400 pb-1">
                Last run: {result.totalCount} historical periods simulated
              </span>
            )}
          </div>

          {running && (
            <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
              Running {resolution === 'monthly' ? '~1,500' : '~120'} rolling historical projections…
            </div>
          )}

          {result && !running && (
            <div className="space-y-6">
              {/* Stats tiles */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-white rounded border border-slate-200 shadow-sm p-3 text-center">
                  <div className="text-xs text-slate-500 font-medium">Historical Success Rate</div>
                  <div className="text-3xl font-bold mt-1" style={{ color: '#7B1515' }}>
                    {(result.successRate * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {result.paths.length - result.depletionCount} of {result.paths.length} periods survived
                  </div>
                </div>

                <div className="bg-white rounded border border-slate-200 shadow-sm p-3 text-center">
                  <div className="text-xs text-slate-500 font-medium">Worst Start Period</div>
                  <div className="text-lg font-bold mt-1 text-slate-700 truncate">
                    {result.worstYearLabel}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Ended with {result.worstYearBalance < 1000 ? 'Depletion' : fmt(result.worstYearBalance)}
                  </div>
                </div>

                <div className="bg-white rounded border border-slate-200 shadow-sm p-3 text-center">
                  <div className="text-xs text-slate-500 font-medium">Best Start Period</div>
                  <div className="text-lg font-bold mt-1 text-slate-700 truncate">
                    {result.bestYearLabel}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Ended with {fmt(result.bestYearBalance)}
                  </div>
                </div>

                <div className="bg-white rounded border border-slate-200 shadow-sm p-3 text-center">
                  <div className="text-xs text-slate-500 font-medium">Median Final Balance</div>
                  <div className="text-lg font-bold mt-1 text-slate-700 truncate">
                    {fmt(result.medianFinalBalance)}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    todays value across all periods
                  </div>
                </div>
              </div>

              {/* Spaghetti Plot */}
              <div>
                <div className="text-sm font-semibold mb-2 text-slate-700">Historical Portfolio Paths (aligned by age)</div>
                <PlotlyChart
                  data={chartTraces}
                  layout={{
                    yaxis: { tickformat: ',.0f', title: { text: 'Portfolio Balance ($)', font: { size: 11 } } },
                    xaxis: { title: { text: `${refName}'s Age`, font: { size: 11 } } },
                    legend: { orientation: 'h', yanchor: 'bottom', y: 1.02, x: 0 },
                  }}
                  style={{ height: 420 }}
                />
              </div>

              {/* Scrollable details table of historical periods */}
              <div>
                <div className="text-sm font-semibold mb-2 text-slate-700">All Historical Simulation Paths (Worst First)</div>
                <div className="overflow-x-auto rounded border border-slate-200 max-h-80 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 sticky top-0 z-10">
                        <th className="px-3 py-2 text-left font-medium">Start Year</th>
                        <th className="px-3 py-2 text-center font-medium">Status</th>
                        <th className="px-3 py-2 text-center font-medium">Depletion Age</th>
                        <th className="px-3 py-2 text-right font-medium">Final Portfolio Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sortedPaths.map((p, idx) => (
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
            </div>
          )}
        </SectionCard>
      </CardGrid>
    </div>
  )
}

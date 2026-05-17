import { useMemo, useState } from 'react'
import { useStore } from '../../store/useStore'
import { PlotlyChart } from '../../components/PlotlyChart'
import { SectionCard } from '../../components/SectionCard'
import { XAxisSelector, XAxisMode, buildXAxis } from '../../components/XAxisSelector'
import { runProjection } from '../../engine/projection'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Data = any

const fmt = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 })

export function IncomeOverviewTab() {
  const state = useStore()
  const { personA, personB } = state

  const { dataPoints, warnings } = useMemo(() => runProjection(state), [state])
  const [xAxisMode, setXAxisMode] = useState<XAxisMode>('year')

  if (dataPoints.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
        Unable to generate projection. Check that birth dates and retirement dates are set correctly.
      </div>
    )
  }

  const aName = personA.name || 'A'
  const bName = personB.name || 'B'
  const years = dataPoints.map(d => d.year)
  const xAxis = buildXAxis(years, xAxisMode, personA.birthDate, personB.birthDate)

  // ── Income stacked bar ────────────────────────────────────────────────────
  const incomeData: Data[] = [
    { x: years, y: dataPoints.map(d => d.employmentA), name: `${aName} Employment`, type: 'bar', marker: { color: '#6366f1' } },
    { x: years, y: dataPoints.map(d => d.employmentB), name: `${bName} Employment`, type: 'bar', marker: { color: '#8b5cf6' } },
    { x: years, y: dataPoints.map(d => d.dbPensionBase + d.dbPensionBaseB), name: 'DB Pension (lifetime)', type: 'bar', marker: { color: '#0ea5e9' } },
    { x: years, y: dataPoints.map(d => d.dbBridge + d.dbBridgeB), name: 'DB Bridge Benefit', type: 'bar', marker: { color: '#38bdf8' } },
    { x: years, y: dataPoints.map(d => d.cppA),  name: `${aName} CPP`, type: 'bar', marker: { color: '#22c55e' } },
    { x: years, y: dataPoints.map(d => d.cppB),  name: `${bName} CPP`, type: 'bar', marker: { color: '#16a34a' } },
    { x: years, y: dataPoints.map(d => d.oasA),  name: `${aName} OAS`, type: 'bar', marker: { color: '#f59e0b' } },
    { x: years, y: dataPoints.map(d => d.oasB),  name: `${bName} OAS`, type: 'bar', marker: { color: '#d97706' } },
    { x: years, y: dataPoints.map(d => d.rrifA + d.rrifB), name: 'RRIF Withdrawals', type: 'bar', marker: { color: '#f97316' } },
    { x: years, y: dataPoints.map(d => d.tfsaWithdrawalA + d.tfsaWithdrawalB), name: 'TFSA Withdrawals', type: 'bar', marker: { color: '#14b8a6' } },
    { x: years, y: dataPoints.map(d => d.nonRegWithdrawalA + d.nonRegWithdrawalB), name: 'Non-Reg Withdrawals', type: 'bar', marker: { color: '#64748b' } },
    { x: years, y: dataPoints.map(d => d.rentalIncome + d.partTimeA + d.partTimeB + d.otherIncome), name: 'Other Income', type: 'bar', marker: { color: '#a8a29e' } },
    { x: years, y: dataPoints.map(d => d.householdSpending), name: 'Spending Target', type: 'scatter', mode: 'markers', marker: { color: '#ef4444', size: 4, symbol: 'line-ew', line: { color: '#ef4444', width: 2 } } },
    { x: years, y: dataPoints.map(d => d.totalHouseholdNet), name: 'Net Income (after tax)', type: 'scatter', mode: 'markers', marker: { color: '#1e293b', size: 4, symbol: 'line-ew', line: { color: '#1e293b', width: 2 } } },
  ]

  // ── Tax stacked bar ───────────────────────────────────────────────────────
  const taxData: Data[] = [
    { x: years, y: dataPoints.map(d => d.taxA), name: `${aName} Tax`, type: 'bar', marker: { color: '#ef4444' } },
    { x: years, y: dataPoints.map(d => d.taxB), name: `${bName} Tax`, type: 'bar', marker: { color: '#f97316' } },
    { x: years, y: dataPoints.map(d => d.effectiveTaxRateA * 100), name: `${aName} Effective Rate`, type: 'scatter', mode: 'markers', yaxis: 'y2', marker: { color: '#dc2626', size: 4, symbol: 'circle' } },
    { x: years, y: dataPoints.map(d => d.effectiveTaxRateB * 100), name: `${bName} Effective Rate`, type: 'scatter', mode: 'markers', yaxis: 'y2', marker: { color: '#ea580c', size: 4, symbol: 'circle' } },
  ]

  // ── Portfolio stacked bar ─────────────────────────────────────────────────
  const portfolioData: Data[] = [
    { x: years, y: dataPoints.map(d => d.rrspA),   name: `${aName} RRSP/RRIF`, type: 'bar', marker: { color: '#6366f1' } },
    { x: years, y: dataPoints.map(d => d.rrspB),   name: `${bName} RRSP/RRIF`, type: 'bar', marker: { color: '#8b5cf6' } },
    { x: years, y: dataPoints.map(d => d.tfsaA),   name: `${aName} TFSA`,      type: 'bar', marker: { color: '#22c55e' } },
    { x: years, y: dataPoints.map(d => d.tfsaB),   name: `${bName} TFSA`,      type: 'bar', marker: { color: '#16a34a' } },
    { x: years, y: dataPoints.map(d => d.nonRegA), name: `${aName} Non-Reg`,   type: 'bar', marker: { color: '#f59e0b' } },
    { x: years, y: dataPoints.map(d => d.nonRegB), name: `${bName} Non-Reg`,   type: 'bar', marker: { color: '#d97706' } },
    { x: years, y: dataPoints.map(d => d.hisa),    name: 'HISA / Cash',        type: 'bar', marker: { color: '#94a3b8' } },
  ]

  // ── Key stats ─────────────────────────────────────────────────────────────
  const first = dataPoints[0]!
  const last  = dataPoints[dataPoints.length - 1]!
  const peakPortfolio = Math.max(...dataPoints.map(d => d.totalPortfolio))
  const minCashFlow   = Math.min(...dataPoints.map(d => d.cashFlow))
  const depletion     = dataPoints.find(d => d.totalPortfolio < 50_000)

  return (
    <div className="space-y-4">
      {warnings.length > 0 && (
        <div className="p-3 bg-amber-50 border border-amber-300 rounded text-xs text-amber-800 space-y-1">
          <p className="font-semibold">Projection warnings:</p>
          {warnings.slice(0, 5).map((w, i) => <p key={i}>• {w}</p>)}
          {warnings.length > 5 && <p>…and {warnings.length - 5} more</p>}
        </div>
      )}

      <div className="grid grid-cols-2 xl:grid-cols-5 gap-3">
        {[
          { label: 'Starting Portfolio',   value: fmt.format(first.totalPortfolio), note: "today's $" },
          { label: 'Peak Portfolio',       value: fmt.format(peakPortfolio),        note: "today's $" },
          { label: 'End Portfolio',        value: fmt.format(last.totalPortfolio),  note: `at ${last.year}`, color: last.totalPortfolio > 0 ? 'text-green-700' : 'text-red-600' },
          { label: 'Min Annual Cash Flow', value: fmt.format(minCashFlow),          note: "today's $", color: minCashFlow < 0 ? 'text-red-600' : 'text-green-700' },
          { label: 'Portfolio Depletion',  value: depletion ? String(depletion.year) : 'Not depleted', note: depletion ? 'projected year' : '✓', color: depletion ? 'text-red-600' : 'text-green-700' },
        ].map(m => (
          <div key={m.label} className="bg-white rounded-lg border border-slate-200 shadow-sm p-3 text-center">
            <div className="text-xs text-slate-400">{m.label}</div>
            <div className={`text-base font-bold mt-0.5 ${m.color ?? 'text-slate-800'}`}>{m.value}</div>
            <div className="text-xs text-slate-400">{m.note}</div>
          </div>
        ))}
      </div>

      <SectionCard title="Household Income by Source — Present-Day Dollars"
        info="Stacked bars = annual gross income by source. Tick marks = net after tax (black) and spending target (red).">
        <PlotlyChart
          data={incomeData}
          layout={{ barmode: 'stack', yaxis: { title: { text: "Annual $ (today's)", font: { size: 11 } }, tickformat: '$,.0f' }, xaxis: { ...xAxis } }}
          style={{ height: 420 }}
        />
      </SectionCard>

      <SectionCard title="Tax Paid — Present-Day Dollars">
        <PlotlyChart
          data={taxData}
          layout={{
            barmode: 'stack',
            yaxis:  { title: { text: 'Tax Paid ($)', font: { size: 11 } }, tickformat: '$,.0f' },
            yaxis2: { title: { text: 'Effective Rate (%)', font: { size: 11 } }, overlaying: 'y', side: 'right', tickformat: '.1f', range: [0, 60] },
            xaxis: { ...xAxis },
          }}
          style={{ height: 320 }}
        />
      </SectionCard>

      <SectionCard title="Portfolio Balances — Present-Day Dollars">
        <PlotlyChart
          data={portfolioData}
          layout={{ barmode: 'stack', yaxis: { title: { text: "Balance (today's $)", font: { size: 11 } }, tickformat: '$,.0f' }, xaxis: { ...xAxis } }}
          style={{ height: 320 }}
        />
        <XAxisSelector value={xAxisMode} onChange={setXAxisMode} aName={aName} bName={bName} />
      </SectionCard>

      <SectionCard title="Annual Summary Table">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="px-2 py-1.5 text-left  font-medium text-slate-600 border border-slate-200">Year</th>
                <th className="px-2 py-1.5 text-right font-medium text-slate-600 border border-slate-200">{aName} Age</th>
                <th className="px-2 py-1.5 text-right font-medium text-slate-600 border border-slate-200">Gross A</th>
                <th className="px-2 py-1.5 text-right font-medium text-slate-600 border border-slate-200">Gross B</th>
                <th className="px-2 py-1.5 text-right font-medium text-slate-600 border border-slate-200">Tax A</th>
                <th className="px-2 py-1.5 text-right font-medium text-slate-600 border border-slate-200">Tax B</th>
                <th className="px-2 py-1.5 text-right font-medium text-slate-600 border border-slate-200">Net HH</th>
                <th className="px-2 py-1.5 text-right font-medium text-slate-600 border border-slate-200">Spending</th>
                <th className="px-2 py-1.5 text-right font-medium text-slate-600 border border-slate-200">Cash Flow</th>
                <th className="px-2 py-1.5 text-right font-medium text-slate-600 border border-slate-200">Portfolio</th>
              </tr>
            </thead>
            <tbody>
              {dataPoints.map(d => (
                <tr key={d.year} className={`border-b border-slate-100 ${d.cashFlow < 0 ? 'bg-red-50' : ''}`}>
                  <td className="px-2 py-1 border border-slate-100 font-medium text-slate-700">{d.year}</td>
                  <td className="px-2 py-1 border border-slate-100 text-right text-slate-600">{d.personAAge.toFixed(1)}</td>
                  <td className="px-2 py-1 border border-slate-100 text-right">{fmt.format(d.grossIncomeA)}</td>
                  <td className="px-2 py-1 border border-slate-100 text-right">{fmt.format(d.grossIncomeB)}</td>
                  <td className="px-2 py-1 border border-slate-100 text-right text-red-600">{fmt.format(d.taxA)}</td>
                  <td className="px-2 py-1 border border-slate-100 text-right text-red-600">{fmt.format(d.taxB)}</td>
                  <td className="px-2 py-1 border border-slate-100 text-right font-medium">{fmt.format(d.totalHouseholdNet)}</td>
                  <td className="px-2 py-1 border border-slate-100 text-right">{fmt.format(d.householdSpending)}</td>
                  <td className={`px-2 py-1 border border-slate-100 text-right font-medium ${d.cashFlow < 0 ? 'text-red-600' : 'text-green-700'}`}>
                    {fmt.format(d.cashFlow)}
                  </td>
                  <td className="px-2 py-1 border border-slate-100 text-right">{fmt.format(d.totalPortfolio)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  )
}

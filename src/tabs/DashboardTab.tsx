import { useMemo, useState } from 'react'
import { useStore } from '../store/useStore'
import { SectionCard } from '../components/SectionCard'
import { SectionDivider } from '../components/SectionDivider'
import { NumberInput } from '../components/NumberInput'
import { SelectInput } from '../components/SelectInput'
import { PlotlyChart } from '../components/PlotlyChart'
import { XAxisSelector, XAxisMode, buildXAxis } from '../components/XAxisSelector'
import { runProjection } from '../engine/projection'
import { mergeWhatIfs, computeHeadlineMetrics } from '../engine/whatifs'
import { exactAgeAt } from '../engine/dates'
import type { AppState, HeadlineMetrics, WithdrawalOrder, PensionSplitMode, DrawdownStrategyType } from '../engine/types'
import { CHART_COLORS } from './PaletteTab'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Data = any

// ─── Formatters ───────────────────────────────────────────────────────────────

const _fmtObj = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 })
const fmt    = (v: number) => _fmtObj.format(v)
const fmtPct = (v: number) => `${(v * 100).toFixed(1)}%`

const WITHDRAWAL_ORDER_OPTIONS: { value: string; label: string }[] = [
  { value: 'optimized',    label: 'Optimized' },
  { value: 'tfsa_first',   label: 'TFSA First' },
  { value: 'rrsp_first',   label: 'RRSP / RRIF First' },
  { value: 'nonreg_first', label: 'Non-Registered First' },
]

const WITHDRAWAL_ORDER_LABELS: Record<WithdrawalOrder, string> = {
  optimized:    'Optimized',
  tfsa_first:   'TFSA First',
  rrsp_first:   'RRSP / RRIF First',
  nonreg_first: 'Non-Registered First',
}

const PENSION_SPLIT_OPTIONS: { value: string; label: string }[] = [
  { value: 'auto',   label: 'Auto (optimized)' },
  { value: 'manual', label: 'Manual' },
]

const DRAWDOWN_STRATEGY_OPTIONS: { value: DrawdownStrategyType; label: string }[] = [
  { value: 'none',            label: 'None' },
  { value: 'spendGap',        label: 'Spend-Gap Only' },
  { value: 'fixedWithdrawal', label: 'Fixed Withdrawals' },
  { value: 'fixedPct',        label: 'Fixed Percentage' },
]

const DRAWDOWN_STRATEGY_DESCRIPTIONS: Record<DrawdownStrategyType, string> = {
  none:             'No account withdrawals of any kind. Portfolios grow undisturbed. All spending is shown as a shortfall. Useful as an analytical baseline to understand how your portfolio grows before any drawdown decisions are made.',
  spendGap:         'Withdraw only what is needed to cover the spending shortfall each year — nothing more. Accounts are drawn in the configured withdrawal order (TFSA first, Non-Reg, RRSP/RRIF, etc.). RRIF mandatory minimums are always withdrawn regardless of need.',
  fixedWithdrawal:  'Withdraw a fixed annual dollar amount from each account each year, regardless of spending need. Amounts are in today\'s dollars and inflate each year. Any shortfall beyond the scheduled draws is not covered. RRSP/RRIF draws respect mandatory RRIF minimums.',
  fixedPct:         'Withdraw a fixed percentage of each account\'s balance each year, with an optional dollar floor. Any shortfall beyond the scheduled draws is not covered. RRSP/RRIF draws respect mandatory RRIF minimums.',
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function WhatIfSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded border border-slate-200">
      <div className="bg-slate-50 border-b border-slate-200 px-3 py-2">
        <span className="text-sm font-medium text-slate-700">{title}</span>
      </div>
      <div className="divide-y divide-slate-100 bg-white">
        {children}
      </div>
    </div>
  )
}

function WhatIfRow({ enabled, onToggle, label, baseLabel, children }: {
  enabled: boolean
  onToggle: (v: boolean) => void
  label: string
  baseLabel: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5">
      <input
        type="checkbox"
        checked={enabled}
        onChange={e => onToggle(e.target.checked)}
        className="w-4 h-4 rounded shrink-0 cursor-pointer"
        style={{ accentColor: '#7B1515' }}
      />
      <span className={`text-sm w-52 shrink-0 ${enabled ? 'font-medium text-slate-800' : 'text-slate-600'}`}>
        {label}
      </span>
      {enabled ? (
        <div className="flex items-center gap-2 flex-wrap">
          {children}
          <span className="text-xs text-slate-400">
            instead of <span className="font-medium text-slate-500">{baseLabel}</span>
          </span>
        </div>
      ) : (
        <span className="text-xs text-slate-400">
          Base: <span className="font-medium text-slate-500">{baseLabel}</span>
        </span>
      )}
    </div>
  )
}

function LongevitySlider({
  label, currentAge, baseAge, value, enabled, onChange,
}: {
  label: string
  currentAge: number
  baseAge: number
  value: number
  enabled: boolean
  onChange: (age: number, enabled: boolean) => void
}) {
  const min      = Math.floor(currentAge)
  const max      = 100
  const val      = Math.max(min, Math.min(max, value))
  const fillPct  = ((val  - min) / (max - min)) * 100
  const basePct  = ((baseAge - min) / (max - min)) * 100
  const active   = enabled
  const trackFill = active ? '#7B1515' : '#cbd5e1'
  const trackRest = '#e2e8f0'

  return (
    <div className="px-3 py-3">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-slate-600">{label}</span>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold tabular-nums"
            style={{ color: active ? '#7B1515' : '#94a3b8' }}>
            {val}
          </span>
          {!active && <span className="text-xs text-slate-400">base plan</span>}
        </div>
      </div>

      {/* Slider + tick mark */}
      <div className="relative pb-6">
        <input
          type="range"
          min={min} max={max} step={1} value={val}
          onChange={e => { const v = parseInt(e.target.value); onChange(v, v !== baseAge) }}
          className="longevity-slider w-full"
          style={{
            color:      trackFill,
            background: `linear-gradient(to right, ${trackFill} ${fillPct}%, ${trackRest} ${fillPct}%)`,
          }}
        />
        <div className="absolute bottom-0 flex flex-col items-center pointer-events-none"
          style={{ left: `${basePct}%`, transform: 'translateX(-50%)' }}>
          <div className="w-px h-2.5 bg-slate-400" />
          <span className="text-[9px] text-slate-400 whitespace-nowrap leading-none mt-0.5">base</span>
        </div>
      </div>

      <div className="flex justify-between text-[10px] text-slate-400">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}

function MetricCard({ label, value, sub, frozen, betterWhenHigher = true }: {
  label: string
  value: string
  sub?: string
  frozen?: { value: string; sub?: string; numericDelta: number } | null
  betterWhenHigher?: boolean
}) {
  const isBetter = frozen != null && (betterWhenHigher ? frozen.numericDelta > 0 : frozen.numericDelta < 0)
  const isWorse  = frozen != null && (betterWhenHigher ? frozen.numericDelta < 0 : frozen.numericDelta > 0)
  const arrow    = frozen != null && frozen.numericDelta !== 0 ? (isBetter ? '▲' : '▼') : null
  const arrowColor = isBetter ? 'text-green-500' : isWorse ? 'text-red-500' : 'text-slate-400'

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {frozen != null ? (
        <div className="flex flex-1 divide-x divide-slate-200">
          <div className="flex-1 min-w-0 px-3 py-2.5">
            <div className="text-xs text-slate-400 leading-tight mb-1.5">{label}</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-slate-800 leading-tight">{value}</span>
              {arrow && <span className={`text-base font-bold leading-none shrink-0 ${arrowColor}`}>{arrow}</span>}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">{sub ?? '\u00A0'}</div>
          </div>
          <div className="flex-1 min-w-0 px-3 py-2.5 bg-blue-50">
            <div className="text-xs text-blue-400 leading-tight mb-1.5">Frozen</div>
            <div className="text-base font-semibold text-slate-500 leading-tight">{frozen.value}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{frozen.sub ?? '\u00A0'}</div>
          </div>
        </div>
      ) : (
        <div className="px-3 py-2.5 flex-1">
          <div className="text-xs text-slate-400 leading-tight mb-1.5">{label}</div>
          <div className="text-base font-bold text-slate-800 leading-tight">{value}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">{sub ?? '\u00A0'}</div>
        </div>
      )}
    </div>
  )
}

// ─── DashboardTab ─────────────────────────────────────────────────────────────

export function DashboardTab() {
  const state = useStore()
  const {
    whatIfs, frozenMetrics, scenarios, activeScenarioId,
    updateWhatIf, resetWhatIfs, freezeMetrics, clearFreeze,
    saveScenario, loadScenario, deleteScenario,
    personA, personB, cppA, cppB, oasA, oasB,
    returnRates, personalInflationRatePct, withdrawalStrategy,
    ageReferencePerson,
  } = state

  const basePensionSplitLabel = withdrawalStrategy.pensionSplitMode === 'auto'
    ? 'Auto'
    : `Manual (${withdrawalStrategy.pensionSplitPct}%)`

  const aName = personA.name || 'Person A'
  const bName = personB.name || 'Person B'

  // ── Base plan "instead of" labels ─────────────────────────────────────────

  const todayIso    = useMemo(() => new Date().toISOString().slice(0, 10), [])
  const currentAgeA = exactAgeAt(personA.birthDate, todayIso)
  const currentAgeB = exactAgeAt(personB.birthDate, todayIso)

  const cppBaseAgeA = Math.round(exactAgeAt(personA.birthDate, cppA.startDate))
  const cppBaseAgeB = Math.round(exactAgeAt(personB.birthDate, cppB.startDate))
  const oasBaseAgeA = Math.round(exactAgeAt(personA.birthDate, oasA.startDate))
  const oasBaseAgeB = Math.round(exactAgeAt(personB.birthDate, oasB.startDate))
  const ratesLabel  = `${returnRates.upTo55} / ${returnRates.from55to65} / ${returnRates.from65to70} / ${returnRates.from70plus}%`

  // ── Projection ────────────────────────────────────────────────────────────

  const effectiveState = useMemo(
    () => mergeWhatIfs(state as AppState, whatIfs),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state, whatIfs],
  )
  const { dataPoints, warnings } = useMemo(() => runProjection(effectiveState), [effectiveState])
  const metrics = useMemo(
    () => computeHeadlineMetrics(dataPoints, ageReferencePerson, effectiveState as AppState),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataPoints, ageReferencePerson, effectiveState],
  )

  // ── Scenario controls state ────────────────────────────────────────────────

  const [savingAs, setSavingAs]   = useState(false)
  const [saveName, setSaveName]   = useState('')
  const [showLoad, setShowLoad]   = useState(false)
  const activeScenario = scenarios.find(s => s.id === activeScenarioId)

  function handleSave() {
    const name = saveName.trim()
    if (!name) return
    saveScenario(name)
    setSavingAs(false)
    setSaveName('')
  }

  // ── Chart state ───────────────────────────────────────────────────────────

  const [xAxisMode, setXAxisMode] = useState<XAxisMode>('year')

  if (dataPoints.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
        No projection data. Check that birth dates and retirement dates are set in the Assumptions tab.
      </div>
    )
  }

  const years = dataPoints.map(d => d.year)
  const xAxis = buildXAxis(years, xAxisMode, personA.birthDate, personB.birthDate,
    personA.planningEndAge, personB.planningEndAge)

  // ── Frozen metric helpers ─────────────────────────────────────────────────

  function frozenFor(
    current: number,
    frozenVal: number | undefined,
    formatter: (v: number) => string,
    betterWhenHigh = true,
    frozenSub?: string,
  ) {
    if (frozenMetrics == null || frozenVal == null) return undefined
    return {
      value:        formatter(frozenVal),
      sub:          frozenSub,
      numericDelta: betterWhenHigh ? current - frozenVal : frozenVal - current,
    }
  }

  // ── Chart data ────────────────────────────────────────────────────────────

  const incomeData: Data[] = [
    { x: years, y: dataPoints.map(d => d.employmentA),                          name: `${aName} Employment`,     type: 'bar', marker: { color: CHART_COLORS.employmentA } },
    { x: years, y: dataPoints.map(d => d.employmentB),                          name: `${bName} Employment`,     type: 'bar', marker: { color: CHART_COLORS.employmentB } },
    { x: years, y: dataPoints.map(d => d.dbPensionBase + d.dbPensionBaseB),     name: 'DB Pension (lifetime)',   type: 'bar', marker: { color: CHART_COLORS.pensionA } },
    { x: years, y: dataPoints.map(d => d.dbBridge + d.dbBridgeB),               name: 'DB Bridge Benefit',       type: 'bar', marker: { color: CHART_COLORS.pensionBridgeA } },
    { x: years, y: dataPoints.map(d => d.cppA),                                 name: `${aName} CPP`,            type: 'bar', marker: { color: CHART_COLORS.cppA } },
    { x: years, y: dataPoints.map(d => d.cppB),                                 name: `${bName} CPP`,            type: 'bar', marker: { color: CHART_COLORS.cppB } },
    { x: years, y: dataPoints.map(d => d.oasA),                                 name: `${aName} OAS`,            type: 'bar', marker: { color: CHART_COLORS.oasA } },
    { x: years, y: dataPoints.map(d => d.oasB),                                 name: `${bName} OAS`,            type: 'bar', marker: { color: CHART_COLORS.oasB } },
    { x: years, y: dataPoints.map(d => d.rrifA + d.rrifB),                      name: 'RRIF Withdrawals',        type: 'bar', marker: { color: CHART_COLORS.rrifA } },
    { x: years, y: dataPoints.map(d => d.tfsaWithdrawalA + d.tfsaWithdrawalB),  name: 'TFSA Withdrawals',        type: 'bar', marker: { color: CHART_COLORS.tfsaA } },
    { x: years, y: dataPoints.map(d => d.nonRegWithdrawalA + d.nonRegWithdrawalB), name: 'Non-Reg Withdrawals',  type: 'bar', marker: { color: CHART_COLORS.nonRegA } },
    { x: years, y: dataPoints.map(d => d.otherIncomeA + d.otherIncomeB),        name: 'Other Income',            type: 'bar', marker: { color: CHART_COLORS.otherIncomeA } },
    { x: years, y: dataPoints.map(d => d.householdSpending), name: 'Spending Target',   type: 'scatter', mode: 'markers', marker: { color: CHART_COLORS.spending, size: 4, symbol: 'line-ew', line: { color: CHART_COLORS.spending, width: 2 } } },
    { x: years, y: dataPoints.map(d => d.totalHouseholdNet), name: 'Net Income (after tax)', type: 'scatter', mode: 'markers', marker: { color: '#1e293b', size: 4, symbol: 'line-ew', line: { color: '#1e293b', width: 2 } } },
  ]

  const taxData: Data[] = [
    { x: years, y: dataPoints.map(d => d.taxA), name: `${aName} Tax`, type: 'bar', marker: { color: '#ef4444' } },
    { x: years, y: dataPoints.map(d => d.taxB), name: `${bName} Tax`, type: 'bar', marker: { color: '#f97316' } },
    { x: years, y: dataPoints.map(d => d.effectiveTaxRateA * 100), name: `${aName} Effective Rate`, type: 'scatter', mode: 'markers', yaxis: 'y2', marker: { color: '#dc2626', size: 4, symbol: 'circle' } },
    { x: years, y: dataPoints.map(d => d.effectiveTaxRateB * 100), name: `${bName} Effective Rate`, type: 'scatter', mode: 'markers', yaxis: 'y2', marker: { color: '#ea580c', size: 4, symbol: 'circle' } },
  ]

  const portfolioData: Data[] = [
    { x: years, y: dataPoints.map(d => d.rrspA),   name: `${aName} RRSP/RRIF`, type: 'bar', marker: { color: CHART_COLORS.rrifA } },
    { x: years, y: dataPoints.map(d => d.rrspB),   name: `${bName} RRSP/RRIF`, type: 'bar', marker: { color: CHART_COLORS.rrifB } },
    { x: years, y: dataPoints.map(d => d.tfsaA),   name: `${aName} TFSA`,      type: 'bar', marker: { color: CHART_COLORS.tfsaA } },
    { x: years, y: dataPoints.map(d => d.tfsaB),   name: `${bName} TFSA`,      type: 'bar', marker: { color: CHART_COLORS.tfsaB } },
    { x: years, y: dataPoints.map(d => d.nonRegA), name: `${aName} Non-Reg`,   type: 'bar', marker: { color: CHART_COLORS.nonRegA } },
    { x: years, y: dataPoints.map(d => d.nonRegB), name: `${bName} Non-Reg`,   type: 'bar', marker: { color: CHART_COLORS.nonRegB } },
    { x: years, y: dataPoints.map(d => d.hisa),    name: 'HISA / Cash',        type: 'bar', marker: { color: '#94a3b8' } },
  ]

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">

      {/* ── Scenario Card ─────────────────────────────────────────────────── */}
      <SectionDivider title="Scenarios" />
      <SectionCard title="Scenario" width="full">
        <div className="overflow-x-auto rounded border border-slate-200">
          <div className="bg-slate-50 border-b border-slate-200 px-3 py-2">
            <span className="text-sm font-medium text-slate-700">Saved Scenarios</span>
          </div>
          <div className="px-3 py-3 flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Active:</span>
              {activeScenario
                ? <span className="text-sm font-semibold text-slate-700">{activeScenario.name}</span>
                : <span className="text-sm text-slate-400 italic">None loaded</span>
              }
            </div>

            {savingAs ? (
              <div className="flex items-center gap-1">
                <input
                  className="input-field text-xs py-1 w-44"
                  placeholder="Scenario name…"
                  value={saveName}
                  autoFocus
                  onChange={e => setSaveName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setSavingAs(false) }}
                />
                <button className="btn-primary text-xs py-1 px-2" onClick={handleSave}>Save</button>
                <button className="btn-secondary text-xs py-1 px-2" onClick={() => setSavingAs(false)}>Cancel</button>
              </div>
            ) : (
              <button className="btn-primary" onClick={() => { setSavingAs(true); setSaveName(activeScenario?.name ?? '') }}>
                Save As…
              </button>
            )}

            {scenarios.length > 0 && (
              <div className="relative">
                <button className="btn-secondary" onClick={() => setShowLoad(o => !o)}>
                  Load ▾
                </button>
                {showLoad && (
                  <div className="absolute left-0 top-full mt-1 w-56 bg-white rounded-lg border border-slate-200 shadow-lg py-1 z-20">
                    {scenarios.map(s => (
                      <div key={s.id} className="flex items-center justify-between px-3 py-1.5 hover:bg-slate-50">
                        <button
                          className="text-sm text-slate-700 text-left flex-1 truncate"
                          onClick={() => { loadScenario(s.id); setShowLoad(false) }}
                        >
                          {s.name}
                        </button>
                        <button
                          className="text-xs text-slate-400 hover:text-red-600 ml-2 shrink-0"
                          onClick={() => deleteScenario(s.id)}
                          title="Delete scenario"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <button className="btn-secondary" onClick={resetWhatIfs}>Reset All</button>
          </div>
        </div>
      </SectionCard>

      {/* ── Drawdown Strategy Card ────────────────────────────────────────── */}
      <SectionCard title="Drawdown Strategy" width="full">
        <div className="space-y-3">
          <div className="overflow-x-auto rounded border border-slate-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th colSpan={2} className="px-3 py-2 text-left font-medium text-slate-700">Strategy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/50">
                  <td className="px-3 py-2 text-slate-600 w-40">Type</td>
                  <td className="px-2 py-1.5">
                    <SelectInput
                      label=""
                      value={whatIfs.drawdownStrategy.value.strategyType}
                      onChange={v => {
                        const type = v as DrawdownStrategyType
                        updateWhatIf('drawdownStrategy', {
                          enabled: type !== 'none',
                          value: { ...whatIfs.drawdownStrategy.value, strategyType: type },
                        })
                      }}
                      options={DRAWDOWN_STRATEGY_OPTIONS}
                    />
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className="px-3 py-2 text-xs text-slate-500">
                    {DRAWDOWN_STRATEGY_DESCRIPTIONS[whatIfs.drawdownStrategy.value.strategyType]}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Fixed Withdrawals config */}
          {whatIfs.drawdownStrategy.value.strategyType === 'fixedWithdrawal' && (
            <div className="overflow-x-auto rounded border border-slate-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th colSpan={2} className="px-3 py-2 text-left font-medium text-slate-700">Annual Withdrawals — today's dollars, inflated each year</th>
                  </tr>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
                    <th className="px-3 py-2 text-left font-medium">Account</th>
                    <th className="px-3 py-2 font-medium">Amount ($ / yr)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {([
                    ['RRSP / RRIF', 'rrspAmount'   ],
                    ['TFSA',        'tfsaAmount'   ],
                    ['Non-Reg',     'nonRegAmount' ],
                  ] as const).map(([label, key]) => (
                    <tr key={label} className="hover:bg-slate-50/50">
                      <td className="px-3 py-2 text-slate-600 w-1/2">{label}</td>
                      <td className="px-2 py-1.5 w-1/2">
                        <NumberInput label=""
                          value={whatIfs.drawdownStrategy.value.fixedWithdrawal[key]}
                          onChange={v => updateWhatIf('drawdownStrategy', {
                            value: {
                              ...whatIfs.drawdownStrategy.value,
                              fixedWithdrawal: { ...whatIfs.drawdownStrategy.value.fixedWithdrawal, [key]: v },
                            },
                          })}
                          min={0} max={500_000} step={1000} decimals={0} size="sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="px-3 py-2 text-[10px] text-slate-400 border-t border-slate-100">
                RRSP/RRIF draws also respect mandatory RRIF minimums. Draws occur before tax.
              </p>
            </div>
          )}

          {/* Fixed Percentage config */}
          {whatIfs.drawdownStrategy.value.strategyType === 'fixedPct' && (
            <div className="overflow-x-auto rounded border border-slate-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th colSpan={3} className="px-3 py-2 text-left font-medium text-slate-700">Annual Withdrawals — % of balance, with floor</th>
                  </tr>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
                    <th className="px-3 py-2 text-left font-medium">Account</th>
                    <th className="px-3 py-2 font-medium">Rate (% / yr)</th>
                    <th className="px-3 py-2 font-medium">Floor ($ / yr)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {([
                    ['RRSP / RRIF', 'rrspPct',   'rrspMin'   ],
                    ['TFSA',        'tfsaPct',   'tfsaMin'   ],
                    ['Non-Reg',     'nonRegPct', 'nonRegMin' ],
                  ] as const).map(([label, pctKey, minKey]) => (
                    <tr key={label} className="hover:bg-slate-50/50">
                      <td className="px-3 py-2 text-slate-600 w-1/3">{label}</td>
                      <td className="px-2 py-1.5 w-1/3">
                        <NumberInput label=""
                          value={whatIfs.drawdownStrategy.value.fixedPct[pctKey]}
                          onChange={v => updateWhatIf('drawdownStrategy', {
                            value: {
                              ...whatIfs.drawdownStrategy.value,
                              fixedPct: { ...whatIfs.drawdownStrategy.value.fixedPct, [pctKey]: v },
                            },
                          })}
                          min={0} max={100} step={0.5} decimals={1} size="sm" />
                      </td>
                      <td className="px-2 py-1.5 w-1/3">
                        <NumberInput label=""
                          value={whatIfs.drawdownStrategy.value.fixedPct[minKey]}
                          onChange={v => updateWhatIf('drawdownStrategy', {
                            value: {
                              ...whatIfs.drawdownStrategy.value,
                              fixedPct: { ...whatIfs.drawdownStrategy.value.fixedPct, [minKey]: v },
                            },
                          })}
                          min={0} max={500_000} step={1000} decimals={0} size="sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="px-3 py-2 text-[10px] text-slate-400 border-t border-slate-100">
                Each year: withdraw max(rate × balance, floor). RRSP/RRIF also respects mandatory RRIF minimums. Draws occur before tax.
              </p>
            </div>
          )}
        </div>
      </SectionCard>

      {/* ── Base Plan Modifications Card ──────────────────────────────────── */}
      <SectionCard title="Base Plan Modifications" width="full">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="space-y-3">

            <WhatIfSection title="Market">
              <WhatIfRow
                enabled={whatIfs.returnRateOffset.enabled}
                onToggle={v => updateWhatIf('returnRateOffset', { enabled: v, value: v ? whatIfs.returnRateOffset.value : 0 })}
                label="Return Rate Offset"
                baseLabel={ratesLabel}
              >
                <NumberInput label="" value={whatIfs.returnRateOffset.value}
                  onChange={v => updateWhatIf('returnRateOffset', { value: v })}
                  suffix="%" min={-15} max={15} step={0.5} decimals={1} size="sm" />
                <span className="text-xs text-slate-500">applied to all tiers</span>
              </WhatIfRow>
              <WhatIfRow
                enabled={whatIfs.inflationRate.enabled}
                onToggle={v => updateWhatIf('inflationRate', { enabled: v, value: v ? personalInflationRatePct : whatIfs.inflationRate.value })}
                label="Personal Inflation Rate"
                baseLabel={`${personalInflationRatePct}%`}
              >
                <NumberInput label="" value={whatIfs.inflationRate.value}
                  onChange={v => updateWhatIf('inflationRate', { value: v })}
                  suffix="% / year" min={0} max={20} step={0.25} decimals={2} size="sm" />
              </WhatIfRow>
            </WhatIfSection>

            <WhatIfSection title="Longevity">
              <LongevitySlider
                label={`${aName}'s Age at Death`}
                currentAge={currentAgeA}
                baseAge={personA.planningEndAge}
                value={whatIfs.longevityA.enabled ? whatIfs.longevityA.value : personA.planningEndAge}
                enabled={whatIfs.longevityA.enabled}
                onChange={(age, active) => updateWhatIf('longevityA', { enabled: active, value: age })}
              />
              <LongevitySlider
                label={`${bName}'s Age at Death`}
                currentAge={currentAgeB}
                baseAge={personB.planningEndAge}
                value={whatIfs.longevityB.enabled ? whatIfs.longevityB.value : personB.planningEndAge}
                enabled={whatIfs.longevityB.enabled}
                onChange={(age, active) => updateWhatIf('longevityB', { enabled: active, value: age })}
              />
            </WhatIfSection>

          </div>
          <div className="space-y-3">

            <WhatIfSection title="Government Benefits">
              <WhatIfRow
                enabled={whatIfs.cppStartAgeA.enabled}
                onToggle={v => updateWhatIf('cppStartAgeA', { enabled: v, value: v ? cppBaseAgeA : whatIfs.cppStartAgeA.value })}
                label={`CPP Start — ${aName}`}
                baseLabel={`age ${cppBaseAgeA}`}
              >
                <NumberInput label="" value={whatIfs.cppStartAgeA.value}
                  onChange={v => updateWhatIf('cppStartAgeA', { value: v })}
                  suffix="years old" min={60} max={70} step={1} decimals={0} size="sm" />
              </WhatIfRow>
              <WhatIfRow
                enabled={whatIfs.cppStartAgeB.enabled}
                onToggle={v => updateWhatIf('cppStartAgeB', { enabled: v, value: v ? cppBaseAgeB : whatIfs.cppStartAgeB.value })}
                label={`CPP Start — ${bName}`}
                baseLabel={`age ${cppBaseAgeB}`}
              >
                <NumberInput label="" value={whatIfs.cppStartAgeB.value}
                  onChange={v => updateWhatIf('cppStartAgeB', { value: v })}
                  suffix="years old" min={60} max={70} step={1} decimals={0} size="sm" />
              </WhatIfRow>
              <WhatIfRow
                enabled={whatIfs.oasStartAgeA.enabled}
                onToggle={v => updateWhatIf('oasStartAgeA', { enabled: v, value: v ? oasBaseAgeA : whatIfs.oasStartAgeA.value })}
                label={`OAS Start — ${aName}`}
                baseLabel={`age ${oasBaseAgeA}`}
              >
                <NumberInput label="" value={whatIfs.oasStartAgeA.value}
                  onChange={v => updateWhatIf('oasStartAgeA', { value: v })}
                  suffix="years old" min={65} max={70} step={1} decimals={0} size="sm" />
              </WhatIfRow>
              <WhatIfRow
                enabled={whatIfs.oasStartAgeB.enabled}
                onToggle={v => updateWhatIf('oasStartAgeB', { enabled: v, value: v ? oasBaseAgeB : whatIfs.oasStartAgeB.value })}
                label={`OAS Start — ${bName}`}
                baseLabel={`age ${oasBaseAgeB}`}
              >
                <NumberInput label="" value={whatIfs.oasStartAgeB.value}
                  onChange={v => updateWhatIf('oasStartAgeB', { value: v })}
                  suffix="years old" min={65} max={70} step={1} decimals={0} size="sm" />
              </WhatIfRow>
            </WhatIfSection>

            <WhatIfSection title="Withdrawal Strategy">
              <WhatIfRow
                enabled={whatIfs.withdrawalOrder.enabled}
                onToggle={v => updateWhatIf('withdrawalOrder', { enabled: v, value: v ? withdrawalStrategy.withdrawalOrder : whatIfs.withdrawalOrder.value })}
                label="Withdrawal Order"
                baseLabel={WITHDRAWAL_ORDER_LABELS[withdrawalStrategy.withdrawalOrder]}
              >
                <SelectInput label="" value={whatIfs.withdrawalOrder.value}
                  onChange={v => updateWhatIf('withdrawalOrder', { value: v as WithdrawalOrder })}
                  options={WITHDRAWAL_ORDER_OPTIONS} />
              </WhatIfRow>
              <WhatIfRow
                enabled={whatIfs.pensionSplit.enabled}
                onToggle={v => updateWhatIf('pensionSplit', {
                  enabled: v,
                  value: v
                    ? { mode: withdrawalStrategy.pensionSplitMode, pct: withdrawalStrategy.pensionSplitPct }
                    : whatIfs.pensionSplit.value,
                })}
                label="Pension Income Splitting"
                baseLabel={basePensionSplitLabel}
              >
                <SelectInput label="" value={whatIfs.pensionSplit.value.mode}
                  onChange={v => updateWhatIf('pensionSplit', { value: { ...whatIfs.pensionSplit.value, mode: v as PensionSplitMode } })}
                  options={PENSION_SPLIT_OPTIONS} />
                {whatIfs.pensionSplit.value.mode === 'manual' && (
                  <NumberInput label="" value={whatIfs.pensionSplit.value.pct}
                    onChange={v => updateWhatIf('pensionSplit', { value: { ...whatIfs.pensionSplit.value, pct: v } })}
                    suffix="%" min={0} max={50} step={1} decimals={0} size="sm" />
                )}
              </WhatIfRow>
            </WhatIfSection>

          </div>
        </div>
      </SectionCard>

      {/* ── Key Outcomes ──────────────────────────────────────────────────── */}
      <SectionDivider title="Outcomes" />
      <SectionCard title="Key Outcomes" width="full">
        <div className="flex justify-end mb-3">
          {frozenMetrics && (
            <button className="btn-secondary mr-2" onClick={clearFreeze}>Clear Freeze</button>
          )}
          <button
            className="btn-primary"
            onClick={() => freezeMetrics(metrics)}
            title="Freeze current values as a comparison baseline"
          >
            {frozenMetrics ? 'Re-Freeze' : 'Freeze'}
          </button>
        </div>

        <div className="space-y-4">

          {/* Portfolio */}
          <div className="rounded border border-slate-200">
            <div className="bg-slate-50 border-b border-slate-200 px-3 py-2">
              <span className="text-sm font-medium text-slate-700">Portfolio</span>
            </div>
            <div className="p-3 grid grid-cols-2 md:grid-cols-3 gap-3">
              <MetricCard label="At Start"
                value={fmt(metrics.portfolioAtStart)}
                frozen={frozenFor(metrics.portfolioAtStart, frozenMetrics?.portfolioAtStart, fmt)} />
              <MetricCard label="Peak"
                value={fmt(metrics.peakPortfolio)}
                sub={`in ${metrics.peakPortfolioYear}`}
                frozen={frozenFor(metrics.peakPortfolio, frozenMetrics?.peakPortfolio, fmt, true,
                  frozenMetrics ? `in ${frozenMetrics.peakPortfolioYear}` : undefined)} />
              <MetricCard label={`At ${aName}'s Death`}
                value={fmt(metrics.portfolioAtDeathA)}
                frozen={frozenFor(metrics.portfolioAtDeathA, frozenMetrics?.portfolioAtDeathA, fmt)} />
              <MetricCard label={`At ${bName}'s Death`}
                value={fmt(metrics.portfolioAtDeathB)}
                frozen={frozenFor(metrics.portfolioAtDeathB, frozenMetrics?.portfolioAtDeathB, fmt)} />
            </div>
          </div>

          {/* Spending */}
          <div className="rounded border border-slate-200">
            <div className="bg-slate-50 border-b border-slate-200 px-3 py-2">
              <span className="text-sm font-medium text-slate-700">Spending</span>
            </div>
            <div className="p-3 grid grid-cols-2 md:grid-cols-3 gap-3">
              <MetricCard label="Shortfall — Years"
                betterWhenHigher={false}
                value={metrics.shortfallYears === 0 ? 'None' : `${metrics.shortfallYears} of ${metrics.totalYears} yrs`}
                sub={metrics.shortfallYears > 0 ? fmtPct(metrics.shortfallPct) : undefined}
                frozen={frozenFor(metrics.shortfallYears, frozenMetrics?.shortfallYears,
                  v => v === 0 ? 'None' : `${v} yrs`, false,
                  frozenMetrics && frozenMetrics.shortfallYears > 0 ? fmtPct(frozenMetrics.shortfallPct) : undefined)} />
              <MetricCard label="Shortfall — Annual Avg"
                betterWhenHigher={false}
                value={metrics.avgAnnualShortfall < 1 ? 'None' : fmt(metrics.avgAnnualShortfall)}
                frozen={frozenFor(metrics.avgAnnualShortfall, frozenMetrics?.avgAnnualShortfall,
                  v => v < 1 ? 'None' : fmt(v), false)} />
              <MetricCard label="Shortfall — Peak Year"
                betterWhenHigher={false}
                value={metrics.peakAnnualShortfall < 1 ? 'None' : fmt(metrics.peakAnnualShortfall)}
                sub={metrics.peakShortfallYear > 0 ? `in ${metrics.peakShortfallYear}` : undefined}
                frozen={frozenFor(metrics.peakAnnualShortfall, frozenMetrics?.peakAnnualShortfall,
                  v => v < 1 ? 'None' : fmt(v), false,
                  frozenMetrics && frozenMetrics.peakShortfallYear > 0 ? `in ${frozenMetrics.peakShortfallYear}` : undefined)} />
            </div>
          </div>

          {/* Tax */}
          <div className="rounded border border-slate-200">
            <div className="bg-slate-50 border-b border-slate-200 px-3 py-2">
              <span className="text-sm font-medium text-slate-700">Tax</span>
            </div>
            <div className="p-3 grid grid-cols-2 md:grid-cols-3 gap-3">
              <MetricCard label="Lifetime Total"
                betterWhenHigher={false}
                value={fmt(metrics.lifetimeTaxPaid)}
                frozen={frozenFor(metrics.lifetimeTaxPaid, frozenMetrics?.lifetimeTaxPaid, fmt, false)} />
              <MetricCard label="Avg Effective Rate"
                betterWhenHigher={false}
                value={fmtPct(metrics.avgEffectiveTaxRate)}
                frozen={frozenFor(metrics.avgEffectiveTaxRate, frozenMetrics?.avgEffectiveTaxRate, fmtPct, false)} />
              <MetricCard label="Peak Year"
                betterWhenHigher={false}
                value={fmt(metrics.peakTaxAmount)}
                sub={`in ${metrics.peakTaxYear}`}
                frozen={frozenFor(metrics.peakTaxAmount, frozenMetrics?.peakTaxAmount, fmt, false,
                  frozenMetrics ? `in ${frozenMetrics.peakTaxYear}` : undefined)} />
            </div>
          </div>

          {/* Government Benefits */}
          <div className="rounded border border-slate-200">
            <div className="bg-slate-50 border-b border-slate-200 px-3 py-2">
              <span className="text-sm font-medium text-slate-700">Government Benefits</span>
            </div>
            <div className="p-3 grid grid-cols-2 md:grid-cols-3 gap-3">
              <MetricCard label="CPP — Total Collected"
                value={fmt(metrics.totalCPPCollected)}
                frozen={frozenFor(metrics.totalCPPCollected, frozenMetrics?.totalCPPCollected, fmt)} />
              <MetricCard label="OAS — Total Collected"
                value={fmt(metrics.totalOASCollected)}
                frozen={frozenFor(metrics.totalOASCollected, frozenMetrics?.totalOASCollected, fmt)} />
              <MetricCard label="OAS — Clawback"
                betterWhenHigher={false}
                value={metrics.oasClawbackYears === 0 ? 'None' : `${metrics.oasClawbackYears} yrs`}
                sub={metrics.oasClawbackYears > 0 ? `${fmtPct(metrics.oasClawbackPct)} of OAS years` : undefined}
                frozen={frozenFor(metrics.oasClawbackYears, frozenMetrics?.oasClawbackYears,
                  v => v === 0 ? 'None' : `${v} yrs`, false,
                  frozenMetrics && frozenMetrics.oasClawbackYears > 0
                    ? `${fmtPct(frozenMetrics.oasClawbackPct)} of OAS years` : undefined)} />
              <MetricCard label="CPP — vs Age 65 Start"
                betterWhenHigher={true}
                value={(metrics.cppVs65 >= 0 ? '+' : '') + fmt(metrics.cppVs65)}
                frozen={frozenFor(metrics.cppVs65, frozenMetrics?.cppVs65,
                  v => (v >= 0 ? '+' : '') + fmt(v))} />
              <MetricCard label="OAS — vs Age 65 Start"
                betterWhenHigher={true}
                value={(metrics.oasVs65 >= 0 ? '+' : '') + fmt(metrics.oasVs65)}
                frozen={frozenFor(metrics.oasVs65, frozenMetrics?.oasVs65,
                  v => (v >= 0 ? '+' : '') + fmt(v))} />
            </div>
          </div>

        </div>
      </SectionCard>

      {/* ── Projection warnings ────────────────────────────────────────────── */}
      {warnings.length > 0 && (
        <div className="p-3 bg-amber-50 border border-amber-300 rounded text-xs text-amber-800 space-y-1">
          <p className="font-semibold">Projection warnings:</p>
          {warnings.slice(0, 5).map((w, i) => <p key={i}>• {w}</p>)}
          {warnings.length > 5 && <p>…and {warnings.length - 5} more</p>}
        </div>
      )}

      {/* ── Charts ────────────────────────────────────────────────────────── */}
      <SectionCard title="Household Income by Source — Present-Day Dollars" width="full"
        info="Stacked bars = annual gross income by source. Tick marks = net after tax (black) and spending target (red).">
        <PlotlyChart
          data={incomeData}
          layout={{ barmode: 'stack', yaxis: { title: { text: 'Annual Income ($)', font: { size: 11 } }, tickformat: ',.0f' }, xaxis: { ...xAxis } }}
          style={{ height: 420 }}
        />
      </SectionCard>

      <SectionCard title="Tax Paid — Present-Day Dollars" width="full">
        <PlotlyChart
          data={taxData}
          layout={{
            barmode: 'stack',
            yaxis:  { title: { text: 'Tax Paid ($)', font: { size: 11 } }, tickformat: ',.0f' },
            yaxis2: { title: { text: 'Effective Rate (%)', font: { size: 11 } }, overlaying: 'y', side: 'right', tickformat: '.1f', range: [0, 60] },
            xaxis:  { ...xAxis },
          }}
          style={{ height: 320 }}
        />
      </SectionCard>

      <SectionCard title="Portfolio Balances — Present-Day Dollars" width="full">
        <PlotlyChart
          data={portfolioData}
          layout={{ barmode: 'stack', yaxis: { title: { text: 'Account Balance ($)', font: { size: 11 } }, tickformat: ',.0f' }, xaxis: { ...xAxis } }}
          style={{ height: 320 }}
        />
        <XAxisSelector value={xAxisMode} onChange={setXAxisMode} aName={aName} bName={bName} />
      </SectionCard>

      {/* ── Annual Summary Table ───────────────────────────────────────────── */}
      <SectionCard title="Annual Summary Table" width="full">
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
                  <td className="px-2 py-1 border border-slate-100 text-right">{fmt(d.grossIncomeA)}</td>
                  <td className="px-2 py-1 border border-slate-100 text-right">{fmt(d.grossIncomeB)}</td>
                  <td className="px-2 py-1 border border-slate-100 text-right text-red-600">{fmt(d.taxA)}</td>
                  <td className="px-2 py-1 border border-slate-100 text-right text-red-600">{fmt(d.taxB)}</td>
                  <td className="px-2 py-1 border border-slate-100 text-right font-medium">{fmt(d.totalHouseholdNet)}</td>
                  <td className="px-2 py-1 border border-slate-100 text-right">{fmt(d.householdSpending)}</td>
                  <td className={`px-2 py-1 border border-slate-100 text-right font-medium ${d.cashFlow < 0 ? 'text-red-600' : 'text-green-700'}`}>
                    {fmt(d.cashFlow)}
                  </td>
                  <td className="px-2 py-1 border border-slate-100 text-right">{fmt(d.totalPortfolio)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

    </div>
  )
}

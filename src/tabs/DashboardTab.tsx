import { useMemo, useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { SectionCard } from '../components/SectionCard'
import { SectionDivider } from '../components/SectionDivider'
import { NumberInput } from '../components/NumberInput'
import { SelectInput } from '../components/SelectInput'
import { PlotlyChart } from '../components/PlotlyChart'
import { XAxisSelector, XAxisMode, buildXAxis } from '../components/XAxisSelector'
import { runProjection } from '../engine/projection'
import { mergeWhatIfs, computeHeadlineMetrics } from '../engine/whatifs'
import { exactAgeAt, getYear, dateAtAge, onOrAfter } from '../engine/dates'
import type { AppState, HeadlineMetrics, WithdrawalOrder, PensionSplitMode, DrawdownStrategyType, DataPoint } from '../engine/types'
import { CHART_COLORS } from './PaletteTab'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Data = any

// ─── MetricDetailModal types ───────────────────────────────────────────────────

type ModalCol = {
  header: string
  right?: boolean
  bold?: boolean
  render: (d: DataPoint) => React.ReactNode
}

type ModalDef = {
  title: string
  note?: string
  columns: ModalCol[]
  rows: DataPoint[]
  highlightRow?: (d: DataPoint) => boolean
  summary?: { label: string; value: string }[]
}

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

// ─── Income chart filter constants ────────────────────────────────────────────

type SourceKey = 'employment' | 'dbPension' | 'cpp' | 'oas' | 'rrif' | 'tfsa' | 'nonReg' | 'other'
const ALL_SOURCE_KEYS: SourceKey[] = ['employment', 'dbPension', 'cpp', 'oas', 'rrif', 'tfsa', 'nonReg', 'other']
const SOURCE_DEFS: { key: SourceKey; label: string; color: string }[] = [
  { key: 'employment', label: 'Employment', color: CHART_COLORS.employmentA },
  { key: 'dbPension',  label: 'DB Pension', color: CHART_COLORS.pensionA },
  { key: 'cpp',        label: 'CPP',        color: CHART_COLORS.cppA },
  { key: 'oas',        label: 'OAS',        color: CHART_COLORS.oasA },
  { key: 'rrif',       label: 'RRIF',       color: CHART_COLORS.rrifA },
  { key: 'tfsa',       label: 'TFSA',       color: CHART_COLORS.tfsaA },
  { key: 'nonReg',     label: 'Non-Reg',    color: CHART_COLORS.nonRegA },
  { key: 'other',      label: 'Other',      color: CHART_COLORS.otherIncomeA },
]

const DRAWDOWN_STRATEGY_DESCRIPTIONS: Record<DrawdownStrategyType, string> = {
  none:             'No account withdrawals of any kind. Portfolios grow undisturbed. All spending is shown as a shortfall. Useful as an analytical baseline to understand how your portfolio grows before any drawdown decisions are made.',
  spendGap:         'Withdraw only what is needed to cover the spending shortfall each year — nothing more. Accounts are drawn in the configured withdrawal order (TFSA first, Non-Reg, RRSP/RRIF, etc.). RRIF mandatory minimums are always withdrawn regardless of need.',
  fixedWithdrawal:  'Withdraw a fixed annual dollar amount from each account each year, regardless of spending need. Amounts are in today\'s dollars and inflate each year. Any shortfall beyond the scheduled draws is not covered. RRSP/RRIF draws respect mandatory RRIF minimums.',
  fixedPct:         'Withdraw a fixed percentage of each account\'s balance each year, with an optional dollar floor. Any shortfall beyond the scheduled draws is not covered. RRSP/RRIF draws respect mandatory RRIF minimums.',
}

// ─── ChartLegend ──────────────────────────────────────────────────────────────

function ChartLegend({ data }: { data: Data[] }) {
  const items = data.filter(s =>
    Array.isArray(s.y) && (s.y as number[]).some((v: number) => Math.abs(v) > 0.01)
  )
  if (items.length === 0) return null
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 pt-2 pb-1">
      {items.map((s: Data, i: number) => {
        const color = s.marker?.color ?? s.line?.color ?? '#94a3b8'
        const isScatter = s.type === 'scatter'
        return (
          <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-500">
            {isScatter
              ? <span className="inline-block w-3 h-0.5 rounded-full" style={{ backgroundColor: color }} />
              : <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
            }
            {s.name}
          </div>
        )
      })}
    </div>
  )
}

// ─── withTotals ───────────────────────────────────────────────────────────────
// Injects per-year bar totals into each bar series as customdata so hovertemplates
// can display both the segment value and the full stack total.

function withTotals(series: Data[]): Data[] {
  const barSeries = series.filter(s => s.type === 'bar')
  const n = (barSeries[0]?.x as number[] | undefined)?.length ?? 0
  const totals = Array.from({ length: n }, (_, i) =>
    barSeries.reduce((sum, s) => sum + (((s.y as number[])[i]) || 0), 0)
  )
  return series.map(s =>
    s.type !== 'bar' ? s : {
      ...s,
      customdata: totals,
      hovertemplate: '%{fullData.name}: $%{y:,.0f}<br>Total: $%{customdata:,.0f}<extra></extra>',
    }
  )
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

// ─── MetricDetailModal ────────────────────────────────────────────────────────

function MetricDetailModal({ def, onClose }: { def: ModalDef; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[82vh] flex flex-col"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 shrink-0">
          <div>
            <h2 className="text-base font-semibold text-slate-800">{def.title}</h2>
            {def.note && <p className="text-xs text-slate-400 mt-0.5">{def.note}</p>}
          </div>
          <button onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 text-lg leading-none">
            ✕
          </button>
        </div>

        {/* Table */}
        <div className="overflow-auto flex-1">
          <table className="w-full text-xs border-collapse">
            <thead className="sticky top-0">
              <tr className="bg-slate-100">
                {def.columns.map((col, i) => (
                  <th key={i}
                    className={`px-2 py-1.5 font-medium text-slate-600 border border-slate-200 whitespace-nowrap
                      ${col.right ? 'text-right' : 'text-left'} ${col.bold ? 'bg-slate-200' : ''}`}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {def.rows.map((d, i) => {
                const hi = def.highlightRow?.(d) ?? false
                return (
                  <tr key={i} className={`border-b border-slate-100 ${hi ? 'bg-amber-50' : 'hover:bg-slate-50/50'}`}>
                    {def.columns.map((col, j) => (
                      <td key={j}
                        className={`px-2 py-1 border border-slate-100 ${col.right ? 'text-right tabular-nums' : ''} ${col.bold ? 'font-medium' : ''}`}>
                        {col.render(d)}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Summary footer */}
        {def.summary && (
          <div className="px-5 py-3 border-t border-slate-200 shrink-0 flex gap-6 flex-wrap bg-slate-50 rounded-b-xl">
            {def.summary.map((s, i) => (
              <div key={i}>
                <div className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">{s.label}</div>
                <div className="text-sm font-semibold text-slate-700">{s.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── MetricCard ───────────────────────────────────────────────────────────────

function MetricCard({ label, value, sub, frozen, betterWhenHigher = true, onClick }: {
  label: string
  value: string
  sub?: string
  frozen?: { value: string; sub?: string; numericDelta: number } | null
  betterWhenHigher?: boolean
  onClick?: () => void
}) {
  const isBetter = frozen != null && (betterWhenHigher ? frozen.numericDelta > 0 : frozen.numericDelta < 0)
  const isWorse  = frozen != null && (betterWhenHigher ? frozen.numericDelta < 0 : frozen.numericDelta > 0)
  const arrow    = frozen != null && frozen.numericDelta !== 0 ? (frozen.numericDelta > 0 ? '▲' : '▼') : null
  const arrowColor = isBetter ? 'text-green-500' : isWorse ? 'text-red-500' : 'text-slate-400'

  return (
    <div
      className={`bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col
        ${onClick ? 'cursor-pointer hover:border-slate-300 hover:shadow-md transition-shadow duration-100' : ''}`}
      onClick={onClick}
      title={onClick ? 'Click for detail' : undefined}
    >
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

  const [xAxisModeIncome,    setXAxisModeIncome]    = useState<XAxisMode>('year')
  const [xAxisModeTax,       setXAxisModeTax]       = useState<XAxisMode>('year')
  const [xAxisModePortfolio, setXAxisModePortfolio] = useState<XAxisMode>('year')

  type IncomeMode   = 'gross' | 'net'
  type IncomePerson = 'both' | 'A' | 'B'
  const [incomeMode,     setIncomeMode]     = useState<IncomeMode>('gross')
  const [incomePerson,   setIncomePerson]   = useState<IncomePerson>('both')
  const [enabledSources, setEnabledSources] = useState<Set<SourceKey>>(() => new Set(ALL_SOURCE_KEYS))

  // ── Modal state ─────────────────────────────────────────────────────────────
  const [modalDef, setModalDef] = useState<ModalDef | null>(null)

  // Planning-end years for modal highlights
  const endYearA = getYear(dateAtAge(effectiveState.personA.birthDate, effectiveState.personA.planningEndAge))
  const endYearB = getYear(dateAtAge(effectiveState.personB.birthDate, effectiveState.personB.planningEndAge))

  // Helper: build CPP vs-65 baseline map (mirrors computeHeadlineMetrics logic)
  function buildCppBaselineMap() {
    const cpiR  = effectiveState.cpiRatePct / 100
    const piR   = effectiveState.personalInflationRatePct / 100
    const cy    = new Date().getFullYear()
    const bCPPA = effectiveState.cppA.estimatedMonthlyAt65 * 12
    const bCPPB = effectiveState.cppB.estimatedMonthlyAt65 * 12
    const a65   = dateAtAge(effectiveState.personA.birthDate, 65)
    const b65   = dateAtAge(effectiveState.personB.birthDate, 65)
    const m     = new Map<number, number>()
    for (const d of dataPoints) {
      const pdF = Math.pow((1 + cpiR) / (1 + piR), d.year - cy)
      const aA  = d.year <= endYearA, bA = d.year <= endYearB
      const aG  = onOrAfter(d.date, a65), bG = onOrAfter(d.date, b65)
      let base  = 0
      if (aA && aG)             base += bCPPA * pdF
      else if (!aA && bA && aG) base += bCPPA * 0.60 * pdF
      if (bA && bG)             base += bCPPB * pdF
      else if (!bA && aA && bG) base += bCPPB * 0.60 * pdF
      m.set(d.year, base)
    }
    return m
  }

  // Helper: build OAS vs-65 baseline map
  function buildOasBaselineMap() {
    const cpiR  = effectiveState.cpiRatePct / 100
    const piR   = effectiveState.personalInflationRatePct / 100
    const cy    = new Date().getFullYear()
    const bOASA = effectiveState.oasA.estimatedMonthlyAt65 * 12
    const bOASB = effectiveState.oasB.estimatedMonthlyAt65 * 12
    const a65   = dateAtAge(effectiveState.personA.birthDate, 65)
    const b65   = dateAtAge(effectiveState.personB.birthDate, 65)
    const m     = new Map<number, number>()
    for (const d of dataPoints) {
      const pdF = Math.pow((1 + cpiR) / (1 + piR), d.year - cy)
      const aA  = d.year <= endYearA, bA = d.year <= endYearB
      const aG  = onOrAfter(d.date, a65), bG = onOrAfter(d.date, b65)
      let base  = 0
      if (aA && aG) base += bOASA * pdF
      if (bA && bG) base += bOASB * pdF
      m.set(d.year, base)
    }
    return m
  }

  if (dataPoints.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
        No projection data. Check that birth dates and retirement dates are set in the Assumptions tab.
      </div>
    )
  }

  const years = dataPoints.map(d => d.year)
  const xAxisIncome    = buildXAxis(years, xAxisModeIncome,    effectiveState.personA.birthDate, effectiveState.personB.birthDate, effectiveState.personA.planningEndAge, effectiveState.personB.planningEndAge)
  const xAxisTax       = buildXAxis(years, xAxisModeTax,       effectiveState.personA.birthDate, effectiveState.personB.birthDate, effectiveState.personA.planningEndAge, effectiveState.personB.planningEndAge)
  const xAxisPortfolio = buildXAxis(years, xAxisModePortfolio, effectiveState.personA.birthDate, effectiveState.personB.birthDate, effectiveState.personA.planningEndAge, effectiveState.personB.planningEndAge)

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
      numericDelta: current - frozenVal,   // always raw delta; MetricCard owns the semantics
    }
  }

  // ── Chart data ────────────────────────────────────────────────────────────

  // Gross income series — tagged with _p (person) and _src (source type) for filtering
  const allIncomeSeries: Data[] = [
    { x: years, y: dataPoints.map(d => d.employmentA),       name: `${aName} Employment`, type: 'bar', marker: { color: CHART_COLORS.employmentA },    _p: 'A', _src: 'employment' },
    { x: years, y: dataPoints.map(d => d.employmentB),       name: `${bName} Employment`, type: 'bar', marker: { color: CHART_COLORS.employmentB },    _p: 'B', _src: 'employment' },
    { x: years, y: dataPoints.map(d => d.dbPensionBase),     name: `${aName} DB Pension`, type: 'bar', marker: { color: CHART_COLORS.pensionA },        _p: 'A', _src: 'dbPension'  },
    { x: years, y: dataPoints.map(d => d.dbBridge),          name: `${aName} DB Bridge`,  type: 'bar', marker: { color: CHART_COLORS.pensionBridgeA },  _p: 'A', _src: 'dbPension'  },
    { x: years, y: dataPoints.map(d => d.dbPensionBaseB),    name: `${bName} DB Pension`, type: 'bar', marker: { color: CHART_COLORS.pensionB },        _p: 'B', _src: 'dbPension'  },
    { x: years, y: dataPoints.map(d => d.dbBridgeB),         name: `${bName} DB Bridge`,  type: 'bar', marker: { color: CHART_COLORS.pensionBridgeB },  _p: 'B', _src: 'dbPension'  },
    { x: years, y: dataPoints.map(d => d.cppA),              name: `${aName} CPP`,        type: 'bar', marker: { color: CHART_COLORS.cppA },            _p: 'A', _src: 'cpp'        },
    { x: years, y: dataPoints.map(d => d.cppB),              name: `${bName} CPP`,        type: 'bar', marker: { color: CHART_COLORS.cppB },            _p: 'B', _src: 'cpp'        },
    { x: years, y: dataPoints.map(d => d.oasA),              name: `${aName} OAS`,        type: 'bar', marker: { color: CHART_COLORS.oasA },            _p: 'A', _src: 'oas'        },
    { x: years, y: dataPoints.map(d => d.oasB),              name: `${bName} OAS`,        type: 'bar', marker: { color: CHART_COLORS.oasB },            _p: 'B', _src: 'oas'        },
    { x: years, y: dataPoints.map(d => d.rrifA),             name: `${aName} RRIF`,       type: 'bar', marker: { color: CHART_COLORS.rrifA },           _p: 'A', _src: 'rrif'       },
    { x: years, y: dataPoints.map(d => d.rrifB),             name: `${bName} RRIF`,       type: 'bar', marker: { color: CHART_COLORS.rrifB },           _p: 'B', _src: 'rrif'       },
    { x: years, y: dataPoints.map(d => d.tfsaWithdrawalA),   name: `${aName} TFSA`,       type: 'bar', marker: { color: CHART_COLORS.tfsaA },           _p: 'A', _src: 'tfsa'       },
    { x: years, y: dataPoints.map(d => d.tfsaWithdrawalB),   name: `${bName} TFSA`,       type: 'bar', marker: { color: CHART_COLORS.tfsaB },           _p: 'B', _src: 'tfsa'       },
    { x: years, y: dataPoints.map(d => d.nonRegWithdrawalA), name: `${aName} Non-Reg`,    type: 'bar', marker: { color: CHART_COLORS.nonRegA },         _p: 'A', _src: 'nonReg'     },
    { x: years, y: dataPoints.map(d => d.nonRegWithdrawalB), name: `${bName} Non-Reg`,    type: 'bar', marker: { color: CHART_COLORS.nonRegB },         _p: 'B', _src: 'nonReg'     },
    { x: years, y: dataPoints.map(d => d.otherIncomeA),      name: `${aName} Other`,      type: 'bar', marker: { color: CHART_COLORS.otherIncomeA },    _p: 'A', _src: 'other'      },
    { x: years, y: dataPoints.map(d => d.otherIncomeB),      name: `${bName} Other`,      type: 'bar', marker: { color: CHART_COLORS.otherIncomeB },    _p: 'B', _src: 'other'      },
  ]

  // Net income series (post-tax, by person)
  const netIncomeSeries: Data[] = [
    { x: years, y: dataPoints.map(d => d.netIncomeA), name: `${aName} Net`, type: 'bar', marker: { color: CHART_COLORS.employmentA }, _p: 'A' },
    { x: years, y: dataPoints.map(d => d.netIncomeB), name: `${bName} Net`, type: 'bar', marker: { color: CHART_COLORS.employmentB }, _p: 'B' },
  ]

  const incomeData = withTotals(incomeMode === 'net'
    ? netIncomeSeries.filter(s => incomePerson === 'both' || s._p === incomePerson)
    : allIncomeSeries.filter(s =>
        (incomePerson === 'both' || s._p === incomePerson) &&
        enabledSources.has(s._src)
      ))

  const taxData: Data[] = withTotals([
    { x: years, y: dataPoints.map(d => d.taxA), name: `${aName} Tax`, type: 'bar', marker: { color: '#ef4444' } },
    { x: years, y: dataPoints.map(d => d.taxB), name: `${bName} Tax`, type: 'bar', marker: { color: '#f97316' } },
    { x: years, y: dataPoints.map(d => d.effectiveTaxRateA * 100), name: `${aName} Effective Rate`, type: 'scatter', mode: 'markers', yaxis: 'y2', marker: { color: '#dc2626', size: 4, symbol: 'circle' }, hovertemplate: '%{fullData.name}: %{y:.1f}%<extra></extra>' },
    { x: years, y: dataPoints.map(d => d.effectiveTaxRateB * 100), name: `${bName} Effective Rate`, type: 'scatter', mode: 'markers', yaxis: 'y2', marker: { color: '#ea580c', size: 4, symbol: 'circle' }, hovertemplate: '%{fullData.name}: %{y:.1f}%<extra></extra>' },
  ])

  const portfolioData: Data[] = withTotals([
    { x: years, y: dataPoints.map(d => d.rrspA),   name: `${aName} RRSP/RRIF`, type: 'bar', marker: { color: CHART_COLORS.rrifA } },
    { x: years, y: dataPoints.map(d => d.rrspB),   name: `${bName} RRSP/RRIF`, type: 'bar', marker: { color: CHART_COLORS.rrifB } },
    { x: years, y: dataPoints.map(d => d.tfsaA),   name: `${aName} TFSA`,      type: 'bar', marker: { color: CHART_COLORS.tfsaA } },
    { x: years, y: dataPoints.map(d => d.tfsaB),   name: `${bName} TFSA`,      type: 'bar', marker: { color: CHART_COLORS.tfsaB } },
    { x: years, y: dataPoints.map(d => d.nonRegA), name: `${aName} Non-Reg`,   type: 'bar', marker: { color: CHART_COLORS.nonRegA } },
    { x: years, y: dataPoints.map(d => d.nonRegB), name: `${bName} Non-Reg`,   type: 'bar', marker: { color: CHART_COLORS.nonRegB } },
    { x: years, y: dataPoints.map(d => d.hisa),    name: 'HISA / Cash',        type: 'bar', marker: { color: '#94a3b8' } },
  ])

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
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
                frozen={frozenFor(metrics.portfolioAtStart, frozenMetrics?.portfolioAtStart, fmt)}
                onClick={() => setModalDef({
                  title: 'Portfolio — Balance by Account',
                  note: "Today's dollars, end of year.",
                  columns: [
                    { header: 'Year',              render: d => d.year },
                    { header: `${aName} Age`, right: true, render: d => d.personAAge.toFixed(1) },
                    { header: `RRSP ${aName}`, right: true, render: d => fmt(d.rrspA) },
                    { header: `RRSP ${bName}`, right: true, render: d => fmt(d.rrspB) },
                    { header: `TFSA ${aName}`, right: true, render: d => fmt(d.tfsaA) },
                    { header: `TFSA ${bName}`, right: true, render: d => fmt(d.tfsaB) },
                    { header: `NR ${aName}`,   right: true, render: d => fmt(d.nonRegA) },
                    { header: `NR ${bName}`,   right: true, render: d => fmt(d.nonRegB) },
                    { header: 'HISA',           right: true, render: d => fmt(d.hisa) },
                    { header: 'Total',          right: true, bold: true, render: d => fmt(d.totalPortfolio) },
                  ],
                  rows: dataPoints,
                  highlightRow: d => d.year === dataPoints[0].year,
                })} />
              <MetricCard label="Peak"
                value={fmt(metrics.peakPortfolio)}
                sub={`in ${metrics.peakPortfolioYear}`}
                frozen={frozenFor(metrics.peakPortfolio, frozenMetrics?.peakPortfolio, fmt, true,
                  frozenMetrics ? `in ${frozenMetrics.peakPortfolioYear}` : undefined)}
                onClick={() => setModalDef({
                  title: 'Portfolio — Balance by Account',
                  note: "Today's dollars, end of year. Highlighted row = peak portfolio.",
                  columns: [
                    { header: 'Year',              render: d => d.year },
                    { header: `${aName} Age`, right: true, render: d => d.personAAge.toFixed(1) },
                    { header: `RRSP ${aName}`, right: true, render: d => fmt(d.rrspA) },
                    { header: `RRSP ${bName}`, right: true, render: d => fmt(d.rrspB) },
                    { header: `TFSA ${aName}`, right: true, render: d => fmt(d.tfsaA) },
                    { header: `TFSA ${bName}`, right: true, render: d => fmt(d.tfsaB) },
                    { header: `NR ${aName}`,   right: true, render: d => fmt(d.nonRegA) },
                    { header: `NR ${bName}`,   right: true, render: d => fmt(d.nonRegB) },
                    { header: 'HISA',           right: true, render: d => fmt(d.hisa) },
                    { header: 'Total',          right: true, bold: true, render: d => fmt(d.totalPortfolio) },
                  ],
                  rows: dataPoints,
                  highlightRow: d => d.year === metrics.peakPortfolioYear,
                  summary: [{ label: 'Peak Portfolio', value: fmt(metrics.peakPortfolio) + ` in ${metrics.peakPortfolioYear}` }],
                })} />
              <MetricCard label={`At ${aName}'s Death`}
                value={fmt(metrics.portfolioAtDeathA)}
                frozen={frozenFor(metrics.portfolioAtDeathA, frozenMetrics?.portfolioAtDeathA, fmt)}
                onClick={() => setModalDef({
                  title: `Portfolio — Balance by Account (${aName}'s Death Highlighted)`,
                  note: "Today's dollars, end of year.",
                  columns: [
                    { header: 'Year',              render: d => d.year },
                    { header: `${aName} Age`, right: true, render: d => d.personAAge.toFixed(1) },
                    { header: `RRSP ${aName}`, right: true, render: d => fmt(d.rrspA) },
                    { header: `RRSP ${bName}`, right: true, render: d => fmt(d.rrspB) },
                    { header: `TFSA ${aName}`, right: true, render: d => fmt(d.tfsaA) },
                    { header: `TFSA ${bName}`, right: true, render: d => fmt(d.tfsaB) },
                    { header: `NR ${aName}`,   right: true, render: d => fmt(d.nonRegA) },
                    { header: `NR ${bName}`,   right: true, render: d => fmt(d.nonRegB) },
                    { header: 'HISA',           right: true, render: d => fmt(d.hisa) },
                    { header: 'Total',          right: true, bold: true, render: d => fmt(d.totalPortfolio) },
                  ],
                  rows: dataPoints,
                  highlightRow: d => d.year === endYearA,
                  summary: [{ label: `Portfolio at ${aName}'s Death (${endYearA})`, value: fmt(metrics.portfolioAtDeathA) }],
                })} />
              <MetricCard label={`At ${bName}'s Death`}
                value={fmt(metrics.portfolioAtDeathB)}
                frozen={frozenFor(metrics.portfolioAtDeathB, frozenMetrics?.portfolioAtDeathB, fmt)}
                onClick={() => setModalDef({
                  title: `Portfolio — Balance by Account (${bName}'s Death Highlighted)`,
                  note: "Today's dollars, end of year.",
                  columns: [
                    { header: 'Year',              render: d => d.year },
                    { header: `${aName} Age`, right: true, render: d => d.personAAge.toFixed(1) },
                    { header: `RRSP ${aName}`, right: true, render: d => fmt(d.rrspA) },
                    { header: `RRSP ${bName}`, right: true, render: d => fmt(d.rrspB) },
                    { header: `TFSA ${aName}`, right: true, render: d => fmt(d.tfsaA) },
                    { header: `TFSA ${bName}`, right: true, render: d => fmt(d.tfsaB) },
                    { header: `NR ${aName}`,   right: true, render: d => fmt(d.nonRegA) },
                    { header: `NR ${bName}`,   right: true, render: d => fmt(d.nonRegB) },
                    { header: 'HISA',           right: true, render: d => fmt(d.hisa) },
                    { header: 'Total',          right: true, bold: true, render: d => fmt(d.totalPortfolio) },
                  ],
                  rows: dataPoints,
                  highlightRow: d => d.year === endYearB,
                  summary: [{ label: `Portfolio at ${bName}'s Death (${endYearB})`, value: fmt(metrics.portfolioAtDeathB) }],
                })} />
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
                  frozenMetrics && frozenMetrics.shortfallYears > 0 ? fmtPct(frozenMetrics.shortfallPct) : undefined)}
                onClick={() => setModalDef({
                  title: 'Spending — Cash Flow by Year',
                  note: "Today's dollars. Shortfall years (cash flow < 0) are highlighted.",
                  columns: [
                    { header: 'Year',          render: d => d.year },
                    { header: `${aName} Age`, right: true, render: d => d.personAAge.toFixed(1) },
                    { header: 'Net HH',        right: true, render: d => fmt(d.totalHouseholdNet) },
                    { header: 'Spending',      right: true, render: d => fmt(d.householdSpending) },
                    { header: 'Cash Flow',     right: true, bold: true, render: d => (
                      <span className={d.cashFlow < 0 ? 'text-red-600' : 'text-green-700'}>{fmt(d.cashFlow)}</span>
                    )},
                  ],
                  rows: dataPoints,
                  highlightRow: d => d.cashFlow < -0.01,
                  summary: [
                    { label: 'Shortfall Years', value: `${metrics.shortfallYears} of ${metrics.totalYears}` },
                    { label: 'Avg Annual Shortfall', value: metrics.avgAnnualShortfall < 1 ? 'None' : fmt(metrics.avgAnnualShortfall) },
                  ],
                })} />
              <MetricCard label="Shortfall — Annual Avg"
                betterWhenHigher={false}
                value={metrics.avgAnnualShortfall < 1 ? 'None' : fmt(metrics.avgAnnualShortfall)}
                frozen={frozenFor(metrics.avgAnnualShortfall, frozenMetrics?.avgAnnualShortfall,
                  v => v < 1 ? 'None' : fmt(v), false)}
                onClick={() => setModalDef({
                  title: 'Spending — Shortfall Years Only',
                  note: "Today's dollars. Only years with a spending shortfall (cash flow < 0).",
                  columns: [
                    { header: 'Year',      render: d => d.year },
                    { header: `${aName} Age`, right: true, render: d => d.personAAge.toFixed(1) },
                    { header: 'Net HH',    right: true, render: d => fmt(d.totalHouseholdNet) },
                    { header: 'Spending',  right: true, render: d => fmt(d.householdSpending) },
                    { header: 'Shortfall', right: true, bold: true, render: d => (
                      <span className="text-red-600">{fmt(-d.cashFlow)}</span>
                    )},
                  ],
                  rows: dataPoints.filter(d => d.cashFlow < -0.01),
                  summary: [
                    { label: 'Avg Annual Shortfall', value: metrics.avgAnnualShortfall < 1 ? 'None' : fmt(metrics.avgAnnualShortfall) },
                    { label: 'Peak Shortfall', value: metrics.peakAnnualShortfall < 1 ? 'None' : fmt(metrics.peakAnnualShortfall) + ` in ${metrics.peakShortfallYear}` },
                  ],
                })} />
              <MetricCard label="Shortfall — Peak Year"
                betterWhenHigher={false}
                value={metrics.peakAnnualShortfall < 1 ? 'None' : fmt(metrics.peakAnnualShortfall)}
                sub={metrics.peakShortfallYear > 0 ? `in ${metrics.peakShortfallYear}` : undefined}
                frozen={frozenFor(metrics.peakAnnualShortfall, frozenMetrics?.peakAnnualShortfall,
                  v => v < 1 ? 'None' : fmt(v), false,
                  frozenMetrics && frozenMetrics.peakShortfallYear > 0 ? `in ${frozenMetrics.peakShortfallYear}` : undefined)}
                onClick={() => setModalDef({
                  title: 'Spending — Cash Flow by Year',
                  note: "Today's dollars. Peak shortfall year highlighted.",
                  columns: [
                    { header: 'Year',      render: d => d.year },
                    { header: `${aName} Age`, right: true, render: d => d.personAAge.toFixed(1) },
                    { header: 'Net HH',    right: true, render: d => fmt(d.totalHouseholdNet) },
                    { header: 'Spending',  right: true, render: d => fmt(d.householdSpending) },
                    { header: 'Cash Flow', right: true, bold: true, render: d => (
                      <span className={d.cashFlow < 0 ? 'text-red-600' : 'text-green-700'}>{fmt(d.cashFlow)}</span>
                    )},
                  ],
                  rows: dataPoints,
                  highlightRow: d => d.year === metrics.peakShortfallYear,
                  summary: [
                    { label: 'Peak Annual Shortfall', value: metrics.peakAnnualShortfall < 1 ? 'None' : fmt(metrics.peakAnnualShortfall) + ` (${metrics.peakShortfallYear})` },
                  ],
                })} />
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
                frozen={frozenFor(metrics.lifetimeTaxPaid, frozenMetrics?.lifetimeTaxPaid, fmt, false)}
                onClick={() => setModalDef({
                  title: 'Tax — Annual Breakdown',
                  note: "Today's dollars. Includes federal + provincial + OAS clawback. Peak year highlighted.",
                  columns: [
                    { header: 'Year',              render: d => d.year },
                    { header: `${aName} Age`,  right: true, render: d => d.personAAge.toFixed(1) },
                    { header: `Gross ${aName}`,right: true, render: d => fmt(d.grossIncomeA) },
                    { header: `Gross ${bName}`,right: true, render: d => fmt(d.grossIncomeB) },
                    { header: `Tax ${aName}`,  right: true, render: d => fmt(d.taxA) },
                    { header: `Tax ${bName}`,  right: true, render: d => fmt(d.taxB) },
                    { header: 'OAS Clawback',  right: true, render: d => d.oasClawbackA + d.oasClawbackB > 0 ? fmt(d.oasClawbackA + d.oasClawbackB) : '—' },
                    { header: 'Total Tax',     right: true, bold: true, render: d => fmt(d.taxA + d.taxB + d.oasClawbackA + d.oasClawbackB) },
                  ],
                  rows: dataPoints,
                  highlightRow: d => d.year === metrics.peakTaxYear,
                  summary: [
                    { label: 'Lifetime Tax Paid', value: fmt(metrics.lifetimeTaxPaid) },
                    { label: 'Avg Effective Rate', value: fmtPct(metrics.avgEffectiveTaxRate) },
                    { label: 'Peak Year', value: fmt(metrics.peakTaxAmount) + ` (${metrics.peakTaxYear})` },
                  ],
                })} />
              <MetricCard label="Avg Effective Rate"
                betterWhenHigher={false}
                value={fmtPct(metrics.avgEffectiveTaxRate)}
                frozen={frozenFor(metrics.avgEffectiveTaxRate, frozenMetrics?.avgEffectiveTaxRate, fmtPct, false)}
                onClick={() => setModalDef({
                  title: 'Tax — Effective Rates by Year',
                  note: "Today's dollars. Effective rate = total tax ÷ gross income.",
                  columns: [
                    { header: 'Year',              render: d => d.year },
                    { header: `${aName} Age`,  right: true, render: d => d.personAAge.toFixed(1) },
                    { header: `Gross ${aName}`,right: true, render: d => fmt(d.grossIncomeA) },
                    { header: `Gross ${bName}`,right: true, render: d => fmt(d.grossIncomeB) },
                    { header: `Tax ${aName}`,  right: true, render: d => fmt(d.taxA) },
                    { header: `Eff Rate A`,    right: true, render: d => fmtPct(d.effectiveTaxRateA) },
                    { header: `Tax ${bName}`,  right: true, render: d => fmt(d.taxB) },
                    { header: `Eff Rate B`,    right: true, render: d => fmtPct(d.effectiveTaxRateB) },
                    { header: 'Avg Rate',      right: true, bold: true, render: d => {
                      const totalG = d.grossIncomeA + d.grossIncomeB
                      const totalT = d.taxA + d.taxB + d.oasClawbackA + d.oasClawbackB
                      return fmtPct(totalG > 0 ? totalT / totalG : 0)
                    }},
                  ],
                  rows: dataPoints,
                  summary: [{ label: 'Lifetime Avg Effective Rate', value: fmtPct(metrics.avgEffectiveTaxRate) }],
                })} />
              <MetricCard label="Peak Year"
                betterWhenHigher={false}
                value={fmt(metrics.peakTaxAmount)}
                sub={`in ${metrics.peakTaxYear}`}
                frozen={frozenFor(metrics.peakTaxAmount, frozenMetrics?.peakTaxAmount, fmt, false,
                  frozenMetrics ? `in ${frozenMetrics.peakTaxYear}` : undefined)}
                onClick={() => setModalDef({
                  title: 'Tax — Annual Breakdown',
                  note: "Today's dollars. Peak year highlighted.",
                  columns: [
                    { header: 'Year',              render: d => d.year },
                    { header: `${aName} Age`,  right: true, render: d => d.personAAge.toFixed(1) },
                    { header: `Gross ${aName}`,right: true, render: d => fmt(d.grossIncomeA) },
                    { header: `Gross ${bName}`,right: true, render: d => fmt(d.grossIncomeB) },
                    { header: `Tax ${aName}`,  right: true, render: d => fmt(d.taxA) },
                    { header: `Tax ${bName}`,  right: true, render: d => fmt(d.taxB) },
                    { header: 'OAS Clawback',  right: true, render: d => d.oasClawbackA + d.oasClawbackB > 0 ? fmt(d.oasClawbackA + d.oasClawbackB) : '—' },
                    { header: 'Total Tax',     right: true, bold: true, render: d => fmt(d.taxA + d.taxB + d.oasClawbackA + d.oasClawbackB) },
                  ],
                  rows: dataPoints,
                  highlightRow: d => d.year === metrics.peakTaxYear,
                  summary: [{ label: 'Peak Tax Year', value: fmt(metrics.peakTaxAmount) + ` in ${metrics.peakTaxYear}` }],
                })} />
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
                frozen={frozenFor(metrics.totalCPPCollected, frozenMetrics?.totalCPPCollected, fmt)}
                onClick={() => setModalDef({
                  title: 'CPP — Annual Breakdown',
                  note: "Today's dollars. Includes survivor benefits (60% of deceased spouse's entitlement).",
                  columns: [
                    { header: 'Year',              render: d => d.year },
                    { header: `${aName} Age`,  right: true, render: d => d.personAAge.toFixed(1) },
                    { header: `${bName} Age`,  right: true, render: d => d.personBAge.toFixed(1) },
                    { header: `${aName} CPP`,  right: true, render: d => d.cppA > 0 ? fmt(d.cppA) : '—' },
                    { header: `${bName} CPP`,  right: true, render: d => d.cppB > 0 ? fmt(d.cppB) : '—' },
                    { header: 'Total CPP',     right: true, bold: true, render: d => fmt(d.cppA + d.cppB) },
                  ],
                  rows: dataPoints.filter(d => d.cppA + d.cppB > 0),
                  summary: [{ label: 'Total CPP Collected', value: fmt(metrics.totalCPPCollected) }],
                })} />
              <MetricCard label="OAS — Total Collected"
                value={fmt(metrics.totalOASCollected)}
                frozen={frozenFor(metrics.totalOASCollected, frozenMetrics?.totalOASCollected, fmt)}
                onClick={() => setModalDef({
                  title: 'OAS — Annual Breakdown',
                  note: "Today's dollars. Gross OAS before clawback. Clawback rows highlighted.",
                  columns: [
                    { header: 'Year',              render: d => d.year },
                    { header: `${aName} Age`,  right: true, render: d => d.personAAge.toFixed(1) },
                    { header: `${bName} Age`,  right: true, render: d => d.personBAge.toFixed(1) },
                    { header: `${aName} OAS`,  right: true, render: d => d.oasA > 0 ? fmt(d.oasA) : '—' },
                    { header: `${bName} OAS`,  right: true, render: d => d.oasB > 0 ? fmt(d.oasB) : '—' },
                    { header: 'Gross OAS',     right: true, bold: true, render: d => fmt(d.oasA + d.oasB) },
                    { header: 'Clawback',      right: true, render: d => d.oasClawbackA + d.oasClawbackB > 0
                      ? <span className="text-red-600">{fmt(d.oasClawbackA + d.oasClawbackB)}</span> : '—' },
                    { header: 'Net OAS',       right: true, render: d => fmt((d.oasA + d.oasB) - (d.oasClawbackA + d.oasClawbackB)) },
                  ],
                  rows: dataPoints.filter(d => d.oasA + d.oasB > 0),
                  highlightRow: d => d.oasClawbackA + d.oasClawbackB > 0,
                  summary: [
                    { label: 'Total OAS (Gross)', value: fmt(metrics.totalOASCollected) },
                    { label: 'Total Clawback',    value: fmt(metrics.totalOASClawback) },
                    { label: 'Net OAS',           value: fmt(metrics.totalOASCollected - metrics.totalOASClawback) },
                  ],
                })} />
              <MetricCard label="OAS — Clawback"
                betterWhenHigher={false}
                value={metrics.oasClawbackYears === 0 ? 'None' : `${metrics.oasClawbackYears} yrs`}
                sub={metrics.oasClawbackYears > 0 ? `${fmtPct(metrics.oasClawbackPct)} of OAS years` : undefined}
                frozen={frozenFor(metrics.oasClawbackYears, frozenMetrics?.oasClawbackYears,
                  v => v === 0 ? 'None' : `${v} yrs`, false,
                  frozenMetrics && frozenMetrics.oasClawbackYears > 0
                    ? `${fmtPct(frozenMetrics.oasClawbackPct)} of OAS years` : undefined)}
                onClick={() => setModalDef({
                  title: 'OAS — Clawback Detail',
                  note: "Today's dollars. Clawback = 15% of income above threshold (~$90,997 in 2024, CPI-indexed). Rows with clawback highlighted.",
                  columns: [
                    { header: 'Year',              render: d => d.year },
                    { header: `${aName} Age`,  right: true, render: d => d.personAAge.toFixed(1) },
                    { header: `${bName} Age`,  right: true, render: d => d.personBAge.toFixed(1) },
                    { header: `Gross ${aName}`,right: true, render: d => fmt(d.grossIncomeA) },
                    { header: `Gross ${bName}`,right: true, render: d => fmt(d.grossIncomeB) },
                    { header: `OAS ${aName}`,  right: true, render: d => d.oasA > 0 ? fmt(d.oasA) : '—' },
                    { header: `OAS ${bName}`,  right: true, render: d => d.oasB > 0 ? fmt(d.oasB) : '—' },
                    { header: `Clawback ${aName}`, right: true, render: d => d.oasClawbackA > 0
                      ? <span className="text-red-600">{fmt(d.oasClawbackA)}</span> : '—' },
                    { header: `Clawback ${bName}`, right: true, render: d => d.oasClawbackB > 0
                      ? <span className="text-red-600">{fmt(d.oasClawbackB)}</span> : '—' },
                    { header: 'Net OAS',       right: true, bold: true, render: d => fmt((d.oasA + d.oasB) - (d.oasClawbackA + d.oasClawbackB)) },
                  ],
                  rows: dataPoints.filter(d => d.oasA + d.oasB > 0),
                  highlightRow: d => d.oasClawbackA + d.oasClawbackB > 0,
                  summary: [
                    { label: 'Total OAS (Gross)', value: fmt(metrics.totalOASCollected) },
                    { label: 'Total Clawback',    value: fmt(metrics.totalOASClawback) },
                    { label: 'Net OAS',           value: fmt(metrics.totalOASCollected - metrics.totalOASClawback) },
                    { label: 'Clawback Years',    value: `${metrics.oasClawbackYears} of ${dataPoints.filter(d => d.oasA + d.oasB > 0).length} OAS years` },
                  ],
                })} />
              <MetricCard label="CPP — vs Age 65 Start"
                betterWhenHigher={true}
                value={(metrics.cppVs65 >= 0 ? '+' : '') + fmt(metrics.cppVs65)}
                frozen={frozenFor(metrics.cppVs65, frozenMetrics?.cppVs65,
                  v => (v >= 0 ? '+' : '') + fmt(v))}
                onClick={() => {
                  const bMap = buildCppBaselineMap()
                  const rows = dataPoints.filter(d => d.cppA + d.cppB > 0 || (bMap.get(d.year) ?? 0) > 0)
                  const totBase = Array.from(bMap.values()).reduce((s, v) => s + v, 0)
                  setModalDef({
                    title: 'CPP — Actual vs Age-65 Baseline',
                    note: "Today's dollars. Baseline = both collect CPP starting at their exact 65th birthday. Positive delta = your timing was better.",
                    columns: [
                      { header: 'Year',              render: d => d.year },
                      { header: `${aName} Age`,  right: true, render: d => d.personAAge.toFixed(1) },
                      { header: `${bName} Age`,  right: true, render: d => d.personBAge.toFixed(1) },
                      { header: `${aName} CPP`,  right: true, render: d => d.cppA > 0 ? fmt(d.cppA) : '—' },
                      { header: `${bName} CPP`,  right: true, render: d => d.cppB > 0 ? fmt(d.cppB) : '—' },
                      { header: 'Actual Total',  right: true, bold: true, render: d => fmt(d.cppA + d.cppB) },
                      { header: 'Baseline @65',  right: true, render: d => fmt(bMap.get(d.year) ?? 0) },
                      { header: 'Delta / Year',  right: true, render: d => {
                          const delta = d.cppA + d.cppB - (bMap.get(d.year) ?? 0)
                          return <span className={delta >= 0 ? 'text-green-600' : 'text-red-600'}>{(delta >= 0 ? '+' : '') + fmt(delta)}</span>
                        }},
                    ],
                    rows,
                    summary: [
                      { label: 'Actual Total',        value: fmt(metrics.totalCPPCollected) },
                      { label: 'Baseline Total @65',  value: fmt(totBase) },
                      { label: 'Net Timing Benefit',  value: (metrics.cppVs65 >= 0 ? '+' : '') + fmt(metrics.cppVs65) },
                    ],
                  })
                }} />
              <MetricCard label="OAS — vs Age 65 Start"
                betterWhenHigher={true}
                value={(metrics.oasVs65 >= 0 ? '+' : '') + fmt(metrics.oasVs65)}
                frozen={frozenFor(metrics.oasVs65, frozenMetrics?.oasVs65,
                  v => (v >= 0 ? '+' : '') + fmt(v))}
                onClick={() => {
                  const bMap = buildOasBaselineMap()
                  const rows = dataPoints.filter(d => d.oasA + d.oasB > 0 || (bMap.get(d.year) ?? 0) > 0)
                  const totBase = Array.from(bMap.values()).reduce((s, v) => s + v, 0)
                  setModalDef({
                    title: 'OAS — Actual vs Age-65 Baseline',
                    note: "Today's dollars. Gross OAS (before clawback). Baseline = both collect OAS starting at their exact 65th birthday.",
                    columns: [
                      { header: 'Year',              render: d => d.year },
                      { header: `${aName} Age`,  right: true, render: d => d.personAAge.toFixed(1) },
                      { header: `${bName} Age`,  right: true, render: d => d.personBAge.toFixed(1) },
                      { header: `${aName} OAS`,  right: true, render: d => d.oasA > 0 ? fmt(d.oasA) : '—' },
                      { header: `${bName} OAS`,  right: true, render: d => d.oasB > 0 ? fmt(d.oasB) : '—' },
                      { header: 'Actual Total',  right: true, bold: true, render: d => fmt(d.oasA + d.oasB) },
                      { header: 'Baseline @65',  right: true, render: d => fmt(bMap.get(d.year) ?? 0) },
                      { header: 'Delta / Year',  right: true, render: d => {
                          const delta = d.oasA + d.oasB - (bMap.get(d.year) ?? 0)
                          return <span className={delta >= 0 ? 'text-green-600' : 'text-red-600'}>{(delta >= 0 ? '+' : '') + fmt(delta)}</span>
                        }},
                    ],
                    rows,
                    summary: [
                      { label: 'Actual Total (Gross)', value: fmt(metrics.totalOASCollected) },
                      { label: 'Baseline Total @65',   value: fmt(totBase) },
                      { label: 'Net Timing Benefit',   value: (metrics.oasVs65 >= 0 ? '+' : '') + fmt(metrics.oasVs65) },
                    ],
                  })
                }} />
            </div>
          </div>

        </div>
      </SectionCard>



      {/* ── Charts ────────────────────────────────────────────────────────── */}
      <SectionCard title="Income" width="full"
        info="Stacked bars = annual gross income by source. Tick marks = net after tax (black) and spending target (red). All values in today's dollars."
        onReset={() => { setXAxisModeIncome('year'); setIncomeMode('gross'); setIncomePerson('both'); setEnabledSources(new Set(ALL_SOURCE_KEYS)) }}>
        {/* ── Income filter bar ───────────────────────────────────────── */}
        <div className="flex items-center gap-1.5 flex-wrap mb-3">

          {/* Person — first */}
          {([['both', 'Household'], ['A', aName], ['B', bName]] as [IncomePerson, string][]).map(([v, label]) => (
            <button key={v} onClick={() => setIncomePerson(v)}
              className={`px-2.5 py-1 rounded border text-sm transition-colors ${
                incomePerson === v
                  ? 'text-white border-[#7B1515]'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
              }`}
              style={incomePerson === v ? { backgroundColor: '#7B1515' } : {}}>
              {label}
            </button>
          ))}

          <div className="w-px h-5 bg-slate-200 shrink-0 mx-1" />

          {/* Gross / Net */}
          {(['gross', 'net'] as IncomeMode[]).map(m => (
            <button key={m} onClick={() => setIncomeMode(m)}
              className={`px-2.5 py-1 rounded border text-sm transition-colors ${
                incomeMode === m
                  ? 'text-white border-[#7B1515]'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
              }`}
              style={incomeMode === m ? { backgroundColor: '#7B1515' } : {}}>
              {m === 'gross' ? 'Gross' : 'Net'}
            </button>
          ))}

          {/* Source chips — gross mode only */}
          {incomeMode === 'gross' && (
            <>
              <div className="w-px h-5 bg-slate-200 shrink-0 mx-1" />
              {SOURCE_DEFS.map(src => {
                const active = enabledSources.has(src.key)
                return (
                  <button key={src.key}
                    onClick={() => setEnabledSources(prev => {
                      const next = new Set(prev)
                      if (next.has(src.key)) next.delete(src.key)
                      else next.add(src.key)
                      return next
                    })}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-sm transition-colors ${
                      active
                        ? 'text-white border-[#7B1515]'
                        : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400'
                    }`}
                    style={active ? { backgroundColor: '#7B1515' } : {}}>
                    <span className="w-2 h-2 rounded-sm shrink-0"
                      style={{ backgroundColor: active ? 'rgba(255,255,255,0.65)' : src.color }} />
                    {src.label}
                  </button>
                )
              })}

              <div className="w-px h-5 bg-slate-200 shrink-0 mx-1" />
              <button onClick={() => setEnabledSources(new Set(ALL_SOURCE_KEYS))}
                className="px-2.5 py-1 rounded border text-sm bg-white text-slate-500 border-slate-200 hover:border-slate-400 transition-colors">
                All
              </button>
              <button onClick={() => setEnabledSources(new Set())}
                className="px-2.5 py-1 rounded border text-sm bg-white text-slate-500 border-slate-200 hover:border-slate-400 transition-colors">
                None
              </button>
            </>
          )}

        </div>
        <PlotlyChart
          data={incomeData}
          layout={{ barmode: 'stack', yaxis: { title: { text: 'Annual Income ($)', font: { size: 11 } }, tickformat: ',.0f' }, xaxis: { ...xAxisIncome } }}
          style={{ height: 420 }}
        />
        <XAxisSelector value={xAxisModeIncome} onChange={setXAxisModeIncome} aName={aName} bName={bName} />
        <ChartLegend data={incomeData} />
      </SectionCard>

      <SectionCard title="Tax Paid — Present-Day Dollars" width="full"
        onReset={() => setXAxisModeTax('year')}>
        <PlotlyChart
          data={taxData}
          layout={{
            barmode: 'stack',
            yaxis:  { title: { text: 'Tax Paid ($)', font: { size: 11 } }, tickformat: ',.0f' },
            yaxis2: { title: { text: 'Effective Rate (%)', font: { size: 11 } }, overlaying: 'y', side: 'right', tickformat: '.1f', range: [0, 60] },
            xaxis:  { ...xAxisTax },
          }}
          style={{ height: 320 }}
        />
        <XAxisSelector value={xAxisModeTax} onChange={setXAxisModeTax} aName={aName} bName={bName} />
        <ChartLegend data={taxData} />
      </SectionCard>

      <SectionCard title="Portfolio Balances — Present-Day Dollars" width="full"
        onReset={() => setXAxisModePortfolio('year')}>
        <PlotlyChart
          data={portfolioData}
          layout={{ barmode: 'stack', yaxis: { title: { text: 'Account Balance ($)', font: { size: 11 } }, tickformat: ',.0f' }, xaxis: { ...xAxisPortfolio } }}
          style={{ height: 320 }}
        />
        <XAxisSelector value={xAxisModePortfolio} onChange={setXAxisModePortfolio} aName={aName} bName={bName} />
        <ChartLegend data={portfolioData} />
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

    {/* ── Metric Detail Modal ──────────────────────────────────────────────── */}
    {modalDef && <MetricDetailModal def={modalDef} onClose={() => setModalDef(null)} />}
    </>
  )
}

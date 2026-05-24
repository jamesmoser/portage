import { useMemo, useState } from 'react'
import { useStore } from '../store/useStore'
import { SectionCard } from '../components/SectionCard'
import { NumberInput } from '../components/NumberInput'
import { SelectInput } from '../components/SelectInput'
import { PlotlyChart } from '../components/PlotlyChart'
import { XAxisSelector, XAxisMode, buildXAxis } from '../components/XAxisSelector'
import { runProjection } from '../engine/projection'
import { mergeWhatIfs, computeHeadlineMetrics } from '../engine/whatifs'
import { exactAgeAt } from '../engine/dates'
import type { AppState, HeadlineMetrics, WithdrawalOrder, PensionSplitMode } from '../engine/types'
import { CHART_COLORS } from './PaletteTab'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Data = any

// ─── Formatters ───────────────────────────────────────────────────────────────

const fmt    = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 })
const fmtPct = (v: number) => `${(v * 100).toFixed(1)}%`

function formatSolvency(m: HeadlineMetrics): string {
  if (m.planFullyFunded)          return 'Fully funded ✓'
  if (m.solventThroughAge == null) return 'Never funded'
  return `Age ${Math.ceil(m.solventThroughAge)} (${m.solventThroughYear})`
}

function solvencyScore(m: HeadlineMetrics): number {
  if (m.planFullyFunded)          return Infinity
  if (m.solventThroughAge == null) return -Infinity
  return m.solventThroughAge
}

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

// ─── Sub-components ───────────────────────────────────────────────────────────

function WhatIfSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-wider mb-1 mt-3 first:mt-0"
        style={{ color: '#7B1515' }}>
        {title}
      </div>
      <div className="rounded border border-slate-200 divide-y divide-slate-100 bg-white">
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

function MetricCard({ label, value, note, frozen, betterWhenHigher = true }: {
  label: string
  value: string
  note?: string
  frozen?: { value: string; numericDelta: number } | null
  betterWhenHigher?: boolean
}) {
  const isBetter = frozen ? (betterWhenHigher ? frozen.numericDelta > 0 : frozen.numericDelta < 0) : false
  const isWorse  = frozen ? (betterWhenHigher ? frozen.numericDelta < 0 : frozen.numericDelta > 0) : false
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-3">
      <div className="text-xs text-slate-400 mb-0.5">{label}</div>
      <div className="text-base font-bold text-slate-800">{value}</div>
      {note && <div className="text-[11px] text-slate-400">{note}</div>}
      {frozen && frozen.numericDelta !== 0 && (
        <div className={`text-[11px] mt-1 font-medium ${isBetter ? 'text-green-600' : isWorse ? 'text-red-600' : 'text-slate-400'}`}>
          {isBetter ? '▲' : '▼'} Frozen: {frozen.value}
        </div>
      )}
      {frozen && frozen.numericDelta === 0 && (
        <div className="text-[11px] mt-1 text-slate-400">= Frozen: {frozen.value}</div>
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
    () => computeHeadlineMetrics(dataPoints, ageReferencePerson),
    [dataPoints, ageReferencePerson],
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

  function frozenFor(current: number, frozenVal: number | undefined, betterWhenHigh = true) {
    if (frozenMetrics == null || frozenVal == null) return undefined
    return {
      value:        frozenVal >= 1000 ? fmt.format(frozenVal)
                    : frozenVal <= 1 ? fmtPct(frozenVal)
                    : String(frozenVal),
      numericDelta: betterWhenHigh ? current - frozenVal : frozenVal - current,
    }
  }

  // Solvency frozen comparison (uses score, not raw numeric)
  const solFrozen = frozenMetrics ? {
    value:        formatSolvency(frozenMetrics),
    numericDelta: solvencyScore(metrics) - solvencyScore(frozenMetrics),
  } : undefined

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

      {/* ── What-If Panel ─────────────────────────────────────────────────── */}
      <SectionCard title="What-If Analysis" width="full">

        {/* Scenario controls */}
        <div className="flex items-center gap-3 flex-wrap pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Scenario:</span>
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
            <button
              className="btn-primary text-xs"
              onClick={() => { setSavingAs(true); setSaveName(activeScenario?.name ?? '') }}
            >
              Save As…
            </button>
          )}

          {scenarios.length > 0 && (
            <div className="relative">
              <button className="btn-secondary text-xs" onClick={() => setShowLoad(o => !o)}>
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

          <button className="btn-secondary text-xs" onClick={resetWhatIfs}>
            Reset All
          </button>
        </div>

        {/* What-if rows */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-6">
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
              <WhatIfRow
                enabled={whatIfs.longevityA.enabled}
                onToggle={v => updateWhatIf('longevityA', { enabled: v, value: v ? personA.planningEndAge : whatIfs.longevityA.value })}
                label={`${aName} dies at age`}
                baseLabel={`${personA.planningEndAge}`}
              >
                <NumberInput label="" value={whatIfs.longevityA.value}
                  onChange={v => updateWhatIf('longevityA', { value: v })}
                  suffix="years" min={60} max={110} step={1} decimals={0} size="sm" />
              </WhatIfRow>
              <WhatIfRow
                enabled={whatIfs.longevityB.enabled}
                onToggle={v => updateWhatIf('longevityB', { enabled: v, value: v ? personB.planningEndAge : whatIfs.longevityB.value })}
                label={`${bName} dies at age`}
                baseLabel={`${personB.planningEndAge}`}
              >
                <NumberInput label="" value={whatIfs.longevityB.value}
                  onChange={v => updateWhatIf('longevityB', { value: v })}
                  suffix="years" min={60} max={110} step={1} decimals={0} size="sm" />
              </WhatIfRow>
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
              {/* Drawdown Strategy — select-style; sub-table expands when a strategy is chosen */}
              <div>
                <div className="flex items-center gap-3 px-3 py-2.5">
                  <input
                    type="checkbox"
                    checked={whatIfs.fixedPctStrategy.enabled}
                    onChange={e => updateWhatIf('fixedPctStrategy', { enabled: e.target.checked })}
                    className="w-4 h-4 rounded shrink-0 cursor-pointer"
                    style={{ accentColor: '#7B1515' }}
                  />
                  <span className={`text-sm w-52 shrink-0 ${whatIfs.fixedPctStrategy.enabled ? 'font-medium text-slate-800' : 'text-slate-600'}`}>
                    Drawdown Strategy
                  </span>
                  {whatIfs.fixedPctStrategy.enabled ? (
                    <div className="flex items-center gap-2">
                      <SelectInput label=""
                        value="fixedPct"
                        onChange={() => {}}
                        options={[{ value: 'fixedPct', label: 'Fixed % Drawdown' }]}
                      />
                      <span className="text-xs text-slate-400">instead of <span className="font-medium text-slate-500">None</span></span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">Base: <span className="font-medium text-slate-500">None</span></span>
                  )}
                </div>
                {whatIfs.fixedPctStrategy.enabled && (
                  <div className="px-3 pb-3">
                    <div className="overflow-x-auto rounded border border-slate-200 text-xs">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-3 py-1.5 text-left font-medium text-slate-600">Account</th>
                            <th className="px-3 py-1.5 text-center font-medium text-slate-600">Rate (% / yr)</th>
                            <th className="px-3 py-1.5 text-center font-medium text-slate-600">Minimum ($ / yr)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {([
                            ['RRSP / RRIF', 'rrspPct',   'rrspMin'   ],
                            ['TFSA',        'tfsaPct',   'tfsaMin'   ],
                            ['Non-Reg',     'nonRegPct', 'nonRegMin' ],
                          ] as const).map(([label, pctKey, minKey]) => (
                            <tr key={label} className="hover:bg-slate-50/50">
                              <td className="px-3 py-1.5 text-slate-600 font-medium">{label}</td>
                              <td className="px-2 py-1">
                                <NumberInput label=""
                                  value={whatIfs.fixedPctStrategy.value[pctKey]}
                                  onChange={v => updateWhatIf('fixedPctStrategy', {
                                    value: { ...whatIfs.fixedPctStrategy.value, [pctKey]: v },
                                  })}
                                  min={0} max={100} step={0.5} decimals={1} size="sm" />
                              </td>
                              <td className="px-2 py-1">
                                <NumberInput label=""
                                  value={whatIfs.fixedPctStrategy.value[minKey]}
                                  onChange={v => updateWhatIf('fixedPctStrategy', {
                                    value: { ...whatIfs.fixedPctStrategy.value, [minKey]: v },
                                  })}
                                  min={0} max={500_000} step={1000} decimals={0} size="sm" />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1.5">
                      Each year: withdraw max(rate × balance, minimum). RRSP/RRIF also respects mandatory RRIF minimums. Draws happen before tax.
                    </p>
                  </div>
                )}
              </div>
            </WhatIfSection>

          </div>
        </div>
      </SectionCard>

      {/* ── Key Outcomes ──────────────────────────────────────────────────── */}
      <SectionCard
        title="Key Outcomes"
        width="full"
        headerRight={
          <div className="flex items-center gap-2">
            {frozenMetrics && (
              <button className="btn-secondary text-xs py-1" onClick={clearFreeze}>
                Clear Freeze
              </button>
            )}
            <button
              className="btn-primary text-xs py-1"
              onClick={() => freezeMetrics(metrics)}
              title="Freeze current values as a comparison baseline"
            >
              {frozenMetrics ? 'Re-Freeze' : 'Freeze'}
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          <MetricCard
            label="Plan Coverage"
            value={formatSolvency(metrics)}
            frozen={solFrozen}
            betterWhenHigher={true}
          />
          <MetricCard
            label="Portfolio at Death"
            value={fmt.format(metrics.portfolioAtDeath)}
            note="today's $"
            frozen={frozenFor(metrics.portfolioAtDeath, frozenMetrics?.portfolioAtDeath)}
            betterWhenHigher={true}
          />
          <MetricCard
            label="Peak Portfolio"
            value={fmt.format(metrics.peakPortfolio)}
            note={`in ${metrics.peakPortfolioYear}`}
            frozen={frozenFor(metrics.peakPortfolio, frozenMetrics?.peakPortfolio)}
            betterWhenHigher={true}
          />
          <MetricCard
            label="Lifetime Tax Paid"
            value={fmt.format(metrics.lifetimeTaxPaid)}
            note="today's $, household"
            frozen={frozenMetrics ? {
              value:        fmt.format(frozenMetrics.lifetimeTaxPaid),
              numericDelta: frozenMetrics.lifetimeTaxPaid - metrics.lifetimeTaxPaid,
            } : undefined}
            betterWhenHigher={true}
          />
          <MetricCard
            label="Avg Effective Tax Rate"
            value={fmtPct(metrics.avgEffectiveTaxRate)}
            note="household"
            frozen={frozenMetrics ? {
              value:        fmtPct(frozenMetrics.avgEffectiveTaxRate),
              numericDelta: frozenMetrics.avgEffectiveTaxRate - metrics.avgEffectiveTaxRate,
            } : undefined}
            betterWhenHigher={true}
          />
          <MetricCard
            label="OAS Clawback Years"
            value={metrics.oasClawbackYears === 0 ? 'None' : `${metrics.oasClawbackYears} yrs`}
            frozen={frozenMetrics ? {
              value:        frozenMetrics.oasClawbackYears === 0 ? 'None' : `${frozenMetrics.oasClawbackYears} yrs`,
              numericDelta: frozenMetrics.oasClawbackYears - metrics.oasClawbackYears,
            } : undefined}
            betterWhenHigher={true}
          />
        </div>
        {frozenMetrics && (
          <p className="text-[11px] text-slate-400 mt-3">
            ▲ / ▼ compares current values to frozen baseline. Green = improvement.
          </p>
        )}
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

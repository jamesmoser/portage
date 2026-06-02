import React, { useMemo, useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { SectionCard } from '../components/SectionCard'
import { SectionDivider } from '../components/SectionDivider'
import { InfoPanel } from '../components/InfoPanel'
import { NumberInput } from '../components/NumberInput'
import { SelectInput } from '../components/SelectInput'
import { ToggleInput } from '../components/ToggleInput'
import { PlotlyChart, withTotals } from '../components/PlotlyChart'
import { XAxisSelector, XAxisMode, buildXAxis } from '../components/XAxisSelector'
import { runProjection } from '../engine/projection'
import { mergeWhatIfs, computeHeadlineMetrics } from '../engine/whatifs'
import { exactAgeAt, getYear, dateAtAge, dateAtDecimalAge, todayStr } from '../engine/dates'
import { DateInput } from '../components/DateInput'
import type { AppState, HeadlineMetrics, DrawdownStrategyType, DataPoint, MarketProfileType, RetirementWhatIfConfig, SpendGapAccountType, SpendGapPhaseConfig, SpendGapDeficitItem, SpendGapSurplusAccountType, SpendGapSurplusItem, BengenPersonConfig, BengenAccountItem, GKPersonConfig } from '../engine/types'
import { DEFAULT_SPEND_GAP_CONFIG, DEFAULT_DEFICIT_ITEMS, DEFAULT_SURPLUS_ITEMS, DEFAULT_WHATIFS, DEFAULT_BENGEN_ACCOUNT_ORDER, DEFAULT_BENGEN_CONFIG, DEFAULT_GK_CONFIG } from '../engine/defaults'
import { generateRateSchedule, DEFAULT_MARKET_PROFILE } from '../engine/rateProfiles'
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
const fmt      = (v: number) => _fmtObj.format(v)
const fmtPct   = (v: number) => `${(v * 100).toFixed(1)}%`
const fmtT     = (v: number) => Math.abs(v) < 0.5 ? '—' : fmt(v)   // dash for zero in table cells
// Values between -1 and +1 are treated as exactly $0 to avoid rounding noise.
const NEAR_ZERO = 1
const fmtSigned = (v: number) => Math.abs(v) < NEAR_ZERO ? fmt(0) : (v >= 0 ? '+' : '') + fmt(v)
const fmtFlow   = (v: number) => Math.abs(v) < NEAR_ZERO ? fmt(0) : fmt(v)
const flowColor = (v: number) => v < -NEAR_ZERO ? 'text-red-600' : v > NEAR_ZERO ? 'text-green-700' : ''

type TableGroupKey = 'year' | 'income' | 'tax' | 'spending' | 'portfolio'
type TableCol = {
  label: string
  value: (d: DataPoint) => number
  format?: (v: number, d: DataPoint) => string
  className?: string
  person?: 'A' | 'B'
  tSlipOnly?: boolean   // T-slip income: taxable but not received as cash (e.g. non-reg yield)
  splitPaid?: boolean   // pension split paid out by A: shown in parentheses, muted
}

function hexTint(hex: string, alpha: number): string {
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex)
  if (!m) return 'transparent'
  return `rgba(${parseInt(m[1],16)},${parseInt(m[2],16)},${parseInt(m[3],16)},${alpha})`
}


const DRAWDOWN_STRATEGY_OPTIONS: { value: DrawdownStrategyType; label: string }[] = [
  { value: 'none',            label: 'None' },
  { value: 'fixedWithdrawal', label: 'Fixed Withdrawals' },
  { value: 'fixedPct',        label: 'Fixed Percentage' },
  { value: 'bengen',          label: 'Bengen Rule' },
  { value: 'gk',              label: 'Guyton-Klinger' },
  { value: 'spendGap',        label: 'Cover Spending Gap' },
]

// ─── Income chart filter constants ────────────────────────────────────────────

type SourceKey = 'employment' | 'dbPension' | 'cpp' | 'oas' | 'rrif' | 'tfsa' | 'nonReg' | 'hisa' | 'other'
const ALL_SOURCE_KEYS: SourceKey[] = ['employment', 'dbPension', 'cpp', 'oas', 'rrif', 'tfsa', 'nonReg', 'hisa', 'other']
const SOURCE_DEFS: { key: SourceKey; label: string; color: string }[] = [
  { key: 'employment', label: 'Employment', color: CHART_COLORS.employmentA },
  { key: 'dbPension',  label: 'DB Pension', color: CHART_COLORS.pensionA },
  { key: 'cpp',        label: 'CPP',        color: CHART_COLORS.cppA },
  { key: 'oas',        label: 'OAS',        color: CHART_COLORS.oasA },
  { key: 'rrif',       label: 'RRIF',       color: CHART_COLORS.rrifA },
  { key: 'tfsa',       label: 'TFSA',       color: CHART_COLORS.tfsaA },
  { key: 'nonReg',     label: 'Non-Reg',    color: CHART_COLORS.nonRegA },
  { key: 'hisa',       label: 'HISA',       color: '#94a3b8' },
  { key: 'other',      label: 'Other',      color: CHART_COLORS.otherIncomeA },
]

type PortfolioKey = 'rrif' | 'tfsa' | 'nonReg' | 'hisa'
const ALL_PORTFOLIO_KEYS: PortfolioKey[] = ['rrif', 'tfsa', 'nonReg', 'hisa']
const PORTFOLIO_DEFS: { key: PortfolioKey; label: string; color: string }[] = [
  { key: 'rrif',   label: 'RRSP/RRIF', color: CHART_COLORS.rrifA },
  { key: 'tfsa',   label: 'TFSA',      color: CHART_COLORS.tfsaA },
  { key: 'nonReg', label: 'Non-Reg',   color: CHART_COLORS.nonRegA },
  { key: 'hisa',   label: 'HISA/Cash', color: '#94a3b8' },
]

const DRAWDOWN_STRATEGY_DESCRIPTIONS: Record<DrawdownStrategyType, React.ReactNode> = {
  none: 'No account withdrawals of any kind. Portfolios grow undisturbed. All spending is shown as a shortfall. Useful as an analytical baseline to understand how your portfolio grows before any drawdown decisions are made.',
  bengen: (<>
    <p>The Bengen Rule (commonly called the 4% rule): in year 1 of retirement, withdraw a fixed percentage of the total portfolio. Each subsequent year draw that same nominal amount adjusted for inflation — constant in today's dollars when indexing by personal inflation, or slowly declining when indexing by CPI (matching the original research). Toggle <em>Index by CPI</em> on to use the historical convention.</p>
    <p className="mt-1.5">Draws are per person from their own accounts (RRSP/RRIF, Non-Reg, TFSA) in the configured order, with RRIF mandatory minimums always taken first and netted from the target. After the first death, the survivor draws the sum of both people's annual amounts from their combined accounts. There is no automatic gap-filling — any difference between the draw and spending appears directly as a surplus or deficit in the cash flow chart.</p>
    <p className="mt-1.5">Two HISA buffer toggles control how surpluses and deficits are handled. With both off you see the raw Bengen picture — surplus and deficit bars exactly as the rule produces them, with no wealth preservation. With "Route surplus to HISA" on, annual surpluses are deposited into HISA rather than disappearing; the surplus bars remain fully visible and HISA accumulates the excess. This matters most with large RRSPs: once RRIF conversion begins, mandatory minimums can far exceed the Bengen target, producing large surpluses that inflate HISA while the invested accounts drain. With "Cover deficit from HISA" also on, HISA is drawn down in deficit years to eliminate red bars — but only while it has funds. Red bars return once HISA is exhausted, marking the true shortfall point. Running both toggles together is the most diagnostic combination: if the plan stays green throughout, Bengen works with a HISA buffer and the surplus bars tell you how large that buffer needs to be; if red bars still appear in the final years, the buffer ran dry and Bengen is not the right rule for this situation.</p>
  </>),
  gk: (<>
    <p>The Guyton-Klinger Guardrail strategy begins like the Bengen Rule — withdraw a fixed percentage of the portfolio in year 1, then inflation-adjust that amount annually — but applies three guardrails each year to keep the withdrawal rate in range. Gate 1 (Inflation Rule) skips the annual inflation raise if the prior year's portfolio return was negative and the current withdrawal rate has risen above the initial rate. Gate 2 (Capital Preservation) cuts the withdrawal by the configured percentage when the rate has risen too far above the initial rate; it is automatically disabled in each person's final 15 years when reducing income would be counterproductive. Gate 3 (Prosperity) raises the withdrawal when the rate has fallen well below the initial rate, capturing portfolio gains as additional spending power.</p>
    <p className="mt-1.5">Draws are per person from their own accounts in the configured order, with RRIF minimums always taken first and netted from the target. After the first death, the survivor draws the sum of both people's guardrail-adjusted amounts from their combined accounts. HISA buffer toggles work the same as in the Bengen strategy — surplus to HISA preserves excess cash rather than losing it, and cover deficit from HISA extends the portfolio's effective life before red bars appear.</p>
  </>),
  spendGap: (<>
    <p>Draws exactly what is needed from investment accounts to cover the gap between spending and after-tax income each year. Pre-retirement follows the base plan with no proactive draws. From retirement until RRIF conversion, RRSP can be melted down proactively up to a gross income ceiling to reduce future forced minimums. After RRIF conversion, the CRA mandatory minimum is always withdrawn first; the deficit order covers any remaining shortfall.</p>
    <p className="mt-1.5">In each phase, accounts are drawn in the configured order until the gap is covered. Each account can have a per-person annual cap; check No Limit to draw as much as needed. HISA is joint. When income exceeds spending, the surplus is deposited into accounts in the configured surplus order — each account fills to its limit before passing the remainder to the next; an account with no limit receives everything remaining. TFSA and Non-Reg surplus is split 50/50 between people (100% to survivor). Note: base plan contributions (RRSP, TFSA, Non-Reg annual amounts configured in the Investments tab) are treated as spending and deducted before the surplus is calculated — surplus routing applies to what remains after those contributions.</p>
  </>),
  fixedWithdrawal: 'Withdraw a fixed annual dollar amount from each account each year, regardless of spending need. Amounts are in today\'s dollars and inflate each year with personal inflation. Draws begin at each account owner\'s retirement date and are pro-rated in the first retirement year. After the first death, the higher of the two per-person amounts is used for each account type. RRSP/RRIF draws always respect mandatory RRIF minimums. Non-reg draws are pre-tax — capital gains above ACB are taxed each year. All draws are exact — no automatic gap-filling; any shortfall appears as a red bar in the cash flow chart.',
  fixedPct:        'Withdraw a fixed percentage of each account\'s balance each year, with an optional dollar floor — the actual draw is max(rate × balance, floor), capped at the account balance. Draws begin at each account owner\'s retirement date and are pro-rated in the first retirement year and year of death. RRSP/RRIF draws always respect mandatory RRIF minimums regardless of the configured rate. Non-reg draws are pre-tax — capital gains above ACB are taxed each year. All draws are explicit — no automatic gap-filling; any shortfall appears as a red bar in the cash flow chart.',
}

const MARKET_PROFILE_OPTIONS: { value: string; label: string }[] = [
  { value: 'step',           label: 'Base' },
  { value: 'flat',           label: 'Flat' },
  { value: 'frontLoaded',    label: 'Front-Loaded' },
  { value: 'backLoaded',     label: 'Back-Loaded' },
  { value: 'cyclicalCrest',  label: 'Cyclical Crest' },
  { value: 'cyclicalTrough', label: 'Cyclical Trough' },
  { value: 'marketShock',    label: 'Market Shock' },
  { value: 'noise',          label: 'Noise' },
]

// Minimal layout for the market shape preview chart — no axes, no labels.
const MARKET_CHART_LAYOUT = {
  margin: { t: 4, r: 6, b: 4, l: 6 },
  paper_bgcolor: 'transparent',
  plot_bgcolor: '#f8fafc',
  xaxis: { visible: false, fixedrange: true },
  yaxis: { visible: false, fixedrange: true },
  showlegend: false,
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
  baseLabel?: string
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
          {baseLabel && (
            <span className="text-xs text-slate-400">
              instead of <span className="font-medium text-slate-500">{baseLabel}</span>
            </span>
          )}
        </div>
      ) : (
        baseLabel ? (
          <span className="text-xs text-slate-400">
            Base: <span className="font-medium text-slate-500">{baseLabel}</span>
          </span>
        ) : null
      )}
    </div>
  )
}

// Generic what-if slider.
// All labels — min, base, max, and the current value — live in a single row below
// the track, each centered on its thumb stop using the 8 px radius correction.
// The current value is always red; when it coincides with a fixed stop that stop
// turns red and no separate floating label is rendered.
function WhatIfSlider({
  label, min, max, step = 1, baseValue, value, enabled, onChange, valueSuffix = '', labelRight,
}: {
  label: string
  min: number
  max: number
  step?: number
  baseValue: number
  value: number
  enabled: boolean
  onChange: (value: number, enabled: boolean) => void
  valueSuffix?: string
  labelRight?: React.ReactNode
}) {
  const val     = Math.max(min, Math.min(max, value))
  const fillPct = ((val - min) / (max - min)) * 100

  // Returns the CSS left value that centers a label on the thumb stop for value v.
  // Corrects for the 8 px thumb radius so stops at min/max are not clipped.
  const thumbLeft = (v: number) => {
    const p = ((v - min) / (max - min)) * 100
    return `calc(${p}% + ${(0.5 - p / 100) * 16}px)`
  }

  const onMin  = val === min
  const onMax  = val === max
  const onBase = val === baseValue
  const onFixed = onMin || onMax || onBase  // val sits exactly on a fixed label

  const trackFill = enabled ? '#7B1515' : '#cbd5e1'
  const trackRest = '#e2e8f0'

  return (
    <div className="px-3 py-3">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-sm text-slate-600">{label}</span>
        {labelRight}
      </div>

      <input
        type="range"
        min={min} max={max} step={step} value={val}
        onChange={e => { const v = parseFloat(e.target.value); onChange(v, v !== baseValue) }}
        className="whatif-slider w-full"
        style={{
          color:      trackFill,
          background: `linear-gradient(to right, ${trackFill} ${fillPct}%, ${trackRest} ${fillPct}%)`,
        }}
      />

      {/* Label row — all positioned at their exact thumb stops */}
      <div className="relative mt-1 h-4">
        <span className={`absolute text-[10px] leading-none -translate-x-1/2 whitespace-nowrap ${onMin ? 'font-semibold' : ''}`}
          style={{ left: thumbLeft(min), color: onMin ? '#7B1515' : '#94a3b8' }}>
          {min}{valueSuffix}
        </span>
        <span className={`absolute text-[10px] leading-none -translate-x-1/2 whitespace-nowrap ${onMax ? 'font-semibold' : ''}`}
          style={{ left: thumbLeft(max), color: onMax ? '#7B1515' : '#94a3b8' }}>
          {max}{valueSuffix}
        </span>
        {/* Base label — omit when base coincides with an endpoint to avoid duplicates */}
        {baseValue !== min && baseValue !== max && (
          <span className={`absolute text-[10px] leading-none -translate-x-1/2 whitespace-nowrap ${onBase ? 'font-semibold' : ''}`}
            style={{ left: thumbLeft(baseValue), color: onBase ? '#7B1515' : '#94a3b8' }}>
            {baseValue}{valueSuffix}
          </span>
        )}
        {/* Floating value label — only shown when val is not on a fixed stop */}
        {!onFixed && (
          <span className="absolute text-[10px] font-semibold leading-none -translate-x-1/2 whitespace-nowrap"
            style={{ left: thumbLeft(val), color: '#7B1515' }}>
            {val}{valueSuffix}
          </span>
        )}
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
  const sig      = frozen != null && Math.abs(frozen.numericDelta) >= NEAR_ZERO
  const isBetter = sig && (betterWhenHigher ? frozen!.numericDelta > 0 : frozen!.numericDelta < 0)
  const isWorse  = sig && (betterWhenHigher ? frozen!.numericDelta < 0 : frozen!.numericDelta > 0)
  const arrow    = sig ? (frozen!.numericDelta > 0 ? '▲' : '▼') : null
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

// ─── DeficitOrderInput ────────────────────────────────────────────────────────
// Must be a top-level component (not nested inside DashboardTab) so React sees
// a stable component identity across renders and does not remount it on state
// changes — which would drop focus mid-keystroke in the cap NumberInputs.

const ACCT_LABELS: Record<SpendGapAccountType, string> = {
  tfsa: 'TFSA', nonReg: 'Non-Reg', hisa: 'HISA', rrif: 'RRIF',
}

function DeficitOrderInput({
  phase,
  allowRrif,
  onChange,
  personName,
}: {
  phase: SpendGapPhaseConfig
  allowRrif: boolean
  onChange: (items: SpendGapDeficitItem[]) => void
  personName?: string
}) {
  const baseAccts: SpendGapAccountType[] = ['tfsa', 'nonReg', 'hisa']
  const allAccts: SpendGapAccountType[] = allowRrif ? [...baseAccts, 'rrif'] : baseAccts
  const existingAccts = phase.deficitItems.map(i => i.account).filter(a => allAccts.includes(a))
  const missingAccts = allAccts.filter(a => !existingAccts.includes(a))
  // Normalize: backward-compat — old items without unlimited field treat cap===0 as unlimited
  const items: SpendGapDeficitItem[] = [
    ...phase.deficitItems
      .filter(i => allAccts.includes(i.account))
      .map(i => ({ ...i, unlimited: i.unlimited ?? (i.cap === 0) })),
    ...missingAccts.map(account => ({ account, unlimited: true, cap: 0 })),
  ]
  const move = (idx: number, dir: -1 | 1) => {
    const next = [...items]
    const swap = idx + dir
    if (swap < 0 || swap >= next.length) return
    ;[next[idx], next[swap]] = [next[swap], next[idx]]
    onChange(next)
  }
  const setUnlimited = (idx: number, unlimited: boolean) => {
    onChange(items.map((item, i) => i === idx ? { ...item, unlimited } : item))
  }
  const setCap = (idx: number, cap: number) => {
    onChange(items.map((item, i) => i === idx ? { ...item, cap } : item))
  }
  return (
    <div className="space-y-2.5">
      {/* Person name + column headers */}
      <div className="flex items-end gap-3 text-sm">
        <div className="w-10 shrink-0" />
        <div className="flex-1 font-medium text-slate-600">{personName}</div>
        <span className="w-16 text-center text-sm font-semibold text-slate-500 shrink-0">No Limit</span>
        <span className="w-20 text-center text-sm font-semibold text-slate-500 shrink-0">Limit ($)</span>
      </div>
      {/* Account rows */}
      {items.map((item, i) => (
        <div key={item.account} className="flex items-center gap-3">
          {/* Arrows on left */}
          <div className="flex gap-1.5 w-10 shrink-0">
            <button
              className="text-slate-400 hover:text-slate-600 disabled:opacity-25 text-sm leading-none"
              onClick={() => move(i, -1)}
              disabled={i === 0}
              title="Move up"
            >▲</button>
            <button
              className="text-slate-400 hover:text-slate-600 disabled:opacity-25 text-sm leading-none"
              onClick={() => move(i, 1)}
              disabled={i === items.length - 1}
              title="Move down"
            >▼</button>
          </div>
          {/* Account name */}
          <span className="flex-1 text-sm text-slate-700">{ACCT_LABELS[item.account]}</span>
          {/* No limit toggle */}
          <div className="w-16 flex justify-center shrink-0">
            <input
              type="checkbox"
              checked={item.unlimited}
              onChange={e => setUnlimited(i, e.target.checked)}
              style={{ accentColor: '#7B1515' }}
              className="w-4 h-4 cursor-pointer"
            />
          </div>
          {/* Cap input — fixed height so row height never changes */}
          <div className="w-20 h-8 flex items-center justify-center shrink-0">
            {item.unlimited
              ? <span className="font-bold text-sm" style={{ color: '#7B1515' }}>∞</span>
              : <NumberInput
                  label=""
                  value={item.cap}
                  onChange={v => setCap(i, v)}
                  min={0} max={500_000} step={5_000} decimals={0} size="sm"
                />
            }
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── SurplusOrderInput ────────────────────────────────────────────────────────
// Must be top-level (not nested) so React sees a stable component identity and
// does not remount on state changes — preserving focus in limit NumberInputs.

const SURPLUS_ACCT_LABELS: Record<SpendGapSurplusAccountType, string> = {
  tfsa: 'TFSA', nonReg: 'Non-Reg', hisa: 'HISA',
}

function SurplusOrderInput({
  items,
  onChange,
}: {
  items: SpendGapSurplusItem[]
  onChange: (items: SpendGapSurplusItem[]) => void
}) {
  const allAccts: SpendGapSurplusAccountType[] = ['tfsa', 'nonReg', 'hisa']
  const existingAccts = items.map(i => i.account)
  const missingAccts = allAccts.filter(a => !existingAccts.includes(a))
  // Normalize: backward-compat — old items without unlimited field default to false
  const resolved: SpendGapSurplusItem[] = [
    ...items.filter(i => allAccts.includes(i.account)).map(i => ({ ...i, unlimited: i.unlimited ?? false })),
    ...missingAccts.map(account => ({ account, unlimited: false, limit: 0 })),
  ]
  const move = (idx: number, dir: -1 | 1) => {
    const next = [...resolved]
    const swap = idx + dir
    if (swap < 0 || swap >= next.length) return
    ;[next[idx], next[swap]] = [next[swap], next[idx]]
    onChange(next)
  }
  const setUnlimited = (idx: number, unlimited: boolean) => {
    onChange(resolved.map((item, i) => i === idx ? { ...item, unlimited } : item))
  }
  const setLimit = (idx: number, limit: number) => {
    onChange(resolved.map((item, i) => i === idx ? { ...item, limit } : item))
  }
  return (
    <div className="space-y-2.5">
      {/* Column headers */}
      <div className="flex items-end gap-3 text-sm">
        <div className="w-10 shrink-0" />
        <div className="w-24" />
        <span className="w-16 text-center text-sm font-semibold text-slate-500 shrink-0">No Limit</span>
        <span className="w-20 text-center text-sm font-semibold text-slate-500 shrink-0">Limit ($)</span>
      </div>
      {/* Account rows */}
      {resolved.map((item, i) => (
        <div key={item.account} className="flex items-center gap-3">
          {/* Arrows on left */}
          <div className="flex gap-1.5 w-10 shrink-0">
            <button
              className="text-slate-400 hover:text-slate-600 disabled:opacity-25 text-sm leading-none"
              onClick={() => move(i, -1)}
              disabled={i === 0}
              title="Move up"
            >▲</button>
            <button
              className="text-slate-400 hover:text-slate-600 disabled:opacity-25 text-sm leading-none"
              onClick={() => move(i, 1)}
              disabled={i === resolved.length - 1}
              title="Move down"
            >▼</button>
          </div>
          {/* Account name */}
          <span className="w-24 text-sm text-slate-700">{SURPLUS_ACCT_LABELS[item.account]}</span>
          {/* No limit toggle */}
          <div className="w-16 flex justify-center shrink-0">
            <input
              type="checkbox"
              checked={item.unlimited ?? false}
              onChange={e => setUnlimited(i, e.target.checked)}
              style={{ accentColor: '#7B1515' }}
              className="w-4 h-4 cursor-pointer"
            />
          </div>
          {/* Limit input — fixed height so row height never changes */}
          <div className="w-20 h-8 flex items-center justify-center shrink-0">
            {item.unlimited
              ? <span className="font-bold text-sm" style={{ color: '#7B1515' }}>∞</span>
              : <NumberInput
                  label=""
                  value={item.limit}
                  onChange={v => setLimit(i, v)}
                  min={0} max={500_000} step={5_000} decimals={0} size="sm"
                />
            }
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── BengenAccountOrderInput ──────────────────────────────────────────────────
// Top-level component for stable identity — no remount on state changes.

const BENGEN_ACCT_LABELS: Record<BengenAccountItem['account'], string> = {
  rrsp: 'RRSP / RRIF', tfsa: 'TFSA', nonReg: 'Non-Reg',
}

function BengenAccountOrderInput({
  items,
  onChange,
  personName,
}: {
  items: BengenAccountItem[]
  onChange: (items: BengenAccountItem[]) => void
  personName?: string
}) {
  const allAccts: BengenAccountItem['account'][] = ['rrsp', 'tfsa', 'nonReg']
  const existingAccts = items.map(i => i.account).filter(a => allAccts.includes(a))
  const missingAccts  = allAccts.filter(a => !existingAccts.includes(a))
  const resolved: BengenAccountItem[] = [
    ...items.filter(i => allAccts.includes(i.account)).map(i => ({ ...i, unlimited: i.unlimited ?? true })),
    ...missingAccts.map(account => ({ account, unlimited: true, cap: 0 })),
  ]
  const move = (idx: number, dir: -1 | 1) => {
    const next = [...resolved]
    const swap = idx + dir
    if (swap < 0 || swap >= next.length) return
    ;[next[idx], next[swap]] = [next[swap], next[idx]]
    onChange(next)
  }
  const setUnlimited = (idx: number, unlimited: boolean) =>
    onChange(resolved.map((item, i) => i === idx ? { ...item, unlimited } : item))
  const setCap = (idx: number, cap: number) =>
    onChange(resolved.map((item, i) => i === idx ? { ...item, cap } : item))

  return (
    <div className="space-y-2.5">
      <div className="flex items-end gap-3 text-sm">
        <div className="w-10 shrink-0" />
        <div className="flex-1 font-medium text-slate-600">{personName}</div>
        <span className="w-16 text-center text-sm font-semibold text-slate-500 shrink-0">No Limit</span>
        <span className="w-20 text-center text-sm font-semibold text-slate-500 shrink-0">Limit ($)</span>
      </div>
      {resolved.map((item, i) => (
        <div key={item.account} className="flex items-center gap-3">
          <div className="flex gap-1.5 w-10 shrink-0">
            <button
              className="text-slate-400 hover:text-slate-600 disabled:opacity-25 text-sm leading-none"
              onClick={() => move(i, -1)} disabled={i === 0} title="Move up"
            >▲</button>
            <button
              className="text-slate-400 hover:text-slate-600 disabled:opacity-25 text-sm leading-none"
              onClick={() => move(i, 1)} disabled={i === resolved.length - 1} title="Move down"
            >▼</button>
          </div>
          <span className="flex-1 text-sm text-slate-700">{BENGEN_ACCT_LABELS[item.account]}</span>
          <div className="w-16 flex justify-center shrink-0">
            <input
              type="checkbox"
              checked={item.unlimited}
              onChange={e => setUnlimited(i, e.target.checked)}
              style={{ accentColor: '#7B1515' }}
              className="w-4 h-4 cursor-pointer"
            />
          </div>
          <div className="w-20 h-8 flex items-center justify-center shrink-0">
            {item.unlimited
              ? <span className="font-bold text-sm" style={{ color: '#7B1515' }}>∞</span>
              : <NumberInput
                  label="" value={item.cap} onChange={v => setCap(i, v)}
                  min={0} max={500_000} step={5_000} decimals={0} size="sm"
                />
            }
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── DashboardTab ─────────────────────────────────────────────────────────────

export function DashboardTab() {
  const state = useStore()
  const {
    whatIfs, frozenMetrics, scenarios, activeScenarioId,
    updateWhatIf, resetWhatIfsExceptDrawdown, freezeMetrics, clearFreeze,
    saveScenario, loadScenario, deleteScenario,
    personA, personB, cppA, cppB, oasA, oasB,
    returnRates, personalInflationRatePct, cpiRatePct, withdrawalStrategy,
    ageReferencePerson,
  } = state


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

  // Rate schedule for the projection engine — generated when market profile is enabled.
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

  // Rate profile shape preview — always visible in the Market section (50-year horizon).
  const { marketChartSeries, marketStats } = useMemo(() => {
    const currentYear = new Date().getFullYear()
    const previewEnd  = currentYear + 49
    const refBirth = effectiveState.ageReferencePerson === 'personB'
      ? effectiveState.personB.birthDate
      : effectiveState.personA.birthDate
    const mv = whatIfs.marketProfile?.enabled ? (whatIfs.marketProfile.value ?? DEFAULT_MARKET_PROFILE) : DEFAULT_MARKET_PROFILE
    const baseSchedule = generateRateSchedule(
      effectiveState.returnRates,
      { ...DEFAULT_MARKET_PROFILE, profileType: 'step' },
      currentYear, previewEnd, refBirth,
    ).map(r => r * 100)
    const currentSchedule = generateRateSchedule(
      effectiveState.returnRates,
      mv,
      currentYear, previewEnd, refBirth,
    ).map(r => r * 100)
    const years = Array.from({ length: 50 }, (_, i) => currentYear + i)
    const high = Math.max(...currentSchedule)
    const low  = Math.min(...currentSchedule)
    const avg  = currentSchedule.reduce((a, b) => a + b, 0) / currentSchedule.length
    return {
      marketChartSeries: [
        { type: 'scatter', mode: 'lines', x: years, y: baseSchedule,
          line: { color: '#cbd5e1', width: 1.5, dash: 'dot' }, hoverinfo: 'none' },
        { type: 'scatter', mode: 'lines', x: years, y: currentSchedule,
          line: { color: '#7B1515', width: 2 }, hoverinfo: 'none' },
      ],
      marketStats: { high, low, avg },
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [whatIfs.marketProfile, effectiveState.returnRates, effectiveState.ageReferencePerson,
      effectiveState.personA.birthDate, effectiveState.personB.birthDate])

  const { dataPoints, warnings } = useMemo(
    () => runProjection(effectiveState, rateSchedule),
    [effectiveState, rateSchedule],
  )
  const metrics = useMemo(
    () => computeHeadlineMetrics(dataPoints, ageReferencePerson, effectiveState as AppState),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataPoints, ageReferencePerson, effectiveState],
  )

  // ── Scenario controls state ────────────────────────────────────────────────

  const [savingScenario, setSavingScenario] = useState(false)
  const [saveName, setSaveName]             = useState('')

  function handleSave() {
    const name = saveName.trim()
    if (!name) return
    saveScenario(name)
    setSavingScenario(false)
    setSaveName('')
  }

  // ── Chart state ───────────────────────────────────────────────────────────

  const [xAxisModeIncome,    setXAxisModeIncome]    = useState<XAxisMode>('year')
  const [xAxisModeTax,       setXAxisModeTax]       = useState<XAxisMode>('year')
  const [xAxisModeSpending,  setXAxisModeSpending]  = useState<XAxisMode>('year')
  const [xAxisModeCashFlow,  setXAxisModeCashFlow]  = useState<XAxisMode>('year')
  const [xAxisModePortfolio, setXAxisModePortfolio] = useState<XAxisMode>('year')

  type IncomeMode   = 'gross' | 'net'
  type ChartPerson  = 'both' | 'A' | 'B'
  const [incomeMode,     setIncomeMode]     = useState<IncomeMode>('gross')
  const [incomePerson,   setIncomePerson]   = useState<ChartPerson>('both')
  const [taxPerson,      setTaxPerson]      = useState<ChartPerson>('both')
  const [portfolioPerson, setPortfolioPerson] = useState<ChartPerson>('both')
  const [enabledSources,           setEnabledSources]           = useState<Set<SourceKey>>(() => new Set(ALL_SOURCE_KEYS))
  const [enabledPortfolioAccounts, setEnabledPortfolioAccounts] = useState<Set<PortfolioKey>>(() => new Set(ALL_PORTFOLIO_KEYS))
  const [expandedTableGroups, setExpandedTableGroups] = useState<Set<TableGroupKey>>(new Set())
  const toggleTableGroup = (key: TableGroupKey) =>
    setExpandedTableGroups(prev => { const s = new Set(prev); s.has(key) ? s.delete(key) : s.add(key); return s })
  const [showPersonTint, setShowPersonTint] = useState(true)

  // ── Modal state ─────────────────────────────────────────────────────────────
  const [modalDef, setModalDef] = useState<ModalDef | null>(null)

  // Planning-end years for modal highlights
  const endYearA = getYear(dateAtAge(effectiveState.personA.birthDate, effectiveState.personA.planningEndAge))
  const endYearB = getYear(dateAtAge(effectiveState.personB.birthDate, effectiveState.personB.planningEndAge))
  const endYear  = Math.max(endYearA, endYearB)

  const currentYear = new Date().getFullYear()
  // Retirement years for modal highlights
  const retirementYearA = getYear(effectiveState.personA.retirementDate)
  const retirementYearB = getYear(effectiveState.personB.retirementDate)

  // Count months in a year where '${year}-MM-01' falls in [startDate, endDate].
  // Mirrors the engine's monthly loop: income flows when monthDate >= startDate && <= endDate.
  // This correctly pro-rates both the first year (start mid-year) and the death year.
  function activeFrac(year: number, startDate: string, endDate: string): number {
    let count = 0
    for (let m = 1; m <= 12; m++) {
      const md = `${year}-${String(m).padStart(2, '0')}-01`
      if (md >= startDate && md <= endDate) count++
    }
    return count / 12
  }
  // Count months in a year where '${year}-MM-01' <= date (no lower bound).
  // Used to compute the post-death survivor fraction within the death year itself.
  function monthFracUpTo(year: number, date: string): number {
    let count = 0
    for (let m = 1; m <= 12; m++) {
      if (`${year}-${String(m).padStart(2, '0')}-01` <= date) count++
    }
    return count / 12
  }

  // Helper: build CPP vs-65 baseline map (mirrors computeHeadlineMetrics logic)
  function buildCppBaselineMap() {
    const cpiR  = effectiveState.cpiRatePct / 100
    const piR   = effectiveState.personalInflationRatePct / 100
    const cy    = new Date().getFullYear()
    const bCPPA = effectiveState.cppA.estimatedMonthlyAt65 * 12
    const bCPPB = effectiveState.cppB.estimatedMonthlyAt65 * 12
    const a65   = dateAtAge(effectiveState.personA.birthDate, 65)
    const b65   = dateAtAge(effectiveState.personB.birthDate, 65)
    const dA    = dateAtAge(effectiveState.personA.birthDate, effectiveState.personA.planningEndAge)
    const dB    = dateAtAge(effectiveState.personB.birthDate, effectiveState.personB.planningEndAge)
    const map   = new Map<number, number>()
    for (const d of dataPoints) {
      const pdF = Math.pow((1 + cpiR) / (1 + piR), d.year - cy)
      const aA  = d.year <= endYearA, bA = d.year <= endYearB
      let base  = 0
      if (aA)        base += bCPPA        * activeFrac(d.year, a65, dA) * pdF
      // B's survivor from A: full years after A's death
      if (!aA && bA) base += bCPPA * 0.60 * activeFrac(d.year, a65, dB) * pdF
      // B's survivor from A: post-death months within A's death year
      if (d.year === endYearA && bA) {
        const survFrac = monthFracUpTo(d.year, dB) - monthFracUpTo(d.year, dA)
        if (survFrac > 0) base += bCPPA * 0.60 * survFrac * pdF
      }
      if (bA)        base += bCPPB        * activeFrac(d.year, b65, dB) * pdF
      // A's survivor from B: full years after B's death
      if (!bA && aA) base += bCPPB * 0.60 * activeFrac(d.year, b65, dA) * pdF
      // A's survivor from B: post-death months within B's death year
      if (d.year === endYearB && aA) {
        const survFrac = monthFracUpTo(d.year, dA) - monthFracUpTo(d.year, dB)
        if (survFrac > 0) base += bCPPB * 0.60 * survFrac * pdF
      }
      map.set(d.year, base)
    }
    return map
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
    const dA    = dateAtAge(effectiveState.personA.birthDate, effectiveState.personA.planningEndAge)
    const dB    = dateAtAge(effectiveState.personB.birthDate, effectiveState.personB.planningEndAge)
    const map   = new Map<number, number>()
    for (const d of dataPoints) {
      const pdF = Math.pow((1 + cpiR) / (1 + piR), d.year - cy)
      const aA  = d.year <= endYearA, bA = d.year <= endYearB
      let base  = 0
      if (aA) base += bOASA * activeFrac(d.year, a65, dA) * pdF
      if (bA) base += bOASB * activeFrac(d.year, b65, dB) * pdF
      map.set(d.year, base)
    }
    return map
  }

  if (dataPoints.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
        No projection data. Check that birth dates and retirement dates are set in the Settings tab.
      </div>
    )
  }

  const years = dataPoints.map(d => d.year)
  const xAxisIncome    = buildXAxis(years, xAxisModeIncome,    effectiveState.personA.birthDate, effectiveState.personB.birthDate, effectiveState.personA.planningEndAge, effectiveState.personB.planningEndAge)
  const xAxisTax       = buildXAxis(years, xAxisModeTax,       effectiveState.personA.birthDate, effectiveState.personB.birthDate, effectiveState.personA.planningEndAge, effectiveState.personB.planningEndAge)
  const xAxisSpending  = buildXAxis(years, xAxisModeSpending,  effectiveState.personA.birthDate, effectiveState.personB.birthDate, effectiveState.personA.planningEndAge, effectiveState.personB.planningEndAge)
  const xAxisCashFlow  = buildXAxis(years, xAxisModeCashFlow,  effectiveState.personA.birthDate, effectiveState.personB.birthDate, effectiveState.personA.planningEndAge, effectiveState.personB.planningEndAge)
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
    { x: years, y: dataPoints.map(d => d.cppA),              name: `CPP — ${aName}`,        type: 'bar', marker: { color: CHART_COLORS.cppA },            _p: 'A', _src: 'cpp'        },
    { x: years, y: dataPoints.map(d => d.cppB),              name: `CPP — ${bName}`,        type: 'bar', marker: { color: CHART_COLORS.cppB },            _p: 'B', _src: 'cpp'        },
    { x: years, y: dataPoints.map(d => d.oasA),              name: `OAS — ${aName}`,        type: 'bar', marker: { color: CHART_COLORS.oasA },            _p: 'A', _src: 'oas'        },
    { x: years, y: dataPoints.map(d => d.oasB),              name: `OAS — ${bName}`,        type: 'bar', marker: { color: CHART_COLORS.oasB },            _p: 'B', _src: 'oas'        },
    { x: years, y: dataPoints.map(d => d.rrifA),             name: `${aName} RRIF`,       type: 'bar', marker: { color: CHART_COLORS.rrifA },           _p: 'A', _src: 'rrif'       },
    { x: years, y: dataPoints.map(d => d.rrifB),             name: `${bName} RRIF`,       type: 'bar', marker: { color: CHART_COLORS.rrifB },           _p: 'B', _src: 'rrif'       },
    { x: years, y: dataPoints.map(d => d.tfsaWithdrawalA),   name: `${aName} TFSA`,       type: 'bar', marker: { color: CHART_COLORS.tfsaA },           _p: 'A', _src: 'tfsa'       },
    { x: years, y: dataPoints.map(d => d.tfsaWithdrawalB),   name: `${bName} TFSA`,       type: 'bar', marker: { color: CHART_COLORS.tfsaB },           _p: 'B', _src: 'tfsa'       },
    { x: years, y: dataPoints.map(d => d.nonRegWithdrawalA), name: `${aName} Non-Reg`,    type: 'bar', marker: { color: CHART_COLORS.nonRegA },         _p: 'A', _src: 'nonReg'     },
    { x: years, y: dataPoints.map(d => d.nonRegWithdrawalB), name: `${bName} Non-Reg`,    type: 'bar', marker: { color: CHART_COLORS.nonRegB },         _p: 'B', _src: 'nonReg'     },
    { x: years, y: dataPoints.map(d => d.hisaWithdrawal),   name: 'HISA/Cash Draw',      type: 'bar', marker: { color: '#94a3b8' },                               _src: 'hisa'       },
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

  const allTaxSeries: Data[] = [
    { x: years, y: dataPoints.map(d => d.taxA), name: `${aName} Tax`, type: 'bar', marker: { color: '#ef4444' }, _p: 'A' },
    { x: years, y: dataPoints.map(d => d.taxB), name: `${bName} Tax`, type: 'bar', marker: { color: '#f97316' }, _p: 'B' },
  ]
  const taxData: Data[] = withTotals(
    allTaxSeries.filter(s => taxPerson === 'both' || s._p === taxPerson)
  )

  const spendingData: Data[] = withTotals([
    { x: years, y: dataPoints.map(d => d.spendingLifestyle),  name: 'Lifestyle',         type: 'bar', marker: { color: '#64748b' } },
    { x: years, y: dataPoints.map(d => d.contributions),      name: 'Contributions',     type: 'bar', marker: { color: '#3b82f6' } },
    { x: years, y: dataPoints.map(d => d.spendingUnexpected), name: 'Unexpected Expense',type: 'bar', marker: { color: '#f59e0b' } },
  ])

  const cashFlowData: Data[] = [{
    x: years,
    y: dataPoints.map(d => d.cashFlow),
    type: 'bar',
    name: 'Cash Flow',
    marker: { color: dataPoints.map(d => d.cashFlow >= 0 ? '#22c55e' : '#ef4444') },
    hovertemplate: '%{y:$,.0f}<extra></extra>',
  }]

  const allPortfolioSeries: Data[] = [
    { x: years, y: dataPoints.map(d => d.rrspA),   name: `${aName} RRSP/RRIF`, type: 'bar', marker: { color: CHART_COLORS.rrifA }, _p: 'A', _acct: 'rrif'   },
    { x: years, y: dataPoints.map(d => d.rrspB),   name: `${bName} RRSP/RRIF`, type: 'bar', marker: { color: CHART_COLORS.rrifB }, _p: 'B', _acct: 'rrif'   },
    { x: years, y: dataPoints.map(d => d.tfsaA),   name: `${aName} TFSA`,      type: 'bar', marker: { color: CHART_COLORS.tfsaA }, _p: 'A', _acct: 'tfsa'   },
    { x: years, y: dataPoints.map(d => d.tfsaB),   name: `${bName} TFSA`,      type: 'bar', marker: { color: CHART_COLORS.tfsaB }, _p: 'B', _acct: 'tfsa'   },
    { x: years, y: dataPoints.map(d => d.nonRegA), name: `${aName} Non-Reg`,   type: 'bar', marker: { color: CHART_COLORS.nonRegA }, _p: 'A', _acct: 'nonReg' },
    { x: years, y: dataPoints.map(d => d.nonRegB), name: `${bName} Non-Reg`,   type: 'bar', marker: { color: CHART_COLORS.nonRegB }, _p: 'B', _acct: 'nonReg' },
    { x: years, y: dataPoints.map(d => d.hisa),    name: 'HISA / Cash',        type: 'bar', marker: { color: '#94a3b8' },                   _acct: 'hisa'   },
  ]
  const portfolioData: Data[] = withTotals(
    allPortfolioSeries.filter(s =>
      (portfolioPerson === 'both' || s._p === portfolioPerson || s._p === undefined) &&
      enabledPortfolioAccounts.has(s._acct as PortfolioKey)
    )
  )

  // ── Summary table column definitions ─────────────────────────────────────

  const yearOpen      = expandedTableGroups.has('year')
  const incomeOpen    = expandedTableGroups.has('income')
  const taxOpen       = expandedTableGroups.has('tax')
  const spendingOpen  = expandedTableGroups.has('spending')
  const portfolioOpen = expandedTableGroups.has('portfolio')

  const a = aName, b = bName   // short aliases for compact column label strings

  const yearTableCols: TableCol[] = yearOpen ? [
    { label: 'Year',        value: d => d.year,      format: (v)    => String(v),                                                className: 'font-medium text-slate-700 text-left' },
    { label: `Age — ${a}`, value: d => d.personAAge, format: (v, d) => d.year > endYearA ? `(${v.toFixed(1)})` : v.toFixed(1), className: 'text-slate-600', person: 'A' },
    { label: `Age — ${b}`, value: d => d.personBAge, format: (v, d) => d.year > endYearB ? `(${v.toFixed(1)})` : v.toFixed(1), className: 'text-slate-600', person: 'B' },
  ] : [
    { label: 'Year',        value: d => d.year,      format: (v)    => String(v),                                                className: 'font-medium text-slate-700 text-left' },
  ]

  const incomeTableCols: TableCol[] = incomeOpen ? [
    { label: `Emp — ${a}`,    value: d => d.employmentA,       person: 'A' },
    { label: `Emp — ${b}`,    value: d => d.employmentB,       person: 'B' },
    { label: `DB — ${a}`,     value: d => d.dbPensionBase,     person: 'A' },
    { label: `Bridge — ${a}`, value: d => d.dbBridge,          person: 'A' },
    { label: `DB — ${b}`,     value: d => d.dbPensionBaseB,    person: 'B' },
    { label: `Bridge — ${b}`, value: d => d.dbBridgeB,         person: 'B' },
    { label: `CPP — ${a}`,    value: d => d.cppA,              person: 'A' },
    { label: `CPP — ${b}`,    value: d => d.cppB,              person: 'B' },
    { label: `OAS — ${a}`,    value: d => d.oasA,              person: 'A' },
    { label: `OAS — ${b}`,    value: d => d.oasB,              person: 'B' },
    { label: `RRIF — ${a}`,   value: d => d.rrifA,             person: 'A' },
    { label: `RRIF — ${b}`,   value: d => d.rrifB,             person: 'B' },
    { label: `Split Paid — ${a}`,  value: d => d.pensionSplitPaid,      person: 'A', splitPaid: true },
    { label: `Split Rcvd — ${b}`,  value: d => d.pensionSplitReceived,  person: 'B' },
    { label: `Split Paid — ${b}`,  value: d => d.pensionSplitPaidB,     person: 'B', splitPaid: true },
    { label: `Split Rcvd — ${a}`,  value: d => d.pensionSplitReceivedA, person: 'A' },
    { label: `TFSA — ${a}`,   value: d => d.tfsaWithdrawalA,   person: 'A' },
    { label: `TFSA — ${b}`,   value: d => d.tfsaWithdrawalB,   person: 'B' },
    { label: `NR — ${a}`,       value: d => d.nonRegWithdrawalA, person: 'A' },
    { label: `NR — ${b}`,       value: d => d.nonRegWithdrawalB, person: 'B' },
    { label: `NR Yield † — ${a}`, value: d => d.nonRegYieldA,      person: 'A', tSlipOnly: true },
    { label: `NR Yield † — ${b}`, value: d => d.nonRegYieldB,      person: 'B', tSlipOnly: true },
    { label: 'HISA',              value: d => d.hisaWithdrawal },
    { label: `Other — ${a}`,    value: d => d.otherIncomeA,      person: 'A' },
    { label: `Other — ${b}`,    value: d => d.otherIncomeB,      person: 'B' },
  ] : [
    { label: `Taxable — ${a}`, value: d => d.grossIncomeA, person: 'A' },
    { label: `Taxable — ${b}`, value: d => d.grossIncomeB, person: 'B' },
  ]

  const splitCol: TableCol = {
    label: 'Split',
    value: d => d.pensionSplitPaid > 0 ? d.pensionSplitPaid : d.pensionSplitPaidB,
    format: (_v, d) => {
      if (d.pensionSplitPaid > 0)  return `A→B ${fmtT(d.pensionSplitPaid)}`
      if (d.pensionSplitPaidB > 0) return `B→A ${fmtT(d.pensionSplitPaidB)}`
      return '—'
    },
  }

  const taxTableCols: TableCol[] = taxOpen ? [
    { label: `Tax — ${a}`,      value: d => d.taxA,          person: 'A' },
    { label: `Tax — ${b}`,      value: d => d.taxB,          person: 'B' },
    { label: `Clawback — ${a}`, value: d => d.oasClawbackA,  person: 'A' },
    { label: `Clawback — ${b}`, value: d => d.oasClawbackB,  person: 'B' },
    splitCol,
  ] : [
    { label: `Tax — ${a}`, value: d => d.taxA, person: 'A' },
    { label: `Tax — ${b}`, value: d => d.taxB, person: 'B' },
  ]

  const spendingTableCols: TableCol[] = spendingOpen ? [
    { label: 'Lifestyle',       value: d => d.spendingLifestyle },
    { label: `RRSP — ${a}`,    value: d => d.contribRrspA,   person: 'A' },
    { label: `RRSP — ${b}`,    value: d => d.contribRrspB,   person: 'B' },
    { label: `TFSA — ${a}`,    value: d => d.contribTfsaA,   person: 'A' },
    { label: `TFSA — ${b}`,    value: d => d.contribTfsaB,   person: 'B' },
    { label: `NR — ${a}`,      value: d => d.contribNonRegA, person: 'A' },
    { label: `NR — ${b}`,      value: d => d.contribNonRegB, person: 'B' },
    { label: 'HISA',           value: d => d.hisaContrib },
    { label: 'Unexpected',     value: d => d.spendingUnexpected },
  ] : [
    { label: 'Spending',       value: d => d.householdSpending },
  ]

  const portfolioTableCols: TableCol[] = portfolioOpen ? [
    { label: `RRSP — ${a}`, value: d => d.rrspA,   person: 'A' },
    { label: `RRSP — ${b}`, value: d => d.rrspB,   person: 'B' },
    { label: `TFSA — ${a}`, value: d => d.tfsaA,   person: 'A' },
    { label: `TFSA — ${b}`, value: d => d.tfsaB,   person: 'B' },
    { label: `NR — ${a}`,   value: d => d.nonRegA,  person: 'A' },
    { label: `NR — ${b}`,   value: d => d.nonRegB,  person: 'B' },
    { label: 'HISA',         value: d => d.hisa },
  ] : [
    { label: 'Total', value: d => d.totalPortfolio },
  ]

  const colTint = (col: TableCol, rowIdx: number) => {
    if (!showPersonTint || !col.person) return {}
    const hex = col.person === 'A' ? personA.color : personB.color
    return { backgroundColor: hexTint(hex, rowIdx % 2 === 0 ? 0.10 : 0.14) }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
    <div className="space-y-4">

      {/* ── Scenario Card ─────────────────────────────────────────────────── */}
      <SectionDivider title="Scenarios" />
      <SectionCard title="Scenario" width="full"
        info={
          <div className="space-y-2 text-sm">
            <p>Scenarios let you save and compare named what-if configurations. Each scenario captures the complete state of the Drawdown Strategy and Base Plan Modifications — allowing you to switch between fundamentally different plans (e.g. "Retire at 55 — RRSP meltdown" vs "Retire at 58 — conservative") and see the impact on key outcomes.</p>
            <p><strong>Workflow:</strong> Configure the drawdown strategy and any base plan modifications you want, then click <strong>Save As…</strong> to name and save the current configuration. To compare two scenarios, load the first, click <strong>Freeze</strong> in the Key Outcomes card, then load the second — the frozen deltas will appear on each metric tile showing exactly what changed.</p>
            <p><strong>Reset All</strong> clears all what-if toggles and returns to a clean base plan view without deleting your saved scenarios. The saved scenarios remain available in the Load menu.</p>
          </div>
        }>
        <div className="space-y-3">
          {/* Save controls */}
          <div className="flex items-center gap-2">
            {savingScenario ? (
              <>
                <input
                  className="input-field text-sm py-1 w-52"
                  placeholder="Scenario name…"
                  value={saveName}
                  autoFocus
                  onChange={e => setSaveName(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleSave()
                    if (e.key === 'Escape') { setSavingScenario(false); setSaveName('') }
                  }}
                />
                <button className="btn-primary" onClick={handleSave}>Save</button>
                <button className="btn-secondary" onClick={() => { setSavingScenario(false); setSaveName('') }}>Cancel</button>
              </>
            ) : (
              <button className="btn-primary" onClick={() => setSavingScenario(true)}>Save Scenario</button>
            )}
          </div>

          {/* Scenario list */}
          {scenarios.length === 0 ? (
            <p className="text-sm text-slate-400 italic">No saved scenarios. Configure the drawdown strategy and modifications, then save.</p>
          ) : (
            <div className="overflow-x-auto rounded border border-slate-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-3 py-2 text-left font-medium text-slate-700">Name</th>
                    <th className="px-3 py-2 text-left font-medium text-slate-500 whitespace-nowrap">Saved</th>
                    <th className="px-3 py-2" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {scenarios.map(s => {
                    const isActive = s.id === activeScenarioId
                    return (
                      <tr key={s.id} className={isActive ? 'bg-amber-50' : 'hover:bg-slate-50/50'}>
                        <td className="px-3 py-2 font-medium text-slate-700">
                          {s.name}
                          {isActive && <span className="ml-2 text-xs text-amber-600 font-normal">active</span>}
                        </td>
                        <td className="px-3 py-2 text-xs text-slate-400 whitespace-nowrap">
                          {new Date(s.savedAt).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </td>
                        <td className="px-3 py-1.5 text-right whitespace-nowrap">
                          <div className="flex justify-end gap-2">
                            <button className="btn-primary" onClick={() => loadScenario(s.id)}>Load</button>
                            <button className="btn-danger" onClick={() => deleteScenario(s.id)} aria-label="Delete">✕</button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </SectionCard>

      {/* ── Drawdown Strategy Card ────────────────────────────────────────── */}
      <SectionCard title="Drawdown Strategy" width="full"
        onReset={() => updateWhatIf('drawdownStrategy', DEFAULT_WHATIFS.drawdownStrategy)}
        info={
          <div className="space-y-2 text-sm">
            <p>The drawdown strategy is the heart of the retirement simulation. It tells the engine <em>how</em> to move money each year — which accounts to draw from, in what order, and how to handle surpluses — given the income, spending, and account balances from the base plan.</p>
            <p><strong>No Strategy</strong> — The engine runs the base plan as-is: income flows in, contributions flow out, and the gap (if any) is shown as a cash flow shortfall. No withdrawals are made from investment accounts. Use this to see what your base plan income looks like before any drawdown decisions are layered on.</p>
            <p><strong>Fixed Percentage</strong> — Each year, a fixed percentage of each account balance is withdrawn, with a floor amount to ensure a minimum draw. Straightforward, predictable, but not responsive to spending needs.</p>
            <p><strong>Fixed Withdrawal</strong> — A fixed dollar amount is withdrawn from each account each year. Easy to understand, but the real value of withdrawals declines over time with inflation unless adjusted manually.</p>
            <p><strong>Bengen Rule</strong> — The classic 4% rule. In year 1 of retirement, withdraw a configured % of total portfolio. Each subsequent year draw that same amount indexed for inflation, creating a constant real draw. Shows surplus or deficit directly in cash flow — no gap-filling.</p>
            <p><strong>Cover Spending Gap</strong> — The most sophisticated strategy. Draws exactly what is needed to cover spending, routes surplus back into accounts, and supports proactive RRSP meltdown. Maximizes tax efficiency and configurability.</p>
            <p>The configuration panels below the strategy selector only appear when relevant to the selected strategy type. Use the reset button to restore all strategy settings to defaults.</p>
          </div>
        }>
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
              </tbody>
            </table>
          </div>
          <InfoPanel>
            {DRAWDOWN_STRATEGY_DESCRIPTIONS[whatIfs.drawdownStrategy.value.strategyType]}
          </InfoPanel>

          {/* Spend-Gap config */}
          {whatIfs.drawdownStrategy.value.strategyType === 'spendGap' && (() => {
            const sg = whatIfs.drawdownStrategy.value.spendGapConfig
            const updateSg = (patch: Partial<typeof sg>) =>
              updateWhatIf('drawdownStrategy', {
                value: {
                  ...whatIfs.drawdownStrategy.value,
                  spendGapConfig: { ...sg, ...patch },
                },
              })
            const updatePhase = (
              phase: 'meltdownA' | 'meltdownB' | 'rrifA' | 'rrifB',
              patch: Partial<SpendGapPhaseConfig>,
            ) => updateSg({ [phase]: { ...sg[phase], ...patch } })


            return (
              <div className="space-y-3 pt-1">
                {/* Global toggle */}
                <div className="flex items-center gap-3 px-3 py-2 border border-slate-200 rounded bg-slate-50">
                  <ToggleInput
                    label="Stop contributions when partner retires"
                    value={sg.stopContributionsWhenPartnerRetired}
                    onChange={v => updateSg({ stopContributionsWhenPartnerRetired: v })}
                  />
                </div>

                {/* Phase 2 — Meltdown */}
                <p className="text-sm font-semibold text-slate-600 pt-1">Phase 2 — RRSP Meltdown</p>
                <div className="space-y-2">
                  <div className="flex items-end gap-8 p-3 border border-slate-200 rounded bg-slate-50">
                    <span className="text-sm text-slate-600 w-36 shrink-0 pb-[3px]">Gross Income Ceiling</span>
                    <div className="flex gap-6">
                      <NumberInput label={aName}
                        value={sg.meltdownA.grossIncomeCeiling}
                        onChange={v => updatePhase('meltdownA', { grossIncomeCeiling: v })}
                        prefix="$" min={0} max={500_000} step={5_000} decimals={0} size="sm" />
                      <NumberInput label={bName}
                        value={sg.meltdownB.grossIncomeCeiling}
                        onChange={v => updatePhase('meltdownB', { grossIncomeCeiling: v })}
                        prefix="$" min={0} max={500_000} step={5_000} decimals={0} size="sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded border border-slate-200">
                      <div className="bg-slate-50 border-b border-slate-200 px-3 py-2">
                        <span className="text-sm font-medium text-slate-700">Deficit Order</span>
                      </div>
                      <div className="bg-white px-3 py-3">
                        <div className="flex gap-20">
                          <DeficitOrderInput phase={sg.meltdownA} allowRrif={false} onChange={items => updatePhase('meltdownA', { deficitItems: items })} personName={aName} />
                          <DeficitOrderInput phase={sg.meltdownB} allowRrif={false} onChange={items => updatePhase('meltdownB', { deficitItems: items })} personName={bName} />
                        </div>
                      </div>
                    </div>
                    <div className="rounded border border-slate-200">
                      <div className="bg-slate-50 border-b border-slate-200 px-3 py-2">
                        <span className="text-sm font-medium text-slate-700">Surplus Order</span>
                      </div>
                      <div className="bg-white px-3 py-3">
                        <SurplusOrderInput
                          items={sg.surplusMeltdownItems ?? DEFAULT_SURPLUS_ITEMS}
                          onChange={items => updateSg({ surplusMeltdownItems: items })}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phase 3 — RRIF */}
                <p className="text-sm font-semibold text-slate-600 pt-1">Phase 3 — RRIF Forced Minimums</p>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded border border-slate-200">
                      <div className="bg-slate-50 border-b border-slate-200 px-3 py-2">
                        <span className="text-sm font-medium text-slate-700">Deficit Order</span>
                      </div>
                      <div className="bg-white px-3 py-3">
                        <div className="flex gap-20">
                          <DeficitOrderInput phase={sg.rrifA} allowRrif={true} onChange={items => updatePhase('rrifA', { deficitItems: items })} personName={aName} />
                          <DeficitOrderInput phase={sg.rrifB} allowRrif={true} onChange={items => updatePhase('rrifB', { deficitItems: items })} personName={bName} />
                        </div>
                      </div>
                    </div>
                    <div className="rounded border border-slate-200">
                      <div className="bg-slate-50 border-b border-slate-200 px-3 py-2">
                        <span className="text-sm font-medium text-slate-700">Surplus Order</span>
                      </div>
                      <div className="bg-white px-3 py-3">
                        <SurplusOrderInput
                          items={sg.surplusRrifItems ?? DEFAULT_SURPLUS_ITEMS}
                          onChange={items => updateSg({ surplusRrifItems: items })}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    className="btn-secondary text-xs"
                    onClick={() => updateWhatIf('drawdownStrategy', DEFAULT_WHATIFS.drawdownStrategy)}
                  >
                    Reset to defaults
                  </button>
                </div>
              </div>
            )
          })()}

          {/* Bengen Rule config */}
          {whatIfs.drawdownStrategy.value.strategyType === 'bengen' && (() => {
            const bg = whatIfs.drawdownStrategy.value.bengenConfig ?? DEFAULT_BENGEN_CONFIG
            const updateBg = (patch: Partial<typeof bg>) =>
              updateWhatIf('drawdownStrategy', {
                value: { ...whatIfs.drawdownStrategy.value, bengenConfig: { ...bg, ...patch } },
              })
            const updatePerson = (person: 'personA' | 'personB', patch: Partial<BengenPersonConfig>) =>
              updateBg({ [person]: { ...bg[person], ...patch } })

            return (
              <div className="space-y-3 pt-1">
                {/* Annual adjustment selector */}
                <div className="overflow-x-auto rounded border border-slate-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th colSpan={2} className="px-3 py-2 text-left font-medium text-slate-700">Parameters</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr className="hover:bg-slate-50/50">
                        <td className="px-3 py-2 text-slate-600 w-52">Index by CPI</td>
                        <td className="px-2 py-1.5">
                          <ToggleInput
                            label=""
                            value={bg.inflationIndex === 'cpi'}
                            onChange={v => updateBg({ inflationIndex: v ? 'cpi' : 'personal' })}
                          />
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="px-3 py-2 text-slate-600">Route surplus to HISA</td>
                        <td className="px-2 py-1.5">
                          <ToggleInput
                            label=""
                            value={bg.surplusToHisa ?? true}
                            onChange={v => updateBg({ surplusToHisa: v })}
                          />
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="px-3 py-2 text-slate-600">Cover deficit from HISA</td>
                        <td className="px-2 py-1.5">
                          <ToggleInput
                            label=""
                            value={bg.deficitFromHisa ?? false}
                            onChange={v => updateBg({ deficitFromHisa: v })}
                          />
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="px-3 py-2 text-slate-600">Year-1 Draw Rate</td>
                        <td className="px-2 py-1.5">
                          <div className="flex gap-6">
                            <NumberInput
                              label={`${aName} (%)`}
                              value={bg.personA.drawRatePct}
                              onChange={v => updatePerson('personA', { drawRatePct: v })}
                              min={0} max={20} step={0.25} decimals={2} size="sm"
                            />
                            <NumberInput
                              label={`${bName} (%)`}
                              value={bg.personB.drawRatePct}
                              onChange={v => updatePerson('personB', { drawRatePct: v })}
                              min={0} max={20} step={0.25} decimals={2} size="sm"
                            />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Per-person account order */}
                <div className="rounded border border-slate-200">
                  <div className="bg-slate-50 border-b border-slate-200 px-3 py-2">
                    <span className="text-sm font-medium text-slate-700">Account Draw Order</span>
                  </div>
                  <div className="bg-white px-3 py-3">
                    <div className="flex gap-20">
                      <BengenAccountOrderInput
                        items={bg.personA.accountOrder ?? DEFAULT_BENGEN_ACCOUNT_ORDER}
                        onChange={items => updatePerson('personA', { accountOrder: items })}
                        personName={aName}
                      />
                      <BengenAccountOrderInput
                        items={bg.personB.accountOrder ?? DEFAULT_BENGEN_ACCOUNT_ORDER}
                        onChange={items => updatePerson('personB', { accountOrder: items })}
                        personName={bName}
                      />
                    </div>
                  </div>
                </div>

              </div>
            )
          })()}

          {/* Guyton-Klinger config */}
          {whatIfs.drawdownStrategy.value.strategyType === 'gk' && (() => {
            const gk = whatIfs.drawdownStrategy.value.gkConfig ?? DEFAULT_GK_CONFIG
            const updateGk = (patch: Partial<typeof gk>) =>
              updateWhatIf('drawdownStrategy', {
                value: { ...whatIfs.drawdownStrategy.value, gkConfig: { ...gk, ...patch } },
              })
            const updatePerson = (person: 'personA' | 'personB', patch: Partial<GKPersonConfig>) =>
              updateGk({ [person]: { ...gk[person], ...patch } })

            return (
              <div className="space-y-3 pt-1">
                {/* Parameters */}
                <div className="overflow-x-auto rounded border border-slate-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th colSpan={2} className="px-3 py-2 text-left font-medium text-slate-700">Parameters</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr className="hover:bg-slate-50/50">
                        <td className="px-3 py-2 text-slate-600 w-52">Index by CPI</td>
                        <td className="px-2 py-1.5">
                          <ToggleInput
                            label=""
                            value={gk.inflationIndex === 'cpi'}
                            onChange={v => updateGk({ inflationIndex: v ? 'cpi' : 'personal' })}
                          />
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="px-3 py-2 text-slate-600">Route surplus to HISA</td>
                        <td className="px-2 py-1.5">
                          <ToggleInput
                            label=""
                            value={gk.surplusToHisa ?? true}
                            onChange={v => updateGk({ surplusToHisa: v })}
                          />
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="px-3 py-2 text-slate-600">Cover deficit from HISA</td>
                        <td className="px-2 py-1.5">
                          <ToggleInput
                            label=""
                            value={gk.deficitFromHisa ?? false}
                            onChange={v => updateGk({ deficitFromHisa: v })}
                          />
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="px-3 py-2 text-slate-600">Apply 15-year rule</td>
                        <td className="px-2 py-1.5">
                          <ToggleInput
                            label=""
                            value={gk.apply15YearRule ?? true}
                            onChange={v => updateGk({ apply15YearRule: v })}
                          />
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="px-3 py-2 text-slate-600">Year-1 Draw Rate</td>
                        <td className="px-2 py-1.5">
                          <div className="flex gap-6">
                            <NumberInput
                              label={`${aName} (%)`}
                              value={gk.personA.drawRatePct}
                              onChange={v => updatePerson('personA', { drawRatePct: v })}
                              min={0} max={20} step={0.25} decimals={2} size="sm"
                            />
                            <NumberInput
                              label={`${bName} (%)`}
                              value={gk.personB.drawRatePct}
                              onChange={v => updatePerson('personB', { drawRatePct: v })}
                              min={0} max={20} step={0.25} decimals={2} size="sm"
                            />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Guardrail settings */}
                <div className="overflow-x-auto rounded border border-slate-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th colSpan={2} className="px-3 py-2 text-left font-medium text-slate-700">Guardrail Settings</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr className="hover:bg-slate-50/50">
                        <td className="px-3 py-2 text-slate-600 w-52">Lower guardrail (%)</td>
                        <td className="px-2 py-1.5">
                          <NumberInput
                            label=""
                            value={gk.lowerGuardrailPct}
                            onChange={v => updateGk({ lowerGuardrailPct: v })}
                            min={0} max={100} step={5} decimals={0} size="sm"
                          />
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="px-3 py-2 text-slate-600">Upper guardrail (%)</td>
                        <td className="px-2 py-1.5">
                          <NumberInput
                            label=""
                            value={gk.upperGuardrailPct}
                            onChange={v => updateGk({ upperGuardrailPct: v })}
                            min={0} max={100} step={5} decimals={0} size="sm"
                          />
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="px-3 py-2 text-slate-600">Cut percentage (%)</td>
                        <td className="px-2 py-1.5">
                          <NumberInput
                            label=""
                            value={gk.cutPct}
                            onChange={v => updateGk({ cutPct: v })}
                            min={0} max={50} step={1} decimals={0} size="sm"
                          />
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="px-3 py-2 text-slate-600">Raise percentage (%)</td>
                        <td className="px-2 py-1.5">
                          <NumberInput
                            label=""
                            value={gk.raisePct}
                            onChange={v => updateGk({ raisePct: v })}
                            min={0} max={50} step={1} decimals={0} size="sm"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Per-person account order */}
                <div className="rounded border border-slate-200">
                  <div className="bg-slate-50 border-b border-slate-200 px-3 py-2">
                    <span className="text-sm font-medium text-slate-700">Account Draw Order</span>
                  </div>
                  <div className="bg-white px-3 py-3">
                    <div className="flex gap-20">
                      <BengenAccountOrderInput
                        items={gk.personA.accountOrder ?? DEFAULT_BENGEN_ACCOUNT_ORDER}
                        onChange={items => updatePerson('personA', { accountOrder: items })}
                        personName={aName}
                      />
                      <BengenAccountOrderInput
                        items={gk.personB.accountOrder ?? DEFAULT_BENGEN_ACCOUNT_ORDER}
                        onChange={items => updatePerson('personB', { accountOrder: items })}
                        personName={bName}
                      />
                    </div>
                  </div>
                </div>

              </div>
            )
          })()}

          {/* Fixed Withdrawals config */}
          {whatIfs.drawdownStrategy.value.strategyType === 'fixedWithdrawal' && (
            <div className="space-y-2 pt-1">
              <div className="space-y-2">
                {([
                  ['RRSP / RRIF', 'rrspAmountA',   'rrspAmountB'  ],
                  ['TFSA',        'tfsaAmountA',   'tfsaAmountB'  ],
                  ['Non-Reg',     'nonRegAmountA', 'nonRegAmountB'],
                ] as const).map(([label, keyA, keyB]) => (
                  <div key={label} className="flex items-end gap-8 p-3 border border-slate-200 rounded bg-slate-50">
                    <span className="text-sm text-slate-600 w-24 shrink-0 pb-[3px]">{label}</span>
                    <div className="flex gap-6">
                      <NumberInput label={aName}
                        value={whatIfs.drawdownStrategy.value.fixedWithdrawal[keyA]}
                        onChange={v => updateWhatIf('drawdownStrategy', {
                          value: { ...whatIfs.drawdownStrategy.value, fixedWithdrawal: { ...whatIfs.drawdownStrategy.value.fixedWithdrawal, [keyA]: v } },
                        })}
                        prefix="$" min={0} max={500_000} step={1000} decimals={0} size="sm" />
                      <NumberInput label={bName}
                        value={whatIfs.drawdownStrategy.value.fixedWithdrawal[keyB]}
                        onChange={v => updateWhatIf('drawdownStrategy', {
                          value: { ...whatIfs.drawdownStrategy.value, fixedWithdrawal: { ...whatIfs.drawdownStrategy.value.fixedWithdrawal, [keyB]: v } },
                        })}
                        prefix="$" min={0} max={500_000} step={1000} decimals={0} size="sm" />
                    </div>
                  </div>
                ))}
                <div className="flex items-end gap-8 p-3 border border-slate-200 rounded bg-slate-50">
                  <span className="text-sm text-slate-600 w-24 shrink-0 pb-[3px]">HISA <span className="text-xs text-slate-400">(joint)</span></span>
                  <NumberInput label="Annual Draw"
                    value={whatIfs.drawdownStrategy.value.fixedWithdrawal.hisaAmount}
                    onChange={v => updateWhatIf('drawdownStrategy', {
                      value: { ...whatIfs.drawdownStrategy.value, fixedWithdrawal: { ...whatIfs.drawdownStrategy.value.fixedWithdrawal, hisaAmount: v } },
                    })}
                    prefix="$" min={0} max={500_000} step={1000} decimals={0} size="sm" />
                </div>
              </div>
            </div>
          )}

          {/* Fixed Percentage config */}
          {whatIfs.drawdownStrategy.value.strategyType === 'fixedPct' && (
            <div className="space-y-2 pt-1">
              {([
                ['RRSP / RRIF', 'rrspPct',   'rrspMin'   ],
                ['TFSA',        'tfsaPct',   'tfsaMin'   ],
                ['Non-Reg',     'nonRegPct', 'nonRegMin' ],
                ['HISA',        'hisaPct',   'hisaMin'   ],
              ] as const).map(([label, pctKey, minKey]) => (
                <div key={label} className="flex items-end gap-8 p-3 border border-slate-200 rounded bg-slate-50">
                  <span className="text-sm text-slate-600 w-24 shrink-0 pb-[3px]">{label}</span>
                  <div className="flex gap-6">
                    <NumberInput label="Rate (%)"
                      value={whatIfs.drawdownStrategy.value.fixedPct[pctKey]}
                      onChange={v => updateWhatIf('drawdownStrategy', {
                        value: { ...whatIfs.drawdownStrategy.value, fixedPct: { ...whatIfs.drawdownStrategy.value.fixedPct, [pctKey]: v } },
                      })}
                      min={0} max={100} step={0.5} decimals={1} size="sm" />
                    <NumberInput label="Floor ($)"
                      value={whatIfs.drawdownStrategy.value.fixedPct[minKey]}
                      onChange={v => updateWhatIf('drawdownStrategy', {
                        value: { ...whatIfs.drawdownStrategy.value, fixedPct: { ...whatIfs.drawdownStrategy.value.fixedPct, [minKey]: v } },
                      })}
                      min={0} max={500_000} step={1000} decimals={0} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SectionCard>

      {/* ── Base Plan Modifications Card ──────────────────────────────────── */}
      <SectionCard title="Base Plan Modifications" width="full" onReset={resetWhatIfsExceptDrawdown} info={<>
        <p className="mb-3">Each modification overrides a specific part of the base plan. Modifications stack — all enabled toggles apply simultaneously. The Reset button clears all modifications except the Drawdown Strategy.</p>

        <p className="font-semibold text-slate-700 mb-1">Market — Return Profile</p>
        <p className="mb-1">Shapes how nominal portfolio returns vary year-to-year. For all profiles except Flat and Market Shock, peak and low are the max and min of your base plan age-tier rates; mid is their time-weighted average (so expected average return is preserved across profiles).</p>
        <ul className="space-y-1 mb-2 ml-2 text-slate-600">
          <li><span className="font-medium text-slate-700">Base</span> — Age-based tiers exactly as entered (default).</li>
          <li><span className="font-medium text-slate-700">Flat Rate</span> — A single fixed return every year. Bypasses beta and outlook.</li>
          <li><span className="font-medium text-slate-700">Front-Loaded</span> — Returns start at peak and fall linearly to low over the plan horizon.</li>
          <li><span className="font-medium text-slate-700">Back-Loaded</span> — Returns start at low and rise linearly to peak.</li>
          <li><span className="font-medium text-slate-700">Cyclical Crest</span> — Phase-distorted cosine starting at peak. Good returns dominate; use to stress-test a "mostly bull" sequence.</li>
          <li><span className="font-medium text-slate-700">Cyclical Trough</span> — Inverted cosine starting at trough. Stress-tests a down-cycle early in retirement (sequence-of-returns risk).</li>
          <li><span className="font-medium text-slate-700">Market Shock</span> — Flat rate baseline with a one-time crash modelled as a damped oscillator. Bypasses beta and outlook.</li>
          <li><span className="font-medium text-slate-700">Noise</span> — Seeded uniform random between low and peak each year. Re-roll generates a new sequence.</li>
        </ul>
        <p className="mb-1"><span className="font-medium text-slate-700">Outlook</span> — Shifts the entire return curve ±pp (applied after beta). Not used by Flat or Market Shock.</p>
        <p className="mb-2"><span className="font-medium text-slate-700">Beta</span> — Scales amplitude around mid. β=1: unchanged. β=2: double swing (same average, wider range). β=0: flat line at mid. Not used by Flat or Market Shock.</p>
        <p className="font-semibold text-slate-700 mb-1">Cyclical controls</p>
        <p className="mb-1"><span className="font-medium text-slate-700">Cycle Period</span> — Length of one full cycle in years.</p>
        <p className="mb-2"><span className="font-medium text-slate-700">Duty Cycle</span> — Fraction of each period spent above the midpoint return. 50% is a symmetric sine wave. Higher values (e.g. 70%) compress the trough into a narrow dip; lower values compress the crest. Approaches a square wave at the extremes.</p>
        <p className="font-semibold text-slate-700 mb-1">Market Shock controls</p>
        <p className="mb-1"><span className="font-medium text-slate-700">Flat Rate</span> — The long-run baseline return the portfolio gravitates back toward after the crash.</p>
        <p className="mb-1"><span className="font-medium text-slate-700">Shock Year</span> — Years from the start of the projection when the crash hits. Year 0 is the first year of the plan.</p>
        <p className="mb-1"><span className="font-medium text-slate-700">Magnitude</span> — Peak crash depth in percentage points added to the flat rate in the shock year (e.g. −30% on a 6% baseline yields −24% that year).</p>
        <p className="mb-1"><span className="font-medium text-slate-700">Recovery</span> — Years until the shock has decayed to ~5% of its original magnitude.</p>
        <p className="mb-3"><span className="font-medium text-slate-700">Damping</span> — Controls the recovery character. Fully damped: pure exponential decay, returns stay below the flat rate throughout. Lightly damped: returns oscillate above and below the flat rate before settling (market overreaction and correction).</p>

        <p className="font-semibold text-slate-700 mb-1">Inflation</p>
        <p className="mb-3">Overrides either or both inflation rates. <span className="font-medium text-slate-700">Personal inflation</span> deflates all outputs to present-day dollars and grows your spending phases. <span className="font-medium text-slate-700">CPI</span> indexes government benefits (CPP, OAS, GIS), DB pension escalation, and tax bracket thresholds forward each year.</p>

        <p className="font-semibold text-slate-700 mb-1">Retirement</p>
        <p className="mb-3">Shifts each person's retirement date. The slider adjusts the retirement age; employment income and RRSP contributions stop at the new date, and the DB pension start (if not locked) shifts accordingly.</p>

        <p className="font-semibold text-slate-700 mb-1">Longevity</p>
        <p className="mb-3">Adjusts each person's planning end age (the age through which the projection runs). The engine assumes the person is alive through the entire final year. Use this to explore longevity risk — extending the plan horizon tests whether the portfolio survives a longer-than-expected life.</p>

        <p className="font-semibold text-slate-700 mb-1">Government Benefits</p>
        <p className="mb-3">Adjusts CPP and OAS collection start ages for each person. CPP adjusts ±0.6%/month before age 65 and +0.7%/month after (max +42% at 70). OAS adjusts +0.6%/month deferred past 65 (max +36% at 70).</p>

        <p className="font-semibold text-slate-700 mb-1">Withdrawal Strategy</p>
        <p className="mb-3">Overrides the drawdown strategy used to meet the spending gap. Options include Cover Spending Gap (draw exactly what's needed), Fixed Withdrawal, Fixed Percentage, Bengen Rule (inflation-adjusted % of initial portfolio), and Guyton-Klinger (guardrail-adjusted draws). This modification is preserved when you hit Reset.</p>

        <p className="font-semibold text-slate-700 mb-1">One Shot Events</p>
        <ul className="space-y-1 mb-3 ml-2 text-slate-600">
          <li><span className="font-medium text-slate-700">Layoff</span> — Terminates employment for either person on the specified date, stopping employment income and RRSP contributions. An optional severance lump sum is added as taxable other income in that calendar year.</li>
          <li><span className="font-medium text-slate-700">Unexpected Expense</span> — A one-time household spending hit in the calendar year of the specified date. Draws from the portfolio as needed to cover it.</li>
          <li><span className="font-medium text-slate-700">Lifestyle Change</span> — A permanent recurring offset to lifestyle spending starting from the specified date. Positive values increase annual spending; negative values reduce it. Spending is floored at zero — it cannot go negative.</li>
          <li><span className="font-medium text-slate-700">Home Sale / Downsizing</span> — A one-time injection of net sale proceeds into a specific account in the calendar year of the specified date. The principal residence exemption means no tax is triggered by the sale itself. Enter the net amount after new housing costs, agent fees, and land transfer taxes. Proceeds deposited to a non-registered account increase both the balance and the adjusted cost base, so no embedded capital gain is created on entry.</li>
        </ul>

        <p className="font-semibold text-slate-700 mb-1">Manual Pension Splitting</p>
        <p className="mb-1">When <strong>off</strong>, the engine auto-optimizes pension splitting each year — testing every integer from 0–50% and picking the split that minimizes combined household tax. This is the default.</p>
        <p>When <strong>on</strong>, the split is fixed at the entered percentage for every eligible year. The percentage is the share of {aName || 'Person A'}'s eligible pension income transferred to {bName || 'Person B'} for tax purposes (CRA maximum: 50%). Eligible income includes DB pension and RRIF withdrawals once {aName || 'Person A'} is 65 or older.</p>
      </>}>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="space-y-3">

            <WhatIfSection title="Market">
              {/* ── Rate profile shape preview + controls ─────────────────── */}
              {(() => {
                const mEnabled = whatIfs.marketProfile?.enabled ?? false
                const mValue   = whatIfs.marketProfile?.value ?? DEFAULT_MARKET_PROFILE
                const setMarketProfile = (partial: Partial<typeof mValue>) =>
                  updateWhatIf('marketProfile', { value: { ...mValue, ...partial } })
                const isCyclical = mValue.profileType === 'cyclicalCrest' || mValue.profileType === 'cyclicalTrough'
                const isShock    = mValue.profileType === 'marketShock'
                return (
                  <div>
                    {/* Shape preview chart + stats — always visible */}
                    <div className="flex items-stretch px-3 pt-2.5 pb-0.5 gap-2">
                      <div className="flex-1 min-w-0">
                        <PlotlyChart
                          data={marketChartSeries}
                          layout={MARKET_CHART_LAYOUT}
                          style={{ height: '72px' }}
                        />
                      </div>
                      <div className="flex flex-col justify-around text-right py-1 shrink-0">
                        {([['High', marketStats.high], ['Avg', marketStats.avg], ['Low', marketStats.low]] as [string, number][]).map(([lbl, val]) => (
                          <div key={lbl}>
                            <div className="text-[9px] text-slate-400 leading-none uppercase tracking-wide">{lbl}</div>
                            <div className="text-xs font-semibold leading-tight" style={{ color: '#7B1515' }}>{val.toFixed(1)}%</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Profile selector + enable toggle */}
                    <div className="flex items-center gap-3 px-3 py-2.5 border-t border-slate-100">
                      <input
                        type="checkbox"
                        checked={mEnabled}
                        onChange={e => updateWhatIf('marketProfile', { enabled: e.target.checked })}
                        className="w-4 h-4 rounded shrink-0 cursor-pointer"
                        style={{ accentColor: '#7B1515' }}
                      />
                      <span className={`text-sm w-52 shrink-0 ${mEnabled ? 'font-medium text-slate-800' : 'text-slate-600'}`}>
                        Return Profile
                      </span>
                      {mEnabled ? (
                        <SelectInput
                          label=""
                          value={mValue.profileType}
                          onChange={v => setMarketProfile({ profileType: v as MarketProfileType })}
                          options={MARKET_PROFILE_OPTIONS}
                        />
                      ) : null}
                    </div>

                    {/* Sub-controls — only when enabled */}
                    {mEnabled && (
                      <div className="border-t border-slate-100">
                        {/* Flat rate row — shown for flat and marketShock profiles */}
                        {(mValue.profileType === 'flat' || isShock) && (
                          <div className="flex items-center gap-3 px-3 py-2.5 border-b border-slate-100">
                            <span className="text-sm text-slate-600 w-24 shrink-0">Flat Rate (%)</span>
                            <NumberInput
                              label=""
                              value={mValue.flatRate}
                              onChange={v => setMarketProfile({ flatRate: v })}
                              min={0} max={30} step={0.25} decimals={2}
                              size="sm"
                            />
                            <button className="btn-primary"
                              onClick={() => setMarketProfile({ flatRate: whatIfs.inflationRate.enabled ? whatIfs.inflationRate.value : personalInflationRatePct })}>
                              Use Inflation
                            </button>
                            <button className="btn-primary"
                              onClick={() => setMarketProfile({ flatRate: whatIfs.cpiRate?.enabled ? whatIfs.cpiRate.value : cpiRatePct })}>
                              Use CPI
                            </button>
                          </div>
                        )}
                        {/* Outlook + Beta — shown for all profiles except flat and marketShock */}
                        {mValue.profileType !== 'flat' && !isShock && (
                          <>
                            <WhatIfSlider
                              label="Outlook"
                              min={-10} max={10} step={0.5} baseValue={0}
                              value={mValue.outlookOffset}
                              enabled={mValue.outlookOffset !== 0}
                              onChange={v => setMarketProfile({ outlookOffset: v })}
                              valueSuffix="%"
                            />
                            <WhatIfSlider
                              label="Beta"
                              min={0.1} max={10} step={0.1} baseValue={1}
                              value={mValue.beta}
                              enabled={mValue.beta !== 1}
                              onChange={v => setMarketProfile({ beta: v })}
                              valueSuffix="x"
                            />
                          </>
                        )}
                        {/* Cyclical-only sliders */}
                        {isCyclical && (
                          <WhatIfSlider
                            label="Cycle Period"
                            min={1} max={20} step={1} baseValue={10}
                            value={mValue.cyclePeriodYears}
                            enabled={mValue.cyclePeriodYears !== 10}
                            onChange={v => setMarketProfile({ cyclePeriodYears: v })}
                            valueSuffix="yr"
                          />
                        )}
                        {isCyclical && (
                          <WhatIfSlider
                            label="Duty Cycle"
                            min={5} max={95} step={5} baseValue={50}
                            value={Math.round(mValue.dutyCycle * 100)}
                            enabled={mValue.dutyCycle !== 0.5}
                            onChange={v => setMarketProfile({ dutyCycle: v / 100 })}
                            valueSuffix="%"
                          />
                        )}
                        {/* Market Shock sliders */}
                        {isShock && (
                          <WhatIfSlider
                            label="Shock Year"
                            min={0} max={40} step={1} baseValue={5}
                            value={mValue.shockOffset}
                            enabled={mValue.shockOffset !== 5}
                            onChange={v => setMarketProfile({ shockOffset: v })}
                            valueSuffix="yr"
                          />
                        )}
                        {isShock && (
                          <WhatIfSlider
                            label="Magnitude"
                            min={-50} max={0} step={1} baseValue={-20}
                            value={mValue.shockMagnitude}
                            enabled={mValue.shockMagnitude !== -20}
                            onChange={v => setMarketProfile({ shockMagnitude: v })}
                            valueSuffix="%"
                          />
                        )}
                        {isShock && (
                          <WhatIfSlider
                            label="Recovery"
                            min={1} max={30} step={1} baseValue={10}
                            value={mValue.shockRecovery}
                            enabled={mValue.shockRecovery !== 10}
                            onChange={v => setMarketProfile({ shockRecovery: v })}
                            valueSuffix="yr"
                          />
                        )}
                        {isShock && (
                          <WhatIfSlider
                            label="Damping"
                            min={0} max={20} step={1} baseValue={14}
                            value={Math.round(mValue.shockDamping * 20)}
                            enabled={mValue.shockDamping !== 0.7}
                            onChange={v => setMarketProfile({ shockDamping: v / 20 })}
                            labelRight={<span className="text-xs text-slate-400">{mValue.shockDamping <= 0.3 ? 'ringing' : mValue.shockDamping >= 0.8 ? 'overdamped' : 'mixed'}</span>}
                          />
                        )}
                        {/* Noise re-roll */}
                        {mValue.profileType === 'noise' && (
                          <div className="px-3 py-2 border-t border-slate-100">
                            <button
                              className="btn-primary"
                              onClick={() => setMarketProfile({ noiseSeed: Math.floor(Math.random() * 99999) })}
                            >
                              Re-roll
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })()}
            </WhatIfSection>

            <WhatIfSection title="Inflation">
              <WhatIfSlider
                label="Personal Inflation"
                min={0} max={10} step={0.25} baseValue={personalInflationRatePct}
                value={whatIfs.inflationRate.enabled ? whatIfs.inflationRate.value : personalInflationRatePct}
                enabled={whatIfs.inflationRate.enabled}
                onChange={(v, active) => updateWhatIf('inflationRate', { enabled: active, value: v })}
                valueSuffix="%"
              />
              <WhatIfSlider
                label="CPI Rate"
                min={0} max={10} step={0.25} baseValue={cpiRatePct}
                value={whatIfs.cpiRate?.enabled ? whatIfs.cpiRate.value : cpiRatePct}
                enabled={whatIfs.cpiRate?.enabled ?? false}
                onChange={(v, active) => updateWhatIf('cpiRate', { enabled: active, value: v })}
                valueSuffix="%"
              />
            </WhatIfSection>

            <WhatIfSection title="Retirement">
              {([
                { key: 'retirementA' as const, person: personA, currentAge: currentAgeA, dbEnabled: state.dbPensionA.enabled, name: aName, rrsp: state.rrspA, tfsa: state.tfsaA, nonReg: state.nonRegA },
                { key: 'retirementB' as const, person: personB, currentAge: currentAgeB, dbEnabled: state.dbPensionB.enabled, name: bName, rrsp: state.rrspB, tfsa: state.tfsaB, nonReg: state.nonRegB },
              ]).map(({ key, person, currentAge, dbEnabled, name, rrsp, tfsa, nonReg }) => {
                const wi    = whatIfs[key]
                const cfg   = wi?.value ?? { retirementAge: exactAgeAt(person.birthDate, person.retirementDate), cascadePension: true, cascadeRrsp: true, cascadeTfsa: true, cascadeNonReg: true } as RetirementWhatIfConfig
                const baseAge        = exactAgeAt(person.birthDate, person.retirementDate)
                const baseAgeRounded = Math.round(baseAge * 2) / 2
                const sliderMin = Math.max(Math.ceil(currentAge * 2) / 2, 0)
                const sliderMax = person.planningEndAge
                const sliderVal = wi?.enabled ? cfg.retirementAge : baseAgeRounded
                const setCfg = (partial: Partial<RetirementWhatIfConfig>) =>
                  updateWhatIf(key, { value: { ...cfg, ...partial } })
                // Display the effective retirement date for context
                const effectiveDate = dateAtDecimalAge(person.birthDate, sliderVal)
                const dateLbl = new Date(effectiveDate).toLocaleDateString('en-CA', { year: 'numeric', month: 'short' })
                return (
                  <div key={key} className="border-t border-slate-100 first:border-t-0">
                    <WhatIfSlider
                      label={`${name}'s Retirement Age`}
                      min={sliderMin} max={sliderMax} step={0.5} baseValue={baseAgeRounded}
                      value={sliderVal}
                      enabled={wi?.enabled ?? false}
                      onChange={(v, active) => updateWhatIf(key, { enabled: active, value: { ...cfg, retirementAge: v } })}
                      labelRight={
                        <span className="text-xs" style={{ color: (wi?.enabled ?? false) ? '#7B1515' : '#94a3b8' }}>
                          {dateLbl}
                        </span>
                      }
                    />
                    {(wi?.enabled) && (
                      <div className="px-3 pb-3 space-y-2">
                        <div className="flex items-center gap-4 flex-wrap">
                          <span className="text-xs font-medium text-slate-500 shrink-0">Cascade:</span>
                          <ToggleInput label="DB Pension" value={cfg.cascadePension} onChange={v => setCfg({ cascadePension: v })} />
                          <ToggleInput label="RRSP"       value={cfg.cascadeRrsp}    onChange={v => setCfg({ cascadeRrsp: v })} />
                          <ToggleInput label="TFSA"       value={cfg.cascadeTfsa}    onChange={v => setCfg({ cascadeTfsa: v })} />
                          <ToggleInput label="Non-Reg"    value={cfg.cascadeNonReg}  onChange={v => setCfg({ cascadeNonReg: v })} />
                        </div>
                        {cfg.cascadePension && dbEnabled && (
                          <InfoPanel>
                            The pension start date shifts to match the new retirement date, but the LTB, bridge amount, and bridge end date are <strong>not</strong> recalculated. In reality, a different retirement date changes your years of service and therefore your entitlement — update the pension tab with revised figures for an accurate projection.
                          </InfoPanel>
                        )}
                        {cfg.cascadePension && !dbEnabled && (
                          <InfoPanel>No DB pension is enabled for {name} — this toggle has no effect.</InfoPanel>
                        )}
                        {cfg.cascadeRrsp && rrsp.annualContribution === 0 && rrsp.spousalAnnualContribution === 0 && (
                          <InfoPanel>No RRSP contributions are defined for {name} — this toggle has no effect.</InfoPanel>
                        )}
                        {cfg.cascadeTfsa && tfsa.annualContribution === 0 && (
                          <InfoPanel>No TFSA contributions are defined for {name} — this toggle has no effect.</InfoPanel>
                        )}
                        {cfg.cascadeNonReg && nonReg.annualContribution === 0 && (
                          <InfoPanel>No non-registered contributions are defined for {name} — this toggle has no effect.</InfoPanel>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </WhatIfSection>

          </div>
          <div className="space-y-3">

            <WhatIfSection title="Longevity">
              <WhatIfSlider
                label={`${aName}'s Age at Death`}
                min={Math.floor(currentAgeA)} max={100}
                baseValue={personA.planningEndAge}
                value={whatIfs.longevityA.enabled ? whatIfs.longevityA.value : personA.planningEndAge}
                enabled={whatIfs.longevityA.enabled}
                onChange={(age, active) => updateWhatIf('longevityA', { enabled: active, value: age })}
              />
              <WhatIfSlider
                label={`${bName}'s Age at Death`}
                min={Math.floor(currentAgeB)} max={100}
                baseValue={personB.planningEndAge}
                value={whatIfs.longevityB.enabled ? whatIfs.longevityB.value : personB.planningEndAge}
                enabled={whatIfs.longevityB.enabled}
                onChange={(age, active) => updateWhatIf('longevityB', { enabled: active, value: age })}
              />
            </WhatIfSection>

            <WhatIfSection title="Government Benefits">
              <WhatIfSlider
                label={`CPP Start — ${aName}`}
                min={60} max={70}
                baseValue={cppBaseAgeA}
                value={whatIfs.cppStartAgeA.enabled ? whatIfs.cppStartAgeA.value : cppBaseAgeA}
                enabled={whatIfs.cppStartAgeA.enabled}
                onChange={(age, active) => updateWhatIf('cppStartAgeA', { enabled: active, value: age })}
              />
              <WhatIfSlider
                label={`CPP Start — ${bName}`}
                min={60} max={70}
                baseValue={cppBaseAgeB}
                value={whatIfs.cppStartAgeB.enabled ? whatIfs.cppStartAgeB.value : cppBaseAgeB}
                enabled={whatIfs.cppStartAgeB.enabled}
                onChange={(age, active) => updateWhatIf('cppStartAgeB', { enabled: active, value: age })}
              />
              <WhatIfSlider
                label={`OAS Start — ${aName}`}
                min={65} max={70}
                baseValue={oasBaseAgeA}
                value={whatIfs.oasStartAgeA.enabled ? whatIfs.oasStartAgeA.value : oasBaseAgeA}
                enabled={whatIfs.oasStartAgeA.enabled}
                onChange={(age, active) => updateWhatIf('oasStartAgeA', { enabled: active, value: age })}
              />
              <WhatIfSlider
                label={`OAS Start — ${bName}`}
                min={65} max={70}
                baseValue={oasBaseAgeB}
                value={whatIfs.oasStartAgeB.enabled ? whatIfs.oasStartAgeB.value : oasBaseAgeB}
                enabled={whatIfs.oasStartAgeB.enabled}
                onChange={(age, active) => updateWhatIf('oasStartAgeB', { enabled: active, value: age })}
              />
            </WhatIfSection>

            <WhatIfSection title="One Shot Events">
              {([
                { key: 'layoffA' as const, name: aName, baseRetireDate: state.personA.retirementDate },
                { key: 'layoffB' as const, name: bName, baseRetireDate: state.personB.retirementDate },
              ]).map(({ key, name, baseRetireDate }) => {
                const wi       = whatIfs[key]
                const enabled  = wi?.enabled ?? false
                const date     = wi?.value?.date      ?? todayStr()
                const severance = wi?.value?.severance ?? 0
                const set = (partial: { date?: string; severance?: number }) =>
                  updateWhatIf(key, { enabled: true, value: { date, severance, ...partial } })
                return (
                  <div key={key}>
                    <div className="px-3 py-2.5 flex items-center gap-3">
                      <input type="checkbox" checked={enabled}
                        onChange={e => updateWhatIf(key, { enabled: e.target.checked, value: { date, severance } })}
                        className="w-4 h-4 rounded shrink-0 cursor-pointer" style={{ accentColor: '#7B1515' }} />
                      <span className={`text-sm w-52 shrink-0 ${enabled ? 'font-medium text-slate-800' : 'text-slate-600'}`}>
                        {name}'s Layoff
                      </span>
                      {enabled && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <DateInput label="Layoff Date" value={date} onChange={v => set({ date: v })} />
                          <NumberInput label="Severance ($)" value={severance} size="sm"
                            onChange={v => set({ severance: v })} />
                        </div>
                      )}
                    </div>
                    {enabled && date >= baseRetireDate && (
                      <div className="px-3 pb-2">
                        <InfoPanel>Layoff date is on or after {name}'s retirement date — employment would have already ended, this has no effect.</InfoPanel>
                      </div>
                    )}
                  </div>
                )
              })}
              {(() => {
                const wi      = whatIfs.unexpectedExpense
                const enabled = wi?.enabled ?? false
                const date    = wi?.value?.date   ?? todayStr()
                const amount  = wi?.value?.amount ?? 0
                const set = (partial: { date?: string; amount?: number }) =>
                  updateWhatIf('unexpectedExpense', { enabled: true, value: { date, amount, ...partial } })
                return (
                  <div>
                    <div className="px-3 py-2.5 flex items-center gap-3">
                      <input type="checkbox" checked={enabled}
                        onChange={e => updateWhatIf('unexpectedExpense', { enabled: e.target.checked, value: { date, amount } })}
                        className="w-4 h-4 rounded shrink-0 cursor-pointer" style={{ accentColor: '#7B1515' }} />
                      <span className={`text-sm w-52 shrink-0 ${enabled ? 'font-medium text-slate-800' : 'text-slate-600'}`}>
                        Unexpected Expense
                      </span>
                      {enabled && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <DateInput label="Date" value={date} onChange={v => set({ date: v })} />
                          <NumberInput label="Amount ($)" value={amount} size="sm"
                            onChange={v => set({ amount: v })} />
                        </div>
                      )}
                    </div>
                  </div>
                )
              })()}
              {(() => {
                const wi      = whatIfs.lifestyleChange
                const enabled = wi?.enabled ?? false
                const date    = wi?.value?.date   ?? todayStr()
                const amount  = wi?.value?.amount ?? 0
                const set = (partial: { date?: string; amount?: number }) =>
                  updateWhatIf('lifestyleChange', { enabled: true, value: { date, amount, ...partial } })
                return (
                  <div>
                    <div className="px-3 py-2.5 flex items-center gap-3">
                      <input type="checkbox" checked={enabled}
                        onChange={e => updateWhatIf('lifestyleChange', { enabled: e.target.checked, value: { date, amount } })}
                        className="w-4 h-4 rounded shrink-0 cursor-pointer" style={{ accentColor: '#7B1515' }} />
                      <span className={`text-sm w-52 shrink-0 ${enabled ? 'font-medium text-slate-800' : 'text-slate-600'}`}>
                        Lifestyle Change
                      </span>
                      {enabled ? (
                        <div className="flex items-center gap-2 flex-wrap">
                          <DateInput label="Start Date" value={date} onChange={v => set({ date: v })} />
                          <NumberInput label="Annual Amount ($)" value={amount} size="sm"
                            onChange={v => set({ amount: v })} />
                        </div>
                      ) : null}
                    </div>
                  </div>
                )
              })()}
              {(() => {
                const wi      = whatIfs.homeSale
                const enabled = wi?.enabled ?? false
                const date    = wi?.value?.date    ?? todayStr()
                const amount  = wi?.value?.amount  ?? 0
                const account = wi?.value?.account ?? 'hisa'
                const set = (partial: { date?: string; amount?: number; account?: 'hisa' | 'nonRegA' | 'nonRegB' }) =>
                  updateWhatIf('homeSale', { enabled: true, value: { date, amount, account, ...partial } })
                const accountOptions = [
                  { value: 'hisa',    label: 'HISA' },
                  { value: 'nonRegA', label: `${aName} Non-Reg` },
                  { value: 'nonRegB', label: `${bName} Non-Reg` },
                ]
                return (
                  <div>
                    <div className="px-3 py-2.5 flex items-center gap-3">
                      <input type="checkbox" checked={enabled}
                        onChange={e => updateWhatIf('homeSale', { enabled: e.target.checked, value: { date, amount, account } })}
                        className="w-4 h-4 rounded shrink-0 cursor-pointer" style={{ accentColor: '#7B1515' }} />
                      <span className={`text-sm w-52 shrink-0 ${enabled ? 'font-medium text-slate-800' : 'text-slate-600'}`}>
                        Home Sale / Downsizing
                      </span>
                      {enabled ? (
                        <div className="flex items-center gap-2 flex-wrap">
                          <DateInput label="Sale Date" value={date} onChange={v => set({ date: v })} />
                          <NumberInput label="Net Proceeds ($)" value={amount} size="sm"
                            onChange={v => set({ amount: v })} />
                          <SelectInput label="Deposit To" value={account}
                            onChange={v => set({ account: v as 'hisa' | 'nonRegA' | 'nonRegB' })}
                            options={accountOptions} />
                        </div>
                      ) : null}
                    </div>
                  </div>
                )
              })()}
            </WhatIfSection>

          </div>
        </div>
      </SectionCard>

      {/* ── Key Outcomes ──────────────────────────────────────────────────── */}
      <SectionDivider title="Outcomes" />
      <SectionCard title="Key Outcomes" width="full"
        info={
          <div className="space-y-2 text-sm">
            <p>Key Outcomes summarizes the most important results across four groups: Portfolio, Spending, Tax, and Government Benefits. All values are in present-day dollars. Click any tile to open a year-by-year detail table.</p>
            <p><strong>Freeze</strong> — Captures the current values as a comparison baseline. Once frozen, each tile shows the current value alongside the frozen value with a coloured arrow (green = better, red = worse). Freeze a scenario, then adjust or load another — deltas update live on every tile.</p>
            <p><strong>Portfolio</strong> — Total invested assets (RRSP/RRIF + TFSA + Non-Reg + HISA) at key milestones: today, each person's retirement, the peak balance, and each person's death. A high peak followed by rapid decline can signal sequence-of-returns risk.</p>
            <p><strong>Spending</strong> — Two shortfall tiles count years where cash flow is negative (spending exceeds all income and draws) and show the average and peak shortfall. Three net income tiles show average, minimum, and maximum household net income across all full plan years (first and last years excluded as partial). Zero shortfall years is the primary plan goal.</p>
            <p><strong>Tax</strong> — Total lifetime tax paid (federal + Ontario + OAS clawback), the average effective rate (total tax ÷ gross income across the plan), and the single peak tax year. Use these to evaluate drawdown strategy tradeoffs — earlier RRSP draws typically raise near-term taxes while reducing OAS clawback and estate tax later.</p>
            <p><strong>Government Benefits</strong> — Total CPP and OAS collected (gross, before clawback) and years with OAS clawback. The vs-Age-65 tiles show the net lifetime difference between your chosen CPP/OAS start ages and collecting at exactly 65, accounting for the full projection horizon and survivor benefits.</p>
          </div>
        }>
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
                    { header: `Age — ${aName}`, right: true, render: d => d.personAAge.toFixed(1) },
                    { header: `RRSP — ${aName}`, right: true, render: d => fmt(d.rrspA) },
                    { header: `RRSP — ${bName}`, right: true, render: d => fmt(d.rrspB) },
                    { header: `TFSA — ${aName}`, right: true, render: d => fmt(d.tfsaA) },
                    { header: `TFSA — ${bName}`, right: true, render: d => fmt(d.tfsaB) },
                    { header: `NR — ${aName}`,   right: true, render: d => fmt(d.nonRegA) },
                    { header: `NR — ${bName}`,   right: true, render: d => fmt(d.nonRegB) },
                    { header: 'HISA',           right: true, render: d => fmt(d.hisa) },
                    { header: 'Total',          right: true, bold: true, render: d => fmt(d.totalPortfolio) },
                  ],
                  rows: dataPoints,
                  highlightRow: d => d.year === dataPoints[0].year,
                })} />
              <MetricCard label={`At ${aName}'s Retirement`}
                value={fmt(metrics.portfolioAtRetirementA)}
                sub={`in ${retirementYearA}`}
                frozen={frozenFor(metrics.portfolioAtRetirementA, frozenMetrics?.portfolioAtRetirementA, fmt)}
                onClick={() => setModalDef({
                  title: `Portfolio — Balance by Account (${aName}'s Retirement Highlighted)`,
                  note: "Today's dollars, end of year.",
                  columns: [
                    { header: 'Year',              render: d => d.year },
                    { header: `Age — ${aName}`, right: true, render: d => d.personAAge.toFixed(1) },
                    { header: `RRSP — ${aName}`, right: true, render: d => fmt(d.rrspA) },
                    { header: `RRSP — ${bName}`, right: true, render: d => fmt(d.rrspB) },
                    { header: `TFSA — ${aName}`, right: true, render: d => fmt(d.tfsaA) },
                    { header: `TFSA — ${bName}`, right: true, render: d => fmt(d.tfsaB) },
                    { header: `NR — ${aName}`,   right: true, render: d => fmt(d.nonRegA) },
                    { header: `NR — ${bName}`,   right: true, render: d => fmt(d.nonRegB) },
                    { header: 'HISA',           right: true, render: d => fmt(d.hisa) },
                    { header: 'Total',          right: true, bold: true, render: d => fmt(d.totalPortfolio) },
                  ],
                  rows: dataPoints,
                  highlightRow: d => d.year === retirementYearA,
                  summary: [{ label: `Portfolio at ${aName}'s Retirement (${retirementYearA})`, value: fmt(metrics.portfolioAtRetirementA) }],
                })} />
              <MetricCard label={`At ${bName}'s Retirement`}
                value={fmt(metrics.portfolioAtRetirementB)}
                sub={`in ${retirementYearB}`}
                frozen={frozenFor(metrics.portfolioAtRetirementB, frozenMetrics?.portfolioAtRetirementB, fmt)}
                onClick={() => setModalDef({
                  title: `Portfolio — Balance by Account (${bName}'s Retirement Highlighted)`,
                  note: "Today's dollars, end of year.",
                  columns: [
                    { header: 'Year',              render: d => d.year },
                    { header: `Age — ${aName}`, right: true, render: d => d.personAAge.toFixed(1) },
                    { header: `RRSP — ${aName}`, right: true, render: d => fmt(d.rrspA) },
                    { header: `RRSP — ${bName}`, right: true, render: d => fmt(d.rrspB) },
                    { header: `TFSA — ${aName}`, right: true, render: d => fmt(d.tfsaA) },
                    { header: `TFSA — ${bName}`, right: true, render: d => fmt(d.tfsaB) },
                    { header: `NR — ${aName}`,   right: true, render: d => fmt(d.nonRegA) },
                    { header: `NR — ${bName}`,   right: true, render: d => fmt(d.nonRegB) },
                    { header: 'HISA',           right: true, render: d => fmt(d.hisa) },
                    { header: 'Total',          right: true, bold: true, render: d => fmt(d.totalPortfolio) },
                  ],
                  rows: dataPoints,
                  highlightRow: d => d.year === retirementYearB,
                  summary: [{ label: `Portfolio at ${bName}'s Retirement (${retirementYearB})`, value: fmt(metrics.portfolioAtRetirementB) }],
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
                    { header: `Age — ${aName}`, right: true, render: d => d.personAAge.toFixed(1) },
                    { header: `RRSP — ${aName}`, right: true, render: d => fmt(d.rrspA) },
                    { header: `RRSP — ${bName}`, right: true, render: d => fmt(d.rrspB) },
                    { header: `TFSA — ${aName}`, right: true, render: d => fmt(d.tfsaA) },
                    { header: `TFSA — ${bName}`, right: true, render: d => fmt(d.tfsaB) },
                    { header: `NR — ${aName}`,   right: true, render: d => fmt(d.nonRegA) },
                    { header: `NR — ${bName}`,   right: true, render: d => fmt(d.nonRegB) },
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
                    { header: `Age — ${aName}`, right: true, render: d => d.personAAge.toFixed(1) },
                    { header: `RRSP — ${aName}`, right: true, render: d => fmt(d.rrspA) },
                    { header: `RRSP — ${bName}`, right: true, render: d => fmt(d.rrspB) },
                    { header: `TFSA — ${aName}`, right: true, render: d => fmt(d.tfsaA) },
                    { header: `TFSA — ${bName}`, right: true, render: d => fmt(d.tfsaB) },
                    { header: `NR — ${aName}`,   right: true, render: d => fmt(d.nonRegA) },
                    { header: `NR — ${bName}`,   right: true, render: d => fmt(d.nonRegB) },
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
                    { header: `Age — ${aName}`, right: true, render: d => d.personAAge.toFixed(1) },
                    { header: `RRSP — ${aName}`, right: true, render: d => fmt(d.rrspA) },
                    { header: `RRSP — ${bName}`, right: true, render: d => fmt(d.rrspB) },
                    { header: `TFSA — ${aName}`, right: true, render: d => fmt(d.tfsaA) },
                    { header: `TFSA — ${bName}`, right: true, render: d => fmt(d.tfsaB) },
                    { header: `NR — ${aName}`,   right: true, render: d => fmt(d.nonRegA) },
                    { header: `NR — ${bName}`,   right: true, render: d => fmt(d.nonRegB) },
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
                    { header: `Age — ${aName}`, right: true, render: d => d.personAAge.toFixed(1) },
                    { header: 'Net HH',        right: true, render: d => fmt(d.totalHouseholdNet) },
                    { header: 'Spending',      right: true, render: d => fmt(d.householdSpending) },
                    { header: 'Cash Flow',     right: true, bold: true, render: d => (
                      <span className={flowColor(d.cashFlow)}>{fmtFlow(d.cashFlow)}</span>
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
                    { header: `Age — ${aName}`, right: true, render: d => d.personAAge.toFixed(1) },
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
                    { header: `Age — ${aName}`, right: true, render: d => d.personAAge.toFixed(1) },
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
              <MetricCard label="Net Income — Average"
                value={fmt(metrics.avgNetIncome)}
                sub="full years only"
                frozen={frozenFor(metrics.avgNetIncome, frozenMetrics?.avgNetIncome, fmt)}
                onClick={() => setModalDef({
                  title: 'Net Income — All Full Years',
                  note: "Today's dollars. Total household net income (after tax, including all draws). First and last plan years excluded as partial years.",
                  columns: [
                    { header: 'Year',        render: d => d.year },
                    { header: `Age — ${aName}`, right: true, render: d => d.personAAge.toFixed(1) },
                    { header: 'Net Income',  right: true, bold: true, render: d => fmt(d.totalHouseholdNet) },
                    { header: 'Spending',    right: true, render: d => fmt(d.householdSpending) },
                    { header: 'Cash Flow',   right: true, render: d => (
                      <span className={d.cashFlow < 0 ? 'text-red-600' : 'text-green-700'}>{fmt(d.cashFlow)}</span>
                    )},
                  ],
                  rows: dataPoints.filter(d => d.year !== currentYear && d.year !== endYear),
                  summary: [
                    { label: 'Average Net Income', value: fmt(metrics.avgNetIncome) },
                    { label: 'Min', value: fmt(metrics.minNetIncome) + ` (${metrics.minNetIncomeYear})` },
                    { label: 'Max', value: fmt(metrics.maxNetIncome) + ` (${metrics.maxNetIncomeYear})` },
                  ],
                })} />
              <MetricCard label="Net Income — Min"
                value={fmt(metrics.minNetIncome)}
                sub={`in ${metrics.minNetIncomeYear}`}
                frozen={frozenFor(metrics.minNetIncome, frozenMetrics?.minNetIncome, fmt)}
                onClick={() => setModalDef({
                  title: 'Net Income — All Full Years',
                  note: "Today's dollars. Minimum net income year highlighted.",
                  columns: [
                    { header: 'Year',        render: d => d.year },
                    { header: `Age — ${aName}`, right: true, render: d => d.personAAge.toFixed(1) },
                    { header: 'Net Income',  right: true, bold: true, render: d => fmt(d.totalHouseholdNet) },
                    { header: 'Spending',    right: true, render: d => fmt(d.householdSpending) },
                    { header: 'Cash Flow',   right: true, render: d => (
                      <span className={d.cashFlow < 0 ? 'text-red-600' : 'text-green-700'}>{fmt(d.cashFlow)}</span>
                    )},
                  ],
                  rows: dataPoints.filter(d => d.year !== currentYear && d.year !== endYear),
                  highlightRow: d => d.year === metrics.minNetIncomeYear,
                  summary: [
                    { label: 'Min Net Income', value: fmt(metrics.minNetIncome) + ` (${metrics.minNetIncomeYear})` },
                  ],
                })} />
              <MetricCard label="Net Income — Max"
                value={fmt(metrics.maxNetIncome)}
                sub={`in ${metrics.maxNetIncomeYear}`}
                frozen={frozenFor(metrics.maxNetIncome, frozenMetrics?.maxNetIncome, fmt)}
                onClick={() => setModalDef({
                  title: 'Net Income — All Full Years',
                  note: "Today's dollars. Maximum net income year highlighted.",
                  columns: [
                    { header: 'Year',        render: d => d.year },
                    { header: `Age — ${aName}`, right: true, render: d => d.personAAge.toFixed(1) },
                    { header: 'Net Income',  right: true, bold: true, render: d => fmt(d.totalHouseholdNet) },
                    { header: 'Spending',    right: true, render: d => fmt(d.householdSpending) },
                    { header: 'Cash Flow',   right: true, render: d => (
                      <span className={d.cashFlow < 0 ? 'text-red-600' : 'text-green-700'}>{fmt(d.cashFlow)}</span>
                    )},
                  ],
                  rows: dataPoints.filter(d => d.year !== currentYear && d.year !== endYear),
                  highlightRow: d => d.year === metrics.maxNetIncomeYear,
                  summary: [
                    { label: 'Max Net Income', value: fmt(metrics.maxNetIncome) + ` (${metrics.maxNetIncomeYear})` },
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
                    { header: `Age — ${aName}`,  right: true, render: d => d.personAAge.toFixed(1) },
                    { header: `Taxable — ${aName}`,right: true, render: d => fmt(d.grossIncomeA) },
                    { header: `Taxable — ${bName}`,right: true, render: d => fmt(d.grossIncomeB) },
                    { header: `Tax — ${aName}`,      right: true, render: d => fmt(d.taxA) },
                    { header: `Tax — ${bName}`,      right: true, render: d => fmt(d.taxB) },
                    { header: `Clawback — ${aName}`, right: true, render: d => d.oasClawbackA > 0 ? <span className="text-red-600">{fmt(d.oasClawbackA)}</span> : '—' },
                    { header: `Clawback — ${bName}`, right: true, render: d => d.oasClawbackB > 0 ? <span className="text-red-600">{fmt(d.oasClawbackB)}</span> : '—' },
                    { header: 'Total Tax',           right: true, bold: true, render: d => fmt(d.taxA + d.taxB + d.oasClawbackA + d.oasClawbackB) },
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
                    { header: `Age — ${aName}`,  right: true, render: d => d.personAAge.toFixed(1) },
                    { header: `Taxable — ${aName}`,right: true, render: d => fmt(d.grossIncomeA) },
                    { header: `Taxable — ${bName}`,right: true, render: d => fmt(d.grossIncomeB) },
                    { header: `Tax — ${aName}`,  right: true, render: d => fmt(d.taxA) },
                    { header: `Eff Rate — ${aName}`, right: true, render: d => fmtPct(d.effectiveTaxRateA) },
                    { header: `Tax — ${bName}`,  right: true, render: d => fmt(d.taxB) },
                    { header: `Eff Rate — ${bName}`, right: true, render: d => fmtPct(d.effectiveTaxRateB) },
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
                    { header: `Age — ${aName}`,  right: true, render: d => d.personAAge.toFixed(1) },
                    { header: `Taxable — ${aName}`,right: true, render: d => fmt(d.grossIncomeA) },
                    { header: `Taxable — ${bName}`,right: true, render: d => fmt(d.grossIncomeB) },
                    { header: `Tax — ${aName}`,      right: true, render: d => fmt(d.taxA) },
                    { header: `Tax — ${bName}`,      right: true, render: d => fmt(d.taxB) },
                    { header: `Clawback — ${aName}`, right: true, render: d => d.oasClawbackA > 0 ? <span className="text-red-600">{fmt(d.oasClawbackA)}</span> : '—' },
                    { header: `Clawback — ${bName}`, right: true, render: d => d.oasClawbackB > 0 ? <span className="text-red-600">{fmt(d.oasClawbackB)}</span> : '—' },
                    { header: 'Total Tax',           right: true, bold: true, render: d => fmt(d.taxA + d.taxB + d.oasClawbackA + d.oasClawbackB) },
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
                    { header: `Age — ${aName}`,  right: true, render: d => d.personAAge.toFixed(1) },
                    { header: `Age — ${bName}`,  right: true, render: d => d.personBAge.toFixed(1) },
                    { header: `CPP — ${aName}`,  right: true, render: d => d.cppA > 0 ? fmt(d.cppA) : '—' },
                    { header: `CPP — ${bName}`,  right: true, render: d => d.cppB > 0 ? fmt(d.cppB) : '—' },
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
                    { header: `Age — ${aName}`,  right: true, render: d => d.personAAge.toFixed(1) },
                    { header: `Age — ${bName}`,  right: true, render: d => d.personBAge.toFixed(1) },
                    { header: `OAS — ${aName}`,  right: true, render: d => d.oasA > 0 ? fmt(d.oasA) : '—' },
                    { header: `OAS — ${bName}`,  right: true, render: d => d.oasB > 0 ? fmt(d.oasB) : '—' },
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
                  note: "Today's dollars. Clawback = 15% of income above threshold (~$95,323 in 2026, CPI-indexed). Rows with clawback highlighted.",
                  columns: [
                    { header: 'Year',              render: d => d.year },
                    { header: `Age — ${aName}`,  right: true, render: d => d.personAAge.toFixed(1) },
                    { header: `Age — ${bName}`,  right: true, render: d => d.personBAge.toFixed(1) },
                    { header: `Taxable — ${aName}`,right: true, render: d => fmt(d.grossIncomeA) },
                    { header: `Taxable — ${bName}`,right: true, render: d => fmt(d.grossIncomeB) },
                    { header: `OAS — ${aName}`,  right: true, render: d => d.oasA > 0 ? fmt(d.oasA) : '—' },
                    { header: `OAS — ${bName}`,  right: true, render: d => d.oasB > 0 ? fmt(d.oasB) : '—' },
                    { header: `Clawback — ${aName}`, right: true, render: d => d.oasClawbackA > 0
                      ? <span className="text-red-600">{fmt(d.oasClawbackA)}</span> : '—' },
                    { header: `Clawback — ${bName}`, right: true, render: d => d.oasClawbackB > 0
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
                value={fmtSigned(metrics.cppVs65)}
                frozen={frozenFor(metrics.cppVs65, frozenMetrics?.cppVs65, fmtSigned)}
                onClick={() => {
                  const bMap = buildCppBaselineMap()
                  const rows = dataPoints.filter(d => d.cppA + d.cppB > 0 || (bMap.get(d.year) ?? 0) > 0)
                  const totBase = Array.from(bMap.values()).reduce((s, v) => s + v, 0)
                  setModalDef({
                    title: 'CPP — Actual vs Age-65 Baseline',
                    note: "Today's dollars. Baseline = both collect CPP starting at their exact 65th birthday. Positive delta = your timing was better.",
                    columns: [
                      { header: 'Year',              render: d => d.year },
                      { header: `Age — ${aName}`,  right: true, render: d => d.personAAge.toFixed(1) },
                      { header: `Age — ${bName}`,  right: true, render: d => d.personBAge.toFixed(1) },
                      { header: `CPP — ${aName}`,  right: true, render: d => d.cppA > 0 ? fmt(d.cppA) : '—' },
                      { header: `CPP — ${bName}`,  right: true, render: d => d.cppB > 0 ? fmt(d.cppB) : '—' },
                      { header: 'Actual Total',  right: true, bold: true, render: d => fmt(d.cppA + d.cppB) },
                      { header: 'Baseline @65',  right: true, render: d => fmt(bMap.get(d.year) ?? 0) },
                      { header: 'Delta / Year',  right: true, render: d => {
                          const delta = d.cppA + d.cppB - (bMap.get(d.year) ?? 0)
                          return <span className={flowColor(delta)}>{fmtSigned(delta)}</span>
                        }},
                    ],
                    rows,
                    summary: [
                      { label: 'Actual Total',        value: fmt(metrics.totalCPPCollected) },
                      { label: 'Baseline Total @65',  value: fmt(totBase) },
                      { label: 'Net Timing Benefit',  value: fmtSigned(metrics.cppVs65) },
                    ],
                  })
                }} />
              <MetricCard label="OAS — vs Age 65 Start"
                betterWhenHigher={true}
                value={fmtSigned(metrics.oasVs65)}
                frozen={frozenFor(metrics.oasVs65, frozenMetrics?.oasVs65, fmtSigned)}
                onClick={() => {
                  const bMap = buildOasBaselineMap()
                  const rows = dataPoints.filter(d => d.oasA + d.oasB > 0 || (bMap.get(d.year) ?? 0) > 0)
                  const totBase = Array.from(bMap.values()).reduce((s, v) => s + v, 0)
                  setModalDef({
                    title: 'OAS — Actual vs Age-65 Baseline',
                    note: "Today's dollars. Gross OAS (before clawback). Baseline = both collect OAS starting at their exact 65th birthday.",
                    columns: [
                      { header: 'Year',              render: d => d.year },
                      { header: `Age — ${aName}`,  right: true, render: d => d.personAAge.toFixed(1) },
                      { header: `Age — ${bName}`,  right: true, render: d => d.personBAge.toFixed(1) },
                      { header: `OAS — ${aName}`,  right: true, render: d => d.oasA > 0 ? fmt(d.oasA) : '—' },
                      { header: `OAS — ${bName}`,  right: true, render: d => d.oasB > 0 ? fmt(d.oasB) : '—' },
                      { header: 'Actual Total',  right: true, bold: true, render: d => fmt(d.oasA + d.oasB) },
                      { header: 'Baseline @65',  right: true, render: d => fmt(bMap.get(d.year) ?? 0) },
                      { header: 'Delta / Year',  right: true, render: d => {
                          const delta = d.oasA + d.oasB - (bMap.get(d.year) ?? 0)
                          return <span className={flowColor(delta)}>{fmtSigned(delta)}</span>
                        }},
                    ],
                    rows,
                    summary: [
                      { label: 'Actual Total (Gross)', value: fmt(metrics.totalOASCollected) },
                      { label: 'Baseline Total @65',   value: fmt(totBase) },
                      { label: 'Net Timing Benefit',   value: fmtSigned(metrics.oasVs65) },
                    ],
                  })
                }} />
            </div>
          </div>

        </div>
      </SectionCard>



      {/* ── Charts ────────────────────────────────────────────────────────── */}
      <SectionCard title="Income" width="full"
        info={
          <div className="space-y-2 text-sm">
            <p>Annual income across the full projection, broken down by source and person. Use the filter bar to focus on specific sources or individuals.</p>
            <p><strong>Gross vs Net</strong> — Gross shows all income before tax, stacked by source. Net collapses each person to a single after-tax bar, so you can see what's actually available to spend. The gap between the two is the annual tax bill.</p>
            <p><strong>Person filter</strong> — Household stacks both people together. Selecting a person shows only their income streams, which is useful for understanding each individual's income mix and tax exposure separately.</p>
            <p><strong>Source chips</strong> — In gross mode, toggle individual income sources on or off to isolate specific streams. Use All/None for bulk selection. Sources: Employment (salary/wages while working), DB Pension (defined benefit base + bridge), CPP/OAS (government benefits — survivor amounts included after the first death), RRIF (draws from RRSP/RRIF accounts), TFSA (withdrawals — tax-free, included here for cash flow context), Non-Reg (withdrawals), and Other (rental, part-time, inheritance, etc.).</p>
            <p>Phase transitions are visible as step changes — employment stopping at retirement, CPP and OAS turning on at their configured start ages, RRIF draws beginning at conversion age, and survivor benefit adjustments after the first death year.</p>
          </div>
        }
        onReset={() => { setXAxisModeIncome('year'); setIncomeMode('gross'); setIncomePerson('both'); setEnabledSources(new Set(ALL_SOURCE_KEYS)) }}>
        {/* ── Income filter bar ───────────────────────────────────────── */}
        <div className="flex items-center gap-1.5 flex-wrap mb-3">

          {/* Person — first */}
          {([['both', 'Household'], ['A', aName], ['B', bName]] as [ChartPerson, string][]).map(([v, label]) => (
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

      <SectionCard title="Tax Paid" width="full"
        info={
          <div className="space-y-2 text-sm">
            <p>Annual combined income tax for each person. Each bar includes federal tax, Ontario provincial tax, and OAS clawback — all three are treated as a tax cost for cash flow purposes.</p>
            <p><strong>Person filter</strong> — Household stacks both people. Selecting an individual lets you see their tax trajectory in isolation, which is useful when evaluating pension splitting or a retirement timing change for one person only.</p>
            <p>Step changes in the tax bars are typically caused by: RRIF forced minimums starting (adds taxable income), CPP and OAS turning on (adds taxable income, may trigger clawback), pension income splitting starting or stopping, and RRSP meltdown draws. Large spikes in individual years are often the year of RRSP withdrawal or when both people's RRIF minimums are highest.</p>
            <p>Compare the shape of this chart against the Income chart — the gap between gross income and net income should match the Tax Paid bars. A high tax-to-income ratio in early retirement is often a signal that the drawdown strategy is creating unnecessarily large taxable withdrawals. Use the Drawdown Strategy to adjust withdrawal timing and sequencing to smooth the tax load.</p>
          </div>
        }
        onReset={() => { setXAxisModeTax('year'); setTaxPerson('both') }}>
        {/* ── Tax filter bar ──────────────────────────────────────────── */}
        <div className="flex items-center gap-1.5 flex-wrap mb-3">
          {([['both', 'Household'], ['A', aName], ['B', bName]] as [ChartPerson, string][]).map(([v, label]) => (
            <button key={v} onClick={() => setTaxPerson(v)}
              className={`px-2.5 py-1 rounded border text-sm transition-colors ${
                taxPerson === v ? 'text-white border-[#7B1515]' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
              }`}
              style={taxPerson === v ? { backgroundColor: '#7B1515' } : {}}
            >{label}</button>
          ))}
        </div>
        <PlotlyChart
          data={taxData}
          layout={{
            barmode: 'stack',
            yaxis: { title: { text: 'Tax Paid ($)', font: { size: 11 } }, tickformat: ',.0f' },
            xaxis: { ...xAxisTax },
          }}
          style={{ height: 320 }}
        />
        <XAxisSelector value={xAxisModeTax} onChange={setXAxisModeTax} aName={aName} bName={bName} />
        <ChartLegend data={taxData} />
      </SectionCard>

      <SectionCard title="Spending Breakdown" width="full"
        onReset={() => setXAxisModeSpending('year')}
        info={
          <div className="space-y-2 text-sm">
            <p>Total household cash outflows per year, split into three categories. This chart treats all cash leaving the household symmetrically — whether going toward lifestyle or investment accounts.</p>
            <p><strong>Lifestyle</strong> — The active spending phase amount for each year, inflated forward, plus any additional spending items (recurring from their start age, or one-time in the applicable year). Phase transitions appear as step changes. This is the cost-of-living component.</p>
            <p><strong>Contributions</strong> — RRSP, TFSA, and non-registered deposits for both people. These are real cash outflows — money you're saving — but they leave your household account and enter an investment account. They count against available cash flow in the same way as spending. Contributions stop at each person's retirement date (or earlier if configured).</p>
            <p><strong>Unexpected Expense</strong> — The one-time expense from the Base Plan Modifications, if enabled. It appears as a single-year spike on top of the other bars.</p>
            <p>The total bar height in any year is what the Cash Flow chart uses as the spending side: <em>Cash Flow = Net Household Income − Total Spending here</em>. A high bar from contributions in pre-retirement years is normal and healthy — it means you're actively building the portfolio.</p>
          </div>
        }>
        <PlotlyChart
          data={spendingData}
          layout={{
            barmode: 'stack',
            yaxis: { title: { text: 'Spending ($)', font: { size: 11 } }, tickformat: ',.0f' },
            xaxis: { ...xAxisSpending },
          }}
          style={{ height: 320 }}
        />
        <XAxisSelector value={xAxisModeSpending} onChange={setXAxisModeSpending} aName={aName} bName={bName} />
        <ChartLegend data={spendingData} />
      </SectionCard>

      <SectionCard title="Annual Cash Flow" width="full"
        onReset={() => setXAxisModeCashFlow('year')}
        info={
          <div className="space-y-2 text-sm">
            <p>Net cash available after all income, withdrawals, and spending each year. This is the bottom line of the simulation: did money come in faster than it went out?</p>
            <p><strong>Green bars (surplus)</strong> — Income and withdrawals exceed total spending. The surplus either accumulates in HISA or is reinvested per your Surplus Order in the drawdown strategy. Sustained surpluses in retirement may indicate over-saving or under-spending relative to your portfolio size — a potential signal to revisit your spending plan or drawdown pace.</p>
            <p><strong>Red bars (shortfall)</strong> — Spending exceeds all income and configured withdrawals. This is not automatically covered — it represents a gap in the plan. Shortfall years show up in the Key Outcomes Spending tiles. Common causes: retirement before government benefits start, spending phases too high relative to income, or insufficient configured draws from investment accounts.</p>
            <p>The calculation: <em>Cash Flow = After-Tax Income (all sources + withdrawals) − Total Spending (lifestyle + contributions + unexpected expense)</em>. Adjusting the drawdown strategy — increasing withdrawal limits, changing the deficit order, or adding a spending gap draw — is the primary lever to eliminate red bars.</p>
          </div>
        }>
        <PlotlyChart
          data={cashFlowData}
          layout={{
            yaxis: { title: { text: 'Cash Flow ($)', font: { size: 11 } }, tickformat: ',.0f' },
            xaxis: { ...xAxisCashFlow },
          }}
          style={{ height: 280 }}
        />
        <XAxisSelector value={xAxisModeCashFlow} onChange={setXAxisModeCashFlow} aName={aName} bName={bName} />
      </SectionCard>

      <SectionCard title="Portfolio Balances" width="full"
        info={
          <div className="space-y-2 text-sm">
            <p>End-of-year investment account balances, stacked by account type and person. This is the most direct view of whether the plan is sustainable — a balance that reaches zero before the end of the horizon means the plan runs out of money.</p>
            <p><strong>RRSP/RRIF</strong> — Registered savings/retirement accounts. Pre-retirement: grows by contributions and returns. Post-retirement: converted to RRIF at 71 (the label stays RRSP/RRIF throughout), then subject to mandatory minimum annual withdrawals calculated by CRA age factors. At the first death, the deceased's RRIF rolls over tax-free to the surviving spouse's RRIF.</p>
            <p><strong>TFSA</strong> — Tax-free savings accounts. Withdrawals are not taxable and create re-contribution room the following year. At death, the TFSA rolls to the survivor's account tax-free.</p>
            <p><strong>Non-Reg</strong> — Non-registered investment accounts. Growth is taxable each year (as dividends or capital gains). Withdrawals trigger capital gains on the gain above adjusted cost base. At death, deemed disposition triggers a final capital gains tax — this is handled in the simulation.</p>
            <p><strong>HISA</strong> — High-interest savings account. Joint account treated as the household cash buffer. Earns interest (taxable) and serves as the primary surplus destination and deficit buffer depending on your drawdown configuration.</p>
            <p>Use the person filter to see each individual's portfolio trajectory. Use account type chips to isolate specific accounts — for example, turning off RRSP/RRIF shows how the tax-free and non-registered portions evolve independently.</p>
          </div>
        }
        onReset={() => { setXAxisModePortfolio('year'); setPortfolioPerson('both'); setEnabledPortfolioAccounts(new Set(ALL_PORTFOLIO_KEYS)) }}>
        {/* ── Portfolio filter bar ─────────────────────────────────────── */}
        <div className="flex items-center gap-1.5 flex-wrap mb-3">
          {([['both', 'Household'], ['A', aName], ['B', bName]] as [ChartPerson, string][]).map(([v, label]) => (
            <button key={v} onClick={() => setPortfolioPerson(v)}
              className={`px-2.5 py-1 rounded border text-sm transition-colors ${
                portfolioPerson === v ? 'text-white border-[#7B1515]' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
              }`}
              style={portfolioPerson === v ? { backgroundColor: '#7B1515' } : {}}
            >{label}</button>
          ))}
          <div className="w-px h-5 bg-slate-200 shrink-0 mx-1" />
          {PORTFOLIO_DEFS.map(acct => {
            const active = enabledPortfolioAccounts.has(acct.key)
            return (
              <button key={acct.key}
                onClick={() => setEnabledPortfolioAccounts(prev => {
                  const next = new Set(prev)
                  if (next.has(acct.key)) next.delete(acct.key)
                  else next.add(acct.key)
                  return next
                })}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-sm transition-colors ${
                  active ? 'text-white border-[#7B1515]' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400'
                }`}
                style={active ? { backgroundColor: '#7B1515' } : {}}>
                <span className="w-2 h-2 rounded-sm shrink-0"
                  style={{ backgroundColor: active ? 'rgba(255,255,255,0.65)' : acct.color }} />
                {acct.label}
              </button>
            )
          })}
          <div className="w-px h-5 bg-slate-200 shrink-0 mx-1" />
          <button onClick={() => setEnabledPortfolioAccounts(new Set(ALL_PORTFOLIO_KEYS))}
            className="px-2.5 py-1 rounded border text-sm bg-white text-slate-500 border-slate-200 hover:border-slate-400 transition-colors">
            All
          </button>
          <button onClick={() => setEnabledPortfolioAccounts(new Set())}
            className="px-2.5 py-1 rounded border text-sm bg-white text-slate-500 border-slate-200 hover:border-slate-400 transition-colors">
            None
          </button>
        </div>
        <PlotlyChart
          data={portfolioData}
          layout={{ barmode: 'stack', yaxis: { title: { text: 'Account Balance ($)', font: { size: 11 } }, tickformat: ',.0f' }, xaxis: { ...xAxisPortfolio } }}
          style={{ height: 320 }}
        />
        <XAxisSelector value={xAxisModePortfolio} onChange={setXAxisModePortfolio} aName={aName} bName={bName} />
        <ChartLegend data={portfolioData} />
      </SectionCard>

      {/* ── Annual Summary Table ───────────────────────────────────────────── */}
      <SectionCard title="Annual Summary Table" width="full"
        info={
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-semibold mb-1">Income Columns</p>
              <p>The collapsed Income view shows each person's <strong>taxable income</strong> — the total reported on their tax return. This includes employment income, DB pension, CPP, OAS, RRIF withdrawals, non-registered withdrawals (capital gains portion), pension split received, and any other taxable income. TFSA withdrawals are tax-free and not included here; they appear as their own columns when the Income section is expanded.</p>
              <p className="mt-1">When pension splitting is active, <strong>Split Paid</strong> shows the amount transferred away from {aName || 'Person A'} (displayed in parentheses as a reduction) and <strong>Split Rcvd</strong> shows the matching amount received by {bName || 'Person B'}. Together these reconcile each person's individual income sources to their Taxable total.</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Non-Reg Yield † (T-slip income)</p>
              <p>Eligible dividends and foreign income from a non-registered account are issued as T-slips each year and are taxable — but the distributions are reinvested rather than paid out as cash. These columns are shown in <em>italic/grey</em> to indicate they create a tax liability without contributing to spendable income. The yield stays inside the account and is already reflected in the portfolio balance.</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Tax Columns</p>
              <p>Shows combined federal and Ontario income tax for each person, plus OAS clawback where applicable. Tax is calculated on the full taxable income base including non-reg yield, even though that yield is not received as cash.</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Net Household Income</p>
              <p><strong>Net HH</strong> is the actual cash the household receives: after-tax income from all taxable sources, plus TFSA withdrawals and non-taxable other income, minus the non-reg yield (which stays in the account). This is the number compared against Spending to determine the annual surplus or shortfall.</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Cash Flow</p>
              <p><strong>Cash Flow = Net HH − Spending.</strong> A positive value means the household has a surplus that flows into savings; a negative value means spending exceeds income and the gap is covered by portfolio withdrawals or HISA. Persistent shortfalls will deplete the portfolio.</p>
            </div>
          </div>
        }
        headerRight={
          <button
            onClick={() => setShowPersonTint(v => !v)}
            title={showPersonTint ? 'Hide person colours' : 'Show person colours'}
            className={`flex items-center gap-1 px-2 py-0.5 rounded border text-xs transition-colors ${
              showPersonTint ? 'text-white border-[#7B1515]' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400'
            }`}
            style={showPersonTint ? { backgroundColor: '#7B1515' } : {}}
          >
            <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: showPersonTint ? 'rgba(255,255,255,0.65)' : hexTint(personA.color, 1) }} />
            <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: showPersonTint ? 'rgba(255,255,255,0.65)' : hexTint(personB.color, 1) }} />
          </button>
        }>
        <div className="overflow-x-auto">
          <table className="text-xs border-collapse">
            <thead>
              {/* Row 1 — group headers */}
              <tr style={{ backgroundColor: '#7B1515' }} className="text-white">
                {(['year', 'income', 'tax', 'spending', 'portfolio'] as TableGroupKey[]).map(key => {
                  const cols = { year: yearTableCols, income: incomeTableCols, tax: taxTableCols, spending: spendingTableCols, portfolio: portfolioTableCols }[key]
                  const open = expandedTableGroups.has(key)
                  const label = { year: 'Year', income: 'Income', tax: 'Tax', spending: 'Spending', portfolio: 'Portfolio' }[key]
                  const after: React.ReactNode = key === 'tax'
                    ? <th rowSpan={2} className="px-2 py-1.5 text-right font-bold border border-red-900 align-bottom whitespace-nowrap">Net HH</th>
                    : key === 'spending'
                    ? <th rowSpan={2} className="px-2 py-1.5 text-right font-bold border border-red-900 align-bottom whitespace-nowrap">Cash Flow</th>
                    : null
                  return (
                    <React.Fragment key={key}>
                      <th colSpan={cols.length} className="px-2 py-1 font-bold border border-red-900">
                        <div className="flex items-center justify-between gap-2">
                          <span>{label}</span>
                          <button onClick={() => toggleTableGroup(key)} title={open ? 'Collapse' : 'Expand'}
                            className="text-red-300 hover:text-white transition-colors text-[10px] leading-none font-mono">
                            {open ? '◀' : '▶'}
                          </button>
                        </div>
                      </th>
                      {after}
                    </React.Fragment>
                  )
                })}
              </tr>

              {/* Row 2 — sub-column labels */}
              <tr style={{ backgroundColor: '#6B1010' }} className="text-red-100">
                {yearTableCols.map(col => (
                  <th key={col.label} className={`px-2 py-1 font-bold border border-red-900 whitespace-nowrap ${col.className?.includes('text-left') ? 'text-left' : 'text-right'}`}>{col.label}</th>
                ))}
                {incomeTableCols.map(col => (
                  <th key={col.label} className={`px-2 py-1 text-right font-bold border border-red-900 whitespace-nowrap${col.tSlipOnly ? ' italic opacity-70' : ''}`}>{col.label}</th>
                ))}
                {taxTableCols.map(col => (
                  <th key={col.label} className="px-2 py-1 text-right font-bold border border-red-900 whitespace-nowrap">{col.label}</th>
                ))}
                {spendingTableCols.map(col => (
                  <th key={col.label} className="px-2 py-1 text-right font-bold border border-red-900 whitespace-nowrap">{col.label}</th>
                ))}
                {portfolioTableCols.map(col => (
                  <th key={col.label} className="px-2 py-1 text-right font-bold border border-red-900 whitespace-nowrap">{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataPoints.map((d, i) => (
                <tr key={d.year} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  {yearTableCols.map(col => (
                    <td key={col.label} className={`px-2 py-1 border border-slate-100 ${col.className ?? 'text-right'}`} style={colTint(col, i)}>
                      {col.format ? col.format(col.value(d), d) : fmtT(col.value(d))}
                    </td>
                  ))}
                  {incomeTableCols.map(col => (
                    <td key={col.label} className={`px-2 py-1 border border-slate-100 text-right${col.tSlipOnly ? ' italic text-slate-400' : col.splitPaid ? ' text-slate-400' : ''}`} style={colTint(col, i)}>
                      {col.splitPaid
                        ? (col.value(d) > 0 ? `(${fmt(col.value(d))})` : '—')
                        : fmtT(col.value(d))}
                    </td>
                  ))}
                  {taxTableCols.map(col => (
                    <td key={col.label} className={`px-2 py-1 border border-slate-100 text-right ${col.format ? 'text-slate-600' : 'text-red-600'}`} style={colTint(col, i)}>
                      {col.format ? col.format(col.value(d), d) : fmtT(col.value(d))}
                    </td>
                  ))}
                  <td className="px-2 py-1 border border-slate-100 text-right font-medium">{fmt(d.totalHouseholdNet)}</td>
                  {spendingTableCols.map(col => (
                    <td key={col.label} className="px-2 py-1 border border-slate-100 text-right" style={colTint(col, i)}>{fmtT(col.value(d))}</td>
                  ))}
                  <td className={`px-2 py-1 border border-slate-100 text-right font-medium ${flowColor(d.cashFlow)}`}>
                    {fmtFlow(d.cashFlow)}
                  </td>
                  {portfolioTableCols.map(col => (
                    <td key={col.label} className="px-2 py-1 border border-slate-100 text-right" style={colTint(col, i)}>{fmtT(col.value(d))}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {incomeOpen && (
          <p className="mt-2 text-xs text-slate-400 italic">
            † T-slip income — taxable but not received as cash; distributions stay in the non-registered account and are reflected in its balance.
          </p>
        )}
      </SectionCard>

    </div>


    {/* ── Metric Detail Modal ──────────────────────────────────────────────── */}
    {modalDef && <MetricDetailModal def={modalDef} onClose={() => setModalDef(null)} />}
    </>
  )
}

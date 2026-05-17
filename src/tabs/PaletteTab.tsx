import { PlotlyChart } from '../components/PlotlyChart'

// ─── Palette definition ───────────────────────────────────────────────────────
// Rule: hue = income/account type, shade = person (A darker, B lighter)
// Brand red #7B1515 is reserved for spending targets only.

export const CHART_COLORS = {
  employmentA:  '#1B3A6B',  // Navy (deep)
  employmentB:  '#4A7FAF',  // Navy (light)

  pensionA:     '#0B6E6E',  // Teal (deep)   — lifetime benefit
  pensionBridgeA: '#5AAEAE', // Teal (light)  — bridge benefit
  pensionB:     '#2AA8A8',  // Teal (mid)
  pensionBridgeB: '#88CCCC', // Teal (pale)

  cppA:         '#1A5C2E',  // Forest green (deep)
  cppB:         '#3A9455',  // Forest green (light)

  oasA:         '#4A6741',  // Olive (deep)
  oasB:         '#7DA06E',  // Olive (light)

  rrifA:        '#3A1F6B',  // Purple (deep)
  rrifB:        '#7057AA',  // Purple (light)

  tfsaA:        '#7A4E14',  // Amber (deep)
  tfsaB:        '#C07A2E',  // Amber (light)

  nonRegA:      '#3D4A52',  // Slate (deep)
  nonRegB:      '#7090A0',  // Slate (light)

  otherIncome:  '#6B4A2E',  // Warm tan (single, no person split needed)

  spending:     '#7B1515',  // Brand red — reserved for spending targets
}

const SWATCH_GROUPS = [
  {
    group: 'Employment',
    note: 'Income until retirement date',
    swatches: [
      { hex: CHART_COLORS.employmentA, label: 'Person A' },
      { hex: CHART_COLORS.employmentB, label: 'Person B' },
    ],
  },
  {
    group: 'Defined Benefit Pension',
    note: 'Lifetime benefit + bridge (lighter shade)',
    swatches: [
      { hex: CHART_COLORS.pensionA,      label: 'Person A — lifetime' },
      { hex: CHART_COLORS.pensionBridgeA, label: 'Person A — bridge' },
      { hex: CHART_COLORS.pensionB,      label: 'Person B — lifetime' },
      { hex: CHART_COLORS.pensionBridgeB, label: 'Person B — bridge' },
    ],
  },
  {
    group: 'CPP',
    note: 'Canada Pension Plan',
    swatches: [
      { hex: CHART_COLORS.cppA, label: 'Person A' },
      { hex: CHART_COLORS.cppB, label: 'Person B' },
    ],
  },
  {
    group: 'OAS',
    note: 'Old Age Security',
    swatches: [
      { hex: CHART_COLORS.oasA, label: 'Person A' },
      { hex: CHART_COLORS.oasB, label: 'Person B' },
    ],
  },
  {
    group: 'RRIF Withdrawals',
    note: 'Registered income',
    swatches: [
      { hex: CHART_COLORS.rrifA, label: 'Person A' },
      { hex: CHART_COLORS.rrifB, label: 'Person B' },
    ],
  },
  {
    group: 'TFSA Withdrawals',
    note: 'Tax-free income',
    swatches: [
      { hex: CHART_COLORS.tfsaA, label: 'Person A' },
      { hex: CHART_COLORS.tfsaB, label: 'Person B' },
    ],
  },
  {
    group: 'Non-Registered Withdrawals',
    note: 'Taxable portfolio',
    swatches: [
      { hex: CHART_COLORS.nonRegA, label: 'Person A' },
      { hex: CHART_COLORS.nonRegB, label: 'Person B' },
    ],
  },
  {
    group: 'Other Income',
    note: 'Rental, part-time, inheritance, etc.',
    swatches: [
      { hex: CHART_COLORS.otherIncome, label: 'All sources' },
    ],
  },
  {
    group: 'Reserved',
    note: 'Spending target — not an income source',
    swatches: [
      { hex: CHART_COLORS.spending, label: 'Household Spending Target' },
    ],
  },
]

// ─── Mock data ────────────────────────────────────────────────────────────────
const YEARS = Array.from({ length: 31 }, (_, i) => 2025 + i)

const empA      = YEARS.map(y => y < 2032 ? 95000 : 0)
const empB      = YEARS.map(y => y < 2034 ? 75000 : 0)
const pensA     = YEARS.map(y => y >= 2032 && y <= 2050 ? 42000 : 0)
const bridgeA   = YEARS.map(y => y >= 2032 && y < 2037  ? 12000 : 0)
const pensB     = YEARS.map(y => y >= 2034 && y <= 2052 ? 28000 : 0)
const bridgeB   = YEARS.map(y => y >= 2034 && y < 2039  ?  9000 : 0)
const cppA      = YEARS.map(y => y >= 2035 && y <= 2050 ? 14000 : 0)
const cppB      = YEARS.map(y => y >= 2037 && y <= 2052 ? 11000 : 0)
const oasA      = YEARS.map(y => y >= 2035 && y <= 2050 ?  9000 : 0)
const oasB      = YEARS.map(y => y >= 2037 && y <= 2052 ?  8500 : 0)
const rrifA     = YEARS.map(y => y >= 2043 ? Math.min((y - 2043) * 2000, 22000) : 0)
const rrifB     = YEARS.map(y => y >= 2043 ? Math.min((y - 2043) * 1500, 16000) : 0)
const tfsaA     = YEARS.map(y => y >= 2032 && y < 2043  ?  7000 : 0)
const tfsaB     = YEARS.map(y => y >= 2034 && y < 2043  ?  5000 : 0)
const nonRegA   = YEARS.map(y => y >= 2032 && y < 2040  ?  5000 : 0)
const nonRegB   = YEARS.map(y => y >= 2034 && y < 2040  ?  3500 : 0)
const other     = YEARS.map(y => y >= 2032 && y < 2036  ?  4000 : 0)
const spend     = YEARS.map(y => y >= 2032 ? 95000 : 0)

const chartData = [
  { x: YEARS, y: empA,    type: 'bar', name: 'A — Employment',        marker: { color: CHART_COLORS.employmentA } },
  { x: YEARS, y: empB,    type: 'bar', name: 'B — Employment',        marker: { color: CHART_COLORS.employmentB } },
  { x: YEARS, y: pensA,   type: 'bar', name: 'A — Pension',           marker: { color: CHART_COLORS.pensionA } },
  { x: YEARS, y: bridgeA, type: 'bar', name: 'A — Bridge',            marker: { color: CHART_COLORS.pensionBridgeA } },
  { x: YEARS, y: pensB,   type: 'bar', name: 'B — Pension',           marker: { color: CHART_COLORS.pensionB } },
  { x: YEARS, y: bridgeB, type: 'bar', name: 'B — Bridge',            marker: { color: CHART_COLORS.pensionBridgeB } },
  { x: YEARS, y: cppA,    type: 'bar', name: 'A — CPP',               marker: { color: CHART_COLORS.cppA } },
  { x: YEARS, y: cppB,    type: 'bar', name: 'B — CPP',               marker: { color: CHART_COLORS.cppB } },
  { x: YEARS, y: oasA,    type: 'bar', name: 'A — OAS',               marker: { color: CHART_COLORS.oasA } },
  { x: YEARS, y: oasB,    type: 'bar', name: 'B — OAS',               marker: { color: CHART_COLORS.oasB } },
  { x: YEARS, y: rrifA,   type: 'bar', name: 'A — RRIF',              marker: { color: CHART_COLORS.rrifA } },
  { x: YEARS, y: rrifB,   type: 'bar', name: 'B — RRIF',              marker: { color: CHART_COLORS.rrifB } },
  { x: YEARS, y: tfsaA,   type: 'bar', name: 'A — TFSA',              marker: { color: CHART_COLORS.tfsaA } },
  { x: YEARS, y: tfsaB,   type: 'bar', name: 'B — TFSA',              marker: { color: CHART_COLORS.tfsaB } },
  { x: YEARS, y: nonRegA, type: 'bar', name: 'A — Non-Reg',           marker: { color: CHART_COLORS.nonRegA } },
  { x: YEARS, y: nonRegB, type: 'bar', name: 'B — Non-Reg',           marker: { color: CHART_COLORS.nonRegB } },
  { x: YEARS, y: other,   type: 'bar', name: 'Other Income',          marker: { color: CHART_COLORS.otherIncome } },
  {
    x: YEARS, y: spend, type: 'scatter', mode: 'markers', name: 'Spending Target',
    marker: { color: CHART_COLORS.spending, size: 5, symbol: 'line-ew', line: { color: CHART_COLORS.spending, width: 2 } },
  },
]

// ─── Component ────────────────────────────────────────────────────────────────
export function PaletteTab() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4">

      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-1">Chart Colour Palette — Proposal</h2>
        <p className="text-sm text-slate-500 max-w-2xl">
          <strong>Rule:</strong> hue identifies the income or account type; shade identifies the person
          (darker = Person A, lighter = Person B). The brand red is reserved for the spending target only.
        </p>
      </div>

      {/* Swatches */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {SWATCH_GROUPS.map(group => (
          <div key={group.group} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className="mb-3">
              <div className="text-sm font-semibold text-slate-800">{group.group}</div>
              <div className="text-xs text-slate-400">{group.note}</div>
            </div>
            <div className="flex flex-wrap gap-2">
              {group.swatches.map(s => (
                <div key={s.hex} className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1.5">
                  <div className="w-7 h-7 rounded-md shadow-sm flex-shrink-0" style={{ backgroundColor: s.hex }} />
                  <div>
                    <div className="text-xs font-medium text-slate-700">{s.label}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{s.hex}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Sample chart */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="mb-1">
          <div className="text-sm font-semibold text-slate-700">Sample: Full Income Overview (mock data)</div>
          <div className="text-xs text-slate-400">
            A retires 2032 · B retires 2034 · CPP/OAS start 2035/2037 · RRIF minimums begin 2043
          </div>
        </div>
        <PlotlyChart
          data={chartData}
          layout={{
            barmode: 'stack',
            yaxis: { tickformat: '$,.0f', title: { text: "Annual income (today's $)", font: { size: 11 } } },
            xaxis: { title: { text: 'Year', font: { size: 11 } } },
            legend: { orientation: 'h', y: -0.3, font: { size: 10 } },
          }}
          style={{ height: 400 }}
        />
      </div>

    </div>
  )
}

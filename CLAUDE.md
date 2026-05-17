# Portage — Claude Code Instructions

## Project Overview
Interactive browser-based Canadian retirement planning tool for Ontario.
Single-file HTML output (Vite + vite-plugin-singlefile). All data stored locally.
All monetary output in present-day (today's) dollars.

---

## UI Design System

### Colours
- **Brand red (primary):** `#7B1515` — used for header, active tabs, buttons, focus rings
- **Brand red (hover):** `#6B1010`
- **Brand red (active/pressed):** `#5a0d0d`
- **Page background:** `#f2f3f5`

### Buttons
Three classes defined in `index.css`. All share the same sizing and 3D press effect (`active:translate-y-px active:shadow-none`):

| Class | Use | Colour |
|---|---|---|
| `btn-primary` | Additive actions (Add, Save) | Brand red `#7B1515` |
| `btn-danger` | Destructive actions (Remove, Reset) | Brand red `#7B1515` (same appearance) |
| `btn-secondary` | Neutral actions (Cancel) | White/slate |

- Always `text-sm font-semibold rounded shadow`
- Never use Tailwind colour utilities (e.g. `bg-red-600`) for buttons — use the classes above
- Icon-only buttons use the same class; text label is optional

### Form Fields
- `input-field`: slightly rounded (`rounded`), not `rounded-lg`
- `label-text`: `text-sm font-medium text-slate-500`
- Units belong in the label text, not as affix boxes — e.g. "Annual Amount ($)" or "Rate (%)"
- `NumberInput`: type="text" with `inputMode`, thousands-separated display via `toLocaleString`
- `ToggleInput`: active state uses brand red `#7B1515`, not Tailwind blue
- `SelectInput`: focus ring uses brand red

### Cards — SectionCard
Component: `src/components/SectionCard.tsx`

Props:
- `title` — always Proper Case, never ALL CAPS
- `width` — `"full"` | `"half"` | `"third"`
- `personColor?` — hex colour; tints card background at 6% opacity
- `info?` — ReactNode shown in the info modal (ⓘ button, top-right of card)
- `headerRight?` — slot for controls rendered between title and ⓘ button (e.g. axis selector)
- `onReset?` — when provided, shows a reset icon button; clicking opens a confirmation modal that resets only that card's fields to defaults

Card anatomy:
- Shadow (`shadow-md`, `hover:shadow-lg`), no coloured left bar
- Header: title left, optional headerRight, ⓘ info button, optional reset button
- Body: `px-5 pb-5`

### InfoPanel
Component: `src/components/InfoPanel.tsx`
- Amber-50 background, amber border, info SVG icon, `text-sm text-slate-700`
- Use for: calculated/derived values, important notes, policy context
- Never use raw `bg-amber-50` divs — always use `<InfoPanel>`

### SectionDivider
Component: `src/components/SectionDivider.tsx`
- Text: `text-sm font-semibold` in brand red `#7B1515`
- Line: `#6B1010`

---

## Table / Mini-Table Pattern

Used throughout for structured data entry. Consistent rules:

### Structure
```tsx
<div className="overflow-x-auto rounded border border-slate-200">
  <table className="w-full text-sm">
    <thead>
      {/* Title row (always present, even if redundant with card title) */}
      <tr className="bg-slate-50 border-b border-slate-200">
        <th colSpan={2} className="px-3 py-2 text-left font-medium text-slate-700">Group Title</th>
      </tr>
      {/* Column header row (when columns need labels) */}
      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
        <th className="px-3 py-2 text-left font-medium">Column A</th>
        <th className="px-3 py-2 font-medium">Column B</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-slate-100">
      <tr className="hover:bg-slate-50/50">
        <td className="px-3 py-2 text-slate-600 w-1/2">Field Name (unit)</td>
        <td className="px-2 py-1.5 w-1/2"><NumberInput label="" ... /></td>
      </tr>
    </tbody>
  </table>
</div>
```

### Rules
- **Always include the title row** — even when it repeats the card title, for visual consistency
- **Column headers** — add a second `<thead>` row when columns need labels (e.g. "Age", "Nominal %")
- **Units** — put units in the column header OR in the field name cell in parentheses, e.g. `Field Name (%)` or `Field Name ($)`. Never repeat units in both places
- **NumberInput inside table cells** — always use `label=""` when the column header or row label already conveys the field name
- **Grouping** — related fields go in the same mini-table. Use multiple side-by-side mini-tables within a full-width card for distinct groups (e.g. Eligible Dividends | Non-Eligible Dividends | Capital Gains)
- **Layout** — use `grid grid-cols-1 xl:grid-cols-3 gap-4` for three mini-tables in a full-width card

### When to use mini-tables vs grid inputs
- **Mini-tables:** homogeneous data (brackets, rates, structured parameters), or when grouping is important for readability
- **Grid inputs:** heterogeneous fields that don't share columns (e.g. name, date, toggle — all different types)

---

## Charts — PlotlyChart

Component: `src/components/PlotlyChart.tsx`

- `displayModeBar: false` — toolbar is always hidden
- Brand red `#7B1515` for primary data series
- `paper_bgcolor: 'transparent'`, `plot_bgcolor: '#f8fafc'`
- Font: `system-ui, sans-serif`, size 11, colour `#475569`

### X-Axis Selector
Component: `src/components/XAxisSelector.tsx`

- All charts with a time-based x-axis must include an `XAxisSelector`
- **Position: always below the chart**, never in `headerRight` or above
- Modes: `year` | `ageA` | `ageB`
- Labels use possessive: "James's Age", not "James Age"
- X-axis labels use Dec 31 of each year to determine age (so "the year you turn 65" is labelled 65)
- When one selector drives multiple charts in a tab, place it below the last chart

---

## Spending Engine

### Phase Growth Rate
- `growthRatePct` is a **real growth rate** (above inflation)
- 0% = constant purchasing power (flat line in today's dollars chart)
- Negative = spending declines in real terms within the phase (typical as activity slows)
- Positive = spending grows faster than inflation (lifestyle creep)
- Range: −10% to +20%

### AdditionalSpending
- Each item: `{ id, label, amount, startAge, recurring: boolean }`
- `startAge` references the **age reference person's** birthday
- Recurring: applied from startAge birthday onwards each year (today's $ inflated)
- One-time: applied in the calendar year of that birthday

### Spending Phase — Survivor
- Last phase only: `linkedToFirstDeath` toggle — sets startAge to reference person's age at first death
- `deathDate(birthDate, planningEndAge)` = day before (planningEndAge+1)th birthday

---

## Age & Date Conventions

- All dates stored as ISO strings (`YYYY-MM-DD`)
- Ages entered by user are always converted to dates internally
- `dateAtAge(birth, age)` → the Nth birthday
- `deathDate(birth, age)` → day before (N+1)th birthday (person is alive through entire Nth year)
- X-axis age labels use Dec 31 of each year, so the bar labelled "65" is the year the person turns 65

---

## Reset Pattern

Every `SectionCard` that contains user-editable data should have `onReset`:

```tsx
<SectionCard
  title="..."
  onReset={() => update('fieldName', DEFAULT_STATE.fieldName)}
>
```

For cards with multiple top-level fields, call `update('taxSettings', { ...s, field1: DEFAULT.field1, ... })` directly — do **not** use a nested helper like `update2('taxSettings', ...)` for multi-field resets.

For cards that are part of a nested object (e.g. `taxSettings`), import `DEFAULT_TAX_SETTINGS` from `defaults.ts`.

---

## Canadian Tax Rules (2024 base, CPI-indexed forward)

- Capital gains inclusion: **50%** for all gains as of 2025 (proposed 66.67% above $250k was cancelled Jan 2025)
- Default "high rate threshold" set to $10,000,000 to effectively disable two-tier logic while preserving the feature for scenario modelling
- OAS clawback: 15% above ~$90,997
- CPP: −0.6%/month before 65, +0.7%/month after 65
- OAS: +0.6%/month deferral past 65 (max +36% at 70)
- RRIF minimums: CRA table by age, in `tax.ts`

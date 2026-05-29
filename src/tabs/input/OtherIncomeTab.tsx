import { useMemo, useState } from 'react'
import { useStore } from '../../store/useStore'
import { CardGrid } from '../../components/CardGrid'
import { SectionCard } from '../../components/SectionCard'
import { NumberInput } from '../../components/NumberInput'
import { DateInput } from '../../components/DateInput'
import { ToggleInput } from '../../components/ToggleInput'
import { SelectInput } from '../../components/SelectInput'
import { PlotlyChart, withTotals } from '../../components/PlotlyChart'
import { XAxisSelector, XAxisMode, buildXAxis } from '../../components/XAxisSelector'
import { todayStr } from '../../engine/dates'
import { runProjection } from '../../engine/projection'
import type { OtherIncomeItem } from '../../engine/types'
import { CHART_COLORS } from '../PaletteTab'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Data = any

export function OtherIncomeTab() {
  const state = useStore()
  const { otherIncome, personA, personB, update } = state
  const o = otherIncome
  const today = todayStr()
  const aName = personA.name || 'Person A'
  const bName = personB.name || 'Person B'
  const [xAxisMode, setXAxisMode] = useState<XAxisMode>('year')

  const { dataPoints } = useMemo(() => runProjection(state), [state])
  const years = dataPoints.map(d => d.year)
  const otherA = dataPoints.map(d => d.otherIncomeA)
  const otherB = dataPoints.map(d => d.otherIncomeB)
  const maxOther = Math.max(0, ...otherA.map((a, i) => a + otherB[i]))
  const chartData: Data[] = [
    { x: years, y: otherA, name: aName, type: 'bar', marker: { color: CHART_COLORS.otherIncomeA } },
    { x: years, y: otherB, name: bName, type: 'bar', marker: { color: CHART_COLORS.otherIncomeB } },
  ]

  const attributedToOptions = [
    { value: 'personA', label: aName },
    { value: 'personB', label: bName },
    { value: 'joint',   label: 'Joint (50/50)' },
  ]

  function updateItems(items: OtherIncomeItem[]) {
    update('otherIncome', { ...o, otherItems: items })
  }

  function addItem() {
    const item: OtherIncomeItem = {
      id: crypto.randomUUID(),
      label: 'Income',
      annualAmount: 0,
      startDate: today,
      endDate: personA.retirementDate,
      taxable: true,
      growthRatePct: 0,
      attributedTo: 'personA',
    }
    updateItems([...o.otherItems, item])
  }

  function updateItem(id: string, updates: Partial<OtherIncomeItem>) {
    updateItems(o.otherItems.map(i => i.id === id ? { ...i, ...updates } : i))
  }

  function removeItem(id: string) {
    updateItems(o.otherItems.filter(i => i.id !== id))
  }

  const infoModal = (
    <div className="space-y-2 text-sm">
      <p>Add any income source not covered by employment, DB pension, CPP, or OAS. Income is entered in today's dollars and inflated forward. Use start and end dates to control exactly when each source is active — useful for income that doesn't align with retirement dates.</p>
      <p>Common examples: <strong>rental income</strong> (net of expenses, taxable), <strong>part-time consulting</strong> or self-employment after formal retirement, <strong>business income</strong>, <strong>inheritances or life insurance proceeds</strong> (non-taxable — the estate handles taxes on deemed dispositions), <strong>structured settlements</strong> or legal awards.</p>
      <p><strong>Attribution</strong> — Determines whose marginal tax rate applies for taxable items, which affects how much tax is paid. Person A and Person B are taxed independently at their own rates. Joint income is split 50/50. Rental income from jointly-owned property is typically split 50/50 regardless of who manages the property, unless your ownership ratio differs.</p>
      <p><strong>Taxable toggle</strong> — Turn off for receipts that are genuinely non-taxable (life insurance death benefits, inheritances). Non-taxable income also does not count toward income-tested thresholds like OAS clawback or the Age Amount phase-out.</p>
      <p><strong>Growth Rate</strong> — Real annual growth above inflation. Use 0% for constant purchasing power. Rental income might grow 1–2% real as rents tend to rise with the market over time.</p>
    </div>
  )

  return (
    <CardGrid>
      <SectionCard title="Other Income Items" width="full"
        onReset={() => updateItems([])}
        info={infoModal}>
        <div className="flex items-center justify-between mb-3">
          <button className="btn-primary" onClick={addItem}>+ Add Income</button>
        </div>

        {o.otherItems.length === 0 && (
          <p className="text-sm text-slate-400 italic">No income items added. Use this section for rental income, part-time work, business income, inheritances, life insurance proceeds, or any other income source.</p>
        )}

        {o.otherItems.map(item => (
          <div key={item.id} className="relative mb-3 p-3 pr-12 border border-slate-200 rounded bg-slate-50">
            <button className="btn-danger absolute top-2 right-2" onClick={() => removeItem(item.id)} aria-label="Remove">X</button>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-2 items-end">
              <div className="xl:col-span-2">
                <label className="label-text">Label</label>
                <input
                  className="input-field"
                  value={item.label}
                  onChange={e => updateItem(item.id, { label: e.target.value })}
                  placeholder="e.g. Rental — King St"
                />
              </div>
              <NumberInput
                label="Annual Amount"
                value={item.annualAmount}
                onChange={v => updateItem(item.id, { annualAmount: v })}
                prefix="$" min={0} step={500} decimals={0}
              />
              <NumberInput
                label="Growth Rate"
                value={item.growthRatePct}
                onChange={v => updateItem(item.id, { growthRatePct: v })}
                suffix="% / yr" min={-10} max={20} step={0.1} decimals={1} size="sm"
              />
              <ToggleInput
                label="Taxable"
                value={item.taxable}
                onChange={v => updateItem(item.id, { taxable: v })}
              />
              <SelectInput
                label="Attributed To"
                value={item.attributedTo}
                onChange={v => updateItem(item.id, { attributedTo: v as OtherIncomeItem['attributedTo'] })}
                options={attributedToOptions}
              />
              <DateInput
                label="Start Date"
                value={item.startDate}
                onChange={v => updateItem(item.id, { startDate: v })}
              />
              <DateInput
                label="End Date"
                value={item.endDate}
                onChange={v => updateItem(item.id, { endDate: v })}
              />
            </div>
          </div>
        ))}
      </SectionCard>

      <SectionCard title="Other Income" width="full"
        info={
          <div className="space-y-2 text-sm">
            <p>Annual other income by person. Each bar segment represents a different item attributed to that person — Joint items are split 50/50. Bars stop in the year each item's end date falls.</p>
            <p>Use this chart to confirm your income items are active in the right years and attributed to the right person. The combined total from both people feeds into the Dashboard simulation each year alongside employment, pension, CPP, and OAS income.</p>
          </div>
        }>
        <PlotlyChart
          data={withTotals(chartData)}
          layout={{
            barmode: 'stack',
            yaxis: { tickformat: ',.0f', title: { text: 'Annual Income ($)', font: { size: 11 } }, range: [0, maxOther > 0 ? maxOther * 1.05 : 50000] },
            xaxis: { ...buildXAxis(years, xAxisMode, personA.birthDate, personB.birthDate, personA.planningEndAge, personB.planningEndAge) },
          }}
          style={{ height: 280 }}
        />
        <XAxisSelector value={xAxisMode} onChange={setXAxisMode} aName={aName} bName={bName} />
      </SectionCard>
    </CardGrid>
  )
}

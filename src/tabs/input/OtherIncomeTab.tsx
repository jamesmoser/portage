import { useMemo, useState } from 'react'
import { useStore } from '../../store/useStore'
import { CardGrid } from '../../components/CardGrid'
import { SectionCard } from '../../components/SectionCard'
import { NumberInput } from '../../components/NumberInput'
import { DateInput } from '../../components/DateInput'
import { ToggleInput } from '../../components/ToggleInput'
import { SelectInput } from '../../components/SelectInput'
import { PlotlyChart } from '../../components/PlotlyChart'
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
    <div className="space-y-2">
      <p>Add any income source not covered by employment, pension, CPP, or OAS. All amounts are in today's dollars and inflated to the future year using the personal inflation rate.</p>
      <p><strong>Taxable:</strong> fully taxable at the recipient's marginal rate. Use for employment income, rental net income, business income, part-time work.</p>
      <p><strong>Non-taxable:</strong> received tax-free, no CRA reporting required. Use for life insurance death benefits or inheritances. The Canadian estate pays any taxes on deemed dispositions — the recipient receives the proceeds tax-free.</p>
      <p><strong>Attribution:</strong> determines whose marginal rate applies for taxable items. Joint income is split 50/50 between both persons. Rental income from jointly-held property should typically use Joint.</p>
      <p><strong>Growth Rate:</strong> how fast the income grows above inflation. 0% = constant purchasing power each year.</p>
      <p>All chart values are in today's dollars.</p>
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

      <SectionCard title="Other Income" width="full">
        <PlotlyChart
          data={chartData}
          layout={{
            barmode: 'stack',
            yaxis: { tickformat: ',.0f', title: { text: 'Annual Income ($)', font: { size: 11 } }, range: [0, maxOther > 0 ? maxOther * 1.05 : 50000] },
            xaxis: { ...buildXAxis(years, xAxisMode, personA.birthDate, personB.birthDate) },
          }}
          style={{ height: 280 }}
        />
        <XAxisSelector value={xAxisMode} onChange={setXAxisMode} aName={aName} bName={bName} />
      </SectionCard>
    </CardGrid>
  )
}

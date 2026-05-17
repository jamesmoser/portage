import { useStore } from '../../store/useStore'
import { CardGrid } from '../../components/CardGrid'
import { SectionCard } from '../../components/SectionCard'
import { InfoPanel } from '../../components/InfoPanel'
import { NumberInput } from '../../components/NumberInput'
import { DateInput } from '../../components/DateInput'
import { ToggleInput } from '../../components/ToggleInput'
import { todayStr } from '../../engine/dates'
import type { OtherIncomeItem } from '../../engine/types'
import { DEFAULT_STATE } from '../../engine/defaults'

export function OtherIncomeTab() {
  const { otherIncome, personA, personB, update } = useStore()
  const o = otherIncome
  const today = todayStr()

  function updateOther(updates: Partial<typeof otherIncome>) {
    update('otherIncome', { ...o, ...updates })
  }

  function addItem() {
    const item: OtherIncomeItem = {
      id: crypto.randomUUID(),
      label: 'Other Income',
      annualAmount: 0,
      startDate: today,
      endDate: personA.retirementDate,
      taxable: true,
      growthRatePct: 0,
    }
    updateOther({ otherItems: [...o.otherItems, item] })
  }

  function updateItem(id: string, updates: Partial<OtherIncomeItem>) {
    updateOther({ otherItems: o.otherItems.map(i => i.id === id ? { ...i, ...updates } : i) })
  }

  function removeItem(id: string) {
    updateOther({ otherItems: o.otherItems.filter(i => i.id !== id) })
  }

  return (
    <CardGrid>
      <SectionCard title="Rental Income" width="half"
        onReset={() => updateOther({ rentalGrossAnnual: 0, rentalExpensesAnnual: 0 })}>
        <div className="grid grid-cols-1 gap-3">
          <NumberInput
            label="Gross Annual Rental Income (today's $)"
            value={o.rentalGrossAnnual}
            onChange={v => updateOther({ rentalGrossAnnual: v })}
            prefix="$" min={0} step={1000} decimals={0}
          />
          <NumberInput
            label="Annual Rental Expenses (today's $)"
            value={o.rentalExpensesAnnual}
            onChange={v => updateOther({ rentalExpensesAnnual: v })}
            prefix="$" min={0} step={100} decimals={0}
            tooltip="Deductible expenses: property tax, insurance, maintenance, mortgage interest, depreciation"
          />
        </div>
        <div className="mt-3">
          <InfoPanel>
            Net annual rental income: <strong>${(o.rentalGrossAnnual - o.rentalExpensesAnnual).toLocaleString()}</strong> — taxed as income
          </InfoPanel>
        </div>
      </SectionCard>

      <SectionCard title="Business Income" width="half"
        onReset={() => updateOther({ businessIncome: 0, businessIncomeEndDate: personA.retirementDate })}>
        <div className="grid grid-cols-1 gap-3">
          <NumberInput
            label="Annual Business / Self-Employment Income (today's $)"
            value={o.businessIncome}
            onChange={v => updateOther({ businessIncome: v })}
            prefix="$" min={0} step={1000} decimals={0}
          />
          <DateInput
            label="Business Income End Date"
            value={o.businessIncomeEndDate}
            onChange={v => updateOther({ businessIncomeEndDate: v })}
            tooltip="Date business income ceases (e.g. business sale or winding down)"
          />
        </div>
      </SectionCard>

      <SectionCard title={`Part-Time Work — ${personA.name || 'Person A'}`} width="half" personColor={personA.color}
        onReset={() => updateOther({ partTimeA: { amount: 0, startDate: today, endDate: personA.retirementDate, growthRatePct: 0 } })}>
        <div className="grid grid-cols-2 gap-3">
          <NumberInput
            label="Annual Amount (today's $)"
            value={o.partTimeA.amount}
            onChange={v => updateOther({ partTimeA: { ...o.partTimeA, amount: v } })}
            prefix="$" min={0} step={500} decimals={0}
          />
          <NumberInput
            label="Annual Growth Rate"
            value={o.partTimeA.growthRatePct}
            onChange={v => updateOther({ partTimeA: { ...o.partTimeA, growthRatePct: v } })}
            suffix="% / year" min={0} max={20} step={0.1} decimals={1} size="sm"
          />
          <DateInput
            label="Start Date"
            value={o.partTimeA.startDate}
            onChange={v => updateOther({ partTimeA: { ...o.partTimeA, startDate: v } })}
          />
          <DateInput
            label="End Date"
            value={o.partTimeA.endDate}
            onChange={v => updateOther({ partTimeA: { ...o.partTimeA, endDate: v } })}
          />
        </div>
      </SectionCard>

      <SectionCard title={`Part-Time Work — ${personB.name || 'Person B'}`} width="half" personColor={personB.color}
        onReset={() => updateOther({ partTimeB: { amount: 0, startDate: today, endDate: personB.retirementDate, growthRatePct: 0 } })}>
        <div className="grid grid-cols-2 gap-3">
          <NumberInput
            label="Annual Amount (today's $)"
            value={o.partTimeB.amount}
            onChange={v => updateOther({ partTimeB: { ...o.partTimeB, amount: v } })}
            prefix="$" min={0} step={500} decimals={0}
          />
          <NumberInput
            label="Annual Growth Rate"
            value={o.partTimeB.growthRatePct}
            onChange={v => updateOther({ partTimeB: { ...o.partTimeB, growthRatePct: v } })}
            suffix="% / year" min={0} max={20} step={0.1} decimals={1} size="sm"
          />
          <DateInput
            label="Start Date"
            value={o.partTimeB.startDate}
            onChange={v => updateOther({ partTimeB: { ...o.partTimeB, startDate: v } })}
          />
          <DateInput
            label="End Date"
            value={o.partTimeB.endDate}
            onChange={v => updateOther({ partTimeB: { ...o.partTimeB, endDate: v } })}
          />
        </div>
      </SectionCard>

      <SectionCard title="Inheritance" width="half"
        onReset={() => updateOther({ inheritanceAmount: 0, inheritanceDate: today })}>
        <div className="grid grid-cols-2 gap-3">
          <NumberInput
            label="Expected Amount (today's $)"
            value={o.inheritanceAmount}
            onChange={v => updateOther({ inheritanceAmount: v })}
            prefix="$" min={0} step={10000} decimals={0}
            tooltip="Entered as today's dollars — the tool will inflate to the expected receipt date"
          />
          <DateInput
            label="Expected Receipt Date"
            value={o.inheritanceDate}
            onChange={v => updateOther({ inheritanceDate: v })}
          />
        </div>
      </SectionCard>

      <SectionCard title="Life Insurance Death Benefits" width="half"
        onReset={() => updateOther({ lifeInsuranceA: 0, lifeInsuranceB: 0 })}>
        <div className="grid grid-cols-2 gap-3">
          <NumberInput
            label={`${personA.name || 'Person A'} — Death Benefit`}
            value={o.lifeInsuranceA}
            onChange={v => updateOther({ lifeInsuranceA: v })}
            prefix="$" min={0} step={10000} decimals={0}
            tooltip={`Amount paid to the estate / surviving spouse on ${personA.name || 'Person A'}'s death. Not taxable.`}
          />
          <NumberInput
            label={`${personB.name || 'Person B'} — Death Benefit`}
            value={o.lifeInsuranceB}
            onChange={v => updateOther({ lifeInsuranceB: v })}
            prefix="$" min={0} step={10000} decimals={0}
          />
        </div>
      </SectionCard>

      <SectionCard title="Other Income Items" width="full">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-slate-500">Add any additional recurring or one-time income sources.</p>
          <button className="btn-primary" onClick={addItem}>+ Add Income</button>
        </div>

        {o.otherItems.length === 0 && (
          <p className="text-xs text-slate-400 italic">No additional income items added.</p>
        )}

        {o.otherItems.map(item => (
          <div key={item.id} className="mb-3 p-3 border border-slate-200 rounded bg-slate-50">
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-2">
              <div className="xl:col-span-2">
                <label className="label-text">Label</label>
                <input
                  className="input-field"
                  value={item.label}
                  onChange={e => updateItem(item.id, { label: e.target.value })}
                />
              </div>
              <NumberInput
                label="Annual Amount (today's $)"
                value={item.annualAmount}
                onChange={v => updateItem(item.id, { annualAmount: v })}
                prefix="$" min={0} step={500} decimals={0}
              />
              <NumberInput
                label="Growth Rate"
                value={item.growthRatePct}
                onChange={v => updateItem(item.id, { growthRatePct: v })}
                suffix="% / year" min={0} max={20} step={0.1} decimals={1} size="sm"
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
              <div className="flex items-end gap-3">
                <ToggleInput
                  label="Taxable"
                  value={item.taxable}
                  onChange={v => updateItem(item.id, { taxable: v })}
                />
              </div>
              <div className="flex items-end">
                <button className="btn-danger" onClick={() => removeItem(item.id)} aria-label="Remove">X</button>
              </div>
            </div>
          </div>
        ))}
      </SectionCard>
    </CardGrid>
  )
}

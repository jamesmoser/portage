import { useMemo, useState } from 'react'
import { useStore } from '../../store/useStore'
import { useShallow } from 'zustand/shallow'
import { CardGrid } from '../../components/CardGrid'
import { SectionCard } from '../../components/SectionCard'
import { NumberInput } from '../../components/NumberInput'
import { ToggleInput } from '../../components/ToggleInput'
import { PlotlyChart, withTotals } from '../../components/PlotlyChart'
import { XAxisSelector, buildXAxis } from '../../components/XAxisSelector'
import type { XAxisMode } from '../../components/XAxisSelector'
import { runProjection } from '../../engine/projection'
import type { AdditionalSpending, SpendingPhase } from '../../engine/types'
import { DEFAULT_STATE } from '../../engine/defaults'
import { exactAgeAt, dateAtDecimalAge } from '../../engine/dates'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Data = any

function firstDeathAge(personA: { birthDate: string; planningEndAge: number }, personB: { birthDate: string; planningEndAge: number }, refPerson: { birthDate: string }): number {
  const deathA = dateAtDecimalAge(personA.birthDate, personA.planningEndAge)
  const deathB = dateAtDecimalAge(personB.birthDate, personB.planningEndAge)
  const firstDeath = deathA < deathB ? deathA : deathB
  return Math.round(exactAgeAt(refPerson.birthDate, firstDeath) * 10) / 10
}

export function SpendingTab() {
  const state = useStore()
  const { spendingPhases, additionalSpending, personA, personB, ageReferencePerson, update } = useStore(
    useShallow(s => ({
      spendingPhases: s.spendingPhases,
      additionalSpending: s.additionalSpending,
      personA: s.personA,
      personB: s.personB,
      ageReferencePerson: s.ageReferencePerson,
      update: s.update,
    }))
  )
  const refPerson = ageReferencePerson === 'personB' ? personB : personA
  const refName = refPerson.name || (ageReferencePerson === 'personB' ? 'Person B' : 'Person A')

  function updatePhase(id: string, updates: Partial<SpendingPhase>) {
    update('spendingPhases', spendingPhases.map(p => {
      if (p.id !== id) return p
      const merged = { ...p, ...updates }
      if (merged.linkedToFirstDeath) {
        merged.startAge = firstDeathAge(personA, personB, refPerson)
      }
      return merged
    }))
  }

  function addItem() {
    const item: AdditionalSpending = {
      id: crypto.randomUUID(),
      label: 'Additional Spending',
      amount: 0,
      startAge: 65,
      recurring: true,
    }
    update('additionalSpending', [...additionalSpending, item])
  }

  function updateItem(id: string, updates: Partial<AdditionalSpending>) {
    update('additionalSpending', additionalSpending.map(i => i.id === id ? { ...i, ...updates } : i))
  }

  function removeItem(id: string) {
    update('additionalSpending', additionalSpending.filter(i => i.id !== id))
  }

  const deathA = dateAtDecimalAge(personA.birthDate, personA.planningEndAge)
  const deathB = dateAtDecimalAge(personB.birthDate, personB.planningEndAge)
  const firstToDisName = deathA <= deathB ? (personA.name || 'Person A') : (personB.name || 'Person B')
  const computedSurvivorAge = firstDeathAge(personA, personB, refPerson)

  const { dataPoints } = useMemo(() => runProjection(state), [state])
  const [xAxisMode, setXAxisMode] = useState<XAxisMode>('year')
  const years = dataPoints.map(d => d.year)
  const xAxis = buildXAxis(years, xAxisMode, personA.birthDate, personB.birthDate, personA.planningEndAge, personB.planningEndAge)
  const chartData: Data[] = [
    { x: years, y: dataPoints.map(d => d.spendingLifestyle),  name: 'Lifestyle',          type: 'bar', marker: { color: '#7B1515' } },
    { x: years, y: dataPoints.map(d => d.contributions),      name: 'Contributions',      type: 'bar', marker: { color: '#3b82f6' } },
    { x: years, y: dataPoints.map(d => d.spendingUnexpected), name: 'Unexpected Expense', type: 'bar', marker: { color: '#f59e0b' } },
  ]

  return (
    <CardGrid>
      <SectionCard title="Spending Phases" width="full"
        onReset={() => update('spendingPhases', DEFAULT_STATE.spendingPhases)}
        info={
          <div className="space-y-2 text-sm">
            <p>Spending phases define your household lifestyle costs for each period of retirement. The engine applies the phase whose start age ({refName}'s age) has been reached, switching phases mid-year on the exact birthday. Enter annual amounts in today's dollars — the engine inflates them forward automatically.</p>
            <p>A typical framework:</p>
            <ul className="ml-3 list-disc list-outside space-y-0.5">
              <li><strong>Pre-Retirement</strong> — Current lifestyle while still working. Usually the highest spending period if you have a mortgage or children at home.</li>
              <li><strong>Go-Go Years</strong> — Active early retirement: travel, activities, bucket list. Often the most expensive retirement phase.</li>
              <li><strong>Slow-Go Years</strong> — Home-centred, local activities. Spending naturally declines from the Go-Go peak.</li>
              <li><strong>No-Go Years</strong> — Less travel; potential healthcare cost increases. Modest overall spending.</li>
              <li><strong>Survivor</strong> — One person remaining. Fixed costs (housing, utilities) don't drop in half — budget at roughly 60–70% of couple spending.</li>
            </ul>
            <p><strong>Real Growth Rate</strong> — How fast spending changes in real terms within the phase, independent of inflation. Use 0% to hold constant purchasing power, a negative value for phases where activity naturally slows (e.g. −1% in No-Go years), or a positive value for lifestyle creep.</p>
            <p>The last phase has a <strong>Survivor Phase</strong> toggle. When enabled, that phase takes over for the remainder of the plan from the moment the first person dies — the start age is determined automatically from the planning end ages and cannot be edited. When disabled, the phase behaves like any other and starts at its configured age.</p>
          </div>
        }>

        {spendingPhases.map((phase, i) => {
          const isLastPhase = i === spendingPhases.length - 1
          const linked = phase.linkedToFirstDeath ?? false
          return (
            <div key={phase.id} className="mb-3 p-3 border border-slate-200 rounded bg-slate-50">
              {isLastPhase && (
                <div className="mb-2">
                  <ToggleInput
                    label={`Survivor Phase — starts at ${firstToDisName}'s death`}
                    value={linked}
                    onChange={v => updatePhase(phase.id, { linkedToFirstDeath: v })}
                  />
                </div>
              )}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-2 items-end">
                <div>
                  <label className="label-text">Phase</label>
                  <input
                    className="input-field"
                    value={phase.label}
                    onChange={e => updatePhase(phase.id, { label: e.target.value })}
                    disabled={isLastPhase}
                  />
                </div>
                {!isLastPhase && (
                  <NumberInput
                    label={`Starts (${refName}'s Age)`}
                    value={phase.startAge}
                    onChange={v => updatePhase(phase.id, { startAge: v })}
                    min={40} max={100} step={0.5} decimals={1} size="sm"
                    tooltip="55.0 = 55th birthday · 55.5 = 6 months after 55th birthday"
                  />
                )}
                {isLastPhase && <div />}
                <div className={isLastPhase && !linked ? 'opacity-40 pointer-events-none' : ''}>
                  <NumberInput
                    label="Annual Spending"
                    value={phase.annualAmount}
                    onChange={v => updatePhase(phase.id, { annualAmount: v })}
                    prefix="$" min={0} step={1000} decimals={0}
                  />
                </div>
                <div className={isLastPhase && !linked ? 'opacity-40 pointer-events-none' : ''}>
                  <NumberInput
                    label="Real Growth Rate"
                    value={phase.growthRatePct}
                    onChange={v => updatePhase(phase.id, { growthRatePct: v })}
                    suffix="%" min={-10} max={20} step={0.1} decimals={1} size="sm"
                    tooltip="Real spending growth above inflation within this phase. 0% = constant purchasing power. Negative = spending declines in real terms over time (typical as activity slows). Positive = lifestyle creep."
                  />
                </div>
              </div>
            </div>
          )
        })}
      </SectionCard>

      <SectionCard title="Additional Spending" width="full"
        onReset={() => update('additionalSpending', DEFAULT_STATE.additionalSpending)}
        info={
          <div className="space-y-2 text-sm">
            <p>Model spending that doesn't fit the phase structure — items that start or stop at a specific age, or one-time purchases layered on top of the base phase amount.</p>
            <p><strong>Recurring</strong> — Added to spending every year from the specified age onwards. Examples: private health insurance starting at 65, annual travel budget on top of your base phase, healthcare cost escalation in your 80s, club memberships.</p>
            <p><strong>One-time</strong> — A single expense in the calendar year of the reference person's specified birthday. Examples: new vehicle, home renovation, helping a child with a down payment, a once-in-a-lifetime trip.</p>
            <p>All amounts are entered in today's dollars and inflated forward. Age references use the age reference person set in the Household tab.</p>
          </div>
        }>
        <div className="mb-3">
          <button className="btn-primary" onClick={addItem}>+ Add</button>
        </div>

        {additionalSpending.length === 0 && (
          <p className="text-sm text-slate-400 italic">No additional spending items entered.</p>
        )}

        {additionalSpending.map(item => (
          <div key={item.id} className="relative mb-2 p-3 pr-12 border border-slate-200 rounded bg-slate-50">
            <button
              onClick={() => removeItem(item.id)}
              className="btn-danger absolute top-2 right-2"
              aria-label="Remove"
            >
              X
            </button>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-2 items-end">
              <div>
                <label className="label-text">Label</label>
                <input
                  className="input-field"
                  value={item.label}
                  onChange={e => updateItem(item.id, { label: e.target.value })}
                  placeholder="e.g. Healthcare escalation"
                />
              </div>
              <NumberInput
                label="Amount"
                value={item.amount}
                onChange={v => updateItem(item.id, { amount: v })}
                prefix="$" min={0} step={500} decimals={0}
              />
              <NumberInput
                label={`${refName}'s Age`}
                value={item.startAge}
                onChange={v => updateItem(item.id, { startAge: v })}
                min={40} max={110} step={0.5} decimals={1} size="sm"
                tooltip={`Converts to: ${dateAtDecimalAge(refPerson.birthDate, item.startAge)}`}
              />
              <ToggleInput
                label={item.recurring ? 'Recurring' : 'One-time'}
                value={item.recurring}
                onChange={v => updateItem(item.id, { recurring: v })}
                className="self-end pb-1"
              />
            </div>
          </div>
        ))}
      </SectionCard>
      <SectionCard title="Spending by Year" width="full"
        info={
          <div className="space-y-2 text-sm">
            <p>Total projected household spending per year, combining all active spending phases and additional items. Use this chart to verify that phase transitions, recurring items, and one-time expenses are landing in the right years.</p>
            <p>Phase switches are visible as step changes in the bar heights. One-time expenses appear as a single taller bar in the year they occur. Recurring additional items appear as a sustained increase from their start age onwards.</p>
            <p>This chart feeds directly into the Dashboard simulation — the Dashboard uses exactly these spending values to calculate how much needs to be drawn from income and investment accounts each year.</p>
          </div>
        }>
        <PlotlyChart
          data={withTotals(chartData)}
          layout={{
            xaxis: xAxis,
            yaxis: { tickformat: ',.0f', title: { text: 'Annual Household Spending ($)', font: { size: 11 } } },
            barmode: 'stack',
          }}
          style={{ height: 280 }}
        />
        <XAxisSelector value={xAxisMode} onChange={v => setXAxisMode(v as XAxisMode)} aName={personA.name || 'Person A'} bName={personB.name || 'Person B'} />
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 pt-2 pb-1">
          {chartData.filter(s => s.y.some((v: number) => v > 0.01)).map((s: Data, i: number) => (
            <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-500">
              <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: s.marker.color }} />
              {s.name}
            </div>
          ))}
        </div>
      </SectionCard>
    </CardGrid>
  )
}

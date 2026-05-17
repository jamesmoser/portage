import { useMemo, useState } from 'react'
import { useStore } from '../../store/useStore'
import { useShallow } from 'zustand/shallow'
import { CardGrid } from '../../components/CardGrid'
import { SectionCard } from '../../components/SectionCard'
import { NumberInput } from '../../components/NumberInput'
import { ToggleInput } from '../../components/ToggleInput'
import { PlotlyChart } from '../../components/PlotlyChart'
import { XAxisSelector, buildXAxis } from '../../components/XAxisSelector'
import type { XAxisMode } from '../../components/XAxisSelector'
import { runProjection } from '../../engine/projection'
import type { AdditionalSpending, SpendingPhase } from '../../engine/types'
import { DEFAULT_STATE } from '../../engine/defaults'
import { exactAgeAt, deathDate, dateAtAge } from '../../engine/dates'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Data = any

function firstDeathAge(personA: { birthDate: string; planningEndAge: number }, personB: { birthDate: string; planningEndAge: number }, refPerson: { birthDate: string }): number {
  const deathA = deathDate(personA.birthDate, personA.planningEndAge)
  const deathB = deathDate(personB.birthDate, personB.planningEndAge)
  const firstDeath = deathA < deathB ? deathA : deathB
  return Math.floor(exactAgeAt(refPerson.birthDate, firstDeath))
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

  const deathA = deathDate(personA.birthDate, personA.planningEndAge)
  const deathB = deathDate(personB.birthDate, personB.planningEndAge)
  const firstToDisName = deathA <= deathB ? (personA.name || 'Person A') : (personB.name || 'Person B')
  const computedSurvivorAge = firstDeathAge(personA, personB, refPerson)

  const { dataPoints } = useMemo(() => runProjection(state), [state])
  const [xAxisMode, setXAxisMode] = useState<XAxisMode>('year')
  const years = dataPoints.map(d => d.year)
  const xAxis = buildXAxis(years, xAxisMode, personA.birthDate, personB.birthDate, personA.planningEndAge, personB.planningEndAge)
  const chartData: Data[] = [
    {
      x: years, y: dataPoints.map(d => d.householdSpending),
      name: 'Household Spending', type: 'bar',
      marker: { color: '#7B1515' },
      xaxis: xAxis,
    },
  ]

  return (
    <CardGrid>
      <SectionCard title="Spending Phases" width="full"
        onReset={() => update('spendingPhases', DEFAULT_STATE.spendingPhases)}
        info={
          <div className="space-y-2">
            <p>Define household spending for each life phase in today's dollars. The engine applies the phase whose start age ({refName}'s age) has been reached.</p>
            <p>Common framework: Go-Go (active travel), Slow-Go (home-focused), No-Go (care costs), Survivor (one person remaining).</p>
            <p>Start ages are converted to the reference person's birthday on that date. The Survivor phase can be linked to the first death automatically.</p>
            <p><strong>Real Growth Rate:</strong> how fast spending grows above inflation. At 0%, spending maintains constant purchasing power — the chart shows a flat line in today's dollars, but the plan requires increasing nominal dollars each year to keep pace with inflation. A positive rate means real spending grows (e.g. 1% = lifestyle creep).</p>
          </div>
        }>

        {spendingPhases.map((phase, i) => {
          const linked = phase.linkedToFirstDeath ?? false
          return (
            <div key={phase.id} className="mb-3 p-3 border border-slate-200 rounded bg-slate-50">
              {i === spendingPhases.length - 1 && (
                <div className="mb-2">
                  <ToggleInput
                    label={`Start at First to Die (${firstToDisName})`}
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
                  />
                </div>
                <NumberInput
                  label={`Starts (${refName}'s Age)`}
                  value={linked ? computedSurvivorAge : phase.startAge}
                  onChange={v => updatePhase(phase.id, { startAge: v })}
                  min={40} max={100} step={1} decimals={0} size="sm"
                  disabled={linked}
                  tooltip={linked ? "Automatically set to reference person's age at first death" : ''}
                />
                <NumberInput
                  label="Annual Spending"
                  value={phase.annualAmount}
                  onChange={v => updatePhase(phase.id, { annualAmount: v })}
                  prefix="$" min={0} step={1000} decimals={0}
                />
                <NumberInput
                  label="Real Growth Rate"
                  value={phase.growthRatePct}
                  onChange={v => updatePhase(phase.id, { growthRatePct: v })}
                  suffix="%" min={-10} max={20} step={0.1} decimals={1} size="sm"
                  tooltip="Real spending growth above inflation within this phase. 0% = constant purchasing power. Negative = spending declines in real terms over time (typical as activity slows). Positive = lifestyle creep."
                />
              </div>
            </div>
          )
        })}
      </SectionCard>

      <SectionCard title="Additional Spending" width="full"
        onReset={() => update('additionalSpending', DEFAULT_STATE.additionalSpending)}
        info={
          <div className="space-y-2">
            <p>Model any spending above the base phase amount — healthcare escalation, memberships, hobbies, one-time purchases, etc.</p>
            <p><strong>Recurring:</strong> added to spending every year from the specified age onwards, in today's dollars inflated to the future year.</p>
            <p><strong>One-time:</strong> a single expense occurring in the calendar year of the reference person's specified birthday.</p>
            <p>All amounts are in today's dollars and are inflated using the personal inflation rate.</p>
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
                min={40} max={110} step={1} decimals={0} size="sm"
                tooltip={`Converts to ${refName}'s birthday at this age: ${dateAtAge(refPerson.birthDate, item.startAge)}`}
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
        info="Total household spending per year in today's dollars, including phase base amounts (with growth) and any additional spending items. Use this to verify recurring and one-time items are applying as expected.">
        <PlotlyChart
          data={chartData}
          layout={{
            xaxis: xAxis,
            yaxis: { tickformat: ',.0f', title: { text: 'Annual Household Spending ($)', font: { size: 11 } } },
            barmode: 'stack',
            height: 280,
          }}
        />
        <XAxisSelector value={xAxisMode} onChange={v => setXAxisMode(v as XAxisMode)} aName={personA.name || 'Person A'} bName={personB.name || 'Person B'} />
      </SectionCard>
    </CardGrid>
  )
}
